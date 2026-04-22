---
name: "html-visual"
description: "可视化输出路由。识别用户意图后委派给 html-visual subagent 执行。"
version: 5
triggers:
  # 卡片/分享图类
  - "做成卡片"
  - "小红书分享图"
  - "做成分享图"
  - "做成图片分享"
  - "卡片式"
  - "做张图"
  - "做成图"
  - "生成图片"
  - "做成图片"
  - "图文并茂"
  # 长图文类
  - "长内容完整输出"
  - "做成长图"
  - "长图文"
  # 可视化/美化类
  - "做成可视化"
  - "可视化输出"
  - "可视化展示"
  - "漂亮一点输出"
  - "排版好看点"
  - "美化输出"
  - "格式化输出"
  # PPT/演示类
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
  - "做个报告"
  - "做成报告"
  - "keynote"
  - "slideshow"
  - "slide deck"
  # 信息图类
  - "做成信息图"
  - "详细分析图"
  - "infographic"
  - "深度研究"
  - "全量分析"
  - "知识图谱"
  - "做个研究报告"
  - "深度分析"
  - "详细报告"
  - "全面分析"
  - "系统梳理"
  - "完整分析"
  # 网页/HTML类
  - "做成网页"
  - "做成HTML"
  - "做成html"
  - "生成网页"
  - "生成HTML"
---

# html-visual（路由 skill）

本 skill 是轻量路由层。识别到可视化输出意图后，**委派给 `html-visual` subagent 执行**。

## 执行流程

1. 识别用户想要的输出模式（卡片/长文/PPT/信息图）
2. 读取 `agents/subagents/html-visual.md` 获取 subagent 的完整指令
3. 将用户内容 + 模式意图 + 配色偏好一并传递给 subagent
4. subagent 会自动加载对应的子 skill（`html-cards.md` / `html-ppt.md` / `html-infographic.md`）并生成 HTML 文件

## 模式判断速查

| 用户意图 | 模式 | Subagent 加载的 Skill |
|---|---|---|
| 做成卡片/分享图/小红书/做张图/做成图/可视化/漂亮一点/美化/排版好看 | 卡片模式 | `html-cards` |
| 长内容完整输出/做成长图/长图文 | 长文模式 | `html-cards` |
| 做成PPT/做个演示/汇报/展示/slides/presentation/幻灯片/报告/keynote/slideshow | PPT 模式 | `html-ppt` |
| 做成信息图/详细分析/infographic/做成网页/做成HTML/深度研究/系统梳理/知识图谱/深度分析 | 信息图模式 | `html-infographic` |
| 未明确指定 | 卡片模式（默认） | `html-cards` |

## 配色方案

配色方案定义在 subagent 中。速查：

| 内容主题 | 配色 |
|---|---|
| 商务/通用/数据/报告 | light（系统默认） |
| 环保/健康/自然/户外 | nature |
| 技术架构/编程/系统设计 | tech |
| 人文/情感/致敬/怀旧 | warm |
| 品牌发布/营销/冲击力 | bold |
| 高端/质感/深色偏好/用户未指定 | dark-gold（用户偏好默认） |
| 不确定 | dark-gold |
