---
name: context-backup
description: 对话记忆备份。当对话较长或用户要求备份时触发，自动提取关键信息并更新 _index.md，方便下次新对话无缝继续。
---

# Context Backup Skill

对话快到上限时，或用户主动执行 /context-backup，或用户说结束语时触发。

## 执行步骤

### 1. 定位 toky_wiki

按顺序尝试：
1. `E:/ClaudeTask/toky_wiki/_index.md`
2. `/home/user/toky_wiki/_index.md`
3. `~/toky_wiki/_index.md`

找到后读取，了解上次状态。

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

### 5. commit + push

```
git add _index.md
git commit -m "backup: <一句话描述本次对话内容>"
git push -u origin <当前branch>
```

push 失败时重试最多 4 次（等待 2s、4s、8s、16s）。

### 6. 输出确认

告知用户：
- 备份完成
- 写入了哪些关键信息
- 当前 branch 是什么
- 下次新对话说"读 _index.md 继续"即可接上

## 触发时机

- 用户执行 `/context-backup`
- 用户说"先到这"、"结束"、"bye"、"收工"、"备份一下"
- 对话已很长时主动建议

## 注意

- 直接更新文件，不要问用户确认
- 保持 _index.md 现有格式
- 脱敏是硬性要求，不能遗漏
