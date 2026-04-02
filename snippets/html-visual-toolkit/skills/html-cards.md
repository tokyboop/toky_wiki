---
name: "html-cards"
description: "卡片分享图和长图文模式。将长内容压缩为 540px 宽的卡片系列或不限高长文，支持导出图片和 ZIP。"
version: 1
triggers:
  - "做成卡片"
  - "小红书分享图"
  - "做成分享图"
  - "做成图片分享"
  - "做成可视化"
  - "卡片式"
  - "做张图"
  - "做成图"
  - "做成图片"
  - "生成图片"
  - "图文并茂"
  - "长内容完整输出"
  - "做成长图"
  - "长图文"
  - "可视化输出"
  - "漂亮一点输出"
  - "排版好看点"
  - "美化输出"
---

# html-cards（卡片 / 长文模式）

将长内容压缩为可视化卡片系列或长图文。配色方案见 `html-visual`。

## 两种子模式

| 子模式 | 容器 | 尺寸 | 场景 |
|---|---|---|---|
| 卡片模式（默认） | `.slide` | 540x675px (4:5) | 小红书/Instagram 分享图 |
| 长文模式 | `.long-canvas` | 540px 宽，不限高 | 完整长图文输出 |

## 工作流程

### 1. 内容压缩（最关键的一步）

**原则：每张卡片 5 秒可读。**

- 提取核心论点和金句，删去展开论述
- 每张卡片只承载 1 个核心观点
- 用短句、断行、强调色引导视线
- 适合的文案量：每张卡片 50-80 字正文

### 2. 卡片规划

标准结构（可根据内容调整）：

| 序号 | 类型 | 背景 | 内容 |
|---|---|---|---|
| 1 | 封面 | 深色 | 大标题 + 副标题 + 标签 |
| 2-N | 内容页 | 深浅交替 | 观点 + 论据/图解 |
| N+1 | 结尾 | 深色 | 总结金句 |

### 3. 卡片模式可用组件

| 组件 | 用途 | CSS 类名 |
|---|---|---|
| **标题** | 每张卡片顶部 | `.title-main` |
| **强调条** | 标题下方装饰 | `.accent-bar` |
| **文字块** | 正文短段 | `.text-block` |
| **高亮框** | 关键引用/总结 | `.highlight-box` |
| **卡片组** | 并列概念 | `.card-grid` + `.card-item` |
| **映射表** | 对照关系 | `.mapping-table` |
| **步骤列表** | 顺序流程 | `.step-list` + `.step-item` |
| **标签组** | 分类标签 | `.tags` + `.tag` |

### 4. 长文模式附加组件

如果用户需要输出"不限高的连贯长文"或"更硬核的系统结构分析"，请不要使用定高的 `.slide` 标签，而是将**所有的内容包裹在一个 `.long-canvas` 容器中**。

| 组件 | 适用场景 | CSS 类名结构 |
|---|---|---|
| **板块标题** | 大段落或章节之前 | `<div class="section-title">01 标题</div>` |
| **系统分层** | 描述 L0/L1/L2/L3 系统设计 | `.layer-stack` > `.layer layer-L0/1/2/3` > `.layer-badge` + `.layer-content` |
| **智能体标签** | 在分层内部标注所属 Agent | `.agent-tags` > `.agent-tag` |
| **工作流展开** | 工作流介绍 | `.wf-detail open` > `.wf-detail-header` + `.wf-body` |
| **流程图阶段** | 工作流的连续阶段 | `.phase-flow` > `.phase-item` > `.phase-left` (`.phase-circle`) + `.phase-right` |
| **说明盒子** | 解释"这是什么"等前置摘要 | `.what-box` > `h3` + `p` |

## 强制要求

- 每张卡片必须是 `.slide`，固定 `width: 540px; height: 675px`
- 卡片深浅交替：奇数深色（`.dark`），偶数浅色（`.light`）
- 每张卡片右下角必须有 `.page-num` 显示 `N/总数`
- body 背景使用 `var(--bg-body)`，`padding-top: 70px` 给工具栏让位
- 导出文件名：`html-output/[来源文件名]-cards.html`（所有 HTML 可视化产出统一放在 `html-output/` 子文件夹）

## 完整 HTML 模板

以下是完整的自包含模板，生成时基于此模板修改内容区域即可：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[标题]</title>
  <style>
    /* ── Variables (根据主题替换) ── */
    :root {
      --bg-body: #f5f5f5;
      --bg-slide-dark: #2c2c2c;
      --bg-slide-light: #ffffff;
      --accent: #2b6cb0;
      --text-dark: #f0f0f0;
      --text-dark-muted: rgba(240, 240, 240, 0.5);
      --text-light: #1a1a1a;
      --text-light-muted: #6b7280;
      --bg-chrome: #ffffff;
      --bg-chrome-hover: #f0f0f0;
      --border-chrome: #e0e0e0;
      --text-chrome: #1a1a1a;
      --text-chrome-muted: #6b7280;
      --font-stack: -apple-system, 'PingFang SC', 'Helvetica Neue', 'Noto Sans SC', sans-serif;
    }

    /* ── Reset + Body ── */
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--bg-body);
      padding-top: 70px;
      font-family: var(--font-stack);
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }

    /* ── Toolbar ── */
    .export-toolbar {
      position: fixed; top: 0; left: 0; width: 100%; height: 60px;
      background: var(--bg-chrome); display: flex; justify-content: center;
      align-items: center; gap: 16px; z-index: 1000;
      border-bottom: 1px solid var(--border-chrome);
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .btn {
      padding: 8px 16px; border-radius: 4px; font-size: 14px;
      font-weight: 500; cursor: pointer; border: none; transition: all 0.2s;
    }
    .btn-primary { background: var(--accent); color: #fff; }
    .btn-primary:hover { opacity: 0.85; }
    .btn-secondary { background: var(--bg-chrome-hover); color: var(--text-chrome-muted); border: 1px solid var(--border-chrome); }
    .btn-secondary:hover { background: var(--border-chrome); color: var(--text-chrome); }
    .progress-text {
      color: var(--text-chrome-muted); font-size: 12px; min-width: 120px; text-align: center;
    }

    /* ── Slide (Card) ── */
    .slide {
      width: 540px; height: 675px;
      position: relative; overflow: hidden;
      border-radius: 8px; margin-bottom: 40px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.5);
      flex-shrink: 0; display: flex; flex-direction: column;
      padding: 28px; box-sizing: border-box;
    }
    .slide.dark { background: var(--bg-slide-dark); color: var(--text-dark); }
    .slide.light { background: var(--bg-slide-light); color: var(--text-light); }

    /* ── Typography ── */
    h1, h2, h3 { margin: 0; font-weight: 700; }
    p { margin: 0; }

    .title-main {
      font-size: 28px; line-height: 1.3; margin-bottom: 16px;
      text-align: center; letter-spacing: -0.5px;
    }
    .accent-bar {
      width: 40px; height: 4px; background: var(--accent);
      margin: 0 auto 20px; border-radius: 2px;
    }
    .subtitle {
      font-size: 14px; text-align: center; opacity: 0.8; margin-bottom: 20px;
    }
    .page-num {
      position: absolute; bottom: 20px; right: 28px;
      font-size: 12px; opacity: 0.4;
    }

    /* ── Text Block ── */
    .text-block { font-size: 16px; line-height: 1.6; }
    .text-block strong { font-weight: 700; }
    .dark .text-block strong { color: var(--text-dark); }
    .light .text-block strong { color: var(--text-light); }

    /* ── Highlight Box ── */
    .highlight-box {
      background: color-mix(in srgb, var(--accent) 15%, transparent);
      border-left: 4px solid var(--accent);
      padding: 16px; font-size: 14px; line-height: 1.6;
      margin-top: auto; border-radius: 0 4px 4px 0;
    }
    .light .highlight-box { background: color-mix(in srgb, var(--accent) 10%, transparent); }

    /* ── Card Grid ── */
    .card-grid {
      display: flex; flex-direction: column; gap: 16px;
      flex: 1; justify-content: center; margin-top: 20px;
    }
    .card-item {
      background: rgba(0,0,0,0.2); padding: 16px;
      border-radius: 8px; font-size: 14px; line-height: 1.6;
    }
    .light .card-item { background: rgba(0,0,0,0.04); }
    .card-title {
      font-weight: bold; font-size: 16px; margin-bottom: 8px;
      display: block; color: var(--accent);
    }

    /* ── Mapping Table ── */
    .mapping-table {
      font-size: 15px; line-height: 1.8; width: 100%;
      border-collapse: collapse; margin-top: 20px;
    }
    .mapping-table td {
      padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .light .mapping-table td { border-bottom: 1px solid rgba(0,0,0,0.1); }
    .mapping-table tr:last-child td { border-bottom: none; }
    .mapping-key {
      color: var(--accent); font-weight: bold; white-space: nowrap; width: 35%;
    }
    .mapping-val { text-align: left; }

    /* ── Step List ── */
    .step-list {
      display: flex; flex-direction: column; gap: 20px; margin-top: 20px;
    }
    .step-item {
      display: flex; align-items: flex-start; gap: 16px;
      font-size: 14px; line-height: 1.6;
    }
    .step-num {
      width: 24px; height: 24px; background: var(--accent); color: #fff;
      border-radius: 50%; display: flex; align-items: center;
      justify-content: center; font-size: 12px; font-weight: bold;
      flex-shrink: 0; margin-top: 2px;
    }
    .step-content strong {
      display: block; color: var(--accent); margin-bottom: 4px; font-size: 16px;
    }

    /* ── Tags ── */
    .tags {
      margin-top: 30px; display: flex; gap: 12px;
      justify-content: center; flex-wrap: wrap;
    }
    .tag {
      font-size: 12px; padding: 6px 12px; border-radius: 16px;
      background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
    }
    .light .tag {
      background: rgba(0,0,0,0.05); border-color: rgba(0,0,0,0.1);
    }

    /* ── Cover / Ending ── */
    .slide-cover {
      justify-content: center; align-items: center;
    }
    .slide-ending {
      justify-content: center; align-items: center; text-align: center;
    }
    .final-text { font-size: 32px; line-height: 1.6; font-weight: 700; }
    .small-muted { margin-top: 40px; font-size: 16px; opacity: 0.5; line-height: 1.5; }
    .footer {
      position: absolute; bottom: 20px; left: 0; width: 100%;
      text-align: center; font-size: 12px; opacity: 0.3;
    }

    /* ── Info Row ── */
    .info-row {
      display: flex; align-items: center;
      padding: 12px 16px; border-radius: 8px; margin-bottom: 8px;
    }
    .info-row.on-dark { background: rgba(255,255,255,0.06); }
    .info-row.on-light { background: rgba(58,46,40,0.06); }
    .info-row .label {
      font-size: 13px; font-weight: 700; min-width: 70px; color: var(--accent);
    }
    .info-row .value { font-size: 13px; flex: 1; }
    .info-row.on-dark .value { color: var(--text-dark-muted); }
    .info-row.on-light .value { color: var(--text-light-muted); }

    /* ── Quote Block ── */
    .quote-block {
      border-left: 3px solid var(--accent);
      padding: 12px 16px; margin: 16px 0;
      font-size: 15px; line-height: 1.7; font-style: italic;
    }
    .dark .quote-block { color: var(--text-dark-muted); }
    .light .quote-block { color: var(--text-light-muted); }

    /* ── Spacer ── */
    .spacer { flex: 1; }

    /* ── Long Canvas (Unbounded Height) ── */
    .long-canvas {
      width: 540px;
      min-height: 675px;
      position: relative;
      border-radius: 8px;
      margin-bottom: 40px;
      padding: 40px 32px;
      box-sizing: border-box;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      background: var(--bg-slide-light);
      color: var(--text-light);
    }
    .long-canvas.dark {
      background: var(--bg-slide-dark);
      color: var(--text-dark);
    }
    .long-canvas .section-title {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .dark .long-canvas .section-title { color: var(--accent); }
    .dark .long-canvas .section-title::after { background: color-mix(in srgb, var(--accent) 30%, transparent); }
    .long-canvas .section-title::after {
      content: '';
      flex: 1;
      height: 1px;
      background: color-mix(in srgb, var(--accent) 25%, transparent);
    }

    /* Layer Stack */
    .layer-stack {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 32px;
    }
    .layer {
      border-radius: 14px;
      padding: 20px 24px;
      display: flex;
      align-items: flex-start;
      gap: 16px;
      background: color-mix(in srgb, var(--accent) 8%, var(--bg-slide-light));
      border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
    }
    .long-canvas.dark .layer {
      background: rgba(255,255,255,0.05);
      border-color: rgba(255,255,255,0.1);
    }
    .layer-badge {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1px;
      padding: 4px 10px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--accent) 25%, transparent);
      color: var(--accent);
    }
    .layer-content h3 { font-size: 15px; font-weight: 700; margin-bottom: 6px; }
    .layer-content p { font-size: 13px; line-height: 1.5; }
    .long-canvas .layer-content p { opacity: 0.8; }
    .agent-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
    .agent-tag {
      font-size: 11px; padding: 3px 8px; border-radius: 6px;
      font-family: 'SF Mono', 'Menlo', monospace;
      background: color-mix(in srgb, var(--accent) 12%, var(--bg-slide-light));
      color: var(--accent);
      border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
    }
    .long-canvas.dark .agent-tag { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); color: var(--accent); }

    /* Workflow Detail */
    .wf-detail {
      margin-bottom: 24px;
      background: var(--bg-slide-light);
      border: 1px solid color-mix(in srgb, var(--accent) 15%, transparent);
      border-radius: 16px;
      overflow: hidden;
    }
    .long-canvas.dark .wf-detail { background: rgba(0,0,0,0.2); border-color: rgba(255,255,255,0.05); }
    .wf-detail-header {
      background: color-mix(in srgb, var(--accent) 8%, var(--bg-slide-light));
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
    }
    .long-canvas.dark .wf-detail-header { background: rgba(255,255,255,0.05); }
    .wf-icon { font-size: 24px; }
    .wf-meta { flex: 1; }
    .wf-meta h3 { font-size: 16px; font-weight: 700; margin-bottom: 2px; }
    .wf-meta p { font-size: 12px; color: var(--text-light-muted); }
    .long-canvas.dark .wf-meta p { color: var(--text-dark-muted); }
    .expand-icon { color: var(--text-light-muted); font-size: 12px; transition: transform 0.3s; }
    .wf-detail.open .expand-icon { transform: rotate(180deg); }
    .wf-body { display: none; padding: 0 20px 20px; }
    .wf-detail.open .wf-body { display: block; }

    /* Agents Strip */
    .wf-agents-row {
      display: flex; flex-wrap: wrap; gap: 8px;
      padding: 12px 0;
      border-bottom: 1px solid color-mix(in srgb, var(--accent) 15%, transparent);
      margin-bottom: 16px;
    }
    .long-canvas.dark .wf-agents-row { border-color: rgba(255,255,255,0.1); }
    .wf-agent-chip {
      display: flex; align-items: center; gap: 6px;
      background: color-mix(in srgb, var(--accent) 8%, var(--bg-slide-light));
      border: 1px solid color-mix(in srgb, var(--accent) 15%, transparent);
      border-radius: 8px; padding: 4px 8px; font-size: 11px;
    }
    .long-canvas.dark .wf-agent-chip { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); color: var(--text-dark); }

    /* Phase Flow */
    .phase-flow { display: flex; flex-direction: column; gap: 0; }
    .phase-item {
      display: grid; grid-template-columns: 60px 1fr; gap: 0;
      position: relative;
    }
    .phase-item:not(:last-child)::after {
      content: ''; position: absolute; left: 28px; top: 36px; bottom: 0; width: 2px;
      background: linear-gradient(to bottom, color-mix(in srgb, var(--accent) 25%, transparent), transparent);
    }
    .phase-left { display: flex; flex-direction: column; align-items: center; padding-top: 12px; padding-bottom: 20px; position: relative; z-index: 1; }
    .phase-circle {
      width: 32px; height: 32px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 800; color: #fff; flex-shrink: 0;
      box-shadow: 0 0 0 4px var(--bg-slide-light);
      background: var(--accent);
    }
    .long-canvas.dark .phase-circle { box-shadow: 0 0 0 4px var(--bg-slide-dark); background: var(--accent); }
    .phase-right { padding: 12px 0 20px 12px; }
    .phase-right h4 { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
    .io-row { display: flex; gap: 8px; margin-top: 8px; }
    .io-box { background: rgba(0,0,0,0.03); padding: 8px; border-radius: 6px; font-size: 11px; flex: 1; }
    .long-canvas.dark .io-box { background: rgba(255,255,255,0.05); }

    /* What Box */
    .what-box {
      background: color-mix(in srgb, var(--accent) 5%, var(--bg-slide-light));
      border: 1px solid color-mix(in srgb, var(--accent) 15%, transparent);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 32px;
      position: relative;
      overflow: hidden;
    }
    .long-canvas.dark .what-box { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.1); }
    .what-box::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: var(--accent);
    }
    .what-box h3 { font-size: 16px; font-weight: 700; margin-bottom: 8px; color: var(--text-light); }
    .long-canvas.dark .what-box h3 { color: var(--text-dark); }
    .what-box p { font-size: 14px; color: var(--text-light-muted); line-height: 1.6; }
    .long-canvas.dark .what-box p { color: var(--text-dark-muted); }
  </style>
</head>
<body>
  <div class="export-toolbar no-export" data-html2canvas-ignore="true">
    <button class="btn btn-primary" onclick="downloadLongImage()">导出长图</button>
    <button class="btn btn-secondary" onclick="downloadAll()">批量卡片 (ZIP)</button>
    <button class="btn btn-secondary" onclick="downloadOne()">单页下载</button>
    <span class="progress-text" id="progress">准备就绪</span>
  </div>

  <!-- 模式 A：卡片模式（默认） -->
  <div class="slide dark slide-cover">
    <div class="title-main" style="font-size:32px; display:flex; flex-direction:column; gap:12px;">
      <span>第一行大标题</span>
      <span>第二行大标题</span>
    </div>
    <div class="accent-bar"></div>
    <div class="subtitle">副标题说明</div>
    <div class="tags">
      <span class="tag">标签1</span>
      <span class="tag">标签2</span>
    </div>
    <div class="page-num">1/N</div>
  </div>

  <div class="slide light">
    <h2 class="title-main">观点标题</h2>
    <div class="accent-bar"></div>
    <div class="text-block">
      <p>核心观点...</p>
    </div>
    <div class="highlight-box">关键引用或总结</div>
    <div class="page-num">2/N</div>
  </div>

  <!-- 更多 slide... -->

  <div class="slide dark slide-ending">
    <div class="final-text">总结金句</div>
    <div class="small-muted">补充说明</div>
    <div class="footer"></div>
    <div class="page-num">N/N</div>
  </div>

  <!-- 模式 B：长文模式（如果不限高输出，就不使用 slide） -->
  <!-- <div class="long-canvas light">...全部内容...</div> -->

  <!-- 导出依赖（CDN） -->
  <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js"></script>
  <script>
    const SCALE = 2;
    const DARK_BG = getComputedStyle(document.documentElement).getPropertyValue('--bg-slide-dark').trim() || '#2c2c2c';
    const LIGHT_BG = getComputedStyle(document.documentElement).getPropertyValue('--bg-slide-light').trim() || '#ffffff';
    function slideBg(slide) { return slide.classList.contains('dark') ? DARK_BG : LIGHT_BG; }
    function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

    async function renderSlide(slide) {
      slide.scrollIntoView({ block: 'center' });
      await delay(120);
      return html2canvas(slide, {
        scale: SCALE,
        useCORS: true,
        backgroundColor: slideBg(slide),
        width: 540,
        height: 675,
        scrollX: 0,
        scrollY: -window.scrollY,
        logging: false,
      });
    }

    function canvasToBlob(canvas) {
      return new Promise((resolve, reject) => {
        canvas.toBlob(b => { if (b) resolve(b); else reject(new Error('toBlob returned null')); }, 'image/png');
      });
    }

    async function downloadOne() {
      const slides = document.querySelectorAll('.slide');
      const viewportCenter = window.innerHeight / 2;
      let closest = 0, minDist = Infinity;
      slides.forEach((s, i) => {
        const rect = s.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - viewportCenter);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      const slide = slides[closest];
      if (!slide) return;
      const progress = document.getElementById('progress');
      progress.textContent = '渲染中...';
      try {
        const canvas = await renderSlide(slide);
        const blob = await canvasToBlob(canvas);
        const num = String(closest + 1).padStart(2, '0');
        const fileBase = (document.title || 'cards').replace(/[\\/:*?"<>|]+/g, '-');
        saveAs(blob, `${fileBase}-${num}.png`);
        progress.textContent = `第 ${closest + 1} 张已下载`;
      } catch (e) {
        console.error(e);
        progress.textContent = '下载失败';
      }
    }

    async function downloadAll() {
      const slides = document.querySelectorAll('.slide');
      const progress = document.getElementById('progress');
      const zip = new JSZip();
      const total = slides.length;
      let ok = 0, fail = 0;
      const fileBase = (document.title || 'cards').replace(/[\\/:*?"<>|]+/g, '-');
      for (let i = 0; i < total; i++) {
        progress.textContent = `渲染第 ${i + 1}/${total} 张...`;
        try {
          const canvas = await renderSlide(slides[i]);
          const blob = await canvasToBlob(canvas);
          const num = String(i + 1).padStart(2, '0');
          zip.file(`${fileBase}-${num}.png`, blob);
          ok++;
        } catch (e) {
          console.error(`Card ${i+1} failed:`, e);
          fail++;
          progress.textContent = `第 ${i + 1} 张失败，继续...`;
          await delay(300);
        }
      }
      if (ok === 0) { progress.textContent = '全部失败，请检查控制台'; return; }
      progress.textContent = '打包 ZIP 中...';
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${fileBase}-系列卡片.zip`);
      progress.textContent = fail ? `${ok} 张已打包，${fail} 张失败` : `${total} 张图片已打包下载`;
    }

    async function downloadLongImage() {
      const progress = document.getElementById('progress');
      const fileBase = (document.title || 'cards').replace(/[\\/:*?"<>|]+/g, '-');

      const longCanvas = document.querySelector('.long-canvas');
      if (longCanvas) {
        progress.textContent = '正在生成长图...';
        const lcBg = longCanvas.classList.contains('dark') ? DARK_BG : LIGHT_BG;
        try {
          const canvas = await html2canvas(longCanvas, {
            scale: SCALE,
            useCORS: true,
            backgroundColor: lcBg,
            width: 540,
            height: longCanvas.scrollHeight || longCanvas.clientHeight,
            windowWidth: 540,
            windowHeight: longCanvas.scrollHeight || longCanvas.clientHeight,
            scrollY: 0,
            logging: false,
          });
          const blob = await canvasToBlob(canvas);
          saveAs(blob, `${fileBase}-长图.png`);
          progress.textContent = '长图已下载';
        } catch (e) {
          console.error(e);
          progress.textContent = '生成长图失败';
        }
        return;
      }

      const slides = document.querySelectorAll('.slide');
      const totalHeight = slides.length * 675;
      const maxWidth = 540;

      progress.textContent = '渲染长图中...';

      try {
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = maxWidth * SCALE;
        finalCanvas.height = totalHeight * SCALE;
        const ctx = finalCanvas.getContext('2d');

        for (let i = 0; i < slides.length; i++) {
          progress.textContent = `合成第 ${i + 1}/${slides.length} 张...`;
          const canvas = await renderSlide(slides[i]);
          ctx.drawImage(canvas, 0, i * 675 * SCALE);
        }

        const blob = await canvasToBlob(finalCanvas);
        saveAs(blob, `${fileBase}-长图.png`);
        progress.textContent = '长图已下载';
      } catch (e) {
        console.error(e);
        progress.textContent = '长图下载失败';
      }
    }
  </script>
</body>
</html>
```
