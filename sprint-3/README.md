> [⬅️ Kembali ke README Utama](../README.md) &nbsp;|&nbsp; [📘 Sprint 1](../sprint-1/1_panduan-proyek.md) &nbsp;|&nbsp; [🖼️ Sprint 2](../sprint-2/README.md)

# 🚀 Sprint 3 — Implementasi Aplikasi Simulasi (`NAY_729`)

Folder ini berisi **kode sumber lengkap dan siap dijalankan** untuk **Simulasi Digital Twin Smart Parking (`NAY_729`)** — 100% berbasis web (HTML/CSS/JS + PHP 8 REST API + MySQL 3 tabel) tanpa perangkat keras fisik.

## 📂 Struktur Folder `sprint-3/`

```text
sprint-3/
├── README.md                  # Panduan instalasi & demo lokal
├── database/
│   └── database.sql           # Skema 3 tabel + seed 12 slot (P01–P12) & akun demo
├── backend/
│   ├── config.php             # Konfigurasi koneksi DB & DEVICE_KEY simulator
│   ├── db.php                 # Koneksi PDO MySQL
│   └── api/
│       ├── login.php          # Autentikasi session Admin/Petugas & logout
│       ├── slots.php          # GET 12 slot + ringkasan/log & POST toggle maintenance
│       └── sensor.php         # POST event simulator (X-Device-Key + proteksi maintenance)
└── frontend/
    ├── index.html             # Denah publik 12 slot real-time (tanpa login)
    ├── login.html             # Halaman login Admin / Petugas
    ├── dashboard.html         # Panel Admin: kontrol maintenance & Modul Simulator Sensor
    ├── riwayat.html           # Tabel riwayat perubahan status + filter slot & sumber
    ├── css/style.css          # Tampilan modern responsif
    └── js/
        ├── app.js             # Polling real-time (2,5 dtk), render denah, auth, & riwayat
        └── simulator.js       # Modul Simulator Sensor (Manual Toggle & Auto-Simulation 3 dtk)
```

## 🛠️ Cara Menjalankan di Lokal (XAMPP / Laragon)

1. **Aktifkan Apache & MySQL** di XAMPP atau Laragon.
2. **Impor Database:** Buka `phpMyAdmin`, buat/impor file `database/database.sql` (otomatis membuat database `smart_parking_nay729`, 3 tabel inti, 12 slot `P01`–`P12`, dan 2 akun demo).
3. **Sesuaikan Konfigurasi (Opsional):** Jika password MySQL lokal bukan kosong, ubah `DB_PASS` di `backend/config.php`.
4. **Salin Folder Proyek:** Letakkan folder `NAY_729` di dalam `htdocs/` (XAMPP) atau `www/` (Laragon).
5. **Buka di Browser:**
   - **Denah Publik (Mahasiswa):** `http://localhost/NAY_729/sprint-3/frontend/index.html`
   - **Login Admin / Petugas:** `http://localhost/NAY_729/sprint-3/frontend/login.html`

> [!TIP]
> **Alternatif cepat via PHP Built-in Server** (dari dalam folder `sprint-3/`):
> ```bash
> php -S localhost:8000
> ```
> Lalu buka `http://localhost:8000/frontend/index.html`.

## 🔐 Akun Demo

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@parkir.test` | `admin123` |
| **Petugas** | `petugas@parkir.test` | `petugas123` |

## 🧪 Skenario Uji Demo (End-to-End)

1. Buka `index.html` di satu tab browser (sebagai **Mahasiswa**) dan `dashboard.html` di tab lain (sebagai **Admin**).
2. Di `dashboard.html`, klik tombol **Simulasi Masuk/Keluar** pada salah satu slot (misalnya `P03`) atau aktifkan **Auto-Simulasi (3 dtk)** — warna slot di tab Mahasiswa akan ikut berubah otomatis.
3. Klik **Kunci Maintenance** pada slot `P06`, lalu coba picu simulasi pada `P06` — sistem akan mengabaikan event simulator (*Proteksi Maintenance*).
4. Buka `riwayat.html` untuk melihat seluruh rekaman perubahan status (`simulator` maupun `admin`) yang tersimpan di MySQL.
