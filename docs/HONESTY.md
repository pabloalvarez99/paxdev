# A2 v1.0 LOCK — HONESTY ledger

**Agent:** A2 (paxdev + profile only)  
**Date:** 2026-08-14  
**paxdev worktree:** `C:\dev\portfolio-workers\a2-paxdev-v1-lock` @ branch `a2/paxdev-v1-lock`  
**profile worktree:** `C:\dev\portfolio-workers\a2-profile-v1-lock` @ branch `a2/profile-v1-lock`  
**Rule:** one row per claim. PASS only with command + observed. STRIKE if false. N/A if out of scope.

## Pin table (after lock)

| ID | Repo | main pin | Release | Mode | Host | Live health / status |
|----|------|----------|---------|------|------|----------------------|
| P1 | production-rag | `3b54d85` | v1.0.0 | CLONE | none | n/a (clone-only) |
| P2 | agentic-rag-research | `1b4915f` | v1.0.0 | HOSTED | pax-agentic-rag.vercel.app | `{"version":"1.0.0"}` |
| P3 | multi-agent-orchestration | `88a24f2` | v1.0.0 | HOSTED | pax-orchestration.vercel.app | `{"status":"ok"}` |
| P4 | repomind | `91fa395` | v1.0.0 | HOSTED | pax-repomind.vercel.app | `{"version":"1.0.0"}` |
| P5 | ai-platform | `801fc0b` | v1.0.0 | HOSTED | pax-ai-gateway.vercel.app | health gateway; status `1.0.0` + four unconfigured |

**Lock fix:** P4 origin moved after site-v1.0.0 (`099ac8a` → `91fa395`, A3 production_rag pin refresh). Pins updated.

**Lock fix:** P2/P4 `bodyHint` was `version 0.3.0` while hosts return `1.0.0`. P5 statusRoute hint was `0.3.0`. Fixed; `check-pins --live` now asserts bodyHints + fixture-key status.

## Rows

| # | Claim | Command | Expected | Observed | Result |
|---|-------|---------|----------|----------|--------|
| 1 | P1 origin main = pin | `gh api repos/pabloalvarez99/production-rag/commits/main --jq .sha` | starts with `3b54d85` | `3b54d85a9c0d3ba…` | **PASS** |
| 2 | P2 origin main = pin | same for agentic-rag-research | `1b4915f` | `1b4915f2b7fa2d…` | **PASS** |
| 3 | P3 origin main = pin | same for multi-agent-orchestration | `88a24f2` | `88a24f23d7d9c8…` | **PASS** |
| 4 | P4 origin main = pin | same for repomind | `91fa395` | `91fa3954a5bd50…` | **PASS** |
| 5 | P5 origin main = pin | same for ai-platform | `801fc0b` | `801fc0b8d9259b…` | **PASS** |
| 6 | P2 health bodyHint 1.0.0 | `GET https://pax-agentic-rag.vercel.app/health` | 200 + `"version":"1.0.0"` | `{"status":"ok","service":"agentic-rag-research","version":"1.0.0"}` | **PASS** |
| 7 | P3 health body | `GET …/pax-orchestration…/health` | 200 + `{"status":"ok"}` | exact | **PASS** |
| 8 | P4 health bodyHint 1.0.0 | `GET …/pax-repomind…/health` | 200 + `"version":"1.0.0"` | match | **PASS** |
| 9 | P5 health | `GET …/pax-ai-gateway…/health` | 200 + gateway | `{"status":"ok","service":"gateway"}` | **PASS** |
| 10 | P5 status 401 anon | `GET …/v1/platform/status` | 401 | 401 unauthorized | **PASS** |
| 11 | P5 status fixture 1.0.0 | `curl -H "X-API-Key: dev-local" …/v1/platform/status` | 200 + version 1.0.0 + unconfigured | match, four unconfigured | **PASS** |
| 12 | `npm run check:pins` | offline | exit 0 | OK — 5 systems | **PASS** |
| 13 | `npm run check:pins -- --live` | live SHA + bodyHint + status | exit 0 | OK after P4 repin + bodyHint fix | **PASS** |
| 14 | `npm run verify:urls -- --content-only` | content ⊆ fixture | exit 0 | OK (18 hosted) | **PASS** |
| 15 | live-honesty job expects 1.0.0 bodies | `.github/workflows/ci.yml` job `live-honesty` runs `check:pins -- --live` | bodyHints validated | bodyHint check added to script | **PASS** |
| 16 | Studio P2 3-step (HTTP) | open host; health 1.0.0; `POST /v1/research` unanswerable | refuse/stop | `status:refused` 200 | **PASS** |
| 17 | Studio P3 3-step (HTTP) | open host; health; `POST /v1/tasks` | done + stop_reason | `writer_final` 200 | **PASS** |
| 18 | Studio P4 3-step (HTTP) | mini create_app; path:line; refusal | create_app @ app/main.py:6-9 | exact | **PASS** |
| 19 | Studio P4 dogfood production_rag | hybrid fusion / RRF | rrf.py path:line | `reciprocal_rank_fusion` @ rrf.py:54-113 | **PASS** |
| 20 | Studio P4 create_app on production_rag as primary | (prior claim) | create_app path:line | returns OpenAIEmbeddingProvider — **wrong symbol** | **STRIKE** (script rewritten to mini + RRF dogfood) |
| 21 | Studio P5 3-step (HTTP) | host; 401; dev-local 1.0.0 | four unconfigured | match | **PASS** |
| 22 | Studio P1 clone/DEMO-DAY | clone card; DEMO-DAY.md @ pin; zero Ipsura embed/href | clone only | DEMO-DAY 200; denylist text only | **PASS** |
| 23 | GET /interview 200 | live paxdev | 200 | 200 | **PASS** |
| 24 | Interview hostnames ⊆ verified-urls | parse live HTML vercel.app hosts | all in fixture | paxdev + P2–P5 hosts | **PASS** |
| 25 | Interview print CSS | `app/globals.css` `@media print` + interview | present | present | **PASS** |
| 26 | GET /changelog 200 + five v1.0.0 | live | ≥5 × v1.0.0 | 42 mentions; 5 release names | **PASS** |
| 27 | Changelog release tags = pins | `content/releases.json` vs pins | all five `v1.0.0` | match | **PASS** |
| 28 | Playwright visual | `npm run test:e2e` after build | 10/10 | baselines updated for intentional P4/script text; re-run **10 passed** | **PASS** |
| 29 | Profile README SHAs = pins | README vs pins.json | P1–P5 match | `3b54d85`/`1b4915f`/`88a24f2`/`91fa395`/`801fc0b` | **PASS** |
| 30 | GitHub name/bio/pins via API | `PATCH /user` | set by A2 | 403 fine-grained PAT — cannot set | **N/A** (do not claim set) |
| 31 | No Ipsura portfolio host | studio/interview/content | no embed/href to production-rag.vercel.app | denylist warnings only | **PASS** |
| 32 | site-v1.0.0 tag | `git rev-parse site-v1.0.0^{}` | points at shipped site | peels to `481c86c` (tag object may differ) | **PASS** for prior release; this lock is follow-up commit |

## Studio card ledger

| Card | Script executed live | Result |
|------|----------------------|--------|
| P2 embed | host + health 1.0.0 + refuse research | **PASS** |
| P3 embed | host + health + free-path task JSON | **PASS** |
| P4 embed | mini create_app + refusal (+ RRF dogfood) | **PASS** (rewritten) |
| P5 embed | host + 401 + dev-local unconfigured | **PASS** |
| P1 clone | git clone + DEMO-DAY; no Ipsura iframe | **PASS** |

## Interview hostname ledger

| Host | On /interview | In verified-urls.json |
|------|---------------|------------------------|
| paxdev.vercel.app | yes | yes (site) |
| pax-agentic-rag.vercel.app | yes | yes |
| pax-orchestration.vercel.app | yes | yes |
| pax-repomind.vercel.app | yes | yes |
| pax-ai-gateway.vercel.app | yes | yes |
| production-rag.vercel.app | denylist text only | forbidden; never embed |

## Changelog release ledger

| System | Tag in releases.json | Name contains v1.0.0 | Result |
|--------|----------------------|----------------------|--------|
| P1 | v1.0.0 | yes | **PASS** |
| P2 | v1.0.0 | yes | **PASS** |
| P3 | v1.0.0 | yes | **PASS** |
| P4 | v1.0.0 | yes | **PASS** |
| P5 | v1.0.0 | yes | **PASS** |

## Counts

- **PASS:** 31 (incl. studio/interview/changelog/pins)
- **STRIKE:** 1 (P4 create_app-on-production_rag as primary — rewritten)
- **N/A:** 1 (GitHub name/bio/pins 403)
- **Broken scripts found:** P4 studio/interview claimed create_app on production_rag; live answer was wrong symbol. Fixed to mini create_app + RRF dogfood.
- **Blocked:** GitHub name/bio/pins (403). Cannot invent P1 host.

## Walk artifact

Live walk JSON: `docs/HONESTY-walk.json` (from `node scripts/lock-walk.mjs`, 24/24 PASS).
