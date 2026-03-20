#!/bin/bash
# 把 ~/.claude/ 的改动同步回 toky_wiki/setup/（install.sh 的反向操作）
# 用法：bash ~/toky_wiki/setup/sync-back.sh
# 或加 alias：alias sync-claude='bash ~/toky_wiki/setup/sync-back.sh'

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SOURCE="$HOME/.claude"

changed=0

# 同步 CLAUDE.md
if [ -f "$SOURCE/CLAUDE.md" ]; then
  if ! diff -q "$SOURCE/CLAUDE.md" "$SCRIPT_DIR/CLAUDE.md" >/dev/null 2>&1; then
    cp "$SOURCE/CLAUDE.md" "$SCRIPT_DIR/CLAUDE.md"
    echo "✓ CLAUDE.md 已更新"
    changed=1
  fi
fi

# 同步 skills
if [ -d "$SOURCE/skills" ]; then
  for skill_dir in "$SOURCE/skills"/*/; do
    [ -d "$skill_dir" ] || continue
    skill_name="$(basename "$skill_dir")"
    if [ -f "$skill_dir/SKILL.md" ]; then
      mkdir -p "$SCRIPT_DIR/skills/$skill_name"
      if ! diff -q "$skill_dir/SKILL.md" "$SCRIPT_DIR/skills/$skill_name/SKILL.md" >/dev/null 2>&1; then
        cp "$skill_dir/SKILL.md" "$SCRIPT_DIR/skills/$skill_name/SKILL.md"
        echo "✓ skill: $skill_name 已更新"
        changed=1
      fi
    fi
  done
fi

# 同步 hooks
mkdir -p "$SCRIPT_DIR/hooks"
for hook_file in "$SOURCE"/*.sh; do
  [ -f "$hook_file" ] || continue
  hook_name="$(basename "$hook_file")"
  if ! diff -q "$hook_file" "$SCRIPT_DIR/hooks/$hook_name" >/dev/null 2>&1; then
    cp "$hook_file" "$SCRIPT_DIR/hooks/$hook_name"
    echo "✓ hook: $hook_name 已更新"
    changed=1
  fi
done

if [ "$changed" -eq 0 ]; then
  echo "没有变更，已是最新。"
  exit 0
fi

# commit + push
cd "$REPO_DIR"
git add setup/
git diff --cached --quiet || git commit -m "sync-back: 从本地同步配置更新"
BRANCH=$(git branch --show-current)
git push -u origin "$BRANCH"
echo ">>> 已提交并推送到 $BRANCH"
