# 2026-03-20 | Claude Code 实用命令速查

> 来源：数字生命卡兹克公众号（2026-03-20）
> 适用：日常 Claude Code 使用效率提升

---

## 命令清单

### 1. /btw — 不污染上下文的插问

Claude 干活途中想插一个问题，但不想打断任务、不想污染对话历史。
打 `/btw 空格 你的问题`，回答完按空格/回车消除，对话历史干干净净。
几乎不费 token，复用当前提示缓存。

---

### 2. /rewind — 分别回退代码或对话

双击 Esc 触发，弹出菜单选择：
- 回退代码和对话
- 回退对话但保留代码
- 回退代码但保留对话（最常用：试验新方案，不行代码回退，对话留着）
- 将对话压缩释放上下文窗口空间

适合做实验：让 Claude 试一种方案，不行代码回退，Claude 还记得这条路不通，直接换方向。

---

### 3. /insights — 分析使用习惯

生成 HTML 报告，分析过去一个月：最常用命令、重复操作模式、推荐自定义命令和 Skill。
建议每个月跑一次。

---

### 4. /model opusplan — 规划用 Opus，执行用 Sonnet

规划阶段自动用 Claude Opus 4.6，执行阶段切换 Claude Sonnet 4.6。
Pro 订阅（20刀）Opus 额度有限用户福音。

---

### 5. /simplify — 三 Agent 并行代码审查

同时启动三个并行 Agent，分别从复用、质量、效率三角度审查改动。
比 /review 好用，建议每写完几个大功能后跑一遍。

---

### 6. /branch — 对话分叉（原 /fork）

把当前对话分叉成新会话，原对话不受影响。
/fork 仍然可用会自动跳转。

> /rewind 是后悔药，/branch 是平行宇宙。

---

### 7. /loop — 定时重复执行

`/loop 5m 检查部署状态` 每5分钟自动执行一次。
默认10分钟，定期任务3天后自动过期。想持续运行用桌面版。

---

### 8. /remote-control（/rc）— 手机遥控

生成 URL，手机打开即可操控 Claude Code 会话，双向实时同步。
代码始终在本地跑，手机只是遥控器。

---

### 9. /export — 导出对话为 Markdown

整段对话导出成 Markdown。适合保存架构讨论、重要决策过程。

---

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| Ctrl+V | 直接粘贴截图（Mac 也是 Ctrl+V 不是 Cmd+V） |
| Ctrl+J / Option+回车(Mac) | 换行 |
| Ctrl+R | 搜索历史 prompt |
| Ctrl+U | 删除整行输入 |

---

## 追踪更新

- CHANGELOG: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md
- 关注 Claude Code 开发团队 Twitter，很多功能比官方文档更早提到
