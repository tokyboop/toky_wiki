# Citadel Skill 速查表

> 需要时查阅，看 Citadel 有没有现成思路可以借鉴。
> 来源：https://github.com/SethGammon/Citadel

## 执行类 Skill

### /review — 5-pass 代码审查

**触发词**：review、审查
**流程**：Correctness → Security → Performance → Readability → Consistency
**每个发现必须包含**：文件、行号、严重级、描述、代码片段、具体修复
**严重级**：CRITICAL（生产bug/漏洞）、WARNING（条件性问题）、INFO（风格/预防）
**判定**：PASS（0 critical + ≤3 warning）、CONDITIONAL（0 critical + >3 warning）、FAIL（有 critical）

### /test-gen — 测试生成

**触发词**：test、测试
**三类测试**：happy path、edge cases、error paths
**关键规则**：
- 自动检测项目的测试框架（Jest/Vitest/pytest 等）并匹配风格
- 只 mock 外部边界（API/DB/文件IO/定时器）
- 每个文件最多 3 轮修复迭代
- 跑不过的标 `.skip` 并写明原因，绝不交红色测试

### /refactor — 安全重构

**触发词**：refactor、重构
**核心原则**：行为不变。重构前后 typecheck + test 对比，新增错误 = 重构失败
**6 阶段**：Baseline → Plan → Execute → Verify → Fix(最多2轮) → Revert(修不好就回滚)
**适用**：重命名、提取函数/模块、移动文件、拆分/合并文件、更新签名
**不适用**：新功能、bug 修复、删死代码、格式化

### /doc-gen — 文档生成

**触发词**：document、文档
**三种模式**：
- 函数级：加 JSDoc/docstring（跳过显而易见的 getter）
- 模块级：写目录 README（exports + 架构）
- API 级：文档化 HTTP 端点
**核心精神**：信息密度优先。签名已经说明的不重复写，`@param id - the id` 这种废话禁止

### /scaffold — 项目感知脚手架

**触发词**：scaffold、脚手架、create component
**工作方式**：找 2-3 个同类现有文件当范例 → 提取命名/结构/风格 → 生成新文件 → 注册到 barrel export / 路由等
**关键**：不用模板，用项目自己的代码当模板。没有 TODO 和空函数体

### /create-skill — 自定义 Skill 工厂

**触发词**：create skill、自动化这个模式
**流程**：发现（问3个问题）→ 分析 → 生成 SKILL.md → 安装 → 在真实代码上测试 → 教你用
**什么时候用**：某件事你重复做了 2+ 次

## 编排类 Skill

### /marshal — 单会话多步骤

**适用**：一次会话能搞定但需要调查 + 多 skill 组合的任务
**不适用**：单文件编辑（直接用 skill）、跨会话（用 archon）、并行（用 fleet）
**5 阶段**：UNDERSTAND → PLAN CHAIN → EXECUTE → REPORT → LEARN

### /archon — 跨会话战役编排

**适用**：跨多个会话、需要持久状态和阶段性推进的大型工作
**不适用**：快速修复、单会话任务、并行执行
**核心**：不写代码，只做分解/委派/审查。Campaign 文件是唯一持久状态
**阶段**：research → plan → build → wire → verify → prune

### /fleet — 并行 agent 编排

**适用**：可拆成 3+ 个独立流的工作，无文件交叉
**核心**：不写代码。每 wave 派 2-3 个 agent 到独立 worktree，通过 discovery brief 传递知识
**预算**：每 wave ~700K token，自身保留 ~300K

### /autopilot — 自动驾驶

**适用**：有明确 intake 队列的小/中型工作项，按序处理
**流程**：SCAN(扫描 intake) → BRIEF(分析) → BUILD(执行+验证) → REPORT(汇总)

### /session-handoff — 会话交接

**输出**：结构化 HANDOFF block（3-5 bullet，<150 词）
**内容**：做了什么 + 决策及理由 + 阻塞项 + 下一步具体动作
**类似你的**：context-backup，但更面向任务而非记忆

### /do — 统一路由器

**用法**：`/do [任何意图]`
**路由逻辑**：关键词 → 活跃状态 → Skill 匹配 → LLM 分类
**哲学**：宁可低估不高估

### /setup — 初始配置

**4 步**：Orient(检测语言栈) → Scaffold(建目录) → Demo(跑一个真实任务) → Orient Forward(打印命令索引)
