---
title: "Agent Harness, Loop Engineering & Graph Engineering: How Modern AI Systems Actually Work"
date: 2026-08-08
author: Sai Sridhar Tarra
category: AI Engineering
tags: [Agents, LLMs, Graph Engineering, Loop Engineering, AI Architecture, Production AI]
featured: true
excerpt: Everyone is building AI agents. Few are building them to last. A deep dive into harness design, loop engineering patterns, and graph-based reasoning — the three foundations of production-grade agentic systems.
coverImage: /blog/agent-harness-cover.png
---

# Agent Harness, Loop Engineering & Graph Engineering: How Modern AI Systems Actually Work

Everyone is building AI agents in 2026. But most of them break the moment they hit production — hallucinating mid-task, looping infinitely, forgetting context three steps in.

After two years of building ML systems at Accenture and now deep in open source AI tooling, I've noticed the same pattern: developers nail the LLM call but botch the scaffolding around it. The **harness**, the **loop**, and the **graph** — that's where production agents live or die.

This post breaks down all three.

---

## What Is an Agent Harness?

An **agent harness** is the runtime scaffold that wraps your LLM. It handles everything the model can't do itself:

- **Tool execution** — calling APIs, running code, reading files
- **State management** — tracking what the agent has done and what it still needs to do
- **Error recovery** — retrying failed tool calls, handling timeouts, graceful fallback
- **Observability** — logging, tracing, token counting, latency measurement
- **Safety rails** — output validation, rate limiting, cost caps

Think of the LLM as the **brain** and the harness as the **body + nervous system**. Without the harness, the brain has no way to act on the world.

### The Minimal Harness

Here's the skeleton of a minimal agent harness in Python:

```python
class AgentHarness:
    def __init__(self, model, tools, max_steps=20):
        self.model = model
        self.tools = {t.name: t for t in tools}
        self.max_steps = max_steps
        self.history = []

    def run(self, task: str) -> str:
        self.history = [{"role": "user", "content": task}]

        for step in range(self.max_steps):
            response = self.model.complete(
                messages=self.history,
                tools=list(self.tools.values()),
            )

            if response.stop_reason == "end_turn":
                return response.text

            # Execute tool calls
            tool_results = []
            for call in response.tool_calls:
                result = self._execute_tool(call)
                tool_results.append(result)

            # Append to history and continue
            self.history.append({"role": "assistant", "content": response.content})
            self.history.append({"role": "tool", "content": tool_results})

        raise RuntimeError(f"Agent exceeded {self.max_steps} steps without completing")

    def _execute_tool(self, call):
        tool = self.tools.get(call.name)
        if not tool:
            return {"error": f"Unknown tool: {call.name}"}
        try:
            return tool.execute(**call.arguments)
        except Exception as e:
            return {"error": str(e), "tool": call.name}
```

This is tiny, but notice what it already handles: loop termination, tool dispatch, error capture, and history accumulation.

Production harnesses add:
- **Retry logic** with exponential backoff
- **Token budget enforcement** — kill the loop before context overflows
- **Checkpointing** — save state so long-running agents can resume after crashes
- **Parallel tool execution** — run independent tool calls concurrently instead of sequentially

---

## Loop Engineering

The **loop** is the core execution pattern of an agentic system. It's the `while agent_not_done` that drives everything. Getting loop design right is what separates agents that complete tasks from agents that spin forever.

### The Four Loop Patterns

**1. ReAct Loop** (Reason + Act)

The classic. Each iteration: think about what to do → do it → observe the result → repeat.

```
Thought: I need to check the current price of ETH
Action: get_price(symbol="ETH")
Observation: {"price": 3241.50, "change_24h": "+2.3%"}
Thought: Price is up. I should now check the RSI indicator.
Action: get_rsi(symbol="ETH", period=14)
...
```

Works well for tasks with clear step-by-step decomposition. Breaks down on tasks that require planning ahead or backtracking.

**2. Plan-and-Execute Loop**

Separate planning from execution. The planner generates a full task graph upfront; the executor works through it step by step.

```python
plan = planner.create_plan(task)       # ["step1", "step2", "step3"]
results = []

for step in plan.steps:
    result = executor.run(step, context=results)
    results.append(result)
    
    if not result.success:
        # Replan from current state
        plan = planner.replan(task, completed=results, failed=step)
```

Better for long-horizon tasks. The replanning hook is critical — plans break, you need to recover.

**3. Hierarchical Loop** (Manager + Workers)

A manager agent breaks a task into subtasks and spawns worker agents to execute them in parallel. Results are aggregated back to the manager.

```python
class ManagerAgent:
    def run(self, task):
        subtasks = self.decompose(task)
        
        with ThreadPoolExecutor() as pool:
            futures = {pool.submit(WorkerAgent().run, st): st for st in subtasks}
            results = {st: f.result() for f, st in futures.items()}
        
        return self.synthesize(results)
```

This is how Claude Code works under the hood. The manager handles strategy; workers handle execution. Massive speedups on parallelizable tasks, but coordination overhead is real.

**4. Self-Reflective Loop**

After each action, the agent evaluates its own output before proceeding. Adds a critic pass.

```
Act → Critique → Revise → Act → Critique → Revise → ...
```

Slower but produces higher-quality output. Great for writing, code generation, reasoning tasks where correctness matters more than speed.

### Loop Termination: The Hardest Problem

Every loop needs a stopping condition. The naive version is `if response.stop_reason == "end_turn"`, but this breaks in subtle ways:

- The model says it's done but it isn't (false termination)
- The task is actually impossible but the agent keeps trying (infinite loop)
- Context fills up before the task is complete (silent truncation)

Better termination strategy:

```python
def should_terminate(response, state) -> bool:
    # Model explicitly signals completion
    if response.stop_reason == "end_turn" and not response.tool_calls:
        return True
    
    # Hard step cap
    if state.steps >= state.max_steps:
        log.warning("Step cap reached — forcing termination")
        return True
    
    # Token budget
    if state.total_tokens >= state.token_budget * 0.9:
        log.warning("Token budget nearly exhausted")
        return True
    
    # Detect looping: same tool called with same args 3x
    if state.detect_loop(window=3):
        raise AgentLoopError("Detected repetitive tool calls")
    
    return False
```

Loop detection is underrated. An agent that keeps calling `search("python fastapi tutorial")` three times in a row is stuck — catch it early.

---

## Graph Engineering

This is where things get interesting. Modern AI systems are increasingly **graph-shaped** — knowledge graphs, tool dependency graphs, reasoning graphs, agent communication graphs.

### Knowledge Graphs for Agents

A knowledge graph gives your agent structured, queryable memory that persists across turns and sessions. Instead of dumping everything into the context window, you store entities and relationships in a graph and retrieve only what's relevant.

```python
from neo4j import GraphDatabase

class KnowledgeGraph:
    def __init__(self, uri, auth):
        self.driver = GraphDatabase.driver(uri, auth=auth)
    
    def add_fact(self, subject, predicate, obj):
        with self.driver.session() as s:
            s.run("""
                MERGE (a:Entity {name: $subject})
                MERGE (b:Entity {name: $obj})
                MERGE (a)-[r:RELATION {type: $predicate}]->(b)
            """, subject=subject, predicate=predicate, obj=obj)
    
    def query(self, entity, depth=2):
        with self.driver.session() as s:
            return s.run("""
                MATCH (n:Entity {name: $entity})-[*1..$depth]-(related)
                RETURN n, related
            """, entity=entity, depth=depth).data()
```

At each agent step, query the graph for context relevant to the current task instead of appending everything to the prompt. Keeps context windows clean, makes agents faster, and lets knowledge persist across sessions.

### Tool Dependency Graphs

Not all tools can run in any order. Some tools depend on the output of others. Encoding this as a directed acyclic graph (DAG) lets you:

- Run independent tools in parallel
- Validate that the agent's plan is executable before starting
- Catch impossible task sequences early

```python
import networkx as nx

class ToolDAG:
    def __init__(self):
        self.graph = nx.DiGraph()
    
    def register(self, tool, depends_on=None):
        self.graph.add_node(tool.name, tool=tool)
        for dep in (depends_on or []):
            self.graph.add_edge(dep, tool.name)
    
    def execution_order(self):
        return list(nx.topological_sort(self.graph))
    
    def parallel_batches(self):
        # Returns groups of tools that can run concurrently
        return [
            [self.graph.nodes[n]['tool'] for n in batch]
            for batch in nx.topological_generations(self.graph)
        ]
```

Call `parallel_batches()` and you get a list of execution waves — run each wave concurrently and proceed to the next only when all complete. This alone can cut multi-tool agent latency by 60%+.

### GraphRAG: Retrieval Over Graphs

Standard RAG chunks documents and retrieves by vector similarity. **GraphRAG** stores documents as a knowledge graph and traverses relationships during retrieval — surfacing connected information that pure vector search would miss.

```python
class GraphRAG:
    def __init__(self, graph, embedder, vector_store):
        self.graph = graph
        self.embedder = embedder
        self.vs = vector_store
    
    def retrieve(self, query, hops=2):
        # Step 1: vector search for seed nodes
        query_vec = self.embedder.embed(query)
        seeds = self.vs.search(query_vec, top_k=5)
        
        # Step 2: graph traversal from seeds
        context_nodes = set(seeds)
        for seed in seeds:
            neighbors = self.graph.neighbors(seed, depth=hops)
            context_nodes.update(neighbors)
        
        # Step 3: re-rank by relevance
        return self.rerank(query_vec, list(context_nodes))
```

The traversal step is what makes GraphRAG powerful. A vector search for "FastAPI authentication" might return the auth middleware doc. GraphRAG also follows the edge to the rate limiter, the JWT config, and the middleware test file — because they're connected in the graph. The agent gets the full picture, not just the closest chunk.

---

## Putting It All Together

Here's the architecture I'd use for a production AI agent today:

```
User Request
     │
     ▼
┌─────────────┐
│   Harness   │  ← manages loop, tools, state, safety
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────────────┐
│  Plan DAG   │─────▶│  Parallel Exec   │
└─────────────┘      └────────┬─────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
         Tool A           Tool B           Tool C
              │               │               │
              └───────────────┴───────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Knowledge Graph │  ← persistent memory
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  GraphRAG Index  │  ← relevant context
                    └──────────────────┘
                              │
                              ▼
                         LLM Call
                              │
                              ▼
                    Self-Reflective Loop
                    (critique + revise)
                              │
                              ▼
                         Response
```

Key properties of this architecture:
- **Tools run in parallel** where the DAG allows
- **Knowledge persists** across sessions via the graph
- **Context stays lean** — GraphRAG fetches only relevant information
- **Quality is enforced** by the self-reflective inner loop
- **The harness owns termination** — the model never gets to loop forever

---

## What I'd Build Differently Today

After building ML systems in enterprise for 2+ years and now working in open source:

**On harnesses:** Most production harness bugs come from treating tool errors as fatal. Build recovery into every tool call. A failed web search shouldn't crash your agent — it should retry, degrade gracefully, or ask the user.

**On loops:** The step cap is the most important parameter you'll set and the one most people set wrong. Too low and complex tasks time out. Too high and stuck agents rack up costs. Start at 20, measure where your tasks actually complete, adjust.

**On graphs:** Don't over-engineer this early. Start with a simple in-memory dict for knowledge storage. Only move to Neo4j or Weaviate when you have actual graph traversal queries. Premature graph infrastructure is a great way to spend three weeks on plumbing that a Python dict could have handled.

The fundamentals aren't glamorous but they're what makes the difference between a demo and a deployment.

---

*Building something in this space? I'm currently open source and would love to collaborate — [reach out](mailto:tarrasridhar1154@gmail.com) or find me on [GitHub](https://github.com/sridhar-3009).*
