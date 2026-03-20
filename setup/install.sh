#!/bin/bash
# 把 setup/ 下的配置同步到 ~/.claude/
# 用法：bash setup/install.sh
# 在任何机器上 git pull toky_wiki 后执行一次即可

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET="$HOME/.claude"

echo ">>> 安装 CLAUDE.md..."
cp "$SCRIPT_DIR/CLAUDE.md" "$TARGET/CLAUDE.md"

echo ">>> 安装 skills..."
for skill_dir in "$SCRIPT_DIR/skills"/*/; do
  skill_name="$(basename "$skill_dir")"
  mkdir -p "$TARGET/skills/$skill_name"
  cp "$skill_dir/SKILL.md" "$TARGET/skills/$skill_name/SKILL.md"
  echo "    ✓ $skill_name"
done

echo ">>> 完成。已同步到 $TARGET"
