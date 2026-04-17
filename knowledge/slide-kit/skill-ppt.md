# skill-ppt — 演示文稿生成规范

触发词：做成PPT / 做个演示 / 做个方案 / 做个汇报 / 出个slides / 做成报告

---

## 文件结构

每个 HTML 文件必须引用以下运行时文件（与 HTML 同目录）：
```html
<link rel="stylesheet" href="ppt-base.css">
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js"></script>
<script src="ppt-runtime.js"></script>
```

Slides 放在隐藏容器里，runtime 自动构建 UI：
```html
<div id="slide-deck" style="position:absolute;left:-9999px;top:0;visibility:hidden">
  <!-- 每张 slide 放这里 -->
</div>
```

工具栏 HTML（固定结构，复制粘贴不改）：
```html
<div class="toolbar">
  <span class="tb-title" id="tb-title"></span>
  <span class="tb-counter" id="tb-counter">1 / N</span>
  <span class="spacer"></span>
  <button class="tb-btn tb-btn-default" onclick="pptToggleOverview()">概览 (O)</button>
  <span class="tb-sep"></span>
  <button class="tb-btn tb-btn-primary" onclick="pptStartPresent()">演示 (F5)</button>
  <span class="tb-sep"></span>
  <button class="tb-btn tb-btn-default" onclick="pptDownloadLongImage()">导出长图</button>
  <button class="tb-btn tb-btn-default" onclick="pptDownloadAll()">ZIP 打包</button>
  <span class="tb-sep"></span>
  <span class="tb-author">toky</span>
</div>

<div class="editor-view" id="editor-view">
  <div class="sidebar" id="sidebar"></div>
  <div class="main-preview" id="main-preview">
    <div class="nav-zone nav-zone-prev" onclick="pptPrev()"><div class="nav-zone-icon">&lt;</div></div>
    <div class="preview-wrapper" id="preview-wrapper"></div>
    <div class="nav-zone nav-zone-next" onclick="pptNext()"><div class="nav-zone-icon">&gt;</div></div>
  </div>
</div>

<div class="present-overlay" id="present-overlay">
  <div class="present-stage" id="present-stage" data-transition="slide"></div>
  <div class="present-progress" id="present-progress" style="width:0%"></div>
  <div class="present-counter" id="present-counter">1 / N</div>
</div>

<div class="overview-overlay" id="overview-overlay">
  <div class="overview-grid" id="overview-grid"></div>
</div>
```

---

## 主题配色

根据文件类型写入 HTML 的 `:root`：

### dark（活动方案 / 游戏内容 / 对外提案）
```css
:root {
  --bg-body:          #1a1a1a;
  --bg-slide-dark:    #0d1117;
  --bg-slide-light:   #ffffff;
  --accent:           #22c55e;
  --accent-dim:       rgba(34,197,94,0.12);
  --accent-border:    rgba(34,197,94,0.22);
  --text-dark:        #f0f6ff;
  --text-dark-muted:  rgba(240,246,255,0.45);
  --text-light:       #0f172a;
  --text-light-muted: #64748b;
  --bg-chrome:        #161b22;
  --bg-chrome-hover:  #21262d;
  --border-chrome:    #30363d;
  --text-chrome:      #c9d1d9;
  --text-chrome-muted:#8b949e;
  --font-stack: -apple-system,'PingFang SC','Helvetica Neue','Noto Sans SC',sans-serif;
  --sidebar-w: 220px;
  --transition-speed: 0.4s;
}
```

### light（周报 / 月报 / 数据汇报 / 内部文档）
```css
:root {
  --bg-body:          #e2e8f0;
  --bg-slide-dark:    #0f172a;
  --bg-slide-light:   #ffffff;
  --accent:           #2563eb;
  --accent-dim:       rgba(37,99,235,0.08);
  --accent-border:    rgba(37,99,235,0.2);
  --text-dark:        #f1f5f9;
  --text-dark-muted:  rgba(241,245,249,0.5);
  --text-light:       #0f172a;
  --text-light-muted: #64748b;
  --bg-chrome:        #ffffff;
  --bg-chrome-hover:  #f1f5f9;
  --border-chrome:    #e2e8f0;
  --text-chrome:      #334155;
  --text-chrome-muted:#94a3b8;
  --font-stack: -apple-system,'PingFang SC','Helvetica Neue','Noto Sans SC',sans-serif;
  --sidebar-w: 220px;
  --transition-speed: 0.4s;
}
```

---

## 通用 CSS（每个 HTML 都要写，放在 ppt-base.css 之后的 `<style>` 里）

```css
/* 统一标题区：左侧色条 + 标题文字 */
.slide-hd { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
.slide-hd::before { content: ''; width: 4px; height: 30px; background: var(--accent); border-radius: 2px; flex-shrink: 0; }
.slide-hd h2 { font-size: 24px; font-weight: 800; letter-spacing: -0.3px; }
.slide.dark .slide-hd h2 { color: var(--text-dark); }
.slide.light .slide-hd h2 { color: var(--text-light); }

/* 高亮条 */
.highlight { background: var(--accent-dim); border-left: 3px solid var(--accent); padding: 11px 16px; font-size: 13px; line-height: 1.65; border-radius: 0 6px 6px 0; margin-top: 18px; }
.slide.dark .highlight { color: var(--text-dark); }
.slide.light .highlight { color: var(--text-light); }
```

---

## Layout 类型

每张 slide：`<div class="slide dark|light">`，`dark` = 深色背景，`light` = 白色背景

过渡动画（加在 slide 上）：`data-transition="slide|fade|zoom|none"`，默认 slide

---

### 1. 封面（cover）

左对齐大标题，左侧绿色横条为视觉锚点，背景大字水印做质感。

```html
<div class="slide dark slide-cover" data-transition="fade">
  <div class="cover-inner">
    <div class="cover-bar"></div>
    <div class="cover-tag">标签 · 子标签 · 年份</div>
    <div class="title-xl">主标题<em>高亮词</em><br>第二行</div>
    <div class="cover-divider"></div>
    <div class="subtitle">副标题说明文字</div>
    <div class="meta">日期 · 部门</div>
  </div>
</div>
```
CSS：
```css
.slide-cover { justify-content: center; align-items: flex-start; padding-left: 72px; }
/* 右侧渐变 + 背景水印文字（改成实际年份或项目缩写） */
.slide-cover::before { content: ''; position: absolute; right: 0; top: 0; width: 280px; height: 100%; background: linear-gradient(135deg, transparent 30%, rgba(34,197,94,0.06) 100%); pointer-events: none; }
.slide-cover::after { content: '2026'; position: absolute; right: -8px; bottom: -28px; font-size: 230px; font-weight: 900; color: rgba(255,255,255,0.025); letter-spacing: -12px; line-height: 1; pointer-events: none; user-select: none; }
.cover-inner { position: relative; z-index: 1; max-width: 560px; }
.cover-bar { width: 48px; height: 4px; background: var(--accent); border-radius: 2px; margin-bottom: 20px; }
.cover-tag { font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--accent); margin-bottom: 14px; }
.title-xl { font-size: 54px; line-height: 1.1; font-weight: 900; letter-spacing: -2px; margin-bottom: 18px; }
.title-xl em { color: var(--accent); font-style: normal; }
.cover-divider { width: 32px; height: 2px; background: rgba(255,255,255,0.15); border-radius: 1px; margin-bottom: 18px; }
.subtitle { font-size: 16px; opacity: 0.45; margin-bottom: 14px; }
.meta { font-size: 12px; opacity: 0.2; letter-spacing: 2px; text-transform: uppercase; }
```

---

### 2. 要点列表（bullets）

白色背景，编号徽章 + 说明文字，适合规则/玩法/功能说明。

```html
<div class="slide light">
  <div class="slide-hd"><h2>标题</h2></div>
  <div class="bullet-list">
    <div class="bullet"><div class="bullet-num">1</div><span><strong>要点标题</strong> — 说明文字</span></div>
    <div class="bullet"><div class="bullet-num">2</div><span><strong>要点标题</strong> — 说明文字</span></div>
    <!-- 最多 5 条 -->
  </div>
  <!-- 可选 -->
  <div class="highlight">补充说明</div>
</div>
```
CSS：
```css
.bullet-list { display: flex; flex-direction: column; gap: 12px; flex: 1; justify-content: center; }
.bullet { display: flex; align-items: flex-start; gap: 14px; font-size: 15px; line-height: 1.6; color: var(--text-light); }
.bullet-num { width: 22px; height: 22px; border-radius: 6px; background: var(--accent); color: #fff; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
.bullet strong { color: #15803d; font-weight: 700; }
```

---

### 3. 时间线（timeline）

白色背景，横向节点，适合分期/进度/里程碑。每个节点可单独设置点的颜色。

```html
<div class="slide light">
  <div class="slide-hd"><h2>标题</h2></div>
  <div class="tl-track">
    <div class="tl-node">
      <div class="tl-dot"></div>
      <div class="tl-label">Phase 01</div>
      <div class="tl-phase" style="color:#15803d">阶段名</div>
      <div class="tl-text">日期范围<br>说明</div>
    </div>
    <!-- 重复 tl-node，最多 4 个 -->
  </div>
  <div class="highlight">底部说明</div>
</div>
```
CSS：
```css
.tl-track { display: flex; margin-top: 8px; position: relative; flex: 1; align-items: flex-start; }
.tl-track::before { content: ''; position: absolute; top: 18px; left: 32px; right: 32px; height: 2px; background: var(--accent); opacity: 0.2; border-radius: 2px; }
.tl-node { flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 10px; }
.tl-dot { width: 18px; height: 18px; border-radius: 50%; background: var(--accent); margin-bottom: 16px; box-shadow: 0 0 0 5px color-mix(in srgb, var(--accent) 15%, transparent); position: relative; z-index: 1; flex-shrink: 0; }
.tl-label { font-size: 10px; font-weight: 800; color: var(--accent); margin-bottom: 8px; letter-spacing: 0.8px; text-transform: uppercase; }
.tl-phase { font-size: 15px; font-weight: 800; margin-bottom: 5px; }
.tl-text { font-size: 13px; line-height: 1.55; color: var(--text-light-muted); }
```

---

### 4. 数据表格（table）

白色背景，深色表头，隔行斑马纹，适合里程碑/数据对比。

```html
<div class="slide light">
  <div class="slide-hd"><h2>标题</h2></div>
  <table class="data-table">
    <thead><tr><th>列1</th><th>列2</th><th>列3</th></tr></thead>
    <tbody>
      <tr>
        <td>内容</td>
        <td class="td-muted">次要内容</td>
        <td class="td-highlight">重点内容</td>
      </tr>
    </tbody>
  </table>
  <!-- 可选 -->
  <div class="highlight">底部说明</div>
</div>
```
CSS：
```css
.data-table { width: 100%; border-collapse: collapse; margin-top: 4px; }
.data-table th { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #fff; padding: 10px 14px; text-align: left; background: #1e293b; }
.data-table th:first-child { border-radius: 6px 0 0 6px; }
.data-table th:last-child { border-radius: 0 6px 6px 0; }
.data-table td { padding: 11px 14px; font-size: 13.5px; color: var(--text-light); border-bottom: 1px solid #f1f5f9; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tbody tr:nth-child(even) td { background: #f8fafc; }
.td-highlight { font-weight: 700; color: #b45309; }
.td-muted { color: #94a3b8; }
```

---

### 5. 双栏对比（two-col）

白色背景，左右两列，适合可复用/待确认、优缺点、技术方案对比。

```html
<div class="slide light">
  <div class="slide-hd"><h2>标题</h2></div>
  <div class="col-wrap">
    <div>
      <div class="col-hd">左列标题</div>
      <div class="col-items">
        <div class="col-item">条目内容</div>
      </div>
    </div>
    <div>
      <div class="col-hd">右列标题</div>
      <div class="col-items">
        <div class="col-item">条目内容</div>
      </div>
    </div>
  </div>
</div>
```
CSS：
```css
.col-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; flex: 1; margin-top: 4px; }
.col-hd { font-size: 13px; font-weight: 800; color: var(--accent); margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0; letter-spacing: 0.3px; text-transform: uppercase; }
.col-items { display: flex; flex-direction: column; gap: 8px; }
.col-item { font-size: 13.5px; line-height: 1.6; padding: 10px 14px; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0; color: var(--text-light); }
.col-item::before { content: '—'; margin-right: 8px; color: var(--accent); font-weight: 700; }
```

---

### 6. 卡片网格（cards）

深色背景，2×2 卡片，顶部绿边强调。适合规则/要点/功能说明。

```html
<div class="slide dark">
  <div class="slide-hd"><h2>标题</h2></div>
  <div class="card-grid">
    <div class="card">
      <div class="card-num">Rule 01</div>
      <div class="card-title">卡片标题</div>
      <div class="card-desc">说明文字，<b>重点词</b>高亮</div>
    </div>
    <!-- 最多 4 个 card -->
  </div>
  <!-- 可选：底部横幅 -->
  <div class="card-banner">
    <div class="card-banner-badge">TOP<span>10</span></div>
    <div class="card-banner-text">补充说明，<b>重点</b>高亮</div>
  </div>
</div>
```
CSS：
```css
.card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 4px; }
.card { padding: 16px 18px; border-radius: 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-top: 3px solid var(--accent); }
.card-num { font-size: 9px; font-weight: 800; color: var(--accent); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 7px; }
.card-title { font-size: 14px; font-weight: 700; color: var(--text-dark); margin-bottom: 5px; }
.card-desc { font-size: 13px; color: var(--text-dark-muted); line-height: 1.65; }
.card-desc b { color: var(--accent); font-weight: 700; }
.card-banner { margin-top: 14px; background: rgba(34,197,94,0.07); border: 1px solid rgba(34,197,94,0.18); border-radius: 10px; padding: 14px 20px; display: flex; align-items: center; gap: 16px; flex-shrink: 0; }
.card-banner-badge { width: 44px; height: 44px; border-radius: 50%; background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; font-size: 9px; font-weight: 800; color: var(--accent); letter-spacing: 0.5px; line-height: 1.3; }
.card-banner-badge span { font-size: 16px; font-weight: 900; line-height: 1; }
.card-banner-text { font-size: 13.5px; color: var(--text-dark); line-height: 1.7; }
.card-banner-text b { color: var(--accent); font-weight: 700; }
```

---

### 7. 大数字（bignum）

深色或浅色背景，突出单个核心数据指标。

```html
<div class="slide dark" style="justify-content:center;align-items:center;text-align:center;">
  <div class="bignum-value">42%</div>
  <div class="bignum-label">核心指标名称</div>
  <div class="bignum-desc">补充说明，给数据一个背景</div>
</div>
```
CSS：
```css
.bignum-value { font-size: 96px; font-weight: 900; color: var(--accent); line-height: 1; margin-bottom: 16px; letter-spacing: -4px; }
.bignum-label { font-size: 24px; font-weight: 700; margin-bottom: 12px; }
.bignum-desc { font-size: 16px; opacity: 0.5; max-width: 560px; line-height: 1.7; }
```

---

### 8. 结尾页（ending）

深色背景，左对齐大字，背景水印，配待办/说明。

```html
<div class="slide dark slide-ending" data-transition="fade">
  <div class="ending-inner">
    <div class="ending-bar"></div>
    <div class="ending-title">结语<em>高亮词</em></div>
    <div class="ending-sub">补充信息第一行<br>补充信息第二行</div>
  </div>
</div>
```
CSS：
```css
.slide-ending { justify-content: center; align-items: flex-start; padding-left: 72px; }
.slide-ending::after { content: 'FIN'; position: absolute; right: -4px; bottom: -20px; font-size: 210px; font-weight: 900; color: rgba(255,255,255,0.025); letter-spacing: -8px; line-height: 1; pointer-events: none; user-select: none; }
.ending-inner { position: relative; z-index: 1; }
.ending-bar { width: 48px; height: 4px; background: var(--accent); border-radius: 2px; margin-bottom: 20px; }
.ending-title { font-size: 54px; font-weight: 900; margin-bottom: 18px; letter-spacing: -1.5px; line-height: 1.1; }
.ending-title em { color: var(--accent); font-style: normal; }
.ending-sub { font-size: 13px; opacity: 0.3; line-height: 2; }
```

---

## 生成规范

1. **主题选择**：活动/提案/游戏内容 → `dark` 主题；周报/月报/数据汇报/内部文档 → `light` 主题
2. **固定结构**：第一张封面（`dark` + `data-transition="fade"`），最后一张结尾（`dark` + `data-transition="fade"`）
3. **Layout 选择**：
   - 多条平行说明 → bullets
   - 时间顺序/分期 → timeline
   - 行列数据 → table
   - 左右对比/分类 → two-col
   - 规则/要点强调 → cards
   - 单个核心数字 → bignum
4. **信息密度上限**：bullets ≤ 5条，cards ≤ 4个，table ≤ 4行，timeline ≤ 4节点
5. **CSS 位置**：写在 `<style>` 里，在 `<link rel="stylesheet" href="ppt-base.css">` 之后；只写当前文件用到的 layout CSS
6. **文件位置**：与 `ppt-base.css` 和 `ppt-runtime.js` 放同目录
7. **水印文字**：封面 `::after` 的 `content` 改成实际年份或项目英文缩写
