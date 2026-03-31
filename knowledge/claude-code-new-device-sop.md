# 新设备初始化 SOP

换设备后，按顺序执行以下步骤让 Claude Code 环境完全恢复。

---

## 前置：打开 Git Bash

不要用 PowerShell。从开始菜单搜 **Git Bash** 打开。

如果粘贴命令出现乱码（`^[[200~`），先运行：
```
bind 'set enable-bracketed-paste off'
```

---

## Step 1：Clone 必要仓库

```bash
git clone https://github.com/<USER>/PrivateSet ~/privateset
git clone https://github.com/<USER>/toky_wiki ~/toky_wiki
```

---

## Step 2：安装 Claude Code 配置

```bash
cd ~/privateset && bash install.sh
```

完成后应看到：
```
LINKED: settings.json -> ...
LINKED: secret-scan-hook.sh -> ...
LINKED: stop-hook-git-check.sh -> ...
LINKED: context-remind.sh -> ...
Done! Claude Code hooks are now active.
```

---

## Step 3：设置 wiki 路径（可选）

如果 toky_wiki 不在 `~/toky_wiki`，在 `~/.bashrc` 或 `~/.bash_profile` 里加一行：

```bash
export WIKI_PATH="/你的实际路径/toky_wiki"
```

然后：
```bash
source ~/.bashrc
```

---

## Step 4：重启 Claude Code 桌面 App

重启后 hooks 生效，包括每 8 条消息自动注入项目上下文。

---

## 验证

打开 Claude Code，发 8 条消息，应该看到 `[上下文提醒]` 注入。

---

## 换设备继续工作（已有 clone）

在另一台已有 clone 的设备上切换时，开 Claude Code **之前**先同步记忆：

```bash
cd ~/privateset && git pull
```

这一步确保 Claude 读到的是最新的 `_index.md`，而不是上次本地的旧状态。

---

## 更新已有配置（非新设备）

Claude 修改了 PrivateSet 配置后，在已有设备上同步：

```bash
cd ~/privateset && git pull
```

symlink 已建好，pull 后自动生效，**重启 Claude Code** 即可。
