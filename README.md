# Digital Twin Smart Parking (`NAY_729`)

Sistem **Digital Twin Smart Parking** untuk memantau ketersediaan **12 slot parkir (`P01`–`P12`)** secara *real-time* melalui sinkronisasi antara miniatur area parkir fisik (*Physical Twin* berbasis **ESP32 + Sensor IR**) dan dashboard web interaktif (*Digital Twin*).

Repositori ini merupakan proyek mata kuliah **Rekayasa Perangkat Lunak (RPL)** — `RPLUNIT032026/NAY_729` yang telah dirampingkan agar bebas konflik data, mudah dirakit, dan realistis diselesaikan oleh tim beranggotakan 3 orang.

## Tim Pengembang

| No | Nama | NIM |
|---:|------|-----|
| 1 | Muhammad Nabil | 240504087 |
| 2 | Ariel Rizky Ardiansyah | 240504082 |
| 3 | Yana Putra Hamdalah | 240504079 |

## Prinsip Arsitektur (Ramping & Anti-Konflik)

1. **Single Source of Truth untuk Okupansi Slot**
   - **Sensor IR + ESP32** (atau Simulator Data saat pengujian) adalah **satu-satunya** pengubah status otomatis `kosong` ↔ `terisi` melalui `POST /api/sensor.php` dengan autentikasi header `X-Device-Key`.
   - **Admin / Petugas** hanya mengelola status `maintenance` (mengunci/membuka slot perbaikan) dan memantau riwayat log, sehingga tidak terjadi bentrok antara input manual dan kondisi fisik slot.
2. **Akses Tanpa Hambatan untuk Mahasiswa**
   - Mahasiswa dapat langsung membuka halaman denah parkir *real-time* (`P01`–`P12`) tanpa perlu login.
3. **Hardware Praktis (Sensor IR Obstacle)**
   - Menggunakan **Sensor IR Obstacle** (hanya 1 pin GPIO per sensor) yang jauh lebih hemat pin dan rapi dibanding sensor ultrasonik 2-pin. Mendukung konfigurasi penuh 12 sensor (dengan multiplexer `CD74HC4067`) atau *hybrid* (6 slot fisik + 6 slot simulator).
4. **Tech Stack Ringan**
   - **Frontend:** HTML, CSS, JavaScript (*polling* berkala ke `GET /api/slots.php`)
   - **Backend:** PHP 8 REST API native (XAMPP / Laragon / `php -S`)
   - **Database:** MySQL / MariaDB (3 tabel inti: `users`, `slot_parkir`, `log_status_slot`)
   - **IoT / Physical Twin:** ESP32 + Sensor IR Obstacle + Wi-Fi HTTP POST

## Indikator Status Slot (`P01`–`P12`)

| Status | Warna Denah | Sumber Perubahan | Keterangan |
|--------|-------------|------------------|------------|
| `kosong` | Hijau (`#22C55E`) | Sensor IR / Simulator / Admin (selesai maintenance) | Slot tersedia untuk parkir |
| `terisi` | Merah (`#EF4444`) | Sensor IR / Simulator | Kendaraan terdeteksi di slot |
| `maintenance` | Abu-biru (`#64748B`) | Admin / Petugas | Slot dikunci sementara untuk perbaikan |

## Struktur Repositori

```text
NAY_729/
├── README.md
├── sprint-1/
│   ├── 1_panduan-proyek.md        # Ruang lingkup, jadwal sprint, dan pembagian tugas
│   ├── 2_rancangan-sistem.md      # Arsitektur, alur sistem, skema 3 tabel, & spesifikasi API
│   ├── 3_rancangan-ui-ux.md       # Wireframe, komponen UI, dan palet status denah
│   ├── 4_function-point.md        # Estimasi ukuran perangkat lunak (Function Point inti)
│   └── 5_kerangka-dasar.md        # Boilerplate SQL, PHP REST API, JS polling, & ESP32
└── sprint-2/
    ├── README.md                  # Daftar dan ringkasan 8 diagram UML & arsitektur
    ├── 1_context-diagram.png
    ├── 2_use-case-diagram.png
    ├── 3_activity-diagram.png
    ├── 4_sequence-diagram.png
    ├── 5_class-diagram.png
    ├── 6_state-diagram.png
    ├── 7_deployment-diagram.png
    └── 8_component-diagram.png
```

## Status Sprint

- **Sprint 1 (Selesai — Perancangan & Fondasi):** Dokumen panduan proyek, rancangan sistem anti-konflik, UI/UX, perhitungan Function Point inti, serta kerangka dasar kode & database.
- **Sprint 2 (Selesai — Pemodelan UML & Arsitektur):** 8 diagram perancangan sistem lengkap dalam format PNG resolusi tinggi yang selaras dengan arsitektur 3 tabel dan integrasi ESP32 + Sensor IR.
- **Sprint 3 (Rencana Berikutnya — Implementasi & Integrasi):** Pembuatan aplikasi web, API PHP 8, perakitan miniatur ESP32, dan pengujian sinkronisasi *end-to-end*.
