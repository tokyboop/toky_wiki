---
name: sync-config
description: >
  跨设备同步 Claude Code 配置。用户说"同步配置"或执行 /sync-config 时触发。
  自动从 PrivateSet 仓库拉取最新配置并部署到 ~/.claude/，确保 hooks 全局生效。
  触发词：/sync-config、"同步配置"、"sync config"、"部署配置"、"初始化配置"
user_invocable: true
---

# Sync Config — 跨设备配置同步

当用户说"同步配置"、"sync config"、"部署配置"、"初始化配置"时执行。

---

## 执行步骤

### 1. 定位 PrivateSet 仓库

按优先级查找：

```
~/PrivateSet
~/privateset
/home/user/PrivateSet
E:/ClaudeTask/PrivateSet
```

如果都不存在，执行 clone：
```bash
git clone https://github.com/tokyboop/PrivateSet ~/PrivateSet
```

### 2. 拉取最新配置

```bash
cd <PrivateSet路径> && git pull origin main
```

### 3. 运行 install.sh

```bash
bash <PrivateSet路径>/install.sh
```

这会自动：
- 将 `claude/settings.json` symlink 到 `~/.claude/settings.json`
- 将 `claude/context-remind.sh` symlink 到 `~/.claude/context-remind.sh`
- 将 `claude/stop-hook-git-check.sh` symlink 到 `~/.claude/stop-hook-git-check.sh`
- 将 `claude/secret-scan-hook.sh` symlink 到 `~/.claude/secret-scan-hook.sh`
- 设置脚本可执行权限

### 4. 验证

运行以下检查并报告结果：
- `ls -la ~/.claude/settings.json` — 确认是 symlink 指向 PrivateSet
- `ls -la ~/.claude/context-remind.sh` — 确认存在且可执行
- `cat ~/.claude/settings.json | jq .hooks` — 确认 hooks 配置完整

### 5. 输出

```
## 配置同步完成

| 项目 | 状态 |
|------|------|
| PrivateSet | ✅ 已拉取最新 |
| settings.json | ✅ 已链接 |
| context-remind.sh | ✅ 已链接 |
| stop-hook-git-check.sh | ✅ 已链接 |
| secret-scan-hook.sh | ✅ 已链接 |

重启 Claude Code 后 hooks 全局生效。
```

---

## 注意

- 如果 `~/.claude/settings.json` 已存在且不是 symlink，install.sh 会自动备份为 `.bak`
- 同步后需要**重启 Claude Code** 才能加载新的 hooks 配置
- 此 skill 是幂等的，重复执行不会出问题
