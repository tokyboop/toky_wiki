# 工作记忆 _index.md

> 这是跨对话的工作记忆。每次新对话自动读取，对话结束自动更新。

---

## 当前最重要的事

1. **MemoryPalace 三角色架构升级**：方案已完整定稿，写进 `knowledge/holmes-architecture.md`，下一步直接写代码
   - `retriever.py` 新增：`triage_and_decompose()` + `answer_holmes()` + `HOLMES_PERSONA` + `_extract_tag()`
   - `bot.py` 新增路由逻辑 + `_build_holmes_embed()`
2. **Holmes KB 设计**：记住两个必问问题（范围过滤标签 + 冷启动时明确区分推理vs记忆）
3. 部署事项暂缓，等架构升级完再重新部署

---

## 上次交接

**日期**：2026-03-27
**当前项目路径**：E:/ClaudeTask（主要在 claude-skills + toky_wiki + PrivateSet）

**本次做了什么**：
- 拆解了外部 prompt-master + material-analyst 双 Agent 包
- 总结成设计模式文档：`toky_wiki/knowledge/agent-skill-design-patterns.md`
- 创建 skill 编写思路清单：`claude-skills/SKILL_WRITING_GUIDE.md`
- 给 4 个 skill 全部加了演化日志（skill-vetter、bubble-sync、sql-helper、weekly-monitor）
- 沉淀了多条 memory（演化日志习惯、先列优缺点、输出格式固化、checklist来自踩坑、RAG两个必问问题、端到端自检、诚实性规则写进全局CLAUDE.md）
- 把 Claude 配置文件（CLAUDE.md、settings.json、3个.sh hook）备份到 PrivateSet
- 完善了换设备恢复步骤文档

**下次继续**：
- 打开 `E:/ClaudeTask/MemoryPalace`，参考 `knowledge/holmes-architecture.md` 写代码
- 入口：`retriever.py`，按顺序新增 `HOLMES_PERSONA` → `triage_and_decompose()` → `answer_holmes()` + `_extract_tag()`
- 然后改 `bot.py`：路由逻辑 + `_build_holmes_embed()`

---

## 活跃项目

| 项目 | 状态 | 本地路径 | 备注 |
|------|------|---------|------|
| 记忆宫殿（221B） | 架构升级中 | `E:/ClaudeTask/MemoryPalace` | GitHub: `tokyboop/MemoryPalace` |
| toky_wiki 知识库 | 进行中 | `E:/ClaudeTask/toky_wiki` | GitHub: `tokyboop/toky_wiki` |
| 运营监控工具 | 维护中 | `E:/ClaudeTask/MonitoringTool` | 见 MonitoringTool/ |

## 活跃 Branch

| 仓库 | Branch | 任务 | 状态 |
|------|--------|------|------|
| `tokyboop/toky_wiki` | `main` | wiki 知识沉淀 | 进行中 |
| `tokyboop/MemoryPalace` | 待开 | Holmes 三角色架构实现 | 下一步 |

---

## 笔记索引

- `knowledge/distillation-sop.md` — 蒸馏方法论 SOP
- `knowledge/echo-scheduler.md` — 多Agent调度系统
- `knowledge/mastermind.md` — AI记忆操作系统
- `knowledge/knowledge-base-rag.md` — 个人记忆宫殿（RAG）
- `knowledge/holmes-architecture.md` — Holmes 三角色架构完整方案（含代码片段）
- `knowledge/agent-skill-design-patterns.md` — Agent/Skill 设计模式参考（2026-03-27新增）

## 记忆宫殿技术决策

- 向量存储：numpy+pickle（非 ChromaDB，避免 C++ 编译依赖）
- Embedding：text-embedding-3-small（OpenAI 兼容，apiyi.com 转发）
- 生成：gpt-4o-mini（同上）
- 查询入口：Discord Bot（跨设备）
- 脱敏：config.yaml 里的 sensitive_keywords 过滤 Claude 对话导出
- 部署：朋友的服务器（CentOS 9），接力文档 DEPLOY.md
- GitHub 仓库：`tokyboop/MemoryPalace`
