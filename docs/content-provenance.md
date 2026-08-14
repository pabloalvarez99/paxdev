# Content provenance

Verified on 2026-08-14 (A2 v1.0 LOCK). The portfolio is editorially curated rather than populated from an
unauthenticated runtime GitHub request, so a third-party outage or rate limit cannot blank the
site. Update this record whenever a public status changes. Authoritative pin table: `content/pins.json`. Season: `docs/SEASON.md`.

## AI Engineering ladder

| Surface | Public evidence |
|---|---|
| Production RAG | Release `v1.0.0`; `main` `3b54d85` with green CI; allowlisted filter control; **PR #3 merged** — stream, filter-aware cache, `/evals` on main; clone-only |
| Agentic Research | Release `v1.0.0`; `main` `1b4915f` with green CI; hosted demo at pax-agentic-rag; health version 1.0.0; fixture retriever on public host |
| Multi-Agent Orchestration | Release `v1.0.0`; `main` `88a24f2` with green CI; hosted at `pax-orchestration.vercel.app` (never pax-mao / pax-multi-agent) |
| RepoMind | Release `v1.0.0`; `main` `91fa395` with green CI; hosted; content-addressed index; mini `create_app` hit + production_rag RRF dogfood |
| AI Platform | Release `v1.0.0`; `main` `801fc0b` with green CI; hosted gateway; status version 1.0.0; four unconfigured upstreams on free path |

Four systems are hosted (P2–P5); P1 stays clone-only. Never cite `production-rag.vercel.app` (Ipsura).

| Hosted surface | Verification | Boundary |
|---|---|---|
| https://pax-agentic-rag.vercel.app | GET /health 200, version 1.0.0 | Fixture retriever only |
| https://pax-orchestration.vercel.app | GET /health 200 `{"status":"ok"}` | Deterministic fake specialists |
| https://pax-repomind.vercel.app | GET /health 200, version 1.0.0; mini create_app + production_rag RRF dogfood 200 | Committed fixtures only |
| https://pax-ai-gateway.vercel.app | GET /health 200; /v1/platform/status 401 anonymous; 200 with `X-API-Key: dev-local`, version 1.0.0, four unconfigured | Gateway only; does not run P1–P4 |

## Vendored captures

| Site file | Source of record |
|---|---|
| `production-rag-grounded.png` | `production-rag/docs/assets/ui-grounded.png` at `3b54d85` |
| `production-rag-filtered.png` | `production-rag/docs/assets/ui-filtered.png` at `3b54d85` |
| `agentic-research-run.png` | `agentic-rag-research/docs/assets/ui-done.png` at `1b4915f` |
| `agentic-research-trace.png` | `agentic-rag-research/docs/assets/ui-trace.png` at `1b4915f` |
| `multi-agent-trace.png` | `multi-agent-orchestration/docs/assets/ui-trace.png` at `88a24f2` |
| `multi-agent-budget.png` | `multi-agent-orchestration/docs/assets/ui-budget.png` at `88a24f2` |
| `repomind-dogfood-hit.png` | `repomind/docs/assets/ui-dogfood-hit.png` at `91fa395` |
| `repomind-mini-refuse.png` | `repomind/docs/assets/ui-mini-refuse.png` at `91fa395` |
| `ai-platform-status.png` | `ai-platform/docs/assets/ui-status-unconfigured.png` at `801fc0b` |
| `ai-platform-status-partial.png` | `ai-platform/docs/assets/ui-status-partial.png` at `801fc0b` |

`content/verified-urls.json` is the machine-checkable half: every hosted URL the site publishes must appear there with the observed status. Studio scripts must include the live hostname from that fixture. Interview kit hostnames fail the unit test if they are not in the fixture. Pin drift fails `npm run check:pins`. Day-of: `npm run verify:urls` then `npm run check:pins -- --live`.
