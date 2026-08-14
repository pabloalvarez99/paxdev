# AI Engineering Portfolio Series

Production-shaped AI systems: free-path demos, real architecture, measurable behavior,
honest scope.

Verified against public GitHub evidence on 2026-08-14.

| # | Repository | Hiring signal | Status | Verified evidence |
|---|---|---|---|---|
| 1 | [production-rag](https://github.com/pabloalvarez99/production-rag) | Hybrid RAG with RRF, optional rerank, grounded citations or refusal, offline evals, and UI | **LIVE v0.1.0** | [v0.1.0 release](https://github.com/pabloalvarez99/production-rag/releases/tag/v0.1.0); `main` `129a46d` with green [CI](https://github.com/pabloalvarez99/production-rag/actions/workflows/ci.yml); [SHIP](https://github.com/pabloalvarez99/production-rag/blob/main/docs/SHIP.md); [case study](https://github.com/pabloalvarez99/production-rag/blob/main/docs/CASESTUDY.md) |
| 2 | [agentic-rag-research](https://github.com/pabloalvarez99/agentic-rag-research) | Research agent with retrieval tools, budgets, stop reasons, notes, and full traces | **LIVE v0.1.0** | `main` `e83f03c` with green CI; [v0.1.0 release](https://github.com/pabloalvarez99/agentic-rag-research/releases/tag/v0.1.0); [SHIP](https://github.com/pabloalvarez99/agentic-rag-research/blob/main/docs/SHIP.md); [17-case eval contract](https://github.com/pabloalvarez99/agentic-rag-research/blob/main/data/eval/README.md); [CI](https://github.com/pabloalvarez99/agentic-rag-research/actions/workflows/ci.yml) |
| 3 | [multi-agent-orchestration](https://github.com/pabloalvarez99/multi-agent-orchestration) | Explicit roles, handoff budgets, degradation modes, and auditable traces | **LIVE v0.1.0** | [v0.1.0 release](https://github.com/pabloalvarez99/multi-agent-orchestration/releases/tag/v0.1.0) at `e2687ca`, with `main` now `7e94265`; [SHIP](https://github.com/pabloalvarez99/multi-agent-orchestration/blob/main/docs/SHIP.md); [12-task eval contract](https://github.com/pabloalvarez99/multi-agent-orchestration/blob/main/data/eval/README.md); green [CI](https://github.com/pabloalvarez99/multi-agent-orchestration/actions/workflows/ci.yml) |
| 4 | [repomind](https://github.com/pabloalvarez99/repomind) | Repository Q&A with AST-aware chunking and grounded `path:line` citations | **LIVE v0.1.0** | [v0.1.0 release](https://github.com/pabloalvarez99/repomind/releases/tag/v0.1.0) at `327a949`, with `main` now `eeab5ef`; [SHIP](https://github.com/pabloalvarez99/repomind/blob/main/docs/SHIP.md); [14-question eval contract](https://github.com/pabloalvarez99/repomind/blob/main/data/eval/README.md); green [CI](https://github.com/pabloalvarez99/repomind/actions/workflows/ci.yml) |
| 5 | [ai-platform](https://github.com/pabloalvarez99/ai-platform) | Authenticated, rate-limited gateway with aggregate health and Compose delivery | **LIVE v0.1.0** | [v0.1.0 release](https://github.com/pabloalvarez99/ai-platform/releases/tag/v0.1.0) at `7978a00`, with `main` now `169e4dc`; [SHIP](https://github.com/pabloalvarez99/ai-platform/blob/main/docs/SHIP.md); green [CI](https://github.com/pabloalvarez99/ai-platform/actions/workflows/ci.yml) |

All published evaluation counts are deterministic fake-provider or fixture plumbing checks,
not claims of answer quality or model uplift. Hosted providers remain optional.

The AI Platform free path is the gateway only. Upstream URLs are empty in CI and in the documented
demo, so P1–P4 answer `unconfigured`; the gateway does not run the other four systems for a visitor.
Its rate limiter is an in-process fixed window on a single instance, not a distributed limiter, and
`dev-local` is a public fixture key rather than a credential.
