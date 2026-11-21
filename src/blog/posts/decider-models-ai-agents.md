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

*Short on time? Small "decider" models can take over the yes/no and pick-one-option decisions that AI agents make constantly. They answer in about a tenth of a second with a confidence score you can trust, and in early tests they handled around half the traffic of a support-ticket router for about a third less cost. The rest of this post explains how they work, what the numbers really say, and when you shouldn't use one.*

If you've ever built an agent loop, you've probably noticed something a little embarrassing about it. Most of the LLM calls aren't doing anything clever. They're answering questions like "is this tool call safe to run?" or "which of these three tools fits?", questions where you already know every possible answer before you ask. You're paying a very large model to write a paragraph so that you can fish one word out of it.

That quiet inefficiency is exactly what a new class of models is going after. AWS calls them **decision models**, and on October 1 its Strands Labs team open-sourced one called [Strands Decider 2B](https://strandsagents.com/blog/introducing-strands-decider/). It isn't alone, either. TypeSafe shipped Jev in September, Cloudflare has Clef running on Workers AI, and OpenAI has a Decisions API in beta (InfoWorld has [a good roundup](https://www.infoworld.com/article/4233075/as-ai-agents-grow-vendors-carve-out-decision-making-as-a-separate-model-layer.html)). Different companies, same idea: pull the small, boring, constant decisions out of the LLM and hand them to a model that was built for nothing else.

If you're new to this, here's an analogy that helped me. Asking a big LLM to make a simple decision is like setting someone an essay question when all you need is a multiple-choice answer. You get your answer eventually, but you also get three paragraphs you didn't need, you pay for every word, and occasionally the essay wanders off topic. A decider model is the multiple-choice version: it can only tick one of the boxes you give it, and it tells you how sure it is.

I spent some time with the docs, the model card and the first independent write-ups, and the more I read, the more it felt like a missing piece of how we build agents. Whether you're a student just getting into AI or an engineer running agents in production, there's something useful here.

## A model that only ever answers the question

The easiest way to understand a decider is to notice what it refuses to do. It doesn't write. You give it a piece of text, which the docs call the "state", along with a question and the answers you'll accept, and it gives you back probabilities. Nothing else comes out of it.

Strands Decider understands three shapes of question. A yes/no question (oddly named `noul`) returns the probability that the answer is yes. A choice question picks one of the options you list and tells you how likely each one was. A score question places the input on a scale you define, say from calm to frustrated to furious, and tells you where it landed and how sure it is.

Seeing it run makes this click faster than any description. This is the example from the [GitHub README](https://github.com/strands-labs/strands-decider):

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

What I like about that output is everything that's missing from it. There's no coaxing the model into valid JSON, no parsing, and no morning where the model decides to answer in a haiku. It can only ever return one of the options you gave it. If you'd rather call it from code, there's a small HTTP server (`strands-decider serve <model> --port 8000`) behind a `POST /v1/systemone` endpoint, though it's worth knowing that it binds to localhost with no authentication, so it isn't something to expose to the internet as it is.

## Why it can answer so quickly

The speed comes from a design choice that I think is genuinely clever.

A normal LLM answers by generating text one token (roughly a word or part of a word) at a time, and it has to run the whole network once for every token. Each of those runs is called a forward pass. Even when the answer is a single word like "billing", you've usually asked the model to explain its reasoning first, so you end up paying for a lot of tokens to get to that word.

Decider 2B never generates at all. Under the hood it's a [Qwen3.5-2B base model](https://huggingface.co/StrandsAgents/strands-decider-2B-hobson-v19) with a rank-16 LoRA adapter, which is a small set of extra weights trained on top of the original model and a cheap way to specialise it, plus a tiny "readout head" of about a million parameters sitting on top. Your request gets laid out like this:

```
<state>Help! My payouts have been failing for 3 days!</state>
<question type="choice">Which team should handle this?
<options>1. billing 2. sales 3. retail</options></question>
<answer>
```

The model reads that **once**. According to the [architecture docs](https://strandsagents.com/docs/labs/strands-decider/architecture/), the readout then takes the hidden state at the `<answer>` token (the model's internal summary of everything it has read up to that point) and compares it with the hidden state at the end of each option. The better an option matches, the higher its score, and a softmax turns those scores into probabilities that add up to 1. As the docs put it: "One forward pass, no generation, no decoding loop."

That one design decision quietly solves two problems I've run into with LLMs. Because the options are shuffled on every training example, their order barely matters; reversing the list at inference shifts the probabilities by only about 0.016, so the model doesn't favour whatever you happened to list first. And because the state is encoded once and every question reads from it, asking several things about the same email ("which team?", "is this urgent?", "how annoyed are they?") costs barely more than asking one.

The latency numbers back all of this up. The launch checkpoint answered in a median of 115 ms on an RTX 3090, with a p95 of 299 ms (meaning 95% of requests finished faster than that), and 153 ms on an M3 Pro, according to the [README](https://github.com/strands-labs/strands-decider). On plain CPUs the story is very different, which I'll come back to.

## The number that makes it useful

Speed is nice, but the part that really got my attention, probably because I'm doing an MSc in statistics, is the confidence number.

Frontier LLM APIs don't give you a trustworthy answer to "how sure are you?". You can ask the model to rate its own confidence, but that rating is just more generated text, and it tends to sound equally sure whether it's right or wrong. Decider models are trained so that their probabilities are **calibrated**, which means that when one says 0.8, it should turn out to be right about 80% of the time.

For choice questions, the confidence takes the top probability and adjusts it for how many options there were:

```
confidence = (N · p_max − 1) / (N − 1)
```

With three options, a top probability of one third, which is no better than guessing, gives a confidence of 0, while a top probability of 1 gives a confidence of 1. That's why "billing at 0.773" in the earlier example comes out as a confidence of 0.659.

The README claims that answers with a confidence of 0.9 or more are right about 95% of the time on short classification tasks the model hasn't seen. On the public JevBench set of 231 tasks, the current reference model gets 180 right (77.9%), up from 167 (72.3%) for the launch version. It also scores 0.280 on the Brier score, which measures the average squared gap between the predicted probability and what actually happened (0 is perfect), and 0.072 on expected calibration error, which is roughly how far its stated confidence drifts from its real accuracy on average.

Those numbers deserve a little caution, and to their credit, the authors say so themselves. 231 tasks is a small benchmark, and they recommend treating any difference of fewer than about 10 tasks between two runs as unresolved. Calibration is also fitted with a single temperature per question type on short classification tasks, which is why the [model card](https://huggingface.co/StrandsAgents/strands-decider-2B-hobson-v19) bluntly tells you to measure on your own traffic before trusting any threshold.

## What happened when people actually tried it

Launch posts always say a model is competitive, so the numbers I found more convincing came from two people who tested Decider themselves and wrote it up on AWS Builder Center.

The first, [Akshay B](https://builder.aws.com/content/3KJvK45IGyUNQwRd4dSOZQWKv8I/running-strands-decider-2b-on-amazon-bedrock-agentcore-microvms-vs-gpu-instances), built 100 synthetic support messages for a made-up invoicing app and asked each model to route them to billing, technical, sales, account or unknown. On its own, with no examples to learn from (what people call zero-shot), Decider got 72% right, while Claude Haiku 4.5 got 93%. On raw accuracy, the 2B model loses clearly, which is about what you'd expect.

Then he did the interesting thing and used the confidence number. Decider answered whenever it was confident enough and passed everything else to Haiku:

| Confidence threshold | Share Decider answers alone | Overall accuracy |
|---|---|---|
| none | 100% | 72% |
| 0.5 | 61% | 87% |
| 0.6 | 45% | 90% |
| 0.7 | 32% | 92% |
| 0.8 | 19% | 93% |

At a threshold of 0.6, Decider handled almost half the traffic on its own, and the system as a whole reached 90% accuracy, just three points below Haiku alone, at about 36% lower cost ($0.79 versus $1.23 per 1,000 decisions). He's careful to point out that this only pays off at steady volume, and that a single person labelled the data, so the results are a useful signal rather than a benchmark.

The second write-up, by [Felina Christy A](https://builder.aws.com/content/3KPyILZ7MiHTr0iLmPCNwBIz9Qh/the-witness-that-could-only-nod-a-week-with-strands-decider-part-1), used Decider as a "witness" that checks an agent's decisions instead of asking an LLM to do it. Choosing between 100 candidate tools, Decider picked the right one 88.9% of the time, compared with 88.4% for Amazon Nova Lite. In a full run of 180 agent tasks, the witness version completed all 180 while the all-LLM version completed 166, and it did so at $0.006 per 100 tasks instead of $0.034, with a median time of 4.7 seconds instead of 7.1.

The detail from her write-up that stuck with me most was how much the wording of the question mattered. A strict phrasing of the same check scored 81.8% and rejected more than a third of perfectly good tool calls, while a blunter phrasing scored 94.0%. A decider frees you from engineering the output format, but you still have to engineer the question.

## Where it falls short

All of this would be easy to oversell, so it's worth being clear about what a decider can't do, and the authors are refreshingly honest about it.

It doesn't reason. Answering in a single parallel pass makes these models "significantly worse at solving complex problems than reasoning models", as the [Strands blog](https://strandsagents.com/blog/introducing-strands-decider/) admits, so they're meant for routine decisions rather than hard ones. Long, multi-step documents are a known weak spot too, and according to the [model card](https://huggingface.co/StrandsAgents/strands-decider-2B-hobson-v19) the model "reads questions less than documents", which means rewording a question doesn't always change its answer.

It also needs a GPU to feel fast. Akshay measured about 131 ms per decision on an L4 GPU, but 9.1 seconds on a CPU-only microVM, a small virtual machine with just two virtual cores. It does run locally, but in practice you'll want a GPU, whether that's in a laptop or a proper instance.

Then there are the subtler issues. An analyst quoted by InfoWorld points out that a 0.8 from one vendor's model doesn't mean the same thing as a 0.8 from another's, so your thresholds won't carry over if you switch models. A probability also isn't a permission; as one Builder Center post puts it, a confidence score should never replace IAM permissions (the access controls that decide who can do what) or business rules. And as H-E-B's Aditya Ranjan points out in the InfoWorld piece, a wrong decision can end up costing more downstream than the inference ever saved. Finally, it's still an experiment rather than a managed AWS service, and there are no named production users yet, as [Techstrong](https://techstrong.ai/articles/aws-explores-decision-models-with-strands-decider-2b/) notes.

## How I'd use one

Put all of that together and a clear pattern emerges, one that both write-ups arrived at independently: **let the small model take the easy decisions, and escalate the rest.**

The docs even suggest a simple convention. At a confidence of 0.9 or above, act on the answer. Between 0.5 and 0.9, confirm it first. Below 0.5, send it to a person. In code, that might look something like this, where `decide` and `ask_llm` stand in for whatever clients you're using:

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

The thresholds are the part you have to earn. Run a few hundred real examples through it, plot accuracy against confidence, and choose the cut-offs from your own data rather than from mine.

If I were starting today, I'd try two kinds of decision first. The first is the check an agent runs before every action, something like "is this tool call risky enough to need a human to approve it?" Because it runs on every single step, making it faster and cheaper adds up quickly. The second is sorting, the kind of question every inbox tool asks constantly: is this email urgent, is it a quote or a renewal, does it need a reply? Those are yes/no and choice questions with a known set of answers, which is exactly what a decider is built for.

## Why it's worth your time

If you're a student, this makes a great weekend project, and one that stands out on a CV. The model is small enough to run on a laptop with a decent GPU or an Apple-silicon Mac. Pick a classification task you care about, collect a couple of hundred labelled examples, and run them through it. Then draw a reliability diagram, which plots the model's stated confidence against how often it was actually right. If the points sit close to the diagonal, the model is well calibrated. Calibration rarely comes up in coursework projects, so being able to show it working is exactly the kind of thing interviewers love to dig into.

If you're working in industry, the appeal is more practical. Every routine decision you move off a frontier model is cheaper, faster and more predictable, and the confidence score gives you something most LLM pipelines don't have: a principled way to decide when to trust the model and when to escalate. Start with one high-volume decision, measure it against what you run today, and let your own numbers decide whether it's worth expanding.

## The bigger picture

Decider models aren't going to replace LLMs, and they don't try to. What they do is make one part of building agents cheaper and more honest. A surprising amount of what we've been asking LLMs to do turns out to be classification in disguise, and classification that comes with a calibrated confidence score is simply a better tool for that job.

If you're building agents, it's worth an afternoon of your time. Install it, point it at a few hundred of your own real decisions, and see how much of your traffic it can handle at a confidence you're comfortable with. That one number will tell you more than any leaderboard.

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
