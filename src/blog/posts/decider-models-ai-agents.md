---
title: "Your Agent Doesn't Need a Frontier Model to Decide What to Do Next"
date: 2026-11-21
author: Sai Sridhar Tarra
category: AI Engineering
tags: [Agents, Decider Models, LLMs, Calibration, Routing, Strands, Production AI]
featured: true
excerpt: Most of what an agent does all day is pick from a short list. Should I call this tool? Is this ticket billing or sales? A new class of small "decider" models answers those questions in one pass, with a confidence number you can actually use. Here's how they work, what the early numbers say, and where I'd use one.
---

# Your Agent Doesn't Need a Frontier Model to Decide What to Do Next

If you've built an agent loop, you've probably noticed something a bit embarrassing about it. A lot of the LLM calls aren't doing anything clever. They're answering questions like "is this tool call safe to run?" or "which of these three tools fits?", questions where you already know every possible answer. You're paying a big model to write a paragraph so you can parse one word out of it.

That's the problem a new class of models is going after. AWS calls them **decision models**, and on October 1 their Strands Labs team open-sourced one: [Strands Decider 2B](https://strandsagents.com/blog/introducing-strands-decider/). It's not the only one. TypeSafe shipped Jev in September, Cloudflare has Clef on Workers AI, and OpenAI has a Decisions API in beta ([InfoWorld](https://www.infoworld.com/article/4233075/as-ai-agents-grow-vendors-carve-out-decision-making-as-a-separate-model-layer.html) has a good roundup). The idea is the same across all of them: pull the small, boring, constant decisions out of the LLM and give them to a model built just for that.

I went through the docs, the model card and the first independent write-ups. This is what I learned.

## What a decider model actually is

A decider doesn't write anything. You give it a piece of text (the "state") and a question with a fixed set of answers, and it gives you back probabilities. That's it.

Strands Decider supports three kinds of question:

- **yes/no** (they call it `noul`): you get the probability that the answer is yes.
- **choice**: pick one of N options. You get the winner, the probability of every option, and a confidence number.
- **score**: a level on a scale you define (calm, frustrated, furious). You get the expected level and how sure it is.

Here's the example from the [GitHub README](https://github.com/strands-labs/strands-decider), which is honestly the best way to get it:

```bash
pip install strands-decider

strands-decider ask StrandsAgents/strands-decider-2B-qwen3.5-v1-2610 \
  --state "Help! My payouts have been failing for 3 days! " \
  --choice "Which team should handle this?=billing,sales,retail"
```

```
choice_0 -> billing (confidence 0.659)
  billing 0.773   sales 0.121   retail 0.106
```

No prompt engineering to get JSON out of it, no parsing, no "the model decided to answer with a haiku today". It can only ever return one of the options you gave it.

There's also a small HTTP server (`strands-decider serve <model> --port 8000`) that exposes a `POST /v1/systemone` endpoint, so you can call it from any language. Worth knowing: it binds to localhost and has no authentication, so don't just put it on the internet.

## Why it's fast: one forward pass, no generation

This is the part I found genuinely clever.

A normal LLM answers by generating tokens one at a time. Even if the answer is "billing", it runs a forward pass per token, and you usually ask it to explain itself first, so it's many tokens.

Decider 2B is a [Qwen3.5-2B base model](https://huggingface.co/StrandsAgents/strands-decider-2B-hobson-v19) with a rank-16 LoRA adapter and a tiny readout head on top, about a million parameters. The prompt is laid out like this:

```
<state>Help! My payouts have been failing for 3 days!</state>
<question type="choice">Which team should handle this?
<options>1. billing 2. sales 3. retail</options></question>
<answer>
```

The model runs over that **once**. Then, per the [architecture docs](https://strandsagents.com/docs/labs/strands-decider/architecture/), the readout takes the hidden state at `<answer>` as a query and the hidden state at the end of each option as a key, takes a dot product for each option, and softmaxes over them. In their words: "One forward pass, no generation, no decoding loop."

Two nice side effects fall out of that design:

1. **Option order doesn't matter much.** They shuffle options on every training example, and reversing the order at inference moves the probabilities by about 0.016. If you've ever had an LLM favour whatever option you listed first, you'll appreciate this.
2. **Several questions are cheap.** The state is encoded once and every question reads from it. Asking "which team?", "is this urgent?" and "how annoyed are they?" about the same email costs barely more than asking one.

The latency numbers back it up. The launch checkpoint had a median of 115 ms (p95 299 ms) on an RTX 3090 and 153 ms on an M3 Pro, according to the [README](https://github.com/strands-labs/strands-decider). On plain CPUs it's a different story, which I'll come back to.

## The part that matters most: the confidence number

As someone doing an MSc in statistics, this is where I got interested.

Frontier LLM APIs don't really give you a trustworthy "how sure are you?". You can ask the model to rate its own confidence, but that number is just more generated text. Decider models are trained so their probabilities are **calibrated**: when it says 0.8, it should be right about 80% of the time.

For choice questions the confidence is computed from the top probability, normalised by how many options there were:

```
confidence = (N · p_max − 1) / (N − 1)
```

So with three options, a top probability of 1/3 (pure guessing) gives a confidence of 0, and a top probability of 1 gives 1. That's why "billing at 0.773" above comes out as confidence 0.659.

The README claims that answers with confidence 0.9 or more are right about 95% of the time on short classification tasks it hasn't seen. On the public JevBench set (231 tasks), the current reference model gets 180 right (77.9%), with a Brier score of 0.280 and an expected calibration error of 0.072. The launch version got 167 (72.3%).

Two things I'd keep in mind before getting excited about those numbers:

- 231 tasks is a small benchmark. The authors themselves say to treat a difference of fewer than about 10 tasks between two runs as unresolved. I like that they say it.
- Calibration is fitted with one temperature per question type, on short classification tasks. The [model card](https://huggingface.co/StrandsAgents/strands-decider-2B-hobson-v19) is blunt about it: measure on your own traffic before you trust a threshold.

## Is it actually good? The early independent numbers

The launch post claims it's competitive with other models in its class. The more useful numbers come from two people who tried it on AWS Builder Center.

**Routing support tickets** ([Akshay B](https://builder.aws.com/content/3KJvK45IGyUNQwRd4dSOZQWKv8I/running-strands-decider-2b-on-amazon-bedrock-agentcore-microvms-vs-gpu-instances)). He built 100 synthetic support messages for a made-up invoicing app and routed them to billing, technical, sales, account or unknown. Zero-shot, Decider got 72%. Claude Haiku 4.5 got 93%. So on raw accuracy, the 2B model loses clearly, which is what you'd expect.

But then he used the confidence number. Decider answers when it's confident and hands everything else to Haiku:

| Confidence threshold | Share Decider answers alone | Overall accuracy |
|---|---|---|
| none | 100% | 72% |
| 0.5 | 61% | 87% |
| 0.6 | 45% | 90% |
| 0.7 | 32% | 92% |
| 0.8 | 19% | 93% |

At a threshold of 0.6, Decider handles almost half the traffic and the system lands at 90% accuracy, three points below Haiku alone, for about 36% less cost ($0.79 vs $1.23 per 1,000 decisions). He's careful to say it only pays off at steady volume, and that one person labelled the data, so it's indicative rather than a benchmark.

**Gating an agent's actions** ([Felina Christy A](https://builder.aws.com/content/3KPyILZ7MiHTr0iLmPCNwBIz9Qh/the-witness-that-could-only-nod-a-week-with-strands-decider-part-1)). She used Decider as a "witness" that checks an agent's decisions instead of asking an LLM. With 100 candidate tools, Decider picked the right one 88.9% of the time against 88.4% for Amazon Nova Lite. In a full agent run of 180 tasks, the witness version finished all 180 (the all-LLM version finished 166), cost $0.006 per 100 tasks instead of $0.034, and had a median of 4.7 s instead of 7.1 s.

The detail from her write-up I keep thinking about: the wording of the question mattered a lot. A strict phrasing of the same check scored 81.8% and rejected over a third of good calls. A blunter phrasing scored 94.0%. So you still have to engineer the question, even if you don't have to engineer the output format.

## Where it falls short

It would be easy to oversell this, so here are the limits, mostly in the authors' own words:

- **It doesn't reason.** Answering in one parallel pass makes these models "significantly worse at solving complex problems than reasoning models" ([Strands blog](https://strandsagents.com/blog/introducing-strands-decider/)). It's for rote decisions, not hard ones.
- **Long, multi-step documents are its weak spot**, and it "reads questions less than documents", so changing the question doesn't always change the answer ([model card](https://huggingface.co/StrandsAgents/strands-decider-2B-hobson-v19)).
- **CPU is slow.** Akshay measured about 131 ms per decision on an L4 GPU but 9.1 s on a 2-vCPU CPU-only microVM. "Runs locally" is true, but on a laptop GPU or a proper instance.
- **Thresholds don't travel.** An analyst quoted by InfoWorld points out that 0.8 from one vendor's model doesn't mean the same as 0.8 from another's. If you swap models, recalibrate.
- **A probability isn't a permission.** One Builder Center post puts it well: a confidence score should never replace IAM permissions or business rules. And as someone from H-E-B notes in the InfoWorld piece, a wrong decision can cost more downstream than the inference ever saved.
- **It's an experiment.** It's not a managed AWS service, and there are no named production users yet ([Techstrong](https://techstrong.ai/articles/aws-explores-decision-models-with-strands-decider-2b/)).

## How I'd actually use one

The pattern that makes sense to me is the one both write-ups landed on independently: **let the small model take the easy decisions, and escalate the rest.**

The docs even suggest a convention: at 0.9 or above, act; between 0.5 and 0.9, confirm first; below 0.5, send it to a person. Here's roughly how I'd wire that up. `decide` and `ask_llm` stand in for whatever client you use:

```python
ACT, CONFIRM = 0.9, 0.5

def route(ticket: str) -> str:
    # One cheap pass: which team, and how sure?
    result = decide(
        state=ticket,
        choice=("Which team should handle this?",
                ["billing", "technical", "sales", "account", "unknown"]),
    )

    if result.confidence >= ACT:
        return result.answer                  # most traffic should end here

    if result.confidence >= CONFIRM:
        return ask_llm(ticket, hint=result.answer)   # bigger model double-checks

    return "human_review"                     # genuinely unclear
```

The thresholds are the part you have to earn. Run a few hundred real examples through it, plot accuracy against confidence, and pick the thresholds from your own data, not from my code.

Two kinds of decision look like the best first candidates to me. One is the check an agent runs before every action, like "is this tool call risky enough to need a human to approve it?". It runs on every single step, so making it fast and cheap adds up quickly. The other is sorting: is this email urgent, is it a quote or a renewal, does it need a reply? Those are yes/no and choice questions with a known set of answers, which is exactly what a decider is built for.

## Takeaway

Decider models aren't going to replace LLMs, and they don't try to. What they do is make a part of agent engineering cheaper and more honest: a lot of what we've been using LLMs for is classification in disguise, and classification with a calibrated confidence score is a much better tool for that job.

If you're building agents, it's worth an afternoon. Install it, point it at a few hundred of your own real decisions, and see how much of your traffic it can take at a confidence you're comfortable with. That number will tell you more than any leaderboard.

---

**Sources**

- [Introducing Strands Decider (Strands blog)](https://strandsagents.com/blog/introducing-strands-decider/)
- [strands-labs/strands-decider on GitHub](https://github.com/strands-labs/strands-decider)
- [Strands Decider architecture docs](https://strandsagents.com/docs/labs/strands-decider/architecture/)
- [Strands Decider 2B model card (Hugging Face)](https://huggingface.co/StrandsAgents/strands-decider-2B-hobson-v19)
- [Running Strands Decider 2B on Amazon Bedrock AgentCore (AWS Builder Center)](https://builder.aws.com/content/3KJvK45IGyUNQwRd4dSOZQWKv8I/running-strands-decider-2b-on-amazon-bedrock-agentcore-microvms-vs-gpu-instances)
- [The witness that could only nod (AWS Builder Center)](https://builder.aws.com/content/3KPyILZ7MiHTr0iLmPCNwBIz9Qh/the-witness-that-could-only-nod-a-week-with-strands-decider-part-1)
- [As AI agents grow, vendors carve out decision-making as a separate model layer (InfoWorld)](https://www.infoworld.com/article/4233075/as-ai-agents-grow-vendors-carve-out-decision-making-as-a-separate-model-layer.html)
- [AWS explores decision models with Strands Decider 2B (Techstrong)](https://techstrong.ai/articles/aws-explores-decision-models-with-strands-decider-2b/)
