# 工作记忆 _index.md

> 这是跨对话的工作记忆。每次新对话自动读取，对话结束自动更新。

---

## 当前最重要的事

1. **FP 运营数据能力建设** — 异常监控告警方案已设计完，下周一提供表结构后写真实 SQL + Python 脚本
2. **MemoryPalace 三角色架构升级** — 方案已定稿，等 FP 告警告一段再继续
3. **Skill 体系增强** — 两个待做改进：① context-backup 加格式类型判断（md/md+code/script）② skill提炼前加 scaffold 模板参考步骤

---

## 上次交接

**日期**：2026-03-25
**当前项目路径**：`<LOCAL>/toky_wiki`（GitHub: `<USER>/toky_wiki`）
**toky_wiki branch**：`claude/enhance-skill-extraction-B4vJ2`

**本次做了什么**：

### Skill 格式分类讨论
- 识别出 skill 提炼固定输出纯 MD 是个缺口
- 定义三种格式类型：a. 纯 MD（思维/判断型）b. MD+代码（流程型）c. 脚本为主+少量 MD（执行型）
- 改进方案：SKILL.md frontmatter 加 `type` 字段，提炼时按类型决定是否生成 .sh/.py

### Citadel 改造为 Agent 工程构建工具
- 分析现有体系已吸收 Citadel 一半：barrel export ↔ _index.md、/marshal ↔ context-backup 等
- 识别真正缺口：`/scaffold` 没有 agent 版本 → 新 skill 提炼前应先扫描已有 SKILL.md 当模板
- 改造优先级：格式分类 → scaffold 模板参考 → Citadel skill 改写（可选）

### Wiki & README 更新
- 新建 `knowledge/skill-type-and-agent-engineering.md`（以上两个分析的完整记录）
- 更新 `knowledge/_catalog.md` 加入新索引
- 更新 `README.md`：补充 knowledge/、.claude/ 集成、Skill 清单、指向 _catalog.md

**下次继续**：
- 实际修改 context-backup SKILL.md，加入格式类型判断逻辑（第 6 步）
- FP 异常监控：等 Lord 提供表名和字段 → 写真实 SQL → Python 脚本 → 飞书 webhook

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
| `<USER>/toky_wiki` | `claude/enhance-skill-extraction-B4vJ2` | skill格式分类 + Citadel改造 + README更新 | 进行中 |
| `<USER>/toky_wiki` | `main` | wiki 主干 | 稳定 |
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
- `knowledge/skill-type-and-agent-engineering.md` — Skill 格式三分类 + Citadel 改造为 agent 工程构建工具

## 记忆宫殿技术决策

- 向量存储：numpy+pickle（非 ChromaDB）
- Embedding：text-embedding-3-small（OpenAI 兼容，apiyi.com 转发）
- 生成：gpt-4o-mini（同上）
- 查询入口：Discord Bot（跨设备）
- 脱敏：config.yaml 里的 sensitive_keywords 过滤
- 部署：朋友的服务器（CentOS 9）
- GitHub 仓库：`<USER>/MemoryPalace`
