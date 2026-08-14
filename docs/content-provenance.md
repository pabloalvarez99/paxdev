# Content provenance

Verified on 2026-08-14. The portfolio is editorially curated rather than populated from an
unauthenticated runtime GitHub request, so a third-party outage or rate limit cannot blank the
site. Update this record whenever a public status changes.

## AI Engineering ladder

| Surface | Public evidence |
|---|---|
| Production RAG | Release `v0.1.0` at `678c554`; `main` `1cd8e4b` with green CI; the allowlisted metadata filter control merged onto the query UI (ADR 0011, `docs/demo.md`); `docs/DEMO-DAY.md`, demo GIF, and social preview committed |
| Agentic Research | Release `v0.1.0` at `18c1ff9`; `main` `8bde9c9` with green CI; API/CLI/UI, optional P1 HTTP, notes tool, 17-case eval contract, three committed UI captures |
| Multi-Agent Orchestration | Release `v0.1.0` at `e2687ca`; `main` `78b3910` with green CI; done, budget, and trace captures committed |
| RepoMind | Release `v0.1.0` at `327a949`; `main` `0f91b7c` with green CI; mini-hit, mini-refuse, and dogfood-hit captures committed |
| AI Platform | Release `v0.1.0` at `7978a00`; `main` `eba1e22` with green CI, which is the commit the hosted gateway serves; open `/health`, gateway/auth/rate-limit/status/guardrail tests, unconfigured-status capture committed |

The tag and `main` SHAs differ where work continued after the release; both are cited so neither is
mistaken for the other. A tag commit is never presented as the current head.

The first proof-strip count is five because all five systems now carry a published `v0.1.0` tag on a
`main` whose latest CI run is green, plus a documented credential-free demo path. Every SHA cited on
the site was checked against `gh run list` on the day of the refresh.

No red SHA is promoted. AI Platform passed through a red window: `main` `2fd74c7` added the two
Vercel entrypoint shims (`api/index.py`, `main.py`), which tripped `ruff` E402, so its lint step
failed and its test step never ran. That window closed at `eba1e22`, which is green and is the
commit the hosted gateway now serves. The site cites the SHA the deployment actually runs, not an
older green one that would let a reader assume the two match.

Three systems are hosted, and each was verified over HTTP on 2026-08-14 before it was published
here:

| Hosted surface | Verification | Boundary stated on the card |
|---|---|---|
| <https://pax-ai-gateway.vercel.app> | `GET /health` returned `200` and `{"status":"ok","service":"gateway"}`; `GET /v1/platform/status` returned `401` without a key, and with `X-API-Key: dev-local` returned `gateway: up` alongside `rag`, `research`, `mao`, and `repomind` as `unconfigured` | The gateway only; it does not run P1–P4 for the visitor |
| <https://pax-agentic-rag.vercel.app> | `GET /health` returned `200` and `{"status":"ok","service":"agentic-rag-research","version":"0.1.0"}` | Runs the loop over the committed fixture retriever, with no `PRODUCTION_RAG_URL`, so it proves the agent contract and claims nothing about answer quality |
| <https://pax-repomind.vercel.app> | `GET /health` returned `200`; `POST /v1/code/ask` answered `create_app` with `app/main.py` lines 6-9 | Indexes the committed `mini` and `production_rag` fixtures only; it cannot answer about an arbitrary repository |

The proof strip counts three hosted demos, not five hosted systems, and P1 and P3 remain
clone-and-run. `pax-production-rag.vercel.app` and `pax-multi-agent.vercel.app` were both requested
on 2026-08-14 and both returned `404`; they are recorded in the `absent` list of
`content/verified-urls.json` so that a future refresh has to observe a `200` before either system
can be published as hosted.

`content/verified-urls.json` is the machine-checkable half of this document: every hosted URL the
site publishes must appear there with the status a real request observed, and `npm test` fails if
`portfolio.json` claims a host the fixture never reached. The file records `401` for
`GET /v1/platform/status` because that is what an anonymous request receives — the authenticated
`200` is described in prose here and on the card, never asserted as the anonymous status.

`production-rag.vercel.app` belongs to an unrelated product and is never cited by this site.

AI Platform is the only system whose free path does not exercise the others. Its gateway starts with
every upstream URL empty, so P1–P4 report `unconfigured` rather than running for the visitor, and its
rate limiter is an in-process fixed window on a single instance, not a distributed limiter. The
`dev-local` demo key is a public fixture in the repository, not a credential.

Every image on the site is vendored into `public/` from the official capture committed in its own
repository at the SHA above; nothing is a hand-built mockup, and each caption links back to the
source file on GitHub.

| Site file | Source of record |
|---|---|
| `production-rag-grounded.png` | `production-rag/docs/assets/ui-grounded.png` at `1cd8e4b` |
| `production-rag-filtered.png` | `production-rag/docs/assets/ui-filtered.png` at `1cd8e4b` |
| `agentic-research-run.png` | `agentic-rag-research/docs/assets/ui-done.png` at `8bde9c9` |
| `multi-agent-trace.png` | `multi-agent-orchestration/docs/assets/ui-trace.png` at `78b3910` |
| `repomind-dogfood-hit.png` | `repomind/docs/assets/ui-dogfood-hit.png` at `0f91b7c` |
| `ai-platform-status.png` | `ai-platform/docs/assets/ui-status-unconfigured.png` at `eba1e22` |

Every vendored file was re-fetched from `raw.githubusercontent.com` at the SHA in this table and
its Git blob hash compared against `gh api .../contents/...?ref=<sha>`; the two matched for every
row, so the site serves the same bytes the source repository stores. Each capture SHA is now the
`main` the same row claims, so a reader who opens the source link sees the head the card cites
rather than an older commit that merely happened to hold the file.

`production-rag/docs/assets/ui-grounded.png` changed between `129a46d` and `1cd8e4b`; the vendored
copy was refreshed rather than left pinned to the older blob, and its height moved from 1962 to
2127.

Each source repository documents the repeatable capture command and its fake-provider boundary.

## System pages and the demo studio

Each system has a page at `/systems/<name>` whose LIVE and NOT SHIPPED columns are transcribed
from that repository's own `docs/SHIP.md` at the commit the card cites — not paraphrased from the
README, and not softened. Where the repository states a non-goal, the page states it as a
non-goal. Three examples, so the standard is checkable rather than asserted:

- P2's page says the hosted demo sets no `PRODUCTION_RAG_URL`, so its HTTP retriever answers
  `capability_missing`. That is P2's own honest-boundary section, not a caveat invented here.
- P3's page says the 12-task evaluation does not show that several agents beat one model. That is
  the first line of P3's `Non-goals for v0.1.0`.
- P4's page reports that the hosted console offers a `production_rag` catalog whose id contains an
  underscore, while the JSON API's `repo_id` pattern is `^[a-z0-9-]+$` and rejects it. The deep
  link works because the console is a GET form; the equivalent `curl` needs `repo_id=mini`. That
  mismatch lives in P4's source and is reported rather than hidden.

`/studio` embeds only the three systems whose URL was observed answering `200`. The embed list is
asserted against `content/verified-urls.json` in `tests/systems.test.mjs`, and the page module
throws at build time if an embedded slug loses its verified host, so the failure is a red build
rather than a blank frame in front of a reviewer.

Every probe printed beside an embed is a request that was actually made. The three RepoMind deep
links, both `/metrics` routes, all three `/health` routes, and the anonymous
`/v1/platform/status` `401` are recorded in the fixture with the status observed on 2026-08-14.

`frame-src` in `next.config.ts` is computed from the same fixture rather than hand-written, so an
origin that loses its verified `200` loses permission to be framed in the same commit. It names
origins; there is no wildcard. `frame-ancestors 'none'` is unchanged: this site frames others and
is framed by nobody.

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
