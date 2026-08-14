# Content provenance

Verified on 2026-08-14. The portfolio is editorially curated rather than populated from an
unauthenticated runtime GitHub request, so a third-party outage or rate limit cannot blank the
site. Update this record whenever a public status changes.

## AI Engineering ladder

| Surface | Public evidence |
|---|---|
| Production RAG | Release `v0.1.0` at `678c554`; `main` `62cc15f` with green CI; metadata filters merged with ADR 0011; `docs/DEMO-DAY.md`, demo GIF, and social preview committed |
| Agentic Research | Release `v0.1.0` at `18c1ff9`; `main` `57ce423` with green CI; API/CLI/UI, optional P1 HTTP, notes tool, 17-case eval contract, three committed UI captures |
| Multi-Agent Orchestration | Release `v0.1.0` at `e2687ca`; `main` `78b3910` with green CI; done, budget, and trace captures committed |
| RepoMind | Release `v0.1.0` at `327a949`; `main` `1db33ab` with green CI; mini-hit, mini-refuse, and dogfood-hit captures committed |
| AI Platform | Release `v0.1.0` at `7978a00`; last all-green `main` `4318531`; hosted on Vercel from `main` `2fd74c7`, whose CI is lint-red; open `/health`, gateway/auth/rate-limit/status/guardrail tests, unconfigured-status capture committed |

The tag and `main` SHAs differ where work continued after the release; both are cited so neither is
mistaken for the other. A tag commit is never presented as the current head.

The first proof-strip count is five because all five systems now carry a published `v0.1.0` tag on a
`main` whose latest CI run is green, plus a documented credential-free demo path. Every SHA cited on
the site was checked against `gh run list` on the day of the refresh.

The one red SHA on the site is named as red. AI Platform's `main` `2fd74c7` adds the two Vercel
entrypoint shims (`api/index.py`, `main.py`), which trip `ruff` E402; the lint step fails and the
test step never runs. That commit is cited because it is what the hosted instance serves, and the
last all-green `main`, `4318531`, is cited beside it. Both the site card and this record say so
rather than pinning the green SHA and letting the reader assume the deployment matches it.

The hosted gateway at <https://pax-ai-gateway.vercel.app> was verified on 2026-08-14 with three
HTTP calls: `GET /health` returned `200` and `{"status":"ok","service":"gateway"}`, `GET
/v1/platform/status` without a key returned `401`, and the same path with `X-API-Key: dev-local`
returned `gateway: up` alongside `rag`, `research`, `mao`, and `repomind` as `unconfigured`. The
proof strip counts one hosted gateway, not five hosted systems.

AI Platform is the only system whose free path does not exercise the others. Its gateway starts with
every upstream URL empty, so P1–P4 report `unconfigured` rather than running for the visitor, and its
rate limiter is an in-process fixed window on a single instance, not a distributed limiter. The
`dev-local` demo key is a public fixture in the repository, not a credential.

Every image on the site is vendored into `public/` from the official capture committed in its own
repository at the SHA above; nothing is a hand-built mockup, and each caption links back to the
source file on GitHub.

| Site file | Source of record |
|---|---|
| `production-rag-grounded.png` | `production-rag/docs/assets/ui-grounded.png` at `129a46d` |
| `agentic-research-run.png` | `agentic-rag-research/docs/assets/ui-done.png` at `57ce423` |
| `multi-agent-trace.png` | `multi-agent-orchestration/docs/assets/ui-trace.png` at `78b3910` |
| `repomind-dogfood-hit.png` | `repomind/docs/assets/ui-dogfood-hit.png` at `a9b0acb` |
| `ai-platform-status.png` | `ai-platform/docs/assets/ui-status-unconfigured.png` at `4318531` |

Each source repository documents the repeatable capture command and its fake-provider boundary.

## Selected public work

| Project | Evidence used |
|---|---|
| RutBusiness | Public `pharma-server` repository, README, language map and topics |
| FarmaciaCompare | Public repository metadata, monorepo manifests, and HTTP 200 public demo |
| Prescribo | Public repository README/manifests and HTTP 200 prototype surface |
| GeoAgent | Public repository metadata, language map, and web package manifest |

## Claim boundary

- This site describes code and product surfaces; it does not claim commercial adoption,
  production traffic, model quality, or benchmark leadership.
- Fixture evals are contract and plumbing evidence, not quality leadership claims.
- `PUBLIC BUILD`, `PROTOTYPE`, and `PUBLIC REPOSITORY` are not synonyms for production readiness.
- Private repositories and vault notes are not linked or copied into the public site.
