# Kerangka Dasar Implementasi — Digital Twin Smart Parking (`NAY_729`)

Dokumen ini memuat struktur direktori kode serta *boilerplate* siap pakai untuk tahap implementasi (Sprint 3): skema database 3 tabel, konfigurasi PHP 8, endpoint `api/sensor.php` & `api/slots.php`, skrip *polling* frontend, dan kerangka firmware ESP32.

## 1. Struktur Folder Implementasi

```text
app/
├── database/
│   └── database.sql
├── backend/
│   ├── config.php
│   ├── db.php
│   └── api/
│       ├── login.php
│       ├── slots.php
│       └── sensor.php
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   ├── riwayat.html
│   ├── css/style.css
│   └── js/app.js
└── hardware/
    └── firmware_esp32.ino
```

## 2. Database (`database/database.sql`)

```sql
CREATE DATABASE IF NOT EXISTS smart_parking_nay729;
USE smart_parking_nay729;

CREATE TABLE users (
  id_user INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'petugas') NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE slot_parkir (
  id_slot INT AUTO_INCREMENT PRIMARY KEY,
  nomor_slot VARCHAR(10) NOT NULL UNIQUE,
  status ENUM('kosong', 'terisi', 'maintenance') NOT NULL DEFAULT 'kosong',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE log_status_slot (
  id_log INT AUTO_INCREMENT PRIMARY KEY,
  id_slot INT NOT NULL,
  status_lama VARCHAR(20) NOT NULL,
  status_baru VARCHAR(20) NOT NULL,
  sumber ENUM('sensor', 'admin', 'simulator') NOT NULL,
  device_id VARCHAR(50) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_slot) REFERENCES slot_parkir(id_slot) ON DELETE CASCADE
);

-- Seed 12 slot parkir (P01 - P12)
INSERT INTO slot_parkir (nomor_slot, status) VALUES
('P01','kosong'),('P02','kosong'),('P03','kosong'),('P04','kosong'),
('P05','kosong'),('P06','kosong'),('P07','kosong'),('P08','kosong'),
('P09','kosong'),('P10','kosong'),('P11','kosong'),('P12','kosong');
```

## 3. Konfigurasi & Koneksi (`backend/config.php` & `db.php`)

```php
<?php
// backend/config.php
define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'smart_parking_nay729');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DEVICE_KEY', 'NAY729-SECRET-KEY-2026');
```

```php
<?php
// backend/db.php
require_once __DIR__ . '/config.php';
$pdo = new PDO(
    "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
    DB_USER,
    DB_PASS,
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);
```

## 4. Endpoint Sensor (`backend/api/sensor.php`)

```php
<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

$key = $_SERVER['HTTP_X_DEVICE_KEY'] ?? '';
if ($key !== DEVICE_KEY) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized device key']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$nomor = $data['nomor_slot'] ?? '';
$statusBaru = $data['status'] ?? '';
$deviceId = $data['device_id'] ?? 'ESP32-MAIN';
$sumber = ($data['sumber'] ?? 'sensor') === 'simulator' ? 'simulator' : 'sensor';

if (!$nomor || !in_array($statusBaru, ['kosong', 'terisi'], true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Payload tidak valid']);
    exit;
}

$stmt = $pdo->prepare("SELECT id_slot, status FROM slot_parkir WHERE nomor_slot = ?");
$stmt->execute([$nomor]);
$slot = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$slot) {
    http_response_code(404);
    echo json_encode(['error' => 'Slot tidak ditemukan']);
    exit;
}

// Proteksi: jangan timpa slot yang sedang maintenance
if ($slot['status'] === 'maintenance') {
    echo json_encode(['status' => 'ignored', 'reason' => 'Slot sedang maintenance']);
    exit;
}

if ($slot['status'] !== $statusBaru) {
    $pdo->prepare("UPDATE slot_parkir SET status = ? WHERE id_slot = ?")
        ->execute([$statusBaru, $slot['id_slot']]);
    $pdo->prepare("INSERT INTO log_status_slot (id_slot, status_lama, status_baru, sumber, device_id) VALUES (?, ?, ?, ?, ?)")
        ->execute([$slot['id_slot'], $slot['status'], $statusBaru, $sumber, $deviceId]);
}

echo json_encode(['status' => 'ok', 'nomor_slot' => $nomor, 'state' => $statusBaru]);
```

## 5. Polling Frontend (`frontend/js/app.js`)

```javascript
async function fetchSlots() {
  const res = await fetch('/backend/api/slots.php');
  const data = await res.json();
  renderDenah(data.slots);
  renderSummary(data.summary);
}

fetchSlots();
setInterval(fetchSlots, 2500); // Polling setiap 2,5 detik
```

## 6. Kerangka Firmware ESP32 (`hardware/firmware_esp32.ino`)

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

const char* SSID = "NAMA_WIFI";
const char* PASS = "PASSWORD_WIFI";
const char* API_URL = "http://192.168.1.10/backend/api/sensor.php";
const char* DEVICE_KEY = "NAY729-SECRET-KEY-2026";

// Contoh 6 slot fisik IR Obstacle (LOW = objek terdeteksi / terisi)
const int IR_PINS[6] = {32, 33, 25, 26, 27, 14};
const char* SLOT_IDS[6] = {"P01", "P02", "P03", "P04", "P05", "P06"};
int lastState[6] = {-1, -1, -1, -1, -1, -1};

void sendStatus(const char* slot, const char* status) {
  if (WiFi.status() != WL_CONNECTED) return;
  HTTPClient http;
  http.begin(API_URL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-Device-Key", DEVICE_KEY);
  String payload = "{\"nomor_slot\":\"" + String(slot) + "\",\"status\":\"" + String(status) + "\",\"device_id\":\"ESP32-MAIN\"}";
  http.POST(payload);
  http.end();
}

void setup() {
  Serial.begin(115200);
  for (int i = 0; i < 6; i++) pinMode(IR_PINS[i], INPUT);
  WiFi.begin(SSID, PASS);
  while (WiFi.status() != WL_CONNECTED) delay(500);
}

void loop() {
  for (int i = 0; i < 6; i++) {
    int val = digitalRead(IR_PINS[i]);
    if (val != lastState[i]) {
      lastState[i] = val;
      sendStatus(SLOT_IDS[i], val == LOW ? "terisi" : "kosong");
    }
  }
  delay(500);
}
```
