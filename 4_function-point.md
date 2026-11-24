# Estimasi Function Point — Digital Twin Smart Parking (`NAY_729`)

Dokumen ini menghitung ukuran fungsional sistem setelah penyederhanaan arsitektur (3 tabel inti dan alur *Single Source of Truth*) agar estimasi kerja selaras dengan kapasitas tim 3 orang.

## 1. Identifikasi Komponen Fungsional (10 Fungsi Inti)

| Kode | Nama Fungsi | Tipe | Kompleksitas | Bobot |
|------|-------------|:----:|:------------:|------:|
| F01 | Login Admin / Petugas (`POST /api/login.php`) | EI | Low | 3 |
| F02 | Terima Data Sensor Slot ESP32 (`POST /api/sensor.php`) | EI | Average | 4 |
| F03 | Ubah Status Maintenance Slot (`POST /api/slots.php`) | EI | Low | 3 |
| F04 | Kirim Data Simulasi Slot (Panel Simulator) | EI | Low | 3 |
| F05 | Ringkasan Statistik Parkir (Total/Kosong/Terisi/Maint.) | EO | Low | 4 |
| F06 | Laporan Tabel Riwayat Perubahan Status (`log_status_slot`) | EO | Average | 5 |
| F07 | Lihat Denah Parkir Real-Time 12 Slot (`GET /api/slots.php`) | EQ | Low | 3 |
| F08 | Filter Riwayat Log berdasarkan Slot / Sumber | EQ | Low | 3 |
| F09 | Penyimpanan Data Internal (`users`, `slot_parkir`, `log_status_slot`) | ILF | Average | 10 |
| F10 | Integrasi Perangkat Eksternal ESP32 + Sensor IR | EIF | Low | 5 |

## 2. Perhitungan Unadjusted Function Point (UFP)

| Kategori | Jumlah Fungsi | Total Bobot |
|----------|--------------:|------------:|
| External Input (EI) | 4 | 13 |
| External Output (EO) | 2 | 9 |
| External Inquiry (EQ) | 2 | 6 |
| Internal Logical File (ILF) | 1 | 10 |
| External Interface File (EIF) | 1 | 5 |
| **Total UFP** | **10** | **43** |

## 3. Value Adjustment Factor (VAF)

Penilaian 14 *General System Characteristics* (skala 0–5):

| No | Karakteristik Sistem | Skor (0–5) |
|---:|----------------------|-----------:|
| 1 | Komunikasi Data (REST API + Wi-Fi ESP32) | 4 |
| 2 | Pemrosesan Terdistribusi (IoT ↔ Server ↔ Browser) | 3 |
| 3 | Performa (*polling* cepat 2–3 detik) | 3 |
| 4 | Konfigurasi Beban Berat | 1 |
| 5 | Tingkat Transaksi | 2 |
| 6 | Entri Data Online | 3 |
| 7 | Efisiensi Pengguna Akhir (denah publik tanpa login) | 4 |
| 8 | Pembaruan Data Online (*real-time* slot) | 4 |
| 9 | Pemrosesan Kompleks | 2 |
| 10 | Penggunaan Ulang Kode (API modular) | 3 |
| 11 | Kemudahan Instalasi (XAMPP / Laragon) | 4 |
| 12 | Kemudahan Operasional | 3 |
| 13 | Multi-Lokasi | 1 |
| 14 | Kemudahan Perubahan | 3 |
| | **Total TDI (Total Degree of Influence)** | **40** |

Rumus perhitungan:
- `VAF = 0,65 + (0,01 × TDI) = 0,65 + (0,01 × 40) = 1,05`
- `AFP = UFP × VAF = 43 × 1,05 = 45,15 FP`

## 4. Kesimpulan Estimasi

Dengan ukuran **45,15 AFP** (turun dari estimasi awal 93,84 AFP sebelum penyederhanaan), beban pengembangan menjadi jauh lebih fokus, terukur, dan realistis untuk diselesaikan oleh tim 3 orang dalam 3 sprint tanpa mengurangi esensi **Digital Twin Smart Parking**.
