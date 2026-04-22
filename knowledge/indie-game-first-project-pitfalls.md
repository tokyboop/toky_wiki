# 新手独立游戏第一作的 4 条结构性陷阱

从 4 篇真人 devlog / postmortem 蒸馏。适用于评审任何"新手 N 周做完第一个游戏"的方案——看到对方方案里有以下结构缺失，直接打回重改，不是细节问题。

## 为什么写这篇

任何人（包括 AI）给新手列"4 周做游戏"的时间表时，本能会列一条线性推进路径：W1 基础、W2 扩展、W3 打磨、W4 发布。这条路径看起来合理，但和真人第一次做游戏实际发生的事不匹配。真人 devlog 里暴露的不是"细节估错了 10%"，是**结构层的三样东西完全没放进方案**：参照锚点、重来预算、目标分层。

## 真人来源（都是 solo 第一次或前几次做游戏）

- Xenopurge（alethium.itch.io）— solo 做 Vampire Survivors clone 的开发者
- "Another Tutorial on How to Fail Your First Game"（itch.io 论坛）— 1.5 年做完 Steam 首作、9 份销量的诚实复盘
- Beginner Maze postmortem（corareyescalens.itch.io）— 第一次做游戏，放弃重来一次才做完
- Ryan Kubik LD38 postmortem（ryankubik.com）— 第一次 solo Ludum Dare

## 四条结构性陷阱

### 1. 没有参照锚点，完成度无法判断

Xenopurge 作者的 MVP 定义原话：`"I aim to just feature match BtH, then I'll work to feature match around 10% of Vampire-survivors"`。他**给了具体参照物**——做到 Brotato Heavens 对齐、再扩 VS 10%。

新手方案里常见错误是写"极简 bullet heaven""最小可玩原型"这种无锚定义，做到哪算"到"完全凭感觉。没锚点的结果是永远觉得"还差一点"，永远不敢发。

对策：强制要求"做到参照游戏的 X 部分"，例如"做到 Brotato 开局 30 秒的核心循环"。

### 2. 没有"扔掉重来"的时间和心理预算

Beginner Maze 作者原话：`"I quickly jumped to Bitsy and got lost designing rooms... throw it away and start all over."` 她第一版做 1-2 天停下来、换方向后 `"In just one day I built the whole game"`。

Xenopurge 作者也记录了中期跑偏：`"i got lost in a tangent for a while, where i thought maybe this would become a mech game"`。

新手第一次做游戏的中期跑偏/推倒重来是**概率事件不是失败**。线性时间表没给这件事留位置，意味着一旦发生就只能算"进度损失"——但真人 devlog 显示这通常是方向对齐的关键点，不是损失。

对策：4 周方案至少加 0.5-1 周的"可能推倒重来周"，并且事先写清楚"如果第 N 周发生方向偏移，做法是 X 不是 Y"。

### 3. "上架 Steam" 和短期方案不能用同一套时间线

Failed Steam 作者原话痛点：1.5 年开发、148 愿望单、`"One post on Twitter per month will suffice! It will get likes by fellow devs just like you and be forgotten in 5 seconds"`。他的首作发布时销量 9 份，三条归因第一条是"机制过载"，第二条是"忽视营销"，第三条是"Steam 页面仓促"。

含义：Steam 上架是**和开发独立的 6-12 月营销工程**，愿望单积累、页面打磨、tag 研究、trailer 制作全都是独立工作量。4 周做完游戏 → 直接上 Steam = 复制他 9 份销量的路径。

对策：如果方案同时包含"自己玩/朋友发""小圈子验证""Steam 上架"三个目标，必须明确**只有前两个走短期方案**，Steam 从这个时间线里剥离出来单独规划。

### 4. 0 基础踩到的第一批硬技术点，不是方案里显眼的那些

真人 devlog 里被明确点名"卡住"的技术点，和 AI 列方案时写的技术点经常错位：

- Xenopurge：`"struggled with getting the enemies to move towards the player at a consistent rate. here lerps failing to do the job"` — 向量归一化 + delta-time 缩放，这是敌人 AI 的第一道硬数学题
- Ryan Kubik：`"Creating SFX and music is hard for me. VERY hard."` — 单人做音效被 solo 老将明确定义为难点

AI 列方案时容易把这两条写成轻松条目（"1 敌人追玩家""Kenney BGM + jsfxr"），但真人在这两个点都卡壳或短板暴露。

对策：方案里凡是涉及"敌人 AI"和"音效/音乐"的条目，强制按"比预估 × 2"的时间给，并且事先规定"如果原创做不出来，直接用 Kenney/Ludwig 完全替代，不降级不回调"。

## 反向支持信号（出现这些算加分，不是陷阱）

- 方案里写了"W1 周末跑通 MVP" → 好信号，Ryan Kubik 周六下午完成 MVP 给了他 polish 时间
- 方案里显式砍了某个平台（比如只做 Windows 不做 Mac）→ 好信号，0 基础做 Mac 签名公证是伪需求
- 方案里写了"先打一次 game jam 暖身再做长项目" → 好信号，多篇 devlog 佐证完成率和 jam 经验高度相关

## 怎么用这篇

未来看到任何人（包括自己）给新手列"N 周做游戏"方案时，按三问对照：

1. 方案有没有参照锚点？（做到 X 游戏的 Y 部分）
2. 方案有没有给"中期跑偏 / 推倒重来"留预算？
3. 方案的目标层次清不清楚？（自玩 / 小圈子 / Steam 上架 不能用同一套时间线）

三问里有一问答不上来，方案不是需要优化细节，是需要重做结构。
