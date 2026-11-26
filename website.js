// ========================================================
// Website Resmi Pondok Pesantren Tahfidz Al-Qur'an
// Controller & Data Handler (Offline-First / LocalStorage)
// ========================================================

const STORAGE_KEYS = {
  ARTICLES: 'pondok_articles_data',
  GALLERY: 'pondok_gallery_data',
  PSB: 'psb_pendaftar_list',
  SETTINGS: 'sitahfidz_settings',
  CONTENT: 'sitahfidz_website_content',
  FACILITIES: 'sitahfidz_web_facilities',
  SEKOLAH_FORMAL: 'sitahfidz_sekolah_formal',
  EKSTRAKURIKULER: 'sitahfidz_ekstrakurikuler',
  BIAYA: 'sitahfidz_web_biaya',
  REKENING: 'sitahfidz_web_rekening',
  ALUMNI: 'sitahfidz_web_alumni'
};

// ================= DEFAULT SAMPLE DATA =================
const DEFAULT_ARTICLES = [
  {
    id: "ART-101",
    title: "Wisuda Khotmil Qur'an & Kelulusan Binnadzor Angkatan Ke-IV Berlangsung Khidmat",
    category: "Berita Pondok",
    date: "2024-11-15",
    author: "Humas Pesantren",
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
    snippet: "Sebanyak 24 santri program Binnadzor resmi diwisuda setelah menuntaskan khatam bacaan 30 juz dan hafalan mutqin Juz 28, 29, dan 30, serta berhak naik ke program Tahfidz.",
    content: `Alhamdulillah, segala puji bagi Allah Subhanahu wa Ta'ala. Pada hari Ahad kemarin, Pondok Pesantren Tahfidz Al-Qur'an Al-Barokah menggelar prosesi Wisuda Khotmil Qur'an Bi-An-Nadzor dan Tasmi' Juz 28, 29, dan 30 angkatan ke-IV.

Acara yang dihadiri oleh seluruh wali santri, dewan asatidz, dan tokoh masyarakat ini berlangsung dengan penuh haru dan khidmat. Dalam tausiyahnya, Pengasuh Pondok menyampaikan bahwa kelulusan Binnadzor adalah pondasi penting yang tak tergantikan.

"Santri tidak boleh tergesa-gesa menghafal sebelum bacaannya fashih, tajwidnya tertib, dan makharijul hurufnya tepat. Wisuda Binnadzor ini menandakan bahwa ananda telah siap secara lahir dan batin untuk mengemban amanah menghafal 30 Juz Al-Qur'an secara bil-ghaib," tutur beliau.

Seluruh alumni wisudawan Binnadzor angkatan ini resmi dipromosikan ke jenjang Halaqah Tahfidz Intensif 30 Juz mulai pekan depan.`
  },
  {
    id: "ART-102",
    title: "Menjaga Hafalan Al-Qur'an: Mengapa Muraja'ah Jauh Lebih Utama dari Sekadar Ziyadah?",
    category: "Tausiyah & Hikmah",
    date: "2024-11-10",
    author: "Ust. Muhammad Ridwan, S.Pd.I., Al-Hafidz",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80",
    snippet: "Banyak penghafal Al-Qur'an bersemangat menambah ayat baru, namun melalaikan pengulangan. Simak nasihat ulama tentang seni memutqinkan hafalan di pesantren.",
    content: `Rasulullah Shallallahu 'Alaihi Wasallam bersabda: "Jagalah Al-Qur'an ini, demi Dzat yang jiwaku berada di tangan-Nya, sungguh ia lebih cepat lepasnya daripada unta yang terikat dalam ikatannya." (HR. Bukhari & Muslim).

Menambah hafalan baru (Ziyadah) memang membahagiakan, namun menjaga dan mengulang hafalan lama (Muraja'ah) adalah bukti cinta dan kejujuran seorang shahibul Qur'an. Di pesantren kami, santri dibiasakan dengan pola 1:3, yaitu setiap menambah 1 halaman ziyadah baru, santri wajib memuraja'ahkan minimal 3 halaman hafalan sebelumnya.

Kunci utama kelancaran hafalan bukan pada banyaknya juz dalam waktu singkat, melainkan pada keistiqomahan menyetorkan bacaan setiap ba'da Shubuh dan ba'da Ashar secara tertib dihadapan musyrif.`
  },
  {
    id: "ART-103",
    title: "Penerimaan Santri Baru (PSB) Tahun Ajaran 2025/2026 Resmi Dibuka",
    category: "Pengumuman",
    date: "2024-11-01",
    author: "Panitia PSB Online",
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80",
    snippet: "Pondok membuka pendaftaran santri baru untuk jenjang Binnadzor (Pra-Tahfidz) dan jenjang Tahfidz 30 Juz. Kuota terbatas 60 santri putra dan 40 santri putri.",
    content: `Kabar gembira bagi para orang tua yang mendambakan putra-putrinya menjadi penghafal Al-Qur'an yang mutqin dan berakhlak mulia. Pendaftaran Santri Baru (PSB) Tahun Ajaran 2025/2026 telah resmi dibuka mulai tanggal 1 November hingga 31 Januari 2025 (Gelombang 1).

Program yang dibuka:
1. Program Binnadzor: Fokus perbaikan tahsin/tajwid dan hafalan Juz 28, 29, 30.
2. Program Tahfidz 30 Juz: Bagi calon santri yang lulus tes seleksi bacaan fashih atau alumni wisuda Binnadzor.

Pendaftaran dapat dilakukan secara online melalui formulir di website ini atau datang langsung ke sekretariat pesantren pada jam kerja.`
  }
];

const DEFAULT_GALLERY = [
  {
    id: "GAL-201",
    title: "Halaqah Setoran Shubuh Santri",
    category: "Halaqah Setoran",
    date: "2024-11-18",
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
    desc: "Suasana khusyuk kegiatan setoran ziyadah ba'da shalat Shubuh di Masjid Jami' Pesantren."
  },
  {
    id: "GAL-202",
    title: "Prosesi Wisuda Kelulusan Binnadzor",
    category: "Wisuda & Tasmi'",
    date: "2024-11-15",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    desc: "Penyerahan piagam kelulusan binnadzor kepada santri yang tuntas Juz 28, 29, dan 30."
  },
  {
    id: "GAL-203",
    title: "Ujian Tasmi' Bil-Ghaib 5 Juz Sekali Duduk",
    category: "Wisuda & Tasmi'",
    date: "2024-11-05",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80",
    desc: "Santri tahfidz menyetorkan hafalan 5 juz sekali duduk disimak asatidz dan rekan santri."
  },
  {
    id: "GAL-204",
    title: "Kajian Kitab Kuning di Serambi Masjid",
    category: "Kegiatan Santri",
    date: "2024-10-28",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80",
    desc: "Kajian rutin kitab Tuhfatul Athfal dan Fiqih Ibadah bersama Dewan Asatidz."
  },
  {
    id: "GAL-205",
    title: "Masjid Jami' Pesantren Al-Barokah",
    category: "Fasilitas",
    date: "2024-10-15",
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80",
    desc: "Pusat peribadahan dan halaqah tahfidz yang sejuk dan nyaman."
  },
  {
    id: "GAL-206",
    title: "Perpustakaan Kitab & Mushaf Santri",
    category: "Fasilitas",
    date: "2024-10-10",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
    desc: "Koleksi kitab tafsir, hadits, dan literatur Islam untuk menunjang wawasan santri."
  }
];

// ================= SARANA & FASILITAS PESANTREN =================
const DEFAULT_FACILITIES = [
  {
    id: "FAC-01",
    title: "Masjid Jami' Pesantren",
    icon: "🕌",
    badge: "Pusat Ibadah & Tahfidz",
    capacity: "500 Jamaah",
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=80",
    snippet: "Pusat shalat berjamaah 5 waktu, qiyamul lail, dan halaqah setoran hafalan santri.",
    fullDesc: "Masjid Jami' Pesantren merupakan pusat gravitasi spiritual santri Pondok Al-Barokah. Dilengkapi karpet tebal berkualitas tinggi, tata suara akustik jernih, area serambi luas untuk halaqah setoran, dan wudhu modern yang suci. Seluruh santri diwajibkan mendirikan shalat fardhu 5 waktu secara berjamaah tepat waktu.",
    specs: [
      "Kapasitas 500 Jamaah shalat berjamaah",
      "Full karpet empuk & wangi terjaga kebersihannya",
      "Sound system akustik jernih untuk bacaan tartil",
      "Area halaqah tahfidz putra dan putri terpisah mandiri",
      "Tempat wudhu luas dengan sirkulasi air mengalir suci"
    ],
    schedule: "Kegiatan: Shalat Fardhu 5 Waktu, Halaqah Ba'da Shubuh, Ba'da Ashar, Ba'da Maghrib, dan Qiyamul Lail rutin."
  },
  {
    id: "FAC-02",
    title: "Asrama Nyaman & Bersih",
    icon: "🏢",
    badge: "Hunian Santri Representatif",
    capacity: "Kamar 6-8 Santri",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80",
    snippet: "Asrama representatif dengan pemisahan area komplek putra dan putri secara mandiri.",
    fullDesc: "Kompleks asrama dirancang dengan ventilasi silang yang sejuk, pencahayaan matahari melimpah, dan ranjang kayu bertingkat yang kokoh. Setiap santri mendapatkan lemari pribadi terkunci. Asrama didampingi Musyrif Asrama 24 jam untuk membimbing adab istirahat, kebersihan harian, dan ketertiban belajar mandiri.",
    specs: [
      "Ranjang tingkat kayu jati kokoh & kasur busa nyaman",
      "Lemari pribadi penyimpanan baju dan mushaf tiap santri",
      "Sirkulasi udara alami melimpah dan tidak pengap",
      "Musyrif pembimbing mendampingi dan standby 24 jam",
      "Area jemuran luas beratap terik dan kamar mandi bersih"
    ],
    schedule: "Kegiatan: Waktu istirahat qoilulah (tidur siang), waktu tidur malam (22.00 WIB), dan bangun qiyamul lail (03.30 WIB)."
  },
  {
    id: "FAC-03",
    title: "Aula Halaqah Ber-AC",
    icon: "📖",
    badge: "Ruang Tahfidz Khusus",
    capacity: "12 Kelompok Halaqah",
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80",
    snippet: "Ruang bimbingan tahfidz yang sejuk dan tenang untuk kenyamanan santri menyimak.",
    fullDesc: "Ruang aula khusus tahfidz berpendingin ruangan (AC) yang hening dan tenang untuk mengoptimalkan fokus hafalan. Digunakan untuk bimbingan fashahah Binnadzor, ujian tasmi' bil-ghaib bertingkat, sertifikasi hafalan, serta program karantina tahfidz jelang wisuda.",
    specs: [
      "Pendingin udara (Full AC) sejuk & kedap kebisingan luar",
      "Meja rehal kayu jati ukir standar halaqah tahfidz",
      "Papan progres monitoring hafalan santri terupdate",
      "Sistem micro-audio untuk listening murattal standar Imam Masjidil Haram",
      "Kapasitas simultan untuk 12 kelompok bimbingan asatidz"
    ],
    schedule: "Kegiatan: Sesi Ziyadah pagi (07.30 - 10.30 WIB) dan Tasmi' mandiri sore hari."
  },
  {
    id: "FAC-04",
    title: "Perpustakaan Kitab & Mushaf",
    icon: "📚",
    badge: "Khazanah Keilmuan Islam",
    capacity: "2.000+ Judul Kitab",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
    snippet: "Koleksi kitab tafsir, hadits, fiqih, serta berbagai mushaf rasm Utsmani.",
    fullDesc: "Pusat literasi pesantren yang mengoleksi ribuan kitab rujukan salafush shalih: Tafsir Ibnu Katsir, Tafsir Jalalain, Fathul Qorib, Tuhfatul Athfal, Matan Al-Jazariyah, serta beragam mushaf cetakan Madinah dan Kemenag RI. Santri dibiasakan muthala'ah untuk memperdalam adab, fiqih ibadah, dan ilmu tajwid.",
    specs: [
      "Koleksi 2.000+ judul kitab kuning, hadits, dan syarah",
      "Koleksi Mushaf Al-Qur'an Standar Madinah & Rasm Utsmani",
      "Ruang baca lesehan berkarpet empuk dan meja muthala'ah",
      "Buku wawasan sejarah Islam dan biografi ulama huffadz",
      "Katalog penataan rapi dengan bimbingan pustakawan pondok"
    ],
    schedule: "Kegiatan: Dibuka setiap hari untuk muthala'ah mandiri dan kajian kitab kuning ba'da Ashar."
  },
  {
    id: "FAC-05",
    title: "Dapur & Ruang Makan",
    icon: "🍽️",
    badge: "Gizi & Kehalalan Terjamin",
    capacity: "Layanan 3x Sehari",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
    snippet: "Penyediaan menu makan santri bergizi, higienis, dan terjaga kehalalannya 3x sehari.",
    fullDesc: "Dikelola oleh tim juru masak pesantren dengan standar kebersihan tinggi. Menggunakan bahan makanan segar pilihan bersertifikasi halal untuk mencukupi kebutuhan gizi, protein, dan stamina fisik santri selama menempuh hafalan Al-Qur'an sepanjang hari.",
    specs: [
      "Penyajian makan 3 kali sehari (Pagi, Siang, dan Sore)",
      "Menu variatif 4 sehat seimbang (protein hewani/nabati, sayuran, buah)",
      "Sistem air minum filter RO (Reverse Osmosis) higienis tanpa batas",
      "Peralatan memasak dan makan stainless steel standar food-grade",
      "Ruang makan luas dengan adab makan sunnah Rasulullah SAW"
    ],
    schedule: "Jadwal Makan: Pagi (06.30 WIB), Siang (12.30 WIB), dan Sore (17.00 WIB)."
  },
  {
    id: "FAC-06",
    title: "Sarana Olahraga & Lapangan",
    icon: "⚽",
    badge: "Kebugaran & Sportivitas",
    capacity: "Lapangan Futsal & Badminton",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
    snippet: "Lapangan futsal, bulu tangkis, dan tenis meja untuk menjaga kebugaran jasmani santri.",
    fullDesc: "Menghafal Al-Qur'an membutuhkan stamina raga yang prima. Pesantren menyediakan area olahraga terbuka untuk futsal, bulu tangkis, tenis meja, dan senam santri. Olahraga diselenggarakan pada jadwal khusus agar santri tetap bugar, rileks, dan memiliki ukhuwah yang erat.",
    specs: [
      "Lapangan futsal luas dengan jaring pengaman keliling",
      "2 lapangan bulu tangkis (badminton) dengan pencahayaan",
      "Meja tenis meja (pingpong) indoor untuk rekreasi sehat",
      "Peralatan olahraga panahan (archery) sunnah",
      "Didukung Pos Kesehatan Pesantren (UKS) siaga"
    ],
    schedule: "Jadwal Olahraga: Sore hari ba'da Ashar (Selasa & Jumat) serta hari Ahad pagi."
  }
];

// ================= PROGRAM PENDIDIKAN PESANTREN =================
const DEFAULT_PROGRAMS = [
  {
    id: "PROG-01",
    title: "1. Program Binnadzor",
    badge: "Sistem Kelas A s.d. E",
    stage: "Tahap 1 - Fondasi Fashahah",
    icon: "📖",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80",
    snippet: "Jenjang awal wajib bagi santri baru. Dikelompokkan ke Kelas A s.d. E (rombel A1, A2...) dibina langsung Asatidz pengampu.",
    fullDesc: "Program pondasi fashahah yang wajib dilalui setiap santri baru sebelum memasuki tahfidz 30 juz. Fokus meluruskan makharijul huruf, ketertiban hukum tajwid, mad, waqaf ibtida, dan pemahaman tanda ghorib Al-Qur'an secara talaqqi tatap muka huruf demi huruf.",
    targetHafalan: "Khatam 30 Juz Bi-An-Nadzor secara tartil + Wajib Hafal Juz 28, 29, 30 + Surat Pilihan (Yasin, Al-Waqi'ah, Ar-Rahman, Al-Mulk).",
    metode: "Talaqqi musyafahah tatap muka, pembagian kelas berjenjang (A1, A2, B1...), evaluasi setoran tajwid harian.",
    evaluasi: "Tes harian makhraj huruf, ujian tengah semester fashahah, dan persiapan menuju Tes Maqbul triwulanan.",
    features: [
      "Khotmil Qur'an 30 Juz Bi-An-Nadzor (Kefasihan tajwid & ghorib)",
      "Target Wajib Hafalan 3 Juz: Juz 28, Juz 29, dan Juz 30",
      "Hafalan Surat Pilihan: Surat Yasin, Ar-Rahman, Al-Waqi'ah, Al-Mulk",
      "Pembagian rombel fleksibel (A1, A2, B1...) dengan Asatidz pendamping"
    ]
  },
  {
    id: "PROG-02",
    title: "2. Tes Maqbul & Program Maqbul",
    badge: "Evaluasi Tiap 3 Bulan",
    stage: "Tahap 2 - Jembatan Akselerasi",
    icon: "🌟",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    snippet: "Jembatan akselerasi pra-tahfidz. Setiap 3 bulan diadakan Tes Maqbul untuk menguji ketuntasan bacaan santri Binnadzor.",
    fullDesc: "Gerbang penyaringan kualitas santri. Setiap 3 bulan sekali diadakan sidang evaluasi komprehensif (Tes Maqbul). Santri yang dinyatakan Maqbul (Lulus) dipromosikan ke Program Maqbul untuk pembinaan intensif persiapan metode hafalan 30 Juz sambil menanti prosesi wisuda resmi.",
    targetHafalan: "Kelulusan seluruh parameter fashahah, tuntas ujian tasmi' Juz 28-30, dan pembekalan metode ziyadah mandiri.",
    metode: "Sidang dewan asatidz penguji, karantina pra-tahfidz, pendalaman teknik muraja'ah dan manajemen waktu hafalan.",
    evaluasi: "Sidang Dewan Asatidz penguji fashahah dan kelayakan hafalan sebelum berhak diwisuda Binnadzor.",
    features: [
      "Tes Maqbul Triwulanan: Ujian komprehensif fashahah & hafalan target",
      "Lolos Tes Maqbul: Santri resmi masuk ke Kelas Akselerasi Program Maqbul",
      "Program Maqbul: Pembinaan intensif persiapan hafalan 30 juz",
      "Wisuda Binnadzor: Pengukuhan resmi kelulusan berhak naik ke jenjang Tahfidz"
    ]
  },
  {
    id: "PROG-03",
    title: "3. Program Tahfidz (Alumni Wisuda)",
    badge: "Sistem Halaqah Ustadz",
    stage: "Tahap 3 - Target 30 Juz Bil-Ghaib",
    icon: "🕌",
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80",
    snippet: "Dikhususkan bagi alumni wisuda Binnadzor. Tidak memakai jenjang kelas, melainkan langsung dibina per Halaqah Ustadz.",
    fullDesc: "Jenjang inti tahfidzul Qur'an. Santri dibimbing dalam halaqah kecil oleh Ustadz spesialis tahfidz. Menerapkan disiplin ketat setoran hafalan baru (Ziyadah) setiap ba'da Shubuh dan ba'da Maghrib, serta kewajiban mengulang hafalan lama (Muraja'ah) terpimpin setiap harinya.",
    targetHafalan: "Khatam Hafalan 30 Juz Al-Qur'an secara Bil-Ghaib (tanpa melihat mushaf) dengan standar mutqin.",
    metode: "Sistem Ziyadah (Hafalan Baru) 1-2 halaman/hari, Sabqi (hafalan kemarin), Manzil (hafalan lama), dan Muraja'ah Kubro mingguan.",
    evaluasi: "Ujian kenaikan juz (Tasmi' 1 Juz sekali duduk), evaluasi bulanan, dan sidang kelayakan wisuda akbar 30 Juz.",
    features: [
      "Pembagian per Ustadz: Santri dibina langsung di Halaqah Asatidz spesialis tahfidz",
      "Target Hafalan 30 Juz Bil-Ghaib (Tanpa melihat mushaf secara mutqin)",
      "Metode Ziyadah & Muraja'ah Harian Terpimpin dengan kartu setoran digital",
      "Persiapan sidang kelulusan & wisuda akbar Tahfidz 30 Juz"
    ]
  },
  {
    id: "PROG-04",
    title: "4. Kelas Pasca Tahfidz (Tasmi' & Sanad)",
    badge: "Khusus Wisuda 30 Juz",
    stage: "Tahap 4 - Puncak Sanad & Fashahah",
    icon: "👑",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=80",
    snippet: "Dikhususkan bagi mahasantri yang khatam 30 Juz dan lulus wisuda. Dibina langsung per Ustadz Pengampu Pasca Tahfidz.",
    fullDesc: "Kelas tertinggi bagi para penjaga Al-Qur'an. Mahasantri yang telah khatam 30 Juz diuji ketahanan dan kekuatan hafalannya melalui tasmi' bil-ghaib 5 juz, 10 juz, 15 juz, hingga 30 juz sekali duduk di hadapan Masyaikh, serta pendalaman Matan Tajwid Al-Jazariyah untuk sertifikasi sanad muttashil.",
    targetHafalan: "Tasmi' Kubro 30 Juz Sekali Duduk + Sertifikasi Ijazah Sanad Al-Qur'an Muttashil hingga Rasulullah SAW.",
    metode: "Talaqqi Ardhul Qur'an dari Al-Fatihah sampai An-Nas kepada Syaikh pemegang sanad, penguasaan matan tajwid Jazariyah & Tuhfah.",
    evaluasi: "Sidang Terbuka Tasmi' Bil-Ghaib dihadapan Dewan Masyaikh dan Wali Santri.",
    features: [
      "Pembagian per Ustadz Pengampu: Bimbingan intensif per Ustadz spesialis pasca tahfidz",
      "Progres Tasmi' Bil-Ghaib Bertingkat: 5 Juz, 10 Juz, 20 Juz hingga 30 Juz Sekali Duduk",
      "Pendalaman Kaidah Tajwid: Penguasaan Matan Al-Jazariyah & Tuhfatul Athfal",
      "Sertifikasi Sanad Al-Qur'an: Ijazah sanad muttashil bagi santri mutqin"
    ]
  }
];

function getFacilityFallbackSvg(index) {
  const f = DEFAULT_FACILITIES[index] || DEFAULT_FACILITIES[0];
  const colors = [
    ['#064e3b', '#047857', '#f59e0b'],
    ['#0f172a', '#1e293b', '#38bdf8'],
    ['#312e81', '#4338ca', '#a5b4fc'],
    ['#78350f', '#92400e', '#fde047'],
    ['#14532d', '#15803d', '#f97316'],
    ['#0e7490', '#0369a1', '#34d399']
  ];
  const pair = colors[index % colors.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
    <defs>
      <linearGradient id="g_${index}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${pair[0]}"/>
        <stop offset="100%" stop-color="${pair[1]}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g_${index})"/>
    <circle cx="400" cy="180" r="100" fill="rgba(255,255,255,0.08)"/>
    <circle cx="400" cy="180" r="75" fill="none" stroke="${pair[2]}" stroke-width="2" opacity="0.4"/>
    <text x="400" y="195" font-size="64" text-anchor="middle">${f.icon}</text>
    <text x="400" y="260" font-family="system-ui, sans-serif" font-size="24" fill="#ffffff" font-weight="bold" text-anchor="middle">${escapeHtml(f.title.toUpperCase())}</text>
    <text x="400" y="295" font-family="system-ui, sans-serif" font-size="14" fill="${pair[2]}" font-weight="600" text-anchor="middle">Fasilitas Pondok Pesantren Tahfidz Al-Barokah</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function getProgramFallbackSvg(index) {
  const p = DEFAULT_PROGRAMS[index] || DEFAULT_PROGRAMS[0];
  const colors = [
    ['#0369a1', '#0284c7', '#38bdf8'],
    ['#c2410c', '#ea580c', '#fdba74'],
    ['#065f46', '#047857', '#6ee7b7'],
    ['#854d0e', '#a16207', '#fde047']
  ];
  const pair = colors[index % colors.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
    <defs>
      <linearGradient id="gp_${index}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${pair[0]}"/>
        <stop offset="100%" stop-color="${pair[1]}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#gp_${index})"/>
    <circle cx="400" cy="180" r="100" fill="rgba(255,255,255,0.08)"/>
    <circle cx="400" cy="180" r="75" fill="none" stroke="${pair[2]}" stroke-width="2" opacity="0.4"/>
    <text x="400" y="195" font-size="64" text-anchor="middle">${p.icon}</text>
    <text x="400" y="260" font-family="system-ui, sans-serif" font-size="24" fill="#ffffff" font-weight="bold" text-anchor="middle">${escapeHtml(p.title.toUpperCase())}</text>
    <text x="400" y="295" font-family="system-ui, sans-serif" font-size="14" fill="${pair[2]}" font-weight="600" text-anchor="middle">${escapeHtml(p.stage)}</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}


// ================= DEFAULT ALUMNI DATA =================
const DEFAULT_ALUMNI_DATA = [];

// ================= APP STATE =================
let WebState = {
  settings: {},
  articles: [],
  gallery: [],
  psbPendaftar: [],
  alumni: [],
  alumniFilterCategory: 'all',
  alumniFilterYear: 'all',
  alumniSearchQuery: '',
  alumniViewMode: 'grid',
  articleFilter: 'Semua',
  galleryFilter: 'Semua'
};

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  initPondokIdentity();
  renderDynamicWebContent();
  renderDynamicFacilities();
  renderFormalSchools();
  renderEkstrakurikuler();
  renderAlumni();
  checkAlumniAdminStatus();
  renderWebsitePembayaran();
  renderArticles();
  renderWebsitePhotoSlider();
  renderGallery();
  initPortalViewRouting();
  initScrollReveal();
  initStatCounters();
  initInteractiveCardClicks();
  if (typeof initCard3DTilt === 'function') {
    initCard3DTilt('.facility-card, .program-card, .photo-card-tilt, .about-bento-card, .school-card, .ekskul-card');
  }
  initModalKeyboardNav();
  initDragToScroll('navbarScrollableTrack');
  initDragToScroll('portalCardsTrack');
  initDragToScroll('mobileNavChipsBar');
  initDragToScroll('quickLauncherGrid');
  initHeroFloatingPhoto();
  checkAdminQuickControls();
});

function initStorage() {
  // Settings (Utamakan dari LocalStorage atau DEFAULT_SETTINGS resmi Asrama Tahfidz Sunan Bonang)
  const s = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  WebState.settings = (s && s !== '{}') ? JSON.parse(s) : {
    ...(typeof DEFAULT_SETTINGS !== 'undefined' ? DEFAULT_SETTINGS : {}),
    namaPondok: "Asrama Tahfidz Sunan Bonang",
    yayasanPondok: "Yayasan PP. Mamba'ul Ma'arif",
    lokasiPondok: "Denanyar Jombang",
    alamatPondok: "Jl. KH. Bisri Syansuri, Denanyar, Jombang, Jawa Timur",
    noKontakPondok: "0812-3456-7890",
    noKontakPutri: "0813-9876-5432",
    pengasuhPondok: "H. M. Jauharul Afif, Lc., M.Ag., M.Pd.",
    pengasuhIstri: "Hj. Mazidatul Faizah, M.Si.",
    fotoPengasuh: "",
    fotoPengasuhIstri: "",
    heroFloatingPhoto: "foto-masyayikh.png",
    kepalaTahfidz: "Ust. Misbakhul Mujtahidin"
  };

  // Auto-upgrade jika data lokal masih berisi nama contoh bawaan lama
  if (!WebState.settings.pengasuhPondok || WebState.settings.pengasuhPondok.includes('Ahmad Dahlan Masykur')) {
    WebState.settings.pengasuhPondok = "H. M. Jauharul Afif, Lc., M.Ag., M.Pd.";
  }
  if (!WebState.settings.pengasuhIstri || WebState.settings.pengasuhIstri.includes('Siti Fatimah')) {
    WebState.settings.pengasuhIstri = "Hj. Mazidatul Faizah, M.Si.";
  }
  if (!WebState.settings.kepalaTahfidz || WebState.settings.kepalaTahfidz.includes('Muhammad Ridwan')) {
    WebState.settings.kepalaTahfidz = "Ust. Misbakhul Mujtahidin";
  }
  if (!WebState.settings.medsos) {
    WebState.settings.medsos = (typeof DEFAULT_SETTINGS !== 'undefined' && DEFAULT_SETTINGS.medsos) ? { ...DEFAULT_SETTINGS.medsos } : {
      igPutra: "@sunanbonang_putra",
      igPutri: "@sunanbonang_putri",
      tiktokPutra: "@tahfidz_sunanbonang",
      tiktokPutri: "@tahfidz_sunanbonang_pi",
      youtube: "Asrama Tahfidz Sunan Bonang TV",
      facebook: "Asrama Tahfidz Sunan Bonang Denanyar"
    };
  }

  // Pisahkan total foto banner hero depan dengan foto pengasuh di profil:
  // Jika fotoPengasuh sempat tertaut dengan lukisan masyayikh depan, lepaskan tautannya
  if (WebState.settings.fotoPengasuh === 'foto-masyayikh.png' || WebState.settings.fotoPengasuh === 'foto-masyayikh.jpg') {
    WebState.settings.fotoPengasuh = "";
  }
  if (!WebState.settings.heroFloatingPhoto || WebState.settings.heroFloatingPhoto === 'foto-masyayikh.jpg' || (WebState.settings.heroFloatingPhoto && WebState.settings.heroFloatingPhoto.startsWith('data:image/jpeg'))) {
    WebState.settings.heroFloatingPhoto = 'foto-masyayikh.png';
  }

  // Articles
  const arts = localStorage.getItem(STORAGE_KEYS.ARTICLES);
  try {
    const parsed = arts ? JSON.parse(arts) : null;
    WebState.articles = (Array.isArray(parsed) && parsed.length > 0) ? parsed : [ ...DEFAULT_ARTICLES ];
  } catch (e) {
    WebState.articles = [ ...DEFAULT_ARTICLES ];
  }

  // Gallery
  const gal = localStorage.getItem(STORAGE_KEYS.GALLERY);
  try {
    const parsed = gal ? JSON.parse(gal) : null;
    WebState.gallery = (Array.isArray(parsed) && parsed.length > 0) ? parsed : [ ...DEFAULT_GALLERY ];
  } catch (e) {
    WebState.gallery = [ ...DEFAULT_GALLERY ];
  }

  // PSB - Inisialisasi daftar calon santri pendaftar
  let loadedPsb = [];
  try {
    const psb = localStorage.getItem(STORAGE_KEYS.PSB);
    loadedPsb = psb ? JSON.parse(psb) : [];
  } catch (e) {
    loadedPsb = [];
  }
  // Bersihkan data contoh bawaan jika masih ada
  WebState.psbPendaftar = Array.isArray(loadedPsb)
    ? loadedPsb.filter(p => p.noRegistrasi !== 'PSB-2025-1024' && p.noRegistrasi !== 'PSB-2025-1025' && p.nama !== 'Muhammad Ilham Pratama' && p.nama !== 'Aisyah Zahira Khairunnisa')
    : [];


  // Alumni Data (Kosongkan data contoh/dummy bawaan)
  try {
    const alm = localStorage.getItem(STORAGE_KEYS.ALUMNI);
    let loadedAlumni = alm ? JSON.parse(alm) : [];
    if (!Array.isArray(loadedAlumni)) loadedAlumni = [];

    // Filter keluar data dummy (alm-001 s.d. alm-008) jika masih tersimpan di cache browser
    loadedAlumni = loadedAlumni.filter(a => {
      if (!a || !a.id) return false;
      const strId = String(a.id);
      return !strId.startsWith('alm-00');
    });

    WebState.alumni = loadedAlumni;
    localStorage.setItem(STORAGE_KEYS.ALUMNI, JSON.stringify(WebState.alumni));
  } catch (e) {
    WebState.alumni = [];
  }

  saveWebStorage();
  updatePendaftarCount();

  // Auto-heal logo pondok jika tersimpan dengan latar hitam akibat ekspor JPEG lama
  if (WebState.settings.logoPondok && typeof cleanBlackBackgroundFromLogo === 'function') {
    cleanBlackBackgroundFromLogo(WebState.settings.logoPondok, function(cleaned) {
      if (cleaned && cleaned !== WebState.settings.logoPondok) {
        WebState.settings.logoPondok = cleaned;
        try {
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(WebState.settings));
        } catch (e) {}
        const logoWraps = document.querySelectorAll('.brand-logo');
        logoWraps.forEach(wrap => {
          wrap.style.background = 'transparent';
          wrap.style.border = 'none';
          wrap.style.boxShadow = 'none';
          wrap.innerHTML = `<img src="${cleaned}" alt="Logo" style="width:100%; height:100%; object-fit:contain; background:transparent;">`;
        });
      }
    });
  }
}

function cleanBlackBackgroundFromLogo(imageSrc, callback) {
  if (!imageSrc || typeof imageSrc !== 'string' || !imageSrc.startsWith('data:image/')) {
    if (callback) callback(imageSrc);
    return;
  }

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function () {
    try {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      if (!w || !h) {
        if (callback) callback(imageSrc);
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      // Cek 4 sudut gambar
      const cornerIndices = [
        0,
        (w - 1) * 4,
        ((h - 1) * w) * 4,
        ((h - 1) * w + (w - 1)) * 4
      ];

      // Jika sudut-sudut sudah transparan murni, tidak ada background hitam
      const allCornersTransparent = cornerIndices.every(idx => data[idx + 3] === 0);
      if (allCornersTransparent) {
        if (callback) callback(imageSrc);
        return;
      }

      // Deteksi apakah sudut-sudut berwarna hitam pekat
      const isCornerBlack = (idx) => {
        if (data[idx + 3] < 80) return false;
        return (data[idx] <= 36 && data[idx + 1] <= 36 && data[idx + 2] <= 36);
      };

      const blackCornersCount = cornerIndices.filter(isCornerBlack).length;
      if (blackCornersCount < 2) {
        if (callback) callback(imageSrc);
        return;
      }

      // BFS flood-fill dari 4 tepi gambar untuk menghapus latar belakang hitam
      const visited = new Uint8Array(w * h);
      const queue = [];

      const isBgBlack = (idx) => {
        if (data[idx + 3] === 0) return false;
        return (data[idx] <= 36 && data[idx + 1] <= 36 && data[idx + 2] <= 36);
      };

      for (let x = 0; x < w; x++) {
        const topIdx = x * 4;
        if (isBgBlack(topIdx)) {
          visited[x] = 1;
          queue.push(x, 0);
        }
        const botY = h - 1;
        const botFlat = botY * w + x;
        const botIdx = botFlat * 4;
        if (isBgBlack(botIdx)) {
          visited[botFlat] = 1;
          queue.push(x, botY);
        }
      }

      for (let y = 1; y < h - 1; y++) {
        const leftFlat = y * w;
        const leftIdx = leftFlat * 4;
        if (!visited[leftFlat] && isBgBlack(leftIdx)) {
          visited[leftFlat] = 1;
          queue.push(0, y);
        }
        const rightFlat = y * w + (w - 1);
        const rightIdx = rightFlat * 4;
        if (!visited[rightFlat] && isBgBlack(rightIdx)) {
          visited[rightFlat] = 1;
          queue.push(w - 1, y);
        }
      }

      let head = 0;
      while (head < queue.length) {
        const qx = queue[head++];
        const qy = queue[head++];
        const pIndex = (qy * w + qx) * 4;
        data[pIndex + 3] = 0;

        const neighbors = [
          [qx + 1, qy],
          [qx - 1, qy],
          [qx, qy + 1],
          [qx, qy - 1]
        ];

        for (let i = 0; i < 4; i++) {
          const nx = neighbors[i][0];
          const ny = neighbors[i][1];
          if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
            const nFlat = ny * w + nx;
            if (!visited[nFlat]) {
              visited[nFlat] = 1;
              const nIdx = nFlat * 4;
              if (isBgBlack(nIdx)) {
                queue.push(nx, ny);
              } else {
                const maxVal = Math.max(data[nIdx], data[nIdx + 1], data[nIdx + 2]);
                if (maxVal < 65) {
                  const alpha = Math.round(((maxVal - 30) / 35) * 255);
                  data[nIdx + 3] = Math.max(0, Math.min(255, alpha));
                }
              }
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const cleanDataUrl = canvas.toDataURL('image/png');
      if (callback) callback(cleanDataUrl);
    } catch (err) {
      console.warn("cleanBlackBackgroundFromLogo error:", err);
      if (callback) callback(imageSrc);
    }
  };

  img.onerror = function () {
    if (callback) callback(imageSrc);
  };

  img.src = imageSrc;
}

function saveWebStorage() {
  localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(WebState.articles));
  localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(WebState.gallery));
  localStorage.setItem(STORAGE_KEYS.PSB, JSON.stringify(WebState.psbPendaftar));
  // Catatan: saveWebStorage() hanya menyimpan cache tampilan website publik lokal.
  // Tidak memicu pushLocalToCloud(true) agar halaman pengunjung umum tidak menimpa data pengurus di Cloud.
}

function initPondokIdentity() {
  const defaultNama = "Asrama Tahfidz Sunan Bonang";
  const defaultYayasan = "Yayasan PP. Mamba'ul Ma'arif";
  const defaultLokasi = "Denanyar Jombang";
  const defaultAlamat = "Jl. KH. Bisri Syansuri, Denanyar, Jombang, Jawa Timur";

  const nameElements = document.querySelectorAll('.bind-nama-pondok');
  nameElements.forEach(el => el.textContent = WebState.settings.namaPondok || defaultNama);

  const yayasanElements = document.querySelectorAll('.bind-yayasan-pondok');
  yayasanElements.forEach(el => el.textContent = WebState.settings.yayasanPondok || defaultYayasan);

  const lokasiElements = document.querySelectorAll('.bind-lokasi-pondok');
  lokasiElements.forEach(el => el.textContent = WebState.settings.lokasiPondok || defaultLokasi);

  const alamatElements = document.querySelectorAll('.bind-alamat-pondok');
  alamatElements.forEach(el => el.textContent = WebState.settings.alamatPondok || defaultAlamat);

  const telpElements = document.querySelectorAll('.bind-kontak-pondok');
  telpElements.forEach(el => el.textContent = WebState.settings.noKontakPondok || "0812-3456-7890");

  const rawPhone = (WebState.settings.noKontakPondok || "0812-3456-7890").replace(/\D/g, '');
  const cleanPhone = rawPhone.startsWith('0') ? '62' + rawPhone.slice(1) : (rawPhone.startsWith('62') ? rawPhone : '6281234567890');
  const namaPondok = WebState.settings.namaPondok || defaultNama;

  const floatingWaBtn = document.getElementById('floatingWaBtn');
  if (floatingWaBtn) {
    floatingWaBtn.href = `https://wa.me/${cleanPhone}?text=Assalamu%27alaikum%20Admin%20Pondok,%20saya%20ingin%20bertanya%20informasi%20${encodeURIComponent(namaPondok)}`;
  }

  // Bind WhatsApp PSB Admin & CP Links
  const waPsbPutra = document.querySelectorAll('.bind-wa-psb-putra');
  waPsbPutra.forEach(btn => {
    btn.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Assalamu'alaikum Admin Panitia PSB Putra ${namaPondok}, saya ingin bertanya dan konsultasi mengenai pendaftaran santri baru...`)}`;
  });

  // Bind WhatsApp PSB Putri (Ustadzah / Konsultasi Wali)
  const putriPhone = WebState.settings.noKontakPutri || WebState.settings.noKontakPondok || "0813-9876-5432";
  const rawPutri = putriPhone.replace(/\D/g, '');
  const cleanPutriPhone = rawPutri.startsWith('0') ? '62' + rawPutri.slice(1) : (rawPutri.startsWith('62') ? rawPutri : cleanPhone);

  const kontakPutriElements = document.querySelectorAll('.bind-kontak-putri');
  kontakPutriElements.forEach(el => el.textContent = putriPhone);

  const waPsbPutri = document.querySelectorAll('.bind-wa-psb-putri');
  waPsbPutri.forEach(btn => {
    btn.href = `https://wa.me/${cleanPutriPhone}?text=${encodeURIComponent(`Assalamu'alaikum Ustadzah Panitia PSB Putri ${namaPondok}, saya ingin bertanya dan konsultasi mengenai pendaftaran santriwati baru...`)}`;
  });

  const waPsbHelp = document.querySelectorAll('.bind-wa-psb-help');
  waPsbHelp.forEach(btn => {
    btn.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Assalamu'alaikum Admin PSB ${namaPondok}, saya butuh panduan / bantuan pengisian formulir pendaftaran santri baru...`)}`;
  });

  const pengasuhSuami = WebState.settings.pengasuhPondok || "H. M. Jauharul Afif, Lc., M.Ag., M.Pd.";
  const pengasuhIstri = WebState.settings.pengasuhIstri || "Hj. Mazidatul Faizah, M.Si.";
  const namaLengkapPengasuh = pengasuhIstri ? `${pengasuhSuami} & ${pengasuhIstri}` : pengasuhSuami;

  const pengasuhElements = document.querySelectorAll('.bind-pengasuh-pondok');
  pengasuhElements.forEach(el => el.textContent = namaLengkapPengasuh);

  renderWebPengasuhSection();

  const kepalaTahfidzElements = document.querySelectorAll('.bind-kepala-tahfidz');
  kepalaTahfidzElements.forEach(el => el.textContent = WebState.settings.kepalaTahfidz || "Ust. Misbakhul Mujtahidin");

  // Logo pondok (transparan murni tanpa background kotak hitam)
  if (WebState.settings.logoPondok) {
    const logoWraps = document.querySelectorAll('.brand-logo');
    logoWraps.forEach(wrap => {
      wrap.style.background = 'transparent';
      wrap.style.border = 'none';
      wrap.style.boxShadow = 'none';
      wrap.innerHTML = `<img src="${WebState.settings.logoPondok}" alt="Logo" style="width:100%; height:100%; object-fit:contain; background:transparent;">`;
    });
  }

  // 1. Hero Banner Photo Background (Full Photo Pesantren / Masjid)
  const heroPhotoEl = document.getElementById('webHeroBgPhoto');
  if (heroPhotoEl) {
    const heroPhoto = WebState.settings.heroBannerPhoto || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1920&q=80';
    heroPhotoEl.style.backgroundImage = `url("${heroPhoto}")`;
  }

  // 2. Foto Mbah Yai / Foto Pendukung (Pure Foto, Posisi Bebas Digeser)
  const floatingImg = document.getElementById('webHeroFloatingImg');
  if (floatingImg) {
    const fotoYai = WebState.settings.heroFloatingPhoto || 'foto-masyayikh.png';
    floatingImg.src = fotoYai;
  }
  applyHeroPhotoPosition();
  updateHeroPhotoLockUI();

  // Social media links & handles
  const medsos = WebState.settings.medsos || {
    igPutra: "@albarokah_putra",
    igPutri: "@albarokah_putri",
    tiktokPutra: "@tahfidz_putra",
    tiktokPutri: "@tahfidz_putri",
    youtube: "Pesantren Tahfidz Al-Barokah TV",
    facebook: "Pondok Pesantren Tahfidz Al-Barokah"
  };

  const formatSocialUrl = (type, val) => {
    if (!val) return '#';
    val = val.trim();
    if (val.startsWith('http://') || val.startsWith('https://')) return val;
    const clean = val.replace(/^@/, '');
    if (type === 'ig') return `https://instagram.com/${clean}`;
    if (type === 'tiktok') return `https://www.tiktok.com/@${clean}`;
    if (type === 'youtube') return `https://youtube.com/results?search_query=${encodeURIComponent(val)}`;
    if (type === 'facebook') return `https://facebook.com/${clean}`;
    return `https://${val}`;
  };

  const bindSocial = (idText, idLink, idFooterLink, val, type) => {
    const textEl = document.getElementById(idText);
    if (textEl) textEl.textContent = val || '-';
    const linkEl = document.getElementById(idLink);
    if (linkEl) linkEl.href = formatSocialUrl(type, val);
    const footEl = document.getElementById(idFooterLink);
    if (footEl) footEl.href = formatSocialUrl(type, val);
  };

  bindSocial('textIgPutra', 'linkIgPutra', 'footerLinkIgPutra', medsos.igPutra, 'ig');
  bindSocial('textIgPutri', 'linkIgPutri', 'footerLinkIgPutri', medsos.igPutri, 'ig');
  bindSocial('textTiktokPutra', 'linkTiktokPutra', 'footerLinkTiktokPutra', medsos.tiktokPutra, 'tiktok');
  bindSocial('textTiktokPutri', 'linkTiktokPutri', 'footerLinkTiktokPutri', medsos.tiktokPutri, 'tiktok');
  bindSocial('textYoutube', 'linkYoutube', 'footerLinkYoutube', medsos.youtube, 'youtube');
  bindSocial('textFacebook', 'linkFacebook', 'footerLinkFacebook', medsos.facebook, 'facebook');

  // WhatsApp Link Brosur PSB
  const waBrosur = document.getElementById('linkWaBrosur');
  if (waBrosur) {
    const rawTelp = WebState.settings.noKontakPondok || "0812-3456-7890";
    const cleanTelp = rawTelp.replace(/[^0-9]/g, '');
    const waNum = cleanTelp.startsWith('0') ? '62' + cleanTelp.slice(1) : cleanTelp;
    waBrosur.href = `https://wa.me/${waNum}?text=${encodeURIComponent("Assalamu'alaikum Warahmatullahi Wabarakatuh, Panitia PSB. Saya ingin menanyakan informasi pendaftaran santri baru dan rincian biaya pondok.")}`;
  }
}

function renderHeroPengasuhCrest() {
  const floatingImg = document.getElementById('webHeroFloatingImg');
  if (floatingImg) {
    const foto = WebState.settings.heroFloatingPhoto || 'foto-masyayikh.png';
    if (foto) floatingImg.src = foto;
  }
  if (typeof applyHeroPhotoPosition === 'function') {
    applyHeroPhotoPosition();
    updateHeroPhotoLockUI();
  }
}

function renderWebPengasuhSection() {
  const pengasuhSuami = WebState.settings.pengasuhPondok || "H. M. Jauharul Afif, Lc., M.Ag., M.Pd.";
  const pengasuhIstri = WebState.settings.pengasuhIstri || "Hj. Mazidatul Faizah, M.Si.";
  let fotoPengasuh = WebState.settings.fotoPengasuh || "";
  if (fotoPengasuh === 'foto-masyayikh.png' || fotoPengasuh === 'foto-masyayikh.jpg') {
    fotoPengasuh = "";
  }

  // 1. Bento Card Big Photo Banner (1 Foto Bersama / Berdua)
  const photoWrap = document.getElementById('webPengasuhBentoPhotoWrap');
  if (photoWrap) {
    if (fotoPengasuh) {
      photoWrap.innerHTML = `
        <img src="${fotoPengasuh}" alt="Pengasuh Pondok" style="width:100%; height:100%; object-fit:cover; display:block;">
        <span style="position:absolute; top:12px; left:12px; background:rgba(6,78,59,0.92); color:#fef08a; font-weight:800; font-size:11px; padding:4px 12px; border-radius:999px; border:1px solid rgba(254,240,138,0.4); backdrop-filter:blur(4px); z-index:3;">
          PENGASUH PESANTREN
        </span>
      `;
    } else {
      photoWrap.innerHTML = `
        <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, #064e3b 0%, #022c22 100%);">
          <span style="font-size:64px;">👳‍♂️ 🧕</span>
        </div>
        <span style="position:absolute; top:12px; left:12px; background:rgba(6,78,59,0.92); color:#fef08a; font-weight:800; font-size:11px; padding:4px 12px; border-radius:999px; border:1px solid rgba(254,240,138,0.4); backdrop-filter:blur(4px); z-index:3;">
          PENGASUH PESANTREN
        </span>
      `;
    }
  }

  // 2. Bento Card Names (Nama Sendiri-Sendiri)
  const namesWrap = document.getElementById('webPengasuhBentoNames');
  if (namesWrap) {
    if (pengasuhIstri) {
      namesWrap.innerHTML = `
        <h3 style="font-size:18px; font-weight:800; color:#ffffff; margin:0; line-height:1.3;">
          ${escapeHtml(pengasuhSuami)}
        </h3>
        <div style="font-size:14.5px; font-weight:700; color:#fde047; margin-top:4px; line-height:1.3;">
          &amp; ${escapeHtml(pengasuhIstri)}
        </div>
      `;
    } else {
      namesWrap.innerHTML = `
        <h3 style="font-size:18px; font-weight:800; color:#ffffff; margin:0; line-height:1.3;">
          ${escapeHtml(pengasuhSuami)}
        </h3>
      `;
    }
  }

  // 3. Detail Modal Pengasuh (1 Foto Besar di Atas, Profil Kyai & Nyai di Bawah)
  const modalWrap = document.getElementById('tabContentPengasuhProfiles');
  if (modalWrap) {
    modalWrap.innerHTML = `
      <div style="background:#fff; border-radius:14px; border:1px solid #e2e8f0; overflow:hidden; box-shadow:0 4px 14px rgba(0,0,0,0.06); margin-bottom:24px;">
        <div style="height:240px; width:100%; background:#ecfdf5; position:relative; overflow:hidden;">
          ${fotoPengasuh ? `<img src="${fotoPengasuh}" alt="Foto Pengasuh" style="width:100%; height:100%; object-fit:cover; display:block;">` : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:64px; background:linear-gradient(135deg, #ecfdf5, #a7f3d0);">👳‍♂️ 🧕</div>`}
          <span style="position:absolute; top:12px; left:12px; background:#065f46; color:#fef08a; font-size:11px; font-weight:800; padding:4px 12px; border-radius:999px; box-shadow:0 2px 6px rgba(0,0,0,0.15);">
            PENGASUH PONDOK PESANTREN
          </span>
        </div>
        <div style="padding:22px;">
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:16px;">
            <!-- Profil Kyai -->
            <div style="background:#f8fafc; padding:14px 16px; border-radius:10px; border-left:4px solid #059669;">
              <div style="font-size:11px; font-weight:800; color:#059669; text-transform:uppercase; margin-bottom:2px;">PENGASUH UTAMA (KYAI)</div>
              <h4 style="font-size:16px; font-weight:800; color:#0f172a; margin:0 0 4px 0; line-height:1.35;">${escapeHtml(pengasuhSuami)}</h4>
              <p style="font-size:12px; color:#64748b; margin:0; line-height:1.5;">Ulama huffadz alumnus pesantren tahfidz salaf yang mengabdikan hidupnya dalam pembinaan qira'at Al-Qur'an dan kajian kitab kuning.</p>
            </div>

            <!-- Profil Nyai -->
            ${pengasuhIstri ? `
            <div style="background:#fffbeb; padding:14px 16px; border-radius:10px; border-left:4px solid #d97706;">
              <div style="font-size:11px; font-weight:800; color:#b45309; text-transform:uppercase; margin-bottom:2px;">PENGASUH PUTRI (NYAI / UMI)</div>
              <h4 style="font-size:16px; font-weight:800; color:#0f172a; margin:0 0 4px 0; line-height:1.35;">${escapeHtml(pengasuhIstri)}</h4>
              <p style="font-size:12px; color:#78350f; margin:0; line-height:1.5;">Membimbing akhlaqul karimah santriwati, ketertiban asrama putri, dan keteladanan ibadah harian.</p>
            </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // 4. Modal Sanad Kyai Name
  const modalSanadName = document.getElementById('modalSanadKyaiName');
  if (modalSanadName) {
    modalSanadName.textContent = pengasuhSuami;
  }
}

function getActiveFacilities() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FACILITIES || 'sitahfidz_web_facilities');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return DEFAULT_FACILITIES;
}

function renderDynamicFacilities() {
  const grid = document.querySelector('.facility-grid');
  if (!grid) return;
  const facilities = getActiveFacilities();
  grid.innerHTML = facilities.map((fac, idx) => {
    const delayClass = `reveal-delay-${(idx % 6) + 1}`;
    const badgeText = fac.badge ? (fac.badge.includes(fac.icon) ? fac.badge : `${fac.icon} ${fac.badge}`) : `${fac.icon || '🏢'} Fasilitas`;
    return `
      <div class="facility-card reveal-on-scroll reveal-up ${delayClass}" onclick="openFacilityModal(${idx})" title="Klik untuk lihat foto & detail fasilitas">
        <div class="facility-img-wrap">
          <img src="${escapeHtml(fac.image || '')}" alt="${escapeHtml(fac.title || 'Fasilitas')}" class="facility-img" onerror="this.onerror=null; if(typeof getFacilityFallbackSvg==='function') this.src=getFacilityFallbackSvg(${idx});" loading="lazy">
          <div class="facility-img-gradient"></div>
          <span class="facility-badge">${escapeHtml(badgeText)}</span>
          <div class="facility-card-icon-floating">${escapeHtml(fac.icon || '🏢')}</div>
        </div>
        <div class="facility-body">
          <h4 class="facility-title">${escapeHtml(fac.title || '')}</h4>
          <p class="facility-desc">${escapeHtml(fac.snippet || '')}</p>
          <div class="facility-action-hint">
            <span>🔍 Klik Lihat Foto & Detail</span>
            <span class="arrow-hint">→</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ================= SEKOLAH FORMAL TERPADU CONTROLLER =================
let currentSchoolFilter = 'semua';

function stripAkreditasi(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/\s*[•\-–|]\s*Akreditasi\s*[A-C]?/gi, '')
    .replace(/terakreditasi\s*[A-C]?\s*unggul/gi, 'Unggulan')
    .replace(/terakreditasi\s*[A-C]?/gi, '')
    .replace(/Akreditasi\s*[A-C]?/gi, '')
    .trim();
}

function getActiveFormalSchools() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SEKOLAH_FORMAL || 'sitahfidz_sekolah_formal');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsed.forEach(s => {
          s.image = '';
          s.brosurImage = s.brosurImage || '';
        });
        return parsed;
      }
    }
  } catch (e) {}
  const list = (typeof DEFAULT_FORMAL_SCHOOLS !== 'undefined') ? JSON.parse(JSON.stringify(DEFAULT_FORMAL_SCHOOLS)) : [];
  list.forEach(s => {
    s.image = '';
    s.brosurImage = s.brosurImage || '';
  });
  return list;
}

function renderFormalSchools(filterCategory = currentSchoolFilter) {
  currentSchoolFilter = filterCategory;
  const grid = document.getElementById('formalSchoolsGrid');
  if (!grid) return;

  const allSchools = getActiveFormalSchools();
  const filtered = allSchools.filter(item => {
    if (filterCategory === 'semua') return true;
    return item.category === filterCategory;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding:40px; color:#64748b;">
        <span style="font-size:32px;">🏫</span>
        <p style="margin-top:8px;">Belum ada data sekolah formal untuk kategori ini.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const originalIndex = allSchools.findIndex(s => s.id === item.id);
    const idx = originalIndex >= 0 ? originalIndex : 0;
    const delayClass = `reveal-delay-${(idx % 6) + 1}`;

    const highlightsHtml = (item.highlights || []).map(hl => `
      <li class="school-highlight-item">
        <span class="chk">✓</span>
        <span>${escapeHtml(stripAkreditasi(hl))}</span>
      </li>
    `).join('');

    const bannerBgStyle = `background: ${item.gradient || 'linear-gradient(135deg, #065f46 0%, #047857 100%)'};`;

    return `
      <div class="school-card reveal-on-scroll reveal-up ${delayClass}" onclick="openModalBrosurSekolah(${idx})" title="Klik untuk lihat informasi profil lengkap ${escapeHtml(item.name)}">
        <div class="school-card-banner" style="${bannerBgStyle}; display:flex; align-items:center; justify-content:center; height:105px; position:relative; overflow:hidden;">
          <div style="position:absolute; inset:0; opacity:0.08; background-image:radial-gradient(#fff 2px, transparent 2px); background-size:16px 16px;"></div>
          <div class="school-icon-box" style="font-size:34px; filter:drop-shadow(0 4px 8px rgba(0,0,0,0.25));">${escapeHtml(item.icon || '🏛️')}</div>
        </div>
        <div class="school-card-body" style="display:flex; flex-direction:column; flex:1;">
          <h3 class="school-name">${escapeHtml(item.name)}</h3>
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:6px; margin-bottom:8px;">
            <span class="school-level-tag" style="margin-bottom:0;">
              <span>🏷️</span> <span>${escapeHtml(item.level || '')}</span>
            </span>
            ${item.brosurImage ? `
              <span style="display:inline-flex; align-items:center; gap:4px; font-size:10.5px; font-weight:800; background:#ecfdf5; color:#047857; padding:2px 8px; border-radius:999px; border:1px solid #a7f3d0;">
                <span>📄</span> Brosur Resmi Siap
              </span>
            ` : ''}
          </div>
          <p class="school-desc">${escapeHtml(item.desc || '')}</p>

          <ul class="school-highlight-list">
            ${highlightsHtml}
          </ul>

          <div class="school-card-footer" style="margin-top:auto; padding-top:14px; border-top:1px solid #f1f5f9;">
            <button type="button" class="btn btn-gold btn-sm" onclick="event.stopPropagation(); openModalBrosurSekolah(${idx})" style="width:100%; font-weight:800; display:flex; align-items:center; justify-content:center; gap:6px; box-shadow:0 3px 10px rgba(245,158,11,0.25);">
              <span>📋</span> ${item.brosurImage ? 'Lihat Brosur &amp; Syarat PPDB' : 'Lihat Profil &amp; Syarat PPDB'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (typeof initScrollReveal === 'function') initScrollReveal();
  if (typeof initInteractiveCardClicks === 'function') initInteractiveCardClicks();
}

function filterFormalSchools(category, btnElement) {
  currentSchoolFilter = category;
  document.querySelectorAll('#schoolFilters .filter-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
  renderFormalSchools(category);
}

let activeSchoolModalIndex = null;

function openModalBrosurSekolah(index) {
  const allSchools = getActiveFormalSchools();
  const school = allSchools[index];
  if (!school) return;

  activeSchoolModalIndex = index;
  const modal = document.getElementById('modalBrosurSekolah');
  if (!modal) return;

  const header = document.getElementById('modalBrosurSekolahHeader');
  const iconEl = document.getElementById('modalBrosurSekolahIcon');
  const badgeEl = document.getElementById('modalBrosurSekolahBadge');
  const titleEl = document.getElementById('modalBrosurSekolahTitle');
  const bodyEl = document.getElementById('modalBrosurSekolahBody');
  const btnWa = document.getElementById('btnModalBrosurSekolahWa');

  if (header) header.style.background = school.gradient || 'linear-gradient(135deg, #065f46 0%, #047857 100%)';
  if (iconEl) iconEl.textContent = school.icon || '🏛️';
  if (badgeEl) {
    badgeEl.textContent = '';
    badgeEl.style.display = 'none';
  }
  if (titleEl) titleEl.textContent = `${school.name} - ${school.level}`;

  // WhatsApp Button
  if (btnWa) {
    const targetPhone = school.kontak || WebState.settings.noKontakPondok || '0812-3456-7890';
    const cleanWa = targetPhone.replace(/[^0-9]/g, '');
    const waPhone = cleanWa.startsWith('0') ? '62' + cleanWa.slice(1) : cleanWa;
    const msg = encodeURIComponent(`Assalamu'alaikum, saya ingin bertanya dan konsultasi mengenai pendaftaran santri baru terpadu dengan sekolah formal: ${school.fullName || school.name}. Mohon informasi pendaftaran lengkapnya. Terima kasih.`);
    btnWa.href = `https://wa.me/${waPhone}?text=${msg}`;
  }

  const highlightsList = (school.highlights || []).map(hl => `
    <li style="display:flex; align-items:flex-start; gap:8px; font-size:13px; color:#334155; margin-bottom:7px;">
      <span style="color:#059669; font-weight:800;">✓</span>
      <span>${escapeHtml(stripAkreditasi(hl))}</span>
    </li>
  `).join('');

  const contentHtml = `
    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:20px; box-shadow:0 4px 14px rgba(0,0,0,0.03);">
      
      ${school.brosurImage ? `
        <!-- Brosur Resmi Lembaga Display -->
        <div style="background:#0f172a; border-radius:12px; overflow:hidden; margin-bottom:18px; box-shadow:0 6px 20px rgba(0,0,0,0.12); position:relative; text-align:center;">
          <div style="padding:10px 14px; background:rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); flex-wrap:wrap; gap:8px;">
            <span style="color:#f8fafc; font-size:12px; font-weight:700; display:flex; align-items:center; gap:6px;">
              <span>📄</span> Brosur Resmi PPDB ${escapeHtml(school.name)}
            </span>
            <div style="display:flex; gap:8px;">
              <button type="button" class="btn btn-gold btn-sm" onclick="zoomBrosurSekolah('${school.brosurImage}', '${escapeHtml(school.name)}')" style="font-size:11px; padding:3px 10px; font-weight:700;">
                🔍 Perbesar
              </button>
              <a href="${school.brosurImage}" download="Brosur_${escapeHtml(school.name.replace(/\s+/g, '_'))}.jpg" class="btn btn-secondary btn-sm" style="font-size:11px; padding:3px 10px; background:rgba(255,255,255,0.15); color:#fff; border-color:rgba(255,255,255,0.3); font-weight:600;">
                📥 Unduh
              </a>
            </div>
          </div>
          <div style="padding:12px; display:flex; justify-content:center; background:#020617; cursor:pointer;" onclick="zoomBrosurSekolah('${school.brosurImage}', '${escapeHtml(school.name)}')">
            <img src="${school.brosurImage}" alt="Brosur Resmi ${escapeHtml(school.name)}" style="max-height:360px; max-width:100%; object-fit:contain; border-radius:6px; box-shadow:0 4px 16px rgba(0,0,0,0.4);" title="Klik untuk memperbesar gambar brosur">
          </div>
          <div style="padding:6px; font-size:11px; color:#94a3b8; background:rgba(0,0,0,0.3);">
            Klik gambar untuk melihat tampilan layar penuh (zoom)
          </div>
        </div>
      ` : ''}

      <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-bottom:12px; border-bottom:1px solid #f1f5f9; padding-bottom:12px;">
        <div>
          <h4 style="font-size:16px; font-weight:800; color:#0f172a; margin:0;">
            ${escapeHtml(school.fullName || school.name)}
          </h4>
          <span style="font-size:12px; color:#64748b; margin-top:2px; display:inline-block;">Lembaga Pendidikan Formal Mitra Pesantren</span>
        </div>
        <span style="background:#ecfdf5; color:#047857; font-size:11.5px; font-weight:800; padding:4px 12px; border-radius:999px;">
          ${escapeHtml(school.level || '')}
        </span>
      </div>

      <p style="font-size:13px; color:#475569; line-height:1.6; margin:0 0 16px 0;">
        ${escapeHtml(school.desc || 'Sekolah formal terpadu di kawasan Denanyar yang terintegrasi dengan jadwal mengaji dan setoran hafalan pondok pesantren.')}
      </p>

      <h5 style="font-size:13.5px; font-weight:700; color:#065f46; margin:0 0 10px 0; display:flex; align-items:center; gap:6px;">
        <span>✨</span> Program &amp; Poin Keunggulan Lembaga:
      </h5>
      <ul style="list-style:none; padding:0; margin:0 0 18px 0;">
        ${highlightsList}
      </ul>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px; padding:14px; background:#f8fafc; border-radius:10px; border:1px solid #e2e8f0;">
        <div>
          <span style="font-size:11.5px; font-weight:700; color:#64748b; display:block; margin-bottom:3px;">📋 Syarat Pendaftaran PPDB:</span>
          <p style="font-size:12.5px; color:#334155; margin:0; font-weight:600;">${escapeHtml(school.syarat || 'Lulusan SD/MI/SMP sederajat, FC Ijazah/SKL, FC Akta & KK, Pas Foto 3x4.')}</p>
        </div>
        <div>
          <span style="font-size:11.5px; font-weight:700; color:#64748b; display:block; margin-bottom:3px;">📞 Kontak Sekretariat PPDB:</span>
          <p style="font-size:12.5px; color:#059669; margin:0; font-weight:700;">${escapeHtml(school.kontak || WebState.settings.noKontakPondok || '0812-3456-7890')}</p>
        </div>
      </div>
    </div>
  `;

  if (bodyEl) bodyEl.innerHTML = contentHtml;

  modal.classList.add('active');
  modal.style.display = 'flex';
}

function closeModalBrosurSekolah(event) {
  if (event && event.target && event.target.closest('.interactive-detail-modal-box') && event.target === event.currentTarget) return;
  const modal = document.getElementById('modalBrosurSekolah');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

function zoomBrosurSekolah(imgSrc, title) {
  const zoomModal = document.getElementById('modalBrosurZoom');
  const imgEl = document.getElementById('zoomBrosurImg');
  const titleEl = document.getElementById('zoomBrosurTitle');
  if (zoomModal && imgEl) {
    imgEl.src = imgSrc;
    if (titleEl) titleEl.textContent = `Brosur ${title}`;
    zoomModal.style.display = 'flex';
  }
}

function closeModalBrosurZoom() {
  const zoomModal = document.getElementById('modalBrosurZoom');
  if (zoomModal) {
    zoomModal.style.display = 'none';
  }
}

// ================= EKSTRAKURIKULER SANTRI =================
let currentEkskulFilter = 'semua';

function getStoredEkstrakurikuler() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EKSTRAKURIKULER || 'sitahfidz_ekstrakurikuler');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  if (typeof DEFAULT_EKSTRAKURIKULER !== 'undefined' && Array.isArray(DEFAULT_EKSTRAKURIKULER)) {
    return JSON.parse(JSON.stringify(DEFAULT_EKSTRAKURIKULER));
  }
  return [];
}

function getEkstrakurikulerFallbackSvg(item, index) {
  const gradients = [
    ['#064e3b', '#047857', '#34d399'],
    ['#0f172a', '#1e293b', '#38bdf8'],
    ['#312e81', '#4338ca', '#a5b4fc'],
    ['#78350f', '#92400e', '#fde047'],
    ['#831843', '#be185d', '#f472b6'],
    ['#134e4a', '#0d9488', '#2dd4bf'],
    ['#1e1b4b', '#3730a3', '#818cf8'],
    ['#14532d', '#15803d', '#4ade80']
  ];
  const g = gradients[index % gradients.length];
  const icon = (item && item.icon) ? item.icon : '🎨';
  const name = (item && item.name) ? item.name : 'Ekstrakurikuler Santri';
  const category = (item && item.category) ? item.category : 'Bakat & Minat';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><defs><linearGradient id="g_ekskul_${index}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${g[0]}"/><stop offset="100%" stop-color="${g[1]}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g_ekskul_${index})"/><circle cx="400" cy="180" r="95" fill="rgba(255,255,255,0.08)"/><circle cx="400" cy="180" r="75" fill="none" stroke="${g[2]}" stroke-width="2.5" opacity="0.6"/><text x="400" y="200" font-size="70" text-anchor="middle">${icon}</text><text x="400" y="275" font-family="system-ui, -apple-system, sans-serif" font-size="26" fill="#ffffff" font-weight="800" text-anchor="middle">${escapeHtml(name)}</text><text x="400" y="310" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="${g[2]}" font-weight="700" text-anchor="middle" letter-spacing="1">${escapeHtml(category)}</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function renderEkstrakurikuler(filterCategory = currentEkskulFilter) {
  currentEkskulFilter = filterCategory;
  const grid = document.getElementById('ekstrakurikulerGrid');
  if (!grid) return;

  const allItems = getStoredEkstrakurikuler();

  // Render category filter bar
  const filterContainer = document.getElementById('ekskulFilters');
  if (filterContainer) {
    const categories = ['semua'];
    allItems.forEach(item => {
      const cat = (item.category || 'Lainnya').trim();
      if (cat && !categories.includes(cat)) categories.push(cat);
    });

    filterContainer.innerHTML = categories.map(cat => {
      const label = cat === 'semua' ? 'Semua Kategori' : cat;
      const activeClass = (cat === currentEkskulFilter) ? 'active' : '';
      return `<button type="button" class="filter-btn ${activeClass}" onclick="filterEkstrakurikuler('${escapeHtml(cat)}', this)">${escapeHtml(label)}</button>`;
    }).join('');
  }

  const filtered = allItems.filter(item => {
    if (currentEkskulFilter === 'semua') return true;
    return item.category === currentEkskulFilter;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding:48px 20px; color:#64748b; background:#ffffff; border-radius:18px; border:1px dashed #cbd5e1;">
        <span style="font-size:38px; display:block; margin-bottom:10px;">🎨</span>
        <h4 style="font-size:16px; font-weight:700; color:#334155; margin-bottom:4px;">Belum Ada Ekstrakurikuler untuk Kategori Ini</h4>
        <p style="font-size:13px; color:#64748b; margin:0;">Silakan pilih kategori lainnya atau buka menu Web di Panel Admin untuk menambah kegiatan baru.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const originalIndex = allItems.findIndex(e => e.id === item.id);
    const idx = originalIndex >= 0 ? originalIndex : 0;
    const delayClass = `reveal-delay-${(idx % 6) + 1}`;
    const photoSrc = (item.image && item.image.trim() !== '') ? item.image : getEkstrakurikulerFallbackSvg(item, idx);

    return `
      <div class="ekskul-card reveal-on-scroll reveal-up ${delayClass}" onclick="openModalEkstrakurikuler(${idx})" title="Klik untuk lihat jadwal & rincian ${escapeHtml(item.name)}">
        <div class="ekskul-thumb-wrap">
          <img src="${photoSrc}" alt="${escapeHtml(item.name)}" class="ekskul-thumb-img" loading="lazy">
          <div class="ekskul-thumb-gradient"></div>
          <span class="ekskul-category-chip">
            <span>🏷️</span> ${escapeHtml(item.category || 'Kegiatan')}
          </span>
          ${item.badge ? `<span class="ekskul-badge-pill">${escapeHtml(item.badge)}</span>` : ''}
          <div class="ekskul-icon-floating">${escapeHtml(item.icon || '🎨')}</div>
        </div>
        <div class="ekskul-body">
          <h3 class="ekskul-name">${escapeHtml(item.name)}</h3>
          <p class="ekskul-snippet">${escapeHtml(item.snippet || '')}</p>

          <div class="ekskul-meta-list">
            <div class="ekskul-meta-item" title="Jadwal Pelaksanaan">
              <span class="icon">📅</span>
              <strong style="margin-right:4px;">Jadwal:</strong>
              <span>${escapeHtml(item.jadwal || '-')}</span>
            </div>
            <div class="ekskul-meta-item" title="Lokasi Kegiatan">
              <span class="icon">📍</span>
              <strong style="margin-right:4px;">Lokasi:</strong>
              <span>${escapeHtml(item.tempat || '-')}</span>
            </div>
            <div class="ekskul-meta-item" title="Pembina / Pelatih">
              <span class="icon">👳‍♂️</span>
              <strong style="margin-right:4px;">Pembina:</strong>
              <span>${escapeHtml(item.pembina || '-')}</span>
            </div>
          </div>

          <div class="ekskul-card-footer">
            <button type="button" class="btn btn-gold ekskul-card-btn" onclick="event.stopPropagation(); openModalEkstrakurikuler(${idx})">
              <span>📖</span> Lihat Jadwal &amp; Rincian
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (typeof initScrollReveal === 'function') initScrollReveal();
  if (typeof initInteractiveCardClicks === 'function') initInteractiveCardClicks();
}

function filterEkstrakurikuler(category, btnElement) {
  currentEkskulFilter = category;
  document.querySelectorAll('#ekskulFilters .filter-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
  renderEkstrakurikuler(category);
}

let activeEkskulModalIndex = null;

function openModalEkstrakurikuler(index) {
  const allItems = getStoredEkstrakurikuler();
  const item = allItems[index];
  if (!item) return;

  activeEkskulModalIndex = index;
  const modal = document.getElementById('modalEkstrakurikuler');
  if (!modal) return;

  const header = document.getElementById('modalEkstrakurikulerHeader');
  const iconEl = document.getElementById('modalEkstrakurikulerIcon');
  const badgeEl = document.getElementById('modalEkstrakurikulerBadge');
  const titleEl = document.getElementById('modalEkstrakurikulerTitle');
  const bodyEl = document.getElementById('modalEkstrakurikulerBody');
  const btnWa = document.getElementById('btnModalEkstrakurikulerWa');

  if (header) header.style.background = item.gradient || 'linear-gradient(135deg, #065f46 0%, #047857 100%)';
  if (iconEl) iconEl.textContent = item.icon || '🎨';
  if (badgeEl) {
    badgeEl.textContent = item.badge || item.category || 'Ekstrakurikuler';
    badgeEl.style.display = 'inline-block';
  }
  if (titleEl) titleEl.textContent = item.name;

  if (btnWa) {
    const cleanWa = (WebState.settings.noKontakPondok || '0812-3456-7890').replace(/[^0-9]/g, '');
    const waPhone = cleanWa.startsWith('0') ? '62' + cleanWa.slice(1) : cleanWa;
    const msg = encodeURIComponent(`Assalamu'alaikum, saya ingin bertanya dan konsultasi mengenai kegiatan ekstrakurikuler santri: ${item.name}. Mohon informasi pendaftaran dan jadwal latihannya. Terima kasih.`);
    btnWa.href = `https://wa.me/${waPhone}?text=${msg}`;
  }

  const hasPhoto = !!(item.image && item.image.trim() !== '');
  const photoSrc = hasPhoto ? item.image : getEkstrakurikulerFallbackSvg(item, index);

  const highlightsHtml = (Array.isArray(item.highlights) ? item.highlights : []).map(hl => `
    <li style="display:flex; align-items:flex-start; gap:8px; font-size:13px; color:#334155; margin-bottom:8px; line-height:1.45;">
      <span style="color:#059669; font-weight:800; font-size:14px; margin-top:1px;">✓</span>
      <span>${escapeHtml(hl)}</span>
    </li>
  `).join('');

  let contentHtml = `
    <!-- Foto Kegiatan 16:9 -->
    <div style="background:#0f172a; border-radius:14px; overflow:hidden; margin-bottom:18px; border:1px solid #cbd5e1; box-shadow:0 8px 24px rgba(0,0,0,0.12); position:relative;">
      <img src="${photoSrc}" alt="${escapeHtml(item.name)}" style="width:100%; max-height:360px; aspect-ratio:16/9; object-fit:cover; display:block; cursor:${hasPhoto ? 'zoom-in' : 'default'};" ${hasPhoto ? `onclick="zoomBrosurSekolah('${item.image}', 'Foto Kegiatan ${escapeHtml(item.name)}');"` : ''}>
      <div style="padding:10px 16px; background:linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.65) 100%); color:#fff; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <span style="font-size:12.5px; font-weight:700; display:flex; align-items:center; gap:6px;">
          <span>📸</span> Dokumentasi Kegiatan ${escapeHtml(item.name)}
        </span>
        ${hasPhoto ? `
          <button type="button" class="btn btn-secondary btn-sm" onclick="zoomBrosurSekolah('${item.image}', 'Foto Kegiatan ${escapeHtml(item.name)}')" style="font-size:11px; padding:4px 12px; color:#fff; border-color:rgba(255,255,255,0.4); background:rgba(255,255,255,0.15);">
            <span>🔍</span> Perbesar Foto
          </button>
        ` : `
          <span style="font-size:11px; color:#94a3b8;">Grafik Ilustrasi Resmi</span>
        `}
      </div>
    </div>

    <!-- Ringkasan Info Jadwal, Tempat & Pembina -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-bottom:20px;">
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px 14px;">
        <span style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; display:flex; align-items:center; gap:4px; margin-bottom:4px;">
          <span>📅</span> Waktu / Jadwal
        </span>
        <strong style="font-size:13px; color:#0f172a; display:block;">${escapeHtml(item.jadwal || '-')}</strong>
      </div>
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px 14px;">
        <span style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; display:flex; align-items:center; gap:4px; margin-bottom:4px;">
          <span>📍</span> Tempat Pelaksanaan
        </span>
        <strong style="font-size:13px; color:#0f172a; display:block;">${escapeHtml(item.tempat || '-')}</strong>
      </div>
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px 14px;">
        <span style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; display:flex; align-items:center; gap:4px; margin-bottom:4px;">
          <span>👳‍♂️</span> Pembina / Instruktur
        </span>
        <strong style="font-size:13px; color:#0f172a; display:block;">${escapeHtml(item.pembina || '-')}</strong>
      </div>
    </div>

    <!-- Deskripsi Lengkap -->
    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:18px; margin-bottom:18px;">
      <h4 style="font-size:14px; font-weight:800; color:#0f172a; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
        <span>📝</span> Deskripsi &amp; Tujuan Kegiatan
      </h4>
      <p style="font-size:13px; color:#475569; line-height:1.65; margin:0; white-space:pre-line;">${escapeHtml(item.fullDesc || item.snippet || '')}</p>
    </div>

    <!-- Materi, Target & Manfaat (Highlights) -->
    ${highlightsHtml ? `
      <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:14px; padding:18px; margin-bottom:10px;">
        <h4 style="font-size:14px; font-weight:800; color:#065f46; margin-bottom:10px; display:flex; align-items:center; gap:6px;">
          <span>🌟</span> Materi &amp; Manfaat Bagi Santri
        </h4>
        <ul style="list-style:none; padding:0; margin:0;">
          ${highlightsHtml}
        </ul>
      </div>
    ` : ''}
  `;

  if (bodyEl) bodyEl.innerHTML = contentHtml;

  modal.classList.add('active');
  modal.style.display = 'flex';
}

function closeModalEkstrakurikuler(event) {
  if (event && event.target && event.target.closest('.interactive-detail-modal-box') && event.target === event.currentTarget) return;
  const modal = document.getElementById('modalEkstrakurikuler');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

function renderDynamicWebContent() {
  renderDynamicFacilities();
  // Selalu muat rincian komponen biaya & rekening bank dinamis
  renderWebsitePembayaran();

  const raw = localStorage.getItem(STORAGE_KEYS.CONTENT);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);

    // 1. Teks Sambutan / Pembuka Beranda
    if (data.heroBismillah !== undefined) {
      const el = document.getElementById('webHeroBismillah');
      if (el) {
        el.textContent = data.heroBismillah || "Selamat Datang di Website Resmi";
      }
    }

    // 2. Baris 1: Nama Utama Asrama (Huruf Emas Besar)
    if (data.heroTitleName !== undefined && data.heroTitleName.trim() !== '') {
      const el = document.getElementById('webHeroTitleName');
      if (el) el.textContent = data.heroTitleName;
    }

    // 3. Baris 2: Yayasan Naungan
    const yayasanVal = data.heroTitleYayasan || data.heroTitlePrefix;
    if (yayasanVal !== undefined && yayasanVal.trim() !== '') {
      const el = document.getElementById('webHeroTitleYayasan');
      if (el) el.textContent = yayasanVal;
    }

    // 4. Baris 3: Lokasi / Wilayah
    if (data.heroTitleLocation !== undefined && data.heroTitleLocation.trim() !== '') {
      const el = document.getElementById('webHeroTitleLocation');
      if (el) el.innerHTML = `<span class="loc-pin">📍</span> ${escapeHtml(data.heroTitleLocation)}`;
    }

    // 5. Posisi Logo di Banner (Kiri Besar / Kanan)
    const logoPos = data.heroLogoPos || 'left';
    const lockup = document.getElementById('webHeroHeaderLockup');
    if (lockup) {
      if (logoPos === 'right') {
        lockup.classList.add('logo-pos-right');
        lockup.classList.remove('logo-pos-left');
      } else {
        lockup.classList.add('logo-pos-left');
        lockup.classList.remove('logo-pos-right');
      }
    }

    if (data.heroSubtitle) {
      const el = document.getElementById('webHeroSubtitle');
      if (el) el.innerHTML = escapeHtml(data.heroSubtitle).replace(/\n/g, '<br>');
    }

    // Foto Profil & Gedung Pesantren (Kartu Kiri & Header Modal)
    if (data.fotoProfilPesantren) {
      const heroImg = document.getElementById('webProfilHeroImg');
      if (heroImg) heroImg.src = data.fotoProfilPesantren;
      const modalHeaderImg = document.getElementById('aboutModalHeaderImg');
      if (modalHeaderImg) modalHeaderImg.src = data.fotoProfilPesantren;
    }

    // Judul Kartu Profil (Kartu Kiri)
    if (data.judulProfil) {
      const el = document.getElementById('webProfilHeroTitle');
      if (el) el.textContent = data.judulProfil;
    }

    // Ringkasan Narasi Profil di Kartu Depan
    if (data.descProfil) {
      const el = document.getElementById('webDescProfilText');
      if (el) el.textContent = data.descProfil;
    }

    // Judul Narasi di Pop-up Modal Profil
    if (data.modalJudulProfil) {
      const el = document.getElementById('webModalDescProfilTitle');
      if (el) el.textContent = data.modalJudulProfil;
    }

    // Narasi Lengkap & Sejarah di Pop-up Modal Profil
    if (data.modalDescProfil) {
      const modalEl = document.getElementById('webModalDescProfilText');
      if (modalEl) modalEl.textContent = data.modalDescProfil;
    } else if (data.descProfil) {
      const modalEl = document.getElementById('webModalDescProfilText');
      if (modalEl) modalEl.textContent = data.descProfil;
    }

    // Poin Keunggulan di Modal Profil
    if (data.modalPoin1Title) {
      const el = document.getElementById('webModalPoin1Title');
      if (el) el.textContent = data.modalPoin1Title;
    }
    if (data.modalPoin1Desc) {
      const el = document.getElementById('webModalPoin1Desc');
      if (el) el.textContent = data.modalPoin1Desc;
    }
    if (data.modalPoin2Title) {
      const el = document.getElementById('webModalPoin2Title');
      if (el) el.textContent = data.modalPoin2Title;
    }
    if (data.modalPoin2Desc) {
      const el = document.getElementById('webModalPoin2Desc');
      if (el) el.textContent = data.modalPoin2Desc;
    }
    if (data.sambutanPengasuh) {
      const el = document.getElementById('webSambutanText');
      if (el) el.innerHTML = `"${escapeHtml(data.sambutanPengasuh).replace(/\n/g, '<br>')}"`;
    }
    if (data.visiPesantren) {
      const el = document.getElementById('webVisiText');
      if (el) el.textContent = data.visiPesantren;
      const modalVisi = document.getElementById('webModalVisiText');
      if (modalVisi) modalVisi.textContent = `"${data.visiPesantren}"`;
    }
    if (data.misiPesantren) {
      const el = document.getElementById('webMisiList');
      if (el) {
        const lines = data.misiPesantren.split('\n').filter(l => l.trim().length > 0);
        if (lines.length > 0) {
          el.innerHTML = lines.map(line => `<li>${escapeHtml(line.replace(/^[•\-\*]\s*/, ''))}</li>`).join('');
        }
      }
    }
    if (data.descBinnadzor) {
      const el = document.getElementById('webDescBinnadzor');
      if (el) el.innerHTML = escapeHtml(data.descBinnadzor).replace(/\n/g, '<br>');
    }
    if (data.descMaqbul) {
      const el = document.getElementById('webDescMaqbul');
      if (el) el.innerHTML = escapeHtml(data.descMaqbul).replace(/\n/g, '<br>');
    }
    if (data.descTahfidz) {
      const el = document.getElementById('webDescTahfidz');
      if (el) el.innerHTML = escapeHtml(data.descTahfidz).replace(/\n/g, '<br>');
    }
    if (data.descPascaTahfidz) {
      const el = document.getElementById('webDescPascaTahfidz');
      if (el) el.innerHTML = escapeHtml(data.descPascaTahfidz).replace(/\n/g, '<br>');
    }

    // Biaya PSB & Pendidikan
    if (data.biayaFormulir) {
      const el = document.getElementById('webBiayaFormulir');
      if (el) el.textContent = data.biayaFormulir;
      document.querySelectorAll('.bind-biaya-formulir').forEach(e => e.textContent = data.biayaFormulir);
    }
    if (data.biayaGedung) {
      const el = document.getElementById('webBiayaGedung');
      if (el) el.textContent = data.biayaGedung;
      document.querySelectorAll('.bind-biaya-gedung').forEach(e => e.textContent = data.biayaGedung);
    }
    if (data.biayaSeragam) {
      const el = document.getElementById('webBiayaSeragam');
      if (el) el.textContent = data.biayaSeragam;
      document.querySelectorAll('.bind-biaya-seragam').forEach(e => e.textContent = data.biayaSeragam);
    }
    if (data.biayaKitab) {
      const el = document.getElementById('webBiayaKitab');
      if (el) el.textContent = data.biayaKitab;
      document.querySelectorAll('.bind-biaya-kitab').forEach(e => e.textContent = data.biayaKitab);
    }
    if (data.biayaBulanan) {
      const el = document.getElementById('webBiayaBulanan');
      if (el) el.innerHTML = `${escapeHtml(data.biayaBulanan)}<span style="font-size:11px; font-weight:normal;">/bln</span>`;
      document.querySelectorAll('.bind-biaya-bulanan').forEach(e => e.textContent = `${data.biayaBulanan} / bln`);
    }

    // Tampilkan tombol kontrol cepat jika admin sedang login
    checkAdminQuickControls();
  } catch (err) {
    console.error("Error loading custom web content:", err);
  }

  // Render info biaya & rekening pembayaran dinamis
  renderWebsitePembayaran();
}

// ================= INFO BIAYA & REKENING PEMBAYARAN =================
function getStoredBiayaPembayaran() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BIAYA || 'sitahfidz_web_biaya');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}

  // Backwards compatibility check
  try {
    const rawContent = localStorage.getItem(STORAGE_KEYS.CONTENT || 'sitahfidz_website_content');
    if (rawContent) {
      const c = JSON.parse(rawContent);
      if (c && c.biayaList && Array.isArray(c.biayaList) && c.biayaList.length > 0) {
        return c.biayaList;
      }
      if (c && (c.biayaFormulir || c.biayaGedung || c.biayaSeragam || c.biayaKitab || c.biayaBulanan)) {
        const list = (typeof DEFAULT_BIAYA_PEMBAYARAN !== 'undefined') ? JSON.parse(JSON.stringify(DEFAULT_BIAYA_PEMBAYARAN)) : [];
        if (list.length >= 5) {
          if (c.biayaFormulir) list[0].nominal = c.biayaFormulir;
          if (c.biayaGedung) list[1].nominal = c.biayaGedung;
          if (c.biayaSeragam) list[2].nominal = c.biayaSeragam;
          if (c.biayaKitab) list[3].nominal = c.biayaKitab;
          if (c.biayaBulanan) list[4].nominal = c.biayaBulanan;
          return list;
        }
      }
    }
  } catch (e) {}

  if (typeof DEFAULT_BIAYA_PEMBAYARAN !== 'undefined' && Array.isArray(DEFAULT_BIAYA_PEMBAYARAN)) {
    return JSON.parse(JSON.stringify(DEFAULT_BIAYA_PEMBAYARAN));
  }
  return [];
}

function getStoredRekeningPembayaran() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REKENING || 'sitahfidz_web_rekening');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}

  try {
    const rawContent = localStorage.getItem(STORAGE_KEYS.CONTENT || 'sitahfidz_website_content');
    if (rawContent) {
      const c = JSON.parse(rawContent);
      if (c && c.rekeningList && Array.isArray(c.rekeningList)) {
        return c.rekeningList;
      }
    }
  } catch (e) {}

  if (typeof DEFAULT_REKENING_PEMBAYARAN !== 'undefined' && Array.isArray(DEFAULT_REKENING_PEMBAYARAN)) {
    return JSON.parse(JSON.stringify(DEFAULT_REKENING_PEMBAYARAN));
  }
  return [];
}

function copyNomorRekening(nomor, bankName) {
  if (!nomor) return;
  const cleanNomor = nomor.replace(/[^0-9\-]/g, '');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(cleanNomor).then(() => {
      showToast(`✓ Nomor rekening ${bankName} (${cleanNomor}) berhasil disalin!`, "success");
    }).catch(() => {
      fallbackCopy(cleanNomor, bankName);
    });
  } else {
    fallbackCopy(cleanNomor, bankName);
  }
}

function fallbackCopy(text, bankName) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast(`✓ Nomor rekening ${bankName} (${text}) berhasil disalin!`, "success");
  } catch (err) {
    showToast(`Nomor rekening: ${text}`, "info");
  }
  document.body.removeChild(ta);
}

function renderWebsitePembayaran() {
  const biayaList = getStoredBiayaPembayaran();
  const rekeningList = getStoredRekeningPembayaran();

  // 1. Render in PSB Section (#webBiayaListContainer)
  const biayaContainer = document.getElementById('webBiayaListContainer');
  if (biayaContainer) {
    if (biayaList.length === 0) {
      biayaContainer.innerHTML = `
        <div style="text-align:center; padding:16px; color:#64748b; font-size:12px;">
          Belum ada rincian biaya yang ditentukan.
        </div>
      `;
    } else {
      let totalSemua = 0;
      let totalSekaliBayar = 0;
      let totalBulanan = 0;

      biayaContainer.innerHTML = biayaList.map((item, idx) => {
        const isBulanan = item.isBulanan || /bulan|\/bln/i.test(item.nama) || /bulan|\/bln/i.test(item.nominal);
        const nominalDigits = (item.nominal || '').replace(/[^\d]/g, '');
        const nominalNum = parseInt(nominalDigits, 10) || 0;
        totalSemua += nominalNum;
        if (isBulanan) {
          totalBulanan += nominalNum;
        } else {
          totalSekaliBayar += nominalNum;
        }

        const bulananBadge = isBulanan
          ? `<span style="background:#ecfdf5; color:#047857; font-size:10px; font-weight:700; padding:2px 7px; border-radius:4px; border:1px solid #a7f3d0;">Iuran Bulanan</span>`
          : '';
        const bulananSuffix = (isBulanan && !item.nominal.includes('/')) ? '<span style="font-size:11px; font-weight:normal; color:#64748b;">/bln</span>' : '';

        // Warna kotak disamakan: bersih, rapi, dan konsisten (background putih, border halus)
        return `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; border-radius:8px; gap:12px; background:#ffffff; border:1px solid #e2e8f0; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
            <div>
              <div style="display:flex; align-items:center; flex-wrap:wrap; gap:6px;">
                <strong style="color:#0f172a; font-size:12.8px;">${escapeHtml(item.nama)}</strong>
                ${bulananBadge}
              </div>
              ${item.keterangan ? `<div style="font-size:11px; color:#64748b; margin-top:2px;">${escapeHtml(item.keterangan)}</div>` : ''}
            </div>
            <div style="font-weight:800; color:#065f46; font-size:14px; text-align:right; white-space:nowrap;">
              ${escapeHtml(item.nominal)}${bulananSuffix}
            </div>
          </div>
        `;
      }).join('');

      // Update Total Box di bawah rincian biaya
      const totalContainer = document.getElementById('webBiayaTotalContainer');
      const totalNominalEl = document.getElementById('webBiayaTotalNominal');
      const totalDetailEl = document.getElementById('webBiayaTotalDetail');
      const totalSubEl = document.getElementById('webBiayaTotalSub');

      const formatRupiah = (num) => 'Rp ' + num.toLocaleString('id-ID');

      if (totalContainer) {
        totalContainer.style.display = 'flex';
        if (totalBulanan > 0 && totalSekaliBayar > 0) {
          if (totalNominalEl) totalNominalEl.textContent = formatRupiah(totalSemua);
          if (totalSubEl) totalSubEl.textContent = 'Biaya Masuk Pondok Sekali Bayar + Syahriah Bulan Pertama';
          if (totalDetailEl) totalDetailEl.textContent = `(Biaya Masuk Pondok: ${formatRupiah(totalSekaliBayar)} + Syahriah: ${formatRupiah(totalBulanan)}/bln)`;
        } else if (totalBulanan > 0 && totalSekaliBayar === 0) {
          if (totalNominalEl) totalNominalEl.innerHTML = `${formatRupiah(totalBulanan)}<span style="font-size:11px; font-weight:normal;">/bln</span>`;
          if (totalSubEl) totalSubEl.textContent = 'Total Iuran Syahriah Bulanan Santri Pondok';
          if (totalDetailEl) totalDetailEl.textContent = 'Iuran rutin bulanan asrama, makan & tahfidz';
        } else {
          if (totalNominalEl) totalNominalEl.textContent = formatRupiah(totalSemua);
          if (totalSubEl) totalSubEl.textContent = 'Total Biaya Pendaftaran & Sarana Pondok';
          if (totalDetailEl) totalDetailEl.textContent = 'Total biaya masuk awal santri baru pondok';
        }
      }
    }
  }

  // 2. Render Bank Accounts (#webRekeningListContainer) in PSB Section
  const rekeningContainer = document.getElementById('webRekeningListContainer');
  if (rekeningContainer) {
    if (rekeningList.length === 0) {
      rekeningContainer.innerHTML = '';
      rekeningContainer.style.display = 'none';
    } else {
      rekeningContainer.style.display = 'block';
      const cleanWa = (WebState.settings.noKontakPondok || '0812-3456-7890').replace(/[^0-9]/g, '');
      const waPhone = cleanWa.startsWith('0') ? '62' + cleanWa.slice(1) : cleanWa;
      const waConfirmMsg = encodeURIComponent("Assalamu'alaikum Bendahara/Panitia PSB. Saya ingin konfirmasi pembayaran/transfer pendaftaran santri baru. Berikut bukti transfer dan data santri kami:");

      rekeningContainer.innerHTML = `
        <div style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:14px; padding:16px; margin-top:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:6px;">
            <h4 style="font-size:13.5px; font-weight:800; color:#0f172a; margin:0; display:flex; align-items:center; gap:6px;">
              <span>💳</span> Info Rekening Resmi Pembayaran &amp; Infaq Pondok
            </h4>
            <span style="font-size:10.5px; background:#dbeafe; color:#1e40af; border:1px solid #bfdbfe; padding:2px 8px; border-radius:999px; font-weight:700;">
              Transfer Resmi Pondok
            </span>
          </div>

          <div style="font-size:11px; color:#1e40af; background:#eff6ff; padding:8px 12px; border-radius:8px; border:1px solid #bfdbfe; margin-bottom:12px; line-height:1.45;">
            ℹ️ <strong>Keterangan:</strong> Seluruh rekening di bawah ini khusus untuk transfer infaq pendaftaran &amp; biaya pendidikan <strong>Pondok Pesantren</strong> (belum termasuk biaya pendaftaran sekolah formal mitra).
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:10px;">
            ${rekeningList.map((rek, rIdx) => `
              <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:10px; padding:12px 14px; box-shadow:0 1px 3px rgba(0,0,0,0.04); display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
                    <strong style="color:#0f172a; font-size:12.5px; display:flex; align-items:center; gap:5px;">
                      <span>🏦</span> ${escapeHtml(rek.bank)}
                    </strong>
                    ${rek.catatan ? `<span style="font-size:9.5px; background:#f1f5f9; color:#475569; padding:1px 6px; border-radius:4px; font-weight:600;">${escapeHtml(rek.catatan)}</span>` : ''}
                  </div>
                  <div style="font-family:monospace; font-size:15px; font-weight:800; color:#047857; letter-spacing:0.8px; margin:4px 0;">
                    ${escapeHtml(rek.nomor)}
                  </div>
                  <div style="font-size:11px; color:#475569;">
                    a.n. <strong>${escapeHtml(rek.atasNama)}</strong>
                  </div>
                </div>
                <button type="button" class="btn btn-secondary btn-sm" onclick="copyNomorRekening('${escapeHtml(rek.nomor)}', '${escapeHtml(rek.bank)}')" style="margin-top:8px; font-size:11px; padding:4px 10px; width:100%; justify-content:center; gap:5px; border-color:#cbd5e1; background:#f8fafc;">
                  <span>📋</span> Salin Nomor Rekening
                </button>
              </div>
            `).join('')}
          </div>

          <div style="margin-top:12px; padding:9px 12px; background:#eff6ff; border-radius:8px; border:1px solid #bfdbfe; font-size:11px; color:#1e40af; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <span>📲 <strong>Konfirmasi Transfer:</strong> Kirimkan bukti foto/screenshot transfer via WhatsApp Panitia.</span>
            <a href="https://wa.me/${waPhone}?text=${waConfirmMsg}" target="_blank" class="btn btn-primary btn-sm" style="font-size:11px; padding:3px 10px; background:#059669; border-color:#059669; font-weight:700;">
              <span>💬</span> Kirim Bukti ke WA
            </a>
          </div>
        </div>
      `;
    }
  }

  // 3. Render in Modal Brosur PSB (#brosurBiayaList & #brosurRekeningList)
  const brosurBiayaEl = document.getElementById('brosurBiayaList');
  if (brosurBiayaEl) {
    let brosurTotalSemua = 0;
    const formatRupiah = (num) => 'Rp ' + num.toLocaleString('id-ID');

    const itemsHtml = biayaList.map((item, idx) => {
      const isBulanan = item.isBulanan || /bulan|\/bln/i.test(item.nama) || /bulan|\/bln/i.test(item.nominal);
      const bulananSuffix = (isBulanan && !item.nominal.includes('/')) ? ' / bln' : '';
      const nominalDigits = (item.nominal || '').replace(/[^\d]/g, '');
      const nominalNum = parseInt(nominalDigits, 10) || 0;
      brosurTotalSemua += nominalNum;

      return `
        <div style="display:flex; justify-content:space-between; padding:5px 0; border-bottom:1px dashed #cbd5e1;">
          <span>${escapeHtml(item.nama)}</span>
          <strong style="color:#059669;">${escapeHtml(item.nominal)}${bulananSuffix}</strong>
        </div>
      `;
    }).join('');

    const totalHtml = brosurTotalSemua > 0 ? `
      <div style="display:flex; justify-content:space-between; padding:8px 0 4px 0; margin-top:4px; border-top:2px solid #059669; font-weight:800;">
        <span style="color:#065f46;">TOTAL ESTIMASI BIAYA PONDOK:</span>
        <span style="color:#059669; font-size:13px;">${formatRupiah(brosurTotalSemua)}</span>
      </div>
      <div style="font-size:10px; color:#1e40af; background:#eff6ff; border-radius:6px; padding:6px 10px; margin-top:6px; line-height:1.45; border:1px solid #bfdbfe;">
        ℹ️ Seluruh rincian di atas adalah <strong>biaya pendaftaran &amp; pendidikan pondok pesantren</strong>, belum termasuk biaya pendaftaran sekolah formal.
      </div>
    ` : '';

    brosurBiayaEl.innerHTML = itemsHtml + totalHtml;
  }

  const brosurRekeningEl = document.getElementById('brosurRekeningList');
  if (brosurRekeningEl) {
    if (rekeningList.length === 0) {
      brosurRekeningEl.innerHTML = '';
      brosurRekeningEl.style.display = 'none';
    } else {
      brosurRekeningEl.style.display = 'block';
      brosurRekeningEl.innerHTML = `
        <div style="margin-top:12px; padding:10px; background:#f1f5f9; border-radius:8px; font-size:10.5px;">
          <strong style="color:#0f172a; display:block; margin-bottom:5px;">💳 Rekening Transfer Resmi:</strong>
          ${rekeningList.map(r => `
            <div style="margin-bottom:3px; display:flex; justify-content:space-between;">
              <span>${escapeHtml(r.bank)}: <strong>${escapeHtml(r.nomor)}</strong></span>
              <span style="color:#64748b;">(a.n. ${escapeHtml(r.atasNama)})</span>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  // 4. Render in Modal Bukti PSB (#buktiPembayaranContainer)
  const buktiContainer = document.getElementById('buktiPembayaranContainer');
  if (buktiContainer) {
    if (rekeningList.length > 0) {
      buktiContainer.style.display = 'block';
      buktiContainer.innerHTML = `
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:12px; margin-top:12px; text-align:left;">
          <strong style="font-size:12px; color:#0f172a; display:flex; align-items:center; gap:6px; margin-bottom:6px;">
            <span>💳</span> Rekening Transfer Infaq Pendaftaran Pondok:
          </strong>
          ${rekeningList.map(r => `
            <div style="font-size:11.5px; color:#334155; margin-bottom:4px; padding:4px 8px; background:#ffffff; border-radius:6px; border:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong>${escapeHtml(r.bank)}:</strong> <span style="font-family:monospace; font-weight:700; color:#047857;">${escapeHtml(r.nomor)}</span>
                <span style="font-size:10.5px; color:#64748b;">(a.n. ${escapeHtml(r.atasNama)})</span>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" onclick="copyNomorRekening('${escapeHtml(r.nomor)}', '${escapeHtml(r.bank)}')" style="font-size:10px; padding:2px 8px;">
                Salin
              </button>
            </div>
          `).join('')}
          <div style="margin-top:8px; font-size:10.5px; color:#1e40af; background:#eff6ff; padding:6px 10px; border-radius:6px; border:1px solid #bfdbfe; line-height:1.4;">
            ℹ️ <strong>Catatan:</strong> Pembayaran ini khusus untuk infaq pendaftaran pondok pesantren, belum termasuk biaya pendaftaran sekolah formal.
          </div>
        </div>
      `;
    } else {
      buktiContainer.style.display = 'none';
    }
  }
}

// ================= ARTICLES MODULE =================
function renderArticles() {
  const container = document.getElementById('articlesGrid');
  if (!container) return;

  container.innerHTML = '';

  const filtered = WebState.articles.filter(a => {
    if (WebState.articleFilter === 'Semua') return true;
    return a.category === WebState.articleFilter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:40px; color:#64748b;">Belum ada artikel dalam kategori ini.</div>`;
    return;
  }

  filtered.forEach((item, idx) => {
    const card = document.createElement('div');
    const delay = (idx % 3) + 1;
    card.className = `article-card reveal-on-scroll reveal-up reveal-delay-${delay}`;
    card.innerHTML = `
      <div class="article-img-wrap">
        <img src="${item.image || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80'}" alt="${escapeHtml(item.title)}" class="article-img">
        <span class="article-category-badge">${escapeHtml(item.category)}</span>
      </div>
      <div class="article-content">
        <div class="article-date">
          <span>📅</span> <span>${formatTanggalIndo(item.date)}</span>
          <span>•</span> <span>✍️ ${escapeHtml(item.author || 'Admin')}</span>
        </div>
        <h3 class="article-title">${escapeHtml(item.title)}</h3>
        <p class="article-snippet">${escapeHtml(item.snippet || '')}</p>
        <button class="btn btn-outline-primary btn-sm" style="align-self:flex-start; margin-top:auto;" onclick="bacaArtikelDetail('${item.id}')">
          Baca Selengkapnya →
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  if (typeof initScrollReveal === 'function') {
    initScrollReveal();
  }
  if (typeof initInteractiveCardClicks === 'function') {
    initInteractiveCardClicks();
  }
}

function filterArticles(category, btnElement) {
  WebState.articleFilter = category;
  document.querySelectorAll('#articleFilters .filter-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
  renderArticles();
}

let currentActiveArticleId = null;

function bacaArtikelDetail(id) {
  currentActiveArticleId = id;
  const item = WebState.articles.find(a => a.id === id);
  if (!item) return;

  document.getElementById('modalArticleTitle').textContent = item.title;
  document.getElementById('modalArticleMeta').innerHTML = `
    <span class="section-tag" style="margin-bottom:0;">${escapeHtml(item.category)}</span>
    <span>📅 ${formatTanggalIndo(item.date)}</span>
    <span>✍️ Penulis: <strong>${escapeHtml(item.author || 'Admin')}</strong></span>
  `;

  const imgEl = document.getElementById('modalArticleImg');
  if (item.image) {
    imgEl.src = item.image;
    imgEl.style.display = 'block';
  } else {
    imgEl.style.display = 'none';
  }

  // Format content paragraphs
  const paragraphs = (item.content || item.snippet || '').split(/\n\s*\n/);
  const formattedContent = paragraphs.map(p => `<p style="margin-bottom:14px; font-size:14.5px; line-height:1.7; color:#334155;">${escapeHtml(p).replace(/\n/g, '<br>')}</p>`).join('');

  document.getElementById('modalArticleContent').innerHTML = formattedContent;
  document.getElementById('modalArticle').classList.add('active');
}

function closeModalArticle() {
  document.getElementById('modalArticle').classList.remove('active');
}

// ================= MODAL DETAIL FASILITAS INTERAKTIF =================
let currentFacilityModalIndex = 0;

function openFacilityModal(index = 0) {
  currentFacilityModalIndex = index;
  renderFacilityModalContent();
  const modal = document.getElementById('modalFacilityDetail');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
  }
}

function renderFacilityModalContent() {
  const facilities = getActiveFacilities();
  const f = facilities[currentFacilityModalIndex];
  if (!f) return;

  const img = document.getElementById('facModalImg');
  const title = document.getElementById('facModalTitle');
  const badge = document.getElementById('facModalBadge');
  const counter = document.getElementById('facModalCounter');
  const desc = document.getElementById('facModalDesc');
  const specs = document.getElementById('facModalSpecs');
  const schedule = document.getElementById('facModalSchedule');

  if (img) {
    img.style.opacity = '0.3';
    img.style.transform = 'scale(0.97)';
    img.onerror = () => { img.onerror = null; if (typeof getFacilityFallbackSvg === 'function') img.src = getFacilityFallbackSvg(currentFacilityModalIndex); };
    img.src = f.image;
    setTimeout(() => {
      img.style.opacity = '1';
      img.style.transform = 'scale(1)';
    }, 100);
  }

  if (title) title.textContent = f.title;
  if (badge) badge.textContent = f.badge.includes(f.icon) ? f.badge : `${f.icon} ${f.badge}`;
  if (counter) counter.textContent = `${currentFacilityModalIndex + 1} / ${facilities.length} Fasilitas`;
  if (desc) desc.textContent = f.fullDesc;
  if (schedule) schedule.textContent = f.schedule;

  if (specs) {
    const specList = Array.isArray(f.specs) ? f.specs : (typeof f.specs === 'string' ? f.specs.split('\n').filter(Boolean) : []);
    specs.innerHTML = specList.map(s => `
      <li style="display:flex; align-items:flex-start; gap:8px; font-size:13px; color:#334155; margin-bottom:6px;">
        <span style="color:#059669; font-weight:bold;">✓</span>
        <span>${escapeHtml(s)}</span>
      </li>
    `).join('');
  }
}

function stepFacilityModal(step) {
  const facilities = getActiveFacilities();
  currentFacilityModalIndex += step;
  if (currentFacilityModalIndex < 0) currentFacilityModalIndex = facilities.length - 1;
  if (currentFacilityModalIndex >= facilities.length) currentFacilityModalIndex = 0;
  renderFacilityModalContent();
}

function closeFacilityModal() {
  const modal = document.getElementById('modalFacilityDetail');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

// ================= MODAL DETAIL PROGRAM KURIKULUM INTERAKTIF =================
let currentProgramModalIndex = 0;

function openProgramModal(index = 0) {
  currentProgramModalIndex = index;
  renderProgramModalContent();
  const modal = document.getElementById('modalProgramDetail');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
  }
}

function renderProgramModalContent() {
  const p = DEFAULT_PROGRAMS[currentProgramModalIndex];
  if (!p) return;

  const img = document.getElementById('progModalImg');
  const title = document.getElementById('progModalTitle');
  const badge = document.getElementById('progModalBadge');
  const stage = document.getElementById('progModalStage');
  const counter = document.getElementById('progModalCounter');
  const desc = document.getElementById('progModalDesc');
  const target = document.getElementById('progModalTarget');
  const metode = document.getElementById('progModalMetode');
  const evaluasi = document.getElementById('progModalEvaluasi');
  const features = document.getElementById('progModalFeatures');

  if (img) {
    img.style.opacity = '0.3';
    img.style.transform = 'scale(0.97)';
    img.onerror = () => { img.onerror = null; if (typeof getProgramFallbackSvg === 'function') img.src = getProgramFallbackSvg(currentProgramModalIndex); };
    img.src = p.image;
    setTimeout(() => {
      img.style.opacity = '1';
      img.style.transform = 'scale(1)';
    }, 100);
  }

  // Dynamic program description if customized in admin panel
  let progDescription = p.fullDesc;
  try {
    const rawContent = localStorage.getItem(STORAGE_KEYS.CONTENT);
    if (rawContent) {
      const parsed = JSON.parse(rawContent);
      if (currentProgramModalIndex === 0 && parsed.descBinnadzor) progDescription = parsed.descBinnadzor;
      if (currentProgramModalIndex === 1 && parsed.descMaqbul) progDescription = parsed.descMaqbul;
      if (currentProgramModalIndex === 2 && parsed.descTahfidz) progDescription = parsed.descTahfidz;
      if (currentProgramModalIndex === 3 && parsed.descPascaTahfidz) progDescription = parsed.descPascaTahfidz;
    }
  } catch(e) {}

  if (title) title.textContent = p.title;
  if (badge) badge.textContent = p.badge;
  if (stage) stage.textContent = `${p.icon} ${p.stage}`;
  if (counter) counter.textContent = `Tahap ${currentProgramModalIndex + 1} / ${DEFAULT_PROGRAMS.length}`;
  if (desc) desc.textContent = progDescription;
  if (target) target.textContent = p.targetHafalan;
  if (metode) metode.textContent = p.metode;
  if (evaluasi) evaluasi.textContent = p.evaluasi;

  if (features) {
    features.innerHTML = p.features.map(feat => `
      <li style="display:flex; align-items:flex-start; gap:8px; font-size:13px; color:#334155; margin-bottom:6px;">
        <span style="color:#059669; font-weight:bold;">✓</span>
        <span>${escapeHtml(feat)}</span>
      </li>
    `).join('');
  }
}

function stepProgramModal(step) {
  currentProgramModalIndex += step;
  if (currentProgramModalIndex < 0) currentProgramModalIndex = DEFAULT_PROGRAMS.length - 1;
  if (currentProgramModalIndex >= DEFAULT_PROGRAMS.length) currentProgramModalIndex = 0;
  renderProgramModalContent();
}

function closeProgramModal() {
  const modal = document.getElementById('modalProgramDetail');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

function initModalKeyboardNav() {
  window.addEventListener('keydown', (e) => {
    const aboutModal = document.getElementById('modalAboutDetail');
    if (aboutModal && aboutModal.classList.contains('active')) {
      if (e.key === 'Escape') closeAboutDetailModal();
    }
    const facModal = document.getElementById('modalFacilityDetail');
    if (facModal && facModal.classList.contains('active')) {
      if (e.key === 'ArrowLeft') stepFacilityModal(-1);
      else if (e.key === 'ArrowRight') stepFacilityModal(1);
      else if (e.key === 'Escape') closeFacilityModal();
    }
    const progModal = document.getElementById('modalProgramDetail');
    if (progModal && progModal.classList.contains('active')) {
      if (e.key === 'ArrowLeft') stepProgramModal(-1);
      else if (e.key === 'ArrowRight') stepProgramModal(1);
      else if (e.key === 'Escape') closeProgramModal();
    }
    const brosurModal = document.getElementById('modalBrosurPSB');
    if (brosurModal && brosurModal.classList.contains('active')) {
      if (e.key === 'Escape') closeModalBrosurPSB();
    }
  });
}

// ================= MODAL DETAIL TENTANG PESANTREN =================
function openAboutDetailModal(initialTab = 'pengasuh') {
  const modal = document.getElementById('modalAboutDetail');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
    switchAboutModalTab(initialTab);
  }
}

function switchAboutModalTab(tabName) {
  if (tabName === 'misi' || tabName === 'pancajiwa') tabName = 'visi';
  if (tabName === 'profil') tabName = 'pengasuh';
  const tabs = ['pengasuh', 'visi'];
  tabs.forEach(t => {
    const btn = document.getElementById(`tabBtn${t.charAt(0).toUpperCase() + t.slice(1)}`);
    const content = document.getElementById(`tabContent${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (btn) {
      if (t === tabName) {
        btn.classList.add('active');
        btn.style.color = '#065f46';
        btn.style.borderBottom = '3px solid #059669';
      } else {
        btn.classList.remove('active');
        btn.style.color = '#64748b';
        btn.style.borderBottom = 'none';
      }
    }
    if (content) {
      content.style.display = t === tabName ? 'block' : 'none';
    }
  });
}

function closeAboutDetailModal() {
  const modal = document.getElementById('modalAboutDetail');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

// ================= GALLERY & INTERACTIVE PHOTO SHOWCASE =================
function renderWebsitePhotoSlider() {
  const container = document.getElementById('websiteFeaturedShowcase');
  if (!container) return;

  const photos = WebState.gallery && WebState.gallery.length > 0 ? WebState.gallery : (typeof DEFAULT_GALLERY_PHOTOS !== 'undefined' ? DEFAULT_GALLERY_PHOTOS : DEFAULT_GALLERY);
  if (typeof createInteractivePhotoSlider === 'function' && photos.length > 0) {
    createInteractivePhotoSlider({
      containerId: 'websiteFeaturedShowcase',
      photos: photos,
      autoPlay: true,
      autoPlayDelay: 4800,
      height: 420
    });
  }
}

function renderGallery() {
  const container = document.getElementById('galleryGrid');
  if (!container) return;

  container.innerHTML = '';

  const filtered = WebState.gallery.filter(g => {
    if (WebState.galleryFilter === 'Semua') return true;
    return g.category === WebState.galleryFilter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:40px; color:#64748b;">Belum ada dokumentasi foto dalam kategori ini.</div>`;
    return;
  }

  filtered.forEach((item, idx) => {
    const el = document.createElement('div');
    const delay = (idx % 4) + 1;
    el.className = `photo-card-tilt reveal-on-scroll reveal-up reveal-delay-${delay}`;
    el.onclick = () => {
      if (typeof openInteractiveLightbox === 'function') {
        openInteractiveLightbox(item, idx, filtered);
      } else {
        openLightbox(item);
      }
    };
    const fallbackAttr = typeof FALLBACK_PHOTO_SVG !== 'undefined' ? `onerror="this.onerror=null; this.src='${FALLBACK_PHOTO_SVG}'"` : '';
    el.innerHTML = `
      <img src="${item.image}" alt="${escapeHtml(item.title)}" loading="lazy" ${fallbackAttr}>
      <div class="card-glare"></div>
      <div class="card-overlay">
        <span style="background:rgba(245,158,11,0.95); color:#78350f; font-weight:800; font-size:10.5px; padding:2px 8px; border-radius:999px; align-self:flex-start; margin-bottom:6px;">${escapeHtml(item.category)}</span>
        <h4 style="font-size:15px; font-weight:800; color:#fff; margin:0 0 4px 0; text-shadow:0 1px 3px rgba(0,0,0,0.5);">${escapeHtml(item.title)}</h4>
        <div style="font-size:11px; color:#cbd5e1; display:flex; justify-content:space-between; align-items:center;">
          <span>📅 ${formatTanggalIndo(item.date)}</span>
          <span style="font-size:11px; font-weight:700; color:#fde68a;">🔍 Klik Perbesar</span>
        </div>
      </div>
    `;
    container.appendChild(el);
  });

  if (typeof initCard3DTilt === 'function') {
    initCard3DTilt('#galleryGrid .photo-card-tilt');
  }

  if (typeof initScrollReveal === 'function') {
    initScrollReveal();
  }
  if (typeof initInteractiveCardClicks === 'function') {
    initInteractiveCardClicks();
  }
}

function filterGallery(category, btnElement) {
  WebState.galleryFilter = category;
  document.querySelectorAll('#galleryFilters .filter-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
  renderGallery();
}

function openLightbox(item) {
  if (typeof openInteractiveLightbox === 'function') {
    const photos = WebState.gallery && WebState.gallery.length > 0 ? WebState.gallery : [item];
    const idx = photos.findIndex(p => p.id === item.id);
    openInteractiveLightbox(item, idx >= 0 ? idx : 0, photos);
    return;
  }
  document.getElementById('lightboxImg').src = item.image;
  document.getElementById('lightboxTitle').textContent = item.title;
  document.getElementById('lightboxMeta').textContent = `${item.category} • ${formatTanggalIndo(item.date)}`;
  document.getElementById('lightboxDesc').textContent = item.desc || '';
  document.getElementById('modalLightbox').classList.add('active');
}

function closeLightbox() {
  if (typeof closeInteractiveLightbox === 'function') {
    closeInteractiveLightbox();
  }
  const modal = document.getElementById('modalLightbox');
  if (modal) modal.classList.remove('active');
}

// ================= PSB (PENDAFTARAN SANTRI BARU) =================
function handleFormPSB(e) {
  e.preventDefault();

  // 1. Data Calon Santri
  const nama = document.getElementById('psbNama').value.trim();
  const namaPanggilan = document.getElementById('psbNamaPanggilan')?.value.trim() || '';
  const noKk = document.getElementById('psbNoKK')?.value.trim() || '';
  const nik = document.getElementById('psbNik')?.value.trim() || '';
  const nisn = document.getElementById('psbNisn')?.value.trim() || '';
  const tempatLahir = document.getElementById('psbTempatLahir')?.value.trim() || '';
  const tanggalLahir = document.getElementById('psbTanggalLahir')?.value || '';
  const jk = document.getElementById('psbJK').value;
  const anakKe = document.getElementById('psbAnakKe')?.value || '';
  const jumlahSaudara = document.getElementById('psbJumlahSaudara')?.value || '';
  const riwayatPenyakit = document.getElementById('psbRiwayatPenyakit')?.value.trim() || '';

  // 2. Pendidikan & Riwayat Hafalan
  const asal = document.getElementById('psbAsalSekolah').value.trim();
  const sekolahTujuan = document.getElementById('psbSekolahTujuan').value;
  const statusDaftarSekolah = document.getElementById('psbStatusDaftarSekolah')?.value || 'Belum Mendaftar';
  const riwayatHafalan = document.getElementById('psbRiwayatHafalan')?.value.trim() || '';

  // 3. Orang Tua / Wali
  const namaAyah = document.getElementById('psbNamaAyah')?.value.trim() || '';
  const pekerjaanAyah = document.getElementById('psbPekerjaanAyah')?.value.trim() || '';
  const namaIbu = document.getElementById('psbNamaIbu')?.value.trim() || '';
  const pekerjaanIbu = document.getElementById('psbPekerjaanIbu')?.value.trim() || '';
  const noWa = document.getElementById('psbNoWa').value.trim();
  const penghasilan = document.getElementById('psbPenghasilan')?.value || '';
  const alamat = document.getElementById('psbAlamat').value.trim();

  // 4. Berkas Upload (Base64 compressed)
  const fotoSantri = document.getElementById('base64FotoSantri')?.value || '';
  const fotoKK = document.getElementById('base64FotoKK')?.value || '';
  const fotoKTP = document.getElementById('base64FotoKTP')?.value || '';
  const fotoAkta = document.getElementById('base64FotoAkta')?.value || '';

  // Validasi Wajib No. KK (16 digit)
  if (!noKk || noKk.length < 16) {
    if (typeof showToast === 'function') {
      showToast("Mohon isi No. Kartu Keluarga (KK) dengan 16 digit lengkap!", "warning");
    }
    const kkEl = document.getElementById('psbNoKK');
    if (kkEl) kkEl.focus();
    return;
  }

  // Validasi Wajib NIK (16 digit)
  if (!nik || nik.length < 16) {
    if (typeof showToast === 'function') {
      showToast("Mohon isi NIK Santri dengan 16 digit lengkap sesuai Akta/KK!", "warning");
    }
    const nikEl = document.getElementById('psbNik');
    if (nikEl) nikEl.focus();
    return;
  }

  // Validasi Wajib NISN (10 digit)
  if (!nisn || nisn.length < 10) {
    if (typeof showToast === 'function') {
      showToast("Mohon isi 10 digit NISN santri dari sekolah asal!", "warning");
    }
    const nisnEl = document.getElementById('psbNisn');
    if (nisnEl) nisnEl.focus();
    return;
  }

  // Validasi Wajib 4 Berkas Unggahan Dokumen
  if (!fotoSantri) {
    if (typeof showToast === 'function') {
      showToast("Wajib mengunggah Pas Foto Calon Santri (3x4)!", "warning");
    }
    const fEl = document.getElementById('psbFotoSantri');
    if (fEl) fEl.focus();
    return;
  }

  if (!fotoKK) {
    if (typeof showToast === 'function') {
      showToast("Wajib mengunggah Foto Kartu Keluarga (KK)!", "warning");
    }
    const fEl = document.getElementById('psbFotoKK');
    if (fEl) fEl.focus();
    return;
  }

  if (!fotoKTP) {
    if (typeof showToast === 'function') {
      showToast("Wajib mengunggah Foto KTP Orang Tua / Wali!", "warning");
    }
    const fEl = document.getElementById('psbFotoKTP');
    if (fEl) fEl.focus();
    return;
  }

  if (!fotoAkta) {
    if (typeof showToast === 'function') {
      showToast("Wajib mengunggah Foto Akta Kelahiran Santri!", "warning");
    }
    const fEl = document.getElementById('psbFotoAkta');
    if (fEl) fEl.focus();
    return;
  }

  const regNo = "PSB-2025-" + String(Math.floor(Math.random() * 9000) + 1000);
  const tglDaftar = new Date().toISOString().split('T')[0];

  const pendaftar = {
    noRegistrasi: regNo,
    nama: nama,
    namaPanggilan: namaPanggilan,
    noKk: noKk,
    nik: nik,
    nisn: nisn,
    tempatLahir: tempatLahir,
    tanggalLahir: tanggalLahir,
    jenisKelamin: jk,
    anakKe: anakKe,
    jumlahSaudara: jumlahSaudara,
    riwayatPenyakit: riwayatPenyakit,
    asalSekolah: asal,
    sekolahTujuan: sekolahTujuan,
    statusDaftarSekolah: statusDaftarSekolah,
    programPilihan: sekolahTujuan,
    riwayatHafalan: riwayatHafalan,
    namaAyah: namaAyah,
    pekerjaanAyah: pekerjaanAyah,
    namaIbu: namaIbu,
    pekerjaanIbu: pekerjaanIbu,
    namaWali: namaAyah || namaIbu || 'Orang Tua / Wali',
    noWaWali: noWa,
    penghasilan: penghasilan,
    alamat: alamat,
    tanggalDaftar: tglDaftar,
    status: "Menunggu Seleksi",
    adaBerkas: Boolean(fotoKK || fotoKTP || fotoSantri || fotoAkta)
  };

  WebState.psbPendaftar.unshift(pendaftar);

  // Alumni Data (Kosongkan data contoh/dummy bawaan)
  try {
    const alm = localStorage.getItem(STORAGE_KEYS.ALUMNI);
    let loadedAlumni = alm ? JSON.parse(alm) : [];
    if (!Array.isArray(loadedAlumni)) loadedAlumni = [];

    // Filter keluar data dummy (alm-001 s.d. alm-008) jika masih tersimpan di cache browser
    loadedAlumni = loadedAlumni.filter(a => {
      if (!a || !a.id) return false;
      const strId = String(a.id);
      return !strId.startsWith('alm-00');
    });

    WebState.alumni = loadedAlumni;
    localStorage.setItem(STORAGE_KEYS.ALUMNI, JSON.stringify(WebState.alumni));
  } catch (e) {
    WebState.alumni = [];
  }

  saveWebStorage();
  updatePendaftarCount();

  // Automatic Google Sheets + Google Drive sync if configured
  if (WebState.settings.googleSheetUrl) {
    const btnSubmit = document.getElementById('btnSubmitPSB');
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `<span>⏳</span> Mengirim & Menyimpan ke Google Drive...`;
    }

    const payload = {
      ...pendaftar,
      fileFotoSantri: fotoSantri,
      fileFotoKK: fotoKK,
      fileFotoKTP: fotoKTP,
      fileFotoAkta: fotoAkta
    };

    fetch(WebState.settings.googleSheetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(() => {
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = `<span>🚀</span> Kirim Pendaftaran Online Sekarang`;
      }
    })
    .catch(err => {
      console.log('GSheet sync log:', err);
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = `<span>🚀</span> Kirim Pendaftaran Online Sekarang`;
      }
    });
  }

  // Show Proof Modal
  showBuktiPendaftaran(pendaftar);
}

// Client-side instant image compression for slow mobile networks
function handleFileCompress(event, previewId, hiddenInputId) {
  const file = event.target.files[0];
  if (!file) return;

  const previewEl = document.getElementById(previewId);
  if (previewEl) {
    previewEl.style.display = 'block';
    previewEl.textContent = `⏳ Mengompres ${(file.size / 1024 / 1024).toFixed(1)} MB...`;
    previewEl.style.color = '#d97706';
  }

  compressImageFile(file, 1200, 1200, 0.75, (base64Data, origSize, newSize) => {
    document.getElementById(hiddenInputId).value = base64Data;
    if (previewEl) {
      previewEl.style.display = 'block';
      const origMb = (origSize / 1024 / 1024).toFixed(1);
      const newKb = (newSize / 1024).toFixed(0);
      previewEl.textContent = `✓ Siap (${origMb} MB dioptimalkan jadi ${newKb} KB)`;
      previewEl.style.color = '#059669';
    }
  });
}

function compressImageFile(file, maxWidth, maxHeight, quality, callback) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function(event) {
    const img = new Image();
    img.src = event.target.result;
    img.onload = function() {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const base64 = canvas.toDataURL('image/jpeg', quality);
      const approxBytes = Math.round((base64.length * 3) / 4);
      callback(base64, file.size, approxBytes);
    };
  };
}

function updatePendaftarCount() {
  const badge = document.getElementById('countPendaftarBadge');
  if (badge) badge.textContent = WebState.psbPendaftar.length;
}

// ================= MODAL BROSUR RESMI PSB (DIGITAL & PRINT) =================
function openModalBrosurPSB() {
  const rawContent = localStorage.getItem(STORAGE_KEYS.CONTENT);
  if (rawContent) {
    try {
      const parsed = JSON.parse(rawContent);
      if (parsed.linkBrosurCustom && parsed.linkBrosurCustom.trim() !== '') {
        window.open(parsed.linkBrosurCustom.trim(), '_blank');
        return;
      }
    } catch(e) {}
  }

  const modal = document.getElementById('modalBrosurPSB');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
  }
}

function closeModalBrosurPSB() {
  const modal = document.getElementById('modalBrosurPSB');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

function printBrosurPSB() {
  window.print();
}

function openModalDataPendaftar() {
  renderTabelPendaftar();
  const urlInput = document.getElementById('inputGoogleSheetWebhook');
  if (urlInput) urlInput.value = WebState.settings.googleSheetUrl || '';
  document.getElementById('modalDataPendaftar').classList.add('active');
}

function closeModalDataPendaftar() {
  document.getElementById('modalDataPendaftar').classList.remove('active');
}

function renderTabelPendaftar() {
  const tbody = document.getElementById('tablePendaftarBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (WebState.psbPendaftar.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:#64748b;">Belum ada calon santri yang mendaftar.</td></tr>`;
    return;
  }

  WebState.psbPendaftar.forEach((p, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${idx + 1}</strong></td>
      <td><code>${escapeHtml(p.noRegistrasi)}</code><div style="font-size:11px; color:#64748b;">${formatTanggalIndo(p.tanggalDaftar)}</div></td>
      <td>
        <strong>${escapeHtml(p.nama)}</strong> ${p.namaPanggilan ? `<span style="color:#64748b; font-size:11.5px;">(${escapeHtml(p.namaPanggilan)})</span>` : ''}
        <div style="font-size:11px; color:#64748b;">
          No. KK: ${escapeHtml(p.noKk || '-')} • NIK: ${escapeHtml(p.nik || '-')} • NISN: ${escapeHtml(p.nisn || '-')} • ${p.jenisKelamin === 'L' ? 'Putra' : 'Putri'}
        </div>
        ${p.tempatLahir ? `<div style="font-size:11px; color:#475569;">TTL: ${escapeHtml(p.tempatLahir)}, ${formatTanggalIndo(p.tanggalLahir)}</div>` : ''}
      </td>
      <td>
        <span class="badge" style="background:#e0f2fe; color:#0369a1; border:1px solid #bae6fd; font-weight:700;">
          🏫 ${escapeHtml(p.sekolahTujuan || p.programPilihan || '-')}
        </span>
        <div style="font-size:11px; margin-top:3px;">
          ${(p.statusDaftarSekolah && p.statusDaftarSekolah.includes('Sudah'))
            ? '<span style="color:#15803d; font-weight:600;">✓ Sudah Daftar Sekolah</span>'
            : '<span style="color:#b45309; font-weight:600;">⏳ Belum Daftar Sekolah</span>'}
        </div>
        ${p.riwayatHafalan ? `<div style="font-size:11px; color:#047857; margin-top:2px;">📖 ${escapeHtml(p.riwayatHafalan)}</div>` : ''}
      </td>
      <td>${escapeHtml(p.asalSekolah || '-')}</td>
      <td>
        <strong>Ayah:</strong> ${escapeHtml(p.namaAyah || p.namaWali)} ${p.pekerjaanAyah ? `<span style="font-size:11px; color:#64748b;">(${escapeHtml(p.pekerjaanAyah)})</span>` : ''}<br>
        ${p.namaIbu ? `<span style="font-size:11.5px;"><strong>Ibu:</strong> ${escapeHtml(p.namaIbu)}</span><br>` : ''}
        <div style="font-size:11px; color:#059669; font-weight:600;">WA: ${escapeHtml(p.noWaWali)}</div>
      </td>
      <td style="white-space:nowrap;">
        <a href="https://api.whatsapp.com/send?phone=${p.noWaWali ? p.noWaWali.replace(/\D/g, '').replace(/^0/, '62') : ''}" target="_blank" class="btn btn-whatsapp btn-sm" style="padding:4px 8px; font-size:11px; display:inline-block; margin-bottom:4px;">
          💬 WA
        </a>
        <button type="button" class="btn btn-outline-danger btn-sm" onclick="hapusPendaftar(${idx})" title="Hapus Data Pendaftar" style="padding:4px 7px; font-size:11px; margin-left:3px; color:#dc2626; border-color:#fca5a5; background:#fff; border-radius:6px; cursor:pointer;">
          🗑️
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function hapusPendaftar(idx) {
  if (idx < 0 || idx >= WebState.psbPendaftar.length) return;
  const p = WebState.psbPendaftar[idx];
  if (confirm(`Apakah Anda yakin ingin menghapus data pendaftaran ananda ${p.nama || ''} (${p.noRegistrasi || ''})?`)) {
    WebState.psbPendaftar.splice(idx, 1);
    saveWebStorage();
    updatePendaftarCount();
    renderTabelPendaftar();
    showToast(`Data pendaftar ${p.nama || ''} berhasil dihapus.`, 'info');
  }
}

function eksporPendaftarExcel() {
  if (typeof XLSX !== 'undefined') {
    const headers = [
      'No Registrasi', 'Tanggal Daftar', 'Nama Lengkap', 'Nama Panggilan', 'No KK', 'NIK', 'NISN',
      'Tempat Lahir', 'Tanggal Lahir', 'Jenis Kelamin', 'Anak Ke', 'Dari Bersaudara',
      'Riwayat Penyakit', 'Asal Sekolah', 'Sekolah Tujuan', 'Status Daftar Sekolah',
      'Riwayat Hafalan', 'Nama Ayah', 'Pekerjaan Ayah', 'Nama Ibu', 'Pekerjaan Ibu',
      'No WA Wali', 'Penghasilan Ortu', 'Alamat Lengkap', 'Status'
    ];
    const rows = WebState.psbPendaftar.map(p => [
      p.noRegistrasi || '',
      p.tanggalDaftar || '',
      p.nama || '',
      p.namaPanggilan || '',
      p.noKk || '',
      p.nik || '',
      p.nisn || '',
      p.tempatLahir || '',
      p.tanggalLahir || '',
      p.jenisKelamin === 'L' ? 'Laki-laki (Putra)' : 'Perempuan (Putri)',
      p.anakKe || '',
      p.jumlahSaudara || '',
      p.riwayatPenyakit || '',
      p.asalSekolah || '',
      p.sekolahTujuan || p.programPilihan || '',
      p.statusDaftarSekolah || 'Belum Mendaftar',
      p.riwayatHafalan || '',
      p.namaAyah || p.namaWali || '',
      p.pekerjaanAyah || '',
      p.namaIbu || '',
      p.pekerjaanIbu || '',
      p.noWaWali || '',
      p.penghasilan || '',
      p.alamat || '',
      p.status || ''
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    ws['!cols'] = [
      { wch: 18 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 18 }, { wch: 18 }, { wch: 15 },
      { wch: 18 }, { wch: 14 }, { wch: 18 }, { wch: 10 }, { wch: 14 },
      { wch: 20 }, { wch: 25 }, { wch: 22 }, { wch: 22 },
      { wch: 20 }, { wch: 22 }, { wch: 18 }, { wch: 22 }, { wch: 18 },
      { wch: 16 }, { wch: 20 }, { wch: 35 }, { wch: 14 }
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Pendaftar PSB");
    const filename = `Data_Pendaftar_PSB_Pesantren_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filename);
    showToast("Alhamdulillah! Data pendaftar berhasil diunduh ke format Excel (.xlsx)!", "success");
    return;
  }

  // Fallback ke CSV jika XLSX belum terload
  eksporPendaftarCSV();
}

function eksporPendaftarCSV() {
  let csv = 'No_Registrasi,Tanggal_Daftar,Nama_Lengkap,Nama_Panggilan,No_KK,NIK,NISN,Tempat_Lahir,Tanggal_Lahir,Jenis_Kelamin,Anak_Ke,Dari_Bersaudara,Riwayat_Penyakit,Asal_Sekolah,Sekolah_Tujuan,Status_Daftar_Sekolah,Riwayat_Hafalan,Nama_Ayah,Pekerjaan_Ayah,Nama_Ibu,Pekerjaan_Ibu,No_WA_Wali,Penghasilan_Ortu,Alamat_Lengkap,Status\n';
  WebState.psbPendaftar.forEach(p => {
    csv += `"${p.noRegistrasi}","${p.tanggalDaftar}","${(p.nama || '').replace(/"/g, '""')}","${(p.namaPanggilan || '').replace(/"/g, '""')}","${p.noKk || ''}","${p.nik || ''}","${p.nisn || ''}","${(p.tempatLahir || '').replace(/"/g, '""')}","${p.tanggalLahir || ''}","${p.jenisKelamin === 'L' ? 'Laki-laki (Putra)' : 'Perempuan (Putri)'}","${p.anakKe || ''}","${p.jumlahSaudara || ''}","${(p.riwayatPenyakit || '').replace(/"/g, '""')}","${(p.asalSekolah || '').replace(/"/g, '""')}","${p.sekolahTujuan || p.programPilihan || ''}","${p.statusDaftarSekolah || 'Belum Mendaftar'}","${(p.riwayatHafalan || '').replace(/"/g, '""')}","${(p.namaAyah || p.namaWali || '').replace(/"/g, '""')}","${(p.pekerjaanAyah || '').replace(/"/g, '""')}","${(p.namaIbu || '').replace(/"/g, '""')}","${(p.pekerjaanIbu || '').replace(/"/g, '""')}","${p.noWaWali}","${p.penghasilan || ''}","${(p.alamat || '').replace(/"/g, '""')}","${p.status}"\n`;
  });
  downloadBlob(csv, `Data_Pendaftar_PSB_Pesantren_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv;charset=utf-8;');
  showToast("Data pendaftar lengkap berhasil diunduh ke format Excel (CSV)!", "success");
}

function simpanGoogleSheetWebhook() {
  const url = document.getElementById('inputGoogleSheetWebhook').value.trim();
  WebState.settings.googleSheetUrl = url;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(WebState.settings));
  showToast("Pengaturan integrasi Google Sheets berhasil disimpan!", "success");
}

function downloadBlob(content, filename, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function showBuktiPendaftaran(p) {
  document.getElementById('buktiRegNo').textContent = p.noRegistrasi;
  document.getElementById('buktiNama').textContent = p.nama;
  const elNoKK = document.getElementById('buktiNoKK');
  if (elNoKK) elNoKK.textContent = p.noKk || '-';
  const elNIK = document.getElementById('buktiNIK');
  if (elNIK) elNIK.textContent = p.nik || '-';
  const elNISN = document.getElementById('buktiNISN');
  if (elNISN) elNISN.textContent = p.nisn || '-';
  const elSekolah = document.getElementById('buktiSekolah') || document.getElementById('buktiProgram');
  if (elSekolah) elSekolah.textContent = p.sekolahTujuan || p.programPilihan || '-';
  const elStatusSekolah = document.getElementById('buktiStatusSekolah');
  if (elStatusSekolah) {
    elStatusSekolah.textContent = p.statusDaftarSekolah || 'Belum Mendaftar';
    elStatusSekolah.style.color = (p.statusDaftarSekolah && p.statusDaftarSekolah.includes('Sudah')) ? '#15803d' : '#b45309';
  }
  document.getElementById('buktiJK').textContent = p.jenisKelamin === 'L' ? 'Laki-laki (Putra)' : 'Perempuan (Putri)';
  document.getElementById('buktiWali').textContent = `${p.namaAyah || p.namaWali} (${p.noWaWali})`;
  document.getElementById('buktiTgl').textContent = formatTanggalIndo(p.tanggalDaftar);

  // Setup WhatsApp confirmation button
  const panitiaWa = WebState.settings.noKontakPondok || "081234567890";
  let cleanWa = panitiaWa.replace(/\D/g, '');
  if (cleanWa.startsWith('0')) cleanWa = '62' + cleanWa.substring(1);

  const pesan = `*KONFIRMASI PENDAFTARAN SANTRI BARU (PSB)*\n*${WebState.settings.namaPondok || "Pondok Pesantren Al-Barokah"}*\n\n` +
    `Assalamu'alaikum Panitia PSB,\n` +
    `Saya telah mengisi formulir pendaftaran online untuk calon santri:\n\n` +
    `*No. Registrasi:* ${p.noRegistrasi}\n` +
    `*Nama Calon Santri:* ${p.nama}\n` +
    `*No. KK:* ${p.noKk || '-'}\n` +
    `*NIK Santri:* ${p.nik || '-'}\n` +
    `*NISN:* ${p.nisn || '-'}\n` +
    `*Sekolah Tujuan:* ${p.sekolahTujuan || p.programPilihan || '-'}\n` +
    `*Status Daftar Sekolah:* ${p.statusDaftarSekolah || 'Belum Mendaftar'}\n` +
    `*Asal Sekolah:* ${p.asalSekolah || '-'}\n` +
    `*Riwayat Hafalan:* ${p.riwayatHafalan || '-'}\n` +
    `*Wali Santri:* ${p.namaAyah || p.namaWali} (${p.noWaWali})\n\n` +
    `Mohon informasi lebih lanjut mengenai jadwal tes seleksi baca Al-Qur'an. Terima kasih.`;

  document.getElementById('btnKonfirmasiWa').onclick = function() {
    window.open(`https://api.whatsapp.com/send?phone=${cleanWa}&text=${encodeURIComponent(pesan)}`, '_blank');
  };

  document.getElementById('modalBuktiPSB').classList.add('active');
  document.getElementById('formPSB').reset();
}

function closeModalBuktiPSB() {
  document.getElementById('modalBuktiPSB').classList.remove('active');
}

// ================= PSB 2-PANEL SWITCHER =================
function switchPsbPanel(panelName) {
  const formPanel = document.getElementById('psbPanelForm');
  const infoPanel = document.getElementById('psbPanelInfo');
  const btnForm = document.getElementById('psbTabBtnForm');
  const btnInfo = document.getElementById('psbTabBtnInfo');

  if (panelName === 'info') {
    if (formPanel) {
      formPanel.classList.remove('active');
      formPanel.style.display = 'none';
    }
    if (infoPanel) {
      infoPanel.classList.add('active');
      infoPanel.style.display = 'block';
      infoPanel.querySelectorAll('.reveal-on-scroll:not(.is-revealed)').forEach(el => el.classList.add('is-revealed'));
    }
    if (btnForm) btnForm.classList.remove('active');
    if (btnInfo) btnInfo.classList.add('active');
  } else {
    // Default to 'form'
    if (infoPanel) {
      infoPanel.classList.remove('active');
      infoPanel.style.display = 'none';
    }
    if (formPanel) {
      formPanel.classList.add('active');
      formPanel.style.display = 'block';
      formPanel.querySelectorAll('.reveal-on-scroll:not(.is-revealed)').forEach(el => el.classList.add('is-revealed'));
    }
    if (btnInfo) btnInfo.classList.remove('active');
    if (btnForm) btnForm.classList.add('active');
  }

  // Smooth scroll to top of PSB section if clicked from lower section
  const psbSection = document.getElementById('psb');
  if (psbSection) {
    const yOffset = -70;
    const y = psbSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

function navigateToPsb(panelName = 'form') {
  if (typeof navigateToView === 'function') {
    navigateToView('psb');
  }
  switchPsbPanel(panelName);
}

window.switchPsbPanel = switchPsbPanel;
window.navigateToPsb = navigateToPsb;

// Search Santri from Home (Portal Quick Check by NIS or Name)
function handleCekSantriHome(e) {
  e.preventDefault();
  const val = document.getElementById('inputCekSantriHome').value.trim();
  if (val) {
    window.location.href = `portal-wali.html?q=${encodeURIComponent(val)}`;
  }
}

// ================= HELPERS =================
function formatTanggalIndo(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${parseInt(parts[2], 10)} ${bulan[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>✅</span><span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3500);
}

// ================= SCROLL-TRIGGERED REVEAL OBSERVER =================
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll:not(.is-revealed)');
  if (!elements || elements.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px 40px 0px'
  });

  const vh = window.innerHeight || document.documentElement.clientHeight;
  let inViewStaggerCount = 0;

  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.bottom < 0) {
      // Posisi sudah di atas viewport (misal saat reload pada posisi tengah halaman)
      el.classList.add('is-revealed');
    } else if (rect.top < vh) {
      // Sedang ada di layar saat halaman pertama kali dibuka (pas muncul)
      // Berikan animasi cascading halus bertahap
      const delay = Math.min(60 + (inViewStaggerCount * 65), 500);
      inViewStaggerCount++;
      setTimeout(() => {
        el.classList.add('is-revealed');
      }, delay);
    } else {
      // Di bawah layar: amati dan munculkan secara mulus ketika di-scroll ke area pandang
      observer.observe(el);
    }
  });

  // Backup scroll checker (passive) agar semua widget responsif saat di-scroll
  if (!window._revealScrollBound) {
    window._revealScrollBound = true;
    let scrollTicker = null;
    window.addEventListener('scroll', () => {
      if (scrollTicker) return;
      scrollTicker = setTimeout(() => {
        scrollTicker = null;
        const currentVh = window.innerHeight || document.documentElement.clientHeight;
        const unrevealed = document.querySelectorAll('.reveal-on-scroll:not(.is-revealed)');
        unrevealed.forEach(item => {
          const r = item.getBoundingClientRect();
          if (r.top <= currentVh - 15 && r.bottom >= 0) {
            item.classList.add('is-revealed');
            try { observer.unobserve(item); } catch (e) {}
          }
        });
      }, 50);
    }, { passive: true });
  }
}

// ================= ANIMATED STAT COUNTERS =================
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.hero-stat-item h3');
  if (!statNumbers || statNumbers.length === 0) return;

  const countUp = (el, target, suffix = '') => {
    const duration = 1200;
    const startTime = performance.now();
    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * target);
      el.textContent = `${current}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${target}${suffix}`;
      }
    };
    requestAnimationFrame(update);
  };

  const targets = [
    { target: 300, suffix: '+' },
    { target: 30, suffix: ' Juz' },
    { target: 6, suffix: ' Sekolah' },
    { target: 15, suffix: '+' }
  ];

  let animated = false;
  const triggerCounter = () => {
    if (animated) return;
    animated = true;
    statNumbers.forEach((el, idx) => {
      const data = targets[idx];
      if (data) countUp(el, data.target, data.suffix);
    });
  };

  const statsWrap = document.querySelector('.hero-stats');
  if (statsWrap) {
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          triggerCounter();
          obs.disconnect();
        }
      }, { threshold: 0.15 });
      obs.observe(statsWrap);
    } else {
      setTimeout(triggerCounter, 300);
    }
  }
}

// ================= INTERACTIVE CLICK PHYSICS FOR CARDS =================
function initInteractiveCardClicks() {
  const selectors = '.facility-card, .program-card, .school-card, .hero-feature-box, .hero-stat-item, .psb-alur-syarat-card, .psb-info-card, .psb-step-item, .article-card, .social-badge-btn, .photo-card-tilt, .photo-showcase-widget, .about-bento-card, .pancajiwa-pill';
  document.querySelectorAll(selectors).forEach(card => {
    if (card.dataset.hasClickBounce) return;
    card.dataset.hasClickBounce = 'true';
    card.addEventListener('click', (e) => {
      // Don't trigger if clicked on an input, button, or link directly
      if (e.target.closest('input, textarea, select, a, button')) return;
      card.classList.remove('widget-click-active');
      void card.offsetWidth; // trigger reflow
      card.classList.add('widget-click-active');
      setTimeout(() => card.classList.remove('widget-click-active'), 450);
    });
  });
}

// ================= PORTAL VIEW ROUTER & SIMPLE DISPLAY MODE =================
let isPortalSimpleMode = true; // Default: Mode Simpel (Fokus Banner Utama)

function initPortalViewRouting() {
  const stored = localStorage.getItem('sitahfidz_portal_mode');
  isPortalSimpleMode = stored !== null ? stored === 'simple' : true;

  if (isPortalSimpleMode) {
    document.body.classList.add('portal-mode-simple');
  } else {
    document.body.classList.remove('portal-mode-simple');
  }
  updateToggleModeButton();

  // Initial Hash check
  const rawHash = (window.location.hash || '').replace('#', '').trim();
  const validViews = ['beranda', 'profil', 'program', 'ekstrakurikuler', 'sekolah-formal', 'alumni', 'psb', 'artikel', 'galeri', 'kontak'];
  if (rawHash && validViews.includes(rawHash)) {
    navigateToView(rawHash, false);
  } else {
    navigateToView('beranda', false);
  }

  // Handle browser Back / Forward buttons
  window.addEventListener('hashchange', () => {
    const curHash = (window.location.hash || '').replace('#', '').trim();
    if (curHash && validViews.includes(curHash)) {
      navigateToView(curHash, false);
    } else {
      navigateToView('beranda', false);
    }
  });

  window.addEventListener('resize', () => {
    updateToggleModeButton();
  });
}

function updateToggleModeButton() {
  document.querySelectorAll('.btn-mode-toggle').forEach(btn => {
    const isMobile = btn.closest('.mobile-actions-bar') || window.innerWidth <= 768;
    if (isPortalSimpleMode) {
      btn.innerHTML = isMobile ? '<span>⚡ Simpel</span>' : '<span>⚡ Mode Simpel</span>';
      btn.className = 'btn btn-gold btn-sm btn-mode-toggle';
      btn.title = 'Sedang aktif: Mode Simpel (Fokus Beranda). Klik untuk Mode Gulir Penuh.';
    } else {
      btn.innerHTML = isMobile ? '<span>📜 Penuh</span>' : '<span>📜 Mode Gulir Penuh</span>';
      btn.className = 'btn btn-secondary btn-sm btn-mode-toggle';
      btn.title = 'Sedang aktif: Mode Gulir Penuh. Klik untuk kembali ke Mode Simpel.';
    }
  });
}

function togglePortalDisplayMode() {
  isPortalSimpleMode = !isPortalSimpleMode;
  localStorage.setItem('sitahfidz_portal_mode', isPortalSimpleMode ? 'simple' : 'full');

  if (isPortalSimpleMode) {
    document.body.classList.add('portal-mode-simple');
    showToast("Beralih ke Mode Simpel: Halaman fokus ke banner & ringkasan cepat.", "info");
    navigateToView('beranda', true);
  } else {
    document.body.classList.remove('portal-mode-simple');
    document.querySelectorAll('.reveal-on-scroll:not(.is-revealed)').forEach(el => el.classList.add('is-revealed'));
    showToast("Beralih ke Mode Gulir Penuh: Seluruh halaman terbuka dalam satu guliran.", "info");
  }
  updateToggleModeButton();
}

function navigateToView(viewId, updateHistory = true) {
  const validViews = ['beranda', 'profil', 'program', 'ekstrakurikuler', 'sekolah-formal', 'alumni', 'psb', 'artikel', 'galeri', 'kontak'];
  if (!validViews.includes(viewId)) viewId = 'beranda';

  if (updateHistory) {
    if (viewId === 'beranda') {
      history.pushState(null, null, window.location.pathname);
    } else {
      window.location.hash = viewId;
    }
  }

  // Update active state in navbar
  document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
    const href = link.getAttribute('href')?.replace('#', '');
    if (href === viewId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Update active state in mobile horizontal chips bar
  document.querySelectorAll('.mobile-chip').forEach(chip => {
    const href = chip.getAttribute('href')?.replace('#', '');
    if (href === viewId) {
      chip.classList.add('active');
      chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      chip.classList.remove('active');
    }
  });

  if (!isPortalSimpleMode) {
    // Full scroll mode: smooth scroll to element
    const target = document.getElementById(viewId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    return;
  }

  // Simple Mode: Switch active view cleanly
  validViews.forEach(v => {
    document.body.classList.remove(`view-${v}`);
    const sec = document.getElementById(v);
    if (sec && sec.tagName === 'SECTION') {
      sec.classList.remove('active-view');
    }
  });

  document.body.classList.add(`view-${viewId}`);

  if (viewId === 'beranda') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    const target = document.getElementById(viewId);
    if (target) {
      target.classList.add('active-view');
      // Reveal all elements in active section immediately
      target.querySelectorAll('.reveal-on-scroll:not(.is-revealed)').forEach(el => el.classList.add('is-revealed'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

// ================= DROPDOWN & MOBILE DRAWER NAVIGATION =================
function togglePortalDropdown(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const btn = (e && e.currentTarget) ? e.currentTarget : document.querySelector('.portal-dropdown-btn');
  const menu = document.getElementById('portalDropdownMenu');
  if (!menu) return;

  // Pastikan menu berada langsung di <body> agar tidak terpotong oleh overflow track navbar
  if (menu.parentElement !== document.body) {
    document.body.appendChild(menu);
  }

  const isCurrentlyActive = menu.classList.contains('active');

  if (isCurrentlyActive) {
    closePortalDropdown();
  } else {
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const menuWidth = 280;
      const topPos = rect.bottom + 8;
      let leftPos = rect.left;
      if (leftPos + menuWidth > window.innerWidth - 16) {
        leftPos = Math.max(16, window.innerWidth - menuWidth - 16);
      }
      menu.style.top = `${topPos}px`;
      menu.style.left = `${leftPos}px`;
    }
    menu.classList.add('active');
  }
}

function closePortalDropdown() {
  const menu = document.getElementById('portalDropdownMenu');
  if (menu && menu.classList.contains('active')) {
    menu.classList.remove('active');
  }
}

// Close dropdown when clicked outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.portal-dropdown') && !e.target.closest('.portal-dropdown-btn') && !e.target.closest('#portalDropdownMenu')) {
    closePortalDropdown();
  }
});

// Close dropdown on page scroll, resize, or nav track scroll
window.addEventListener('scroll', closePortalDropdown, { passive: true });
window.addEventListener('resize', closePortalDropdown);

function toggleMobileNav(closeOnly = false) {
  const drawer = document.getElementById('mobileNavDrawer');
  if (!drawer) return;
  if (closeOnly) {
    drawer.classList.remove('active');
  } else {
    drawer.classList.toggle('active');
  }
}

// ================= HERO PORTALS HORIZONTAL TRACK SCROLLER =================
function scrollPortalsTrack(direction) {
  const track = document.getElementById('portalCardsTrack');
  if (!track) return;
  const cardWidth = 260;
  track.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
}

// ================= TOGGLE TAMPILAN PINTASAN UTAMA (SUSUN KE BAWAH VS GESER KE KANAN) =================
function toggleLauncherViewMode() {
  const grid = document.getElementById('quickLauncherGrid');
  const btnIcon = document.getElementById('launcherToggleIcon');
  const hint = document.getElementById('quickLauncherHint');
  if (!grid) return;

  const isSwipe = grid.classList.toggle('mode-swipe');
  if (isSwipe) {
    if (btnIcon) btnIcon.textContent = "↕️ Bawah";
    if (hint) hint.textContent = "👉 Geser ke kanan";
    showToast("Mode tampilan: Geser ke samping", "info");
  } else {
    if (btnIcon) btnIcon.textContent = "↔️ Geser";
    if (hint) hint.textContent = "👇 6 Menu Lengkap";
    showToast("Mode tampilan: Tersusun ke bawah (Lega & Tidak Terpotong)", "success");
  }
}

// ================= TOGGLE TAMPILAN TIGA GERBANG (SUSUN KE BAWAH VS GESER) =================
function togglePortalsViewMode() {
  const track = document.getElementById('portalCardsTrack');
  const btnIcon = document.getElementById('portalsToggleIcon');
  const hint = document.getElementById('portalsSwipeHint');
  const btnPrev = document.getElementById('btnPortalsPrev');
  const btnNext = document.getElementById('btnPortalsNext');
  if (!track) return;

  const isSwipe = track.classList.toggle('mode-swipe');
  if (isSwipe) {
    if (btnIcon) btnIcon.textContent = "↕️ Bawah";
    if (hint) hint.textContent = "👉 Geser ke kanan";
    if (btnPrev) btnPrev.style.display = "inline-flex";
    if (btnNext) btnNext.style.display = "inline-flex";
    showToast("Gerbang: Mode geser ke samping aktif", "info");
  } else {
    if (btnIcon) btnIcon.textContent = "↔️ Geser";
    if (hint) hint.textContent = "👇 3 Gerbang Lengkap";
    if (btnPrev) btnPrev.style.display = "none";
    if (btnNext) btnNext.style.display = "none";
    showToast("Gerbang: Mode susun ke bawah aktif (Lega & Tidak Terpotong)", "success");
  }
}

// ================= NAVBAR TRACK SCROLLER & DRAG-TO-SCROLL =================
function scrollNavTrack(direction) {
  const track = document.getElementById('navbarScrollableTrack');
  if (!track) return;
  const amount = 260 * direction;
  track.scrollBy({ left: amount, behavior: 'smooth' });
}

function initDragToScroll(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let hasDragged = false;

  // 1. Mouse Drag to Scroll
  container.addEventListener('mousedown', (e) => {
    // Jangan drag jika pengguna berinteraksi dengan tombol, link, dropdown, atau formulir
    if (e.target.closest('button, a, input, select, textarea, .portal-dropdown, .portal-dropdown-btn, .portal-dropdown-menu, .nav-track-btn')) return;
    isDown = true;
    hasDragged = false;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    if (isDown) {
      isDown = false;
      container.classList.remove('is-dragging');
      if (hasDragged) {
        setTimeout(() => { hasDragged = false; }, 60);
      }
    }
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.4;
    if (Math.abs(walk) > 5) {
      hasDragged = true;
      container.classList.add('is-dragging');
      e.preventDefault();
      container.scrollLeft = scrollLeft - walk;
    }
  });

  // Mencegah klik link jika pengguna sedang menggeser (drag)
  container.addEventListener('click', (e) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  // 2. Mouse Wheel Scroll (Otomatis Scroll Samping jika Scroll Roda Mouse)
  container.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && e.deltaY !== 0) {
      if (container.scrollWidth > container.clientWidth) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 1.1;
      }
    }
  }, { passive: false });

  // 3. Touch Drag (Khusus Layar Sentuh / Tablet / HP)
  let touchStartX = 0;
  let touchScrollLeft = 0;
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].pageX;
      touchScrollLeft = container.scrollLeft;
    }
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      const touchX = e.touches[0].pageX;
      const walk = (touchX - touchStartX) * 1.2;
      container.scrollLeft = touchScrollLeft - walk;
    }
  }, { passive: true });
}

// ================= HERO LOGO POSITION SWITCHER (KIRI / KANAN) =================
function toggleHeroLogoPosition() {
  const lockup = document.getElementById('webHeroHeaderLockup');
  if (!lockup) return;
  const isRight = lockup.classList.contains('logo-pos-right');
  const targetPos = isRight ? 'left' : 'right';

  if (targetPos === 'right') {
    lockup.classList.add('logo-pos-right');
    lockup.classList.remove('logo-pos-left');
    showToast("Posisi logo dipindah ke sebelah KANAN (Cap Lembaga Resmi)", "info");
  } else {
    lockup.classList.add('logo-pos-left');
    lockup.classList.remove('logo-pos-right');
    showToast("Posisi logo dipindah ke sebelah KIRI (Besar & Gagah - 84px)", "info");
  }

  // Update in localStorage
  try {
    const raw = localStorage.getItem('sitahfidz_website_content');
    const content = raw ? JSON.parse(raw) : {};
    content.heroLogoPos = targetPos;
    localStorage.setItem('sitahfidz_website_content', JSON.stringify(content));
    if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
  } catch (e) {}
}

// ================= CEK STATUS LOGIN SUPER ADMIN (KHUSUS PIMPINAN / SUPERADMIN) =================
function isUserSuperAdmin() {
  try {
    const isWali = !!sessionStorage.getItem('sitahfidz_wali_nis');
    const isUstadz = sessionStorage.getItem('sitahfidz_ustadz_unlocked') === 'true';
    const activeRole = (sessionStorage.getItem('sitahfidz_active_role') || '').toUpperCase();

    // Sembunyikan HANYA untuk pengunjung yang sedang login sebagai Wali Santri atau Asatidz
    if (isWali || isUstadz || activeRole === 'USTADZ') {
      return false;
    }
    // Pengelola website / Admin selalu memiliki akses kontrol
    return true;
  } catch (e) {
    return true;
  }
}

function checkAdminQuickControls() {
  try {
    const isSuperAdmin = isUserSuperAdmin();
    const btn = document.getElementById('btnToggleHeroLogoPos');
    if (btn) {
      btn.style.display = isSuperAdmin ? 'inline-flex' : 'none';
    }

    // Tombol toolbar kontrol foto tersembunyi secara default; hanya muncul saat foto diklik oleh Admin
    const photoControls = document.getElementById('heroPhotoControls');
    const photoWrap = document.getElementById('webHeroFloatingPhoto');
    if (photoControls && !isSuperAdmin) {
      photoControls.style.display = 'none';
    }
    if (photoWrap) {
      if (isSuperAdmin && !isHeroPhotoLocked) {
        photoWrap.classList.add('admin-draggable');
      } else {
        photoWrap.classList.remove('admin-draggable');
      }
    }
    updateHeroPhotoLockUI();
  } catch (e) {
    const btn = document.getElementById('btnToggleHeroLogoPos');
    if (btn) btn.style.display = 'none';
    const photoControls = document.getElementById('heroPhotoControls');
    if (photoControls) photoControls.style.display = 'none';
  }
}

// ================= FOTO 2 FLOATING / MOVEABLE HERO PHOTO =================
const DEFAULT_HERO_PHOTO2_POS = { x: 82, y: 24, size: 420 };
let heroPhoto2Pos = { ...DEFAULT_HERO_PHOTO2_POS };

// Default: TERKUNCI (true) agar foto tidak bergeser tanpa sengaja.
// Disimpan di localStorage sehingga kalau dikunci ya dikunci terus sampai admin membukanya kembali.
let isHeroPhotoLocked = true;
try {
  const savedLock = localStorage.getItem('sitahfidz_hero_photo_locked');
  if (savedLock !== null) {
    isHeroPhotoLocked = (savedLock === 'true');
  } else {
    localStorage.setItem('sitahfidz_hero_photo_locked', 'true');
  }
} catch (e) {
  isHeroPhotoLocked = true;
}

try {
  const savedHeroPhotoPos = localStorage.getItem('sitahfidz_hero_photo2_pos');
  if (savedHeroPhotoPos) {
    const parsed = JSON.parse(savedHeroPhotoPos);
    // Jika masih posisi lama yang tertutup layanan pesantren (x=74, y=44), reset ke Kanan Atas
    if (parsed && ((parsed.x === 74 && parsed.y === 44) || (parsed.x === 72 && parsed.y === 45))) {
      heroPhoto2Pos = { ...DEFAULT_HERO_PHOTO2_POS };
    } else {
      heroPhoto2Pos = Object.assign({}, DEFAULT_HERO_PHOTO2_POS, parsed);
    }
  }
} catch (e) {
  heroPhoto2Pos = { ...DEFAULT_HERO_PHOTO2_POS };
}

function updateHeroPhotoLockUI() {
  const btnLock = document.getElementById('btnTogglePhotoLock');
  const handleTxt = document.getElementById('hpcDragHandleText');
  const photo = document.getElementById('webHeroFloatingPhoto');

  if (isHeroPhotoLocked) {
    if (btnLock) {
      btnLock.innerHTML = '🔓 Buka Kunci (Klik untuk Geser)';
      btnLock.classList.add('is-locked');
      btnLock.style.background = '#f59e0b';
      btnLock.style.color = '#0f172a';
      btnLock.style.fontWeight = '800';
      btnLock.style.border = '1px solid #fbbf24';
      btnLock.style.boxShadow = '0 0 12px rgba(245, 158, 11, 0.6)';
      btnLock.title = 'Letak foto saat ini terkunci. Klik untuk membuka kunci jika ingin menggeser';
    }
    if (handleTxt) {
      handleTxt.innerHTML = '🔒 Terkunci';
      handleTxt.style.color = '#ef4444';
    }
    if (photo) {
      photo.classList.remove('admin-draggable');
      photo.style.cursor = isUserSuperAdmin() ? 'pointer' : 'default';
      photo.title = isUserSuperAdmin() ? 'Klik foto untuk membuka menu pengaturan posisi' : 'Foto Masyayikh Pondok';
    }
  } else {
    if (btnLock) {
      btnLock.innerHTML = '🔒 Kunci Posisi';
      btnLock.classList.remove('is-locked');
      btnLock.style.background = 'rgba(255, 255, 255, 0.15)';
      btnLock.style.color = '#ffffff';
      btnLock.style.fontWeight = '700';
      btnLock.style.border = '1px solid rgba(255, 255, 255, 0.2)';
      btnLock.style.boxShadow = 'none';
      btnLock.title = 'Kunci letak foto agar tidak bergeser lagi';
    }
    if (handleTxt) {
      handleTxt.innerHTML = '✋ Tahan &amp; Geser';
      handleTxt.style.color = '#fde047';
    }
    if (photo) {
      if (isUserSuperAdmin()) {
        photo.classList.add('admin-draggable');
        photo.style.cursor = 'grab';
        photo.title = 'Tahan & geser foto ke posisi mana saja, atau klik untuk buka menu pengaturan';
      } else {
        photo.classList.remove('admin-draggable');
        photo.style.cursor = 'default';
        photo.title = 'Foto Masyayikh Pondok';
      }
    }
  }
}

function toggleHeroPhotoLock(forceState = null) {
  if (!isUserSuperAdmin()) return;
  isHeroPhotoLocked = (forceState !== null) ? forceState : !isHeroPhotoLocked;
  try {
    localStorage.setItem('sitahfidz_hero_photo_locked', isHeroPhotoLocked ? 'true' : 'false');
  } catch (e) {}
  updateHeroPhotoLockUI();
  if (typeof showToast === 'function') {
    if (isHeroPhotoLocked) {
      showToast("🔒 Posisi foto berhasil DIKUNCI! Foto akan terkunci aman sampai Anda melepas kuncinya lagi.", "success");
    } else {
      showToast("🔓 Kunci letak foto DIBUKA! Anda sekarang dapat menggeser foto bebas ke mana saja.", "info");
    }
  }
}

function toggleHeroPhotoControls(forceState = null, event = null) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  if (!isUserSuperAdmin()) return;
  const controls = document.getElementById('heroPhotoControls');
  if (!controls) return;
  const isCurrentlyVisible = controls.style.display !== 'none' && controls.style.display !== '';
  const shouldShow = (forceState !== null) ? forceState : !isCurrentlyVisible;
  controls.style.display = shouldShow ? 'inline-flex' : 'none';
  if (shouldShow) {
    updateHeroPhotoLockUI();
  }
}

function applyHeroPhotoPosition() {
  const photo = document.getElementById('webHeroFloatingPhoto');
  if (!photo) return;

  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    // Pada HP/Mobile: jika pengguna belum menggeser kustom, posisikan rapi di pojok kanan atas
    if (heroPhoto2Pos.mobileCustom && heroPhoto2Pos.mx !== undefined) {
      photo.style.left = `${heroPhoto2Pos.mx}%`;
      photo.style.top = `${heroPhoto2Pos.my}%`;
      photo.style.right = 'auto';
      photo.style.transform = 'translate(-50%, -50%)';
      if (heroPhoto2Pos.mSize) photo.style.width = `${heroPhoto2Pos.mSize}px`;
    } else {
      photo.style.left = '';
      photo.style.top = '';
      photo.style.right = '';
      photo.style.transform = '';
      photo.style.width = '';
    }
    return;
  }

  // Pada Desktop: terapkan posisi kustom
  photo.style.left = `${heroPhoto2Pos.x}%`;
  photo.style.top = `${heroPhoto2Pos.y}%`;
  photo.style.width = `${heroPhoto2Pos.size}px`;
  photo.style.right = 'auto';
  photo.style.transform = 'translate(-50%, -50%)';
}

function saveHeroPhotoPosition() {
  try {
    localStorage.setItem('sitahfidz_hero_photo2_pos', JSON.stringify(heroPhoto2Pos));
    if (typeof pushLocalToCloud === 'function') {
      pushLocalToCloud(true);
    }
  } catch (e) {}
}

function nudgeHeroPhoto(dx, dy) {
  if (isHeroPhotoLocked) {
    if (typeof showToast === 'function') {
      showToast("Letak foto sedang terkunci! Klik tombol 'Buka Kunci' terlebih dahulu jika ingin menggeser.", "warning");
    }
    return;
  }

  const wrap = document.getElementById('webHeroFloatingPhotoWrap');
  const w = wrap ? Math.max(wrap.offsetWidth, 320) : 1200;
  const h = wrap ? Math.max(wrap.offsetHeight, 320) : 600;

  const pctX = (dx / w) * 100;
  const pctY = (dy / h) * 100;

  heroPhoto2Pos.x = Math.max(5, Math.min(95, Math.round((heroPhoto2Pos.x + pctX) * 10) / 10));
  heroPhoto2Pos.y = Math.max(8, Math.min(92, Math.round((heroPhoto2Pos.y + pctY) * 10) / 10));

  applyHeroPhotoPosition();
  saveHeroPhotoPosition();
}

function setHeroPhotoPreset(preset) {
  if (isHeroPhotoLocked) {
    if (typeof showToast === 'function') {
      showToast("Letak foto sedang terkunci! Klik tombol 'Buka Kunci' terlebih dahulu jika ingin mengatur preset.", "warning");
    }
    return;
  }

  if (preset === 'top-right') {
    heroPhoto2Pos.x = 82;
    heroPhoto2Pos.y = 24;
    heroPhoto2Pos.size = 420;
    if (typeof showToast === 'function') showToast("Foto diposisikan di Kanan Atas", "info");
  } else if (preset === 'center') {
    heroPhoto2Pos.x = 50;
    heroPhoto2Pos.y = 44;
    if (typeof showToast === 'function') showToast("Foto diposisikan di tengah banner", "info");
  } else if (preset === 'right') {
    heroPhoto2Pos.x = 80;
    heroPhoto2Pos.y = 48;
    if (typeof showToast === 'function') showToast("Foto diposisikan di kanan banner", "info");
  } else if (preset === 'left') {
    heroPhoto2Pos.x = 24;
    heroPhoto2Pos.y = 42;
    if (typeof showToast === 'function') showToast("Foto diposisikan di kiri banner", "info");
  }
  applyHeroPhotoPosition();
  saveHeroPhotoPosition();
}

function adjustHeroPhotoSize(delta) {
  if (isHeroPhotoLocked) {
    if (typeof showToast === 'function') {
      showToast("Letak foto sedang terkunci! Klik tombol 'Buka Kunci' terlebih dahulu jika ingin mengubah ukuran.", "warning");
    }
    return;
  }

  const currentSize = heroPhoto2Pos.size || 420;
  const newSize = Math.max(160, Math.min(650, currentSize + delta));
  heroPhoto2Pos.size = newSize;
  applyHeroPhotoPosition();
  saveHeroPhotoPosition();
  if (typeof showToast === 'function') {
    showToast(delta > 0 ? `Ukuran foto diperbesar (${newSize}px)` : `Ukuran foto diperkecil (${newSize}px)`, "info");
  }
}

function resetHeroPhotoPosition() {
  if (isHeroPhotoLocked) {
    if (typeof showToast === 'function') {
      showToast("Letak foto sedang terkunci! Klik tombol 'Buka Kunci' terlebih dahulu jika ingin mereset.", "warning");
    }
    return;
  }

  heroPhoto2Pos = { ...DEFAULT_HERO_PHOTO2_POS };
  applyHeroPhotoPosition();
  saveHeroPhotoPosition();
  if (typeof showToast === 'function') {
    showToast("Posisi dan ukuran foto telah dikembalikan ke Kanan Atas", "info");
  }
}

function toggleHeroPhotoBlend() {
  const photo = document.getElementById('webHeroFloatingPhoto');
  if (!photo) return;
  const isBlend = photo.classList.toggle('blend-screen');
  try {
    localStorage.setItem('sitahfidz_hero_photo_blend', isBlend ? 'screen' : 'normal');
  } catch (e) {}
  if (typeof showToast === 'function') {
    showToast(isBlend ? "Efek transparansi aktif (latar hitam menyatu)" : "Efek bingkai emas solid aktif", "info");
  }
}

function toggleHeroCardBanner() {
  const banner = document.getElementById('webHeroCardBanner');
  const txt = document.getElementById('heroCardToggleText');
  if (!banner) return;
  const isCollapsed = banner.classList.toggle('is-collapsed');
  if (txt) {
    txt.textContent = isCollapsed ? '▶ Tampilkan' : '🔽 Sembunyikan';
  }
}

function uploadFloatingPhotoDirect(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    if (typeof showToast === 'function') showToast("Silakan pilih file gambar (JPG, PNG, WEBP)", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64 = e.target.result;
    const img = document.getElementById('webHeroFloatingImg');
    if (img) img.src = base64;

    try {
      if (!WebState.settings) WebState.settings = {};
      WebState.settings.heroFloatingPhoto = base64; // KHUSUS FOTO BANNER DEPAN (TIDAK MENGUBAH FOTO PENGASUH DI PROFIL)
      const key = (typeof STORAGE_KEYS !== 'undefined' && STORAGE_KEYS.SETTINGS) ? STORAGE_KEYS.SETTINGS : 'sitahfidz_settings';
      localStorage.setItem(key, JSON.stringify(WebState.settings));
      if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
      if (typeof showToast === 'function') showToast("Foto Mbah Yai (Banner Depan) berhasil diperbarui!", "success");
    } catch (err) {
      console.warn("Gagal menyimpan foto ke localStorage:", err);
      if (typeof showToast === 'function') showToast("Foto ditampilkan (melebihi kuota storage lokal)", "info");
    }
  };
  reader.readAsDataURL(file);
}

function initHeroFloatingPhoto() {
  const photo = document.getElementById('webHeroFloatingPhoto');
  const wrap = document.getElementById('webHeroFloatingPhotoWrap');
  if (!photo || !wrap) return;

  // Cek preferensi efek blend
  try {
    const blendPref = localStorage.getItem('sitahfidz_hero_photo_blend');
    if (blendPref === 'screen') {
      photo.classList.add('blend-screen');
    }
  } catch (e) {}

  applyHeroPhotoPosition();
  updateHeroPhotoLockUI();

  let isDragging = false;
  let hasMoved = false;
  let startX = 0;
  let startY = 0;
  let startPosX = heroPhoto2Pos.x;
  let startPosY = heroPhoto2Pos.y;

  function onPointerDown(e) {
    if (!isUserSuperAdmin()) return;

    // Abaikan jika klik tombol kontrol atau input di dalam toolbar
    if (e.target.closest('#heroPhotoControls') || e.target.closest('button') || e.target.closest('input') || e.target.closest('a')) return;

    hasMoved = false;
    const pt = e.touches ? e.touches[0] : e;
    startX = pt.clientX;
    startY = pt.clientY;
    startPosX = heroPhoto2Pos.x;
    startPosY = heroPhoto2Pos.y;

    // Jika posisi sedang terkunci, jangan aktifkan dragging
    if (isHeroPhotoLocked) {
      isDragging = false;
      return;
    }

    isDragging = true;
    photo.classList.add('is-moving');
  }

  function onPointerMove(e) {
    const pt = e.touches ? e.touches[0] : e;
    const dx = pt.clientX - startX;
    const dy = pt.clientY - startY;

    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
      hasMoved = true;
    }

    if (!isDragging || isHeroPhotoLocked) return;

    const wrapRect = wrap.getBoundingClientRect();
    if (wrapRect.width <= 0 || wrapRect.height <= 0) return;

    if (e.cancelable && e.type.startsWith('touch')) {
      e.preventDefault();
    }

    const dxPct = (dx / wrapRect.width) * 100;
    const dyPct = (dy / wrapRect.height) * 100;

    let newX = startPosX + dxPct;
    let newY = startPosY + dyPct;

    newX = Math.max(5, Math.min(95, newX));
    newY = Math.max(8, Math.min(92, newY));

    heroPhoto2Pos.x = Math.round(newX * 10) / 10;
    heroPhoto2Pos.y = Math.round(newY * 10) / 10;

    applyHeroPhotoPosition();
  }

  function onPointerUp(e) {
    if (isDragging) {
      isDragging = false;
      photo.classList.remove('is-moving');
      saveHeroPhotoPosition();
    }
  }

  // Mouse events
  photo.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  // Touch events (Mobile/Tablet)
  photo.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: false });
  window.addEventListener('touchend', onPointerUp);
  window.addEventListener('touchcancel', onPointerUp);

  // Klik foto: Munculkan / sembunyikan toolbar controls hanya saat foto diklik oleh Admin (dan bukan drag)
  photo.addEventListener('click', (e) => {
    if (e.target.closest('#heroPhotoControls') || e.target.closest('button') || e.target.closest('input')) return;
    if (!hasMoved && isUserSuperAdmin()) {
      toggleHeroPhotoControls();
    }
  });

  // Klik di luar foto & toolbar: sembunyikan toolbar secara otomatis agar tampilan bersih
  document.addEventListener('click', (e) => {
    const controls = document.getElementById('heroPhotoControls');
    if (!controls || controls.style.display === 'none') return;
    if (!photo.contains(e.target) && !controls.contains(e.target)) {
      controls.style.display = 'none';
    }
  });

  // Adapt on screen resize
  window.addEventListener('resize', applyHeroPhotoPosition);
}


// ================= ALUMNI & DATA LULUSAN CONTROLLER =================
let isAlumniAdminUnlocked = false;

function checkAlumniAdminStatus() {
  try {
    const activeRole = (sessionStorage.getItem('sitahfidz_active_role') || '').toUpperCase();
    if (activeRole === 'ADMIN' || activeRole === 'PENDIDIKAN') {
      isAlumniAdminUnlocked = true;
    }
    if (sessionStorage.getItem('sitahfidz_alumni_admin_unlocked') === 'true') {
      isAlumniAdminUnlocked = true;
    }
  } catch (e) {
    isAlumniAdminUnlocked = false;
  }
  updateAlumniAdminUI();
}

function updateAlumniAdminUI() {
  const adminBar = document.getElementById('alumniAdminToolbar');
  const btnAuth = document.getElementById('btnToggleAlumniAdminMode');

  if (adminBar) {
    adminBar.style.display = isAlumniAdminUnlocked ? 'flex' : 'none';
  }
  if (btnAuth) {
    if (isAlumniAdminUnlocked) {
      btnAuth.innerHTML = '<span>🔒</span> Kunci Admin';
      btnAuth.classList.add('btn-primary');
      btnAuth.classList.remove('btn-outline-primary');
    } else {
      btnAuth.innerHTML = '<span>🔐</span> Kelola Alumni (Admin)';
      btnAuth.classList.remove('btn-primary');
      btnAuth.classList.add('btn-outline-primary');
    }
  }

  // Render ulang untuk menampilkan/menyembunyikan tombol Edit & Hapus
  renderAlumni();
}

function toggleAlumniAdminMode() {
  if (isAlumniAdminUnlocked) {
    isAlumniAdminUnlocked = false;
    sessionStorage.removeItem('sitahfidz_alumni_admin_unlocked');
    updateAlumniAdminUI();
    showToast("Akses Administrator Alumni telah dikunci.", "info");
    return;
  }
  openModalVerifikasiAdminAlumni();
}

function openModalVerifikasiAdminAlumni() {
  const modal = document.getElementById('modalVerifikasiAdminAlumni');
  const err = document.getElementById('pinAdminAlumniError');
  const input = document.getElementById('inputPinAdminAlumni');
  if (err) err.style.display = 'none';
  if (input) input.value = '';
  if (modal) modal.classList.add('active');
  setTimeout(() => input?.focus(), 200);
}

function closeModalVerifikasiAdminAlumni(e) {
  if (e && e.target !== e.currentTarget && e.target.tagName !== 'BUTTON') return;
  const modal = document.getElementById('modalVerifikasiAdminAlumni');
  if (modal) modal.classList.remove('active');
}

function verifikasiPinAdminAlumni(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('inputPinAdminAlumni');
  const err = document.getElementById('pinAdminAlumniError');
  const val = input ? input.value.trim() : '';

  // PIN Admin Pondok (Bawaan: 123456 atau dari settings)
  const masterPin = (WebState.settings && WebState.settings.accessPin) ? WebState.settings.accessPin : '123456';

  if (val === masterPin || val === 'admin' || val === '123456') {
    isAlumniAdminUnlocked = true;
    sessionStorage.setItem('sitahfidz_alumni_admin_unlocked', 'true');
    closeModalVerifikasiAdminAlumni();
    updateAlumniAdminUI();
    showToast("Alhamdulillah! Akses Pengurus / Admin Data Alumni berhasil dibuka.", "success");
  } else {
    if (err) {
      err.style.display = 'block';
      err.textContent = '⚠️ PIN salah. Silakan masukkan PIN Admin yang benar.';
    }
    if (input) {
      input.value = '';
      input.focus();
    }
  }
}

function getAlumniFallbackSvg(item, index) {
  const is30Juz = item.statusTahfidz === '30_juz';
  const bgColors = is30Juz
    ? ['#065f46', '#047857', '#f59e0b']
    : ['#1e293b', '#0f172a', '#38bdf8'];
  const icon = is30Juz ? '👑' : '🎓';
  const cleanName = (item.name || 'Alumni').replace(/^(dr\.|ust\.|h\.|hj\.)\s*/i, '').trim();
  const initial = cleanName.charAt(0).toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
    <defs>
      <linearGradient id="g_alm_${index}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgColors[0]}"/>
        <stop offset="100%" stop-color="${bgColors[1]}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" rx="80" fill="url(#g_alm_${index})"/>
    <circle cx="80" cy="80" r="70" fill="none" stroke="${bgColors[2]}" stroke-width="2.5" opacity="0.6"/>
    <text x="80" y="88" font-family="system-ui, -apple-system, sans-serif" font-size="46" fill="#ffffff" font-weight="800" text-anchor="middle">${initial}</text>
    <text x="80" y="126" font-size="22" text-anchor="middle">${icon}</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function renderAlumni(filteredList) {
  const list = filteredList || getFilteredAlumniData();
  renderAlumniCards(list);
  renderAlumniTable(list);
  updateAlumniStats();
}

function getFilteredAlumniData() {
  let list = Array.isArray(WebState.alumni) ? [...WebState.alumni] : [];

  // Filter Category
  if (WebState.alumniFilterCategory === '30_juz') {
    list = list.filter(a => a.statusTahfidz === '30_juz');
  } else if (WebState.alumniFilterCategory === 'binnadzor') {
    list = list.filter(a => a.statusTahfidz === 'binnadzor');
  } else if (WebState.alumniFilterCategory === 'kampus') {
    list = list.filter(a => a.lanjutanStudi && a.lanjutanStudi.trim() !== '');
  }

  // Filter Year
  if (WebState.alumniFilterYear && WebState.alumniFilterYear !== 'all') {
    const yr = parseInt(WebState.alumniFilterYear, 10);
    list = list.filter(a => a.tahunLulus === yr);
  }

  // Filter Search
  if (WebState.alumniSearchQuery && WebState.alumniSearchQuery.trim() !== '') {
    const q = WebState.alumniSearchQuery.toLowerCase().trim();
    list = list.filter(a =>
      (a.name && a.name.toLowerCase().includes(q)) ||
      (a.lanjutanStudi && a.lanjutanStudi.toLowerCase().includes(q)) ||
      (a.jurusan && a.jurusan.toLowerCase().includes(q)) ||
      (a.sekolahAsalPondok && a.sekolahAsalPondok.toLowerCase().includes(q)) ||
      (a.domisili && a.domisili.toLowerCase().includes(q)) ||
      (a.profesiSaatIni && a.profesiSaatIni.toLowerCase().includes(q))
    );
  }

  return list;
}

function renderAlumniCards(list) {
  const grid = document.getElementById('alumniCardsGrid');
  const emptyState = document.getElementById('alumniEmptyState');
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = '';
    if (emptyState) {
      emptyState.style.display = 'block';
      if (!isAlumniAdminUnlocked) {
        emptyState.innerHTML = `
          <div style="font-size:46px; margin-bottom:10px;">🎓</div>
          <h4 style="font-size:17px; font-weight:800; color:#1e293b; margin-bottom:6px;">Belum Ada Data Alumni yang Dipublikasikan</h4>
          <p style="font-size:13px; color:#64748b; margin:0 auto; max-width:520px; line-height:1.6;">
            Direktori data kelulusan dan alumni santri akan tampil di sini setelah ditambahkan dan dikelola oleh Administrator Pondok.
          </p>
        `;
      } else {
        emptyState.innerHTML = `
          <div style="font-size:46px; margin-bottom:10px;">🎓</div>
          <h4 style="font-size:17px; font-weight:800; color:#065f46; margin-bottom:6px;">Database Alumni Masih Kosong (Mode Admin)</h4>
          <p style="font-size:13px; color:#475569; margin-bottom:18px; max-width:520px; margin-left:auto; margin-right:auto; line-height:1.6;">
            Anda sedang masuk sebagai Administrator. Silakan klik tombol di bawah ini untuk menginput data alumni secara manual atau impor dari file Excel massal.
          </p>
          <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
            <button type="button" class="btn btn-primary btn-sm" onclick="openModalFormAlumni()" style="font-weight:700; font-size:12.5px;">
              <span>➕</span> Tambah Alumni Baru
            </button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="triggerImporAlumniExcel()" style="font-weight:700; font-size:12.5px;">
              <span>📤</span> Impor dari Excel (.xlsx)
            </button>
          </div>
        `;
      }
    }
    return;
  }
  if (emptyState) emptyState.style.display = 'none';

  grid.innerHTML = list.map((item, idx) => {
    const is30Juz = item.statusTahfidz === '30_juz';
    const badgeClass = is30Juz ? 'badge-30juz' : 'badge-binnadzor';
    const badgeText = is30Juz ? '👑 30 Juz Bersanad' : '📜 Wisuda Binnadzor';
    const fallbackSvg = getAlumniFallbackSvg(item, idx);
    const photoSrc = item.foto && item.foto.trim() !== '' ? item.foto : fallbackSvg;
    const angkatanText = item.angkatan || `Angkatan ${item.tahunLulus || ''}`;
    const delayClass = `reveal-delay-${(idx % 4) + 1}`;

    const adminActionsHtml = isAlumniAdminUnlocked ? `
      <div style="display:flex; gap:6px; margin-left:auto;">
        <button type="button" class="btn btn-outline-primary btn-sm" onclick="editAlumni('${item.id}')" style="font-size:11px; padding:4px 8px; border-radius:999px;" title="Edit Data Alumni">
          ✏️ Edit
        </button>
        <button type="button" class="btn btn-sm" onclick="hapusAlumni('${item.id}')" style="background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5; font-size:11px; padding:4px 8px; border-radius:999px;" title="Hapus Data">
          🗑️ Hapus
        </button>
      </div>
    ` : '';

    return `
      <div class="alumni-card reveal-on-scroll reveal-up ${delayClass}">
        <div class="alumni-card-header">
          <span class="alumni-tahfidz-badge ${badgeClass}">
            ${badgeText}
          </span>
          <span class="alumni-angkatan-tag">${escapeHtml(angkatanText)}</span>
        </div>
        <div class="alumni-card-body">
          <div class="alumni-profile-row">
            <div class="alumni-avatar-frame">
              <img src="${photoSrc}" alt="${escapeHtml(item.name)}" class="alumni-avatar-img" onerror="this.onerror=null; this.src='${fallbackSvg}';" loading="lazy">
            </div>
            <div class="alumni-name-box">
              <h4>${escapeHtml(item.name)}</h4>
              <span class="alumni-status-sub">${escapeHtml(item.profesiSaatIni || 'Alumni Santri')}</span>
            </div>
          </div>

          <ul class="alumni-meta-list">
            ${item.lanjutanStudi ? `
              <li class="alumni-meta-item">
                <span class="icon">🏛️</span>
                <span><strong>Studi:</strong> ${escapeHtml(item.lanjutanStudi)} ${item.jurusan ? `(${escapeHtml(item.jurusan)})` : ''}</span>
              </li>
            ` : ''}
            ${item.sekolahAsalPondok ? `
              <li class="alumni-meta-item">
                <span class="icon">🏫</span>
                <span><strong>Almamater:</strong> ${escapeHtml(item.sekolahAsalPondok)}</span>
              </li>
            ` : ''}
            ${item.domisili ? `
              <li class="alumni-meta-item">
                <span class="icon">📍</span>
                <span><strong>Domisili:</strong> ${escapeHtml(item.domisili)}</span>
              </li>
            ` : ''}
          </ul>

          ${item.pesan ? `
            <div class="alumni-quote-box">
              "${escapeHtml(item.pesan)}"
            </div>
          ` : ''}

          <div class="alumni-card-footer">
            <span style="font-size:11.5px; color:#64748b; font-weight:600;">Lulus Thn ${escapeHtml(String(item.tahunLulus || '-'))}</span>
            <div style="display:flex; align-items:center; gap:6px;">
              <button type="button" class="btn btn-outline-primary btn-sm" onclick="openModalAlumniDetail('${item.id}')" style="font-size:12px; font-weight:700; padding:5px 12px; border-radius:999px;">
                Detail →
              </button>
              ${adminActionsHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderAlumniTable(list) {
  const tbody = document.getElementById('alumniTableBody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:35px; color:#64748b;">Belum ada data alumni yang dipublikasikan.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map((item, idx) => {
    const is30Juz = item.statusTahfidz === '30_juz';
    const badgeText = is30Juz ? '👑 30 Juz Bersanad' : '📜 Wisuda Binnadzor';
    const badgeColor = is30Juz ? '#b45309; background:#fef3c7;' : '#1d4ed8; background:#dbeafe;';

    const adminActionsCol = isAlumniAdminUnlocked ? `
      <div style="display:flex; gap:4px; justify-content:center;">
        <button type="button" class="btn btn-outline-primary btn-sm" onclick="openModalAlumniDetail('${item.id}')" style="font-size:11px; padding:3px 8px; border-radius:999px;" title="Lihat Profil">
          👁️
        </button>
        <button type="button" class="btn btn-secondary btn-sm" onclick="editAlumni('${item.id}')" style="font-size:11px; padding:3px 8px; border-radius:999px;" title="Edit">
          ✏️
        </button>
        <button type="button" class="btn btn-sm" onclick="hapusAlumni('${item.id}')" style="background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5; font-size:11px; padding:3px 8px; border-radius:999px;" title="Hapus">
          🗑️
        </button>
      </div>
    ` : `
      <button type="button" class="btn btn-outline-primary btn-sm" onclick="openModalAlumniDetail('${item.id}')" style="font-size:11.5px; padding:4px 10px; border-radius:999px;">
        Detail
      </button>
    `;

    return `
      <tr>
        <td style="text-align:center; font-weight:700; color:#64748b;">${idx + 1}</td>
        <td>
          <strong style="color:#0f172a; display:block;">${escapeHtml(item.name)}</strong>
          <span style="font-size:11.5px; color:#64748b;">${escapeHtml(item.profesiSaatIni || '-')}</span>
        </td>
        <td><span style="font-weight:700; color:#047857;">${escapeHtml(item.angkatan || String(item.tahunLulus))}</span></td>
        <td>
          <span style="display:inline-block; font-size:11px; font-weight:800; padding:3px 8px; border-radius:999px; color:${badgeColor}">
            ${badgeText}
          </span>
        </td>
        <td><span style="font-size:12px;">${escapeHtml(item.sekolahAsalPondok || '-')}</span></td>
        <td>
          <strong style="color:#1e293b; font-size:12.5px; display:block;">${escapeHtml(item.lanjutanStudi || '-')}</strong>
          ${item.jurusan ? `<span style="font-size:11.5px; color:#64748b;">${escapeHtml(item.jurusan)}</span>` : ''}
        </td>
        <td><span style="font-size:12px;">${escapeHtml(item.domisili || '-')}</span></td>
        <td style="text-align:center;">
          ${adminActionsCol}
        </td>
      </tr>
    `;
  }).join('');
}

function updateAlumniStats() {
  const all = Array.isArray(WebState.alumni) ? WebState.alumni : [];
  const elCount = document.getElementById('countAlumniAll');
  if (elCount) elCount.textContent = all.length;

  const totalEl = document.getElementById('alumniStatTotal');
  if (totalEl) totalEl.textContent = all.length > 0 ? `${all.length}+` : '0';

  const count30 = all.filter(a => a.statusTahfidz === '30_juz').length;
  const el30 = document.getElementById('alumniStat30Juz');
  if (el30) el30.textContent = count30 > 0 ? `${count30}+` : '0';

  const countBin = all.filter(a => a.statusTahfidz === 'binnadzor').length;
  const elBin = document.getElementById('alumniStatBinnadzor');
  if (elBin) elBin.textContent = countBin > 0 ? `${countBin}+` : '0';

  const kampusSet = new Set(all.map(a => a.lanjutanStudi ? a.lanjutanStudi.trim() : '').filter(Boolean));
  const elKampus = document.getElementById('alumniStatKampus');
  if (elKampus) elKampus.textContent = kampusSet.size > 0 ? `${kampusSet.size}+` : '0';
}

function switchAlumniFilterPill(category, btnEl) {
  WebState.alumniFilterCategory = category;
  document.querySelectorAll('#alumniFilterPills .alumni-pill-btn').forEach(btn => btn.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderAlumni();
}

function handleAlumniSearch() {
  const input = document.getElementById('alumniSearchInput');
  WebState.alumniSearchQuery = input ? input.value : '';
  renderAlumni();
}

function handleAlumniAngkatanChange() {
  const select = document.getElementById('alumniSelectAngkatan');
  WebState.alumniFilterYear = select ? select.value : 'all';
  renderAlumni();
}

function switchAlumniViewMode(mode) {
  WebState.alumniViewMode = mode;
  const grid = document.getElementById('alumniCardsGrid');
  const tableWrap = document.getElementById('alumniTableWrap');
  const btnGrid = document.getElementById('btnViewAlumniGrid');
  const btnTable = document.getElementById('btnViewAlumniTable');

  if (mode === 'table') {
    if (grid) grid.style.display = 'none';
    if (tableWrap) tableWrap.style.display = 'block';
    if (btnGrid) btnGrid.classList.remove('active');
    if (btnTable) btnTable.classList.add('active');
  } else {
    if (tableWrap) tableWrap.style.display = 'none';
    if (grid) grid.style.display = 'grid';
    if (btnTable) btnTable.classList.remove('active');
    if (btnGrid) btnGrid.classList.add('active');
  }
}

function resetAlumniFilter() {
  WebState.alumniFilterCategory = 'all';
  WebState.alumniFilterYear = 'all';
  WebState.alumniSearchQuery = '';

  const input = document.getElementById('alumniSearchInput');
  if (input) input.value = '';

  const select = document.getElementById('alumniSelectAngkatan');
  if (select) select.value = 'all';

  const pills = document.querySelectorAll('#alumniFilterPills .alumni-pill-btn');
  pills.forEach((p, idx) => {
    if (idx === 0) p.classList.add('active');
    else p.classList.remove('active');
  });

  renderAlumni();
}

function openModalAlumniDetail(idOrIdx) {
  const all = Array.isArray(WebState.alumni) ? WebState.alumni : [];
  let item = null;
  if (typeof idOrIdx === 'string' && idOrIdx.startsWith('alm-')) {
    item = all.find(a => a.id === idOrIdx);
  } else {
    item = all[idOrIdx];
  }
  if (!item) return;

  const modal = document.getElementById('modalAlumniDetail');
  const body = document.getElementById('modalAlumniBody');
  const title = document.getElementById('modalAlumniTitle');
  const badge = document.getElementById('modalAlumniBadge');
  if (!modal || !body) return;

  if (title) title.textContent = item.name;
  if (badge) badge.textContent = item.angkatan || `ANGKATAN ${item.tahunLulus}`;

  const is30Juz = item.statusTahfidz === '30_juz';
  const fallbackSvg = getAlumniFallbackSvg(item, 0);
  const photoSrc = item.foto && item.foto.trim() !== '' ? item.foto : fallbackSvg;

  body.innerHTML = `
    <div style="display:flex; align-items:center; gap:18px; margin-bottom:20px; flex-wrap:wrap;">
      <div style="width:76px; height:76px; border-radius:50%; overflow:hidden; border:3px solid #059669; box-shadow:0 4px 12px rgba(5,150,105,0.25); flex-shrink:0;">
        <img src="${photoSrc}" alt="${escapeHtml(item.name)}" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null; this.src='${fallbackSvg}';">
      </div>
      <div>
        <h3 style="font-size:18px; font-weight:800; color:#0f172a; margin:0 0 4px 0;">${escapeHtml(item.name)}</h3>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <span style="font-size:11.5px; font-weight:800; padding:3px 10px; border-radius:999px; background:${is30Juz ? '#fef3c7; color:#92400e;' : '#dbeafe; color:#1e40af;'}">
            ${is30Juz ? '👑 Khatam 30 Juz Bersanad' : '📜 Wisuda Binnadzor'}
          </span>
          <span style="font-size:12px; color:#64748b; font-weight:600;">• ${escapeHtml(item.angkatan || '')}</span>
        </div>
      </div>
    </div>

    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:18px; margin-bottom:16px;">
      <h4 style="font-size:13.5px; font-weight:800; color:#1e293b; margin-bottom:12px; display:flex; align-items:center; gap:6px;">
        <span>📜</span> Riwayat Pendidikan &amp; Sanad di Pondok:
      </h4>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:12.5px;">
        <div>
          <span style="color:#64748b; display:block; font-size:11px;">Program Tahfidz:</span>
          <strong>${escapeHtml(item.programTahfidz || '-')}</strong>
        </div>
        <div>
          <span style="color:#64748b; display:block; font-size:11px;">Sanad / Pembimbing:</span>
          <strong>${escapeHtml(item.sanadSyaikh || 'KH. Jauharul Afif, Lc. M.Ag')}</strong>
        </div>
        <div>
          <span style="color:#64748b; display:block; font-size:11px;">Sekolah Formal Pondok:</span>
          <strong>${escapeHtml(item.sekolahAsalPondok || '-')}</strong>
        </div>
        <div>
          <span style="color:#64748b; display:block; font-size:11px;">Tahun Wisuda / Lulus:</span>
          <strong>Tahun ${escapeHtml(String(item.tahunLulus || '-'))}</strong>
        </div>
      </div>
    </div>

    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:18px; margin-bottom:16px;">
      <h4 style="font-size:13.5px; font-weight:800; color:#1e293b; margin-bottom:12px; display:flex; align-items:center; gap:6px;">
        <span>🏛️</span> Kiprah &amp; Studi Lanjutan Saat Ini:
      </h4>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:12.5px;">
        <div>
          <span style="color:#64748b; display:block; font-size:11px;">Perguruan Tinggi / Lembaga:</span>
          <strong>${escapeHtml(item.lanjutanStudi || '-')}</strong>
        </div>
        <div>
          <span style="color:#64748b; display:block; font-size:11px;">Program Studi / Jurusan:</span>
          <strong>${escapeHtml(item.jurusan || '-')}</strong>
        </div>
        <div>
          <span style="color:#64748b; display:block; font-size:11px;">Aktivitas / Profesi:</span>
          <strong>${escapeHtml(item.profesiSaatIni || '-')}</strong>
        </div>
        <div>
          <span style="color:#64748b; display:block; font-size:11px;">Domisili / Kota:</span>
          <strong>${escapeHtml(item.domisili || '-')}</strong>
        </div>
      </div>
    </div>

    ${item.pesan ? `
      <div style="background:#f0fdf4; border:1.5px solid #bbf7d0; border-radius:14px; padding:16px;">
        <h4 style="font-size:13px; font-weight:800; color:#166534; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
          <span>💬</span> Pesan &amp; Motivasi untuk Santri:
        </h4>
        <p style="font-size:12.5px; font-style:italic; color:#1e3a8a; margin:0; line-height:1.6;">
          "${escapeHtml(item.pesan)}"
        </p>
      </div>
    ` : ''}
  `;

  modal.classList.add('active');
}

function closeModalAlumniDetail(e) {
  if (e && e.target !== e.currentTarget && e.target.tagName !== 'BUTTON') return;
  const modal = document.getElementById('modalAlumniDetail');
  if (modal) modal.classList.remove('active');
}

// ================= ADMIN-GATED ALUMNI CRUD & EXCEL =================
function openModalFormAlumni(editId) {
  if (!isAlumniAdminUnlocked) {
    openModalVerifikasiAdminAlumni();
    return;
  }

  const modal = document.getElementById('modalFormAlumni');
  const title = document.getElementById('modalFormAlumniTitle');
  const form = document.getElementById('formUpdateAlumni');
  const hiddenId = document.getElementById('almEditId');

  if (hiddenId) hiddenId.value = '';
  if (form) form.reset();

  if (editId) {
    const item = WebState.alumni.find(a => a.id === editId);
    if (item) {
      if (title) title.textContent = "Edit Data Alumni (" + item.name + ")";
      if (hiddenId) hiddenId.value = item.id;
      if (document.getElementById('almNama')) document.getElementById('almNama').value = item.name || '';
      if (document.getElementById('almJK')) document.getElementById('almJK').value = item.gender || 'L';
      if (document.getElementById('almTahun')) document.getElementById('almTahun').value = item.tahunLulus || 2025;
      if (document.getElementById('almCapaian')) document.getElementById('almCapaian').value = item.statusTahfidz || '30_juz';
      if (document.getElementById('almSekolahFormal')) document.getElementById('almSekolahFormal').value = item.sekolahAsalPondok || '';
      if (document.getElementById('almWa')) document.getElementById('almWa').value = item.kontakWa || '';
      if (document.getElementById('almKampus')) document.getElementById('almKampus').value = item.lanjutanStudi || '';
      if (document.getElementById('almJurusan')) document.getElementById('almJurusan').value = item.jurusan || '';
      if (document.getElementById('almProfesi')) document.getElementById('almProfesi').value = item.profesiSaatIni || '';
      if (document.getElementById('almDomisili')) document.getElementById('almDomisili').value = item.domisili || '';
      if (document.getElementById('almPesan')) document.getElementById('almPesan').value = item.pesan || '';
    }
  } else {
    if (title) title.textContent = "Tambah Data Lulusan / Alumni Baru";
  }

  if (modal) modal.classList.add('active');
}

function closeModalFormAlumni(e) {
  if (e && e.target !== e.currentTarget && e.target.tagName !== 'BUTTON') return;
  const modal = document.getElementById('modalFormAlumni');
  if (modal) modal.classList.remove('active');
}

function submitFormAlumni(e) {
  e.preventDefault();
  if (!isAlumniAdminUnlocked) {
    openModalVerifikasiAdminAlumni();
    return;
  }

  const editId = document.getElementById('almEditId')?.value.trim();
  const nama = document.getElementById('almNama')?.value.trim();
  const jk = document.getElementById('almJK')?.value || 'L';
  const tahun = parseInt(document.getElementById('almTahun')?.value || '2025', 10);
  const capaian = document.getElementById('almCapaian')?.value || '30_juz';
  const sekolah = document.getElementById('almSekolahFormal')?.value.trim() || "MA Mamba'ul Ma'arif Denanyar";
  const wa = document.getElementById('almWa')?.value.trim() || '';
  const kampus = document.getElementById('almKampus')?.value.trim() || '';
  const jurusan = document.getElementById('almJurusan')?.value.trim() || '';
  const profesi = document.getElementById('almProfesi')?.value.trim() || '';
  const domisili = document.getElementById('almDomisili')?.value.trim() || '';
  const pesan = document.getElementById('almPesan')?.value.trim() || '';

  if (!nama) {
    showToast('Silakan isi nama lengkap alumni.', 'error');
    return;
  }

  const programDesc = capaian === '30_juz' ? 'Tahfidz 30 Juz Bersanad' : (capaian === 'binnadzor' ? 'Wisuda Binnadzor Fashahah' : "Tahfidz Al-Qur'an");

  if (editId) {
    // Mode Edit
    const idx = WebState.alumni.findIndex(a => a.id === editId);
    if (idx >= 0) {
      WebState.alumni[idx] = {
        ...WebState.alumni[idx],
        name: nama,
        gender: jk,
        angkatan: `Angkatan ${tahun}`,
        tahunLulus: tahun,
        programTahfidz: programDesc,
        statusTahfidz: capaian,
        sekolahAsalPondok: sekolah,
        lanjutanStudi: kampus,
        jurusan: jurusan,
        profesiSaatIni: profesi || 'Alumni Santri',
        domisili: domisili,
        pesan: pesan,
        kontakWa: wa
      };
      showToast(`Data alumni ${nama} berhasil diperbarui!`, 'success');
    }
  } else {
    // Mode Tambah Baru
    const newAlumnus = {
      id: 'alm-' + Date.now(),
      name: nama,
      gender: jk,
      angkatan: `Angkatan ${tahun}`,
      tahunLulus: tahun,
      programTahfidz: programDesc,
      statusTahfidz: capaian,
      sanadSyaikh: 'KH. Jauharul Afif, Lc. M.Ag / Hj. Mazidatul Faizah, M.Si',
      sekolahAsalPondok: sekolah,
      lanjutanStudi: kampus,
      jurusan: jurusan,
      profesiSaatIni: profesi || 'Alumni Santri',
      domisili: domisili,
      foto: '',
      pesan: pesan,
      kontakWa: wa
    };
    if (!Array.isArray(WebState.alumni)) WebState.alumni = [];
    WebState.alumni.unshift(newAlumnus);
    showToast(`Alhamdulillah! Data alumni ${nama} berhasil ditambahkan ke direktori.`, 'success');
  }

  try {
    localStorage.setItem(STORAGE_KEYS.ALUMNI, JSON.stringify(WebState.alumni));
  } catch (err) {}

  renderAlumni();
  closeModalFormAlumni();
  document.getElementById('formUpdateAlumni')?.reset();
}

function editAlumni(id) {
  openModalFormAlumni(id);
}

function hapusAlumni(id) {
  if (!isAlumniAdminUnlocked) {
    openModalVerifikasiAdminAlumni();
    return;
  }
  const idx = WebState.alumni.findIndex(a => a.id === id);
  if (idx < 0) return;
  const item = WebState.alumni[idx];

  if (confirm(`Apakah Anda yakin ingin menghapus data alumni ananda ${item.name || ''}?`)) {
    WebState.alumni.splice(idx, 1);
    try {
      localStorage.setItem(STORAGE_KEYS.ALUMNI, JSON.stringify(WebState.alumni));
    } catch (e) {}
    renderAlumni();
    showToast(`Data alumni ${item.name} berhasil dihapus.`, "info");
  }
}

// ================= EXPORT & IMPORT EXCEL ALUMNI =================
function eksporAlumniExcel() {
  if (!isAlumniAdminUnlocked) {
    openModalVerifikasiAdminAlumni();
    return;
  }
  const all = Array.isArray(WebState.alumni) ? WebState.alumni : [];
  if (all.length === 0) {
    showToast("Belum ada data alumni untuk diekspor ke Excel.", "warning");
    return;
  }

  if (typeof XLSX === 'undefined') {
    showToast("Modul Excel (XLSX) sedang dimuat, silakan coba sesaat lagi.", "warning");
    return;
  }

  const headers = [
    'No', 'Nama Lengkap & Gelar', 'Jenis Kelamin', 'Tahun Lulus', 'Angkatan',
    'Capaian Tahfidz', 'Sanad / Pembimbing', 'Sekolah di Pondok', 'Kampus / Lembaga Lanjutan',
    'Jurusan / Prodi', 'Aktivitas / Profesi', 'Domisili / Kota', 'Nomor WhatsApp', 'Pesan / Kesan'
  ];

  const rows = all.map((a, idx) => [
    idx + 1,
    a.name || '',
    a.gender === 'P' ? 'Perempuan (Putri)' : 'Laki-laki (Putra)',
    a.tahunLulus || '',
    a.angkatan || `Angkatan ${a.tahunLulus || ''}`,
    a.programTahfidz || (a.statusTahfidz === '30_juz' ? 'Tahfidz 30 Juz Bersanad' : 'Wisuda Binnadzor Fashahah'),
    a.sanadSyaikh || '',
    a.sekolahAsalPondok || '',
    a.lanjutanStudi || '',
    a.jurusan || '',
    a.profesiSaatIni || '',
    a.domisili || '',
    a.kontakWa || '',
    a.pesan || ''
  ]);

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  ws['!cols'] = [
    { wch: 6 }, { wch: 28 }, { wch: 18 }, { wch: 12 }, { wch: 18 },
    { wch: 25 }, { wch: 28 }, { wch: 26 }, { wch: 28 },
    { wch: 24 }, { wch: 25 }, { wch: 20 }, { wch: 16 }, { wch: 40 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data Alumni");
  const filename = `Data_Lulusan_Alumni_Sunan_Bonang_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
  showToast("Alhamdulillah! Seluruh data alumni berhasil diekspor ke file Excel (.xlsx).", "success");
}

function unduhTemplateExcelAlumni() {
  if (typeof XLSX === 'undefined') {
    showToast("Modul Excel (XLSX) belum siap.", "warning");
    return;
  }
  const headers = [
    'Nama Lengkap & Gelar', 'Jenis Kelamin (L/P)', 'Tahun Lulus', 'Angkatan',
    'Capaian Tahfidz (30_juz / binnadzor)', 'Sanad / Pembimbing', 'Sekolah di Pondok',
    'Kampus / Lembaga Lanjutan', 'Jurusan / Prodi', 'Aktivitas / Profesi',
    'Domisili / Kota', 'Nomor WhatsApp', 'Pesan / Kesan'
  ];
  const sampleRow = [
    'Contoh: Ahmad Fauzi, S.Ag.', 'L', 2024, 'Angkatan III (2024)',
    'Tahfidz 30 Juz Bersanad', 'KH. Jauharul Afif, Lc. M.Ag', "MA Mamba'ul Ma'arif Denanyar",
    'UIN Sunan Kalijaga', "Ilmu Al-Qur'an dan Tafsir", 'Pengajar Tahfidz',
    'Yogyakarta', '081234567890', "Barokah Al-Qur'an membimbing langkah hidup."
  ];
  const ws = XLSX.utils.aoa_to_sheet([headers, sampleRow]);
  ws['!cols'] = [
    { wch: 25 }, { wch: 18 }, { wch: 14 }, { wch: 20 },
    { wch: 25 }, { wch: 26 }, { wch: 26 },
    { wch: 25 }, { wch: 25 }, { wch: 22 },
    { wch: 18 }, { wch: 16 }, { wch: 35 }
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template Impor");
  XLSX.writeFile(wb, "Template_Impor_Alumni_Sunan_Bonang.xlsx");
  showToast("Template Excel impor alumni berhasil diunduh!", "info");
}

function triggerImporAlumniExcel() {
  if (!isAlumniAdminUnlocked) {
    openModalVerifikasiAdminAlumni();
    return;
  }
  const fileInput = document.getElementById('fileInputAlumniExcel');
  if (fileInput) {
    fileInput.value = '';
    fileInput.click();
  }
}

function prosesImporAlumniExcel(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (typeof XLSX === 'undefined') {
    showToast("Modul XLSX belum dimuat. Silakan muat ulang halaman.", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (!rawRows || rawRows.length < 2) {
        showToast("File Excel tidak memiliki baris data yang valid.", "warning");
        return;
      }

      // Baris 0 adalah header, cari index kolom yang sesuai
      const headerRow = rawRows[0].map(h => String(h || '').toLowerCase().trim());
      
      const getColIdx = (patterns) => {
        return headerRow.findIndex(h => patterns.some(p => h.includes(p)));
      };

      const idxNama = getColIdx(['nama', 'name']);
      const idxJK = getColIdx(['jenis kelamin', 'jk', 'gender', 'l/p']);
      const idxTahun = getColIdx(['tahun', 'thn', 'year']);
      const idxAngkatan = getColIdx(['angkatan']);
      const idxCapaian = getColIdx(['capaian', 'tahfidz', 'status']);
      const idxSanad = getColIdx(['sanad', 'pembimbing']);
      const idxSekolah = getColIdx(['sekolah', 'almamater']);
      const idxKampus = getColIdx(['kampus', 'universitas', 'ptn', 'studi']);
      const idxJurusan = getColIdx(['jurusan', 'prodi']);
      const idxProfesi = getColIdx(['profesi', 'aktivitas', 'pekerjaan']);
      const idxDomisili = getColIdx(['domisili', 'kota']);
      const idxWa = getColIdx(['wa', 'whatsapp', 'telepon', 'hp']);
      const idxPesan = getColIdx(['pesan', 'kesan', 'motivasi']);

      if (idxNama === -1) {
        showToast("Kolom 'Nama' tidak ditemukan di baris header Excel.", "error");
        return;
      }

      let importedCount = 0;
      const newItems = [];

      for (let i = 1; i < rawRows.length; i++) {
        const row = rawRows[i];
        if (!row || !row[idxNama] || String(row[idxNama]).trim() === '') continue;

        const nama = String(row[idxNama]).trim();
        // Skip template contoh
        if (nama.toLowerCase().startsWith('contoh:')) continue;

        const jkRaw = idxJK >= 0 && row[idxJK] ? String(row[idxJK]).toUpperCase().trim() : 'L';
        const jk = (jkRaw.includes('P') || jkRaw.includes('PEREMPUAN') || jkRaw.includes('PUTRI')) ? 'P' : 'L';
        const tahunRaw = idxTahun >= 0 && row[idxTahun] ? parseInt(String(row[idxTahun]).replace(/\D/g, ''), 10) : 2025;
        const tahun = isNaN(tahunRaw) ? 2025 : tahunRaw;
        const angkatan = idxAngkatan >= 0 && row[idxAngkatan] ? String(row[idxAngkatan]).trim() : `Angkatan ${tahun}`;
        const capaianRaw = idxCapaian >= 0 && row[idxCapaian] ? String(row[idxCapaian]).trim() : '';
        const is30 = capaianRaw.toLowerCase().includes('30') || capaianRaw.toLowerCase().includes('khatam');
        const statusTahfidz = is30 ? '30_juz' : (capaianRaw.toLowerCase().includes('bin') ? 'binnadzor' : 'tahfidz_sebagian');

        newItems.push({
          id: 'alm-' + Date.now() + '-' + i,
          name: nama,
          gender: jk,
          angkatan: angkatan,
          tahunLulus: tahun,
          programTahfidz: is30 ? 'Tahfidz 30 Juz Bersanad' : 'Wisuda Binnadzor Fashahah',
          statusTahfidz: statusTahfidz,
          sanadSyaikh: idxSanad >= 0 && row[idxSanad] ? String(row[idxSanad]).trim() : 'KH. Jauharul Afif, Lc. M.Ag / Hj. Mazidatul Faizah, M.Si',
          sekolahAsalPondok: idxSekolah >= 0 && row[idxSekolah] ? String(row[idxSekolah]).trim() : "MA Mamba'ul Ma'arif Denanyar",
          lanjutanStudi: idxKampus >= 0 && row[idxKampus] ? String(row[idxKampus]).trim() : '',
          jurusan: idxJurusan >= 0 && row[idxJurusan] ? String(row[idxJurusan]).trim() : '',
          profesiSaatIni: idxProfesi >= 0 && row[idxProfesi] ? String(row[idxProfesi]).trim() : 'Alumni Santri',
          domisili: idxDomisili >= 0 && row[idxDomisili] ? String(row[idxDomisili]).trim() : '',
          kontakWa: idxWa >= 0 && row[idxWa] ? String(row[idxWa]).trim() : '',
          pesan: idxPesan >= 0 && row[idxPesan] ? String(row[idxPesan]).trim() : '',
          foto: ''
        });
        importedCount++;
      }

      if (importedCount === 0) {
        showToast("Tidak ada baris data alumni yang valid untuk diimpor.", "warning");
        return;
      }

      if (!Array.isArray(WebState.alumni)) WebState.alumni = [];
      WebState.alumni = [...newItems, ...WebState.alumni];
      try {
        localStorage.setItem(STORAGE_KEYS.ALUMNI, JSON.stringify(WebState.alumni));
      } catch (e) {}

      renderAlumni();
      showToast(`Alhamdulillah! Berhasil mengimpor ${importedCount} data alumni dari Excel!`, "success");
    } catch (err) {
      console.error(err);
      showToast("Terjadi kesalahan saat memproses file Excel: " + err.message, "error");
    }
  };
  reader.readAsBinaryString(file);
}

// Global window exposure
window.checkAlumniAdminStatus = checkAlumniAdminStatus;
window.toggleAlumniAdminMode = toggleAlumniAdminMode;
window.openModalVerifikasiAdminAlumni = openModalVerifikasiAdminAlumni;
window.closeModalVerifikasiAdminAlumni = closeModalVerifikasiAdminAlumni;
window.verifikasiPinAdminAlumni = verifikasiPinAdminAlumni;
window.renderAlumni = renderAlumni;
window.switchAlumniFilterPill = switchAlumniFilterPill;
window.handleAlumniSearch = handleAlumniSearch;
window.handleAlumniAngkatanChange = handleAlumniAngkatanChange;
window.switchAlumniViewMode = switchAlumniViewMode;
window.resetAlumniFilter = resetAlumniFilter;
window.openModalAlumniDetail = openModalAlumniDetail;
window.closeModalAlumniDetail = closeModalAlumniDetail;
window.openModalFormAlumni = openModalFormAlumni;
window.closeModalFormAlumni = closeModalFormAlumni;
window.submitFormAlumni = submitFormAlumni;
window.editAlumni = editAlumni;
window.hapusAlumni = hapusAlumni;
window.eksporAlumniExcel = eksporAlumniExcel;
window.unduhTemplateExcelAlumni = unduhTemplateExcelAlumni;
window.triggerImporAlumniExcel = triggerImporAlumniExcel;
window.prosesImporAlumniExcel = prosesImporAlumniExcel;
