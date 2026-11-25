// ========================================================
// KODE GOOGLE APPS SCRIPT: PSB ONLINE KE GOOGLE SPREADSHEET & GOOGLE DRIVE
// ========================================================
// Fitur:
// 1. Menerima data pendaftaran PSB lengkap dari website pesantren
// 2. Otomatis membuat folder khusus di Google Drive panitia
// 3. Otomatis menyimpan berkas (Pas Foto, KK, KTP Wali, Akta Kelahiran) ke Google Drive
// 4. Menyimpan data dan link berkas Google Drive langsung ke Google Spreadsheet
// 
// Cara Pasang (Hanya butuh 2 Menit):
// 1. Buat Google Spreadsheet baru di Google Drive Anda
// 2. Klik menu: Ekstensi (Extensions) -> Apps Script
// 3. Hapus seluruh kode bawaan yang ada di editor tersebut
// 4. Salin (copy) dan tempel (paste) seluruh isi file ini ke Apps Script
// 5. Klik tombol "Simpan" (ikon disket / Ctrl+S / Cmd+S)
// 6. Klik tombol "Deploy" (di kanan atas) -> Pilih "Deployment Baru" (New Deployment)
// 7. Klik ikon Gerigi (Pilih jenis) -> Pilih "Aplikasi Web" (Web App)
// 8. Atur:
//    - Deskripsi: PSB Online Pesantren
//    - Jalankan sebagai (Execute as): "Saya" (Me)
//    - Akses (Who has access): "Siapa Saja" (Anyone) -> WAJIB agar formulir website bisa mengirim
// 9. Klik "Deploy" -> Berikan izin Google (Pilih Lanjutan / Advanced -> Buka (tidak aman))
// 10. Salin "URL Aplikasi Web" (URL Webhook) yang berakhiran /exec
// 11. Buka Website Pondok -> Klik tombol "Data Pendaftar Masuk" -> Tempelkan link tersebut!
// ========================================================

const NAMA_FOLDER_DRIVE = "Berkas Pendaftaran PSB Pesantren"; // Nama folder otomatis di Google Drive panitia

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    
    // Pastikan Header Tabel otomatis dibuat jika sheet masih kosong
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "No. Registrasi",
        "Tanggal Daftar",
        "Nama Lengkap Santri",
        "Nama Panggilan",
        "NIK Santri",
        "NISN",
        "Tempat Lahir",
        "Tanggal Lahir",
        "Jenis Kelamin",
        "Anak ke-",
        "Dari Bersaudara",
        "Riwayat Penyakit",
        "Asal Sekolah",
        "Sekolah yang Dituju",
        "Status Daftar Sekolah",
        "Riwayat Hafalan",
        "Nama Ayah",
        "Pekerjaan Ayah",
        "Nama Ibu",
        "Pekerjaan Ibu",
        "No. WhatsApp Wali",
        "Penghasilan Ortu",
        "Alamat Lengkap",
        "Link Pas Foto (Drive)",
        "Link Foto KK (Drive)",
        "Link Foto KTP (Drive)",
        "Link Foto Akta (Drive)",
        "Status Seleksi"
      ]);
      // Format header: Huruf tebal & background hijau rapi
      sheet.getRange(1, 1, 1, 28).setFontWeight("bold").setBackground("#d1fae5").setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    // Dapatkan atau buat Folder di Google Drive panitia
    const folder = getOrCreateFolder(NAMA_FOLDER_DRIVE);

    // Simpan Dokumen KK, KTP, Foto Santri, dan Akta ke Google Drive
    let linkFotoSantri = "-";
    let linkFotoKK = "-";
    let linkFotoKTP = "-";
    let linkFotoAkta = "-";

    const cleanNama = (data.nama || "Santri").replace(/[^a-zA-Z0-9]/g, "_");
    const regNo = data.noRegistrasi || ("REG-" + Date.now());

    if (data.fileFotoSantri && data.fileFotoSantri.indexOf("base64,") !== -1) {
      linkFotoSantri = saveBase64ToDrive(folder, data.fileFotoSantri, "PAS_FOTO_" + regNo + "_" + cleanNama);
    }

    if (data.fileFotoKK && data.fileFotoKK.indexOf("base64,") !== -1) {
      linkFotoKK = saveBase64ToDrive(folder, data.fileFotoKK, "KK_" + regNo + "_" + cleanNama);
    }

    if (data.fileFotoKTP && data.fileFotoKTP.indexOf("base64,") !== -1) {
      linkFotoKTP = saveBase64ToDrive(folder, data.fileFotoKTP, "KTP_" + regNo + "_" + cleanNama);
    }

    if (data.fileFotoAkta && data.fileFotoAkta.indexOf("base64,") !== -1) {
      linkFotoAkta = saveBase64ToDrive(folder, data.fileFotoAkta, "AKTA_" + regNo + "_" + cleanNama);
    }

    // Tulis baris data pendaftar baru ke Google Spreadsheet
    sheet.appendRow([
      data.noRegistrasi || "-",
      data.tanggalDaftar || new Date().toISOString().split('T')[0],
      data.nama || "-",
      data.namaPanggilan || "-",
      data.nik ? "'" + data.nik : "-",
      data.nisn ? "'" + data.nisn : "-",
      data.tempatLahir || "-",
      data.tanggalLahir || "-",
      data.jenisKelamin === "L" ? "Laki-laki (Putra)" : "Perempuan (Putri)",
      data.anakKe || "-",
      data.jumlahSaudara || "-",
      data.riwayatPenyakit || "-",
      data.asalSekolah || "-",
      data.sekolahTujuan || data.programPilihan || "-",
      data.statusDaftarSekolah || "-",
      data.riwayatHafalan || "-",
      data.namaAyah || data.namaWali || "-",
      data.pekerjaanAyah || "-",
      data.namaIbu || "-",
      data.pekerjaanIbu || "-",
      data.noWaWali ? "'" + data.noWaWali : "-",
      data.penghasilan || "-",
      data.alamat || "-",
      linkFotoSantri,
      linkFotoKK,
      linkFotoKTP,
      linkFotoAkta,
      data.status || "Menunggu Seleksi"
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data dan berkas berhasil disimpan ke Google Spreadsheet & Google Drive",
      noRegistrasi: data.noRegistrasi
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Helper: Cari atau buat folder di Google Drive
function getOrCreateFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(folderName);
}

// Helper: Simpan gambar Base64 langsung menjadi file di Google Drive
function saveBase64ToDrive(folder, base64String, fileName) {
  try {
    const parts = base64String.split(",");
    const contentType = parts[0].split(";")[0].replace("data:", "") || "image/jpeg";
    const decodedBytes = Utilities.base64Decode(parts[1]);
    const blob = Utilities.newBlob(decodedBytes, contentType, fileName + ".jpg");
    const file = folder.createFile(blob);
    // Berikan izin view agar panitia bisa langsung mengklik tautannya dari Spreadsheet
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();
  } catch (err) {
    return "Gagal menyimpan berkas: " + err.toString();
  }
}
