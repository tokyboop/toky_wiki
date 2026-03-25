# Skill 格式分类 & Citadel 改造为 Agent 工程构建工具

> 来源：2026-03-25 对话讨论。针对现有 skill 体系的两个改进方向。

---

## 一、Skill 格式类型识别

### 问题

context-backup 在提炼 skill 时，agent 倾向于输出纯 MD 格式。但不同 skill 的实际形态差异很大，纯 MD 的固定性会导致该用脚本的地方写成了步骤说明，执行起来不方便。

### 三种格式类型

| 类型 | 判断标准 | 示例 | 输出形式 |
|------|---------|------|---------|
| **a. 纯 MD** | 流程是思维/判断型，没有需要直接执行的命令 | `fp`（五问自检）、`skill-vetter`（安全审查） | 单个 `SKILL.md` |
| **b. MD + 代码** | 流程有明确步骤，内嵌命令/脚本片段 | `context-backup`（git 操作 + 文件写入） | `SKILL.md`（含代码块） |
| **c. 脚本为主 + 少量 MD** | 主体是可直接执行的脚本，说明文字只是 header | `secret-scan-hook.sh`、`stop-hook-git-check.sh` | `.sh/.py` 文件 + `SKILL.md` 做引用说明 |

> 注：PrivateSet 里的 `.sh` 文件已经是 c 类的实践，但不是通过 skill 提炼生成的，是手动放的。

### 改进方案

在 `context-backup` SKILL.md 第 6 步（分类写入）加格式类型判断：

```
判断 skill 格式类型：
1. 没有可执行命令，纯思维框架 → 纯 MD
2. 有命令但嵌在流程里 → MD + code block
3. 主体是脚本，命令序列固定 → 生成 .sh/.py + SKILL.md 引用
```

在 SKILL.md frontmatter 加 `type` 字段标注：

```yaml
---
name: my-skill
type: md          # md | md+code | script
description: ...
---
```

---

## 二、Citadel 改造为 Agent 工程构建工具

### 问题

Citadel 原版（及现有 citadel-skills-catalog）假设输出物是代码文件（`.tsx/.py` 等）。但 agent 工程的"产品"是：提示词、SKILL.md、目录结构、工作流、MD+代码的混合体。直接用 Citadel 会有概念错位。

### 现有体系已经做到了哪些

| Citadel 原版概念 | 你体系里的对应物 |
|---|---|
| `src/components/*.tsx` 模板 | `.claude/skills/*/SKILL.md` |
| barrel export 注册 | `_index.md` Skill 清单表 |
| `/create-skill` 工厂 | 现有 `context-backup` 的 skill 提炼步骤 |
| `/marshal` 多步编排 | `context-backup` 统筹 _index + knowledge + skill |
| `/session-handoff` 交接 | `context-backup` 第一部分（工作记忆续接） |

**结论：框架已在，Citadel 的核心思想已经被体系吸收了一半。**

### 真正的缺口

**`/scaffold` 没有被适配。**

Citadel `/scaffold` 的核心是"找 2-3 个同类现有文件当模板 → 提取命名/结构/风格 → 生成新文件"。

当前 skill 提炼是从零生成，没有参考已有 SKILL.md 的结构风格。导致每次生成的 skill 格式不一致。

### 改进方案

为 skill 提炼加一个"模板参考"步骤，放在 context-backup 的第 6 步之前：

```
生成新 skill 前：
1. 扫描 .claude/skills/ 里已有的同类 skill（按功能类型匹配）
2. 提取结构模式：frontmatter 字段、章节划分、触发词写法、代码块风格
3. 以此为模板生成新 skill，保持风格一致
```

这就是 Citadel `/scaffold` 的 agent 工程版本。

### 改造优先级

```
第一步（低成本）：在 context-backup SKILL.md 加格式类型判断
第二步（中成本）：加 scaffold 模板参考步骤，扫描已有 skill 当范本
第三步（可选）：把代码类 Citadel skill（review/refactor/test-gen）
              改写成 agent 工程版本（prompt-review/skill-refactor/skill-test）
```

---

## 关联文件

- `knowledge/citadel.md` — Citadel 四级框架原版说明
- `knowledge/citadel-skills-catalog.md` — Citadel 13个 Skill 速查表
- `knowledge/evoskill.md` — EvoSkill 进化循环（自动发现 skill 的相关思路）
- `.claude/skills/context-backup/SKILL.md` — 当前 skill 提炼流程
