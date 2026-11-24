# Panduan Proyek — Digital Twin Smart Parking (`NAY_729`)

## 1. Latar Belakang & Tujuan

Pengendara di lingkungan kampus sering kesulitan mengetahui ketersediaan slot parkir kosong tanpa berkeliling terlebih dahulu. Proyek **Digital Twin Smart Parking (`NAY_729`)** menghadirkan representasi digital (*Digital Twin*) dari area parkir nyata/miniatur (*Physical Twin*) berkapasitas **12 slot (`P01`–`P12`)** sehingga setiap perubahan kondisi fisik kendaraan langsung tercermin pada dashboard web.

Tujuan utama proyek ini adalah:
1. Membangun sinkronisasi otomatis antara sensor fisik (ESP32 + Sensor IR) dan denah web *real-time*.
2. Menyediakan tampilan publik yang cepat bagi mahasiswa untuk mengecek slot kosong tanpa login.
3. Menyediakan kontrol `maintenance` dan riwayat perubahan status (`log_status_slot`) bagi admin/petugas tanpa konflik dengan pembacaan sensor.

## 2. Ruang Lingkup Proyek

### Termasuk dalam Ruang Lingkup (In-Scope)
- Denah parkir digital interaktif 12 slot (`P01`–`P12`) dengan indikator warna (`kosong`, `terisi`, `maintenance`).
- Ringkasan statistik *real-time* (Total Slot, Kosong, Terisi, Maintenance).
- Integrasi sensor fisik **ESP32 + Sensor IR Obstacle** melalui `POST /api/sensor.php` (dilindungi `X-Device-Key`).
- Mode **Simulator Sensor** untuk pengujian dan demo sebelum seluruh sensor fisik terpasang.
- Login Admin / Petugas untuk mengubah status `maintenance` dan melihat riwayat log perubahan status.

### Di Luar Ruang Lingkup (Out-of-Scope)
- Kamera pengenal plat nomor otomatis (ANPR/OCR) dan palang pintu otomatis (*barrier gate*).
- Sistem pembayaran/tarif parkir atau pencatatan transaksi plat nomor manual per slot (dihindari agar tidak bentrok dengan status sensor otomatis).
- Protokol broker berat seperti MQTT atau WebSocket (digantikan *HTTP REST Polling* yang lebih sederhana).

## 3. Aktor & Hak Akses

| Aktor | Perlu Login? | Hak Akses Utama |
|-------|:------------:|-----------------|
| **Mahasiswa / Pengunjung** | Tidak | Melihat denah 12 slot *real-time* dan ringkasan ketersediaan slot kosong |
| **Admin / Petugas** | Ya (`admin` / `petugas`) | Melihat dashboard, mengubah status slot ke/dari `maintenance`, melihat riwayat log perubahan status, dan menguji simulator |
| **Perangkat IoT (ESP32 + Sensor IR)** | Header `X-Device-Key` | Mengirim perubahan status okupansi slot (`kosong` / `terisi`) secara otomatis via Wi-Fi |

## 4. Rencana Pembagian Sprint

| Sprint | Fokus Utama | Output / Deliverable |
|--------|-------------|----------------------|
| **Sprint 1** | Analisis kebutuhan, penyederhanaan arsitektur, desain UI/UX, Function Point, dan kerangka dasar | 5 dokumen di folder `sprint-1/` |
| **Sprint 2** | Pemodelan sistem menyeluruh menggunakan 8 diagram UML & arsitektur | 8 file PNG diagram di folder `sprint-2/` |
| **Sprint 3** | Implementasi backend PHP 8, frontend web dashboard, database MySQL, dan integrasi miniatur ESP32 + Sensor IR | Kode sumber berjalan & demo sinkronisasi *end-to-end* |

## 5. Pembagian Peran Tim

| Anggota | NIM | Fokus Kontribusi |
|---------|-----|------------------|
| Muhammad Nabil | 240504087 | Arsitektur backend PHP 8, database MySQL, dan spesifikasi REST API |
| Ariel Rizky Ardiansyah | 240504082 | Desain UI/UX, frontend dashboard denah interaktif, dan dokumentasi UML |
| Yana Putra Hamdalah | 240504079 | Perancangan hardware miniatur ESP32 + Sensor IR, simulator, dan pengujian integrasi |
