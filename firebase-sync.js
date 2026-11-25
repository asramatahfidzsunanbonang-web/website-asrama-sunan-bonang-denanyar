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

function applyCloudDataToLocal(cloudData) {
  if (!cloudData) return;
  isApplyingCloudUpdate = true;

  try {
    let hasChanges = false;

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
        const localRaw = localStorage.getItem(localKey);
        const cloudRaw = JSON.stringify(cloudData[cloudKey]);
        if (localRaw !== cloudRaw) {
          // Jangan menimpa data default lokal dengan array/object kosong dari cloud baru
          const isCloudEmpty = Array.isArray(cloudData[cloudKey]) ? cloudData[cloudKey].length === 0 : (cloudData[cloudKey] && typeof cloudData[cloudKey] === 'object' && Object.keys(cloudData[cloudKey]).length === 0);
          const hasLocalPopulated = localRaw && localRaw !== '[]' && localRaw !== '{}' && localRaw !== 'null';
          if (isCloudEmpty && hasLocalPopulated) {
            // Biarkan data lokal tetap ada, lalu sync data lokal ini ke cloud
            pushLocalToCloud(false);
          } else {
            localStorage.setItem(localKey, cloudRaw);
            hasChanges = true;
          }
        }
      }
    }

    if (hasChanges) {
      // 1. Update Admin Panel jika sedang terbuka
      if (typeof initStorage === 'function' && typeof renderAll === 'function') {
        initStorage();
        renderAll();
        if (typeof initHeader === 'function') initHeader();
        if (typeof renderWebManager === 'function' && typeof AppState !== 'undefined' && AppState.currentTab === 'website') {
          renderWebManager();
        }
      }

      // 2. Update Panel Ustadz jika sedang terbuka
      if (typeof initUstadzStorage === 'function' && typeof renderUstadzAll === 'function') {
        initUstadzStorage();
        renderUstadzAll();
      }

      // 3. Update Portal Wali jika sedang terbuka
      if (typeof initPortalSettings === 'function' && typeof cariDataSantriWali === 'function') {
        initPortalSettings();
        cariDataSantriWali();
      }

      // 4. Update Website Publik (index.html) jika sedang terbuka
      if (typeof WebState !== 'undefined' && typeof renderDynamicWebContent === 'function') {
        if (typeof initStorage === 'function') initStorage();
        if (typeof initPondokIdentity === 'function') initPondokIdentity();
        renderDynamicWebContent();
        if (typeof renderArticles === 'function') renderArticles();
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

    const payload = {
      settings: parseOr('sitahfidz_settings', {}),
      santri: parseOr('sitahfidz_santri', []),
      setoran: parseOr('sitahfidz_setoran', []),
      absensi: parseOr('sitahfidz_absensi', []),
      ustadz: parseOr('sitahfidz_ustadz', []),
      absensiUstadz: parseOr('sitahfidz_absensi_ustadz', []),
      ujianSemester: parseOr('sitahfidz_ujian_semester', []),
      pelanggaran: parseOr('sitahfidz_pelanggaran', []),
      perizinan: parseOr('sitahfidz_perizinan', []),
      ubudiyahJamaah: parseOr('sitahfidz_ubudiyah_jamaah', []),
      ubudiyahEkskul: parseOr('sitahfidz_ubudiyah_ekskul', []),
      websiteContent: parseOr('sitahfidz_website_content', {}),
      webFacilities: parseOr('sitahfidz_web_facilities', []),
      sekolahFormal: parseOr('sitahfidz_sekolah_formal', []),
      ekstrakurikuler: parseOr('sitahfidz_ekstrakurikuler', []),
      biaya: parseOr('sitahfidz_web_biaya', []),
      rekening: parseOr('sitahfidz_web_rekening', []),
      articles: parseOr('pondok_articles_data', []),
      gallery: parseOr('pondok_gallery_data', []),
      psbPendaftar: parseOr('psb_pendaftar_list', []),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedDevice: navigator.userAgent.includes('Mobile') ? 'HP' : 'Laptop'
    };

    cloudDb.collection(CLOUD_COLLECTION).doc(CLOUD_DOC_ID).set(payload, { merge: true })
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
    cloudDebounceTimer = setTimeout(doPush, 400);
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
