# Anthropic Harness Design for Long-Running Apps 蒸馏

> 原文：https://www.anthropic.com/engineering/harness-design-long-running-apps
> 作者：Prithvi Rajasekaran（Anthropic Labs）
> 蒸馏日期：2026-03-28

---

## 根本问题：Agent 做长任务会失败

一个复杂 App 不可能在一个 context window 内完成，必须跨多个 session。但每个新 session 开始时，Agent 对之前发生的事情一无所知。

结果：
- 越做越乱，后期 context 塞满后开始犯低级错误
- 让模型自我检查质量？它会说"很好"，即使结果很烂

---

## 三个具体改进，各解决一个痛

**1. `claude-progress.txt` → 解决跨 session 失忆**
每个 session 结束前写入进度，下一个 session 启动时先读它。相当于交接班文档。

**2. 独立 Evaluator → 解决自评不可靠**
专门一个 Agent 用 Playwright 驱动真实浏览器测试——点击、测 API、验数据库。不是生成者自己看代码。生成者和评估者不能是同一个。

**3. Planner → 解决范围失控**
一句话需求先扩展成完整规格（功能列表 + Sprint 划分），Generator 严格按规格实现，不自由发挥。

---

## 结果对比

| 方式 | 耗时 | 费用 | 结果 |
|------|------|------|------|
| Solo Agent | 20 分钟 | $9 | 核心功能跑不起来 |
| 3-Agent Harness | 6 小时 | $200 | 完整可用的 2D 游戏制作器 |

---

## 对我们的价值

跨 session 任务 → `progress.txt`；质量难判断 → 独立 Evaluator；范围容易跑偏 → 先 Plan 再 Execute。

已提炼为 CC 决策规则，见 `setup/CLAUDE.md` 和 `knowledge/harness-design.md`。
