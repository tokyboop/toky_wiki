/**
 * ppt-runtime.js
 * 演示文稿交互运行时
 * 依赖：html2canvas · jszip · file-saver（仅导出时需要网络）
 *
 * HTML 约定的 DOM id：
 *   #slide-deck       slides 源数据容器（隐藏）
 *   #sidebar          左侧缩略图栏
 *   #main-preview     主预览区
 *   #preview-wrapper  预览缩放容器
 *   #tb-title         工具栏标题
 *   #tb-counter       工具栏页码
 *   #present-overlay  全屏演示层
 *   #present-stage    演示舞台
 *   #present-progress 底部进度条
 *   #present-counter  演示页码
 *   #overview-overlay 概览层
 *   #overview-grid    概览网格
 */
(function () {
  'use strict';

  const SCALE = 2, W = 960, H = 540;
  let slides = [], current = 0, mode = 'editor', cursorTimer = null, transitioning = false;

  /* ── init ── */
  function init() {
    slides = Array.from(document.getElementById('slide-deck').querySelectorAll('.slide'));
    slides.forEach((s, i) => {
      const n = document.createElement('div');
      n.className = 'slide-page-num';
      n.textContent = `${i + 1} / ${slides.length}`;
      s.appendChild(n);
    });
    const tb = document.getElementById('tb-title');
    if (tb) tb.textContent = document.title;
    buildSidebar(); buildOverview(); goTo(0);
    document.addEventListener('keydown', onKey);
    initTouch(); initOverviewBlankClick();
  }

  /* ── sidebar ── */
  function buildSidebar() {
    const sb = document.getElementById('sidebar');
    if (!sb) return;
    sb.innerHTML = '';
    slides.forEach((s, i) => {
      const item = document.createElement('div');
      item.className = 'thumb-item' + (i === current ? ' active' : '');
      item.onclick = () => goTo(i);
      const inner = document.createElement('div');
      inner.className = 'thumb-inner';
      inner.style.position = 'relative';
      inner.style.overflow = 'hidden';
      const clone = s.cloneNode(true);
      clone.style.cssText = `width:${W}px;height:${H}px;transform:scale(${(220-28)/W});transform-origin:top left;pointer-events:none;position:absolute;top:0;left:0;`;
      inner.appendChild(clone);
      item.appendChild(inner);
      const num = document.createElement('div');
      num.className = 'thumb-num';
      num.textContent = i + 1;
      item.appendChild(num);
      sb.appendChild(item);
    });
  }

  function updateSidebar() {
    document.querySelectorAll('.thumb-item').forEach((el, i) => el.classList.toggle('active', i === current));
    const active = document.querySelectorAll('.thumb-item')[current];
    if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  /* ── preview ── */
  function renderPreview() {
    const wrapper = document.getElementById('preview-wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = '';
    const container = document.getElementById('main-preview');
    const scale = Math.min((container.clientWidth - 60) / W, (container.clientHeight - 40) / H, 1);
    wrapper.style.width = W * scale + 'px';
    wrapper.style.height = H * scale + 'px';
    const clone = slides[current].cloneNode(true);
    clone.style.cssText = `width:${W}px;height:${H}px;transform:scale(${scale});transform-origin:top left;position:absolute;top:0;left:0;`;
    wrapper.appendChild(clone);
    const counter = document.getElementById('tb-counter');
    if (counter) counter.textContent = `${current + 1} / ${slides.length}`;
  }

  /* ── navigation ── */
  function goTo(idx) {
    if (idx < 0 || idx >= slides.length || transitioning) return;
    if (idx === current && mode === 'present') return;
    const prev = current;
    current = idx;
    if (mode === 'editor') { updateSidebar(); renderPreview(); }
    else if (mode === 'present') { transitionSlide(prev, current); }
  }
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  /* ── present mode ── */
  function startPresent() {
    mode = 'present'; transitioning = false;
    const overlay = document.getElementById('present-overlay');
    const stage = document.getElementById('present-stage');
    overlay.classList.add('active');
    stage.innerHTML = '';
    slides.forEach((s, i) => {
      const clone = s.cloneNode(true);
      const pn = clone.querySelector('.slide-page-num');
      if (pn) pn.style.display = 'none';
      if (i === current) clone.classList.add('current');
      stage.appendChild(clone);
    });
    fitStage(); updatePresentUI(); startCursorHide();
    window.addEventListener('resize', fitStage);
  }

  function exitPresent() {
    mode = 'editor'; transitioning = false;
    document.getElementById('present-overlay').classList.remove('active');
    window.removeEventListener('resize', fitStage);
    stopCursorHide(); updateSidebar(); renderPreview();
  }

  function fitStage() {
    const stage = document.getElementById('present-stage');
    const s = Math.min(window.innerWidth / W, window.innerHeight / H);
    stage.style.transform = `scale(${s})`;
    stage.style.transformOrigin = 'center center';
    stage.style.position = 'absolute';
    stage.style.left = (window.innerWidth - W) / 2 + 'px';
    stage.style.top = (window.innerHeight - H) / 2 + 'px';
  }

  function transitionSlide(fromIdx, toIdx) {
    transitioning = true;
    const stage = document.getElementById('present-stage');
    const children = stage.querySelectorAll('.slide');
    const t = slides[toIdx]?.dataset.transition || 'slide';
    stage.dataset.transition = t === 'slide' ? (toIdx > fromIdx ? 'slide' : 'slide-rev') : t;
    children.forEach((c, i) => {
      c.classList.remove('current', 'leaving', 'entering');
      if (i === fromIdx) c.classList.add('current');
      else if (i === toIdx) c.classList.add('entering');
    });
    requestAnimationFrame(() => { requestAnimationFrame(() => {
      children.forEach((c, i) => {
        c.classList.remove('current', 'entering');
        if (i === fromIdx) c.classList.add('leaving');
        else if (i === toIdx) c.classList.add('current');
      });
      const speed = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--transition-speed')) || 0.4;
      setTimeout(() => { transitioning = false; }, speed * 1000 + 50);
    }); });
    updatePresentUI();
  }

  function updatePresentUI() {
    const pct = slides.length > 1 ? (current / (slides.length - 1)) * 100 : 100;
    const prog = document.getElementById('present-progress');
    if (prog) prog.style.width = pct + '%';
    const cnt = document.getElementById('present-counter');
    if (cnt) cnt.textContent = `${current + 1} / ${slides.length}`;
  }

  function startCursorHide() {
    document.getElementById('present-overlay').addEventListener('mousemove', resetCursorTimer);
    resetCursorTimer();
  }
  function stopCursorHide() {
    const o = document.getElementById('present-overlay');
    o.removeEventListener('mousemove', resetCursorTimer);
    o.classList.remove('hide-cursor');
    clearTimeout(cursorTimer);
  }
  function resetCursorTimer() {
    const o = document.getElementById('present-overlay');
    o.classList.remove('hide-cursor');
    clearTimeout(cursorTimer);
    cursorTimer = setTimeout(() => o.classList.add('hide-cursor'), 3000);
  }

  /* ── overview mode ── */
  function buildOverview() {
    const grid = document.getElementById('overview-grid');
    if (!grid) return;
    grid.innerHTML = '';
    slides.forEach((s, i) => {
      const item = document.createElement('div');
      item.className = 'overview-item' + (i === current ? ' active' : '');
      item.onclick = () => { current = i; exitOverview(); startPresent(); };
      const inner = document.createElement('div');
      inner.className = 'overview-item-inner';
      const clone = s.cloneNode(true);
      clone.style.cssText = `width:${W}px;height:${H}px;transform-origin:top left;pointer-events:none;position:absolute;top:0;left:0;`;
      inner.appendChild(clone);
      item.appendChild(inner);
      const num = document.createElement('div');
      num.className = 'overview-num';
      num.textContent = i + 1;
      item.appendChild(num);
      grid.appendChild(item);
    });
    scaleOverviewItems();
  }

  function scaleOverviewItems() {
    document.querySelectorAll('.overview-item-inner').forEach(inner => {
      const clone = inner.querySelector('.slide');
      if (!clone) return;
      clone.style.transform = `scale(${inner.clientWidth / W})`;
    });
  }

  function toggleOverview() {
    if (mode === 'overview') exitOverview();
    else { if (mode === 'present') exitPresent(); enterOverview(); }
  }
  function enterOverview() {
    mode = 'overview';
    document.querySelectorAll('.overview-item').forEach((el, i) => el.classList.toggle('active', i === current));
    document.getElementById('overview-overlay').classList.add('active');
    requestAnimationFrame(scaleOverviewItems);
  }
  function exitOverview() {
    mode = 'editor';
    document.getElementById('overview-overlay').classList.remove('active');
    updateSidebar(); renderPreview();
  }
  function initOverviewBlankClick() {
    document.getElementById('overview-overlay').addEventListener('click', e => {
      if (!e.target.closest('.overview-item')) exitOverview();
    });
  }

  /* ── keyboard ── */
  function onKey(e) {
    if (e.key >= '1' && e.key <= '9' && !e.ctrlKey && !e.metaKey) {
      const idx = parseInt(e.key) - 1;
      if (idx < slides.length) { goTo(idx); e.preventDefault(); }
      return;
    }
    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': case ' ': case 'PageDown':
        e.preventDefault(); if (mode !== 'overview') next(); break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp':
        e.preventDefault(); if (mode !== 'overview') prev(); break;
      case 'Home': e.preventDefault(); goTo(0); break;
      case 'End': e.preventDefault(); goTo(slides.length - 1); break;
      case 'F5':
        e.preventDefault();
        if (mode === 'present') exitPresent();
        else { if (mode === 'overview') exitOverview(); startPresent(); }
        break;
      case 'o': case 'O':
        if (e.ctrlKey || e.metaKey) return;
        e.preventDefault(); toggleOverview(); break;
      case 'Escape':
        if (mode === 'present') exitPresent();
        else if (mode === 'overview') exitOverview();
        break;
    }
  }

  /* ── touch ── */
  function initTouch() {
    let startX = 0;
    const overlay = document.getElementById('present-overlay');
    overlay.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    overlay.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) < 40) { next(); return; }
      if (dx < -40) next(); else if (dx > 40) prev();
    }, { passive: true });
    overlay.addEventListener('click', e => {
      if (e.target.closest('.tb-btn, button')) return;
      next();
    });
  }

  /* ── export ── */
  function canvasToBlob(canvas) { return new Promise(r => canvas.toBlob(r, 'image/png')); }

  async function renderSlideCanvas(el) {
    const deck = document.getElementById('slide-deck');
    deck.style.visibility = 'visible';
    const c = await html2canvas(el, { scale: SCALE, useCORS: true, backgroundColor: null, width: W, height: H, logging: false });
    deck.style.visibility = 'hidden';
    return c;
  }

  async function downloadAll() {
    if (typeof html2canvas === 'undefined' || typeof JSZip === 'undefined' || typeof saveAs === 'undefined') {
      alert('导出依赖加载失败，请检查网络后刷新重试。'); return;
    }
    const counter = document.getElementById('tb-counter');
    const zip = new JSZip();
    const fb = (document.title || 'slides').replace(/[\\/:*?"<>|]+/g, '-');
    for (let i = 0; i < slides.length; i++) {
      if (counter) counter.textContent = `渲染 ${i+1}/${slides.length}...`;
      try {
        const c = await renderSlideCanvas(slides[i]);
        zip.file(`${fb}-${String(i+1).padStart(2,'0')}.png`, await canvasToBlob(c));
      } catch(e) {
        console.error(e);
        if (counter) counter.textContent = `第 ${i+1} 张失败`;
        await new Promise(r => setTimeout(r, 800));
      }
    }
    if (counter) counter.textContent = '打包中...';
    saveAs(await zip.generateAsync({ type: 'blob' }), `${fb}-slides.zip`);
    if (counter) counter.textContent = `${current + 1} / ${slides.length}`;
  }

  async function downloadLongImage() {
    if (typeof html2canvas === 'undefined' || typeof saveAs === 'undefined') {
      alert('导出依赖加载失败，请检查网络后刷新重试。'); return;
    }
    const counter = document.getElementById('tb-counter');
    const fb = (document.title || 'slides').replace(/[\\/:*?"<>|]+/g, '-');
    if (slides.length * H * SCALE > 32767) { alert('页数过多，请使用 ZIP 打包导出。'); return; }
    const fc = document.createElement('canvas');
    fc.width = W * SCALE; fc.height = slides.length * H * SCALE;
    const ctx = fc.getContext('2d');
    for (let i = 0; i < slides.length; i++) {
      if (counter) counter.textContent = `长图 ${i+1}/${slides.length}...`;
      try { ctx.drawImage(await renderSlideCanvas(slides[i]), 0, i * H * SCALE); }
      catch(e) { console.error(e); }
    }
    if (counter) counter.textContent = '生成中...';
    saveAs(await canvasToBlob(fc), `${fb}-长图.png`);
    if (counter) counter.textContent = `${current + 1} / ${slides.length}`;
  }

  /* ── exports ── */
  window.pptStartPresent  = startPresent;
  window.pptToggleOverview = toggleOverview;
  window.pptDownloadAll   = downloadAll;
  window.pptDownloadLongImage = downloadLongImage;
  window.pptPrev = prev;
  window.pptNext = next;

  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('resize', () => { if (mode === 'editor') renderPreview(); });
})();
