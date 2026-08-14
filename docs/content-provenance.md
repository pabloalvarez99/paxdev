# Content provenance

Verified on 2026-08-14. The portfolio is editorially curated rather than populated from an
unauthenticated runtime GitHub request, so a third-party outage or rate limit cannot blank the
site. Update this record whenever a public status changes.

## AI Engineering ladder

| Surface | Public evidence |
|---|---|
| Production RAG | Release `v0.1.0`; `main` `cb852ba` with green CI. The earlier `590045c` was red on the rendered-metric provenance guard; `cb852ba` is the docs fix that restored green. |
| Agentic Research | Release `v0.1.0`; `main` `66aada2` with green CI; API/CLI/UI, optional P1 HTTP, notes tool, 17-case eval contract |
| Multi-Agent Orchestration | Release `v0.1.0`; `main` `e2687ca` with green CI; the release tag points at the same commit |
| RepoMind | Release `v0.1.0`; `main` `327a949` with green CI; the release tag points at the same commit |
| AI Platform | Release `v0.1.0`; `main` `7978a00` with green CI; open `/health`, gateway/auth/rate-limit/status/guardrail tests |

The first proof-strip count is five because all five systems now carry a published `v0.1.0` tag on a
`main` whose latest CI run is green, plus a documented credential-free demo path. Every SHA cited on
the site was checked against `gh run list` on the day of the refresh; no red SHA is promoted.

AI Platform is the only system whose free path does not exercise the others. Its gateway starts with
every upstream URL empty, so P1–P4 report `unconfigured` rather than running for the visitor, and its
rate limiter is an in-process fixed window on a single instance, not a distributed limiter. The
`dev-local` demo key is a public fixture in the repository, not a credential.

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
