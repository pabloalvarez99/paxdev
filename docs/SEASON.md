# Season plan — paxdev + profile → site v1.0.0 (90 days)

**Owner:** A2 (only `pabloalvarez99/paxdev` and `pabloalvarez99/pabloalvarez99`).  
**Horizon:** one quarter. Not another same-day pin shim.  
**Baseline frozen before this season (stale):** paxdev `7d49cd3` · profile `9d01981` — pre-v0.3 pins (P1 `1cd8e4b` + PR#3 NOT SHIPPED; P2 `d62917d`; P3 `8155274`; P4 `5d4eefe`; P5 `e9bec1b`).  
**Truth re-curled 2026-08-14:** see `content/pins.json`.  
**Law:** `REPORTE A2 … OK` is illegal in Month 1. A pin bump alone is never OK — pins went stale the same afternoon last time. Do not tag the profile. Tag `site-v1.0.0` on paxdev only after Month 3 gates.

Authoritative references: master plan §1 (series map), §16 (hiring surfaces), §29 (evidence product), §35 (studio/interview), §37 (demo day honesty).

---

## 0. What this season is (and is not)

### Product

The hiring surface is an **evidence product**, not a restyle:

1. Five system cards whose SHAs match `origin/main` on the day of the pin.
2. Hosted claims only for URLs that appear in `content/verified-urls.json` with the claimed status.
3. Studio three-step scripts and interview kit hostnames that cannot drift past the fixture.
4. A pipeline that **fails CI** when a pin, host, or release claim goes stale.

### Non-goals (entire season)

| Non-goal | Why |
| --- | --- |
| Invent a P1 host / iframe | P1 is clone-only; `production-rag.vercel.app` is **Ipsura** |
| Edit P1–P5 source | Owned by A5/A6/A1/A3/A4 |
| PATCH `/user` name/bio/pins | Fine-grained PAT → **403**; do not claim it worked |
| Restore `github-readme-stats` | Service 503; broken badges are worse than absent |
| Cinematic restyle of profile boards | Profile is already cinematic; refresh only when truth changes |
| `REPORTE OK` after JSON edit | Month 1 closes only when the pipeline cannot rot |
| Tag profile; tag site before visual regression green | Month 3 gate only |

### Season deliverables (high level)

| Month | Product surface | Evidence a stranger can run |
| --- | --- | --- |
| **1** | True pins + anti-rot pipeline + 15 invariants | `content/pins.json` matches portfolio + profile; `npm test`; live `verify:urls`; CI pin-drift design → then green weeks 2–4 |
| **2** | Studio/interview as products | Playwright visual regression; studio scripts on v0.3 hosts; printable kit; optional stills honesty |
| **3** | Release radar + site v1 | `/changelog` from five GitHub releases; architecture poster fixture-true; site CASESTUDY; final pin pass; optional `site-v1.0.0` |

---

## 1. Fifteen invariants

Each invariant is **normative** for every A2 commit. Column **Tested today** is the state after Week 1 re-pin.

| # | Invariant | Meaning | Source | Tested today |
| --- | --- | --- | --- | --- |
| I1 | **No Ipsura as P1** | Never cite `https://production-rag.vercel.app` as Production RAG. That host is another product. | §1, prior digests | **yes** — `tests/systems.test.mjs` rejects the URL in content |
| I2 | **P1 is clone-only** | `hosted: null`, studio `cloneCards`, interview mode `CLONE`, poster chip `CLONE`. No invented host. | §6, DEMO-DAY | **yes** — systems tests + pins.json `mode: CLONE` |
| I3 | **Hostnames ⊆ verified-urls.json** | Every non-GitHub URL published on the site (cards, studio, interview, CSP frame-src) is in the fixture with matching status. | verify:urls, content tests | **yes** — unit + content-only verify |
| I4 | **403 surfaces not claimed** | Do not claim GitHub name/bio/social pins/UserLists were set via API. PAT cannot PATCH `/user`. | profile digests | **yes** — operational; document in SEASON + profile honesty |
| I5 | **Pins = origin main** | Each system’s published short SHA is `origin/main` for that repo on `pinnedAt`, not a PR head, not a stale depth tag. | this season | **yes** — pins.json (re-curl); live check weeks 2–4 |
| I6 | **Release label matches a real tag** | If phase claims `vX.Y.Z`, a release link exists; tag may lag main by merge commits — **main wins** for pin truth. | GitHub Releases | **yes** — all five `v0.3.0` exist; main SHAs listed in pins.json |
| I7 | **PR #3 honesty** | After merge, never say NOT SHIPPED. Stream, filter-aware cache, `/evals` are on main `bf6e36d`. | P1 PR #3 MERGED | **yes** — Week 1 copy rewrite |
| I8 | **P3 host is orchestration only** | Live host is `pax-orchestration.vercel.app`. `pax-mao` / `pax-multi-agent` stay in `absent`. | Vercel history | **yes** — fixture + tests |
| I9 | **P5 does not run P1–P4** | Hosted gateway note must state it does not run siblings; upstreams unconfigured on free path. | P5 SHIP | **yes** — content test on hosted.note |
| I10 | **Studio scripts name live hostnames** | Each embed’s three steps include the fixture hostname; no localhost leftovers for hosted systems. | §35 | **yes** — systems.test studio block |
| I11 | **Interview hostnames ⊆ fixture** | Every `*.vercel.app` hostname in the interview kit is in verified-urls. | §35 | **yes** — systems.test |
| I12 | **Capture sourceUrl pins a commit** | Screenshots cite `blob/<sha>/…`, never `blob/main/…`. | content tests | **yes** |
| I13 | **No github-readme-stats restore** | Do not re-add stats badges while the service returns 503. | profile digests | **yes** — non-goal; profile omits them |
| I14 | **Frame-src from fixture** | CSP `frame-src` is derived from verified 200 origins, not a hand list. | next.config.ts | **yes** — systems.test |
| I15 | **OK is illegal until Month 3 gates** | Month 1–2 reports are PARTIAL/FAIL only. `site-v1.0.0` requires visual regression green and verified URLs ≥ 10. | dispatch | **process** — this file |

**Operational gotcha:** re-pinning SHAs without comparing capture **blob** SHAs can leave stale screenshots that look current. Day-of: `gh api repos/O/R/contents/PATH?ref=SHA --jq .sha` (or raw HEAD) before only editing captions.

**Operational gotcha:** `verify:urls` without `--write` fails if live status drifted; commit the fixture only after a deliberate re-curl.

---

## 2. Pin table (Week 1 truth)

Re-curled **2026-08-14**. Machine form: `content/pins.json`.

| ID | Repo | main (short) | Release | Mode | Host / health |
| --- | --- | --- | --- | --- | --- |
| P1 | production-rag | `bf6e36d` | v0.3.0 | **CLONE** | no host · never Ipsura |
| P2 | agentic-rag-research | `dc80188` | v0.3.0 | HOSTED | https://pax-agentic-rag.vercel.app · health 200 · version **0.3.0** |
| P3 | multi-agent-orchestration | `8feb31a` | v0.3.0 | HOSTED | https://pax-orchestration.vercel.app · health 200 `{"status":"ok"}` |
| P4 | repomind | `4de0ac6` | v0.3.0 | HOSTED | https://pax-repomind.vercel.app · health 200 · version **0.3.0** |
| P5 | ai-platform | `98970d4` | v0.3.0 | HOSTED | https://pax-ai-gateway.vercel.app · `/v1/platform/status` 401 unauthed · fixture key → version **0.3.0** four unconfigured |

**P1 narrative (post-merge):** PR #3 is **merged**. Main ships stream (`POST /v1/query/stream`), filter-aware cache, scorecard `/evals`, and DEMO-DAY beats including chip `title=Filtering`. Still **clone-only**.

**Profile:** same table, same SHAs, same hosts. No PATCH `/user`. No stats cards.

---

## 3. Pin pipeline design (cannot rot)

### 3.1 Single source of truth

```
content/pins.json          ← human+machine pin table (SHAs, mode, hosts)
content/verified-urls.json ← observed HTTP statuses for every published host
content/portfolio.json     ← site copy; must agree with pins + verified
profile README.md          ← must agree with pins (A2 second repo)
```

Rule: if two files disagree, **CI fails**. Prefer fixing pins.json first, then regenerate prose claims.

### 3.2 Drift classes (each is a hard fail)

| Class | Detection | Failure message names |
| --- | --- | --- |
| **SHA drift** | `gh api repos/{repo}/commits/main --jq .sha` vs pins.json `mainFull` | repo, pinned, live |
| **Release drift** | latest release tag vs pins.json `release` (warn if tag target ≠ main; fail if claimed tag missing) | repo, tag |
| **URL drift** | portfolio hosted URL not in verified-urls with matching expect/observed | url, expect, observed |
| **Hostname drift** | interview/studio `*.vercel.app` host not in fixture | hostname |
| **Ipsura leak** | any content string contains `production-rag.vercel.app` | file |
| **Mode drift** | pins mode CLONE but portfolio has hosted, or reverse | slug |
| **Stale NOT SHIPPED** | P1 copy claims PR #3 open after merge | pattern |

### 3.3 Scripts (Week 1 design · Weeks 2–4 implement)

| Script | Role | Week |
| --- | --- | --- |
| `scripts/verify-urls.mjs` | Live curl fixture; `--write` refreshes observed | **exists** |
| `scripts/check-pins.mjs` | Offline: portfolio ↔ pins.json; `--live`: gh main + health vs pins | **scaffold Week 1; CI wire Weeks 2–4** |
| `npm test` | Static honesty: hosted claims, studio scripts, interview hosts, no Ipsura | **exists** |
| Playwright visual | `/` `/studio` `/interview` desktop+mobile baselines | **Month 2** |
| axe (or eq.) | `/` `/studio` `/interview` `/systems/*` | **Month 1 weeks 2–4** |
| ES/EN | Five system pages bilingual | **Month 1 weeks 2–4** |

### 3.4 CI shape (target Weeks 2–4)

```text
on: pull_request, push main, schedule (daily)
jobs:
  honesty:
    - npm ci
    - npm test
    - npm run verify:urls -- --content-only   # offline content/fixture agreement
    - npm run check:pins                     # offline pins ↔ portfolio
  live (schedule / manual / main only):
    - npm run verify:urls                    # real curls
    - npm run check:pins -- --live           # real gh + health
```

Live jobs must not block every PR if GitHub rate-limits; schedule catches afternoon rot.

### 3.5 Operator loop (day-of interview / release)

```powershell
npm run verify:urls -- --write
npm run check:pins -- --live
# if pins drifted: update content/pins.json, then portfolio.json + profile README, re-run tests
npm test
npm run build
```

### 3.6 Why pins rot (for Month 3 CASESTUDY seed)

1. **Sibling repos move** while the site is not in their PR scope.  
2. **Tags ≠ main** after follow-up commits (v0.3.0 tag target can lag main).  
3. **Host renames** (P3: mao → multi-agent → orchestration).  
4. **Human “OK after SHA bump”** without verify:urls or capture blob check.  
5. **403 surfaces** tempt agents to invent success copy for name/bio/pins.

The pipeline’s job is to make (1)–(4) mechanical failures and (5) a documented non-goal.

---

## 4. Month 1 — weeks 2–4 (after this design + re-pin commit)

1. **Wire `check-pins` into `npm run check` and CI** (offline always; live on schedule).  
2. **Extend verify:urls** if new studio/interview deep links appear; keep checks ≥ 10 for Month 3 gate.  
3. **ES/EN** for the five `/systems/*` pages (shared strings from portfolio or locale files; no restyle).  
4. **axe** (or `@axe-core/playwright` once Playwright lands) on `/` `/studio` `/interview` `/systems/*`; fix contrast only if fails.  
5. **Weekly re-curl** logged to second brain; no Month 2 visual baselines until Month 1 honesty green.

**Month 1 exit (not season OK):** pins match origin; offline pipeline green; ES/EN + axe plan implemented or clearly blocked; still no `site-v1.0.0`.

---

## 5. Month 2 — studio and interview as products (PLANNED)

1. Playwright visual regression in CI: `/` `/studio` `/interview` at desktop + mobile.  
2. Studio three-step scripts stay on current v0.3 hosts; P1 remains clone card linking DEMO-DAY in-repo (stream, `title=Filtering`, `/evals`) — never an Ipsura iframe.  
3. Printable interview kit (CSS print or PDF); hostnames still tested against verified-urls.json.  
4. Optional stills/captions; honesty line if video is absent.

---

## 6. Month 3 — release radar + v1 site (PLANNED)

1. `/changelog`: five GitHub release notes vendored or fetched; stale copy fails a test.  
2. Architecture poster with exact type; HOSTED/CLONE chips match pins + fixture.  
3. Site CASESTUDY: why pins drift, why 403, why no stats cards.  
4. Do **not** tag the profile. paxdev may tag `site-v1.0.0` only if visual regression is green and verified URLs ≥ 10.  
5. Final pin pass on the last day.

---

## 7. Week 1 deliverable checklist

- [x] Worktrees `a2-paxdev-v1-season` / `a2-profile-v1-season` from origin/main  
- [x] Re-curl P1–P5 main + health + PR #3 state  
- [x] `content/pins.json` with today’s table  
- [x] Re-pin `content/portfolio.json` + docs + profile README  
- [x] This file (`docs/SEASON.md`) — 15 invariants + pipeline design  
- [ ] Weeks 2–4: CI live drift job, ES/EN, axe  
- [ ] Months 2–3: as above  

**Report status after Week 1:** PARTIAL — truth restored and pipeline designed; Month 1 not closed; season OK forbidden.
