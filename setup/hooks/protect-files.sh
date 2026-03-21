#!/bin/bash
# Protect Files — PreToolUse hook (matcher: Edit|Write)
# 防止关键文件被意外修改
# 灵感来源：Citadel (SethGammon/Citadel)

INPUT=$(cat)

# 提取被操作的文件路径
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // ""' 2>/dev/null)

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# 保护名单（可按需扩展）
PROTECTED_PATTERNS=(
  "_index.md"
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
    echo "⛔ 文件 ${RELATIVE_PATH} 在保护名单中（匹配规则: ${PATTERN}）。如需修改，请先确认意图。" >&2
    exit 2
  fi
  # 精确匹配（包含 pattern 作为后缀）
  if [[ "$RELATIVE_PATH" == *"$PATTERN" ]]; then
    echo "⛔ 文件 ${RELATIVE_PATH} 在保护名单中。如需修改，请先确认意图。" >&2
    exit 2
  fi
done

exit 0
