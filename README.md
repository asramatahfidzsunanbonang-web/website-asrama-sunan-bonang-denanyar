# 🕌 SiTahfidz Pondok - Sistem Informasi Manajemen Terpadu Pesantren

Aplikasi web modern, responsif, dan siap pakai (*offline-first, zero-setup*) yang dirancang khusus untuk Pondok Pesantren dalam mengelola **3 Pilar Utama Pesantren**:
1. 📚 **PENDIDIKAN & TAHFIDZ**: Presensi harian, setoran Al-Qur'an (Binnadzor & Tahfidz), absensi asatidz, ujian semester & perombakan kelas otomatis, wisuda binnadzor, peta hafalan 30 juz, serta rekap bulanan.
2. 🛡️ **KEAMANAN & KETERTIBAN**: Pencatatan pelanggaran santri beserta takziran edukatif pesantren, penerbitan surat izin pulang/keluar santri, cetak surat peringatan, dan rekapitulasi poin kedisiplinan.
3. 🕌 **UBUDIYAH & PEMBIASAAN**: Presensi shalat fardhu berjamaah 5 waktu di masjid & qiyamul lail/tahajjud, keikutsertaan ekstrakurikuler & kajian kitab kuning, serta monitoring keistiqomahan santri.

---

## 🌟 3 Pilar Ekosistem Pesantren Terpadu

```
                               ┌─────────────────────────────────────────────────────┐
                               │       SISTEM INFORMASI PONDOK PESANTREN             │
                               └─────────────────────────┬───────────────────────────┘
                                                         │
         ┌───────────────────────────────────────────────┼───────────────────────────────────────────────┐
         ▼                                               ▼                                               ▼
┌─────────────────────────────────┐   ┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│ 📚 1. DIVISI PENDIDIKAN         │   │ 🛡️ 2. DIVISI KEAMANAN           │   │ 🕌 3. DIVISI UBUDIYAH           │
│  - Presensi Harian Santri       │   │  - Pelanggaran & Poin Santri    │   │  - Shalat Berjamaah 5 Waktu     │
│  - Setoran Al-Qur'an (Bin/Tahf) │   │  - Takziran Edukatif Pesantren  │   │  - Qiyamul Lail / Tahajjud      │
│  - Absensi Harian Asatidz       │   │  - Perizinan Pulang / Keluar    │   │  - Ekstrakurikuler Santri       │
│  - Ujian Semester & Leveling    │   │  - Monitoring Santri di Luar    │   │  - Kajian Kitab Kuning          │
│  - Wisuda & Piagam Kelulusan    │   │  - Cetak Surat Izin & SP        │   │  - Rekap Keistiqomahan Jamaah   │
│  - Peta Hafalan 30 Juz          │   │  - Rekap Kedisiplinan Pondok    │   │  - Rekapitulasi Ubudiyah        │
│  - Rekap Bulanan (Excel/Print)  │   │  - Hak Akses: KHUSUS ADMIN      │   │  - Hak Akses: KHUSUS ADMIN      │
└─────────────────────────────────┘   └─────────────────────────────────┘   └─────────────────────────────────┘
                                                         │
                                                         ▼
                               ┌─────────────────────────────────────────────────────┐
                               │ 👨‍👩‍👦 PORTAL WALI SANTRI (Transparansi Penuh)         │
                               │  - Tab 1: Capaian Pendidikan, Hafalan, & Peta 30 Juz│
                               │  - Tab 2: Riwayat Keamanan, Takziran, & Izin Pulang │
                               │  - Tab 3: Keaktifan Shalat Berjamaah 5 Waktu & Kajian│
                               │  - Hak Akses: READ-ONLY (NIS + No. WA Terdaftar)    │
                               └─────────────────────────────────────────────────────┘
```

---

## 📑 Rincian Fitur Utama SiTahfidz

### 📚 MODUL 1: PENDIDIKAN & TAHFIDZ
1. **Presensi & Setoran Harian Santri (Terintegrasi)**:
   - Sesi harian pondok (Shubuh, Ashar, Maghrib/Isya) dengan hari aktif **Sabtu s.d. Rabu** (Kamis & Jumat libur rutin/kondisional).
   - Satu alur kerja cepat: absensi kehadiran santri sekaligus pencatatan hafalan/bacaan.
   - Pembedaan otomatis kurikulum **Binnadzor** (Juz 28, 29, 30 & Tajwid) vs **Tahfidz** (Ziyadah 30 Juz & Muraja'ah).
2. **Presensi & Rekapitulasi Kehadiran Asatidz**:
   - Pengisian presensi asatidz super cepat: tombol **1-Klik "Set Semua Hadir"** (1 detik).
   - Chip status interaktif: `[✓ Hadir]`, `[✉️ Izin]`, `[🏥 Sakit]`, `[🔄 Badal]`, `[✕ Alpa]`.
   - Sub-tab dedicated **Rekapitulasi Kehadiran Asatidz Bulanan** dengan % kedisiplinan mengajar, kartu statistik, dan cetak laporan resmi ber-kop pondok.
   - Dukungan ekspor & impor Excel (`.xlsx`) absensi ustadz.
3. **Data Master Santri & Kenaikan Kelas Massal**:
   - Profil lengkap: NIS, Nama, Gender, Kelas Sekolah Formal (Kelas 7–12), Program (Binnadzor/Program Maqbul/Tahfidz), Halaqah, Asrama, No. WA Wali.
   - **Fitur Kenaikan Kelas Massal**: Naik kelas formal (misal: Kelas 7 ➔ 8) serentak per tingkat atau per santri.
4. **Ujian Semester & Perombakan Kelas Otomatis (Leveling)**:
   - Ujian Binnadzor dengan bobot 4 aspek (Makhraj, Tajwid, Fashahah, Hafalan Juz 28-30).
   - **Sistem Leveling Otomatis**: Rekomendasi kelas A/B/C/D/E atau promosi ke Program Maqbul berdasarkan nilai ujian.
   - Tombol 1-klik "Terapkan Semua Rekomendasi" dan cetak Berita Acara Perombakan Kelas resmi.
   - Ujian Tasmi' Semester Tahfidz & cetak Raport Tasmi' Semester.
5. **Wisuda Binnadzor & Peta Hafalan 30 Juz**:
   - Wisuda 1-klik bagi santri yang telah lulus Juz 28, 29, dan 30 menuju jenjang Tahfidz.
   - Peta visual 30 kotak Juz interaktif & cetak raport tahfidz.

---

### 🛡️ MODUL 2: KEAMANAN & KETERTIBAN (KHUSUS ADMIN)
Dirancang untuk menjaga stabilitas, disiplin santri, dan keteraturan perizinan di lingkungan pesantren:
1. **Pencatatan Pelanggaran Santri & Takziran Edukatif**:
   - Kategori pelanggaran: Ringan (5–10 poin), Sedang (15–30 poin), Berat (40–100 poin).
   - **Bentuk Takziran Edukatif Pesantren**: Takziran diarahkan pada pembinaan ibadah dan literasi, seperti membaca Al-Qur'an 1 juz di serambi masjid, hafalan mufrodat bahasa Arab, membersihkan masjid, atau resume kitab kuning.
   - Tombol 1-klik **"Tandai Takziran Selesai"** saat santri telah tuntas menjalankan pembinaannya.
   - **Cetak Surat Peringatan (SP 1, SP 2, SP 3)**: Format resmi ber-kop pesantren lengkap dengan rincian pasal pelanggaran dan tanda tangan pengurus keamanan.
2. **Sistem Perizinan Pulang & Keluar Santri**:
   - Penerbitan surat izin (Izin Sakit, Izin Sambang Keluarga, Izin Kepentingan Sekolah/Keluarga).
   - Pencatatan waktu keluar dan target waktu kembali, disertai nama penjemput/pengantar.
   - Tombol 1-klik **"Konfirmasi Santri Kembali"** dengan otomatisasi status: *Tepat Waktu* atau *Terlambat*.
   - **Cetak Surat Jalan Izin Pulang**: Dokumen resmi yang wajib dibawa santri dan ditandatangani wali di rumah saat kembali.
3. **Rekapitulasi Kedisiplinan & Poin**:
   - 4 Ringkasan Statistik: Total Pelanggaran, Santri Sedang di Luar Pondok, Total Poin Akumulasi, dan % Takziran Tuntas.
   - Tabel monitoring kedisiplinan per santri dengan indikator status disiplin.
   - Ekspor laporan pelanggaran dan perizinan ke file Microsoft Excel (`.xlsx`).

---

### 🕌 MODUL 3: UBUDIYAH & PEMBIASAAN (KHUSUS ADMIN)
Menjaga ruh keistiqomahan ibadah dan pembiasaan spiritual santri:
1. **Presensi Shalat Berjamaah 5 Waktu & Tahajjud**:
   - Pilihan waktu shalat: **Subuh, Dzuhur, Ashar, Maghrib, Isya**, dan **Qiyamul Lail / Tahajjud**.
   - Tombol **1-Klik "Set Semua Hadir Jamaah"** untuk efisiensi pengurus kamar/ubudiyah.
   - Status kehadiran: `[✓ Hadir Jamaah]`, `[⏳ Masbuk]`, `[🏥 Sakit Asrama]`, `[🌸 Udzur Syar'i (Putri)]`, `[✕ Alpa / Masbuk Parah]`.
   - Kolom catatan posisi shaf atau keterangan kedisiplinan.
2. **Kegiatan Ekstrakurikuler & Kajian Kitab Kuning**:
   - Pencatatan keikutsertaan santri dalam kajian kitab (*Ta'lim Muta'allim, Safinatun Najah, Fathul Qorib*) dan ekstrakurikuler (*Hadroh Banjari, Muhadharah 3 Bahasa, Pramuka, Silat Pagar Nusa*).
   - Status keaktifan (Sangat Aktif, Aktif, Cukup Aktif).
3. **Rekapitulasi Keistiqomahan Ubudiyah**:
   - Persentase kehadiran shalat berjamaah, jumlah santri dengan rekor istiqomah 100%, dan statistik keterlibatan kajian.
   - Ekspor data ubudiyah & jamaah ke format Excel (`.xlsx`).

---

### 👨‍👩‍👦 PORTAL WALI SANTRI (`portal-wali.html`)
Memberikan keterbukaan informasi yang mendidik bagi orang tua santri tanpa mengorbankan privasi santri lain:
- **Akses Aman**: Wali santri memasukkan **NIS (Nomor Induk Santri)** dan **Nomor WhatsApp terdaftar**.
- **3 Tab Informasi Komprehensif**:
  1. 📚 **Tab 1: Capaian Pendidikan & Ngaji**:
     - Status program (Binnadzor/Tahfidz), ustadz pembimbing, kelas sekolah.
     - Riwayat setoran terakhir, nilai bacaan/hafalan, dan evaluasi tajwid.
     - Peta visual 30 juz capaian hafalan.
     - Rapor bulanan kehadiran tahfidz.
  2. 🛡️ **Tab 2: Keamanan & Kedisiplinan (READ-ONLY)**:
     - Kartu status kedisiplinan (Aman / Dalam Pembinaan).
     - Riwayat pelanggaran yang pernah dilakukan dan status penyelesaian takziran edukatifnya.
     - Riwayat surat perizinan pulang/keluar santri beserta status ketepatan waktu kembali ke pondok.
  3. 🕌 **Tab 3: Ubudiyah & Ibadah**:
     - Persentase keaktifan shalat berjamaah 5 waktu di masjid pondok.
     - Daftar kegiatan ekstrakurikuler dan kajian kitab kuning yang aktif diikuti ananda.

---

### 🖼️ Kustomisasi Foto / Gambar Latar Belakang (Transparan)
Pengurus dapat mempercantik tampilan seluruh aplikasi dengan gambar latar belakang ber-nuansa Islami atau foto pondok pesantren sendiri:
- **Pilihan Wallpaper Islami Bawaan (1-Klik)**:
  - 🕌 **Kubah Masjid & Menara Syahdu** (Siluet kubah dan menara artistik)
  - ✨ **Pola Ornamen Arabesque** (Pola geometri bintang Islami berulang)
  - 📖 **Mushaf Al-Qur'an & Rehal Emas** (Iluminasi mushaf terbuka di atas rehal kayu)
  - ⚪ **Polos** (Kembali ke tampilan dasar tanpa background)
- **Upload Foto Gedung / Masjid Pondok Sendiri**:
  - Unggah foto arsitektur pondok, masjid pesantren, atau santri (format JPG, PNG, WebP).
- **Pengatur Transparansi (Opacity Slider)**:
  - Rentang 4% hingga 35% (default 12%) agar gambar tampak anggun di balik layar, namun teks, tabel, angka, dan tombol tetap **100% kontras, tajam, dan sangat nyaman dibaca**.
- **Mode Tampilan**: *Cover (Penuh Layar)*, *Repeat (Pola Ubin)*, atau *Center Fit*.
- **Otomatis Sinkron**: Perubahan background di menu Pengaturan langsung diterapkan ke Panel Administrator, Panel Asatidz, dan Portal Wali Santri.

---

### 💫 Animasi Widget, Kartu Statistik, & Mikro-Interaksi Dinamis
Agar antarmuka tidak terasa kaku atau monoton, seluruh widget, kartu statistik, dan elemen interaktif kini dilengkapi animasi halus bernuansa modern-Islami tanpa membebani performa perangkat (60 FPS, CSS GPU-accelerated & vanilla JS):
1. **Floating & Breathing Icons (`@keyframes floatWidgetIcon`)**:
   - Ikon-ikon pada widget/stat-card melayang naik-turun secara halus dan organik dengan jeda bertingkat (*staggered delay* 0s, 0.7s, 1.4s, 2.1s, 2.8s) sehingga tampak hidup dan rileks.
2. **Metallic Light Sweep Shimmer**:
   - Saat kursor diarahkan ke kartu statistik (*hover*), kilau cahaya keemasan/zamrud lembut melintas secara diagonal di atas kartu.
3. **Animated Gradient Accent Line**:
   - Garis aksen di bagian atas widget memiliki gradien warna zamrud-emas yang bergerak mengalir lembut (*flowing gradient shimmer*).
4. **Indikator Sesi Halaqah Aktif Berpendar (`.live-pulse-dot`)**:
   - Indikator sesi waktu (Shubuh, Ashar, Maghrib) di bagian atas memiliki titik hijau aktif yang berdenyut lembut memberikan rasa *real-time monitoring*.
5. **Animasi Angka Berputar Naik (*Dynamic Number Counter Animation*)**:
   - Angka statistik santri, hafalan, persentase kehadiran asatidz, poin keamanan, hingga capaian shalat berjamaah berputar naik secara mulus (*smooth cubic spline ease-out*) dari 0 ke angka target saat menu atau halaman dibuka.
6. **Animated Flowing Stripes pada Progress Bar**:
   - Indikator progres kurikulum dan capaian hafalan dilengkapi garis strip diagonal yang mengalir dinamis (*animated striped pattern*).
7. **Pendar Peta Hafalan 30 Juz Al-Qur'an**:
   - Kotak target Binnadzor (Juz 28, 29, 30) memiliki denyut pendar keemasan (*pulseTargetGold*), dan Juz yang telah Mutqin memancarkan aura hijau zamrud lembut (*mutqinEmeraldGlow*).
8. **Feedback Taktil Pegas (*Tactile Spring Bounce*)**:
   - Setiap penekanan tombol (*btn:active*) dan klik modal (*modalScaleIn*) memberikan umpan balik pegas taktil yang responsif dan memuaskan.

---

### 📸 Widget Dokumentasi & Sorotan Foto Interaktif (Standar Web Profesional)
Mengadopsi standar desain interaktif website modern kelas dunia (Apple, Stripe, Linear Showcase):
1. **Gerakan Foto Hidup Saat Dibuka (*Ken Burns Cinematic Live Motion*)**:
   - Setiap foto dokumentasi yang aktif bergerak secara perlahan (*slow zoom in & subtle camera panning*) sehingga foto tampak hidup, bernyawa, dan tidak membosankan.
2. **Bisa Digeser & Diswipe Bebas (*Interactive Touch & Mouse Draggable Slider*)**:
   - Pengguna dapat menggeser foto ke kiri atau ke kanan menggunakan tarikan mouse (*click & drag*) di laptop atau usapan jari (*touch swipe*) di layar ponsel/tablet.
   - Dilengkapi tombol navigasi kaca melayang (`◀` dan `▶`) serta indikator kapsul titik (*animated dot pills*) yang otomatis memanjang pada foto yang sedang aktif.
   - Otomatis bergeser setiap beberapa detik (*auto-play*), dan otomatis berhenti sejenak saat kursor diarahkan ke foto (*smart pause on hover*).
3. **Efek Interaktif 3D Tilt & Specular Glare pada Kursor**:
   - Kartu galeri foto bergerak miring secara 3D mengikuti arah posisi mouse/kursor pengguna (`perspective: 1000px rotateX/rotateY`) dengan pantulan cahaya berkilau dinamis (*specular reflection glare*).
4. **Bisa Diklik untuk Memperbesar (*Interactive Fullscreen Lightbox Modal*)**:
   - Mengklik foto atau tombol *"Perbesar Foto"* langsung membuka jendela tampilan resolusi tinggi dengan efek zoom-in lembut.
   - Dilengkapi tombol geser berikutnya/sebelumnya langsung di dalam lightbox, deskripsi narasi kegiatan, dan dukungan keyboard panah kiri/kanan (`←` / `→`) serta tombol `Escape`.
5. **Terintegrasi di 3 Lini Aplikasi**:
   - 👑 **Dashboard Admin**: Widget sorotan utama dokumentasi kegiatan santri.
   - 🌐 **Website Luar Pondok**: Slider sorotan utama dan galeri foto dengan filter kategori.
   - 👨‍👩‍👦 **Portal Wali Santri**: Dokumentasi kebersamaan dan keseharian ananda di pesantren.
6. **100% Offline-Safe**:
   - Dilengkapi fallback otomatis ke kaligrafi vektor SVG Islami jika perangkat dibuka tanpa koneksi internet.

---

### 🌊 Animasi Widget Muncul Saat Di-Scroll (*Scroll-Triggered Reveal Animations*)
Halaman website utama (`index.html`) kini dilengkapi efek transisi visual saat pengunjung men-scroll ke bawah (*scroll-reveal powered by Intersection Observer*):
1. **Muncul Meluncur dari Samping Kiri (*Reveal-Left*)**:
   - Kolom Visi & Misi Pesantren, Alur dan Syarat Pendaftaran PSB, Program 1 Binnadzor, serta Kartu Informasi Kontak Sekretariat meluncur anggun dari tepi kiri layar.
2. **Muncul Meluncur dari Samping Kanan (*Reveal-Right*)**:
   - Kartu Pengasuh Pondok Pesantren, Formulir Pendaftaran PSB Online, Program 4 Pasca Tahfidz, Kartu Layanan Cepat di Hero Banner, serta Kartu Peta Lokasi meluncur dari tepi kanan layar.
3. **Muncul Meluncur dari Bawah (*Reveal-Up*)**:
   - Header judul setiap bagian (*section header*), filter kategori berita & galeri, serta barisan kartu artikel meluncur naik dari arah bawah.
4. **Membesar Halus dari Tengah (*Reveal-Zoom*)**:
   - Widget slider foto dokumentasi santri mengembang lembut (*scale-up*) dari tengah saat digulir ke area galeri.
5. **Efek Berurutan (*Cascading Staggered Delays*)**:
   - Pada barisan kartu fasilitas pesantren (6 kartu), program pendidikan (4 kartu), dan saluran media sosial resmi (6 saluran), kartu-kartu muncul satu per satu secara bergantian (*delay* 0.1s, 0.2s, 0.3s, 0.4s) sehingga tidak serentak kaku.
6. **Performa 60 FPS Tanpa Beban**:
   - Berjalan murni menggunakan API modern `IntersectionObserver` dan *CSS Hardware-Accelerated transitions* (`will-change: transform, opacity`), tanpa library pihak ketiga yang berat.

---

## 🔐 Matriks Hak Akses & Keamanan Sistem Multi-Peran (RBAC)

Sistem dirancang dengan pembatasan hak akses yang sangat ketat dan jelas sesuai divisi masing-masing:

| Peran Pengguna | Halaman / Portal | Hak Akses Fitur | Kredensial / PIN Akses |
| :--- | :--- | :--- | :---: |
| 👑 **Administrator Utama** | `admin-tahfidz.html` | **Akses Penuh Tanpa Batas**: Membuka seluruh modul (Pendidikan, Keamanan, Ubudiyah, Master Santri, Pengaturan Sistem & PIN, Backup & Restore, serta Kelola Website). | PIN: `123456` |
| 📚 **Pengurus Pendidikan** | `admin-tahfidz.html` | **Khusus Modul Pendidikan**: Presensi Santri, Hasil Setoran Al-Qur'an, Absensi Kehadiran Asatidz, Ujian Semester & Leveling, Wisuda Binnadzor & Tahfidz, Peta 30 Juz, dan Data Santri. *(Fitur Keamanan, Ubudiyah, dan Pengaturan Sistem terkunci)*. | PIN: `111111` |
| 🛡️ **Pengurus Keamanan** | `admin-tahfidz.html` | **Khusus Modul Keamanan**: Pencatatan Pelanggaran Santri, Penugasan Takziran Edukatif, Penerbitan Surat Izin Pulang/Keluar, Konfirmasi Kepulangan Santri, Cetak Surat Peringatan, dan Rekap Kedisiplinan. *(Fitur Pendidikan, Ubudiyah, dan Pengaturan Sistem terkunci)*. | PIN: `222222` |
| 🕌 **Pengurus Ubudiyah** | `admin-tahfidz.html` | **Khusus Modul Ubudiyah**: Presensi Shalat Berjamaah 5 Waktu di Masjid & Qiyamul Lail/Tahajjud, Kegiatan Ekstrakurikuler & Kajian Kitab Kuning, serta Monitoring Keistiqomahan Santri. *(Fitur Pendidikan, Keamanan, dan Pengaturan Sistem terkunci)*. | PIN: `333333` |
| 👳‍♂️ **Asatidz Pembimbing** | `panel-ustadz.html` | **Khusus Presensi & Setoran Halaqah**: Mengisi absensi kehadiran santri binaan dan mencatat hasil setoran harian bacaan/hafalan santri. | PIN: `888888` |
| 👨‍👩‍👦 **Wali Santri** | `portal-wali.html` & `index.html` | **Tampilan Luar & Cek Ananda (Read-Only)**: Hanya dapat melihat tampilan website pondok dan mencari informasi putranya sendiri (3 Tab: Capaian Ngaji, Status Keamanan/Takziran, Keaktifan Ubudiyah). Tidak bisa mengedit/menghapus dan tidak bisa melihat data santri lain. | NIS + No. WA Terdaftar |
| 🌐 **Masyarakat / Publik** | `index.html` | **Hanya Tampilan Luar Web**: Membaca profil pondok, visi & misi, profil asatidz pembina, pendaftaran santri baru (PSB Online), berita/artikel, galeri kegiatan, dan kontak resmi pesantren. Tidak ada data santri yang terbuka untuk publik. | Terbuka (Tanpa Login) |

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini bersifat **100% Client-Side / Offline-First** tanpa perlu menginstall web server, PHP, NodeJS, ataupun database eksternal:

### Pengguna macOS:
Klik ganda salah satu launcher file sesuai kebutuhan:
- **`Buka-Admin-Pondok.command`** (atau `Buka-SiTahfidz.command`): Membuka Panel Administrator Pondok (PIN Default: `123456`).
- **`Buka-Panel-Ustadz.command`**: Membuka Panel Khusus Asatidz (Presensi & Setoran Santri, PIN Default: `888888`).
- **`Buka-Website-Pondok.command`**: Membuka Website Profil & Portal Santri.

### Pengguna Windows / Linux / Ponsel:
Buka browser favorit Anda (Google Chrome, Firefox, Safari, Microsoft Edge), lalu buka file:
- `admin-tahfidz.html` untuk Administrator Pondok.
- `panel-ustadz.html` untuk Asatidz Pembimbing.
- `portal-wali.html` untuk Wali Santri.
- `index.html` untuk Website Utama Pondok.

---

## 📁 Struktur File Lengkap

```
sitahfidz-pondok/
├── index.html                        # Website Resmi Pondok Pesantren & PSB Online
├── portal-wali.html                  # Portal Wali Santri (3 Tab: Pendidikan, Keamanan, Ubudiyah)
├── panel-ustadz.html                 # Panel Khusus Asatidz (Presensi & Setoran Santri, PIN)
├── ustadz.js                         # Logika controller khusus Panel Asatidz
├── admin-tahfidz.html                # Panel Administrator Utama (Pendidikan, Keamanan, Ubudiyah)
├── app.js                            # Logika controller admin & state management lengkap
├── styles.css                        # Desain styling antarmuka modern & responsif
├── quran-data.js                     # Basis data 114 Surat Al-Qur'an & pemetaan Juz
├── sample-data.js                    # Database default (Santri, Pelanggaran, Izin, Jamaah, Ekskul)
├── Buka-Panel-Ustadz.command         # Launcher pintas Panel Asatidz (macOS)
├── Buka-SiTahfidz.command            # Launcher pintas Panel Admin (macOS)
├── Buka-Website-Pondok.command       # Launcher pintas Website Pondok (macOS)
├── Template_Import_Santri_Tahfidz.xlsx # Template Excel resmi impor data santri
├── Template_Import_Nilai_Ujian_Binnadzor.xlsx # Template Excel resmi impor nilai ujian Binnadzor
├── Template_Import_Presensi.xlsx      # Template Excel resmi impor presensi santri
├── Template_Import_Presensi_Ustadz.xlsx # Template Excel resmi impor presensi asatidz
├── Template_Import_Setoran.xlsx       # Template Excel resmi impor setoran harian
├── Template_Import_Rekap_Bulanan.xlsx # Template Excel resmi impor rekap bulanan
├── xlsx.full.min.js                   # Library SheetJS offline untuk ekspor/impor Excel
└── README.md                         # Dokumentasi panduan lengkap
```

---

*Alhamdulillah, semoga sistem ini mempermudah tata kelola pendidikan, menjaga kedisiplinan, dan menumbuhkan keistiqomahan ibadah para santri.*
