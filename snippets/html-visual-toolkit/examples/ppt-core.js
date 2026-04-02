/* ════════════════════════════════════════
   ppt-core.js — HTML PPT 演示框架逻辑
   自动构建 UI 骨架，HTML 只需提供 #slide-deck
   ════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Constants ── */
  const SCALE = 2;
  const W = 960, H = 540;

  /* ── State ── */
  let slides = [];
  let current = 0;
  let mode = 'editor';
  let cursorTimer = null;
  let transitioning = false;

  /* ══════════════════════════════════════
     BUILD SKELETON DOM
     ══════════════════════════════════════ */

  function buildSkeleton() {
    const deck = document.getElementById('slide-deck');
    if (!deck) return;

    // Hide slide-deck (source)
    deck.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden';

    // Toolbar
    const toolbar = el('div', { className: 'toolbar no-export', 'data-html2canvas-ignore': 'true', 'data-ppt-core': 'true' });
    toolbar.innerHTML = `
      <span class="tb-title" id="tb-title"></span>
      <span class="tb-counter" id="tb-counter">1 / N</span>
      <span class="spacer"></span>
      <button class="tb-btn tb-btn-default" id="btn-overview">概览 (O)</button>
      <span class="tb-sep"></span>
      <button class="tb-btn tb-btn-present" id="btn-present">演示 (F5)</button>
      <span class="tb-sep"></span>
      <button class="tb-btn tb-btn-default" id="btn-long-img">导出长图</button>
      <button class="tb-btn tb-btn-default" id="btn-zip">ZIP 打包</button>
      <span class="tb-sep"></span>
      <span class="npc-badge">powered by <span>NPC</span></span>
    `;

    // Editor view
    const editorView = el('div', { className: 'editor-view', id: 'editor-view' });
    editorView.innerHTML = `
      <div class="sidebar" id="sidebar"></div>
      <div class="main-preview" id="main-preview">
        <div class="nav-zone nav-zone-prev" id="nav-prev"><div class="nav-zone-icon">&lt;</div></div>
        <div class="preview-wrapper" id="preview-wrapper"></div>
        <div class="nav-zone nav-zone-next" id="nav-next"><div class="nav-zone-icon">&gt;</div></div>
      </div>
    `;

    // Present overlay
    const presentOverlay = el('div', { className: 'present-overlay', id: 'present-overlay' });
    presentOverlay.innerHTML = `
      <div class="present-stage" id="present-stage" data-transition="slide"></div>
      <div class="present-progress" id="present-progress" style="width:0%"></div>
      <div class="present-counter no-export" id="present-counter">1 / N</div>
      <button class="present-exit no-export" id="btn-exit-present" title="退出演示 (ESC)">✕</button>
      <div class="present-npc no-export">powered by NPC</div>
    `;

    // Overview overlay
    const overviewOverlay = el('div', { className: 'overview-overlay', id: 'overview-overlay' });
    overviewOverlay.innerHTML = `<div class="overview-grid" id="overview-grid"></div>`;

    // Insert all before slide-deck
    const parent = deck.parentNode;
    parent.insertBefore(toolbar, deck);
    parent.insertBefore(editorView, deck);
    parent.insertBefore(presentOverlay, deck);
    parent.insertBefore(overviewOverlay, deck);

    // Bind toolbar buttons
    document.getElementById('btn-overview').onclick = toggleOverview;
    document.getElementById('btn-present').onclick = startPresent;
    document.getElementById('btn-long-img').onclick = downloadLongImage;
    document.getElementById('btn-zip').onclick = downloadAll;
    document.getElementById('nav-prev').onclick = prev;
    document.getElementById('nav-next').onclick = next;
    document.getElementById('btn-exit-present').onclick = function (e) {
      e.stopPropagation();
      exitPresent();
    };
  }

  function el(tag, attrs) {
    const e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(k => {
      if (k === 'className') e.className = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    return e;
  }

  /* ══════════════════════════════════════
     SELF CHECK — detect common generation errors
     ══════════════════════════════════════ */

  function selfCheck() {
    var warn = function (msg) { console.warn('[ppt-core] ' + msg); };
    var deck = document.getElementById('slide-deck');

    if (!deck) {
      warn('FATAL: missing <div id="slide-deck">. No slides will render.');
      return;
    }

    var slideEls = deck.querySelectorAll('.ppt-slide');
    if (slideEls.length === 0) {
      warn('FATAL: #slide-deck contains no .ppt-slide elements.');
    }

    slideEls.forEach(function (s, i) {
      if (!s.classList.contains('dark') && !s.classList.contains('light')) {
        warn('Slide ' + (i + 1) + ': missing .dark or .light class — no background/text color.');
      }
    });

    var requiredVars = ['--bg-body', '--bg-slide-dark', '--bg-slide-light', '--accent',
      '--text-dark', '--text-light', '--text-dark-muted', '--text-light-muted',
      '--bg-chrome', '--bg-chrome-hover', '--border-chrome',
      '--text-chrome', '--text-chrome-muted',
      '--font-stack', '--sidebar-w', '--transition-speed'];
    var rootStyle = getComputedStyle(document.documentElement);
    requiredVars.forEach(function (v) {
      if (!rootStyle.getPropertyValue(v).trim()) {
        warn('Missing CSS variable ' + v + ' in :root.');
      }
    });

    if (document.querySelector('.toolbar:not([data-ppt-core])')) {
      warn('Found pre-existing .toolbar in HTML — ppt-core.js auto-generates this. Duplicate UI will appear.');
    }
    if (document.querySelector('.editor-view')) {
      warn('Found pre-existing .editor-view in HTML — ppt-core.js auto-generates this.');
    }
    if (document.querySelector('.present-overlay')) {
      warn('Found pre-existing .present-overlay in HTML — ppt-core.js auto-generates this.');
    }
    if (document.querySelector('.overview-overlay')) {
      warn('Found pre-existing .overview-overlay in HTML — ppt-core.js auto-generates this.');
    }

    var inlineStyles = document.querySelectorAll('style');
    inlineStyles.forEach(function (el) {
      var text = el.textContent || '';
      if (text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/:root\s*\{[^}]*\}/g, '').trim().length > 0) {
        warn('Found CSS rules beyond :root in <style>. Only :root variables should be inline — all other styles come from ppt-core.css.');
      }
    });

    var inlineScripts = document.querySelectorAll('script:not([src])');
    if (inlineScripts.length > 0) {
      warn('Found inline <script> block(s). All JS logic should come from ppt-core.js.');
    }
  }

  /* ══════════════════════════════════════
     INIT
     ══════════════════════════════════════ */

  function init() {
    selfCheck();
    buildSkeleton();

    const deck = document.getElementById('slide-deck');
    slides = Array.from(deck.querySelectorAll('.ppt-slide'));

    slides.forEach((s, i) => {
      const num = document.createElement('div');
      num.className = 'ppt-page-num';
      num.textContent = (i + 1) + ' / ' + slides.length;
      s.appendChild(num);
    });

    document.getElementById('tb-title').textContent = document.title;
    buildSidebar();
    buildOverview();
    goTo(0);

    document.addEventListener('keydown', onKey);
    initTouch();
    initOverviewBlankClick();
  }

  /* ══════════════════════════════════════
     EDITOR VIEW
     ══════════════════════════════════════ */

  function buildSidebar() {
    var sb = document.getElementById('sidebar');
    sb.innerHTML = '';
    var sidebarW = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-w')) || 220;
    var thumbScale = (sidebarW - 28) / W;
    slides.forEach(function (s, i) {
      var item = document.createElement('div');
      item.className = 'thumb-item' + (i === current ? ' active' : '');
      item.onclick = function () { goTo(i); };

      var inner = document.createElement('div');
      inner.className = 'thumb-inner';
      var clone = s.cloneNode(true);
      clone.style.cssText = 'width:' + W + 'px;height:' + H + 'px;transform:scale(' + thumbScale + ');transform-origin:top left;pointer-events:none;position:absolute;top:0;left:0;';
      inner.style.position = 'relative';
      inner.style.overflow = 'hidden';
      inner.appendChild(clone);
      item.appendChild(inner);

      var num = document.createElement('div');
      num.className = 'thumb-num';
      num.textContent = i + 1;
      item.appendChild(num);

      sb.appendChild(item);
    });
  }

  function updateSidebar() {
    var items = document.querySelectorAll('.thumb-item');
    items.forEach(function (el, i) {
      el.classList.toggle('active', i === current);
    });
    var active = items[current];
    if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function renderPreview() {
    var wrapper = document.getElementById('preview-wrapper');
    wrapper.innerHTML = '';

    var container = document.getElementById('main-preview');
    var maxW = container.clientWidth - 60;
    var maxH = container.clientHeight - 40;
    var scale = Math.min(maxW / W, maxH / H, 1);

    wrapper.style.width = W * scale + 'px';
    wrapper.style.height = H * scale + 'px';

    var clone = slides[current].cloneNode(true);
    clone.style.cssText = 'width:' + W + 'px;height:' + H + 'px;transform:scale(' + scale + ');transform-origin:top left;position:absolute;top:0;left:0;';
    wrapper.appendChild(clone);

    document.getElementById('tb-counter').textContent = (current + 1) + ' / ' + slides.length;
  }

  /* ══════════════════════════════════════
     NAVIGATION
     ══════════════════════════════════════ */

  function goTo(idx) {
    if (idx < 0 || idx >= slides.length || transitioning) return;
    if (idx === current && mode === 'present') return;
    var p = current;
    current = idx;

    if (mode === 'editor') {
      updateSidebar();
      renderPreview();
    } else if (mode === 'present') {
      transitionSlide(p, current);
    }
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  /* ══════════════════════════════════════
     PRESENTATION VIEW
     ══════════════════════════════════════ */

  function startPresent() {
    mode = 'present';
    transitioning = false;
    var overlay = document.getElementById('present-overlay');
    var stage = document.getElementById('present-stage');
    overlay.classList.add('active');

    stage.innerHTML = '';
    slides.forEach(function (s, i) {
      var clone = s.cloneNode(true);
      var pn = clone.querySelector('.ppt-page-num');
      if (pn) pn.style.display = 'none';
      if (i === current) clone.classList.add('current');
      stage.appendChild(clone);
    });

    fitStage();
    updatePresentUI();
    startCursorHide();
    window.addEventListener('resize', fitStage);
  }

  function exitPresent() {
    mode = 'editor';
    transitioning = false;
    document.getElementById('present-overlay').classList.remove('active');
    window.removeEventListener('resize', fitStage);
    stopCursorHide();
    updateSidebar();
    renderPreview();
  }

  function fitStage() {
    var stage = document.getElementById('present-stage');
    var scaleX = window.innerWidth / W;
    var scaleY = window.innerHeight / H;
    var s = Math.min(scaleX, scaleY);
    stage.style.transform = 'scale(' + s + ')';
    stage.style.transformOrigin = 'center center';
    stage.style.position = 'absolute';
    stage.style.left = (window.innerWidth - W) / 2 + 'px';
    stage.style.top = (window.innerHeight - H) / 2 + 'px';
  }

  function transitionSlide(fromIdx, toIdx) {
    transitioning = true;
    var stage = document.getElementById('present-stage');
    var children = stage.querySelectorAll('.ppt-slide');

    var slideTransition = slides[toIdx] && slides[toIdx].dataset.transition || 'slide';
    var transType = slideTransition;
    if (transType === 'slide') {
      transType = toIdx > fromIdx ? 'slide' : 'slide-rev';
    }
    stage.dataset.transition = transType;

    children.forEach(function (c, i) {
      c.classList.remove('current', 'leaving', 'entering');
      if (i === fromIdx) c.classList.add('current');
      else if (i === toIdx) c.classList.add('entering');
    });

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        children.forEach(function (c, i) {
          c.classList.remove('current', 'entering');
          if (i === fromIdx) c.classList.add('leaving');
          else if (i === toIdx) c.classList.add('current');
        });
        var speed = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--transition-speed')) || 0.4;
        setTimeout(function () { transitioning = false; }, speed * 1000 + 50);
      });
    });

    updatePresentUI();
  }

  function updatePresentUI() {
    var pct = slides.length > 1 ? (current / (slides.length - 1)) * 100 : 100;
    document.getElementById('present-progress').style.width = pct + '%';
    document.getElementById('present-counter').textContent = (current + 1) + ' / ' + slides.length;
  }

  /* Cursor auto-hide */
  function startCursorHide() {
    document.getElementById('present-overlay').addEventListener('mousemove', resetCursorTimer);
    resetCursorTimer();
  }
  function stopCursorHide() {
    var overlay = document.getElementById('present-overlay');
    overlay.removeEventListener('mousemove', resetCursorTimer);
    overlay.classList.remove('hide-cursor');
    clearTimeout(cursorTimer);
  }
  function resetCursorTimer() {
    var overlay = document.getElementById('present-overlay');
    overlay.classList.remove('hide-cursor');
    clearTimeout(cursorTimer);
    cursorTimer = setTimeout(function () { overlay.classList.add('hide-cursor'); }, 3000);
  }

  /* ══════════════════════════════════════
     OVERVIEW VIEW
     ══════════════════════════════════════ */

  function buildOverview() {
    var grid = document.getElementById('overview-grid');
    grid.innerHTML = '';
    slides.forEach(function (s, i) {
      var item = document.createElement('div');
      item.className = 'overview-item' + (i === current ? ' active' : '');
      item.onclick = function () { current = i; exitOverview(); startPresent(); };

      var inner = document.createElement('div');
      inner.className = 'overview-item-inner';
      var clone = s.cloneNode(true);
      clone.style.cssText = 'width:' + W + 'px;height:' + H + 'px;transform-origin:top left;pointer-events:none;position:absolute;top:0;left:0;';
      inner.appendChild(clone);
      item.appendChild(inner);

      var num = document.createElement('div');
      num.className = 'overview-num';
      num.textContent = i + 1;
      item.appendChild(num);

      grid.appendChild(item);
    });
    scaleOverviewItems();
  }

  function scaleOverviewItems() {
    document.querySelectorAll('.overview-item-inner').forEach(function (inner) {
      var clone = inner.querySelector('.ppt-slide');
      if (!clone) return;
      var sc = inner.clientWidth / W;
      clone.style.transform = 'scale(' + sc + ')';
    });
  }

  function toggleOverview() {
    if (mode === 'overview') {
      exitOverview();
    } else {
      if (mode === 'present') exitPresent();
      enterOverview();
    }
  }

  function enterOverview() {
    mode = 'overview';
    document.querySelectorAll('.overview-item').forEach(function (el, i) {
      el.classList.toggle('active', i === current);
    });
    document.getElementById('overview-overlay').classList.add('active');
    requestAnimationFrame(scaleOverviewItems);
  }

  function exitOverview() {
    mode = 'editor';
    document.getElementById('overview-overlay').classList.remove('active');
    updateSidebar();
    renderPreview();
  }

  function initOverviewBlankClick() {
    document.getElementById('overview-overlay').addEventListener('click', function (e) {
      if (!e.target.closest('.overview-item')) {
        exitOverview();
      }
    });
  }

  /* ══════════════════════════════════════
     KEYBOARD
     ══════════════════════════════════════ */

  function onKey(e) {
    if (e.key >= '1' && e.key <= '9' && !e.ctrlKey && !e.metaKey) {
      var idx = parseInt(e.key) - 1;
      if (idx < slides.length) { goTo(idx); e.preventDefault(); }
      return;
    }

    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': case ' ': case 'PageDown':
        e.preventDefault();
        if (mode === 'overview') return;
        next();
        break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp':
        e.preventDefault();
        if (mode === 'overview') return;
        prev();
        break;
      case 'Home':
        e.preventDefault(); goTo(0); break;
      case 'End':
        e.preventDefault(); goTo(slides.length - 1); break;
      case 'F5':
        e.preventDefault();
        if (mode === 'present') exitPresent();
        else { if (mode === 'overview') exitOverview(); startPresent(); }
        break;
      case 'o': case 'O':
        if (e.ctrlKey || e.metaKey) return;
        e.preventDefault();
        toggleOverview();
        break;
      case 'Escape':
        if (mode === 'present') exitPresent();
        else if (mode === 'overview') exitOverview();
        break;
    }
  }

  /* ══════════════════════════════════════
     TOUCH
     ══════════════════════════════════════ */

  function initTouch() {
    var startX = 0, startY = 0;
    var overlay = document.getElementById('present-overlay');

    overlay.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    overlay.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 40 && Math.abs(dy) < 40) {
        next();
        return;
      }
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx < -40) next();
        else if (dx > 40) prev();
      }
    }, { passive: true });

    overlay.addEventListener('click', function (e) {
      if (e.target.closest('.tb-btn, button')) return;
      next();
    });
  }

  /* ══════════════════════════════════════
     EXPORT
     ══════════════════════════════════════ */

  function canvasToBlob(canvas) {
    return new Promise(function (resolve) { canvas.toBlob(resolve, 'image/png'); });
  }

  function renderSlideCanvas(slideEl) {
    var deck = document.getElementById('slide-deck');
    deck.style.visibility = 'visible';

    return html2canvas(slideEl, {
      scale: SCALE, useCORS: true, backgroundColor: null,
      width: W, height: H, logging: false,
    }).then(function (canvas) {
      deck.style.visibility = 'hidden';
      return canvas;
    });
  }

  function downloadAll() {
    if (typeof html2canvas === 'undefined' || typeof JSZip === 'undefined' || typeof saveAs === 'undefined') {
      alert('导出依赖加载失败，请检查网络连接后刷新页面重试。');
      return;
    }
    var counter = document.getElementById('tb-counter');
    var zip = new JSZip();
    var total = slides.length;
    var fileBase = (document.title || 'ppt').replace(/[\\/:*?"<>|]+/g, '-');

    var chain = Promise.resolve();
    for (var i = 0; i < total; i++) {
      (function (idx) {
        chain = chain.then(function () {
          counter.textContent = '渲染 ' + (idx + 1) + '/' + total + '...';
          return renderSlideCanvas(slides[idx]).then(function (canvas) {
            return canvasToBlob(canvas);
          }).then(function (blob) {
            zip.file(fileBase + '-' + String(idx + 1).padStart(2, '0') + '.png', blob);
          }).catch(function (e) {
            console.error(e);
            counter.textContent = '第 ' + (idx + 1) + ' 张失败，跳过';
            return new Promise(function (r) { setTimeout(r, 800); });
          });
        });
      })(i);
    }

    chain.then(function () {
      counter.textContent = '打包 ZIP...';
      return zip.generateAsync({ type: 'blob' });
    }).then(function (zipBlob) {
      saveAs(zipBlob, fileBase + '-slides.zip');
      counter.textContent = (current + 1) + ' / ' + total;
    });
  }

  function downloadLongImage() {
    if (typeof html2canvas === 'undefined' || typeof saveAs === 'undefined') {
      alert('导出依赖加载失败，请检查网络连接后刷新页面重试。');
      return;
    }
    var counter = document.getElementById('tb-counter');
    var total = slides.length;
    var fileBase = (document.title || 'ppt').replace(/[\\/:*?"<>|]+/g, '-');

    var maxCanvasH = 32767;
    var neededH = total * H * SCALE;
    if (neededH > maxCanvasH) {
      alert('页数过多（' + total + ' 页），长图高度 ' + neededH + 'px 超出浏览器限制。请使用 ZIP 打包导出。');
      return;
    }

    var finalCanvas = document.createElement('canvas');
    finalCanvas.width = W * SCALE;
    finalCanvas.height = neededH;
    var ctx = finalCanvas.getContext('2d');

    var chain = Promise.resolve();
    for (var i = 0; i < total; i++) {
      (function (idx) {
        chain = chain.then(function () {
          counter.textContent = '长图 ' + (idx + 1) + '/' + total + '...';
          return renderSlideCanvas(slides[idx]).then(function (canvas) {
            ctx.drawImage(canvas, 0, idx * H * SCALE);
          }).catch(function (e) {
            console.error(e);
            counter.textContent = '第 ' + (idx + 1) + ' 张失败';
            return new Promise(function (r) { setTimeout(r, 800); });
          });
        });
      })(i);
    }

    chain.then(function () {
      counter.textContent = '生成长图...';
      return canvasToBlob(finalCanvas);
    }).then(function (blob) {
      saveAs(blob, fileBase + '-长图.png');
      counter.textContent = (current + 1) + ' / ' + total;
    });
  }

  /* ── Expose to global ── */
  window.startPresent = startPresent;
  window.toggleOverview = toggleOverview;
  window.downloadAll = downloadAll;
  window.downloadLongImage = downloadLongImage;
  window._prev = prev;
  window._next = next;

  /* ── Boot ── */
  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('resize', function () {
    if (mode === 'editor') renderPreview();
  });
})();
