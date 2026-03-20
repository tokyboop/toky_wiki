# Holmes 三角色架构 — 完整方案

> 文档日期：2026-03-19
> 对应项目：tokyboop/MemoryPalace

---

## 根本问题

用户问的问题有简有繁——简单问题一句话答，复杂问题需要拆子问题并行检索再综合推理。
原来的 `answer()` 是一刀切的平铺检索，不区分问题复杂度，导致：
- 简单问题返回冗余推理（慢、浪费 token）
- 复杂问题只做单次检索（答案片面）

---

## 三角色分工

```
评估者（Triage）   → 判断问题复杂度，拆子问题
检索者（Retriever） → 纯工具，向量搜索，无 LLM
作答者（Holmes）   → 福尔摩斯风格，速答 or 深度推理
```

---

## 完整信息流

```
用户输入
    ↓
【1次LLM】triage_and_decompose()
    → 返回 JSON: {"mode": "quick"|"deep", "sub_questions": [...]}
    ↓
if mode == "quick":
    直接调用现有 answer()（保持不动）
    → 返回简洁结论
    ↓
if mode == "deep":
    sub_questions 并行 → 各自调用 query()（纯向量搜索）
    → 去重合并，取 top8 片段
    ↓
    【1次LLM】answer_holmes()
    → prompt 规定输出格式：<推理>...</推理><结论>...</结论>
    → 返回 (reasoning, conclusion, sources)
    ↓
bot.py 路由 → _build_holmes_embed()
    → quick：单段 embed
    → deep：推理链 + 结论两段分开展示
```

**LLM 调用总数：最多 2 次（评估1次 + 作答1次）**

---

## retriever.py 改动

### 新增：triage_and_decompose()

```python
def triage_and_decompose(question: str) -> dict:
    """
    1次LLM，判断问题复杂度并拆子问题。
    返回: {"mode": "quick"|"deep", "sub_questions": [...]}
    """
    prompt = f"""你是一个问题分析器。分析以下问题，返回JSON格式（不要有多余文字）：

问题：{question}

判断标准：
- quick：单一明确的事实问题，一段知识能回答
- deep：需要综合多个角度、对比分析、或问题本身包含多个子问题

返回格式：
{{"mode": "quick"|"deep", "sub_questions": ["子问题1", "子问题2"]}}

如果是 quick，sub_questions 为空列表。
"""
    response = client.chat.completions.create(
        model=config["model"],
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )
    return json.loads(response.choices[0].message.content)
```

### 新增：answer_holmes()

```python
HOLMES_PERSONA = """你是夏洛克·福尔摩斯，正在运用演绎推理分析主人的私人知识库。

主人的思维习惯（帮助你理解他的问题意图）：
- 他的问题通常在寻找"根本原因"，不只是表面答案
- 他偏好层次结构和信息流转，而非散文
- 他习惯用"A vs B"对比来做决策，主动给出对比比长段说明更有效
- 他厌恶手动维护重复状态，如果有自动化路径优先提
- 他不喜欢过度设计，"最小可行方案"优先
- 他把学到的东西蒸馏成笔记，回答要有"可以直接写进笔记"的密度

回答格式（严格遵守）：
<推理>
从证据出发，逐步推导，展示关键步骤
</推理>
<结论>
直接、精准的最终答案
</结论>"""


def answer_holmes(question: str, sub_questions: list) -> tuple:
    """
    deep 路径：并行检索 → 合并去重 → 1次LLM作答。
    返回: (reasoning, conclusion, sources)
    """
    # 并行检索所有子问题
    all_chunks = []
    for sq in sub_questions:
        chunks = query(sq)  # 现有 query() 函数，纯向量搜索
        all_chunks.extend(chunks)

    # 去重 + top8
    seen = set()
    unique_chunks = []
    for chunk in all_chunks:
        key = chunk["text"][:50]
        if key not in seen:
            seen.add(key)
            unique_chunks.append(chunk)
    top_chunks = unique_chunks[:8]

    context = "\n\n".join([c["text"] for c in top_chunks])
    sources = list(set([c.get("source", "unknown") for c in top_chunks]))

    prompt = f"""{HOLMES_PERSONA}

以下是从知识库检索到的相关片段：

{context}

---

问题：{question}
"""
    response = client.chat.completions.create(
        model=config["model"],
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )

    raw = response.choices[0].message.content
    reasoning = _extract_tag(raw, "推理")
    conclusion = _extract_tag(raw, "结论")
    return reasoning, conclusion, sources


def _extract_tag(text: str, tag: str) -> str:
    import re
    match = re.search(f"<{tag}>(.*?)</{tag}>", text, re.DOTALL)
    return match.group(1).strip() if match else text
```

### 现有 answer() 不动

quick 路径直接复用，不需要改。

---

## bot.py 改动

### 路由逻辑

```python
async def on_message(message):
    if message.author.bot:
        return
    question = message.content.strip()
    if not question:
        return

    triage = triage_and_decompose(question)

    if triage["mode"] == "quick":
        result = answer(question)  # 现有函数
        embed = _build_quick_embed(question, result)
    else:
        reasoning, conclusion, sources = answer_holmes(
            question, triage["sub_questions"]
        )
        embed = _build_holmes_embed(question, reasoning, conclusion, sources)

    await message.channel.send(embed=embed)
```

### _build_holmes_embed()

```python
def _build_holmes_embed(question, reasoning, conclusion, sources):
    embed = discord.Embed(
        title="🔍 221B · 深度推理",
        color=0x2C2F33
    )
    embed.add_field(name="问题", value=question, inline=False)
    embed.add_field(name="推理链", value=reasoning[:1000] or "—", inline=False)
    embed.add_field(name="结论", value=conclusion[:500] or "—", inline=False)
    if sources:
        embed.set_footer(text="来源：" + " · ".join(sources[:3]))
    return embed
```

---

## 开发顺序

```
1. retriever.py
   ├── 新增 triage_and_decompose()
   ├── 新增 answer_holmes() + _extract_tag() + HOLMES_PERSONA
   └── 现有 answer() / query() 保持不动

2. bot.py
   ├── 改 on_message：加路由逻辑
   └── 新增 _build_holmes_embed()

3. 本地测试
   ├── quick 路径：问一个简单事实问题
   └── deep 路径：问一个需要对比/综合的问题

4. 推送部署
```

---

## 关键决策备忘

| 决策 | 选择 | 原因 |
|------|------|------|
| 角色人设 | 全程福尔摩斯，不引入华生 | 统一人格，不分裂 |
| 评估+拆题 | 1次LLM | 合并调用，省token |
| 推理+结论 | 1次LLM，prompt规定格式 | 简单可控 |
| 检索 | 纯向量搜索，无LLM | 快速，不浪费调用 |
| 去重策略 | text前50字符判重 | 简单够用 |
| embed展示 | 推理链+结论分两个field | 阅读体验好 |
