#!/bin/bash
# Protect Files — PreToolUse hook (matcher: Edit|Write)
# 防止关键文件被意外修改
# 灵感来源：Citadel (SethGammon/Citadel)
#
# 策略：检测到保护文件时输出警告到 stderr（用户可见），
# 但返回 exit 0 放行，依赖 Claude Code 自身的权限弹窗让用户决定。
# exit 2 = 硬拦截（无确认框），不适合需要偶尔修改的文件。

INPUT=$(cat)

# 提取被操作的文件路径
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // ""' 2>/dev/null)

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# 保护名单（可按需扩展）
# _index.md 已移除：工作记忆文件，context-backup 需要频繁写入
PROTECTED_PATTERNS=(
  "setup/CLAUDE.md"
  ".claude/settings.json"
  "setup/hooks/"
)

# 归一化路径（去掉前缀，只留相对路径部分）
RELATIVE_PATH="$FILE_PATH"
# 去掉常见的绝对路径前缀
for PREFIX in "/home/user/toky_wiki/" "E:/ClaudeTask/toky_wiki/" "$HOME/toky_wiki/"; do
  RELATIVE_PATH="${RELATIVE_PATH#$PREFIX}"
done

for PATTERN in "${PROTECTED_PATTERNS[@]}"; do
  # 目录前缀匹配（pattern 以 / 结尾）
  if [[ "$PATTERN" == */ ]] && [[ "$RELATIVE_PATH" == ${PATTERN}* ]]; then
    echo "⚠️ 注意：${RELATIVE_PATH} 是保护文件（规则: ${PATTERN}），请确认修改意图。" >&2
    exit 0
  fi
  # 精确匹配（包含 pattern 作为后缀）
  if [[ "$RELATIVE_PATH" == *"$PATTERN" ]]; then
    echo "⚠️ 注意：${RELATIVE_PATH} 是保护文件，请确认修改意图。" >&2
    exit 0
  fi
done

exit 0
