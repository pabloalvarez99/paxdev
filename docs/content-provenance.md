# Content provenance

Verified on 2026-08-14 (A2 v0.3 pin refresh). The portfolio is editorially curated rather than populated from an
unauthenticated runtime GitHub request, so a third-party outage or rate limit cannot blank the
site. Update this record whenever a public status changes.

## AI Engineering ladder

| Surface | Public evidence |
|---|---|
| Production RAG | Release `v0.1.0` at `678c554`; `main` `1cd8e4b` with green CI; allowlisted metadata filter control on the query UI; PR #3 (`d43f812` stream + filter-aware cache + /evals) is OPEN and **NOT SHIPPED** on main — clone-only |
| Agentic Research | Release `v0.2.0` at `d62917d`; `main` `d62917d` with green CI; hosted demo; notes store, run export, SSE stream, control scorecard; captures unchanged since `8bde9c9` |
| Multi-Agent Orchestration | Release `v0.2.0` at `8155274`; `main` `8155274` with green CI; hosted at `pax-orchestration.vercel.app` (never pax-mao / pax-multi-agent) |
| RepoMind | Release `v0.2.0` at `5d4eefe`; `main` `5d4eefe` with green CI; hosted; content-addressed index; `production_rag` catalog accepts create_app; captures unchanged since `bffc329` |
| AI Platform | Release `v0.2.0` at `f0b5abc`; `main` `e9bec1b` with green CI; hosted gateway; journal + OpenAPI + limiter protocol + OTel seam; captures refreshed at `e9bec1b` |

Four systems are hosted (P2–P5); P1 stays clone-only. Never cite `production-rag.vercel.app` (Ipsura).

| Hosted surface | Verification | Boundary |
|---|---|---|
| https://pax-agentic-rag.vercel.app | GET /health 200, version 0.2.0 | Fixture retriever only |
| https://pax-orchestration.vercel.app | GET /health 200 `{"status":"ok"}` | Deterministic fake specialists |
| https://pax-repomind.vercel.app | GET /health 200, version 0.2.0; create_app on production_rag 200 | Committed fixtures only |
| https://pax-ai-gateway.vercel.app | GET /health 200; /v1/platform/status 401 anonymous; 200 with `X-API-Key: dev-local` and four unconfigured | Gateway only; does not run P1–P4 |

## Vendored captures

| Site file | Source of record |
|---|---|
| `production-rag-grounded.png` | `production-rag/docs/assets/ui-grounded.png` at `1cd8e4b` |
| `production-rag-filtered.png` | `production-rag/docs/assets/ui-filtered.png` at `1cd8e4b` |
| `agentic-research-run.png` | `agentic-rag-research/docs/assets/ui-done.png` at `d62917d` |
| `agentic-research-trace.png` | `agentic-rag-research/docs/assets/ui-trace.png` at `d62917d` |
| `multi-agent-trace.png` | `multi-agent-orchestration/docs/assets/ui-trace.png` at `8155274` |
| `multi-agent-budget.png` | `multi-agent-orchestration/docs/assets/ui-budget.png` at `8155274` |
| `repomind-dogfood-hit.png` | `repomind/docs/assets/ui-dogfood-hit.png` at `5d4eefe` |
| `repomind-mini-refuse.png` | `repomind/docs/assets/ui-mini-refuse.png` at `5d4eefe` |
| `ai-platform-status.png` | `ai-platform/docs/assets/ui-status-unconfigured.png` at `e9bec1b` |
| `ai-platform-status-partial.png` | `ai-platform/docs/assets/ui-status-partial.png` at `e9bec1b` |

`content/verified-urls.json` is the machine-checkable half: every hosted URL the site publishes must appear there with the observed status. Studio scripts must include the live hostname from that fixture. Interview kit hostnames fail the unit test if they are not in the fixture. Day-of: `npm run verify:urls`.
