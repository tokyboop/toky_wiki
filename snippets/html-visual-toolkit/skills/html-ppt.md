---
name: "html-ppt"
description: "交互式网页 PPT 演示模式。16:9 横屏，三视图（编辑/演示/概览），支持过渡动画、键盘快捷键和触控手势。"
version: 2
triggers:
  - "做成PPT"
  - "做成ppt"
  - "做成演示"
  - "做个PPT"
  - "做个ppt"
  - "PPT"
  - "ppt"
  - "演示文稿"
  - "slides"
  - "presentation"
  - "做个演示"
  - "做个汇报"
  - "做成汇报"
  - "汇报材料"
  - "做个展示"
  - "展示一下"
  - "演示一下"
  - "keynote"
  - "slideshow"
  - "slide deck"
  - "幻灯片"
  - "做个报告"
  - "做成报告"
---

# html-ppt（PPT 演示模式）

沉浸式网页演示。**不是导出静态图片，而是一个完整的交互式网页演示工具**，模拟并超越 PowerPoint 的体验。完整配色方案（含全部 :root 变量）见 `agents/subagents/html-visual.md`。

每页 `.ppt-slide`，设计稿基准 960x540px（16:9），在演示模式下自动缩放填满屏幕。

## 架构说明（重要）

框架的 CSS 和 JS 已抽取为外部文件（位于 `html-output/` 文件夹），**你只需输出精简的 HTML**：

- `html-output/ppt-core.css` — 所有布局、版式、交互样式（不含 `:root` 变量）
- `html-output/ppt-core.js` — 自动构建 toolbar/editor/演示/概览的 DOM 骨架 + 全部交互逻辑

HTML 产出文件也保存到 `html-output/` 文件夹，与 CSS/JS 同级，因此模板中的相对路径 `href="ppt-core.css"` / `src="ppt-core.js"` 保持不变。

**HTML 文件只需提供**：
1. `:root` CSS 变量（配色主题）
2. `#slide-deck` 容器内的幻灯片内容
3. CDN 导出依赖引用

**不需要输出**：toolbar HTML、editor-view HTML、present-overlay HTML、overview-overlay HTML、任何 JS 代码、任何 CSS 样式规则。这些全部由外部文件自动处理。

## PPT 与卡片模式的本质区别

| 维度 | 卡片模式 | PPT 模式 |
|---|---|---|
| 目的 | 导出图片分享 | **交互式演示** |
| 比例 | 4:5 竖屏 | 16:9 横屏 |
| 核心交互 | 滚动浏览 | 翻页演示 + 缩略图导航 + 概览 |
| 信息密度 | 每张 50-80 字 | 每页 80-150 字 |
| 过渡效果 | 无 | 滑动/淡入/缩放等 |

## 交互体验设计（核心）

PPT 模式有三个视图状态，用户可自由切换：

**1. 编辑/预览视图（默认）**
- 经典 PPT 布局：左侧缩略图侧边栏（200px 宽）+ 右侧当前页大预览
- 缩略图可滚动，点击任一缩略图跳转到该页
- 当前页在侧边栏高亮显示（accent 色边框）
- 右侧预览区可用鼠标滚轮/键盘上下翻页

**2. 演示视图（全屏沉浸）**
- 点击"演示"按钮或按 `F5` 进入
- 当前 slide 铺满整个屏幕（等比缩放 + 居中）
- 页面切换有过渡动画（默认 slide-left，可选 fade / zoom / flip）
- 导航方式：键盘左右/上下、空格前进、鼠标点击前进、触屏滑动
- 底部半透明进度条，显示当前位置
- 右上角 ✕ 退出按钮（鼠标移入显示），点击退出演示
- 按 `ESC` 退出回到编辑视图
- 鼠标 3 秒不动自动隐藏光标

**3. 概览视图（鸟瞰）**
- 按 `O` 键或点击"概览"按钮进入
- 所有 slide 缩小为网格排列（类似 reveal.js Overview）
- 可滚动浏览全部页面
- 点击任一页跳转并进入演示视图
- **点击空白区域（非 slide 卡片）返回编辑视图**
- 当前页高亮标记
- 按 `ESC` 退出概览

## 键盘快捷键

| 按键 | 功能 |
|---|---|
| `Right` / `Down` / `Space` / `PageDown` | 下一页 |
| `Left` / `Up` / `PageUp` | 上一页 |
| `Home` | 第一页 |
| `End` | 最后一页 |
| `F5` | 进入/退出演示模式 |
| `O` | 进入/退出概览模式 |
| `ESC` | 退出当前模式（演示/概览 -> 编辑） |
| `1-9` | 快速跳转到第 N 页 |

## 触控手势

| 手势 | 功能 |
|---|---|
| 左滑 | 下一页 |
| 右滑 | 上一页 |
| 双指捏合 | 进入/退出概览模式 |

## 页面过渡动画

每个 slide 可指定 `data-transition` 属性（默认 `slide`）：

| 过渡 | 效果 | `data-transition` 值 |
|---|---|---|
| 滑动 | 新页从右滑入，旧页从左滑出 | `slide`（默认） |
| 淡入淡出 | 透明度渐变 | `fade` |
| 缩放 | 从中心放大进入 | `zoom` |
| 无 | 直接切换 | `none` |

## 内容压缩原则

**原则：每页 10 秒可读，演讲者 1-2 分钟可讲完。**

- **内容完整性优先**：不人为限制页数，所有核心内容都要完整准确地呈现
- 每页一个核心信息点
- 标题即结论（不要用"关于XX"这样的中性标题）
- 正文用要点列表而非长段落，每个要点一行
- 适合的文案量：标题 10-20 字 + 正文 3-5 个要点
- 用户明确指定页数时遵循用户要求；未指定时以内容完整为准，不做人为裁剪

## 页面规划

标准结构（可根据内容调整）：

| 序号 | 版式 | 背景 | 内容 |
|---|---|---|---|
| 1 | 封面 `ppt-cover` | 统一底色 | 大标题 + 副标题 + 演讲者/日期 |
| 2 | 目录 `ppt-toc` | 统一底色 | 章节列表，3-5 个章节 |
| - | 章节页 `ppt-section` | 统一底色 | 章节编号 + 章节标题 |
| 3-N | 内容页 | 统一底色 | 多种版式混合使用 |
| N+1 | 总结 `ppt-summary` | 统一底色 | 3-5 个关键要点回顾 |
| N+2 | 结尾 `ppt-ending` | 统一底色 | 感谢/联系方式/CTA |

> **底色规则：所有页面统一底色（默认全部 `.dark`），不做深浅交替。如需浅色主题，则全部 `.light`。**

## 可用版式

| 版式 | 用途 | CSS 类名 | 内部结构 |
|---|---|---|---|
| **封面** | 第一页 | `.ppt-cover` | `.ppt-title-big` + `.ppt-subtitle` + `.ppt-meta` |
| **章节页** | 分隔章节 | `.ppt-section` | `.ppt-section-num` + `.ppt-section-title` |
| **目录** | 全局导航 | `.ppt-toc` | `.ppt-toc-list` > `.ppt-toc-item`（含 `.ppt-toc-num`） |
| **标题+要点** | 最常用 | `.ppt-bullets` | `.ppt-heading` + `.ppt-accent-bar` + `.ppt-bullet-list` > `.ppt-bullet` |
| **双栏** | 对比/并列 | `.ppt-two-col` | `.ppt-heading` + `.ppt-accent-bar` + `.ppt-col-wrapper` > `.ppt-col-left` + `.ppt-col-right`（各含 `.ppt-col-title` + `.ppt-col-item`） |
| **大数字** | 强调数据 | `.ppt-big-number` | `.ppt-num-value` + `.ppt-num-label` + `.ppt-num-desc` |
| **引用页** | 金句/名言 | `.ppt-quote` | `.ppt-quote-mark`（装饰引号） + `.ppt-quote-text` + `.ppt-quote-author` |
| **时间线** | 历程/阶段 | `.ppt-timeline` | `.ppt-heading` + `.ppt-accent-bar` + `.ppt-tl-track` > `.ppt-tl-node`（含 `.ppt-tl-dot` + `.ppt-tl-label` + `.ppt-tl-text`） |
| **总结** | 回顾要点 | `.ppt-summary` | `.ppt-heading` + `.ppt-accent-bar` + `.ppt-summary-grid` > `.ppt-summary-item` |
| **结尾** | 最后一页 | `.ppt-ending` | `.ppt-thanks` + `.ppt-contact` |

### 辅助元素

| 元素 | 用途 | 用法 |
|---|---|---|
| `.ppt-accent-bar` | 标题下的强调色短线 | 放在 `.ppt-heading` 之后 |
| `.ppt-highlight` | 重点提示框（左边框强调色） | 任意内容页内使用 |
| `.tags` > `.tag` | 标签徽章（圆角药丸形） | 封面/结尾页底部 |
| `.ppt-quote-mark` | 装饰性大引号 | 引用页顶部，内容写 `"` |

## 强制要求

- 每页必须是 `.ppt-slide`，设计基准 `width: 960px; height: 540px`
- **底色规则**：所有页面统一 `.dark`（深色主题）或统一 `.light`（浅色主题）。不交替
- 三个视图（编辑/演示/概览）、过渡动画、键盘快捷键、触屏手势全部由 `ppt-core.js` 自动实现，**不要在 HTML 中重复编写**
- 导出文件名：`html-output/[来源文件名]-ppt.html`（所有 HTML 可视化产出统一放在 `html-output/` 子文件夹）
- **不要在 HTML 中内联 CSS 样式规则或 JS 代码**（`:root` 变量除外）
- **不要在 HTML 中手写 toolbar、sidebar、overlay 等骨架 DOM**，这些由 `ppt-core.js` 自动生成

## 生成自检清单

生成 HTML 后，逐条核对以下清单。任一项不通过都会导致严重问题。

### 结构检查（缺少 = 功能失效）

- [ ] `<link rel="stylesheet" href="ppt-core.css">` 在 `<head>` 中
- [ ] `<style>` 块只包含 `:root { }` 变量定义，无其他 CSS 规则
- [ ] `:root` 包含全部 16 个必需变量（从 subagent 配色方案复制完整块，含 `--sidebar-w` 和 `--transition-speed`）
- [ ] `<body>` 内第一个语义元素是 `<div id="slide-deck">`
- [ ] 每个幻灯片是 `<div class="ppt-slide dark/light [版式类]">`
- [ ] 每个 `.ppt-slide` 都有 `.dark` 或 `.light` 类
- [ ] CDN 脚本（html2canvas、jszip、file-saver）在 `ppt-core.js` 之前加载
- [ ] `<script src="ppt-core.js"></script>` 是最后一个 `<script>`

### 禁止项检查（包含 = 界面异常）

- [ ] HTML 中无 `<nav>`、`<div class="toolbar">`、`<div class="sidebar">` 等骨架 DOM
- [ ] HTML 中无 `<div class="present-overlay">`、`<div class="overview-overlay">`
- [ ] HTML 中无 `<div class="ppt-page-num">` 页码元素
- [ ] `<style>` 中无 `.ppt-slide`、`.toolbar`、`.sidebar` 等样式规则（只有 `:root`）
- [ ] `<body>` 中无 `<script>` 内联代码块（只有 `src=` 外部引用）
- [ ] 无 `style="..."` 行内样式（不设宽高、不设字体、不设颜色）
- [ ] 无外部字体链接（Google Fonts 等）、无 `<img>` 外部图片

### 内容结构检查

- [ ] 版式类名与「可用版式」表格严格一致（如 `.ppt-bullets` 不是 `.ppt-bullet`）
- [ ] 子元素嵌套正确（如 `.ppt-bullet` 在 `.ppt-bullet-list` 内，`.ppt-col-left` 在 `.ppt-col-wrapper` 内）
- [ ] 有标题的版式（bullets/two-col/timeline/summary）包含 `.ppt-heading` + `.ppt-accent-bar`
- [ ] 引用页使用 `.ppt-quote-mark` + `.ppt-quote-text` + `.ppt-quote-author` 完整结构

## 完整 HTML 模板

只需输出以下精简结构。**CSS/JS/骨架 DOM 全部由外部文件处理，你只需关注幻灯片内容和配色变量。**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[标题]</title>
  <link rel="stylesheet" href="ppt-core.css">
  <style>
    :root {
      --bg-body: #0a0e14;
      --bg-slide-dark: #0d1117;
      --bg-slide-light: #f5f0e8;
      --accent: #c5a059;
      --text-dark: #e8e0d0;
      --text-dark-muted: rgba(232, 224, 208, 0.5);
      --text-light: #1a1a1a;
      --text-light-muted: #8b8578;
      --bg-chrome: #161b22;
      --bg-chrome-hover: #1c2230;
      --border-chrome: rgba(197, 160, 89, 0.25);
      --text-chrome: #e8e0d0;
      --text-chrome-muted: #8b8578;
      --font-stack: -apple-system, 'PingFang SC', 'Helvetica Neue', 'Noto Sans SC', sans-serif;
      --sidebar-w: 220px;
      --transition-speed: 0.4s;
    }
  </style>
</head>
<body>

  <!-- 只需提供幻灯片内容，骨架 DOM 由 ppt-core.js 自动生成 -->
  <div id="slide-deck">

    <!-- Slide 1: 封面 -->
    <div class="ppt-slide dark ppt-cover">
      <div class="ppt-title-big">演示标题</div>
      <div class="ppt-subtitle">副标题或一句话描述</div>
      <div class="ppt-meta">作者 | 日期</div>
    </div>

    <!-- Slide 2: 目录 -->
    <div class="ppt-slide dark ppt-toc">
      <h2 class="ppt-heading">目录</h2>
      <div class="ppt-accent-bar"></div>
      <div class="ppt-toc-list">
        <div class="ppt-toc-item"><span class="ppt-toc-num">01</span> 章节一</div>
        <div class="ppt-toc-item"><span class="ppt-toc-num">02</span> 章节二</div>
        <div class="ppt-toc-item"><span class="ppt-toc-num">03</span> 章节三</div>
      </div>
    </div>

    <!-- Slide 3: 标题+要点 -->
    <div class="ppt-slide dark ppt-bullets">
      <h2 class="ppt-heading">要点标题即结论</h2>
      <div class="ppt-accent-bar"></div>
      <div class="ppt-bullet-list">
        <div class="ppt-bullet"><strong>要点一</strong> -- 展开说明</div>
        <div class="ppt-bullet"><strong>要点二</strong> -- 展开说明</div>
        <div class="ppt-bullet"><strong>要点三</strong> -- 展开说明</div>
      </div>
    </div>

    <!-- Slide 4: 双栏 -->
    <div class="ppt-slide dark ppt-two-col">
      <h2 class="ppt-heading">对比标题</h2>
      <div class="ppt-accent-bar"></div>
      <div class="ppt-col-wrapper">
        <div class="ppt-col-left">
          <div class="ppt-col-title">左栏标题</div>
          <div class="ppt-col-item">内容项 A</div>
          <div class="ppt-col-item">内容项 B</div>
        </div>
        <div class="ppt-col-right">
          <div class="ppt-col-title">右栏标题</div>
          <div class="ppt-col-item">内容项 A</div>
          <div class="ppt-col-item">内容项 B</div>
        </div>
      </div>
    </div>

    <!-- 更多 slide... -->

    <!-- 结尾 -->
    <div class="ppt-slide dark ppt-ending">
      <div class="ppt-thanks">谢谢</div>
      <div class="ppt-contact"></div>
    </div>

  </div>

  <!-- 导出依赖（CDN） -->
  <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js"></script>
  <!-- 核心逻辑（自动构建 UI 骨架 + 全部交互） -->
  <script src="ppt-core.js"></script>
</body>
</html>
```
