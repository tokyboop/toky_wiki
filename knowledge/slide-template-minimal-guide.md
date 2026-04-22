# 简约风幻灯片模板 · 使用说明

模板文件：`knowledge/slide-template-minimal.html`

---

## 快速替换

### 替换背景图（带背景图版本）

在 HTML 文件顶部 `:root` 里找到这一行，改路径就行：

```css
:root {
  --slide-bg: url('file:///C:/Users/你的用户名/Pictures/背景图.png');
```

- 路径格式：`file:///` + 绝对路径，斜杠用 `/`
- 只有加了 `class="has-bg"` 的幻灯片才会显示背景图
- 简约风模板默认**无背景图**，需要背景图时参考 `product-intro-preview.html`

---

### 替换右上角 Logo

封面右上角的 Logo 是文字，找到这一行直接改文字：

```html
<div class="cover-logo">盛趣游戏</div>
```

想换成图片：

```html
<div class="cover-logo">
  <img src="file:///C:/路径/logo.png" style="height:32px;">
</div>
```

---

### 替换主色调

找 `:root` 里的 `--accent`，改颜色代码：

```css
:root {
  --accent:  #0099CC;   /* 主色，改这里 */
  --accent2: #E05C3A;   /* 警示/强调色 */
}
```

改完之后，所有竖线、数字、标签颜色全部跟着变。

---

## 布局一览

| 布局 | class | 用途 |
|------|-------|------|
| 封面 | `.cover` | 第一页，含右侧大数字块 |
| 章节分隔 | `.section-page` | 蓝底，章节过渡 |
| 四格归因卡 | `.factor-grid` | 3-4个因素对比 |
| 双栏对比 | `.two-col` | 两组并列内容 |
| 大数字 | `.big-number` | 单个关键数字全屏强调 |
| 行动建议 | `.action-list` | 有序的行动项 |
| 引用/金句 | `.quote-page` | 金句或重要结论（待定） |
| 尾页 | `.ending` | 最后一页 |

---

## 常用调整

### 封面右侧大数字块：改数字和文字

```html
<div class="cover-right">
  <div class="cover-big">20%</div>          <!-- 大数字 -->
  <div class="cover-big-sub">月活跌幅</div>  <!-- 副说明 -->
  <div class="cover-big-label">8,449 人</div><!-- 更小的补充 -->
</div>
```

不需要这个色块时，把整个 `<div class="cover-right">` 删掉，同时把 `cover-left` 的 `padding` 改大一点。

---

### 章节页：改编号、标题、描述

```html
<div class="section-num">01</div>
<div class="section-title">章节名称</div>
<div class="section-sub">这里写一两句描述</div>
```

---

### 大数字页：改数值和说明

```html
<div class="big-num-value">11.8<sup>%</sup></div>  <!-- 数字，<sup>是单位 -->
<div class="big-num-label">老用户月流失率</div>      <!-- 标签 -->
<div class="big-num-desc">这里写解读文字</div>        <!-- 描述 -->
```

---

### 四格卡片：红色高亮

默认蓝色，加 `.red` 变橙红色（适合标注需关注的项）：

```html
<div class="factor-card red">   <!-- 加 red 变警示色 -->
  ...
  <div class="factor-badge">标签文字</div>       <!-- 橙红底 -->
  <div class="factor-badge ok">正向标签</div>    <!-- 绿底 -->
  <div class="factor-badge grey">中性标签</div>  <!-- 灰底 -->
</div>
```

---

### 打印成 PDF

浏览器打开 HTML → `Ctrl+P` → 目标打印机选 **另存为PDF** → 去掉页眉页脚和边距 → 保存。

建议纸张设置：**横向 / 无边距**。

---

## 让 Claude 生成时说清楚

触发词：`做成PPT` / `出汇报` / `做产品介绍`

加上说明效果更好：

> 帮我把这份数据做成汇报PPT，用简约风模板，主色改成深绿色，封面大数字显示"35%"

Claude 会自动读 `product-intro` skill 并参考此模板生成。
