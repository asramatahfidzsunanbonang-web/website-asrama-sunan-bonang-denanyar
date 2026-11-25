// ========================================================
// SiTahfidz - Panel Khusus Asatidz (Presensi & Setoran)
// Controller & Logic Khusus Ustadz (Zero Dependency)
// ========================================================

const STORAGE_KEYS = {
  SETTINGS: 'sitahfidz_settings',
  SANTRI: 'sitahfidz_santri',
  SETORAN: 'sitahfidz_setoran',
  ABSENSI: 'sitahfidz_absensi'
};

let UstadzState = {
  settings: {},
  santri: [],
  setoran: [],
  absensi: [],
  currentTab: 'absensi',
  selectedUstadz: '',
  selectedSetoranUstadz: ''
};

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
  initUstadzStorage();
  checkUstadzPinProtection();
  initUstadzHeader();
  initUstadzDropdowns();
  
  // Load remembered ustadz
  const savedUstadz = localStorage.getItem('sitahfidz_my_ustadz') || '';
  if (savedUstadz) {
    UstadzState.selectedUstadz = savedUstadz;
    UstadzState.selectedSetoranUstadz = savedUstadz;
  }

  renderUstadzAll();
  autoSelectActiveSesi();
});

function initUstadzStorage() {
  const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  UstadzState.settings = { ...DEFAULT_SETTINGS, ...(savedSettings ? JSON.parse(savedSettings) : {}) };
  if (!UstadzState.settings.accessPin) UstadzState.settings.accessPin = '123456';
  if (!UstadzState.settings.ustadzPin) UstadzState.settings.ustadzPin = '888888';
  if (!UstadzState.settings.hariAktifSetoran) {
    UstadzState.settings.hariAktifSetoran = [...(DEFAULT_SETTINGS.hariAktifSetoran || ["Sabtu", "Ahad", "Senin", "Selasa", "Rabu"])];
  }
  if (!UstadzState.settings.hariLiburRutin) {
    UstadzState.settings.hariLiburRutin = [...(DEFAULT_SETTINGS.hariLiburRutin || ["Kamis", "Jumat"])];
  }
  if (!UstadzState.settings.daftarHariLiburKondisional) {
    UstadzState.settings.daftarHariLiburKondisional = [...(DEFAULT_SETTINGS.daftarHariLiburKondisional || [])];
  }

  const savedSantri = localStorage.getItem(STORAGE_KEYS.SANTRI);
  if (savedSantri) {
    try {
      UstadzState.santri = JSON.parse(savedSantri);
      SAMPLE_SANTRI.forEach(s => {
        if (!UstadzState.santri.some(item => item.id === s.id)) {
          UstadzState.santri.push(s);
        }
      });
    } catch (e) {
      UstadzState.santri = [ ...SAMPLE_SANTRI ];
    }
  } else {
    UstadzState.santri = [ ...SAMPLE_SANTRI ];
  }

  // Auto-migration: pastikan kelasSekolah tersedia
  UstadzState.santri.forEach(s => {
    if (s.kelasSekolah === undefined) {
      const matchSample = SAMPLE_SANTRI.find(sample => sample.id === s.id || sample.nis === s.nis);
      s.kelasSekolah = matchSample ? (matchSample.kelasSekolah || '') : '';
    }
  });

  const savedSetoran = localStorage.getItem(STORAGE_KEYS.SETORAN);
  if (savedSetoran) {
    try {
      UstadzState.setoran = JSON.parse(savedSetoran);
    } catch (e) {
      UstadzState.setoran = [ ...SAMPLE_SETORAN ];
    }
  } else {
    UstadzState.setoran = [ ...SAMPLE_SETORAN ];
  }

  const savedAbsensi = localStorage.getItem(STORAGE_KEYS.ABSENSI);
  if (savedAbsensi) {
    try {
      UstadzState.absensi = JSON.parse(savedAbsensi);
    } catch (e) {
      UstadzState.absensi = [ ...SAMPLE_ABSENSI ];
    }
  } else {
    UstadzState.absensi = [ ...SAMPLE_ABSENSI ];
  }
}

function saveUstadzStorage() {
  localStorage.setItem(STORAGE_KEYS.ABSENSI, JSON.stringify(UstadzState.absensi));
  localStorage.setItem(STORAGE_KEYS.SETORAN, JSON.stringify(UstadzState.setoran));
  if (typeof pushLocalToCloud === 'function') pushLocalToCloud();
}

// ================= PIN PROTECTION =================
function checkUstadzPinProtection() {
  const isProtected = UstadzState.settings.isPinProtected !== false;
  const isUnlocked = (sessionStorage.getItem('sitahfidz_ustadz_unlocked') === 'true') || (sessionStorage.getItem('sitahfidz_unlocked') === 'true');
  const overlay = document.getElementById('pinLockOverlay');

  if (overlay) {
    if (isProtected && !isUnlocked) {
      overlay.style.display = 'flex';
      overlay.classList.add('active');
    } else {
      overlay.style.display = 'none';
      overlay.classList.remove('active');
    }
  }
}

function handleVerifyUstadzPin(e) {
  e.preventDefault();
  const inputEl = document.getElementById('inputUstadzPin');
  const inputPin = inputEl ? inputEl.value.trim() : '';
  const correctUstadzPin = UstadzState.settings.ustadzPin || '888888';
  const correctAdminPin = UstadzState.settings.accessPin || '123456';
  const errorMsg = document.getElementById('pinErrorMsg');

  // Accepts either Ustadz PIN or Admin PIN
  if (inputPin === correctUstadzPin || inputPin === correctAdminPin) {
    sessionStorage.setItem('sitahfidz_ustadz_unlocked', 'true');
    const overlay = document.getElementById('pinLockOverlay');
    if (overlay) {
      overlay.style.display = 'none';
      overlay.classList.remove('active');
    }
    showToast("Akses Panel Ustadz Terbuka! Selamat Mengajar.", "success");
  } else {
    if (errorMsg) {
      errorMsg.style.display = 'block';
      errorMsg.textContent = '⚠️ PIN Asatidz salah! Silakan tanyakan PIN ke Bagian Administrasi.';
    }
    if (inputEl) {
      inputEl.value = '';
      if (typeof inputEl.focus === 'function') inputEl.focus();
    }
  }
}

function lockUstadzPanel() {
  if (confirm("Kunci kembali halaman Panel Ustadz?")) {
    sessionStorage.removeItem('sitahfidz_ustadz_unlocked');
    window.location.reload();
  }
}

// ================= HEADER & UI =================
function initUstadzHeader() {
  const elName = document.getElementById('headerPondokName');
  if (elName) elName.textContent = UstadzState.settings.namaPondok || "Pondok Pesantren Tahfidz Al-Qur'an";

  const elDate = document.getElementById('headerCurrentDate');
  if (elDate) {
    const today = new Date();
    elDate.textContent = today.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  // Logo
  const logoWrap = document.getElementById('headerLogoWrap');
  if (logoWrap) {
    if (UstadzState.settings.logoPondok) {
      logoWrap.innerHTML = `<img src="${UstadzState.settings.logoPondok}" alt="Logo" class="pondok-logo-img" style="width:48px; height:48px; max-width:48px; max-height:48px; object-fit:contain; background:transparent; display:block;">`;
    } else {
      logoWrap.innerHTML = `<span class="pondok-logo-placeholder" style="font-size:26px;">🕌</span>`;
    }
  }
}

function initUstadzDropdowns() {
  const tanggalInput = document.getElementById('absensiTanggal');
  if (tanggalInput && !tanggalInput.value) {
    tanggalInput.value = new Date().toISOString().split('T')[0];
  }

  const selectSesi = document.getElementById('absensiSesi');
  if (selectSesi) {
    selectSesi.innerHTML = '';
    (UstadzState.settings.sesiSetoran || []).forEach(sesi => {
      const opt = document.createElement('option');
      opt.value = sesi;
      opt.textContent = sesi;
      selectSesi.appendChild(opt);
    });
  }
}

function autoSelectActiveSesi() {
  const hour = new Date().getHours();
  const selectSesi = document.getElementById('absensiSesi');
  if (!selectSesi) return;

  const sesis = UstadzState.settings.sesiSetoran || [];
  if (sesis.length === 0) return;

  if (hour >= 4 && hour < 10) {
    selectSesi.value = sesis[0] || '';
  } else if (hour >= 14 && hour < 18) {
    selectSesi.value = sesis[1] || sesis[0] || '';
  } else if (hour >= 18 || hour < 4) {
    selectSesi.value = sesis[2] || sesis[1] || sesis[0] || '';
  }

  const headerSesi = document.getElementById('headerActiveSession');
  if (headerSesi) headerSesi.textContent = selectSesi.value.split(' ')[0] || 'Shubuh';
}

function switchUstadzTab(tabId) {
  UstadzState.currentTab = tabId;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

  const btnActive = document.getElementById(`tabBtn-${tabId}`);
  if (btnActive) btnActive.classList.add('active');

  const paneActive = document.getElementById(`pane-${tabId}`);
  if (paneActive) paneActive.classList.add('active');

  if (tabId === 'absensi') {
    renderAbsensiUstadzChips();
    renderPresensiTable();
  }
  if (tabId === 'setoran') {
    renderSetoranUstadzChips();
    renderSetoranTable();
  }
}

function renderUstadzAll() {
  renderAbsensiUstadzChips();
  renderPresensiTable();
  renderSetoranUstadzChips();
  renderSetoranTable();
  initInteractiveCardClicks();
}

function initInteractiveCardClicks() {
  const selectors = '.stat-card, .dashboard-card, .summary-card, .feature-card, .widget-card';
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

// ================= LIST OF USTADZ & CLASSES =================
function getDaftarUstadzHalaqah() {
  const map = new Map();
  (UstadzState.santri || []).forEach(s => {
    const h = (s.halaqah || '').trim();
    if (h) {
      map.set(h, (map.get(h) || 0) + 1);
    }
  });

  const fromSettings = [
    ...(UstadzState.settings.daftarHalaqahTahfidz || []),
    ...(UstadzState.settings.daftarHalaqahPascaTahfidz || []),
    ...(UstadzState.settings.daftarHalaqah || [])
  ];
  fromSettings.forEach(h => {
    const trimmed = (h || '').trim();
    if (trimmed && !map.has(trimmed)) {
      map.set(trimmed, 0);
    }
  });

  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
}

// ================= TAB 1: PRESENSI HARIAN =================
function renderAbsensiUstadzChips() {
  const container = document.getElementById('absensiUstadzChips');
  const notice = document.getElementById('absensiActiveUstadzNotice');
  const btnSetHadir = document.getElementById('btnSetSemuaHadir');
  if (!container) return;

  const list = getDaftarUstadzHalaqah();
  const current = UstadzState.selectedUstadz || '';
  const totalSantri = UstadzState.santri.length;

  if (notice) {
    if (current) {
      const match = list.find(l => l.name === current);
      const count = match ? match.count : 0;
      notice.style.display = 'inline-flex';
      notice.innerHTML = `<span>👳‍♂️ Ustadz Aktif: <strong>${escapeHtml(current)}</strong> (${count} Santri Bimbingan)</span> <button type="button" onclick="pilihMyUstadz('')" style="margin-left:8px; background:none; border:none; color:#047857; text-decoration:underline; cursor:pointer; font-size:11px; font-weight:700;">Tampilkan Semua</button>`;
    } else {
      notice.style.display = 'inline-flex';
      notice.innerHTML = `<span>👥 Menampilkan seluruh santri pondok. Klik nama Ustadz Anda untuk memfilter:</span>`;
    }
  }

  if (btnSetHadir) {
    if (current) {
      const shortName = current.length > 25 ? current.substring(0, 22) + '...' : current;
      btnSetHadir.textContent = `✓ Set Semua Hadir (${shortName})`;
      btnSetHadir.title = `Atur seluruh santri bimbingan '${current}' menjadi Hadir & Setor`;
    } else {
      btnSetHadir.textContent = `✓ Set Semua Hadir & Setor`;
      btnSetHadir.title = `Atur semua santri menjadi Hadir & Setor`;
    }
  }

  let chipsHtml = `
    <button type="button" 
      class="ustadz-chip ${!current ? 'active' : ''}" 
      onclick="pilihMyUstadz('')"
      title="Tampilkan semua santri">
      👥 <strong>Semua Santri</strong> <span class="chip-count">${totalSantri}</span>
    </button>
  `;

  // Tampilkan seluruh chip: halaqah yang memiliki santri + seluruh halaqah resmi dari Pengaturan
  const activeChips = list;
  activeChips.forEach(item => {
    const isActive = item.name === current;
    const isPutri = item.name.toLowerCase().includes('putri') || item.name.toLowerCase().includes('ustdzh');
    const icon = isPutri ? '🧕' : '👳‍♂️';
    chipsHtml += `
      <button type="button" 
        class="ustadz-chip ${isActive ? 'active' : ''}" 
        onclick="pilihMyUstadz('${escapeHtml(item.name)}')"
        title="Klik untuk langsung mengabsen santri bimbingan ${escapeHtml(item.name)}">
        ${icon} <strong>${escapeHtml(item.name)}</strong> <span class="chip-count">${item.count}</span>
      </button>
    `;
  });

  container.innerHTML = chipsHtml;
}

function pilihMyUstadz(halaqah) {
  UstadzState.selectedUstadz = halaqah || '';
  UstadzState.selectedSetoranUstadz = halaqah || '';
  if (halaqah) {
    localStorage.setItem('sitahfidz_my_ustadz', halaqah);
  } else {
    localStorage.removeItem('sitahfidz_my_ustadz');
  }
  renderAbsensiUstadzChips();
  renderPresensiTable();
  renderSetoranUstadzChips();
  renderSetoranTable();
}

function getFilteredAbsensiSantri() {
  const search = document.getElementById('absensiSearch')?.value?.toLowerCase().trim() || '';
  const selectedUstadz = UstadzState.selectedUstadz || '';

  if (!search) {
    // KONDISI DEFAULT (Cari Kosong): 100% hanya menampilkan santri halaqah binaan beliau sendiri
    return UstadzState.santri
      .filter(s => !selectedUstadz || s.halaqah === selectedUstadz)
      .map(s => ({ ...s, isBadal: false }));
  }

  // KONDISI PENCARIAN AKTIF: Cari ke seluruh santri pondok (Mendukung Titip Setoran / Badal Lintas Halaqah)
  return UstadzState.santri
    .filter(s => {
      const match = s.nama.toLowerCase().includes(search) || 
        s.nis.toLowerCase().includes(search) || 
        (s.halaqah && s.halaqah.toLowerCase().includes(search));
      return match;
    })
    .map(s => {
      const isBadal = Boolean(selectedUstadz && s.halaqah !== selectedUstadz);
      return { ...s, isBadal };
    })
    .sort((a, b) => {
      // Santri binaan sendiri ditaruh di atas, santri badal/titipan di bawah
      if (a.isBadal && !b.isBadal) return 1;
      if (!a.isBadal && b.isBadal) return -1;
      return 0;
    });
}

function renderPresensiTable() {
  const tanggalInput = document.getElementById('absensiTanggal');
  const sesiSelect = document.getElementById('absensiSesi');
  if (!tanggalInput || !sesiSelect) return;

  const tanggal = tanggalInput.value || new Date().toISOString().split('T')[0];
  const sesi = sesiSelect.value || (UstadzState.settings.sesiSetoran && UstadzState.settings.sesiSetoran[0]) || "Shubuh";

  // Tampilkan banner status hari aktif / libur rutin (Kamis-Jumat) / libur event
  renderStatusHariBanner('statusHariBanner', tanggal, UstadzState.settings);

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
    tbody.innerHTML = `<tr><td colspan="7" class="empty-state" style="padding:28px 16px; text-align:center;">
      <div style="font-size:26px; margin-bottom:8px;">🔍</div>
      <div style="font-weight:700; color:#334155;">Tidak ada santri yang sesuai filter.</div>
      <div style="font-size:12px; color:#64748b; margin-top:4px;">Klik chip "👥 Semua Santri" atau pilih nama Anda di atas.</div>
    </td></tr>`;
    updateAbsensiStats(0, 0, 0, 0, 0);
    return;
  }

  filteredSantri.forEach((santri, idx) => {
    const record = UstadzState.absensi.find(a => 
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

    const setoranRecord = UstadzState.setoran.find(s => 
      s.santriId === santri.id && 
      s.tanggal === tanggal && 
      s.sesi === sesi
    );

    let setoranCellHtml = '';
    if (setoranRecord) {
      setoranCellHtml = `
        <div style="font-size:12.5px; font-weight:700; color:#064e3b; margin-bottom:2px;">
          📖 QS. ${escapeHtml(setoranRecord.suratNama || '-')} : ${setoranRecord.ayatAwal || 1}-${setoranRecord.ayatAkhir || 1}
        </div>
        <div style="display:flex; align-items:center; gap:5px; flex-wrap:wrap;">
          <span style="font-size:11px; background:#e0f2fe; color:#0369a1; padding:1px 6px; border-radius:4px; font-weight:600;">Juz ${setoranRecord.juz} • Hlm ${setoranRecord.halaman || '-'}</span>
          ${getNilaiChipHtml(setoranRecord.nilai)}
        </div>
      `;
    } else {
      setoranCellHtml = `
        <div style="color:#94a3b8; font-size:11.5px; font-weight:600; display:flex; align-items:center; gap:4px;">
          <span>⚡</span> <span>Belum Setor Sesi Ini</span>
        </div>
      `;
    }

    let setoranBtnHtml = '';
    if (setoranRecord) {
      setoranBtnHtml = `
        <button type="button" class="btn btn-secondary btn-sm" onclick="editSetoran('${setoranRecord.id}')" title="Koreksi Setoran Santri Ini" style="font-size:11.5px; padding:3px 8px;">
          ✏️ Edit Setoran
        </button>
      `;
    } else {
      setoranBtnHtml = `
        <button type="button" class="btn btn-gold btn-sm" onclick="quickSetorFromAbsen('${santri.id}')" title="Langsung Catat Setoran Santri Ini" style="font-size:11.5px; padding:4px 10px; font-weight:700;">
          ➕ Catat Setor
        </button>
      `;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>
        <strong style="font-size:13.5px;">${escapeHtml(santri.nama)}</strong>
        <div style="font-size:11.5px; color:var(--dark-500); display:flex; gap:6px; flex-wrap:wrap; align-items:center; margin-top:2px;">
          <span>NIS: ${escapeHtml(santri.nis)}</span>
          ${santri.kelasSekolah ? `<span class="badge" style="background:#e0f2fe; color:#0284c7; font-size:10.5px; font-weight:700; padding:1px 5px; border-radius:4px;">Kls ${escapeHtml(santri.kelasSekolah)}</span>` : ''}
        </div>
        ${santri.isBadal ? `
          <div style="margin-top:4px;">
            <span class="badge" style="background:#fffbeb; color:#b45309; border:1px solid #fde68a; font-size:11px; font-weight:700; padding:2px 8px; border-radius:6px; display:inline-flex; align-items:center; gap:4px;">
              🔄 Titip Setor (Badal) • Asal: ${escapeHtml(santri.halaqah || 'Lain')}
            </span>
          </div>
        ` : ''}
      </td>
      <td>${badgeProgram}</td>
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
      <td>${setoranCellHtml}</td>
      <td>
        <input type="text" class="form-control" style="font-size:12px; padding:5px 8px;" 
          id="ketAbsen_${santri.id}"
          placeholder="Catatan / keterangan..." 
          value="${escapeHtml(currentKet)}"
          onchange="updateSingleAbsensiKeterangan('${santri.id}', this.value)">
      </td>
      <td style="text-align:center;">
        ${setoranBtnHtml}
      </td>
    `;
    tbody.appendChild(tr);
  });

  updateAbsensiStats(countHadirSetor, countHadirNoSetor, countIzin, countSakit, countAlpa);
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
  const sesi = sesiSelect.value || (UstadzState.settings.sesiSetoran && UstadzState.settings.sesiSetoran[0]) || "Shubuh";
  const santri = UstadzState.santri.find(s => s.id === santriId);
  if (!santri) return;

  let record = UstadzState.absensi.find(a => a.tanggal === tanggal && a.sesi === sesi && a.santriId === santriId);

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
      dicatatOleh: UstadzState.selectedUstadz || "Ustadz Pembimbing"
    };
    UstadzState.absensi.push(record);
  }

  saveUstadzStorage();
}

function updateSingleAbsensiKeterangan(santriId, keterangan) {
  const tanggalInput = document.getElementById('absensiTanggal');
  const sesiSelect = document.getElementById('absensiSesi');
  if (!tanggalInput || !sesiSelect) return;

  const tanggal = tanggalInput.value || new Date().toISOString().split('T')[0];
  const sesi = sesiSelect.value || (UstadzState.settings.sesiSetoran && UstadzState.settings.sesiSetoran[0]) || "Shubuh";
  let record = UstadzState.absensi.find(a => a.tanggal === tanggal && a.sesi === sesi && a.santriId === santriId);
  if (record) {
    record.keterangan = keterangan;
    saveUstadzStorage();
  }
}

function quickSetAbsensi(santriId, status) {
  updateSingleAbsensiStatus(santriId, status);
  renderPresensiTable();
}

function setSemuaAbsen(targetStatus) {
  const tanggalInput = document.getElementById('absensiTanggal');
  const sesiSelect = document.getElementById('absensiSesi');
  if (!tanggalInput || !sesiSelect) return;

  const tanggal = tanggalInput.value || new Date().toISOString().split('T')[0];
  const sesi = sesiSelect.value || (UstadzState.settings.sesiSetoran && UstadzState.settings.sesiSetoran[0]) || "Shubuh";
  const targetList = getFilteredAbsensiSantri();

  if (targetList.length === 0) {
    showToast("Tidak ada santri pada filter saat ini.", "warning");
    return;
  }

  targetList.forEach(santri => {
    let record = UstadzState.absensi.find(a => a.tanggal === tanggal && a.sesi === sesi && a.santriId === santri.id);
    if (record) {
      record.status = targetStatus;
    } else {
      UstadzState.absensi.push({
        id: "ABS-" + Date.now() + "-" + Math.floor(Math.random() * 10000),
        tanggal: tanggal,
        sesi: sesi,
        santriId: santri.id,
        santriNama: santri.nama,
        program: santri.program,
        halaqah: santri.halaqah,
        status: targetStatus,
        keterangan: "",
        dicatatOleh: UstadzState.selectedUstadz || "Ustadz Pembimbing"
      });
    }
  });

  saveUstadzStorage();
  renderPresensiTable();
  const labelGroup = UstadzState.selectedUstadz ? `santri (${UstadzState.selectedUstadz})` : 'semua santri';
  showToast(`Berhasil! ${targetList.length} ${labelGroup} diatur ke '${targetStatus}'`, 'success');
}

function simpanPresensiHarian() {
  saveUstadzStorage();
  renderPresensiTable();
  showToast("Alhamdulillah! Seluruh data presensi sesi ini tersimpan rapi.", "success");
}

function quickSetorFromAbsen(santriId) {
  openModalSetoran(santriId);
}

// ================= TAB 2: HASIL SETORAN HARIAN =================
function renderSetoranUstadzChips() {
  const container = document.getElementById('setoranUstadzChips');
  const notice = document.getElementById('setoranActiveUstadzNotice');
  if (!container) return;

  const list = getDaftarUstadzHalaqah();
  const current = UstadzState.selectedSetoranUstadz || '';
  const totalSetoran = UstadzState.setoran.length;

  if (notice) {
    if (current) {
      notice.style.display = 'inline-block';
      notice.innerHTML = `✓ Filter: <strong>${escapeHtml(current)}</strong> <button type="button" onclick="pilihSetoranUstadz('')" style="margin-left:6px; background:none; border:none; color:#047857; text-decoration:underline; cursor:pointer; font-size:11px;">Tampilkan Semua</button>`;
    } else {
      notice.style.display = 'none';
      notice.innerHTML = '';
    }
  }

  let chipsHtml = `
    <button type="button" 
      class="ustadz-chip ${!current ? 'active' : ''}" 
      onclick="pilihSetoranUstadz('')"
      title="Tampilkan seluruh setoran harian">
      📚 <strong>Semua Setoran</strong> <span class="chip-count">${totalSetoran}</span>
    </button>
  `;

  const activeChips = list.filter(item => item.count > 0 || item.name === current);
  activeChips.forEach(item => {
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
  UstadzState.selectedSetoranUstadz = halaqah || '';
  renderSetoranUstadzChips();
  renderSetoranTable();
}

function renderSetoranTable() {
  const search = document.getElementById('setoranSearch')?.value?.toLowerCase() || '';
  const jenisFilter = document.getElementById('setoranFilterJenis')?.value || '';
  const nilaiFilter = document.getElementById('setoranFilterNilai')?.value || '';
  const selectedUstadz = UstadzState.selectedSetoranUstadz || '';

  const tbody = document.getElementById('tableSetoranBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  let filtered = [...UstadzState.setoran].filter(item => {
    if (selectedUstadz) {
      const santriObj = UstadzState.santri.find(s => s.id === item.santriId);
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
    const matchJenis = !jenisFilter || item.jenisSetoran === jenisFilter;
    const matchNilai = !nilaiFilter || item.nilai === nilaiFilter;
    return matchSearch && matchJenis && matchNilai;
  });

  filtered.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="empty-state" style="padding:28px 16px; text-align:center;">
      <div style="font-size:26px; margin-bottom:8px;">📖</div>
      <div style="font-weight:700; color:#334155;">Belum ada riwayat hasil setoran harian untuk filter ini.</div>
      <div style="font-size:12px; color:#64748b; margin-top:4px;">Klik tombol "➕ Catat Hasil Setoran Harian" untuk mulai mencatat.</div>
    </td></tr>`;
    return;
  }

  filtered.forEach(item => {
    let badgeProgram = `<span class="badge badge-tahfidz">Tahfidz</span>`;
    if (item.program === 'Binnadzor') {
      badgeProgram = `<span class="badge badge-binnadzor">Binnadzor</span>`;
    } else if (item.program === 'Pasca Tahfidz') {
      badgeProgram = `<span class="badge badge-pasca">Pasca Tahfidz</span>`;
    }

    const chipNilai = getNilaiChipHtml(item.nilai);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <strong>${formatTanggalIndo(item.tanggal)}</strong>
        <div style="font-size:11.5px; color:var(--dark-500);">${escapeHtml(item.sesi || '-')}</div>
      </td>
      <td>
        <strong style="font-size:13px;">${escapeHtml(item.santriNama)}</strong>
        ${(() => {
          const sObj = UstadzState.santri.find(s => s.id === item.santriId);
          return (sObj && sObj.kelasSekolah) ? `<div style="font-size:11px; color:#0284c7; font-weight:600; margin-top:2px;">🏫 Kelas ${escapeHtml(sObj.kelasSekolah)}</div>` : '';
        })()}
      </td>
      <td>${badgeProgram}</td>
      <td><span style="font-weight:600; font-size:12px;">${escapeHtml(item.jenisSetoran)}</span></td>
      <td>
        <strong>Juz ${item.juz}</strong> • QS. ${escapeHtml(item.suratNama || '-')} : ${item.ayatAwal || 1}-${item.ayatAkhir || 1}
      </td>
      <td>${chipNilai}</td>
      <td style="font-size:12px; color:var(--dark-600); max-width:200px;">${escapeHtml(item.catatan || '-')}</td>
      <td style="font-size:12px; color:var(--dark-500);">${escapeHtml(item.penyimak || '-')}</td>
      <td style="text-align:right;">
        <button class="btn btn-secondary btn-sm" onclick="editSetoran('${item.id}')" title="Koreksi Setoran">✏️</button>
        <button class="btn btn-secondary btn-sm" onclick="hapusSetoran('${item.id}')" title="Hapus Setoran" style="color:var(--danger);">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function getNilaiChipHtml(nilai) {
  let badgeClass = 'badge-success';
  if (nilai?.includes('A')) badgeClass = 'badge-success';
  else if (nilai?.includes('B')) badgeClass = 'badge-info';
  else if (nilai?.includes('C')) badgeClass = 'badge-warning';
  else if (nilai?.includes('D')) badgeClass = 'badge-danger';
  return `<span class="badge ${badgeClass}">${escapeHtml(nilai || 'Belum Dinilai')}</span>`;
}

// ================= MODAL CATAT HASIL SETORAN =================
function openModalSetoran(preselectedSantriId = null) {
  const form = document.getElementById('formSetoran');
  if (form) form.reset();
  document.getElementById('formSetoranId').value = '';
  document.getElementById('modalSetoranTitle').textContent = '📖 Catat Hasil Setoran Harian Santri';

  // Populate Santri Dropdown (prioritizes current Ustadz's students)
  const selectSantri = document.getElementById('formSetoranSantri');
  if (selectSantri) {
    selectSantri.innerHTML = `<option value="">-- Pilih Santri --</option>`;
    
    // Sort santri so current ustadz's students appear first
    const sortedSantri = [...UstadzState.santri].sort((a, b) => {
      const matchA = a.halaqah === UstadzState.selectedUstadz ? 0 : 1;
      const matchB = b.halaqah === UstadzState.selectedUstadz ? 0 : 1;
      return matchA - matchB;
    });

    sortedSantri.forEach(s => {
      const isMy = s.halaqah === UstadzState.selectedUstadz;
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${isMy ? '⭐ ' : ''}${s.nama} (${s.program}${s.kelasSekolah ? ' - Kls ' + s.kelasSekolah : ''} - ${s.halaqah || 'Umum'})`;
      selectSantri.appendChild(opt);
    });

    if (preselectedSantriId) {
      selectSantri.value = preselectedSantriId;
    }
  }

  // Populate Sesi Dropdown
  const selectSesi = document.getElementById('formSetoranSesi');
  if (selectSesi) {
    selectSesi.innerHTML = '';
    (UstadzState.settings.sesiSetoran || []).forEach(sesi => {
      const opt = document.createElement('option');
      opt.value = sesi;
      opt.textContent = sesi;
      selectSesi.appendChild(opt);
    });
    // Sync with absensi active sesi
    const curAbsensiSesi = document.getElementById('absensiSesi')?.value;
    if (curAbsensiSesi) selectSesi.value = curAbsensiSesi;
  }

  // Default date
  document.getElementById('formSetoranTanggal').value = new Date().toISOString().split('T')[0];

  // Default Musyrif / Penyimak to active Ustadz yang sedang menyimak saat ini
  let defaultMusyrif = UstadzState.selectedUstadz || UstadzState.settings.kepalaTahfidz || '';
  if (preselectedSantriId) {
    const s = UstadzState.santri.find(x => x.id === preselectedSantriId);
    const isBadal = Boolean(UstadzState.selectedUstadz && s && s.halaqah && s.halaqah !== UstadzState.selectedUstadz);
    if (isBadal) {
      // Santri titipan/badal: Penyimak adalah Ustadz pengganti yang aktif saat ini
      defaultMusyrif = UstadzState.selectedUstadz || s.halaqah;
      const catatanEl = document.getElementById('formSetoranCatatan');
      if (catatanEl && !catatanEl.value) {
        catatanEl.value = `[Setoran Titipan / Badal] Ustadz pembimbing berhalangan, disimak oleh ${defaultMusyrif}`;
      }
    } else if (s && s.halaqah && !defaultMusyrif) {
      defaultMusyrif = s.halaqah;
    }
  }
  document.getElementById('formSetoranPenyimak').value = defaultMusyrif;

  populateSurahDropdown();
  populateJuzDropdown();

  document.getElementById('modalSetoran').classList.add('active');
}

function closeModalSetoran() {
  const modal = document.getElementById('modalSetoran');
  if (modal) modal.classList.remove('active');
}

function populateSurahDropdown() {
  const selectSurat = document.getElementById('formSetoranSurat');
  if (!selectSurat) return;
  selectSurat.innerHTML = '';

  const surahs = (typeof QURAN_SURAHS !== 'undefined') ? QURAN_SURAHS : [];
  surahs.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.no;
    opt.textContent = `${s.no}. QS. ${s.latin} (${s.arab}) - Juz ${s.juz} [${s.ayat} ayat]`;
    selectSurat.appendChild(opt);
  });
}

function populateJuzDropdown() {
  const selectJuz = document.getElementById('formSetoranJuz');
  if (!selectJuz) return;
  selectJuz.innerHTML = '';
  for (let j = 1; j <= 30; j++) {
    const opt = document.createElement('option');
    opt.value = j;
    opt.textContent = `Juz ${j}`;
    selectJuz.appendChild(opt);
  }
}

function onSuratChange() {
  const suratNo = parseInt(document.getElementById('formSetoranSurat')?.value, 10);
  if (!suratNo || typeof QURAN_SURAHS === 'undefined') return;
  const surat = QURAN_SURAHS.find(s => s.no === suratNo);
  if (surat) {
    document.getElementById('formSetoranJuz').value = surat.juz;
    document.getElementById('formSetoranAyatAwal').value = 1;
    document.getElementById('formSetoranAyatAkhir').value = Math.min(surat.ayat, 20);
  }
}

function simpanSetoran(e) {
  e.preventDefault();
  const id = document.getElementById('formSetoranId').value;
  const santriId = document.getElementById('formSetoranSantri').value;
  const santri = UstadzState.santri.find(s => s.id === santriId);

  if (!santri) {
    showToast("Silakan pilih santri terlebih dahulu!", "warning");
    return;
  }

  const suratNo = parseInt(document.getElementById('formSetoranSurat').value, 10);
  let suratNama = "";
  if (typeof QURAN_SURAHS !== 'undefined') {
    const sObj = QURAN_SURAHS.find(s => s.no === suratNo);
    if (sObj) suratNama = sObj.latin;
  }

  const setoranData = {
    id: id || ("STR-" + Date.now() + "-" + Math.floor(Math.random() * 1000)),
    santriId: santri.id,
    santriNama: santri.nama,
    program: santri.program,
    halaqah: santri.halaqah,
    tanggal: document.getElementById('formSetoranTanggal').value,
    sesi: document.getElementById('formSetoranSesi').value,
    jenisSetoran: document.getElementById('formSetoranJenis').value,
    juz: parseInt(document.getElementById('formSetoranJuz').value, 10),
    suratNo: suratNo,
    suratNama: suratNama,
    ayatAwal: parseInt(document.getElementById('formSetoranAyatAwal').value, 10) || 1,
    ayatAkhir: parseInt(document.getElementById('formSetoranAyatAkhir').value, 10) || 1,
    halaman: parseInt(document.getElementById('formSetoranHalaman').value, 10) || 1,
    nilai: document.getElementById('formSetoranNilai').value,
    catatan: document.getElementById('formSetoranCatatan').value.trim(),
    penyimak: document.getElementById('formSetoranPenyimak').value.trim() || UstadzState.selectedUstadz || "Ustadz Pembimbing"
  };

  if (id) {
    const idx = UstadzState.setoran.findIndex(item => item.id === id);
    if (idx !== -1) UstadzState.setoran[idx] = setoranData;
  } else {
    UstadzState.setoran.unshift(setoranData);
  }

  // Also auto mark attendance as 'Hadir (Setor)' if not marked yet
  const tgl = setoranData.tanggal;
  const sesi = setoranData.sesi;
  let absRecord = UstadzState.absensi.find(a => a.tanggal === tgl && a.sesi === sesi && a.santriId === santri.id);
  if (absRecord) {
    absRecord.status = 'Hadir (Setor)';
  } else {
    UstadzState.absensi.push({
      id: "ABS-" + Date.now() + "-" + Math.floor(Math.random() * 100),
      tanggal: tgl,
      sesi: sesi,
      santriId: santri.id,
      santriNama: santri.nama,
      program: santri.program,
      halaqah: santri.halaqah,
      status: 'Hadir (Setor)',
      keterangan: `Telah setor QS. ${suratNama}`,
      dicatatOleh: setoranData.penyimak
    });
  }

  saveUstadzStorage();
  closeModalSetoran();
  renderSetoranTable();
  renderPresensiTable();
  showToast(`Alhamdulillah! Hasil setoran ${santri.nama} berhasil dicatat.`, "success");
}

function editSetoran(id) {
  const item = UstadzState.setoran.find(s => s.id === id);
  if (!item) return;

  openModalSetoran();
  document.getElementById('formSetoranId').value = item.id;
  document.getElementById('modalSetoranTitle').textContent = '✏️ Koreksi Hasil Setoran Harian';
  document.getElementById('formSetoranSantri').value = item.santriId;
  document.getElementById('formSetoranTanggal').value = item.tanggal;
  document.getElementById('formSetoranSesi').value = item.sesi;
  document.getElementById('formSetoranJenis').value = item.jenisSetoran;
  document.getElementById('formSetoranJuz').value = item.juz;
  document.getElementById('formSetoranSurat').value = item.suratNo || 1;
  document.getElementById('formSetoranAyatAwal').value = item.ayatAwal || 1;
  document.getElementById('formSetoranAyatAkhir').value = item.ayatAkhir || 1;
  document.getElementById('formSetoranHalaman').value = item.halaman || 1;
  document.getElementById('formSetoranNilai').value = item.nilai || 'Mumtaz (A)';
  document.getElementById('formSetoranCatatan').value = item.catatan || '';
  document.getElementById('formSetoranPenyimak').value = item.penyimak || '';
}

function hapusSetoran(id) {
  const item = UstadzState.setoran.find(s => s.id === id);
  if (!item) return;
  if (!confirm(`Hapus catatan setoran ${item.santriNama} (QS. ${item.suratNama})?`)) return;

  UstadzState.setoran = UstadzState.setoran.filter(s => s.id !== id);
  saveUstadzStorage();
  renderSetoranTable();
  showToast("Catatan setoran berhasil dihapus.", "info");
}

// ================= UTILITIES =================
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatTanggalIndo(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      if (typeof toast.remove === 'function') {
        toast.remove();
      } else if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 400);
  }, 4000);
}

// ================= JADWAL HARI AKTIF & LIBUR PONDOK =================
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
                ? 'Sesuai jadwal resmi, hari Kamis & Jumat adalah hari libur mingguan halaqah setoran. Pengisian presensi & setoran bersifat opsional / badal.' 
                : `Halaqah santri diliburkan karena agenda: ${escapeHtml(status.keterangan)}.`}
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
