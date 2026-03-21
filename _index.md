# 工作记忆 _index.md

> 这是跨对话的工作记忆。每次新对话自动读取，对话结束自动更新。

---

## 当前最重要的事

1. **FP 运营数据能力建设** — 异常监控告警方案已设计完，下周一提供表结构后写真实 SQL + Python 脚本
2. **MemoryPalace 三角色架构升级** — 方案已定稿，等 FP 告警告一段再继续

---

## 上次交接

**日期**：2026-03-21
**当前项目路径**：`<LOCAL>/toky_wiki`（GitHub: `<USER>/toky_wiki`）
**toky_wiki branch**：`claude/citadel-setup-U6O0d`

**本次做了什么**：

### Citadel hook 修复
- protect-files hook 的 `exit 2` 是硬拦截，没有确认框
- hook 保护了自己（`setup/hooks/`），造成死锁
- 修复：`exit 2` → 警告 + `exit 0`，依赖 Claude Code 自身权限弹窗
- `_index.md` 从保护名单移除

### Skill 体系整合
- 合并 bubble-sync 到 context-backup（记忆续接 + 精华提炼合一）
- 新建 skill-vetter（第三方代码六项安全审查）
- 新建 fp skill（第一性原理五问自检，触发词 `fp`）
- 从 `<USER>/claude-skills` 仓库迁移整合

### 称呼规则
- 泡泡 = Claude 的自称/昵称（不是触发词）
- 对用户称呼 = Lord

### FP 异常监控告警方案设计
- 5 种对比维度：日环比、周同比、月整体、活动期对比、历史活动对比
- SQL 通用模板：当前值 vs 基线值 → 变化率 → 超阈值告警
- 告警通道：飞书机器人 webhook
- 执行管道：cron + Python 脚本
- 初版监控指标：DAU、道具消耗量、充值金额、新增用户数

### 运营 insight
- 7 条优先级已确认，第 1 条（活动 log）老活动推不动
- 先做 2-4（自己能控制的），不依赖研发改架构

**下次继续**（下周一）：
- FP 异常监控：Lord 提供表名和字段 → 写真实 SQL → 写 Python 脚本 → 接飞书 webhook
- 需要确认：数据库类型（MySQL/PG/CH）、表结构、先跑哪个指标

---

## 活跃项目

| 项目 | 状态 | 本地路径 | 备注 |
|------|------|---------|------|
| FP 运营数据能力 | 告警方案设计完 | `<LOCAL>/toky_wiki` | 下周一写脚本 |
| 记忆宫殿（221B） | 架构升级中 | `<LOCAL>/MemoryPalace` | GitHub: `<USER>/MemoryPalace` |
| toky_wiki 知识库 | 进行中 | `<LOCAL>/toky_wiki` | GitHub: `<USER>/toky_wiki` |

## 活跃 Branch

| 仓库 | Branch | 任务 | 状态 |
|------|--------|------|------|
| `<USER>/toky_wiki` | `claude/citadel-setup-U6O0d` | hook 修复 + skill 整合 + FP 告警 | 进行中 |
| `<USER>/toky_wiki` | `main` | wiki 主干 | 已完成 ✓ |
| `<USER>/MemoryPalace` | 待开 | Holmes 三角色架构实现 | 暂缓 |

---

## Skill 清单

| Skill | 触发词 | 作用 |
|-------|--------|------|
| context-backup | "先到这"、"结束"、"同步一下" | 记忆续接 + 精华提炼 |
| fp | `fp` | 第一性原理五问自检 |
| skill-vetter | "安装"、"install"、"这个安全吗" | 第三方代码安全审查 |
| update-rule | "加一条规则" | 向 CLAUDE.md 写入规则 |

## 笔记索引

- `knowledge/fp-ops-roadmap.md` — 运营数据能力建设路线（含异常监控方案）
- `knowledge/distillation-sop.md` — 蒸馏方法论 SOP
- `knowledge/echo-scheduler.md` — 多Agent调度系统
- `knowledge/mastermind.md` — AI记忆操作系统
- `knowledge/knowledge-base-rag.md` — 个人记忆宫殿（RAG）
- `knowledge/holmes-architecture.md` — Holmes 三角色架构完整方案
- `knowledge/citadel.md` — Citadel：Claude Code 四级智能编排框架
- `knowledge/citadel-skills-catalog.md` — Citadel 13个 Skill 速查表

## 记忆宫殿技术决策

- 向量存储：numpy+pickle（非 ChromaDB）
- Embedding：text-embedding-3-small（OpenAI 兼容，apiyi.com 转发）
- 生成：gpt-4o-mini（同上）
- 查询入口：Discord Bot（跨设备）
- 脱敏：config.yaml 里的 sensitive_keywords 过滤
- 部署：朋友的服务器（CentOS 9）
- GitHub 仓库：`<USER>/MemoryPalace`
