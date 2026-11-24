<?php
session_start();
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = get_pdo();

// GET: Ambil 12 slot + ringkasan (+ opsional riwayat log)
if ($method === 'GET') {
    $slots = $pdo->query('SELECT id_slot, nomor_slot, status, updated_at FROM slot_parkir ORDER BY nomor_slot ASC')->fetchAll();

    $summary = [
        'total'       => count($slots),
        'kosong'      => 0,
        'terisi'      => 0,
        'maintenance' => 0,
    ];
    foreach ($slots as $s) {
        if (isset($summary[$s['status']])) {
            $summary[$s['status']]++;
        }
    }

    $response = [
        'status'      => 'ok',
        'server_time' => date('c'),
        'summary'     => $summary,
        'slots'       => $slots,
    ];

    if (isset($_GET['with_logs']) && $_GET['with_logs'] === '1') {
        $where = [];
        $params = [];

        if (!empty($_GET['slot'])) {
            $where[] = 's.nomor_slot = ?';
            $params[] = trim((string)$_GET['slot']);
        }
        if (!empty($_GET['sumber']) && in_array($_GET['sumber'], ['simulator', 'admin'], true)) {
            $where[] = 'l.sumber = ?';
            $params[] = $_GET['sumber'];
        }

        $sql = 'SELECT l.id_log, s.nomor_slot, l.status_lama, l.status_baru, l.sumber, l.device_id, l.created_at
                FROM log_status_slot l
                JOIN slot_parkir s ON s.id_slot = l.id_slot';
        if ($where) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }
        $sql .= ' ORDER BY l.id_log DESC LIMIT 100';

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $response['logs'] = $stmt->fetchAll();
    }

    json_response($response);
}

// POST: Toggle status maintenance oleh Admin / Petugas
if ($method === 'POST') {
    if (empty($_SESSION['user'])) {
        json_response(['status' => 'error', 'error' => 'Akses ditolak. Silakan login terlebih dahulu.'], 401);
    }

    $body = json_decode(file_get_contents('php://input'), true) ?? [];
    $nomor = strtoupper(trim((string)($body['nomor_slot'] ?? '')));
    $statusBaru = trim((string)($body['status'] ?? ''));

    // Admin hanya boleh mengunci (maintenance) atau mengaktifkan kembali (kosong)
    if ($nomor === '' || !in_array($statusBaru, ['maintenance', 'kosong'], true)) {
        json_response(['status' => 'error', 'error' => 'Parameter nomor_slot atau status tidak valid (hanya maintenance / kosong).'], 400);
    }

    $stmt = $pdo->prepare('SELECT id_slot, status FROM slot_parkir WHERE nomor_slot = ? LIMIT 1');
    $stmt->execute([$nomor]);
    $slot = $stmt->fetch();

    if (!$slot) {
        json_response(['status' => 'error', 'error' => 'Slot tidak ditemukan'], 404);
    }

    if ($slot['status'] !== $statusBaru) {
        $pdo->beginTransaction();
        try {
            $pdo->prepare('UPDATE slot_parkir SET status = ? WHERE id_slot = ?')
                ->execute([$statusBaru, $slot['id_slot']]);
            $pdo->prepare('INSERT INTO log_status_slot (id_slot, status_lama, status_baru, sumber, device_id) VALUES (?, ?, ?, ?, ?)')
                ->execute([
                    $slot['id_slot'],
                    $slot['status'],
                    $statusBaru,
                    'admin',
                    $_SESSION['user']['email'],
                ]);
            $pdo->commit();
        } catch (Throwable $e) {
            $pdo->rollBack();
            json_response(['status' => 'error', 'error' => 'Gagal memperbarui status slot'], 500);
        }
    }

    json_response([
        'status'     => 'ok',
        'nomor_slot' => $nomor,
        'state'      => $statusBaru,
        'message'    => "Slot {$nomor} berhasil diubah ke {$statusBaru}",
    ]);
}

json_response(['status' => 'error', 'error' => 'Method tidak diizinkan'], 405);
