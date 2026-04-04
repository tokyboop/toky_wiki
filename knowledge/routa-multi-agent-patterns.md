# Routa 多 Agent 协作模式 — 学习笔记

> 来源：phodal/routa v0.12.1（2026-04-03）
> 适用：Agent 工程设计、个人 AI 工作流优化、Skill 系统改造

---

## Routa 是什么

一个多 agent 协作开发平台。不用单个 AI 包揽所有角色，而是把真实团队的职位分工映射到 agent 上，通过 Kanban 看板协调。

```
Backlog → Todo → Dev → Review → Done
   ↑        ↑      ↑      ↑       ↑
 精化      编排   实现   审查    报告
```

每列对应一个专职 agent，看板是唯一的通信介质。

---

## 三条核心架构思路

### 1. 角色分离 = 认知分离

同一个 agent 又写代码又做 review，天然有确认偏误——自己写的不容易发现自己的问题。拆成两个角色后，Review Guard 天然站在批判视角，质量更高。

**迁移到个人 workflow**：同一个 skill 不应该既负责"做"又负责"评"。设计 skill 时明确它是执行角色还是反馈角色。

---

### 2. 状态外化：看板作为 single source of truth

Agent 不依赖对话历史，只读看板上的卡片状态。跨 session、跨 agent 切换时，状态不丢失。

**对应的痛点**：Claude Code 跨会话丢失上下文，根本原因是状态活在对话里，没有外化。

**最小实现**：`focus/` 目录下的当前状态文件，每次对话开始时强制读取，结束时强制更新——就是 Kanban 的最小替代。

---

### 3. Done Reporter：强制收尾步骤

每个任务完成后有专门的 Done Reporter，唯一职责是文档化"刚做了什么"。这是一个**强制触发机制**，不依赖执行者的主动意愿。

**对应的痛点**：知识不沉淀成 skill，原因是没有强制收尾步骤。

**最小实现**：在 `context-backup` skill 的末尾加一步检查——"这次对话有没有值得提炼的 skill？有就写，没有就跳过。"

---

## v0.12.1 发布了什么

这是一个基建版本（7 个 commits），没有大功能：

| 变更 | 内容 |
|------|------|
| `fix(ui)` | WebKit viewport 稳定性修复 |
| `fix(harness)` | 内联 overview lifecycle context |
| `feat(ci)` | **自动化发布 5 个 Rust crates 到 crates.io** |
| `test` | 并行批处理时序断言稳定化 |

最值得注意的是 CI 自动化：routa 的核心模块（`routa-core`、`routa-rpc`、`routa-scanner`、`routa-server`、`routa-cli`）现在在打 tag 时自动发布。说明项目进入了稳定的发布节奏。

---

## 可直接借鉴的模式

| routa 设计 | 对应 toky_wiki 改造 |
|-----------|-------------------|
| 看板列 = agent 职责边界 | skill 设计时明确"执行"vs"评审"角色 |
| 看板卡片 = 跨 agent 状态传递 | `focus/current.md` 作为跨 session 状态锚点 |
| Done Reporter 强制触发 | context-backup 末尾加 skill 提炼检查 |
| 角色专职化 | 一个 skill 只做一件事，不跨职责 |
