#!/bin/bash
# ========================================================
# Launcher SiTahfidz - Sistem Presensi & Setoran Santri
# Klik ganda file ini untuk membuka panel Asatidz di browser
# ========================================================

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo "Membuka Panel Manajemen Tahfidz Asatidz di browser..."
open "$DIR/admin-tahfidz.html"
