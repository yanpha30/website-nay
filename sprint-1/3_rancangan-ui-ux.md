# Rancangan UI/UX — Digital Twin Smart Parking (`NAY_729`)

## 1. Prinsip Antarmuka

- **Langsung Terlihat (Zero-Friction):** Mahasiswa yang membuka halaman utama langsung melihat denah 12 slot parkir dan jumlah slot kosong tanpa perlu login.
- **Kode Warna Konsisten:** Menggunakan 3 warna semantik berkontras tinggi agar status slot terbaca dalam hitungan detik di layar desktop maupun ponsel.
- **Responsif & Ringan:** Dibangun dengan HTML5 + CSS Grid/Flexbox murni tanpa ketergantungan framework berat.

## 2. Daftar Halaman (4 Halaman Inti)

| File | Akses | Fungsi Utama |
|------|-------|--------------|
| `index.html` | Publik (Mahasiswa) | Denah parkir *real-time* 12 slot (`P01`–`P12`), kartu ringkasan status, legenda warna, dan tombol menuju Login Admin |
| `login.html` | Admin / Petugas | Form autentikasi email & password untuk masuk ke panel pengelolaan |
| `dashboard.html` | Admin / Petugas | Ringkasan statistik, denah interaktif dengan tombol *toggle* `maintenance` per slot, serta panel **Simulator Sensor** untuk uji coba |
| `riwayat.html` | Admin / Petugas | Tabel log perubahan status slot (`log_status_slot`) dengan filter nomor slot dan sumber (`sensor`, `admin`, `simulator`) |

## 3. Palet Warna & Indikator Status

| Elemen | Kode Warna | Keterangan |
|--------|------------|------------|
| Slot Kosong | `#22C55E` (latar `#F0FDF4`) | Tersedia untuk parkir |
| Slot Terisi | `#EF4444` (latar `#FEF2F2`) | Kendaraan terdeteksi sensor |
| Slot Maintenance | `#64748B` (latar `#F1F5F9`) | Dikunci sementara oleh admin |
| Warna Aksen Utama | `#2563EB` | Header, tombol aksi utama, status sinkronisasi aktif |
| Latar Halaman | `#F8FAFC` / `#FFFFFF` | Tampilan bersih dan mudah dibaca di luar ruangan |

## 4. Tata Letak Denah Parkir (Grid 12 Slot)

Denah disusun dalam **2 baris × 6 kolom** yang merepresentasikan jalur parkir kiri dan kanan pada miniatur fisik:

| Baris Atas (Zona A) | `P01` | `P02` | `P03` | `P04` | `P05` | `P06` |
|---------------------|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| **Jalur Kendaraan** | ← | ← | **Akses Masuk / Keluar** | → | → | → |
| **Baris Bawah (Zona B)** | `P07` | `P08` | `P09` | `P10` | `P11` | `P12` |

Setiap kartu slot menampilkan:
1. Kode slot berukuran besar (`P01`–`P12`).
2. Badge teks status (`KOSONG`, `TERISI`, `MAINTENANCE`).
3. Waktu pembaruan terakhir (`updated_at`, misalnya `10:42:15 WIB`).
4. *(Khusus halaman Admin)* Tombol cepat **Kunci Maintenance / Aktifkan Slot**.

## 5. Umpan Balik Sinkronisasi (Real-Time Indicator)

- **Indikator Live Polling:** Badge kecil di pojok kanan atas (`● Live • Update 2 dtk lalu`) yang menandakan koneksi ke `GET /api/slots.php` berjalan normal.
- **Indikator Offline:** Jika server API tidak merespons, badge berubah menjadi kuning (`● Koneksi terputus — mencoba ulang...`) tanpa menghapus tampilan denah terakhir.
