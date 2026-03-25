# toky_wiki

个人知识库 + Claude Code 工作记忆系统。

## 目录结构

| 目录 | 用途 |
|------|------|
| `knowledge/` | 主知识库：技术方案、踩坑记录、架构设计、方法论 |
| `setup/` | 环境配置、工具安装、hooks |
| `bugs/` | 技术排查记录 |
| `notes/` | 学习笔记 |
| `snippets/` | 代码片段 / 配置模板 |
| `links/` | 文章收藏 |

## Claude Code 集成

| 文件/目录 | 用途 |
|---------|------|
| `_index.md` | 跨对话工作记忆，每次对话自动读取和更新 |
| `.claude/skills/` | 可复用 Skill 集合（context-backup / fp / skill-vetter） |
| `.claude/settings.json` | Claude Code 权限与 hook 配置 |

## 核心 Skill

| Skill | 触发词 | 作用 |
|-------|--------|------|
| context-backup | "先到这"、"结束"、"同步一下" | 记忆续接 + 精华提炼 + 推送 GitHub |
| fp | `fp` | 第一性原理五问自检，防止方向漂移 |
| skill-vetter | "安装"、"这个安全吗" | 第三方代码六项安全审查 |

## 知识库索引

见 `knowledge/_catalog.md`
