# 工作记忆 _index.md

> 这是跨对话的工作记忆。每次新对话自动读取，对话结束自动更新。

---

## 当前最重要的事

1. 朋友的新加坡服务器（CentOS 9）部署 221B Bot → 照 DEPLOY.md 操作
2. 服务器上 clone toky_wiki + MemoryPalace，跑 ingest 重建索引，启动 bot.py
3. 部署完后 Discord 验证 `!ask` 功能

---

## 上次交接

**日期**：2026-03-19
**当前项目路径**：E:/ClaudeTask/MemoryPalace

**本次做了什么**：
- numpy+pickle 方案全部改完，本地 ingest 跑通（36 块），retriever 本地查询成功
- API 从 Anthropic 换成 OpenAI 兼容（apiyi.com 转发，text-embedding-3-small + gpt-4o-mini）
- Discord Bot 已创建并邀请到服务器，本地因代理冲突（TUN 模式拦截 API）无法同时跑
- 决策：部署到朋友的新加坡云服务器（CentOS 9），彻底避开代理问题
- 已创建 DEPLOY.md 接力文档 + config.example.yaml，代码已推 GitHub

**下次继续**：
- 在新加坡服务器上用 Claude Code 照 DEPLOY.md 部署
- 服务器需要：装 Python 3.10+、clone 两个仓库、创建 config.yaml、跑 ingest、启动 bot
- 可选：用 systemd 设置 Bot 开机自启（DEPLOY.md 里有模板）

---

## 活跃项目

| 项目 | 状态 | 路径 | 备注 |
|------|------|------|------|
| 记忆宫殿（221B） | 待部署 | E:/ClaudeTask/MemoryPalace | 代码完成，待部署到新加坡服务器 |
| toky_wiki 知识库 | 进行中 | E:/ClaudeTask/toky_wiki | 已有4篇蒸馏笔记 |
| 运营监控工具 | 维护中 | E:/ClaudeTask/MonitoringTool | 见 MonitoringTool/ |

---

## 笔记索引

- `knowledge/distillation-sop.md` — 蒸馏方法论 SOP
- `knowledge/echo-scheduler.md` — 多Agent调度系统
- `knowledge/mastermind.md` — AI记忆操作系统
- `knowledge/knowledge-base-rag.md` — 个人记忆宫殿（RAG）

## 记忆宫殿技术决策

- 向量存储：numpy+pickle（非 ChromaDB，避免 C++ 编译依赖）
- Embedding：text-embedding-3-small（OpenAI 兼容，apiyi.com 转发）
- 生成：gpt-4o-mini（同上）
- 查询入口：Discord Bot（跨设备）
- 脱敏：config.yaml 里的 sensitive_keywords 过滤 Claude 对话导出
- 部署：朋友的新加坡服务器（CentOS 9），接力文档 DEPLOY.md
- GitHub 仓库：tokyboop/MemoryPalace
