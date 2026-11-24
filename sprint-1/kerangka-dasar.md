> [⬅️ 4. Function Point](./4_function-point.md) &nbsp;|&nbsp; [🏠 README](../README.md) &nbsp;|&nbsp; [🖼️ Sprint 2: Galeri 8 Diagram ➡️](../sprint-2/README.md)

# 💻 Kerangka Dasar Implementasi — Simulasi Digital Twin Smart Parking (`NAY_729`)

Dokumen ini menyediakan *boilerplate* siap pakai untuk Sprint 3: skema SQL 3 tabel, konfigurasi PHP 8, endpoint `api/sensor.php`, skrip *polling* `app.js`, serta **Modul Simulator Sensor (`simulator.js`)**.

## 1. Struktur Folder Implementasi (Sprint 3)

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
└── frontend/
    ├── index.html
    ├── login.html
    ├── dashboard.html
    ├── riwayat.html
    ├── css/style.css
    └── js/
        ├── app.js
        └── simulator.js
```

## 2. Boilerplate Kode Siap Pakai

<details open>
<summary><b>🗄️ 1. Database Schema — <code>database/database.sql</code></b></summary>

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
  sumber ENUM('simulator', 'admin') NOT NULL,
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
</details>

<details>
<summary><b>⚙️ 2. Konfigurasi &amp; Koneksi — <code>backend/config.php</code> &amp; <code>db.php</code></b></summary>

```php
<?php
// backend/config.php
define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'smart_parking_nay729');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DEVICE_KEY', 'NAY729-SIM-KEY-2026');
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
</details>

<details>
<summary><b>📡 3. Endpoint Simulasi Sensor — <code>backend/api/sensor.php</code></b></summary>

```php
<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

$key = $_SERVER['HTTP_X_DEVICE_KEY'] ?? '';
if ($key !== DEVICE_KEY) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized simulator key']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$nomor = $data['nomor_slot'] ?? '';
$statusBaru = $data['status'] ?? '';
$deviceId = $data['device_id'] ?? 'SIM-WEB-01';

if (!$nomor || !in_array($statusBaru, ['kosong', 'terisi'], true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Payload simulasi tidak valid']);
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

// Proteksi: abaikan event simulator jika slot sedang maintenance
if ($slot['status'] === 'maintenance') {
    echo json_encode(['status' => 'ignored', 'reason' => 'Slot sedang maintenance']);
    exit;
}

if ($slot['status'] !== $statusBaru) {
    $pdo->prepare("UPDATE slot_parkir SET status = ? WHERE id_slot = ?")
        ->execute([$statusBaru, $slot['id_slot']]);
    $pdo->prepare("INSERT INTO log_status_slot (id_slot, status_lama, status_baru, sumber, device_id) VALUES (?, ?, ?, 'simulator', ?)")
        ->execute([$slot['id_slot'], $slot['status'], $statusBaru, $deviceId]);
}

echo json_encode(['status' => 'ok', 'nomor_slot' => $nomor, 'state' => $statusBaru]);
```
</details>

<details>
<summary><b>🖥️ 4. Polling Denah &amp; Modul Simulator — <code>frontend/js/app.js</code> &amp; <code>simulator.js</code></b></summary>

```javascript
// frontend/js/app.js
async function fetchSlots() {
  const res = await fetch('/backend/api/slots.php');
  const data = await res.json();
  renderDenah(data.slots);
  renderSummary(data.summary);
}

fetchSlots();
setInterval(fetchSlots, 2500);
```

```javascript
// frontend/js/simulator.js
const SIM_KEY = 'NAY729-SIM-KEY-2026';
let autoSimTimer = null;

async function triggerSlotSimulation(nomorSlot, statusBaru) {
  await fetch('/backend/api/sensor.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Device-Key': SIM_KEY },
    body: JSON.stringify({
      nomor_slot: nomorSlot,
      status: statusBaru,
      device_id: 'SIM-WEB-01',
      timestamp: new Date().toISOString()
    })
  });
  fetchSlots();
}

function toggleAutoSimulation(aktif) {
  if (!aktif && autoSimTimer) {
    clearInterval(autoSimTimer);
    autoSimTimer = null;
    return;
  }
  const slots = ['P01','P02','P03','P04','P05','P06','P07','P08','P09','P10','P11','P12'];
  autoSimTimer = setInterval(() => {
    const slot = slots[Math.floor(Math.random() * slots.length)];
    const status = Math.random() > 0.5 ? 'terisi' : 'kosong';
    triggerSlotSimulation(slot, status);
  }, 3000);
}
```
</details>

---
> [⬅️ 4. Function Point](./4_function-point.md) &nbsp;|&nbsp; [🏠 README](../README.md) &nbsp;|&nbsp; [🖼️ Sprint 2: Galeri 8 Diagram ➡️](../sprint-2/README.md)
