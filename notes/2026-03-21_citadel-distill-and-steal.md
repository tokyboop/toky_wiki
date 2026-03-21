# 从 Citadel 偷师记录

> 日期：2026-03-21
> 来源：https://github.com/SethGammon/Citadel

## 背景

Citadel 是一个 Claude Code 的智能编排框架，作者从跑 198 个自治 agent、32 次 Fleet 并行会话中总结出来。核心思路：根据任务复杂度自动选最省 token 的执行路径。

## 我学到了什么

### 四级编排阶梯（Citadel 的核心架构）

```
Skill（指令集，零开销）
  → Marshal（单会话多步骤）
    → Archon（跨会话战役，不写代码只编排）
      → Fleet（并行 agent，worktree 隔离）
```

**越高层越不碰代码，只做决策和委派。**

### 和我的体系对比后的结论

| 维度 | 我的体系 | Citadel | 结论 |
|------|---------|---------|------|
| 跨会话记忆 | `_index.md` + context-backup | Campaign markdown | 我的更通用，不需要抄 |
| Hook 体系 | 2 个（提醒备份 + 检查 unpushed） | 8 个 | 差距大，值得偷 |
| 任务路由 | 无 | `/do` 四层路由 | 我的规模暂时不需要 |
| 并行 Agent | 无 | Fleet + discovery brief | 思路值得记录，等需要时用 |

## 我偷了什么（已落地）

### 1. Circuit Breaker Hook

**解决的问题**：Claude 在错误路径上反复尝试同一个失败操作，浪费 token。

**实现**：
- 注册到 `PostToolUseFailure` 事件
- 用 JSON 状态文件跟踪连续失败次数（按 session 隔离）
- 连续 3 次失败 → 警告 + 建议：重新读文件、检查前置条件、换思路
- 累计熔断 5 次 → 强制停下重想整体策略
- 原子写入（tmp → rename）防止状态文件损坏

### 2. Protect Files Hook

**解决的问题**：关键配置文件被 Claude（或子 agent）意外修改。

**实现**：
- 注册到 `PreToolUse`（matcher: `Edit|Write`）
- 保护名单：`_index.md`、`CLAUDE.md`、`settings.json`、`hooks/` 目录
- 匹配命中 → exit 2 阻止操作，输出提示
- 支持精确匹配和目录前缀匹配

### 3. Citadel Skill 速查表

保存了 Citadel 13 个 Skill 的核心信息，方便未来需要时查阅：
- `/review`：5-pass 代码审查（Correctness → Security → Performance → Readability → Consistency）
- `/test-gen`：框架感知测试生成，只 mock 外部边界，交付前必须全绿
- `/refactor`：安全重构，前后 typecheck 对比，修不好就回滚
- `/doc-gen`：信息密度优先，签名已说明的不重复写
- `/scaffold`：用项目现有代码当模板，不用通用模板
- `/create-skill`：重复 2+ 次的操作 → 提炼成永久 Skill

## 待实践（记录但未落地）

### Discovery Brief 模式
- 每个 agent 输出结构化 HANDOFF block → 压缩到 ~500 token → 注入下一个 agent
- 和我的 `_index.md` 的区别：`_index.md` 是人类级别记忆，brief 是机器级别记忆
- 未来跑多 agent 并行时可以参考

### Quality Gate 增强
- 当前 stop hook 只检查 unpushed commits
- 可扩展：扫改动文件反模式（hardcoded secrets、TODO、debug 语句）、检查是否跑过测试

## 文件清单

```
setup/hooks/circuit-breaker.sh    # 新增 — 熔断器 hook
setup/hooks/protect-files.sh      # 新增 — 文件保护 hook
knowledge/citadel.md              # 新增 — Citadel 蒸馏笔记（完整框架分析）
knowledge/citadel-skills-catalog.md  # 新增 — 13个 Skill 速查表
.claude/settings.json             # 修改 — 注册新 hook
_index.md                         # 修改 — 更新笔记索引
```
