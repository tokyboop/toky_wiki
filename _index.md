# 工作记忆 _index.md

> 这是跨对话的工作记忆。每次新对话自动读取，对话结束自动更新。

---

## 当前最重要的事

1. **MemoryPalace 三角色架构升级**：方案已完整定稿，写进 `knowledge/holmes-architecture.md`，下一步直接写代码
   - `retriever.py` 新增：`triage_and_decompose()` + `answer_holmes()` + `HOLMES_PERSONA` + `_extract_tag()`
   - `bot.py` 新增路由逻辑 + `_build_holmes_embed()`
2. 部署事项暂缓，等架构升级完再重新部署

---

## 上次交接

**日期**：2026-03-21
**当前项目路径**：`<LOCAL>/toky_wiki`（GitHub: `<USER>/toky_wiki`）
**toky_wiki branch**：`main`

**本次做了什么**：
- 恢复上下文后处理 stop hook 报告的"8 unpushed commits on main"问题
- 发现本地 main 与 origin/main 分叉：本地有旧的合并 commit，远端已通过 PR 合并了更新的版本（含 setup/hooks/、sync-back 脚本等）
- `_index.md` 内容一致，本地 8 个旧 commit 的有效内容已被远端 PR 包含
- 执行 `git reset --hard origin/main`，消除分叉，本地 main 与远端同步

**结论**：
- toky_wiki 初始化工作已全部完成并合并到 main
- stop hook 不会再报 unpushed commit

**下次继续**：
- 转战 MemoryPalace，打开 `<LOCAL>/MemoryPalace`
- 参考 `knowledge/holmes-architecture.md` 写代码
- 入口：`retriever.py`
  1. 新增 `HOLMES_PERSONA` 常量
  2. 新增 `triage_and_decompose(question)`
  3. 新增 `answer_holmes(question, sub_questions)` + `_extract_tag()`
  4. 现有 `answer()` / `query()` 保持不动
- 然后改 `bot.py`：路由逻辑 + `_build_holmes_embed()`

---

## 活跃项目

| 项目 | 状态 | 本地路径 | 备注 |
|------|------|---------|------|
| 记忆宫殿（221B） | 架构升级中 | `<LOCAL>/MemoryPalace` | GitHub: `<USER>/MemoryPalace` |
| toky_wiki 知识库 | 进行中 | `<LOCAL>/toky_wiki` | GitHub: `<USER>/toky_wiki` |
| 运营监控工具 | 维护中 | `<LOCAL>/MonitoringTool` | 见 MonitoringTool/ |

## 活跃 Branch

| 仓库 | Branch | 任务 | 状态 |
|------|--------|------|------|
| `<USER>/toky_wiki` | `main` | wiki 初始化 | 已完成 ✓ |
| `<USER>/MemoryPalace` | 待开 | Holmes 三角色架构实现 | 下一步 |

---

## 笔记索引

- `knowledge/distillation-sop.md` — 蒸馏方法论 SOP
- `knowledge/echo-scheduler.md` — 多Agent调度系统
- `knowledge/mastermind.md` — AI记忆操作系统
- `knowledge/knowledge-base-rag.md` — 个人记忆宫殿（RAG）
- `knowledge/holmes-architecture.md` — Holmes 三角色架构完整方案（含代码片段）

## 记忆宫殿技术决策

- 向量存储：numpy+pickle（非 ChromaDB，避免 C++ 编译依赖）
- Embedding：text-embedding-3-small（OpenAI 兼容，apiyi.com 转发）
- 生成：gpt-4o-mini（同上）
- 查询入口：Discord Bot（跨设备）
- 脱敏：config.yaml 里的 sensitive_keywords 过滤 Claude 对话导出
- 部署：朋友的服务器（CentOS 9），接力文档 DEPLOY.md
- GitHub 仓库：`<USER>/MemoryPalace`
