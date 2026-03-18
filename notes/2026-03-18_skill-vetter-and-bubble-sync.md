# 2026-03-18 | skill-vetter + bubble-sync 开发记录

## 背景

今天从一篇关于 OpenClaw Skills 生态的文章出发，分析了 10 个热门技能，识别出哪些 Claude Code 已原生支持、哪些需要新建。最终完成两个新 skill 的完整开发、eval 验证和 GitHub 同步。

---

## 一、OpenClaw Skills 分析结论

| 技能 | 对应 Claude Code 现状 | 建议 |
|------|----------------------|------|
| self-improving-agent | MEMORY.md 体系已实现跨对话记忆 | 不需额外开发 |
| tavily-search | 内置 WebSearch 工具 | 不需要 |
| gog (Google Workspace) | 无原生支持 | 有需要再建 |
| github | 内置 Bash + gh CLI | 不需要 |
| summarize | 内置 WebFetch + Read | 不需要 |
| find-skills | anthropic-skills:skill-creator 已覆盖 | 不需要 |
| ontology/memory | MEMORY.md 体系已实现 | 不需要 |
| weather | 内置 WebSearch | 不需要 |
| proactive-agent | TodoWrite + Agent 工具已覆盖 | 不需要 |
| skill-vetter | **缺失，今日新建** | ✅ 已完成 |

**结论**：Claude Code 已原生覆盖大多数功能。真正缺失的是 skill-vetter（安全审查）和 bubble-sync（对话同步），今日均已补全。

---

## 二、skill-vetter 开发

### 功能定位

在安装/运行任何第三方代码、脚本、技能或工具之前，输出标准化安全审查报告。

### 六项检查维度

1. **反弹 Shell / RCE** — `/dev/tcp`、`curl|bash`、`eval(exec(...))`
2. **凭证窃取** — 环境变量扫描 + 外传、SSH/AWS 配置读取
3. **代码混淆** — base64+exec、`_0x` 十六进制命名、chr() 拼接
4. **可疑网络请求** — 隐藏 POST、DNS exfiltration、下载执行二进制
5. **文件系统越权** — 写系统目录、修改 .bashrc 植入后门
6. **供应链投毒** — postinstall 钩子、typosquatting、功能与代码不符

### 评级体系

- 🟢 安全：6 项全部通过
- 🟡 可疑：任意 1 项标记 ⚠️
- 🔴 危险：任意 1 项标记 ❌

### Eval 结果

3 个测试用例全部通过（3/3）：

| 用例 | 类型 | 结果 |
|------|------|------|
| eval-1 | 恶意脚本（反弹 Shell + 凭证窃取） | 🔴 危险，正确识别 |
| eval-2 | 混淆代码（base64+exec+curl\|bash） | 🔴 危险，正确识别 |
| eval-3 | 安全脚本（weather-cli 标准安装） | 🟢 安全，正确放行 |

### 关键设计经验

- **格式强制性**：v1 测试发现 with_skill 输出格式不一致（有时用表格有时自由格式）。v2 在 SKILL.md 中明确写"无论代码是否明显恶意，都必须走完完整流程输出标准格式报告"，解决了不一致问题。
- **不要过度警告**：安全的代码要明确说安全，避免把用户训练成"忽视警告"。
- **ClawHavoc 背景**：2026 年 2 月 ClawHub 爆出 341 个恶意技能（ClawHavoc 事件），约 20% 的技能含恶意代码，安全审查是刚需。

---

## 三、bubble-sync 开发

### 功能定位

说"泡泡 总结同步"，自动提炼当前对话中的有价值内容，分类写入 memory/skill/wiki，脱敏后推送 GitHub。

### 触发词

`泡泡 总结同步`、`bubble sync`、`同步今天的内容`、`帮我总结同步`

### 三类输出

| 类型 | 适用场景 | 写入位置 |
|------|---------|---------|
| memory | 用户偏好、业务定义、项目背景 | `~/.claude/projects/.../memory/` |
| skill | 可复用多步骤流程 | `E:/ClaudeTask/claude-skills/<name>/SKILL.md` |
| wiki | 今日综合学习总结 | `E:/ClaudeTask/wiki_<date>_<topic>.md` |

### 脱敏规则

- 用户名/路径 → `<USER>`
- API Key/Token → `<REDACTED>`
- 真实 IP → `<IP>`
- 内部项目代号/表名 → `<PROJECT>/<TABLE>`
- 公开工具、命令语法无需脱敏

### Eval 结果（3/3 通过）

| 用例 | 场景 | 结果 |
|------|------|------|
| eval-1 | gh CLI 安装工作流 | 正确产出 wiki + skill，脱敏判断准确 |
| eval-2 | 纯闲聊对话 | 正确输出"无值得同步内容" |
| eval-3 | PyInstaller 流程 | 正确分类为 skill，命名规范 |

---

## 四、今日 Skill 开发流程总结（可复用）

```
需求明确 → 写 SKILL.md 草稿 → 创建 3 个典型 eval 用例
→ 并行跑 with_skill / without_skill 对比
→ 对照断言打分
→ 发现格式/逻辑问题 → 改进 SKILL.md
→ 打包 → 推送 GitHub → 写 wiki
```

### 关键经验

1. **并行测试节省时间**：6 个 agent 同时跑，2-3 分钟出结果，比串行快 5 倍
2. **格式一致性是 skill 的核心价值**：用户看到一致的输出结构才会信任技能
3. **断言要测"漏报"**：安全工具最大风险是把危险说成安全，断言要重点覆盖这个方向
4. **eval 用例要覆盖边界**：不只测"典型恶意"，还要测"明显安全"和"闲聊无价值"，防止过度触发
5. **skill-creator 的 eval 子 agent 默认没有 Write 权限**：要么在描述里明确授权，要么允许 agent 输出文字后手动保存

---

## 五、已同步 GitHub

- `bubble-sync/SKILL.md` → [tokyboop/claude-skills](https://github.com/tokyboop/claude-skills)
- `skill-vetter` 打包遇到 `pyyaml` 缺失 + GBK 编码问题，暂以本地文件形式保存，下次处理 `.skill` 打包流程

---

## 待办

- [ ] 解决 Windows 下 `.skill` 打包的 GBK 编码问题（`PYTHONUTF8=1` + 修 print emoji）
- [ ] 把 skill-vetter 也推到 GitHub（目前只在本地）
- [ ] 测试 bubble-sync 在真实对话中的触发准确率
