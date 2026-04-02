---
name: "html-infographic"
description: "PC 信息图模式。全屏自适应布局，侧边目录导航、全文搜索高亮、折叠/展开、阅读进度条，适合深度研究和全量分析输出。"
version: 1
triggers:
  - "做成信息图"
  - "详细分析图"
  - "infographic"
  - "深度研究"
  - "全量分析"
  - "做成网页"
  - "做成HTML"
  - "做成html"
  - "生成网页"
  - "详细报告"
  - "全面分析"
  - "系统梳理"
  - "知识图谱"
  - "做个研究报告"
  - "深度分析"
  - "完整分析"
---

# html-infographic（PC 信息图模式）

将长内容转化为交互式全屏信息图页面，适合深度研究、全量分析、知识体系梳理等需要**完整保留所有信息**的场景。配色方案见 `html-visual`。

## 深色模式

使用深色配色（dark-gold、tech 等 `--bg-body` 为深色的方案）时，在 `<body>` 上添加 `ig-dark` 类：`<body class="ig-dark">`。这会将内容区文字、卡片、折叠块、表格等组件切换为深色背景 + 浅色文字，与工具栏/侧边栏风格统一。浅色配色（light、warm、nature、bold）不加此类。

## 与其他模式的核心区别

| 维度 | 卡片/长文 | PPT | **信息图** |
|---|---|---|---|
| 目的 | 导出图片分享 | 交互式演示 | **深度阅读 + 交互探索** |
| 信息量 | 压缩 | 适中 | **全量保留，不压缩** |
| 尺寸 | 540px 宽 | 960x540 | **全屏自适应（max-width 1200px）** |
| 导航 | 滚动 | 翻页 | **侧边目录 + 搜索 + 折叠** |
| 导出 | 长图/ZIP | 长图/ZIP/全屏 | **打印 (Ctrl+P)** |

## 内容处理原则

**原则：全量保留，结构化呈现。**

- **不压缩、不删减**：所有核心内容、数据、论据完整输出
- 用层级结构（章节 > 子章节）组织内容
- 长段落拆分为多个语义段，用组件（卡片、表格、流程图、折叠块）增强可读性
- 附录、参考资料等次要内容放入折叠块
- 每个章节应有明确的 `id` 属性，与侧边栏导航对应

## 页面结构

从上到下由三个核心区域组成：

| 区域 | 功能 | CSS 类名 |
|---|---|---|
| **顶部工具栏** | 标题 + 搜索框 + 全部展开/折叠按钮 + 打印按钮 + NPC 徽章 | `.ig-toolbar` |
| **侧边栏** | 固定目录导航，高亮当前章节，支持子章节缩进 | `.ig-sidebar` |
| **主内容区** | 章节式长文，max-width 1200px 居中 | `.ig-main` |
| **阅读进度条** | 顶部 3px 固定进度指示 | `.ig-progress` |

布局使用 flex：`.ig-layout` = sidebar + main。

## 交互功能

### 1. 侧边栏目录导航
- 固定在左侧，`position: sticky`，随页面滚动
- 一级章节正常缩进，二级子章节 `.sub` 额外左缩进
- 使用 `IntersectionObserver` 自动追踪当前可见章节并高亮对应导航项
- 点击导航项平滑滚动到对应章节
- 移动端（<=900px）隐藏侧边栏

### 2. 全文搜索
- 工具栏搜索框，`Ctrl+F` 聚焦
- 输入关键词后在主内容区标记所有匹配（`<mark>`），显示匹配数
- 上下导航箭头切换当前高亮匹配项（`.current`），自动滚动到视野中心
- `Enter` 下一个，`Shift+Enter` 上一个，`ESC` 清除搜索
- 搜索不覆盖已有的 `<mark>` / `<script>` / `<style>` 节点

### 3. 折叠/展开
- `.ig-collapse` 组件：点击 header 切换展开/折叠
- 工具栏"全部展开/折叠"按钮一键控制所有折叠块
- `Ctrl+E` 快捷键切换全部展开/折叠
- 打印模式下自动展开所有折叠块

### 4. 阅读进度条
- 固定在页面顶部，3px 高度，accent 色
- 实时反映页面滚动百分比

## 可用组件

| 组件 | 用途 | CSS 类名 |
|---|---|---|
| **章节标题** | 一级章节 | `.ig-section` > `h2` + `.ig-section-bar` |
| **子章节** | 二级章节 | `.ig-subsection` > `h3` |
| **正文段落** | 常规文本 | `.ig-text`，`<strong>` 使用 accent 色 |
| **卡片** | 独立信息块 | `.ig-card` > `.ig-card-title` + `.ig-card-body` |
| **卡片网格** | 并列卡片 | `.ig-card-grid`（auto-fit, minmax 280px） |
| **数据表格** | 结构化数据 | `.ig-table` > `table` |
| **提示框** | 重要说明 | `.ig-callout` + `.ig-callout-info` / `.ig-callout-tip` / `.ig-callout-warn` |
| **流程图** | 顺序步骤 | `.ig-flow` > `.ig-flow-step` > `.ig-flow-num` + `.ig-flow-label` + `.ig-flow-desc` |
| **折叠块** | 次要/附录内容 | `.ig-collapse` > `.ig-collapse-header` + `.ig-collapse-body` |
| **引用块** | 金句/引述 | `.ig-blockquote` |
| **标签组** | 分类标签 | `.ig-tags` > `.ig-tag` |
| **分隔线** | 章节间分隔 | `.ig-divider` |

### 提示框类型

| 类型 | 用途 | 样式 |
|---|---|---|
| `.ig-callout-info` | 补充说明、背景知识 | accent 色左边框 |
| `.ig-callout-tip` | 实用建议、最佳实践 | 绿色左边框 |
| `.ig-callout-warn` | 常见误区、注意事项 | 红色左边框 |

## 强制要求

- 主内容区 `max-width: 1200px`，居中显示
- 侧边栏固定 260px 宽，`sticky` 定位
- 工具栏 `sticky` 固定顶部，52px 高
- 每个章节和子章节必须有 `id`（格式 `sec-xxx` / `sub-xxx`），与侧边栏导航锚点对应
- 必须实现搜索高亮、侧边栏追踪、折叠展开、阅读进度条四项交互
- 移动端（<=900px）隐藏侧边栏，内容区全宽
- 打印样式隐藏工具栏/侧边栏/进度条，展开所有折叠块
- 导出文件名：`html-output/[来源文件名]-infographic.html`（所有 HTML 可视化产出统一放在 `html-output/` 子文件夹）

## 完整 HTML 模板

信息图模式实现侧边目录导航、全文搜索高亮、折叠/展开、阅读进度条。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[标题] - 深度研究</title>
  <style>
    /* ── Variables (根据主题替换；深色主题时 <body> 加 ig-dark 类) ── */
    :root {
      --bg-body: #0a0e14;
      --bg-slide-dark: #0d1117;
      --bg-slide-light: #f5f0e8;
      --accent: #c5a059;
      --text-dark: #e8e0d0;
      --text-dark-muted: rgba(232,224,208,0.5);
      --text-light: #1a1a1a;
      --text-light-muted: #8b8578;
      --bg-chrome: #161b22;
      --bg-chrome-hover: #1c2230;
      --border-chrome: rgba(197,160,89,0.25);
      --text-chrome: #e8e0d0;
      --text-chrome-muted: #8b8578;
      --font-stack: -apple-system, 'PingFang SC', 'Helvetica Neue', 'Noto Sans SC', sans-serif;
      --sidebar-w: 260px;
      --toolbar-h: 52px;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }

    body {
      background: var(--bg-body);
      font-family: var(--font-stack);
      color: var(--text-light);
      line-height: 1.7;
    }

    /* ── Dark mode (add class "ig-dark" to <body> for dark themes) ── */
    body.ig-dark {
      color: var(--text-dark);
    }
    body.ig-dark .ig-section > h2,
    body.ig-dark .ig-subsection > h3,
    body.ig-dark .ig-text,
    body.ig-dark .ig-card-body,
    body.ig-dark .ig-table td {
      color: var(--text-dark);
    }
    body.ig-dark .ig-text strong { color: var(--accent); }
    body.ig-dark .ig-nav-item { color: var(--text-dark-muted); }
    body.ig-dark .ig-nav-item:hover { color: var(--text-dark); }
    body.ig-dark .ig-nav-item.active { color: var(--accent); }
    body.ig-dark .ig-blockquote { color: var(--text-dark-muted); }
    body.ig-dark .ig-flow-desc { color: var(--text-dark-muted); }
    body.ig-dark .ig-card {
      background: var(--bg-chrome);
      border-color: var(--border-chrome);
    }
    body.ig-dark .ig-collapse {
      border-color: var(--border-chrome);
    }
    body.ig-dark .ig-collapse-header {
      background: var(--bg-chrome);
      color: var(--text-dark);
    }
    body.ig-dark .ig-collapse-header:hover { background: var(--bg-chrome-hover); }
    body.ig-dark .ig-collapse-body {
      border-top-color: var(--border-chrome);
      color: var(--text-dark);
    }
    body.ig-dark .ig-collapse-icon { color: var(--text-dark-muted); }
    body.ig-dark .ig-table th {
      background: color-mix(in srgb, var(--accent) 15%, transparent);
    }
    body.ig-dark .ig-divider { background: var(--border-chrome); }

    /* ════ TOOLBAR ════ */
    .ig-toolbar {
      position: sticky; top: 0; z-index: 100;
      height: var(--toolbar-h);
      background: var(--bg-chrome); border-bottom: 1px solid var(--border-chrome);
      display: flex; align-items: center; padding: 0 24px; gap: 12px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .ig-toolbar-title {
      font-size: 15px; font-weight: 700; color: var(--text-chrome);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .ig-toolbar .spacer { flex: 1; }
    .ig-search-box {
      display: flex; align-items: center; gap: 6px;
      background: var(--bg-chrome-hover); border-radius: 8px; padding: 4px 10px;
    }
    .ig-search-input {
      border: none; background: transparent; outline: none;
      font-size: 13px; width: 180px; font-family: inherit;
      color: var(--text-chrome);
    }
    .ig-search-input::placeholder { color: var(--text-chrome-muted); }
    .ig-search-count { font-size: 11px; color: var(--text-chrome-muted); white-space: nowrap; }
    .ig-search-nav { display: flex; gap: 2px; }
    .ig-search-nav button {
      border: none; background: transparent; cursor: pointer;
      font-size: 14px; color: var(--text-chrome-muted); padding: 2px 4px;
      border-radius: 4px;
    }
    .ig-search-nav button:hover { background: var(--bg-chrome-hover); color: var(--text-chrome); }
    .ig-tb-btn {
      padding: 6px 12px; border-radius: 6px; font-size: 12px;
      font-weight: 500; cursor: pointer; border: 1px solid var(--border-chrome);
      background: var(--bg-chrome); color: var(--text-chrome); transition: all 0.15s;
      font-family: inherit;
    }
    .ig-tb-btn:hover { background: var(--bg-chrome-hover); border-color: var(--accent); }
    .npc-badge { font-size: 11px; color: var(--text-chrome-muted); white-space: nowrap; }
    .npc-badge span { color: var(--accent); font-weight: 700; }

    /* ════ READING PROGRESS ════ */
    .ig-progress {
      position: fixed; top: 0; left: 0; height: 3px; z-index: 200;
      background: var(--accent); width: 0%; transition: width 0.1s linear;
    }

    /* ════ LAYOUT ════ */
    .ig-layout {
      display: flex; min-height: calc(100vh - var(--toolbar-h));
    }

    /* ════ SIDEBAR ════ */
    .ig-sidebar {
      width: var(--sidebar-w); position: sticky; top: var(--toolbar-h);
      height: calc(100vh - var(--toolbar-h));
      overflow-y: auto; background: var(--bg-chrome); border-right: 1px solid var(--border-chrome);
      padding: 24px 16px; flex-shrink: 0;
      scrollbar-width: thin; scrollbar-color: var(--border-chrome) transparent;
    }
    .ig-sidebar::-webkit-scrollbar { width: 4px; }
    .ig-sidebar::-webkit-scrollbar-thumb { background: var(--border-chrome); border-radius: 2px; }

    .ig-nav-title {
      font-size: 11px; font-weight: 700; letter-spacing: 2px;
      text-transform: uppercase; color: var(--accent);
      margin-bottom: 16px;
    }
    .ig-nav-item {
      display: block; padding: 8px 12px; border-radius: 6px;
      font-size: 13px; color: var(--text-light-muted);
      text-decoration: none; margin-bottom: 2px;
      transition: all 0.15s; cursor: pointer;
      border-left: 3px solid transparent;
    }
    .ig-nav-item:hover { background: color-mix(in srgb, var(--accent) 8%, transparent); color: var(--text-light); }
    .ig-nav-item.active {
      background: color-mix(in srgb, var(--accent) 12%, transparent); color: var(--accent);
      font-weight: 600; border-left-color: var(--accent);
    }
    .ig-nav-item.sub { padding-left: 28px; font-size: 12px; }

    /* ════ MAIN CONTENT ════ */
    .ig-main {
      flex: 1; max-width: 1200px; margin: 0 auto;
      padding: 48px 56px 80px;
    }

    /* ── Section / Subsection ── */
    .ig-section { margin-bottom: 48px; }
    .ig-section > h2 {
      font-size: 26px; font-weight: 800; margin-bottom: 8px;
      color: var(--text-light); letter-spacing: -0.5px;
      padding-top: 16px;
    }
    .ig-section-bar {
      width: 48px; height: 4px; background: var(--accent);
      border-radius: 2px; margin-bottom: 24px;
    }
    .ig-subsection { margin-bottom: 32px; }
    .ig-subsection > h3 {
      font-size: 20px; font-weight: 700; margin-bottom: 12px;
      color: var(--text-light);
    }

    /* ── Text ── */
    .ig-text {
      font-size: 15px; line-height: 1.8; margin-bottom: 16px;
      color: var(--text-light);
    }
    .ig-text strong { color: var(--accent); font-weight: 600; }

    /* ── Card ── */
    .ig-card {
      background: var(--bg-chrome); border: 1px solid var(--border-chrome);
      border-radius: 12px; padding: 24px; margin-bottom: 16px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    }
    .ig-card-title {
      font-size: 16px; font-weight: 700; color: var(--accent);
      margin-bottom: 8px;
    }
    .ig-card-body { font-size: 14px; line-height: 1.7; color: var(--text-light); }

    /* ── Card Grid ── */
    .ig-card-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px; margin-bottom: 24px;
    }
    .ig-card-grid .ig-card { margin-bottom: 0; }

    /* ── Table ── */
    .ig-table { margin-bottom: 24px; width: 100%; overflow-x: auto; }
    .ig-table table {
      width: 100%; border-collapse: collapse; font-size: 14px;
    }
    .ig-table th {
      background: color-mix(in srgb, var(--accent) 12%, transparent); color: var(--accent);
      font-weight: 700; text-align: left; padding: 12px 16px;
      border-bottom: 2px solid var(--accent);
    }
    .ig-table td {
      padding: 10px 16px; border-bottom: 1px solid var(--border-chrome);
      color: var(--text-light);
    }
    .ig-table tr:last-child td { border-bottom: none; }
    .ig-table tr:hover td { background: color-mix(in srgb, var(--accent) 4%, transparent); }

    /* ── Callout ── */
    .ig-callout {
      border-radius: 8px; padding: 16px 20px; margin-bottom: 20px;
      font-size: 14px; line-height: 1.7;
    }
    .ig-callout-info {
      background: color-mix(in srgb, var(--accent) 8%, transparent); border-left: 4px solid var(--accent);
    }
    .ig-callout-tip {
      background: rgba(45,134,89,0.08); border-left: 4px solid #2d8659;
    }
    .ig-callout-warn {
      background: rgba(232,93,58,0.08); border-left: 4px solid #e85d3a;
    }
    .ig-callout strong { display: block; margin-bottom: 4px; }

    /* ── Flow ── */
    .ig-flow {
      display: flex; gap: 0; margin-bottom: 24px;
      flex-wrap: wrap; justify-content: center;
    }
    .ig-flow-step {
      flex: 1; min-width: 140px; text-align: center;
      padding: 16px; position: relative;
    }
    .ig-flow-step:not(:last-child)::after {
      content: ''; position: absolute; right: -8px; top: 50%;
      transform: translateY(-50%);
      width: 0; height: 0;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-left: 8px solid var(--accent);
      opacity: 0.4;
    }
    .ig-flow-num {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--accent); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 700; margin: 0 auto 8px;
    }
    .ig-flow-label { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
    .ig-flow-desc { font-size: 12px; color: var(--text-light-muted); }

    /* ── Collapse ── */
    .ig-collapse {
      border: 1px solid var(--border-chrome); border-radius: 8px;
      margin-bottom: 12px; overflow: hidden;
    }
    .ig-collapse-header {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 16px; cursor: pointer;
      background: var(--bg-chrome); font-size: 14px; font-weight: 600;
      user-select: none; transition: background 0.15s;
    }
    .ig-collapse-header:hover { background: var(--bg-chrome-hover); }
    .ig-collapse-icon {
      transition: transform 0.2s; font-size: 12px; color: var(--text-light-muted);
    }
    .ig-collapse.open .ig-collapse-icon { transform: rotate(90deg); }
    .ig-collapse-body {
      display: none; padding: 16px;
      border-top: 1px solid var(--border-chrome);
      font-size: 14px; line-height: 1.7;
    }
    .ig-collapse.open .ig-collapse-body { display: block; }

    /* ── Blockquote ── */
    .ig-blockquote {
      border-left: 3px solid var(--accent); padding: 12px 20px;
      margin: 16px 0; font-style: italic;
      color: var(--text-light-muted); font-size: 15px; line-height: 1.7;
    }

    /* ── Tags ── */
    .ig-tags { display: flex; gap: 8px; flex-wrap: wrap; margin: 12px 0; }
    .ig-tag {
      font-size: 11px; padding: 4px 10px; border-radius: 12px;
      background: color-mix(in srgb, var(--accent) 10%, transparent); color: var(--accent);
      font-weight: 500;
    }

    /* ── Divider ── */
    .ig-divider {
      height: 1px; background: var(--border-chrome); margin: 32px 0;
    }

    /* ── Search highlight ── */
    mark {
      background: color-mix(in srgb, var(--accent) 35%, transparent); color: inherit;
      border-radius: 2px; padding: 1px 2px;
    }
    mark.current { background: var(--accent); color: #fff; }

    /* ════ MOBILE ════ */
    @media (max-width: 900px) {
      .ig-sidebar { display: none; }
      .ig-main { padding: 24px 20px 60px; }
      .ig-card-grid { grid-template-columns: 1fr; }
      .ig-flow { flex-direction: column; align-items: center; }
      .ig-flow-step::after { display: none; }
    }

    /* ════ PRINT ════ */
    @media print {
      .ig-toolbar, .ig-sidebar, .ig-progress { display: none !important; }
      .ig-layout { display: block; }
      .ig-main { max-width: 100%; padding: 20px; }
      .ig-collapse-body { display: block !important; }
      .ig-collapse-header .ig-collapse-icon { display: none; }
    }
  </style>
</head>
<body class="ig-dark">
<!-- 深色主题加 ig-dark 类；浅色主题去掉此类 -->

  <!-- Progress -->
  <div class="ig-progress" id="ig-progress"></div>

  <!-- Toolbar -->
  <div class="ig-toolbar">
    <span class="ig-toolbar-title">[标题] - 深度研究</span>
    <span class="spacer"></span>
    <div class="ig-search-box">
      <input class="ig-search-input" id="search-input" type="text" placeholder="搜索内容... (Ctrl+F)">
      <span class="ig-search-count" id="search-count"></span>
      <div class="ig-search-nav">
        <button onclick="searchNav(-1)" title="上一个">&#9650;</button>
        <button onclick="searchNav(1)" title="下一个">&#9660;</button>
      </div>
    </div>
    <button class="ig-tb-btn" id="toggle-collapse-btn" onclick="toggleAllCollapse()">全部展开</button>
    <button class="ig-tb-btn" onclick="window.print()">打印</button>
    <span class="npc-badge">powered by <span>NPC</span></span>
  </div>

  <div class="ig-layout">

    <!-- Sidebar -->
    <nav class="ig-sidebar" id="ig-sidebar">
      <div class="ig-nav-title">目录</div>
      <!-- 根据实际章节生成导航项 -->
      <a class="ig-nav-item" href="#sec-1">第一章节</a>
      <a class="ig-nav-item sub" href="#sub-1a">子章节 A</a>
      <a class="ig-nav-item sub" href="#sub-1b">子章节 B</a>
      <a class="ig-nav-item" href="#sec-2">第二章节</a>
      <!-- ...更多导航项... -->
    </nav>

    <!-- Main Content -->
    <main class="ig-main" id="ig-main">

      <!-- ══ 章节示例 ══ -->
      <div class="ig-section" id="sec-1">
        <h2>第一章节标题</h2>
        <div class="ig-section-bar"></div>

        <div class="ig-subsection" id="sub-1a">
          <h3>子章节 A</h3>
          <p class="ig-text">正文内容。<strong>强调文字</strong>使用 accent 色。</p>
        </div>

        <div class="ig-subsection" id="sub-1b">
          <h3>子章节 B</h3>
          <div class="ig-card-grid">
            <div class="ig-card">
              <div class="ig-card-title">卡片标题</div>
              <div class="ig-card-body">卡片内容描述。</div>
            </div>
          </div>
        </div>
      </div>

      <div class="ig-section" id="sec-2">
        <h2>第二章节标题</h2>
        <div class="ig-section-bar"></div>
        <p class="ig-text">更多内容...</p>
      </div>

    </main>
  </div>

  <script>
  (function() {
    'use strict';

    /* ══ Collapse ══ */
    window.toggleCollapse = function(header) {
      header.closest('.ig-collapse').classList.toggle('open');
    };

    let allExpanded = false;
    window.toggleAllCollapse = function() {
      allExpanded = !allExpanded;
      document.querySelectorAll('.ig-collapse').forEach(c => {
        c.classList.toggle('open', allExpanded);
      });
      document.getElementById('toggle-collapse-btn').textContent = allExpanded ? '全部折叠' : '全部展开';
    };

    /* ══ Search ══ */
    let searchMarks = [];
    let searchIdx = -1;

    const input = document.getElementById('search-input');
    const countEl = document.getElementById('search-count');

    input.addEventListener('input', doSearch);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        searchNav(e.shiftKey ? -1 : 1);
      } else if (e.key === 'Escape') {
        input.value = '';
        clearSearch();
        input.blur();
      }
    });

    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        input.focus();
        input.select();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        window.toggleAllCollapse();
      }
    });

    function doSearch() {
      clearSearch();
      const q = input.value.trim();
      if (!q) { countEl.textContent = ''; return; }

      const main = document.getElementById('ig-main');
      const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);

      const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');

      nodes.forEach(node => {
        const text = node.textContent;
        if (!re.test(text)) return;
        re.lastIndex = 0;

        const parent = node.parentNode;
        if (parent.tagName === 'MARK' || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') return;

        const frag = document.createDocumentFragment();
        let lastIdx = 0;
        let match;
        while ((match = re.exec(text)) !== null) {
          if (match.index > lastIdx) {
            frag.appendChild(document.createTextNode(text.slice(lastIdx, match.index)));
          }
          const mark = document.createElement('mark');
          mark.textContent = match[0];
          frag.appendChild(mark);
          searchMarks.push(mark);
          lastIdx = re.lastIndex;
        }
        if (lastIdx < text.length) {
          frag.appendChild(document.createTextNode(text.slice(lastIdx)));
        }
        parent.replaceChild(frag, node);
      });

      countEl.textContent = searchMarks.length ? `${searchMarks.length} 个匹配` : '无匹配';
      if (searchMarks.length) { searchIdx = 0; highlightCurrent(); }
    }

    function clearSearch() {
      document.querySelectorAll('#ig-main mark').forEach(m => {
        const parent = m.parentNode;
        parent.replaceChild(document.createTextNode(m.textContent), m);
        parent.normalize();
      });
      searchMarks = [];
      searchIdx = -1;
    }

    function highlightCurrent() {
      searchMarks.forEach(m => m.classList.remove('current'));
      if (searchIdx >= 0 && searchIdx < searchMarks.length) {
        searchMarks[searchIdx].classList.add('current');
        searchMarks[searchIdx].scrollIntoView({ block: 'center', behavior: 'smooth' });
        countEl.textContent = `${searchIdx + 1} / ${searchMarks.length}`;
      }
    }

    window.searchNav = function(dir) {
      if (!searchMarks.length) return;
      searchIdx = (searchIdx + dir + searchMarks.length) % searchMarks.length;
      highlightCurrent();
    };

    /* ══ Sidebar active tracking ══ */
    const sections = document.querySelectorAll('[id^="sec-"], [id^="sub-"]');
    const navItems = document.querySelectorAll('.ig-nav-item');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navItems.forEach(n => n.classList.remove('active'));
          const link = document.querySelector(`.ig-nav-item[href="#${entry.target.id}"]`);
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });

    sections.forEach(s => observer.observe(s));

    /* ══ Reading progress ══ */
    const progressBar = document.getElementById('ig-progress');
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      progressBar.style.width = pct + '%';
    });
  })();
  </script>
</body>
</html>
```
