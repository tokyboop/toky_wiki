# echo-scheduler 蒸馏笔记

## 根本问题
多个 AI 对话窗口并行工作时，互相孤立——不知道对方进度，无法协调，无人监控异常。

## 核心框架（5个概念）

```
Tasks      → 定时触发任务
Watcher    → 轮询监控，发现异常（如会话卡死）
Supervisor → 收到异常事件，决策怎么修复
Channels   → 会话之间传递消息（每频道存200条）
Dashboard  → 人看全局状态
```

## 信息流转

```
Tasks 触发 → Watcher 监控执行中的会话
→ 发现异常 → 通过 Channels 通知 Supervisor
→ Supervisor 决策修复
→ Dashboard 展示全局状态
```

## 和主脑的区别

| | echo-scheduler | 主脑 MasterMind |
|--|--|--|
| 解决对象 | 多个AI会话之间的协调 | 人跨会话的记忆断裂 |
| 核心问题 | AI之间互相不知道 | AI每次开新对话会忘 |

## 什么时候该想到它

- 你需要多个 Agent 并行干活，且需要协调
- 某个 Agent 任务很长，需要自动监控是否卡死
- 需要 Agent 之间传递结果

## 关键局限

需要 OpenCode API + 常驻进程，Claude Code 用户无法直接使用后台异步能力。
