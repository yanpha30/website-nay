<?php
session_start();
require_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET: Cek status session login aktif
if ($method === 'GET') {
    if (!empty($_SESSION['user'])) {
        json_response(['status' => 'ok', 'authenticated' => true, 'user' => $_SESSION['user']]);
    }
    json_response(['status' => 'ok', 'authenticated' => false, 'user' => null]);
}

// POST: Login atau Logout
if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true) ?? [];

    if (($body['action'] ?? '') === 'logout') {
        $_SESSION = [];
        session_destroy();
        json_response(['status' => 'ok', 'message' => 'Berhasil logout']);
    }

    $email = trim((string)($body['email'] ?? ''));
    $password = (string)($body['password'] ?? '');

    if ($email === '' || $password === '') {
        json_response(['status' => 'error', 'error' => 'Email dan password wajib diisi'], 400);
    }

    $pdo = get_pdo();
    $stmt = $pdo->prepare('SELECT id_user, nama, email, password_hash, role FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    $validPassword = $user && (
        password_verify($password, $user['password_hash']) ||
        hash_equals($user['password_hash'], hash('sha256', $password))
    );
    if (!$validPassword) {
        json_response(['status' => 'error', 'error' => 'Email atau password salah'], 401);
    }

    $_SESSION['user'] = [
        'id_user' => (int)$user['id_user'],
        'nama'    => $user['nama'],
        'email'   => $user['email'],
        'role'    => $user['role'],
    ];

    json_response([
        'status' => 'ok',
        'message' => 'Login berhasil',
        'user' => $_SESSION['user'],
    ]);
}

json_response(['status' => 'error', 'error' => 'Method tidak diizinkan'], 405);
