# AI Engineering Portfolio Series

Production-shaped AI systems: free-path demos, real architecture, measurable behavior, honest scope.

Verified against public GitHub evidence on 2026-08-14 (A2 v1-season Week 1). Machine pin table: [`content/pins.json`](../content/pins.json). Season plan: [`docs/SEASON.md`](SEASON.md).

| # | Repository | Hiring signal | Status | Verified evidence |
|---|---|---|---|---|
| 1 | [production-rag](https://github.com/pabloalvarez99/production-rag) | Hybrid RAG with RRF, optional rerank, grounded citations or refusal, stream, filter-aware cache, offline evals, UI | **LIVE v0.3.0 · CLONE** | [v0.3.0](https://github.com/pabloalvarez99/production-rag/releases/tag/v0.3.0); `main` `bf6e36d`; PR #3 **merged** (stream/filter-cache/evals) |
| 2 | [agentic-rag-research](https://github.com/pabloalvarez99/agentic-rag-research) | Research agent with retrieval tools, budgets, stop reasons, notes, SSE, full traces | **LIVE v0.3.0 · hosted** | `main` `dc80188` / [v0.3.0](https://github.com/pabloalvarez99/agentic-rag-research/releases/tag/v0.3.0); [hosted](https://pax-agentic-rag.vercel.app) health version **0.3.0** |
| 3 | [multi-agent-orchestration](https://github.com/pabloalvarez99/multi-agent-orchestration) | Explicit roles, handoff budgets, degradation modes, auditable traces | **LIVE v0.3.0 · hosted** | `main` `8feb31a` / [v0.3.0](https://github.com/pabloalvarez99/multi-agent-orchestration/releases/tag/v0.3.0); [hosted](https://pax-orchestration.vercel.app) |
| 4 | [repomind](https://github.com/pabloalvarez99/repomind) | Repository Q&A with AST-aware chunking and path:line citations | **LIVE v0.3.0 · hosted** | `main` `4de0ac6` / [v0.3.0](https://github.com/pabloalvarez99/repomind/releases/tag/v0.3.0); [hosted](https://pax-repomind.vercel.app) health version **0.3.0** |
| 5 | [ai-platform](https://github.com/pabloalvarez99/ai-platform) | Authenticated, rate-limited gateway with aggregate health | **LIVE v0.3.0 · hosted** | `main` `98970d4` / [v0.3.0](https://github.com/pabloalvarez99/ai-platform/releases/tag/v0.3.0); [hosted](https://pax-ai-gateway.vercel.app) status version **0.3.0** |

All published evaluation counts are deterministic fake-provider or fixture plumbing checks, not claims of answer quality or model uplift.

Four of five are hosted: P2–P5. P1 remains clone-and-run. Never cite production-rag.vercel.app (Ipsura). P3 host is pax-orchestration.vercel.app only.
