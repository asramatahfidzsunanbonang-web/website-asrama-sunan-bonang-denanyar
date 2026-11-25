/**
 * image-cropper.js
 * Modal Editor & Cropper Foto Interaktif untuk SiTahfidz
 * Fitur: Geser (Pan), Perbesar/Perkecil (Zoom), Putar 90° (Rotate),
 * Pilihan Rasio Aspek (16:9, 4:3, 1:1, Bebas), serta Opsi Gunakan Foto Utuh.
 * Zero-dependency, pure HTML5 Canvas & Vanilla JavaScript.
 */

(function (window) {
  'use strict';

  let currentConfig = null;
  let activeImage = null;
  let canvas = null;
  let ctx = null;

  // State transformasi
  let panX = 0;
  let panY = 0;
  let zoom = 1;
  let minZoom = 0.2;
  let maxZoom = 4;
  let rotation = 0; // derajat (0, 90, 180, 270)
  let activeRatio = '16:9'; // '16:9', '4:3', '1:1', 'free'

  // Dragging state
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;

  // Viewport / CropBox dimensions
  const WORK_WIDTH = 620;
  const WORK_HEIGHT = 370;
  let cropBox = { x: 30, y: 30, width: 560, height: 310 };

  function ensureModalInjected() {
    if (document.getElementById('modalImageCropper')) return;

    const modalHtml = `
      <div id="modalImageCropper" class="img-cropper-overlay" style="display:none; position:fixed; inset:0; background:rgba(15,23,42,0.85); backdrop-filter:blur(6px); z-index:99999; align-items:center; justify-content:center; padding:16px;">
        <div class="img-cropper-box" style="background:#0f172a; border:1px solid #334155; border-radius:18px; width:100%; max-width:670px; overflow:hidden; box-shadow:0 25px 60px -15px rgba(0,0,0,0.7); display:flex; flex-direction:column; color:#f8fafc; font-family:system-ui,-apple-system,sans-serif;">
          
          <!-- Header -->
          <div style="padding:16px 20px; border-bottom:1px solid #1e293b; display:flex; justify-content:space-between; align-items:center; background:#1e293b;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:20px;">✂️</span>
              <div>
                <h3 id="imgCropperTitle" style="font-size:15px; font-weight:800; color:#fff; margin:0; line-height:1.2;">Sesuaikan & Potong Foto</h3>
                <p style="font-size:11.5px; color:#94a3b8; margin:2px 0 0 0;">Geser & atur framing foto sebelum disimpan</p>
              </div>
            </div>
            <button type="button" onclick="closeImageCropper()" style="background:none; border:none; color:#94a3b8; font-size:24px; cursor:pointer; line-height:1; padding:4px 8px; border-radius:6px;" title="Tutup">&times;</button>
          </div>

          <!-- Ratio Toolbar -->
          <div style="display:flex; gap:6px; padding:10px 20px; background:#111827; border-bottom:1px solid #1f2937; overflow-x:auto; align-items:center;">
            <span style="font-size:11.5px; font-weight:700; color:#94a3b8; margin-right:4px; white-space:nowrap;">Pilihan Rasio:</span>
            <button type="button" class="img-ratio-btn" data-ratio="16:9" onclick="setImageCropperRatio('16:9')" style="font-size:11.5px; padding:4px 10px; border-radius:6px; border:1px solid #374151; background:#1f2937; color:#e5e7eb; cursor:pointer; font-weight:700;">16:9 (Banner/Header)</button>
            <button type="button" class="img-ratio-btn" data-ratio="4:3" onclick="setImageCropperRatio('4:3')" style="font-size:11.5px; padding:4px 10px; border-radius:6px; border:1px solid #374151; background:#1f2937; color:#e5e7eb; cursor:pointer; font-weight:700;">4:3 (Foto Standar)</button>
            <button type="button" class="img-ratio-btn" data-ratio="1:1" onclick="setImageCropperRatio('1:1')" style="font-size:11.5px; padding:4px 10px; border-radius:6px; border:1px solid #374151; background:#1f2937; color:#e5e7eb; cursor:pointer; font-weight:700;">1:1 (Persegi/Logo)</button>
            <button type="button" class="img-ratio-btn" data-ratio="free" onclick="setImageCropperRatio('free')" style="font-size:11.5px; padding:4px 10px; border-radius:6px; border:1px solid #374151; background:#1f2937; color:#e5e7eb; cursor:pointer; font-weight:700;">Bebas (Penuh)</button>
          </div>

          <!-- Canvas Interactive Workspace -->
          <div style="position:relative; width:100%; height:370px; background:#020617; display:flex; align-items:center; justify-content:center; overflow:hidden; user-select:none; cursor:grab;" id="imgCropperCanvasWrap">
            <canvas id="imgCropperCanvas" width="620" height="370" style="display:block; max-width:100%; height:auto;"></canvas>
            <div id="imgCropperHint" style="position:absolute; bottom:12px; left:16px; background:rgba(0,0,0,0.65); color:#cbd5e1; font-size:11px; padding:3px 10px; border-radius:999px; pointer-events:none; border:1px solid rgba(255,255,255,0.1);">
              👆 Geser mouse/jari untuk memindahkan • Scroll/slider untuk zoom
            </div>
          </div>

          <!-- Controls: Zoom, Rotate, Reset -->
          <div style="padding:12px 20px; background:#0f172a; border-top:1px solid #1e293b; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px;">
            <!-- Zoom slider -->
            <div style="display:flex; align-items:center; gap:8px; flex:1; min-width:200px;">
              <span style="font-size:13px; color:#94a3b8;">🔍</span>
              <button type="button" onclick="stepImageCropperZoom(-0.15)" style="background:#1e293b; border:1px solid #334155; color:#fff; width:26px; height:26px; border-radius:6px; cursor:pointer; font-weight:bold; line-height:1;">-</button>
              <input type="range" id="imgCropperZoomSlider" min="0.3" max="3.5" step="0.05" value="1" style="flex:1; cursor:pointer; accent-color:#059669;" oninput="onImageCropperZoomSlider(this.value)">
              <button type="button" onclick="stepImageCropperZoom(0.15)" style="background:#1e293b; border:1px solid #334155; color:#fff; width:26px; height:26px; border-radius:6px; cursor:pointer; font-weight:bold; line-height:1;">+</button>
              <span id="imgCropperZoomVal" style="font-size:11.5px; color:#a7f3d0; min-width:38px; text-align:right; font-weight:700;">100%</span>
            </div>

            <!-- Rotate & Reset buttons -->
            <div style="display:flex; align-items:center; gap:8px;">
              <button type="button" onclick="rotateImageCropper()" style="background:#1e293b; border:1px solid #334155; color:#f1f5f9; padding:5px 12px; border-radius:6px; font-size:12px; cursor:pointer; font-weight:600; display:flex; align-items:center; gap:4px;">
                <span>🔄</span> Putar 90°
              </button>
              <button type="button" onclick="resetImageCropperTransform()" style="background:#1e293b; border:1px solid #334155; color:#94a3b8; padding:5px 12px; border-radius:6px; font-size:12px; cursor:pointer; font-weight:600;">
                ↺ Reset
              </button>
            </div>
          </div>

          <!-- Footer Actions -->
          <div style="padding:14px 20px; background:#1e293b; border-top:1px solid #334155; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <button type="button" onclick="applyFullOriginalImage()" style="background:rgba(255,255,255,0.08); border:1px solid #475569; color:#f8fafc; padding:8px 14px; border-radius:8px; font-size:12px; cursor:pointer; font-weight:600; display:flex; align-items:center; gap:6px;">
              <span>⚡</span> Gunakan Foto Utuh (Tanpa Potong)
            </button>

            <div style="display:flex; gap:10px;">
              <button type="button" onclick="closeImageCropper()" style="background:none; border:1px solid #475569; color:#cbd5e1; padding:8px 16px; border-radius:8px; font-size:12.5px; cursor:pointer; font-weight:600;">
                Batal
              </button>
              <button type="button" onclick="confirmImageCrop()" style="background:#059669; border:1px solid #10b981; color:#ffffff; padding:8px 20px; border-radius:8px; font-size:12.5px; cursor:pointer; font-weight:800; box-shadow:0 4px 14px rgba(5,150,105,0.4); display:flex; align-items:center; gap:6px;">
                <span>✓</span> Terapkan & Potong Foto
              </button>
            </div>
          </div>

        </div>
      </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = modalHtml;
    document.body.appendChild(div.firstElementChild);

    initCanvasEvents();
  }

  function initCanvasEvents() {
    const cvs = document.getElementById('imgCropperCanvas');
    const wrap = document.getElementById('imgCropperCanvasWrap');
    if (!cvs || !wrap) return;

    canvas = cvs;
    ctx = canvas.getContext('2d');

    // Mouse drag
    wrap.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      isDragging = true;
      wrap.style.cursor = 'grabbing';
      dragStartX = e.clientX - panX;
      dragStartY = e.clientY - panY;
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      panX = e.clientX - dragStartX;
      panY = e.clientY - dragStartY;
      redrawCropper();
    });

    window.addEventListener('mouseup', function () {
      if (isDragging) {
        isDragging = false;
        if (wrap) wrap.style.cursor = 'grab';
      }
    });

    // Touch drag (mobile)
    wrap.addEventListener('touchstart', function (e) {
      if (e.touches.length === 1) {
        isDragging = true;
        const t = e.touches[0];
        dragStartX = t.clientX - panX;
        dragStartY = t.clientY - panY;
      }
    }, { passive: true });

    wrap.addEventListener('touchmove', function (e) {
      if (!isDragging || e.touches.length !== 1) return;
      const t = e.touches[0];
      panX = t.clientX - dragStartX;
      panY = t.clientY - dragStartY;
      redrawCropper();
      e.preventDefault();
    }, { passive: false });

    wrap.addEventListener('touchend', function () {
      isDragging = false;
    });

    // Mouse wheel zoom
    wrap.addEventListener('wheel', function (e) {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.08 : -0.08;
      setZoomLevel(zoom + delta);
    }, { passive: false });
  }

  function computeCropBox(ratio) {
    const pad = 24;
    const maxW = WORK_WIDTH - (pad * 2);
    const maxH = WORK_HEIGHT - (pad * 2);

    let targetRatio = 16 / 9;
    if (ratio === '4:3') targetRatio = 4 / 3;
    else if (ratio === '1:1') targetRatio = 1;
    else if (ratio === 'free') {
      if (activeImage && activeImage.naturalWidth && activeImage.naturalHeight) {
        targetRatio = activeImage.naturalWidth / activeImage.naturalHeight;
      } else {
        targetRatio = 16 / 9;
      }
    }

    let w = maxW;
    let h = w / targetRatio;
    if (h > maxH) {
      h = maxH;
      w = h * targetRatio;
    }

    cropBox = {
      x: Math.round((WORK_WIDTH - w) / 2),
      y: Math.round((WORK_HEIGHT - h) / 2),
      width: Math.round(w),
      height: Math.round(h)
    };
  }

  function setInitialFit() {
    if (!activeImage) return;
    panX = 0;
    panY = 0;
    rotation = 0;

    const imgW = (rotation % 180 === 0) ? activeImage.naturalWidth : activeImage.naturalHeight;
    const imgH = (rotation % 180 === 0) ? activeImage.naturalHeight : activeImage.naturalWidth;

    // Zoom agar gambar menutupi kotak crop
    const scaleX = cropBox.width / imgW;
    const scaleY = cropBox.height / imgH;
    zoom = Math.max(scaleX, scaleY) * 1.05;
    if (zoom < minZoom) zoom = minZoom;
    if (zoom > maxZoom) zoom = 1;

    updateZoomUI();
  }

  function setZoomLevel(newZoom) {
    zoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
    updateZoomUI();
    redrawCropper();
  }

  function updateZoomUI() {
    const slider = document.getElementById('imgCropperZoomSlider');
    const valText = document.getElementById('imgCropperZoomVal');
    if (slider) slider.value = zoom.toFixed(2);
    if (valText) valText.textContent = Math.round(zoom * 100) + '%';
  }

  function redrawCropper() {
    if (!ctx || !activeImage) return;

    ctx.clearRect(0, 0, WORK_WIDTH, WORK_HEIGHT);

    // 1. Gambar checkered pattern latar belakang transparan
    const checkSize = 16;
    for (let x = 0; x < WORK_WIDTH; x += checkSize) {
      for (let y = 0; y < WORK_HEIGHT; y += checkSize) {
        ctx.fillStyle = ((x / checkSize + y / checkSize) % 2 === 0) ? '#090d16' : '#0f172a';
        ctx.fillRect(x, y, checkSize, checkSize);
      }
    }

    // 2. Gambar foto dengan transformasi (pan, zoom, rotation)
    ctx.save();
    const centerX = cropBox.x + cropBox.width / 2 + panX;
    const centerY = cropBox.y + cropBox.height / 2 + panY;
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.drawImage(
      activeImage,
      -activeImage.naturalWidth / 2,
      -activeImage.naturalHeight / 2,
      activeImage.naturalWidth,
      activeImage.naturalHeight
    );
    ctx.restore();

    // 3. Masking area luar crop box (gelap transparan)
    ctx.fillStyle = 'rgba(2, 6, 23, 0.72)';
    // Atas
    ctx.fillRect(0, 0, WORK_WIDTH, cropBox.y);
    // Bawah
    ctx.fillRect(0, cropBox.y + cropBox.height, WORK_WIDTH, WORK_HEIGHT - (cropBox.y + cropBox.height));
    // Kiri
    ctx.fillRect(0, cropBox.y, cropBox.x, cropBox.height);
    // Kanan
    ctx.fillRect(cropBox.x + cropBox.width, cropBox.y, WORK_WIDTH - (cropBox.x + cropBox.width), cropBox.height);

    // 4. Garis batas crop box
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropBox.x, cropBox.y, cropBox.width, cropBox.height);

    // 5. Rule of Thirds Guide Lines (garis 3x3 bantu framing)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    const thirdW = cropBox.width / 3;
    const thirdH = cropBox.height / 3;

    ctx.beginPath();
    // Vertikal
    ctx.moveTo(cropBox.x + thirdW, cropBox.y);
    ctx.lineTo(cropBox.x + thirdW, cropBox.y + cropBox.height);
    ctx.moveTo(cropBox.x + thirdW * 2, cropBox.y);
    ctx.lineTo(cropBox.x + thirdW * 2, cropBox.y + cropBox.height);
    // Horisontal
    ctx.moveTo(cropBox.x, cropBox.y + thirdH);
    ctx.lineTo(cropBox.x + cropBox.width, cropBox.y + thirdH);
    ctx.moveTo(cropBox.x, cropBox.y + thirdH * 2);
    ctx.lineTo(cropBox.x + cropBox.width, cropBox.y + thirdH * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 6. Corner handles
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 3;
    const corner = 14;

    const drawCorner = (cx, cy, dirX, dirY) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy + dirY * corner);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx + dirX * corner, cy);
      ctx.stroke();
    };

    drawCorner(cropBox.x, cropBox.y, 1, 1);
    drawCorner(cropBox.x + cropBox.width, cropBox.y, -1, 1);
    drawCorner(cropBox.x, cropBox.y + cropBox.height, 1, -1);
    drawCorner(cropBox.x + cropBox.width, cropBox.y + cropBox.height, -1, -1);
  }

  // API Publik
  window.openImageCropper = function (options) {
    ensureModalInjected();

    currentConfig = {
      imageSrc: options.imageSrc,
      aspectRatio: options.aspectRatio || '16:9',
      title: options.title || 'Sesuaikan & Potong Foto',
      maxWidth: options.maxWidth || 960,
      maxHeight: options.maxHeight || 960,
      quality: typeof options.quality === 'number' ? options.quality : 0.75,
      onSave: options.onSave || function () {},
      onCancel: options.onCancel || function () {}
    };

    const modal = document.getElementById('modalImageCropper');
    const titleEl = document.getElementById('imgCropperTitle');
    if (titleEl) titleEl.textContent = currentConfig.title;

    activeRatio = currentConfig.aspectRatio;
    updateRatioButtonsUI();

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      activeImage = img;
      computeCropBox(activeRatio);
      setInitialFit();
      if (modal) modal.style.display = 'flex';
      redrawCropper();
    };
    img.onerror = function () {
      alert('Gagal memuat gambar untuk diedit.');
    };
    img.src = currentConfig.imageSrc;
  };

  window.closeImageCropper = function () {
    const modal = document.getElementById('modalImageCropper');
    if (modal) modal.style.display = 'none';
    if (currentConfig && typeof currentConfig.onCancel === 'function') {
      currentConfig.onCancel();
    }
  };

  window.setImageCropperRatio = function (ratio) {
    activeRatio = ratio;
    updateRatioButtonsUI();
    computeCropBox(activeRatio);
    setInitialFit();
    redrawCropper();
  };

  function updateRatioButtonsUI() {
    const btns = document.querySelectorAll('.img-ratio-btn');
    btns.forEach(btn => {
      const r = btn.getAttribute('data-ratio');
      if (r === activeRatio) {
        btn.style.background = '#059669';
        btn.style.borderColor = '#10b981';
        btn.style.color = '#ffffff';
      } else {
        btn.style.background = '#1f2937';
        btn.style.borderColor = '#374151';
        btn.style.color = '#94a3b8';
      }
    });
  }

  window.stepImageCropperZoom = function (step) {
    setZoomLevel(zoom + step);
  };

  window.onImageCropperZoomSlider = function (val) {
    setZoomLevel(parseFloat(val));
  };

  window.rotateImageCropper = function () {
    rotation = (rotation + 90) % 360;
    redrawCropper();
  };

  window.resetImageCropperTransform = function () {
    setInitialFit();
    redrawCropper();
  };

  window.confirmImageCrop = function () {
    if (!activeImage || !currentConfig) return;

    // Tentukan ukuran output hasil crop (dioptimalkan agar tajam namun sangat ringan < 50 KB)
    let outW = 960;
    let outH = 540;

    if (activeRatio === '4:3') {
      outW = 800;
      outH = 600;
    } else if (activeRatio === '1:1') {
      outW = 600;
      outH = 600;
    } else if (activeRatio === 'free') {
      outW = Math.min(960, Math.round(cropBox.width * 1.5));
      outH = Math.round(outW * (cropBox.height / cropBox.width));
      if (outH > 960) {
        outW = Math.round(outW * (960 / outH));
        outH = 960;
      }
    }

    const outCanvas = document.createElement('canvas');
    outCanvas.width = outW;
    outCanvas.height = outH;
    const outCtx = outCanvas.getContext('2d');
    outCtx.clearRect(0, 0, outW, outH);

    const scaleFactor = outW / cropBox.width;

    outCtx.save();
    outCtx.translate(outW / 2 + panX * scaleFactor, outH / 2 + panY * scaleFactor);
    outCtx.rotate((rotation * Math.PI) / 180);
    outCtx.scale(zoom * scaleFactor, zoom * scaleFactor);
    outCtx.drawImage(
      activeImage,
      -activeImage.naturalWidth / 2,
      -activeImage.naturalHeight / 2,
      activeImage.naturalWidth,
      activeImage.naturalHeight
    );
    outCtx.restore();

    // Deteksi apakah format output harus PNG agar transparansi tetap terjaga (hanya untuk logo eksplisit)
    const isPng = (
      currentConfig.format === 'image/png' ||
      currentConfig.outputFormat === 'image/png' ||
      (currentConfig.title && currentConfig.title.toLowerCase().includes('logo'))
    );

    // Jika format PNG (logo), periksa apakah ada latar hitam di sudut luar untuk dihilangkan
    if (isPng) {
      try {
        const imgData = outCtx.getImageData(0, 0, outW, outH);
        const data = imgData.data;
        const cornerIndices = [0, (outW - 1) * 4, ((outH - 1) * outW) * 4, ((outH - 1) * outW + (outW - 1)) * 4];
        const isCornerBlack = (idx) => (data[idx + 3] > 80 && data[idx] <= 36 && data[idx + 1] <= 36 && data[idx + 2] <= 36);
        const blackCorners = cornerIndices.filter(isCornerBlack).length;
        if (blackCorners >= 2) {
          stripBlackBgOnImageData(imgData, outW, outH);
          outCtx.putImageData(imgData, 0, 0);
        }
      } catch (err) {}
    }

    const resultDataUrl = isPng
      ? outCanvas.toDataURL('image/png')
      : outCanvas.toDataURL(currentConfig.format || 'image/jpeg', currentConfig.quality || 0.75);

    const onSave = currentConfig.onSave;
    const modal = document.getElementById('modalImageCropper');
    if (modal) modal.style.display = 'none';

    if (typeof onSave === 'function') {
      onSave(resultDataUrl);
    }
  };

  function stripBlackBgOnImageData(imgData, w, h) {
    const data = imgData.data;
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
  }

  window.applyFullOriginalImage = function () {
    if (!activeImage || !currentConfig) return;

    // Kompres foto original langsung tanpa crop (maksimal 960px agar hemat memori)
    const maxW = Math.min(currentConfig.maxWidth || 960, 960);
    const maxH = Math.min(currentConfig.maxHeight || 960, 960);

    let w = activeImage.naturalWidth;
    let h = activeImage.naturalHeight;

    if (w > maxW || h > maxH) {
      if (w / maxW > h / maxH) {
        h = Math.round((h * maxW) / w);
        w = maxW;
      } else {
        w = Math.round((w * maxH) / h);
        h = maxH;
      }
    }

    const outCanvas = document.createElement('canvas');
    outCanvas.width = w;
    outCanvas.height = h;
    const outCtx = outCanvas.getContext('2d');
    outCtx.clearRect(0, 0, w, h);
    outCtx.drawImage(activeImage, 0, 0, w, h);

    const isPng = (
      currentConfig.format === 'image/png' ||
      currentConfig.outputFormat === 'image/png' ||
      (currentConfig.title && currentConfig.title.toLowerCase().includes('logo'))
    );

    if (isPng) {
      try {
        const imgData = outCtx.getImageData(0, 0, w, h);
        const data = imgData.data;
        const cornerIndices = [0, (w - 1) * 4, ((h - 1) * w) * 4, ((h - 1) * w + (w - 1)) * 4];
        const isCornerBlack = (idx) => (data[idx + 3] > 80 && data[idx] <= 36 && data[idx + 1] <= 36 && data[idx + 2] <= 36);
        const blackCorners = cornerIndices.filter(isCornerBlack).length;
        if (blackCorners >= 2) {
          stripBlackBgOnImageData(imgData, w, h);
          outCtx.putImageData(imgData, 0, 0);
        }
      } catch (err) {}
    }

    const resultDataUrl = isPng
      ? outCanvas.toDataURL('image/png')
      : outCanvas.toDataURL(currentConfig.format || 'image/jpeg', currentConfig.quality || 0.75);

    const onSave = currentConfig.onSave;
    const modal = document.getElementById('modalImageCropper');
    if (modal) modal.style.display = 'none';

    if (typeof onSave === 'function') {
      onSave(resultDataUrl);
    }
  };

})(window);
