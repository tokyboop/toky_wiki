# HTML Visual Toolkit

AI Agent 可视化输出工具包。通过 Skill 指令驱动 AI 生成精美的交互式 HTML 页面，支持四种输出模式。

## 输出模式

| 模式 | 适用场景 | 特点 |
|------|----------|------|
| **卡片模式** | 小红书/Instagram 分享图 | 540x675 竖屏卡片，深浅交替，支持导出 PNG/ZIP |
| **长文模式** | 完整长图文 | 540px 宽不限高，一键导出长图 |
| **PPT 模式** | 交互式演示/汇报 | 960x540 横屏，三视图切换，翻页动画，键盘/触控/全屏 |
| **信息图模式** | 深度研究/全量分析 | 全屏自适应，侧边目录导航，全文搜索，折叠展开 |

## 目录结构

```
html-visual-toolkit/
├── README.md              # 本文件
├── skills/                # Skill 指令文件（给 AI Agent 读取）
│   ├── html-visual.md     # 路由层：识别意图 -> 分发到对应模式
│   ├── html-ppt.md        # PPT 演示模式完整规范 + HTML 模板
│   ├── html-cards.md      # 卡片/长文模式完整规范 + HTML 模板
│   └── html-infographic.md# 信息图模式完整规范 + HTML 模板
├── subagents/             # Subagent 配置
│   └── html-visual.md     # 配色方案（6套）+ 执行工作流 + 强制要求
├── runtime/               # PPT 模式运行时依赖
│   ├── ppt-core.css       # PPT 框架样式（409行）
│   └── ppt-core.js        # PPT 框架逻辑（640行）：自动构建 UI + 交互
└── examples/              # 示例产出（浏览器直接打开）
    ├── coffee-cards.html   # 卡片模式示例
    ├── coffee-long.html    # 长文模式示例
    ├── coffee-ppt.html     # PPT 模式示例
    ├── coffee-infographic.html # 信息图模式示例
    ├── ppt-core.css        # PPT 示例运行依赖（与 runtime 相同）
    └── ppt-core.js         # PPT 示例运行依赖（与 runtime 相同）
```

## 快速开始

### 1. 集成到你的 AI Agent 工作空间

将 `skills/` 和 `subagents/` 中的文件放入你的 Agent 指令目录：

```
your-workspace/
├── agents/
│   ├── skills/
│   │   ├── html-visual.md
│   │   ├── html-ppt.md
│   │   ├── html-cards.md
│   │   └── html-infographic.md
│   └── subagents/
│       └── html-visual.md
├── html-output/           # 产出目录
│   ├── ppt-core.css       # 从 runtime/ 复制
│   └── ppt-core.js        # 从 runtime/ 复制
```

### 2. 在 Agent 指令文件中注册

在你的 `AGENTS.md` 或 `CLAUDE.md` 中添加：

```markdown
## 可用 Skills
- `html-visual` -- 可视化输出路由。触发词："做成卡片/图/PPT/演示/信息图/网页/HTML/可视化/分享/展示/汇报/美化"。读取 `agents/skills/html-visual.md`。

## 可用 Subagents
- `html-visual` -- HTML 可视化输出专家。读取 `agents/subagents/html-visual.md`。
```

### 3. 使用

对 AI 说以下任意触发词即可：

- **卡片**：做成卡片 / 做张图 / 做成分享图 / 小红书分享图 / 美化输出
- **PPT**：做成PPT / 做个演示 / 做个汇报 / slides / 做成报告
- **信息图**：做成信息图 / 深度分析 / 做成网页 / 系统梳理

### 4. 查看示例

直接用浏览器打开 `examples/` 中的 HTML 文件即可体验四种模式的效果。

> PPT 示例需要 `ppt-core.css` 和 `ppt-core.js` 与 HTML 文件同目录（已包含）。

## 配色方案

内置 6 套配色，AI 会根据内容主题自动选择：

| 方案 | 主色调 | 适用主题 |
|------|--------|----------|
| `dark-gold` | 黑金 | **默认**，高端/质感/深色偏好 |
| `light` | 白蓝 | 商务/通用/数据报告 |
| `tech` | 深蓝 | 技术架构/编程/系统设计 |
| `warm` | 暖棕 | 人文/情感/致敬/怀旧 |
| `nature` | 绿色 | 环保/健康/自然/户外 |
| `bold` | 红橙 | 品牌发布/营销/冲击力 |

## 技术要点

- 纯 HTML/CSS/JS，无需构建工具，浏览器直接打开
- 不依赖外部字体和图片，离线可用
- 导出依赖 CDN：html2canvas + jszip + file-saver（仅导出图片时需要网络）
- PPT 模式的 CSS/JS 已抽取为外部文件，AI 只需输出精简的 HTML 内容
- 卡片和信息图模式为自包含 HTML（CSS/JS 内联）

## 适用工具

本工具包为 AI Agent Skill 体系设计，已验证适配：
- Claude Code (CLAUDE.md)
- OpenCode (AGENTS.md)
- Cursor (.cursor/rules/)
- 其他支持自定义指令的 AI 编程工具
