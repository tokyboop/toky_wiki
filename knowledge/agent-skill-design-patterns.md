# Agent / Skill 设计模式参考

> 来源：拆解外部 prompt-master + material-analyst 双 Agent 包（2026-03-27）
> 适用：Claude Code skill 编写、Agent 设计、个人 KB 搭建

---

## 模式 1：演化日志（evolution.json）

### 是什么
每个 agent/skill 目录下维护一个 `evolution.json`（或 `CHANGELOG.md`），记录每次迭代的：
- 发现了什么问题（`insight`）
- 改了什么（`action`）
- 影响是什么（`impact`）

### 为什么重要
Skill 改完就改了，下次看不知道当初为什么这样设计。演化日志让 skill 有自己的"记忆"，也方便 Claude 在后续对话中理解设计意图。

### 怎么用
```json
{
  "version": "0.2.0",
  "agent": "my-skill",
  "experienceLog": [
    {
      "date": "2026-03-27",
      "type": "rules-update",
      "insight": "AI 输出 SQL 时不主动加 LIMIT，导致大表查询超时",
      "action": "在 rules.md 第4条加入「所有 SELECT 默认加 LIMIT 1000」",
      "impact": "消除了超时问题"
    }
  ]
}
```

**最低成本做法**：直接用 `CHANGELOG.md` 替代 JSON，格式随意，关键是写"为什么改"。

---

## 模式 2：阶段输出格式固化

### 是什么
Workflow 里每个 Phase 有**明确的输出模板**，用代码块写死格式，不让 AI 自由发挥。

### 为什么重要
没有固定格式时，AI 每次输出结构略有不同，导致：
- 用户阅读时找不到关键信息
- 下游 Phase 解析上一步输出时出错
- 输出质量抖动大

### 怎么用
在 workflow.md 的每个 Phase 末尾加：

```markdown
**Phase 1 输出格式**：
\```
## 接收确认

**品类**：[X]
**粒度**：[极简/标准/详细]

[具体内容...]
\```
```

**适用场景**：任何有多步骤的 skill（如 sql-helper 的"分析需求 → 生成 SQL → 自检"三步）。

---

## 模式 3：质量自检 + 通过阈值

### 是什么
最后一个 Phase 是质量自检，有评分卡，必须达到阈值才交付，不达标自动补强。

```markdown
## Phase 4：质量自检

按评分卡逐项打分，广告视频路径需 ≥ 18/26 分才交付。
未达标项目自动补强后重新打分。
```

### 为什么重要
把你的**验收标准**内化给 AI，而不是靠你每次审查。

### 怎么用
识别你对 skill 输出的隐式期望，把它显式化：

```markdown
## 自检清单（全部通过才输出）

- [ ] 排除条件完整（is_simulator=1 + cheat_banned reason=5）
- [ ] 时间范围使用参数化变量，不硬编码日期
- [ ] 所有字段名与 DB schema 一致（不猜测）
- [ ] GROUP BY 字段与 SELECT 非聚合字段对齐
- [ ] 已附简要使用说明
```

**变体**：不用评分，直接用 checklist，更简单。

---

## 模式 4：迭代的最小路径

### 是什么
明确写清楚每种修改类型只需要重走哪些步骤，其余跳过。

```markdown
## 迭代规则

- "修改时间范围" → 只更新 WHERE 条件 → 重新自检 → 不重走需求分析
- "换一个维度" → 只替换对应字段 → 检查关联 JOIN → 不重新生成全部 SQL
- "品类判断错了" → 从 Phase 1 完整重跑
```

### 为什么重要
没有这个规则，用户说"改一下时间范围"，AI 可能重新走完整流程，浪费 token 且容易改出新 bug。

### 适用场景
任何有"局部修改"需求的 skill。识别你的 skill 里最常见的修改类型，各写一条最小路径规则。

---

## 模式 5：前缀标签体系（搭 KB 时用）

### 是什么
知识库条目用前缀标签做结构化元数据，而不只依赖语义向量：

```
genre:roguelike     # 品类
style:pixel         # 画风
acq:high            # 获取效率高
hook:visual-shock   # 使用视觉冲击 Hook
```

### 为什么重要
纯向量搜索精度不够用时，前缀标签做预过滤，组合使用：

```python
# 只查"Roguelike + 像素风 + 获取效率高"的素材
search_kb(query, filters={"tags": ["genre:roguelike", "style:pixel", "acq:high"]})
```

### 适用到 Holmes
Holmes 的笔记条目可以加前缀标签：
```
type:decision       # 决策记录
project:holmes      # 所属项目
status:active       # 当前有效
importance:high     # 重要程度
```

这样 `triage_and_decompose` 可以先用标签过滤，再做语义检索，精度更高。

---

## 模式 6：冷启动策略（KB 不足时的降级）

### 是什么
显式定义 KB 数据量不足时的行为，而不是让 AI 自由发挥：

| KB 状态 | 行为 |
|--------|------|
| 空 | 不做对标，只建基线，标注「首条记录」 |
| 同品类 <3 条 | 初步比较，标注「样本不足，仅供参考」 |
| 同品类 ≥5 条 | 完整对标分析 + 趋势判断 |

### 为什么重要
冷启动是必经阶段。没有明确降级策略，AI 会瞎编对标（"根据业界经验..."），给出不可信的结论。

### 适用到 Holmes
Holmes 的 `answer_holmes` 在检索结果不足时，应该明确说"知识库暂无相关记录，以下为推理而非记忆检索"，而不是直接给答案。

---

## 文档分层参考

这两个 Agent 的文档结构值得作为模板：

```
my-agent/
├── SOUL.md              # 一页纸：是什么、干什么、输入输出
├── evolution.json       # 决策演化日志
├── docs/
│   ├── workflow.md      # 完整工作流（每 Phase 含输出格式）
│   ├── rules.md         # 业务纪律（禁止项 + 必须项）
│   ├── skills.md        # 调用哪些 skill + 加载时机
│   └── boundaries.md    # 做什么 / 不做什么 / 转给谁
├── examples/            # 端到端示例（含输入+每步输出）
└── skills/              # 子技能文档
```

**关键原则**：SOUL.md 只有 1 页，所有细节下沉到 docs/；skills 文档只在需要时加载，不全部塞进 prompt。

---

## 优先级建议

| 模式 | 适用你现在的场景 | 成本 |
|------|--------------|------|
| 演化日志 | 所有 skill | 极低，马上可做 |
| 质量自检 checklist | sql-helper、weekly-monitor | 低 |
| 阶段输出格式 | 多步骤 skill | 中 |
| 冷启动策略 | Holmes KB | 中 |
| 前缀标签体系 | Holmes KB | 中高 |
| 迭代最小路径 | 有迭代需求的 skill | 中 |
