> [⬅️ 2. Rancangan Sistem](./2_rancangan-sistem.md) &nbsp;|&nbsp; [🏠 README](../README.md) &nbsp;|&nbsp; [4. Function Point ➡️](./4_function-point.md)

# 🎨 Rancangan UI/UX — Simulasi Digital Twin Smart Parking (`NAY_729`)

## 1. Prinsip Antarmuka

- **⚡ Zero-Friction Publik:** Mahasiswa yang membuka `index.html` langsung melihat denah 12 slot dan jumlah slot kosong tanpa perlu login.
- **🎛️ Panel Simulator Terintegrasi:** Admin dapat menguji perubahan status slot secara manual maupun *auto-simulation* langsung dari dashboard sambil menyaksikan perubahan denah secara *real-time*.
- **🎯 Kontras Warna Semantik:** Tiga warna status yang tegas memudahkan pemindaian cepat di layar desktop maupun ponsel.

## 2. Daftar Halaman Aplikasi (4 Halaman Inti)

| Halaman | Akses | Fungsi Utama |
|---------|:-----:|--------------|
| `index.html` | Publik | Denah 12 slot *real-time*, kartu ringkasan status, legenda warna, & tombol Login Admin |
| `login.html` | Admin / Petugas | Form autentikasi email & password |
| `dashboard.html` | Admin / Petugas | Ringkasan statistik, tombol *toggle* `maintenance` per slot, & **Panel Simulator Sensor** (Manual + *Start/Stop Auto-Simulation*) |
| `riwayat.html` | Admin / Petugas | Tabel `log_status_slot` lengkap dengan filter nomor slot dan sumber (`simulator`, `admin`) |

## 3. Palet Warna & Indikator Status

| Elemen | Warna Utama | Latar Kartu | Keterangan |
|--------|:-----------:|:-----------:|------------|
| 🟢 **Kosong** | `#22C55E` | `#F0FDF4` | Slot tersedia untuk parkir |
| 🔴 **Terisi** | `#EF4444` | `#FEF2F2` | Terisi kendaraan (event simulator) |
| ⚪ **Maintenance** | `#64748B` | `#F1F5F9` | Dikunci sementara oleh admin |
| 🔵 **Aksen UI** | `#2563EB` | `#EFF6FF` | Header, tombol aksi, indikator *live polling* |

## 4. Tata Letak Denah Parkir (Grid 2 × 6)

| Baris Atas (Zona A) | `P01` | `P02` | `P03` | `P04` | `P05` | `P06` |
|---------------------|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| **Jalur Kendaraan** | ← | ← | **Akses Masuk / Keluar** | → | → | → |
| **Baris Bawah (Zona B)** | `P07` | `P08` | `P09` | `P10` | `P11` | `P12` |

> [!NOTE]
> Setiap kartu slot menampilkan kode slot (`P01`–`P12`), badge status (`KOSONG` / `TERISI` / `MAINTENANCE`), dan waktu pembaruan terakhir (`updated_at`). Pada `dashboard.html`, tiap kartu juga dilengkapi tombol cepat **Simulasi Masuk/Keluar** serta **Kunci/Buka Maintenance**.

---
> [⬅️ 2. Rancangan Sistem](./2_rancangan-sistem.md) &nbsp;|&nbsp; [🏠 README](../README.md) &nbsp;|&nbsp; [4. Function Point ➡️](./4_function-point.md)
