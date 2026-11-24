# Rancangan Sistem — Digital Twin Smart Parking (`NAY_729`)

## 1. Arsitektur Umum

Sistem terdiri dari 4 lapisan yang saling terhubung secara ringan melalui HTTP/JSON:

1. **Physical Twin (Miniatur Parkir IoT):** Mikrokontroler **ESP32** yang terhubung ke **Sensor IR Obstacle** pada slot `P01`–`P12` (1 pin GPIO per sensor; dapat menggunakan 6 slot fisik + 6 slot simulator atau 12 slot fisik dengan multiplexer `CD74HC4067`).
2. **Backend REST API (PHP 8):** Berjalan di XAMPP/Laragon/Apache dengan 3 endpoint utama (`login.php`, `slots.php`, `sensor.php`).
3. **Database (MySQL / MariaDB):** Menyimpan akun pengelola, status terkini 12 slot, dan riwayat perubahan status dalam **3 tabel inti**.
4. **Digital Twin Web (HTML/CSS/JS):** Menampilkan denah 12 slot secara *real-time* melalui *polling* berkala ke `GET /api/slots.php` setiap 2–3 detik.

## 2. Aturan Sinkronisasi (Single Source of Truth)

Untuk mencegah konflik data antara operator dan sensor fisik:
- **Status `kosong` ↔ `terisi`** hanya diperbarui oleh **Sensor ESP32** (atau **Simulator** saat mode uji) melalui `POST /api/sensor.php`.
- **Status `maintenance`** hanya dapat diaktifkan atau dinonaktifkan oleh **Admin / Petugas** melalui `POST /api/slots.php`.
- **Proteksi Maintenance:** Jika suatu slot sedang berstatus `maintenance`, sinyal dari sensor pada slot tersebut **diabaikan** oleh backend (mengembalikan HTTP `200` dengan catatan `ignored: slot in maintenance`) agar status perbaikan tidak tertimpa secara tidak sengaja.
- **Audit Log Otomatis:** Setiap perubahan status yang valid (baik dari sensor, simulator, maupun admin) wajib dicatat pada tabel `log_status_slot`.

## 3. Alur Sistem Utama

### A. Alur Sinkronisasi Sensor IoT (`POST /api/sensor.php`)
1. Sensor IR mendeteksi perubahan objek (kendaraan masuk atau meninggalkan slot `P01`–`P12`).
2. ESP32 mengirim permintaan HTTP `POST /api/sensor.php` dengan header `X-Device-Key` dan body JSON (`nomor_slot`, `status`, `device_id`, `timestamp`).
3. Backend memvalidasi `X-Device-Key` (jika salah → HTTP `401`), format payload (jika tidak valid → HTTP `400`), dan keberadaan `nomor_slot` (jika tidak ada → HTTP `404`).
4. Backend memeriksa status slot saat ini di `slot_parkir`:
   - Jika status saat ini `maintenance` → abaikan perubahan.
   - Jika status baru berbeda dari status lama → `UPDATE slot_parkir` dan `INSERT INTO log_status_slot`.
5. Backend mengembalikan respons `200 OK` dalam format JSON.

### B. Alur Monitoring Denah Real-Time (`GET /api/slots.php`)
1. Mahasiswa atau Admin membuka halaman denah/dashboard web.
2. Skrip `js/app.js` memanggil `GET /api/slots.php` secara berkala (setiap 2–3 detik).
3. Backend mengambil seluruh 12 baris `slot_parkir` beserta ringkasan jumlah (`total`, `kosong`, `terisi`, `maintenance`).
4. Frontend memperbarui warna kartu slot (`Hijau`, `Merah`, `Abu-biru`) dan angka statistik tanpa reload halaman.

### C. Alur Manajemen Maintenance (`POST /api/slots.php`)
1. Admin/Petugas login melalui `POST /api/login.php`.
2. Admin memilih slot (misalnya `P07`) dan menekan tombol **Set Maintenance** atau **Aktifkan Kembali (Kosong)**.
3. Backend memperbarui status di `slot_parkir` dan mencatat riwayat dengan `sumber = 'admin'` ke `log_status_slot`.

## 4. Skema Database (3 Tabel Inti)

| Tabel | Kolom Utama | Fungsi |
|-------|-------------|--------|
| `users` | `id_user` (PK), `nama`, `email` (UNIQUE), `password_hash`, `role` (`admin`/`petugas`), `created_at` | Autentikasi pengelola sistem |
| `slot_parkir` | `id_slot` (PK), `nomor_slot` (`P01`–`P12`, UNIQUE), `status` (`kosong`/`terisi`/`maintenance`), `updated_at` | Menyimpan state terkini Digital Twin |
| `log_status_slot` | `id_log` (PK), `id_slot` (FK), `status_lama`, `status_baru`, `sumber` (`sensor`/`admin`/`simulator`), `device_id`, `created_at` | Riwayat perubahan status slot untuk monitoring & laporan |

## 5. Spesifikasi REST API

| Method & Endpoint | Autentikasi | Request / Payload | Respons Sukses (`200 OK`) |
|-------------------|-------------|-------------------|---------------------------|
| `POST /api/login.php` | Publik | `{"email": "admin@parkir.test", "password": "..."}` | `{"status": "ok", "user": {"nama": "...", "role": "admin"}}` |
| `GET /api/slots.php` | Publik | *(opsional `?with_logs=1`)* | `{"summary": {"total": 12, "kosong": 8, "terisi": 3, "maintenance": 1}, "slots": [...]}` |
| `POST /api/slots.php` | Session Admin/Petugas | `{"nomor_slot": "P07", "status": "maintenance"}` | `{"status": "ok", "message": "Slot P07 diubah ke maintenance"}` |
| `POST /api/sensor.php` | Header `X-Device-Key` | `{"nomor_slot": "P03", "status": "terisi", "device_id": "ESP32-MAIN", "timestamp": "2026-11-24T10:30:00+07:00"}` | `{"status": "ok", "nomor_slot": "P03", "updated": true}` |
