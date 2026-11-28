// ========================================================
// SiTahfidz - Sinkronisasi Cloud Multi-Device (Firebase Firestore)
// Proyek Resmi: website-utama-asrama
// Koleksi: sitahfidz_data (Dokumen: main)
// ========================================================

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAdFsegVP0K-HsOf1lX1ZTgHDIf7GMihR4",
  authDomain: "website-utama-asrama.firebaseapp.com",
  projectId: "website-utama-asrama",
  storageBucket: "website-utama-asrama.firebasestorage.app",
  messagingSenderId: "876519451002",
  appId: "1:876519451002:web:b8cf5486d665c52ed00ec3",
  measurementId: "G-KT6T0TTKJV"
};

const CLOUD_COLLECTION = 'sitahfidz_data';
const CLOUD_DOC_ID = 'main';

// ================= PENGELOLAAN ID SANTRI TERHAPUS (TOMBSTONE) =================
function getDeletedSantriIds() {
  try {
    const raw = localStorage.getItem('sitahfidz_deleted_santri_ids');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function recordDeletedSantriId(id) {
  if (!id) return;
  try {
    const list = getDeletedSantriIds();
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem('sitahfidz_deleted_santri_ids', JSON.stringify(list));
    }
  } catch (e) {}
}

function unrecordDeletedSantriId(id) {
  if (!id) return;
  try {
    const list = getDeletedSantriIds();
    const idx = list.indexOf(id);
    if (idx !== -1) {
      list.splice(idx, 1);
      localStorage.setItem('sitahfidz_deleted_santri_ids', JSON.stringify(list));
    }
  } catch (e) {}
}

if (typeof window !== 'undefined') {
  window.getDeletedSantriIds = getDeletedSantriIds;
  window.recordDeletedSantriId = recordDeletedSantriId;
  window.unrecordDeletedSantriId = unrecordDeletedSantriId;
}

let cloudDb = null;
let isFirebaseInitialized = false;
let isSyncingToCloud = false;
let isApplyingCloudUpdate = false;
let cloudDebounceTimer = null;

function initFirebaseSync() {
  if (typeof firebase === 'undefined') {
    updateSyncStatusBadge('offline', 'Firebase Offline');
    return;
  }

  try {
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
    cloudDb = firebase.firestore();
    isFirebaseInitialized = true;
    updateSyncStatusBadge('syncing', 'Menghubungkan Cloud...');

    // Real-Time Listener (Multi-Device Auto Sync)
    cloudDb.collection(CLOUD_COLLECTION).doc(CLOUD_DOC_ID).onSnapshot((doc) => {
      if (isSyncingToCloud) return;

      if (doc.exists) {
        const cloudData = doc.data();
        applyCloudDataToLocal(cloudData);
        updateSyncStatusBadge('online', 'Tersinkron Cloud');
      } else {
        // Dokumen pertama kali dibuat: unggah data lokal awal ke Cloud
        console.log('Dokumen sitahfidz_data/main belum ada di Cloud, inisialisasi unggah data awal...');
        pushLocalToCloud(true);
      }
    }, (error) => {
      console.warn('Firestore snapshot notice:', error);
      updateSyncStatusBadge('offline', 'Koneksi Cloud Terputus');
    });

    // Real-Time Listener untuk Media (Foto/Logo Pondok Terpisah)
    cloudDb.collection(CLOUD_COLLECTION).doc('media').onSnapshot((doc) => {
      if (doc.exists) {
        applyMediaToLocal(doc.data());
      }
    }, (error) => {
      console.warn('Firestore media snapshot notice:', error);
    });

    // Real-Time Listener untuk Foto Profil Pesantren
    cloudDb.collection(CLOUD_COLLECTION).doc('media_profil').onSnapshot((doc) => {
      if (doc.exists) {
        applyProfilMediaToLocal(doc.data());
      }
    }, (error) => {
      console.warn('Firestore media_profil snapshot notice:', error);
    });

    // Real-Time Listener untuk Media Fasilitas
    cloudDb.collection(CLOUD_COLLECTION).doc('media_fasilitas').onSnapshot((doc) => {
      if (doc.exists) {
        applyFasilitasMediaToLocal(doc.data());
      }
    }, (error) => {
      console.warn('Firestore media_fasilitas snapshot notice:', error);
    });

    // Real-Time Listener untuk Brosur Sekolah Formal
    cloudDb.collection(CLOUD_COLLECTION).doc('brosur_sekolah').onSnapshot((doc) => {
      if (doc.exists) {
        applyBrosurSekolahToLocal(doc.data());
      }
    }, (error) => {
      console.warn('Firestore brosur_sekolah snapshot notice:', error);
    });
  } catch (err) {
    console.error('Firebase init error:', err);
    updateSyncStatusBadge('offline', 'Gagal Inisialisasi Cloud');
  }
}

function updateSyncStatusBadge(status, text) {
  const badge = document.getElementById('cloudSyncBadge');
  const txt = document.getElementById('syncText');
  const cardBadge = document.getElementById('cloudStatusBadgeCard');
  const cardLastSync = document.getElementById('cloudLastSyncText');

  if (txt) {
    txt.textContent = text || 'Cloud Sync';
  }

  if (badge) {
    badge.title = `Status Sinkronisasi Cloud: ${text || status}`;
    if (status === 'online') {
      badge.style.background = '#ecfdf5';
      badge.style.color = '#047857';
      badge.style.borderColor = '#bbf7d0';
    } else if (status === 'syncing') {
      badge.style.background = '#fffbeb';
      badge.style.color = '#b45309';
      badge.style.borderColor = '#fde68a';
    } else {
      badge.style.background = '#fef2f2';
      badge.style.color = '#b91c1c';
      badge.style.borderColor = '#fca5a5';
    }
  }

  if (cardBadge) {
    if (status === 'online') {
      cardBadge.style.background = '#ecfdf5';
      cardBadge.style.color = '#047857';
      cardBadge.innerHTML = '🟢 Terhubung ke Cloud (Online)';
    } else if (status === 'syncing') {
      cardBadge.style.background = '#fffbeb';
      cardBadge.style.color = '#b45309';
      cardBadge.innerHTML = '🟡 Menyinkronkan...';
    } else {
      cardBadge.style.background = '#fef2f2';
      cardBadge.style.color = '#b91c1c';
      cardBadge.innerHTML = '🔴 Belum Terhubung (Offline)';
    }
  }

  if (cardLastSync && status === 'online') {
    cardLastSync.textContent = `Sinkronisasi aktif: Terakhir terhubung pukul ${new Date().toLocaleTimeString('id-ID')}`;
  }
}

function applyMediaToLocal(media) {
  if (!media) return;
  try {
    const sRaw = localStorage.getItem('sitahfidz_settings');
    const s = sRaw ? JSON.parse(sRaw) : {};
    let sChanged = false;
    ['logoPondok', 'heroBannerPhoto', 'fotoPengasuh'].forEach(k => {
      if (media[k] && s[k] !== media[k]) {
        s[k] = media[k];
        sChanged = true;
      }
    });
    if (sChanged) localStorage.setItem('sitahfidz_settings', JSON.stringify(s));

    const wcRaw = localStorage.getItem('sitahfidz_website_content');
    const wc = wcRaw ? JSON.parse(wcRaw) : {};
    if (media.fotoProfilPesantren && wc.fotoProfilPesantren !== media.fotoProfilPesantren) {
      wc.fotoProfilPesantren = media.fotoProfilPesantren;
      localStorage.setItem('sitahfidz_website_content', JSON.stringify(wc));
    }
  } catch (e) {
    console.warn('Error applying media to local:', e);
  }
}

function applyProfilMediaToLocal(media) {
  if (!media) return;
  try {
    const wcRaw = localStorage.getItem('sitahfidz_website_content');
    const wc = wcRaw ? JSON.parse(wcRaw) : {};
    if (media.fotoProfilPesantren && wc.fotoProfilPesantren !== media.fotoProfilPesantren) {
      wc.fotoProfilPesantren = media.fotoProfilPesantren;
      localStorage.setItem('sitahfidz_website_content', JSON.stringify(wc));
      if (typeof renderDynamicWebContent === 'function') renderDynamicWebContent();
    }
  } catch (e) {
    console.warn('Error applying profil media to local:', e);
  }
}

function applyFasilitasMediaToLocal(data) {
  if (!data || !Array.isArray(data.fasilitasMedia)) return;
  try {
    const raw = localStorage.getItem('sitahfidz_web_facilities');
    let facilities = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(facilities) || facilities.length === 0) {
      if (typeof DEFAULT_WEB_FACILITIES !== 'undefined') {
        facilities = JSON.parse(JSON.stringify(DEFAULT_WEB_FACILITIES));
      } else {
        return;
      }
    }

    let changed = false;
    data.fasilitasMedia.forEach((m) => {
      if (!m) return;
      const fac = facilities.find((f, idx) => (m.id && f.id === m.id) || (m.title && f.title === m.title) || idx === m.index);
      if (fac) {
        if (m.image !== undefined && fac.image !== m.image) {
          fac.image = m.image;
          changed = true;
        }
      }
    });

    if (changed) {
      localStorage.setItem('sitahfidz_web_facilities', JSON.stringify(facilities));
      if (typeof renderWebFacilitiesAdmin === 'function') renderWebFacilitiesAdmin();
      if (typeof renderWebsiteFacilities === 'function') renderWebsiteFacilities();
      if (typeof renderDynamicWebContent === 'function') renderDynamicWebContent();
    }
  } catch (e) {
    console.warn('Error applying fasilitas media to local:', e);
  }
}

function applyBrosurSekolahToLocal(data) {
  if (!data || !Array.isArray(data.brosurList)) return;
  try {
    const raw = localStorage.getItem('sitahfidz_sekolah_formal');
    let schools = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(schools) || schools.length === 0) {
      if (typeof DEFAULT_FORMAL_SCHOOLS !== 'undefined') {
        schools = JSON.parse(JSON.stringify(DEFAULT_FORMAL_SCHOOLS));
      } else {
        return;
      }
    }

    let changed = false;
    data.brosurList.forEach((b) => {
      if (!b) return;
      const sch = schools.find((s, idx) => (b.id && s.id === b.id) || (b.name && s.name === b.name) || idx === b.index);
      if (sch) {
        if (b.brosurImage !== undefined && sch.brosurImage !== b.brosurImage) {
          sch.brosurImage = b.brosurImage;
          changed = true;
        }
      }
    });

    if (changed) {
      localStorage.setItem('sitahfidz_sekolah_formal', JSON.stringify(schools));
      if (typeof renderAdminFormalSchools === 'function') renderAdminFormalSchools();
      if (typeof renderFormalSchools === 'function') renderFormalSchools();
    }
  } catch (e) {
    console.warn('Error applying brosur sekolah to local:', e);
  }
}

function applyCloudDataToLocal(cloudData) {
  if (!cloudData) return;
  isApplyingCloudUpdate = true;

  try {
    let hasChanges = false;

    // 0. Sinkronisasi daftar ID santri yang sudah dihapus secara permanen (tombstone)
    if (Array.isArray(cloudData.deletedSantriIds)) {
      const currentDeleted = getDeletedSantriIds();
      const merged = Array.from(new Set([...currentDeleted, ...cloudData.deletedSantriIds]));
      localStorage.setItem('sitahfidz_deleted_santri_ids', JSON.stringify(merged));
    }

    const syncMap = {
      settings: 'sitahfidz_settings',
      santri: 'sitahfidz_santri',
      setoran: 'sitahfidz_setoran',
      absensi: 'sitahfidz_absensi',
      ustadz: 'sitahfidz_ustadz',
      absensiUstadz: 'sitahfidz_absensi_ustadz',
      ujianSemester: 'sitahfidz_ujian_semester',
      pelanggaran: 'sitahfidz_pelanggaran',
      perizinan: 'sitahfidz_perizinan',
      ubudiyahJamaah: 'sitahfidz_ubudiyah_jamaah',
      ubudiyahEkskul: 'sitahfidz_ubudiyah_ekskul',
      websiteContent: 'sitahfidz_website_content',
      webFacilities: 'sitahfidz_web_facilities',
      sekolahFormal: 'sitahfidz_sekolah_formal',
      ekstrakurikuler: 'sitahfidz_ekstrakurikuler',
      biaya: 'sitahfidz_web_biaya',
      rekening: 'sitahfidz_web_rekening',
      articles: 'pondok_articles_data',
      gallery: 'pondok_gallery_data',
      psbPendaftar: 'psb_pendaftar_list'
    };

    for (const [cloudKey, localKey] of Object.entries(syncMap)) {
      if (cloudData[cloudKey] !== undefined) {
        let incomingData = cloudData[cloudKey];
        const localRaw = localStorage.getItem(localKey);

        // Jika data santri, filter keluar santri yang telah dihapus permanen
        if (cloudKey === 'santri') {
          const deletedIds = getDeletedSantriIds();
          if (deletedIds.length > 0) {
            if (Array.isArray(incomingData)) {
              const beforeCount = incomingData.length;
              incomingData = incomingData.filter(s => s && s.id && !deletedIds.includes(s.id));
              if (incomingData.length < beforeCount) {
                console.log(`[CloudSync] Memfilter ${beforeCount - incomingData.length} santri yang telah dihapus.`);
                setTimeout(() => { pushLocalToCloud(true); }, 1500);
              }
            }
            if (localRaw) {
              try {
                const localArr = JSON.parse(localRaw);
                if (Array.isArray(localArr)) {
                  const cleanedLocal = localArr.filter(s => s && s.id && !deletedIds.includes(s.id));
                  if (cleanedLocal.length < localArr.length) {
                    localStorage.setItem(localKey, JSON.stringify(cleanedLocal));
                    hasChanges = true;
                  }
                }
              } catch (e) {}
            }
          }
        }

        // Jika data absensi ustadz, filter keluar data simulasi / dummy lama
        if (cloudKey === 'absensiUstadz' && Array.isArray(incomingData)) {
          const isDummyAbsRecord = r => {
            if (!r) return true;
            if (r.id && (r.id.startsWith('ABSUST-00') || r.id.startsWith('ABSUST-01'))) return true;
            if (r.ustadzNama && (
              r.ustadzNama.includes('Muhammad Ridwan') ||
              r.ustadzNama.includes('Zainal Abidin') ||
              r.ustadzNama.includes('Miftah Faridl') ||
              r.ustadzNama.includes('Maryam Ulfah') ||
              r.ustadzNama.includes('Wildan') ||
              r.ustadzNama.includes('Nurul Hidayah')
            )) return true;
            return false;
          };
          incomingData = incomingData.filter(r => r && r.id && !isDummyAbsRecord(r));
        }

        // Pertahankan foto/logo lokal jika di incoming cloud kosong (karena tersimpan di doc media)
        if (cloudKey === 'settings' && incomingData && typeof incomingData === 'object') {
          try {
            const localSettings = localRaw ? JSON.parse(localRaw) : {};
            ['logoPondok', 'heroBannerPhoto', 'fotoPengasuh'].forEach(k => {
              if (!incomingData[k] && localSettings[k]) {
                incomingData[k] = localSettings[k];
              }
            });
          } catch (e) {}
        }
        if (cloudKey === 'websiteContent' && incomingData && typeof incomingData === 'object') {
          try {
            const localWc = localRaw ? JSON.parse(localRaw) : {};
            if (!incomingData.fotoProfilPesantren && localWc.fotoProfilPesantren) {
              incomingData.fotoProfilPesantren = localWc.fotoProfilPesantren;
            }
          } catch (e) {}
        }

        // Pastikan image kosong di sekolah formal (agar dokumen main tetap ringan), namun pertahankan brosurImage lokal jika di cloud main kosong
        if (cloudKey === 'sekolahFormal' && Array.isArray(incomingData)) {
          try {
            const localSchools = localRaw ? JSON.parse(localRaw) : [];
            incomingData.forEach((s, idx) => {
              if (s) {
                s.image = '';
                const localS = localSchools.find((ls, lidx) => (ls && s.id && ls.id === s.id) || (ls && s.name && ls.name === s.name) || lidx === idx);
                s.brosurImage = s.brosurImage || (localS && localS.brosurImage) || '';
              }
            });
          } catch (e) {
            incomingData.forEach(s => { if (s) { s.image = ''; s.brosurImage = s.brosurImage || ''; } });
          }
        }

        // Pertahankan foto fasilitas lokal jika di incoming cloud kosong (karena tersimpan di doc media_fasilitas)
        if (cloudKey === 'webFacilities' && Array.isArray(incomingData)) {
          try {
            const localFacs = localRaw ? JSON.parse(localRaw) : [];
            incomingData.forEach((f, idx) => {
              const localF = localFacs.find((lf, lidx) => (lf && f.id && lf.id === f.id) || (lf && f.title && lf.title === f.title) || lidx === idx);
              if (localF) {
                if (!f.image && localF.image) f.image = localF.image;
              }
            });
          } catch (e) {}
        }

        const cloudRaw = JSON.stringify(incomingData);
        if (localRaw !== cloudRaw) {
          // Jangan menimpa data default lokal dengan array/object kosong dari cloud baru
          const isCloudEmpty = Array.isArray(incomingData) ? incomingData.length === 0 : (incomingData && typeof incomingData === 'object' && Object.keys(incomingData).length === 0);
          const hasLocalPopulated = localRaw && localRaw !== '[]' && localRaw !== '{}' && localRaw !== 'null';
          if (isCloudEmpty && hasLocalPopulated) {
            continue;
          }

          // Proteksi cerdas untuk daftar data (biaya, rekening):
          // Jika lokal memiliki data yang lebih banyak/lengkap dari Cloud, pertahankan lokal dan perbarui Cloud!
          if (Array.isArray(incomingData) && hasLocalPopulated && cloudKey !== 'santri') {
            try {
              const localArr = JSON.parse(localRaw);
              if (Array.isArray(localArr) && localArr.length > incomingData.length) {
                console.log(`[CloudSync] Data lokal ${localKey} memiliki ${localArr.length} item (Cloud: ${incomingData.length}). Mempertahankan lokal.`);
                continue;
              }
            } catch (e) {}
          }

          localStorage.setItem(localKey, cloudRaw);
          hasChanges = true;
        }
      }
    }

    if (hasChanges) {
      // Cek apakah admin sedang aktif mengetik di input atau form
      const isUserTyping = document.activeElement && 
        (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA');

      // 1. Update Admin Panel jika sedang terbuka (hanya jika pengguna tidak sedang mengetik agar input tidak ter-reset!)
      if (typeof initStorage === 'function' && typeof renderAll === 'function' && !isUserTyping) {
        initStorage();
        renderAll();
        if (typeof initHeader === 'function') initHeader();
        if (typeof renderWebManager === 'function' && typeof AppState !== 'undefined' && AppState.currentTab === 'website') {
          renderWebManager();
        }
      }

      // 2. Update Panel Ustadz jika sedang terbuka
      if (typeof initUstadzStorage === 'function' && typeof renderUstadzAll === 'function' && !isUserTyping) {
        initUstadzStorage();
        renderUstadzAll();
      }

      // 3. Update Portal Wali jika sedang terbuka
      if (typeof initPortalSettings === 'function' && typeof cariDataSantriWali === 'function' && !isUserTyping) {
        initPortalSettings();
        cariDataSantriWali();
      }

      // 4. Update Website Publik (index.html) jika sedang terbuka
      if (typeof WebState !== 'undefined') {
        if (typeof initStorage === 'function') initStorage();
        if (typeof initPondokIdentity === 'function') initPondokIdentity();
        if (typeof renderDynamicWebContent === 'function') renderDynamicWebContent();
        if (typeof renderWebsitePembayaran === 'function') renderWebsitePembayaran();
        if (typeof renderArticles === 'function') renderArticles();
        if (typeof updateHeroStats === 'function') updateHeroStats();
      }
    }
  } catch (err) {
    console.error('Error menerapkan data cloud ke lokal:', err);
  } finally {
    isApplyingCloudUpdate = false;
  }
}

function pushLocalToCloud(force = false) {
  if (!cloudDb || !isFirebaseInitialized || isApplyingCloudUpdate) return;
  clearTimeout(cloudDebounceTimer);

  const doPush = () => {
    isSyncingToCloud = true;
    updateSyncStatusBadge('syncing', 'Menyimpan ke Cloud...');

    const parseOr = (key, fallback) => {
      try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
      } catch (e) {
        return fallback;
      }
    };

    const rawSettings = parseOr('sitahfidz_settings', {});
    const rawWebsiteContent = parseOr('sitahfidz_website_content', {});
    const rawSekolahFormal = parseOr('sitahfidz_sekolah_formal', []);
    const rawWebFacilities = parseOr('sitahfidz_web_facilities', []);

    // Pisahkan foto/media besar ke dokumen terpisah ('media', 'media_sekolah', 'media_fasilitas')
    // agar dokumen utama 'main' selalu sangat ringan (< 50 KB) dan bebas dari batas 1 MB Firestore!
    const mediaPayload = {};
    const lightSettings = { ...rawSettings };
    const lightWebsiteContent = { ...rawWebsiteContent };

    ['logoPondok', 'heroBannerPhoto', 'fotoPengasuh'].forEach(k => {
      if (rawSettings[k] && typeof rawSettings[k] === 'string' && rawSettings[k].startsWith('data:')) {
        mediaPayload[k] = rawSettings[k];
        lightSettings[k] = '';
      }
    });

    let mediaProfilPayload = null;
    if (rawWebsiteContent.fotoProfilPesantren && typeof rawWebsiteContent.fotoProfilPesantren === 'string' && rawWebsiteContent.fotoProfilPesantren.startsWith('data:')) {
      mediaProfilPayload = {
        fotoProfilPesantren: rawWebsiteContent.fotoProfilPesantren,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      lightWebsiteContent.fotoProfilPesantren = '';
    }

    // Pastikan sekolah formal bersih dari gambar di doc main agar sistem sangat ringan & bebas error
    const cleanSekolahFormal = rawSekolahFormal.map(s => ({
      ...s,
      image: '',
      brosurImage: ''
    }));

    // Pisahkan brosur sekolah formal ke dokumen terpisah 'brosur_sekolah'
    const brosurSekolahList = rawSekolahFormal.map((s, idx) => ({
      id: s.id || `sekolah_${idx}`,
      name: s.name || '',
      index: idx,
      brosurImage: s.brosurImage || ''
    }));
    const hasBrosurMedia = brosurSekolahList.some(s => s.brosurImage && s.brosurImage.startsWith('data:'));

    // Pisahkan foto fasilitas ke media_fasilitas
    const lightWebFacilities = rawWebFacilities.map(f => ({
      ...f,
      image: (f.image && f.image.startsWith('data:')) ? '' : (f.image || '')
    }));
    const fasilitasMediaList = rawWebFacilities.map((f, idx) => ({
      id: f.id || `fac_${idx}`,
      title: f.title || '',
      index: idx,
      image: f.image || ''
    }));
    const hasFasilitasMedia = fasilitasMediaList.some(f => f.image && f.image.startsWith('data:'));

    const currentDeletedSantriIds = getDeletedSantriIds();
    const cleanSantriList = parseOr('sitahfidz_santri', []).filter(s => s && s.id && !currentDeletedSantriIds.includes(s.id));

    const isDummyAbsRecord = r => {
      if (!r) return true;
      if (r.id && (r.id.startsWith('ABSUST-00') || r.id.startsWith('ABSUST-01'))) return true;
      if (r.ustadzNama && (
        r.ustadzNama.includes('Muhammad Ridwan') ||
        r.ustadzNama.includes('Zainal Abidin') ||
        r.ustadzNama.includes('Miftah Faridl') ||
        r.ustadzNama.includes('Maryam Ulfah') ||
        r.ustadzNama.includes('Wildan') ||
        r.ustadzNama.includes('Nurul Hidayah')
      )) return true;
      return false;
    };
    const cleanAbsensiUstadz = parseOr('sitahfidz_absensi_ustadz', []).filter(r => r && r.id && !isDummyAbsRecord(r));

    const payload = {
      settings: lightSettings,
      santri: cleanSantriList,
      deletedSantriIds: currentDeletedSantriIds,
      setoran: parseOr('sitahfidz_setoran', []),
      absensi: parseOr('sitahfidz_absensi', []),
      ustadz: parseOr('sitahfidz_ustadz', []),
      absensiUstadz: cleanAbsensiUstadz,
      ujianSemester: parseOr('sitahfidz_ujian_semester', []),
      pelanggaran: parseOr('sitahfidz_pelanggaran', []),
      perizinan: parseOr('sitahfidz_perizinan', []),
      ubudiyahJamaah: parseOr('sitahfidz_ubudiyah_jamaah', []),
      ubudiyahEkskul: parseOr('sitahfidz_ubudiyah_ekskul', []),
      websiteContent: lightWebsiteContent,
      webFacilities: lightWebFacilities,
      sekolahFormal: cleanSekolahFormal,
      ekstrakurikuler: parseOr('sitahfidz_ekstrakurikuler', []),
      biaya: parseOr('sitahfidz_web_biaya', []),
      rekening: parseOr('sitahfidz_web_rekening', []),
      articles: parseOr('pondok_articles_data', []),
      gallery: parseOr('pondok_gallery_data', []),
      psbPendaftar: parseOr('psb_pendaftar_list', []),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedDevice: navigator.userAgent.includes('Mobile') ? 'HP' : 'Laptop'
    };

    const promises = [
      cloudDb.collection(CLOUD_COLLECTION).doc(CLOUD_DOC_ID).set(payload, { merge: true })
    ];

    if (Object.keys(mediaPayload).length > 0) {
      promises.push(
        cloudDb.collection(CLOUD_COLLECTION).doc('media').set(mediaPayload, { merge: true })
      );
    }

    if (mediaProfilPayload) {
      promises.push(
        cloudDb.collection(CLOUD_COLLECTION).doc('media_profil').set(mediaProfilPayload, { merge: true })
      );
    }

    if (hasFasilitasMedia || rawWebFacilities.length > 0) {
      promises.push(
        cloudDb.collection(CLOUD_COLLECTION).doc('media_fasilitas').set({
          fasilitasMedia: fasilitasMediaList,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true })
      );
    }

    if (hasBrosurMedia || rawSekolahFormal.length > 0) {
      promises.push(
        cloudDb.collection(CLOUD_COLLECTION).doc('brosur_sekolah').set({
          brosurList: brosurSekolahList,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true })
      );
    }

    Promise.all(promises)
      .then(() => {
        updateSyncStatusBadge('online', 'Tersinkron Cloud');
      })
      .catch((err) => {
        console.warn('Gagal menyimpan ke Cloud Firestore:', err);
        updateSyncStatusBadge('offline', 'Gagal Simpan Cloud');
      })
      .finally(() => {
        setTimeout(() => {
          isSyncingToCloud = false;
        }, 500);
      });
  };

  if (force) {
    doPush();
  } else {
    cloudDebounceTimer = setTimeout(doPush, 1000);
  }
}

function paksaUnggahKeCloud() {
  if (!cloudDb) {
    if (typeof showToast === 'function') showToast('Database Cloud belum terhubung! Periksa koneksi internet.', 'error');
    return;
  }
  pushLocalToCloud(true);
  if (typeof showToast === 'function') showToast('Sedang mengunggah seluruh data ke Cloud Firestore...', 'info');
}

function paksaTarikDariCloud() {
  if (!cloudDb) {
    if (typeof showToast === 'function') showToast('Database Cloud belum terhubung! Periksa koneksi internet.', 'error');
    return;
  }
  updateSyncStatusBadge('syncing', 'Menarik data Cloud...');
  cloudDb.collection(CLOUD_COLLECTION).doc(CLOUD_DOC_ID).get()
    .then((doc) => {
      if (doc.exists) {
        applyCloudDataToLocal(doc.data());
        updateSyncStatusBadge('online', 'Tersinkron Cloud');
        if (typeof showToast === 'function') showToast('Berhasil menarik data terbaru dari Cloud Firestore!', 'success');
      } else {
        if (typeof showToast === 'function') showToast('Belum ada dokumen data di Cloud, mengunggah data lokal...', 'info');
        pushLocalToCloud(true);
      }
    })
    .catch((err) => {
      console.warn('Gagal menarik dari Cloud:', err);
      updateSyncStatusBadge('offline', 'Gagal Tarik Cloud');
      if (typeof showToast === 'function') showToast('Gagal menarik data Cloud: ' + err.message, 'error');
    });
}

// Inisialisasi otomatis saat dokumen siap
document.addEventListener('DOMContentLoaded', () => {
  initFirebaseSync();
});
