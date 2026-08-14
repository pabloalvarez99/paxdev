# AI Engineering Portfolio Series

Production-shaped AI systems: free-path demos, real architecture, measurable behavior,
honest scope.

Verified against public GitHub evidence on 2026-08-14.

| # | Repository | Hiring signal | Status | Verified evidence |
|---|---|---|---|---|
| 1 | [production-rag](https://github.com/pabloalvarez99/production-rag) | Hybrid RAG with RRF, optional rerank, grounded citations or refusal, offline evals, and UI | **LIVE** | `main` `d882c9a`; [v0.1.0 release](https://github.com/pabloalvarez99/production-rag/releases/tag/v0.1.0); [SHIP](https://github.com/pabloalvarez99/production-rag/blob/main/docs/SHIP.md); [CI](https://github.com/pabloalvarez99/production-rag/actions/workflows/ci.yml) |
| 2 | [agentic-rag-research](https://github.com/pabloalvarez99/agentic-rag-research) | Research agent with retrieval tools, budgets, stop reasons, notes, and full traces | **LIVE** | `main` `56b77cf`; [v0.1.0 release](https://github.com/pabloalvarez99/agentic-rag-research/releases/tag/v0.1.0); [SHIP](https://github.com/pabloalvarez99/agentic-rag-research/blob/main/docs/SHIP.md); [17-case eval contract](https://github.com/pabloalvarez99/agentic-rag-research/blob/main/data/eval/README.md); [CI](https://github.com/pabloalvarez99/agentic-rag-research/actions/workflows/ci.yml) |
| 3 | [multi-agent-orchestration](https://github.com/pabloalvarez99/multi-agent-orchestration) | Explicit roles, handoff budgets, degradation modes, and auditable traces | **LIVE** | M4 at `main` `8b9c96b`; [SHIP](https://github.com/pabloalvarez99/multi-agent-orchestration/blob/main/docs/SHIP.md); [12-task eval contract](https://github.com/pabloalvarez99/multi-agent-orchestration/blob/main/data/eval/README.md); [CI](https://github.com/pabloalvarez99/multi-agent-orchestration/actions/workflows/ci.yml); no release |
| 4 | [repomind](https://github.com/pabloalvarez99/repomind) | Repository Q&A with AST-aware chunking and grounded `path:line` citations | **LIVE** | M5 core `46e21e3`; [README](https://github.com/pabloalvarez99/repomind#readme); [14-question eval contract](https://github.com/pabloalvarez99/repomind/blob/main/data/eval/README.md); [CI](https://github.com/pabloalvarez99/repomind/actions/workflows/ci.yml); no release |
| 5 | `ai-platform` | Authenticated, rate-limited gateway with aggregate health and Compose delivery | **PLANNED** | No public repository, documented `/health`, green CI, or release |

All published evaluation counts are deterministic fake-provider or fixture plumbing checks,
not claims of answer quality or model uplift. Hosted providers remain optional.
