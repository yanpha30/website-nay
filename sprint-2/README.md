# Sprint 2 — Diagram Pemodelan Sistem (`NAY_729`)

Folder ini berisi **8 diagram UML & arsitektur sistem** dalam format PNG resolusi tinggi yang telah diselaraskan dengan rancangan ramping pada `sprint-1/` (**3 tabel inti**, **Sensor IR + ESP32**, dan prinsip **Single Source of Truth**).

## Daftar Diagram

| No | Nama File | Fokus Pemodelan |
|---:|-----------|-----------------|
| 1 | `1_context-diagram.png` | Batas sistem dan aliran data antara Mahasiswa, Admin/Petugas, dan Perangkat IoT (ESP32 + Sensor IR) |
| 2 | `2_use-case-diagram.png` | Fungsionalitas sistem berdasarkan aktor tanpa konflik input manual vs. sensor |
| 3 | `3_activity-diagram.png` | Alur sinkronisasi sensor ESP32, proteksi slot `maintenance`, dan *polling* denah real-time |
| 4 | `4_sequence-diagram.png` | Urutan pertukaran pesan HTTP/JSON antara ESP32, Dashboard Web, PHP 8 API, dan MySQL |
| 5 | `5_class-diagram.png` | Struktur 3 entitas database (`User`, `SlotParkir`, `LogStatusSlot`) serta kelas `SensorDevice` (ESP32) |
| 6 | `6_state-diagram.png` | Siklus status slot parkir `P01`–`P12` (`Kosong`, `Terisi`, `Maintenance`) beserta proteksi transisi |
| 7 | `7_deployment-diagram.png` | Topologi perangkat fisik (Browser Client, ESP32 + Sensor IR, Server PHP 8, Database MySQL) |
| 8 | `8_component-diagram.png` | Arsitektur komponen perangkat lunak dan antarmuka (`I_SensorAPI`, `I_SlotAPI`, `I_AuthAPI`, `I_SQL/PDO`) |
