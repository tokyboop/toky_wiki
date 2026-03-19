# 工作记忆 _index.md

> 这是跨对话的工作记忆。每次新对话自动读取，对话结束自动更新。

---

## 当前最重要的事

1. 记忆宫殿代码已写好，但需要改掉 ChromaDB → 换 numpy+pickle 方案
2. 下次直接改 3 个文件（retriever.py、ingest_wiki.py、ingest_claude.py），然后装依赖跑通
3. 还需要准备：Anthropic API key（console.anthropic.com）+ Discord Bot token

---

## 上次交接

**日期**：2026-03-19
**当前项目路径**：E:/ClaudeTask/MemoryPalace

**本次做了什么**：
- 规划并实现了记忆宫殿（221B）完整架构：Discord Bot + Voyage-3 + Claude Sonnet 4.6
- 写好了所有代码：ingest_wiki.py、ingest_claude.py、retriever.py、bot.py、run.bat
- 遇到安装障碍：Python 3.8 32-bit + ChromaDB 需要 C++ 编译，Windows 上装不上
- 决策：放弃 ChromaDB，改用 numpy+pickle 存向量，零 C++ 依赖，规模完全够用

**下次继续**：
- 把 retriever.py 和两个 ingest 脚本改为 numpy+pickle 存储方案
- 新 requirements.txt：anthropic + discord.py + pyyaml + numpy（全有预编译 wheel）
- 装依赖 → 填 config.yaml（API key + Discord token）→ 跑 ingest → 测试 Bot

---

## 活跃项目

| 项目 | 状态 | 路径 | 备注 |
|------|------|------|------|
| 记忆宫殿（221B） | 进行中 | E:/ClaudeTask/MemoryPalace | 代码已写，待改存储方案 |
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
- Embedding：Voyage-3（Anthropic API，同一个 key）
- 生成：Claude Sonnet 4.6
- 查询入口：Discord Bot（跨设备）
- 脱敏：config.yaml 里的 sensitive_keywords 过滤 Claude 对话导出
