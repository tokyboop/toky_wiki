# Harness 设计框架

> 来源：Anthropic Engineering — [Harness Design for Long-Running Apps](https://www.anthropic.com/engineering/harness-design-long-running-apps)
> 整理日期：2026-03-28

---

## 根本问题

Agent 做复杂任务时有两个核心失败模式：

1. **跨 session 失忆**：新 session 不知道之前做到哪，重复劳动或方向跑偏
2. **自评不可靠**：让同一个 Agent 检查自己的输出，它会说"很好"——即使结果很差

Harness 就是针对这两个问题加的结构性脚手架。

---

## 三层结构

### L1 进度记忆
**解决**：跨 session 失忆

做法：建 `progress.md`，记录：
- 整体计划和步骤
- 当前做到哪一步
- 下一步是什么

每次 session 开始读它，结束更新它。

---

### L2 独立评估
**解决**：自评不可靠

做法：任务完成后，切换视角（另起对话或独立 Agent），按明确标准检查结果。

Anthropic 的实现：用 Playwright 驱动真实浏览器测试，而不是让生成者自己看代码。

关键原则：**生成者和评估者不能是同一个。**

---

### L3 先规划再执行
**解决**：任务范围失控、执行跑偏

做法：先列完整功能/步骤清单（Planner），确认后再动手实现（Generator）。

Planner 刻意保持高层次，不指定技术细节——避免早期错误级联污染后续实现。

---

## Anthropic 原文的三 Agent 对应

| 原文 Agent | 对应层级 | 作用 |
|-----------|---------|------|
| Initializer | L1 | 建 progress.txt、init.sh、feature list |
| Planner | L3 | 一句话需求 → 完整规格 + Sprint 划分 |
| Generator | — | 按规格逐 Sprint 实现 |
| Evaluator | L2 | Playwright 驱动真实浏览器验收 |

---

## 核心原则

- **按需取用，不过度使用**：没有触发信号就直接执行
- **随能力简化**：模型越强，需要的脚手架越少
- **最简可行方案，只在必要时增加复杂度**
