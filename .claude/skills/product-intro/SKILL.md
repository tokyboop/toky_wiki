---
name: "product-intro"
description: "生成 PPT 样式 HTML 文件（960x540，含背景图，Ctrl+P 可出 PDF）。背景图和内容均为运行时传入。"
version: 2
triggers:
  - "做成PPT"
  - "做成幻灯片"
  - "做个汇报"
  - "做份汇报"
  - "出汇报"
  - "做产品介绍"
  - "出产品介绍"
  - "做数据汇报"
  - "做成slides"
  - "整理成汇报"
  - "汇报材料"
---

# Skill: product-intro

## 执行流程

### Step 1：收集运行时参数
如果用户没有提供，依次询问：
1. **内容来源**：文件路径（Excel/MD）或直接粘贴文字
2. **背景图路径**：本地图片文件路径（无背景图则跳过）
3. **汇报目的**（可选）：给谁看、侧重什么——影响文案包装方向

### Step 2：处理背景图
如果用户提供了背景图，用 Python 自动量出安全区坐标：

```python
from PIL import Image
import numpy as np

img = Image.open(r'背景图路径').convert('RGBA')
arr = np.array(img)
w, h = img.size

# 找左半边有色块（非白非透明）的区域
left = arr[:, :w//2, :]
colored = (
    (left[:,:,3] > 100) &
    ~((left[:,:,0] > 220) & (left[:,:,1] > 220) & (left[:,:,2] > 220))
)
rows = np.where(colored.any(axis=1))[0]
cols = np.where(colored.any(axis=0))[0]

sx, sy = 960/w, 540/h
if len(rows):
    title_top    = round(rows[0] * sy)
    title_height = round((rows[-1] - rows[0]) * sy)
    title_width  = round(cols[-1] * sx)
    content_top  = round(rows[-1] * sy) + 16
else:
    title_top, title_height, title_width = 20, 40, 240
    content_top = 80
```

无背景图时使用默认值：`content_top=80, title_top=20`。

### Step 3：读取并理解内容
- Excel：用 Python + openpyxl/pandas 读取数值和表头
- MD/文字：直接解析
- **生成结论**：不只搬运原始数字，要提炼观点和解读

### Step 4：规划幻灯片
- 总数控制在 **4-6 张**（含封面和尾页）
- 根据内容选布局，每张选一种：

| 布局 | 何时用 |
|------|--------|
| cover | 第一张，必须有 |
| metrics-grid | 3-4 个关键数字 |
| two-col | 两组并列内容 |
| big-row | 3 个需要视觉冲击的数字 |
| tl-track | 时间线、排期、进展 |
| ending | 最后一张，必须有 |

### Step 5：生成 HTML 文件
- 文件名：`{主题}_{YYYYMMDD}.html`
- 保存到当前工作目录
- 默认使用**简约风模板**：`toky_wiki/knowledge/slide-template-minimal.html`
- 按模板组件库填写内容，**不得自创新 class**
- 有背景图时：在 `:root` 加入 `--slide-bg`，并给内容页加 `.has-bg` class（参考 product-intro-preview.html）

---

## CSS 组件库（完整模板）

生成 HTML 时，`<style>` 块直接使用以下 CSS，将测量出的坐标填入 `:root`：

```css
:root {
  --slide-bg:   url('{{BG_IMAGE}}');   /* 背景图路径，无背景图则删除此行 */
  --pill-top:   {{title_top}}px;
  --pill-h:     {{title_height}}px;
  --pill-w:     {{title_width}}px;
  --content-top:{{content_top}}px;

  --accent:     #009FD4;
  --accent-dim: rgba(0,159,212,0.10);
  --text-dark:  #1A2A3A;
  --text-mid:   #4A5A6A;
  --text-muted: #8A9AAA;
  --text-white: #ffffff;
  --bg-card:    rgba(0,159,212,0.06);
  --border:     rgba(0,159,212,0.20);
  --font: -apple-system,'PingFang SC','Helvetica Neue','Noto Sans SC',sans-serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--font); background: #CBCBCB; padding: 40px 0; }

.slide {
  width: 960px; height: 540px; position: relative; overflow: hidden;
  background: #fff; margin: 0 auto 24px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  display: flex; flex-direction: column;
  padding: var(--content-top) 56px 40px;
}
.slide.has-bg { background-image: var(--slide-bg); background-size: 100% 100%; }

/* 标题叠在色块上 */
.slide-title {
  position: absolute;
  top: var(--pill-top); left: 0;
  width: var(--pill-w); height: var(--pill-h);
  display: flex; align-items: center; padding-left: 24px;
  color: var(--text-white); font-size: 16px; font-weight: 700; z-index: 2;
}

/* 封面 */
.slide.cover { padding: 0; justify-content: center; align-items: flex-start; }
.cover-strip { position: absolute; top: 0; left: 0; right: 0; height: 6px; background: var(--accent); }
.cover-logo  { position: absolute; top: 28px; right: 44px; font-size: 13px; font-weight: 700; color: var(--accent); letter-spacing: 2px; }
.cover-inner { padding: 0 80px; margin: auto 0; }
.cover-eyebrow { font-size: 11px; letter-spacing: 3px; color: var(--accent); text-transform: uppercase; margin-bottom: 18px; }
.cover-title   { font-size: 38px; font-weight: 800; color: var(--text-dark); line-height: 1.25; margin-bottom: 14px; }
.cover-title em { color: var(--accent); font-style: normal; }
.cover-sub     { font-size: 16px; color: var(--text-mid); line-height: 1.6; }
.cover-footer  { position: absolute; bottom: 32px; left: 80px; font-size: 12px; color: var(--text-muted); }

/* 通用 */
.slide-heading    { font-size: 22px; font-weight: 700; color: var(--text-dark); margin-bottom: 6px; }
.slide-accent-bar { width: 36px; height: 3px; background: var(--accent); border-radius: 2px; margin-bottom: 20px; }
.slide-highlight  { background: var(--accent-dim); border-left: 4px solid var(--accent); padding: 14px 18px; font-size: 16px; color: var(--text-mid); line-height: 1.8; border-radius: 0 6px 6px 0; margin-top: auto; }
.slide-highlight strong { color: var(--text-dark); }

/* 布局：metrics-grid */
.metrics-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 14px; }
.metric-card  { background: var(--bg-card); border: 1px solid var(--border); border-top: 3px solid var(--accent); padding: 20px 16px; display: flex; flex-direction: column; gap: 4px; }
.metric-num   { font-size: 32px; font-weight: 800; color: var(--accent); line-height: 1; }
.metric-num small { font-size: 18px; }
.metric-label { font-size: 14px; color: var(--text-mid); }
.metric-sub   { font-size: 13px; color: var(--text-muted); }
.metric-tag   { display: inline-block; font-size: 11px; font-weight: 700; background: #E8F8EC; color: #27AE60; padding: 2px 8px; border-radius: 10px; margin-top: 6px; }
.metric-tag.neutral { background: #EEF6FB; color: var(--accent); }

/* 布局：two-col */
.two-col   { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; flex: 1; }
.col-wrap  { display: flex; flex-direction: column; }
.col-title { font-size: 11px; font-weight: 700; letter-spacing: 2px; color: var(--accent); text-transform: uppercase; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid var(--accent); }
.item-list { display: flex; flex-direction: column; gap: 8px; flex: 1; }
.item-row  { display: flex; gap: 12px; align-items: flex-start; background: var(--bg-card); border: 1px solid var(--border); padding: 14px; flex: 1; border-radius: 4px; }
.item-dot  { width: 7px; height: 7px; background: var(--accent); border-radius: 50%; flex-shrink: 0; margin-top: 6px; }
.item-text { font-size: 16px; color: var(--text-dark); line-height: 1.55; }
.item-text span { display: block; font-size: 13px; color: var(--text-muted); margin-top: 2px; }

/* 布局：big-row */
.big-row  { display: grid; grid-template-columns: repeat(3,1fr); flex: 1; border: 1px solid var(--border); background: var(--bg-card); }
.big-cell { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0 20px; border-right: 1px solid var(--border); text-align: center; }
.big-cell:last-child { border-right: none; }
.big-num  { font-size: 56px; font-weight: 900; color: var(--accent); line-height: 1; margin-bottom: 10px; }
.big-num sup { font-size: 24px; vertical-align: top; margin-top: 8px; display: inline-block; }
.big-label { font-size: 16px; color: var(--text-mid); font-weight: 600; }
.big-sub   { font-size: 13px; color: var(--text-muted); margin-top: 4px; }

/* 布局：tl-track */
.tl-track { display: flex; flex: 1; align-items: flex-start; position: relative; padding-top: 8px; }
.tl-track::before { content: ''; position: absolute; top: 23px; left: 40px; right: 40px; height: 3px; background: var(--accent); opacity: 0.25; border-radius: 2px; }
.tl-node  { flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 10px; }
.tl-dot   { width: 16px; height: 16px; border-radius: 50%; background: var(--accent); margin-bottom: 14px; box-shadow: 0 0 0 5px rgba(0,159,212,0.15); position: relative; z-index: 1; }
.tl-label { font-size: 11px; font-weight: 700; color: var(--accent); margin-bottom: 6px; }
.tl-title { font-size: 17px; font-weight: 700; color: var(--text-dark); margin-bottom: 4px; }
.tl-desc  { font-size: 14px; color: var(--text-mid); line-height: 1.5; }

/* 尾页 */
.slide.ending { padding: 0; justify-content: center; align-items: center; }
.ending-bar   { width: 48px; height: 4px; background: var(--accent); border-radius: 2px; margin: 0 auto 24px; }
.ending-title { font-size: 40px; font-weight: 800; color: var(--text-dark); margin-bottom: 12px; text-align: center; }
.ending-sub   { font-size: 15px; color: var(--text-mid); line-height: 1.8; text-align: center; }

/* 打印 */
@media print {
  @page { size: 960px 540px; margin: 0; }
  body { background: transparent; padding: 0; }
  .slide { margin: 0; box-shadow: none; page-break-after: always; }
}
```
