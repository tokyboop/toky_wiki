# Citadel — Claude Code 智能编排框架

> 来源：https://github.com/SethGammon/Citadel

## 根本问题（一句话）

Claude Code 默认把所有任务一视同仁——改个 typo 和重构整个模块走一样的路径。Citadel 解决的是：**如何根据任务复杂度自动选择最省资源的执行方式，并让多 agent 协作成为可能**。

## 核心框架：四级编排阶梯

| 层级 | 名称 | 适用场景 | 开销 | 是否写代码 |
|------|------|----------|------|------------|
| L0 | **Skill** | 单一领域任务（review/refactor/test-gen） | 零进程开销，只加载指令 | 是 |
| L1 | **Marshal** | 多步骤但单会话内可完成的任务 | 单会话内链式调用多 Skill | 是（通过 Skill） |
| L2 | **Archon** | 跨会话的大型战役（campaign） | 持久化状态文件，委派 Marshal | 否，只编排 |
| L3 | **Fleet** | 需要并行的大型工程 | 多 worktree + 多 agent 同时跑 | 否，只编排 |

### 关键设计：越高层越不写代码

- Skill：直接干活
- Marshal：调度 Skill 干活，自己也直接干
- Archon：只做决策和委派，不碰代码
- Fleet：并行协调多个 Archon/Marshal，自己也不碰代码

## 统一入口：`/do` 路由器

所有任务通过 `/do [意图]` 进入，路由器用四层分类把任务丢到最便宜的通道：

```
用户输入 → /do
  ├─ Tier 0: 关键词匹配（typecheck/build/test） → 直接执行（~0 token）
  ├─ Tier 1: 活跃状态检测 → 有在跑的 campaign？继续它（~0 token）
  ├─ Tier 2: Skill 关键词（review/refactor/doc） → 直接调 Skill（~0 token）
  └─ Tier 3: LLM 分类（~500 token） → 根据复杂度评分路由
       ├─ 复杂度 1-2 → Skill / 直接执行
       ├─ 复杂度 3+ 且需持久化 → Archon
       └─ 需要并行 → Fleet
```

**设计哲学：宁可低估也不高估**——把简单任务误判为复杂的代价 > 把复杂任务误判为简单的代价（用户可以手动升级）。

## 信息流转：一个 Fleet 场景走完整流程

场景：用户说 `/do 给整个项目加单元测试`

1. `/do` 路由器判断：范围大 + 可并行 → 路由到 Fleet
2. **Fleet Commander** 启动，读取项目结构，规划 Wave 1：派 2 个 agent 各负责不同模块
3. 每个 agent 在独立的 **git worktree** 中工作，互不干扰
4. Wave 1 完成后，每个 agent 输出 **HANDOFF block**（发现摘要）
5. Fleet 用 `compress-discovery.cjs` 把每个发现压缩到 ~500 token 的 **discovery brief**
6. Wave 2 的 agent 启动时注入上一波的 discovery brief → 避免重复发现
7. 所有 wave 完成 → Fleet 汇总结果

```
Fleet Commander (不写代码)
  ├─ Wave 1
  │   ├─ Agent A (worktree-1) → HANDOFF → brief-A (~500 tok)
  │   └─ Agent B (worktree-2) → HANDOFF → brief-B (~500 tok)
  ├─ Wave 2 (注入 brief-A + brief-B)
  │   ├─ Agent C (worktree-3) → HANDOFF → brief-C
  │   └─ Agent D (worktree-4) → HANDOFF → brief-D
  └─ 汇总报告
```

## 8 个生命周期 Hook

| Hook 事件 | 脚本 | 作用 |
|-----------|------|------|
| PreToolUse (Edit/Write) | `protect-files.js` | 保护关键文件不被改动 |
| PostToolUse | `post-edit.js` | 每次编辑后自动跑类型检查 |
| PreCompact | `pre-compact.js` | 上下文压缩前保存关键信息 |
| PostCompact (SessionStart) | `restore-compact.js` | 压缩后恢复关键上下文 |
| WorktreeCreate | `worktree-setup.js` | 并行 agent 的 worktree 初始化（装依赖等） |
| Stop | `quality-gate.js` | 会话结束时质量扫描 |
| PostToolUseFailure | `circuit-breaker.js` | 连续失败 3 次提醒换思路，5 次强制停下重想 |
| SessionStart | `intake-scanner.js` | 扫描待办队列 |

## 13 个内置 Skill

| Skill | 功能 |
|-------|------|
| `review` | 5-pass 代码审查（结构→逻辑→安全→风格→总结） |
| `test-gen` | 框架感知的测试生成，迭代直到通过 |
| `doc-gen` | 文档生成（函数/模块/API 三种模式） |
| `refactor` | 安全重构（前后对比类型检查） |
| `scaffold` | 项目感知的脚手架 |
| `create-skill` | 自定义 Skill 创建 |
| `marshal` | 单会话多步骤编排 |
| `archon` | 跨会话战役编排 |
| `fleet` | 并行 agent 编排 |
| `do` | 统一意图路由 |
| `autopilot` | 自动驾驶模式 |
| `setup` | 初始配置 |
| `session-handoff` | 会话交接 |

## Campaign 持久化

战役状态存储在 `.planning/campaigns/` 的 markdown 文件中：

```
# Campaign: add-unit-tests
## Status: active
## Direction: 给整个项目加单元测试
## Phases:
  - [x] research: 分析现有测试覆盖率
  - [ ] build: 编写测试
  - [ ] verify: 运行并修复
## Decision Log:
  - 选择 vitest 而不是 jest（项目已有 vite）
## Continuation State:
  - 当前阶段：build
  - 下一步：src/utils/ 模块
```

关掉 Claude Code 再打开 → Archon 读取 campaign 文件 → 从断点继续。

## 和其他方案的对比

| 维度 | 裸 Claude Code | Citadel | 自己写脚本编排 |
|------|---------------|---------|---------------|
| 任务路由 | 无，全部直接执行 | 4 层自动路由 | 需要自己实现 |
| 并行 agent | 手动开多窗口 | Fleet 自动管理 worktree | 需要自己管 |
| 跨会话记忆 | 无 | Campaign 文件 | 需要自己设计 |
| 失败处理 | 无 | Circuit breaker | 需要自己写 |
| 文件保护 | 无 | Hook 拦截 | 需要自己写 |
| 安装成本 | 0 | `git clone` + 基本配置 | 高 |

## 关键局限

1. **强依赖 Claude Code CLI** — 不能用在其他 LLM 工具上
2. **Node.js 18+ 必须** — Hook 脚本全是 JS
3. **Token 消耗不透明** — 虽有 telemetry，但复杂战役的实际 token 成本难预估
4. **学习曲线** — 4 层架构 + 13 个 Skill + 8 个 Hook，概念多
5. **单人项目** — 作者从 198 个 agent 运行中总结出来的，但社区验证少

## 什么时候该想到它

- ✅ 你在用 Claude Code 做大型项目，经常需要跨会话持续工作
- ✅ 你想让多个 Claude agent 并行干活（比如同时处理多个模块）
- ✅ 你觉得 Claude Code 对简单任务用力过猛，想要智能路由
- ✅ 你想要自动化的代码审查 / 测试生成 / 重构流程
- ❌ 你只是偶尔用 Claude Code 改改代码
- ❌ 你不用 Claude Code（这个框架完全绑定 Claude Code CLI）

## 项目结构速查

```
.claude/
  settings.json          # Hook 注册
  hooks/                 # 8 个生命周期 Hook（JS）
  skills/                # 13 个 Skill（Markdown 指令集）
  agents/                # 4 个 Agent 定义
    archon.md            # 战役编排者
    fleet.md             # 并行协调者
    arch-reviewer.md     # 架构审查
    knowledge-extractor.md  # 知识提取
  agent-context/         # 注入给子 agent 的上下文

.planning/
  intake/                # 待处理工作项
  campaigns/             # 活跃/完成的战役状态
  fleet/                 # Fleet 会话状态 + discovery brief
  coordination/          # 多实例作用域声明
  telemetry/             # JSONL 日志（本地）

scripts/
  coordination.js        # 多实例协调
  compress-discovery.cjs # discovery brief 压缩
  parse-handoff.cjs      # 解析 HANDOFF block
  telemetry-log.cjs      # 遥测日志
  telemetry-report.cjs   # 遥测报告
```

## 核心洞察

> "Built from running 198 autonomous agents across 32 fleet sessions on a production codebase. 27 postmortems worth of lessons baked into every hook and skill."

这不是理论框架，是从大量实战中蒸馏出来的。每个 Hook、每个 Skill 背后都有具体的失败案例驱动。
