# 📋 Panduan Menyambungkan Formulir PSB Website ke Google Spreadsheet & Google Drive

Ikuti langkah 2 menit berikut agar setiap ada wali santri yang mendaftar dan mengunggah berkas (KK, KTP, Foto) di website, datanya **otomatis masuk ke Google Spreadsheet** dan berkas gambarnya **otomatis tersimpan rapi di Google Drive panitia**.

---

### Langkah 1: Buat Spreadsheet Baru di Google Drive
1. Buka [Google Drive](https://drive.google.com/) menggunakan akun Gmail panitia/pondok.
2. Klik tombol **+ Baru (New)** ➔ pilih **Google Spreadsheet**.
3. Beri nama spreadsheet tersebut di kiri atas, contoh: `Data Pendaftar PSB Pesantren 2025`.

---

### Langkah 2: Buka Apps Script
1. Di dalam Google Spreadsheet tersebut, klik menu atas: **Ekstensi (Extensions)** ➔ pilih **Apps Script**.
2. Anda akan melihat halaman editor kode. **Hapus semua tulisan bawaan yang ada di situ**.

---

### Langkah 3: Tempelkan (*Paste*) Kode Skrip
1. Buka file [`Kode-Google-Spreadsheet-Drive.gs`](Kode-Google-Spreadsheet-Drive.gs) yang ada di folder ini.
2. Salin (*copy*) seluruh isinya, lalu tempelkan (*paste*) ke halaman editor Apps Script tadi.
3. Klik ikon **Simpan (Save / 💾)** di bagian atas.

---

### Langkah 4: Publikasikan Skrip (Deploy as Web App)
1. Di pojok kanan atas Apps Script, klik tombol biru **Terapkan (Deploy)** ➔ pilih **Penerapan Baru (New Deployment)**.
2. Klik ikon gerigi (⚙️) di sebelah kiri tulisan *"Pilih jenis"*, lalu pilih **Aplikasi Web (Web App)**.
3. Atur pengaturannya sebagai berikut:
   * **Deskripsi**: `Webhook PSB Pesantren`
   * **Jalankan sebagai (Execute as)**: `Saya (email Anda)`
   * **Siapa yang memiliki akses (Who has access)**: **`Siapa saja (Anyone)`** *(Wajib pilih ini agar formulir website bisa mengirim data)*.
4. Klik tombol **Terapkan (Deploy)**.
5. Jika muncul jendela izin keamanan Google (*Authorization Required*):
   * Klik **Lanjutkan / Izinkan (Allow)** ➔ Pilih akun Google Anda.
   * Jika ada peringatan *"Google hasn't verified this app"*, klik **Advanced (Lanjutan)** ➔ klik **Go to Webhook PSB (unsafe)** ➔ klik **Allow**.
6. Anda akan mendapatkan **URL Aplikasi Web (Web App URL)**, contoh:
   ```text
   https://script.google.com/macros/s/AKfycbx.../exec
   ```
   Klik tombol **Salin (Copy)** pada link tersebut.

---

### Langkah 5: Masukkan Link ke Website Pesantren
1. Buka website pesantren Anda ([`index.html`](index.html)).
2. Scroll ke bagian **Pendaftaran (PSB)**.
3. Di samping formulir, klik tombol **"📋 Data Pendaftar Masuk"**.
4. Di bagian bawah modal, Anda akan melihat kolom hijau: **"📊 Sambungkan Otomatis ke Google Sheets (Spreadsheet)"**.
5. Tempelkan link Webhook tadi ke kolom tersebut, lalu klik **"💾 Simpan Link Spreadsheet"**.

---

### 🎉 Selesai! Apa yang Terjadi Sekarang?
* Setiap ada orang tua yang mengisi formulir dan mengunggah KK/KTP di website:
  1. Baris baru akan **otomatis bertambah di Google Spreadsheet Anda**.
  2. Foto KK, KTP wali, pas foto santri, dan akta kelahiran akan **otomatis tersimpan rapi di Google Drive** Anda dalam folder bernama: `Berkas Pendaftaran PSB Pesantren`.
  3. Di Google Spreadsheet, sudah ada **link langsung** untuk mengklik dan melihat foto berkas (KK, KTP, Foto Santri, Akta) calon santri tersebut!
