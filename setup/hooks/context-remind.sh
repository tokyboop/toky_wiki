#!/bin/bash
# 读取 stdin（UserPromptSubmit hook 会传 JSON）
INPUT=$(cat)

# 计数文件
COUNTER_FILE="${TMPDIR:-/tmp}/.claude_msg_count_$$"
# 用 session_id 做隔离
SESSION_ID=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('session_id','default'))" 2>/dev/null || echo "default")
COUNTER_FILE="/tmp/.claude_msg_${SESSION_ID}"

# 读取并递增
COUNT=$(cat "$COUNTER_FILE" 2>/dev/null || echo 0)
COUNT=$((COUNT + 1))
echo "$COUNT" > "$COUNTER_FILE"

# 每 15 条提醒一次（15, 30, 45...）
if [ $((COUNT % 15)) -eq 0 ]; then
  echo "{\"hookSpecificOutput\": {\"hookEventName\": \"UserPromptSubmit\", \"additionalContext\": \"[提醒] 对话已进行约 ${COUNT} 轮，上下文窗口已使用较多。建议执行 /context-backup 备份记忆，方便下次新开对话继续。\"}}"
fi
