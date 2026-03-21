#!/bin/bash
# Circuit Breaker — PostToolUseFailure hook
# 连续失败 3 次提醒换思路，5 次累计触发强制停下重想
# 灵感来源：Citadel (SethGammon/Citadel)

INPUT=$(cat)

# 状态文件（按 session 隔离）
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "default"' 2>/dev/null || echo "default")
STATE_FILE="/tmp/.claude_circuit_breaker_${SESSION_ID}.json"

# 读取当前状态
if [ -f "$STATE_FILE" ]; then
  CONSECUTIVE=$(jq -r '.consecutive // 0' "$STATE_FILE" 2>/dev/null || echo 0)
  LIFETIME=$(jq -r '.lifetime // 0' "$STATE_FILE" 2>/dev/null || echo 0)
else
  CONSECUTIVE=0
  LIFETIME=0
fi

CONSECUTIVE=$((CONSECUTIVE + 1))

# 提取失败工具和错误信息（截断到 200 字符）
FAILED_TOOL=$(echo "$INPUT" | jq -r '.tool_name // "unknown"' 2>/dev/null || echo "unknown")
ERROR_MSG=$(echo "$INPUT" | jq -r '.error // "unknown error"' 2>/dev/null | head -c 200)

# 阈值判断
if [ "$CONSECUTIVE" -ge 3 ]; then
  LIFETIME=$((LIFETIME + 1))
  # 重置连续计数
  CONSECUTIVE=0

  if [ "$LIFETIME" -ge 5 ]; then
    # 严重：累计 5 次熔断
    MSG="[熔断器·严重] 本次会话已累计熔断 ${LIFETIME} 次。停下来重新思考整体策略，不要再做微调尝试。上一个失败工具: ${FAILED_TOOL}，错误: ${ERROR_MSG}"
  else
    # 警告：连续 3 次失败
    MSG="[熔断器·警告] 工具 ${FAILED_TOOL} 已连续失败 3 次（累计熔断 ${LIFETIME} 次）。建议：1) 重新读取相关文件确认状态 2) 检查前置条件 3) 换一个思路。错误: ${ERROR_MSG}"
  fi

  # 写回状态
  printf '{"consecutive":%d,"lifetime":%d,"last_tool":"%s","last_time":"%s"}' \
    "$CONSECUTIVE" "$LIFETIME" "$FAILED_TOOL" "$(date -Iseconds)" > "${STATE_FILE}.tmp"
  mv "${STATE_FILE}.tmp" "$STATE_FILE"

  echo "{\"hookSpecificOutput\": {\"hookEventName\": \"PostToolUseFailure\", \"additionalContext\": \"${MSG}\"}}"
else
  # 还没到阈值，只更新状态
  printf '{"consecutive":%d,"lifetime":%d,"last_tool":"%s","last_time":"%s"}' \
    "$CONSECUTIVE" "$LIFETIME" "$FAILED_TOOL" "$(date -Iseconds)" > "${STATE_FILE}.tmp"
  mv "${STATE_FILE}.tmp" "$STATE_FILE"
fi
