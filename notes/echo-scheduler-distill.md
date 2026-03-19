# echo-scheduler 蒸馏笔记

> 蒸馏日期：2026-03-19
> 原始项目：[echo-scheduler branch](https://github.com/tokyboop/toky_wiki/tree/echo-scheduler)

---

## 根本问题

每个 AI 对话窗口是孤岛——它不知道其他窗口在干嘛，无法协调。

**echo-scheduler 就是那个调度中心**：知道进度、保留记忆、互通有无。

---

## 核心框架（5个概念）

```
Tasks      → 定时触发：到时间让某个 AI 开始干活
Watcher    → 轮询监控：发现哪个 AI 卡死/上下文爆了
Supervisor → 决策修复：收到异常事件后，判断怎么处理
Channels   → 消息总线：AI A 把结果传给 AI B
Dashboard  → 全局视图：人看所有 AI 的当前状态
```

### 完备性验证

| 场景 | 谁负责 |
|------|--------|
| 定时让某个 AI 干活 | Tasks |
| 发现某个 AI 卡死了 | Watcher |
| 决定怎么修卡死的 AI | Supervisor |
| AI A 把结果告诉 AI B | Channels |
| 你想看所有 AI 现在状态 | Dashboard |

覆盖完整。

---

## 关键细节

- **三个触发源互相独立**：Tasks / Watcher / Supervisor 都能自主触发新对话，暂停时必须三个都停，停一个没用
- **内存状态**：Channels 消息、任务日志重启后清空，不持久化
- **完全非侵入**：不改 Echo Agent 源码，只通过 HTTP API 操作
- **接入方式**：任意会话的 `mcp_config` 加一行 URL 即可获得全部 18 个工具

---

## 暂停所有自动化（SOP，别忘）

```
1. scheduler_watcher_control(action="stop")
2. scheduler_supervisor_control(action="stop")
3. 逐个 scheduler_cancel_task(task_name=...)
4. 验证：scheduler_overview() → tasks.active = 0
```

---

## 可迁移的模式

> **任何多 agent 系统都需要解决三件事：**
> 1. **触发**：谁来决定什么时候干（Tasks + Watcher）
> 2. **执行**：谁来干（Sessions）
> 3. **通信**：干完了怎么告诉别人（Channels）
>
> echo-scheduler 是这个模式的一个完整实现，下次设计多 agent 架构时可以对照检查。

---

## 什么时候想到用它

- 你有多个 Claude 会话在并行跑任务
- 你需要一个会话完成后自动触发另一个
- 你担心长时间任务中途卡死没人管
