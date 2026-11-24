> [⬅️ 3. Rancangan UI/UX](./3_rancangan-ui-ux.md) &nbsp;|&nbsp; [🏠 README](../README.md) &nbsp;|&nbsp; [5. Kerangka Dasar ➡️](./5_kerangka-dasar.md)

# 📊 Estimasi Function Point — Simulasi Digital Twin Smart Parking (`NAY_729`)

> [!TIP]
> Setelah disederhanakan menjadi **simulasi perangkat lunak murni** (3 tabel inti & 3 endpoint API), ukuran fungsional sistem turun menjadi **39,52 AFP** — sangat realistis diselesaikan tuntas oleh tim 3 orang dalam 3 sprint.

## 1. Identifikasi 9 Komponen Fungsional Inti

| Kode | Nama Fungsi | Tipe | Kompleksitas | Bobot |
|:----:|-------------|:----:|:------------:|------:|
| `F01` | Login Admin / Petugas (`POST /api/login.php`) | EI | Low | 3 |
| `F02` | Terima Event Simulasi Sensor (`POST /api/sensor.php`) | EI | Average | 4 |
| `F03` | Ubah Status Maintenance Slot (`POST /api/slots.php`) | EI | Low | 3 |
| `F04` | Kontrol Mode Auto-Simulation (Start/Stop di Dashboard) | EI | Low | 3 |
| `F05` | Ringkasan Statistik Parkir (Total/Kosong/Terisi/Maint.) | EO | Low | 4 |
| `F06` | Laporan Tabel Riwayat Perubahan Status (`log_status_slot`) | EO | Average | 5 |
| `F07` | Lihat Denah Parkir Real-Time 12 Slot (`GET /api/slots.php`) | EQ | Low | 3 |
| `F08` | Filter Riwayat Log berdasarkan Slot / Sumber | EQ | Low | 3 |
| `F09` | Penyimpanan Data Internal (`users`, `slot_parkir`, `log_status_slot`) | ILF | Average | 10 |

## 2. Rekapitulasi Unadjusted Function Point (UFP)

| Kategori | Jumlah Fungsi | Total Bobot |
|----------|--------------:|------------:|
| External Input (EI) | 4 | 13 |
| External Output (EO) | 2 | 9 |
| External Inquiry (EQ) | 2 | 6 |
| Internal Logical File (ILF) | 1 | 10 |
| External Interface File (EIF) | 0 | 0 |
| **Total UFP** | **9** | **38** |

## 3. Perhitungan Value Adjustment Factor (VAF) & AFP

<details>
<summary><b>Klik untuk melihat rincian 14 General System Characteristics (TDI = 39)</b></summary>

| No | Karakteristik Sistem | Skor (0–5) |
|---:|----------------------|-----------:|
| 1 | Komunikasi Data (REST API JSON) | 3 |
| 2 | Pemrosesan Terdistribusi (Client Web ↔ API Server) | 2 |
| 3 | Performa (*polling* cepat 2,5 detik) | 3 |
| 4 | Konfigurasi Beban Berat | 1 |
| 5 | Tingkat Transaksi | 2 |
| 6 | Entri Data Online | 3 |
| 7 | Efisiensi Pengguna Akhir (denah publik tanpa login) | 4 |
| 8 | Pembaruan Data Online (*real-time* slot) | 4 |
| 9 | Pemrosesan Kompleks | 2 |
| 10 | Penggunaan Ulang Kode (API modular) | 3 |
| 11 | Kemudahan Instalasi (XAMPP / Laragon) | 4 |
| 12 | Kemudahan Operasional | 4 |
| 13 | Multi-Lokasi | 1 |
| 14 | Kemudahan Perubahan | 3 |
| | **Total TDI (Total Degree of Influence)** | **39** |

</details>

| Metrik | Rumus | Hasil |
|--------|-------|------:|
| **UFP** | Jumlah bobot 9 fungsi inti | **38** |
| **TDI** | Jumlah skor 14 GSC | **39** |
| **VAF** | `0,65 + (0,01 × 39)` | **1,04** |
| **AFP (Adjusted Function Point)** | `38 × 1,04` | **39,52 FP** |

---
> [⬅️ 3. Rancangan UI/UX](./3_rancangan-ui-ux.md) &nbsp;|&nbsp; [🏠 README](../README.md) &nbsp;|&nbsp; [5. Kerangka Dasar ➡️](./5_kerangka-dasar.md)
