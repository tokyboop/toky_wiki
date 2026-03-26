---
name: summarize
description: >
  对话精华提炼与长期记忆存储。用户执行 /summarize 时触发。
  从当前对话中提取关键成果，追加写入项目记忆文件
  ~/.claude/projects/<project-id>/memory/MEMORY.md，
  超过 200 行时自动归档旧条目。
  触发词：/summarize、"总结一下"、"蒸一下"
---

# Summarize：对话记忆沉淀

将本次对话的有价值内容提炼成结构化条目，写入长期记忆文件。

---

## 第一步：定位记忆文件

**路径推导规则：**
- 将当前工作目录路径（如 `/home/user/toky_wiki`）中的 `/`、`.`、空格等特殊字符替换为 `-`，得到 project-id
- 例：`/home/user/toky_wiki` → `-home-user-toky_wiki`
- 记忆文件路径：`~/.claude/projects/<project-id>/memory/MEMORY.md`
- 归档目录：`~/.claude/projects/<project-id>/memory/archive/`
- 归档索引：`~/.claude/projects/<project-id>/memory/archive-index.md`

如文件或目录不存在，则创建。

---

## 第二步：提炼对话摘要

通读整段对话，提取以下内容（跳过闲聊和无操作性内容）：

- **主题（topic）**：本次对话核心是什么，1 句话
- **成果（outcomes）**：创建/修改了哪些文件、实现了哪些功能
- **决策（decisions）**：明确确定下来的技术或产品选择
- **可复用（insights）**：可迁移到其他场景的方法、命令、技巧
- **待处理（tasks）**：未完成的事项、下次继续的入口
- **标签（tags）**：从以下集合选 2–4 个：
  `#skill` `#wiki` `#bug` `#config` `#refactor` `#research` `#design` `#workflow` `#tooling` `#memory`

如果对话仅是闲聊或没有新的可操作知识，直接输出"无新增内容，跳过写入"并结束。

---

## 第三步：检查容量，必要时归档

读取 MEMORY.md 当前行数：

- **≤ 200 行**：直接追加，跳到第四步
- **> 200 行**：
  1. 将第 51 行起的所有内容提取出来
  2. 确定归档月份（取这批内容中最早的日期，格式 `YYYY-MM`）
  3. 将提取内容追加写入 `archive/YYYY-MM.md`（不存在则创建）
  4. 在 `archive-index.md` 中追加一条索引记录：
     ```
     - YYYY-MM: archive/YYYY-MM.md （含 N 条条目，涉及标签：#tag1 #tag2 ...）
     ```
  5. 将 MEMORY.md 截断，只保留前 50 行

---

## 第四步：追加写入摘要条目

在 MEMORY.md 末尾追加以下格式的条目（严格保持格式）：

```markdown
---
## YYYY-MM-DD · <topic>
**Tags:** #tag1 #tag2 #tag3

**成果：**
- <outcome 1>
- <outcome 2>

**决策：**
- <decision 1>

**可复用：**
- <insight 1>

**待处理：**
- [ ] <task 1>
```

- 日期取今天（格式 `YYYY-MM-DD`）
- 如某个分类没有内容，省略该分类整块（不写空列表）
- 待处理用 `- [ ]` checkbox 格式

---

## 第五步：输出确认

```
### Summarize 完成

**写入：** ~/.claude/projects/<project-id>/memory/MEMORY.md
**主题：** <topic>
**标签：** #tag1 #tag2 ...
**条目行数：** <N> 行

<如有归档>
**归档：** 已将旧条目移至 archive/YYYY-MM.md，更新 archive-index.md
```

---

## 触发时机

- 用户执行 `/summarize`
- 用户说"总结一下"、"蒸一下"、"记录一下"、"存个档"

## 注意

- 直接写入文件，不需要询问用户确认
- 提炼要精，不要灌水；没有价值的内容宁可不写
- 归档时不能丢失任何内容，只是搬移位置
