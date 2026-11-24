> [⬅️ Kembali ke README Utama](../README.md) &nbsp;|&nbsp; [Selanjutnya: Rancangan Sistem ➡️](./2_rancangan-sistem.md) &nbsp;|&nbsp; [🖼️ Galeri Sprint 2](../sprint-2/README.md)

# 📘 Panduan Proyek — Simulasi Digital Twin Smart Parking (`NAY_729`)

> [!IMPORTANT]
> Proyek ini merupakan **simulasi perangkat lunak murni** berbasis web (HTML/CSS/JS + PHP 8 + MySQL) **tanpa prototipe hardware fisik**. Seluruh perubahan status slot parkir digerakkan oleh **Modul Simulator Sensor** melalui REST API.

## 1. Latar Belakang & Tujuan

Pengendara di lingkungan kampus sering kesulitan mengetahui ketersediaan slot parkir kosong tanpa berkeliling area parkir. Proyek **Digital Twin Smart Parking (`NAY_729`)** membangun simulasi sistem parkir cerdas berkapasitas **12 slot (`P01`–`P12`)**, di mana kondisi area parkir virtual (*Virtual Physical Twin*) tersinkronisasi secara *real-time* ke dashboard web (*Digital Twin*).

**Tujuan utama:**
1. Mensimulasikan sinkronisasi *real-time* antara event sensor virtual (Modul Simulator) dan denah parkir web melalui REST API.
2. Menyediakan halaman denah publik bagi mahasiswa untuk memantau slot kosong secara langsung tanpa login.
3. Menyediakan kontrol `maintenance`, panel simulator (manual & otomatis), dan riwayat log perubahan status (`log_status_slot`) bagi admin/petugas.

## 2. Ruang Lingkup Proyek

| Kategori | Cakupan |
|----------|---------|
| ✅ **In-Scope (Dikerjakan)** | • Aplikasi web 100% simulasi berjalan di XAMPP/Laragon/PHP 8 + MySQL<br>• Denah interaktif 12 slot (`P01`–`P12`) dengan 3 status (`kosong`, `terisi`, `maintenance`)<br>• Ringkasan statistik *real-time* (Total, Kosong, Terisi, Maintenance)<br>• **Modul Simulator Sensor Virtual** (mode *Manual Toggle* & *Auto-Simulation* berkala)<br>• Login Admin/Petugas untuk kontrol `maintenance` & riwayat `log_status_slot` |
| ❌ **Out-of-Scope (Tidak Dikerjakan)** | • Perakitan prototipe fisik, mikrokontroler (ESP32/Arduino), sensor fisik, & wiring elektronika<br>• Kamera OCR plat nomor otomatis, palang pintu otomatis, & sistem tarif/pembayaran<br>• Pencatatan plat nomor manual per slot (dihindari agar tidak bentrok dengan simulator) |

## 3. Aktor & Hak Akses

| Aktor | Login? | Hak Akses Utama |
|-------|:------:|-----------------|
| 🎓 **Mahasiswa / Pengunjung** | Tidak | Melihat denah 12 slot *real-time* (`index.html`) dan jumlah slot kosong |
| 🧑‍💼 **Admin / Petugas** | Ya (`admin` / `petugas`) | Mengatur status `maintenance`, mengoperasikan panel simulator, dan meninjau riwayat log |
| 🤖 **Modul Simulator Sensor** | Header `X-Device-Key` | Mengirim event perubahan status okupansi (`kosong` / `terisi`) ke `POST /api/sensor.php` |

## 4. Roadmap Sprint & Pembagian Tugas

| Sprint | Fokus Utama | Status |
|--------|-------------|:------:|
| **Sprint 1** | Analisis kebutuhan simulasi, rancangan sistem 3 tabel, UI/UX, Function Point, & kerangka dasar | ✅ Selesai |
| **Sprint 2** | Pemodelan 8 diagram UML & arsitektur resolusi tinggi | ✅ Selesai |
| **Sprint 3** | Implementasi web dashboard, panel simulator, API PHP 8, & pengujian *end-to-end* | 🔜 Berikutnya |

| Anggota | NIM | Fokus Kontribusi |
|---------|-----|------------------|
| **Muhammad Nabil** | `240504087` | Arsitektur backend PHP 8, database MySQL (3 tabel), & spesifikasi REST API |
| **Ariel Rizky Ardiansyah** | `240504082` | Desain UI/UX, frontend denah publik/admin, & dokumentasi UML |
| **Yana Putra Hamdalah** | `240504079` | Pengembangan Modul Simulator Sensor (manual & *auto-simulation*) & pengujian |

---
> [⬅️ Kembali ke README Utama](../README.md) &nbsp;|&nbsp; [Selanjutnya: 2. Rancangan Sistem ➡️](./2_rancangan-sistem.md)
