# 单对话上下文保活系统

> 解决问题：Claude Code 长对话中，早期上下文被压缩导致遗忘关键决策和项目状态。

---

## 核心思路

不依赖 Claude 的记忆，而是**定期把项目状态塞回上下文**。

```
每 8 条消息
  → hook 自动读取当前项目的 FOCUS.md
  → 注入到对话上下文
  → Claude 重新"看到"项目状态
```

---

## 文件结构

```
toky_wiki/
├── focus/
│   ├── <项目A>.md       ← 每个项目一个焦点快照
│   └── <项目B>.md
└── .claude/
    ├── context-remind.sh     ← UserPromptSubmit hook（定时注入）
    └── skills/
        └── context-backup/
            └── SKILL.md      ← 对话结束时同步更新 FOCUS.md
```

---

## FOCUS.md 格式

每个项目维护一份，严格 < 50 行：

```markdown
# <项目名> — FOCUS
_上次更新：YYYY-MM-DD_

**当前目标**：<本阶段目标，1句话>

## 当前状态
- <进展到哪了>

## 关键决策
- <已定的技术/产品选择>

## 活跃 Branch
- `<user>/<repo>` → `<branch>`

## 下次入口
1. <下一步具体操作>

## 绝对不忘
- <容易遗漏的关键信息>
```

---

## context-remind.sh（UserPromptSubmit hook）

```bash
#!/bin/bash
# 每 8 条消息自动注入当前项目的 FOCUS.md
INPUT=$(cat)

SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "default"' 2>/dev/null || echo "default")
CWD=$(echo "$INPUT" | jq -r '.cwd // ""' 2>/dev/null || echo "")

COUNTER_FILE="/tmp/.claude_msg_${SESSION_ID}"
COUNT=$(cat "$COUNTER_FILE" 2>/dev/null || echo 0)
COUNT=$((COUNT + 1))
echo "$COUNT" > "$COUNTER_FILE"

if [ $((COUNT % 8)) -eq 0 ]; then
  PROJECT=$(basename "$CWD")

  FOCUS_FILE=""
  for WIKI_BASE in "E:/ClaudeTask/toky_wiki" "/home/user/toky_wiki" "$HOME/toky_wiki"; do
    CANDIDATE="${WIKI_BASE}/focus/${PROJECT}.md"
    if [ -f "$CANDIDATE" ]; then
      FOCUS_FILE="$CANDIDATE"
      break
    fi
  done

  if [ -n "$FOCUS_FILE" ]; then
    FOCUS_CONTENT=$(cat "$FOCUS_FILE")
    MSG="[上下文提醒 · 第${COUNT}条 · 项目: ${PROJECT}]

${FOCUS_CONTENT}"
  else
    MSG="[上下文提醒 · 第${COUNT}条] 当前项目「${PROJECT}」无 FOCUS 文件，建议运行 /context-backup 创建。"
  fi

  CONTEXT_JSON=$(printf '%s' "$MSG" | jq -Rs .)
  printf '{"hookSpecificOutput": {"hookEventName": "UserPromptSubmit", "additionalContext": %s}}\n' "$CONTEXT_JSON"
fi
```

在 `.claude/settings.json` 中注册：

```json
{
  "hooks": {
    "UserPromptSubmit": [
      { "command": "bash ~/.claude/context-remind.sh" }
    ]
  }
}
```

---

## 生命周期

```
对话开始
  → 读 _index.md（跨会话记忆，已有机制）

对话进行中（每 8 条）
  → context-remind.sh 注入 focus/<project>.md
  → Claude 自动重获项目上下文

说"收工" / 执行 /context-backup
  → 步骤 4b：更新 focus/<project>.md（最新状态写入）
  → 步骤 4：更新 _index.md（跨会话交接）
  → commit + push
```

---

## 设计决策

| 问题 | 决策 | 原因 |
|------|------|------|
| 注入频率 | 每 8 条 | 太少失效，太多干扰对话 |
| FOCUS.md 存放位置 | toky_wiki/focus/ 集中管理 | 多项目统一，便于维护 |
| 谁来更新 FOCUS.md | /context-backup 触发时 | 避免 Stop hook 每次调 API，零额外 token 成本 |
| 多项目隔离 | 按 CWD basename 区分 | 不同项目目录 → 不同 FOCUS 文件 |

---

## 适用条件

- Claude Code CLI（支持 hooks）
- `jq` 已安装
- toky_wiki 本地已 clone，路径在脚本枚举范围内
- 每个项目在独立目录下运行（CWD basename = 项目名）
