# 必装 Skills 精选（6个）

> 来源：卡兹克 2026-03-30
> 适用：Claude Code / OpenClaw / Codex 等 Agent

---

## 1. Frontend Design
**链接**：`anthropics/skills/skills/frontend-design`
**解决**：AI 生成前端的审美问题（千篇一律 Tailwind 蓝紫渐变）

核心机制：
- 写代码前先定"大胆美学方向"（极简/复古未来风等），所有设计决策围绕方向统一
- 硬性禁止：Inter/Roboto/Arial 烂大街字体，紫色渐变白底经典 AI 审美
- 能力越弱的模型，效果提升越明显

**适合**：经常用 Agent 生成前端页面、数据可视化、小工具 UI

---

## 2. 办公四件套（docx / xlsx / pdf / pptx）
**链接**：`anthropics/skills/skills/` 下各取对应名
**解决**：Agent 从零写文件格式代码时的排版混乱问题

不装 vs 装的区别：
- 不装：每次 Agent 自己摸索格式，运气不好就一坨
- 装了：内置文档处理流程和代码模板（页面大小、宽度、图片类型等），有操作手册可照做

可叠加 Frontend Design 一起用提升 PPT 颜值。

**适合**：几乎所有人，Cowork 用户已内置可跳过。

---

## 3. Web Access Skill
**链接**：`eze-is/web-access`
**解决**：Claude Code 原生搜索无法访问站内内容（小红书、B站、飞书等）

关键特性：
- 通过 Chrome DevTools Protocol 连本地 Chrome，**带登录状态**访问
- 支持 Jina 作中间层，把网页预转 Markdown 再读，大幅节省 token
- **自动沉淀操作经验**：按域名存选择器/路径记录，越用越快
- 多 Agent 并行操作不同标签页，互不干扰

前置条件：Chrome 最新版 + 开启远程调试（`chrome://inspect/#remote-debugging`）

---

## 4. PUA
**链接**：`tanweai/pua`
**解决**：AI 摆烂（"建议您手动检查""需要更多上下文"= 我不想干了）

使用时机：某个 bug 或任务改了几次还没搞定时，手动触发 `/pua`

机制：
- 四级压力升级，Agent 原地打转时强制打断
- 执行 7 项检查清单逼换思路
- v3 版：自动根据任务类型选方法论（阿里/字节/华为/腾讯/美团/拼多多/Netflix/Apple 等）

**建议**：不要默认开启，在实在解决不了时手动触发。

---

## 5. Claude-mem
**链接**：`thedotmack/claude-mem`
**解决**：Claude Code 没有持久记忆（OpenClaw 的长期记忆能力移植版）

特性：
- 自动记录每次对话关键信息，压缩存储，新会话自动注入相关上下文
- 三层检索（索引 → 时间线 → 完整细节），省 token
- 本地 Web 界面 `localhost:37777`，可视化查看记忆内容
- 隐私控制：`<private>内容</private>` 标签跳过敏感内容

---

## 6. Skill-Creator（最重要）
**链接**：`claude.com/plugins/skill-creator`
**解决**：从 Skill 消费者变成 Skill 创造者

一句话：用嘴描述需求 → 自动生成属于你自己的 Skill。

前五个 Skill 解决通用问题；Skill-Creator 让你解决只有你才知道的个性化问题。
> "最牛逼的 Skill，永远是下一个你自己造的那个。"

→ 详见 `skill-creator-eval-system.md`（新版评估体系）

---

## 叠加组合推荐

| 场景 | 推荐组合 |
|------|---------|
| 前端/数据可视化 | Frontend Design + 四件套 |
| 做 PPT | 四件套 + Frontend Design |
| 站内搜索 | Web Access |
| 顽固 Bug | PUA（按需触发） |
| 长期项目记忆 | Claude-mem |
| 一切 | Skill-Creator（造自己的） |
