-- Digital Twin Smart Parking (NAY_729) — Edisi Simulasi
-- Skema Ramping 3 Tabel Inti (MySQL / MariaDB)

CREATE DATABASE IF NOT EXISTS smart_parking_nay729
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE smart_parking_nay729;

-- 1. Tabel users (Autentikasi Admin & Petugas)
CREATE TABLE IF NOT EXISTS users (
  id_user INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'petugas') NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabel slot_parkir (State Terkini 12 Slot Digital Twin)
CREATE TABLE IF NOT EXISTS slot_parkir (
  id_slot INT AUTO_INCREMENT PRIMARY KEY,
  nomor_slot VARCHAR(10) NOT NULL UNIQUE,
  status ENUM('kosong', 'terisi', 'maintenance') NOT NULL DEFAULT 'kosong',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Tabel log_status_slot (Audit Trail Perubahan Status)
CREATE TABLE IF NOT EXISTS log_status_slot (
  id_log INT AUTO_INCREMENT PRIMARY KEY,
  id_slot INT NOT NULL,
  status_lama VARCHAR(20) NOT NULL,
  status_baru VARCHAR(20) NOT NULL,
  sumber ENUM('simulator', 'admin') NOT NULL,
  device_id VARCHAR(50) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_log_slot FOREIGN KEY (id_slot)
    REFERENCES slot_parkir(id_slot) ON DELETE CASCADE,
  INDEX idx_log_created (created_at DESC),
  INDEX idx_log_sumber (sumber)
) ENGINE=InnoDB;

-- Seed Akun Demo (SHA-256 hash: admin123 & petugas123)
INSERT IGNORE INTO users (nama, email, password_hash, role) VALUES
('Admin Kampus', 'admin@parkir.test', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'admin'),
('Petugas Parkir', 'petugas@parkir.test', '2dad904f71aa0dcf6ea1addaa084a5865ffe448e4d3f900668e1cc7e7b6153d7', 'petugas');

-- Seed 12 Slot Parkir (P01 - P12)
INSERT IGNORE INTO slot_parkir (nomor_slot, status) VALUES
('P01', 'kosong'),
('P02', 'terisi'),
('P03', 'kosong'),
('P04', 'terisi'),
('P05', 'kosong'),
('P06', 'maintenance'),
('P07', 'terisi'),
('P08', 'kosong'),
('P09', 'kosong'),
('P10', 'terisi'),
('P11', 'kosong'),
('P12', 'kosong');
