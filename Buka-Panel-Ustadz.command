#!/bin/bash
# ========================================================
# Launcher SiTahfidz - Panel Khusus Asatidz
# Klik ganda file ini untuk membuka Presensi & Hasil Setoran di browser
# ========================================================

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo "Membuka Panel Khusus Asatidz (Presensi & Setoran) di browser..."
open "$DIR/panel-ustadz.html"
