# Content provenance

Verified on 2026-08-14. The portfolio is editorially curated rather than populated from an
unauthenticated runtime GitHub request, so a third-party outage or rate limit cannot blank the
site. Update this record whenever a public status changes.

## AI Engineering ladder

| Surface | Public evidence |
|---|---|
| Production RAG | Release `v0.1.0`; verified green post-release SHA `d882c9a`. Current docs-only `main` `590045c` is red on the rendered-metric provenance guard, so it is not presented as the verified SHA. |
| Agentic Research | `main` `b99c88c`; API/CLI/UI, optional P1 HTTP, notes tool, 17-case eval contract, green CI, release `v0.1.0` |
| Multi-Agent Orchestration | `main` `2c79e9c` and green CI; the public README/SHIP still define the claim boundary as M4 and no release, despite newer client/UI code on main |
| RepoMind | `main` `83c4fff` and green CI; the public README still defines the claim boundary as M5 and no release, despite newer dogfood/UI code on main |
| AI Platform | `main` `3cdd3dd`; open `/health`, gateway/auth/rate-limit/status/guardrail tests, M0–M6 docs, green CI; no release |

The first proof-strip count is five because P1–P5 are now public repositories with documented
credential-free demo paths. AI Platform moved from `PLANNED` to `LIVE` only after its repository,
open `/health`, tests, and green CI were all public; it does not claim a release.

The Production RAG screenshot is copied from
`production-rag/docs/assets/ui-grounded.png`. Its source repository documents the repeatable
capture command and the fake-provider boundary.

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
