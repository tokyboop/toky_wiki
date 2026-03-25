#!/bin/bash
# UserPromptSubmit hook — 项目上下文定期注入
# 每 8 条消息读取当前项目的 FOCUS.md 注入上下文，防止长对话中上下文丢失
INPUT=$(cat)

SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "default"' 2>/dev/null || echo "default")
CWD=$(echo "$INPUT" | jq -r '.cwd // ""' 2>/dev/null || echo "")

COUNTER_FILE="/tmp/.claude_msg_${SESSION_ID}"
COUNT=$(cat "$COUNTER_FILE" 2>/dev/null || echo 0)
COUNT=$((COUNT + 1))
echo "$COUNT" > "$COUNTER_FILE"

# 每 8 条注入一次项目焦点
if [ $((COUNT % 8)) -eq 0 ]; then
  PROJECT=$(basename "$CWD")

  # 按优先级查找 toky_wiki/focus/<project>.md
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
