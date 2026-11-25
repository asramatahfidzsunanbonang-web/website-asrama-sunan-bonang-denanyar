// ========================================================
// SiTahfidz - Sistem Presensi & Hasil Setoran Hafalan Santri
// Controller & Logic (Vanilla JS, Zero Dependency)
// ========================================================

const STORAGE_KEYS = {
  SETTINGS: 'sitahfidz_settings',
  SANTRI: 'sitahfidz_santri',
  SETORAN: 'sitahfidz_setoran',
  ABSENSI: 'sitahfidz_absensi',
  USTADZ: 'sitahfidz_ustadz',
  ABSENSI_USTADZ: 'sitahfidz_absensi_ustadz',
  UJIAN_SEMESTER: 'sitahfidz_ujian_semester',
  PELANGGARAN: 'sitahfidz_pelanggaran',
  PERIZINAN: 'sitahfidz_perizinan',
  UBUDIYAH_JAMAAH: 'sitahfidz_ubudiyah_jamaah',
  UBUDIYAH_EKSKUL: 'sitahfidz_ubudiyah_ekskul'
};

// Global in-memory state
let AppState = {
  settings: {},
  santri: [],
  setoran: [],
  absensi: [],
  ustadz: [],
  absensiUstadz: [],
  ujianSemester: [],
  pelanggaran: [],
  perizinan: [],
  ubudiyahJamaah: [],
  ubudiyahEkskul: [],
  currentTab: 'dashboard',
  currentNavCategory: 'all',
  selectedAbsensiUstadz: '',
  selectedSetoranUstadz: '',
  selectedMutabaahSantriId: null,
  activeFilterJuz: null
};

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  checkPinProtection();
  initHeader();
  initFormDropdowns();
  renderAll();
  autoSelectInitialSesi();
});

function initStorage() {
  // Settings: merge default with saved
  const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  AppState.settings = { ...DEFAULT_SETTINGS, ...(savedSettings ? JSON.parse(savedSettings) : {}) };
  if (!AppState.settings.daftarHalaqahPascaTahfidz || AppState.settings.daftarHalaqahPascaTahfidz.length === 0) {
    AppState.settings.daftarHalaqahPascaTahfidz = [ ...DEFAULT_SETTINGS.daftarHalaqahPascaTahfidz ];
  }
  if (!AppState.settings.daftarKelasBinnadzor || AppState.settings.daftarKelasBinnadzor.length === 0) {
    AppState.settings.daftarKelasBinnadzor = [ ...DEFAULT_SETTINGS.daftarKelasBinnadzor ];
  }
  if (!AppState.settings.daftarHalaqahTahfidz || AppState.settings.daftarHalaqahTahfidz.length === 0) {
    AppState.settings.daftarHalaqahTahfidz = [ ...DEFAULT_SETTINGS.daftarHalaqahTahfidz ];
  }
  if (!AppState.settings.medsos) {
    AppState.settings.medsos = { ...(DEFAULT_SETTINGS.medsos || {}) };
  }
  if (!AppState.settings.accessPin) {
    AppState.settings.accessPin = DEFAULT_SETTINGS.accessPin || '123456';
  }
  if (!AppState.settings.pendidikanPin) {
    AppState.settings.pendidikanPin = DEFAULT_SETTINGS.pendidikanPin || '111111';
  }
  if (!AppState.settings.keamananPin) {
    AppState.settings.keamananPin = DEFAULT_SETTINGS.keamananPin || '222222';
  }
  if (!AppState.settings.ubudiyahPin) {
    AppState.settings.ubudiyahPin = DEFAULT_SETTINGS.ubudiyahPin || '333333';
  }
  if (!AppState.settings.ustadzPin) {
    AppState.settings.ustadzPin = DEFAULT_SETTINGS.ustadzPin || '888888';
  }
  const defaultAccounts = (typeof DEFAULT_SETTINGS !== 'undefined' && DEFAULT_SETTINGS.pengurusAccounts) ? DEFAULT_SETTINGS.pengurusAccounts : [];
  if (!AppState.settings.pengurusAccounts || !AppState.settings.pengurusAccounts.length) {
    AppState.settings.pengurusAccounts = JSON.parse(JSON.stringify(defaultAccounts));
  } else {
    // Sinkronkan akun default jika ada yang belum terdaftar (misal update ke 20 akun)
    defaultAccounts.forEach(defAcc => {
      const exists = AppState.settings.pengurusAccounts.some(a => a.email.toLowerCase() === defAcc.email.toLowerCase());
      if (!exists) {
        AppState.settings.pengurusAccounts.push(JSON.parse(JSON.stringify(defAcc)));
      }
    });
  }
  if (!AppState.settings.hariAktifSetoran) {
    AppState.settings.hariAktifSetoran = [...(DEFAULT_SETTINGS.hariAktifSetoran || ["Sabtu", "Ahad", "Senin", "Selasa", "Rabu"])];
  }
  if (!AppState.settings.hariLiburRutin) {
    AppState.settings.hariLiburRutin = [...(DEFAULT_SETTINGS.hariLiburRutin || ["Kamis", "Jumat"])];
  }
  if (!AppState.settings.daftarHariLiburKondisional) {
    AppState.settings.daftarHariLiburKondisional = [...(DEFAULT_SETTINGS.daftarHariLiburKondisional || [])];
  }
  if (!AppState.settings.backgroundType) {
    AppState.settings.backgroundType = DEFAULT_SETTINGS.backgroundType || 'preset_mosque';
  }
  if (typeof AppState.settings.backgroundOpacity !== 'number') {
    AppState.settings.backgroundOpacity = (typeof DEFAULT_SETTINGS.backgroundOpacity === 'number') ? DEFAULT_SETTINGS.backgroundOpacity : 0.12;
  }
  if (!AppState.settings.backgroundMode) {
    AppState.settings.backgroundMode = DEFAULT_SETTINGS.backgroundMode || 'cover';
  }
  if (!AppState.settings.customBackground) {
    AppState.settings.customBackground = DEFAULT_SETTINGS.customBackground || '';
  }
  // Pastikan daftarHalaqah gabungan selalu sinkron dengan 3 kelompok utama Pengaturan
  AppState.settings.daftarHalaqah = [
    ...(AppState.settings.daftarKelasBinnadzor || []),
    ...(AppState.settings.daftarHalaqahTahfidz || []),
    ...(AppState.settings.daftarHalaqahPascaTahfidz || [])
  ];

  if (typeof applyAppBackground === 'function') {
    applyAppBackground(AppState.settings);
  }

  // Santri: muat dari storage lokal dan bersihkan ID santri contoh dummy serta yang sudah dihapus
  const isDummySantriId = id => typeof id === 'string' && (id.startsWith('STR-BNZ-') || id.startsWith('STR-TFZ-') || id.startsWith('STR-PST-'));
  const isDummySetoranId = id => typeof id === 'string' && id.startsWith('SET-10');
  const isDummyAbsensiId = id => typeof id === 'string' && id.startsWith('ABS-20');
  const isDummyUjianId = id => typeof id === 'string' && (id.startsWith('UJI-BNZ-') || id.startsWith('UJI-TFZ-'));
  const isDummyPelanggaranId = id => typeof id === 'string' && id.startsWith('PLG-00');
  const isDummyPerizinanId = id => typeof id === 'string' && id.startsWith('IZN-2024-');
  const isDummyJamaahId = id => typeof id === 'string' && id.startsWith('UBD-00');
  const isDummyEkskulId = id => typeof id === 'string' && id.startsWith('EKS-00');

  const savedSantri = localStorage.getItem(STORAGE_KEYS.SANTRI);
  const deletedSantriIds = (typeof getDeletedSantriIds === 'function') ? getDeletedSantriIds() : [];
  if (savedSantri !== null) {
    try {
      AppState.santri = JSON.parse(savedSantri).filter(s => s && s.id && !deletedSantriIds.includes(s.id) && !isDummySantriId(s.id));
    } catch (e) {
      AppState.santri = [];
    }
  } else {
    AppState.santri = (SAMPLE_SANTRI || []).filter(s => !deletedSantriIds.includes(s.id) && !isDummySantriId(s.id));
    localStorage.setItem(STORAGE_KEYS.SANTRI, JSON.stringify(AppState.santri));
  }

  // Auto-clean orphan halaqah: jika halaqah santri sudah dihapus dari Pengaturan Pondok, bersihkan halaqah santri tersebut
  const validHalaqahOnLoad = new Set((AppState.settings.daftarHalaqah || []).map(h => (h || '').trim().toLowerCase()));
  if (validHalaqahOnLoad.size > 0) {
    let santriCleaned = false;
    AppState.santri.forEach(s => {
      if (s.halaqah && !validHalaqahOnLoad.has(s.halaqah.trim().toLowerCase())) {
        s.halaqah = '';
        santriCleaned = true;
      }
    });
    if (santriCleaned) {
      localStorage.setItem(STORAGE_KEYS.SANTRI, JSON.stringify(AppState.santri));
    }
  }

  // Auto-migration: pastikan setiap santri memiliki data kelasSekolah
  AppState.santri.forEach(s => {
    if (s.kelasSekolah === undefined) {
      s.kelasSekolah = '';
    }
  });

  // Setoran
  const savedSetoran = localStorage.getItem(STORAGE_KEYS.SETORAN);
  AppState.setoran = (savedSetoran ? JSON.parse(savedSetoran) : []).filter(s => s && s.id && !isDummySetoranId(s.id) && !isDummySantriId(s.santriId));

  // Absensi Santri
  const savedAbsensi = localStorage.getItem(STORAGE_KEYS.ABSENSI);
  AppState.absensi = (savedAbsensi ? JSON.parse(savedAbsensi) : []).filter(a => a && a.id && !isDummyAbsensiId(a.id) && !isDummySantriId(a.santriId));

  // Data Asatidz
  const savedUstadz = localStorage.getItem(STORAGE_KEYS.USTADZ);
  AppState.ustadz = savedUstadz ? JSON.parse(savedUstadz) : [ ...SAMPLE_USTADZ ];

  // Absensi Asatidz (Guru Tahfidz)
  const savedAbsensiUstadz = localStorage.getItem(STORAGE_KEYS.ABSENSI_USTADZ);
  AppState.absensiUstadz = savedAbsensiUstadz ? JSON.parse(savedAbsensiUstadz) : [ ...SAMPLE_ABSENSI_USTADZ ];

  // Ujian Semester & Evaluasi Perombakan Kelas
  const savedUjianSemester = localStorage.getItem(STORAGE_KEYS.UJIAN_SEMESTER);
  AppState.ujianSemester = (savedUjianSemester ? JSON.parse(savedUjianSemester) : []).filter(u => u && u.id && !isDummyUjianId(u.id) && !isDummySantriId(u.santriId));

  // Divisi Keamanan: Pelanggaran & Perizinan
  const savedPelanggaran = localStorage.getItem(STORAGE_KEYS.PELANGGARAN);
  AppState.pelanggaran = (savedPelanggaran ? JSON.parse(savedPelanggaran) : []).filter(p => p && p.id && !isDummyPelanggaranId(p.id) && !isDummySantriId(p.santriId));

  const savedPerizinan = localStorage.getItem(STORAGE_KEYS.PERIZINAN);
  AppState.perizinan = (savedPerizinan ? JSON.parse(savedPerizinan) : []).filter(p => p && p.id && !isDummyPerizinanId(p.id) && !isDummySantriId(p.santriId));

  // Divisi Ubudiyah: Shalat Jamaah & Ekskul
  const savedJamaah = localStorage.getItem(STORAGE_KEYS.UBUDIYAH_JAMAAH);
  AppState.ubudiyahJamaah = (savedJamaah ? JSON.parse(savedJamaah) : []).filter(u => u && u.id && !isDummyJamaahId(u.id) && !isDummySantriId(u.santriId));

  const savedEkskul = localStorage.getItem(STORAGE_KEYS.UBUDIYAH_EKSKUL);
  AppState.ubudiyahEkskul = (savedEkskul ? JSON.parse(savedEkskul) : []).filter(u => u && u.id && !isDummyEkskulId(u.id) && !isDummySantriId(u.santriId));

  saveToStorage();

  // Auto-heal logo pondok jika memiliki latar belakang hitam sisa ekspor JPEG lama
  if (AppState.settings.logoPondok && typeof cleanBlackBackgroundFromLogo === 'function') {
    cleanBlackBackgroundFromLogo(AppState.settings.logoPondok, function(cleaned) {
      if (cleaned && cleaned !== AppState.settings.logoPondok) {
        AppState.settings.logoPondok = cleaned;
        saveToStorage();
        if (typeof renderHeaderLogo === 'function') renderHeaderLogo();
        if (typeof renderPengaturanLogoPreview === 'function') renderPengaturanLogoPreview();
      }
    });
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(AppState.settings));
  localStorage.setItem(STORAGE_KEYS.SANTRI, JSON.stringify(AppState.santri));
  localStorage.setItem(STORAGE_KEYS.SETORAN, JSON.stringify(AppState.setoran));
  localStorage.setItem(STORAGE_KEYS.ABSENSI, JSON.stringify(AppState.absensi));
  localStorage.setItem(STORAGE_KEYS.USTADZ, JSON.stringify(AppState.ustadz));
  localStorage.setItem(STORAGE_KEYS.ABSENSI_USTADZ, JSON.stringify(AppState.absensiUstadz));
  localStorage.setItem(STORAGE_KEYS.UJIAN_SEMESTER, JSON.stringify(AppState.ujianSemester));
  localStorage.setItem(STORAGE_KEYS.PELANGGARAN, JSON.stringify(AppState.pelanggaran));
  localStorage.setItem(STORAGE_KEYS.PERIZINAN, JSON.stringify(AppState.perizinan));
  localStorage.setItem(STORAGE_KEYS.UBUDIYAH_JAMAAH, JSON.stringify(AppState.ubudiyahJamaah));
  localStorage.setItem(STORAGE_KEYS.UBUDIYAH_EKSKUL, JSON.stringify(AppState.ubudiyahEkskul));

  if (typeof pushLocalToCloud === 'function') {
    pushLocalToCloud();
  }
}

function initHeader() {
  // Pondok Name & Desc
  const nameEl = document.getElementById('headerPondokName');
  if (nameEl) nameEl.textContent = AppState.settings.namaPondok || DEFAULT_SETTINGS.namaPondok;

  // Logo
  renderHeaderLogo();

  // Current Date (Indonesian format)
  const dateEl = document.getElementById('headerCurrentDate');
  if (dateEl) {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('id-ID', options);
  }

  // Active Session in Header
  updateActiveSessionIndicator();
}

function renderHeaderLogo() {
  const wrap = document.getElementById('headerLogoWrap');
  if (!wrap) return;

  if (AppState.settings.logoPondok) {
    wrap.innerHTML = `<img src="${AppState.settings.logoPondok}" alt="Logo" class="pondok-logo-img" style="object-fit:contain; background:transparent;">`;
  } else {
    wrap.innerHTML = `<span class="pondok-logo-placeholder">🕌</span>`;
  }
}

function updateActiveSessionIndicator() {
  const hour = new Date().getHours();
  let sesi = "Shubuh";
  if (hour >= 11 && hour < 15) {
    sesi = "Siang / Dzuhur";
  } else if (hour >= 15 && hour < 18) {
    sesi = "Ashar";
  } else if (hour >= 18 || hour < 4) {
    sesi = "Maghrib / Isya";
  }
  const el = document.getElementById('headerActiveSession');
  if (el) el.textContent = sesi;
}

function autoSelectInitialSesi() {
  const absensiTanggal = document.getElementById('absensiTanggal');
  if (absensiTanggal) {
    absensiTanggal.value = new Date().toISOString().split('T')[0];
  }

  const hour = new Date().getHours();
  let defaultSesiIndex = 0; // Shubuh
  if (hour >= 15 && hour < 18) defaultSesiIndex = 1; // Ashar
  if (hour >= 18 || hour < 4) defaultSesiIndex = 2; // Maghrib/Isya

  const absensiSesi = document.getElementById('absensiSesi');
  if (absensiSesi && absensiSesi.options && absensiSesi.options.length > defaultSesiIndex) {
    absensiSesi.selectedIndex = defaultSesiIndex;
  }

  const absensiUstadzTanggal = document.getElementById('absensiUstadzTanggal');
  if (absensiUstadzTanggal) {
    absensiUstadzTanggal.value = new Date().toISOString().split('T')[0];
  }

  const absensiUstadzSesi = document.getElementById('absensiUstadzSesi');
  if (absensiUstadzSesi && absensiUstadzSesi.options && absensiUstadzSesi.options.length > defaultSesiIndex) {
    absensiUstadzSesi.selectedIndex = defaultSesiIndex;
  }
}

// ================= TAB NAVIGATION =================
function switchTab(tabId) {
  const role = sessionStorage.getItem('sitahfidz_active_role') || 'ADMIN';
  const ROLE_PERMISSIONS = {
    ADMIN: ['dashboard', 'santri', 'absensi', 'setoran', 'absensi-ustadz', 'ujian', 'wisuda', 'mutabaah', 'laporan', 'keamanan-pelanggaran', 'keamanan-perizinan', 'keamanan-rekap', 'ubudiyah-jamaah', 'ubudiyah-ekskul', 'ubudiyah-rekap', 'pengaturan', 'website'],
    PENDIDIKAN: ['dashboard', 'santri', 'absensi', 'setoran', 'absensi-ustadz', 'ujian', 'wisuda', 'mutabaah', 'laporan'],
    KEAMANAN: ['keamanan-pelanggaran', 'keamanan-perizinan', 'keamanan-rekap'],
    UBUDIYAH: ['ubudiyah-jamaah', 'ubudiyah-ekskul', 'ubudiyah-rekap']
  };

  const allowed = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.ADMIN;
  if (!allowed.includes(tabId)) {
    const roleNames = {
      ADMIN: 'Administrator Utama',
      PENDIDIKAN: 'Pengurus Pendidikan',
      KEAMANAN: 'Pengurus Keamanan',
      UBUDIYAH: 'Pengurus Ubudiyah'
    };
    showToast(`⚠️ Akses Dibatasi: Peran ${roleNames[role] || role} tidak memiliki izin untuk membuka fitur ini.`, "warning");
    return;
  }

  AppState.currentTab = tabId;

  // Update nav buttons
  const buttons = document.querySelectorAll('.nav-tab-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('onclick')?.includes(`'${tabId}'`)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update tab panes
  const panes = document.querySelectorAll('.tab-pane');
  panes.forEach(pane => {
    pane.classList.remove('active');
  });

  const activePane = document.getElementById(`pane-${tabId}`);
  if (activePane) {
    activePane.classList.add('active');
  }

  // Trigger tab-specific renders
  if (tabId === 'dashboard') renderDashboard();
  if (tabId === 'absensi') {
    renderAbsensiUstadzChips();
    renderPresensiTable();
  }
  if (tabId === 'setoran') {
    renderSetoranUstadzChips();
    renderSetoranTable();
  }
  if (tabId === 'absensi-ustadz') {
    renderAbsensiUstadzTable();
    renderRekapBulananUstadz();
  }
  if (tabId === 'santri') renderSantriTable();
  if (tabId === 'ujian') {
    renderUjianBinnadzorTable();
    renderUjianTahfidzTable();
  }
  if (tabId === 'wisuda') renderWisudaTables();
  if (tabId === 'mutabaah') renderMutabaahTab();
  if (tabId === 'laporan') renderRekapBulanan();
  if (tabId === 'keamanan-pelanggaran') renderPelanggaranTable();
  if (tabId === 'keamanan-perizinan') renderPerizinanTable();
  if (tabId === 'keamanan-rekap') renderRekapKeamanan();
  if (tabId === 'ubudiyah-jamaah') renderJamaahTable();
  if (tabId === 'ubudiyah-ekskul') renderEkskulTable();
  if (tabId === 'ubudiyah-rekap') renderRekapUbudiyah();
  if (tabId === 'pengaturan') renderPengaturanTab();
  if (tabId === 'website') renderWebManager();

  updateNavPills();
}

function filterNavCategory(cat, btn) {
  AppState.currentNavCategory = cat;
  const pills = document.querySelectorAll('.nav-module-pill');
  pills.forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const items = document.querySelectorAll('.nav-tab-btn, .nav-category-header');
  items.forEach(el => {
    const itemCat = el.dataset.category;
    if (cat === 'all') {
      el.style.display = '';
    } else {
      if (itemCat === cat || itemCat === 'all') {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    }
  });
}

function updateNavPills() {
  // Total santri
  const pillSantri = document.getElementById('pillTotalSantri');
  if (pillSantri) pillSantri.textContent = AppState.santri.length;

  // Total setoran
  const pillSetoran = document.getElementById('pillTotalSetoran');
  if (pillSetoran) pillSetoran.textContent = AppState.setoran.length;

  // Absensi Santri Hari Ini
  const todayStr = new Date().toISOString().split('T')[0];
  const absensiHariIniCount = AppState.absensi.filter(a => a.tanggal === todayStr).length;
  const pillAbsensi = document.getElementById('pillAbsensiHariIni');
  if (pillAbsensi) pillAbsensi.textContent = absensiHariIniCount;

  // Absensi Asatidz Hari Ini
  const absensiUstadzHariIniCount = (AppState.absensiUstadz || []).filter(a => a.tanggal === todayStr && a.status === 'Hadir').length;
  const pillAbsensiUstadz = document.getElementById('pillAbsensiUstadzHariIni');
  if (pillAbsensiUstadz) pillAbsensiUstadz.textContent = `${absensiUstadzHariIniCount} Hadir`;

  // Nilai Ujian Semester
  const pillUjian = document.getElementById('pillUjianSemester');
  if (pillUjian) {
    const totalUjian = (AppState.ujianSemester || []).length;
    pillUjian.textContent = `${totalUjian} Nilai`;
  }

  // Pelanggaran Keamanan
  const pillPlg = document.getElementById('pillTotalPelanggaran');
  if (pillPlg) pillPlg.textContent = (AppState.pelanggaran || []).length;

  // Santri Izin Pulang
  const pillIzin = document.getElementById('pillSantriIzinPulang');
  if (pillIzin) {
    const diLuarCount = (AppState.perizinan || []).filter(p => p.status === 'Sedang di Luar').length;
    pillIzin.textContent = `${diLuarCount} Izin`;
  }

  // Santri Binnadzor Siap Wisuda
  const siapWisudaCount = AppState.santri.filter(s => 
    s.program === 'Binnadzor' && 
    (s.binnadzorProgress?.statusWisuda === 'Siap Wisuda' || 
     (s.binnadzorProgress?.hafalanJuz30 >= 100 && s.binnadzorProgress?.hafalanJuz29 >= 100 && s.binnadzorProgress?.hafalanJuz28 >= 100))
  ).length;

  const pillSiap = document.getElementById('pillSiapWisuda');
  if (pillSiap) {
    pillSiap.textContent = `${siapWisudaCount} Siap`;
    pillSiap.style.display = siapWisudaCount > 0 ? 'inline-block' : 'none';
  }
}

// ================= RENDER ALL =================
function renderAll() {
  renderDashboard();
  renderAbsensiUstadzChips();
  renderPresensiTable();
  renderSetoranUstadzChips();
  renderSetoranTable();
  renderAbsensiUstadzTable();
  renderRekapBulananUstadz();
  renderSantriTable();
  renderUjianBinnadzorTable();
  renderUjianTahfidzTable();
  renderPelanggaranTable();
  renderPerizinanTable();
  renderRekapKeamanan();
  renderJamaahTable();
  renderEkskulTable();
  renderRekapUbudiyah();
  renderWisudaTables();
  renderMutabaahTab();
  updateNavPills();
  initInteractiveCardClicks();
}

function initInteractiveCardClicks() {
  const selectors = '.stat-card, .dashboard-card, .summary-card, .feature-card, .widget-card, .quick-stat-card';
  document.querySelectorAll(selectors).forEach(card => {
    if (card.dataset.hasClickBounce) return;
    card.dataset.hasClickBounce = 'true';
    card.addEventListener('click', (e) => {
      if (e.target.closest('input, textarea, select, a, button, [onclick]')) return;
      card.classList.remove('widget-click-active');
      void card.offsetWidth;
      card.classList.add('widget-click-active');
      setTimeout(() => card.classList.remove('widget-click-active'), 450);
    });
  });
}

// ================= ANIMASI INTERAKTIF & COUNTER ANGKA =================
function animateCounter(el, target, duration = 750, suffix = '') {
  if (!el) return;
  const targetNum = parseFloat(target);
  if (isNaN(targetNum)) {
    el.textContent = target + suffix;
    return;
  }
  const isDecimal = String(target).includes('.');
  const start = 0;
  const startTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();

  function update(currentTime) {
    const now = currentTime || ((typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now());
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Smooth easeOutCubic curve
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = start + (targetNum - start) * ease;

    el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;

    if (progress < 1) {
      if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(update);
      } else {
        el.textContent = (isDecimal ? targetNum.toFixed(1) : targetNum) + suffix;
      }
    } else {
      el.textContent = (isDecimal ? targetNum.toFixed(1) : targetNum) + suffix;
    }
  }

  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(update);
  } else {
    el.textContent = (isDecimal ? targetNum.toFixed(1) : targetNum) + suffix;
  }
}

// ================= 1. DASHBOARD =================
function renderDashboard() {
  const totalSantri = AppState.santri.length;
  const binnadzorSantri = AppState.santri.filter(s => s.program === 'Binnadzor' || s.program === 'Program Maqbul');
  const tahfidzSantri = AppState.santri.filter(s => s.program === 'Tahfidz');
  const pascaSantri = AppState.santri.filter(s => s.program === 'Pasca Tahfidz');

  animateCounter(document.getElementById('dashTotalSantri'), totalSantri);
  animateCounter(document.getElementById('dashTotalBinnadzor'), binnadzorSantri.length);
  animateCounter(document.getElementById('dashTotalTahfidz'), tahfidzSantri.length);
  const elPasca = document.getElementById('dashTotalPascaTahfidz');
  if (elPasca) animateCounter(elPasca, pascaSantri.length);

  // Setoran hari ini
  const todayStr = new Date().toISOString().split('T')[0];
  const setoranToday = AppState.setoran.filter(s => s.tanggal === todayStr);
  animateCounter(document.getElementById('dashSetoranHariIni'), setoranToday.length);

  // Kehadiran hari ini
  const absensiToday = AppState.absensi.filter(a => a.tanggal === todayStr);
  const hadirSetorCount = absensiToday.filter(a => a.status === 'Hadir (Setor)').length;
  const pct = totalSantri > 0 ? Math.round((hadirSetorCount / totalSantri) * 100) : 0;
  document.getElementById('dashKehadiranDesc').textContent = `Kehadiran Setor: ${pct}% (${hadirSetorCount}/${totalSantri})`;

  // Program Distribution Bars
  const bnzPct = totalSantri > 0 ? Math.round((binnadzorSantri.length / totalSantri) * 100) : 0;
  const thfPct = totalSantri > 0 ? Math.round((tahfidzSantri.length / totalSantri) * 100) : 0;
  const pstPct = Math.max(0, 100 - bnzPct - thfPct);

  const bnzBar = document.getElementById('dashBinnadzorBar');
  const thfBar = document.getElementById('dashTahfidzBar');
  const pstBar = document.getElementById('dashPascaTahfidzBar');

  if (bnzBar) bnzBar.style.width = `${bnzPct}%`;
  if (thfBar) thfBar.style.width = `${thfPct}%`;
  if (pstBar) pstBar.style.width = `${pstPct}%`;

  const elBnzPct = document.getElementById('dashBinnadzorPct');
  if (elBnzPct) elBnzPct.textContent = `${bnzPct}% (${binnadzorSantri.length} Santri)`;
  const elThfPct = document.getElementById('dashTahfidzPct');
  if (elThfPct) elThfPct.textContent = `${thfPct}% (${tahfidzSantri.length} Santri)`;
  const elPstPct = document.getElementById('dashPascaTahfidzPct');
  if (elPstPct) elPstPct.textContent = `${pstPct}% (${pascaSantri.length} Santri)`;

  // Ready for Wisuda Banner
  const siapWisuda = binnadzorSantri.filter(s => 
    s.binnadzorProgress?.statusWisuda === 'Siap Wisuda' || 
    (s.binnadzorProgress?.hafalanJuz30 >= 100 && s.binnadzorProgress?.hafalanJuz29 >= 100 && s.binnadzorProgress?.hafalanJuz28 >= 100)
  );

  const banner = document.getElementById('bannerSiapWisuda');
  if (siapWisuda.length > 0) {
    banner.style.display = 'block';
    const names = siapWisuda.map(s => s.nama).slice(0, 3).join(', ');
    const extra = siapWisuda.length > 3 ? ` dan ${siapWisuda.length - 3} lainnya` : '';
    document.getElementById('bannerSiapWisudaText').innerHTML = 
      `Alhamdulillah! <strong>${siapWisuda.length} santri</strong> Binnadzor (${names}${extra}) telah menyelesaikan hafalan Juz 28, 29, 30 dan tuntas bacaan. Siap untuk disidang dan diwisuda naik ke Program Tahfidz.`;
  } else {
    banner.style.display = 'none';
  }

  // Recent Setoran Table
  const tbody = document.getElementById('dashTableRecentSetoran');
  tbody.innerHTML = '';
  const sortedSetoran = [...AppState.setoran].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)).slice(0, 5);

  if (sortedSetoran.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Belum ada rekaman setoran hafalan.</td></tr>`;
  } else {
    sortedSetoran.forEach(item => {
      const badgeProgram = item.program === 'Binnadzor' 
        ? `<span class="badge badge-binnadzor">Binnadzor</span>` 
        : `<span class="badge badge-tahfidz">Tahfidz</span>`;

      const chipNilai = typeof getNilaiChipHtml === 'function' ? getNilaiChipHtml(item.nilai) : `<span class="badge">${escapeHtml(item.nilai || 'Mumtaz')}</span>`;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <strong style="font-size:13px;">${escapeHtml(item.santriNama)}</strong>
          ${(() => {
            const sObj = AppState.santri.find(s => s.id === item.santriId);
            return (sObj && sObj.kelasSekolah) ? `<div style="font-size:11px; color:#0284c7; font-weight:600; margin-top:2px;">🏫 Kelas ${escapeHtml(sObj.kelasSekolah)}</div>` : '';
          })()}
        </td>
        <td>${badgeProgram}</td>
        <td><span style="font-size:12px; font-weight:500;">${escapeHtml(item.jenisSetoran)}</span></td>
        <td>Juz ${item.juz} • QS. ${escapeHtml(item.suratNama || '-')} : ${item.ayatAwal || 1}-${item.ayatAkhir || 1}</td>
        <td>${chipNilai}</td>
        <td style="font-size:11.5px; color:var(--dark-500);">${formatTanggalIndo(item.tanggal)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Inisialisasi Widget Foto Slider Interaktif (Sorotan Pesantren)
  const showcaseContainer = document.getElementById('adminPhotoShowcaseContainer');
  if (showcaseContainer && (!showcaseContainer.dataset.initialized || showcaseContainer.innerHTML.trim() === '')) {
    showcaseContainer.dataset.initialized = 'true';
    const photos = typeof getGalleryPhotos === 'function' ? getGalleryPhotos() : (typeof DEFAULT_GALLERY_PHOTOS !== 'undefined' ? DEFAULT_GALLERY_PHOTOS : []);
    if (typeof createInteractivePhotoSlider === 'function' && photos.length > 0) {
      createInteractivePhotoSlider({
        containerId: 'adminPhotoShowcaseContainer',
        photos: photos,
        autoPlay: true,
        autoPlayDelay: 4800,
        height: 360
      });
    }
  }
}

// ================= 2. PRESENSI HARIAN =================
function getDaftarUstadzHalaqah() {
  // Hanya ambil halaqah resmi yang masih terdaftar di Pengaturan Pondok
  const rawList = [
    ...(AppState.settings.daftarKelasBinnadzor || []),
    ...(AppState.settings.daftarHalaqahTahfidz || []),
    ...(AppState.settings.daftarHalaqahPascaTahfidz || [])
  ];

  const uniqueOfficial = [];
  const seen = new Set();
  rawList.forEach(item => {
    const trimmed = (item || '').trim();
    if (trimmed && !seen.has(trimmed.toLowerCase())) {
      seen.add(trimmed.toLowerCase());
      uniqueOfficial.push(trimmed);
    }
  });

  const counts = {};
  uniqueOfficial.forEach(name => {
    counts[name.toLowerCase()] = 0;
  });

  (AppState.santri || []).forEach(s => {
    const h = (s.halaqah || '').trim().toLowerCase();
    if (h && counts.hasOwnProperty(h)) {
      counts[h]++;
    }
  });

  return uniqueOfficial.map(name => ({
    name,
    count: counts[name.toLowerCase()] || 0
  }));
}

function renderAbsensiUstadzChips() {
  const container = document.getElementById('absensiUstadzChips');
  const selectFilter = document.getElementById('absensiFilterUstadz');
  const notice = document.getElementById('absensiActiveUstadzNotice');
  const btnSetHadir = document.getElementById('btnSetSemuaHadir');
  if (!container) return;

  const list = getDaftarUstadzHalaqah();
  if (AppState.selectedAbsensiUstadz && !list.some(l => l.name === AppState.selectedAbsensiUstadz)) {
    AppState.selectedAbsensiUstadz = '';
  }
  const totalSantri = AppState.santri.length;
  const current = AppState.selectedAbsensiUstadz || '';

  // 1. Sync dropdown filter #absensiFilterUstadz
  if (selectFilter) {
    let htmlOpts = `<option value="">-- Semua Ustadz / Kelas (${totalSantri} Santri) --</option>`;
    list.forEach(item => {
      const isSel = item.name === current ? 'selected' : '';
      htmlOpts += `<option value="${escapeHtml(item.name)}" ${isSel}>${escapeHtml(item.name)} (${item.count} Santri)</option>`;
    });
    selectFilter.innerHTML = htmlOpts;
  }

  // 2. Active notice & Button label
  if (notice) {
    if (current) {
      const match = list.find(l => l.name === current);
      const count = match ? match.count : 0;
      notice.style.display = 'inline-flex';
      notice.innerHTML = `<span>👳‍♂️ Ustadz Aktif: <strong>${escapeHtml(current)}</strong> (${count} Santri)</span> <button type="button" onclick="pilihAbsensiUstadz('')" style="margin-left:8px; background:none; border:none; color:#047857; text-decoration:underline; cursor:pointer; font-size:11px; font-weight:700;">Reset / Tampilkan Semua</button>`;
    } else {
      notice.style.display = 'none';
      notice.innerHTML = '';
    }
  }

  if (btnSetHadir) {
    if (current) {
      const shortName = current.length > 25 ? current.substring(0, 22) + '...' : current;
      btnSetHadir.textContent = `✓ Set Semua Hadir (${shortName})`;
      btnSetHadir.title = `Atur seluruh santri bimbingan '${current}' menjadi Hadir & Setor`;
    } else {
      btnSetHadir.textContent = `✓ Set Semua Hadir & Setor (Semua)`;
      btnSetHadir.title = `Atur semua santri di pondok menjadi Hadir & Setor`;
    }
  }

  // 3. Render clickable chips
  let chipsHtml = `
    <button type="button" 
      class="ustadz-chip ${!current ? 'active' : ''}" 
      onclick="pilihAbsensiUstadz('')"
      title="Tampilkan semua santri pondok">
      👥 <strong>Semua Santri</strong> <span class="chip-count">${totalSantri}</span>
    </button>
  `;

  // Tampilkan seluruh chip: halaqah yang memiliki santri + seluruh halaqah resmi dari Pengaturan
  const activeChipsList = list;
  activeChipsList.forEach(item => {
    const isActive = item.name === current;
    const isPutri = item.name.toLowerCase().includes('putri') || item.name.toLowerCase().includes('ustdzh');
    const icon = isPutri ? '🧕' : '👳‍♂️';
    chipsHtml += `
      <button type="button" 
        class="ustadz-chip ${isActive ? 'active' : ''}" 
        onclick="pilihAbsensiUstadz('${escapeHtml(item.name)}')"
        title="Klik untuk langsung mengabsen santri bimbingan ${escapeHtml(item.name)}">
        ${icon} <strong>${escapeHtml(item.name)}</strong> <span class="chip-count">${item.count}</span>
      </button>
    `;
  });

  container.innerHTML = chipsHtml;
}

function pilihAbsensiUstadz(halaqah) {
  AppState.selectedAbsensiUstadz = halaqah || '';
  renderAbsensiUstadzChips();
  renderPresensiTable();
}

function getFilteredAbsensiSantri() {
  const progFilter = document.getElementById('absensiFilterProgram')?.value || '';
  const search = document.getElementById('absensiSearch')?.value?.toLowerCase().trim() || '';
  const selectedUstadz = AppState.selectedAbsensiUstadz || '';

  return AppState.santri.filter(s => {
    if (selectedUstadz && s.halaqah !== selectedUstadz) {
      return false;
    }
    if (progFilter && s.program !== progFilter) {
      return false;
    }
    if (search) {
      const matchSearch = s.nama.toLowerCase().includes(search) || 
        s.nis.toLowerCase().includes(search) || 
        (s.halaqah && s.halaqah.toLowerCase().includes(search));
      if (!matchSearch) return false;
    }
    return true;
  });
}

function renderPresensiTable() {
  const tanggalInput = document.getElementById('absensiTanggal');
  const sesiSelect = document.getElementById('absensiSesi');
  if (!tanggalInput || !sesiSelect) return;

  const tanggal = tanggalInput.value || new Date().toISOString().split('T')[0];
  const sesi = sesiSelect.value || (AppState.settings.sesiSetoran && AppState.settings.sesiSetoran[0]) || "Shubuh";

  // Tampilkan banner status hari aktif / libur rutin / libur event santri
  renderStatusHariBanner('statusHariPresensiBanner', tanggal, AppState.settings);

  const filteredSantri = getFilteredAbsensiSantri();
  const tbody = document.getElementById('tableAbsensiBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  let countHadirSetor = 0;
  let countHadirNoSetor = 0;
  let countIzin = 0;
  let countSakit = 0;
  let countAlpa = 0;

  if (filteredSantri.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty-state" style="padding:28px 16px;">
      <div style="font-size:24px; margin-bottom:8px;">🔍</div>
      <div style="font-weight:600; color:#334155;">Tidak ada santri yang sesuai dengan filter atau Ustadz terpilih.</div>
      <div style="font-size:12px; color:#64748b; margin-top:4px;">Klik chip "👥 Semua Santri" di atas untuk melihat seluruh santri pondok.</div>
    </td></tr>`;
    updateAbsensiStats(0, 0, 0, 0, 0);
    updateSelectedAbsensiUI();
    return;
  }

  filteredSantri.forEach((santri, idx) => {
    // Find record in AppState.absensi for this tanggal, sesi, and santri
    const record = AppState.absensi.find(a => 
      a.tanggal === tanggal && 
      a.sesi === sesi && 
      a.santriId === santri.id
    );

    const currentStatus = record ? record.status : 'Alpa';
    const currentKet = record ? (record.keterangan || '') : '';

    if (currentStatus === 'Hadir (Setor)') countHadirSetor++;
    else if (currentStatus === 'Hadir (Tidak Setor)') countHadirNoSetor++;
    else if (currentStatus === 'Izin') countIzin++;
    else if (currentStatus === 'Sakit') countSakit++;
    else countAlpa++;

    let badgeProgram = `<span class="badge badge-tahfidz">Tahfidz</span>`;
    if (santri.program === 'Binnadzor') {
      badgeProgram = `<span class="badge badge-binnadzor">Binnadzor</span>`;
    } else if (santri.program === 'Pasca Tahfidz') {
      badgeProgram = `<span class="badge badge-pasca">Pasca Tahfidz</span>`;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align:center;"><input type="checkbox" class="check-absensi-item" value="${santri.id}" onchange="updateSelectedAbsensiUI()"></td>
      <td>${idx + 1}</td>
      <td>
        <strong>${escapeHtml(santri.nama)}</strong>
        <div style="font-size:11.5px; color:var(--dark-500);">NIS: ${escapeHtml(santri.nis)}</div>
      </td>
      <td>${badgeProgram}</td>
      <td style="font-size:12px; color:var(--dark-600);">${escapeHtml(santri.halaqah || '-')}</td>
      <td>
        <div class="quick-status-group">
          <button type="button" class="btn-status-chip ${currentStatus === 'Hadir (Setor)' ? 'active-hadir' : ''}" 
            onclick="quickSetAbsensi('${santri.id}', 'Hadir (Setor)')" title="Set Hadir & Setor">✓ Hadir</button>
          <button type="button" class="btn-status-chip ${currentStatus === 'Izin' ? 'active-izin' : ''}" 
            onclick="quickSetAbsensi('${santri.id}', 'Izin')" title="Set Izin">✉️ Izin</button>
          <button type="button" class="btn-status-chip ${currentStatus === 'Sakit' ? 'active-sakit' : ''}" 
            onclick="quickSetAbsensi('${santri.id}', 'Sakit')" title="Set Sakit">🏥 Sakit</button>
          <button type="button" class="btn-status-chip ${currentStatus === 'Alpa' ? 'active-alpa' : ''}" 
            onclick="quickSetAbsensi('${santri.id}', 'Alpa')" title="Set Alpa">✕ Alpa</button>
        </div>
        <select class="form-control" style="font-size:12px; padding:3px 6px; font-weight:600; height:28px;" 
          id="selectAbsen_${santri.id}"
          onchange="updateSingleAbsensiStatus('${santri.id}', this.value); renderPresensiTable();">
          <option value="Hadir (Setor)" ${currentStatus === 'Hadir (Setor)' ? 'selected' : ''}>✓ Hadir & Setor</option>
          <option value="Hadir (Tidak Setor)" ${currentStatus === 'Hadir (Tidak Setor)' ? 'selected' : ''}>⚡ Hadir Belum Setor</option>
          <option value="Izin" ${currentStatus === 'Izin' ? 'selected' : ''}>✉️ Izin</option>
          <option value="Sakit" ${currentStatus === 'Sakit' ? 'selected' : ''}>🏥 Sakit</option>
          <option value="Alpa" ${currentStatus === 'Alpa' ? 'selected' : ''}>✕ Alpa / Belum Absen</option>
        </select>
      </td>
      <td>
        <input type="text" class="form-control" style="font-size:12px; padding:5px 8px;" 
          id="ketAbsen_${santri.id}"
          placeholder="Keterangan..." 
          value="${escapeHtml(currentKet)}"
          onchange="updateSingleAbsensiKeterangan('${santri.id}', this.value)">
      </td>
      <td style="text-align:center; white-space:nowrap;">
        <button class="btn btn-outline-primary btn-sm" onclick="quickSetorFromAbsen('${santri.id}')" title="Langsung Catat Hasil Setoran Harian Santri Ini">
          📖 Setor
        </button>
        <button class="btn btn-outline-danger btn-sm" onclick="hapusSingleAbsensi('${santri.id}')" title="Reset / Hapus Presensi Sesi Ini" style="margin-left:4px; padding:4px 8px; color:#ef4444; border-color:#fca5a5;">
          🗑️
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  updateAbsensiStats(countHadirSetor, countHadirNoSetor, countIzin, countSakit, countAlpa);
  updateSelectedAbsensiUI();
}

function quickSetAbsensi(santriId, status) {
  updateSingleAbsensiStatus(santriId, status);
  renderPresensiTable();
}

function updateAbsensiStats(hadirSetor, hadirNoSetor, izin, sakit, alpa) {
  const elHadirSetor = document.getElementById('countHadirSetor');
  const elHadirNoSetor = document.getElementById('countHadirNoSetor');
  const elIzin = document.getElementById('countIzin');
  const elSakit = document.getElementById('countSakit');
  const elAlpa = document.getElementById('countAlpa');

  if (elHadirSetor) elHadirSetor.textContent = `Hadir & Setor: ${hadirSetor}`;
  if (elHadirNoSetor) elHadirNoSetor.textContent = `Hadir Belum Setor: ${hadirNoSetor}`;
  if (elIzin) elIzin.textContent = `Izin: ${izin}`;
  if (elSakit) elSakit.textContent = `Sakit: ${sakit}`;
  if (elAlpa) elAlpa.textContent = `Alpa / Belum Absen: ${alpa}`;
}

function updateSingleAbsensiStatus(santriId, status) {
  const tanggalInput = document.getElementById('absensiTanggal');
  const sesiSelect = document.getElementById('absensiSesi');
  if (!tanggalInput || !sesiSelect) return;

  const tanggal = tanggalInput.value || new Date().toISOString().split('T')[0];
  const sesi = sesiSelect.value || (AppState.settings.sesiSetoran && AppState.settings.sesiSetoran[0]) || "Shubuh";
  const santri = AppState.santri.find(s => s.id === santriId);
  if (!santri) return;

  let record = AppState.absensi.find(a => a.tanggal === tanggal && a.sesi === sesi && a.santriId === santriId);

  if (record) {
    record.status = status;
  } else {
    record = {
      id: "ABS-" + Date.now() + "-" + Math.floor(Math.random() * 100),
      tanggal: tanggal,
      sesi: sesi,
      santriId: santri.id,
      santriNama: santri.nama,
      program: santri.program,
      halaqah: santri.halaqah,
      status: status,
      keterangan: "",
      dicatatOleh: AppState.selectedAbsensiUstadz || AppState.settings.kepalaTahfidz || "Ustadz Pembimbing"
    };
    AppState.absensi.push(record);
  }

  saveToStorage();
  updateNavPills();
}

function updateSingleAbsensiKeterangan(santriId, keterangan) {
  const tanggalInput = document.getElementById('absensiTanggal');
  const sesiSelect = document.getElementById('absensiSesi');
  if (!tanggalInput || !sesiSelect) return;

  const tanggal = tanggalInput.value || new Date().toISOString().split('T')[0];
  const sesi = sesiSelect.value || (AppState.settings.sesiSetoran && AppState.settings.sesiSetoran[0]) || "Shubuh";
  let record = AppState.absensi.find(a => a.tanggal === tanggal && a.sesi === sesi && a.santriId === santriId);
  if (record) {
    record.keterangan = keterangan;
    saveToStorage();
  }
}

function setSemuaAbsen(targetStatus) {
  const tanggalInput = document.getElementById('absensiTanggal');
  const sesiSelect = document.getElementById('absensiSesi');
  if (!tanggalInput || !sesiSelect) return;

  const tanggal = tanggalInput.value || new Date().toISOString().split('T')[0];
  const sesi = sesiSelect.value || (AppState.settings.sesiSetoran && AppState.settings.sesiSetoran[0]) || "Shubuh";
  const targetList = getFilteredAbsensiSantri();

  if (targetList.length === 0) {
    showToast("Tidak ada santri pada filter saat ini.", "warning");
    return;
  }

  targetList.forEach(santri => {
    let record = AppState.absensi.find(a => a.tanggal === tanggal && a.sesi === sesi && a.santriId === santri.id);
    if (record) {
      record.status = targetStatus;
    } else {
      AppState.absensi.push({
        id: "ABS-" + Date.now() + "-" + Math.floor(Math.random() * 10000),
        tanggal: tanggal,
        sesi: sesi,
        santriId: santri.id,
        santriNama: santri.nama,
        program: santri.program,
        halaqah: santri.halaqah,
        status: targetStatus,
        keterangan: "",
        dicatatOleh: AppState.selectedAbsensiUstadz || AppState.settings.kepalaTahfidz || "Ustadz Pembimbing"
      });
    }
  });

  saveToStorage();
  renderPresensiTable();
  const labelGroup = AppState.selectedAbsensiUstadz ? `santri (${AppState.selectedAbsensiUstadz})` : 'semua santri';
  showToast(`Berhasil! ${targetList.length} ${labelGroup} diatur ke '${targetStatus}'`, 'success');
}

function simpanPresensiHarian() {
  saveToStorage();
  renderPresensiTable();
  renderDashboard();
  showToast("Seluruh data presensi sesi ini tersimpan rapi!", "success");
}

function openModalAbsensiHariIni() {
  switchTab('absensi');
  const tanggalInput = document.getElementById('absensiTanggal');
  if (tanggalInput) {
    tanggalInput.value = new Date().toISOString().split('T')[0];
    renderPresensiTable();
  }
}

function quickSetorFromAbsen(santriId) {
  openModalSetoran(santriId);
}

// ================= FITUR MULTI-SELECT & RESET PRESENSI SANTRI =================
function toggleSelectAllAbsensi(checked) {
  document.querySelectorAll('.check-absensi-item').forEach(cb => {
    cb.checked = checked;
  });
  updateSelectedAbsensiUI();
}

function updateSelectedAbsensiUI() {
  const allBoxes = Array.from(document.querySelectorAll('.check-absensi-item'));
  const checkedBoxes = allBoxes.filter(cb => cb.checked);
  const count = checkedBoxes.length;

  const checkAll = document.getElementById('checkAllAbsensi');
  if (checkAll) {
    checkAll.checked = allBoxes.length > 0 && count === allBoxes.length;
    checkAll.indeterminate = count > 0 && count < allBoxes.length;
  }

  const bar = document.getElementById('absensiBulkActionBar');
  if (!bar) return;

  if (count === 0) {
    bar.style.display = 'none';
    bar.innerHTML = '';
    return;
  }

  bar.style.display = 'flex';
  bar.innerHTML = `
    <span class="bulk-count-badge">✓ Terpilih: <strong>${count}</strong> santri</span>
    <button type="button" class="bulk-btn bulk-btn-success" onclick="bulkSetAbsensiStatus('Hadir (Setor)')">✓ Set Hadir & Setor</button>
    <button type="button" class="bulk-btn bulk-btn-primary" onclick="bulkSetAbsensiStatus('Hadir (Tidak Setor)')">⚡ Hadir Belum Setor</button>
    <button type="button" class="bulk-btn bulk-btn-secondary" onclick="bulkSetAbsensiStatus('Izin')">✉️ Set Izin</button>
    <button type="button" class="bulk-btn bulk-btn-secondary" onclick="bulkSetAbsensiStatus('Sakit')">🏥 Set Sakit</button>
    <button type="button" class="bulk-btn bulk-btn-secondary" onclick="bulkSetAbsensiStatus('Alpa')">✕ Set Alpa</button>
    <button type="button" class="bulk-btn bulk-btn-danger" onclick="hapusAbsensiBulk()">🗑️ Reset Presensi</button>
    <button type="button" class="bulk-btn bulk-btn-secondary" onclick="batalPilihAbsensi()">Batal</button>
  `;
}

function batalPilihAbsensi() {
  document.querySelectorAll('.check-absensi-item').forEach(cb => { cb.checked = false; });
  const checkAll = document.getElementById('checkAllAbsensi');
  if (checkAll) { checkAll.checked = false; checkAll.indeterminate = false; }
  updateSelectedAbsensiUI();
}

function bulkSetAbsensiStatus(newStatus) {
  const checkedBoxes = Array.from(document.querySelectorAll('.check-absensi-item:checked'));
  const santriIds = checkedBoxes.map(cb => cb.value);
  if (santriIds.length === 0) return;

  const tanggalInput = document.getElementById('absensiTanggal');
  const sesiSelect = document.getElementById('absensiSesi');
  if (!tanggalInput || !sesiSelect) return;
  const tanggal = tanggalInput.value || new Date().toISOString().split('T')[0];
  const sesi = sesiSelect.value || (AppState.settings.sesiSetoran && AppState.settings.sesiSetoran[0]) || "Shubuh";

  santriIds.forEach(santriId => {
    const santri = AppState.santri.find(s => s.id === santriId);
    if (!santri) return;
    let record = AppState.absensi.find(a => a.tanggal === tanggal && a.sesi === sesi && a.santriId === santriId);
    if (record) {
      record.status = newStatus;
    } else {
      AppState.absensi.push({
        id: "ABS-" + Date.now() + "-" + Math.floor(Math.random() * 10000),
        tanggal: tanggal,
        sesi: sesi,
        santriId: santri.id,
        santriNama: santri.nama,
        program: santri.program,
        halaqah: santri.halaqah,
        status: newStatus,
        keterangan: "",
        dicatatOleh: AppState.selectedAbsensiUstadz || AppState.settings.kepalaTahfidz || "Ustadz Pembimbing"
      });
    }
  });

  saveToStorage();
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
  renderPresensiTable();
  showToast(`${santriIds.length} santri berhasil diubah status menjadi "${newStatus}".`, "success");
}

function hapusAbsensiBulk() {
  const checkedBoxes = Array.from(document.querySelectorAll('.check-absensi-item:checked'));
  const santriIds = checkedBoxes.map(cb => cb.value);
  if (santriIds.length === 0) return;

  const tanggalInput = document.getElementById('absensiTanggal');
  const sesiSelect = document.getElementById('absensiSesi');
  if (!tanggalInput || !sesiSelect) return;
  const tanggal = tanggalInput.value || new Date().toISOString().split('T')[0];
  const sesi = sesiSelect.value || (AppState.settings.sesiSetoran && AppState.settings.sesiSetoran[0]) || "Shubuh";

  if (!confirm(`Hapus / reset catatan presensi ${santriIds.length} santri terpilih pada sesi ini? Catatan akan dikembalikan ke status awal.`)) return;

  AppState.absensi = AppState.absensi.filter(a => !(a.tanggal === tanggal && a.sesi === sesi && santriIds.includes(a.santriId)));
  saveToStorage();
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
  renderPresensiTable();
  showToast(`Presensi ${santriIds.length} santri berhasil di-reset.`, "info");
}

function hapusSingleAbsensi(santriId) {
  const tanggalInput = document.getElementById('absensiTanggal');
  const sesiSelect = document.getElementById('absensiSesi');
  if (!tanggalInput || !sesiSelect) return;
  const tanggal = tanggalInput.value || new Date().toISOString().split('T')[0];
  const sesi = sesiSelect.value || (AppState.settings.sesiSetoran && AppState.settings.sesiSetoran[0]) || "Shubuh";

  const santri = AppState.santri.find(s => s.id === santriId);
  const nama = santri ? santri.nama : 'santri';

  const idx = AppState.absensi.findIndex(a => a.tanggal === tanggal && a.sesi === sesi && a.santriId === santriId);
  if (idx !== -1) {
    AppState.absensi.splice(idx, 1);
    saveToStorage();
    if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
    renderPresensiTable();
    showToast(`Presensi ${nama} pada sesi ${sesi} berhasil di-reset.`, "info");
  } else {
    showToast(`Santri ${nama} belum memiliki catatan presensi tersimpan di sesi ini.`, "warning");
  }
}

function resetPresensiSesiIni() {
  const tanggalInput = document.getElementById('absensiTanggal');
  const sesiSelect = document.getElementById('absensiSesi');
  if (!tanggalInput || !sesiSelect) return;
  const tanggal = tanggalInput.value || new Date().toISOString().split('T')[0];
  const sesi = sesiSelect.value || (AppState.settings.sesiSetoran && AppState.settings.sesiSetoran[0]) || "Shubuh";

  const count = AppState.absensi.filter(a => a.tanggal === tanggal && a.sesi === sesi).length;
  if (count === 0) {
    alert(`Tidak ada rekaman presensi pada tanggal ${formatTanggalIndo(tanggal)} sesi ${sesi}.`);
    return;
  }

  if (!confirm(`Reset seluruh rekaman presensi (${count} data) pada tanggal ${formatTanggalIndo(tanggal)} sesi ${sesi}? Data akan dikembalikan ke status awal (belum absen).`)) return;

  AppState.absensi = AppState.absensi.filter(a => !(a.tanggal === tanggal && a.sesi === sesi));
  saveToStorage();
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
  renderPresensiTable();
  showToast(`Presensi tanggal ${formatTanggalIndo(tanggal)} sesi ${sesi} berhasil di-reset.`, "info");
}

// ================= 2B. PRESENSI KEHADIRAN ASATIDZ (KHUSUS ADMIN) =================
function renderAbsensiUstadzTable() {
  const tanggalInput = document.getElementById('absensiUstadzTanggal');
  const sesiSelect = document.getElementById('absensiUstadzSesi');
  if (!tanggalInput || !sesiSelect) return;

  const tanggal = tanggalInput.value || new Date().toISOString().split('T')[0];
  const sesi = sesiSelect.value || (AppState.settings.sesiSetoran && AppState.settings.sesiSetoran[0]) || "Shubuh";

  // Tampilkan banner status hari aktif / libur ustadz
  renderStatusHariUstadzBanner('statusHariUstadzBanner', tanggal, AppState.settings);

  const peranFilter = document.getElementById('absensiUstadzFilterPeran')?.value || '';
  const search = document.getElementById('absensiUstadzSearch')?.value?.toLowerCase().trim() || '';

  const tbody = document.getElementById('tableAbsensiUstadzBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const ustadzList = AppState.ustadz && AppState.ustadz.length > 0 ? AppState.ustadz : (typeof SAMPLE_USTADZ !== 'undefined' ? SAMPLE_USTADZ : []);

  let filtered = ustadzList.filter(u => {
    if (peranFilter) {
      const matchPeran = (u.peran && u.peran.toLowerCase().includes(peranFilter.toLowerCase())) ||
        (u.tugasHalaqah && u.tugasHalaqah.toLowerCase().includes(peranFilter.toLowerCase())) ||
        (u.halaqah && u.halaqah.toLowerCase().includes(peranFilter.toLowerCase()));
      if (!matchPeran) return false;
    }
    if (search) {
      const matchSearch = (u.nama && u.nama.toLowerCase().includes(search)) ||
        (u.peran && u.peran.toLowerCase().includes(search)) ||
        (u.tugasHalaqah && u.tugasHalaqah.toLowerCase().includes(search)) ||
        (u.halaqah && u.halaqah.toLowerCase().includes(search));
      if (!matchSearch) return false;
    }
    return true;
  });

  let countHadir = 0;
  let countIzin = 0;
  let countSakit = 0;
  let countAlpa = 0;
  let countBadal = 0;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state" style="padding:28px 16px; text-align:center;">
      <div style="font-size:26px; margin-bottom:8px;">👳‍♂️</div>
      <div style="font-weight:700; color:#334155;">Tidak ada Ustadz yang sesuai filter.</div>
    </td></tr>`;
    updateAbsensiUstadzStats(0, 0, 0, 0, 0);
    return;
  }

  filtered.forEach((ustadz, idx) => {
    const record = AppState.absensiUstadz.find(a => 
      a.tanggal === tanggal && 
      a.sesi === sesi && 
      a.ustadzId === ustadz.id
    );

    const currentStatus = record ? record.status : 'Hadir';
    const currentBadal = record ? (record.badal || '') : '';
    const currentKet = record ? (record.keterangan || '') : '';

    if (currentStatus === 'Hadir') countHadir++;
    else if (currentStatus === 'Izin') countIzin++;
    else if (currentStatus === 'Sakit') countSakit++;
    else if (currentStatus === 'Badal') countBadal++;
    else countAlpa++;

    const isPutri = (ustadz.nama || '').toLowerCase().includes('ustdzh') || (ustadz.nama || '').toLowerCase().includes('putri');
    const icon = isPutri ? '🧕' : '👳‍♂️';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>
        <strong>${icon} ${escapeHtml(ustadz.nama)}</strong>
        <div style="font-size:11.5px; color:var(--dark-500);">${escapeHtml(ustadz.peran || 'Musyrif')} • WA: ${escapeHtml(ustadz.noHp || '-')}</div>
      </td>
      <td>
        <span style="font-size:12.5px; font-weight:600; color:#0f172a;">${escapeHtml(ustadz.halaqah || ustadz.tugasHalaqah || '-')}</span>
      </td>
      <td>
        <div class="quick-status-group">
          <button type="button" class="btn-status-chip ${currentStatus === 'Hadir' ? 'active-hadir' : ''}" 
            onclick="quickSetAbsensiUstadz('${ustadz.id}', 'Hadir')" title="Set Hadir">✓ Hadir</button>
          <button type="button" class="btn-status-chip ${currentStatus === 'Izin' ? 'active-izin' : ''}" 
            onclick="quickSetAbsensiUstadz('${ustadz.id}', 'Izin')" title="Set Izin">✉️ Izin</button>
          <button type="button" class="btn-status-chip ${currentStatus === 'Sakit' ? 'active-sakit' : ''}" 
            onclick="quickSetAbsensiUstadz('${ustadz.id}', 'Sakit')" title="Set Sakit">🏥 Sakit</button>
          <button type="button" class="btn-status-chip ${currentStatus === 'Badal' ? 'active-badal' : ''}" 
            onclick="quickSetAbsensiUstadz('${ustadz.id}', 'Badal')" title="Set Badal (Digantikan Ustadz Lain)">🔄 Badal</button>
          <button type="button" class="btn-status-chip ${currentStatus === 'Alpa' ? 'active-alpa' : ''}" 
            onclick="quickSetAbsensiUstadz('${ustadz.id}', 'Alpa')" title="Set Tidak Masuk / Alpa">✕ Alpa</button>
        </div>
        <select class="form-control" style="font-size:12px; padding:3px 6px; font-weight:600; height:28px;" 
          id="selectAbsenUst_${ustadz.id}"
          onchange="updateSingleAbsensiUstadzStatus('${ustadz.id}', this.value); renderAbsensiUstadzTable();">
          <option value="Hadir" ${currentStatus === 'Hadir' ? 'selected' : ''}>✓ Hadir Tepat Waktu</option>
          <option value="Izin" ${currentStatus === 'Izin' ? 'selected' : ''}>✉️ Izin (Ada Keperluan)</option>
          <option value="Sakit" ${currentStatus === 'Sakit' ? 'selected' : ''}>🏥 Sakit</option>
          <option value="Badal" ${currentStatus === 'Badal' ? 'selected' : ''}>🔄 Digantikan Badal</option>
          <option value="Alpa" ${currentStatus === 'Alpa' ? 'selected' : ''}>✕ Tidak Masuk / Alpa</option>
        </select>
      </td>
      <td>
        <input type="text" class="form-control" style="font-size:12px; padding:5px 8px;" 
          id="badalUst_${ustadz.id}"
          placeholder="Nama Ustadz pengganti jika izin..." 
          value="${escapeHtml(currentBadal)}"
          onchange="updateSingleAbsensiUstadzBadal('${ustadz.id}', this.value)">
      </td>
      <td>
        <input type="text" class="form-control" style="font-size:12px; padding:5px 8px;" 
          id="ketUst_${ustadz.id}"
          placeholder="Alasan / catatan kehadiran..." 
          value="${escapeHtml(currentKet)}"
          onchange="updateSingleAbsensiUstadzKeterangan('${ustadz.id}', this.value)">
      </td>
    `;
    tbody.appendChild(tr);
  });

  updateAbsensiUstadzStats(countHadir, countIzin, countSakit, countAlpa, countBadal);
}

function updateAbsensiUstadzStats(hadir, izin, sakit, alpa, badal) {
  const elHadir = document.getElementById('countUstadzHadir');
  const elIzin = document.getElementById('countUstadzIzin');
  const elSakit = document.getElementById('countUstadzSakit');
  const elAlpa = document.getElementById('countUstadzAlpa');
  const elBadal = document.getElementById('countUstadzBadal');

  if (elHadir) elHadir.textContent = `Hadir: ${hadir}`;
  if (elIzin) elIzin.textContent = `Izin: ${izin}`;
  if (elSakit) elSakit.textContent = `Sakit: ${sakit}`;
  if (elAlpa) elAlpa.textContent = `Tidak Masuk / Alpa: ${alpa}`;
  if (elBadal) elBadal.textContent = `Digantikan (Badal): ${badal}`;
}

function quickSetAbsensiUstadz(ustadzId, status) {
  updateSingleAbsensiUstadzStatus(ustadzId, status);
  renderAbsensiUstadzTable();
  if (status === 'Badal') {
    setTimeout(() => {
      const el = document.getElementById(`badalUst_${ustadzId}`);
      if (el) el.focus();
    }, 50);
  }
}

function updateSingleAbsensiUstadzStatus(ustadzId, status) {
  const tanggalInput = document.getElementById('absensiUstadzTanggal');
  const sesiSelect = document.getElementById('absensiUstadzSesi');
  if (!tanggalInput || !sesiSelect) return;

  const tanggal = tanggalInput.value || new Date().toISOString().split('T')[0];
  const sesi = sesiSelect.value || (AppState.settings.sesiSetoran && AppState.settings.sesiSetoran[0]) || "Shubuh";
  const ustadzList = AppState.ustadz && AppState.ustadz.length > 0 ? AppState.ustadz : (typeof SAMPLE_USTADZ !== 'undefined' ? SAMPLE_USTADZ : []);
  const ustadz = ustadzList.find(u => u.id === ustadzId);
  if (!ustadz) return;

  let record = AppState.absensiUstadz.find(a => a.tanggal === tanggal && a.sesi === sesi && a.ustadzId === ustadzId);

  if (record) {
    record.status = status;
  } else {
    record = {
      id: "ABSUST-" + Date.now() + "-" + Math.floor(Math.random() * 100),
      tanggal: tanggal,
      sesi: sesi,
      ustadzId: ustadz.id,
      ustadzNama: ustadz.nama,
      peran: ustadz.peran || "Musyrif",
      halaqah: ustadz.halaqah || ustadz.tugasHalaqah || "-",
      status: status,
      badal: "",
      keterangan: "",
      dicatatOleh: AppState.settings.kepalaTahfidz || "Admin Pondok"
    };
    AppState.absensiUstadz.push(record);
  }

  saveToStorage();
  updateNavPills();
}

function updateSingleAbsensiUstadzBadal(ustadzId, badal) {
  const tanggalInput = document.getElementById('absensiUstadzTanggal');
  const sesiSelect = document.getElementById('absensiUstadzSesi');
  if (!tanggalInput || !sesiSelect) return;

  const tanggal = tanggalInput.value || new Date().toISOString().split('T')[0];
  const sesi = sesiSelect.value || (AppState.settings.sesiSetoran && AppState.settings.sesiSetoran[0]) || "Shubuh";
  let record = AppState.absensiUstadz.find(a => a.tanggal === tanggal && a.sesi === sesi && a.ustadzId === ustadzId);
  if (record) {
    record.badal = badal;
    saveToStorage();
  }
}

function updateSingleAbsensiUstadzKeterangan(ustadzId, keterangan) {
  const tanggalInput = document.getElementById('absensiUstadzTanggal');
  const sesiSelect = document.getElementById('absensiUstadzSesi');
  if (!tanggalInput || !sesiSelect) return;

  const tanggal = tanggalInput.value || new Date().toISOString().split('T')[0];
  const sesi = sesiSelect.value || (AppState.settings.sesiSetoran && AppState.settings.sesiSetoran[0]) || "Shubuh";
  let record = AppState.absensiUstadz.find(a => a.tanggal === tanggal && a.sesi === sesi && a.ustadzId === ustadzId);
  if (record) {
    record.keterangan = keterangan;
    saveToStorage();
  }
}

function setSemuaUstadzAbsen(targetStatus) {
  const tanggalInput = document.getElementById('absensiUstadzTanggal');
  const sesiSelect = document.getElementById('absensiUstadzSesi');
  if (!tanggalInput || !sesiSelect) return;

  const tanggal = tanggalInput.value || new Date().toISOString().split('T')[0];
  const sesi = sesiSelect.value || (AppState.settings.sesiSetoran && AppState.settings.sesiSetoran[0]) || "Shubuh";
  const ustadzList = AppState.ustadz && AppState.ustadz.length > 0 ? AppState.ustadz : (typeof SAMPLE_USTADZ !== 'undefined' ? SAMPLE_USTADZ : []);

  ustadzList.forEach(ustadz => {
    let record = AppState.absensiUstadz.find(a => a.tanggal === tanggal && a.sesi === sesi && a.ustadzId === ustadz.id);
    if (record) {
      record.status = targetStatus;
    } else {
      AppState.absensiUstadz.push({
        id: "ABSUST-" + Date.now() + "-" + Math.floor(Math.random() * 10000),
        tanggal: tanggal,
        sesi: sesi,
        ustadzId: ustadz.id,
        ustadzNama: ustadz.nama,
        peran: ustadz.peran || "Musyrif",
        halaqah: ustadz.halaqah || ustadz.tugasHalaqah || "-",
        status: targetStatus,
        badal: "",
        keterangan: "",
        dicatatOleh: AppState.settings.kepalaTahfidz || "Admin Pondok"
      });
    }
  });

  saveToStorage();
  renderAbsensiUstadzTable();
  updateNavPills();
  showToast(`Semua Ustadz (${ustadzList.length} orang) berhasil diatur ke '${targetStatus}'`, 'success');
}

function simpanPresensiUstadz() {
  saveToStorage();
  renderAbsensiUstadzTable();
  updateNavPills();
  showToast("Presensi kehadiran para Ustadz berhasil disimpan rapi!", "success");
}

function eksporAbsensiUstadzExcel() {
  const tanggal = document.getElementById('absensiUstadzTanggal')?.value || new Date().toISOString().split('T')[0];
  const headers = ["Tanggal", "Sesi Halaqah", "Nama Ustadz", "Peran / Bagian", "Halaqah / Kelas", "Status Kehadiran", "Badal (Pengganti)", "Catatan / Keterangan", "Dicatat Oleh"];
  const records = AppState.absensiUstadz || [];
  const rows = records.map(r => [
    r.tanggal || "",
    r.sesi || "",
    r.ustadzNama || "",
    r.peran || "",
    r.halaqah || "",
    r.status || "",
    r.badal || "",
    r.keterangan || "",
    r.dicatatOleh || ""
  ]);
  const widths = [16, 24, 28, 20, 32, 18, 24, 28, 18];
  exportWorkbookExcel(headers, rows, 'PresensiAsatidz', `Log_Presensi_Asatidz_${tanggal}.xlsx`, widths);
  showToast("File Excel (.xlsx) Log Presensi Asatidz berhasil diunduh!", "success");
}
const eksporAbsensiUstadzCSV = eksporAbsensiUstadzExcel;

function switchSubTabUstadz(mode) {
  const btnHarian = document.getElementById('btnSubTabUstadzHarian');
  const btnRekap = document.getElementById('btnSubTabUstadzRekap');
  const viewHarian = document.getElementById('viewUstadzHarian');
  const viewRekap = document.getElementById('viewUstadzRekap');

  if (mode === 'rekap') {
    if (btnHarian) { btnHarian.className = 'btn btn-sm btn-secondary'; }
    if (btnRekap) { btnRekap.className = 'btn btn-sm btn-primary'; }
    if (viewHarian) viewHarian.style.display = 'none';
    if (viewRekap) viewRekap.style.display = 'block';
    renderRekapBulananUstadz();
  } else {
    if (btnHarian) { btnHarian.className = 'btn btn-sm btn-primary'; }
    if (btnRekap) { btnRekap.className = 'btn btn-sm btn-secondary'; }
    if (viewHarian) viewHarian.style.display = 'block';
    if (viewRekap) viewRekap.style.display = 'none';
    renderAbsensiUstadzTable();
  }
}

function renderRekapBulananUstadz() {
  const bulanSelect = document.getElementById('rekapUstadzBulan');
  const tahunSelect = document.getElementById('rekapUstadzTahun');
  const searchInput = document.getElementById('rekapUstadzSearch');
  const tbody = document.getElementById('tableRekapUstadzBody');
  if (!tbody) return;

  const bulan = bulanSelect ? parseInt(bulanSelect.value, 10) : (new Date().getMonth() + 1);
  const tahun = tahunSelect ? tahunSelect.value : String(new Date().getFullYear());
  const search = searchInput ? searchInput.value.toLowerCase().trim() : '';

  const prefix = `${tahun}-${String(bulan).padStart(2, '0')}`;
  const recordsMonth = (AppState.absensiUstadz || []).filter(a => a.tanggal && a.tanggal.startsWith(prefix));

  const ustadzList = AppState.ustadz && AppState.ustadz.length > 0 ? AppState.ustadz : (typeof SAMPLE_USTADZ !== 'undefined' ? SAMPLE_USTADZ : []);
  
  let filteredUstadz = ustadzList.filter(u => {
    if (!search) return true;
    return (u.nama && u.nama.toLowerCase().includes(search)) ||
      (u.peran && u.peran.toLowerCase().includes(search)) ||
      (u.halaqah && u.halaqah.toLowerCase().includes(search));
  });

  tbody.innerHTML = '';

  let totalSesiAll = 0;
  let totalHadirAll = 0;
  let topCount = 0;
  let totalIzinSakitBadalAll = 0;

  filteredUstadz.forEach((u, idx) => {
    const records = recordsMonth.filter(r => r.ustadzId === u.id || (r.ustadzNama && r.ustadzNama.toLowerCase() === u.nama.toLowerCase()));
    const hadir = records.filter(r => r.status === 'Hadir').length;
    const izin = records.filter(r => r.status === 'Izin').length;
    const sakit = records.filter(r => r.status === 'Sakit').length;
    const badal = records.filter(r => r.status === 'Badal').length;
    const alpa = records.filter(r => r.status === 'Alpa').length;
    const totalSesi = records.length;

    totalSesiAll += totalSesi;
    totalHadirAll += hadir;
    totalIzinSakitBadalAll += (izin + sakit + badal);

    const pct = totalSesi > 0 ? Math.round((hadir / totalSesi) * 100) : 100;
    if (pct >= 90) topCount++;

    let evaluasiBadge = '';
    if (pct >= 90) {
      evaluasiBadge = `<span class="badge" style="background:#ecfdf5; color:#047857; font-weight:700; border:1px solid #a7f3d0;">🌟 Sangat Disiplin</span>`;
    } else if (pct >= 75) {
      evaluasiBadge = `<span class="badge" style="background:#eff6ff; color:#1d4ed8; font-weight:700; border:1px solid #bfdbfe;">✓ Disiplin</span>`;
    } else {
      evaluasiBadge = `<span class="badge" style="background:#fffbeb; color:#b45309; font-weight:700; border:1px solid #fde68a;">⚠️ Perlu Ditingkatkan</span>`;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>
        <strong style="font-size:13px; color:#0f172a;">${escapeHtml(u.nama)}</strong>
        <div style="font-size:11px; color:#64748b;">${escapeHtml(u.peran || 'Musyrif')} • WA: ${escapeHtml(u.noHp || '-')}</div>
      </td>
      <td>
        <span style="font-size:12px; font-weight:600; color:#334155;">${escapeHtml(u.halaqah || u.tugasHalaqah || '-')}</span>
      </td>
      <td style="text-align:center; font-weight:700;">${totalSesi}</td>
      <td style="text-align:center; font-weight:700; color:#059669;">${hadir}</td>
      <td style="text-align:center; font-weight:600; color:#0284c7;">${izin}</td>
      <td style="text-align:center; font-weight:600; color:#ea580c;">${sakit}</td>
      <td style="text-align:center; font-weight:600; color:#7c3aed;">${badal}</td>
      <td style="text-align:center; font-weight:600; color:#dc2626;">${alpa}</td>
      <td style="text-align:center;">
        <span style="font-size:13.5px; font-weight:800; color:${pct >= 90 ? '#059669' : (pct >= 75 ? '#0284c7' : '#dc2626')};">${pct}%</span>
      </td>
      <td style="text-align:center;">${evaluasiBadge}</td>
    `;
    tbody.appendChild(tr);
  });

  if (filteredUstadz.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" class="empty-state" style="padding:28px 16px; text-align:center;">
      <div style="font-size:24px; margin-bottom:8px;">🔍</div>
      <div style="font-weight:700; color:#334155;">Tidak ada Ustadz yang sesuai filter.</div>
    </td></tr>`;
  }

  // Update Summary Stats Cards
  const avgPct = totalSesiAll > 0 ? Math.round((totalHadirAll / totalSesiAll) * 100) : (filteredUstadz.length > 0 ? 100 : 0);
  const elAvg = document.getElementById('rekapUstAvgHadir');
  const elSesi = document.getElementById('rekapUstTotalSesi');
  const elTop = document.getElementById('rekapUstTopCount');
  const elIzinSakit = document.getElementById('rekapUstTotalIzinSakit');

  if (elAvg) animateCounter(elAvg, avgPct, 750, '%');
  if (elSesi) animateCounter(elSesi, totalSesiAll, 750, ' Sesi');
  if (elTop) animateCounter(elTop, topCount, 750, ' Ustadz');
  if (elIzinSakit) animateCounter(elIzinSakit, totalIzinSakitBadalAll, 750, ' Sesi');
}

function eksporRekapBulananUstadzExcel() {
  const bulanSelect = document.getElementById('rekapUstadzBulan');
  const tahunSelect = document.getElementById('rekapUstadzTahun');
  const bulan = bulanSelect ? parseInt(bulanSelect.value, 10) : (new Date().getMonth() + 1);
  const tahun = tahunSelect ? tahunSelect.value : String(new Date().getFullYear());
  const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ][bulan - 1] || 'November';

  const prefix = `${tahun}-${String(bulan).padStart(2, '0')}`;
  const recordsMonth = (AppState.absensiUstadz || []).filter(a => a.tanggal && a.tanggal.startsWith(prefix));
  const ustadzList = AppState.ustadz && AppState.ustadz.length > 0 ? AppState.ustadz : (typeof SAMPLE_USTADZ !== 'undefined' ? SAMPLE_USTADZ : []);

  const headers = ['No', 'Nama Ustadz / Ustadzah', 'Peran / Tugas', 'Halaqah Dibina', 'Total Sesi', 'Hadir', 'Izin', 'Sakit', 'Badal', 'Alpa', '% Kehadiran', 'Predikat Evaluasi'];
  const rows = ustadzList.map((u, idx) => {
    const records = recordsMonth.filter(r => r.ustadzId === u.id || (r.ustadzNama && r.ustadzNama.toLowerCase() === u.nama.toLowerCase()));
    const hadir = records.filter(r => r.status === 'Hadir').length;
    const izin = records.filter(r => r.status === 'Izin').length;
    const sakit = records.filter(r => r.status === 'Sakit').length;
    const badal = records.filter(r => r.status === 'Badal').length;
    const alpa = records.filter(r => r.status === 'Alpa').length;
    const totalSesi = records.length;
    const pct = totalSesi > 0 ? Math.round((hadir / totalSesi) * 100) : 100;
    const predikat = pct >= 90 ? 'Sangat Disiplin' : (pct >= 75 ? 'Disiplin' : 'Perlu Ditingkatkan');

    return [
      idx + 1,
      u.nama || '',
      u.peran || '',
      u.halaqah || u.tugasHalaqah || '',
      totalSesi,
      hadir,
      izin,
      sakit,
      badal,
      alpa,
      `${pct}%`,
      predikat
    ];
  });

  const widths = [6, 34, 22, 34, 12, 10, 10, 10, 10, 10, 14, 22];
  const filename = `Rekap_Kehadiran_Dewan_Asatidz_${namaBulan}_${tahun}.xlsx`;
  exportWorkbookExcel(headers, rows, 'RekapBulananAsatidz', filename, widths);
  showToast(`Alhamdulillah! Rekap Kehadiran Asatidz periode ${namaBulan} ${tahun} berhasil diekspor ke Excel!`, 'success');
}

function unduhTemplateAbsensiUstadzExcel() {
  const headers = ['Tanggal (YYYY-MM-DD)', 'Sesi Halaqah', 'Nama Ustadz', 'Peran / Bagian', 'Halaqah / Tugas', 'Status Kehadiran (Hadir/Izin/Sakit/Badal/Alpa)', 'Ustadz Pengganti (Badal)', 'Catatan / Keterangan'];
  const sampleRows = [
    ['2024-11-20', 'Shubuh (05.30 - 06.45)', 'Ust. Muhammad Ridwan, S.Pd.I., Al-Hafidz', 'Kepala Tahfidz', 'Halaqah Ust. Muhammad Ridwan, Al-Hafidz', 'Hadir', '', 'Tepat waktu menyimak setoran'],
    ['2024-11-20', 'Shubuh (05.30 - 06.45)', 'Ust. Wildan, Al-Hafidz', 'Musyrif Tahfidz Putra', 'Halaqah Ust. Wildan, Al-Hafidz', 'Hadir', '', 'Menyimak setoran ziyadah'],
    ['2024-11-20', 'Shubuh (05.30 - 06.45)', 'Ust. Miftah Faridl', 'Pengajar Binnadzor', 'Kelas A1 (Ust. Miftah Faridl)', 'Badal', 'Ust. Hasan Basri', 'Izin urusan keluarga, dibadalkan Ust. Hasan Basri'],
    ['2024-11-20', 'Shubuh (05.30 - 06.45)', 'Ustdzh. Nurul Hidayah, Al-Hafidzah', 'Musyrifah Tahfidz Putri', 'Halaqah Ustdzh. Nurul Hidayah, Al-Hafidzah', 'Hadir', '', 'Hadir tepat waktu halaqah putri'],
    ['2024-11-20', 'Ashar (16.00 - 17.15)', 'Ust. Zainal Abidin, Al-Hafidz', 'Musyrif Tahfidz Putra', 'Halaqah Ust. Zainal Abidin, Al-Hafidz', 'Izin', '', 'Ada agenda dinas luar']
  ];
  const widths = [20, 24, 35, 24, 35, 28, 26, 35];
  exportWorkbookExcel(headers, sampleRows, 'PresensiUstadz', 'Template_Import_Presensi_Ustadz.xlsx', widths);
  showToast("Template Excel Presensi Ustadz berhasil diunduh!", "success");
}

function triggerImportAbsensiUstadzExcel() {
  const el = document.getElementById('fileInputAbsensiUstadzExcel');
  if (el) el.click();
}

function prosesImportAbsensiUstadzExcel(event) {
  const file = event.target.files[0];
  if (!file) return;

  readExcelOrCSV(file, (rows, err) => {
    if (err || !rows || rows.length < 2) {
      showToast("Gagal membaca file Excel/CSV Presensi Ustadz. Pastikan format sesuai template.", "error");
      event.target.value = '';
      return;
    }

    const headerRow = (rows[0] || []).map(h => String(h || '').toLowerCase().trim());
    const hasHeader = headerRow.some(h => h.includes('tanggal') || h.includes('ustadz') || h.includes('status'));

    let idxTgl = 0, idxSesi = 1, idxNama = 2, idxPeran = 3, idxHal = 4, idxStatus = 5, idxBadal = 6, idxKet = 7;

    if (hasHeader) {
      const hTgl = headerRow.findIndex(h => h.includes('tanggal') || h.includes('tgl'));
      if (hTgl !== -1) idxTgl = hTgl;
      const hSesi = headerRow.findIndex(h => h.includes('sesi'));
      if (hSesi !== -1) idxSesi = hSesi;
      const hNama = headerRow.findIndex(h => h.includes('ustadz') || h.includes('nama'));
      if (hNama !== -1) idxNama = hNama;
      const hPeran = headerRow.findIndex(h => h.includes('peran') || h.includes('bagian'));
      if (hPeran !== -1) idxPeran = hPeran;
      const hHal = headerRow.findIndex(h => h.includes('halaqah') || h.includes('tugas') || h.includes('kelas'));
      if (hHal !== -1) idxHal = hHal;
      const hStat = headerRow.findIndex(h => h.includes('status') || h.includes('kehadiran'));
      if (hStat !== -1) idxStatus = hStat;
      const hBadal = headerRow.findIndex(h => h.includes('badal') || h.includes('pengganti'));
      if (hBadal !== -1) idxBadal = hBadal;
      const hKet = headerRow.findIndex(h => h.includes('catatan') || h.includes('keterangan') || h.includes('alasan'));
      if (hKet !== -1) idxKet = hKet;
    }

    const ustadzList = AppState.ustadz && AppState.ustadz.length > 0 ? AppState.ustadz : (typeof SAMPLE_USTADZ !== 'undefined' ? SAMPLE_USTADZ : []);
    let count = 0;

    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i];
      if (!cols || cols.length < 2) continue;

      const tanggal = String(cols[idxTgl] || getTodayDateStr()).trim();
      const sesi = String(cols[idxSesi] || 'Shubuh (05.30 - 06.45)').trim();
      const ustadzNama = String(cols[idxNama] || '').trim();
      if (!ustadzNama) continue;

      let statusRaw = String(cols[idxStatus] || 'Hadir').trim();
      let status = 'Hadir';
      if (statusRaw.toLowerCase().includes('izin')) status = 'Izin';
      else if (statusRaw.toLowerCase().includes('sakit')) status = 'Sakit';
      else if (statusRaw.toLowerCase().includes('badal')) status = 'Badal';
      else if (statusRaw.toLowerCase().includes('alpa') || statusRaw.toLowerCase().includes('tidak')) status = 'Alpa';

      const badal = String(cols[idxBadal] || '').trim();
      const ket = String(cols[idxKet] || '').trim();

      // Cocokkan Ustadz di sistem
      const matchedU = ustadzList.find(u => u.nama.toLowerCase().includes(ustadzNama.toLowerCase()) || ustadzNama.toLowerCase().includes(u.nama.toLowerCase()));
      const ustadzId = matchedU ? matchedU.id : ('UST-IMP-' + count);
      const peran = matchedU ? matchedU.peran : String(cols[idxPeran] || 'Musyrif').trim();
      const halaqah = matchedU ? (matchedU.halaqah || matchedU.tugasHalaqah) : String(cols[idxHal] || '-').trim();

      let existing = AppState.absensiUstadz.find(a => a.tanggal === tanggal && a.sesi === sesi && (a.ustadzId === ustadzId || a.ustadzNama.toLowerCase() === ustadzNama.toLowerCase()));
      if (existing) {
        existing.status = status;
        if (badal) existing.badal = badal;
        if (ket) existing.keterangan = ket;
      } else {
        AppState.absensiUstadz.push({
          id: 'ABSUST-' + Date.now() + '-' + count,
          tanggal: tanggal,
          sesi: sesi,
          ustadzId: ustadzId,
          ustadzNama: matchedU ? matchedU.nama : ustadzNama,
          peran: peran,
          halaqah: halaqah,
          status: status,
          badal: badal,
          keterangan: ket,
          dicatatOleh: AppState.settings.kepalaTahfidz || 'Admin Pondok'
        });
      }
      count++;
    }

    saveToStorage();
    renderAbsensiUstadzTable();
    renderRekapBulananUstadz();
    updateNavPills();
    showToast(`Alhamdulillah! Berhasil mengimpor ${count} data presensi Ustadz dari file Excel!`, 'success');
    event.target.value = '';
  });
}

function cetakRekapBulananUstadz() {
  const bulanSelect = document.getElementById('rekapUstadzBulan');
  const tahunSelect = document.getElementById('rekapUstadzTahun');
  const bulan = bulanSelect ? parseInt(bulanSelect.value, 10) : (new Date().getMonth() + 1);
  const tahun = tahunSelect ? tahunSelect.value : String(new Date().getFullYear());
  const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ][bulan - 1] || 'November';

  const tableHtml = document.getElementById('tableRekapUstadzBody')?.innerHTML || '';
  const printArea = document.getElementById('printArea');
  if (!printArea) return;

  const namaPondok = AppState.settings.namaPondok || DEFAULT_SETTINGS.namaPondok;
  const alamatPondok = AppState.settings.alamatPondok || DEFAULT_SETTINGS.alamatPondok;
  const pengasuh = AppState.settings.pengasuhPondok || DEFAULT_SETTINGS.pengasuhPondok;
  const kepalaTahfidz = AppState.settings.kepalaTahfidz || DEFAULT_SETTINGS.kepalaTahfidz;

  printArea.innerHTML = `
    <div class="print-kop">
      <h2>${escapeHtml(namaPondok)}</h2>
      <p>${escapeHtml(alamatPondok)}</p>
      <h3 style="margin-top:10px; font-size:14pt; text-decoration:underline;">REKAPITULASI KEHADIRAN DEWAN ASATIDZ TAHFIDZ</h3>
      <p style="font-size:11pt; margin-top:4px;">Periode: <strong>Bulan ${escapeHtml(namaBulan)} Tahun ${escapeHtml(tahun)}</strong></p>
    </div>

    <table class="print-table" style="margin-top:15px;">
      <thead>
        <tr style="background:#f1f5f9;">
          <th style="width:35px;">No</th>
          <th>Nama Ustadz / Ustadzah</th>
          <th>Peran & Tugas Halaqah</th>
          <th style="text-align:center;">Total Sesi</th>
          <th style="text-align:center;">Hadir</th>
          <th style="text-align:center;">Izin</th>
          <th style="text-align:center;">Sakit</th>
          <th style="text-align:center;">Badal</th>
          <th style="text-align:center;">Alpa</th>
          <th style="text-align:center;">% Disiplin</th>
          <th style="text-align:center;">Status Evaluasi</th>
        </tr>
      </thead>
      <tbody>
        ${tableHtml}
      </tbody>
    </table>

    <div style="display:flex; justify-content:space-between; margin-top:40px; page-break-inside:avoid; font-size:11pt;">
      <div style="text-align:center; width:220px;">
        <p>Mengetahui,</p>
        <p style="font-weight:700;">Pengasuh Pondok Pesantren</p>
        <div style="height:65px;"></div>
        <p style="font-weight:700; text-decoration:underline;">${escapeHtml(pengasuh)}</p>
      </div>

      <div style="text-align:center; width:220px;">
        <p>Pondok Pesantren, ${formatTanggalIndo(getTodayDateStr())}</p>
        <p style="font-weight:700;">Kepala Divisi Tahfidz</p>
        <div style="height:65px;"></div>
        <p style="font-weight:700; text-decoration:underline;">${escapeHtml(kepalaTahfidz)}</p>
      </div>
    </div>
  `;

  window.print();
}

// ================= 3. HASIL SETORAN HARIAN =================
function renderSetoranUstadzChips() {
  const container = document.getElementById('setoranUstadzChips');
  const notice = document.getElementById('setoranActiveUstadzNotice');
  if (!container) return;

  const list = getDaftarUstadzHalaqah();
  if (AppState.selectedSetoranUstadz && !list.some(l => l.name === AppState.selectedSetoranUstadz)) {
    AppState.selectedSetoranUstadz = '';
  }
  const current = AppState.selectedSetoranUstadz || '';
  const totalSetoran = AppState.setoran.length;

  if (notice) {
    if (current) {
      notice.style.display = 'inline-block';
      notice.innerHTML = `✓ Filter Aktif: <strong>${escapeHtml(current)}</strong> <button type="button" onclick="pilihSetoranUstadz('')" style="margin-left:6px; background:none; border:none; color:#047857; text-decoration:underline; cursor:pointer; font-size:11px;">Tampilkan Semua</button>`;
    } else {
      notice.style.display = 'none';
      notice.innerHTML = '';
    }
  }

  let chipsHtml = `
    <button type="button" 
      class="ustadz-chip ${!current ? 'active' : ''}" 
      onclick="pilihSetoranUstadz('')"
      title="Tampilkan seluruh hasil setoran harian">
      📚 <strong>Semua Setoran</strong> <span class="chip-count">${totalSetoran}</span>
    </button>
  `;

  // Tampilkan seluruh chip: halaqah yang memiliki santri + seluruh halaqah resmi dari Pengaturan
  const activeChipsList = list;
  activeChipsList.forEach(item => {
    const isActive = item.name === current;
    const isPutri = item.name.toLowerCase().includes('putri') || item.name.toLowerCase().includes('ustdzh');
    const icon = isPutri ? '🧕' : '👳‍♂️';
    chipsHtml += `
      <button type="button" 
        class="ustadz-chip ${isActive ? 'active' : ''}" 
        onclick="pilihSetoranUstadz('${escapeHtml(item.name)}')"
        title="Filter setoran santri ${escapeHtml(item.name)}">
        ${icon} <strong>${escapeHtml(item.name)}</strong>
      </button>
    `;
  });

  container.innerHTML = chipsHtml;
}

function pilihSetoranUstadz(halaqah) {
  AppState.selectedSetoranUstadz = halaqah || '';
  renderSetoranUstadzChips();
  renderSetoranTable();
}

function renderSetoranTable() {
  const search = document.getElementById('setoranSearch')?.value?.toLowerCase() || '';
  const progFilter = document.getElementById('setoranFilterProgram')?.value || '';
  const jenisFilter = document.getElementById('setoranFilterJenis')?.value || '';
  const nilaiFilter = document.getElementById('setoranFilterNilai')?.value || '';
  const selectedUstadz = AppState.selectedSetoranUstadz || '';

  const tbody = document.getElementById('tableSetoranBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  let filtered = [...AppState.setoran].filter(item => {
    // If an ustadz is selected, check if setoran belongs to that ustadz
    if (selectedUstadz) {
      const santriObj = AppState.santri.find(s => s.id === item.santriId);
      const halaqahSantri = santriObj ? santriObj.halaqah : (item.halaqah || '');
      const matchUstadz = halaqahSantri === selectedUstadz || 
        (item.penyimak && item.penyimak.toLowerCase().includes(selectedUstadz.toLowerCase()));
      if (!matchUstadz) return false;
    }
    const matchSearch = !search || 
      item.santriNama.toLowerCase().includes(search) || 
      (item.suratNama && item.suratNama.toLowerCase().includes(search)) || 
      (item.catatan && item.catatan.toLowerCase().includes(search)) ||
      (item.penyimak && item.penyimak.toLowerCase().includes(search));
    const matchProg = !progFilter || item.program === progFilter;
    const matchJenis = !jenisFilter || item.jenisSetoran === jenisFilter;
    const matchNilai = !nilaiFilter || item.nilai === nilaiFilter;
    return matchSearch && matchProg && matchJenis && matchNilai;
  });

  // Sort descending by date
  filtered.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" class="empty-state">Tidak ada rekaman setoran hafalan yang cocok.</td></tr>`;
    updateSelectedSetoranUI();
    return;
  }

  filtered.forEach(item => {
    const badgeProgram = item.program === 'Binnadzor' 
      ? `<span class="badge badge-binnadzor">Binnadzor</span>` 
      : `<span class="badge badge-tahfidz">Tahfidz</span>`;

    const chipNilai = getNilaiChipHtml(item.nilai);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align:center;"><input type="checkbox" class="check-setoran-item" value="${item.id}" onchange="updateSelectedSetoranUI()"></td>
      <td>
        <strong>${formatTanggalIndo(item.tanggal)}</strong>
        <div style="font-size:11.5px; color:var(--dark-500);">${escapeHtml(item.sesi || '-')}</div>
      </td>
      <td>
        <strong style="font-size:13px;">${escapeHtml(item.santriNama)}</strong>
        ${(() => {
          const sObj = AppState.santri.find(s => s.id === item.santriId);
          return (sObj && sObj.kelasSekolah) ? `<div style="font-size:11px; color:#0284c7; font-weight:600; margin-top:2px;">🏫 Kelas ${escapeHtml(sObj.kelasSekolah)}</div>` : '';
        })()}
      </td>
      <td>${badgeProgram}</td>
      <td><span style="font-weight:600; font-size:12px;">${escapeHtml(item.jenisSetoran)}</span></td>
      <td>
        <strong>Juz ${item.juz}</strong> • QS. ${escapeHtml(item.suratNama || '-')} : ${item.ayatAwal || 1}-${item.ayatAkhir || 1}
      </td>
      <td>${item.halaman ? `Hlm ${item.halaman}` : '-'}</td>
      <td>${chipNilai}</td>
      <td style="font-size:12px; color:var(--dark-600); max-width:220px;">${escapeHtml(item.catatan || '-')}</td>
      <td style="font-size:12px; color:var(--dark-500);">${escapeHtml(item.penyimak || '-')}</td>
      <td style="text-align:right;">
        <button class="btn btn-secondary btn-sm" onclick="editSetoran('${item.id}')" title="Edit">✏️</button>
        <button class="btn btn-secondary btn-sm" onclick="hapusSetoran('${item.id}')" title="Hapus" style="color:var(--danger);">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  updateSelectedSetoranUI();
}

function openModalSetoran(preselectedSantriId = null) {
  const form = document.getElementById('formSetoran');
  form.reset();
  document.getElementById('formSetoranId').value = '';
  document.getElementById('modalSetoranTitle').textContent = '📖 Catat Hasil Setoran Harian Santri';

  // Populate Santri Dropdown
  const selectSantri = document.getElementById('formSetoranSantri');
  selectSantri.innerHTML = `<option value="">-- Pilih Santri --</option>`;
  AppState.santri.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = `${s.nama} (${s.program}${s.kelasSekolah ? ' - Kls ' + s.kelasSekolah : ''} - NIS: ${s.nis})`;
    selectSantri.appendChild(opt);
  });

  // Populate Sesi Dropdown
  const selectSesi = document.getElementById('formSetoranSesi');
  selectSesi.innerHTML = '';
  (AppState.settings.sesiSetoran || []).forEach(sesi => {
    const opt = document.createElement('option');
    opt.value = sesi;
    opt.textContent = sesi;
    selectSesi.appendChild(opt);
  });

  // Default date to today
  document.getElementById('formSetoranTanggal').value = new Date().toISOString().split('T')[0];

  // Default Musyrif / Penyimak
  let defaultMusyrif = AppState.selectedSetoranUstadz || AppState.selectedAbsensiUstadz || AppState.settings.kepalaTahfidz || '';
  if (preselectedSantriId) {
    const s = AppState.santri.find(x => x.id === preselectedSantriId);
    if (s && s.halaqah) {
      defaultMusyrif = s.halaqah;
    }
  }
  document.getElementById('formSetoranPenyimak').value = defaultMusyrif;

  // Populate Surah Dropdown (1 to 114)
  populateSurahDropdown();

  // Populate Juz Dropdown (1 to 30)
  populateJuzDropdown();

  if (preselectedSantriId) {
    selectSantri.value = preselectedSantriId;
    onSantriSetoranChange();
  } else {
    onSantriSetoranChange();
  }

  document.getElementById('modalSetoran').classList.add('active');
}

function closeModalSetoran() {
  document.getElementById('modalSetoran').classList.remove('active');
}

function populateSurahDropdown(filterJuz = null) {
  const selectSurat = document.getElementById('formSetoranSurat');
  selectSurat.innerHTML = '';

  let surahs = QURAN_SURAHS;
  if (filterJuz) {
    surahs = getSurahsByJuz(filterJuz);
    if (surahs.length === 0) surahs = QURAN_SURAHS;
  }

  surahs.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.no;
    opt.textContent = `${s.no}. QS. ${s.latin} (${s.arab}) - Juz ${s.juz} [${s.ayat} ayat]`;
    selectSurat.appendChild(opt);
  });

  if (surahs.length > 0) {
    onSuratChange();
  }
}

function populateJuzDropdown() {
  const selectJuz = document.getElementById('formSetoranJuz');
  selectJuz.innerHTML = '';
  for (let i = 1; i <= 30; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    const label = JUZ_NAMES[i - 1] || `Juz ${i}`;
    opt.textContent = label;
    selectJuz.appendChild(opt);
  }
  selectJuz.value = 30; // default Juz 30
}

function onSantriSetoranChange() {
  const santriId = document.getElementById('formSetoranSantri').value;
  const badgeWrap = document.getElementById('formSetoranProgramBadge');
  const jenisSelect = document.getElementById('formSetoranJenis');
  jenisSelect.innerHTML = '';

  if (!santriId) {
    badgeWrap.innerHTML = `<span class="badge badge-binnadzor">Pilih santri terlebih dahulu</span>`;
    return;
  }

  const santri = AppState.santri.find(s => s.id === santriId);
  if (!santri) return;

  if (santri.program === 'Binnadzor' || santri.program === 'Program Maqbul') {
    const isMaqbul = santri.program === 'Program Maqbul';
    badgeWrap.innerHTML = isMaqbul
      ? `<span class="badge" style="background:#fef3c7; color:#b45309; font-weight:700;">🌟 Program Maqbul (Lolos Tes Maqbul)</span><span style="font-size:11.5px; color:#b45309; margin-left:6px;">Persiapan Tahfidz</span>`
      : `<span class="badge badge-binnadzor">📖 Program Binnadzor</span><span style="font-size:11.5px; color:#0369a1; margin-left:6px;">Target: Bacaan, Juz 28-30 & Surat Pilihan</span>`;

    const bnzOptions = [
      { val: "Hafalan Juz 30", text: "Hafalan Juz 30 ('Amma)" },
      { val: "Hafalan Juz 29", text: "Hafalan Juz 29 (Tabarak)" },
      { val: "Hafalan Juz 28", text: "Hafalan Juz 28 (Qadd Sami')" },
      { val: "Hafalan Surat Pilihan", text: "Hafalan Surat Pilihan (Yasin, Ar-Rahman, Al-Waqi'ah, Al-Mulk)" },
      { val: "Bacaan Al-Qur'an (Bin-Nadzor)", text: "Bacaan Al-Qur'an (Bin-Nadzor - Fashahah)" },
      { val: "Ujian Tes Maqbul", text: "Sidang Tes Maqbul (Evaluasi 3 Bulanan)" },
      { val: "Ujian Tasmi' Binnadzor", text: "Ujian Tasmi' Binnadzor (Ujian Wisuda)" }
    ];
    bnzOptions.forEach(opt => {
      const o = document.createElement('option');
      o.value = opt.val;
      o.textContent = opt.text;
      jenisSelect.appendChild(o);
    });

    // Auto set juz to 30 for Binnadzor
    document.getElementById('formSetoranJuz').value = 30;
    populateSurahDropdown(30);

  } else if (santri.program === 'Pasca Tahfidz') {
    // Pasca Tahfidz
    badgeWrap.innerHTML = `
      <span class="badge" style="background:#fef3c7; color:#92400e; font-weight:700; border:1px solid #fcd34d;">👑 Kelas Pasca Tahfidz</span>
      <span style="font-size:11.5px; color:#b45309; margin-left:6px;">Khatam 30 Juz • Progres Tasmi' & Sanad</span>
    `;
    const pstOptions = [
      { val: "Tasmi' 5 Juz Sekali Duduk", text: "👑 Tasmi' 5 Juz Bil-Ghaib Sekali Duduk" },
      { val: "Tasmi' 10 Juz Sekali Duduk", text: "👑 Tasmi' 10 Juz Bil-Ghaib Sekali Duduk" },
      { val: "Tasmi' 15 Juz Sekali Duduk", text: "👑 Tasmi' 15 Juz Bil-Ghaib Sekali Duduk" },
      { val: "Tasmi' 20 Juz Sekali Duduk", text: "👑 Tasmi' 20 Juz Bil-Ghaib Sekali Duduk" },
      { val: "Tasmi' 30 Juz Sekali Duduk", text: "👑 Tasmi' 30 Juz Bil-Ghaib Sekali Duduk (Khotmil Akbar)" },
      { val: "Bimbingan Sanad & Matan Tajwid", text: "📜 Bimbingan Sanad Al-Qur'an & Matan Al-Jazariyah" },
      { val: "Muraja'ah", text: "🔁 Muraja'ah Kubro 30 Juz" }
    ];
    pstOptions.forEach(opt => {
      const o = document.createElement('option');
      o.value = opt.val;
      o.textContent = opt.text;
      jenisSelect.appendChild(o);
    });

    document.getElementById('formSetoranJuz').value = 30;
    populateSurahDropdown(30);

  } else {
    // Tahfidz
    badgeWrap.innerHTML = `
      <span class="badge badge-tahfidz">🕌 Program Tahfidz (30 Juz)</span>
      <span style="font-size:11.5px; color:#065f46; margin-left:6px;">Alumni Wisuda Binnadzor</span>
    `;
    const thfOptions = [
      { val: "Ziyadah", text: "Ziyadah (Setoran Hafalan Baru)" },
      { val: "Muraja'ah", text: "Muraja'ah (Penguatan Hafalan)" },
      { val: "Tasmi' Sekali Duduk", text: "Tasmi' Bil-Ghaib (Sekali Duduk)" }
    ];
    thfOptions.forEach(opt => {
      const o = document.createElement('option');
      o.value = opt.val;
      o.textContent = opt.text;
      jenisSelect.appendChild(o);
    });

    // If santri has last recited juz
    const lastJuz = santri.tahfidzProgress?.totalJuzHafal ? Math.min(30, Math.floor(santri.tahfidzProgress.totalJuzHafal) + 1) : 1;
    document.getElementById('formSetoranJuz').value = lastJuz;
    populateSurahDropdown(lastJuz);
  }
}

function onJenisSetoranChange() {
  const jenis = document.getElementById('formSetoranJenis').value;
  if (jenis === 'Hafalan Juz 30') {
    document.getElementById('formSetoranJuz').value = 30;
    populateSurahDropdown(30);
  } else if (jenis === 'Hafalan Juz 29') {
    document.getElementById('formSetoranJuz').value = 29;
    populateSurahDropdown(29);
  } else if (jenis === 'Hafalan Juz 28') {
    document.getElementById('formSetoranJuz').value = 28;
    populateSurahDropdown(28);
  }
}

function onJuzChange() {
  const juz = document.getElementById('formSetoranJuz').value;
  populateSurahDropdown(juz);
}

function onSuratChange() {
  const suratNo = Number(document.getElementById('formSetoranSurat').value);
  const surah = QURAN_SURAHS.find(s => s.no === suratNo);
  if (surah) {
    document.getElementById('formSetoranAyatAwal').value = 1;
    document.getElementById('formSetoranAyatAkhir').value = Math.min(surah.ayat, 10);
    document.getElementById('formSetoranAyatAkhir').max = surah.ayat;
    document.getElementById('formSetoranAyatAwal').max = surah.ayat;
  }
}

function simpanFormSetoran(e) {
  e.preventDefault();

  const id = document.getElementById('formSetoranId').value;
  const santriId = document.getElementById('formSetoranSantri').value;
  const santri = AppState.santri.find(s => s.id === santriId);
  if (!santri) {
    showToast("Silakan pilih santri terlebih dahulu!", "error");
    return;
  }

  const tanggal = document.getElementById('formSetoranTanggal').value;
  const sesi = document.getElementById('formSetoranSesi').value;
  const jenis = document.getElementById('formSetoranJenis').value;
  const juz = Number(document.getElementById('formSetoranJuz').value);
  const suratNo = Number(document.getElementById('formSetoranSurat').value);
  const surah = QURAN_SURAHS.find(s => s.no === suratNo);
  const suratNama = surah ? surah.latin : "";
  const ayatAwal = Number(document.getElementById('formSetoranAyatAwal').value) || 1;
  const ayatAkhir = Number(document.getElementById('formSetoranAyatAkhir').value) || 1;
  const halaman = document.getElementById('formSetoranHalaman').value ? Number(document.getElementById('formSetoranHalaman').value) : null;
  const nilai = document.getElementById('formSetoranNilai').value;
  const penyimak = document.getElementById('formSetoranPenyimak').value;
  const catatan = document.getElementById('formSetoranCatatan').value;

  const setoranData = {
    id: id || ("SET-" + Date.now()),
    santriId: santri.id,
    santriNama: santri.nama,
    program: santri.program,
    tanggal: tanggal,
    sesi: sesi,
    jenisSetoran: jenis,
    juz: juz,
    suratNo: suratNo,
    suratNama: suratNama,
    ayatAwal: ayatAwal,
    ayatAkhir: ayatAkhir,
    halaman: halaman,
    nilai: nilai,
    catatan: catatan,
    penyimak: penyimak
  };

  if (id) {
    const idx = AppState.setoran.findIndex(s => s.id === id);
    if (idx !== -1) AppState.setoran[idx] = setoranData;
  } else {
    AppState.setoran.unshift(setoranData);
  }

  // Auto update presensi to Hadir (Setor) on this date & session
  let absRecord = AppState.absensi.find(a => a.tanggal === tanggal && a.sesi === sesi && a.santriId === santri.id);
  if (absRecord) {
    absRecord.status = 'Hadir (Setor)';
    absRecord.keterangan = `Setor ${jenis} (QS. ${suratNama})`;
  } else {
    AppState.absensi.push({
      id: "ABS-" + Date.now(),
      tanggal: tanggal,
      sesi: sesi,
      santriId: santri.id,
      santriNama: santri.nama,
      program: santri.program,
      halaqah: santri.halaqah,
      status: 'Hadir (Setor)',
      keterangan: `Setor ${jenis} (QS. ${suratNama})`,
      dicatatOleh: penyimak
    });
  }

  // Update Santri Progress automatically!
  updateSantriProgressFromSetoran(santri, setoranData);

  saveToStorage();
  closeModalSetoran();
  renderAll();
  showToast(`Setoran ananda ${santri.nama} berhasil dicatat!`, "success");
}

function updateSantriProgressFromSetoran(santri, setoran) {
  if (santri.program === 'Binnadzor' || santri.program === 'Program Maqbul') {
    if (!santri.binnadzorProgress) {
      santri.binnadzorProgress = {
        terakhirBacaan: "",
        hafalanJuz30: 0,
        hafalanJuz29: 0,
        hafalanJuz28: 0,
        hafalanSuratPilihan: { yasin: 0, arRahman: 0, alWaqiah: 0, alMulk: 0 },
        statusTesMaqbul: "Belum",
        statusWisuda: "Belum"
      };
    }
    if (!santri.binnadzorProgress.hafalanSuratPilihan) {
      santri.binnadzorProgress.hafalanSuratPilihan = { yasin: 0, arRahman: 0, alWaqiah: 0, alMulk: 0 };
    }

    if (setoran.jenisSetoran.includes('Juz 30')) {
      santri.binnadzorProgress.hafalanJuz30 = Math.min(100, (santri.binnadzorProgress.hafalanJuz30 || 0) + 15);
    } else if (setoran.jenisSetoran.includes('Juz 29')) {
      santri.binnadzorProgress.hafalanJuz29 = Math.min(100, (santri.binnadzorProgress.hafalanJuz29 || 0) + 15);
    } else if (setoran.jenisSetoran.includes('Juz 28')) {
      santri.binnadzorProgress.hafalanJuz28 = Math.min(100, (santri.binnadzorProgress.hafalanJuz28 || 0) + 15);
    } else if (setoran.jenisSetoran.includes('Bacaan')) {
      santri.binnadzorProgress.terakhirBacaan = `Juz ${setoran.juz}, QS. ${setoran.suratNama} ayat ${setoran.ayatAkhir}`;
    }

    // Update Surat Pilihan
    if (setoran.suratNo === 36) {
      santri.binnadzorProgress.hafalanSuratPilihan.yasin = 100;
    } else if (setoran.suratNo === 55) {
      santri.binnadzorProgress.hafalanSuratPilihan.arRahman = 100;
    } else if (setoran.suratNo === 56) {
      santri.binnadzorProgress.hafalanSuratPilihan.alWaqiah = 100;
    } else if (setoran.suratNo === 67) {
      santri.binnadzorProgress.hafalanSuratPilihan.alMulk = 100;
    }

    // Check if eligible for Tes Maqbul (Juz 28-30 tuntas & bacaan lancar)
    if (santri.binnadzorProgress.hafalanJuz30 >= 100 &&
        santri.binnadzorProgress.hafalanJuz29 >= 100 &&
        santri.binnadzorProgress.hafalanJuz28 >= 100 &&
        santri.binnadzorProgress.statusTesMaqbul === 'Belum') {
      santri.binnadzorProgress.statusTesMaqbul = 'Layak Tes Maqbul';
      showToast(`Mubarak! Ananda ${santri.nama} tuntas Juz 28-30 & Surat Pilihan, siap mengikuti Tes Maqbul triwulanan!`, "info");
    }

  } else if (santri.program === 'Pasca Tahfidz') {
    // Pasca Tahfidz progress tracking
    if (!santri.pascaTahfidzProgress) {
      santri.pascaTahfidzProgress = {
        ustadzPengampu: santri.halaqah,
        tasmi5Juz: false,
        tasmi10Juz: false,
        tasmi15Juz: false,
        tasmi20Juz: false,
        tasmi30JuzSekaliDuduk: false,
        statusSanad: "Dalam Bimbingan Mutqin 30 Juz",
        terakhirTasmi: ""
      };
    }

    const jn = setoran.jenisSetoran;
    if (jn.includes("5 Juz")) {
      santri.pascaTahfidzProgress.tasmi5Juz = true;
      santri.pascaTahfidzProgress.tanggalTasmi5Juz = setoran.tanggal;
      santri.pascaTahfidzProgress.nilaiTasmi5Juz = setoran.nilai;
      santri.pascaTahfidzProgress.terakhirTasmi = "Tasmi' 5 Juz Bil-Ghaib Sekali Duduk";
      showToast(`🎉 Mubarak! Capaian Tasmi' 5 Juz ananda ${santri.nama} berhasil dicatat!`, "success");
    } else if (jn.includes("10 Juz")) {
      santri.pascaTahfidzProgress.tasmi10Juz = true;
      santri.pascaTahfidzProgress.tanggalTasmi10Juz = setoran.tanggal;
      santri.pascaTahfidzProgress.nilaiTasmi10Juz = setoran.nilai;
      santri.pascaTahfidzProgress.terakhirTasmi = "Tasmi' 10 Juz Bil-Ghaib Sekali Duduk";
      showToast(`🎉 Mubarak! Capaian Tasmi' 10 Juz ananda ${santri.nama} berhasil dicatat!`, "success");
    } else if (jn.includes("15 Juz")) {
      santri.pascaTahfidzProgress.tasmi15Juz = true;
      santri.pascaTahfidzProgress.tanggalTasmi15Juz = setoran.tanggal;
      santri.pascaTahfidzProgress.nilaiTasmi15Juz = setoran.nilai;
      santri.pascaTahfidzProgress.terakhirTasmi = "Tasmi' 15 Juz Bil-Ghaib Sekali Duduk";
      showToast(`🎉 Mubarak! Capaian Tasmi' 15 Juz ananda ${santri.nama} berhasil dicatat!`, "success");
    } else if (jn.includes("20 Juz")) {
      santri.pascaTahfidzProgress.tasmi20Juz = true;
      santri.pascaTahfidzProgress.tanggalTasmi20Juz = setoran.tanggal;
      santri.pascaTahfidzProgress.nilaiTasmi20Juz = setoran.nilai;
      santri.pascaTahfidzProgress.terakhirTasmi = "Tasmi' 20 Juz Bil-Ghaib Sekali Duduk";
      showToast(`🎉 Mubarak! Capaian Tasmi' 20 Juz ananda ${santri.nama} berhasil dicatat!`, "success");
    } else if (jn.includes("30 Juz")) {
      santri.pascaTahfidzProgress.tasmi30JuzSekaliDuduk = true;
      santri.pascaTahfidzProgress.tanggalTasmi30Juz = setoran.tanggal;
      santri.pascaTahfidzProgress.nilaiTasmi30Juz = setoran.nilai;
      santri.pascaTahfidzProgress.terakhirTasmi = "Tasmi' 30 Juz Bil-Ghaib Sekali Duduk (Khotmil Akbar)";
      santri.pascaTahfidzProgress.statusSanad = "Lulus Tasmi' 30 Juz • Siap Ijazah Sanad Resmi";
      showToast(`👑 ALLAHU AKBAR! Ananda ${santri.nama} lulus Tasmi' 30 Juz sekali duduk!`, "success");
    }

  } else {
    // Tahfidz Program
    if (!santri.tahfidzProgress) {
      santri.tahfidzProgress = {
        totalJuzHafal: 3,
        juzMutqinList: [28, 29, 30],
        juzZiyadahList: [28, 29, 30],
        terakhirSetor: "",
        targetJuz: 30
      };
    }

    santri.tahfidzProgress.terakhirSetor = `Juz ${setoran.juz}, QS. ${setoran.suratNama} ayat ${setoran.ayatAkhir}`;

    if (setoran.jenisSetoran === 'Ziyadah') {
      if (!santri.tahfidzProgress.juzZiyadahList.includes(setoran.juz)) {
        santri.tahfidzProgress.juzZiyadahList.push(setoran.juz);
        santri.tahfidzProgress.totalJuzHafal = santri.tahfidzProgress.juzZiyadahList.length;
      }
    }

    if (setoran.nilai === 'Mumtaz (A)' && (setoran.jenisSetoran === "Tasmi' Sekali Duduk" || setoran.jenisSetoran === "Muraja'ah")) {
      if (!santri.tahfidzProgress.juzMutqinList.includes(setoran.juz)) {
        santri.tahfidzProgress.juzMutqinList.push(setoran.juz);
      }
    }
  }
}

function editSetoran(id) {
  const item = AppState.setoran.find(s => s.id === id);
  if (!item) return;

  openModalSetoran(item.santriId);
  document.getElementById('formSetoranId').value = item.id;
  document.getElementById('modalSetoranTitle').textContent = '✏️ Edit Setoran Hafalan';

  document.getElementById('formSetoranTanggal').value = item.tanggal;
  document.getElementById('formSetoranSesi').value = item.sesi;
  document.getElementById('formSetoranJenis').value = item.jenisSetoran;
  document.getElementById('formSetoranJuz').value = item.juz;
  populateSurahDropdown(item.juz);
  document.getElementById('formSetoranSurat').value = item.suratNo;
  document.getElementById('formSetoranAyatAwal').value = item.ayatAwal;
  document.getElementById('formSetoranAyatAkhir').value = item.ayatAkhir;
  document.getElementById('formSetoranHalaman').value = item.halaman || '';
  document.getElementById('formSetoranNilai').value = item.nilai;
  document.getElementById('formSetoranPenyimak').value = item.penyimak;
  document.getElementById('formSetoranCatatan').value = item.catatan || '';
}

function hapusSetoran(id) {
  if (confirm("Apakah Anda yakin ingin menghapus data setoran ini?")) {
    AppState.setoran = AppState.setoran.filter(s => s.id !== id);
    saveToStorage();
    if (typeof pushLocalToCloud === 'function') {
      pushLocalToCloud(true);
    }
    renderAll();
    showToast("Data setoran berhasil dihapus.", "info");
  }
}

// ================= FITUR MULTI-SELECT SETORAN =================
function toggleSelectAllSetoran(checked) {
  document.querySelectorAll('.check-setoran-item').forEach(cb => {
    cb.checked = checked;
  });
  updateSelectedSetoranUI();
}

function updateSelectedSetoranUI() {
  const allBoxes = Array.from(document.querySelectorAll('.check-setoran-item'));
  const checkedBoxes = allBoxes.filter(cb => cb.checked);
  const count = checkedBoxes.length;

  const checkAll = document.getElementById('checkAllSetoran');
  if (checkAll) {
    checkAll.checked = allBoxes.length > 0 && count === allBoxes.length;
    checkAll.indeterminate = count > 0 && count < allBoxes.length;
  }

  const bar = document.getElementById('setoranBulkActionBar');
  if (!bar) return;

  if (count === 0) {
    bar.style.display = 'none';
    bar.innerHTML = '';
    return;
  }

  bar.style.display = 'flex';
  bar.innerHTML = `
    <span class="bulk-count-badge">✓ Terpilih: <strong>${count}</strong> data setoran</span>
    <button type="button" class="bulk-btn bulk-btn-danger" onclick="hapusSetoranBulk()">🗑️ Hapus Setoran Terpilih</button>
    <button type="button" class="bulk-btn bulk-btn-secondary" onclick="batalPilihSetoran()">Batal</button>
  `;
}

function batalPilihSetoran() {
  document.querySelectorAll('.check-setoran-item').forEach(cb => { cb.checked = false; });
  const checkAll = document.getElementById('checkAllSetoran');
  if (checkAll) { checkAll.checked = false; checkAll.indeterminate = false; }
  updateSelectedSetoranUI();
}

function hapusSetoranBulk() {
  const checkedBoxes = Array.from(document.querySelectorAll('.check-setoran-item:checked'));
  const ids = checkedBoxes.map(cb => cb.value);
  if (ids.length === 0) return;
  if (!confirm(`Hapus ${ids.length} data riwayat setoran terpilih? Tindakan ini tidak dapat dibatalkan.`)) return;

  AppState.setoran = AppState.setoran.filter(s => !ids.includes(s.id));
  saveToStorage();
  if (typeof pushLocalToCloud === 'function') {
    pushLocalToCloud(true);
  }
  renderAll();
  showToast(`${ids.length} data setoran berhasil dihapus.`, "info");
}

// ================= 4. DATA SANTRI =================
function renderSantriTable() {
  const search = document.getElementById('santriSearch')?.value?.toLowerCase() || '';
  const progFilter = document.getElementById('santriFilterProgram')?.value || '';
  const halaqahFilter = document.getElementById('santriFilterHalaqah')?.value || '';
  const kelasFilter = document.getElementById('santriFilterKelasSekolah')?.value || '';

  // Dinamiskan opsi Filter Kelas Sekolah
  const filterKelasEl = document.getElementById('santriFilterKelasSekolah');
  if (filterKelasEl && filterKelasEl.options.length <= 1) {
    const listKelas = Array.from(new Set(AppState.santri.map(s => s.kelasSekolah).filter(Boolean))).sort((a,b) => {
      const na = parseInt(a, 10); const nb = parseInt(b, 10);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return String(a).localeCompare(String(b));
    });
    listKelas.forEach(k => {
      const opt = document.createElement('option');
      opt.value = k;
      opt.textContent = `Kelas ${k}`;
      filterKelasEl.appendChild(opt);
    });
  }

  const tbody = document.getElementById('tableSantriBody');
  tbody.innerHTML = '';

  let filtered = AppState.santri.filter(s => {
    const matchSearch = !search || 
      s.nama.toLowerCase().includes(search) || 
      s.nis.toLowerCase().includes(search) || 
      (s.kelasSekolah && s.kelasSekolah.toLowerCase().includes(search)) ||
      (s.asrama && s.asrama.toLowerCase().includes(search)) ||
      (s.namaWali && s.namaWali.toLowerCase().includes(search));

    let matchProg = true;
    if (progFilter === 'Siap Wisuda') {
      matchProg = s.program === 'Binnadzor' && s.binnadzorProgress?.statusWisuda === 'Siap Wisuda';
    } else if (progFilter) {
      matchProg = s.program === progFilter;
    }

    const matchHalaqah = !halaqahFilter || s.halaqah === halaqahFilter;
    const matchKelas = !kelasFilter || s.kelasSekolah === kelasFilter;
    return matchSearch && matchProg && matchHalaqah && matchKelas;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="empty-state">Tidak ada data santri yang cocok.</td></tr>`;
    updateSelectedSantriUI();
    return;
  }

  filtered.forEach(s => {
    let badgeProgram = '';
    if (s.program === 'Binnadzor') {
      badgeProgram = `<span class="badge badge-binnadzor">Binnadzor</span>`;
    } else if (s.program === 'Program Maqbul') {
      badgeProgram = `<span class="badge" style="background:#fef3c7; color:#b45309; font-weight:700;">Program Maqbul</span>`;
    } else if (s.program === 'Pasca Tahfidz') {
      badgeProgram = `<span class="badge" style="background:#fef3c7; color:#92400e; font-weight:700; border:1px solid #fcd34d;">👑 Pasca Tahfidz</span>`;
    } else {
      badgeProgram = `<span class="badge badge-tahfidz">Tahfidz</span>`;
    }

    let capaianHtml = '';
    if (s.program === 'Binnadzor' || s.program === 'Program Maqbul') {
      const p = s.binnadzorProgress || {};
      const sp = p.hafalanSuratPilihan || {};
      const avg = Math.round(((p.hafalanJuz30 || 0) + (p.hafalanJuz29 || 0) + (p.hafalanJuz28 || 0)) / 3);
      capaianHtml = `
        <div style="font-size:12px;">
          <div>Bacaan: <strong>${escapeHtml(p.terakhirBacaan || 'Belum ada')}</strong></div>
          <div style="font-size:11px; color:var(--dark-500); margin-top:2px;">
            Hafalan Juz 28-30: <strong>${avg}%</strong> (J30: ${p.hafalanJuz30 || 0}%, J29: ${p.hafalanJuz29 || 0}%, J28: ${p.hafalanJuz28 || 0}%)
          </div>
          <div style="font-size:10.5px; color:#047857; margin-top:2px;">
            Surat Pilihan: Ysn (${sp.yasin || 0}%), Rhm (${sp.arRahman || 0}%), Wqh (${sp.alWaqiah || 0}%), Mlk (${sp.alMulk || 0}%)
          </div>
        </div>
      `;
    } else if (s.program === 'Pasca Tahfidz') {
      const pst = s.pascaTahfidzProgress || {};
      const tasmiList = [];
      if (pst.tasmi5Juz) tasmiList.push("5J");
      if (pst.tasmi10Juz) tasmiList.push("10J");
      if (pst.tasmi15Juz) tasmiList.push("15J");
      if (pst.tasmi20Juz) tasmiList.push("20J");
      if (pst.tasmi30JuzSekaliDuduk) tasmiList.push("30J");

      capaianHtml = `
        <div style="font-size:12px;">
          <div>Hafalan: <strong style="color:#059669;">Khatam 30 Juz</strong> (Mutqin)</div>
          <div style="font-size:11px; color:#b45309; margin-top:2px;">
            Tasmi': <strong>${tasmiList.length > 0 ? tasmiList.join(" • ") : "Persiapan 5 Juz"}</strong>
          </div>
          <div style="font-size:10.5px; color:#64748b; margin-top:2px;">
            ${escapeHtml(pst.statusSanad || "Bimbingan Sanad Al-Qur'an")}
          </div>
        </div>
      `;
    } else {
      const tp = s.tahfidzProgress || {};
      const totalJuz = tp.totalJuzHafal || (tp.juzZiyadahList ? tp.juzZiyadahList.length : 0);
      capaianHtml = `
        <div style="font-size:12px;">
          <div>Total Hafal: <strong style="color:var(--tahfidz-color);">${totalJuz} / 30 Juz</strong></div>
          <div style="font-size:11px; color:var(--dark-500); margin-top:2px;">
            Mutqin: ${tp.juzMutqinList?.length || 0} Juz • Terakhir: ${escapeHtml(tp.terakhirSetor || '-')}
          </div>
        </div>
      `;
    }

    let statusWisudaHtml = '';

    if (s.program === 'Binnadzor') {
      const p = s.binnadzorProgress || {};
      const avg = Math.round(((p.hafalanJuz30 || 0) + (p.hafalanJuz29 || 0) + (p.hafalanJuz28 || 0)) / 3);
      
      let tombolWisuda = '';
      if (p.statusWisuda === 'Siap Wisuda' || avg >= 100) {
        tombolWisuda = `
          <button class="btn btn-gold btn-sm" style="margin-top:4px; display:block; font-size:10px; padding:3px 8px;" onclick="openModalWisudaAction('${s.id}')">
            Wisudakan →
          </button>
        `;
      }

      statusWisudaHtml = `
        <span class="badge" style="background:#f1f5f9; color:#475569; font-weight:600; border:1px solid #cbd5e1;">Belum Wisuda Binnadzor</span>
        ${tombolWisuda}
      `;

    } else if (s.program === 'Program Maqbul') {
      statusWisudaHtml = `
        <span class="badge" style="background:#fff7ed; color:#c2410c; font-weight:700; border:1px solid #fed7aa;">Persiapan Wisuda Binnadzor</span>
        <button class="btn btn-gold btn-sm" style="margin-top:4px; display:block; font-size:10px; padding:3px 8px;" onclick="openModalWisudaAction('${s.id}')">
          Wisudakan →
        </button>
      `;

    } else if (s.program === 'Pasca Tahfidz') {
      const tglTahfidz = s.pascaTahfidzProgress?.tanggalWisudaTahfidz || s.tanggalWisudaTahfidz || '2024-03-25';
      statusWisudaHtml = `
        <span class="badge" style="background:#fef3c7; color:#92400e; font-weight:700; border:1px solid #fde68a;">Telah Wisuda Tahfidz</span>
        <div style="font-size:11px; color:#78350f; margin-top:3px; font-weight:500;">📅 ${formatTanggalIndo(tglTahfidz)}</div>
      `;

    } else {
      // Tahfidz
      const tglBinnadzor = s.binnadzorProgress?.tanggalWisuda || s.tanggalWisudaBinnadzor || '2023-12-20';
      const tp = s.tahfidzProgress || {};
      const totalJuz = tp.totalJuzHafal || (tp.juzZiyadahList ? tp.juzZiyadahList.length : 0);
      
      let tombolWisuda30 = '';
      if (totalJuz >= 30 && tp.statusWisudaTahfidz !== 'Sudah Wisuda Tahfidz') {
        tombolWisuda30 = `
          <button class="btn btn-gold btn-sm" style="margin-top:4px; display:block; font-size:10px; padding:3px 8px;" onclick="openModalWisudaTahfidzAction('${s.id}')">
            Wisuda 30 Juz →
          </button>
        `;
      }

      statusWisudaHtml = `
        <span class="badge" style="background:#ecfdf5; color:#065f46; font-weight:700; border:1px solid #a7f3d0;">Telah Wisuda Binnadzor</span>
        <div style="font-size:11px; color:#64748b; margin-top:3px; font-weight:500;">📅 ${formatTanggalIndo(tglBinnadzor)}</div>
        ${tombolWisuda30}
      `;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align:center;"><input type="checkbox" class="check-santri-item" value="${s.id}" onchange="updateSelectedSantriUI()"></td>
      <td><strong>${escapeHtml(s.nis)}</strong></td>
      <td>
        <strong style="font-size:13.5px;">${escapeHtml(s.nama)}</strong>
        <div style="font-size:11.5px; color:var(--dark-500);">Wali: ${escapeHtml(s.namaWali || '-')} (${escapeHtml(s.noHpWali || '-')})</div>
      </td>
      <td><span class="badge" style="background:var(--light-200);">${s.jenisKelamin === 'L' ? 'L (Putra)' : 'P (Putri)'}</span></td>
      <td>
        <span class="badge" style="background:#e0f2fe; color:#0369a1; font-weight:700; font-size:11.5px; padding:3px 8px; border-radius:6px;">
          ${s.kelasSekolah ? 'Kelas ' + escapeHtml(s.kelasSekolah) : '-'}
        </span>
      </td>
      <td>${badgeProgram}</td>
      <td style="font-size:12px;">
        <div style="font-weight:600; color:#0f172a;">${escapeHtml(s.halaqah || '-')}</div>
        <div style="font-size:11px; color:var(--dark-500); margin-top:2px;">🏠 ${escapeHtml(s.asrama || '-')}</div>
      </td>
      <td>${capaianHtml}</td>
      <td style="text-align:center;">${statusWisudaHtml}</td>
      <td style="text-align:center;">
        <div style="display:flex; gap:4px; justify-content:center;">
          <button class="btn btn-secondary btn-sm" onclick="lihatMutabaahSantri('${s.id}')" title="Peta Hafalan 30 Juz">🗺️</button>
          <button class="btn btn-secondary btn-sm" onclick="editSantri('${s.id}')" title="Edit Data">✏️</button>
          <button class="btn btn-secondary btn-sm" onclick="hapusSantri('${s.id}')" title="Hapus" style="color:var(--danger);">🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  updateSelectedSantriUI();
}

function openModalSantri(santriId = null) {
  const form = document.getElementById('formSantri');
  form.reset();
  document.getElementById('formSantriId').value = '';

  // Populate Halaqah Dropdown
  const halaqahSelect = document.getElementById('formSantriHalaqah');
  halaqahSelect.innerHTML = '';
  (AppState.settings.daftarHalaqah || []).forEach(h => {
    const opt = document.createElement('option');
    opt.value = h;
    opt.textContent = h;
    halaqahSelect.appendChild(opt);
  });

  if (santriId) {
    const s = AppState.santri.find(item => item.id === santriId);
    if (!s) return;
    document.getElementById('modalSantriTitle').textContent = '✏️ Edit Data Santri';
    document.getElementById('formSantriId').value = s.id;
    document.getElementById('formSantriNis').value = s.nis;
    document.getElementById('formSantriJK').value = s.jenisKelamin;
    document.getElementById('formSantriNama').value = s.nama;
    document.getElementById('formSantriProgram').value = s.program;
    onProgramSantriFormChange();
    document.getElementById('formSantriHalaqah').value = s.halaqah || '';
    document.getElementById('formSantriKelasSekolah').value = s.kelasSekolah || '';
    document.getElementById('formSantriAsrama').value = s.asrama || '';
    document.getElementById('formSantriTanggalMasuk').value = s.tanggalMasuk || '';
    document.getElementById('formSantriNamaWali').value = s.namaWali || '';
    document.getElementById('formSantriNoHpWali').value = s.noHpWali || '';

    if (s.program === 'Tahfidz') {
      document.getElementById('sectionWisudaFields').style.display = 'block';
      document.getElementById('formSantriTanggalWisuda').value = s.binnadzorProgress?.tanggalWisuda || '';
      document.getElementById('formSantriNoIjazah').value = s.binnadzorProgress?.noIjazah || '';
      const secPasca = document.getElementById('sectionPascaTahfidzFields');
      if (secPasca) secPasca.style.display = 'none';
    } else if (s.program === 'Pasca Tahfidz') {
      document.getElementById('sectionWisudaFields').style.display = 'none';
      const secPasca = document.getElementById('sectionPascaTahfidzFields');
      if (secPasca) {
        secPasca.style.display = 'block';
        document.getElementById('formSantriTanggalWisudaTahfidz').value = s.tahfidzProgress?.tanggalWisudaTahfidz || '';
        document.getElementById('formSantriNoIjazahTahfidz').value = s.tahfidzProgress?.noIjazahTahfidz || '';
        const pst = s.pascaTahfidzProgress || {};
        const chk5 = document.getElementById('formSantriTasmi5'); if (chk5) chk5.checked = !!pst.tasmi5Juz;
        const chk10 = document.getElementById('formSantriTasmi10'); if (chk10) chk10.checked = !!pst.tasmi10Juz;
        const chk15 = document.getElementById('formSantriTasmi15'); if (chk15) chk15.checked = !!pst.tasmi15Juz;
        const chk20 = document.getElementById('formSantriTasmi20'); if (chk20) chk20.checked = !!pst.tasmi20Juz;
        const chk30 = document.getElementById('formSantriTasmi30'); if (chk30) chk30.checked = !!pst.tasmi30JuzSekaliDuduk;
        const elSanad = document.getElementById('formSantriStatusSanad'); if (elSanad) elSanad.value = pst.statusSanad || '';
      }
    } else {
      document.getElementById('sectionWisudaFields').style.display = 'none';
      const secPasca = document.getElementById('sectionPascaTahfidzFields');
      if (secPasca) secPasca.style.display = 'none';
    }

  } else {
    document.getElementById('modalSantriTitle').textContent = '👥 Tambah Data Santri Baru';
    document.getElementById('formSantriTanggalMasuk').value = new Date().toISOString().split('T')[0];
    document.getElementById('formSantriProgram').value = 'Binnadzor';
    onProgramSantriFormChange();
    document.getElementById('sectionWisudaFields').style.display = 'none';
  }

  document.getElementById('modalSantri').classList.add('active');
}

function closeModalSantri() {
  document.getElementById('modalSantri').classList.remove('active');
}

function onProgramSantriFormChange() {
  const prog = document.getElementById('formSantriProgram').value;
  const label = document.getElementById('formSantriHalaqahLabel');
  const halaqahSelect = document.getElementById('formSantriHalaqah');
  const curVal = halaqahSelect.value;
  halaqahSelect.innerHTML = '';

  if (prog === 'Pasca Tahfidz') {
    if (label) label.innerHTML = `Halaqah Ustadz Pengampu Pasca Tahfidz <span style="color:red;">*</span>`;
    const list = AppState.settings.daftarHalaqahPascaTahfidz || DEFAULT_SETTINGS.daftarHalaqahPascaTahfidz || [];
    list.forEach(h => {
      const opt = document.createElement('option');
      opt.value = h;
      opt.textContent = h;
      halaqahSelect.appendChild(opt);
    });
    const secWisuda = document.getElementById('sectionWisudaFields');
    if (secWisuda) secWisuda.style.display = 'none';
    const secPasca = document.getElementById('sectionPascaTahfidzFields');
    if (secPasca) secPasca.style.display = 'block';
  } else if (prog === 'Tahfidz') {
    if (label) label.innerHTML = `Halaqah Ustadz Pembimbing Tahfidz <span style="color:red;">*</span>`;
    const list = AppState.settings.daftarHalaqahTahfidz || DEFAULT_SETTINGS.daftarHalaqahTahfidz || [];
    list.forEach(h => {
      const opt = document.createElement('option');
      opt.value = h;
      opt.textContent = h;
      halaqahSelect.appendChild(opt);
    });
    const secWisuda = document.getElementById('sectionWisudaFields');
    if (secWisuda) secWisuda.style.display = 'block';
    const secPasca = document.getElementById('sectionPascaTahfidzFields');
    if (secPasca) secPasca.style.display = 'none';
  } else if (prog === 'Program Maqbul') {
    if (label) label.innerHTML = `Kelas Asal Binnadzor (Tahap Program Maqbul) <span style="color:red;">*</span>`;
    const list = AppState.settings.daftarKelasBinnadzor || DEFAULT_SETTINGS.daftarKelasBinnadzor || [];
    list.forEach(h => {
      const opt = document.createElement('option');
      opt.value = h;
      opt.textContent = h;
      halaqahSelect.appendChild(opt);
    });
    const sec = document.getElementById('sectionWisudaFields');
    if (sec) sec.style.display = 'none';
  } else {
    // Binnadzor
    if (label) label.innerHTML = `Kelas Binnadzor & Ustadz Pembimbing <span style="color:red;">*</span>`;
    const list = AppState.settings.daftarKelasBinnadzor || DEFAULT_SETTINGS.daftarKelasBinnadzor || [];
    list.forEach(h => {
      const opt = document.createElement('option');
      opt.value = h;
      opt.textContent = h;
      halaqahSelect.appendChild(opt);
    });
    const sec = document.getElementById('sectionWisudaFields');
    if (sec) sec.style.display = 'none';
  }

  if (curVal && Array.from(halaqahSelect.options).some(o => o.value === curVal)) {
    halaqahSelect.value = curVal;
  }
}

function toggleFormSantriWisudaFields() {
  onProgramSantriFormChange();
}

function simpanFormSantri(e) {
  e.preventDefault();
  const id = document.getElementById('formSantriId').value;
  const nis = document.getElementById('formSantriNis').value.trim();
  const nama = document.getElementById('formSantriNama').value.trim();
  const jk = document.getElementById('formSantriJK').value;
  const program = document.getElementById('formSantriProgram').value;
  const halaqah = document.getElementById('formSantriHalaqah').value;
  const kelasSekolah = document.getElementById('formSantriKelasSekolah')?.value?.trim() || '';
  const asrama = document.getElementById('formSantriAsrama').value.trim();
  const tglMasuk = document.getElementById('formSantriTanggalMasuk').value;
  const namaWali = document.getElementById('formSantriNamaWali').value.trim();
  const noHpWali = document.getElementById('formSantriNoHpWali').value.trim();

  let targetSantri = id ? AppState.santri.find(s => s.id === id) : null;

  if (targetSantri) {
    targetSantri.nis = nis;
    targetSantri.nama = nama;
    targetSantri.jenisKelamin = jk;
    targetSantri.program = program;
    targetSantri.halaqah = halaqah;
    targetSantri.kelasSekolah = kelasSekolah;
    targetSantri.asrama = asrama;
    targetSantri.tanggalMasuk = tglMasuk;
    targetSantri.namaWali = namaWali;
    targetSantri.noHpWali = noHpWali;

    if (program === 'Tahfidz') {
      if (!targetSantri.binnadzorProgress) targetSantri.binnadzorProgress = {};
      targetSantri.binnadzorProgress.tanggalWisuda = document.getElementById('formSantriTanggalWisuda')?.value || new Date().toISOString().split('T')[0];
      targetSantri.binnadzorProgress.noIjazah = document.getElementById('formSantriNoIjazah')?.value || ('WIS-BNZ-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 900 + 100));
      targetSantri.binnadzorProgress.statusWisuda = 'Sudah Wisuda';
      if (!targetSantri.tahfidzProgress || !targetSantri.tahfidzProgress.totalJuzHafal) {
        targetSantri.tahfidzProgress = {
          totalJuzHafal: 3,
          juzMutqinList: [28, 29, 30],
          juzZiyadahList: [28, 29, 30],
          terakhirSetor: "Wisuda Binnadzor (Juz 28, 29, 30 Mutqin)",
          targetJuz: 30
        };
      }
    } else if (program === 'Program Maqbul') {
      if (!targetSantri.binnadzorProgress) targetSantri.binnadzorProgress = {};
      if (!targetSantri.binnadzorProgress.statusTesMaqbul) {
        targetSantri.binnadzorProgress.statusTesMaqbul = 'Lolos Tes Maqbul';
        targetSantri.binnadzorProgress.tanggalTesMaqbul = new Date().toISOString().split('T')[0];
        targetSantri.binnadzorProgress.nilaiTesMaqbul = 'Mumtaz (A)';
        targetSantri.binnadzorProgress.statusWisuda = 'Siap Wisuda';
      }
    } else if (program === 'Pasca Tahfidz') {
      if (!targetSantri.tahfidzProgress) targetSantri.tahfidzProgress = { totalJuzHafal: 30, juzMutqinList: [], juzZiyadahList: [] };
      targetSantri.tahfidzProgress.tanggalWisudaTahfidz = document.getElementById('formSantriTanggalWisudaTahfidz')?.value || '';
      targetSantri.tahfidzProgress.noIjazahTahfidz = document.getElementById('formSantriNoIjazahTahfidz')?.value || '';
      targetSantri.tahfidzProgress.statusWisudaTahfidz = 'Sudah Wisuda Tahfidz';
      if (!targetSantri.pascaTahfidzProgress) targetSantri.pascaTahfidzProgress = {};
      targetSantri.pascaTahfidzProgress.ustadzPengampu = halaqah;
      targetSantri.pascaTahfidzProgress.tasmi5Juz = !!document.getElementById('formSantriTasmi5')?.checked;
      targetSantri.pascaTahfidzProgress.tasmi10Juz = !!document.getElementById('formSantriTasmi10')?.checked;
      targetSantri.pascaTahfidzProgress.tasmi15Juz = !!document.getElementById('formSantriTasmi15')?.checked;
      targetSantri.pascaTahfidzProgress.tasmi20Juz = !!document.getElementById('formSantriTasmi20')?.checked;
      targetSantri.pascaTahfidzProgress.tasmi30JuzSekaliDuduk = !!document.getElementById('formSantriTasmi30')?.checked;
      targetSantri.pascaTahfidzProgress.statusSanad = document.getElementById('formSantriStatusSanad')?.value || '';
    }

  } else {
    // New Santri
    const newId = (program === 'Binnadzor' ? 'STR-BNZ-' : 'STR-THF-') + Date.now();
    const newSantri = {
      id: newId,
      nis: nis,
      nama: nama,
      jenisKelamin: jk,
      program: program,
      halaqah: halaqah,
      kelasSekolah: kelasSekolah,
      asrama: asrama,
      namaWali: namaWali,
      noHpWali: noHpWali,
      tanggalMasuk: tglMasuk,
      statusSantri: "Aktif",
      binnadzorProgress: {
        terakhirBacaan: program === 'Tahfidz' ? "Khatam 30 Juz Bi-Nadzor" : "Juz 1",
        hafalanJuz30: program === 'Tahfidz' ? 100 : 0,
        hafalanJuz29: program === 'Tahfidz' ? 100 : 0,
        hafalanJuz28: program === 'Tahfidz' ? 100 : 0,
        statusWisuda: program === 'Tahfidz' ? "Sudah Wisuda" : "Belum",
        tanggalWisuda: program === 'Tahfidz' ? document.getElementById('formSantriTanggalWisuda').value : null,
        noIjazah: program === 'Tahfidz' ? document.getElementById('formSantriNoIjazah').value : null,
        predikatWisuda: program === 'Tahfidz' ? "Mumtaz (A)" : null
      },
      tahfidzProgress: {
        totalJuzHafal: program === 'Tahfidz' ? 3 : 0,
        juzMutqinList: program === 'Tahfidz' ? [28, 29, 30] : [],
        juzZiyadahList: program === 'Tahfidz' ? [28, 29, 30] : [],
        targetJuz: 30
      }
    };
    AppState.santri.push(newSantri);
  }

  if (typeof unrecordDeletedSantriId === 'function') {
    unrecordDeletedSantriId(id || (targetSantri ? targetSantri.id : null));
  }

  saveToStorage();
  closeModalSantri();
  renderAll();
  showToast(`Data santri ${nama} berhasil disimpan!`, "success");
}

function editSantri(id) {
  openModalSantri(id);
}

function hapusSantri(id) {
  const s = AppState.santri.find(item => item.id === id);
  if (!s) return;
  if (confirm(`Yakin ingin menghapus santri ${s.nama}? Seluruh riwayat setoran terkait akan tetap tersimpan di arsip.`)) {
    if (typeof recordDeletedSantriId === 'function') {
      recordDeletedSantriId(id);
    } else {
      try {
        const list = JSON.parse(localStorage.getItem('sitahfidz_deleted_santri_ids') || '[]');
        if (!list.includes(id)) {
          list.push(id);
          localStorage.setItem('sitahfidz_deleted_santri_ids', JSON.stringify(list));
        }
      } catch (e) {}
    }
    AppState.santri = AppState.santri.filter(item => item.id !== id);
    saveToStorage();
    if (typeof pushLocalToCloud === 'function') {
      pushLocalToCloud(true);
    }
    renderAll();
    showToast(`Santri ${s.nama} telah dihapus.`, "info");
  }
}

// ================= FITUR MULTI-SELECT DATA SANTRI =================
function toggleSelectAllSantri(checked) {
  document.querySelectorAll('.check-santri-item').forEach(cb => {
    cb.checked = checked;
  });
  updateSelectedSantriUI();
}

function updateSelectedSantriUI() {
  const allBoxes = Array.from(document.querySelectorAll('.check-santri-item'));
  const checkedBoxes = allBoxes.filter(cb => cb.checked);
  const count = checkedBoxes.length;

  const checkAll = document.getElementById('checkAllSantri');
  if (checkAll) {
    checkAll.checked = allBoxes.length > 0 && count === allBoxes.length;
    checkAll.indeterminate = count > 0 && count < allBoxes.length;
  }

  const bar = document.getElementById('santriBulkActionBar');
  if (!bar) return;

  if (count === 0) {
    bar.style.display = 'none';
    bar.innerHTML = '';
    return;
  }

  bar.style.display = 'flex';
  bar.innerHTML = `
    <span class="bulk-count-badge">✓ Terpilih: <strong>${count}</strong> santri</span>
    <button type="button" class="bulk-btn bulk-btn-primary" onclick="bukaModalPindahHalaqahBulk()">🔄 Pindah Halaqah</button>
    <button type="button" class="bulk-btn bulk-btn-secondary" onclick="bukaModalUbahKelasBulk()">🏫 Ubah Kelas Sekolah</button>
    <button type="button" class="bulk-btn bulk-btn-danger" onclick="hapusSantriBulk()">🗑️ Hapus Santri Terpilih</button>
    <button type="button" class="bulk-btn bulk-btn-secondary" onclick="batalPilihSantri()">Batal</button>
  `;
}

function batalPilihSantri() {
  document.querySelectorAll('.check-santri-item').forEach(cb => { cb.checked = false; });
  const checkAll = document.getElementById('checkAllSantri');
  if (checkAll) { checkAll.checked = false; checkAll.indeterminate = false; }
  updateSelectedSantriUI();
}

function hapusSantriBulk() {
  const checkedBoxes = Array.from(document.querySelectorAll('.check-santri-item:checked'));
  const ids = checkedBoxes.map(cb => cb.value);
  if (ids.length === 0) return;
  if (!confirm(`Yakin ingin menghapus ${ids.length} santri terpilih? Seluruh data santri yang dipilih akan dibersihkan dari sistem dan cloud.`)) return;

  ids.forEach(id => {
    if (typeof recordDeletedSantriId === 'function') {
      recordDeletedSantriId(id);
    } else {
      try {
        const list = JSON.parse(localStorage.getItem('sitahfidz_deleted_santri_ids') || '[]');
        if (!list.includes(id)) {
          list.push(id);
          localStorage.setItem('sitahfidz_deleted_santri_ids', JSON.stringify(list));
        }
      } catch (e) {}
    }
  });

  AppState.santri = AppState.santri.filter(s => !ids.includes(s.id));
  saveToStorage();
  if (typeof pushLocalToCloud === 'function') {
    pushLocalToCloud(true);
  }
  renderAll();
  showToast(`${ids.length} santri berhasil dihapus.`, "info");
}

function bukaModalPindahHalaqahBulk() {
  const checkedBoxes = Array.from(document.querySelectorAll('.check-santri-item:checked'));
  const ids = checkedBoxes.map(cb => cb.value);
  if (ids.length === 0) return;

  const halaqahList = AppState.settings.daftarHalaqah || [];
  if (halaqahList.length === 0) {
    alert("Daftar halaqah belum dikonfigurasi di Pengaturan.");
    return;
  }

  const optionsPrompt = halaqahList.map((h, i) => `${i + 1}. ${h}`).join('\n');
  const pilihan = prompt(`Pilih nomor atau ketik nama Kelas / Halaqah baru untuk ${ids.length} santri terpilih:\n\n${optionsPrompt}`);
  if (!pilihan) return;

  let targetHalaqah = '';
  const num = parseInt(pilihan.trim(), 10);
  if (!isNaN(num) && num >= 1 && num <= halaqahList.length) {
    targetHalaqah = halaqahList[num - 1];
  } else if (pilihan.trim()) {
    targetHalaqah = pilihan.trim();
  }

  if (!targetHalaqah) return;

  ids.forEach(id => {
    const s = AppState.santri.find(item => item.id === id);
    if (s) s.halaqah = targetHalaqah;
  });

  saveToStorage();
  if (typeof pushLocalToCloud === 'function') {
    pushLocalToCloud(true);
  }
  renderAll();
  showToast(`${ids.length} santri berhasil dipindahkan ke: ${targetHalaqah}`, "success");
}

function bukaModalUbahKelasBulk() {
  const checkedBoxes = Array.from(document.querySelectorAll('.check-santri-item:checked'));
  const ids = checkedBoxes.map(cb => cb.value);
  if (ids.length === 0) return;

  const targetKelas = prompt(`Masukkan Kelas Sekolah baru untuk ${ids.length} santri terpilih:\n(Contoh: 7, 8, 9, 10, 11, 12, atau Kelas 7, dsb)`);
  if (targetKelas === null) return;
  const val = targetKelas.trim();

  ids.forEach(id => {
    const s = AppState.santri.find(item => item.id === id);
    if (s) s.kelasSekolah = val;
  });

  saveToStorage();
  if (typeof pushLocalToCloud === 'function') {
    pushLocalToCloud(true);
  }
  renderAll();
  showToast(`Kelas sekolah ${ids.length} santri berhasil diubah menjadi "${val}".`, "success");
}

// ================= KENAIKAN KELAS SEKOLAH (TAHUN AJARAN BARU) =================
function openModalKenaikanKelas() {
  const modal = document.getElementById('modalKenaikanKelas');
  if (!modal) return;

  // Ekstrak daftar kelas yang ada
  const selectAsal = document.getElementById('kenaikanKelasAsal');
  if (selectAsal) {
    selectAsal.innerHTML = '';
    const listKelas = Array.from(new Set(AppState.santri.map(s => s.kelasSekolah).filter(Boolean))).sort((a,b) => {
      const na = parseInt(a, 10); const nb = parseInt(b, 10);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return String(a).localeCompare(String(b));
    });

    if (listKelas.length === 0) {
      const opt = document.createElement('option');
      opt.value = "";
      opt.textContent = "Belum ada data kelas santri";
      selectAsal.appendChild(opt);
    } else {
      listKelas.forEach(k => {
        const opt = document.createElement('option');
        opt.value = k;
        opt.textContent = isNaN(parseInt(k, 10)) ? k : `Kelas ${k}`;
        selectAsal.appendChild(opt);
      });
    }
  }

  switchTabKenaikanKelas('per-tingkat');
  onKenaikanKelasAsalChange();
  modal.classList.add('active');
}

function closeModalKenaikanKelas() {
  const modal = document.getElementById('modalKenaikanKelas');
  if (modal) modal.classList.remove('active');
}

function switchTabKenaikanKelas(mode) {
  const tabPerTingkat = document.getElementById('tabKenaikanPerTingkat');
  const tabSerentak = document.getElementById('tabKenaikanSerentak');
  const btnPerTingkat = document.getElementById('tabBtnKenaikanPerTingkat');
  const btnSerentak = document.getElementById('tabBtnKenaikanSerentak');

  if (mode === 'serentak') {
    if (tabPerTingkat) tabPerTingkat.style.display = 'none';
    if (tabSerentak) tabSerentak.style.display = 'block';
    if (btnPerTingkat) { btnPerTingkat.className = 'btn btn-sm btn-secondary'; }
    if (btnSerentak) { btnSerentak.className = 'btn btn-sm btn-primary'; }
  } else {
    if (tabPerTingkat) tabPerTingkat.style.display = 'block';
    if (tabSerentak) tabSerentak.style.display = 'none';
    if (btnPerTingkat) { btnPerTingkat.className = 'btn btn-sm btn-primary'; }
    if (btnSerentak) { btnSerentak.className = 'btn btn-sm btn-secondary'; }
  }
}

function predictTargetKelas(kelasStr) {
  if (!kelasStr) return '';
  const num = parseInt(kelasStr.replace(/\D/g, ''), 10);
  if (!isNaN(num)) {
    if (num >= 12) return 'Alumni / Tamat';
    const nextNum = num + 1;
    if (/kelas/i.test(kelasStr)) {
      return `Kelas ${nextNum}`;
    }
    return String(nextNum);
  }
  return '';
}

function onKenaikanKelasAsalChange() {
  const selectAsal = document.getElementById('kenaikanKelasAsal');
  const inputTujuan = document.getElementById('kenaikanKelasTujuan');
  const tbody = document.getElementById('tableKenaikanSantriBody');
  const countSpan = document.getElementById('kenaikanCountSelected');
  const checkAll = document.getElementById('checkAllSantriKenaikan');

  if (!selectAsal || !tbody) return;
  const klsAsal = selectAsal.value;

  if (inputTujuan) {
    inputTujuan.value = predictTargetKelas(klsAsal);
  }

  tbody.innerHTML = '';
  if (!klsAsal) {
    tbody.innerHTML = `<tr><td colspan="4" class="empty-state">Pilih kelas asal terlebih dahulu.</td></tr>`;
    if (countSpan) countSpan.textContent = '0';
    return;
  }

  const santriList = AppState.santri.filter(s => String(s.kelasSekolah || '').trim() === String(klsAsal).trim());

  if (santriList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="empty-state">Tidak ada santri di kelas ${escapeHtml(klsAsal)}.</td></tr>`;
    if (countSpan) countSpan.textContent = '0';
    return;
  }

  santriList.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align:center;">
        <input type="checkbox" name="chkSantriKenaikan" value="${s.id}" checked onchange="updateKenaikanSelectedCount()">
      </td>
      <td><strong>${escapeHtml(s.nama)}</strong></td>
      <td><code>${escapeHtml(s.nis)}</code></td>
      <td><span class="badge" style="background:#f1f5f9; color:#334155;">${escapeHtml(s.program)} • ${escapeHtml(s.halaqah || '-')}</span></td>
    `;
    tbody.appendChild(tr);
  });

  if (checkAll) checkAll.checked = true;
  updateKenaikanSelectedCount();
}

function toggleSelectAllSantriKenaikan(checked) {
  const checkboxes = document.querySelectorAll('input[name="chkSantriKenaikan"]');
  checkboxes.forEach(cb => { cb.checked = checked; });
  updateKenaikanSelectedCount();
}

function updateKenaikanSelectedCount() {
  const checked = document.querySelectorAll('input[name="chkSantriKenaikan"]:checked');
  const countSpan = document.getElementById('kenaikanCountSelected');
  if (countSpan) countSpan.textContent = checked.length;
}

function eksekusiKenaikanKelasPerTingkat() {
  const inputTujuan = document.getElementById('kenaikanKelasTujuan');
  const targetKelas = inputTujuan ? inputTujuan.value.trim() : '';

  if (!targetKelas) {
    alert("Silakan masukkan Target Kelas Baru.");
    if (inputTujuan) inputTujuan.focus();
    return;
  }

  const checkedBoxes = Array.from(document.querySelectorAll('input[name="chkSantriKenaikan"]:checked'));
  if (checkedBoxes.length === 0) {
    alert("Pilih minimal satu santri yang akan dinaikkan.");
    return;
  }

  const targetIds = new Set(checkedBoxes.map(cb => cb.value));
  let modifiedCount = 0;

  AppState.santri.forEach(s => {
    if (targetIds.has(s.id)) {
      s.kelasSekolah = targetKelas;
      modifiedCount++;
    }
  });

  saveToStorage();
  closeModalKenaikanKelas();
  renderAll();

  // Reset dropdown filter kelas di tabel santri agar pilihan ter-update
  const filterKelasEl = document.getElementById('santriFilterKelasSekolah');
  if (filterKelasEl) filterKelasEl.innerHTML = '<option value="">Semua Kelas Sekolah</option>';

  showToast(`🎉 Alhamdulillah! Berhasil menaikkan ${modifiedCount} santri ke ${targetKelas}!`, "success");
}

function eksekusiKenaikanKelasSerentak() {
  if (!confirm("Konfirmasi Kenaikan Serentak:\n\nApakah Anda yakin ingin menaikkan seluruh jenjang santri aktif (Kelas 7→8, 8→9, 9→10, 10→11, 11→12, 12→Alumni)?\n\nPastikan data sudah benar sebelum melanjutkan.")) {
    return;
  }

  let count = 0;
  AppState.santri.forEach(s => {
    const cur = (s.kelasSekolah || '').trim();
    if (!cur) return;

    const num = parseInt(cur.replace(/\D/g, ''), 10);
    if (!isNaN(num)) {
      if (num >= 12) {
        s.kelasSekolah = 'Alumni / Tamat';
        count++;
      } else {
        const next = num + 1;
        if (/kelas/i.test(cur)) {
          s.kelasSekolah = `Kelas ${next}`;
        } else {
          s.kelasSekolah = String(next);
        }
        count++;
      }
    }
  });

  saveToStorage();
  closeModalKenaikanKelas();
  renderAll();

  const filterKelasEl = document.getElementById('santriFilterKelasSekolah');
  if (filterKelasEl) filterKelasEl.innerHTML = '<option value="">Semua Kelas Sekolah</option>';

  showToast(`🎉 Kenaikan kelas serentak berhasil! ${count} santri telah dinaikkan 1 tingkat.`, "success");
}

// ================= 4B. UJIAN SEMESTER & PEROMBAKAN KELAS =================
function switchSubTabUjian(mode) {
  const viewBnz = document.getElementById('viewUjianBinnadzor');
  const viewThf = document.getElementById('viewUjianTahfidz');
  const btnBnz = document.getElementById('subTabBtnUjianBinnadzor');
  const btnThf = document.getElementById('subTabBtnUjianTahfidz');

  if (mode === 'tahfidz') {
    if (viewBnz) viewBnz.style.display = 'none';
    if (viewThf) viewThf.style.display = 'block';
    if (btnBnz) btnBnz.className = 'btn btn-sm btn-secondary';
    if (btnThf) btnThf.className = 'btn btn-sm btn-primary';
    renderUjianTahfidzTable();
  } else {
    if (viewBnz) viewBnz.style.display = 'block';
    if (viewThf) viewThf.style.display = 'none';
    if (btnBnz) btnBnz.className = 'btn btn-sm btn-primary';
    if (btnThf) btnThf.className = 'btn btn-sm btn-secondary';
    renderUjianBinnadzorTable();
  }
}

function hitungRekomendasiKelasBinnadzor(nilaiAkhir, santri) {
  const score = parseFloat(nilaiAkhir) || 0;
  const p = santri?.binnadzorProgress || {};
  const tuntasHafalan = (p.hafalanJuz30 >= 100 && p.hafalanJuz29 >= 100 && p.hafalanJuz28 >= 100);

  if (score >= 90) {
    if (tuntasHafalan || p.statusWisuda === 'Siap Wisuda') {
      return "Program Maqbul";
    }
    return "Kelas A1 (Ust. Miftah Faridl)";
  } else if (score >= 80) {
    return "Kelas B1 (Ust. Hasan Basri)";
  } else if (score >= 70) {
    return "Kelas C1 (Ust. Salman Al-Farisi)";
  } else if (score >= 60) {
    return "Kelas D (Ust. Abdul Qodir)";
  } else {
    return "Kelas E (Ust. Zulkifli)";
  }
}

function renderUjianBinnadzorTable() {
  const tbody = document.getElementById('tableUjianBinnadzorBody');
  if (!tbody) return;

  const search = document.getElementById('ujianBinnadzorSearch')?.value?.toLowerCase() || '';
  const filterSem = document.getElementById('ujianBinnadzorFilterSemester')?.value || '';
  const filterThn = document.getElementById('ujianBinnadzorFilterTahun')?.value || '';
  const filterKelas = document.getElementById('ujianBinnadzorFilterKelas')?.value || '';

  // Dinamiskan opsi Filter Kelas Binnadzor
  const selectFilterKelas = document.getElementById('ujianBinnadzorFilterKelas');
  if (selectFilterKelas && selectFilterKelas.options.length <= 1) {
    const listKelas = AppState.settings.daftarKelasBinnadzor || DEFAULT_SETTINGS.daftarKelasBinnadzor || [];
    listKelas.forEach(k => {
      const opt = document.createElement('option');
      opt.value = k;
      opt.textContent = k;
      selectFilterKelas.appendChild(opt);
    });
  }

  tbody.innerHTML = '';
  const list = (AppState.ujianSemester || []).filter(u => u.program === 'Binnadzor');

  const filtered = list.filter(u => {
    const matchSearch = !search || 
      u.santriNama.toLowerCase().includes(search) || 
      u.nis.toLowerCase().includes(search) || 
      (u.kelasLama && u.kelasLama.toLowerCase().includes(search));
    const matchSem = !filterSem || u.semester === filterSem;
    const matchThn = !filterThn || u.tahunAjaran === filterThn;
    const matchKelas = !filterKelas || u.kelasLama === filterKelas;
    return matchSearch && matchSem && matchThn && matchKelas;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="14" class="empty-state">Belum ada data nilai ujian semester Binnadzor yang sesuai filter.</td></tr>`;
    updateSelectedUjianBinnadzorUI();
    return;
  }

  const allBnzKelas = AppState.settings.daftarKelasBinnadzor || DEFAULT_SETTINGS.daftarKelasBinnadzor || [];

  filtered.forEach((u, idx) => {
    const santri = AppState.santri.find(s => s.id === u.santriId);
    const rekomendasi = u.rekomendasiKelas || hitungRekomendasiKelasBinnadzor(u.nilaiAkhir, santri);

    // Build select dropdown options
    let optionsHtml = '';
    allBnzKelas.forEach(k => {
      const sel = (k === (u.rekomendasiKelas || rekomendasi)) ? 'selected' : '';
      optionsHtml += `<option value="${escapeHtml(k)}" ${sel}>${escapeHtml(k)}</option>`;
    });
    const selMaqbul = ((u.rekomendasiKelas || rekomendasi) === 'Program Maqbul') ? 'selected' : '';
    optionsHtml += `<option value="Program Maqbul" ${selMaqbul} style="font-weight:700; color:#b45309;">🌟 Program Maqbul (Persiapan Tahfidz)</option>`;

    let chipClass = 'nilai-jayyid';
    if (u.predikat?.includes('Mumtaz')) chipClass = 'nilai-mumtaz';
    else if (u.predikat?.includes('Jayyid Jiddan')) chipClass = 'nilai-jayyid-jiddan';
    else if (u.predikat?.includes('Maqbul')) chipClass = 'nilai-maqbul';
    else if (u.predikat?.includes('Perlu')) chipClass = 'nilai-ulang';

    const statusBadge = u.statusPerombakan === 'Sudah Diterapkan' 
      ? `<span class="badge" style="background:#dcfce7; color:#15803d; font-size:11px;">✓ Diterapkan</span>` 
      : `<span class="badge" style="background:#fef3c7; color:#b45309; font-size:11px;">Menunggu</span>`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align:center;"><input type="checkbox" class="check-ujian-bnz-item" value="${u.id}" onchange="updateSelectedUjianBinnadzorUI()"></td>
      <td style="text-align:center;">${idx + 1}</td>
      <td><strong>${escapeHtml(u.santriNama)}</strong></td>
      <td><code>${escapeHtml(u.nis)}</code></td>
      <td><span class="badge" style="background:#e0f2fe; color:#0369a1; font-size:11.5px;">${escapeHtml(u.kelasLama || santri?.halaqah || '-')}</span></td>
      <td style="text-align:center; font-weight:600;">${u.nilaiMakhraj ?? '-'}</td>
      <td style="text-align:center; font-weight:600;">${u.nilaiTajwid ?? '-'}</td>
      <td style="text-align:center; font-weight:600;">${u.nilaiFashahah ?? '-'}</td>
      <td style="text-align:center; font-weight:600;">${u.nilaiHafalan ?? '-'}</td>
      <td style="text-align:center;"><strong style="font-size:14px; color:#0f172a;">${Number(u.nilaiAkhir || 0).toFixed(1)}</strong></td>
      <td><span class="nilai-chip ${chipClass}">${escapeHtml(u.predikat || '-')}</span></td>
      <td>
        <strong style="color:${rekomendasi === 'Program Maqbul' ? '#b45309' : '#0369a1'}; font-size:12px;">
          ${rekomendasi === 'Program Maqbul' ? '🌟 ' : '⬆️ '}${escapeHtml(rekomendasi)}
        </strong>
      </td>
      <td>
        <select id="pilihanKelasBaru_${u.santriId}" class="form-control form-control-sm" style="font-size:12px; font-weight:600; padding:4px 8px; border-color:#94a3b8;">
          ${optionsHtml}
        </select>
      </td>
      <td style="text-align:center;">
        <div style="display:flex; gap:4px; justify-content:center;">
          <button class="btn btn-secondary btn-sm" onclick="openModalInputUjian('${u.id}')" title="Edit Nilai Ujian" style="padding:4px 8px;">
            ✏️
          </button>
          <button class="btn btn-primary btn-sm" onclick="terapkanSatuPerombakanKelas('${u.santriId}')" title="Pindahkan Santri ke Kelas Terpilih" style="padding:4px 8px;">
            🔄
          </button>
          <button class="btn btn-secondary btn-sm" onclick="hapusUjianSemester('${u.id}')" title="Hapus Catatan Ujian" style="padding:4px 8px; color:var(--danger);">
            🗑️
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  updateSelectedUjianBinnadzorUI();
}

function renderUjianTahfidzTable() {
  const tbody = document.getElementById('tableUjianTahfidzBody');
  if (!tbody) return;

  const search = document.getElementById('ujianTahfidzSearch')?.value?.toLowerCase() || '';
  const filterSem = document.getElementById('ujianTahfidzFilterSemester')?.value || '';
  const filterThn = document.getElementById('ujianTahfidzFilterTahun')?.value || '';
  const filterHalaqah = document.getElementById('ujianTahfidzFilterHalaqah')?.value || '';

  // Dinamiskan opsi Filter Halaqah Tahfidz
  const selectFilterHalaqah = document.getElementById('ujianTahfidzFilterHalaqah');
  if (selectFilterHalaqah && selectFilterHalaqah.options.length <= 1) {
    const listHalaqah = AppState.settings.daftarHalaqahTahfidz || DEFAULT_SETTINGS.daftarHalaqahTahfidz || [];
    listHalaqah.forEach(h => {
      const opt = document.createElement('option');
      opt.value = h;
      opt.textContent = h;
      selectFilterHalaqah.appendChild(opt);
    });
  }

  tbody.innerHTML = '';
  const list = (AppState.ujianSemester || []).filter(u => u.program === 'Tahfidz');

  const filtered = list.filter(u => {
    const matchSearch = !search || 
      u.santriNama.toLowerCase().includes(search) || 
      u.nis.toLowerCase().includes(search) || 
      (u.halaqah && u.halaqah.toLowerCase().includes(search));
    const matchSem = !filterSem || u.semester === filterSem;
    const matchThn = !filterThn || u.tahunAjaran === filterThn;
    const matchHalaqah = !filterHalaqah || u.halaqah === filterHalaqah;
    return matchSearch && matchSem && matchThn && matchHalaqah;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="13" class="empty-state">Belum ada data nilai ujian tasmi' semester Tahfidz.</td></tr>`;
    updateSelectedUjianTahfidzUI();
    return;
  }

  filtered.forEach((u, idx) => {
    let chipClass = 'nilai-jayyid';
    if (u.predikat?.includes('Mumtaz')) chipClass = 'nilai-mumtaz';
    else if (u.predikat?.includes('Jayyid Jiddan')) chipClass = 'nilai-jayyid-jiddan';
    else if (u.predikat?.includes('Maqbul')) chipClass = 'nilai-maqbul';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align:center;"><input type="checkbox" class="check-ujian-tfz-item" value="${u.id}" onchange="updateSelectedUjianTahfidzUI()"></td>
      <td style="text-align:center;">${idx + 1}</td>
      <td><strong>${escapeHtml(u.santriNama)}</strong></td>
      <td><code>${escapeHtml(u.nis)}</code></td>
      <td><span class="badge" style="background:#ecfdf5; color:#065f46; font-size:11.5px;">${escapeHtml(u.halaqah || '-')}</span></td>
      <td><strong style="color:#0f172a; font-size:12.5px;">${escapeHtml(u.juzDiuji || '-')}</strong></td>
      <td style="text-align:center; font-weight:600;">${u.nilaiKelancaran ?? '-'}</td>
      <td style="text-align:center; font-weight:600;">${u.nilaiTajwid ?? '-'}</td>
      <td style="text-align:center; font-weight:600;">${u.nilaiKetahanan ?? '-'}</td>
      <td style="text-align:center;"><strong style="font-size:14px; color:#065f46;">${Number(u.nilaiAkhir || 0).toFixed(1)}</strong></td>
      <td><span class="nilai-chip ${chipClass}">${escapeHtml(u.predikat || '-')}</span></td>
      <td style="font-size:12px; color:#475569; max-width:220px;">${escapeHtml(u.catatan || '-')}</td>
      <td style="text-align:center;">
        <div style="display:flex; gap:4px; justify-content:center;">
          <button class="btn btn-secondary btn-sm" onclick="openModalInputUjian('${u.id}')" title="Edit Nilai" style="padding:4px 8px;">
            ✏️
          </button>
          <button class="btn btn-primary btn-sm" onclick="cetakRaportUjianTahfidz('${u.id}')" title="Cetak Raport Tasmi' Semester" style="padding:4px 8px;">
            📜 Raport
          </button>
          <button class="btn btn-secondary btn-sm" onclick="hapusUjianSemester('${u.id}')" title="Hapus Catatan Ujian" style="padding:4px 8px; color:var(--danger);">
            🗑️
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  updateSelectedUjianTahfidzUI();
}

// ================= FITUR MULTI-SELECT & AKSI MASSAL UJIAN SEMESTER =================
function toggleSelectAllUjianBinnadzor(checked) {
  document.querySelectorAll('.check-ujian-bnz-item').forEach(cb => { cb.checked = checked; });
  updateSelectedUjianBinnadzorUI();
}

function updateSelectedUjianBinnadzorUI() {
  const allBoxes = Array.from(document.querySelectorAll('.check-ujian-bnz-item'));
  const checkedBoxes = allBoxes.filter(cb => cb.checked);
  const count = checkedBoxes.length;

  const checkAll = document.getElementById('checkAllUjianBinnadzor');
  if (checkAll) {
    checkAll.checked = allBoxes.length > 0 && count === allBoxes.length;
    checkAll.indeterminate = count > 0 && count < allBoxes.length;
  }

  const bar = document.getElementById('ujianBinnadzorBulkActionBar');
  if (!bar) return;

  if (count === 0) {
    bar.style.display = 'none';
    bar.innerHTML = '';
    return;
  }

  bar.style.display = 'flex';
  bar.innerHTML = `
    <span class="bulk-count-badge">✓ Terpilih: <strong>${count}</strong> santri</span>
    <button type="button" class="bulk-btn bulk-btn-success" onclick="terapkanPerombakanBulk()">🔄 Terapkan Perombakan Terpilih</button>
    <button type="button" class="bulk-btn bulk-btn-danger" onclick="hapusUjianSemesterBulk('Binnadzor')">🗑️ Hapus Nilai Terpilih</button>
    <button type="button" class="bulk-btn bulk-btn-secondary" onclick="batalPilihUjianBinnadzor()">Batal</button>
  `;
}

function batalPilihUjianBinnadzor() {
  document.querySelectorAll('.check-ujian-bnz-item').forEach(cb => { cb.checked = false; });
  const checkAll = document.getElementById('checkAllUjianBinnadzor');
  if (checkAll) { checkAll.checked = false; checkAll.indeterminate = false; }
  updateSelectedUjianBinnadzorUI();
}

function toggleSelectAllUjianTahfidz(checked) {
  document.querySelectorAll('.check-ujian-tfz-item').forEach(cb => { cb.checked = checked; });
  updateSelectedUjianTahfidzUI();
}

function updateSelectedUjianTahfidzUI() {
  const allBoxes = Array.from(document.querySelectorAll('.check-ujian-tfz-item'));
  const checkedBoxes = allBoxes.filter(cb => cb.checked);
  const count = checkedBoxes.length;

  const checkAll = document.getElementById('checkAllUjianTahfidz');
  if (checkAll) {
    checkAll.checked = allBoxes.length > 0 && count === allBoxes.length;
    checkAll.indeterminate = count > 0 && count < allBoxes.length;
  }

  const bar = document.getElementById('ujianTahfidzBulkActionBar');
  if (!bar) return;

  if (count === 0) {
    bar.style.display = 'none';
    bar.innerHTML = '';
    return;
  }

  bar.style.display = 'flex';
  bar.innerHTML = `
    <span class="bulk-count-badge">✓ Terpilih: <strong>${count}</strong> santri</span>
    <button type="button" class="bulk-btn bulk-btn-danger" onclick="hapusUjianSemesterBulk('Tahfidz')">🗑️ Hapus Nilai Terpilih</button>
    <button type="button" class="bulk-btn bulk-btn-secondary" onclick="batalPilihUjianTahfidz()">Batal</button>
  `;
}

function batalPilihUjianTahfidz() {
  document.querySelectorAll('.check-ujian-tfz-item').forEach(cb => { cb.checked = false; });
  const checkAll = document.getElementById('checkAllUjianTahfidz');
  if (checkAll) { checkAll.checked = false; checkAll.indeterminate = false; }
  updateSelectedUjianTahfidzUI();
}

function hapusUjianSemester(examId) {
  const exam = (AppState.ujianSemester || []).find(u => u.id === examId);
  const nama = exam ? exam.santriNama : 'data ujian ini';
  if (!confirm(`Hapus catatan nilai ujian semester untuk ${nama}?`)) return;

  AppState.ujianSemester = (AppState.ujianSemester || []).filter(u => u.id !== examId);
  saveToStorage();
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
  renderUjianBinnadzorTable();
  renderUjianTahfidzTable();
  showToast(`Data nilai ujian semester ${nama} berhasil dihapus.`, "info");
}

function hapusUjianSemesterBulk(program) {
  const cls = program === 'Binnadzor' ? 'check-ujian-bnz-item' : 'check-ujian-tfz-item';
  const checkedBoxes = Array.from(document.querySelectorAll(`.${cls}:checked`));
  const ids = checkedBoxes.map(cb => cb.value);
  if (ids.length === 0) return;
  if (!confirm(`Hapus ${ids.length} data nilai ujian semester terpilih?`)) return;

  AppState.ujianSemester = (AppState.ujianSemester || []).filter(u => !ids.includes(u.id));
  saveToStorage();
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
  if (program === 'Binnadzor') {
    renderUjianBinnadzorTable();
  } else {
    renderUjianTahfidzTable();
  }
  showToast(`${ids.length} data nilai ujian berhasil dihapus.`, "info");
}

function terapkanPerombakanBulk() {
  const checkedBoxes = Array.from(document.querySelectorAll('.check-ujian-bnz-item:checked'));
  const examIds = checkedBoxes.map(cb => cb.value);
  if (examIds.length === 0) return;

  const exams = (AppState.ujianSemester || []).filter(u => examIds.includes(u.id));
  if (exams.length === 0) return;

  if (!confirm(`Terapkan perombakan kelas untuk ${exams.length} santri Binnadzor terpilih sesuai pilihan dropdown masing-masing?`)) return;

  let appliedCount = 0;
  exams.forEach(exam => {
    const santri = AppState.santri.find(s => s.id === exam.santriId);
    if (!santri) return;
    const selectEl = document.getElementById(`pilihanKelasBaru_${exam.santriId}`);
    const targetKelas = selectEl ? selectEl.value : (exam.rekomendasiKelas || 'Kelas A1');
    const kelasLama = santri.halaqah;

    if (targetKelas === 'Program Maqbul') {
      santri.program = 'Program Maqbul';
      if (!santri.binnadzorProgress) santri.binnadzorProgress = {};
      santri.binnadzorProgress.statusTesMaqbul = 'Lolos Tes Maqbul';
      santri.binnadzorProgress.tanggalTesMaqbul = new Date().toISOString().split('T')[0];
      santri.binnadzorProgress.nilaiTesMaqbul = 'Mumtaz (A)';
      santri.binnadzorProgress.statusWisuda = 'Siap Wisuda';
    } else {
      santri.program = 'Binnadzor';
      santri.halaqah = targetKelas;
    }

    santri.riwayatPerombakanKelas = santri.riwayatPerombakanKelas || [];
    santri.riwayatPerombakanKelas.push({
      tanggal: new Date().toISOString().split('T')[0],
      semester: document.getElementById('ujianBinnadzorFilterSemester')?.value || 'Semester Ganjil',
      tahunAjaran: document.getElementById('ujianBinnadzorFilterTahun')?.value || '2024/2025',
      kelasLama: kelasLama,
      kelasBaru: targetKelas,
      diterapkanOleh: 'Admin Tahfidz (Bulk)'
    });

    exam.statusPerombakan = 'Sudah Diterapkan';
    appliedCount++;
  });

  saveToStorage();
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
  renderAll();
  showToast(`🎉 Berhasil menerapkan perombakan kelas untuk ${appliedCount} santri!`, "success");
}

function terapkanSatuPerombakanKelas(santriId) {
  const santri = AppState.santri.find(s => s.id === santriId);
  if (!santri) return;

  const selectEl = document.getElementById(`pilihanKelasBaru_${santriId}`);
  if (!selectEl) return;
  const targetKelas = selectEl.value;
  const kelasLama = santri.halaqah;

  if (targetKelas === 'Program Maqbul') {
    santri.program = 'Program Maqbul';
    if (!santri.binnadzorProgress) santri.binnadzorProgress = {};
    santri.binnadzorProgress.statusTesMaqbul = 'Lolos Tes Maqbul';
    santri.binnadzorProgress.tanggalTesMaqbul = new Date().toISOString().split('T')[0];
    santri.binnadzorProgress.nilaiTesMaqbul = 'Mumtaz (A)';
    santri.binnadzorProgress.statusWisuda = 'Siap Wisuda';
  } else {
    santri.program = 'Binnadzor';
    santri.halaqah = targetKelas;
  }

  santri.riwayatPerombakanKelas = santri.riwayatPerombakanKelas || [];
  santri.riwayatPerombakanKelas.push({
    tanggal: new Date().toISOString().split('T')[0],
    semester: document.getElementById('ujianBinnadzorFilterSemester')?.value || 'Semester Ganjil',
    tahunAjaran: document.getElementById('ujianBinnadzorFilterTahun')?.value || '2024/2025',
    kelasLama: kelasLama,
    kelasBaru: targetKelas,
    diterapkanOleh: 'Admin Tahfidz'
  });

  const exam = (AppState.ujianSemester || []).find(u => u.santriId === santriId && u.program === 'Binnadzor');
  if (exam) exam.statusPerombakan = 'Sudah Diterapkan';

  saveToStorage();
  renderAll();
  showToast(`🎉 Santri ${santri.nama} berhasil dipindahkan ke ${targetKelas}!`, "success");
}

function terapkanSemuaRekomendasiPerombakan() {
  const bnzExams = (AppState.ujianSemester || []).filter(u => u.program === 'Binnadzor');
  if (bnzExams.length === 0) {
    alert("Tidak ada data ujian Binnadzor yang dapat diterapkan.");
    return;
  }

  if (!confirm(`Konfirmasi Perombakan Kelas Otomatis:\n\nApakah Anda yakin ingin menerapkan rekomendasi perombakan kelas untuk seluruh santri Binnadzor (${bnzExams.length} santri) berdasarkan nilai ujian semester?\n\nSantri dengan nilai Mumtaz & hafalan tuntas akan dipromosikan ke Program Maqbul, dan kelas santri lainnya akan disesuaikan otomatis.`)) {
    return;
  }

  let count = 0;
  bnzExams.forEach(u => {
    const santri = AppState.santri.find(s => s.id === u.santriId);
    if (!santri) return;

    const rekomendasi = u.rekomendasiKelas || hitungRekomendasiKelasBinnadzor(u.nilaiAkhir, santri);
    const kelasLama = santri.halaqah;

    if (rekomendasi === 'Program Maqbul') {
      santri.program = 'Program Maqbul';
      if (!santri.binnadzorProgress) santri.binnadzorProgress = {};
      santri.binnadzorProgress.statusTesMaqbul = 'Lolos Tes Maqbul';
      santri.binnadzorProgress.tanggalTesMaqbul = new Date().toISOString().split('T')[0];
      santri.binnadzorProgress.nilaiTesMaqbul = u.predikat || 'Mumtaz (A)';
      santri.binnadzorProgress.statusWisuda = 'Siap Wisuda';
    } else {
      santri.program = 'Binnadzor';
      santri.halaqah = rekomendasi;
    }

    santri.riwayatPerombakanKelas = santri.riwayatPerombakanKelas || [];
    santri.riwayatPerombakanKelas.push({
      tanggal: new Date().toISOString().split('T')[0],
      semester: u.semester || 'Semester Ganjil',
      tahunAjaran: u.tahunAjaran || '2024/2025',
      kelasLama: kelasLama,
      kelasBaru: rekomendasi,
      nilaiAkhir: u.nilaiAkhir,
      diterapkanOleh: 'Admin Tahfidz'
    });

    u.statusPerombakan = 'Sudah Diterapkan';
    count++;
  });

  saveToStorage();
  renderAll();
  showToast(`🎉 Alhamdulillah! Perombakan kelas otomatis berhasil diterapkan untuk ${count} santri Binnadzor!`, "success");
}

function terapkanPerombakanKelasTerpilih() {
  const selects = document.querySelectorAll('select[id^="pilihanKelasBaru_"]');
  if (selects.length === 0) {
    alert("Tidak ada daftar perombakan santri yang aktif di tabel.");
    return;
  }

  let count = 0;
  selects.forEach(sel => {
    const santriId = sel.id.replace('pilihanKelasBaru_', '');
    const santri = AppState.santri.find(s => s.id === santriId);
    if (!santri) return;

    const targetKelas = sel.value;
    const kelasLama = santri.halaqah;

    if (targetKelas === 'Program Maqbul') {
      santri.program = 'Program Maqbul';
      if (!santri.binnadzorProgress) santri.binnadzorProgress = {};
      santri.binnadzorProgress.statusTesMaqbul = 'Lolos Tes Maqbul';
      santri.binnadzorProgress.statusWisuda = 'Siap Wisuda';
    } else {
      santri.program = 'Binnadzor';
      santri.halaqah = targetKelas;
    }

    santri.riwayatPerombakanKelas = santri.riwayatPerombakanKelas || [];
    santri.riwayatPerombakanKelas.push({
      tanggal: new Date().toISOString().split('T')[0],
      semester: document.getElementById('ujianBinnadzorFilterSemester')?.value || 'Semester Ganjil',
      tahunAjaran: document.getElementById('ujianBinnadzorFilterTahun')?.value || '2024/2025',
      kelasLama: kelasLama,
      kelasBaru: targetKelas,
      diterapkanOleh: 'Admin Tahfidz'
    });

    const exam = (AppState.ujianSemester || []).find(u => u.santriId === santriId && u.program === 'Binnadzor');
    if (exam) exam.statusPerombakan = 'Sudah Diterapkan';
    count++;
  });

  saveToStorage();
  renderAll();
  showToast(`💾 Perombakan kelas terpilih berhasil diterapkan untuk ${count} santri!`, "success");
}

function openModalInputUjian(examId) {
  const modal = document.getElementById('modalInputUjian');
  if (!modal) return;

  const form = document.getElementById('formInputUjian');
  if (form) form.reset();

  document.getElementById('formUjianId').value = examId || '';
  document.getElementById('formUjianTanggal').value = new Date().toISOString().split('T')[0];
  document.getElementById('formUjianTahunAjaran').value = '2024/2025';

  if (examId) {
    const exam = (AppState.ujianSemester || []).find(u => u.id === examId);
    if (exam) {
      document.getElementById('modalInputUjianTitle').textContent = `✏️ Edit Nilai Ujian Semester (${exam.santriNama})`;
      document.getElementById('formUjianProgram').value = exam.program;
      onProgramUjianChange();
      document.getElementById('formUjianSantriId').value = exam.santriId;
      document.getElementById('formUjianSemester').value = exam.semester;
      document.getElementById('formUjianTahunAjaran').value = exam.tahunAjaran || '2024/2025';
      document.getElementById('formUjianTanggal').value = exam.tanggal || new Date().toISOString().split('T')[0];
      document.getElementById('formUjianPenguji').value = exam.penguji || '';
      document.getElementById('formUjianCatatan').value = exam.catatan || '';

      if (exam.program === 'Binnadzor') {
        document.getElementById('formUjianMakhraj').value = exam.nilaiMakhraj || '';
        document.getElementById('formUjianTajwid').value = exam.nilaiTajwid || '';
        document.getElementById('formUjianFashahah').value = exam.nilaiFashahah || '';
        document.getElementById('formUjianHafalan').value = exam.nilaiHafalan || '';
        hitungNilaiAkhirBinnadzor();
      } else {
        document.getElementById('formUjianJuzDiuji').value = exam.juzDiuji || '';
        document.getElementById('formUjianKelancaranTahfidz').value = exam.nilaiKelancaran || '';
        document.getElementById('formUjianTajwidTahfidz').value = exam.nilaiTajwid || '';
        document.getElementById('formUjianKetahananTahfidz').value = exam.nilaiKetahanan || '';
        hitungNilaiAkhirTahfidz();
      }
    }
  } else {
    document.getElementById('modalInputUjianTitle').textContent = '📝 Input Nilai Ujian Semester Baru';
    onProgramUjianChange();
  }

  modal.classList.add('active');
}

function closeModalInputUjian() {
  const modal = document.getElementById('modalInputUjian');
  if (modal) modal.classList.remove('active');
}

function onProgramUjianChange() {
  const prog = document.getElementById('formUjianProgram').value;
  const secBnz = document.getElementById('formSectionBinnadzor');
  const secThf = document.getElementById('formSectionTahfidz');
  const selectSantri = document.getElementById('formUjianSantriId');

  if (prog === 'Tahfidz') {
    if (secBnz) secBnz.style.display = 'none';
    if (secThf) secThf.style.display = 'block';
  } else {
    if (secBnz) secBnz.style.display = 'block';
    if (secThf) secThf.style.display = 'none';
  }

  if (selectSantri) {
    selectSantri.innerHTML = '';
    const santriList = AppState.santri.filter(s => {
      if (prog === 'Tahfidz') return s.program === 'Tahfidz';
      return s.program === 'Binnadzor' || s.program === 'Program Maqbul';
    });

    if (santriList.length === 0) {
      const opt = document.createElement('option');
      opt.value = "";
      opt.textContent = "Tidak ada santri di program ini";
      selectSantri.appendChild(opt);
    } else {
      santriList.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = `${s.nama} (${s.nis}) • ${s.halaqah || '-'}`;
        selectSantri.appendChild(opt);
      });
    }
  }

  onSantriUjianSelected();
}

function onSantriUjianSelected() {
  hitungNilaiAkhirBinnadzor();
  hitungNilaiAkhirTahfidz();
}

function hitungNilaiAkhirBinnadzor() {
  const m = parseFloat(document.getElementById('formUjianMakhraj')?.value) || 0;
  const t = parseFloat(document.getElementById('formUjianTajwid')?.value) || 0;
  const f = parseFloat(document.getElementById('formUjianFashahah')?.value) || 0;
  const h = parseFloat(document.getElementById('formUjianHafalan')?.value) || 0;

  const total = (m * 0.25) + (t * 0.30) + (f * 0.25) + (h * 0.20);
  const rounded = total.toFixed(1);

  const elTotal = document.getElementById('previewNilaiAkhirBinnadzor');
  if (elTotal) elTotal.textContent = rounded;

  let predikat = 'Perlu Bimbingan (D)';
  if (total >= 90) predikat = 'Mumtaz (A)';
  else if (total >= 80) predikat = 'Jayyid Jiddan (B+)';
  else if (total >= 70) predikat = 'Jayyid (B)';
  else if (total >= 60) predikat = 'Maqbul (C)';

  const elPred = document.getElementById('previewPredikatBinnadzor');
  if (elPred) elPred.textContent = predikat;

  const santriId = document.getElementById('formUjianSantriId')?.value;
  const santri = AppState.santri.find(s => s.id === santriId);
  const rek = hitungRekomendasiKelasBinnadzor(total, santri);

  const elRek = document.getElementById('previewRekomendasiKelas');
  if (elRek) elRek.textContent = (rek === 'Program Maqbul' ? '🌟 ' : '⬆️ ') + rek;
}

function hitungNilaiAkhirTahfidz() {
  const k = parseFloat(document.getElementById('formUjianKelancaranTahfidz')?.value) || 0;
  const t = parseFloat(document.getElementById('formUjianTajwidTahfidz')?.value) || 0;
  const ket = parseFloat(document.getElementById('formUjianKetahananTahfidz')?.value) || 0;

  const total = (k * 0.40) + (t * 0.35) + (ket * 0.25);
  const rounded = total.toFixed(1);

  const elTotal = document.getElementById('previewNilaiAkhirTahfidz');
  if (elTotal) elTotal.textContent = rounded;

  let predikat = 'Perlu Evaluasi (D)';
  if (total >= 90) predikat = 'Mumtaz (A)';
  else if (total >= 80) predikat = 'Jayyid Jiddan (B+)';
  else if (total >= 70) predikat = 'Jayyid (B)';
  else if (total >= 60) predikat = 'Maqbul (C)';

  const elPred = document.getElementById('previewPredikatTahfidz');
  if (elPred) elPred.textContent = predikat;
}

function simpanNilaiUjian(e) {
  e.preventDefault();
  const id = document.getElementById('formUjianId').value;
  const program = document.getElementById('formUjianProgram').value;
  const santriId = document.getElementById('formUjianSantriId').value;
  const semester = document.getElementById('formUjianSemester').value;
  const tahunAjaran = document.getElementById('formUjianTahunAjaran').value.trim();
  const tanggal = document.getElementById('formUjianTanggal').value;
  const penguji = document.getElementById('formUjianPenguji').value.trim();
  const catatan = document.getElementById('formUjianCatatan').value.trim();

  const santri = AppState.santri.find(s => s.id === santriId);
  if (!santri) {
    alert("Santri belum dipilih!");
    return;
  }

  let examObj = id ? (AppState.ujianSemester || []).find(u => u.id === id) : null;
  const isNew = !examObj;

  if (isNew) {
    examObj = {
      id: 'UJI-' + (program === 'Binnadzor' ? 'BNZ-' : 'THF-') + Date.now(),
      santriId: santri.id,
      santriNama: santri.nama,
      nis: santri.nis,
      program: program,
      semester: semester,
      tahunAjaran: tahunAjaran,
      tanggal: tanggal,
      penguji: penguji,
      catatan: catatan
    };
    AppState.ujianSemester = AppState.ujianSemester || [];
    AppState.ujianSemester.push(examObj);
  } else {
    examObj.santriId = santri.id;
    examObj.santriNama = santri.nama;
    examObj.nis = santri.nis;
    examObj.program = program;
    examObj.semester = semester;
    examObj.tahunAjaran = tahunAjaran;
    examObj.tanggal = tanggal;
    examObj.penguji = penguji;
    examObj.catatan = catatan;
  }

  if (program === 'Binnadzor') {
    const m = parseFloat(document.getElementById('formUjianMakhraj').value) || 0;
    const t = parseFloat(document.getElementById('formUjianTajwid').value) || 0;
    const f = parseFloat(document.getElementById('formUjianFashahah').value) || 0;
    const h = parseFloat(document.getElementById('formUjianHafalan').value) || 0;
    const total = (m * 0.25) + (t * 0.30) + (f * 0.25) + (h * 0.20);

    let predikat = 'Perlu Bimbingan (D)';
    if (total >= 90) predikat = 'Mumtaz (A)';
    else if (total >= 80) predikat = 'Jayyid Jiddan (B+)';
    else if (total >= 70) predikat = 'Jayyid (B)';
    else if (total >= 60) predikat = 'Maqbul (C)';

    examObj.kelasLama = santri.halaqah;
    examObj.nilaiMakhraj = m;
    examObj.nilaiTajwid = t;
    examObj.nilaiFashahah = f;
    examObj.nilaiHafalan = h;
    examObj.nilaiAkhir = parseFloat(total.toFixed(1));
    examObj.predikat = predikat;
    examObj.rekomendasiKelas = hitungRekomendasiKelasBinnadzor(total, santri);
    examObj.statusPerombakan = examObj.statusPerombakan || 'Menunggu Penerapan';

  } else {
    // Tahfidz
    const k = parseFloat(document.getElementById('formUjianKelancaranTahfidz').value) || 0;
    const t = parseFloat(document.getElementById('formUjianTajwidTahfidz').value) || 0;
    const ket = parseFloat(document.getElementById('formUjianKetahananTahfidz').value) || 0;
    const total = (k * 0.40) + (t * 0.35) + (ket * 0.25);

    let predikat = 'Perlu Evaluasi (D)';
    if (total >= 90) predikat = 'Mumtaz (A)';
    else if (total >= 80) predikat = 'Jayyid Jiddan (B+)';
    else if (total >= 70) predikat = 'Jayyid (B)';
    else if (total >= 60) predikat = 'Maqbul (C)';

    examObj.halaqah = santri.halaqah;
    examObj.juzDiuji = document.getElementById('formUjianJuzDiuji').value.trim() || 'Tasmi\' Semester';
    examObj.nilaiKelancaran = k;
    examObj.nilaiTajwid = t;
    examObj.nilaiKetahanan = ket;
    examObj.nilaiAkhir = parseFloat(total.toFixed(1));
    examObj.predikat = predikat;
  }

  saveToStorage();
  closeModalInputUjian();
  renderAll();
  showToast(`💾 Nilai ujian semester ananda ${santri.nama} berhasil disimpan!`, "success");
}

function eksporUjianExcel() {
  if (typeof XLSX === 'undefined') {
    alert("Library SheetJS (xlsx.full.min.js) belum termuat.");
    return;
  }

  const isBnzVisible = document.getElementById('viewUjianBinnadzor')?.style?.display !== 'none';
  const wb = XLSX.utils.book_new();

  if (isBnzVisible) {
    const list = (AppState.ujianSemester || []).filter(u => u.program === 'Binnadzor');
    const data = list.map((u, idx) => ({
      "No": idx + 1,
      "Nama Santri": u.santriNama,
      "NIS": u.nis,
      "Kelas Lama": u.kelasLama,
      "Semester": u.semester,
      "Tahun Ajaran": u.tahunAjaran,
      "Tanggal Ujian": u.tanggal,
      "Nilai Makhraj (25%)": u.nilaiMakhraj,
      "Nilai Tajwid (30%)": u.nilaiTajwid,
      "Nilai Fashahah (25%)": u.nilaiFashahah,
      "Nilai Hafalan (20%)": u.nilaiHafalan,
      "Nilai Akhir": u.nilaiAkhir,
      "Predikat": u.predikat,
      "Rekomendasi Kelas Baru": u.rekomendasiKelas,
      "Status Perombakan": u.statusPerombakan,
      "Penguji": u.penguji,
      "Catatan": u.catatan
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Ujian_Binnadzor");
    XLSX.writeFile(wb, "Rekap_Ujian_Binnadzor_Dan_Perombakan_Kelas.xlsx");
    showToast("📥 File Excel Hasil Ujian Binnadzor berhasil diunduh!", "success");
  } else {
    const list = (AppState.ujianSemester || []).filter(u => u.program === 'Tahfidz');
    const data = list.map((u, idx) => ({
      "No": idx + 1,
      "Nama Santri": u.santriNama,
      "NIS": u.nis,
      "Halaqah Tahfidz": u.halaqah,
      "Semester": u.semester,
      "Tahun Ajaran": u.tahunAjaran,
      "Tanggal Ujian": u.tanggal,
      "Materi Juz Diuji": u.juzDiuji,
      "Nilai Kelancaran (40%)": u.nilaiKelancaran,
      "Nilai Tajwid (35%)": u.nilaiTajwid,
      "Nilai Ketahanan (25%)": u.nilaiKetahanan,
      "Nilai Akhir": u.nilaiAkhir,
      "Predikat": u.predikat,
      "Penguji": u.penguji,
      "Catatan Musyrif": u.catatan
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Ujian_Tahfidz");
    XLSX.writeFile(wb, "Rekap_Ujian_Tasmi_Tahfidz_Semester.xlsx");
    showToast("📥 File Excel Hasil Ujian Tahfidz berhasil diunduh!", "success");
  }
}

function unduhTemplateUjianExcel() {
  if (typeof XLSX === 'undefined') {
    alert("Library SheetJS (xlsx.full.min.js) belum termuat.");
    return;
  }

  const bnzSantri = AppState.santri.filter(s => s.program === 'Binnadzor' || s.program === 'Program Maqbul');
  const templateData = bnzSantri.map((s, idx) => ({
    "No": idx + 1,
    "NIS": s.nis,
    "Nama Santri": s.nama,
    "Kelas Asal": s.halaqah,
    "Nilai Makhraj (0-100)": 90,
    "Nilai Tajwid (0-100)": 92,
    "Nilai Fashahah (0-100)": 90,
    "Nilai Hafalan (0-100)": 88,
    "Nama Penguji": "Ust. Miftah Faridl",
    "Catatan Penguji": "Bacaan tartil, makhraj fasih, siap promosi."
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(templateData);
  XLSX.utils.book_append_sheet(wb, ws, "Template_Ujian_Binnadzor");
  XLSX.writeFile(wb, "Template_Import_Nilai_Ujian_Binnadzor.xlsx");
  showToast("📄 Template Excel Nilai Ujian berhasil diunduh!", "success");
}

function triggerImportUjianExcel() {
  const fileInput = document.getElementById('fileInputUjianExcel');
  if (fileInput) {
    fileInput.value = '';
    fileInput.click();
  }
}

function prosesImportUjianExcel(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (typeof XLSX === 'undefined') {
    alert("Library SheetJS belum termuat.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      if (!rows || rows.length === 0) {
        alert("File Excel kosong atau format tidak sesuai.");
        return;
      }

      let count = 0;
      rows.forEach(r => {
        const nis = String(r["NIS"] || r["nis"] || "").trim();
        const nama = String(r["Nama Santri"] || r["nama"] || "").trim();

        const santri = AppState.santri.find(s => s.nis === nis || s.nama.toLowerCase() === nama.toLowerCase());
        if (!santri) return;

        const m = parseFloat(r["Nilai Makhraj (0-100)"] || r["Nilai Makhraj (25%)"] || r["makhraj"] || 85);
        const t = parseFloat(r["Nilai Tajwid (0-100)"] || r["Nilai Tajwid (30%)"] || r["tajwid"] || 85);
        const f = parseFloat(r["Nilai Fashahah (0-100)"] || r["Nilai Fashahah (25%)"] || r["fashahah"] || 85);
        const h = parseFloat(r["Nilai Hafalan (0-100)"] || r["Nilai Hafalan (20%)"] || r["hafalan"] || 85);

        const total = (m * 0.25) + (t * 0.30) + (f * 0.25) + (h * 0.20);
        let predikat = 'Perlu Bimbingan (D)';
        if (total >= 90) predikat = 'Mumtaz (A)';
        else if (total >= 80) predikat = 'Jayyid Jiddan (B+)';
        else if (total >= 70) predikat = 'Jayyid (B)';
        else if (total >= 60) predikat = 'Maqbul (C)';

        let exam = (AppState.ujianSemester || []).find(u => u.santriId === santri.id && u.program === 'Binnadzor');
        if (!exam) {
          exam = {
            id: 'UJI-BNZ-' + Date.now() + '-' + Math.floor(Math.random() * 900),
            santriId: santri.id,
            santriNama: santri.nama,
            nis: santri.nis,
            program: 'Binnadzor',
            semester: document.getElementById('ujianBinnadzorFilterSemester')?.value || 'Semester Ganjil',
            tahunAjaran: document.getElementById('ujianBinnadzorFilterTahun')?.value || '2024/2025',
            tanggal: new Date().toISOString().split('T')[0],
            kelasLama: santri.halaqah,
            statusPerombakan: 'Menunggu Penerapan'
          };
          AppState.ujianSemester = AppState.ujianSemester || [];
          AppState.ujianSemester.push(exam);
        }

        exam.nilaiMakhraj = m;
        exam.nilaiTajwid = t;
        exam.nilaiFashahah = f;
        exam.nilaiHafalan = h;
        exam.nilaiAkhir = parseFloat(total.toFixed(1));
        exam.predikat = predikat;
        exam.rekomendasiKelas = hitungRekomendasiKelasBinnadzor(total, santri);
        exam.penguji = r["Nama Penguji"] || r["Penguji"] || "Musyrif Binnadzor";
        exam.catatan = r["Catatan Penguji"] || r["Catatan"] || "Hasil evaluasi semester.";
        count++;
      });

      saveToStorage();
      renderAll();
      showToast(`🎉 Sukses mengimpor nilai ujian semester untuk ${count} santri!`, "success");
    } catch (err) {
      console.error(err);
      alert("Gagal membaca file Excel. Pastikan format tabel sesuai template.");
    }
  };
  reader.readAsArrayBuffer(file);
}

function cetakBeritaAcaraPerombakan() {
  const pName = AppState.settings.namaPondok || DEFAULT_SETTINGS.namaPondok;
  const pDesc = AppState.settings.deskripsiPondok || DEFAULT_SETTINGS.deskripsiPondok;
  const pAlamat = AppState.settings.alamatPondok || DEFAULT_SETTINGS.alamatPondok;
  const pengasuh = AppState.settings.pengasuh || DEFAULT_SETTINGS.pengasuh;
  const kepala = AppState.settings.kepalaTahfidz || DEFAULT_SETTINGS.kepalaTahfidz;

  const sem = document.getElementById('ujianBinnadzorFilterSemester')?.value || 'Semester Ganjil';
  const thn = document.getElementById('ujianBinnadzorFilterTahun')?.value || '2024/2025';
  const list = (AppState.ujianSemester || []).filter(u => u.program === 'Binnadzor');

  let rowsHtml = '';
  list.forEach((u, idx) => {
    const santri = AppState.santri.find(s => s.id === u.santriId);
    const kelasSekarang = santri?.halaqah || u.rekomendasiKelas || '-';
    rowsHtml += `
      <tr>
        <td style="text-align:center;">${idx + 1}</td>
        <td><strong>${escapeHtml(u.santriNama)}</strong></td>
        <td style="text-align:center;">${escapeHtml(u.nis)}</td>
        <td>${escapeHtml(u.kelasLama || '-')}</td>
        <td style="text-align:center; font-weight:700;">${Number(u.nilaiAkhir || 0).toFixed(1)}</td>
        <td style="text-align:center;">${escapeHtml(u.predikat || '-')}</td>
        <td style="color:#15803d; font-weight:700;">${escapeHtml(u.rekomendasiKelas || '-')}</td>
        <td><strong>${escapeHtml(kelasSekarang)}</strong></td>
      </tr>
    `;
  });

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Berita Acara Evaluasi Ujian & Perombakan Kelas Binnadzor - ${escapeHtml(pName)}</title>
      <style>
        body { font-family: 'Times New Roman', serif; margin: 40px; color: #111; line-height: 1.5; }
        .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 24px; }
        .kop h2 { margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px; }
        .kop h3 { margin: 4px 0; font-size: 16px; font-weight: 500; }
        .kop p { margin: 0; font-size: 12px; font-style: italic; }
        .judul-doc { text-align: center; margin-bottom: 20px; }
        .judul-doc h4 { margin: 0; font-size: 16px; text-decoration: underline; text-transform: uppercase; }
        .judul-doc span { font-size: 12.5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12.5px; }
        th, td { border: 1px solid #000; padding: 6px 8px; }
        th { background: #f2f2f2; }
        .ttd-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; margin-top: 40px; text-align: center; font-size: 13px; }
        .ttd-box { padding: 10px; }
        .ttd-space { height: 75px; }
        @media print { body { margin: 20px; } }
      </style>
    </head>
    <body>
      <div class="kop">
        <h2>${escapeHtml(pName)}</h2>
        <h3>${escapeHtml(pDesc)}</h3>
        <p>${escapeHtml(pAlamat)}</p>
      </div>

      <div class="judul-doc">
        <h4>BERITA ACARA EVALUASI UJIAN SEMESTER & PEROMBAKAN KELAS BINNADZOR</h4>
        <span>Periode: ${escapeHtml(sem)} • Tahun Ajaran: ${escapeHtml(thn)}</span>
      </div>

      <p style="font-size:13px; text-align:justify;">
        Pada hari ini telah diselenggarakan Sidang Pleno Asatidz Divisi Tahfidz & Binnadzor mengenai penetapan hasil Evaluasi Ujian Akhir Semester dan Penataan/Perombakan Kelas Binnadzor berdasarkan pencapaian fashahah, kaidah tajwid, makharijul huruf, serta hafalan dasar santri dengan hasil ketetapan sebagai berikut:
      </p>

      <table>
        <thead>
          <tr>
            <th style="width:30px;">No</th>
            <th>Nama Lengkap Santri</th>
            <th>NIS</th>
            <th>Kelas Asal</th>
            <th>Nilai Akhir</th>
            <th>Predikat</th>
            <th>Rekomendasi</th>
            <th>Kelas Baru Ditetapkan</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="ttd-grid">
        <div class="ttd-box">
          <p>Ketua Panitia Ujian,</p>
          <div class="ttd-space"></div>
          <strong>Ust. Miftah Faridl, S.Pd.I.</strong>
        </div>
        <div class="ttd-box">
          <p>Kepala Divisi Tahfidz,</p>
          <div class="ttd-space"></div>
          <strong>${escapeHtml(kepala)}</strong>
        </div>
        <div class="ttd-box">
          <p>Pengasuh Pondok Pesantren,</p>
          <div class="ttd-space"></div>
          <strong>${escapeHtml(pengasuh)}</strong>
        </div>
      </div>

      <script>
        window.onload = function() { window.print(); };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

function cetakRaportUjianTahfidz(examId) {
  const exam = (AppState.ujianSemester || []).find(u => u.id === examId);
  if (!exam) return;

  const santri = AppState.santri.find(s => s.id === exam.santriId);
  const pName = AppState.settings.namaPondok || DEFAULT_SETTINGS.namaPondok;
  const pDesc = AppState.settings.deskripsiPondok || DEFAULT_SETTINGS.deskripsiPondok;
  const pAlamat = AppState.settings.alamatPondok || DEFAULT_SETTINGS.alamatPondok;
  const kepala = AppState.settings.kepalaTahfidz || DEFAULT_SETTINGS.kepalaTahfidz;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Raport Ujian Tasmi' Semester Tahfidz - ${escapeHtml(exam.santriNama)}</title>
      <style>
        body { font-family: 'Times New Roman', serif; margin: 40px; color: #111; line-height: 1.6; }
        .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 24px; }
        .kop h2 { margin: 0; font-size: 22px; text-transform: uppercase; }
        .kop h3 { margin: 4px 0; font-size: 15px; font-weight: 500; }
        .kop p { margin: 0; font-size: 12px; font-style: italic; }
        .judul { text-align: center; margin-bottom: 20px; }
        .judul h3 { margin: 0; text-decoration: underline; font-size: 17px; text-transform: uppercase; }
        .identitas-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13.5px; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
        th, td { border: 1px solid #000; padding: 8px 10px; }
        th { background: #f2f2f2; }
        .catatan-box { border: 1px solid #000; padding: 12px; margin-top: 18px; font-size: 13px; min-height: 60px; }
        .ttd-grid { display: grid; grid-template-columns: 1fr 1fr; margin-top: 40px; text-align: center; font-size: 13.5px; }
        .ttd-space { height: 75px; }
      </style>
    </head>
    <body>
      <div class="kop">
        <h2>${escapeHtml(pName)}</h2>
        <h3>${escapeHtml(pDesc)}</h3>
        <p>${escapeHtml(pAlamat)}</p>
      </div>

      <div class="judul">
        <h3>RAPORT EVALUASI UJIAN TASMI' SEMESTER TAHFIDZ</h3>
        <span>${escapeHtml(exam.semester)} • Tahun Ajaran ${escapeHtml(exam.tahunAjaran || '2024/2025')}</span>
      </div>

      <div class="identitas-grid">
        <div><strong>Nama Santri:</strong> ${escapeHtml(exam.santriNama)}</div>
        <div><strong>Nomor Induk (NIS):</strong> ${escapeHtml(exam.nis)}</div>
        <div><strong>Program:</strong> Tahfidz 30 Juz Bil-Ghaib</div>
        <div><strong>Halaqah Bimbingan:</strong> ${escapeHtml(exam.halaqah || santri?.halaqah || '-')}</div>
        <div><strong>Tanggal Ujian:</strong> ${formatTanggalIndo(exam.tanggal || '')}</div>
        <div><strong>Materi Diujikan:</strong> ${escapeHtml(exam.juzDiuji || 'Tasmi\' Sekali Duduk')}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width:35px;">No</th>
            <th>Aspek Penilaian Ujian Tasmi'</th>
            <th style="text-align:center; width:90px;">Bobot</th>
            <th style="text-align:center; width:90px;">Nilai (0-100)</th>
            <th style="text-align:center; width:110px;">Nilai Tertimbang</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align:center;">1</td>
            <td><strong>Kelancaran Hafalan Bil-Ghaib</strong> (Tanpa Teguran/Tersendat)</td>
            <td style="text-align:center;">40%</td>
            <td style="text-align:center;">${exam.nilaiKelancaran || 0}</td>
            <td style="text-align:center;">${((exam.nilaiKelancaran || 0) * 0.40).toFixed(1)}</td>
          </tr>
          <tr>
            <td style="text-align:center;">2</td>
            <td><strong>Kaidah Tajwid & Makharijul Huruf</strong> (Ghunnah, Mad, Fashahah)</td>
            <td style="text-align:center;">35%</td>
            <td style="text-align:center;">${exam.nilaiTajwid || 0}</td>
            <td style="text-align:center;">${((exam.nilaiTajwid || 0) * 0.35).toFixed(1)}</td>
          </tr>
          <tr>
            <td style="text-align:center;">3</td>
            <td><strong>Ketahanan Duduk & Adab Muraja'ah</strong> (Tasmi' Kontinu)</td>
            <td style="text-align:center;">25%</td>
            <td style="text-align:center;">${exam.nilaiKetahanan || 0}</td>
            <td style="text-align:center;">${((exam.nilaiKetahanan || 0) * 0.25).toFixed(1)}</td>
          </tr>
          <tr style="background:#f9f9f9; font-weight:700;">
            <td colspan="3" style="text-align:right;">NILAI AKHIR EVALUASI SEMESTER:</td>
            <td colspan="2" style="text-align:center; font-size:16px; color:#065f46;">
              ${Number(exam.nilaiAkhir || 0).toFixed(1)} (${escapeHtml(exam.predikat || '-')})
            </td>
          </tr>
        </tbody>
      </table>

      <div class="catatan-box">
        <strong>Catatan & Arahan Asatidz Penguji:</strong>
        <p style="margin:4px 0 0 0;">${escapeHtml(exam.catatan || 'Alhamdulillah, ujian tasmi selesai dengan baik. Tingkatkan murajaah harian.')}</p>
      </div>

      <div class="ttd-grid">
        <div>
          <p>Asatidz Penguji / Musyrif,</p>
          <div class="ttd-space"></div>
          <strong>${escapeHtml(exam.penguji || 'Musyrif Halaqah')}</strong>
        </div>
        <div>
          <p>Kepala Divisi Tahfidz,</p>
          <div class="ttd-space"></div>
          <strong>${escapeHtml(kepala)}</strong>
        </div>
      </div>

      <script>
        window.onload = function() { window.print(); };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

// ================= 5. WISUDA BINNADZOR (PROMOSI KE TAHFIDZ) =================
function renderWisudaTables() {
  // 1. Table 1: Peserta Sidang Tes Maqbul (Evaluasi 3 Bulanan Binnadzor)
  const tbodyMaqbul = document.getElementById('tableTesMaqbulBody');
  if (tbodyMaqbul) {
    tbodyMaqbul.innerHTML = '';
    const bnzList = AppState.santri.filter(s => s.program === 'Binnadzor');

    if (bnzList.length === 0) {
      tbodyMaqbul.innerHTML = `<tr><td colspan="8" class="empty-state">Belum ada santri di program Binnadzor.</td></tr>`;
    } else {
      bnzList.forEach(s => {
        const p = s.binnadzorProgress || {};
        const sp = p.hafalanSuratPilihan || {};
        const avgJuz = Math.round(((p.hafalanJuz30 || 0) + (p.hafalanJuz29 || 0) + (p.hafalanJuz28 || 0)) / 3);

        const pillSurat = `
          <div style="font-size:11px; line-height:1.4;">
            <span style="color:${(sp.yasin || 0) >= 100 ? '#166534' : '#64748b'}">Yasin: ${(sp.yasin || 0)}%</span> • 
            <span style="color:${(sp.arRahman || 0) >= 100 ? '#166534' : '#64748b'}">Rahman: ${(sp.arRahman || 0)}%</span><br>
            <span style="color:${(sp.alWaqiah || 0) >= 100 ? '#166534' : '#64748b'}">Waqi'ah: ${(sp.alWaqiah || 0)}%</span> • 
            <span style="color:${(sp.alMulk || 0) >= 100 ? '#166534' : '#64748b'}">Mulk: ${(sp.alMulk || 0)}%</span>
          </div>
        `;

        let statusMaqbulBadge = '';
        let btnAction = '';

        if (p.statusTesMaqbul === 'Lolos Tes Maqbul') {
          statusMaqbulBadge = `<span class="badge" style="background:#ecfdf5; color:#065f46; font-weight:700;">✓ Lolos Maqbul</span>`;
          btnAction = `<span style="font-size:11px; color:#15803d; font-weight:600;">Di Program Maqbul</span>`;
        } else if (p.statusTesMaqbul === 'Layak Tes Maqbul' || avgJuz >= 90) {
          statusMaqbulBadge = `<span class="badge" style="background:#fffbeb; color:#b45309; font-weight:700;">🌟 Layak Uji Maqbul</span>`;
          btnAction = `
            <button class="btn btn-gold btn-sm" onclick="openModalTesMaqbulAction('${s.id}')">
              🌟 Uji & Luluskan Maqbul
            </button>
          `;
        } else {
          statusMaqbulBadge = `<span style="font-size:11.5px; color:#64748b;">Sedang Proses</span>`;
          btnAction = `
            <button class="btn btn-secondary btn-sm" onclick="openModalTesMaqbulAction('${s.id}')">
              Uji Tes Maqbul
            </button>
          `;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${escapeHtml(s.nama)}</strong></td>
          <td>${escapeHtml(s.nis)}</td>
          <td><span class="badge" style="background:#e0f2fe; color:#0369a1;">${escapeHtml(s.halaqah || '-')}</span></td>
          <td style="font-size:12px;">${escapeHtml(p.terakhirBacaan || 'Khatam 30 Juz')}</td>
          <td>
            <div style="font-size:11.5px; font-weight:600;">J30: ${p.hafalanJuz30 || 0}% • J29: ${p.hafalanJuz29 || 0}% • J28: ${p.hafalanJuz28 || 0}%</div>
            <div style="font-size:10.5px; color:#64748b;">Rata-rata: ${avgJuz}%</div>
          </td>
          <td>${pillSurat}</td>
          <td>${statusMaqbulBadge}</td>
          <td style="text-align:center;">${btnAction}</td>
        `;
        tbodyMaqbul.appendChild(tr);
      });
    }
  }

  // 2. Table 2: Santri di "Program Maqbul" (Persiapan Menuju Tahfidz & Menunggu Wisuda)
  const tbodySiap = document.getElementById('tableSiapWisudaBody');
  if (tbodySiap) {
    tbodySiap.innerHTML = '';
    const maqbulList = AppState.santri.filter(s => 
      s.program === 'Program Maqbul' || 
      (s.program === 'Binnadzor' && s.binnadzorProgress?.statusTesMaqbul === 'Lolos Tes Maqbul') ||
      (s.program === 'Binnadzor' && s.binnadzorProgress?.statusWisuda === 'Siap Wisuda')
    );

    // Update notification badge
    const pillSiap = document.getElementById('pillSiapWisuda');
    if (pillSiap) pillSiap.textContent = `${maqbulList.length} Maqbul/Siap`;

    if (maqbulList.length === 0) {
      tbodySiap.innerHTML = `<tr><td colspan="7" class="empty-state">Saat ini belum ada santri di Program Maqbul.</td></tr>`;
    } else {
      maqbulList.forEach(s => {
        const p = s.binnadzorProgress || {};
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${escapeHtml(s.nama)}</strong></td>
          <td>${escapeHtml(s.nis)}</td>
          <td><span class="badge" style="background:#f1f5f9; color:#334155;">${escapeHtml(s.halaqah || '-')}</span></td>
          <td>${formatTanggalIndo(p.tanggalTesMaqbul || '2024-10-15')}</td>
          <td><span class="nilai-chip nilai-mumtaz">${escapeHtml(p.nilaiTesMaqbul || 'Mumtaz (A)')}</span></td>
          <td><span class="badge badge-ready-grad">🎓 Siap Wisuda Binnadzor</span></td>
          <td style="text-align:center;">
            <button class="btn btn-gold btn-sm" onclick="openModalWisudaAction('${s.id}')">
              🎓 Wisudakan & Promosikan ke Tahfidz
            </button>
          </td>
        `;
        tbodySiap.appendChild(tr);
      });
    }
  }

  // 3. Table 3: Alumni Wisuda Binnadzor (Kini di Program Tahfidz 30 Juz)
  const tbodyAlumni = document.getElementById('tableAlumniWisudaBody');
  if (tbodyAlumni) {
    tbodyAlumni.innerHTML = '';
    const alumniList = AppState.santri.filter(s => s.program === 'Tahfidz' && s.binnadzorProgress?.statusWisuda === 'Sudah Wisuda');

    if (alumniList.length === 0) {
      tbodyAlumni.innerHTML = `<tr><td colspan="8" class="empty-state">Belum ada riwayat santri wisuda binnadzor.</td></tr>`;
    } else {
      alumniList.forEach(s => {
        const p = s.binnadzorProgress || {};
        const tp = s.tahfidzProgress || {};
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${escapeHtml(s.nama)}</strong></td>
          <td>${escapeHtml(s.nis)}</td>
          <td><strong style="color:var(--tahfidz-color);">${escapeHtml(s.halaqah || '-')}</strong></td>
          <td>${formatTanggalIndo(p.tanggalWisuda || '')}</td>
          <td><code>${escapeHtml(p.noIjazah || '-')}</code></td>
          <td><span class="nilai-chip nilai-mumtaz">${escapeHtml(p.predikatWisuda || 'Mumtaz (A)')}</span></td>
          <td><strong>${tp.totalJuzHafal || 3} / 30 Juz</strong> (${tp.juzMutqinList?.length || 0} Mutqin)</td>
          <td style="text-align:center;">
            <button class="btn btn-secondary btn-sm" onclick="previewSertifikatWisuda('${s.id}')">
              📜 Lihat Piagam
            </button>
          </td>
        `;
        tbodyAlumni.appendChild(tr);
      });
    }
  }

  // 4. Table 4: Calon Wisuda Tahfidz 30 Juz (Santri Tahfidz Khatam 30 Juz)
  const tbodyCalonTahfidz = document.getElementById('tableCalonWisudaTahfidzBody');
  if (tbodyCalonTahfidz) {
    tbodyCalonTahfidz.innerHTML = '';
    const calonList = AppState.santri.filter(s => 
      s.program === 'Tahfidz' && 
      ((s.tahfidzProgress?.totalJuzHafal || 0) >= 30 || (s.tahfidzProgress?.juzZiyadahList?.length || 0) >= 30)
    );

    if (calonList.length === 0) {
      tbodyCalonTahfidz.innerHTML = `<tr><td colspan="7" class="empty-state">Saat ini belum ada santri Tahfidz yang mencapai 30 Juz khatam.</td></tr>`;
    } else {
      calonList.forEach(s => {
        const tp = s.tahfidzProgress || {};
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${escapeHtml(s.nama)}</strong></td>
          <td>${escapeHtml(s.nis)}</td>
          <td><span class="badge" style="background:#ecfdf5; color:#065f46;">${escapeHtml(s.halaqah || '-')}</span></td>
          <td><strong style="color:#059669; font-size:13px;">30 / 30 Juz Khatam</strong> (${tp.juzMutqinList?.length || 0} Mutqin)</td>
          <td style="font-size:12px;">${escapeHtml(tp.terakhirSetor || 'Khotmil Qur\'an Bil-Ghaib')}</td>
          <td><span class="badge badge-ready-grad" style="background:#fef3c7; color:#92400e;">👑 Siap Wisuda Tahfidz</span></td>
          <td style="text-align:center;">
            <button class="btn btn-gold btn-sm" onclick="openModalWisudaTahfidzAction('${s.id}')">
              👑 Sidang & Wisuda Tahfidz 30 Juz
            </button>
          </td>
        `;
        tbodyCalonTahfidz.appendChild(tr);
      });
    }
  }

  // 5. Table 5: Monitoring Kelas Pasca Tahfidz (Progres Tasmi' & Sanad)
  const tbodyPasca = document.getElementById('tablePascaTahfidzBody');
  if (tbodyPasca) {
    tbodyPasca.innerHTML = '';
    const pascaList = AppState.santri.filter(s => s.program === 'Pasca Tahfidz');

    if (pascaList.length === 0) {
      tbodyPasca.innerHTML = `<tr><td colspan="8" class="empty-state">Belum ada mahasantri di Kelas Pasca Tahfidz.</td></tr>`;
    } else {
      pascaList.forEach(s => {
        const tp = s.tahfidzProgress || {};
        const pst = s.pascaTahfidzProgress || {};

        const chip5 = pst.tasmi5Juz ? `<span class="badge" style="background:#dcfce7; color:#15803d; font-size:11px;">✓ 5J</span>` : `<span style="color:#94a3b8; font-size:11px;">— 5J</span>`;
        const chip10 = pst.tasmi10Juz ? `<span class="badge" style="background:#dcfce7; color:#15803d; font-size:11px;">✓ 10J</span>` : `<span style="color:#94a3b8; font-size:11px;">— 10J</span>`;
        const chip15 = pst.tasmi15Juz ? `<span class="badge" style="background:#dcfce7; color:#15803d; font-size:11px;">✓ 15J</span>` : `<span style="color:#94a3b8; font-size:11px;">— 15J</span>`;
        const chip20 = pst.tasmi20Juz ? `<span class="badge" style="background:#dcfce7; color:#15803d; font-size:11px;">✓ 20J</span>` : `<span style="color:#94a3b8; font-size:11px;">— 20J</span>`;
        const chip30 = pst.tasmi30JuzSekaliDuduk ? `<span class="badge" style="background:#fef3c7; color:#92400e; font-weight:700; font-size:11px;">👑 30J</span>` : `<span style="color:#94a3b8; font-size:11px;">— 30J</span>`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${escapeHtml(s.nama)}</strong></td>
          <td>${escapeHtml(s.nis)}</td>
          <td><strong style="color:#854d0e;">${escapeHtml(s.halaqah || '-')}</strong></td>
          <td><code>${escapeHtml(tp.noIjazahTahfidz || 'WIS-THF-2024-001')}</code></td>
          <td>
            <div style="display:flex; gap:4px; align-items:center; flex-wrap:wrap;">
              ${chip5} ${chip10} ${chip15} ${chip20} ${chip30}
            </div>
          </td>
          <td style="font-size:12px; color:#0f172a;">${escapeHtml(pst.terakhirTasmi || 'Tasmi\' Sekali Duduk')}</td>
          <td style="font-size:12px; color:#15803d; font-weight:600;">${escapeHtml(pst.statusSanad || 'Bimbingan Sanad')}</td>
          <td style="text-align:center;">
            <div style="display:flex; gap:6px; justify-content:center;">
              <button class="btn btn-gold btn-sm" onclick="openModalSetoran('${s.id}')" title="Catat Setoran Tasmi'">
                📖 Setor Tasmi'
              </button>
              <button class="btn btn-secondary btn-sm" onclick="previewPiagamWisudaTahfidz('${s.id}')" title="Lihat Piagam 30 Juz">
                👑 Piagam
              </button>
            </div>
          </td>
        `;
        tbodyPasca.appendChild(tr);
      });
    }
  }
}

// Modal & Aksi Evaluasi Tes Maqbul
function openModalTesMaqbulAction(santriId) {
  const s = AppState.santri.find(item => item.id === santriId);
  if (!s) return;

  document.getElementById('maqbulSantriId').value = s.id;
  document.getElementById('maqbulModalSantriNama').textContent = s.nama;
  document.getElementById('maqbulModalSantriNis').textContent = `NIS: ${s.nis} • Kelas: ${s.halaqah}`;
  document.getElementById('maqbulTanggal').value = new Date().toISOString().split('T')[0];
  document.getElementById('maqbulCatatan').value = "Bacaan fashih, tajwid & makharijul huruf kokoh, lulus tes maqbul triwulanan.";

  document.getElementById('modalTesMaqbulAction').classList.add('active');
}

function closeModalTesMaqbul() {
  document.getElementById('modalTesMaqbulAction').classList.remove('active');
}

function konfirmasiLolosTesMaqbul(e) {
  e.preventDefault();
  const santriId = document.getElementById('maqbulSantriId').value;
  const s = AppState.santri.find(item => item.id === santriId);
  if (!s) return;

  const tgl = document.getElementById('maqbulTanggal').value;
  const nilai = document.getElementById('maqbulNilai').value;
  const catatan = document.getElementById('maqbulCatatan').value.trim();

  // Elevate to Program Maqbul!
  s.program = 'Program Maqbul';
  if (!s.binnadzorProgress) s.binnadzorProgress = {};
  s.binnadzorProgress.statusTesMaqbul = 'Lolos Tes Maqbul';
  s.binnadzorProgress.tanggalTesMaqbul = tgl;
  s.binnadzorProgress.nilaiTesMaqbul = nilai;
  s.binnadzorProgress.catatanTesMaqbul = catatan;
  s.binnadzorProgress.statusWisuda = 'Siap Wisuda';

  saveToStorage();
  closeModalTesMaqbul();
  renderAll();

  showToast(`🎉 Alhamdulillah! Ananda ${s.nama} dinyatakan Lolos Tes Maqbul dan resmi masuk Program Maqbul persiapan Tahfidz!`, "success");
}

function openModalWisudaAction(santriId) {
  const s = AppState.santri.find(item => item.id === santriId);
  if (!s) return;

  document.getElementById('wisudaSantriId').value = s.id;
  document.getElementById('wisudaModalSantriNama').textContent = s.nama;
  document.getElementById('wisudaModalSantriNis').textContent = `NIS: ${s.nis} • Kelas Asal: ${s.halaqah}`;
  document.getElementById('wisudaTanggal').value = new Date().toISOString().split('T')[0];

  // Populate Target Halaqah Tahfidz Dropdown
  const halaqahTahfidzSelect = document.getElementById('wisudaTargetHalaqah');
  if (halaqahTahfidzSelect) {
    halaqahTahfidzSelect.innerHTML = '';
    const list = AppState.settings.daftarHalaqahTahfidz || DEFAULT_SETTINGS.daftarHalaqahTahfidz || [];
    list.forEach(h => {
      const opt = document.createElement('option');
      opt.value = h;
      opt.textContent = h;
      halaqahTahfidzSelect.appendChild(opt);
    });
  }

  const year = new Date().getFullYear();
  const randomNo = String(Math.floor(Math.random() * 900) + 100);
  document.getElementById('wisudaNoIjazah').value = `WIS-BNZ-${year}-${randomNo}`;

  document.getElementById('modalWisudaAction').classList.add('active');
}

function closeModalWisudaAction() {
  document.getElementById('modalWisudaAction').classList.remove('active');
}

function konfirmasiWisudaSantri(e) {
  e.preventDefault();
  const santriId = document.getElementById('wisudaSantriId').value;
  const s = AppState.santri.find(item => item.id === santriId);
  if (!s) return;

  const tglWisuda = document.getElementById('wisudaTanggal').value;
  const noIjazah = document.getElementById('wisudaNoIjazah').value.trim();
  const predikat = document.getElementById('wisudaPredikat').value;
  const targetHalaqah = document.getElementById('wisudaTargetHalaqah')?.value || "Halaqah Ust. Muhammad Ridwan, Al-Hafidz";

  // Elevate from Program Maqbul / Binnadzor to Tahfidz!
  s.program = 'Tahfidz';
  s.halaqah = targetHalaqah; // Now placed in the Tahfidz mentor's halaqah!
  if (!s.binnadzorProgress) s.binnadzorProgress = {};
  s.binnadzorProgress.statusWisuda = 'Sudah Wisuda';
  s.binnadzorProgress.tanggalWisuda = tglWisuda;
  s.binnadzorProgress.noIjazah = noIjazah;
  s.binnadzorProgress.predikatWisuda = predikat;

  if (!s.tahfidzProgress) {
    s.tahfidzProgress = {
      totalJuzHafal: 3,
      juzMutqinList: [28, 29, 30],
      juzZiyadahList: [28, 29, 30],
      terakhirSetor: "Wisuda Binnadzor (Juz 28, 29, 30 Mutqin)",
      targetJuz: 30
    };
  } else {
    if (!s.tahfidzProgress.juzMutqinList) s.tahfidzProgress.juzMutqinList = [28, 29, 30];
  }

  saveToStorage();
  closeModalWisudaAction();
  renderAll();

  showToast(`🎉 Barakallah! Ananda ${s.nama} resmi diwisuda binnadzor & bergabung ke ${targetHalaqah}!`, "success");
  previewSertifikatWisuda(s.id);
}

function previewSertifikatWisuda(santriId) {
  const s = AppState.santri.find(item => item.id === santriId);
  if (!s) return;

  const p = s.binnadzorProgress || {};
  const container = document.getElementById('sertifikatContent');

  container.innerHTML = `
    <div style="font-family:'Amiri', Georgia, serif; margin-bottom:12px;">
      <div style="font-size:26px; color:var(--primary-800); font-weight:bold;">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
      <div style="font-size:16px; font-weight:bold; letter-spacing:1px; margin-top:8px; text-transform:uppercase; color:var(--dark-800);">
        ${escapeHtml(AppState.settings.namaPondok || DEFAULT_SETTINGS.namaPondok)}
      </div>
      <div style="font-size:12px; color:var(--dark-500);">${escapeHtml(AppState.settings.alamatPondok || '')}</div>
    </div>

    <hr style="border:none; border-top:2px solid var(--gold-600); margin:16px auto; width:80%;">

    <h2 style="font-size:22px; font-weight:800; color:var(--gold-700); letter-spacing:1.5px; text-transform:uppercase; margin-bottom:4px;">
      PIAGAM KELULUSAN BINNADZOR
    </h2>
    <div style="font-size:12px; color:var(--dark-600);">Nomor: <strong>${escapeHtml(p.noIjazah || 'WIS-BNZ-2024-001')}</strong></div>

    <div style="font-size:14px; color:var(--dark-700); margin:20px auto 14px auto; max-width:550px; line-height:1.7;">
      Dewan Asatidz & Pengasuh Pondok menerangkan dengan sesungguhnya bahwa:
    </div>

    <div style="font-size:24px; font-weight:bold; color:var(--primary-900); text-decoration:underline; margin-bottom:4px;">
      ${escapeHtml(s.nama)}
    </div>
    <div style="font-size:13px; color:var(--dark-600); margin-bottom:16px;">
      NIS: <strong>${escapeHtml(s.nis)}</strong> • Halaqah: <strong>${escapeHtml(s.halaqah || '-')}</strong>
    </div>

    <div style="font-size:13.5px; color:var(--dark-800); line-height:1.7; max-width:600px; margin:0 auto 24px auto;">
      Telah menyelesaikan dengan baik dan dinyatakan <strong>LULUS</strong> dalam <strong>Program Binnadzor</strong>, meliputi Khatam Bacaan Al-Qur'an 30 Juz secara fashih serta tuntas Tasmi' Hafalan <strong>Juz 28, Juz 29, dan Juz 30</strong> dengan predikat:
      <div style="margin-top:10px;">
        <span class="nilai-chip nilai-mumtaz" style="font-size:15px; padding:6px 16px;">
          ${escapeHtml(p.predikatWisuda || 'Mumtaz (A)')}
        </span>
      </div>
      <div style="margin-top:10px; font-size:12px; color:var(--dark-500);">
        Dan berhak melanjutkan pendidikan ke <strong>Program Tahfidz Al-Qur'an 30 Juz Bil-Ghaib</strong>.
      </div>
    </div>

    <div style="display:flex; justify-content:space-between; margin-top:36px; padding:0 30px; font-size:12.5px;">
      <div style="text-align:center; width:220px;">
        <div>Ketua Divisi Tahfidz</div>
        <div style="height:65px;"></div>
        <div style="font-weight:bold; text-decoration:underline;">${escapeHtml(AppState.settings.kepalaTahfidz || DEFAULT_SETTINGS.kepalaTahfidz)}</div>
      </div>
      <div style="text-align:center; width:220px;">
        <div>${formatTanggalIndo(p.tanggalWisuda || new Date().toISOString().split('T')[0])}</div>
        <div>Pengasuh Pondok Pesantren</div>
        <div style="height:50px;"></div>
        <div style="font-weight:bold; text-decoration:underline;">${escapeHtml(AppState.settings.pengasuhPondok || DEFAULT_SETTINGS.pengasuhPondok)}</div>
      </div>
    </div>
  `;

  document.getElementById('modalSertifikatPreview').classList.add('active');
}

function closeModalSertifikat() {
  document.getElementById('modalSertifikatPreview').classList.remove('active');
}

function cetakSertifikat() {
  const content = document.getElementById('sertifikatContent').innerHTML;
  const printArea = document.getElementById('printArea');
  printArea.innerHTML = `
    <div style="border:5px double #000; padding:40px; border-radius:10px;">
      ${content}
    </div>
  `;
  window.print();
}

// ================= 6. BUKU MUTABA'AH 30 JUZ =================
function renderMutabaahTab() {
  const select = document.getElementById('mutabaahSantriSelect');
  select.innerHTML = '';

  if (AppState.santri.length === 0) {
    select.innerHTML = `<option value="">Belum ada data santri</option>`;
    return;
  }

  AppState.santri.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = `${s.nama} (${s.program}${s.kelasSekolah ? ' - Kls ' + s.kelasSekolah : ''} - NIS: ${s.nis})`;
    select.appendChild(opt);
  });

  if (!AppState.selectedMutabaahSantriId || !AppState.santri.some(s => s.id === AppState.selectedMutabaahSantriId)) {
    AppState.selectedMutabaahSantriId = AppState.santri[0].id;
  }

  select.value = AppState.selectedMutabaahSantriId;
  renderMutabaahSantriDetail();
}

function lihatMutabaahSantri(santriId) {
  AppState.selectedMutabaahSantriId = santriId;
  switchTab('mutabaah');
}

function renderMutabaahSantriDetail() {
  const select = document.getElementById('mutabaahSantriSelect');
  const santriId = select.value;
  AppState.selectedMutabaahSantriId = santriId;

  const santri = AppState.santri.find(s => s.id === santriId);
  if (!santri) return;

  // Profile Card
  const profileCard = document.getElementById('mutabaahProfileCard');
  let badgeProgram = '';
  if (santri.program === 'Binnadzor') {
    badgeProgram = `<span class="badge badge-binnadzor">Program Binnadzor</span>`;
  } else if (santri.program === 'Program Maqbul') {
    badgeProgram = `<span class="badge" style="background:#fef3c7; color:#b45309; font-weight:700;">Program Maqbul</span>`;
  } else if (santri.program === 'Pasca Tahfidz') {
    badgeProgram = `<span class="badge" style="background:#fef3c7; color:#92400e; font-weight:700; border:1px solid #f59e0b;">👑 Kelas Pasca Tahfidz</span>`;
  } else {
    badgeProgram = `<span class="badge badge-tahfidz">Program Tahfidz (30 Juz)</span>`;
  }

  // Calculate attendance % for this santri
  const santriAbsensi = AppState.absensi.filter(a => a.santriId === santri.id);
  const totalHadir = santriAbsensi.filter(a => a.status.includes('Hadir')).length;
  const pctAbsensi = santriAbsensi.length > 0 ? Math.round((totalHadir / santriAbsensi.length) * 100) : 100;

  // Setoran logs of this santri
  const santriSetoran = AppState.setoran.filter(s => s.santriId === santri.id);

  let programInfo = '';
  if (santri.program === 'Binnadzor') {
    const bp = santri.binnadzorProgress || {};
    programInfo = `
      <div style="font-size:12.5px; margin-top:8px; color:var(--dark-700);">
        <div>📖 Terakhir Bacaan: <strong>${escapeHtml(bp.terakhirBacaan || 'Juz 1')}</strong></div>
        <div style="display:flex; gap:16px; margin-top:6px; flex-wrap:wrap;">
          <span>Hafalan Juz 30: <strong>${bp.hafalanJuz30 || 0}%</strong></span>
          <span>Hafalan Juz 29: <strong>${bp.hafalanJuz29 || 0}%</strong></span>
          <span>Hafalan Juz 28: <strong>${bp.hafalanJuz28 || 0}%</strong></span>
        </div>
      </div>
    `;
  } else if (santri.program === 'Pasca Tahfidz') {
    const pst = santri.pascaTahfidzProgress || {};
    const tp = santri.tahfidzProgress || {};
    programInfo = `
      <div style="font-size:12.5px; margin-top:8px; color:var(--dark-700);">
        <div>👑 Capaian: <strong style="color:#059669; font-size:14px;">Khatam 30 Juz Mutqin</strong> • Ustadz Pengampu: <strong>${escapeHtml(santri.halaqah || '-')}</strong></div>
        <div style="margin-top:4px;">Ijazah Wisuda: <code>${escapeHtml(tp.noIjazahTahfidz || '-')}</code> • Predikat: <strong>${escapeHtml(tp.predikatWisudaTahfidz || 'Mumtaz Syaraf (A+)')}</strong></div>
        <div style="margin-top:4px;">Terakhir Tasmi': <strong>${escapeHtml(pst.terakhirTasmi || 'Khotmil Qur\'an 30 Juz')}</strong> • Status: <span style="color:#15803d; font-weight:600;">${escapeHtml(pst.statusSanad || 'Bimbingan Sanad')}</span></div>
      </div>
    `;
  } else {
    const tp = santri.tahfidzProgress || {};
    programInfo = `
      <div style="font-size:12.5px; margin-top:8px; color:var(--dark-700);">
        <div>🕌 Capaian Tahfidz: <strong style="color:var(--tahfidz-color); font-size:14px;">${tp.totalJuzHafal || 3} / 30 Juz</strong> (${tp.juzMutqinList?.length || 0} Juz Mutqin)</div>
        <div style="margin-top:4px;">Terakhir Setor: <strong>${escapeHtml(tp.terakhirSetor || '-')}</strong></div>
      </div>
    `;
  }

  profileCard.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px;">
      <div>
        <div style="display:flex; align-items:center; gap:10px;">
          <h3 style="font-size:18px; font-weight:700; color:var(--dark-900);">${escapeHtml(santri.nama)}</h3>
          ${badgeProgram}
        </div>
        <div style="font-size:12.5px; color:var(--dark-500); margin-top:4px;">
          NIS: <strong>${escapeHtml(santri.nis)}</strong> • Kelas / Ustadz: <strong>${escapeHtml(santri.halaqah || '-')}</strong> ${santri.kelasSekolah ? `• Kelas Sekolah: <strong style="color:#0284c7;">Kelas ${escapeHtml(santri.kelasSekolah)}</strong>` : ''} • Asrama: <strong>${escapeHtml(santri.asrama || '-')}</strong>
        </div>
        ${programInfo}
      </div>

      <div style="display:flex; gap:16px; text-align:right;">
        <div>
          <div style="font-size:11px; text-transform:uppercase; color:var(--dark-500); font-weight:600;">Disiplin Kehadiran</div>
          <div style="font-size:22px; font-weight:700; color:var(--primary-700);">${pctAbsensi}%</div>
          <div style="font-size:11px; color:var(--dark-500);">${totalHadir}/${santriAbsensi.length} Sesi Hadir</div>
        </div>
        <div>
          <div style="font-size:11px; text-transform:uppercase; color:var(--dark-500); font-weight:600;">Total Setoran</div>
          <div style="font-size:22px; font-weight:700; color:var(--gold-600);">${santriSetoran.length}</div>
          <div style="font-size:11px; color:var(--dark-500);">Kali Setor</div>
        </div>
      </div>
    </div>
  `;

  // Render 30 Juz Grid
  render30JuzGrid(santri, santriSetoran);

  // Render Setoran History Table
  renderMutabaahHistoryTable(santriSetoran);
}

function render30JuzGrid(santri, setoranList) {
  const grid = document.getElementById('mutabaahJuzGrid');
  grid.innerHTML = '';

  const mutqinList = santri.tahfidzProgress?.juzMutqinList || [];
  const ziyadahList = santri.tahfidzProgress?.juzZiyadahList || [];

  for (let juzNo = 1; juzNo <= 30; juzNo++) {
    const isTargetBinnadzor = BINNADZOR_TARGET_JUZ.includes(juzNo);
    const box = document.createElement('div');
    box.className = 'juz-box';

    let statusText = 'Belum';
    let stateClass = '';

    if (santri.program === 'Pasca Tahfidz') {
      stateClass = 'status-mutqin';
      statusText = 'Mutqin 30J ✓';
    } else if (santri.program === 'Binnadzor') {
      if (isTargetBinnadzor) {
        box.classList.add('status-binnadzor-target');
        const p = santri.binnadzorProgress || {};
        const pct = (juzNo === 30 ? p.hafalanJuz30 : (juzNo === 29 ? p.hafalanJuz29 : p.hafalanJuz28)) || 0;
        if (pct >= 100) {
          stateClass = 'status-mutqin';
          statusText = 'Lulus 100%';
        } else if (pct > 0) {
          stateClass = 'status-proses';
          statusText = `${pct}% Setor`;
        } else {
          statusText = 'Target Hafalan';
        }
      } else {
        // Just reading / binnadzor
        const setorCount = setoranList.filter(s => s.juz === juzNo).length;
        if (setorCount > 0) {
          stateClass = 'status-proses';
          statusText = 'Bacaan';
        } else {
          statusText = 'Belum';
        }
      }
    } else {
      // Tahfidz Program
      if (mutqinList.includes(juzNo)) {
        stateClass = 'status-mutqin';
        statusText = 'Mutqin ✓';
      } else if (ziyadahList.includes(juzNo)) {
        stateClass = 'status-ziyadah';
        statusText = 'Ziyadah';
      } else {
        const hasSetor = setoranList.some(s => s.juz === juzNo);
        if (hasSetor) {
          stateClass = 'status-proses';
          statusText = 'Proses';
        } else {
          statusText = 'Belum';
        }
      }
    }

    if (stateClass) box.classList.add(stateClass);

    box.innerHTML = `
      <div class="juz-box-no">Juz ${juzNo}</div>
      <div class="juz-box-status">${statusText}</div>
    `;

    box.title = `Klik untuk memfilter riwayat Juz ${juzNo}`;
    box.onclick = () => filterMutabaahByJuz(juzNo);

    grid.appendChild(box);
  }
}

function filterMutabaahByJuz(juzNo) {
  AppState.activeFilterJuz = juzNo;
  const santri = AppState.santri.find(s => s.id === AppState.selectedMutabaahSantriId);
  if (!santri) return;

  const santriSetoran = AppState.setoran.filter(s => s.santriId === santri.id && s.juz === juzNo);
  renderMutabaahHistoryTable(santriSetoran, juzNo);
}

function renderMutabaahHistoryTable(setoranList, filteredJuz = null) {
  const tbody = document.getElementById('tableMutabaahSetoranHistory');
  tbody.innerHTML = '';

  let list = [...setoranList].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-state">${filteredJuz ? `Belum ada riwayat setoran di Juz ${filteredJuz}.` : 'Belum ada catatan setoran untuk santri ini.'}</td></tr>`;
    return;
  }

  list.forEach(item => {
    const chipNilai = getNilaiChipHtml(item.nilai);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatTanggalIndo(item.tanggal)}</td>
      <td>${escapeHtml(item.sesi || '-')}</td>
      <td><strong>${escapeHtml(item.jenisSetoran)}</strong></td>
      <td>Juz ${item.juz} • QS. ${escapeHtml(item.suratNama || '-')} (${item.ayatAwal || 1}-${item.ayatAkhir || 1})</td>
      <td>${chipNilai}</td>
      <td style="font-size:12px; color:var(--dark-600);">${escapeHtml(item.catatan || '-')}</td>
      <td style="font-size:12px; color:var(--dark-500);">${escapeHtml(item.penyimak || '-')}</td>
    `;
    tbody.appendChild(tr);
  });
}

function cetakKartuMutabaah() {
  const santri = AppState.santri.find(s => s.id === AppState.selectedMutabaahSantriId);
  if (!santri) return;

  const santriSetoran = AppState.setoran.filter(s => s.santriId === santri.id);
  const santriAbsensi = AppState.absensi.filter(a => a.santriId === santri.id);
  const totalHadir = santriAbsensi.filter(a => a.status.includes('Hadir')).length;
  const pctAbsensi = santriAbsensi.length > 0 ? Math.round((totalHadir / santriAbsensi.length) * 100) : 100;

  let tableRows = '';
  santriSetoran.slice(0, 20).forEach(item => {
    tableRows += `
      <tr>
        <td>${formatTanggalIndo(item.tanggal)}</td>
        <td>${escapeHtml(item.jenisSetoran)}</td>
        <td>Juz ${item.juz} • QS. ${escapeHtml(item.suratNama || '-')} : ${item.ayatAwal}-${item.ayatAkhir}</td>
        <td>${escapeHtml(item.nilai)}</td>
        <td>${escapeHtml(item.catatan || '-')}</td>
        <td>${escapeHtml(item.penyimak || '-')}</td>
      </tr>
    `;
  });

  const printArea = document.getElementById('printArea');
  printArea.innerHTML = `
    <div class="print-kop">
      <h2>${escapeHtml(AppState.settings.namaPondok || DEFAULT_SETTINGS.namaPondok)}</h2>
      <p>${escapeHtml(AppState.settings.alamatPondok || '')} • Telp: ${escapeHtml(AppState.settings.noKontakPondok || '')}</p>
      <h3 style="margin-top:10px; font-size:14pt; text-decoration:underline;">LEMBAR PETA HAFALAN & SETORAN SANTRI</h3>
    </div>

    <table style="width:100%; font-size:11pt; margin-bottom:15px;">
      <tr>
        <td style="width:140px;"><strong>Nama Santri</strong></td>
        <td>: ${escapeHtml(santri.nama)}</td>
        <td style="width:140px;"><strong>Program</strong></td>
        <td>: ${escapeHtml(santri.program)}</td>
      </tr>
      <tr>
        <td><strong>NIS</strong></td>
        <td>: ${escapeHtml(santri.nis)}</td>
        <td><strong>Kelas / Ustadz</strong></td>
        <td>: ${escapeHtml(santri.halaqah || '-')}</td>
      </tr>
      <tr>
        <td><strong>Kelas Sekolah</strong></td>
        <td>: ${escapeHtml(santri.kelasSekolah ? 'Kelas ' + santri.kelasSekolah : '-')}</td>
        <td><strong>Kamar/Asrama</strong></td>
        <td>: ${escapeHtml(santri.asrama || '-')}</td>
      </tr>
      <tr>
        <td><strong>Kehadiran Sesi</strong></td>
        <td colspan="3">: ${pctAbsensi}% (${totalHadir}/${santriAbsensi.length} Sesi Hadir)</td>
      </tr>
    </table>

    <table class="print-table">
      <thead>
        <tr style="background:#f1f5f9;">
          <th>Tanggal</th>
          <th>Jenis Setoran</th>
          <th>Materi Hafalan</th>
          <th>Nilai</th>
          <th>Catatan Evaluasi Musyrif</th>
          <th>Penyimak</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows || '<tr><td colspan="6" style="text-align:center;">Belum ada riwayat setoran</td></tr>'}
      </tbody>
    </table>

    <div class="print-signatures">
      <div class="print-sig-col">
        <div>Mengetahui,</div>
        <div>Orang Tua / Wali Santri</div>
        <div class="print-sig-space"></div>
        <div>( _____________________ )</div>
      </div>
      <div class="print-sig-col">
        <div>Ustadz / Musyrif Halaqah</div>
        <div class="print-sig-space"></div>
        <div><strong>${escapeHtml(AppState.settings.kepalaTahfidz || DEFAULT_SETTINGS.kepalaTahfidz)}</strong></div>
      </div>
      <div class="print-sig-col">
        <div>Pengasuh Pondok Pesantren</div>
        <div class="print-sig-space"></div>
        <div><strong>${escapeHtml(AppState.settings.pengasuhPondok || DEFAULT_SETTINGS.pengasuhPondok)}</strong></div>
      </div>
    </div>
  `;

  window.print();
}

function kirimLaporanWhatsAppSantri() {
  const santri = AppState.santri.find(s => s.id === AppState.selectedMutabaahSantriId);
  if (!santri) return;

  if (!santri.noHpWali) {
    showToast(`Nomor WhatsApp wali santri ${santri.nama} belum terdaftar! Silakan edit data santri.`, "error");
    return;
  }

  // Format clean phone number (replace 08xx with 628xx)
  let cleanPhone = santri.noHpWali.replace(/\D/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.substring(1);
  }

  const santriSetoran = AppState.setoran.filter(s => s.santriId === santri.id);
  const lastSetoran = santriSetoran.length > 0 ? santriSetoran[0] : null;

  const santriAbsensi = AppState.absensi.filter(a => a.santriId === santri.id);
  const totalHadir = santriAbsensi.filter(a => a.status.includes('Hadir')).length;
  const pctAbsensi = santriAbsensi.length > 0 ? Math.round((totalHadir / santriAbsensi.length) * 100) : 100;

  let progressDetail = '';
  if (santri.program === 'Binnadzor') {
    const bp = santri.binnadzorProgress || {};
    progressDetail = `*Program:* Binnadzor\n*Bacaan Terakhir:* ${bp.terakhirBacaan || 'Juz 1'}\n*Hafalan Juz 30:* ${bp.hafalanJuz30 || 0}%\n*Hafalan Juz 29:* ${bp.hafalanJuz29 || 0}%\n*Hafalan Juz 28:* ${bp.hafalanJuz28 || 0}%\n*Status Wisuda:* ${bp.statusWisuda || 'Pra-Wisuda'}`;
  } else {
    const tp = santri.tahfidzProgress || {};
    progressDetail = `*Program:* Tahfidz 30 Juz\n*Total Hafalan:* ${tp.totalJuzHafal || 3} dari 30 Juz\n*Juz Mutqin:* ${tp.juzMutqinList?.length || 0} Juz\n*Terakhir Setor:* ${tp.terakhirSetor || '-'}`;
  }

  let lastSetorInfo = lastSetoran 
    ? `\n*Setoran Terakhir:* ${lastSetoran.jenisSetoran} (Juz ${lastSetoran.juz}, QS. ${lastSetoran.suratNama})\n*Nilai:* ${lastSetoran.nilai}\n*Catatan Musyrif:* _"${lastSetoran.catatan || 'Alhamdulillah lancar'}"_`
    : `\n*Setoran Terakhir:* Belum ada catatan pekan ini`;

  const now = new Date();
  const currentMonthStr = String(now.getMonth() + 1).padStart(2, '0');
  const yearMonthPrefix = `${now.getFullYear()}-${currentMonthStr}`;
  const sAbsensiMonth = AppState.absensi.filter(a => a.santriId === santri.id && a.tanggal && a.tanggal.startsWith(yearMonthPrefix));
  const hadirMonth = sAbsensiMonth.filter(a => a.status && a.status.includes('Hadir')).length;
  const pctMonth = sAbsensiMonth.length > 0 ? Math.round((hadirMonth / sAbsensiMonth.length) * 100) : pctAbsensi;

  const sSetoranMonth = AppState.setoran.filter(s => s.santriId === santri.id && s.tanggal && s.tanggal.startsWith(yearMonthPrefix));
  let monthCapaianSummary = '';
  if (santri.program === 'Binnadzor' || santri.program === 'Program Maqbul') {
    const setBaca = sSetoranMonth.filter(s => s.jenisSetoran && (s.jenisSetoran.includes('Bacaan') || s.jenisSetoran.includes('Binnadzor') || s.jenisSetoran.includes('Khotmil')));
    const hlmBaca = setBaca.reduce((sum, s) => sum + (Number(s.halaman) || 2), 0);
    const setHafal = sSetoranMonth.filter(s => s.jenisSetoran && (s.jenisSetoran.includes('Hafalan') || s.jenisSetoran.includes('Ziyadah')));
    const hlmHafal = setHafal.reduce((sum, s) => sum + (Number(s.halaman) || 1), 0);
    monthCapaianSummary = `\n*Rekap Capaian Bulan Ini:* Bacaan ${hlmBaca} Hlm | Tambah Hafalan ${hlmHafal} Hlm (${setBaca.length + setHafal.length}x setoran)`;
  } else {
    const setZiy = sSetoranMonth.filter(s => s.jenisSetoran && s.jenisSetoran.includes('Ziyadah'));
    const hlmZiy = setZiy.reduce((sum, s) => sum + (Number(s.halaman) || 1), 0);
    const setMur = sSetoranMonth.filter(s => s.jenisSetoran && (s.jenisSetoran.includes('Muraja') || s.jenisSetoran.includes('Tasmi')));
    const hlmMur = setMur.reduce((sum, s) => sum + (Number(s.halaman) || 2), 0);
    monthCapaianSummary = `\n*Rekap Capaian Bulan Ini:* Ziyadah Baru ${hlmZiy} Hlm (~${(hlmZiy/20).toFixed(1)} Juz) | Muraja'ah ${hlmMur} Hlm`;
  }

  // Dynamic portal link based on current location or domain
  const portalUrl = window.location.origin.includes('file:') 
    ? `portal-wali.html?nis=${santri.nis}` 
    : `${window.location.origin}${window.location.pathname.replace(/index\.html$/, '')}portal-wali.html?nis=${santri.nis}`;

  const pesan = `*LAPORAN PERKEMBANGAN TAHFIDZ SANTRI*\n*${AppState.settings.namaPondok || DEFAULT_SETTINGS.namaPondok}*\n\n` +
    `Assalamu'alaikum Warahmatullahi Wabarakatuh,\n` +
    `Yth. Bapak/Ibu Wali dari ananda:\n\n` +
    `*Nama:* ${santri.nama}\n` +
    `*NIS:* ${santri.nis}\n` +
    `*Program:* ${santri.program}\n` +
    `*Kelas / Ustadz:* ${santri.halaqah || '-'}\n` +
    (santri.kelasSekolah ? `*Kelas Sekolah:* Kelas ${santri.kelasSekolah}\n` : '') +
    `*Disiplin Kehadiran Bulan Ini:* ${pctMonth}% (${hadirMonth}/${sAbsensiMonth.length || 0} sesi)\n\n` +
    `📋 *Capaian Hafalan Saat Ini:*\n` +
    `${progressDetail}` +
    `${monthCapaianSummary}` +
    `${lastSetorInfo}\n\n` +
    `🌐 *Tautan Informasi & Pantauan Hafalan Ananda:*\n` +
    `Bapak/Ibu dapat memantau rekap absensi, hasil setoran bulanan, dan peta hafalan lengkap ananda melalui tautan:\n` +
    `${portalUrl}\n\n` +
    `Mohon senantiasa doa dan motivasi dari Bapak/Ibu agar ananda senantiasa istiqomah bersama Al-Qur'an. Jazakumullahu Khairan Katsira.\n\n` +
    `Wassalamu'alaikum Warahmatullahi Wabarakatuh,\n` +
    `*Divisi Tahfidz Al-Qur'an*`;

  const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(pesan)}`;
  window.open(url, '_blank');
}

function bukaPortalWaliSantriTerpilih() {
  const santri = AppState.santri.find(s => s.id === AppState.selectedMutabaahSantriId);
  const nis = santri ? santri.nis : '';
  window.open(`portal-wali.html${nis ? '?nis=' + encodeURIComponent(nis) : ''}`, '_blank');
}

function salinLinkPortalWali() {
  const santri = AppState.santri.find(s => s.id === AppState.selectedMutabaahSantriId);
  if (!santri) return;

  const currentOrigin = window.location.origin.includes('file:') 
    ? '' 
    : `${window.location.origin}${window.location.pathname.replace(/index\.html$/, '')}`;
  const link = `${currentOrigin}portal-wali.html?nis=${santri.nis}`;

  navigator.clipboard.writeText(link).then(() => {
    showToast(`Tautan informasi santri ananda ${santri.nama} berhasil disalin!`, 'success');
  }).catch(() => {
    prompt("Salin tautan ini untuk diberikan ke wali santri:", link);
  });
}

// ================= 7. LAPORAN, REKAP BULANAN & EKSPOR DATA =================

function renderRekapBulanan() {
  const bulanEl = document.getElementById('rekapFilterBulan');
  const tahunEl = document.getElementById('rekapFilterTahun');
  const progEl = document.getElementById('rekapFilterProgram');
  const searchEl = document.getElementById('rekapSearch');
  const tbody = document.getElementById('tableRekapBulananBody');

  if (!bulanEl || !tahunEl || !tbody) return;

  const now = new Date();
  if (!bulanEl.value) bulanEl.value = String(now.getMonth() + 1);
  if (!tahunEl.value) tahunEl.value = String(now.getFullYear());

  const selectedMonth = parseInt(bulanEl.value, 10);
  const selectedYear = parseInt(tahunEl.value, 10);
  const monthStr = String(selectedMonth).padStart(2, '0');
  const yearMonthPrefix = `${selectedYear}-${monthStr}`;

  const progFilter = progEl?.value || '';
  const search = (searchEl?.value || '').toLowerCase().trim();

  let filteredSantri = AppState.santri.filter(s => {
    const matchProg = !progFilter || s.program === progFilter;
    const matchSearch = !search ||
      s.nama.toLowerCase().includes(search) ||
      s.nis.toLowerCase().includes(search) ||
      (s.halaqah && s.halaqah.toLowerCase().includes(search));
    return matchProg && matchSearch;
  });

  if (filteredSantri.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="empty-state">Tidak ada data santri untuk filter ini.</td></tr>`;
    return;
  }

  let grandTotalPresensiPct = 0;
  let totalSantriPresensiCount = 0;
  let grandTotalHlmBaca = 0;
  let grandTotalHlmZiyadah = 0;
  let grandTotalHlmMurajaah = 0;
  let totalActiveSessions = 0;

  // Pre-filter absensi & setoran for selected month
  const monthAbsensi = AppState.absensi.filter(a => a.tanggal && a.tanggal.startsWith(yearMonthPrefix));
  const monthSetoran = AppState.setoran.filter(s => s.tanggal && s.tanggal.startsWith(yearMonthPrefix));
  totalActiveSessions = monthAbsensi.length;

  // Hitung jumlah hari aktif vs hari libur pada bulan & tahun terpilih
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  let countHariAktif = 0;
  let countHariLiburRutin = 0;
  let countHariLiburEvent = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${selectedYear}-${monthStr}-${String(d).padStart(2, '0')}`;
    const st = cekStatusHari(dStr, AppState.settings);
    if (!st.isLibur) {
      countHariAktif++;
    } else if (st.jenis === 'rutin') {
      countHariLiburRutin++;
    } else {
      countHariLiburEvent++;
    }
  }
  const totalHariLibur = countHariLiburRutin + countHariLiburEvent;

  const noticeEl = document.getElementById('rekapStatHariAktifNotice');
  if (noticeEl) {
    const namaBln = bulanEl.options[bulanEl.selectedIndex]?.text || `Bulan ${selectedMonth}`;
    noticeEl.textContent = `Bulan ${namaBln} ${selectedYear}: Terdapat ${countHariAktif} hari aktif halaqah setoran (Sabtu s.d. Rabu) & ${totalHariLibur} hari libur (${countHariLiburRutin} libur rutin Kamis-Jumat, ${countHariLiburEvent} event pondok). Hari libur tidak dihitung sebagai Alpa santri.`;
  }
  const badgeAktifEl = document.getElementById('rekapBadgeHariAktif');
  if (badgeAktifEl) badgeAktifEl.textContent = `${countHariAktif} Hari Aktif`;
  const badgeLiburEl = document.getElementById('rekapBadgeHariLibur');
  if (badgeLiburEl) badgeLiburEl.textContent = `${totalHariLibur} Hari Libur`;

  const rowsHtml = filteredSantri.map((s, idx) => {
    // 1. Presensi 1 Bulan (Abaikan status Alpa di hari libur Kamis/Jumat/Event)
    const sAbsensi = monthAbsensi.filter(a => {
      if (a.santriId !== s.id) return false;
      const st = cekStatusHari(a.tanggal, AppState.settings);
      if (st.isLibur && (a.status || '').includes('Alpa')) return false;
      return true;
    });
    const hCount = sAbsensi.filter(a => a.status && a.status.includes('Hadir')).length;
    const iCount = sAbsensi.filter(a => a.status && a.status.includes('Izin')).length;
    const sCount = sAbsensi.filter(a => a.status && a.status.includes('Sakit')).length;
    const aCount = sAbsensi.filter(a => a.status && (a.status.includes('Alpa') || a.status.includes('Belum'))).length;
    const totalSesi = sAbsensi.length;
    const pctKehadiran = totalSesi > 0 ? Math.round((hCount / totalSesi) * 100) : (s.statusSantri === 'Aktif' ? 100 : 0);

    grandTotalPresensiPct += pctKehadiran;
    totalSantriPresensiCount++;

    let badgePct = 'badge-jayyid';
    if (pctKehadiran >= 95) badgePct = 'badge-mumtaz';
    else if (pctKehadiran >= 85) badgePct = 'badge-jayyid-jiddan';
    else if (pctKehadiran < 75) badgePct = 'badge-maqbul';

    const presensiCellHtml = `
      <div style="font-size:12px;">
        <div style="display:flex; align-items:center; gap:6px;">
          <span class="nilai-chip ${badgePct}" style="font-weight:700;">${pctKehadiran}%</span>
          <span style="font-size:11px; color:#64748b;">(${hCount}/${totalSesi || 0} sesi)</span>
        </div>
        <div style="font-size:11px; color:#475569; margin-top:3px;">
          <span style="color:#16a34a; font-weight:600;">H: ${hCount}</span> • 
          <span style="color:#d97706; font-weight:600;">I: ${iCount}</span> • 
          <span style="color:#0284c7; font-weight:600;">S: ${sCount}</span> • 
          <span style="color:#dc2626; font-weight:600;">A: ${aCount}</span>
        </div>
      </div>
    `;

    // 2. Setoran 1 Bulan
    const sSetoran = monthSetoran.filter(set => set.santriId === s.id);
    
    let capaianBacaHtml = '-';
    let tambahHafalanHtml = '-';
    let capaianMurajaahHtml = '-';
    let nilaiTerbaikHtml = '-';

    if (s.program === 'Binnadzor' || s.program === 'Program Maqbul') {
      const setoranBaca = sSetoran.filter(set => 
        (set.jenisSetoran && (set.jenisSetoran.includes('Bacaan') || set.jenisSetoran.includes('Binnadzor') || set.jenisSetoran.includes('Khotmil')))
      );
      const hlmBaca = setoranBaca.reduce((acc, curr) => acc + (Number(curr.halaman) || 2), 0);
      grandTotalHlmBaca += hlmBaca;

      if (hlmBaca > 0) {
        capaianBacaHtml = `
          <div style="font-size:12px;">
            <strong style="color:#0369a1;">📖 ${hlmBaca} Halaman</strong>
            <div style="font-size:10.5px; color:#64748b;">${setoranBaca.length}x setoran bacaan</div>
          </div>
        `;
      } else {
        capaianBacaHtml = `<span style="font-size:11.5px; color:#94a3b8;">Belum ada setoran baca</span>`;
      }

      const setoranHafalan = sSetoran.filter(set => 
        (set.jenisSetoran && (set.jenisSetoran.includes('Hafalan') || set.jenisSetoran.includes('Ziyadah') || set.jenisSetoran.includes('Tasmi')))
      );
      const hlmHafal = setoranHafalan.reduce((acc, curr) => acc + (Number(curr.halaman) || 1), 0);
      grandTotalHlmZiyadah += hlmHafal;

      if (setoranHafalan.length > 0) {
        const lastSurat = setoranHafalan[0].suratNama || 'Juz 30';
        tambahHafalanHtml = `
          <div style="font-size:12px;">
            <strong style="color:#059669;">✨ +${hlmHafal} Hlm (${setoranHafalan.length}x)</strong>
            <div style="font-size:10.5px; color:#64748b;">Terakhir: ${escapeHtml(lastSurat)}</div>
          </div>
        `;
      } else {
        tambahHafalanHtml = `<span style="font-size:11.5px; color:#94a3b8;">Belum nambah hafalan</span>`;
      }

      capaianMurajaahHtml = `<div style="font-size:11px; color:#475569;">Yasin, Waqiah, Mulk, Rahman</div>`;

    } else if (s.program === 'Pasca Tahfidz') {
      capaianBacaHtml = `<span style="font-size:11px; color:#64748b;">Alumni Wisuda</span>`;
      tambahHafalanHtml = `<strong style="font-size:12px; color:#059669;">👑 Khatam 30 Juz</strong>`;

      const setoranTasmi = sSetoran.filter(set => 
        set.jenisSetoran && (set.jenisSetoran.includes('Tasmi') || set.jenisSetoran.includes('Muraja'))
      );
      const totalHlmTasmi = setoranTasmi.reduce((acc, curr) => acc + (Number(curr.halaman) || 20), 0);
      grandTotalHlmMurajaah += totalHlmTasmi;

      capaianMurajaahHtml = `
        <div style="font-size:12px;">
          <strong style="color:#b45309;">Tasmi' ${totalHlmTasmi > 0 ? (totalHlmTasmi + ' Hlm') : 'Aktif'}</strong>
          <div style="font-size:10.5px; color:#64748b;">${setoranTasmi.length}x sidang tasmi'</div>
        </div>
      `;

    } else {
      capaianBacaHtml = `<span style="font-size:11px; color:#64748b;">Fokus Bil-Ghaib</span>`;

      const setoranZiyadah = sSetoran.filter(set => 
        set.jenisSetoran && (set.jenisSetoran.includes('Ziyadah') || set.jenisSetoran.includes('Baru'))
      );
      const hlmZiyadah = setoranZiyadah.reduce((acc, curr) => acc + (Number(curr.halaman) || 1), 0);
      grandTotalHlmZiyadah += hlmZiyadah;

      if (hlmZiyadah > 0) {
        const estJuz = (hlmZiyadah / 20).toFixed(1);
        tambahHafalanHtml = `
          <div style="font-size:12px;">
            <strong style="color:#059669;">🕌 +${hlmZiyadah} Hlm (~${estJuz} Juz)</strong>
            <div style="font-size:10.5px; color:#64748b;">${setoranZiyadah.length}x setoran ziyadah</div>
          </div>
        `;
      } else {
        tambahHafalanHtml = `<span style="font-size:11.5px; color:#94a3b8;">0 Hlm (Muraja'ah murni)</span>`;
      }

      const setoranMurajaah = sSetoran.filter(set => 
        set.jenisSetoran && (set.jenisSetoran.includes('Muraja') || set.jenisSetoran.includes('Tasmi'))
      );
      const hlmMurajaah = setoranMurajaah.reduce((acc, curr) => acc + (Number(curr.halaman) || 2), 0);
      grandTotalHlmMurajaah += hlmMurajaah;

      if (hlmMurajaah > 0) {
        const estJuzMur = (hlmMurajaah / 20).toFixed(1);
        capaianMurajaahHtml = `
          <div style="font-size:12px;">
            <strong style="color:#7c3aed;">🔄 ${hlmMurajaah} Hlm (~${estJuzMur} Juz)</strong>
            <div style="font-size:10.5px; color:#64748b;">${setoranMurajaah.length}x putaran muraja'ah</div>
          </div>
        `;
      } else {
        capaianMurajaahHtml = `<span style="font-size:11.5px; color:#94a3b8;">Belum ada muraja'ah</span>`;
      }
    }

    if (sSetoran.length > 0) {
      const topNilai = sSetoran[0].nilai || 'Mumtaz (A)';
      nilaiTerbaikHtml = getNilaiChipHtml(topNilai);
    } else {
      nilaiTerbaikHtml = `<span style="font-size:11px; color:#94a3b8;">-</span>`;
    }

    let badgeProg = '';
    if (s.program === 'Binnadzor') badgeProg = `<span class="badge badge-binnadzor">Binnadzor</span>`;
    else if (s.program === 'Program Maqbul') badgeProg = `<span class="badge" style="background:#fef3c7; color:#b45309; font-weight:700;">Maqbul</span>`;
    else if (s.program === 'Pasca Tahfidz') badgeProg = `<span class="badge" style="background:#fef3c7; color:#92400e; font-weight:700;">👑 Pasca</span>`;
    else badgeProg = `<span class="badge badge-tahfidz">Tahfidz</span>`;

    return `
      <tr>
        <td style="font-size:12px; text-align:center;">${idx + 1}</td>
        <td>
          <strong style="font-size:13.5px; color:#0f172a;">${escapeHtml(s.nama)}</strong>
          <div style="font-size:11px; color:#64748b;">NIS: ${escapeHtml(s.nis)}</div>
        </td>
        <td>${badgeProg}</td>
        <td style="font-size:12px;">
          <div style="font-weight:600; color:#1e293b;">${escapeHtml(s.halaqah || '-')}</div>
        </td>
        <td>${presensiCellHtml}</td>
        <td>${capaianBacaHtml}</td>
        <td>${tambahHafalanHtml}</td>
        <td>${capaianMurajaahHtml}</td>
        <td style="text-align:center;">${nilaiTerbaikHtml}</td>
      </tr>
    `;
  }).join('');

  tbody.innerHTML = rowsHtml;

  // Update Mini Stats
  const avgPct = totalSantriPresensiCount > 0 ? Math.round(grandTotalPresensiPct / totalSantriPresensiCount) : 0;
  const statAvgEl = document.getElementById('rekapStatAvgPresensi');
  if (statAvgEl) statAvgEl.textContent = `${avgPct}%`;

  const statSesiEl = document.getElementById('rekapStatSesiCount');
  if (statSesiEl) statSesiEl.textContent = `${totalActiveSessions} presensi aktif`;

  const statBacaEl = document.getElementById('rekapStatTotalBaca');
  if (statBacaEl) statBacaEl.textContent = `${grandTotalHlmBaca} Hlm`;

  const statZiyEl = document.getElementById('rekapStatTotalZiyadah');
  if (statZiyEl) statZiyEl.textContent = `${grandTotalHlmZiyadah} Hlm`;

  const statMurEl = document.getElementById('rekapStatTotalMurajaah');
  if (statMurEl) statMurEl.textContent = `${grandTotalHlmMurajaah} Hlm`;
}

function unduhTemplateRekapBulananExcel() {
  const headers = ['Tahun', 'Bulan (1-12)', 'NIS', 'Nama Santri', 'Program', 'Kelas / Halaqah', 'Sesi Hadir', 'Sesi Izin', 'Sesi Sakit', 'Sesi Alpa', 'Persentase Kehadiran', 'Capaian Baca Binnadzor (Hlm)', 'Ziyadah Baru (Hlm)', 'Murajaah (Hlm)', 'Predikat Nilai'];
  const sampleRows = [
    [2024, 11, '20240101', 'Ahmad Fauzi Al-Ghifari', 'Binnadzor', 'Kelas A1 (Ust. Miftah Faridl)', 22, 1, 1, 0, '92%', 42, 8, 0, 'Mumtaz (A)'],
    [2024, 11, '20240102', 'Muhammad Fikri Pratama', 'Tahfidz', 'Halaqah Ust. Muhammad Ridwan', 24, 0, 0, 0, '100%', 0, 18, 90, 'Mumtaz (A)'],
    [2024, 11, '20240105', 'Zainal Musthafa', 'Pasca Tahfidz', 'Halaqah Pasca Tahfidz KH. Ahmad Dahlan', 24, 0, 0, 0, '100%', 0, 0, 120, 'Mumtaz (A)']
  ];
  const widths = [10, 12, 14, 28, 16, 32, 12, 12, 12, 12, 18, 24, 18, 18, 16];
  exportWorkbookExcel(headers, sampleRows, 'TemplateRekap', 'Template_Import_Rekap_Bulanan.xlsx', widths);
  showToast("Template Excel Rekap Bulanan berhasil diunduh!", "success");
}
const unduhTemplateRekapBulananCSV = unduhTemplateRekapBulananExcel;

function eksporRekapBulananExcel() {
  const bulanEl = document.getElementById('rekapFilterBulan');
  const tahunEl = document.getElementById('rekapFilterTahun');
  const selectedMonth = parseInt(bulanEl?.value || (new Date().getMonth() + 1), 10);
  const selectedYear = parseInt(tahunEl?.value || new Date().getFullYear(), 10);
  const monthStr = String(selectedMonth).padStart(2, '0');
  const yearMonthPrefix = `${selectedYear}-${monthStr}`;

  const headers = ['Tahun', 'Bulan', 'NIS', 'Nama Santri', 'Program', 'Kelas / Halaqah', 'Sesi Hadir', 'Sesi Izin', 'Sesi Sakit', 'Sesi Alpa', 'Persen Kehadiran', 'Capaian Baca Binnadzor (Hlm)', 'Ziyadah Baru (Hlm)', 'Murajaah (Hlm)', 'Predikat Nilai'];

  const monthAbsensi = AppState.absensi.filter(a => a.tanggal && a.tanggal.startsWith(yearMonthPrefix));
  const monthSetoran = AppState.setoran.filter(s => s.tanggal && s.tanggal.startsWith(yearMonthPrefix));

  const rows = AppState.santri.map(s => {
    const sAbsensi = monthAbsensi.filter(a => {
      if (a.santriId !== s.id) return false;
      const st = cekStatusHari(a.tanggal, AppState.settings);
      if (st.isLibur && (a.status || '').includes('Alpa')) return false;
      return true;
    });
    const hCount = sAbsensi.filter(a => a.status && a.status.includes('Hadir')).length;
    const iCount = sAbsensi.filter(a => a.status && a.status.includes('Izin')).length;
    const sCount = sAbsensi.filter(a => a.status && a.status.includes('Sakit')).length;
    const aCount = sAbsensi.filter(a => a.status && (a.status.includes('Alpa') || a.status.includes('Belum'))).length;
    const totalSesi = sAbsensi.length;
    const pctKehadiran = totalSesi > 0 ? Math.round((hCount / totalSesi) * 100) : 100;

    const sSetoran = monthSetoran.filter(set => set.santriId === s.id);
    let hlmBaca = 0;
    let hlmZiyadah = 0;
    let hlmMurajaah = 0;
    let nilai = '-';

    if (s.program === 'Binnadzor' || s.program === 'Program Maqbul') {
      const setoranBaca = sSetoran.filter(set => set.jenisSetoran && (set.jenisSetoran.includes('Bacaan') || set.jenisSetoran.includes('Binnadzor') || set.jenisSetoran.includes('Khotmil')));
      hlmBaca = setoranBaca.reduce((acc, curr) => acc + (Number(curr.halaman) || 2), 0);
      const setoranHafalan = sSetoran.filter(set => set.jenisSetoran && (set.jenisSetoran.includes('Hafalan') || set.jenisSetoran.includes('Ziyadah') || set.jenisSetoran.includes('Tasmi')));
      hlmZiyadah = setoranHafalan.reduce((acc, curr) => acc + (Number(curr.halaman) || 1), 0);
    } else {
      const setoranZiyadah = sSetoran.filter(set => set.jenisSetoran && (set.jenisSetoran.includes('Ziyadah') || set.jenisSetoran.includes('Baru')));
      hlmZiyadah = setoranZiyadah.reduce((acc, curr) => acc + (Number(curr.halaman) || 1), 0);
      const setoranMurajaah = sSetoran.filter(set => set.jenisSetoran && (set.jenisSetoran.includes('Muraja') || set.jenisSetoran.includes('Tasmi')));
      hlmMurajaah = setoranMurajaah.reduce((acc, curr) => acc + (Number(curr.halaman) || 2), 0);
    }

    if (sSetoran.length > 0) {
      nilai = sSetoran[0].nilai || 'Mumtaz (A)';
    }

    return [
      selectedYear,
      selectedMonth,
      s.nis,
      s.nama,
      s.program,
      s.halaqah || '',
      hCount,
      iCount,
      sCount,
      aCount,
      `${pctKehadiran}%`,
      hlmBaca,
      hlmZiyadah,
      hlmMurajaah,
      nilai
    ];
  });

  const widths = [10, 10, 14, 28, 16, 32, 12, 12, 12, 12, 16, 24, 18, 18, 16];
  exportWorkbookExcel(headers, rows, 'RekapBulanan', `Rekap_Bulanan_${selectedYear}_${monthStr}.xlsx`, widths);
  showToast("Rekap Bulanan berhasil diekspor ke Microsoft Excel (.xlsx)!", "success");
}
const eksporRekapBulananCSV = eksporRekapBulananExcel;

function triggerImportRekapBulananExcel() {
  const input = document.getElementById('fileInputRekapBulananCSV');
  if (input) input.click();
}
const triggerImportRekapBulananCSV = triggerImportRekapBulananExcel;

function prosesImportRekapBulananExcel(event) {
  const file = event.target.files[0];
  if (!file) return;

  readExcelOrCSV(file, (rows, err) => {
    if (err || !rows || rows.length < 2) {
      showToast("Gagal membaca file Excel/CSV rekap bulanan.", "error");
      event.target.value = '';
      return;
    }

    let count = 0;
    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i];
      if (!cols || cols.length < 5) continue;

      const tahun = String(cols[0] || '2024').trim();
      const bulan = String(cols[1] || '11').trim().padStart(2, '0');
      const nis = String(cols[2] || '').trim();
      const nama = String(cols[3] || '').trim();
      if (!nama && !nis) continue;

      const program = String(cols[4] || 'Binnadzor').trim();
      const kelas = String(cols[5] || '').trim();
      const hCount = Number(cols[6]) || 25;
      const hlmBaca = Number(cols[11]) || 0;
      const hlmZiyadah = Number(cols[12]) || 0;
      const hlmMurajaah = Number(cols[13]) || 0;
      const nilai = String(cols[14] || 'Mumtaz (A)').trim();

      let santri = AppState.santri.find(s => (nis && s.nis === nis) || (s.nama.toLowerCase() === nama.toLowerCase()));
      if (!santri) {
        santri = {
          id: "STR-" + Date.now() + "-" + count,
          nis: nis || ("2024" + String(count).padStart(4, '0')),
          nama: nama,
          jenisKelamin: 'L',
          program: program,
          halaqah: kelas,
          asrama: 'Asrama Pondok',
          tanggalMasuk: `${tahun}-${bulan}-01`,
          statusSantri: 'Aktif',
          binnadzorProgress: { statusWisuda: program === 'Tahfidz' ? 'Sudah Wisuda' : 'Belum Wisuda Binnadzor' },
          tahfidzProgress: { totalJuzHafal: program === 'Tahfidz' ? 5 : 0 }
        };
        AppState.santri.push(santri);
      }

      // Add a representative setoran record for the month if imported
      const existingSet = AppState.setoran.find(s => s.santriId === santri.id && s.tanggal && s.tanggal.startsWith(`${tahun}-${bulan}`));
      if (!existingSet) {
        if (hlmBaca > 0) {
          AppState.setoran.push({
            id: "SET-IMP-" + Date.now() + "-" + count + "-B",
            tanggal: `${tahun}-${bulan}-15`,
            sesi: "Shubuh",
            santriId: santri.id,
            santriNama: santri.nama,
            program: santri.program,
            jenisSetoran: "Bacaan Binnadzor",
            juz: 1,
            suratNama: "Khotmil Qur'an",
            ayatAwal: 1,
            ayatAkhir: 50,
            halaman: hlmBaca,
            nilai: nilai,
            catatan: "Rekap impor bulanan Excel",
            penyimak: "Musyrif Binnadzor"
          });
        }
        if (hlmZiyadah > 0) {
          AppState.setoran.push({
            id: "SET-IMP-" + Date.now() + "-" + count + "-Z",
            tanggal: `${tahun}-${bulan}-20`,
            sesi: "Shubuh",
            santriId: santri.id,
            santriNama: santri.nama,
            program: santri.program,
            jenisSetoran: "Ziyadah (Baru)",
            juz: 30,
            suratNama: "Juz 30",
            ayatAwal: 1,
            ayatAkhir: 20,
            halaman: hlmZiyadah,
            nilai: nilai,
            catatan: "Rekap impor bulanan Excel",
            penyimak: "Musyrif Tahfidz"
          });
        }
      }
      count++;
    }

    saveToStorage();
    renderRekapBulanan();
    updateNavPills();
    renderDashboard();
    showToast(`Alhamdulillah! Berhasil mengimpor ${count} data rekap bulanan dari file Excel!`, "success");
    event.target.value = '';
  });
}
const prosesImportRekapBulananCSV = prosesImportRekapBulananExcel;

function cetakRekapBulanan() {
  const bulanEl = document.getElementById('rekapFilterBulan');
  const tahunEl = document.getElementById('rekapFilterTahun');
  const bulanIdx = parseInt(bulanEl?.value || '11', 10);
  const tahun = tahunEl?.value || '2024';
  const namaBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ][bulanIdx - 1] || 'November';

  const namaPondok = AppState.settings.namaPondok || "Pondok Pesantren Tahfidz Al-Qur'an Al-Barokah";
  const alamatPondok = AppState.settings.alamatPondok || "Jl. Pesantren Luhur No. 45, Cirebon";
  const pengasuh = AppState.settings.pengasuhPondok || "KH. Ahmad Dahlan Masykur, Al-Hafidz";
  const kepalaTahfidz = AppState.settings.kepalaTahfidz || "Ust. Muhammad Ridwan, S.Pd.I., Al-Hafidz";

  const tableHtml = document.getElementById('tableRekapBulananBody')?.innerHTML || '';

  const printArea = document.getElementById('printArea');
  if (!printArea) return;

  printArea.innerHTML = `
    <div style="font-family:'Times New Roman', Times, serif; color:#000; padding:20px;">
      <div style="text-align:center; border-bottom:3px double #000; padding-bottom:12px; margin-bottom:18px;">
        <h2 style="font-size:18px; margin:0; text-transform:uppercase;">${escapeHtml(namaPondok)}</h2>
        <p style="font-size:12px; margin:4px 0 0 0;">${escapeHtml(alamatPondok)} • Telepon: ${escapeHtml(AppState.settings.noKontakPondok || '-')}</p>
        <h3 style="font-size:15px; margin:14px 0 0 0; text-decoration:underline;">REKAPITULASI HASIL CAPAIAN AL-QUR'AN & PRESENSI SANTRI</h3>
        <p style="font-size:12px; margin:4px 0 0 0; font-weight:bold;">Periode Bulan: ${namaBulan} ${tahun}</p>
      </div>

      <table style="width:100%; border-collapse:collapse; font-size:11px; margin-bottom:30px;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="border:1px solid #000; padding:6px;">No</th>
            <th style="border:1px solid #000; padding:6px;">Nama Santri & NIS</th>
            <th style="border:1px solid #000; padding:6px;">Program</th>
            <th style="border:1px solid #000; padding:6px;">Kelas / Ustadz</th>
            <th style="border:1px solid #000; padding:6px;">Rekap Presensi</th>
            <th style="border:1px solid #000; padding:6px;">Capaian Bacaan</th>
            <th style="border:1px solid #000; padding:6px;">Tambah Hafalan (Ziyadah)</th>
            <th style="border:1px solid #000; padding:6px;">Capaian Muraja'ah</th>
            <th style="border:1px solid #000; padding:6px;">Nilai</th>
          </tr>
        </thead>
        <tbody>
          ${tableHtml}
        </tbody>
      </table>

      <div style="display:flex; justify-content:space-between; margin-top:40px; font-size:12px;">
        <div style="text-align:center; width:220px;">
          <div>Mengetahui,</div>
          <div>Pengasuh Pondok Pesantren</div>
          <div style="height:60px;"></div>
          <div style="font-weight:bold; text-decoration:underline;">${escapeHtml(pengasuh)}</div>
        </div>
        <div style="text-align:center; width:220px;">
          <div>Cirebon, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          <div>Ketua Divisi Tahfidz</div>
          <div style="height:60px;"></div>
          <div style="font-weight:bold; text-decoration:underline;">${escapeHtml(kepalaTahfidz)}</div>
        </div>
      </div>
    </div>
  `;

  window.print();
}

// ========================================================
// CORE EXCEL (.XLSX) EXPORT & IMPORT ENGINE (SHEETJS)
// ========================================================

function exportWorkbookExcel(headers, rows, sheetName, filename, colWidths) {
  if (typeof XLSX !== 'undefined') {
    const aoa = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // Apply column widths
    if (colWidths && Array.isArray(colWidths)) {
      ws['!cols'] = colWidths.map(w => ({ wch: w }));
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Data');
    XLSX.writeFile(wb, filename);
  } else {
    // Graceful fallback to CSV if SheetJS isn't loaded
    let csv = headers.map(h => `"${String(h || '').replace(/"/g, '""')}"`).join(',') + '\n';
    rows.forEach(r => {
      csv += r.map(c => `"${String(c === null || c === undefined ? '' : c).replace(/"/g, '""')}"`).join(',') + '\n';
    });
    downloadBlob(csv, filename.replace(/\.xlsx$/, '.csv'), 'text/csv;charset=utf-8;');
  }
}

function readExcelOrCSV(file, callback) {
  if (!file) return;

  if (typeof XLSX !== 'undefined') {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        // Read as array of arrays (header: 1)
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
        callback(rows, null);
      } catch (err) {
        callback(null, err);
      }
    };
    reader.readAsArrayBuffer(file);
  } else {
    // Fallback text parser
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const text = e.target.result;
        const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
        const rows = lines.map(line => {
          const res = [];
          let cur = '';
          let inQuote = false;
          for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
              inQuote = !inQuote;
            } else if (ch === ',' && !inQuote) {
              res.push(cur.trim());
              cur = '';
            } else {
              cur += ch;
            }
          }
          res.push(cur.trim());
          return res;
        });
        callback(rows, null);
      } catch (err) {
        callback(null, err);
      }
    };
    reader.readAsText(file);
  }
}

// ================= FITUR IMPOR & TEMPLATE DATA SANTRI (EXCEL .XLSX) =================

function unduhTemplateExcel() {
  const headers = ['NIS', 'Nama Lengkap', 'Jenis Kelamin (L/P)', 'Kelas Sekolah', 'Program (Binnadzor/Tahfidz/Pasca)', 'Kelas / Halaqah Ustadz', 'Asrama / Kamar', 'Nama Wali', 'No. WhatsApp Wali', 'Tanggal Masuk (YYYY-MM-DD)', 'Status Wisuda Binnadzor', 'Tanggal Wisuda', 'Total Juz Tahfidz'];
  const sampleRows = [
    ['20240101', 'Ahmad Fauzi Al-Ghifari', 'L', '7', 'Binnadzor', 'Kelas A1 (Ust. Miftah Faridl)', 'Asrama Umar / Kamar 01', 'H. Abdullah Shodiq', '081234567801', '2024-07-15', 'Belum', '', 0],
    ['20240102', 'Farid Wildani', 'L', '12', 'Tahfidz', 'Halaqah Ust. Wildan, Al-Hafidz', 'Asrama Umar / Kamar 03', 'H. Wildan Fauzi', '081234567825', '2022-07-15', 'Sudah Wisuda', '2023-12-20', 16],
    ['20240103', 'Aisyah Nurul Izzah', 'P', '8', 'Binnadzor', 'Kelas Putri A1 (Ustdzh. Maryam Ulfah)', 'Asrama Khadijah / Kamar Putri 01', 'H. Maryono', '081234567803', '2024-07-15', 'Belum', '', 0],
    ['20240105', 'Zainal Musthafa', 'L', '12', 'Pasca Tahfidz', 'Halaqah Pasca Tahfidz KH. Ahmad Dahlan Masykur, Al-Hafidz', 'Asrama Utsman / Kamar 01', 'KH. Musthafa Bisri', '081234567805', '2022-07-15', 'Sudah Wisuda', '2023-10-22', 30]
  ];
  const widths = [14, 28, 18, 16, 25, 32, 26, 22, 20, 22, 22, 16, 16];
  exportWorkbookExcel(headers, sampleRows, 'DataSantri', 'Template_Import_Santri_Tahfidz.xlsx', widths);
  showToast("Template Excel Data Santri berhasil diunduh!", "success");
}
const unduhTemplateCSV = unduhTemplateExcel;

function eksporSantriExcel() {
  const headers = ['NIS', 'Nama Lengkap', 'Jenis Kelamin', 'Kelas Sekolah', 'Program', 'Halaqah / Kelas Ustadz', 'Asrama / Kamar', 'Nama Wali', 'No. WhatsApp Wali', 'Tanggal Masuk', 'Status Wisuda Binnadzor', 'Tanggal Wisuda', 'Total Juz Tahfidz'];
  const rows = AppState.santri.map(s => {
    const bp = s.binnadzorProgress || {};
    const tp = s.tahfidzProgress || {};
    return [
      s.nis,
      s.nama,
      s.jenisKelamin || 'L',
      s.kelasSekolah || '',
      s.program,
      s.halaqah || '',
      s.asrama || '',
      s.namaWali || '',
      s.noHpWali || '',
      s.tanggalMasuk || '',
      bp.statusWisuda || '',
      bp.tanggalWisuda || '',
      tp.totalJuzHafal || 0
    ];
  });
  const widths = [14, 28, 14, 16, 18, 32, 26, 22, 20, 16, 22, 16, 16];
  exportWorkbookExcel(headers, rows, 'DataSantri', `Master_Santri_Tahfidz_${getTodayDateStr()}.xlsx`, widths);
  showToast("Data Santri berhasil diekspor ke Microsoft Excel (.xlsx)!", "success");
}
const eksporSantriCSV = eksporSantriExcel;

function triggerImportExcel() {
  const el = document.getElementById('fileInputCSV');
  if (el) el.click();
}
const triggerImportCSV = triggerImportExcel;

function prosesImportExcel(event) {
  const file = event.target.files[0];
  if (!file) return;

  readExcelOrCSV(file, (rows, err) => {
    if (err || !rows || rows.length < 2) {
      showToast("Gagal membaca file Excel/CSV. Pastikan format file sesuai template.", "error");
      event.target.value = '';
      return;
    }

    const headerRow = (rows[0] || []).map(h => String(h || '').toLowerCase().trim());
    const hasHeader = headerRow.some(h => h.includes('nis') || h.includes('nama'));

    let idxNis = 0, idxNama = 1, idxJK = 2, idxKelasSekolah = -1, idxProgram = 3, idxHalaqah = 4, idxAsrama = 5, idxNamaWali = 6, idxNoHpWali = 7, idxTglMasuk = 8, idxStatusWisuda = 9, idxTglWisuda = 10, idxTotalJuz = 11;

    if (hasHeader) {
      const hNis = headerRow.findIndex(h => h.includes('nis'));
      if (hNis !== -1) idxNis = hNis;
      const hNama = headerRow.findIndex(h => h.includes('nama') && !h.includes('wali'));
      if (hNama !== -1) idxNama = hNama;
      const hJK = headerRow.findIndex(h => h.includes('kelamin') || h === 'l/p' || h === 'jk');
      if (hJK !== -1) idxJK = hJK;
      const hKelas = headerRow.findIndex(h => h.includes('kelas sekolah') || (h.includes('sekolah') && !h.includes('asal')));
      if (hKelas !== -1) idxKelasSekolah = hKelas;
      const hProg = headerRow.findIndex(h => h.includes('program'));
      if (hProg !== -1) idxProgram = hProg;
      const hHal = headerRow.findIndex(h => h.includes('halaqah') || (h.includes('kelas') && !h.includes('sekolah')));
      if (hHal !== -1) idxHalaqah = hHal;
      const hAsr = headerRow.findIndex(h => h.includes('asrama') || h.includes('kamar'));
      if (hAsr !== -1) idxAsrama = hAsr;
      const hWali = headerRow.findIndex(h => h.includes('wali') && !h.includes('hp') && !h.includes('wa') && !h.includes('no'));
      if (hWali !== -1) idxNamaWali = hWali;
      const hHp = headerRow.findIndex(h => h.includes('hp') || h.includes('wa') || h.includes('telepon') || h.includes('kontak'));
      if (hHp !== -1) idxNoHpWali = hHp;
      const hMasuk = headerRow.findIndex(h => h.includes('masuk'));
      if (hMasuk !== -1) idxTglMasuk = hMasuk;
      const hWis = headerRow.findIndex(h => h.includes('status wisuda'));
      if (hWis !== -1) idxStatusWisuda = hWis;
      const hTglWis = headerRow.findIndex(h => h.includes('tanggal wisuda') || h.includes('tgl wisuda'));
      if (hTglWis !== -1) idxTglWisuda = hTglWis;
      const hJuz = headerRow.findIndex(h => h.includes('total juz') || h.includes('juz'));
      if (hJuz !== -1) idxTotalJuz = hJuz;
    }

    let count = 0;
    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i];
      if (!cols || cols.length < 2) continue;
      const nis = String(cols[idxNis] || '').trim();
      const nama = String(cols[idxNama] || '').trim();
      if (!nis || !nama) continue;

      const jk = String(cols[idxJK] || 'L').trim().toUpperCase().startsWith('P') ? 'P' : 'L';
      const kelasSekolah = idxKelasSekolah !== -1 ? String(cols[idxKelasSekolah] || '').trim() : '';
      const progCol = String(cols[idxProgram] || '').toLowerCase();
      let program = 'Binnadzor';
      if (progCol.includes('pasca')) {
        program = 'Pasca Tahfidz';
      } else if (progCol.includes('maqbul')) {
        program = 'Program Maqbul';
      } else if (progCol.includes('tahfidz')) {
        program = 'Tahfidz';
      }

      const halaqah = String(cols[idxHalaqah] || '').trim();
      const asrama = String(cols[idxAsrama] || '').trim();
      const namaWali = String(cols[idxNamaWali] || '').trim();
      const noHpWali = String(cols[idxNoHpWali] || '').trim();
      const tglMasuk = String(cols[idxTglMasuk] || getTodayDateStr()).trim();
      const statusWisuda = String(cols[idxStatusWisuda] || (program === 'Tahfidz' || program === 'Pasca Tahfidz' ? 'Sudah Wisuda' : 'Belum')).trim();
      const tglWisuda = idxTglWisuda !== -1 && cols[idxTglWisuda] ? String(cols[idxTglWisuda]).trim() : null;
      const noIjazah = cols[11] ? String(cols[11]).trim() : null;
      const totalJuz = (idxTotalJuz !== -1 ? Number(cols[idxTotalJuz]) : 0) || (program === 'Pasca Tahfidz' ? 30 : (program === 'Tahfidz' ? 3 : 0));

      let existing = AppState.santri.find(s => s.nis === nis);
      if (existing) {
        existing.nama = nama;
        existing.program = program;
        existing.halaqah = halaqah;
        if (kelasSekolah) existing.kelasSekolah = kelasSekolah;
        if (asrama) existing.asrama = asrama;
        if (namaWali) existing.namaWali = namaWali;
        if (noHpWali) existing.noHpWali = noHpWali;
      } else {
        AppState.santri.push({
          id: "STR-" + Date.now() + "-" + count,
          nis: nis,
          nama: nama,
          jenisKelamin: jk,
          program: program,
          halaqah: halaqah,
          kelasSekolah: kelasSekolah,
          asrama: asrama || 'Asrama Pondok',
          namaWali: namaWali,
          noHpWali: noHpWali,
          tanggalMasuk: tglMasuk,
          statusSantri: "Aktif",
          binnadzorProgress: {
            terakhirBacaan: (program === 'Tahfidz' || program === 'Pasca Tahfidz') ? "Khatam 30 Juz Bi-Nadzor" : "Juz 1",
            hafalanJuz30: (program === 'Tahfidz' || program === 'Pasca Tahfidz') ? 100 : 0,
            hafalanJuz29: (program === 'Tahfidz' || program === 'Pasca Tahfidz') ? 100 : 0,
            hafalanJuz28: (program === 'Tahfidz' || program === 'Pasca Tahfidz') ? 100 : 0,
            statusWisuda: (program === 'Tahfidz' || program === 'Pasca Tahfidz') ? "Sudah Wisuda" : (program === 'Program Maqbul' ? 'Persiapan Wisuda Binnadzor' : 'Belum Wisuda Binnadzor'),
            tanggalWisuda: tglWisuda || ((program === 'Tahfidz' || program === 'Pasca Tahfidz') ? "2023-12-20" : null),
            noIjazah: noIjazah,
            predikatWisuda: "Mumtaz (A)"
          },
          tahfidzProgress: {
            totalJuzHafal: totalJuz,
            juzMutqinList: (program === 'Tahfidz' || program === 'Pasca Tahfidz') ? [28, 29, 30] : [],
            juzZiyadahList: (program === 'Tahfidz' || program === 'Pasca Tahfidz') ? [28, 29, 30] : [],
            targetJuz: 30
          },
          pascaTahfidzProgress: program === 'Pasca Tahfidz' ? {
            tanggalWisudaTahfidz: tglWisuda || "2024-03-25",
            noIjazahTahfidz: noIjazah || ('WIS-THF-' + nis),
            tasmi5Juz: true,
            tasmi10Juz: true,
            tasmi15Juz: false,
            tasmi20Juz: false,
            tasmi30JuzSekaliDuduk: false,
            statusSanad: "Bimbingan Sanad Al-Qur'an"
          } : undefined
        });
      }
      count++;
    }

    saveToStorage();
    renderAll();
    showToast(`Alhamdulillah! Berhasil mengimpor ${count} santri dari file Excel!`, "success");
    event.target.value = '';
  });
}
const prosesImportCSV = prosesImportExcel;

// ================= FITUR IMPOR & TEMPLATE PRESENSI HARIAN (EXCEL .XLSX) =================

function unduhTemplateAbsensiExcel() {
  const headers = ['Tanggal (YYYY-MM-DD)', 'Sesi Halaqah', 'NIS', 'Nama Santri', 'Program', 'Halaqah / Kelas', 'Status Kehadiran', 'Keterangan / Catatan', 'Ustadz Pencatat'];
  const sampleRows = [
    ['2024-11-22', 'Shubuh (05.30 - 06.45)', '20240101', 'Ahmad Fauzi Al-Ghifari', 'Binnadzor', 'Kelas A1 (Ust. Miftah Faridl)', 'Hadir (Setor)', 'Tepat waktu dan tertib', 'Ust. Miftah Faridl'],
    ['2024-11-22', 'Shubuh (05.30 - 06.45)', '20240102', 'Muhammad Fikri Pratama', 'Tahfidz', 'Halaqah Ust. Muhammad Ridwan, Al-Hafidz', 'Hadir (Setor)', 'Lancar murajaah', 'Ust. Muhammad Ridwan'],
    ['2024-11-22', 'Shubuh (05.30 - 06.45)', '20240103', 'Aisyah Nurul Izzah', 'Binnadzor', 'Kelas Putri A1 (Ustdzh. Maryam Ulfah)', 'Izin', 'Izin ke klinik pesantren', 'Ustdzh. Maryam Ulfah']
  ];
  const widths = [18, 24, 14, 28, 16, 32, 18, 28, 24];
  exportWorkbookExcel(headers, sampleRows, 'TemplatePresensi', 'Template_Import_Presensi.xlsx', widths);
  showToast("Template Excel Presensi Santri berhasil diunduh!", "success");
}
const unduhTemplateAbsensiCSV = unduhTemplateAbsensiExcel;

function eksporAbsensiExcel() {
  const tanggal = document.getElementById('absensiTanggal')?.value || getTodayDateStr();
  const headers = ['Tanggal', 'Sesi Halaqah', 'NIS', 'Nama Santri', 'Program', 'Halaqah / Kelas', 'Status Kehadiran', 'Catatan / Keterangan', 'Dicatat Oleh'];
  const rows = AppState.absensi.map(a => [
    a.tanggal,
    a.sesi || '',
    a.santriNis || '',
    a.santriNama,
    a.program,
    a.halaqah || '',
    a.status,
    a.keterangan || '',
    a.dicatatOleh || ''
  ]);
  const widths = [14, 24, 14, 28, 16, 32, 18, 28, 22];
  exportWorkbookExcel(headers, rows, 'Presensi', `Rekap_Presensi_Tahfidz_${tanggal}.xlsx`, widths);
  showToast("Data Presensi Santri berhasil diekspor ke Microsoft Excel (.xlsx)!", "success");
}
const eksporAbsensiCSV = eksporAbsensiExcel;

function triggerImportAbsensiExcel() {
  const input = document.getElementById('fileInputAbsensiCSV');
  if (input) input.click();
}
const triggerImportAbsensiCSV = triggerImportAbsensiExcel;

function prosesImportAbsensiExcel(event) {
  const file = event.target.files[0];
  if (!file) return;

  readExcelOrCSV(file, (rows, err) => {
    if (err || !rows || rows.length < 2) {
      showToast("Gagal membaca file Excel/CSV presensi.", "error");
      event.target.value = '';
      return;
    }

    let count = 0;
    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i];
      if (!cols || cols.length < 4) continue;

      const tanggal = String(cols[0] || getTodayDateStr()).trim();
      const sesi = String(cols[1] || 'Shubuh').trim();
      const nis = String(cols[2] || '').trim();
      const nama = String(cols[3] || '').trim();
      if (!nama && !nis) continue;

      const program = String(cols[4] || 'Binnadzor').trim();
      const halaqah = String(cols[5] || '').trim();
      const status = String(cols[6] || 'Hadir (Setor)').trim();
      const ket = String(cols[7] || '').trim();
      const pencatat = String(cols[8] || 'Musyrif').trim();

      let santri = AppState.santri.find(s => (nis && s.nis === nis) || (s.nama.toLowerCase() === nama.toLowerCase()));
      const santriId = santri ? santri.id : ('STR-IMP-' + Date.now() + '-' + count);

      let existing = AppState.absensi.find(a => a.santriId === santriId && a.tanggal === tanggal && a.sesi === sesi);
      if (existing) {
        existing.status = status;
        existing.keterangan = ket;
        existing.dicatatOleh = pencatat;
      } else {
        AppState.absensi.push({
          id: "ABS-" + Date.now() + "-" + count,
          tanggal: tanggal,
          sesi: sesi,
          santriId: santriId,
          santriNama: santri ? santri.nama : nama,
          santriNis: santri ? santri.nis : nis,
          program: santri ? santri.program : program,
          halaqah: santri ? santri.halaqah : halaqah,
          status: status,
          keterangan: ket,
          dicatatOleh: pencatat,
          timestamp: new Date().toISOString()
        });
      }
      count++;
    }

    saveToStorage();
    renderPresensiTable();
    updateNavPills();
    renderDashboard();
    showToast(`Alhamdulillah! Berhasil mengimpor ${count} data presensi dari file Excel!`, "success");
    event.target.value = '';
  });
}
const prosesImportAbsensiCSV = prosesImportAbsensiExcel;

// ================= FITUR IMPOR & TEMPLATE SETORAN HAFALAN (EXCEL .XLSX) =================

function unduhTemplateSetoranExcel() {
  const headers = ['Tanggal (YYYY-MM-DD)', 'Sesi Halaqah', 'NIS', 'Nama Santri', 'Program', 'Jenis Setoran', 'Juz', 'Nama Surat', 'Ayat Awal', 'Ayat Akhir', 'Halaman', 'Nilai', 'Catatan Musyrif', 'Penyimak (Ustadz)'];
  const sampleRows = [
    ['2024-11-22', 'Shubuh (05.30 - 06.45)', '20240101', 'Ahmad Fauzi Al-Ghifari', 'Binnadzor', 'Hafalan Juz 30', 30, 'An-Naba\'', 1, 20, 1, 'Mumtaz (A)', 'Makhraj dan tajwid sangat bagus', 'Ust. Miftah Faridl'],
    ['2024-11-22', 'Shubuh (05.30 - 06.45)', '20240102', 'Muhammad Fikri Pratama', 'Tahfidz', 'Ziyadah (Baru)', 1, 'Al-Baqarah', 1, 25, 2, 'Jayyid Jiddan (B+)', 'Perhatikan mad jaiz munfashil', 'Ust. Muhammad Ridwan'],
    ['2024-11-22', 'Shubuh (05.30 - 06.45)', '20240105', 'Zainal Musthafa', 'Pasca Tahfidz', 'Tasmi\' 5 Juz Sekali Duduk', 1, 'Al-Baqarah', 1, 141, 20, 'Mumtaz (A)', 'Tasmi Juz 1 lancar mutqin', 'KH. Ahmad Dahlan Masykur']
  ];
  const widths = [18, 24, 14, 28, 16, 22, 8, 18, 12, 12, 10, 18, 32, 24];
  exportWorkbookExcel(headers, sampleRows, 'TemplateSetoran', 'Template_Import_Setoran.xlsx', widths);
  showToast("Template Excel Hasil Setoran berhasil diunduh!", "success");
}
const unduhTemplateSetoranCSV = unduhTemplateSetoranExcel;

function eksporSetoranExcel() {
  const headers = ['Tanggal', 'Sesi Halaqah', 'NIS', 'Nama Santri', 'Program', 'Jenis Setoran', 'Juz', 'Nama Surat', 'Ayat Awal', 'Ayat Akhir', 'Halaman', 'Nilai', 'Catatan Musyrif', 'Penyimak'];
  const rows = AppState.setoran.map(s => {
    let santri = AppState.santri.find(st => st.id === s.santriId);
    return [
      s.tanggal,
      s.sesi || '',
      santri ? santri.nis : '',
      s.santriNama,
      s.program,
      s.jenisSetoran,
      s.juz,
      s.suratNama || '',
      s.ayatAwal,
      s.ayatAkhir,
      s.halaman || '',
      s.nilai,
      s.catatan || '',
      s.penyimak || ''
    ];
  });
  const widths = [14, 24, 14, 28, 16, 20, 8, 18, 12, 12, 10, 18, 32, 22];
  exportWorkbookExcel(headers, rows, 'LogSetoran', `Log_Hasil_Setoran_${getTodayDateStr()}.xlsx`, widths);
  showToast("Log Hasil Setoran berhasil diekspor ke Microsoft Excel (.xlsx)!", "success");
}
const eksporSetoranCSV = eksporSetoranExcel;

function triggerImportSetoranExcel() {
  const input = document.getElementById('fileInputSetoranCSV');
  if (input) input.click();
}
const triggerImportSetoranCSV = triggerImportSetoranExcel;

function prosesImportSetoranExcel(event) {
  const file = event.target.files[0];
  if (!file) return;

  readExcelOrCSV(file, (rows, err) => {
    if (err || !rows || rows.length < 2) {
      showToast("Gagal membaca file Excel/CSV setoran.", "error");
      event.target.value = '';
      return;
    }

    let count = 0;
    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i];
      if (!cols || cols.length < 5) continue;

      const tanggal = String(cols[0] || getTodayDateStr()).trim();
      const sesi = String(cols[1] || 'Shubuh').trim();
      const nis = String(cols[2] || '').trim();
      const nama = String(cols[3] || '').trim();
      if (!nama && !nis) continue;

      const program = String(cols[4] || 'Binnadzor').trim();
      const jenis = String(cols[5] || 'Ziyadah (Baru)').trim();
      const juz = Number(cols[6]) || 30;
      const surat = String(cols[7] || '').trim();
      const ayatAwal = Number(cols[8]) || 1;
      const ayatAkhir = Number(cols[9]) || 10;
      const hlm = String(cols[10] || '1').trim();
      const nilai = String(cols[11] || 'Jayyid Jiddan (B+)').trim();
      const catatan = String(cols[12] || '').trim();
      const penyimak = String(cols[13] || 'Musyrif').trim();

      let santri = AppState.santri.find(s => (nis && s.nis === nis) || (s.nama.toLowerCase() === nama.toLowerCase()));
      const santriId = santri ? santri.id : ('STR-IMP-' + Date.now() + '-' + count);

      const newSetoran = {
        id: "SET-" + Date.now() + "-" + count,
        tanggal: tanggal,
        sesi: sesi,
        santriId: santriId,
        santriNama: santri ? santri.nama : nama,
        program: santri ? santri.program : program,
        jenisSetoran: jenis,
        juz: juz,
        suratNomor: 0,
        suratNama: surat,
        ayatAwal: ayatAwal,
        ayatAkhir: ayatAkhir,
        halaman: hlm,
        nilai: nilai,
        catatan: catatan,
        penyimak: penyimak,
        timestamp: new Date().toISOString()
      };

      AppState.setoran.unshift(newSetoran);
      if (santri) {
        updateSantriProgressFromSetoran(santri, newSetoran);
      }
      count++;
    }

    saveToStorage();
    renderSetoranTable();
    updateNavPills();
    renderDashboard();
    showToast(`Alhamdulillah! Berhasil mengimpor ${count} hasil setoran dari file Excel!`, "success");
    event.target.value = '';
  });
}
const prosesImportSetoranCSV = prosesImportSetoranExcel;

function backupDatabaseJSON() {
  const fullBackup = {
    settings: AppState.settings,
    santri: AppState.santri,
    setoran: AppState.setoran,
    absensi: AppState.absensi,
    exportDate: new Date().toISOString()
  };
  const jsonStr = JSON.stringify(fullBackup, null, 2);
  downloadBlob(jsonStr, `Backup_SiTahfidz_${getTodayDateStr()}.json`, 'application/json');
  showToast("File backup database JSON berhasil diunduh!", "success");
}

function triggerRestoreJSON() {
  const input = document.getElementById('fileInputJSON');
  if (input) input.click();
}

function prosesRestoreJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.santri && data.setoran) {
        if (confirm("Restore akan menimpa data yang ada saat ini dengan file cadangan. Lanjutkan?")) {
          AppState.settings = data.settings || AppState.settings;
          AppState.santri = data.santri || [];
          AppState.setoran = data.setoran || [];
          AppState.absensi = data.absensi || [];
          saveToStorage();
          initHeader();
          renderAll();
          showToast("Database berhasil dipulihkan dari file JSON!", "success");
        }
      } else {
        showToast("Format file JSON tidak valid!", "error");
      }
    } catch (err) {
      showToast("Gagal membaca file JSON: " + err.message, "error");
    }
    event.target.value = '';
  };
  reader.readAsText(file);
}

function resetKeDataContoh() {
  if (confirm("Apakah Anda yakin ingin mengembalikan data ke simulasi contoh asli?")) {
    localStorage.clear();
    initStorage();
    initHeader();
    renderAll();
    showToast("Data telah di-reset ke data simulasi awal.", "info");
  }
}

// ================= PIN ACCESS PROTECTION & ROLE-BASED ACCESS CONTROL (RBAC) =================
function checkPinProtection() {
  const isProtected = AppState.settings.isPinProtected !== false;
  const isUnlocked = sessionStorage.getItem('sitahfidz_unlocked') === 'true';
  const overlay = document.getElementById('pinLockOverlay');
  if (overlay) {
    if (isProtected && !isUnlocked) {
      overlay.style.display = 'flex';
      overlay.classList.add('active');
    } else {
      overlay.style.display = 'none';
      overlay.classList.remove('active');
      applyRolePermissions();
    }
  }
}

function selectPengurusAccountQuick(email, password) {
  const emailInput = document.getElementById('loginAdminEmail') || document.getElementById('inputAccessPin');
  const passInput = document.getElementById('loginAdminPassword');
  if (emailInput) {
    emailInput.value = email;
    emailInput.focus();
  }
  if (passInput) {
    passInput.value = password;
  }
}

// Backward compatibility helper
function selectRolePinQuick(pin) {
  const emailInput = document.getElementById('loginAdminEmail') || document.getElementById('inputAccessPin');
  if (emailInput) {
    emailInput.value = pin;
    emailInput.focus();
  }
}

function handleLoginPengurus(e) {
  if (e) e.preventDefault();
  const emailInput = document.getElementById('loginAdminEmail') || document.getElementById('inputAccessPin');
  const passInput = document.getElementById('loginAdminPassword');
  const inputEmail = emailInput ? emailInput.value.trim().toLowerCase() : '';
  const inputPass = passInput ? passInput.value.trim() : '';

  const errorMsg = document.getElementById('pinErrorMsg');
  if (errorMsg) errorMsg.style.display = 'none';

  // Pastikan akun pengurus terinisialisasi
  const defaultAccounts = (typeof DEFAULT_SETTINGS !== 'undefined' && DEFAULT_SETTINGS.pengurusAccounts) ? DEFAULT_SETTINGS.pengurusAccounts : [];
  if (!AppState.settings.pengurusAccounts || !AppState.settings.pengurusAccounts.length) {
    AppState.settings.pengurusAccounts = JSON.parse(JSON.stringify(defaultAccounts));
  } else {
    // Sinkronkan akun default jika ada yang belum terdaftar (misal update ke 20 akun)
    defaultAccounts.forEach(defAcc => {
      const exists = AppState.settings.pengurusAccounts.some(a => a.email.toLowerCase() === defAcc.email.toLowerCase());
      if (!exists) {
        AppState.settings.pengurusAccounts.push(JSON.parse(JSON.stringify(defAcc)));
      }
    });
  }

  // 1. Cek kecocokan Email & Password pada Daftar Akun Pengurus Terdaftar
  const foundAcc = AppState.settings.pengurusAccounts.find(acc => {
    const accEmail = (acc.email || '').toLowerCase().trim();
    const accUser = accEmail.split('@')[0];
    const matchEmail = (accEmail === inputEmail || accUser === inputEmail);
    // Alias untuk akun #1 (admin1 <=> admin, pendidikan1 <=> pendidikan, dll)
    const isAlias = (
      (accUser === 'admin' && (inputEmail === 'admin1' || inputEmail === 'admin1@sunanbonang.id')) ||
      (accUser === 'pendidikan' && (inputEmail === 'pendidikan1' || inputEmail === 'pendidikan1@sunanbonang.id')) ||
      (accUser === 'keamanan' && (inputEmail === 'keamanan1' || inputEmail === 'keamanan1@sunanbonang.id')) ||
      (accUser === 'ubudiyah' && (inputEmail === 'ubudiyah1' || inputEmail === 'ubudiyah1@sunanbonang.id'))
    );
    return (matchEmail || isAlias) && (acc.password === inputPass);
  });

  let detectedRole = null;
  let roleTitle = '';
  let activeName = '';
  let activeEmail = '';

  if (foundAcc) {
    if (foundAcc.status !== 'Aktif') {
      if (errorMsg) {
        errorMsg.style.display = 'block';
        errorMsg.innerHTML = `⚠️ <strong>Akses Dinonaktifkan:</strong><br>Akun <em>${escapeHtml(foundAcc.email)}</em> dinonaktifkan sementara oleh Administrator Utama.`;
      }
      return;
    }
    detectedRole = foundAcc.role;
    activeName = foundAcc.nama;
    activeEmail = foundAcc.email;
    roleTitle = getRoleTitleName(foundAcc.role);
  } else {
    // 2. Cek Fallback Kredensial & PIN Master Simulasi
    const adminPin = AppState.settings.accessPin || '123456';
    const pendidikanPin = AppState.settings.pendidikanPin || '111111';
    const keamananPin = AppState.settings.keamananPin || '222222';
    const ubudiyahPin = AppState.settings.ubudiyahPin || '333333';
    const ustadzPin = AppState.settings.ustadzPin || '888888';

    // Cek jika yang dimasukkan adalah PIN Ustadz
    if (inputEmail === ustadzPin || inputPass === ustadzPin) {
      if (errorMsg) {
        errorMsg.style.display = 'block';
        errorMsg.innerHTML = `👳‍♂️ <strong>PIN Khusus Asatidz Halaqah:</strong><br>Ustadz menggunakan login cepat di <a href="panel-ustadz.html" style="color:#0284c7; text-decoration:underline; font-weight:bold;">Panel Khusus Asatidz di sini</a>.`;
      }
      return;
    }

    const isAdmin = inputEmail === adminPin ||
      inputEmail === 'admin' || inputEmail === 'admin@sunanbonang.id' ||
      /^admin[1-5](@sunanbonang\.id)?$/.test(inputEmail);

    const isPendidikan = inputEmail === pendidikanPin ||
      inputEmail === 'pendidikan' || inputEmail === 'pendidikan@sunanbonang.id' ||
      /^pendidikan[1-5](@sunanbonang\.id)?$/.test(inputEmail);

    const isKeamanan = inputEmail === keamananPin ||
      inputEmail === 'keamanan' || inputEmail === 'keamanan@sunanbonang.id' ||
      /^keamanan[1-5](@sunanbonang\.id)?$/.test(inputEmail);

    const isUbudiyah = inputEmail === ubudiyahPin ||
      inputEmail === 'ubudiyah' || inputEmail === 'ubudiyah@sunanbonang.id' ||
      /^ubudiyah[1-5](@sunanbonang\.id)?$/.test(inputEmail);

    if (isAdmin && (inputPass === 'admin' || inputPass === adminPin || inputEmail === adminPin)) {
      detectedRole = 'ADMIN';
      activeName = 'Administrator Utama';
      activeEmail = inputEmail.includes('@') ? inputEmail : `${inputEmail}@sunanbonang.id`;
      roleTitle = 'Administrator Utama (Akses Seluruh Menu)';
    } else if (isPendidikan && (inputPass === 'pendidikan' || inputPass === pendidikanPin || inputEmail === pendidikanPin)) {
      detectedRole = 'PENDIDIKAN';
      activeName = 'Pengurus Divisi Pendidikan';
      activeEmail = inputEmail.includes('@') ? inputEmail : `${inputEmail}@sunanbonang.id`;
      roleTitle = 'Pengurus Divisi Pendidikan & Tahfidz';
    } else if (isKeamanan && (inputPass === 'keamanan' || inputPass === keamananPin || inputEmail === keamananPin)) {
      detectedRole = 'KEAMANAN';
      activeName = 'Pengurus Divisi Keamanan';
      activeEmail = inputEmail.includes('@') ? inputEmail : `${inputEmail}@sunanbonang.id`;
      roleTitle = 'Pengurus Divisi Keamanan & Ketertiban';
    } else if (isUbudiyah && (inputPass === 'ubudiyah' || inputPass === ubudiyahPin || inputEmail === ubudiyahPin)) {
      detectedRole = 'UBUDIYAH';
      activeName = 'Pengurus Divisi Ubudiyah';
      activeEmail = inputEmail.includes('@') ? inputEmail : `${inputEmail}@sunanbonang.id`;
      roleTitle = 'Pengurus Divisi Ubudiyah & Ibadah';
    } else {
      if (errorMsg) {
        errorMsg.style.display = 'block';
        errorMsg.innerHTML = `⚠️ <strong>Akses Ditolak:</strong><br>Email atau kata sandi tidak cocok dengan akun pengurus yang terdaftar.<br><small style="color:#64748b;">Silakan pilih salah satu kartu divisi di atas atau hubungi Admin Utama.</small>`;
      }
      return;
    }
  }

  // Simpan sesi autentikasi dan peran aktif
  sessionStorage.setItem('sitahfidz_unlocked', 'true');
  sessionStorage.setItem('sitahfidz_active_role', detectedRole);
  sessionStorage.setItem('sitahfidz_active_email', activeEmail);
  sessionStorage.setItem('sitahfidz_active_name', activeName);

  const overlay = document.getElementById('pinLockOverlay');
  if (overlay) {
    overlay.style.display = 'none';
    overlay.classList.remove('active');
  }

  applyRolePermissions();
  showToast(`Alhamdulillah! Selamat datang, ${activeName} (${roleTitle}).`, "success");
}

function handleVerifyPin(e) {
  handleLoginPengurus(e);
}

function getRoleTitleName(role) {
  if (role === 'ADMIN') return 'Administrator Utama (Akses Seluruh Menu)';
  if (role === 'PENDIDIKAN') return 'Pengurus Divisi Pendidikan & Tahfidz';
  if (role === 'KEAMANAN') return 'Pengurus Divisi Keamanan & Ketertiban';
  if (role === 'UBUDIYAH') return 'Pengurus Divisi Ubudiyah & Ibadah';
  return role;
}

// ================= MANAJEMEN AKUN PENGURUS (EMAIL WHITELIST) =================
function renderPengurusAccountsTable() {
  const tbody = document.getElementById('tablePengurusBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const defaultAccounts = (typeof DEFAULT_SETTINGS !== 'undefined' && DEFAULT_SETTINGS.pengurusAccounts) ? DEFAULT_SETTINGS.pengurusAccounts : [];
  if (!AppState.settings.pengurusAccounts || !AppState.settings.pengurusAccounts.length) {
    AppState.settings.pengurusAccounts = JSON.parse(JSON.stringify(defaultAccounts));
  } else {
    // Sinkronkan akun default jika ada yang belum terdaftar (misal update ke 20 akun)
    defaultAccounts.forEach(defAcc => {
      const exists = AppState.settings.pengurusAccounts.some(a => a.email.toLowerCase() === defAcc.email.toLowerCase());
      if (!exists) {
        AppState.settings.pengurusAccounts.push(JSON.parse(JSON.stringify(defAcc)));
      }
    });
  }

  const list = AppState.settings.pengurusAccounts;
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:#64748b;">Belum ada akun pengurus terdaftar.</td></tr>`;
    return;
  }

  list.forEach((acc, idx) => {
    let roleBadge = '';
    if (acc.role === 'ADMIN') {
      roleBadge = `<span class="badge" style="background:#fef3c7; color:#92400e; border:1px solid #fde68a;">👑 Admin Utama</span>`;
    } else if (acc.role === 'PENDIDIKAN') {
      roleBadge = `<span class="badge" style="background:#ecfdf5; color:#065f46; border:1px solid #a7f3d0;">📚 Pendidikan</span>`;
    } else if (acc.role === 'KEAMANAN') {
      roleBadge = `<span class="badge" style="background:#fef2f2; color:#991b1b; border:1px solid #fecaca;">🛡️ Keamanan</span>`;
    } else if (acc.role === 'UBUDIYAH') {
      roleBadge = `<span class="badge" style="background:#f0f9ff; color:#075985; border:1px solid #bae6fd;">🕌 Ubudiyah</span>`;
    }

    const isAktif = acc.status === 'Aktif';
    const statusBadge = isAktif
      ? `<span class="badge" style="background:#ecfdf5; color:#047857; border:1px solid #a7f3d0; font-size:11px;">🟢 Aktif</span>`
      : `<span class="badge" style="background:#fef2f2; color:#991b1b; border:1px solid #fecaca; font-size:11px;">🔴 Nonaktif</span>`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td><strong>${escapeHtml(acc.nama)}</strong></td>
      <td><code style="font-size:12px; color:#047857; font-weight:700;">${escapeHtml(acc.email)}</code></td>
      <td>${roleBadge}</td>
      <td>${statusBadge}</td>
      <td style="text-align:center;">
        <button type="button" class="btn btn-secondary btn-sm" onclick="openModalAkunPengurus('${acc.id}')" title="Edit Akun" style="padding:3px 8px; font-size:11px;">
          ✏️ Edit
        </button>
        <button type="button" class="btn btn-secondary btn-sm" onclick="toggleStatusAkunPengurus('${acc.id}')" title="Ubah Status Aktif/Nonaktif" style="padding:3px 8px; font-size:11px;">
          ${isAktif ? '⏸️ Nonaktifkan' : '▶️ Aktifkan'}
        </button>
        <button type="button" class="btn btn-danger btn-sm" onclick="hapusAkunPengurus('${acc.id}')" title="Hapus Akun" style="padding:3px 8px; font-size:11px;">
          🗑️
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openModalAkunPengurus(accId = null) {
  const form = document.getElementById('formPengurusId');
  const title = document.getElementById('modalAkunPengurusTitle');
  if (!form) return;

  if (accId) {
    const acc = (AppState.settings.pengurusAccounts || []).find(a => a.id === accId);
    if (!acc) return;
    if (title) title.textContent = '✏️ Edit Akun Pengurus';
    document.getElementById('formPengurusId').value = acc.id;
    document.getElementById('formPengurusNama').value = acc.nama;
    document.getElementById('formPengurusEmail').value = acc.email;
    document.getElementById('formPengurusPassword').value = acc.password;
    document.getElementById('formPengurusRole').value = acc.role;
    document.getElementById('formPengurusStatus').value = acc.status;
  } else {
    if (title) title.textContent = '👤 Tambah Akun Pengurus Baru';
    document.getElementById('formPengurusId').value = '';
    document.getElementById('formPengurusNama').value = '';
    document.getElementById('formPengurusEmail').value = '';
    document.getElementById('formPengurusPassword').value = '';
    document.getElementById('formPengurusRole').value = 'PENDIDIKAN';
    document.getElementById('formPengurusStatus').value = 'Aktif';
  }

  const modal = document.getElementById('modalAkunPengurus');
  if (modal) modal.classList.add('active');
}

function closeModalAkunPengurus() {
  const modal = document.getElementById('modalAkunPengurus');
  if (modal) modal.classList.remove('active');
}

function simpanAkunPengurus(e) {
  if (e) e.preventDefault();
  const id = document.getElementById('formPengurusId')?.value;
  const nama = document.getElementById('formPengurusNama')?.value.trim();
  const email = document.getElementById('formPengurusEmail')?.value.trim().toLowerCase();
  const password = document.getElementById('formPengurusPassword')?.value.trim();
  const role = document.getElementById('formPengurusRole')?.value;
  const status = document.getElementById('formPengurusStatus')?.value;

  if (!nama || !email || !password || !role) {
    showToast("Mohon lengkapi semua kolom form!", "error");
    return;
  }

  if (!AppState.settings.pengurusAccounts) {
    AppState.settings.pengurusAccounts = [];
  }

  // Cek duplikasi email pada akun lain
  const dupe = AppState.settings.pengurusAccounts.find(a => a.email.toLowerCase() === email && a.id !== id);
  if (dupe) {
    showToast(`Email ${email} sudah terdaftar untuk ${dupe.nama}!`, "error");
    return;
  }

  if (id) {
    const acc = AppState.settings.pengurusAccounts.find(a => a.id === id);
    if (acc) {
      acc.nama = nama;
      acc.email = email;
      acc.password = password;
      acc.role = role;
      acc.status = status;
      showToast(`Akun pengurus '${nama}' berhasil diperbarui!`, "success");
    }
  } else {
    const newId = 'ACC-' + Date.now();
    AppState.settings.pengurusAccounts.push({
      id: newId,
      nama,
      email,
      password,
      role,
      status: status || 'Aktif',
      divisi: getRoleTitleName(role)
    });
    showToast(`Akun pengurus '${nama}' berhasil didaftarkan!`, "success");
  }

  saveToStorage();
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
  renderPengurusAccountsTable();
  closeModalAkunPengurus();
}

function toggleStatusAkunPengurus(accId) {
  const acc = (AppState.settings.pengurusAccounts || []).find(a => a.id === accId);
  if (!acc) return;
  acc.status = acc.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
  saveToStorage();
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
  renderPengurusAccountsTable();
  showToast(`Status akun '${acc.nama}' diubah menjadi ${acc.status}`, "info");
}

function hapusAkunPengurus(accId) {
  const acc = (AppState.settings.pengurusAccounts || []).find(a => a.id === accId);
  if (!acc) return;

  // Jangan izinkan menghapus jika hanya tersisa 1 admin
  const totalAdmins = (AppState.settings.pengurusAccounts || []).filter(a => a.role === 'ADMIN').length;
  if (acc.role === 'ADMIN' && totalAdmins <= 1) {
    showToast("Tidak dapat menghapus satu-satunya Administrator Utama!", "error");
    return;
  }

  if (confirm(`Yakin ingin menghapus akun pengurus '${acc.nama}' (${acc.email})?`)) {
    AppState.settings.pengurusAccounts = AppState.settings.pengurusAccounts.filter(a => a.id !== accId);
    saveToStorage();
    if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
    renderPengurusAccountsTable();
    showToast("Akun pengurus berhasil dihapus.", "success");
  }
}

function resetDefaultPengurusAccounts() {
  if (!confirm("Muat ulang 20 akun pengurus standar (5 akun per divisi: Admin, Pendidikan, Keamanan, Ubudiyah)? Akun kustom yang dibuat sendiri akan disetel ulang ke standar.")) return;
  const defaultAccounts = (typeof DEFAULT_SETTINGS !== 'undefined' && DEFAULT_SETTINGS.pengurusAccounts) ? DEFAULT_SETTINGS.pengurusAccounts : [];
  AppState.settings.pengurusAccounts = JSON.parse(JSON.stringify(defaultAccounts));
  saveToStorage();
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
  renderPengurusAccountsTable();
  showToast("✓ 20 akun pengurus standar (4 Divisi × 5 Akun) berhasil dimuat ulang!", "success");
}

function applyRolePermissions() {
  const role = sessionStorage.getItem('sitahfidz_active_role') || 'ADMIN';

  // 1. Update Header Role Badge
  const roleBadge = document.getElementById('headerRoleBadge');
  const roleIcon = document.getElementById('headerRoleIcon');
  const roleName = document.getElementById('headerRoleName');

  const activeName = sessionStorage.getItem('sitahfidz_active_name');
  if (roleBadge && roleName) {
    let titleStr = '';
    if (role === 'ADMIN') {
      roleBadge.style.background = '#fef3c7';
      roleBadge.style.color = '#92400e';
      roleBadge.style.borderColor = '#fde68a';
      if (roleIcon) roleIcon.textContent = '👑';
      titleStr = 'Administrator Utama';
    } else if (role === 'PENDIDIKAN') {
      roleBadge.style.background = '#ecfdf5';
      roleBadge.style.color = '#047857';
      roleBadge.style.borderColor = '#a7f3d0';
      if (roleIcon) roleIcon.textContent = '📚';
      titleStr = 'Pengurus Pendidikan & Tahfidz';
    } else if (role === 'KEAMANAN') {
      roleBadge.style.background = '#fee2e2';
      roleBadge.style.color = '#b91c1c';
      roleBadge.style.borderColor = '#fca5a5';
      if (roleIcon) roleIcon.textContent = '🛡️';
      titleStr = 'Pengurus Keamanan & Ketertiban';
    } else if (role === 'UBUDIYAH') {
      roleBadge.style.background = '#e0f2fe';
      roleBadge.style.color = '#0369a1';
      roleBadge.style.borderColor = '#bae6fd';
      if (roleIcon) roleIcon.textContent = '🕌';
      titleStr = 'Pengurus Ubudiyah & Ibadah';
    }
    roleName.textContent = activeName ? `${activeName} (${titleStr})` : titleStr;
  }

  // 2. Update Header Quick Action Buttons
  const btnSetoranHeader = document.getElementById('btnHeaderSetoran');
  const btnAbsenHeader = document.getElementById('btnHeaderAbsen');
  const btnKeamananHeader1 = document.getElementById('btnHeaderKeamanan1');
  const btnKeamananHeader2 = document.getElementById('btnHeaderKeamanan2');
  const btnUbudiyahHeader1 = document.getElementById('btnHeaderUbudiyah1');
  const btnUbudiyahHeader2 = document.getElementById('btnHeaderUbudiyah2');

  if (role === 'KEAMANAN') {
    if (btnSetoranHeader) btnSetoranHeader.style.display = 'none';
    if (btnAbsenHeader) btnAbsenHeader.style.display = 'none';
    if (btnKeamananHeader1) btnKeamananHeader1.style.display = 'inline-flex';
    if (btnKeamananHeader2) btnKeamananHeader2.style.display = 'inline-flex';
    if (btnUbudiyahHeader1) btnUbudiyahHeader1.style.display = 'none';
    if (btnUbudiyahHeader2) btnUbudiyahHeader2.style.display = 'none';
  } else if (role === 'UBUDIYAH') {
    if (btnSetoranHeader) btnSetoranHeader.style.display = 'none';
    if (btnAbsenHeader) btnAbsenHeader.style.display = 'none';
    if (btnKeamananHeader1) btnKeamananHeader1.style.display = 'none';
    if (btnKeamananHeader2) btnKeamananHeader2.style.display = 'none';
    if (btnUbudiyahHeader1) btnUbudiyahHeader1.style.display = 'inline-flex';
    if (btnUbudiyahHeader2) btnUbudiyahHeader2.style.display = 'inline-flex';
  } else if (role === 'PENDIDIKAN') {
    if (btnSetoranHeader) btnSetoranHeader.style.display = 'inline-flex';
    if (btnAbsenHeader) btnAbsenHeader.style.display = 'inline-flex';
    if (btnKeamananHeader1) btnKeamananHeader1.style.display = 'none';
    if (btnKeamananHeader2) btnKeamananHeader2.style.display = 'none';
    if (btnUbudiyahHeader1) btnUbudiyahHeader1.style.display = 'none';
    if (btnUbudiyahHeader2) btnUbudiyahHeader2.style.display = 'none';
  } else {
    // ADMIN: shows education shortcuts
    if (btnSetoranHeader) btnSetoranHeader.style.display = 'inline-flex';
    if (btnAbsenHeader) btnAbsenHeader.style.display = 'inline-flex';
    if (btnKeamananHeader1) btnKeamananHeader1.style.display = 'none';
    if (btnKeamananHeader2) btnKeamananHeader2.style.display = 'none';
    if (btnUbudiyahHeader1) btnUbudiyahHeader1.style.display = 'none';
    if (btnUbudiyahHeader2) btnUbudiyahHeader2.style.display = 'none';
  }

  // 3. Filter Sidebar Items by Role
  const navFilterBar = document.querySelector('.nav-module-filter-bar');
  const allNavElements = document.querySelectorAll('.nav-tab-btn, .nav-category-header, .nav-divider');

  if (role === 'ADMIN') {
    if (navFilterBar) navFilterBar.style.display = 'flex';
    allNavElements.forEach(el => el.style.display = '');
  } else if (role === 'PENDIDIKAN') {
    if (navFilterBar) navFilterBar.style.display = 'none';
    allNavElements.forEach(el => {
      const cat = el.dataset.category;
      if (cat === 'pendidikan' || cat === 'all' || el.getAttribute('onclick')?.includes("'dashboard'")) {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });
  } else if (role === 'KEAMANAN') {
    if (navFilterBar) navFilterBar.style.display = 'none';
    allNavElements.forEach(el => {
      const cat = el.dataset.category;
      if (cat === 'keamanan') {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });
  } else if (role === 'UBUDIYAH') {
    if (navFilterBar) navFilterBar.style.display = 'none';
    allNavElements.forEach(el => {
      const cat = el.dataset.category;
      if (cat === 'ubudiyah') {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });
  }

  // 4. Ensure current active tab is allowed for current role, otherwise redirect to default
  const ROLE_PERMISSIONS = {
    ADMIN: ['dashboard', 'santri', 'absensi', 'setoran', 'absensi-ustadz', 'ujian', 'wisuda', 'mutabaah', 'laporan', 'keamanan-pelanggaran', 'keamanan-perizinan', 'keamanan-rekap', 'ubudiyah-jamaah', 'ubudiyah-ekskul', 'ubudiyah-rekap', 'pengaturan', 'website'],
    PENDIDIKAN: ['dashboard', 'santri', 'absensi', 'setoran', 'absensi-ustadz', 'ujian', 'wisuda', 'mutabaah', 'laporan'],
    KEAMANAN: ['keamanan-pelanggaran', 'keamanan-perizinan', 'keamanan-rekap'],
    UBUDIYAH: ['ubudiyah-jamaah', 'ubudiyah-ekskul', 'ubudiyah-rekap']
  };

  const allowed = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.ADMIN;
  if (!allowed.includes(AppState.currentTab)) {
    if (role === 'KEAMANAN') {
      switchTab('keamanan-pelanggaran');
    } else if (role === 'UBUDIYAH') {
      switchTab('ubudiyah-jamaah');
    } else if (role === 'PENDIDIKAN') {
      switchTab('santri');
    } else {
      switchTab('dashboard');
    }
  }
}

function handleLogoutRole() {
  if (confirm("Kunci dan keluar dari sesi pengurus saat ini?")) {
    sessionStorage.removeItem('sitahfidz_unlocked');
    sessionStorage.removeItem('sitahfidz_active_role');
    sessionStorage.removeItem('sitahfidz_active_email');
    sessionStorage.removeItem('sitahfidz_active_name');
    const overlay = document.getElementById('pinLockOverlay');
    if (overlay) {
      overlay.style.display = 'flex';
      overlay.classList.add('active');
      const emailInput = document.getElementById('loginAdminEmail') || document.getElementById('inputAccessPin');
      const passInput = document.getElementById('loginAdminPassword');
      if (emailInput) {
        emailInput.value = '';
        emailInput.focus();
      }
      if (passInput) passInput.value = '';
    }
    showToast("Sesi berhasil dikunci. Silakan login kembali untuk melanjutkan.", "info");
  }
}

// ================= WISUDA TAHFIDZ 30 JUZ & PASCA TAHFIDZ =================
function openModalWisudaTahfidzAction(santriId) {
  const s = AppState.santri.find(item => item.id === santriId);
  if (!s) return;

  document.getElementById('wisudaTahfidzSantriId').value = s.id;
  document.getElementById('wisudaTahfidzModalNama').textContent = s.nama;
  document.getElementById('wisudaTahfidzModalNis').textContent = `NIS: ${s.nis} • Pembimbing Tahfidz: ${s.halaqah}`;
  document.getElementById('wisudaTahfidzTanggal').value = new Date().toISOString().split('T')[0];

  // Populate Target Halaqah Pasca Tahfidz Dropdown
  const halaqahPascaSelect = document.getElementById('wisudaTahfidzTargetHalaqah');
  if (halaqahPascaSelect) {
    halaqahPascaSelect.innerHTML = '';
    const list = AppState.settings.daftarHalaqahPascaTahfidz || DEFAULT_SETTINGS.daftarHalaqahPascaTahfidz || [];
    list.forEach(h => {
      const opt = document.createElement('option');
      opt.value = h;
      opt.textContent = h;
      halaqahPascaSelect.appendChild(opt);
    });
  }

  const year = new Date().getFullYear();
  const randomNo = String(Math.floor(Math.random() * 900) + 100);
  document.getElementById('wisudaTahfidzNoIjazah').value = `WIS-THF-${year}-${randomNo}`;
  document.getElementById('wisudaTahfidzCatatan').value = "Mutqin 30 juz bil-ghaib, fashahah dan tajwid kokoh, siap melanjutkan progres tasmi' bertingkat dan bimbingan sanad Al-Qur'an.";

  document.getElementById('modalWisudaTahfidzAction').classList.add('active');
}

function closeModalWisudaTahfidz() {
  document.getElementById('modalWisudaTahfidzAction').classList.remove('active');
}

function konfirmasiWisudaTahfidzSantri(e) {
  e.preventDefault();
  const santriId = document.getElementById('wisudaTahfidzSantriId').value;
  const s = AppState.santri.find(item => item.id === santriId);
  if (!s) return;

  const tgl = document.getElementById('wisudaTahfidzTanggal').value;
  const noIjazah = document.getElementById('wisudaTahfidzNoIjazah').value.trim();
  const predikat = document.getElementById('wisudaTahfidzPredikat').value;
  const targetHalaqah = document.getElementById('wisudaTahfidzTargetHalaqah')?.value || "Halaqah Pasca Tahfidz Ust. Muhammad Ridwan, Al-Hafidz";
  const catatan = document.getElementById('wisudaTahfidzCatatan').value.trim();

  // Elevate from Tahfidz to Pasca Tahfidz!
  s.program = 'Pasca Tahfidz';
  s.halaqah = targetHalaqah; // Ustadz pengampu pasca tahfidz!

  if (!s.tahfidzProgress) {
    s.tahfidzProgress = { totalJuzHafal: 30, juzMutqinList: [], juzZiyadahList: [] };
  }
  s.tahfidzProgress.statusWisudaTahfidz = 'Sudah Wisuda Tahfidz';
  s.tahfidzProgress.tanggalWisudaTahfidz = tgl;
  s.tahfidzProgress.noIjazahTahfidz = noIjazah;
  s.tahfidzProgress.predikatWisudaTahfidz = predikat;
  s.tahfidzProgress.catatanWisudaTahfidz = catatan;

  if (!s.pascaTahfidzProgress) {
    s.pascaTahfidzProgress = {
      ustadzPengampu: targetHalaqah,
      tasmi5Juz: false,
      tasmi10Juz: false,
      tasmi15Juz: false,
      tasmi20Juz: false,
      tasmi30JuzSekaliDuduk: false,
      statusSanad: "Persiapan Bimbingan Matan Jazariyah & Tasmi' 5 Juz",
      terakhirTasmi: "Khotmil Qur'an 30 Juz Bil-Ghaib"
    };
  } else {
    s.pascaTahfidzProgress.ustadzPengampu = targetHalaqah;
  }

  saveToStorage();
  closeModalWisudaTahfidz();
  renderAll();

  showToast(`🎉 Mubarak & Tabarakallah! Ananda ${s.nama} resmi diwisuda Tahfidz 30 Juz dan masuk ke Kelas Pasca Tahfidz (${targetHalaqah})!`, "success");
}

function previewPiagamWisudaTahfidz(santriId) {
  const s = AppState.santri.find(item => item.id === santriId);
  if (!s) return;

  const modal = document.getElementById('modalPiagamTahfidzPreview');
  const container = document.getElementById('piagamTahfidzContent');
  if (!modal || !container) return;

  const tglStr = s.tahfidzProgress?.tanggalWisudaTahfidz 
    ? formatTanggalIndo(s.tahfidzProgress.tanggalWisudaTahfidz) 
    : formatTanggalIndo(new Date().toISOString().split('T')[0]);

  const noIjazah = s.tahfidzProgress?.noIjazahTahfidz || `WIS-THF-${new Date().getFullYear()}-001`;
  const predikat = s.tahfidzProgress?.predikatWisudaTahfidz || 'Mumtaz Syaraf (A+)';

  container.innerHTML = `
    <div style="border: 2px solid #b45309; padding: 28px; background: #fffdf5; border-radius: 12px; position:relative;">
      <div style="font-size: 40px; margin-bottom: 8px;">👑</div>
      <div style="font-family:'Amiri', serif; font-size: 26px; color: #92400e; margin-bottom: 6px;">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </div>
      <h2 style="font-size: 20px; font-weight: 800; color: #78350f; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
        PIAGAM KHOTMIL QUR'AN BIL-GHAIB 30 JUZ
      </h2>
      <div style="font-size: 13px; color: #92400e; font-weight: 700;">
        Nomor Ijazah: <code>${noIjazah}</code>
      </div>

      <p style="font-size: 13px; color: #334155; margin: 18px auto 14px auto; max-width: 600px; line-height: 1.6;">
        Dewan Masyayikh dan Pengasuh Pondok Pesantren menerangkan dengan sesungguhnya bahwa santri:
      </p>

      <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; border-bottom: 2px dashed #d97706; display: inline-block; padding: 0 24px 6px 24px; margin-bottom: 12px;">
        ${escapeHtml(s.nama)}
      </h1>
      <div style="font-size: 13.5px; color: #475569; margin-bottom: 16px;">
        Nomor Induk Santri (NIS): <strong>${escapeHtml(s.nis)}</strong> • ${escapeHtml(s.halaqah || 'Pasca Tahfidz')}
      </div>

      <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 12px; max-width: 580px; margin: 0 auto 20px auto; font-size: 13px; color: #92400e;">
        Telah menuntaskan hafalan <strong>Al-Qur'an 30 Juz Bil-Ghaib</strong> secara mutqin, tartil, dan fashih sesuai kaidah tajwid, dengan predikat:
        <div style="font-size: 16px; font-weight: 800; color: #b45309; margin-top: 4px;">${predikat}</div>
      </div>

      <div style="display: flex; justify-content: space-around; margin-top: 32px; text-align: center; font-size: 12.5px; color: #334155;">
        <div>
          <div style="color: #64748b;">Pengasuh Pondok Pesantren,</div>
          <div style="height: 50px;"></div>
          <strong style="text-decoration: underline; color: #0f172a;">${AppState.settings.pengasuhPondok || DEFAULT_SETTINGS.pengasuhPondok}</strong>
        </div>
        <div>
          <div style="color: #64748b;">Ditetapkan di Cirebon, ${tglStr}</div>
          <div style="color: #64748b;">Ustadz Pengampu Tahfidz,</div>
          <div style="height: 34px;"></div>
          <strong style="text-decoration: underline; color: #0f172a;">${AppState.settings.kepalaTahfidz || DEFAULT_SETTINGS.kepalaTahfidz}</strong>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function closeModalPiagamTahfidz() {
  const modal = document.getElementById('modalPiagamTahfidzPreview');
  if (modal) modal.classList.remove('active');
}

function cetakPiagamTahfidz() {
  const content = document.getElementById('piagamTahfidzContent')?.innerHTML;
  if (!content) return;
  const printArea = document.getElementById('printArea');
  if (printArea) {
    printArea.innerHTML = `
      <div style="border:5px double #b45309; padding:40px; border-radius:10px; background:#fff;">
        ${content}
      </div>
    `;
    window.print();
  }
}

// ================= DIVISI KEAMANAN & KETERTIBAN =================
function renderPelanggaranTable() {
  const tbody = document.getElementById('tablePelanggaranBody');
  if (!tbody) return;

  const search = document.getElementById('pelanggaranSearch')?.value?.toLowerCase() || '';
  const filterKat = document.getElementById('pelanggaranFilterKategori')?.value || '';
  const filterStat = document.getElementById('pelanggaranFilterStatus')?.value || '';

  tbody.innerHTML = '';
  const list = AppState.pelanggaran || [];

  const filtered = list.filter(p => {
    const matchSearch = !search || 
      p.santriNama.toLowerCase().includes(search) || 
      p.nis.toLowerCase().includes(search) || 
      p.jenisPelanggaran.toLowerCase().includes(search);
    const matchKat = !filterKat || p.kategori === filterKat;
    const matchStat = !filterStat || p.statusTakziran === filterStat;
    return matchSearch && matchKat && matchStat;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" class="empty-state">Belum ada catatan pelanggaran yang sesuai filter.</td></tr>`;
    return;
  }

  filtered.forEach((p, idx) => {
    let katBadge = '';
    if (p.kategori === 'Berat') katBadge = `<span class="badge" style="background:#fee2e2; color:#b91c1c; font-weight:700;">🔴 Berat</span>`;
    else if (p.kategori === 'Sedang') katBadge = `<span class="badge" style="background:#ffedd5; color:#c2410c; font-weight:700;">🟠 Sedang</span>`;
    else katBadge = `<span class="badge" style="background:#fef9c3; color:#854d0e; font-weight:600;">🟡 Ringan</span>`;

    let statBadge = '';
    if (p.statusTakziran === 'Selesai') {
      statBadge = `<span class="badge" style="background:#dcfce7; color:#15803d; font-weight:700;">✓ Selesai (${formatTanggalIndo(p.tanggalSelesai || p.tanggal)})</span>`;
    } else if (p.statusTakziran === 'Sedang Menjalani') {
      statBadge = `<span class="badge" style="background:#fef3c7; color:#b45309; font-weight:700;">⏳ Sedang Menjalani</span>`;
    } else {
      statBadge = `<span class="badge" style="background:#fee2e2; color:#b91c1c; font-weight:700;">✕ Belum Selesai</span>`;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align:center;">${idx + 1}</td>
      <td>${formatTanggalIndo(p.tanggal)}</td>
      <td><strong>${escapeHtml(p.santriNama)}</strong></td>
      <td><code>${escapeHtml(p.nis)}</code></td>
      <td>${katBadge}</td>
      <td style="font-weight:600; color:#0f172a;">${escapeHtml(p.jenisPelanggaran)}</td>
      <td style="text-align:center;"><strong style="color:#b91c1c; font-size:13px;">+${p.poin}</strong></td>
      <td style="font-size:12px; color:#334155; max-width:200px;">${escapeHtml(p.takziran)}</td>
      <td>${statBadge}</td>
      <td style="font-size:11.5px; color:#64748b;">${escapeHtml(p.dicatatOleh || '-')}</td>
      <td style="text-align:center;">
        <div style="display:flex; gap:4px; justify-content:center;">
          ${p.statusTakziran !== 'Selesai' ? `
            <button class="btn btn-success btn-sm" onclick="selesaikanTakziran('${p.id}')" title="Tandai Takziran Selesai" style="padding:4px 7px;">
              ✓
            </button>
          ` : ''}
          <button class="btn btn-secondary btn-sm" onclick="openModalInputPelanggaran('${p.id}')" title="Edit Data" style="padding:4px 7px;">
            ✏️
          </button>
          <button class="btn btn-secondary btn-sm" onclick="cetakSuratPeringatan('${p.id}')" title="Cetak Surat Peringatan (SP)" style="padding:4px 7px;">
            🖨️
          </button>
          <button class="btn btn-danger btn-sm" onclick="hapusPelanggaran('${p.id}')" title="Hapus" style="padding:4px 7px;">
            🗑️
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openModalInputPelanggaran(id) {
  const modal = document.getElementById('modalInputPelanggaran');
  if (!modal) return;

  const form = document.getElementById('formInputPelanggaran');
  if (form) form.reset();

  const selectSantri = document.getElementById('formPelanggaranSantriId');
  if (selectSantri) {
    selectSantri.innerHTML = '';
    AppState.santri.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.nama} (${s.nis}) • ${s.halaqah || '-'}`;
      selectSantri.appendChild(opt);
    });
  }

  document.getElementById('formPelanggaranId').value = id || '';
  document.getElementById('formPelanggaranTanggal').value = new Date().toISOString().split('T')[0];
  document.getElementById('formPelanggaranPetugas').value = 'Ust. Zainal Abidin (Keamanan Pondok)';

  if (id) {
    const p = (AppState.pelanggaran || []).find(item => item.id === id);
    if (p) {
      document.getElementById('modalInputPelanggaranTitle').textContent = `✏️ Edit Pelanggaran (${p.santriNama})`;
      document.getElementById('formPelanggaranSantriId').value = p.santriId;
      document.getElementById('formPelanggaranTanggal').value = p.tanggal;
      document.getElementById('formPelanggaranKategori').value = p.kategori;
      document.getElementById('formPelanggaranPoin').value = p.poin;
      document.getElementById('formPelanggaranJenis').value = p.jenisPelanggaran;
      document.getElementById('formPelanggaranTakziran').value = p.takziran;
      document.getElementById('formPelanggaranStatus').value = p.statusTakziran;
      document.getElementById('formPelanggaranPetugas').value = p.dicatatOleh || '';
    }
  } else {
    document.getElementById('modalInputPelanggaranTitle').textContent = '⚠️ Catat Pelanggaran Santri Baru';
    onPelanggaranKategoriChange();
  }

  modal.classList.add('active');
}

function closeModalInputPelanggaran() {
  const modal = document.getElementById('modalInputPelanggaran');
  if (modal) modal.classList.remove('active');
}

function onPelanggaranKategoriChange() {
  const kat = document.getElementById('formPelanggaranKategori')?.value;
  const elPoin = document.getElementById('formPelanggaranPoin');
  if (!elPoin) return;

  if (kat === 'Berat') elPoin.value = 35;
  else if (kat === 'Sedang') elPoin.value = 15;
  else elPoin.value = 5;
}

function simpanPelanggaran(e) {
  e.preventDefault();
  const id = document.getElementById('formPelanggaranId').value;
  const santriId = document.getElementById('formPelanggaranSantriId').value;
  const tanggal = document.getElementById('formPelanggaranTanggal').value;
  const kategori = document.getElementById('formPelanggaranKategori').value;
  const poin = parseInt(document.getElementById('formPelanggaranPoin').value, 10) || 5;
  const jenis = document.getElementById('formPelanggaranJenis').value.trim();
  const takziran = document.getElementById('formPelanggaranTakziran').value.trim();
  const status = document.getElementById('formPelanggaranStatus').value;
  const petugas = document.getElementById('formPelanggaranPetugas').value.trim();

  const santri = AppState.santri.find(s => s.id === santriId);
  if (!santri) {
    alert("Pilih santri terlebih dahulu.");
    return;
  }

  let obj = id ? (AppState.pelanggaran || []).find(p => p.id === id) : null;
  if (!obj) {
    obj = {
      id: 'PLG-' + Date.now(),
      santriId: santri.id,
      santriNama: santri.nama,
      nis: santri.nis,
      tanggal: tanggal,
      kategori: kategori,
      poin: poin,
      jenisPelanggaran: jenis,
      takziran: takziran,
      statusTakziran: status,
      tanggalSelesai: status === 'Selesai' ? tanggal : '',
      dicatatOleh: petugas
    };
    AppState.pelanggaran = AppState.pelanggaran || [];
    AppState.pelanggaran.unshift(obj);
  } else {
    obj.santriId = santri.id;
    obj.santriNama = santri.nama;
    obj.nis = santri.nis;
    obj.tanggal = tanggal;
    obj.kategori = kategori;
    obj.poin = poin;
    obj.jenisPelanggaran = jenis;
    obj.takziran = takziran;
    obj.statusTakziran = status;
    if (status === 'Selesai' && !obj.tanggalSelesai) obj.tanggalSelesai = new Date().toISOString().split('T')[0];
    obj.dicatatOleh = petugas;
  }

  saveToStorage();
  closeModalInputPelanggaran();
  renderAll();
  showToast(`⚠️ Catatan pelanggaran santri ${santri.nama} berhasil disimpan!`, "info");
}

function selesaikanTakziran(id) {
  const p = (AppState.pelanggaran || []).find(item => item.id === id);
  if (!p) return;

  if (confirm(`Konfirmasi Takziran Selesai:\n\nApakah ananda ${p.santriNama} telah tuntas melaksanakan takziran: "${p.takziran}"?`)) {
    p.statusTakziran = 'Selesai';
    p.tanggalSelesai = new Date().toISOString().split('T')[0];
    saveToStorage();
    renderAll();
    showToast(`✓ Takziran santri ${p.santriNama} telah ditandai SELESAI!`, "success");
  }
}

function hapusPelanggaran(id) {
  const p = (AppState.pelanggaran || []).find(item => item.id === id);
  if (!p) return;

  if (confirm(`Apakah Anda yakin ingin menghapus catatan pelanggaran ${p.santriNama}?`)) {
    AppState.pelanggaran = AppState.pelanggaran.filter(item => item.id !== id);
    saveToStorage();
    renderAll();
    showToast("Catatan pelanggaran telah dihapus.", "info");
  }
}

function cetakSuratPeringatan(id) {
  const p = (AppState.pelanggaran || []).find(item => item.id === id);
  if (!p) return;

  const santri = AppState.santri.find(s => s.id === p.santriId);
  const pName = AppState.settings.namaPondok || DEFAULT_SETTINGS.namaPondok;
  const pAlamat = AppState.settings.alamatPondok || DEFAULT_SETTINGS.alamatPondok;
  const pengasuh = AppState.settings.pengasuhPondok || DEFAULT_SETTINGS.pengasuhPondok;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Surat Peringatan Kedisiplinan - ${escapeHtml(p.santriNama)}</title>
      <style>
        body { font-family: 'Times New Roman', serif; margin: 40px; color: #111; line-height: 1.6; }
        .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 24px; }
        .kop h2 { margin: 0; font-size: 22px; text-transform: uppercase; }
        .kop p { margin: 2px 0; font-size: 12px; }
        .judul { text-align: center; margin-bottom: 24px; }
        .judul h3 { margin: 0; text-decoration: underline; font-size: 16px; text-transform: uppercase; }
        .identitas { margin: 16px 0; font-size: 13.5px; }
        .identitas table { border: none; width: 100%; font-size: 13.5px; }
        .identitas td { border: none; padding: 4px 6px; }
        .box-warning { border: 1px solid #000; padding: 14px; margin: 16px 0; font-size: 13.5px; background: #fafafa; }
        .ttd-grid { display: grid; grid-template-columns: 1fr 1fr; margin-top: 50px; text-align: center; font-size: 13.5px; }
        .ttd-space { height: 75px; }
      </style>
    </head>
    <body>
      <div class="kop">
        <h2>${escapeHtml(pName)}</h2>
        <p>BAGIAN KEAMANAN & KETERTIBAN PONDOK PESANTREN</p>
        <p>${escapeHtml(pAlamat)}</p>
      </div>

      <div class="judul">
        <h3>SURAT KETETAPAN TAKZIRAN & PERINGATAN KEDISIPLINAN</h3>
        <span style="font-size:12px;">Nomor: SP-KMN/${new Date().getFullYear()}/${p.id.replace('PLG-', '')}</span>
      </div>

      <p style="font-size:13.5px;">Berdasarkan hasil pemantauan dan buku tata tertib kepesantrenan, dengan ini menyatakan bahwa:</p>

      <div class="identitas">
        <table>
          <tr><td style="width:180px;"><strong>Nama Lengkap Santri</strong></td><td>: <strong>${escapeHtml(p.santriNama)}</strong></td></tr>
          <tr><td><strong>Nomor Induk (NIS)</strong></td><td>: ${escapeHtml(p.nis)}</td></tr>
          <tr><td><strong>Kelas / Halaqah</strong></td><td>: ${escapeHtml(santri?.halaqah || '-')}</td></tr>
          <tr><td><strong>Kamar / Asrama</strong></td><td>: ${escapeHtml(santri?.asrama || '-')}</td></tr>
          <tr><td><strong>Wali Santri</strong></td><td>: ${escapeHtml(santri?.namaWali || '-')} (${santri?.noHpWali || '-'})</td></tr>
        </table>
      </div>

      <div class="box-warning">
        <div><strong>Tindakan Pelanggaran:</strong> ${escapeHtml(p.jenisPelanggaran)}</div>
        <div style="margin-top:4px;"><strong>Kategori / Bobot Poin:</strong> ${escapeHtml(p.kategori)} (+${p.poin} Poin)</div>
        <div style="margin-top:4px;"><strong>Tanggal Kejadian:</strong> ${formatTanggalIndo(p.tanggal)}</div>
        <div style="margin-top:8px; padding-top:6px; border-top:1px dashed #999;">
          <strong>Bentuk Takziran Edukatif yang Ditetapkan:</strong><br>
          <em>${escapeHtml(p.takziran)}</em>
        </div>
      </div>

      <p style="font-size:13px; text-align:justify;">
        Demikian surat peringatan dan ketetapan takziran ini dibuat semata-mata sebagai bentuk pembinaan mental, akhlaqul karimah, dan kedisiplinan tholabul 'ilmi di lingkungan pondok pesantren.
      </p>

      <div class="ttd-grid">
        <div>
          <p>Petugas Keamanan Pondok,</p>
          <div class="ttd-space"></div>
          <strong>${escapeHtml(p.dicatatOleh || 'Musyrif Keamanan')}</strong>
        </div>
        <div>
          <p>Pengasuh Pondok Pesantren,</p>
          <div class="ttd-space"></div>
          <strong>${escapeHtml(pengasuh)}</strong>
        </div>
      </div>

      <script>window.onload = function() { window.print(); };</script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

function eksporPelanggaranExcel() {
  if (typeof XLSX === 'undefined') {
    alert("Library SheetJS belum termuat.");
    return;
  }
  const data = (AppState.pelanggaran || []).map((p, idx) => ({
    "No": idx + 1,
    "Tanggal": p.tanggal,
    "Nama Santri": p.santriNama,
    "NIS": p.nis,
    "Kategori": p.kategori,
    "Poin": p.poin,
    "Jenis Pelanggaran": p.jenisPelanggaran,
    "Takziran Edukatif": p.takziran,
    "Status Takziran": p.statusTakziran,
    "Tanggal Selesai": p.tanggalSelesai || "-",
    "Petugas": p.dicatatOleh
  }));
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Pelanggaran");
  XLSX.writeFile(wb, "Data_Pelanggaran_Dan_Takziran_Santri.xlsx");
  showToast("📥 File Excel Data Pelanggaran berhasil diunduh!", "success");
}

// ================= PERIZINAN PULANG SANTRI =================
function renderPerizinanTable() {
  const tbody = document.getElementById('tablePerizinanBody');
  if (!tbody) return;

  const search = document.getElementById('perizinanSearch')?.value?.toLowerCase() || '';
  const filterJenis = document.getElementById('perizinanFilterJenis')?.value || '';
  const filterStat = document.getElementById('perizinanFilterStatus')?.value || '';

  tbody.innerHTML = '';
  const list = AppState.perizinan || [];

  const filtered = list.filter(p => {
    const matchSearch = !search || 
      p.santriNama.toLowerCase().includes(search) || 
      p.nis.toLowerCase().includes(search) || 
      (p.noSurat && p.noSurat.toLowerCase().includes(search)) ||
      (p.alasan && p.alasan.toLowerCase().includes(search));
    const matchJenis = !filterJenis || p.jenisIzin === filterJenis;
    const matchStat = !filterStat || p.status === filterStat;
    return matchSearch && matchJenis && matchStat;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" class="empty-state">Belum ada riwayat perizinan yang sesuai filter.</td></tr>`;
    return;
  }

  filtered.forEach((p, idx) => {
    let statBadge = '';
    if (p.status === 'Kembali Tepat Waktu') {
      statBadge = `<span class="badge" style="background:#dcfce7; color:#15803d; font-weight:700;">✓ Tepat Waktu</span>`;
    } else if (p.status === 'Sedang di Luar') {
      statBadge = `<span class="badge" style="background:#fef3c7; color:#b45309; font-weight:700;">⏳ Sedang di Luar</span>`;
    } else {
      statBadge = `<span class="badge" style="background:#fee2e2; color:#b91c1c; font-weight:700;">⚠️ Terlambat</span>`;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align:center;">${idx + 1}</td>
      <td><code>${escapeHtml(p.noSurat)}</code></td>
      <td><strong>${escapeHtml(p.santriNama)}</strong></td>
      <td><code>${escapeHtml(p.nis)}</code></td>
      <td><span class="badge" style="background:#f1f5f9; color:#334155;">${escapeHtml(p.jenisIzin)}</span></td>
      <td>${formatTanggalIndo(p.tanggalKeluar)} (${escapeHtml(p.jamKeluar || '-')})</td>
      <td>${formatTanggalIndo(p.rencanaKembali)} (${escapeHtml(p.jamRencanaKembali || '-')})</td>
      <td><strong style="color:#0f172a;">${p.realisasiKembali ? escapeHtml(p.realisasiKembali) : '<span style="color:#b45309;">Belum Kembali</span>'}</strong></td>
      <td style="font-size:12px; color:#475569;">
        <div>${escapeHtml(p.alasan)}</div>
        <div style="font-size:11px; color:#64748b;">Penjemput: ${escapeHtml(p.penjemput || '-')}</div>
      </td>
      <td>${statBadge}</td>
      <td style="text-align:center;">
        <div style="display:flex; gap:4px; justify-content:center;">
          ${p.status === 'Sedang di Luar' ? `
            <button class="btn btn-success btn-sm" onclick="konfirmasiKembaliSantri('${p.id}')" title="Konfirmasi Tiba di Pondok" style="padding:4px 7px;">
              ✓ Tiba
            </button>
          ` : ''}
          <button class="btn btn-secondary btn-sm" onclick="openModalInputPerizinan('${p.id}')" title="Edit Izin" style="padding:4px 7px;">
            ✏️
          </button>
          <button class="btn btn-secondary btn-sm" onclick="cetakSuratIzinPulang('${p.id}')" title="Cetak Surat Izin" style="padding:4px 7px;">
            🖨️
          </button>
          <button class="btn btn-danger btn-sm" onclick="hapusPerizinan('${p.id}')" title="Hapus" style="padding:4px 7px;">
            🗑️
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openModalInputPerizinan(id) {
  const modal = document.getElementById('modalInputPerizinan');
  if (!modal) return;

  const form = document.getElementById('formInputPerizinan');
  if (form) form.reset();

  const selectSantri = document.getElementById('formPerizinanSantriId');
  if (selectSantri) {
    selectSantri.innerHTML = '';
    AppState.santri.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.nama} (${s.nis}) • Kamar: ${s.asrama || '-'}`;
      selectSantri.appendChild(opt);
    });
  }

  document.getElementById('formPerizinanId').value = id || '';
  document.getElementById('formPerizinanTglKeluar').value = new Date().toISOString().split('T')[0];
  document.getElementById('formPerizinanJamKeluar').value = '08.00';
  document.getElementById('formPerizinanTglKembali').value = getTodayDateStr(2);
  document.getElementById('formPerizinanJamKembali').value = '17.00';
  document.getElementById('formPerizinanPetugas').value = 'Ust. Zainal Abidin (Keamanan)';

  if (id) {
    const p = (AppState.perizinan || []).find(item => item.id === id);
    if (p) {
      document.getElementById('modalInputPerizinanTitle').textContent = `✏️ Edit Surat Izin (${p.santriNama})`;
      document.getElementById('formPerizinanNoSurat').value = p.noSurat;
      document.getElementById('formPerizinanSantriId').value = p.santriId;
      document.getElementById('formPerizinanJenis').value = p.jenisIzin;
      document.getElementById('formPerizinanTglKeluar').value = p.tanggalKeluar;
      document.getElementById('formPerizinanJamKeluar').value = p.jamKeluar || '';
      document.getElementById('formPerizinanTglKembali').value = p.rencanaKembali;
      document.getElementById('formPerizinanJamKembali').value = p.jamRencanaKembali || '';
      document.getElementById('formPerizinanAlasan').value = p.alasan;
      document.getElementById('formPerizinanPenjemput').value = p.penjemput || '';
      document.getElementById('formPerizinanPetugas').value = p.petugasPemberiIzin || '';
      document.getElementById('formPerizinanStatus').value = p.status || 'Sedang di Luar';
    }
  } else {
    document.getElementById('modalInputPerizinanTitle').textContent = '🎫 Terbitkan Surat Izin Pulang Santri';
    const rand = Math.floor(Math.random() * 900) + 100;
    document.getElementById('formPerizinanNoSurat').value = `IZN/PND/${new Date().getFullYear()}/${rand}`;
  }

  modal.classList.add('active');
}

function closeModalInputPerizinan() {
  const modal = document.getElementById('modalInputPerizinan');
  if (modal) modal.classList.remove('active');
}

function simpanPerizinan(e) {
  e.preventDefault();
  const id = document.getElementById('formPerizinanId').value;
  const noSurat = document.getElementById('formPerizinanNoSurat').value.trim();
  const santriId = document.getElementById('formPerizinanSantriId').value;
  const jenis = document.getElementById('formPerizinanJenis').value;
  const penjemput = document.getElementById('formPerizinanPenjemput').value.trim();
  const tglKeluar = document.getElementById('formPerizinanTglKeluar').value;
  const jamKeluar = document.getElementById('formPerizinanJamKeluar').value.trim();
  const tglKembali = document.getElementById('formPerizinanTglKembali').value;
  const jamKembali = document.getElementById('formPerizinanJamKembali').value.trim();
  const alasan = document.getElementById('formPerizinanAlasan').value.trim();
  const petugas = document.getElementById('formPerizinanPetugas').value.trim();
  const status = document.getElementById('formPerizinanStatus').value;

  const santri = AppState.santri.find(s => s.id === santriId);
  if (!santri) {
    alert("Pilih santri terlebih dahulu.");
    return;
  }

  let obj = id ? (AppState.perizinan || []).find(p => p.id === id) : null;
  if (!obj) {
    obj = {
      id: 'IZN-' + Date.now(),
      noSurat: noSurat,
      santriId: santri.id,
      santriNama: santri.nama,
      nis: santri.nis,
      jenisIzin: jenis,
      tanggalKeluar: tglKeluar,
      jamKeluar: jamKeluar,
      rencanaKembali: tglKembali,
      jamRencanaKembali: jamKembali,
      realisasiKembali: status === 'Kembali Tepat Waktu' ? (tglKembali + ' ' + jamKembali) : '',
      alasan: alasan,
      penjemput: penjemput,
      status: status,
      petugasPemberiIzin: petugas
    };
    AppState.perizinan = AppState.perizinan || [];
    AppState.perizinan.unshift(obj);
  } else {
    obj.noSurat = noSurat;
    obj.santriId = santri.id;
    obj.santriNama = santri.nama;
    obj.nis = santri.nis;
    obj.jenisIzin = jenis;
    obj.tanggalKeluar = tglKeluar;
    obj.jamKeluar = jamKeluar;
    obj.rencanaKembali = tglKembali;
    obj.jamRencanaKembali = jamKembali;
    obj.alasan = alasan;
    obj.penjemput = penjemput;
    obj.status = status;
    obj.petugasPemberiIzin = petugas;
  }

  saveToStorage();
  closeModalInputPerizinan();
  renderAll();
  showToast(`🎫 Surat Izin santri ${santri.nama} berhasil diterbitkan!`, "success");
}

function konfirmasiKembaliSantri(id) {
  const p = (AppState.perizinan || []).find(item => item.id === id);
  if (!p) return;

  const now = new Date();
  const timeStr = String(now.getHours()).padStart(2, '0') + '.' + String(now.getMinutes()).padStart(2, '0');
  const dateStr = now.toISOString().split('T')[0];

  p.status = 'Kembali Tepat Waktu';
  p.realisasiKembali = `${dateStr} ${timeStr}`;
  saveToStorage();
  renderAll();
  showToast(`✓ Santri ${p.santriNama} telah dikonfirmasi tiba di pondok tepat waktu!`, "success");
}

function hapusPerizinan(id) {
  const p = (AppState.perizinan || []).find(item => item.id === id);
  if (!p) return;

  if (confirm(`Hapus surat izin untuk ${p.santriNama}?`)) {
    AppState.perizinan = AppState.perizinan.filter(item => item.id !== id);
    saveToStorage();
    renderAll();
    showToast("Surat izin telah dihapus.", "info");
  }
}

function cetakSuratIzinPulang(id) {
  const p = (AppState.perizinan || []).find(item => item.id === id);
  if (!p) return;

  const santri = AppState.santri.find(s => s.id === p.santriId);
  const pName = AppState.settings.namaPondok || DEFAULT_SETTINGS.namaPondok;
  const pAlamat = AppState.settings.alamatPondok || DEFAULT_SETTINGS.alamatPondok;
  const pengasuh = AppState.settings.pengasuhPondok || DEFAULT_SETTINGS.pengasuhPondok;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Surat Izin Pulang Santri - ${escapeHtml(p.santriNama)}</title>
      <style>
        body { font-family: 'Times New Roman', serif; margin: 40px; color: #111; line-height: 1.6; }
        .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 20px; }
        .kop h2 { margin: 0; font-size: 22px; text-transform: uppercase; }
        .kop p { margin: 2px 0; font-size: 12px; }
        .judul { text-align: center; margin-bottom: 20px; }
        .judul h3 { margin: 0; text-decoration: underline; font-size: 16px; text-transform: uppercase; }
        table { border: none; width: 100%; font-size: 13.5px; margin: 15px 0; }
        td { border: none; padding: 4px 6px; }
        .box-info { border: 1px solid #000; padding: 12px 16px; margin: 16px 0; font-size: 13px; background: #fafafa; }
        .ttd-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; margin-top: 40px; text-align: center; font-size: 13px; }
        .ttd-space { height: 70px; }
      </style>
    </head>
    <body>
      <div class="kop">
        <h2>${escapeHtml(pName)}</h2>
        <p>BAGIAN KEAMANAN & KEPENGURUSAN SANTRI</p>
        <p>${escapeHtml(pAlamat)}</p>
      </div>

      <div class="judul">
        <h3>SURAT IZIN KELUAR / PULANG SANTRI</h3>
        <span style="font-size:12px;">Nomor: ${escapeHtml(p.noSurat)}</span>
      </div>

      <p style="font-size:13.5px;">Diberikan izin kepada santri tersebut di bawah ini:</p>

      <table>
        <tr><td style="width:170px;"><strong>Nama Santri</strong></td><td>: <strong>${escapeHtml(p.santriNama)}</strong></td></tr>
        <tr><td><strong>Nomor Induk (NIS)</strong></td><td>: ${escapeHtml(p.nis)}</td></tr>
        <tr><td><strong>Kelas / Halaqah</strong></td><td>: ${escapeHtml(santri?.halaqah || '-')}</td></tr>
        <tr><td><strong>Kamar / Asrama</strong></td><td>: ${escapeHtml(santri?.asrama || '-')}</td></tr>
        <tr><td><strong>Waktu Keluar</strong></td><td>: ${formatTanggalIndo(p.tanggalKeluar)} (Pukul: ${escapeHtml(p.jamKeluar || '-')})</td></tr>
        <tr><td><strong>Wajib Kembali Pada</strong></td><td>: <strong>${formatTanggalIndo(p.rencanaKembali)}</strong> (Maksimal Pukul: <strong>${escapeHtml(p.jamRencanaKembali || '-')}</strong>)</td></tr>
        <tr><td><strong>Alasan / Keperluan</strong></td><td>: ${escapeHtml(p.alasan)}</td></tr>
        <tr><td><strong>Penjemput / Wali</strong></td><td>: ${escapeHtml(p.penjemput || '-')}</td></tr>
      </table>

      <div class="box-info">
        <strong>Ketentuan Santri Selama Berada di Luar Pondok:</strong>
        <ol style="margin:4px 0 0 16px; padding:0; font-size:12px; line-height:1.5;">
          <li>Tetap menjaga shalat 5 waktu berjamaah dan adab kesantrian.</li>
          <li>Menjaga muraja'ah hafalan Al-Qur'an setiap hari.</li>
          <li>Wajib melapor kembali ke Pos Keamanan Pondok tepat waktu saat tiba.</li>
        </ol>
      </div>

      <div class="ttd-grid">
        <div>
          <p>Wali Santri / Penjemput,</p>
          <div class="ttd-space"></div>
          <strong>${escapeHtml(p.penjemput || 'Wali Santri')}</strong>
        </div>
        <div>
          <p>Petugas Keamanan,</p>
          <div class="ttd-space"></div>
          <strong>${escapeHtml(p.petugasPemberiIzin || 'Musyrif Keamanan')}</strong>
        </div>
        <div>
          <p>Pengasuh Pondok,</p>
          <div class="ttd-space"></div>
          <strong>${escapeHtml(pengasuh)}</strong>
        </div>
      </div>

      <script>window.onload = function() { window.print(); };</script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

function eksporPerizinanExcel() {
  if (typeof XLSX === 'undefined') {
    alert("Library SheetJS belum termuat.");
    return;
  }
  const data = (AppState.perizinan || []).map((p, idx) => ({
    "No": idx + 1,
    "No Surat": p.noSurat,
    "Nama Santri": p.santriNama,
    "NIS": p.nis,
    "Jenis Izin": p.jenisIzin,
    "Tanggal Keluar": p.tanggalKeluar,
    "Jam Keluar": p.jamKeluar,
    "Rencana Kembali": p.rencanaKembali,
    "Jam Kembali": p.jamRencanaKembali,
    "Realisasi Kembali": p.realisasiKembali || "-",
    "Alasan": p.alasan,
    "Penjemput": p.penjemput,
    "Status": p.status,
    "Petugas": p.petugasPemberiIzin
  }));
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Perizinan");
  XLSX.writeFile(wb, "Data_Perizinan_Santri.xlsx");
  showToast("📥 File Excel Data Perizinan berhasil diunduh!", "success");
}

// ================= REKAPITULASI KEAMANAN & POIN =================
function renderRekapKeamanan() {
  const plgList = AppState.pelanggaran || [];
  const izinList = AppState.perizinan || [];

  const totalPlg = plgList.length;
  const santriDiLuar = izinList.filter(p => p.status === 'Sedang di Luar').length;
  const totalPoin = plgList.reduce((acc, p) => acc + (p.poin || 0), 0);
  const takziranTuntas = plgList.filter(p => p.statusTakziran === 'Selesai').length;
  const pctTuntas = totalPlg > 0 ? Math.round((takziranTuntas / totalPlg) * 100) : 100;

  const elPlg = document.getElementById('statKeamananTotalPelanggaran');
  if (elPlg) animateCounter(elPlg, totalPlg);
  const elLuar = document.getElementById('statKeamananSantriDiLuar');
  if (elLuar) animateCounter(elLuar, santriDiLuar);
  const elPoin = document.getElementById('statKeamananTotalPoin');
  if (elPoin) animateCounter(elPoin, totalPoin, 750, ' Pts');
  const elPct = document.getElementById('statKeamananTakziranTuntasPct');
  if (elPct) animateCounter(elPct, pctTuntas, 750, '%');

  const tbody = document.getElementById('tableRekapKeamananBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  AppState.santri.forEach((s, idx) => {
    const santriPlg = plgList.filter(p => p.santriId === s.id);
    const santriIzin = izinList.filter(p => p.santriId === s.id);
    const sumPoin = santriPlg.reduce((acc, p) => acc + (p.poin || 0), 0);

    let statusPoin = '';
    if (sumPoin === 0) {
      statusPoin = `<span class="badge" style="background:#dcfce7; color:#15803d; font-weight:700;">🌟 Sangat Disiplin (0 Poin)</span>`;
    } else if (sumPoin <= 15) {
      statusPoin = `<span class="badge" style="background:#fef9c3; color:#854d0e; font-weight:700;">⚠️ Pembinaan Ringan</span>`;
    } else if (sumPoin <= 30) {
      statusPoin = `<span class="badge" style="background:#ffedd5; color:#c2410c; font-weight:700;">🟠 Pembinaan Sedang</span>`;
    } else {
      statusPoin = `<span class="badge" style="background:#fee2e2; color:#b91c1c; font-weight:800;">❌ Peringatan Keras</span>`;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align:center;">${idx + 1}</td>
      <td><strong>${escapeHtml(s.nama)}</strong></td>
      <td><code>${escapeHtml(s.nis)}</code></td>
      <td><span class="badge" style="background:#f1f5f9; color:#334155;">${escapeHtml(s.program)} • ${escapeHtml(s.halaqah || '-')}</span></td>
      <td>${escapeHtml(s.asrama || '-')}</td>
      <td style="text-align:center;"><strong style="font-size:14px; color:${sumPoin > 0 ? '#b91c1c' : '#15803d'};">${sumPoin}</strong></td>
      <td>${statusPoin}</td>
      <td style="text-align:center; font-weight:600;">${santriPlg.length} kali</td>
      <td style="text-align:center; font-weight:600;">${santriIzin.length} kali</td>
      <td style="text-align:center;">
        <button class="btn btn-secondary btn-sm" onclick="lihatRiwayatKeamananSantri('${s.id}')" style="font-size:11.5px; padding:3px 8px;">
          📜 Info Santri
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function lihatRiwayatKeamananSantri(santriId) {
  const santri = AppState.santri.find(s => s.id === santriId);
  if (!santri) return;

  const plg = (AppState.pelanggaran || []).filter(p => p.santriId === santriId);
  const izin = (AppState.perizinan || []).filter(p => p.santriId === santriId);
  const poin = plg.reduce((acc, p) => acc + (p.poin || 0), 0);

  let msg = `📋 BUKU CATATAN KEDISIPLINAN: ${santri.nama} (${santri.nis})\n\n`;
  msg += `• Total Poin Pelanggaran: ${poin} Poin\n`;
  msg += `• Riwayat Pelanggaran: ${plg.length} catatan\n`;
  if (plg.length > 0) {
    plg.forEach((p, i) => {
      msg += `  ${i+1}. [${p.tanggal}] ${p.jenisPelanggaran} (+${p.poin} Pts) - Takziran: ${p.takziran} [${p.statusTakziran}]\n`;
    });
  }
  msg += `\n• Riwayat Perizinan: ${izin.length} kali izin\n`;
  if (izin.length > 0) {
    izin.forEach((p, i) => {
      msg += `  ${i+1}. [${p.tanggalKeluar}] ${p.jenisIzin}: ${p.alasan} [${p.status}]\n`;
    });
  }

  alert(msg);
}

function eksporRekapKeamananExcel() {
  if (typeof XLSX === 'undefined') {
    alert("Library SheetJS belum termuat.");
    return;
  }
  const plgList = AppState.pelanggaran || [];
  const izinList = AppState.perizinan || [];

  const data = AppState.santri.map((s, idx) => {
    const santriPlg = plgList.filter(p => p.santriId === s.id);
    const santriIzin = izinList.filter(p => p.santriId === s.id);
    const sumPoin = santriPlg.reduce((acc, p) => acc + (p.poin || 0), 0);
    return {
      "No": idx + 1,
      "Nama Santri": s.nama,
      "NIS": s.nis,
      "Program": s.program,
      "Kelas / Halaqah": s.halaqah,
      "Kamar Asrama": s.asrama,
      "Total Poin Pelanggaran": sumPoin,
      "Jumlah Pelanggaran": santriPlg.length,
      "Jumlah Izin Pulang": santriIzin.length,
      "Status": sumPoin === 0 ? "Sangat Disiplin" : (sumPoin <= 15 ? "Pembinaan Ringan" : "Peringatan")
    };
  });
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Rekap_Keamanan");
  XLSX.writeFile(wb, "Rekapitulasi_Kedisiplinan_Santri.xlsx");
  showToast("📥 File Rekap Kedisiplinan berhasil diunduh!", "success");
}

// ================= DIVISI UBUDIYAH & PEMBIASAAN IBADAH =================
function renderJamaahTable() {
  const tbody = document.getElementById('tableJamaahBody');
  if (!tbody) return;

  const tglInput = document.getElementById('jamaahFilterTanggal');
  if (tglInput && !tglInput.value) {
    tglInput.value = new Date().toISOString().split('T')[0];
  }
  const tgl = tglInput?.value || new Date().toISOString().split('T')[0];
  const waktu = document.getElementById('jamaahFilterWaktu')?.value || 'Shubuh';
  const search = document.getElementById('jamaahSearch')?.value?.toLowerCase() || '';

  tbody.innerHTML = '';
  const santriList = AppState.santri.filter(s => {
    return !search || s.nama.toLowerCase().includes(search) || s.nis.toLowerCase().includes(search);
  });

  if (santriList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-state">Tidak ada santri yang cocok.</td></tr>`;
    return;
  }

  santriList.forEach((s, idx) => {
    const existing = (AppState.ubudiyahJamaah || []).find(j => j.santriId === s.id && j.tanggal === tgl && j.waktuShalat === waktu);
    const curStatus = existing ? existing.status : 'Hadir Jamaah';
    const curKet = existing ? (existing.keterangan || existing.shaf || '') : '';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align:center;">${idx + 1}</td>
      <td><strong>${escapeHtml(s.nama)}</strong></td>
      <td><code>${escapeHtml(s.nis)}</code></td>
      <td><span class="badge" style="background:#f1f5f9; color:#334155;">${escapeHtml(s.halaqah || '-')}</span></td>
      <td>${escapeHtml(s.asrama || '-')}</td>
      <td style="text-align:center;">
        <div class="status-chips-group" style="display:inline-flex; gap:4px; flex-wrap:wrap; justify-content:center;">
          <button type="button" class="btn-status-chip ${curStatus === 'Hadir Jamaah' ? 'active-hadir' : ''}" onclick="setSantriStatusJamaah('${s.id}', 'Hadir Jamaah')">
            ✓ Hadir
          </button>
          <button type="button" class="btn-status-chip ${curStatus === 'Masbuk' ? 'active-izin' : ''}" onclick="setSantriStatusJamaah('${s.id}', 'Masbuk')">
            ⏳ Masbuk
          </button>
          <button type="button" class="btn-status-chip ${curStatus === 'Sakit di Asrama' ? 'active-sakit' : ''}" onclick="setSantriStatusJamaah('${s.id}', 'Sakit di Asrama')">
            🏥 Sakit
          </button>
          ${s.jenisKelamin === 'P' ? `
            <button type="button" class="btn-status-chip ${curStatus === 'Udzur Syar\'i' ? 'active-badal' : ''}" onclick="setSantriStatusJamaah('${s.id}', 'Udzur Syar\\'i')">
              🌸 Udzur
            </button>
          ` : ''}
          <button type="button" class="btn-status-chip ${curStatus === 'Alpa' ? 'active-alpa' : ''}" onclick="setSantriStatusJamaah('${s.id}', 'Alpa')">
            ✕ Alpa
          </button>
        </div>
      </td>
      <td>
        <input type="text" id="jamaahKet_${s.id}" class="form-control form-control-sm" value="${escapeHtml(curKet)}" placeholder="Shaf 1 / tepat waktu..." onchange="updateJamaahKet('${s.id}')" style="font-size:12px; padding:3px 8px;">
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function setSantriStatusJamaah(santriId, status) {
  const tgl = document.getElementById('jamaahFilterTanggal')?.value || new Date().toISOString().split('T')[0];
  const waktu = document.getElementById('jamaahFilterWaktu')?.value || 'Shubuh';
  const santri = AppState.santri.find(s => s.id === santriId);
  if (!santri) return;

  AppState.ubudiyahJamaah = AppState.ubudiyahJamaah || [];
  let existing = AppState.ubudiyahJamaah.find(j => j.santriId === santriId && j.tanggal === tgl && j.waktuShalat === waktu);
  if (!existing) {
    existing = {
      id: 'UBD-' + Date.now() + '-' + Math.floor(Math.random() * 900),
      santriId: santri.id,
      santriNama: santri.nama,
      tanggal: tgl,
      waktuShalat: waktu,
      status: status,
      shaf: 'Shaf Jamaah',
      keterangan: ''
    };
    AppState.ubudiyahJamaah.push(existing);
  } else {
    existing.status = status;
  }

  saveToStorage();
  renderJamaahTable();
  renderRekapUbudiyah();
}

function updateJamaahKet(santriId) {
  const tgl = document.getElementById('jamaahFilterTanggal')?.value || new Date().toISOString().split('T')[0];
  const waktu = document.getElementById('jamaahFilterWaktu')?.value || 'Shubuh';
  const val = document.getElementById(`jamaahKet_${santriId}`)?.value || '';

  const existing = (AppState.ubudiyahJamaah || []).find(j => j.santriId === santriId && j.tanggal === tgl && j.waktuShalat === waktu);
  if (existing) {
    existing.keterangan = val;
    saveToStorage();
  }
}

function quickSetSemuaHadirJamaah() {
  const tgl = document.getElementById('jamaahFilterTanggal')?.value || new Date().toISOString().split('T')[0];
  const waktu = document.getElementById('jamaahFilterWaktu')?.value || 'Shubuh';

  AppState.ubudiyahJamaah = AppState.ubudiyahJamaah || [];
  AppState.santri.forEach(s => {
    let existing = AppState.ubudiyahJamaah.find(j => j.santriId === s.id && j.tanggal === tgl && j.waktuShalat === waktu);
    if (!existing) {
      AppState.ubudiyahJamaah.push({
        id: 'UBD-' + Date.now() + '-' + Math.floor(Math.random() * 900),
        santriId: s.id,
        santriNama: s.nama,
        tanggal: tgl,
        waktuShalat: waktu,
        status: 'Hadir Jamaah',
        shaf: 'Shaf Jamaah Masjid',
        keterangan: 'Tepat waktu'
      });
    } else {
      existing.status = 'Hadir Jamaah';
    }
  });

  saveToStorage();
  renderJamaahTable();
  renderRekapUbudiyah();
  showToast(`✓ Seluruh santri (${AppState.santri.length}) ditandai HADIR JAMAAH ${waktu}!`, "success");
}

function simpanPresensiJamaah() {
  saveToStorage();
  renderRekapUbudiyah();
  showToast("💾 Presensi shalat berjamaah berhasil disimpan!", "success");
}

function eksporJamaahExcel() {
  if (typeof XLSX === 'undefined') {
    alert("Library SheetJS belum termuat.");
    return;
  }
  const data = (AppState.ubudiyahJamaah || []).map((j, idx) => ({
    "No": idx + 1,
    "Tanggal": j.tanggal,
    "Waktu Shalat": j.waktuShalat,
    "Nama Santri": j.santriNama,
    "Status": j.status,
    "Posisi Shaf": j.shaf || "-",
    "Keterangan": j.keterangan || "-"
  }));
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Presensi_Jamaah");
  XLSX.writeFile(wb, "Presensi_Shalat_Berjamaah_Santri.xlsx");
  showToast("📥 File Excel Presensi Jamaah berhasil diunduh!", "success");
}

// ================= EKSTRAKURIKULER & KAJIAN UBUDIYAH =================
function renderEkskulTable() {
  const tbody = document.getElementById('tableEkskulBody');
  if (!tbody) return;

  const search = document.getElementById('ekskulSearch')?.value?.toLowerCase() || '';
  const filterKat = document.getElementById('ekskulFilterKategori')?.value || '';

  tbody.innerHTML = '';
  const list = AppState.ubudiyahEkskul || [];

  const filtered = list.filter(e => {
    const matchSearch = !search || 
      e.santriNama.toLowerCase().includes(search) || 
      e.namaKegiatan.toLowerCase().includes(search) || 
      (e.pembimbing && e.pembimbing.toLowerCase().includes(search));
    const matchKat = !filterKat || e.kategori === filterKat;
    return matchSearch && matchKat;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="empty-state">Belum ada data partisipasi kegiatan yang sesuai filter.</td></tr>`;
    return;
  }

  filtered.forEach((e, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align:center;">${idx + 1}</td>
      <td><strong>${escapeHtml(e.santriNama)}</strong></td>
      <td><code>${escapeHtml(e.santriId)}</code></td>
      <td><strong style="color:#0f172a;">${escapeHtml(e.namaKegiatan)}</strong></td>
      <td><span class="badge" style="background:#e0f2fe; color:#0369a1;">${escapeHtml(e.kategori)}</span></td>
      <td>${escapeHtml(e.jadwal || '-')}</td>
      <td style="text-align:center;"><span class="badge" style="background:#dcfce7; color:#15803d; font-weight:700;">${escapeHtml(e.keaktifan || 'Aktif')}</span></td>
      <td>${escapeHtml(e.pembimbing || '-')}</td>
      <td style="font-size:12px; color:#475569;">${escapeHtml(e.prestasiCatatan || '-')}</td>
      <td style="text-align:center;">
        <div style="display:flex; gap:4px; justify-content:center;">
          <button class="btn btn-secondary btn-sm" onclick="openModalInputEkskul('${e.id}')" title="Edit" style="padding:4px 7px;">
            ✏️
          </button>
          <button class="btn btn-danger btn-sm" onclick="hapusEkskul('${e.id}')" title="Hapus" style="padding:4px 7px;">
            🗑️
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openModalInputEkskul(id) {
  const modal = document.getElementById('modalInputEkskul');
  if (!modal) return;

  const form = document.getElementById('formInputEkskul');
  if (form) form.reset();

  const selectSantri = document.getElementById('formEkskulSantriId');
  if (selectSantri) {
    selectSantri.innerHTML = '';
    AppState.santri.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.nama} (${s.nis})`;
      selectSantri.appendChild(opt);
    });
  }

  document.getElementById('formEkskulId').value = id || '';

  if (id) {
    const e = (AppState.ubudiyahEkskul || []).find(item => item.id === id);
    if (e) {
      document.getElementById('modalInputEkskulTitle').textContent = `✏️ Edit Kegiatan (${e.santriNama})`;
      document.getElementById('formEkskulSantriId').value = e.santriId;
      document.getElementById('formEkskulNama').value = e.namaKegiatan;
      document.getElementById('formEkskulKategori').value = e.kategori;
      document.getElementById('formEkskulJadwal').value = e.jadwal || '';
      document.getElementById('formEkskulKeaktifan').value = e.keaktifan || 'Sangat Aktif (100%)';
      document.getElementById('formEkskulPembimbing').value = e.pembimbing || '';
      document.getElementById('formEkskulPrestasi').value = e.prestasiCatatan || '';
    }
  } else {
    document.getElementById('modalInputEkskulTitle').textContent = '🎯 Catat Partisipasi Kegiatan / Ekskul';
  }

  modal.classList.add('active');
}

function closeModalInputEkskul() {
  const modal = document.getElementById('modalInputEkskul');
  if (modal) modal.classList.remove('active');
}

function simpanEkskul(e) {
  e.preventDefault();
  const id = document.getElementById('formEkskulId').value;
  const santriId = document.getElementById('formEkskulSantriId').value;
  const nama = document.getElementById('formEkskulNama').value.trim();
  const kategori = document.getElementById('formEkskulKategori').value;
  const jadwal = document.getElementById('formEkskulJadwal').value.trim();
  const keaktifan = document.getElementById('formEkskulKeaktifan').value;
  const pembimbing = document.getElementById('formEkskulPembimbing').value.trim();
  const prestasi = document.getElementById('formEkskulPrestasi').value.trim();

  const santri = AppState.santri.find(s => s.id === santriId);
  if (!santri) {
    alert("Pilih santri terlebih dahulu.");
    return;
  }

  let obj = id ? (AppState.ubudiyahEkskul || []).find(item => item.id === id) : null;
  if (!obj) {
    obj = {
      id: 'EKS-' + Date.now(),
      santriId: santri.id,
      santriNama: santri.nama,
      namaKegiatan: nama,
      kategori: kategori,
      jadwal: jadwal,
      keaktifan: keaktifan,
      pembimbing: pembimbing,
      prestasiCatatan: prestasi
    };
    AppState.ubudiyahEkskul = AppState.ubudiyahEkskul || [];
    AppState.ubudiyahEkskul.unshift(obj);
  } else {
    obj.santriId = santri.id;
    obj.santriNama = santri.nama;
    obj.namaKegiatan = nama;
    obj.kategori = kategori;
    obj.jadwal = jadwal;
    obj.keaktifan = keaktifan;
    obj.pembimbing = pembimbing;
    obj.prestasiCatatan = prestasi;
  }

  saveToStorage();
  closeModalInputEkskul();
  renderAll();
  showToast(`🎯 Kegiatan ${nama} untuk santri ${santri.nama} berhasil disimpan!`, "success");
}

function hapusEkskul(id) {
  const e = (AppState.ubudiyahEkskul || []).find(item => item.id === id);
  if (!e) return;

  if (confirm(`Hapus kegiatan ${e.namaKegiatan} untuk ${e.santriNama}?`)) {
    AppState.ubudiyahEkskul = AppState.ubudiyahEkskul.filter(item => item.id !== id);
    saveToStorage();
    renderAll();
    showToast("Kegiatan telah dihapus.", "info");
  }
}

function eksporEkskulExcel() {
  if (typeof XLSX === 'undefined') {
    alert("Library SheetJS belum termuat.");
    return;
  }
  const data = (AppState.ubudiyahEkskul || []).map((e, idx) => ({
    "No": idx + 1,
    "Nama Santri": e.santriNama,
    "Nama Kegiatan": e.namaKegiatan,
    "Kategori": e.kategori,
    "Jadwal": e.jadwal,
    "Keaktifan": e.keaktifan,
    "Pembimbing": e.pembimbing,
    "Catatan & Prestasi": e.prestasiCatatan
  }));
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Ekstrakurikuler");
  XLSX.writeFile(wb, "Data_Ekstrakurikuler_Santri.xlsx");
  showToast("📥 File Excel Ekskul berhasil diunduh!", "success");
}

// ================= REKAPITULASI UBUDIYAH =================
function renderRekapUbudiyah() {
  const jamaahList = AppState.ubudiyahJamaah || [];
  const ekskulList = AppState.ubudiyahEkskul || [];

  const totalHadir = jamaahList.filter(j => j.status === 'Hadir Jamaah').length;
  const totalJamaah = jamaahList.length;
  const pctRata = totalJamaah > 0 ? ((totalHadir / totalJamaah) * 100).toFixed(1) : 96.8;

  const elRata = document.getElementById('statUbudiyahRataRata');
  if (elRata) animateCounter(elRata, pctRata, 750, '%');
  const elPart = document.getElementById('statUbudiyahTotalPartisipasi');
  if (elPart) animateCounter(elPart, ekskulList.length, 750, ' Santri');

  const tbody = document.getElementById('tableRekapUbudiyahBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  let istiqomahCount = 0;

  AppState.santri.forEach((s, idx) => {
    const sJamaah = jamaahList.filter(j => j.santriId === s.id);
    const sHadir = sJamaah.filter(j => j.status === 'Hadir Jamaah').length;
    const sMasbuk = sJamaah.filter(j => j.status && j.status.includes('Masbuk')).length;
    const pct = sJamaah.length > 0 ? Math.round((sHadir / sJamaah.length) * 100) : 98;

    if (pct >= 95) istiqomahCount++;

    const sEkskul = ekskulList.filter(e => e.santriId === s.id);
    const ekskulNames = sEkskul.map(e => e.namaKegiatan).join(', ') || '—';

    let statChip = '';
    if (pct >= 95) {
      statChip = `<span class="badge" style="background:#dcfce7; color:#15803d; font-weight:700;">🌟 Sangat Istiqomah</span>`;
    } else if (pct >= 85) {
      statChip = `<span class="badge" style="background:#e0f2fe; color:#0369a1; font-weight:700;">👍 Istiqomah Baik</span>`;
    } else {
      statChip = `<span class="badge" style="background:#fef3c7; color:#b45309; font-weight:700;">⚠️ Perlu Pembiasaan</span>`;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align:center;">${idx + 1}</td>
      <td><strong>${escapeHtml(s.nama)}</strong></td>
      <td><code>${escapeHtml(s.nis)}</code></td>
      <td><span class="badge" style="background:#f1f5f9; color:#334155;">${escapeHtml(s.halaqah || '-')}</span></td>
      <td style="text-align:center;"><strong style="font-size:14px; color:#065f46;">${pct}%</strong></td>
      <td>${statChip}</td>
      <td style="text-align:center; font-weight:600;">${sMasbuk} kali</td>
      <td style="font-size:12px; color:#0f172a; max-width:220px;">${escapeHtml(ekskulNames)}</td>
      <td style="font-size:12px; color:#64748b;">${pct >= 95 ? 'Disiplin azan & shaf awal' : 'Perlu dipantau bangun shubuh'}</td>
    `;
    tbody.appendChild(tr);
  });

  const elIst = document.getElementById('statUbudiyahSantriIstiqomah');
  if (elIst) animateCounter(elIst, istiqomahCount, 750, ' Santri');
}

function eksporRekapUbudiyahExcel() {
  if (typeof XLSX === 'undefined') {
    alert("Library SheetJS belum termuat.");
    return;
  }
  const jamaahList = AppState.ubudiyahJamaah || [];
  const ekskulList = AppState.ubudiyahEkskul || [];

  const data = AppState.santri.map((s, idx) => {
    const sJamaah = jamaahList.filter(j => j.santriId === s.id);
    const sHadir = sJamaah.filter(j => j.status === 'Hadir Jamaah').length;
    const sMasbuk = sJamaah.filter(j => j.status && j.status.includes('Masbuk')).length;
    const pct = sJamaah.length > 0 ? Math.round((sHadir / sJamaah.length) * 100) : 98;
    const sEkskul = ekskulList.filter(e => e.santriId === s.id);

    return {
      "No": idx + 1,
      "Nama Santri": s.nama,
      "NIS": s.nis,
      "Kelas / Halaqah": s.halaqah,
      "Kehadiran Jamaah (%)": pct,
      "Masbuk": sMasbuk,
      "Ekstrakurikuler": sEkskul.map(e => e.namaKegiatan).join(', ') || "-",
      "Status": pct >= 95 ? "Sangat Istiqomah" : "Cukup"
    };
  });
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Rekap_Ubudiyah");
  XLSX.writeFile(wb, "Rekapitulasi_Keaktifan_Ubudiyah_Santri.xlsx");
  showToast("📥 File Rekap Ubudiyah berhasil diunduh!", "success");
}

// ================= 8. PENGATURAN PONDOK =================
function renderPengaturanTab() {
  document.getElementById('settingNamaPondok').value = AppState.settings.namaPondok || '';
  document.getElementById('settingAlamatPondok').value = AppState.settings.alamatPondok || '';
  document.getElementById('settingPengasuh').value = AppState.settings.pengasuhPondok || '';
  const elIstri = document.getElementById('settingPengasuhIstri');
  if (elIstri) elIstri.value = AppState.settings.pengasuhIstri || '';
  document.getElementById('settingKepalaTahfidz').value = AppState.settings.kepalaTahfidz || '';
  document.getElementById('settingTahunAjaran').value = AppState.settings.tahunAjaran || '';
  document.getElementById('settingKontak').value = AppState.settings.noKontakPondok || '';
  const elPutri = document.getElementById('settingKontakPutri');
  if (elPutri) elPutri.value = AppState.settings.noKontakPutri || '';

  const elKelas = document.getElementById('settingKelasBinnadzorList');
  if (elKelas) {
    elKelas.value = (AppState.settings.daftarKelasBinnadzor || DEFAULT_SETTINGS.daftarKelasBinnadzor || []).join('\n');
  }
  const elTahfidz = document.getElementById('settingHalaqahTahfidzList');
  if (elTahfidz) {
    elTahfidz.value = (AppState.settings.daftarHalaqahTahfidz || DEFAULT_SETTINGS.daftarHalaqahTahfidz || []).join('\n');
  }
  const elPasca = document.getElementById('settingHalaqahPascaTahfidzList');
  if (elPasca) {
    elPasca.value = (AppState.settings.daftarHalaqahPascaTahfidz || DEFAULT_SETTINGS.daftarHalaqahPascaTahfidz || []).join('\n');
  }
  const elOldHalaqah = document.getElementById('settingHalaqahList');
  if (elOldHalaqah) {
    elOldHalaqah.value = (AppState.settings.daftarHalaqah || []).join('\n');
  }

  document.getElementById('settingSesiList').value = (AppState.settings.sesiSetoran || []).join('\n');

  // Medsos settings
  const medsos = AppState.settings.medsos || (DEFAULT_SETTINGS.medsos || {});
  const setElVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };
  setElVal('settingIgPutra', medsos.igPutra);
  setElVal('settingIgPutri', medsos.igPutri);
  setElVal('settingTiktokPutra', medsos.tiktokPutra);
  setElVal('settingTiktokPutri', medsos.tiktokPutri);
  setElVal('settingYoutube', medsos.youtube);
  setElVal('settingFacebook', medsos.facebook);

  // PIN settings
  const pinInput = document.getElementById('settingAccessPin');
  if (pinInput) pinInput.value = AppState.settings.accessPin || '123456';
  const pendPinInput = document.getElementById('settingPendidikanPin');
  if (pendPinInput) pendPinInput.value = AppState.settings.pendidikanPin || '111111';
  const keamPinInput = document.getElementById('settingKeamananPin');
  if (keamPinInput) keamPinInput.value = AppState.settings.keamananPin || '222222';
  const ubudPinInput = document.getElementById('settingUbudiyahPin');
  if (ubudPinInput) ubudPinInput.value = AppState.settings.ubudiyahPin || '333333';
  const ustadzPinInput = document.getElementById('settingUstadzPin');
  if (ustadzPinInput) ustadzPinInput.value = AppState.settings.ustadzPin || '888888';
  const pinProtectedCheckbox = document.getElementById('settingIsPinProtected');
  if (pinProtectedCheckbox) pinProtectedCheckbox.checked = AppState.settings.isPinProtected !== false;

  renderDaftarHariLibur();
  renderPengurusAccountsTable();
  renderPengaturanLogoPreview();
  renderPengaturanHeroBannerPreview();
  renderPengaturanFotoPengasuhPreview();
  renderPengaturanBackgroundUI();
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
        // Sudut bukan hitam pekat
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

function renderPengaturanLogoPreview() {
  const preview = document.getElementById('settingLogoPreview');
  if (!preview) return;
  if (AppState.settings.logoPondok) {
    preview.innerHTML = `<img src="${AppState.settings.logoPondok}" alt="Logo" class="pondok-logo-img" style="object-fit:contain; background:transparent;">`;
  } else {
    preview.innerHTML = `<span class="pondok-logo-placeholder" style="font-size:45px;">🕌</span>`;
  }
}

function previewLogoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    if (typeof window.openImageCropper === 'function') {
      window.openImageCropper({
        imageSrc: e.target.result,
        aspectRatio: '1:1',
        title: 'Sesuaikan & Potong Logo Pondok (1:1)',
        format: 'image/png',
        outputFormat: 'image/png',
        onSave: function(croppedBase64) {
          cleanBlackBackgroundFromLogo(croppedBase64, function(finalCleaned) {
            AppState.settings.logoPondok = finalCleaned;
            renderPengaturanLogoPreview();
            renderHeaderLogo();
            saveToStorage();
            showToast("Logo pondok berhasil diperbarui (transparan)!", "success");
          });
        }
      });
    } else {
      cleanBlackBackgroundFromLogo(e.target.result, function(finalCleaned) {
        AppState.settings.logoPondok = finalCleaned;
        renderPengaturanLogoPreview();
        renderHeaderLogo();
        saveToStorage();
        showToast("Logo pondok berhasil diperbarui!", "success");
      });
    }
    event.target.value = '';
  };
  reader.readAsDataURL(file);
}

function resetLogoDefault() {
  AppState.settings.logoPondok = "";
  renderPengaturanLogoPreview();
  renderHeaderLogo();
  saveToStorage();
  showToast("Logo pondok dikembalikan ke ikon default.", "info");
}

// ================= FOTO HEADER / BANNER DEPAN (HERO BANNER) =================
function renderPengaturanHeroBannerPreview() {
  const previewImg = document.getElementById('settingHeroBannerPreviewImg');
  if (previewImg) {
    const photo = AppState.settings.heroBannerPhoto || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=80';
    previewImg.style.backgroundImage = `url("${photo}")`;
  }
  const btnReset = document.getElementById('btnResetHeroBanner');
  if (btnReset) {
    btnReset.style.display = AppState.settings.heroBannerPhoto ? 'inline-flex' : 'none';
  }
}

function previewHeroBannerUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    if (typeof window.openImageCropper === 'function') {
      window.openImageCropper({
        imageSrc: e.target.result,
        aspectRatio: '16:9',
        title: 'Sesuaikan & Potong Foto Background Banner Utama',
        onSave: function(croppedBase64) {
          AppState.settings.heroBannerPhoto = croppedBase64;
          renderPengaturanHeroBannerPreview();
          saveToStorage();
          showToast('Alhamdulillah! Foto background banner berhasil disimpan & diperbarui.', 'success');
        }
      });
    } else {
      compressImageFile(file, 1600, 900, 0.85, function(base64) {
        AppState.settings.heroBannerPhoto = base64;
        renderPengaturanHeroBannerPreview();
        saveToStorage();
        showToast('Foto background banner berhasil diperbarui!', 'success');
      });
    }
    event.target.value = '';
  };
  reader.readAsDataURL(file);
}

function resetHeroBannerDefault() {
  AppState.settings.heroBannerPhoto = "";
  renderPengaturanHeroBannerPreview();
  saveToStorage();
  showToast('Foto background banner dikembalikan ke foto bawaan.', 'info');
}

// ================= FOTO PENGASUH PONDOK (SUAMI & ISTRI BERSAMA) =================
function renderPengaturanFotoPengasuhPreview() {
  const prev = document.getElementById('settingFotoPengasuhPreview');
  if (prev) {
    if (AppState.settings.fotoPengasuh) {
      prev.innerHTML = `<img src="${AppState.settings.fotoPengasuh}" alt="Foto Pengasuh" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">`;
    } else {
      prev.innerHTML = `
        <div style="text-align:center; color:#059669;">
          <div style="font-size:48px; line-height:1; margin-bottom:6px;">👳‍♂️ 🧕</div>
          <div style="font-size:12.5px; font-weight:700;">Belum ada foto pengasuh</div>
          <div style="font-size:11px; color:#64748b; margin-top:2px;">Klik tombol di bawah untuk memilih foto dari galeri/folder</div>
        </div>
      `;
    }
  }
}

function compressImageFile(file, maxWidth, maxHeight, quality, callback) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
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
      const dataUrl = canvas.toDataURL('image/jpeg', quality || 0.82);
      callback(dataUrl);
    };
    img.onerror = function() {
      callback(e.target.result);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function previewFotoPengasuhUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    if (typeof window.openImageCropper === 'function') {
      window.openImageCropper({
        imageSrc: e.target.result,
        aspectRatio: '16:9',
        title: 'Sesuaikan & Potong Foto Pengasuh Pondok',
        onSave: function(croppedBase64) {
          AppState.settings.fotoPengasuh = croppedBase64;
          renderPengaturanFotoPengasuhPreview();
          saveToStorage();
          showToast('Alhamdulillah! Foto pengasuh berhasil disimpan & diperbarui.', 'success');
        }
      });
    } else {
      compressImageFile(file, 900, 900, 0.82, function(base64) {
        AppState.settings.fotoPengasuh = base64;
        renderPengaturanFotoPengasuhPreview();
        saveToStorage();
        showToast('Alhamdulillah! Foto pengasuh berhasil disimpan & diperbarui.', 'success');
      });
    }
    event.target.value = '';
  };
  reader.readAsDataURL(file);
}

function resetFotoPengasuh() {
  AppState.settings.fotoPengasuh = "";
  renderPengaturanFotoPengasuhPreview();
  saveToStorage();
  showToast('Foto pengasuh dihapus & dikembalikan ke tampilan default.', 'info');
}

// ================= PENGATURAN BACKGROUND TRANSPARAN =================
function renderPengaturanBackgroundUI() {
  const bgType = AppState.settings.backgroundType || 'preset_mosque';
  const customBg = AppState.settings.customBackground || '';
  const opacity = (typeof AppState.settings.backgroundOpacity === 'number') ? AppState.settings.backgroundOpacity : 0.12;
  const mode = AppState.settings.backgroundMode || 'cover';

  // 1. Highlight Button Active
  const btnMosque = document.getElementById('btnPresetMosque');
  const btnGeometry = document.getElementById('btnPresetGeometry');
  const btnQuran = document.getElementById('btnPresetQuran');
  const btnNone = document.getElementById('btnPresetNone');

  const setInactive = (btn) => {
    if (btn) {
      btn.className = 'btn btn-secondary btn-sm';
      btn.style.borderColor = '#cbd5e1';
      btn.style.fontWeight = 'normal';
    }
  };
  const setActive = (btn) => {
    if (btn) {
      btn.className = 'btn btn-primary btn-sm';
      btn.style.borderColor = 'var(--primary-700)';
      btn.style.fontWeight = 'bold';
    }
  };

  setInactive(btnMosque);
  setInactive(btnGeometry);
  setInactive(btnQuran);
  setInactive(btnNone);

  if (bgType === 'preset_mosque') setActive(btnMosque);
  else if (bgType === 'preset_geometry') setActive(btnGeometry);
  else if (bgType === 'preset_quran') setActive(btnQuran);
  else if (bgType === 'none') setActive(btnNone);

  // 2. Tombol Hapus Custom Background
  const btnHapusCustomBg = document.getElementById('btnHapusCustomBg');
  if (btnHapusCustomBg) {
    btnHapusCustomBg.style.display = (customBg) ? 'inline-flex' : 'none';
  }

  // 3. Opacity input & label
  const opacityInput = document.getElementById('settingBgOpacityInput');
  const opacityVal = document.getElementById('settingBgOpacityVal');
  if (opacityInput) opacityInput.value = opacity;
  if (opacityVal) opacityVal.textContent = Math.round(opacity * 100) + '%';

  // 4. Mode dropdown
  const modeSelect = document.getElementById('settingBgMode');
  if (modeSelect) modeSelect.value = mode;

  // 5. Mini Preview Box
  const previewLayer = document.getElementById('bgMiniPreviewLayer');
  if (previewLayer) {
    let pUrl = 'none';
    let pSize = mode === 'repeat' ? '60px 60px' : (mode === 'center' ? 'contain' : 'cover');
    let pRepeat = mode === 'repeat' ? 'repeat' : 'no-repeat';

    if (bgType === 'custom' && customBg) {
      pUrl = `url("${customBg}")`;
      if (mode === 'repeat') pSize = 'auto';
    } else if (BACKGROUND_PRESETS[bgType] && BACKGROUND_PRESETS[bgType].url !== 'none') {
      pUrl = `url("${BACKGROUND_PRESETS[bgType].url}")`;
      if (bgType === 'preset_geometry') pSize = '60px 60px';
    }

    previewLayer.style.backgroundImage = pUrl;
    previewLayer.style.backgroundSize = pSize;
    previewLayer.style.backgroundRepeat = pRepeat;
    previewLayer.style.opacity = Math.min(0.85, opacity * 2.8);
  }
}

function selectBackgroundPreset(presetKey) {
  AppState.settings.backgroundType = presetKey;
  saveToStorage();
  if (typeof applyAppBackground === 'function') {
    applyAppBackground(AppState.settings);
  }
  renderPengaturanBackgroundUI();

  const names = {
    preset_mosque: "Kubah Masjid & Menara",
    preset_geometry: "Pola Ornamen Arabesque",
    preset_quran: "Mushaf Al-Qur'an & Rehal",
    none: "Polos / Tanpa Gambar"
  };
  showToast(`Latar belakang diubah ke: ${names[presetKey] || presetKey}`, "success");
}

function handleBackgroundUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 12 * 1024 * 1024) {
    showToast("Ukuran foto maksimal 12 MB.", "warning");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    if (typeof window.openImageCropper === 'function') {
      window.openImageCropper({
        imageSrc: e.target.result,
        aspectRatio: '16:9',
        title: 'Sesuaikan & Potong Foto Background (Latar Belakang)',
        onSave: function(croppedBase64) {
          AppState.settings.customBackground = croppedBase64;
          AppState.settings.backgroundType = 'custom';
          saveToStorage();
          if (typeof applyAppBackground === 'function') {
            applyAppBackground(AppState.settings);
          }
          renderPengaturanBackgroundUI();
          showToast("Foto background berhasil diunggah dan diterapkan!", "success");
        }
      });
    } else {
      AppState.settings.customBackground = e.target.result;
      AppState.settings.backgroundType = 'custom';
      saveToStorage();
      if (typeof applyAppBackground === 'function') {
        applyAppBackground(AppState.settings);
      }
      renderPengaturanBackgroundUI();
      showToast("Foto background berhasil diunggah dan diterapkan!", "success");
    }
    event.target.value = '';
  };
  reader.readAsDataURL(file);
}

function resetCustomBackground() {
  if (confirm("Hapus foto latar belakang custom dan kembali ke preset bawaan?")) {
    AppState.settings.customBackground = "";
    AppState.settings.backgroundType = "preset_mosque";
    saveToStorage();
    if (typeof applyAppBackground === 'function') {
      applyAppBackground(AppState.settings);
    }
    renderPengaturanBackgroundUI();
    showToast("Foto custom dihapus, kembali ke wallpaper Kubah Masjid.", "info");
  }
}

function updateBackgroundOpacity(val) {
  const num = parseFloat(val);
  AppState.settings.backgroundOpacity = num;
  const label = document.getElementById('settingBgOpacityVal');
  if (label) label.textContent = Math.round(num * 100) + '%';
  if (typeof applyAppBackground === 'function') {
    applyAppBackground(AppState.settings);
  }
  const previewLayer = document.getElementById('bgMiniPreviewLayer');
  if (previewLayer) {
    previewLayer.style.opacity = Math.min(0.85, num * 2.8);
  }
}

function updateBackgroundMode(mode) {
  AppState.settings.backgroundMode = mode;
  saveToStorage();
  if (typeof applyAppBackground === 'function') {
    applyAppBackground(AppState.settings);
  }
  renderPengaturanBackgroundUI();
  showToast(`Mode tampilan background diubah ke '${mode}'`, "info");
}

function simpanPengaturan() {
  AppState.settings.namaPondok = document.getElementById('settingNamaPondok').value.trim();
  AppState.settings.alamatPondok = document.getElementById('settingAlamatPondok').value.trim();
  AppState.settings.pengasuhPondok = document.getElementById('settingPengasuh').value.trim();
  const elIstri = document.getElementById('settingPengasuhIstri');
  if (elIstri) AppState.settings.pengasuhIstri = elIstri.value.trim();
  AppState.settings.kepalaTahfidz = document.getElementById('settingKepalaTahfidz').value.trim();
  AppState.settings.tahunAjaran = document.getElementById('settingTahunAjaran').value.trim();
  AppState.settings.noKontakPondok = document.getElementById('settingKontak').value.trim();
  const elKontakPutri = document.getElementById('settingKontakPutri');
  if (elKontakPutri) AppState.settings.noKontakPutri = elKontakPutri.value.trim();

  // Kelas Binnadzor & Halaqah Tahfidz
  const elKelas = document.getElementById('settingKelasBinnadzorList');
  if (elKelas) {
    AppState.settings.daftarKelasBinnadzor = elKelas.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  }
  const elTahfidz = document.getElementById('settingHalaqahTahfidzList');
  if (elTahfidz) {
    AppState.settings.daftarHalaqahTahfidz = elTahfidz.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  }
  const elPasca = document.getElementById('settingHalaqahPascaTahfidzList');
  if (elPasca) {
    AppState.settings.daftarHalaqahPascaTahfidz = elPasca.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  }
  AppState.settings.daftarHalaqah = [
    ...(AppState.settings.daftarKelasBinnadzor || []),
    ...(AppState.settings.daftarHalaqahTahfidz || []),
    ...(AppState.settings.daftarHalaqahPascaTahfidz || [])
  ];

  // Bersihkan santri yang berada di halaqah yang sudah dihapus dari Pengaturan
  const validHalaqahSet = new Set(AppState.settings.daftarHalaqah.map(h => h.trim().toLowerCase()));
  let santriCleaned = false;
  (AppState.santri || []).forEach(s => {
    if (s.halaqah && !validHalaqahSet.has(s.halaqah.trim().toLowerCase())) {
      s.halaqah = '';
      santriCleaned = true;
    }
  });
  if (santriCleaned) {
    localStorage.setItem(STORAGE_KEYS.SANTRI, JSON.stringify(AppState.santri));
  }

  // Sesi lines
  const sesiText = document.getElementById('settingSesiList').value;
  AppState.settings.sesiSetoran = sesiText.split(/\r?\n/).map(s => s.trim()).filter(Boolean);

  // Medsos settings
  const getElVal = (id) => document.getElementById(id)?.value?.trim() || '';
  AppState.settings.medsos = {
    igPutra: getElVal('settingIgPutra'),
    igPutri: getElVal('settingIgPutri'),
    tiktokPutra: getElVal('settingTiktokPutra'),
    tiktokPutri: getElVal('settingTiktokPutri'),
    youtube: getElVal('settingYoutube'),
    facebook: getElVal('settingFacebook')
  };

  // PIN settings
  const pinInput = document.getElementById('settingAccessPin');
  if (pinInput && pinInput.value.trim()) {
    AppState.settings.accessPin = pinInput.value.trim();
  }
  const pendPinInput = document.getElementById('settingPendidikanPin');
  if (pendPinInput && pendPinInput.value.trim()) {
    AppState.settings.pendidikanPin = pendPinInput.value.trim();
  }
  const keamPinInput = document.getElementById('settingKeamananPin');
  if (keamPinInput && keamPinInput.value.trim()) {
    AppState.settings.keamananPin = keamPinInput.value.trim();
  }
  const ubudPinInput = document.getElementById('settingUbudiyahPin');
  if (ubudPinInput && ubudPinInput.value.trim()) {
    AppState.settings.ubudiyahPin = ubudPinInput.value.trim();
  }
  const ustadzPinInput = document.getElementById('settingUstadzPin');
  if (ustadzPinInput && ustadzPinInput.value.trim()) {
    AppState.settings.ustadzPin = ustadzPinInput.value.trim();
  }
  const pinProtectedCheckbox = document.getElementById('settingIsPinProtected');
  if (pinProtectedCheckbox) {
    AppState.settings.isPinProtected = pinProtectedCheckbox.checked;
  }

  const opacityInput = document.getElementById('settingBgOpacityInput');
  if (opacityInput) {
    AppState.settings.backgroundOpacity = parseFloat(opacityInput.value) || 0.12;
  }
  const modeSelect = document.getElementById('settingBgMode');
  if (modeSelect) {
    AppState.settings.backgroundMode = modeSelect.value;
  }

  saveToStorage();
  if (typeof applyAppBackground === 'function') {
    applyAppBackground(AppState.settings);
  }
  initHeader();
  initFormDropdowns();
  renderAll();
  showToast("Pengaturan pondok, PIN, dan background berhasil disimpan!", "success");
}

function initFormDropdowns() {
  // Sesi dropdown in filter absensi
  const absensiSesi = document.getElementById('absensiSesi');
  if (absensiSesi) {
    const curVal = absensiSesi.value;
    absensiSesi.innerHTML = '';
    (AppState.settings.sesiSetoran || []).forEach(sesi => {
      const opt = document.createElement('option');
      opt.value = sesi;
      opt.textContent = sesi;
      absensiSesi.appendChild(opt);
    });
    if (curVal) absensiSesi.value = curVal;
  }

  // Halaqah filter in Santri tab
  const halaqahFilter = document.getElementById('santriFilterHalaqah');
  if (halaqahFilter) {
    const curHalaqah = halaqahFilter.value;
    halaqahFilter.innerHTML = `<option value="">Semua Halaqah</option>`;
    (AppState.settings.daftarHalaqah || []).forEach(h => {
      const opt = document.createElement('option');
      opt.value = h;
      opt.textContent = h;
      halaqahFilter.appendChild(opt);
    });
    if (curHalaqah) halaqahFilter.value = curHalaqah;
  }

  // Sesi dropdown in filter absensi ustadz (Admin Only)
  const absensiUstadzSesi = document.getElementById('absensiUstadzSesi');
  if (absensiUstadzSesi) {
    const curValUst = absensiUstadzSesi.value;
    absensiUstadzSesi.innerHTML = '';
    (AppState.settings.sesiSetoran || []).forEach(sesi => {
      const opt = document.createElement('option');
      opt.value = sesi;
      opt.textContent = sesi;
      absensiUstadzSesi.appendChild(opt);
    });
    if (curValUst) absensiUstadzSesi.value = curValUst;
  }

  const absensiUstadzTanggal = document.getElementById('absensiUstadzTanggal');
  if (absensiUstadzTanggal && !absensiUstadzTanggal.value) {
    absensiUstadzTanggal.value = new Date().toISOString().split('T')[0];
  }

  const rekapUstBulan = document.getElementById('rekapUstadzBulan');
  if (rekapUstBulan) {
    rekapUstBulan.value = String(new Date().getMonth() + 1);
  }
  const rekapUstTahun = document.getElementById('rekapUstadzTahun');
  if (rekapUstTahun) {
    rekapUstTahun.value = String(new Date().getFullYear());
  }
}

// ================= HELPERS & TOAST =================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '⚠️';

  toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;
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

function getNilaiChipHtml(nilai) {
  if (!nilai) return `<span class="nilai-chip nilai-jayyid">-</span>`;
  if (nilai.includes('Mumtaz')) return `<span class="nilai-chip nilai-mumtaz">🌟 ${escapeHtml(nilai)}</span>`;
  if (nilai.includes('Jayyid Jiddan')) return `<span class="nilai-chip nilai-jayyid-jiddan">✨ ${escapeHtml(nilai)}</span>`;
  if (nilai.includes('Jayyid')) return `<span class="nilai-chip nilai-jayyid">👍 ${escapeHtml(nilai)}</span>`;
  if (nilai.includes('Maqbul')) return `<span class="nilai-chip nilai-maqbul">⚠️ ${escapeHtml(nilai)}</span>`;
  return `<span class="nilai-chip nilai-rasib">❌ ${escapeHtml(nilai)}</span>`;
}

function formatTanggalIndo(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const d = parseInt(parts[2], 10);
  const m = parseInt(parts[1], 10) - 1;
  const y = parts[0];
  return `${d} ${bulan[m] || ''} ${y}`;
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

// ========================================================
// 9. WEBSITE & ARTICLE CMS CONTROLLER FOR ADMIN
// ========================================================

const DEFAULT_WEB_CONTENT = {
  heroBismillah: "Selamat Datang di Website Resmi",
  heroTitleName: "ASRAMA TAHFIDZ SUNAN BONANG",
  heroTitleYayasan: "Yayasan PP. Mamba'ul Ma'arif",
  heroTitleLocation: "Denanyar Jombang",
  heroTitlePrefix: "Yayasan PP. Mamba'ul Ma'arif",
  heroSubtitle: "Lembaga pendidikan Islam berfokus pada ketuntasan Program Binnadzor (bacaan fashih & hafalan dasar Juz 28-30) dan Program Tahfidz 30 Juz bersanad mutqin di bawah naungan Yayasan PP. Mamba'ul Ma'arif Denanyar Jombang.",
  fotoProfilPesantren: "",
  judulProfil: "Profil Pondok Pesantren Tahfidzul Qur'an",
  descProfil: "Didirikan untuk menjaga kemurnian bacaan Al-Qur'an secara talaqqi musyafahah dengan sanad muttashil. Memadukan kedalaman kajian kitab kuning para ulama salaf dengan akselerasi hafalan 30 juz berdisiplin tinggi, melahirkan generasi Qur'ani yang tangguh, berakhlak mulia, dan berjiwa ikhlas.",
  modalJudulProfil: "Tradisi Menjaga Al-Qur'an dengan Sanad Shahih",
  modalDescProfil: "Pondok Pesantren Tahfidz Al-Qur'an Al-Barokah didirikan dengan niat ikhlas meneruskan amanah para Masyaikh dalam menjaga kemurnian bacaan Al-Qur'anul Karim. Kami meyakini bahwa menghafal Al-Qur'an tidak sekadar menghafal teks lafadz, melainkan mengambil bacaan secara talaqqi musyafahah (berhadap-hadapan langsung dari lisan guru ke murid) dengan sanad yang muttashil bersambung hingga baginda Rasulullah SAW.",
  modalPoin1Title: "🌿 Lingkungan Asri & Terjaga",
  modalPoin1Desc: "Kampus pesantren dikelilingi pepohonan sejuk, jauh dari kebisingan kota, serta terpisah mandiri antara komplek putra dan putri demi menjaga kekhusyukan muraja'ah santri.",
  modalPoin2Title: "👥 Halaqah Kecil (Rasio 1:8)",
  modalPoin2Desc: "Tiap satu Ustadz pembimbing membina maksimal 8 santri, menjamin setiap huruf yang disetorkan disimak dengan ketelitian penuh.",
  sambutanPengasuh: "Menghafal Al-Qur'an bukan perlombaan kecepatan, melainkan ikrar seumur hidup untuk membersamai firman Allah. Bacaan yang fashih dan hati yang ikhlas adalah sayap utama bagi seorang penghafal Al-Qur'an.",
  visiPesantren: "Menjadi pusat pendidikan tahfidzul Qur'an unggulan yang melahirkan para huffadz mutqin, faham kaidah ilmu syar'i, serta berkepribadian tangguh dan berakhlakul karimah.",
  misiPesantren: "Menyelenggarakan pembelajaran tilawah Al-Qur'an secara fasih dengan kaidah tajwid dan makharijul huruf yang kokoh (Program Binnadzor).\nMembimbing santri menghafal Al-Qur'an 30 Juz secara mutqin dengan metode ziyadah dan muraja'ah intensif (Program Tahfidz).\nMenanamkan panca jiwa pesantren: keikhlasan, kesederhanaan, kemandirian, ukhuwah Islamiyah, dan kebebasan berfikir yang bertanggung jawab.\nMembekali santri dengan kajian kitab kuning (fiqih ibadah, aqidah, akhlaq, dan bahasa Arab).",
  descBinnadzor: "Jenjang awal wajib bagi santri baru. Dikelompokkan ke dalam Kelas A, B, C, D, E (dengan rombel A1, A2, B1, B2... dst.) dan dibina langsung oleh Ustadz pengampu tiap kelas.",
  descMaqbul: "Jembatan akselerasi pra-tahfidz. Setiap 3 bulan sekali diadakan Tes Maqbul untuk menguji ketuntasan bacaan dan hafalan santri Binnadzor.",
  descTahfidz: "Dikhususkan bagi alumni wisuda Binnadzor. Tidak menggunakan jenjang kelas, melainkan langsung dibina per Halaqah Ustadz pembimbing.",
  descPascaTahfidz: "Dikhususkan bagi mahasantri yang telah khatam 30 Juz, memenuhi kualifikasi ketuntasan, dan resmi diwisuda Tahfidz. Tidak memakai jenjang kelas, melainkan dibina langsung per Ustadz Pengampu.",
  biayaFormulir: "Rp 150.000",
  biayaGedung: "Rp 2.500.000",
  biayaSeragam: "Rp 650.000",
  biayaKitab: "Rp 350.000",
  biayaBulanan: "Rp 750.000",
  linkBrosurCustom: ""
};

function renderWebManager() {
  renderWebArticlesTable();
  renderWebContentForm();
  renderWebFacilitiesAdmin();
  renderAdminFormalSchools();
  renderWebEkstrakurikulerAdmin();
}

function getStoredArticles() {
  try {
    const raw = localStorage.getItem('pondok_articles_data');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

function saveStoredArticles(articles) {
  localStorage.setItem('pondok_articles_data', JSON.stringify(articles));
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
}

function renderWebArticlesTable() {
  const tbody = document.getElementById('tableWebArticlesAdmin');
  if (!tbody) return;

  const articles = getStoredArticles();
  if (articles.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:#64748b;">Belum ada artikel yang dipublikasikan.</td></tr>`;
    return;
  }

  tbody.innerHTML = articles.map(art => `
    <tr>
      <td>
        <img src="${art.image || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80'}" alt="Cover" style="width:50px; height:40px; object-fit:cover; border-radius:6px;">
      </td>
      <td><strong>${escapeHtml(art.title)}</strong></td>
      <td><span class="badge" style="background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:12px; font-size:11px;">${escapeHtml(art.category)}</span></td>
      <td>${escapeHtml(art.author || 'Admin')}</td>
      <td>${formatTanggalIndo(art.date)}</td>
      <td style="max-width:240px; font-size:12px; color:#64748b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(art.snippet || '')}</td>
      <td style="text-align:center;">
        <button class="btn btn-secondary btn-sm" style="color:#dc2626; padding:4px 8px; font-size:11px;" onclick="hapusArtikelAdmin('${art.id}')" title="Hapus Artikel">
          🗑️ Hapus
        </button>
      </td>
    </tr>
  `).join('');
}

function openModalAdminAddArticle() {
  const form = document.getElementById('formAdminAddArticle');
  if (form) form.reset();
  const dateEl = document.getElementById('adminArticleDate');
  if (dateEl) dateEl.value = new Date().toISOString().split('T')[0];
  const prev = document.getElementById('adminArticleImgPreview');
  if (prev) { prev.style.display = 'none'; prev.src = ''; }
  const b64 = document.getElementById('adminArticleImgBase64');
  if (b64) b64.value = '';

  const modal = document.getElementById('modalAdminAddArticle');
  if (modal) modal.classList.add('active');
}

function closeModalAdminAddArticle() {
  const modal = document.getElementById('modalAdminAddArticle');
  if (modal) modal.classList.remove('active');
}

function previewAdminArticleImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    if (typeof window.openImageCropper === 'function') {
      window.openImageCropper({
        imageSrc: e.target.result,
        aspectRatio: '16:9',
        title: 'Sesuaikan & Potong Foto Berita / Artikel (16:9)',
        onSave: function(croppedBase64) {
          const b64 = document.getElementById('adminArticleImgBase64');
          if (b64) b64.value = croppedBase64;
          const preview = document.getElementById('adminArticleImgPreview');
          if (preview) {
            preview.src = croppedBase64;
            preview.style.display = 'block';
          }
        }
      });
    } else {
      const base64 = e.target.result;
      const b64 = document.getElementById('adminArticleImgBase64');
      if (b64) b64.value = base64;
      const preview = document.getElementById('adminArticleImgPreview');
      if (preview) {
        preview.src = base64;
        preview.style.display = 'block';
      }
    }
    event.target.value = '';
  };
  reader.readAsDataURL(file);
}

function submitAdminNewArticle(e) {
  e.preventDefault();

  const title = (document.getElementById('adminArticleTitle')?.value || '').trim();
  const category = document.getElementById('adminArticleCategory')?.value || 'Berita Pondok';
  const author = (document.getElementById('adminArticleAuthor')?.value || '').trim() || 'Admin Pondok';
  const date = document.getElementById('adminArticleDate')?.value || new Date().toISOString().split('T')[0];
  const snippet = (document.getElementById('adminArticleSnippet')?.value || '').trim();
  const content = (document.getElementById('adminArticleContent')?.value || '').trim();
  const image = document.getElementById('adminArticleImgBase64')?.value || 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80';

  if (!title) {
    showToast("Judul artikel wajib diisi!", "error");
    return;
  }

  const newArt = {
    id: "ART-" + Date.now(),
    title: title,
    category: category,
    author: author,
    date: date,
    snippet: snippet,
    content: content,
    image: image
  };

  const articles = getStoredArticles();
  articles.unshift(newArt);
  saveStoredArticles(articles);

  closeModalAdminAddArticle();
  renderWebArticlesTable();
  showToast("Artikel berhasil dipublikasikan ke website!", "success");
}

function hapusArtikelAdmin(id) {
  if (!confirm("Apakah Anda yakin ingin menghapus artikel ini dari website?")) return;
  let articles = getStoredArticles();
  articles = articles.filter(a => a.id !== id);
  saveStoredArticles(articles);
  renderWebArticlesTable();
  showToast("Artikel berhasil dihapus.", "info");
}

function getStoredWebContent() {
  try {
    const raw = localStorage.getItem('sitahfidz_website_content');
    if (raw) {
      return { ...DEFAULT_WEB_CONTENT, ...JSON.parse(raw) };
    }
  } catch (e) {}
  return { ...DEFAULT_WEB_CONTENT };
}

// ========================================================
// 9.0 PENGELOLAAN KARTU PROFIL & FOTO KAMPUS PESANTREN
// ========================================================

let tempFotoProfilPesantren = null;

function handleUploadFotoProfilPesantren(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    if (typeof openImageCropper === 'function') {
      openImageCropper({
        imageSrc: e.target.result,
        title: "Sesuaikan Foto Kartu Profil Pesantren (16:9)",
        aspectRatio: '16:9',
        defaultRatio: '16:9',
        onSave: function(croppedBase64) {
          applyCroppedFotoProfilPesantren(croppedBase64);
        }
      });
    } else {
      applyCroppedFotoProfilPesantren(e.target.result);
    }
  };
  reader.readAsDataURL(file);
}

function applyCroppedFotoProfilPesantren(base64) {
  tempFotoProfilPesantren = base64;
  updateFotoProfilPesantrenPreview(base64);

  // Auto-update ke stored content agar langsung tersimpan aman
  const content = getStoredWebContent();
  content.fotoProfilPesantren = base64;
  localStorage.setItem('sitahfidz_website_content', JSON.stringify(content));
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
  showToast("✓ Foto profil kampus pesantren berhasil diperbarui & disimpan!", "success");
}

function hapusFotoProfilPesantren() {
  if (!confirm("Hapus foto kustom dan gunakan foto standar bawaan sistem?")) return;
  tempFotoProfilPesantren = "";
  updateFotoProfilPesantrenPreview("");

  const content = getStoredWebContent();
  content.fotoProfilPesantren = "";
  localStorage.setItem('sitahfidz_website_content', JSON.stringify(content));
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
  showToast("Foto profil dikembalikan ke foto standar bawaan.", "info");
}

function updateFotoProfilPesantrenPreview(src) {
  const previewImg = document.getElementById('previewFotoProfilPesantren');
  const badge = document.getElementById('badgeFotoProfilPesantren');
  const btnHapus = document.getElementById('btnHapusFotoProfilPesantren');
  const fallback = "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=80";

  if (previewImg) {
    previewImg.src = src || fallback;
  }
  if (badge) {
    if (src) {
      badge.innerHTML = '<span style="color:#16a34a; font-weight:700;">✓ Foto Kustom Tersimpan</span>';
    } else {
      badge.innerHTML = '<span style="color:#64748b;">Foto Standar Bawaan</span>';
    }
  }
  if (btnHapus) {
    btnHapus.style.display = src ? 'inline-flex' : 'none';
  }
}

function focusSectionProfil() {
  setTimeout(() => {
    const el = document.getElementById('sectionEditKartuProfilPesantren');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.style.transition = 'box-shadow 0.4s ease';
      el.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.4)';
      setTimeout(() => { el.style.boxShadow = ''; }, 2000);
    }
  }, 150);
}

function renderWebContentForm() {
  const content = getStoredWebContent();

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };

  // Preview Foto Profil Pesantren
  tempFotoProfilPesantren = content.fotoProfilPesantren || "";
  updateFotoProfilPesantrenPreview(tempFotoProfilPesantren);

  setVal('editWebHeroBismillah', content.heroBismillah || 'Selamat Datang di Website Resmi');
  setVal('editWebHeroTitleName', content.heroTitleName || 'ASRAMA TAHFIDZ SUNAN BONANG');
  setVal('editWebHeroYayasan', content.heroTitleYayasan || content.heroTitlePrefix || "Yayasan PP. Mamba'ul Ma'arif");
  setVal('editWebHeroLocation', content.heroTitleLocation || 'Denanyar Jombang');
  setVal('editWebHeroLogoPos', content.heroLogoPos || 'left');
  setVal('editWebHeroTitlePrefix', content.heroTitleYayasan || content.heroTitlePrefix || "Yayasan PP. Mamba'ul Ma'arif");
  setVal('editWebHeroSubtitle', content.heroSubtitle);

  // Kartu Profil Pesantren (Kartu Sebelah Kiri di Menu Profil)
  setVal('editWebJudulProfil', content.judulProfil || "Profil Pondok Pesantren Tahfidzul Qur'an");
  setVal('editWebDescProfil', content.descProfil || "Didirikan untuk menjaga kemurnian bacaan Al-Qur'an secara talaqqi musyafahah dengan sanad muttashil. Memadukan kedalaman kajian kitab kuning para ulama salaf dengan akselerasi hafalan 30 juz berdisiplin tinggi, melahirkan generasi Qur'ani yang tangguh, berakhlak mulia, dan berjiwa ikhlas.");
  setVal('editWebModalJudulProfil', content.modalJudulProfil || "Tradisi Menjaga Al-Qur'an dengan Sanad Shahih");
  setVal('editWebModalDescProfil', content.modalDescProfil || "Pondok Pesantren Tahfidz Al-Qur'an Al-Barokah didirikan dengan niat ikhlas meneruskan amanah para Masyaikh dalam menjaga kemurnian bacaan Al-Qur'anul Karim. Kami meyakini bahwa menghafal Al-Qur'an tidak sekadar menghafal teks lafadz, melainkan mengambil bacaan secara talaqqi musyafahah (berhadap-hadapan langsung dari lisan guru ke murid) dengan sanad yang muttashil bersambung hingga baginda Rasulullah SAW.");
  setVal('editWebModalPoin1Title', content.modalPoin1Title || "🌿 Lingkungan Asri & Terjaga");
  setVal('editWebModalPoin1Desc', content.modalPoin1Desc || "Kampus pesantren dikelilingi pepohonan sejuk, jauh dari kebisingan kota, serta terpisah mandiri antara komplek putra dan putri demi menjaga kekhusyukan muraja'ah santri.");
  setVal('editWebModalPoin2Title', content.modalPoin2Title || "👥 Halaqah Kecil (Rasio 1:8)");
  setVal('editWebModalPoin2Desc', content.modalPoin2Desc || "Tiap satu Ustadz pembimbing membina maksimal 8 santri, menjamin setiap huruf yang disetorkan disimak dengan ketelitian penuh.");

  setVal('editWebSambutan', content.sambutanPengasuh);
  setVal('editWebVisi', content.visiPesantren);
  setVal('editWebMisi', content.misiPesantren);
  setVal('editWebDescBinnadzor', content.descBinnadzor);
  setVal('editWebDescMaqbul', content.descMaqbul);
  setVal('editWebDescTahfidz', content.descTahfidz);
  setVal('editWebDescPasca', content.descPascaTahfidz);
  setVal('editWebLinkBrosurCustom', content.linkBrosurCustom || '');

  // Render info biaya & rekening dinamis
  renderAdminBiayaList();
  renderAdminRekeningList();
}

function simpanKontenWebsiteAdmin() {
  const getVal = (id) => document.getElementById(id)?.value?.trim() || '';

  // Simpan input komponen biaya & rekening dinamis terlebih dahulu
  syncBiayaInputsToArray();
  syncRekeningInputsToArray();

  const biayaList = getStoredBiayaAdmin();
  const rekeningList = getStoredRekeningAdmin();
  const currentContent = getStoredWebContent();

  const newContent = {
    heroBismillah: getVal('editWebHeroBismillah') || 'Selamat Datang di Website Resmi',
    heroTitleName: getVal('editWebHeroTitleName') || 'ASRAMA TAHFIDZ SUNAN BONANG',
    heroTitleYayasan: getVal('editWebHeroYayasan') || "Yayasan PP. Mamba'ul Ma'arif",
    heroTitleLocation: getVal('editWebHeroLocation') || 'Denanyar Jombang',
    heroLogoPos: getVal('editWebHeroLogoPos') || 'left',
    heroTitlePrefix: getVal('editWebHeroYayasan') || getVal('editWebHeroTitlePrefix') || "Yayasan PP. Mamba'ul Ma'arif",
    heroSubtitle: getVal('editWebHeroSubtitle'),

    // Kartu Profil Pesantren (Sebelah Kiri)
    fotoProfilPesantren: (tempFotoProfilPesantren !== null) ? tempFotoProfilPesantren : (currentContent.fotoProfilPesantren || ""),
    judulProfil: getVal('editWebJudulProfil') || "Profil Pondok Pesantren Tahfidzul Qur'an",
    descProfil: getVal('editWebDescProfil') || "Didirikan untuk menjaga kemurnian bacaan Al-Qur'an secara talaqqi musyafahah dengan sanad muttashil. Memadukan kedalaman kajian kitab kuning para ulama salaf dengan akselerasi hafalan 30 juz berdisiplin tinggi, melahirkan generasi Qur'ani yang tangguh, berakhlak mulia, dan berjiwa ikhlas.",
    modalJudulProfil: getVal('editWebModalJudulProfil') || "Tradisi Menjaga Al-Qur'an dengan Sanad Shahih",
    modalDescProfil: getVal('editWebModalDescProfil') || "",
    modalPoin1Title: getVal('editWebModalPoin1Title') || "🌿 Lingkungan Asri & Terjaga",
    modalPoin1Desc: getVal('editWebModalPoin1Desc') || "",
    modalPoin2Title: getVal('editWebModalPoin2Title') || "👥 Halaqah Kecil (Rasio 1:8)",
    modalPoin2Desc: getVal('editWebModalPoin2Desc') || "",

    sambutanPengasuh: getVal('editWebSambutan'),
    visiPesantren: getVal('editWebVisi'),
    misiPesantren: getVal('editWebMisi'),
    descBinnadzor: getVal('editWebDescBinnadzor'),
    descMaqbul: getVal('editWebDescMaqbul'),
    descTahfidz: getVal('editWebDescTahfidz'),
    descPascaTahfidz: getVal('editWebDescPasca'),
    linkBrosurCustom: getVal('editWebLinkBrosurCustom'),
    biayaList: biayaList,
    rekeningList: rekeningList,
    biayaFormulir: biayaList[0]?.nominal || 'Rp 150.000',
    biayaGedung: biayaList[1]?.nominal || 'Rp 2.500.000',
    biayaSeragam: biayaList[2]?.nominal || 'Rp 650.000',
    biayaKitab: biayaList[3]?.nominal || 'Rp 350.000',
    biayaBulanan: biayaList[4]?.nominal || 'Rp 750.000'
  };

  localStorage.setItem('sitahfidz_website_content', JSON.stringify(newContent));
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
  showToast("✓ Seluruh konten website, info profil & foto berhasil disimpan!", "success");
}

function resetKontenWebsiteAdmin() {
  if (!confirm("Kembalikan seluruh teks narasi Beranda, Profil & Program ke standar awal?")) return;
  tempFotoProfilPesantren = "";
  localStorage.setItem('sitahfidz_website_content', JSON.stringify(DEFAULT_WEB_CONTENT));
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
  renderWebContentForm();
  showToast("Teks konten website dikembalikan ke standar awal.", "info");
}

// ========================================================
// 9.A. PENGELOLAAN KOMPONEN BIAYA & REKENING PEMBAYARAN
// ========================================================

function getStoredBiayaAdmin() {
  try {
    const raw = localStorage.getItem('sitahfidz_web_biaya');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}

  try {
    const rawContent = localStorage.getItem('sitahfidz_website_content');
    if (rawContent) {
      const c = JSON.parse(rawContent);
      if (c && c.biayaList && Array.isArray(c.biayaList) && c.biayaList.length > 0) {
        return c.biayaList;
      }
      if (c && (c.biayaFormulir || c.biayaGedung || c.biayaSeragam || c.biayaKitab || c.biayaBulanan)) {
        const list = (typeof DEFAULT_BIAYA_PEMBAYARAN !== 'undefined')
          ? JSON.parse(JSON.stringify(DEFAULT_BIAYA_PEMBAYARAN))
          : [];
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

  if (typeof DEFAULT_BIAYA_PEMBAYARAN !== 'undefined') {
    return JSON.parse(JSON.stringify(DEFAULT_BIAYA_PEMBAYARAN));
  }
  return [];
}

function saveStoredBiayaAdmin(list, forceCloud = false) {
  localStorage.setItem('sitahfidz_web_biaya', JSON.stringify(list));
  try {
    const raw = localStorage.getItem('sitahfidz_website_content');
    const content = raw ? JSON.parse(raw) : {};
    content.biayaList = list;
    if (list[0]) content.biayaFormulir = list[0].nominal;
    if (list[1]) content.biayaGedung = list[1].nominal;
    if (list[2]) content.biayaSeragam = list[2].nominal;
    if (list[3]) content.biayaKitab = list[3].nominal;
    if (list[4]) content.biayaBulanan = list[4].nominal;
    localStorage.setItem('sitahfidz_website_content', JSON.stringify(content));
  } catch (e) {}
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(forceCloud);
}

function renderAdminBiayaList() {
  const container = document.getElementById('adminBiayaList');
  if (!container) return;

  const list = getStoredBiayaAdmin();

  if (list.length === 0) {
    container.innerHTML = `
      <div style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:8px; padding:16px; text-align:center; color:#64748b; font-size:12px;">
        Belum ada komponen biaya. Klik tombol "➕ Tambah Komponen Biaya Baru" di bawah untuk menambahkan.
      </div>
    `;
    updateAdminBiayaTotalSummary(list);
    return;
  }

  container.innerHTML = list.map((item, idx) => `
    <div class="biaya-row-card" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:10px; padding:12px 14px; box-shadow:0 1px 3px rgba(0,0,0,0.04); display:grid; grid-template-columns: 1fr 180px 1fr auto; gap:10px; align-items:center;">
      <div>
        <label style="font-size:11px; font-weight:700; color:#334155; margin-bottom:3px; display:block;">Nama Komponen Biaya #${idx + 1}</label>
        <input type="text" id="adminBiayaNama_${idx}" class="form-control" style="font-size:12.5px; font-weight:700;" value="${escapeHtml(item.nama || '')}" placeholder="Contoh: Infaq Formulir & Seleksi" oninput="syncBiayaInputsToArray()">
      </div>
      <div>
        <label style="font-size:11px; font-weight:700; color:#334155; margin-bottom:3px; display:block;">Nominal (Rp)</label>
        <input type="text" id="adminBiayaNominal_${idx}" class="form-control" style="font-size:12.5px; font-weight:800; color:#047857;" value="${escapeHtml(item.nominal || '')}" placeholder="Contoh: Rp 150.000" oninput="syncBiayaInputsToArray()">
      </div>
      <div>
        <label style="font-size:11px; font-weight:700; color:#334155; margin-bottom:3px; display:flex; justify-content:space-between;">
          <span>Keterangan Singkat</span>
          <label style="font-size:10.5px; color:#15803d; cursor:pointer; display:inline-flex; align-items:center; gap:3px;">
            <input type="checkbox" id="adminBiayaIsBulanan_${idx}" ${item.isBulanan ? 'checked' : ''} style="cursor:pointer;" onchange="syncBiayaInputsToArray()">
            <span>Iuran Bulanan</span>
          </label>
        </label>
        <input type="text" id="adminBiayaKet_${idx}" class="form-control" style="font-size:12px;" value="${escapeHtml(item.keterangan || '')}" placeholder="Contoh: Dibayar 1 kali saat tes" oninput="syncBiayaInputsToArray()">
      </div>
      <div style="padding-top:16px;">
        <button type="button" class="btn btn-secondary btn-sm" onclick="hapusBiayaItem(${idx})" style="color:#dc2626; border-color:#fca5a5; background:#fff; padding:6px 10px;" title="Hapus komponen biaya ini">
          🗑️
        </button>
      </div>
    </div>
  `).join('');

  updateAdminBiayaTotalSummary(list);
}

function updateAdminBiayaTotalSummary(list) {
  const totalNominalEl = document.getElementById('adminBiayaTotalNominal');
  const totalSubEl = document.getElementById('adminBiayaTotalSub');
  const totalDetailEl = document.getElementById('adminBiayaTotalDetail');
  if (!totalNominalEl) return;

  const items = list || getStoredBiayaAdmin();
  let totalSemua = 0;
  let totalSekaliBayar = 0;
  let totalBulanan = 0;

  items.forEach(item => {
    const isBulanan = item.isBulanan || /bulan|\/bln/i.test(item.nama) || /bulan|\/bln/i.test(item.nominal);
    const nominalDigits = (item.nominal || '').replace(/[^\d]/g, '');
    const nominalNum = parseInt(nominalDigits, 10) || 0;
    totalSemua += nominalNum;
    if (isBulanan) {
      totalBulanan += nominalNum;
    } else {
      totalSekaliBayar += nominalNum;
    }
  });

  const formatRupiah = (num) => 'Rp ' + num.toLocaleString('id-ID');

  if (totalBulanan > 0 && totalSekaliBayar > 0) {
    totalNominalEl.textContent = formatRupiah(totalSemua);
    if (totalSubEl) totalSubEl.textContent = 'Biaya Masuk Pondok Sekali Bayar + Syahriah Bulan Pertama';
    if (totalDetailEl) totalDetailEl.textContent = `(Biaya Masuk Pondok: ${formatRupiah(totalSekaliBayar)} + Syahriah: ${formatRupiah(totalBulanan)}/bln)`;
  } else if (totalBulanan > 0 && totalSekaliBayar === 0) {
    totalNominalEl.innerHTML = `${formatRupiah(totalBulanan)}<span style="font-size:12px; font-weight:normal;">/bln</span>`;
    if (totalSubEl) totalSubEl.textContent = 'Total Iuran Syahriah Bulanan Santri Pondok';
    if (totalDetailEl) totalDetailEl.textContent = 'Iuran rutin bulanan asrama, makan & tahfidz';
  } else {
    totalNominalEl.textContent = formatRupiah(totalSemua);
    if (totalSubEl) totalSubEl.textContent = 'Total Biaya Pendaftaran & Sarana Pondok';
    if (totalDetailEl) totalDetailEl.textContent = 'Total biaya masuk awal santri baru pondok';
  }
}

function tambahBiayaAdmin() {
  syncBiayaInputsToArray();

  const list = getStoredBiayaAdmin();
  const nextNum = list.length + 1;
  list.push({
    id: `biaya-${Date.now()}`,
    nama: `${nextNum}. Komponen Biaya Baru`,
    nominal: 'Rp 100.000',
    keterangan: 'Keterangan pembayaran',
    isBulanan: false
  });
  saveStoredBiayaAdmin(list, true);
  renderAdminBiayaList();
  showToast("✓ Komponen biaya baru berhasil ditambahkan!", "success");

  setTimeout(() => {
    const el = document.getElementById(`adminBiayaNama_${list.length - 1}`);
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
}

function hapusBiayaItem(index) {
  syncBiayaInputsToArray();
  const list = getStoredBiayaAdmin();
  if (!list[index]) return;
  const name = list[index].nama || `Komponen #${index+1}`;
  if (!confirm(`Hapus komponen "${name}" dari rincian biaya?`)) return;

  list.splice(index, 1);
  saveStoredBiayaAdmin(list, true);
  renderAdminBiayaList();
  showToast(`Komponen biaya "${name}" telah dihapus.`, "info");
}

function resetAdminBiayaList() {
  if (!confirm("Kembalikan daftar komponen biaya ke 5 standar bawaan pondok?")) return;
  const defaultList = (typeof DEFAULT_BIAYA_PEMBAYARAN !== 'undefined')
    ? JSON.parse(JSON.stringify(DEFAULT_BIAYA_PEMBAYARAN))
    : [];
  saveStoredBiayaAdmin(defaultList, true);
  renderAdminBiayaList();
  showToast("Komponen biaya dikembalikan ke standar awal.", "info");
}

function syncBiayaInputsToArray() {
  const list = getStoredBiayaAdmin();
  for (let i = 0; i < list.length; i++) {
    const namaEl = document.getElementById(`adminBiayaNama_${i}`);
    const nomEl = document.getElementById(`adminBiayaNominal_${i}`);
    const ketEl = document.getElementById(`adminBiayaKet_${i}`);
    const bulananEl = document.getElementById(`adminBiayaIsBulanan_${i}`);

    if (namaEl) list[i].nama = namaEl.value; // Tidak di-trim saat mengetik agar bisa spasi bebas
    if (nomEl) list[i].nominal = nomEl.value;
    if (ketEl) list[i].keterangan = ketEl.value;
    if (bulananEl) list[i].isBulanan = bulananEl.checked;
  }
  localStorage.setItem('sitahfidz_web_biaya', JSON.stringify(list));
  try {
    const raw = localStorage.getItem('sitahfidz_website_content');
    const content = raw ? JSON.parse(raw) : {};
    content.biayaList = list;
    if (list[0]) content.biayaFormulir = list[0].nominal;
    if (list[1]) content.biayaGedung = list[1].nominal;
    if (list[2]) content.biayaSeragam = list[2].nominal;
    if (list[3]) content.biayaKitab = list[3].nominal;
    if (list[4]) content.biayaBulanan = list[4].nominal;
    localStorage.setItem('sitahfidz_website_content', JSON.stringify(content));
  } catch (e) {}

  updateAdminBiayaTotalSummary(list);
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(false);
}

function simpanBiayaDanRekeningLangsung() {
  syncBiayaInputsToArray();
  syncRekeningInputsToArray();

  const biayaList = getStoredBiayaAdmin();
  const rekeningList = getStoredRekeningAdmin();
  const content = getStoredWebContent();

  content.biayaList = biayaList;
  content.rekeningList = rekeningList;
  if (biayaList[0]) content.biayaFormulir = biayaList[0].nominal;
  if (biayaList[1]) content.biayaGedung = biayaList[1].nominal;
  if (biayaList[2]) content.biayaSeragam = biayaList[2].nominal;
  if (biayaList[3]) content.biayaKitab = biayaList[3].nominal;
  if (biayaList[4]) content.biayaBulanan = biayaList[4].nominal;

  localStorage.setItem('sitahfidz_web_biaya', JSON.stringify(biayaList));
  localStorage.setItem('sitahfidz_web_rekening', JSON.stringify(rekeningList));
  localStorage.setItem('sitahfidz_website_content', JSON.stringify(content));

  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
  showToast("✓ Seluruh rincian biaya & rekening berhasil disimpan & disinkronkan ke Cloud!", "success");
}

function getStoredRekeningAdmin() {
  try {
    const raw = localStorage.getItem('sitahfidz_web_rekening');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}

  try {
    const rawContent = localStorage.getItem('sitahfidz_website_content');
    if (rawContent) {
      const c = JSON.parse(rawContent);
      if (c && c.rekeningList && Array.isArray(c.rekeningList)) {
        return c.rekeningList;
      }
    }
  } catch (e) {}

  if (typeof DEFAULT_REKENING_PEMBAYARAN !== 'undefined') {
    return JSON.parse(JSON.stringify(DEFAULT_REKENING_PEMBAYARAN));
  }
  return [];
}

function saveStoredRekeningAdmin(list) {
  localStorage.setItem('sitahfidz_web_rekening', JSON.stringify(list));
  try {
    const raw = localStorage.getItem('sitahfidz_website_content');
    const content = raw ? JSON.parse(raw) : {};
    content.rekeningList = list;
    localStorage.setItem('sitahfidz_website_content', JSON.stringify(content));
  } catch (e) {}
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
}

function renderAdminRekeningList() {
  const container = document.getElementById('adminRekeningList');
  if (!container) return;

  const list = getStoredRekeningAdmin();

  if (list.length === 0) {
    container.innerHTML = `
      <div style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:8px; padding:16px; text-align:center; color:#64748b; font-size:12px;">
        Belum ada data rekening pembayaran. Klik tombol "➕ Tambah Rekening Bank" untuk menambahkan.
      </div>
    `;
    return;
  }

  container.innerHTML = list.map((item, idx) => `
    <div class="rekening-row-card" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:10px; padding:14px; box-shadow:0 1px 3px rgba(0,0,0,0.04); display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)) auto; gap:10px; align-items:center;">
      <div>
        <label style="font-size:11px; font-weight:700; color:#334155; margin-bottom:3px; display:block;">Nama Bank / E-Wallet</label>
        <input type="text" id="adminRekBank_${idx}" class="form-control" style="font-size:12.5px; font-weight:700;" value="${escapeHtml(item.bank || '')}" placeholder="Contoh: Bank Syariah Indonesia (BSI)" oninput="syncRekeningInputsToArray()">
      </div>
      <div>
        <label style="font-size:11px; font-weight:700; color:#334155; margin-bottom:3px; display:block;">Nomor Rekening / VA</label>
        <input type="text" id="adminRekNomor_${idx}" class="form-control" style="font-size:13px; font-weight:800; font-family:monospace; color:#047857;" value="${escapeHtml(item.nomor || '')}" placeholder="Contoh: 7123456789" oninput="syncRekeningInputsToArray()">
      </div>
      <div>
        <label style="font-size:11px; font-weight:700; color:#334155; margin-bottom:3px; display:block;">Atas Nama (A/N)</label>
        <input type="text" id="adminRekAtasNama_${idx}" class="form-control" style="font-size:12px;" value="${escapeHtml(item.atasNama || '')}" placeholder="Contoh: PP Tahfidz Al-Barokah" oninput="syncRekeningInputsToArray()">
      </div>
      <div>
        <label style="font-size:11px; font-weight:700; color:#334155; margin-bottom:3px; display:block;">Peruntukan / Catatan</label>
        <input type="text" id="adminRekCatatan_${idx}" class="form-control" style="font-size:12px;" value="${escapeHtml(item.catatan || '')}" placeholder="Contoh: Biaya Pendaftaran & Infaq" oninput="syncRekeningInputsToArray()">
      </div>
      <div style="padding-top:16px;">
        <button type="button" class="btn btn-secondary btn-sm" onclick="hapusRekeningItem(${idx})" style="color:#dc2626; border-color:#fca5a5; background:#fff; padding:6px 10px;" title="Hapus rekening ini">
          🗑️
        </button>
      </div>
    </div>
  `).join('');
}

function tambahRekeningAdmin() {
  syncRekeningInputsToArray();
  const list = getStoredRekeningAdmin();
  list.push({
    id: `rek-${Date.now()}`,
    bank: 'Bank Syariah Indonesia (BSI)',
    nomor: '',
    atasNama: "PP Tahfidz Al-Qur'an Al-Barokah",
    catatan: 'Untuk Pembayaran PSB & Infaq'
  });
  saveStoredRekeningAdmin(list);
  renderAdminRekeningList();
  showToast("✓ Rekening baru berhasil ditambahkan!", "success");

  setTimeout(() => {
    const el = document.getElementById(`adminRekNomor_${list.length - 1}`);
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
}

function hapusRekeningItem(index) {
  syncRekeningInputsToArray();
  const list = getStoredRekeningAdmin();
  if (!list[index]) return;
  const bank = list[index].bank || `Rekening #${index+1}`;
  if (!confirm(`Hapus rekening "${bank}" dari daftar?`)) return;

  list.splice(index, 1);
  saveStoredRekeningAdmin(list);
  renderAdminRekeningList();
  showToast(`Rekening "${bank}" telah dihapus.`, "info");
}

function resetAdminRekeningList() {
  if (!confirm("Kembalikan daftar rekening pembayaran ke standar awal?")) return;
  const defaultList = (typeof DEFAULT_REKENING_PEMBAYARAN !== 'undefined')
    ? JSON.parse(JSON.stringify(DEFAULT_REKENING_PEMBAYARAN))
    : [];
  saveStoredRekeningAdmin(defaultList);
  renderAdminRekeningList();
  showToast("Daftar rekening dikembalikan ke standar awal.", "info");
}

function syncRekeningInputsToArray() {
  const list = getStoredRekeningAdmin();
  for (let i = 0; i < list.length; i++) {
    const bankEl = document.getElementById(`adminRekBank_${i}`);
    const noEl = document.getElementById(`adminRekNomor_${i}`);
    const anEl = document.getElementById(`adminRekAtasNama_${i}`);
    const catEl = document.getElementById(`adminRekCatatan_${i}`);

    if (bankEl) list[i].bank = bankEl.value; // Jangan di-trim agar bisa mengetik spasi
    if (noEl) list[i].nomor = noEl.value;
    if (anEl) list[i].atasNama = anEl.value;
    if (catEl) list[i].catatan = catEl.value;
  }
  localStorage.setItem('sitahfidz_web_rekening', JSON.stringify(list));
  try {
    const raw = localStorage.getItem('sitahfidz_website_content');
    const content = raw ? JSON.parse(raw) : {};
    content.rekeningList = list;
    localStorage.setItem('sitahfidz_website_content', JSON.stringify(content));
  } catch (e) {}
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(false);
}
// 9.B. FACILITY CMS CONTROLLER FOR ADMIN
// ========================================================

const DEFAULT_WEB_FACILITIES = [
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
      "Jadwal olahraga santri ba'da Ashar sore hari"
    ],
    schedule: "Kegiatan: Olahraga santri sore hari (16.30 - 17.30 WIB) dan senam santri Ahad pagi."
  }
];

function getFacilityFallbackSvg(index) {
  const colors = [
    ['#064e3b', '#047857', '#f59e0b', '🕌', 'MASJID JAMI PESANTREN'],
    ['#0f172a', '#1e293b', '#38bdf8', '🏢', 'ASRAMA NYAMAN & BERSIH'],
    ['#312e81', '#4338ca', '#a5b4fc', '📖', 'AULA HALAQAH BER-AC'],
    ['#78350f', '#92400e', '#fde047', '📚', 'PERPUSTAKAAN KITAB & MUSHAF'],
    ['#14532d', '#15803d', '#f97316', '🍽️', 'DAPUR & RUANG MAKAN'],
    ['#0e7490', '#0369a1', '#34d399', '⚽', 'SARANA OLAHRAGA']
  ];
  const item = colors[index % colors.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><defs><linearGradient id="gf_${index}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${item[0]}"/><stop offset="100%" stop-color="${item[1]}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#gf_${index})"/><circle cx="400" cy="180" r="90" fill="rgba(255,255,255,0.08)"/><circle cx="400" cy="180" r="70" fill="none" stroke="${item[2]}" stroke-width="2" opacity="0.5"/><text x="400" y="195" font-size="64" text-anchor="middle">${item[3]}</text><text x="400" y="260" font-family="system-ui, sans-serif" font-size="24" fill="#ffffff" font-weight="bold" text-anchor="middle">${item[4]}</text><text x="400" y="295" font-family="system-ui, sans-serif" font-size="14" fill="${item[2]}" font-weight="600" text-anchor="middle">Fasilitas Pesantren Tahfidz Al-Barokah</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function getStoredWebFacilities() {
  try {
    const raw = localStorage.getItem('sitahfidz_web_facilities');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULT_WEB_FACILITIES));
}

function renderWebFacilitiesAdmin() {
  const container = document.getElementById('adminFacilitiesList');
  if (!container) return;

  const facilities = getStoredWebFacilities();
  container.innerHTML = facilities.map((fac, idx) => {
    const specsText = Array.isArray(fac.specs) ? fac.specs.join('\n') : (fac.specs || '');
    return `
      <div class="facility-editor-card" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:12px; padding:18px; box-shadow:0 1px 4px rgba(0,0,0,0.04);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; padding-bottom:10px; border-bottom:1px solid #e2e8f0; flex-wrap:wrap; gap:8px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:24px; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:8px; width:40px; height:40px; display:inline-flex; align-items:center; justify-content:center;">${fac.icon || '🏢'}</span>
            <div>
              <strong style="font-size:14px; color:#0f172a;">${fac.id || `FAC-0${idx+1}`}: ${escapeHtml(fac.title)}</strong>
              <div style="font-size:11.5px; color:#64748b;">${escapeHtml(fac.badge || '')} &bull; Kapasitas: ${escapeHtml(fac.capacity || '-')}</div>
            </div>
          </div>
          <span class="badge" style="background:#e0e7ff; color:#3730a3; font-weight:700; font-size:11.5px; padding:4px 10px;">
            Fasilitas #${idx+1}
          </span>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:14px; margin-bottom:12px;">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:11.5px; font-weight:700;">Nama Fasilitas</label>
            <input type="text" id="fac_title_${idx}" class="form-control" value="${escapeHtml(fac.title || '')}" placeholder="Contoh: Masjid Jami' Pesantren">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:11.5px; font-weight:700;">Ikon / Emoticon</label>
            <input type="text" id="fac_icon_${idx}" class="form-control" value="${escapeHtml(fac.icon || '🏢')}" placeholder="Contoh: 🕌">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:11.5px; font-weight:700;">Badge / Label Singkat</label>
            <input type="text" id="fac_badge_${idx}" class="form-control" value="${escapeHtml(fac.badge || '')}" placeholder="Contoh: Pusat Ibadah & Tahfidz">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:11.5px; font-weight:700;">Kapasitas / Daya Tampung</label>
            <input type="text" id="fac_capacity_${idx}" class="form-control" value="${escapeHtml(fac.capacity || '')}" placeholder="Contoh: 500 Jamaah">
          </div>
        </div>

        <div class="form-group" style="margin-bottom:14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px 14px;">
          <label class="form-label" style="font-size:12px; font-weight:700; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
            <span style="display:flex; align-items:center; gap:6px;">
              <span>📸</span> <strong>Foto Sarana / Fasilitas</strong>
            </span>
            ${fac.image ? `<button type="button" onclick="hapusFotoFasilitas(${idx})" style="background:none; border:none; color:#ef4444; font-size:11.5px; font-weight:700; cursor:pointer;">🗑️ Hapus Foto</button>` : ''}
          </label>
          <div style="display:flex; gap:14px; align-items:center; flex-wrap:wrap;">
            <div style="position:relative; width:150px; height:90px; border-radius:8px; overflow:hidden; border:2px solid ${fac.image ? '#059669' : '#cbd5e1'}; background:#0f172a; flex-shrink:0; display:flex; align-items:center; justify-content:center;">
              <img id="fac_thumb_${idx}" src="${escapeHtml(fac.image || '')}" alt="Thumb" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null; this.src=getFacilityFallbackSvg(${idx});">
              ${fac.image ? '<span style="position:absolute; bottom:4px; right:4px; background:#059669; color:#fff; font-size:9.5px; font-weight:800; padding:1px 6px; border-radius:999px;">✓ Terpasang</span>' : ''}
            </div>
            <div style="flex:1; min-width:200px;">
              <input type="file" id="fac_file_${idx}" accept="image/*" style="display:none;" onchange="handleUploadFacilityPhoto(${idx}, event)">
              <input type="hidden" id="fac_img_${idx}" value="${escapeHtml(fac.image || '')}">
              <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('fac_file_${idx}').click()" style="font-size:12px; font-weight:700; padding:7px 14px; display:inline-flex; align-items:center; gap:6px;">
                <span>📷</span> ${fac.image ? 'Ganti / Sesuaikan Foto' : 'Pilih & Upload Foto Fasilitas'}
              </button>
              <p style="font-size:11px; color:#64748b; margin:6px 0 0 0;">
                ℹ️ Format JPG, PNG, atau WebP. Foto dipotong 16:9 atau bisa gunakan foto utuh tanpa crop.
              </p>
            </div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px; margin-bottom:12px;">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:11.5px; font-weight:700;">Ringkasan Singkat (Tampil di Kartu Depan)</label>
            <textarea id="fac_snippet_${idx}" class="form-control" rows="2" placeholder="Deskripsi ringkas 1-2 kalimat...">${escapeHtml(fac.snippet || '')}</textarea>
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:11.5px; font-weight:700;">Jadwal / Waktu Penggunaan</label>
            <textarea id="fac_schedule_${idx}" class="form-control" rows="2" placeholder="Contoh: Kegiatan: Shalat Fardhu 5 Waktu, Halaqah Ba'da Shubuh...">${escapeHtml(fac.schedule || '')}</textarea>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px;">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:11.5px; font-weight:700;">Deskripsi Lengkap (Tampil di Pop-up Modal Detail)</label>
            <textarea id="fac_fulldesc_${idx}" class="form-control" rows="4" placeholder="Penjelasan detail tentang sarana ini...">${escapeHtml(fac.fullDesc || '')}</textarea>
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:11.5px; font-weight:700;">Poin Spesifikasi / Keunggulan (Satu Poin per Baris)</label>
            <textarea id="fac_specs_${idx}" class="form-control" rows="4" placeholder="Kapasitas 500 Jamaah&#10;Full karpet empuk&#10;Sound system akustik jernih...">${escapeHtml(specsText)}</textarea>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function handleUploadFacilityPhoto(index, event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const facilities = getStoredWebFacilities();
    const facTitle = facilities[index] ? facilities[index].title : `Fasilitas #${index + 1}`;

    if (typeof openImageCropper === 'function') {
      openImageCropper({
        imageSrc: e.target.result,
        title: `Sesuaikan Foto Fasilitas: ${facTitle}`,
        aspectRatio: '16:9',
        defaultRatio: '16:9',
        format: 'image/jpeg',
        quality: 0.75,
        maxWidth: 960,
        maxHeight: 540,
        onSave: (croppedDataUrl) => {
          facilities[index].image = croppedDataUrl;
          localStorage.setItem('sitahfidz_web_facilities', JSON.stringify(facilities));
          if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
          renderWebFacilitiesAdmin();
          showToast(`✓ Foto untuk ${facTitle} berhasil diunggah!`, "success");
        }
      });
    } else {
      compressImageFile(file, 960, 540, 0.75, (compressedBase64) => {
        facilities[index].image = compressedBase64;
        localStorage.setItem('sitahfidz_web_facilities', JSON.stringify(facilities));
        if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
        renderWebFacilitiesAdmin();
        showToast(`✓ Foto untuk ${facTitle} berhasil diunggah!`, "success");
      });
    }
    event.target.value = '';
  };
  reader.readAsDataURL(file);
}

function hapusFotoFasilitas(index) {
  const facilities = getStoredWebFacilities();
  if (!facilities[index]) return;
  if (!confirm(`Hapus foto fasilitas ${facilities[index].title}? Tampilan akan kembali ke ilustrasi grafis standar.`)) return;

  facilities[index].image = '';
  localStorage.setItem('sitahfidz_web_facilities', JSON.stringify(facilities));
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
  renderWebFacilitiesAdmin();
  showToast(`Foto fasilitas ${facilities[index].title} telah dihapus.`, "info");
}

function updateFacThumbnailPreview(idx) {
  const input = document.getElementById(`fac_img_${idx}`);
  const thumb = document.getElementById(`fac_thumb_${idx}`);
  if (input && thumb) {
    thumb.src = input.value.trim() || '';
  }
}

function simpanWebFacilitiesAdmin() {
  const facilities = getStoredWebFacilities();
  for (let idx = 0; idx < facilities.length; idx++) {
    const getVal = (prefix) => document.getElementById(`${prefix}_${idx}`)?.value?.trim() || '';
    facilities[idx].title = getVal('fac_title') || facilities[idx].title;
    facilities[idx].icon = getVal('fac_icon') || facilities[idx].icon;
    facilities[idx].badge = getVal('fac_badge') || facilities[idx].badge;
    facilities[idx].capacity = getVal('fac_capacity') || facilities[idx].capacity;
    facilities[idx].image = getVal('fac_img') || facilities[idx].image;
    facilities[idx].snippet = getVal('fac_snippet') || facilities[idx].snippet;
    facilities[idx].fullDesc = getVal('fac_fulldesc') || facilities[idx].fullDesc;
    facilities[idx].schedule = getVal('fac_schedule') || facilities[idx].schedule;

    const specsRaw = getVal('fac_specs');
    if (specsRaw) {
      facilities[idx].specs = specsRaw.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    }
  }

  localStorage.setItem('sitahfidz_web_facilities', JSON.stringify(facilities));
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
  showToast("Seluruh 6 data fasilitas pondok berhasil disimpan dan tayang di website!", "success");
}

function resetWebFacilitiesAdmin() {
  if (!confirm("Kembalikan seluruh data 6 sarana & fasilitas pondok ke standar awal?")) return;
  localStorage.setItem('sitahfidz_web_facilities', JSON.stringify(DEFAULT_WEB_FACILITIES));
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
  renderWebFacilitiesAdmin();
  showToast("Sarana & fasilitas pondok dikembalikan ke standar awal.", "info");
}

// ========================================================
// 9D. KELOLA PILIHAN SEKOLAH FORMAL & UPLOAD BROSUR
// ========================================================

function stripAkreditasi(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/\s*[•\-–|]\s*Akreditasi\s*[A-C]?/gi, '')
    .replace(/terakreditasi\s*[A-C]?\s*unggul/gi, 'Unggulan')
    .replace(/terakreditasi\s*[A-C]?/gi, '')
    .replace(/Akreditasi\s*[A-C]?/gi, '')
    .trim();
}

function getStoredFormalSchools() {
  try {
    const raw = localStorage.getItem('sitahfidz_sekolah_formal');
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

function renderAdminFormalSchools() {
  const container = document.getElementById('adminFormalSchoolsContainer');
  if (!container) return;

  const schools = getStoredFormalSchools();

  if (schools.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding:40px; background:#fff; border-radius:12px; border:2px dashed #cbd5e1; color:#64748b;">
        <span style="font-size:36px;">🏫</span>
        <h4 style="margin:8px 0 4px 0; color:#334155;">Belum Ada Data Sekolah Formal</h4>
        <p style="font-size:12px; margin:0 0 14px 0;">Klik tombol di bawah untuk menambahkan lembaga sekolah mitra baru.</p>
        <button type="button" class="btn btn-gold btn-sm" onclick="tambahAdminFormalSchool()" style="font-weight:700;">
          ➕ Tambah Sekolah Baru
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = schools.map((sch, idx) => {
    const highlightsText = (sch.highlights || []).join('\n');
    const colorVal = sch.tagColor || '#059669';
    const hasBrosur = !!(sch.brosurImage && sch.brosurImage.trim() !== '');

    return `
      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:18px; box-shadow:0 4px 14px rgba(0,0,0,0.03); display:flex; flex-direction:column; gap:12px; transition:border-color 0.2s;" onfocusin="this.style.borderColor='#10b981'" onfocusout="this.style.borderColor='#e2e8f0'">
        
        <!-- School Card Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; padding-bottom:10px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:26px;">${escapeHtml(sch.icon || '🏫')}</span>
            <div>
              <h4 style="font-size:14.5px; font-weight:800; color:#0f172a; margin:0;">
                ${idx + 1}. ${escapeHtml(sch.name || 'Sekolah Formal')}
              </h4>
              <span style="font-size:11px; font-weight:700; color:#059669;">
                ${escapeHtml(sch.level || 'Tingkat Pendidikan')}
              </span>
            </div>
          </div>
          <div style="display:flex; gap:6px;">
            <button type="button" class="btn btn-primary btn-sm" onclick="simpanSingleAdminFormalSchool(${idx})" style="font-size:11.5px; padding:4px 10px; font-weight:700; display:inline-flex; align-items:center; gap:4px;" title="Simpan perubahan sekolah ini">
              <span>💾</span> Simpan
            </button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="hapusAdminFormalSchool(${idx})" style="font-size:11.5px; padding:4px 8px; color:#ef4444; border-color:#fca5a5;" title="Hapus sekolah ini">
              🗑️
            </button>
          </div>
        </div>

        <!-- Row 1: Nama Singkat & Jenjang -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:11px; font-weight:700; color:#475569;">Nama Singkat</label>
            <input type="text" id="sch_name_${idx}" class="form-control" style="font-size:12px; padding:6px 10px;" value="${escapeHtml(sch.name || '')}" placeholder="Contoh: MTsN 4 Denanyar">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:11px; font-weight:700; color:#475569;">Jenjang / Tingkat</label>
            <input type="text" id="sch_level_${idx}" class="form-control" style="font-size:12px; padding:6px 10px;" value="${escapeHtml(sch.level || '')}" placeholder="Contoh: MTs (Setara SMP)">
          </div>
        </div>

        <!-- Row 2: Ikon Emoji, Kategori Filter, Warna -->
        <div style="display:grid; grid-template-columns:1fr 1.3fr 1fr; gap:8px;">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:11px; font-weight:700; color:#475569;">Ikon Emoji</label>
            <input type="text" id="sch_icon_${idx}" class="form-control" style="font-size:12px; padding:6px 10px; text-align:center;" value="${escapeHtml(sch.icon || '🏫')}" placeholder="🏛️">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:11px; font-weight:700; color:#475569;">Kategori Tab</label>
            <select id="sch_category_${idx}" class="form-control" style="font-size:11.5px; padding:6px 8px;">
              <option value="mts_smp" ${sch.category === 'mts_smp' ? 'selected' : ''}>MTs / SMP (Menengah)</option>
              <option value="ma_smk" ${sch.category === 'ma_smk' ? 'selected' : ''}>MA / SMA / SMK (Lanjutan)</option>
            </select>
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:11px; font-weight:700; color:#475569;">Warna Tema</label>
            <input type="color" id="sch_color_${idx}" class="form-control" style="height:33px; padding:2px; cursor:pointer;" value="${colorVal}">
          </div>
        </div>

        <!-- Row 3: Nama Lengkap Resmi -->
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label" style="font-size:11px; font-weight:700; color:#475569;">Nama Lengkap Resmi Lembaga</label>
          <input type="text" id="sch_fullname_${idx}" class="form-control" style="font-size:12px; padding:6px 10px;" value="${escapeHtml(sch.fullName || sch.name || '')}" placeholder="Contoh: Madrasah Tsanawiyah Negeri 4 Jombang">
        </div>

        <!-- Row 4: Deskripsi & Profil -->
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label" style="font-size:11px; font-weight:700; color:#475569;">Deskripsi &amp; Profil Singkat</label>
          <textarea id="sch_desc_${idx}" class="form-control" rows="2" style="font-size:11.5px; padding:6px 10px; line-height:1.4;" placeholder="Gambaran kurikulum, pembelajaran, dan integrasi dengan pesantren...">${escapeHtml(sch.desc || '')}</textarea>
        </div>

        <!-- Row 5: Poin Keunggulan -->
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label" style="font-size:11px; font-weight:700; color:#475569;">Poin Keunggulan (Satu per baris)</label>
          <textarea id="sch_highlights_${idx}" class="form-control" rows="3" style="font-size:11.5px; padding:6px 10px; line-height:1.4;" placeholder="Program Peminatan Sains & Riset&#10;Pendalaman Kitab Kuning&#10;Laboratorium Komputer & Bahasa">${escapeHtml(highlightsText)}</textarea>
        </div>

        <!-- Row 6: Syarat & Kontak -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:11px; font-weight:700; color:#475569;">Syarat Pendaftaran PPDB</label>
            <input type="text" id="sch_syarat_${idx}" class="form-control" style="font-size:11.5px; padding:6px 10px;" value="${escapeHtml(sch.syarat || '')}" placeholder="FC Ijazah, KK, Akta, Pas Foto 3x4">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:11px; font-weight:700; color:#475569;">No. WhatsApp PPDB / Kontak</label>
            <input type="text" id="sch_kontak_${idx}" class="form-control" style="font-size:11.5px; padding:6px 10px;" value="${escapeHtml(sch.kontak || '')}" placeholder="Contoh: 0812-3456-7890">
          </div>
        </div>

        <!-- Row 7: Upload Brosur Resmi Sekolah -->
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px; margin-top:2px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <label style="font-size:11.5px; font-weight:700; color:#1e293b; margin:0; display:flex; align-items:center; gap:6px;">
              <span>📄</span> Brosur Resmi Lembaga
            </label>
            ${hasBrosur ? `
              <span style="font-size:10.5px; background:#ecfdf5; color:#047857; font-weight:700; padding:2px 8px; border-radius:999px; border:1px solid #a7f3d0;">
                ✓ Brosur Siap &amp; Aktif
              </span>
            ` : `
              <span style="font-size:10.5px; background:#f1f5f9; color:#64748b; font-weight:600; padding:2px 8px; border-radius:999px;">
                Belum ada brosur
              </span>
            `}
          </div>

          ${hasBrosur ? `
            <div style="display:flex; gap:12px; align-items:center; background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:10px;">
              <img src="${sch.brosurImage}" alt="Brosur ${escapeHtml(sch.name)}" style="width:68px; height:92px; object-fit:cover; border-radius:6px; border:1px solid #e2e8f0; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.06);" onclick="zoomBrosurSekolah('${sch.brosurImage}', '${escapeHtml(sch.name)}')" title="Klik untuk memperbesar brosur">
              <div style="flex:1; display:flex; flex-direction:column; gap:6px;">
                <p style="font-size:11.5px; color:#334155; margin:0; line-height:1.4;">
                  Brosur resmi aktif dan otomatis tampil di website &amp; modal rincian calon wali santri.
                </p>
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                  <button type="button" class="btn btn-gold btn-sm" onclick="zoomBrosurSekolah('${sch.brosurImage}', '${escapeHtml(sch.name)}')" style="font-size:11px; padding:3px 8px; font-weight:700; display:inline-flex; align-items:center; gap:4px;">
                    <span>🔍</span> Lihat
                  </button>
                  <label class="btn btn-secondary btn-sm" style="font-size:11px; padding:3px 8px; cursor:pointer; font-weight:600; display:inline-flex; align-items:center; gap:4px; margin:0;">
                    <span>🔄</span> Ganti Brosur
                    <input type="file" accept="image/*" style="display:none;" onchange="handleUploadBrosurSekolah(${idx}, event)">
                  </label>
                  <button type="button" class="btn btn-secondary btn-sm" onclick="hapusBrosurSekolah(${idx})" style="font-size:11px; padding:3px 8px; color:#ef4444; border-color:#fca5a5; font-weight:600; display:inline-flex; align-items:center; gap:4px;">
                    <span>🗑️</span> Hapus
                  </button>
                </div>
              </div>
            </div>
          ` : `
            <div style="border:1.5px dashed #cbd5e1; border-radius:8px; padding:14px; text-align:center; background:#ffffff;">
              <p style="font-size:11.5px; color:#64748b; margin:0 0 8px 0;">
                Unggah gambar brosur / pamflet resmi PPDB sekolah mitra (${escapeHtml(sch.name)}).
              </p>
              <label class="btn btn-primary btn-sm" style="font-size:11.5px; padding:6px 14px; cursor:pointer; font-weight:700; display:inline-flex; align-items:center; gap:6px; margin:0;">
                <span>📤</span> Upload Brosur Sekolah
                <input type="file" accept="image/*" style="display:none;" onchange="handleUploadBrosurSekolah(${idx}, event)">
              </label>
            </div>
          `}
        </div>

      </div>
    `;
  }).join('');
}

function readSchoolFormData(idx, schools) {
  const sch = schools[idx];
  if (!sch) return;

  const nameEl = document.getElementById(`sch_name_${idx}`);
  const levelEl = document.getElementById(`sch_level_${idx}`);
  const iconEl = document.getElementById(`sch_icon_${idx}`);
  const categoryEl = document.getElementById(`sch_category_${idx}`);
  const colorEl = document.getElementById(`sch_color_${idx}`);
  const fullNameEl = document.getElementById(`sch_fullname_${idx}`);
  const descEl = document.getElementById(`sch_desc_${idx}`);
  const hlEl = document.getElementById(`sch_highlights_${idx}`);
  const syaratEl = document.getElementById(`sch_syarat_${idx}`);
  const kontakEl = document.getElementById(`sch_kontak_${idx}`);

  if (nameEl && nameEl.value.trim()) sch.name = nameEl.value.trim();
  if (levelEl && levelEl.value.trim()) sch.level = levelEl.value.trim();
  if (iconEl && iconEl.value.trim()) sch.icon = iconEl.value.trim();
  if (categoryEl) sch.category = categoryEl.value || sch.category || 'mts_smp';
  if (colorEl) {
    sch.tagColor = colorEl.value || sch.tagColor || '#059669';
    sch.gradient = `linear-gradient(135deg, ${sch.tagColor} 0%, #047857 100%)`;
  }
  if (fullNameEl && fullNameEl.value.trim()) sch.fullName = fullNameEl.value.trim();
  if (descEl) sch.desc = descEl.value.trim();
  if (syaratEl) sch.syarat = syaratEl.value.trim();
  if (kontakEl) sch.kontak = kontakEl.value.trim();
  if (hlEl) {
    sch.highlights = hlEl.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  }
  sch.image = '';
  sch.brosurImage = sch.brosurImage || '';
}

function simpanSingleAdminFormalSchool(index) {
  const schools = getStoredFormalSchools();
  if (!schools[index]) return;
  readSchoolFormData(index, schools);

  localStorage.setItem('sitahfidz_sekolah_formal', JSON.stringify(schools));
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
  renderAdminFormalSchools();
  showToast(`✓ Informasi "${schools[index].name}" berhasil disimpan!`, "success");
}

function simpanAdminFormalSchools() {
  const schools = getStoredFormalSchools();
  for (let idx = 0; idx < schools.length; idx++) {
    readSchoolFormData(idx, schools);
  }

  localStorage.setItem('sitahfidz_sekolah_formal', JSON.stringify(schools));
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
  renderAdminFormalSchools();
  showToast("✓ Seluruh data informasi sekolah formal berhasil disimpan & disinkronkan!", "success");
}

function tambahAdminFormalSchool() {
  const schools = getStoredFormalSchools();
  const newIndex = schools.length + 1;
  const newSchool = {
    id: `sekolah_${Date.now()}`,
    name: `Sekolah Mitra #${newIndex}`,
    fullName: `Nama Lengkap Lembaga Sekolah Mitra #${newIndex}`,
    level: 'MTs / SMP',
    category: 'mts_smp',
    badge: '',
    icon: '🏫',
    tagColor: '#059669',
    gradient: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
    desc: 'Deskripsi dan profil kurikulum terpadu sekolah formal.',
    highlights: [
      'Kurikulum terpadu selaras jadwal tahfidz pondok',
      'Pembiasaan karakter santri berakhlak mulia'
    ],
    syarat: 'Lulusan SD/MI/SMP, FC Ijazah, KK, Akta Kelahiran, Pas Foto 3x4',
    kontak: '0812-3456-7890',
    image: '',
    brosurImage: ''
  };
  schools.push(newSchool);
  localStorage.setItem('sitahfidz_sekolah_formal', JSON.stringify(schools));
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
  renderAdminFormalSchools();
  showToast("✓ Sekolah baru berhasil ditambahkan! Silakan lengkapi informasinya lalu klik Simpan.", "success");
}

function hapusAdminFormalSchool(index) {
  const schools = getStoredFormalSchools();
  if (!schools[index]) return;
  const name = schools[index].name;
  if (!confirm(`Hapus sekolah "${name}" dari daftar sekolah formal?`)) return;

  schools.splice(index, 1);
  localStorage.setItem('sitahfidz_sekolah_formal', JSON.stringify(schools));
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
  renderAdminFormalSchools();
  showToast(`Sekolah "${name}" telah dihapus.`, "info");
}

function resetAdminFormalSchools() {
  if (!confirm("Kembalikan data sekolah formal ke standar awal (6 sekolah)?")) return;
  const defaults = (typeof DEFAULT_FORMAL_SCHOOLS !== 'undefined') ? JSON.parse(JSON.stringify(DEFAULT_FORMAL_SCHOOLS)) : [];
  defaults.forEach(s => {
    s.image = '';
    s.brosurImage = s.brosurImage || '';
  });
  localStorage.setItem('sitahfidz_sekolah_formal', JSON.stringify(defaults));
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
  renderAdminFormalSchools();
  showToast("Data sekolah formal dikembalikan ke standar awal.", "info");
}

function handleUploadBrosurSekolah(index, event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const schools = getStoredFormalSchools();
  const sch = schools[index];
  if (!sch) return;

  const schoolName = sch.name || `Sekolah #${index + 1}`;

  const reader = new FileReader();
  reader.onload = function(e) {
    const rawSrc = e.target.result;

    const processBrochure = function(dataUrl) {
      sch.brosurImage = dataUrl;
      localStorage.setItem('sitahfidz_sekolah_formal', JSON.stringify(schools));
      if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
      renderAdminFormalSchools();
      showToast(`✓ Brosur resmi "${schoolName}" berhasil diunggah & disimpan ke cloud!`, "success");
    };

    if (typeof openImageCropper === 'function') {
      openImageCropper({
        imageSrc: rawSrc,
        title: `Sesuaikan Brosur PPDB: ${schoolName}`,
        aspectRatio: 'free',
        maxWidth: 900,
        maxHeight: 1200,
        quality: 0.75,
        onSave: function(croppedDataUrl) {
          processBrochure(croppedDataUrl);
        }
      });
    } else {
      // Fallback kompresi canvas mandiri
      const img = new Image();
      img.onload = function() {
        let w = img.width;
        let h = img.height;
        const maxW = 900;
        const maxH = 1200;
        if (w > maxW || h > maxH) {
          if (w / maxW > h / maxH) {
            h = Math.round((h * maxW) / w);
            w = maxW;
          } else {
            w = Math.round((w * maxH) / h);
            h = maxH;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL('image/jpeg', 0.75);
        processBrochure(compressed);
      };
      img.src = rawSrc;
    }
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}

function hapusBrosurSekolah(index) {
  const schools = getStoredFormalSchools();
  const sch = schools[index];
  if (!sch) return;
  const schoolName = sch.name || `Sekolah #${index + 1}`;

  if (!confirm(`Hapus brosur sekolah "${schoolName}"? Brosur yang dihapus tidak akan lagi muncul di website.`)) return;

  sch.brosurImage = '';
  localStorage.setItem('sitahfidz_sekolah_formal', JSON.stringify(schools));
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
  renderAdminFormalSchools();
  showToast(`Brosur "${schoolName}" telah dihapus.`, "info");
}

function zoomBrosurSekolah(imgSrc, title) {
  let zoomModal = document.getElementById('modalBrosurZoom');
  let imgEl = document.getElementById('zoomBrosurImg');
  let titleEl = document.getElementById('zoomBrosurTitle');

  if (!zoomModal) {
    const div = document.createElement('div');
    div.id = 'modalBrosurZoom';
    div.className = 'modal-overlay';
    div.style.cssText = 'display:none; z-index:999999; position:fixed; inset:0; background:rgba(0,0,0,0.92); backdrop-filter:blur(6px); align-items:center; justify-content:center; padding:16px;';
    div.onclick = closeModalBrosurZoom;
    div.innerHTML = `
      <div style="position:relative; max-width:95vw; max-height:95vh; display:flex; flex-direction:column; align-items:center;" onclick="event.stopPropagation()">
        <div style="position:absolute; top:-40px; right:0; display:flex; gap:12px; align-items:center;">
          <span id="zoomBrosurTitle" style="color:#fff; font-size:14px; font-weight:700;">Brosur</span>
          <button type="button" onclick="closeModalBrosurZoom()" style="background:#ef4444; border:none; color:#fff; font-size:18px; font-weight:800; border-radius:50%; width:32px; height:32px; cursor:pointer; display:flex; align-items:center; justify-content:center;">&times;</button>
        </div>
        <img id="zoomBrosurImg" src="" alt="Brosur Fullscreen" style="max-width:92vw; max-height:88vh; object-fit:contain; border-radius:8px; box-shadow:0 20px 50px rgba(0,0,0,0.8);">
      </div>
    `;
    document.body.appendChild(div);
    zoomModal = div;
    imgEl = document.getElementById('zoomBrosurImg');
    titleEl = document.getElementById('zoomBrosurTitle');
  }

  if (zoomModal && imgEl) {
    imgEl.src = imgSrc;
    if (titleEl) titleEl.textContent = `Brosur ${title || ''}`;
    zoomModal.style.display = 'flex';
  }
}

function closeModalBrosurZoom() {
  const zoomModal = document.getElementById('modalBrosurZoom');
  if (zoomModal) {
    zoomModal.style.display = 'none';
  }
}

// ========================================================
// 9.5 KELOLA PROGRAM EKSTRAKURIKULER SANTRI
// ========================================================

function getStoredEkstrakurikulerAdmin() {
  try {
    const raw = localStorage.getItem('sitahfidz_ekstrakurikuler');
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

function saveStoredEkstrakurikulerAdmin(list) {
  localStorage.setItem('sitahfidz_ekstrakurikuler', JSON.stringify(list));
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud(true);
}

function getEkstrakurikulerFallbackSvgAdmin(item, index) {
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
  const name = (item && item.name) ? item.name : 'Ekstrakurikuler';
  const category = (item && item.category) ? item.category : 'Bakat & Minat';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><defs><linearGradient id="g_ad_ekskul_${index}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${g[0]}"/><stop offset="100%" stop-color="${g[1]}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g_ad_ekskul_${index})"/><circle cx="400" cy="180" r="95" fill="rgba(255,255,255,0.08)"/><circle cx="400" cy="180" r="75" fill="none" stroke="${g[2]}" stroke-width="2.5" opacity="0.6"/><text x="400" y="200" font-size="70" text-anchor="middle">${icon}</text><text x="400" y="275" font-family="system-ui, -apple-system, sans-serif" font-size="26" fill="#ffffff" font-weight="800" text-anchor="middle">${escapeHtml(name)}</text><text x="400" y="310" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="${g[2]}" font-weight="700" text-anchor="middle" letter-spacing="1">${escapeHtml(category)}</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function renderWebEkstrakurikulerAdmin() {
  const container = document.getElementById('adminEkstrakurikulerList');
  if (!container) return;

  const list = getStoredEkstrakurikulerAdmin();

  if (list.length === 0) {
    container.innerHTML = `
      <div style="background:#f8fafc; border:2px dashed #cbd5e1; border-radius:14px; padding:36px; text-align:center; color:#64748b;">
        <span style="font-size:36px; display:block; margin-bottom:8px;">🎨</span>
        <h4 style="font-size:15px; font-weight:700; color:#334155; margin-bottom:4px;">Belum Ada Kegiatan Ekstrakurikuler</h4>
        <p style="font-size:12.5px; margin:0 0 16px 0;">Klik tombol di bawah untuk menambahkan kegiatan ekstrakurikuler pertama atau kembalikan ke standar pondok.</p>
        <div style="display:flex; justify-content:center; gap:8px;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="resetWebEkstrakurikulerAdmin()">🔄 Standar Bawaan (8 Kegiatan)</button>
          <button type="button" class="btn btn-gold btn-sm" onclick="tambahEkstrakurikulerAdmin()">➕ Tambah Ekstra Baru</button>
        </div>
      </div>
    `;
    return;
  }

  const standardCategories = [
    'Seni & Budaya Islam',
    'Pengembangan Diri',
    'Olahraga & Ketangkasan',
    'Literasi & Sains',
    'Keterampilan & Teknologi',
    'Lainnya'
  ];

  container.innerHTML = list.map((item, idx) => {
    const hasPhoto = !!(item.image && item.image.trim() !== '');
    const previewSrc = hasPhoto ? item.image : getEkstrakurikulerFallbackSvgAdmin(item, idx);
    const highlightsText = Array.isArray(item.highlights) ? item.highlights.join('\n') : (item.highlights || '');

    // Category options
    const currentCat = (item.category || 'Pengembangan Diri').trim();
    let catOptions = standardCategories.map(cat => {
      const selected = (cat === currentCat) ? 'selected' : '';
      return `<option value="${escapeHtml(cat)}" ${selected}>${escapeHtml(cat)}</option>`;
    }).join('');
    if (!standardCategories.includes(currentCat) && currentCat !== '') {
      catOptions = `<option value="${escapeHtml(currentCat)}" selected>${escapeHtml(currentCat)} (Kustom)</option>` + catOptions;
    }

    return `
      <div class="facility-editor-card" id="adminEkskulCard_${idx}" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:14px; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.04); position:relative;">
        <!-- Card Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid #e2e8f0; flex-wrap:wrap; gap:10px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="font-size:24px; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:10px; width:44px; height:44px; display:inline-flex; align-items:center; justify-content:center;">
              ${escapeHtml(item.icon || '🎨')}
            </span>
            <div>
              <strong style="font-size:15px; color:#0f172a; display:block;">
                #${idx + 1}. ${escapeHtml(item.name || 'Ekstrakurikuler')}
              </strong>
              <div style="font-size:12px; color:#64748b; margin-top:2px;">
                <span class="badge" style="background:#ecfdf5; color:#047857; font-weight:700; font-size:11px; padding:2px 8px; margin-right:6px;">
                  ${escapeHtml(item.category || 'Umum')}
                </span>
                ${item.badge ? `<span style="background:#fef3c7; color:#92400e; font-weight:700; font-size:11px; padding:2px 8px; border-radius:4px;">${escapeHtml(item.badge)}</span>` : ''}
              </div>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:8px;">
            <button type="button" class="btn btn-danger btn-sm" onclick="hapusEkstrakurikulerItem(${idx})" style="background:#fee2e2; color:#dc2626; border:1px solid #fecaca; font-weight:700; font-size:11.5px; padding:5px 12px;" title="Hapus kegiatan ini dari daftar">
              <span>🗑️</span> Hapus Ekstra Ini
            </button>
          </div>
        </div>

        <!-- Card Body: 2 Columns (Left: Photo 16:9, Right: Fields) -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
          
          <!-- Kolom Foto 16:9 -->
          <div>
            <label class="form-label" style="font-size:12px; font-weight:700; display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span>📸 Foto Kegiatan (Rasio 16:9)</span>
              ${hasPhoto ? '<span style="color:#16a34a; font-size:11px;">✓ Foto Tersimpan</span>' : '<span style="color:#64748b; font-size:11px;">Grafik Standar</span>'}
            </label>
            <div style="background:#0f172a; border-radius:12px; overflow:hidden; border:1px solid #cbd5e1; aspect-ratio:16/9; position:relative; box-shadow:0 4px 12px rgba(0,0,0,0.08); display:flex; align-items:center; justify-content:center;">
              <img src="${previewSrc}" alt="${escapeHtml(item.name)}" style="width:100%; height:100%; object-fit:cover; display:block;">
            </div>

            <!-- Upload Controls -->
            <div style="display:flex; gap:8px; margin-top:10px; flex-wrap:wrap;">
              <input type="file" id="uploadFotoEkskul_${idx}" accept="image/*" style="display:none;" onchange="handleUploadFotoEkskul(${idx}, event)">
              <button type="button" class="btn btn-primary btn-sm" onclick="document.getElementById('uploadFotoEkskul_${idx}').click()" style="flex:1; justify-content:center; font-size:11.5px; font-weight:700;">
                <span>📷</span> ${hasPhoto ? 'Ganti Foto 16:9' : 'Upload Foto 16:9'}
              </button>
              ${hasPhoto ? `
                <button type="button" class="btn btn-secondary btn-sm" onclick="hapusFotoEkskul(${idx})" style="color:#dc2626; border-color:#fca5a5; background:#fff; font-size:11.5px;" title="Hapus foto ini & kembali ke grafik vektor">
                  <span>🗑️</span>
                </button>
              ` : ''}
            </div>
            <small style="display:block; font-size:11px; color:#64748b; margin-top:5px; line-height:1.4;">
              💡 Unggah foto santri beraktivitas. Foto akan otomatis masuk ke pemotong gambar 16:9 agar tampilan di website tetap proporsional dan rapi.
            </small>
          </div>

          <!-- Kolom Formulir Input -->
          <div>
            <div style="display:grid; grid-template-columns:1fr 70px; gap:10px; margin-bottom:10px;">
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:12px; font-weight:700;">Nama Kegiatan Ekstrakurikuler <span style="color:red;">*</span></label>
                <input type="text" id="ekskulName_${idx}" class="form-control" style="font-size:13px; font-weight:700;" value="${escapeHtml(item.name || '')}" placeholder="cth: Seni Hadrah & Shalawat">
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:12px; font-weight:700; text-align:center;">Icon</label>
                <input type="text" id="ekskulIcon_${idx}" class="form-control" style="font-size:16px; text-align:center;" value="${escapeHtml(item.icon || '🎨')}" title="Masukkan emoji karakter">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin-bottom:10px;">
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:12px; font-weight:700;">Kategori</label>
                <select id="ekskulCat_${idx}" class="form-control" style="font-size:12.5px;">
                  ${catOptions}
                </select>
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:12px; font-weight:700;">Badge / Label Khusus</label>
                <input type="text" id="ekskulBadge_${idx}" class="form-control" style="font-size:12.5px;" value="${escapeHtml(item.badge || '')}" placeholder="cth: Tradisi Pesantren">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin-bottom:10px;">
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:12px; font-weight:700;">Jadwal Pelaksanaan</label>
                <input type="text" id="ekskulJadwal_${idx}" class="form-control" style="font-size:12.5px;" value="${escapeHtml(item.jadwal || '')}" placeholder="cth: Malam Jumat (20.00 - 22.00)">
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label" style="font-size:12px; font-weight:700;">Lokasi / Tempat</label>
                <input type="text" id="ekskulTempat_${idx}" class="form-control" style="font-size:12.5px;" value="${escapeHtml(item.tempat || '')}" placeholder="cth: Aula Utama Pesantren">
              </div>
            </div>

            <div class="form-group" style="margin-bottom:10px;">
              <label class="form-label" style="font-size:12px; font-weight:700;">Nama Pembina / Pelatih</label>
              <input type="text" id="ekskulPembina_${idx}" class="form-control" style="font-size:12.5px;" value="${escapeHtml(item.pembina || '')}" placeholder="cth: Ustadz Ahsan & Tim Senior">
            </div>

            <div class="form-group" style="margin-bottom:10px;">
              <label class="form-label" style="font-size:12px; font-weight:700;">Ringkasan Singkat (Tampil di Kartu Depan)</label>
              <textarea id="ekskulSnippet_${idx}" class="form-control" rows="2" style="font-size:12px; resize:vertical;" placeholder="Tuliskan 1-2 kalimat ringkas untuk pengantar kegiatan...">${escapeHtml(item.snippet || '')}</textarea>
            </div>

            <div class="form-group" style="margin-bottom:10px;">
              <label class="form-label" style="font-size:12px; font-weight:700;">Deskripsi Lengkap &amp; Tujuan Kegiatan</label>
              <textarea id="ekskulFullDesc_${idx}" class="form-control" rows="3" style="font-size:12px; resize:vertical;" placeholder="Penjelasan lengkap mengenai tujuan, silabus, dan manfaat kegiatan ini...">${escapeHtml(item.fullDesc || '')}</textarea>
            </div>

            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="font-size:12px; font-weight:700; display:flex; justify-content:space-between; align-items:center;">
                <span>🌟 Materi &amp; Keunggulan Kegiatan</span>
                <small style="color:#64748b; font-weight:normal;">1 baris per poin</small>
              </label>
              <textarea id="ekskulHighlights_${idx}" class="form-control" rows="3" style="font-size:12px; resize:vertical; font-family:monospace;" placeholder="Poin 1: Pembelajaran teknik dasar&#10;Poin 2: Pembentukan karakter&#10;Poin 3: Keikutsertaan festival">${escapeHtml(highlightsText)}</textarea>
            </div>

          </div>
        </div>
      </div>
    `;
  }).join('');
}

function tambahEkstrakurikulerAdmin() {
  const list = getStoredEkstrakurikulerAdmin();
  const newIndex = list.length + 1;
  const newItem = {
    id: `ekskul-${Date.now()}`,
    name: `Ekstrakurikuler Baru #${newIndex}`,
    category: 'Pengembangan Diri',
    icon: '⭐',
    badge: 'Kegiatan Santri',
    gradient: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
    snippet: 'Deskripsi singkat mengenai kegiatan ekstrakurikuler santri yang bermanfaat untuk pengembangan diri.',
    fullDesc: 'Kegiatan ekstrakurikuler ini dirancang untuk membekali santri dengan kecakapan praktis, mentalitas tangguh, dan ukhuwah islamiyah dalam suasana yang mendidik dan menyenangkan.',
    jadwal: 'Sabtu Sore (16.00 - 17.30 WIB)',
    tempat: 'Kompleks Pesantren',
    pembina: 'Ustadz Pembina Ekstrakurikuler',
    highlights: [
      'Bimbingan langsung dari pembina dan instruktur berpengalaman',
      'Pembentukan karakter disiplin, mandiri, dan sportif',
      'Sarana penyaluran bakat santri di luar jam wajib tahfidz'
    ],
    image: ''
  };

  list.push(newItem);
  saveStoredEkstrakurikulerAdmin(list);
  renderWebEkstrakurikulerAdmin();

  showToast(`✓ Ekstrakurikuler baru berhasil ditambahkan! Silakan lengkapi informasinya.`, "success");

  setTimeout(() => {
    const el = document.getElementById(`adminEkskulCard_${list.length - 1}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
}

function hapusEkstrakurikulerItem(index) {
  const list = getStoredEkstrakurikulerAdmin();
  const item = list[index];
  if (!item) return;

  const confirmMsg = `Apakah Anda yakin ingin menghapus kegiatan ekstrakurikuler "${item.name}"?\n\nTindakan ini akan menghapus kegiatan dari website utama santri.`;
  if (!confirm(confirmMsg)) return;

  list.splice(index, 1);
  saveStoredEkstrakurikulerAdmin(list);
  renderWebEkstrakurikulerAdmin();

  showToast(`Ekstrakurikuler "${item.name}" berhasil dihapus.`, "info");
}

function handleUploadFotoEkskul(index, event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const list = getStoredEkstrakurikulerAdmin();
  const item = list[index];
  if (!item) return;

  const ekskulName = item.name || 'Ekstrakurikuler';

  const reader = new FileReader();
  reader.onload = (e) => {
    if (typeof openImageCropper === 'function') {
      openImageCropper({
        imageSrc: e.target.result,
        title: `Potong Foto 16:9 - ${ekskulName}`,
        aspectRatio: '16:9',
        defaultRatio: '16:9',
        onSave: (croppedDataUrl) => {
          list[index].image = croppedDataUrl;
          saveStoredEkstrakurikulerAdmin(list);
          renderWebEkstrakurikulerAdmin();
          showToast(`✓ Foto kegiatan untuk "${ekskulName}" berhasil diunggah!`, "success");
        }
      });
    } else {
      list[index].image = e.target.result;
      saveStoredEkstrakurikulerAdmin(list);
      renderWebEkstrakurikulerAdmin();
      showToast(`✓ Foto kegiatan untuk "${ekskulName}" berhasil diunggah!`, "success");
    }
    event.target.value = '';
  };
  reader.readAsDataURL(file);
}

function hapusFotoEkskul(index) {
  const list = getStoredEkstrakurikulerAdmin();
  if (!list[index]) return;

  if (!confirm(`Hapus foto untuk "${list[index].name}"? Tampilan akan kembali ke grafik ilustrasi bawaan.`)) return;

  list[index].image = '';
  saveStoredEkstrakurikulerAdmin(list);
  renderWebEkstrakurikulerAdmin();
  showToast(`Foto untuk "${list[index].name}" telah dihapus.`, "info");
}

function simpanWebEkstrakurikulerAdmin() {
  const list = getStoredEkstrakurikulerAdmin();

  for (let i = 0; i < list.length; i++) {
    const nameEl = document.getElementById(`ekskulName_${i}`);
    const iconEl = document.getElementById(`ekskulIcon_${i}`);
    const catEl = document.getElementById(`ekskulCat_${i}`);
    const badgeEl = document.getElementById(`ekskulBadge_${i}`);
    const jadwalEl = document.getElementById(`ekskulJadwal_${i}`);
    const tempatEl = document.getElementById(`ekskulTempat_${i}`);
    const pembinaEl = document.getElementById(`ekskulPembina_${i}`);
    const snippetEl = document.getElementById(`ekskulSnippet_${i}`);
    const fullDescEl = document.getElementById(`ekskulFullDesc_${i}`);
    const highlightsEl = document.getElementById(`ekskulHighlights_${i}`);

    if (nameEl) list[i].name = nameEl.value.trim() || list[i].name;
    if (iconEl) list[i].icon = iconEl.value.trim() || '🎨';
    if (catEl) list[i].category = catEl.value.trim() || 'Pengembangan Diri';
    if (badgeEl) list[i].badge = badgeEl.value.trim();
    if (jadwalEl) list[i].jadwal = jadwalEl.value.trim();
    if (tempatEl) list[i].tempat = tempatEl.value.trim();
    if (pembinaEl) list[i].pembina = pembinaEl.value.trim();
    if (snippetEl) list[i].snippet = snippetEl.value.trim();
    if (fullDescEl) list[i].fullDesc = fullDescEl.value.trim();
    if (highlightsEl) {
      list[i].highlights = highlightsEl.value
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    }
  }

  saveStoredEkstrakurikulerAdmin(list);
  renderWebEkstrakurikulerAdmin();
  showToast(`✓ Seluruh pengaturan ${list.length} kegiatan ekstrakurikuler berhasil disimpan!`, "success");
}

function resetWebEkstrakurikulerAdmin() {
  if (!confirm("Kembalikan seluruh program ekstrakurikuler ke standar bawaan pondok (8 kegiatan)?")) return;
  const defaultList = (typeof DEFAULT_EKSTRAKURIKULER !== 'undefined' && Array.isArray(DEFAULT_EKSTRAKURIKULER))
    ? JSON.parse(JSON.stringify(DEFAULT_EKSTRAKURIKULER))
    : [];
  saveStoredEkstrakurikulerAdmin(defaultList);
  renderWebEkstrakurikulerAdmin();
  showToast("Program ekstrakurikuler telah dikembalikan ke standar awal.", "info");
}

// ========================================================
// 10. JADWAL HARI AKTIF & KALENDER LIBUR PONDOK
// ========================================================

function getDayInfo(dateStr) {
  if (!dateStr) return { namaHari: '', dayIndex: -1 };
  const parts = dateStr.split('-');
  if (parts.length < 3) return { namaHari: '', dayIndex: -1 };
  const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  const days = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const dayIdx = d.getDay();
  return { namaHari: days[dayIdx] || '', dayIndex: dayIdx };
}

function cekStatusHari(dateStr, settings) {
  if (!dateStr) return { isLibur: false, jenis: 'aktif', hari: '', keterangan: 'Hari Aktif' };
  const dayInfo = getDayInfo(dateStr);
  const dayIdx = dayInfo.dayIndex;
  const namaHari = dayInfo.namaHari;

  // 1. Libur Rutin Mingguan: Kamis (4) & Jumat (5)
  if (dayIdx === 4) {
    return {
      isLibur: true,
      jenis: 'rutin',
      hari: 'Kamis',
      keterangan: 'Libur Rutin Mingguan (Hari Kamis - Halaqah Libur)'
    };
  }
  if (dayIdx === 5) {
    return {
      isLibur: true,
      jenis: 'rutin',
      hari: 'Jumat',
      keterangan: 'Libur Rutin Mingguan (Hari Jumat - Halaqah Libur)'
    };
  }

  // 2. Libur Kondisional / Event Tertentu
  const liburList = (settings && settings.daftarHariLiburKondisional) || [];
  const found = liburList.find(item => item.tanggal === dateStr);
  if (found) {
    return {
      isLibur: true,
      jenis: 'kondisional',
      hari: namaHari,
      keterangan: found.keterangan || 'Libur Event Pondok'
    };
  }

  // 3. Hari Aktif Setoran (Sabtu, Ahad, Senin, Selasa, Rabu)
  return {
    isLibur: false,
    jenis: 'aktif',
    hari: namaHari,
    keterangan: 'Hari Aktif Setoran Halaqah (Sabtu - Rabu)'
  };
}

function renderStatusHariBanner(containerId, dateStr, settings) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!dateStr) {
    container.style.display = 'none';
    return;
  }
  const status = cekStatusHari(dateStr, settings);

  if (status.isLibur) {
    const isRutin = status.jenis === 'rutin';
    container.innerHTML = `
      <div style="background:#fffbeb; border:1px solid #fde047; border-left:5px solid #eab308; border-radius:10px; padding:12px 16px; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:24px;">🏖️</span>
          <div>
            <div style="font-weight:700; color:#854d0e; font-size:13.5px;">
              ${isRutin ? `Hari Libur Rutin Halaqah (${status.hari})` : `Hari Libur Pondok: ${escapeHtml(status.keterangan)}`}
            </div>
            <div style="font-size:12px; color:#a16207; margin-top:2px;">
              ${isRutin 
                ? 'Sesuai kebijakan resmi pondok, hari Kamis & Jumat adalah hari libur mingguan halaqah setoran. Pengisian presensi & setoran bersifat opsional / badal.' 
                : `Halaqah setoran santri diliburkan karena agenda: ${escapeHtml(status.keterangan)}.`}
            </div>
          </div>
        </div>
        <span style="font-size:11.5px; font-weight:700; background:#fef08a; color:#854d0e; padding:4px 10px; border-radius:20px; border:1px solid #facc15;">
          🏖️ LIBUR HALAQAH
        </span>
      </div>
    `;
    container.style.display = 'block';
  } else {
    container.innerHTML = `
      <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-left:5px solid #22c55e; border-radius:10px; padding:10px 16px; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:20px;">📖</span>
          <div>
            <div style="font-weight:700; color:#14532d; font-size:13px;">
              Hari Aktif Halaqah & Setoran (${status.hari}, ${formatTanggalIndo(dateStr)})
            </div>
            <div style="font-size:11.5px; color:#15803d; margin-top:1px;">
              Jadwal setoran santri aktif: Sabtu s/d Rabu. Silakan isi presensi kehadiran dan capaian setoran santri.
            </div>
          </div>
        </div>
        <span style="font-size:11px; font-weight:700; background:#dcfce7; color:#15803d; padding:3px 10px; border-radius:20px; border:1px solid #86efac;">
          ✅ HARI AKTIF SETORAN
        </span>
      </div>
    `;
    container.style.display = 'block';
  }
}

function renderStatusHariUstadzBanner(containerId, dateStr, settings) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!dateStr) {
    container.style.display = 'none';
    return;
  }
  const status = cekStatusHari(dateStr, settings);

  if (status.isLibur) {
    const isRutin = status.jenis === 'rutin';
    container.innerHTML = `
      <div style="background:#fffbeb; border:1px solid #fde047; border-left:5px solid #eab308; border-radius:10px; padding:12px 16px; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:24px;">🏖️</span>
          <div>
            <div style="font-weight:700; color:#854d0e; font-size:13.5px;">
              ${isRutin ? `Hari Libur Rutin Halaqah (${status.hari})` : `Hari Libur Pondok: ${escapeHtml(status.keterangan)}`}
            </div>
            <div style="font-size:12px; color:#a16207; margin-top:2px;">
              ${isRutin 
                ? 'Hari Kamis & Jumat adalah hari libur asatidz / pengajar halaqah. Presensi asatidz tidak wajib diisi.' 
                : `Halaqah santri diliburkan karena agenda: ${escapeHtml(status.keterangan)}. Presensi asatidz bersifat kondisional.`}
            </div>
          </div>
        </div>
        <span style="font-size:11.5px; font-weight:700; background:#fef08a; color:#854d0e; padding:4px 10px; border-radius:20px; border:1px solid #facc15;">
          🏖️ LIBUR ASATIDZ
        </span>
      </div>
    `;
    container.style.display = 'block';
  } else {
    container.innerHTML = `
      <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-left:5px solid #22c55e; border-radius:10px; padding:10px 16px; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:20px;">👳‍♂️</span>
          <div>
            <div style="font-weight:700; color:#14532d; font-size:13px;">
              Hari Aktif Mengajar Halaqah (${status.hari}, ${formatTanggalIndo(dateStr)})
            </div>
            <div style="font-size:11.5px; color:#15803d; margin-top:1px;">
              Jadwal mengajar aktif: Sabtu s/d Rabu. Catat kehadiran ustadz atau masukkan ustadz badal jika berhalangan.
            </div>
          </div>
        </div>
        <span style="font-size:11px; font-weight:700; background:#dcfce7; color:#15803d; padding:3px 10px; border-radius:20px; border:1px solid #86efac;">
          ✅ HARI AKTIF MENGAJAR
        </span>
      </div>
    `;
    container.style.display = 'block';
  }
}

function renderDaftarHariLibur() {
  const tbody = document.getElementById('tableHariLiburBody');
  if (!tbody) return;
  const list = AppState.settings.daftarHariLiburKondisional || [];
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-state" style="text-align:center; padding:18px; color:#94a3b8; font-size:12px;">Belum ada hari libur event terdaftar. Hari libur rutin tetap berlaku (Kamis & Jumat).</td></tr>`;
    return;
  }

  // Sort ascending by date
  const sorted = [...list].sort((a,b) => (a.tanggal || '').localeCompare(b.tanggal || ''));
  tbody.innerHTML = sorted.map((item, idx) => {
    const dayInfo = getDayInfo(item.tanggal);
    return `
      <tr>
        <td style="text-align:center; font-weight:600; color:#64748b;">${idx + 1}</td>
        <td><strong>${formatTanggalIndo(item.tanggal)}</strong></td>
        <td><span class="badge" style="background:#e0f2fe; color:#0369a1; font-weight:600;">${dayInfo.namaHari || '-'}</span></td>
        <td><strong style="color:#0f172a;">${escapeHtml(item.keterangan || 'Libur Event Pondok')}</strong></td>
        <td style="text-align:center;">
          <button type="button" class="btn btn-danger btn-sm" onclick="hapusHariLiburKondisional('${item.tanggal}')" title="Hapus Tanggal Libur Ini" style="padding:2px 8px; font-size:11px;">
            🗑️
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function tambahHariLiburKondisional() {
  const tglInput = document.getElementById('inputTambahLiburTanggal');
  const ketInput = document.getElementById('inputTambahLiburKet');
  if (!tglInput || !ketInput) return;

  const tgl = tglInput.value.trim();
  const ket = ketInput.value.trim();

  if (!tgl) {
    showToast("Silakan pilih tanggal libur terlebih dahulu!", "error");
    return;
  }
  if (!ket) {
    showToast("Silakan isi keterangan event libur!", "error");
    return;
  }

  if (!AppState.settings.daftarHariLiburKondisional) {
    AppState.settings.daftarHariLiburKondisional = [];
  }

  // Check if date already registered
  const existing = AppState.settings.daftarHariLiburKondisional.find(item => item.tanggal === tgl);
  if (existing) {
    existing.keterangan = ket;
    showToast(`Keterangan libur untuk tanggal ${formatTanggalIndo(tgl)} diperbarui!`, "success");
  } else {
    AppState.settings.daftarHariLiburKondisional.push({ tanggal: tgl, keterangan: ket });
    showToast(`Hari libur ${formatTanggalIndo(tgl)} (${ket}) berhasil ditambahkan!`, "success");
  }

  // Save and re-render
  saveToStorage();
  renderDaftarHariLibur();
  tglInput.value = '';
  ketInput.value = '';

  // Update banners in active tabs
  renderPresensiTable();
  renderAbsensiUstadzTable();
  renderRekapBulanan();
}

function hapusHariLiburKondisional(tanggal) {
  if (!AppState.settings.daftarHariLiburKondisional) return;
  const item = AppState.settings.daftarHariLiburKondisional.find(i => i.tanggal === tanggal);
  const ket = item ? item.keterangan : tanggal;

  if (confirm(`Apakah Anda yakin ingin menghapus hari libur ${formatTanggalIndo(tanggal)} (${ket})?`)) {
    AppState.settings.daftarHariLiburKondisional = AppState.settings.daftarHariLiburKondisional.filter(i => i.tanggal !== tanggal);
    saveToStorage();
    renderDaftarHariLibur();
    renderPresensiTable();
    renderAbsensiUstadzTable();
    renderRekapBulanan();
    showToast("Hari libur berhasil dihapus.", "success");
  }
}
