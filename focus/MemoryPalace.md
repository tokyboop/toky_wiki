# MemoryPalace (221B Baker Street) — FOCUS
_上次更新：2026-03-21_

**当前目标**：Holmes 三角色架构升级（暂缓，等 FP 告警完成后继续）

## 当前状态
- 方案定稿（见 `knowledge/holmes-architecture.md`）
- 待开新 branch 开始实现三角色路由

## 关键决策
- 向量存储：numpy + pickle（非 ChromaDB）
- Embedding：text-embedding-3-small（apiyi.com 代理）
- 生成模型：gpt-4o-mini（同代理）
- 查询入口：Discord Bot（跨设备移动端）
- 部署：朋友 CentOS 9 服务器，systemd 管理

## 活跃 Branch
- `<USER>/MemoryPalace` → `main`（待开 `claude/holmes-three-roles-impl`）

## 下次入口
1. 开 branch：`claude/holmes-three-roles-impl`
2. 按 `knowledge/holmes-architecture.md` 实现路由逻辑
3. simple → 直接回复；complex → CoT 推理；memory → 先查向量再回复

## 绝对不忘
- Lord 通过 GitHub Web UI 操作，无本地 CLI 访问
- Discord bot 是唯一移动端交互入口
- 服务器上已有 numpy+pickle 向量存储，不要换方案
