# Claude Code Memory 架构深度分析

> 来源：逆向分析 `tokyboop/claude-code-sourcemap` 还原源码
> 日期：2026-04-01

---

## 一、Memory 类型体系

### 语义类型（frontmatter `type:` 字段）

| 类型 | 作用域 | 衰减速度 | 典型内容 |
|------|--------|----------|----------|
| `user` | 永远私有 | 慢 | 角色、偏好、技能背景 |
| `feedback` | 私有/team | 中 | AI 行为纠正与确认 |
| `project` | 偏向 team | 快 | 任务状态、决策、事件 |
| `reference` | 通常 team | 中 | 外部系统指针（Linear/Grafana/Slack） |

### 存储位置枚举（内部）

```typescript
type MemoryType = 'User' | 'Project' | 'Local' | 'Managed' | 'AutoMem' | 'TeamMem'
```

### 文件格式

```markdown
---
name: {{memory name}}
description: {{一行描述 — 用于相关性判断，必须具体}}
type: {{user, feedback, project, reference}}
---

{{body — feedback/project 结构：规则/事实 + **Why:** + **How to apply:**}}
```

**关键**：`description` 字段是 recall 时 AI 判断相关性的**唯一依据**，body 不参与选择。

---

## 二、三大核心 Memory 模式

### 1. Session Memory（对话内保活）

- **路径**：`~/.claude/session-memory/<session-id>.md`
- **触发**：`token 增长 ≥5000` AND `tool calls ≥3`（双条件）
- **执行**：forked subagent 并行更新固定 section

固定 section 结构（不可修改 header）：
```
# Session Title
# Current State      ← 最关键
# Task specification
# Files and Functions
# Workflow
# Errors & Corrections
# Codebase and System Documentation
# Learnings
# Key results
# Worklog
```

限制：整体 ≤12000 tokens，每 section ≤2000 tokens
支持用户自定义：`~/.claude/session-memory/config/template.md`

### 2. Durable Memory（跨对话持久）

- **路径**：`~/.claude/projects/<hash>/memory/*.md`
- **触发**：每次 query 结束后 fire-and-forget（stopHook）
- **执行**：forked subagent，turn1 并行 Read，turn2 并行 Write，≤5 turns
- **互斥**：主 agent 本轮写了 memory 则跳过提取
- **并发控制**：同时只有一个提取在运行，期间产生的最新 context 在当前完成后跑 trailing run

### 3. Team Memory Sync（团队共享）

- **路径**：`.claude/team/`，以 git remote slug（owner/repo）为 key 隔离
- **API**：Anthropic 云端 PUT/GET
- **语义**：Pull 时服务器获胜；delta 上传（哈希对比，只传变更）；文件删除不传播
- **上限**：单次 PUT ≤200KB，单文件 ≤250KB
- **安全**：上传前强制 secret 扫描，含敏感信息的文件跳过不传

---

## 三、findRelevantMemories 两阶段召回

```
① scanMemoryFiles
   - 读所有 memory 目录下 .md 文件的前 30 行（frontmatter）
   - 解析 description + type
   - 按 mtime 降序，取前 200 个

② Sonnet sideQuery（AI 选择器）
   - 输入：用户消息 + manifest（filename + description）
   - 输出：最多 5 个文件名
   - 策略保守：不确定则不选
   - 活跃工具的参考文档 memory 被排除（已在工作上下文中，选了是噪音）
   - alreadySurfaced 去重：跳过已在先前 turn 展示过的文件

③ 注入 system-reminder
   - 超 1 天的 memory 附加新鲜度警告（"This memory is N days old..."）
   - 防止旧 file:line 引用失效导致误导
```

---

## 四、压缩机制

当 context 触达压缩阈值时，优先用 Session Memory 替代 LLM 压缩 API：

```
保留策略（calculateMessagesToKeepIndex）：
  从 lastSummarizedMessageId 开始向前扩展，直到：
  - tokens ≥ 10,000（minTokens）
  - 含文字块消息 ≥ 5（minTextBlockMessages）
  - 不超过 40,000 tokens（maxTokens）
```

结果：truncated session memory + 保留的最近消息，无需调用压缩 API，更快。

---

## 五、Agent Memory（Subagent 专属）

### 三种作用域

| Scope | 路径 | 特点 |
|-------|------|------|
| `user` | `<memBase>/agent-memory/<type>/` | 全局，跨项目 |
| `project` | `<cwd>/.claude/agent-memory/<type>/` | 项目级，进 VCS |
| `local` | `<cwd>/.claude/agent-memory-local/<type>/` | 本地，不进 VCS |

### Snapshot 机制

团队分发：`.claude/agent-memory-snapshots/<agentType>/snapshot.json`
三种状态：`none`（已最新）/ `initialize`（从 snapshot 初始化）/ `prompt-update`（提示合并）
不会强制覆盖本地，本地删除不传播回 snapshot。

---

## 六、数据流全景

```
对话中   → postSamplingHook → Session Memory（周期更新，~每5000 token触发）
query后  → stopHook         → extractMemories（durable memory，每次）
用户消息  → findRelevantMemories → 注入 recall（≤5条 + 新鲜度警告）
context满 → compaction      → session memory 替代 LLM 压缩
文件变化  → teamMemorySync  → delta push 云端（watcher 触发）
```

---

## 七、对自建系统的实践启发

1. **description 字段是架构核心**：召回时只看 description，写 memory 时这行必须精准具体，是召回质量的决定性因素

2. **forked subagent 是标准写 memory 模式**：隔离、并行（turn1 Read，turn2 Write）、有限 turns（≤5），避免主对话污染

3. **互斥设计**：主 agent 直接写 memory 和后台提取 agent 互斥，防止重复/冲突

4. **新鲜度机制**：超过 1 天的 memory 附加警告，防止旧引用失效导致误导，是实际用户反馈驱动的设计

5. **团队 memory 保守删除**：删除不传播，避免数据丢失，符合"宁可重复也不丢失"的协作安全原则

6. **alreadySurfaced 去重**：recall 时跳过已展示的，让 5 个名额始终用于新鲜信息

7. **Session Memory 替代压缩**：维护结构化笔记 > 依赖 LLM 压缩 API，成本更低且可预期
