---
name: context-backup
description: >
  对话记忆备份与精华提炼。用户说结束语或执行 /context-backup 时触发。
  包含两部分：(1) 更新 PrivateSet/memory/_index.md 保证下次对话续接；(2) 扫描对话提炼有价值内容，
  分类为 wiki / skill，脱敏后写入并推送 GitHub。
  触发词：/context-backup、"先到这"、"结束"、"bye"、"收工"、"bubble sync"、"同步一下"
---

# Context Backup + Bubble Sync

两件事合一条命令：**续接记忆 + 精华沉淠**。

---

## 第一部分：工作记忆续接（PrivateSet/memory/）

### 1. 定位 PrivateSet/memory

按顺序尝试：
1. `E:/ClaudeTask/PrivateSet/memory`
2. `/home/user/PrivateSet/memory`
3. `~/PrivateSet/memory`
4. `${PRIVATESET_PATH}/memory`（环境变量）

### 2. 提取本次对话要点

从当前对话中提取：
- 做了什么（已完成的任务）
- 决定了什么（重要决策、方向调整）
- 遗留了什么（未完成、待继续的事）
- 有什么新发现（坑、技巧、关键信息）

### 3. 脱敏处理

写入前必须替换以下内容：

| 原始内容 | 替换为 |
|---------|--------|
| 本地绝对路径（如 `E:/ClaudeTask`、`/home/user`） | `<LOCAL>` |
| GitHub 用户名 | `<USER>` |
| 服务器 IP / 域名 | `<SERVER>` |
| API Key / Token / 密码 | `<REDACTED>` |
| 内部保密项目名 | `<PROJECT>` |

不需要脱敏：公开工具名、命令语法、技术方案、branch 名。

### 4. 更新 _index.md

覆写以下区域：
- **当前最重要的事** — 更新为本次对话结束后的优先事项
- **上次交接** — 必须包含：
  - 日期
  - 做了什么
  - 当前 branch（执行 `git branch --show-current` 获取，不要凭记忆填）
  - 下次继续的具体入口（精确到函数/文件）
- **活跃 Branch 表** — 更新当前所有活跃 branch 状态

保留其他区域（活跃项目、笔记索引等），按需更新。

### 4b. 更新项目 FOCUS.md（焦点快照）

在 `PrivateSet/memory/focus/<项目名>.md` 中同步更新当前项目的焦点快照。
**项目名** = 当前工作目录的 basename（如 `MemoryPalace`、`toky_wiki`）。

文件结构（严格保持 < 50 行）：

```markdown
# <项目名> — FOCUS
_上次更新：YYYY-MM-DD_

**当前目标**：<本阶段目标，1句话>

## 当前状态
- <进展到哪了>

## 关键决策
- <已定的技术/产品选择>

## 活跃 Branch
- `<USER>/<repo>` → `<branch>`

## 下次入口
1. <下一步具体操作>

## 绝对不忘
- <容易遗漏的关键信息>
```

如文件不存在则创建。执行脱敏（路径、用户名等同 _index.md 规则）。

---

## 第二部分：对话精华提炼（Bubble Sync）

### 5. 扫描对话，找有价值的内容

通读整段对话，寻找以下类型（跳过闲聊和已有记录的重复内容）：

- **工作流 / 操作步骤**：新学到的做事方法、命令序列、工具用法
- **踩坑 / 错误修复**：遇到的问题和解决方案，尤其是不明显的 root cause
- **业务规则 / 定义**：业务逻辑、字段含义、计算公式等确认事项
- **工具配置**：安装路径、环境变量、依赖关系等
- **决策结论**：用户明确拍板的选择
- **可复用流程**：将来还会重复的操作步骤

如果对话主要是闲聊、或没有新的可操作知识——跳过这部分，只做第一部分的记忆续接。

### 6. 分类并写入 toky_wiki

| 类型 | 判断标准 | 写到哪里 |
|------|---------|----------|
| **skill** | 可复用的多步骤操作流程，将来会反复用 | `toky_wiki/setup/skills/<name>/SKILL.md` |
| **wiki** | 学习总结、踩坑记录、技术笔记、方案设计 | `toky_wiki/knowledge/<topic>.md` |

写入前同样执行脱敏处理。

---

## 第三部分：提交推送

### 7. 先推 PrivateSet（工作记忆）

```bash
cd <PrivateSet 路径>
git add memory/
git commit -m "backup: <一句话描述本次对话内容>"
git push -u origin <当前branch>
```

### 8. 再推 toky_wiki（知识提炼，如有）

```bash
cd <toky_wiki 路径>
git add knowledge/ setup/skills/
git commit -m "knowledge: <一句话描述>"
git push -u origin <当前branch>
```

push 失败时重试最多 4 次（等待2s、4s、8s、16s）。

### 9. 输出同步摘要

```
### 备份完成

**记忆续接（PrivateSet/memory/）：**
- 更新了 _index.md，下次交接入口：<具体说明>
- 更新了 focus/<项目名>.md

**精华提炼（toky_wiki/）：**
- [wiki] `knowledge/<文件名>` — <一句话说明>
- [skill] `<skill名>` — <一句话说明>
- （或：本次对话无新增可沉淠内容）

**脱敏处理：**
- <具体脱敏了什么>

**推送：** ✅ PrivateSet 已推送到 <branch>
```

---

## 触发时机

- 用户执行 `/context-backup`
- 用户说"先到这"、"结束"、"bye"、"收工"、"备份一下"
- 用户说"bubble sync"、"同步一下"、"总结同步"
- 对话已很长时主动建议

## 注意

- 直接更新文件，不要问用户确认
- 保持 _index.md 现有格式
- 脱敏是硬性要求，不能遗漏
- 交接要写得足够具体，让下一个 Claude 能直接上手
- 精华提炼不要灌水，没有就说没有
