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

**日期**：2026-03-19
**当前项目路径**：E:/ClaudeTask/MemoryPalace（GitHub: tokyboop/MemoryPalace）
**toky_wiki branch**：`tokyboop/toky_wiki` → `claude/initial-setup-L1HUA`

**本次做了什么**：
- 讨论了 Holmes bot 的个人标签方案（不用访问控制，用人格印记）
- 总结了主人的思维特征，写入 `HOLMES_PERSONA` 常量
- 完整定稿三角色架构方案，写入 `knowledge/holmes-architecture.md`（含完整代码片段）

**已确认的架构决策**：
- 整体人设全部是福尔摩斯，不引入华生角色
- 三个动作：**评估**（triage+decompose合并1次LLM）→ **检索**（向量搜索，纯工具）→ **作答**（Holmes风格，速答/深度推理两种输出）
- 复杂路径：拆子问题 → 并行 query() → 去重合并 top8 → Holmes 显示推理链+结论
- 推理+结论：**1次LLM调用**，prompt 规定 `<推理>...</推理><结论>...</结论>` 格式
- 评估调用：**1次LLM调用**，返回 JSON `{"mode": "quick"|"deep", "sub_questions": [...]}`
- **人格印记**：`HOLMES_PERSONA` 里嵌入主人思维习惯（根本问题驱动、层次结构、对比表格、最小可行方案、蒸馏密度），别人 clone 代码 Holmes 会"读不懂他们"

**主人思维特征摘要（供后续对话参考）**：
- 先找根本问题再建框架；系统化+层次感；信息流转思维
- 执念于"不用人手动维护"；对比表格作为思维工具
- 蒸馏思维（提炼本质，不复制原文）；务实克制（最小可行方案优先）

**下次继续**：
- 直接打开 `E:/ClaudeTask/MemoryPalace`，参考 `knowledge/holmes-architecture.md` 写代码
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
| `<USER>/toky_wiki` | `claude/initial-setup-L1HUA` | wiki 初始化 + Holmes 方案 | 进行中 |
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
