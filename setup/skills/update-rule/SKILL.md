---
name: update-rule
description: 向 CLAUDE.md 添加或修改规则。用户说"加一条规则：XXX"或执行 /update-rule 时触发，自动写入并同步到 toky_wiki。
---

# Update Rule Skill

用户口述规则内容，Claude 写入 CLAUDE.md 并 commit + push。

## 执行步骤

### 1. 定位 toky_wiki

按顺序尝试：
1. `E:/ClaudeTask/toky_wiki/setup/CLAUDE.md`
2. `/home/user/toky_wiki/setup/CLAUDE.md`
3. `~/toky_wiki/setup/CLAUDE.md`

### 2. 读取当前 CLAUDE.md

读取文件，了解现有规则结构。

### 3. 写入规则

将用户描述的规则追加到"其他规则"列表末尾，格式与现有条目一致（`- 规则内容`）。

若用户明确指定要修改已有规则，找到对应条目替换，不新增。

### 4. commit + push

```
cd <toky_wiki 根目录>
git add setup/CLAUDE.md
git commit -m "rule: <一句话描述新规则>"
git push -u origin <当前 branch>
```

push 失败时重试最多 4 次（等待 2s、4s、8s、16s）。

### 5. 输出确认

告知用户：
- 写入了什么规则
- 在文件哪个位置
- 已推送到哪个 branch

## 触发时机

- 用户执行 `/update-rule`
- 用户说"加一条规则：XXX"、"记住以后XXX"、"以后每次XXX"

## 注意

- 只改 setup/CLAUDE.md，不动 ~/.claude/CLAUDE.md
- 写完后告知用户：其他设备需要运行 install.sh 才能生效
