// Data Awal & Konfigurasi Default SiTahfidz
const DEFAULT_SETTINGS = {
  namaPondok: "Asrama Tahfidz Sunan Bonang",
  yayasanPondok: "Yayasan PP. Mamba'ul Ma'arif",
  lokasiPondok: "Denanyar Jombang",
  alamatPondok: "Jl. KH. Bisri Syansuri, Denanyar, Jombang, Jawa Timur",
  pengasuhPondok: "H. M. Jauharul Afif, Lc., M.Ag., M.Pd.",
  pengasuhIstri: "Hj. Mazidatul Faizah, M.Si.",
  fotoPengasuh: "",
  fotoPengasuhIstri: "",
  heroBannerPhoto: "",
  kepalaTahfidz: "Ust. Misbakhul Mujtahidin",
  noKontakPondok: "0812-3456-7890",
  noKontakPutri: "0813-9876-5432",
  tahunAjaran: "2025/2026",
  logoPondok: "", // Base64 atau kosong (default kaligrafi / icon masjid)
  medsos: {
    igPutra: "@sunanbonang_putra",
    igPutri: "@sunanbonang_putri",
    tiktokPutra: "@tahfidz_sunanbonang",
    tiktokPutri: "@tahfidz_sunanbonang_pi",
    youtube: "Asrama Tahfidz Sunan Bonang TV",
    facebook: "Asrama Tahfidz Sunan Bonang Denanyar"
  },
  sesiSetoran: [
    "Shubuh (05.30 - 06.45)",
    "Ashar (16.00 - 17.15)",
    "Maghrib / Isya (18.30 - 20.00)"
  ],
  // 1. Program Binnadzor: Berdasarkan Kelas & Asatidz Pengampu
  daftarKelasBinnadzor: [
    "Kelas A (Ust. Yogi)",
    "Kelas B1 (Ust. Kaffa)",
    "Kelas B2 (Ust. Haqi)",
    "Kelas B3 (Ust. Sholah)",
    "Kelas C1 (Ust. Hafi)",
    "Kelas C2 (Ust. Alfan)",
    "Kelas C3 (Ust. Rosyid)",
    "Kelas D1 (Ust. Bayu)",
    "Kelas D2 (Ust. Arul)",
    "Kelas D3 (Ust. Muhith)",
    "Kelas E1 (Ust. Adin)",
    "Kelas E2 (Ust. Rizki)"
  ],
  // 2. Program Tahfidz: Sistem Halaqah Asatidz Tahfidz
  daftarHalaqahTahfidz: [
    "Halaqah Ust. Misbakhul Mujtahidin",
    "Halaqah Ust. Syafi'ul Kholid",
    "Halaqah Ust. Mudzakkir",
    "Halaqah Ust. Burhan",
    "Halaqah Ust. M. Abdul Ghoffar Wijoyo",
    "Halaqah Ust. Fatih Bagus Aslamudin",
    "Halaqah Ust. Fahmi",
    "Halaqah Ust. Izzul Walady",
    "Halaqah Ust. Rosyid Ridho"
  ],
  // 3. Program Pasca Tahfidz: Khusus santri yang telah khatam & wisuda 30 Juz
  daftarHalaqahPascaTahfidz: [
    "Halaqah Pasca Tahfidz H. M. Jauharul Afif, Lc., M.Ag., M.Pd."
  ],
  // Backward compatibility daftar halaqah
  daftarHalaqah: [
    "Kelas A (Ust. Yogi)",
    "Kelas B1 (Ust. Kaffa)",
    "Kelas B2 (Ust. Haqi)",
    "Kelas B3 (Ust. Sholah)",
    "Kelas C1 (Ust. Hafi)",
    "Kelas C2 (Ust. Alfan)",
    "Kelas C3 (Ust. Rosyid)",
    "Kelas D1 (Ust. Bayu)",
    "Kelas D2 (Ust. Arul)",
    "Kelas D3 (Ust. Muhith)",
    "Kelas E1 (Ust. Adin)",
    "Kelas E2 (Ust. Rizki)",
    "Halaqah Ust. Misbakhul Mujtahidin",
    "Halaqah Ust. Syafi'ul Kholid",
    "Halaqah Ust. Mudzakkir",
    "Halaqah Ust. Burhan",
    "Halaqah Ust. M. Abdul Ghoffar Wijoyo",
    "Halaqah Ust. Fatih Bagus Aslamudin",
    "Halaqah Ust. Fahmi",
    "Halaqah Ust. Izzul Walady",
    "Halaqah Ust. Rosyid Ridho",
    "Halaqah Pasca Tahfidz H. M. Jauharul Afif, Lc., M.Ag., M.Pd."
  ],
  kamarList: [
    "Asrama Umar / Kamar 01",
    "Asrama Umar / Kamar 02",
    "Asrama Abu Bakar / Kamar 01",
    "Asrama Abu Bakar / Kamar 02",
    "Asrama Utsman / Kamar 01",
    "Asrama Khadijah / Kamar Putri 01",
    "Asrama Khadijah / Kamar Putri 02",
    "Asrama Aisyah / Kamar Putri 01"
  ],
  // Kebijakan Hari Aktif & Libur Pondok
  hariAktifSetoran: ["Sabtu", "Ahad", "Senin", "Selasa", "Rabu"],
  hariLiburRutin: ["Kamis", "Jumat"],
  daftarHariLiburKondisional: [
    { tanggal: "2024-08-17", keterangan: "Upacara Peringatan HUT Kemerdekaan RI" },
    { tanggal: "2024-09-16", keterangan: "Peringatan Maulid Nabi Muhammad SAW" },
    { tanggal: "2024-10-22", keterangan: "Peringatan Hari Santri Nasional" }
  ],
  accessPin: "123456",       // 👑 PIN Administrator Utama (Akses Semua Fitur Pondok)
  pendidikanPin: "111111",   // 📚 PIN Pengurus Pendidikan (Hanya Fitur Pendidikan & Tahfidz)
  keamananPin: "222222",     // 🛡️ PIN Pengurus Keamanan (Hanya Fitur Keamanan & Perizinan)
  ubudiyahPin: "333333",     // 🕌 PIN Pengurus Ubudiyah (Hanya Fitur Shalat Jamaah & Ekskul)
  ustadzPin: "888888",       // 👳‍♂️ PIN Khusus Asatidz (Akses Presensi & Hasil Setoran Harian)
  isPinProtected: true,
  // Akun Pengurus Terdaftar (Whitelist Email & Password Pengurus Divisi: 5 Akun per Divisi)
  pengurusAccounts: [
    // --- 👑 DIVISI ADMINISTRATOR (5 AKUN) ---
    {
      id: "ACC-ADM-01",
      nama: "Administrator Utama",
      email: "admin@sunanbonang.id",
      password: "admin",
      role: "ADMIN",
      status: "Aktif",
      divisi: "Pimpinan & Sekretariat Utama"
    },
    {
      id: "ACC-ADM-02",
      nama: "Sekretaris Pesantren (Admin 2)",
      email: "admin2@sunanbonang.id",
      password: "admin",
      role: "ADMIN",
      status: "Aktif",
      divisi: "Sekretariat Pesantren"
    },
    {
      id: "ACC-ADM-03",
      nama: "Lurah Pondok (Admin 3)",
      email: "admin3@sunanbonang.id",
      password: "admin",
      role: "ADMIN",
      status: "Aktif",
      divisi: "Kepengurusan Pondok"
    },
    {
      id: "ACC-ADM-04",
      nama: "Kepala Biro Tahfidz (Admin 4)",
      email: "admin4@sunanbonang.id",
      password: "admin",
      role: "ADMIN",
      status: "Aktif",
      divisi: "Biro Tahfidz Al-Qur'an"
    },
    {
      id: "ACC-ADM-05",
      nama: "Operator Sistem IT (Admin 5)",
      email: "admin5@sunanbonang.id",
      password: "admin",
      role: "ADMIN",
      status: "Aktif",
      divisi: "Teknologi Informasi & Database"
    },

    // --- 📚 DIVISI PENDIDIKAN (5 AKUN) ---
    {
      id: "ACC-PDK-01",
      nama: "Koordinator Pendidikan (Pendidikan 1)",
      email: "pendidikan@sunanbonang.id",
      password: "pendidikan",
      role: "PENDIDIKAN",
      status: "Aktif",
      divisi: "Pendidikan & Kurikulum Tahfidz"
    },
    {
      id: "ACC-PDK-02",
      nama: "Staf Kurikulum & Ujian (Pendidikan 2)",
      email: "pendidikan2@sunanbonang.id",
      password: "pendidikan",
      role: "PENDIDIKAN",
      status: "Aktif",
      divisi: "Pendidikan - Ujian & MHQ"
    },
    {
      id: "ACC-PDK-03",
      nama: "Staf Mutaba'ah Juz (Pendidikan 3)",
      email: "pendidikan3@sunanbonang.id",
      password: "pendidikan",
      role: "PENDIDIKAN",
      status: "Aktif",
      divisi: "Pendidikan - Evaluasi Mutaba'ah"
    },
    {
      id: "ACC-PDK-04",
      nama: "Staf Presensi Halaqah (Pendidikan 4)",
      email: "pendidikan4@sunanbonang.id",
      password: "pendidikan",
      role: "PENDIDIKAN",
      status: "Aktif",
      divisi: "Pendidikan - Absensi Halaqah"
    },
    {
      id: "ACC-PDK-05",
      nama: "Staf Administrasi Wisuda (Pendidikan 5)",
      email: "pendidikan5@sunanbonang.id",
      password: "pendidikan",
      role: "PENDIDIKAN",
      status: "Aktif",
      divisi: "Pendidikan - Wisuda & Syahadah"
    },

    // --- 🛡️ DIVISI KEAMANAN (5 AKUN) ---
    {
      id: "ACC-KMN-01",
      nama: "Koordinator Keamanan (Keamanan 1)",
      email: "keamanan@sunanbonang.id",
      password: "keamanan",
      role: "KEAMANAN",
      status: "Aktif",
      divisi: "Keamanan & Ketertiban Umum"
    },
    {
      id: "ACC-KMN-02",
      nama: "Piket Asrama Putra (Keamanan 2)",
      email: "keamanan2@sunanbonang.id",
      password: "keamanan",
      role: "KEAMANAN",
      status: "Aktif",
      divisi: "Keamanan Asrama Putra"
    },
    {
      id: "ACC-KMN-03",
      nama: "Piket Asrama Putri (Keamanan 3)",
      email: "keamanan3@sunanbonang.id",
      password: "keamanan",
      role: "KEAMANAN",
      status: "Aktif",
      divisi: "Keamanan Asrama Putri"
    },
    {
      id: "ACC-KMN-04",
      nama: "Petugas Perizinan Santri (Keamanan 4)",
      email: "keamanan4@sunanbonang.id",
      password: "keamanan",
      role: "KEAMANAN",
      status: "Aktif",
      divisi: "Keamanan - Layanan Perizinan"
    },
    {
      id: "ACC-KMN-05",
      nama: "Petugas Disiplin & Takziran (Keamanan 5)",
      email: "keamanan5@sunanbonang.id",
      password: "keamanan",
      role: "KEAMANAN",
      status: "Aktif",
      divisi: "Keamanan - Disiplin Santri"
    },

    // --- 🕌 DIVISI UBUDIYAH (5 AKUN) ---
    {
      id: "ACC-UBD-01",
      nama: "Koordinator Ubudiyah (Ubudiyah 1)",
      email: "ubudiyah@sunanbonang.id",
      password: "ubudiyah",
      role: "UBUDIYAH",
      status: "Aktif",
      divisi: "Ubudiyah & Peribadatan Santri"
    },
    {
      id: "ACC-UBD-02",
      nama: "Piket Shalat Subuh & Zhuhur (Ubudiyah 2)",
      email: "ubudiyah2@sunanbonang.id",
      password: "ubudiyah",
      role: "UBUDIYAH",
      status: "Aktif",
      divisi: "Ubudiyah - Jamaah Subuh & Zhuhur"
    },
    {
      id: "ACC-UBD-03",
      nama: "Piket Shalat Ashar, Maghrib, Isya (Ubudiyah 3)",
      email: "ubudiyah3@sunanbonang.id",
      password: "ubudiyah",
      role: "UBUDIYAH",
      status: "Aktif",
      divisi: "Ubudiyah - Jamaah Ashar, Maghrib, Isya"
    },
    {
      id: "ACC-UBD-04",
      nama: "Pembina Ekskul Keagamaan (Ubudiyah 4)",
      email: "ubudiyah4@sunanbonang.id",
      password: "ubudiyah",
      role: "UBUDIYAH",
      status: "Aktif",
      divisi: "Ubudiyah - Ekskul & Seni Islami"
    },
    {
      id: "ACC-UBD-05",
      nama: "Petugas Rekap Ibadah (Ubudiyah 5)",
      email: "ubudiyah5@sunanbonang.id",
      password: "ubudiyah",
      role: "UBUDIYAH",
      status: "Aktif",
      divisi: "Ubudiyah - Laporan & Evaluasi"
    }
  ],
  // Pengaturan Background Transparan Aplikasi
  backgroundType: "preset_mosque", // "preset_mosque" | "preset_geometry" | "preset_quran" | "custom" | "none"
  customBackground: "",            // Data URL Base64 jika mengunggah foto sendiri
  backgroundOpacity: 0.12,         // 0.04 s/d 0.35 (default 12% agar teks tetap sangat nyaman dibaca)
  backgroundMode: "cover"          // "cover" | "repeat" | "center"
};

// ================= PRESET WALLPAPER ISLAMI ELEGAN =================
const BACKGROUND_PRESETS = {
  preset_mosque: {
    id: "preset_mosque",
    name: "Kubah Masjid & Menara Syahdu",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800' fill='none' stroke='%23059669' stroke-width='1.5' opacity='0.85'><circle cx='150' cy='120' r='2' fill='%23059669'/><circle cx='350' cy='80' r='1.5' fill='%23059669'/><circle cx='600' cy='60' r='2.5' fill='%23059669'/><circle cx='850' cy='90' r='2' fill='%23059669'/><circle cx='1050' cy='140' r='1.5' fill='%23059669'/><path d='M600 90 A35 35 0 1 1 575 145 A45 45 0 1 0 600 90 Z' fill='%23059669'/><path d='M420 550 C420 380 490 280 600 220 C710 280 780 380 780 550 Z' fill='none' stroke='%23059669' stroke-width='2.5'/><line x1='600' y1='220' x2='600' y2='175' stroke='%23059669' stroke-width='2.5'/><path d='M600 175 A10 10 0 1 1 595 190 A14 14 0 1 0 600 175 Z' fill='%23059669'/><path d='M250 550 C250 420 310 340 390 300 C430 330 450 380 460 450' fill='none' stroke='%23059669' stroke-width='2'/><line x1='390' y1='300' x2='390' y2='265' stroke='%23059669' stroke-width='2'/><path d='M950 550 C950 420 890 340 810 300 C770 330 750 380 740 450' fill='none' stroke='%23059669' stroke-width='2'/><line x1='810' y1='300' x2='810' y2='265' stroke='%23059669' stroke-width='2'/><line x1='120' y1='650' x2='120' y2='240' stroke='%23059669' stroke-width='3'/><line x1='145' y1='650' x2='145' y2='240' stroke='%23059669' stroke-width='3'/><rect x='110' y='240' width='45' height='20' rx='3' fill='none' stroke='%23059669' stroke-width='2'/><path d='M110 240 L132.5 150 L155 240 Z' fill='none' stroke='%23059669' stroke-width='2'/><line x1='1055' y1='650' x2='1055' y2='240' stroke='%23059669' stroke-width='3'/><line x1='1080' y1='650' x2='1080' y2='240' stroke='%23059669' stroke-width='3'/><rect x='1045' y='240' width='45' height='20' rx='3' fill='none' stroke='%23059669' stroke-width='2'/><path d='M1045 240 L1067.5 150 L1090 240 Z' fill='none' stroke='%23059669' stroke-width='2'/><path d='M0 650 L1200 650' stroke='%23059669' stroke-width='2'/><path d='M520 650 C520 540 560 490 600 490 C640 490 680 540 680 650' stroke='%23059669' stroke-width='2'/></svg>",
    size: "cover",
    repeat: "no-repeat",
    position: "center center"
  },
  preset_geometry: {
    id: "preset_geometry",
    name: "Pola Ornamen Arabesque Islami",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><g fill='none' stroke='%23059669' stroke-width='1.2' opacity='0.75'><path d='M60 0 L120 60 L60 120 L0 60 Z'/><path d='M60 15 L105 60 L60 105 L15 60 Z'/><circle cx='60' cy='60' r='28'/><circle cx='60' cy='60' r='14'/><path d='M0 0 L120 120 M120 0 L0 120'/><path d='M60 0 L60 120 M0 60 L120 60'/><circle cx='0' cy='0' r='20'/><circle cx='120' cy='0' r='20'/><circle cx='0' cy='120' r='20'/><circle cx='120' cy='120' r='20'/></g></svg>",
    size: "120px 120px",
    repeat: "repeat",
    position: "center center"
  },
  preset_quran: {
    id: "preset_quran",
    name: "Mushaf Al-Qur'an & Rehal Emas",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800' fill='none' stroke='%23d97706' stroke-width='1.8' opacity='0.8'><circle cx='400' cy='360' r='220' stroke='%23d97706' stroke-dasharray='4,8' stroke-width='1.5'/><circle cx='400' cy='360' r='260' stroke='%23d97706' stroke-dasharray='6,12' stroke-width='1.2'/><path d='M400 380 C340 350 260 355 180 370 C180 270 260 250 340 265 C370 270 390 280 400 290 Z' fill='none' stroke='%23d97706' stroke-width='2.5'/><path d='M400 380 C460 350 540 355 620 370 C620 270 540 250 460 265 C430 270 410 280 400 290 Z' fill='none' stroke='%23d97706' stroke-width='2.5'/><line x1='400' y1='290' x2='400' y2='385' stroke='%23d97706' stroke-width='3'/><path d='M230 300 Q290 290 350 305 M220 325 Q290 315 360 330 M210 350 Q290 340 370 355' stroke='%23d97706' stroke-width='1.2'/><path d='M570 300 Q510 290 450 305 M580 325 Q510 315 440 330 M590 350 Q510 340 430 355' stroke='%23d97706' stroke-width='1.2'/><path d='M240 540 L400 380 L560 540 M280 540 L400 420 L520 540' stroke='%23d97706' stroke-width='3.5'/><path d='M220 560 L400 480 L580 560' stroke='%23d97706' stroke-width='2.5'/></svg>",
    size: "contain",
    repeat: "no-repeat",
    position: "center center"
  },
  none: {
    id: "none",
    name: "Polos / Tanpa Gambar",
    url: "none",
    size: "auto",
    repeat: "no-repeat",
    position: "center center"
  }
};

function applyAppBackground(customSettings) {
  let s = customSettings;
  if (!s) {
    try {
      if (typeof AppState !== 'undefined' && AppState && AppState.settings) {
        s = AppState.settings;
      } else {
        const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('sitahfidz_settings') : null;
        s = saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
      }
    } catch (e) {
      s = DEFAULT_SETTINGS;
    }
  }

  const bgType = (s && s.backgroundType) || 'preset_mosque';
  const customBg = (s && s.customBackground) || '';
  const opacity = (s && typeof s.backgroundOpacity === 'number') ? s.backgroundOpacity : 0.12;
  const mode = (s && s.backgroundMode) || 'cover';

  let bgUrl = 'none';
  let bgSize = mode === 'repeat' ? '120px 120px' : (mode === 'center' ? 'contain' : 'cover');
  let bgRepeat = mode === 'repeat' ? 'repeat' : 'no-repeat';
  let bgPos = 'center center';

  if (bgType === 'custom' && customBg) {
    bgUrl = `url("${customBg}")`;
    if (mode === 'repeat') {
      bgSize = 'auto';
      bgRepeat = 'repeat';
    } else if (mode === 'center') {
      bgSize = 'contain';
      bgRepeat = 'no-repeat';
    } else {
      bgSize = 'cover';
      bgRepeat = 'no-repeat';
    }
  } else if (BACKGROUND_PRESETS[bgType]) {
    const p = BACKGROUND_PRESETS[bgType];
    bgUrl = p.url === 'none' ? 'none' : `url("${p.url}")`;
    if (mode === 'repeat' && bgType === 'preset_geometry') {
      bgSize = '120px 120px';
      bgRepeat = 'repeat';
    } else if (mode === 'repeat') {
      bgSize = 'auto';
      bgRepeat = 'repeat';
    } else if (mode === 'center') {
      bgSize = 'contain';
      bgRepeat = 'no-repeat';
    } else {
      bgSize = p.size || 'cover';
      bgRepeat = p.repeat || 'no-repeat';
    }
  }

  if (typeof document !== 'undefined' && document.body && document.body.style) {
    document.body.style.setProperty('--app-bg-image', bgUrl);
    document.body.style.setProperty('--app-bg-opacity', opacity);
    document.body.style.setProperty('--app-bg-size', bgSize);
    document.body.style.setProperty('--app-bg-repeat', bgRepeat);
    document.body.style.setProperty('--app-bg-pos', bgPos);
  }
}

// Auto apply on load
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => applyAppBackground());
  } else {
    applyAppBackground();
  }
}

const SAMPLE_SANTRI = [];

// Helper untuk tanggal format YYYY-MM-DD
function getTodayDateStr(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

const SAMPLE_SETORAN = [];

const SAMPLE_ABSENSI = [];

// ================= DATA ASATIDZ & PRESENSI GURU TAHFIDZ =================
const SAMPLE_USTADZ = [
  { id: "UST-001", nama: "Ust. Misbakhul Mujtahidin", peran: "Musyrif Tahfidz", halaqah: "Halaqah Ust. Misbakhul Mujtahidin", noHp: "0812-1111-2001", status: "Aktif" },
  { id: "UST-002", nama: "Ust. Syafi'ul Kholid", peran: "Musyrif Tahfidz", halaqah: "Halaqah Ust. Syafi'ul Kholid", noHp: "0812-1111-2002", status: "Aktif" },
  { id: "UST-003", nama: "Ust. Mudzakkir", peran: "Musyrif Tahfidz", halaqah: "Halaqah Ust. Mudzakkir", noHp: "0812-1111-2003", status: "Aktif" },
  { id: "UST-004", nama: "Ust. Burhan", peran: "Musyrif Tahfidz", halaqah: "Halaqah Ust. Burhan", noHp: "0812-1111-2004", status: "Aktif" },
  { id: "UST-005", nama: "Ust. M. Abdul Ghoffar Wijoyo", peran: "Musyrif Tahfidz", halaqah: "Halaqah Ust. M. Abdul Ghoffar Wijoyo", noHp: "0812-1111-2005", status: "Aktif" },
  { id: "UST-006", nama: "Ust. Fatih Bagus Aslamudin", peran: "Musyrif Tahfidz", halaqah: "Halaqah Ust. Fatih Bagus Aslamudin", noHp: "0812-1111-2006", status: "Aktif" },
  { id: "UST-007", nama: "Ust. Fahmi", peran: "Musyrif Tahfidz", halaqah: "Halaqah Ust. Fahmi", noHp: "0812-1111-2007", status: "Aktif" },
  { id: "UST-008", nama: "Ust. Izzul Walady", peran: "Musyrif Tahfidz", halaqah: "Halaqah Ust. Izzul Walady", noHp: "0812-1111-2008", status: "Aktif" },
  { id: "UST-009", nama: "Ust. Rosyid Ridho", peran: "Musyrif Tahfidz", halaqah: "Halaqah Ust. Rosyid Ridho", noHp: "0812-1111-2009", status: "Aktif" },
  { id: "UST-010", nama: "H. M. Jauharul Afif, Lc., M.Ag., M.Pd.", peran: "Pengasuh Pondok", halaqah: "Halaqah Pasca Tahfidz H. M. Jauharul Afif, Lc., M.Ag., M.Pd.", noHp: "0812-1111-2000", status: "Aktif" },
  { id: "UST-011", nama: "Ust. Yogi", peran: "Pengajar Binnadzor", halaqah: "Kelas A (Ust. Yogi)", noHp: "0812-1111-2011", status: "Aktif" },
  { id: "UST-012", nama: "Ust. Kaffa", peran: "Pengajar Binnadzor", halaqah: "Kelas B1 (Ust. Kaffa)", noHp: "0812-1111-2012", status: "Aktif" },
  { id: "UST-013", nama: "Ust. Haqi", peran: "Pengajar Binnadzor", halaqah: "Kelas B2 (Ust. Haqi)", noHp: "0812-1111-2013", status: "Aktif" },
  { id: "UST-014", nama: "Ust. Sholah", peran: "Pengajar Binnadzor", halaqah: "Kelas B3 (Ust. Sholah)", noHp: "0812-1111-2014", status: "Aktif" },
  { id: "UST-015", nama: "Ust. Hafi", peran: "Pengajar Binnadzor", halaqah: "Kelas C1 (Ust. Hafi)", noHp: "0812-1111-2015", status: "Aktif" },
  { id: "UST-016", nama: "Ust. Alfan", peran: "Pengajar Binnadzor", halaqah: "Kelas C2 (Ust. Alfan)", noHp: "0812-1111-2016", status: "Aktif" },
  { id: "UST-017", nama: "Ust. Rosyid", peran: "Pengajar Binnadzor", halaqah: "Kelas C3 (Ust. Rosyid)", noHp: "0812-1111-2017", status: "Aktif" },
  { id: "UST-018", nama: "Ust. Bayu", peran: "Pengajar Binnadzor", halaqah: "Kelas D1 (Ust. Bayu)", noHp: "0812-1111-2018", status: "Aktif" },
  { id: "UST-019", nama: "Ust. Arul", peran: "Pengajar Binnadzor", halaqah: "Kelas D2 (Ust. Arul)", noHp: "0812-1111-2019", status: "Aktif" },
  { id: "UST-020", nama: "Ust. Muhith", peran: "Pengajar Binnadzor", halaqah: "Kelas D3 (Ust. Muhith)", noHp: "0812-1111-2020", status: "Aktif" },
  { id: "UST-021", nama: "Ust. Adin", peran: "Pengajar Binnadzor", halaqah: "Kelas E1 (Ust. Adin)", noHp: "0812-1111-2021", status: "Aktif" },
  { id: "UST-022", nama: "Ust. Rizki", peran: "Pengajar Binnadzor", halaqah: "Kelas E2 (Ust. Rizki)", noHp: "0812-1111-2022", status: "Aktif" }
];

const SAMPLE_ABSENSI_USTADZ = [
  // Hari Ini - Sesi Shubuh
  {
    id: "ABSUST-001",
    tanggal: getTodayDateStr(0),
    sesi: "Shubuh (05.30 - 06.45)",
    ustadzId: "UST-001",
    ustadzNama: "Ust. Muhammad Ridwan, S.Pd.I., Al-Hafidz",
    peran: "Kepala Tahfidz",
    halaqah: "Halaqah Ust. Muhammad Ridwan, Al-Hafidz",
    status: "Hadir",
    badal: "",
    keterangan: "Tepat waktu",
    dicatatOleh: "Admin Tahfidz"
  },
  {
    id: "ABSUST-002",
    tanggal: getTodayDateStr(0),
    sesi: "Shubuh (05.30 - 06.45)",
    ustadzId: "UST-002",
    ustadzNama: "Ust. Zainal Abidin, Al-Hafidz",
    peran: "Musyrif Tahfidz Putra",
    halaqah: "Halaqah Ust. Zainal Abidin, Al-Hafidz",
    status: "Hadir",
    badal: "",
    keterangan: "Hadir halaqah",
    dicatatOleh: "Admin Tahfidz"
  },
  {
    id: "ABSUST-003",
    tanggal: getTodayDateStr(0),
    sesi: "Shubuh (05.30 - 06.45)",
    ustadzId: "UST-006",
    ustadzNama: "Ust. Miftah Faridl",
    peran: "Pengajar Binnadzor",
    halaqah: "Kelas A1 (Ust. Miftah Faridl)",
    status: "Badal",
    badal: "Ust. Hasan Basri",
    keterangan: "Izin keperluan keluarga, dibadalkan Ust. Hasan Basri",
    dicatatOleh: "Admin Tahfidz"
  },
  {
    id: "ABSUST-004",
    tanggal: getTodayDateStr(0),
    sesi: "Shubuh (05.30 - 06.45)",
    ustadzId: "UST-010",
    ustadzNama: "Ustdzh. Maryam Ulfah",
    peran: "Pengajar Binnadzor Putri",
    halaqah: "Kelas Putri A1 (Ustdzh. Maryam Ulfah)",
    status: "Hadir",
    badal: "",
    keterangan: "Hadir tepat waktu",
    dicatatOleh: "Admin Tahfidz"
  },
  {
    id: "ABSUST-005",
    tanggal: getTodayDateStr(0),
    sesi: "Shubuh (05.30 - 06.45)",
    ustadzId: "UST-012",
    ustadzNama: "Ust. Wildan, Al-Hafidz",
    peran: "Musyrif Tahfidz Putra",
    halaqah: "Halaqah Ust. Wildan, Al-Hafidz",
    status: "Hadir",
    badal: "",
    keterangan: "Menyimak setoran halaqah",
    dicatatOleh: "Admin Tahfidz"
  },
  {
    id: "ABSUST-006",
    tanggal: getTodayDateStr(0),
    sesi: "Shubuh (05.30 - 06.45)",
    ustadzId: "UST-004",
    ustadzNama: "Ustdzh. Nurul Hidayah, Al-Hafidzah",
    peran: "Musyrifah Tahfidz Putri",
    halaqah: "Halaqah Ustdzh. Nurul Hidayah, Al-Hafidzah",
    status: "Hadir",
    badal: "",
    keterangan: "Hadir menyimak",
    dicatatOleh: "Admin Tahfidz"
  },
  // Rekaman Sesi Sebelumnya (Kemarin & Hari Lalu)
  {
    id: "ABSUST-010",
    tanggal: getTodayDateStr(-1),
    sesi: "Ashar (16.00 - 17.15)",
    ustadzId: "UST-001",
    ustadzNama: "Ust. Muhammad Ridwan, S.Pd.I., Al-Hafidz",
    peran: "Kepala Tahfidz",
    halaqah: "Halaqah Ust. Muhammad Ridwan, Al-Hafidz",
    status: "Hadir",
    badal: "",
    keterangan: "Tepat waktu",
    dicatatOleh: "Admin Tahfidz"
  },
  {
    id: "ABSUST-011",
    tanggal: getTodayDateStr(-1),
    sesi: "Ashar (16.00 - 17.15)",
    ustadzId: "UST-012",
    ustadzNama: "Ust. Wildan, Al-Hafidz",
    peran: "Musyrif Tahfidz Putra",
    halaqah: "Halaqah Ust. Wildan, Al-Hafidz",
    status: "Hadir",
    badal: "",
    keterangan: "Menyimak setoran",
    dicatatOleh: "Admin Tahfidz"
  },
  {
    id: "ABSUST-012",
    tanggal: getTodayDateStr(-1),
    sesi: "Ashar (16.00 - 17.15)",
    ustadzId: "UST-002",
    ustadzNama: "Ust. Zainal Abidin, Al-Hafidz",
    peran: "Musyrif Tahfidz Putra",
    halaqah: "Halaqah Ust. Zainal Abidin, Al-Hafidz",
    status: "Izin",
    badal: "",
    keterangan: "Dinas luar pondok",
    dicatatOleh: "Admin Tahfidz"
  },
  {
    id: "ABSUST-013",
    tanggal: getTodayDateStr(-2),
    sesi: "Shubuh (05.30 - 06.45)",
    ustadzId: "UST-001",
    ustadzNama: "Ust. Muhammad Ridwan, S.Pd.I., Al-Hafidz",
    peran: "Kepala Tahfidz",
    halaqah: "Halaqah Ust. Muhammad Ridwan, Al-Hafidz",
    status: "Hadir",
    badal: "",
    keterangan: "Tepat waktu",
    dicatatOleh: "Admin Tahfidz"
  },
  {
    id: "ABSUST-014",
    tanggal: getTodayDateStr(-2),
    sesi: "Shubuh (05.30 - 06.45)",
    ustadzId: "UST-012",
    ustadzNama: "Ust. Wildan, Al-Hafidz",
    peran: "Musyrif Tahfidz Putra",
    halaqah: "Halaqah Ust. Wildan, Al-Hafidz",
    status: "Hadir",
    badal: "",
    keterangan: "Tepat waktu",
    dicatatOleh: "Admin Tahfidz"
  }
];

// Basis Data Simulasi Ujian Semester & Evaluasi Perombakan Kelas
const SAMPLE_UJIAN_SEMESTER = [];

// ================= DIVISI KEAMANAN (PELANGGARAN & TAKZIRAN) =================
const SAMPLE_PELANGGARAN = [];

// ================= DIVISI KEAMANAN (PERIZINAN PULANG & KELUAR) =================
const SAMPLE_PERIZINAN = [];

// ================= DIVISI UBUDIYAH (PRESENSI SHALAT BERJAMAAH) =================
const SAMPLE_UBUDIYAH_JAMAAH = [];

// ================= DIVISI UBUDIYAH (KEGIATAN & EKSTRAKURIKULER) =================
const SAMPLE_UBUDIYAH_EKSKUL = [];

// ================= DOKUMENTASI & GALERI FOTO PESANTREN =================
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const FALLBACK_PHOTO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23064e3b"/><stop offset="50%" stop-color="%23047857"/><stop offset="100%" stop-color="%23065f46"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23g)"/><circle cx="400" cy="200" r="110" fill="none" stroke="%23f59e0b" stroke-width="2" opacity="0.3"/><circle cx="400" cy="200" r="85" fill="none" stroke="%23f59e0b" stroke-width="1.5" opacity="0.4"/><text x="400" y="195" font-family="sans-serif" font-size="52" fill="%23ffffff" text-anchor="middle" font-weight="bold">🕌</text><text x="400" y="240" font-family="sans-serif" font-size="20" fill="%23f59e0b" text-anchor="middle" font-weight="bold">DOKUMENTASI PESANTREN</text><text x="400" y="268" font-family="sans-serif" font-size="14" fill="%23a7f3d0" text-anchor="middle">Pondok Pesantren Tahfidz Al-Qur'an</text></svg>`;

const DEFAULT_GALLERY_PHOTOS = [
  {
    id: "GAL-001",
    title: "Halaqah Setoran Shubuh Santri di Masjid Jami'",
    category: "Halaqah Tahfidz",
    badge: "🌟 Rutinitas Harian",
    date: "2024-11-18",
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80",
    desc: "Suasana khusyuk setoran ziyadah dan muraja'ah ba'da Shubuh santri bimbingan Asatidz di serambi masjid utama."
  },
  {
    id: "GAL-002",
    title: "Prosesi Wisuda Khotmil Qur'an & Syahadah Binnadzor",
    category: "Wisuda & Prestasi",
    badge: "🎓 Milestone Kelulusan",
    date: "2024-11-15",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    desc: "Penganugerahan syahadah dan piagam kelulusan binnadzor kepada santri yang telah menuntaskan bacaan dan hafalan Juz 28-30."
  },
  {
    id: "GAL-003",
    title: "Ujian Tasmi' Bil-Ghaib 5 - 30 Juz Sekali Duduk",
    category: "Ujian Tahfidz",
    badge: "👑 Tasmi' Kubro",
    date: "2024-11-05",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=80",
    desc: "Santri memperdengarkan hafalan 5 hingga 30 juz sekali duduk tanpa mushaf di hadapan penguji dan dewan asatidz pondok."
  },
  {
    id: "GAL-004",
    title: "Kajian Kitab Kuning & Matan Tajwid Al-Jazariyah",
    category: "Kajian Kitab",
    badge: "📚 Khazanah Salaf",
    date: "2024-10-28",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80",
    desc: "Pendalaman kaidah makharijul huruf, shifatul huruf, serta ilmu qira'at sab'ah bersama Masyaikh pondok."
  },
  {
    id: "GAL-005",
    title: "Masjid Jami' & Suasana Kampus Pesantren yang Asri",
    category: "Lingkungan Pondok",
    badge: "🕌 Pusat Ibadah",
    date: "2024-10-15",
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=80",
    desc: "Pusat gravitasi spiritual pesantren bernuansa sejuk, asri, dan sangat kondusif untuk menuntaskan hafalan Al-Qur'an."
  },
  {
    id: "GAL-006",
    title: "Perpustakaan Khazanah Tafsir & Manuskrip Al-Qur'an",
    category: "Fasilitas Literasi",
    badge: "📖 Literasi Islam",
    date: "2024-10-10",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
    desc: "Ruang baca dan riset literatur Islam terlengkap untuk menunjang wawasan keilmuan dan adab para penghafal Al-Qur'an."
  }
];

function getGalleryPhotos() {
  try {
    const saved = localStorage.getItem('sitahfidz_web_gallery');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch(e) {}
  return DEFAULT_GALLERY_PHOTOS;
}

// ================= SLIDER & 3D TILT INTERAKTIF DOKUMENTASI =================
function createInteractivePhotoSlider({
  containerId,
  photos = [],
  autoPlay = true,
  autoPlayDelay = 5000,
  onPhotoClick = null,
  height = 380
}) {
  const container = document.getElementById(containerId);
  if (!container || !photos || photos.length === 0) return null;

  let currentIndex = 0;
  let timer = null;
  let isDragging = false;
  let isMoved = false;
  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  // Build HTML
  let slidesHtml = '';
  let dotsHtml = '';

  photos.forEach((p, idx) => {
    const activeCls = idx === 0 ? 'active' : '';
    const badgeText = p.badge || p.category || 'Dokumentasi';
    const fallbackAttr = `onerror="this.onerror=null; this.src='${FALLBACK_PHOTO_SVG}'"`;

    slidesHtml += `
      <div class="photo-slide-item ${activeCls}" data-index="${idx}">
        <img src="${p.image}" alt="${escapeHtml(p.title)}" class="photo-slide-img" ${fallbackAttr} loading="lazy">
        <div class="photo-slide-gradient"></div>
        <div class="photo-slide-content">
          <span class="photo-slide-category">${escapeHtml(badgeText)}</span>
          <h2 class="photo-slide-heading">${escapeHtml(p.title)}</h2>
          <p class="photo-slide-caption">${escapeHtml(p.desc || '')}</p>
          <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
            <button type="button" class="photo-slide-action-btn" data-click-index="${idx}">
              <span>🔍</span> Perbesar & Lihat Detail
            </button>
            <span style="font-size:11.5px; opacity:0.85; color:#cbd5e1;">📅 ${p.date || 'Dokumentasi Kegiatan'}</span>
          </div>
        </div>
      </div>
    `;

    dotsHtml += `
      <div class="photo-slider-dot ${activeCls}" data-dot-index="${idx}" title="${escapeHtml(p.title)}"></div>
    `;
  });

  container.innerHTML = `
    <div class="photo-slider-viewport" style="height:${height}px;">
      <div class="photo-slider-track">
        ${slidesHtml}
      </div>
      <button type="button" class="photo-slider-btn btn-prev" aria-label="Foto Sebelumnya" title="Foto Sebelumnya">◀</button>
      <button type="button" class="photo-slider-btn btn-next" aria-label="Foto Berikutnya" title="Foto Berikutnya">▶</button>
      <div class="photo-slider-dots">
        ${dotsHtml}
      </div>
    </div>
  `;

  const viewport = container.querySelector('.photo-slider-viewport');
  const track = container.querySelector('.photo-slider-track');
  const btnPrev = container.querySelector('.btn-prev');
  const btnNext = container.querySelector('.btn-next');
  const dots = container.querySelectorAll('.photo-slider-dot');
  const slides = container.querySelectorAll('.photo-slide-item');

  function updateSlider(index, smooth = true) {
    if (index < 0) index = photos.length - 1;
    if (index >= photos.length) index = 0;
    currentIndex = index;

    track.style.transition = smooth ? 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((s, i) => {
      if (i === currentIndex) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });

    dots.forEach((d, i) => {
      if (i === currentIndex) {
        d.classList.add('active');
      } else {
        d.classList.remove('active');
      }
    });
  }

  function nextSlide() {
    updateSlider(currentIndex + 1);
  }

  function prevSlide() {
    updateSlider(currentIndex - 1);
  }

  function startAutoplay() {
    if (!autoPlay) return;
    stopAutoplay();
    timer = setInterval(nextSlide, autoPlayDelay);
  }

  function stopAutoplay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  btnPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    prevSlide();
    startAutoplay();
  });

  btnNext.addEventListener('click', (e) => {
    e.stopPropagation();
    nextSlide();
    startAutoplay();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(dot.dataset.dotIndex, 10);
      updateSlider(idx);
      startAutoplay();
    });
  });

  // Touch & Mouse Drag / Swipe & Click Detection
  function touchStart(event) {
    stopAutoplay();
    isDragging = true;
    isMoved = false;
    startX = getPositionX(event);
    startY = getPositionY(event);
    startTime = Date.now();
    prevTranslate = -currentIndex * viewport.clientWidth;
    currentTranslate = prevTranslate;
    track.style.transition = 'none';
  }

  function touchMove(event) {
    if (!isDragging) return;
    const currentX = getPositionX(event);
    const diff = currentX - startX;
    if (Math.abs(diff) > 6) {
      isMoved = true;
    }
    currentTranslate = prevTranslate + diff;
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  function touchEnd(event) {
    if (!isDragging) return;
    isDragging = false;
    const movedBy = currentTranslate - prevTranslate;
    const elapsed = Date.now() - startTime;

    // 1. Jika pengguna menggeser/men-drag layar
    if (isMoved && Math.abs(movedBy) > 35) {
      if (movedBy < -35) {
        nextSlide();
      } else if (movedBy > 35) {
        prevSlide();
      }
    } 
    // 2. Jika pengguna meng-KLIK pada foto slider ("pas di klik")
    else if (elapsed < 500 && Math.abs(movedBy) < 15) {
      const target = event.target;
      // Jangan double-trigger jika yang diklik adalah tombol panah atau tombol perbesar
      if (target && (target.closest('.photo-slider-btn') || target.closest('.photo-slider-dot') || target.closest('.photo-slide-action-btn'))) {
        return;
      }

      // Tampilkan efek pendaran riak klik (visual ripple wave)
      createSliderClickEffect(event, viewport);

      // Cek posisi klik: klik di sisi kiri (35% layar) = geser ke sebelumnya, sisi tengah/kanan = geser ke berikutnya
      const rect = viewport.getBoundingClientRect();
      const clickClientX = event.clientX || (event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].clientX : rect.left + rect.width / 2);
      const relativeX = clickClientX - rect.left;

      if (relativeX < rect.width * 0.35) {
        prevSlide();
      } else {
        nextSlide();
      }
    } else {
      updateSlider(currentIndex, true);
    }
    startAutoplay();
  }

  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : (event.touches && event.touches[0] ? event.touches[0].clientX : (event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].clientX : 0));
  }

  function getPositionY(event) {
    return event.type.includes('mouse') ? event.pageY : (event.touches && event.touches[0] ? event.touches[0].clientY : (event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].clientY : 0));
  }

  viewport.addEventListener('touchstart', touchStart, { passive: true });
  viewport.addEventListener('touchmove', touchMove, { passive: true });
  viewport.addEventListener('touchend', touchEnd);

  viewport.addEventListener('mousedown', touchStart);
  viewport.addEventListener('mousemove', touchMove);
  viewport.addEventListener('mouseup', touchEnd);
  viewport.addEventListener('mouseleave', () => {
    if (isDragging) touchEnd();
    startAutoplay();
  });

  viewport.addEventListener('mouseenter', stopAutoplay);

  // Click on action button or slide to view lightbox
  container.querySelectorAll('[data-click-index]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.clickIndex, 10);
      if (typeof onPhotoClick === 'function') {
        onPhotoClick(photos[idx], idx, photos);
      } else {
        openInteractiveLightbox(photos[idx], idx, photos);
      }
    });
  });

  // 3D Tilt on Hover
  viewport.addEventListener('mousemove', (e) => {
    if (isDragging) return;
    const rect = viewport.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    container.style.transform = `perspective(1200px) rotateX(${ -y * 5 }deg) rotateY(${ x * 5 }deg)`;
  });

  viewport.addEventListener('mouseleave', () => {
    container.style.transition = 'transform 0.4s ease';
    container.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    setTimeout(() => { container.style.transition = ''; }, 400);
  });

  // Start autoplay
  startAutoplay();

  return {
    next: nextSlide,
    prev: prevSlide,
    goTo: updateSlider,
    stop: stopAutoplay,
    start: startAutoplay
  };
}

function createSliderClickEffect(event, container) {
  if (!container) return;
  const rect = container.getBoundingClientRect();
  const clientX = event.clientX || (event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].clientX : rect.left + rect.width / 2);
  const clientY = event.clientY || (event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].clientY : rect.top + rect.height / 2);
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  const ripple = document.createElement('div');
  ripple.className = 'slider-click-glow';
  ripple.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(245,158,11,0.65) 45%, transparent 70%);
    pointer-events: none;
    transform: translate(-50%, -50%) scale(1);
    animation: rippleExpand 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    z-index: 25;
  `;
  container.appendChild(ripple);
  setTimeout(() => {
    if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
  }, 550);
}

let currentLightboxIndex = 0;
let currentLightboxPhotos = [];

function openInteractiveLightbox(photo, index = 0, photosList = []) {
  currentLightboxIndex = index;
  currentLightboxPhotos = photosList && photosList.length > 0 ? photosList : [photo];

  let modal = document.getElementById('globalInteractiveLightbox');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'globalInteractiveLightbox';
    modal.className = 'modal-overlay';
    modal.style.cssText = 'position:fixed; inset:0; z-index:999999; background:rgba(0,0,0,0.88); backdrop-filter:blur(10px); display:none; align-items:center; justify-content:center; padding:16px; opacity:0; transition:opacity 0.3s ease;';
    modal.onclick = closeInteractiveLightbox;
    modal.innerHTML = `
      <div style="position:relative; max-width:920px; width:100%; background:#0f172a; border-radius:18px; overflow:hidden; box-shadow:0 25px 60px rgba(0,0,0,0.6); border:1px solid rgba(255,255,255,0.15);" onclick="event.stopPropagation()">
        <!-- Header Info Bar -->
        <div style="display:flex; justify-content:space-between; align-items:center; padding:14px 20px; background:rgba(255,255,255,0.06); border-bottom:1px solid rgba(255,255,255,0.1);">
          <div style="display:flex; align-items:center; gap:10px;">
            <span id="lbBadge" style="background:#f59e0b; color:#78350f; font-weight:800; font-size:11px; padding:3px 10px; border-radius:999px;">DOKUMENTASI</span>
            <span id="lbCounter" style="font-size:12px; color:#cbd5e1; font-weight:600;">1 / 6</span>
          </div>
          <button type="button" style="background:rgba(255,255,255,0.15); border:none; color:#fff; width:34px; height:34px; border-radius:50%; font-size:20px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.2s;" onclick="closeInteractiveLightbox()">&times;</button>
        </div>

        <!-- Image Container with Prev/Next buttons -->
        <div style="position:relative; width:100%; height:460px; max-height:65vh; background:#000; overflow:hidden; display:flex; align-items:center; justify-content:center;">
          <img id="lbImg" src="" alt="" style="width:100%; height:100%; object-fit:contain; transition:transform 0.3s ease; transform:scale(1); cursor:pointer;" onclick="stepLightbox(1)" title="Klik foto untuk geser ke foto berikutnya">
          
          <button type="button" class="photo-slider-btn btn-prev" onclick="stepLightbox(-1)" style="left:16px; background:rgba(0,0,0,0.65);" title="Sebelumnya">◀</button>
          <button type="button" class="photo-slider-btn btn-next" onclick="stepLightbox(1)" style="right:16px; background:rgba(0,0,0,0.65);" title="Berikutnya">▶</button>
        </div>

        <!-- Caption Bar -->
        <div style="padding:18px 24px; color:#fff; background:#0f172a;">
          <h3 id="lbTitle" style="font-size:18px; font-weight:800; margin:0 0 6px 0; color:#ffffff;"></h3>
          <p id="lbDesc" style="font-size:13px; color:#cbd5e1; margin:0 0 10px 0; line-height:1.5;"></p>
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:11.5px; color:#94a3b8; flex-wrap:wrap; gap:8px;">
            <span id="lbDate">📅 Tanggal Dokumentasi</span>
            <span>💡 <em>Klik foto atau gunakan panah ◀ / ▶ untuk geser foto</em></span>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    window.addEventListener('keydown', (e) => {
      const m = document.getElementById('globalInteractiveLightbox');
      if (!m || m.style.display !== 'flex') return;
      if (e.key === 'ArrowLeft') stepLightbox(-1);
      else if (e.key === 'ArrowRight') stepLightbox(1);
      else if (e.key === 'Escape') closeInteractiveLightbox();
    });
  }

  renderLightboxSlide();
  modal.style.display = 'flex';
  setTimeout(() => { modal.style.opacity = '1'; }, 10);
}

function renderLightboxSlide() {
  const p = currentLightboxPhotos[currentLightboxIndex];
  if (!p) return;
  const img = document.getElementById('lbImg');
  const title = document.getElementById('lbTitle');
  const desc = document.getElementById('lbDesc');
  const badge = document.getElementById('lbBadge');
  const counter = document.getElementById('lbCounter');
  const date = document.getElementById('lbDate');

  if (img) {
    img.style.transform = 'scale(0.96)';
    img.style.opacity = '0.5';
    img.onerror = () => { img.onerror = null; img.src = FALLBACK_PHOTO_SVG; };
    img.src = p.image;
    setTimeout(() => {
      img.style.transform = 'scale(1)';
      img.style.opacity = '1';
    }, 120);
  }
  if (title) title.textContent = p.title || '';
  if (desc) desc.textContent = p.desc || '';
  if (badge) badge.textContent = (p.badge || p.category || 'Dokumentasi').toUpperCase();
  if (counter) counter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxPhotos.length}`;
  if (date) date.textContent = `📅 ${p.date || 'Pesantren Al-Barokah'}`;
}

function stepLightbox(step) {
  currentLightboxIndex += step;
  if (currentLightboxIndex < 0) currentLightboxIndex = currentLightboxPhotos.length - 1;
  if (currentLightboxIndex >= currentLightboxPhotos.length) currentLightboxIndex = 0;
  renderLightboxSlide();
}

function closeInteractiveLightbox() {
  const modal = document.getElementById('globalInteractiveLightbox');
  if (modal) {
    modal.style.opacity = '0';
    setTimeout(() => { modal.style.display = 'none'; }, 250);
  }
}

function initCard3DTilt(selector = '.photo-card-tilt') {
  const cards = document.querySelectorAll(selector);
  cards.forEach(card => {
    let glare = card.querySelector('.card-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'card-glare';
      card.appendChild(glare);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      card.style.transform = `perspective(1000px) rotateX(${ -y * 14 }deg) rotateY(${ x * 14 }deg) scale3d(1.02, 1.02, 1.02)`;
      glare.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255, 255, 255, 0.35) 0%, transparent 60%)`;
      glare.style.opacity = '1';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      glare.style.opacity = '0';
      setTimeout(() => { card.style.transition = ''; }, 400);
    });
  });
}

// ================= PILIHAN SEKOLAH FORMAL TERPADU DENANYAR =================
const DEFAULT_FORMAL_SCHOOLS = [
  {
    id: 'mtsn4',
    name: 'MTsN 4 Denanyar',
    fullName: 'Madrasah Tsanawiyah Negeri 4 Jombang (Denanyar)',
    level: 'MTs (Setara SMP)',
    category: 'mts_smp',
    badge: '',
    icon: '🏛️',
    tagColor: '#059669',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
    desc: 'Madrasah Tsanawiyah rujukan nasional di kawasan Denanyar dengan integrasi kurikulum Kemenag dan kelas riset sains terpadu tahfidz Al-Qur\'an.',
    highlights: [
      'Kelas Unggulan Sains, Riset & Digital Terpadu',
      'Pengembangan Minat Riset, Sains & Teknologi Digital',
      'Pembinaan intensif Olimpiade Sains & Keagamaan (KSM)',
      'Laboratorium Komputer, Bahasa, & Perpustakaan Digital'
    ],
    syarat: 'Lulusan SD/MI sederajat, FC Ijazah/SKL, FC Akta & KK, Pas Foto 3x4 (3 lbr)',
    kontak: '0812-3456-7890 (Panitia PPDB)',
    image: '',
    brosurImage: '',
    brosurTitle: 'Brosur Penerimaan Siswa Baru MTsN 4 Denanyar'
  },
  {
    id: 'mtsmm',
    name: 'MTs MM Denanyar',
    fullName: 'MTs Mamba\'ul Ma\'arif Denanyar',
    level: 'MTs (Setara SMP)',
    category: 'mts_smp',
    badge: '',
    icon: '📚',
    tagColor: '#0891b2',
    gradient: 'linear-gradient(135deg, #0e7490 0%, #0891b2 100%)',
    desc: 'Madrasah Tsanawiyah berbasis nilai luhur pesantren Mamba\'ul Ma\'arif dengan penguatan kitab turats salaf dan dwibahasa (Arab & Inggris).',
    highlights: [
      'Pendalaman Kitab Kuning (Turats) Dasar Bersanad',
      'Penguasaan Dasar Bahasa Arab & Percakapan Harian',
      'Ekstrakurikuler Khitobah, Hadrah, Pramuka, & Seni Islami',
      'Pendidikan karakter santri mandiri & berakhlak karimah'
    ],
    syarat: 'Lulusan SD/MI sederajat, FC Ijazah/SKL, FC Akta & KK, Pas Foto 3x4 (3 lbr)',
    kontak: '0812-3456-7890 (Panitia PPDB)',
    image: '',
    brosurImage: '',
    brosurTitle: 'Brosur Penerimaan Siswa Baru MTs Mamba\'ul Ma\'arif'
  },
  {
    id: 'smpmm',
    name: 'SMP MM Denanyar',
    fullName: 'SMP Mamba\'ul Ma\'arif Denanyar',
    level: 'SMP (Menengah Pertama)',
    category: 'mts_smp',
    badge: '',
    icon: '🔬',
    tagColor: '#2563eb',
    gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    desc: 'Sekolah Menengah Pertama umum berkarakter Islami di bawah naungan Yayasan Mamba\'ul Ma\'arif yang unggul dalam penguasaan sains dan teknologi.',
    highlights: [
      'Kurikulum Merdeka Kemendikbudristek Berbasis Karakter',
      'Penguatan Literasi Digital, Coding Dasar & Sains Terapan',
      'Pembiasaan Karakter Disiplin & Kemandirian Santri',
      'Fasilitas lapangan olahraga, lab IPA, & bimbingan konseling'
    ],
    syarat: 'Lulusan SD/MI sederajat, FC Ijazah/SKL, FC Akta & KK, Pas Foto 3x4 (3 lbr)',
    kontak: '0812-3456-7890 (Panitia PPDB)',
    image: '',
    brosurImage: '',
    brosurTitle: 'Brosur Penerimaan Siswa Baru SMP Mamba\'ul Ma\'arif'
  },
  {
    id: 'man4',
    name: 'MAN 4 Denanyar',
    fullName: 'Madrasah Aliyah Negeri 4 Jombang (Denanyar)',
    level: 'MAN (Setara SMA)',
    category: 'ma_smk',
    badge: '',
    icon: '🎓',
    tagColor: '#b45309',
    gradient: 'linear-gradient(135deg, #78350f 0%, #d97706 100%)',
    desc: 'Madrasah Aliyah rujukan nasional dan riset, gerbang menuju perguruan tinggi prestisius & Timur Tengah.',
    highlights: [
      'Program Peminatan Sains, Riset & Keagamaan Unggulan',
      'Peminatan Ilmu Keagamaan (IIK), MIPA, IPS, dan Bahasa',
      'Lingkungan berbahasa Arab & Inggris aktif',
      'Tingkat kelulusan tinggi ke Al-Azhar Kairo, Timur Tengah & PTN Favorit'
    ],
    syarat: 'Lulusan MTs/SMP sederajat, Nilai Rapor, FC Ijazah/SKL, Akta, KK',
    kontak: '0812-3456-7890 (Panitia PPDB)',
    image: '',
    brosurImage: '',
    brosurTitle: 'Brosur Penerimaan Peserta Didik Baru MAN 4 Denanyar'
  },
  {
    id: 'mamm',
    name: 'MAMM Denanyar',
    fullName: 'MA Mamba\'ul Ma\'arif Denanyar',
    level: 'MA (Setara SMA)',
    category: 'ma_smk',
    badge: '',
    icon: '📖',
    tagColor: '#854d0e',
    gradient: 'linear-gradient(135deg, #713f12 0%, #a16207 100%)',
    desc: 'Madrasah Aliyah bersejarah pencetak kader ulama, intelektual muslim, dan pemimpin umat dengan keilmuan kitab kuning yang mendalam.',
    highlights: [
      'Kajian Kitab Kuning Mu\'tabarah Tingkat Aliyah (Fathul Mu\'in, dll)',
      'Jurusan Keagamaan, MIPA, dan IPS Unggulan',
      'Bimbingan sukses seleksi SNBP, SNBT, SPAN-PTKIN, & Beasiswa Santri',
      'Pengembangan organisasi santri, jurnalistik, & kepemimpinan'
    ],
    syarat: 'Lulusan MTs/SMP sederajat, FC Ijazah/SKL, FC Akta & KK, Pas Foto 3x4 (3 lbr)',
    kontak: '0812-3456-7890 (Panitia PPDB)',
    image: '',
    brosurImage: '',
    brosurTitle: 'Brosur Penerimaan Peserta Didik Baru MA Mamba\'ul Ma\'arif'
  },
  {
    id: 'smkbisri',
    name: 'SMK Bisri Syansuri',
    fullName: 'SMK KH. M. Bisri Syansuri Denanyar',
    level: 'SMK (Kejuruan / Vokasi)',
    category: 'ma_smk',
    badge: '',
    icon: '⚙️',
    tagColor: '#6d28d9',
    gradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)',
    desc: 'SMK berbasis pesantren yang membekali santri keahlian vokasi teknologi dan kejuruan siap kerja dengan sertifikasi industri berkarakter santri wirausaha.',
    highlights: [
      'Jurusan Teknik Komputer & Jaringan (TKJ) / Vokasi Digital',
      'Uji Sertifikasi Keahlian Berstandar BNSP & Industri Nasional',
      'Praktik Kerja Industri (Prakerin) di Perusahaan Mitra Ternama',
      'Mencetak Santri Terampil, Mandiri, Berpenghasilan & Berakhlak'
    ],
    syarat: 'Lulusan MTs/SMP sederajat, FC Ijazah/SKL, FC Akta & KK, Pas Foto 3x4 (3 lbr)',
    kontak: '0812-3456-7890 (Panitia PPDB)',
    image: '',
    brosurImage: '',
    brosurTitle: 'Brosur Penerimaan Siswa Baru SMK Bisri Syansuri'
  }
];

// ================= KEGIATAN EKSTRAKURIKULER SANTRI =================
const DEFAULT_EKSTRAKURIKULER = [
  {
    id: 'ekskul-1',
    name: 'Seni Hadrah & Shalawat Al-Banjari',
    category: 'Seni & Budaya Islam',
    icon: '🥁',
    badge: 'Favorit Santri',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
    snippet: 'Pelatihan seni tabuh terbang banjari, vokal qasidah shalawat, dan pembacaan maulid Simtudduror & Diba\'iyah.',
    fullDesc: 'Ekstrakurikuler Hadrah Al-Banjari membina santri dalam menguasai pukulan terbang banjari khas Jawa Timur, olah vokal qasidah Islami, serta melestarikan tradisi pembacaan maulid Nabi. Santri rutin tampil di acara peringatan hari besar Islam (PHBI) dan festival banjari antar-pesantren.',
    jadwal: 'Malam Jumat (19.30 - 21.30 WIB) & Ahad Sore',
    tempat: 'Aula Utama Asrama',
    pembina: 'Ust. Muhammad Ridwan & Tim Hadrah Senior',
    highlights: [
      'Penguasaan variasi pukulan banjari golong & anakan',
      'Teknik vokal qasidah & olah nafas panjang',
      'Pembacaan Maulid Diba\', Simtudduror & Barzanji',
      'Rutin tampil di festival banjari & safari dakwah'
    ],
    image: ''
  },
  {
    id: 'ekskul-2',
    name: 'Khitobah & Muhadhoroh 3 Bahasa',
    category: 'Pengembangan Diri',
    icon: '🎤',
    badge: 'Public Speaking',
    gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    snippet: 'Latihan pidato, retorika dakwah, dan public speaking dalam Bahasa Arab, Inggris, dan Indonesia.',
    fullDesc: 'Membekali santri keberanian berbicara di depan umum, teknik menyusun naskah khutbah, intonasi vokal, dan penguasaan panggung dengan 3 bahasa (Arab, Inggris, Indonesia). Setiap santri dilatih bergiliran menjadi MC, penceramah, dan moderator.',
    jadwal: 'Malam Ahad (20.00 - 21.30 WIB)',
    tempat: 'Panggung Halaqah Pesantren',
    pembina: 'Lembaga Pengembangan Bahasa & Dakwah Santri',
    highlights: [
      'Pidato Bahasa Arab fushah & Bahasa Inggris aktif',
      'Teknik menyusun materi dakwah berbasis Al-Qur\'an',
      'Pelatihan MC formal & moderator diskusi',
      'Membangun mental percaya diri di hadapan audiens'
    ],
    image: ''
  },
  {
    id: 'ekskul-3',
    name: 'Seni Kaligrafi Islam (Khat Al-Qur\'an)',
    category: 'Seni & Budaya Islam',
    icon: '✍️',
    badge: 'Seni Al-Qur\'an',
    gradient: 'linear-gradient(135deg, #78350f 0%, #d97706 100%)',
    snippet: 'Pembelajaran kaidah khat Naskhi, Tsuluts, Riq\'ah, Diwani, dan seni lukis mushaf hiasan dinding.',
    fullDesc: 'Mempelajari keindahan seni rupa Islam melalui tulisan ayat suci Al-Qur\'an. Santri dibimbing menguasai jenis khat standar (Naskhi, Tsuluts, Riq\'ah, Diwani, Farisi, dan Kufi) menggunakan pena handam tradisional serta kanvas dekorasi kontemporer.',
    jadwal: 'Sabtu Siang (13.30 - 15.00 WIB)',
    tempat: 'Studio Kaligrafi Santri',
    pembina: 'Ustadz Khatat Berlisensi',
    highlights: [
      'Kaidah pengukuran titik (nuqthah) khat mu\'tabar',
      'Praktek media handam, tinta Cina & kanvas akrilik',
      'Dekorasi mushaf Al-Qur\'an & hiasan kaligrafi',
      'Persiapan ajang perlombaan MTQ cabang Khattil Qur\'an'
    ],
    image: ''
  },
  {
    id: 'ekskul-4',
    name: 'Kajian Tilawah & Naghom Al-Qur\'an',
    category: 'Seni & Budaya Islam',
    icon: '📖',
    badge: 'Naghom Qur\'ani',
    gradient: 'linear-gradient(135deg, #0e7490 0%, #0891b2 100%)',
    snippet: 'Pendalaman seni baca Al-Qur\'an dengan 7 maqam lagu (Bayati, Shoba, Hijaz, Nahawand, Rast, Sikah, Jiharkah).',
    fullDesc: 'Bimbingan khusus bagi santri untuk melantunkan ayat Al-Qur\'an dengan keindahan maqomat naghom yang sesuai dengan kaidah tajwid dan makharijul huruf yang fasih. Dibina langsung oleh qari\' berprestasi nasional.',
    jadwal: 'Senin & Rabu Ba\'da Ashar (16.00 - 17.00 WIB)',
    tempat: 'Masjid Jami\' Pesantren',
    pembina: 'Ustadz Qari\' Nasional Al-Hafidz',
    highlights: [
      'Penguasaan 7 Maqam Tilawah (Bayati hingga Jiharkah)',
      'Latihan pernafasan diafragma & fashohah bacaan',
      'Penerapan waqaf dan ibtida\' yang tepat',
      'Pembinaan qari\' untuk majelis & lomba MTQ'
    ],
    image: ''
  },
  {
    id: 'ekskul-5',
    name: 'Pencak Silat Pagar Nusa',
    category: 'Olahraga & Ketangkasan',
    icon: '🥋',
    badge: 'Bela Diri Tradisi',
    gradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)',
    snippet: 'Seni bela diri pencak silat warisan ulama nusantara untuk ketahanan fisik tangguh, disiplin, dan perlindungan diri.',
    fullDesc: 'Pencak Silat Nahdlatul Ulama Pagar Nusa melatih santri memiliki jasmani yang bugar, ketahanan fisik, gerak jurus tradisional, dan ketahanan mental. Menanamkan prinsip santri berilmu padi: mengutamakan akhlak mulia dan perlindungan sesama.',
    jadwal: 'Ahad Pagi (06.00 - 08.00 WIB)',
    tempat: 'Halaman Olahraga Asrama',
    pembina: 'Pelatih Resmi IPSI / Pendekar Pagar Nusa',
    highlights: [
      'Jurus dasar senam & kuncian bela diri praktis',
      'Olah fisik, kelenturan otot, dan stamina kebugaran',
      'Penanaman disiplin santri & adab tawadhu\'',
      'Ujian kenaikan tingkat (UKT) berkala'
    ],
    image: ''
  },
  {
    id: 'ekskul-6',
    name: 'Panahan Sunnah (Archery)',
    category: 'Olahraga & Ketangkasan',
    icon: '🏹',
    badge: 'Olahraga Sunnah',
    gradient: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
    snippet: 'Olahraga panahan tradisional dan modern untuk melatih fokus pikiran, ketenangan emosional, dan kekuatan fisik.',
    fullDesc: 'Mengamalkan anjuran Rasulullah SAW dalam melatih santri memanah (ar-rimayah). Olahraga ini sangat efektif melatih konsentrasi, koordinasi mata dan tangan, ketenangan bernafas, serta kestabilan emosi santri saat menghafal Al-Qur\'an.',
    jadwal: 'Selasa Sore (16.00 - 17.30 WIB)',
    tempat: 'Lapangan Kompleks Pesantren',
    pembina: 'Instruktur Panahan Berkualifikasi',
    highlights: [
      'Teknik memanah standar horsebow & recurve dasar',
      'Melatih konsentrasi tinggi dan ketenangan batin',
      'Kebugaran fisik bagian atas (bahu, punggung, lengan)',
      'Olahraga bernilai ibadah sesuai tuntunan nabawi'
    ],
    image: ''
  },
  {
    id: 'ekskul-7',
    name: 'Jurnalistik & Redaksi Media Santri',
    category: 'Literasi & Sains',
    icon: '📰',
    badge: 'Literasi Kreatif',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
    snippet: 'Pengembangan bakat menulis artikel, kepenulisan sastra santri, majalah dinding berkala, dan fotografi dakwah.',
    fullDesc: 'Wadah bagi santri yang gemar dunia literasi, penulisan berita kegiatan pesantren, resensi kitab, pengelolaan majalah dinding (mading), serta dasar-dasar dokumentasi fotografi dan desain publikasi digital pesantren.',
    jadwal: 'Ahad Siang (10.00 - 12.00 WIB)',
    tempat: 'Ruang Media & Perpustakaan',
    pembina: 'Tim Redaksi Media Pesantren',
    highlights: [
      'Penulisan artikel opini, cerpen santri & reportase',
      'Penerbitan Mading Berkala & Buletin Santri',
      'Teknik dasar fotografi dokumentasi & media',
      'Pengasahan daya nalar kritis & kecintaan membaca'
    ],
    image: ''
  },
  {
    id: 'ekskul-8',
    name: 'Klub Sains Terapan & Robotika Sederhana',
    category: 'Literasi & Sains',
    icon: '🔬',
    badge: 'Riset Santri',
    gradient: 'linear-gradient(135deg, #047857 0%, #0d9488 100%)',
    snippet: 'Eksperimen sains praktis, coding logika dasar, dan eksplorasi sains terintegrasi ayat kauniyah Al-Qur\'an.',
    fullDesc: 'Klub ilmiah yang memadukan tadabbur alam ayat-ayat kauniyah dengan percobaan sains praktis, dasar logika pemrograman komputer, dan proyek sains kreatif yang selaras dengan mata pelajaran di sekolah formal santri.',
    jadwal: 'Kamis Sore (16.00 - 17.15 WIB)',
    tempat: 'Laboratorium Komputer & Sains',
    pembina: 'Guru Pembina Riset & Asatidz Sains',
    highlights: [
      'Eksperimen sains sederhana & ramah lingkungan',
      'Pengenalan logika algoritma & pemrograman',
      'Tadabbur keajaiban alam semesta (Ayat Kauniyah)',
      'Bimbingan karya ilmiah remaja (KIR) santri'
    ],
    image: ''
  }
];

// ================= RINCIAN BIAYA & INFO PEMBAYARAN PONDOK =================
const DEFAULT_BIAYA_PEMBAYARAN = [
  {
    id: 'biaya-1',
    nama: '1. Infaq Formulir & Tes Seleksi',
    nominal: 'Rp 150.000',
    keterangan: 'Dibayar 1 kali saat pendaftaran seleksi',
    isBulanan: false
  },
  {
    id: 'biaya-2',
    nama: '2. Infaq Pengembangan Sarana & Asrama',
    nominal: 'Rp 2.500.000',
    keterangan: 'Ranjang, almari, sarana halaqah (dapat diangsur)',
    isBulanan: false
  },
  {
    id: 'biaya-3',
    nama: '3. Paket Seragam Lengkap',
    nominal: 'Rp 650.000',
    keterangan: '3 stel seragam pondok, almamater & atribut',
    isBulanan: false
  },
  {
    id: 'biaya-4',
    nama: "4. Mushaf Tahfidz & Kitab Syari'ah",
    nominal: 'Rp 350.000',
    keterangan: 'Mushaf standar Kudus, matan tajwid & kitab fiqih',
    isBulanan: false
  },
  {
    id: 'biaya-5',
    nama: '5. Iuran Bulanan / Syahriah (All-In)',
    nominal: 'Rp 750.000',
    keterangan: 'Asrama, makan bergizi 3x sehari, bimbingan tahfidz & laundry',
    isBulanan: true
  }
];

const DEFAULT_REKENING_PEMBAYARAN = [
  {
    id: 'rek-1',
    bank: 'Bank Syariah Indonesia (BSI)',
    nomor: '7123456789',
    atasNama: "PP Tahfidz Al-Qur'an Al-Barokah",
    catatan: 'Untuk Infaq Pendaftaran (PSB) & Sarana Asrama'
  },
  {
    id: 'rek-2',
    bank: 'Bank BRI',
    nomor: '0123-01-001234-53-0',
    atasNama: 'Yayasan Pondok Pesantren Al-Barokah',
    catatan: 'Untuk Pembayaran Iuran Bulanan / Syahriah'
  }
];
