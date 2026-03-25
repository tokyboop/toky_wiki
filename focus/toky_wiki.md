# toky_wiki / FP 运营数据能力 — FOCUS
_上次更新：2026-03-21_

**当前目标**：FP 异常监控告警系统（SQL + Python + 飞书 webhook）

## 当前状态
- 告警方案设计完成（5种对比维度确定）
- 等 Lord 提供表结构 → 写真实 SQL → Python 脚本 → 接飞书

## 关键决策（FP 告警）
- 对比维度：日环比、周同比、月整体、活动期对比、历史活动对比
- 告警通道：飞书机器人 webhook
- 执行管道：cron + Python 脚本
- 监控指标优先级：DAU → 道具消耗量 → 充值金额 → 新增用户数

## 关键决策（Citadel / Wiki 基建）
- protect-files hook：警告 + exit 0（不硬拦截，依赖 Claude Code 权限弹窗）
- Skill 路径：`.claude/skills/`
- 脱敏标记：`<LOCAL>` `<USER>` `<SERVER>` `<REDACTED>` `<PROJECT>`

## 活跃 Branch
- `<USER>/toky_wiki` → `claude/citadel-setup-U6O0d`

## 下次入口（FP 告警）
1. Lord 提供：表名 + 字段 + 数据库类型（MySQL / PG / CH）
2. 写真实 SQL 模板（含5维度）
3. 封装 Python 告警脚本
4. 接飞书 webhook 测试推送

## 绝对不忘
- 老活动 log 推不动，不依赖研发，先做运营自己能控制的 2-4 条
- 运营 insight 7条优先级已确认
