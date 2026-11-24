<?php
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['status' => 'error', 'error' => 'Gunakan method POST'], 405);
}

$key = $_SERVER['HTTP_X_DEVICE_KEY'] ?? '';
if ($key !== DEVICE_KEY) {
    json_response(['status' => 'error', 'error' => 'Unauthorized simulator key'], 401);
}

$body = json_decode(file_get_contents('php://input'), true) ?? [];
$nomor = strtoupper(trim((string)($body['nomor_slot'] ?? '')));
$statusBaru = trim((string)($body['status'] ?? ''));
$deviceId = trim((string)($body['device_id'] ?? 'SIM-WEB-01'));

if ($nomor === '' || !in_array($statusBaru, ['kosong', 'terisi'], true)) {
    json_response(['status' => 'error', 'error' => 'Payload simulasi tidak valid (status harus kosong/terisi)'], 400);
}

$pdo = get_pdo();
$stmt = $pdo->prepare('SELECT id_slot, status FROM slot_parkir WHERE nomor_slot = ? LIMIT 1');
$stmt->execute([$nomor]);
$slot = $stmt->fetch();

if (!$slot) {
    json_response(['status' => 'error', 'error' => "Slot {$nomor} tidak ditemukan"], 404);
}

// Proteksi Maintenance: event simulator diabaikan otomatis saat slot dikunci
if ($slot['status'] === 'maintenance') {
    json_response([
        'status'     => 'ignored',
        'nomor_slot' => $nomor,
        'state'      => 'maintenance',
        'reason'     => 'Slot sedang dalam status maintenance',
    ]);
}

$updated = false;
if ($slot['status'] !== $statusBaru) {
    $pdo->beginTransaction();
    try {
        $pdo->prepare('UPDATE slot_parkir SET status = ? WHERE id_slot = ?')
            ->execute([$statusBaru, $slot['id_slot']]);
        $pdo->prepare('INSERT INTO log_status_slot (id_slot, status_lama, status_baru, sumber, device_id) VALUES (?, ?, ?, ?, ?)')
            ->execute([$slot['id_slot'], $slot['status'], $statusBaru, 'simulator', $deviceId]);
        $pdo->commit();
        $updated = true;
    } catch (Throwable $e) {
        $pdo->rollBack();
        json_response(['status' => 'error', 'error' => 'Gagal menyimpan event simulasi'], 500);
    }
}

json_response([
    'status'     => 'ok',
    'nomor_slot' => $nomor,
    'state'      => $statusBaru,
    'updated'    => $updated,
]);
