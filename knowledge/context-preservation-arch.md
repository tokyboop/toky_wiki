# Claude Code 上下文保活系统架构设计

_日期：2026-03-26_

## 问题背景

Claude Code 有两个上下文丢失场景：
1. **对话内**：长对话超过一定长度，早期内容被压缩遗忘
2. **跨对话**：新会话开始时没有上次的工作记忆
3. **跨设备**：换机器后配置和记忆全部丢失

## 架构设计

### 仓库职责分离

```
PrivateSet（私有）          toky_wiki（公开）
├── claude/               ├── knowledge/   ← 可分享技术文章
│   ├── CLAUDE.md         ├── notes/
│   ├── settings.json     └── snippets/
│   ├── context-remind.sh
│   └── install.sh
└── memory/              ← 工作记忆（私有）
    ├── _index.md
    └── focus/
        └── <project>.md
```

**核心原则**：配置 + 工作记忆放私有库，可分享知识放公开库。

### 三层上下文保活机制

#### Layer 1：对话开始（CLAUDE.md）

每次新对话自动读取 `PrivateSet/memory/_index.md`：
- 了解当前最重要的事、上次交接、活跃 branch
- 告知用户上次在做什么，询问是否继续

```
读取路径优先级：
1. E:/ClaudeTask/PrivateSet/memory/_index.md
2. /home/user/PrivateSet/memory/_index.md
3. ~/PrivateSet/memory/_index.md
```

#### Layer 2：对话内定期注入（UserPromptSubmit hook）

`context-remind.sh` 每 8 条消息自动触发：
- 优先读 `PrivateSet/memory/focus/<当前项目>.md`
- fallback 到 `PrivateSet/memory/_index.md`
- 注入为系统上下文，用户不可见

```bash
# 触发条件
if [ $((COUNT % 8)) -eq 0 ]; then
  # 查找 PrivateSet/memory/
  # 注入 focus 或 _index.md
fi
```

#### Layer 3：对话结束备份（context-backup skill）

用户说「结束/先到这/收工」时触发：
1. 提炼本次对话要点（做了什么、决定了什么、遗留什么）
2. 脱敏处理（路径/用户名/密钥）
3. 更新 `PrivateSet/memory/_index.md` 和 `focus/<project>.md`
4. 有价值的技术内容写入 `toky_wiki/knowledge/`
5. 分别 push 两个仓库

### 跨设备同步流程

```
新设备
  ↓
git clone <PrivateSet> ~/PrivateSet   # 唯一手动步骤
  ↓
说「同步配置」（触发 sync-config skill）
  ↓
git pull PrivateSet → bash install.sh
  ↓
~/.claude/ 下部署：
  settings.json（含 hooks）
  CLAUDE.md（启动读取 _index.md 的指令）
  context-remind.sh（定期注入 hook）
  ↓
重启 Claude Code → 全部生效
```

`sync-config` skill 支持首次自动 clone，无需手动操作。

## 脱敏规则

| 原始内容 | 替换 |
|---------|------|
| 本地绝对路径 | `<LOCAL>` |
| GitHub 用户名 | `<USER>` |
| 服务器 IP/域名 | `<SERVER>` |
| API Key/Token | `<REDACTED>` |
| 内部保密项目名 | `<PROJECT>` |

公开工具名、命令语法、技术方案不脱敏。

## 关键设计决策

**为什么不用单仓库？**  
toky_wiki 是公开的，工作记忆（在做什么项目、具体进展）属于个人隐私，必须分离。

**为什么 focus/ 按项目分文件？**  
`_index.md` 是全局记忆（< 200行），`focus/<project>.md` 是当前项目焦点（< 50行）。长对话中注入的是 focus 文件（更精准、更小），避免每次注入太多 token。

**为什么每 8 条注入而不是更频繁？**  
平衡 token 消耗和上下文保活效果。8 条约等于一个完整子任务的对话量。
