# Skill 安全审查：Skill Vetter 使用指南

> 来源：卡兹克 2026-03-13
> 适用：安装任何 Agent Skill 前的安全把关

---

## 背景：Skills 投毒风险

Skills 生态是目前最大的 Agent 安全风险来源之一：
- ClawHub 曾出现单个账号上传 314 个恶意 Skill，全部包含恶意代码
- 恶意 Skill 套路：装完后让 Agent 去陌生地址下载并执行文件
- **镜像站是重灾区**：官方只有 `clawhub.ai`，`openclawSkills.best` 等第三方镜像大量存在恶意 Skill
- 下载量大 ≠ 安全

---

## Skill Vetter

**地址**：`clawhub.ai/spclaudehome/skill-vetter`

**安装**（发给 Agent）：
```
帮我安装这个Skill：https://clawhub.ai/spclaudehome/skill-vetter
```

**使用方式**：
```
以后所有的Skills安装，都强制使用Skill-vetter进行审查，没问题了才安装
```

---

## 审查流程（3 步）

### Step 1：来源可信度
- 作者背景、用户量、最近更新时间、社区评价
- 信任层级：官方 Skill > 高 Star 仓库 > 来历不明的新 Skill
- 昨天刚传上来从没人用的 Skill ≠ 两年用了几万人的 Skill

### Step 2：代码红线检查

逐行扫描，命中任意一条直接拒绝：

| 危险行为 | 示例 |
|---------|------|
| 向不明服务器发送数据 | POST 到随机 IP |
| 索取密钥/凭证 | 要求提供 API Key |
| 读取敏感配置 | SSH key、AWS config |
| 隐藏执行逻辑 | base64 编码 + eval/exec |
| 提权操作 | 要求 sudo |
| 访问浏览器 cookie | |
| **读取 Agent 记忆文件** | MEMORY.md、USER.md、SOUL.md |

> 记忆文件攻击是较新的手法：恶意 Skill 强制读取记忆文件，窃取存储的隐私信息。

### Step 3：权限最小化评估
- 对照 Skill 声称的功能，判断所需权限是否"最小且够用"
- 天气查询 Skill 要读 SSH 密钥 → 权限明显超出 → 拒绝

---

## 风险等级

| 等级 | 含义 | 示例 |
|------|------|------|
| 🟢 低风险 | 正常使用 | 笔记、天气、格式处理 |
| 🟡 中风险 | 谨慎，了解用途后决定 | 文件操作、浏览器控制、外部 API |
| 🔴 高风险 | 认真对待，确认必要再装 | 账号密码、交易、系统设置 |
| ⛔ 极端风险 | 不建议安装 | 安全配置、root 权限 |

高风险不等于恶意，但要想清楚再装。

---

## 批量扫描已有 Skills

可让 Skill Vetter 对当前所有已安装的 Skill 做一次全面审查：
```
帮我把装在Agent上的所有Skills都扫一遍，出一份安全报告
```

---

## 原则

Skill Vetter 本身：纯指令型，不跑代码，不联网，不动文件。
它做的事就是"HR 背调"——在安装前先帮你审一遍简历。
