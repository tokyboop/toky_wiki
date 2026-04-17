# slide-kit

浏览器直开的 HTML 演示文稿工具包，不需要任何环境或安装。

---

## 包含文件

| 文件 | 用途 |
|------|------|
| `ppt-base.css` | 结构样式：工具栏、侧边栏、演示层、概览层、Slide 基础 |
| `ppt-runtime.js` | 交互运行时：缩略图渲染、演示模式、键盘导航、导出长图/ZIP |
| `skill-ppt.md` | 生成规范：主题配色、8种 Layout 模板、CSS 样板、生成规则 |

---

## 使用方式

### 新建一个演示文稿

1. 把 `ppt-base.css` 和 `ppt-runtime.js` 放到目标目录
2. 新建 HTML 文件，按 `skill-ppt.md` 里的结构写内容
3. 浏览器打开 HTML 即可

### 最小 HTML 结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>演示标题</title>
  <style>
    /* 1. 粘贴 :root 主题变量（从 skill-ppt.md 选 dark 或 light） */
    /* 2. 粘贴用到的 Layout CSS */
  </style>
  <link rel="stylesheet" href="ppt-base.css">
</head>
<body>

  <!-- 工具栏（从 skill-ppt.md 复制，不改） -->

  <!-- Slides 容器 -->
  <div id="slide-deck" style="position:absolute;left:-9999px;top:0;visibility:hidden">
    <!-- 第一张：封面 -->
    <!-- 中间：内容页 -->
    <!-- 最后一张：结尾页 -->
  </div>

  <script src="ppt-runtime.js"></script>
</body>
</html>
```

---

## 功能

| 操作 | 方式 |
|------|------|
| 翻页 | 点击左右箭头 / 键盘 ← → |
| 演示模式 | 点击「演示」按钮 / F5 |
| 退出演示 | ESC |
| 概览所有页 | 点击「概览」/ O 键 |
| 导出长图 | 点击「导出长图」（所有 slide 纵向拼接） |
| 导出 ZIP | 点击「ZIP 打包」（每张 slide 单独 PNG） |

---

## 主题 & Layout

详见 `skill-ppt.md`：
- **2 套主题**：dark（活动/提案）、light（周报/汇报）
- **8 种 Layout**：封面、要点列表、时间线、数据表格、双栏对比、卡片网格、大数字、结尾页
