# Case study — paxdev hiring surface

**Product:** [paxdev.vercel.app](https://paxdev.vercel.app) · source [pabloalvarez99/paxdev](https://github.com/pabloalvarez99/paxdev)  
**Companion:** GitHub profile README [pabloalvarez99/pabloalvarez99](https://github.com/pabloalvarez99/pabloalvarez99)  
**Season:** site v1.0.0 campaign (90 days) · owner A2 (these two repos only)

This is not a redesign diary. It is an account of why a five-system AI portfolio becomes false overnight if the hiring surface is treated as marketing copy, and what we built so that falsehood is a red CI job instead of a surprise on demo day.

## The problem in one sentence

Sibling repositories move on their own `main` branches, Vercel hostnames rename under pressure, GitHub profile APIs reject the tokens agents actually hold, and a “pin bump” that looked green at noon is stale by dinner — unless the site’s claims are **fixtures with tests**, not prose.

## Why pins drift

The ladder is five public systems (P1–P5), each owned by a different agent and release train. paxdev does **not** own their source. It only **cites** them: short SHAs in `phase` lines, capture `sourceUrl`s, studio scripts, interview minute marks, architecture poster chips, and the profile README table.

Drift modes we hit in production during the hiring series:

1. **Sibling merge without site update.** P2/P3/P4/P5 shipped v0.3.0 the same afternoon the site still published v0.2.0 SHAs (`d62917d`, `8155274`, `5d4eefe`, `e9bec1b`). Reviewers opening “main” on GitHub saw different commits than the cards.
2. **PR head mistaken for main.** P1’s stream work lived on PR #3 while main was still `1cd8e4b`. Copy that said “NOT SHIPPED” was correct until merge — and wrong the moment merge landed without a site commit. After merge, main is `bf6e36d` and claiming NOT SHIPPED is a lie.
3. **Tag ≠ main.** Annotated release tags can point at an object that is not the tip of `main` after follow-up commits. The hiring surface pins **`origin/main`**, and names the release tag separately.
4. **Host renames.** P3 tried `pax-mao`, `pax-multi-agent`, then settled on `pax-orchestration`. Linking a 404 host is worse than linking nothing.
5. **Human “OK after SHA edit”.** Editing five JSON fields without re-curling health or comparing capture blobs produces a green chat report and a red live demo.

**Mitigation:** `content/pins.json` is the machine table. `scripts/check-pins.mjs` fails if portfolio, interview beats, poster subtitle, or hosted URLs disagree. Offline in every PR; `--live` compares `gh` main SHAs and health endpoints on schedule. `content/verified-urls.json` is the only allowlist for non-GitHub URLs.

## Why we refuse a P1 host (and why Ipsura is poison)

Production RAG needs hybrid retrieval against Qdrant. Standing up a vector database per anonymous visitor is not the free-path product. The portfolio therefore marks P1 **CLONE** everywhere: card, studio clone grid, interview mode, poster chip.

There is a live deployment at `production-rag.vercel.app`. It is **Ipsura**, another product, not this series. Citing it as P1 would be the single fastest way to train a hiring manager to distrust everything else on the page. Unit tests reject the URL string in content fixtures. Studio embeds never frame it. Absent candidates (`pax-production-rag.vercel.app`) stay in the fixture as 404s so the absence is explicit.

When P1 ships stream, filter-aware cache, and `/evals` (PR #3 merged on `bf6e36d`), those are **in-repo** DEMO-DAY beats — still not a hosted iframe.

## Why GitHub name, bio, and pins stay manual (403)

Agents on this machine often hold fine-grained PATs. Those tokens can push to repositories and open PRs. They **cannot** `PATCH /user` for name, bio, or social pins — the API returns **403**. UserLists and some social-preview surfaces are similarly blocked.

A portfolio that claims “we set the profile name via API” after a 403 is lying. The honesty rule is: document the pointer (do it in the UI by hand if you care), never invent success. That is why the profile README and this site never treat API-updated chrome as evidence of engineering skill.

## Why github-readme-stats cards stay gone

Third-party badge services (`github-readme-stats.vercel.app`) returned **503** during the hiring campaign. A broken chart in the profile README reads as a broken engineer. Removing the cards is an integrity choice, not a visual preference. Restoring them while the service is down would reintroduce noise without evidence.

## Studio and interview as products, not pages

**Studio** embeds only hosts that returned 200 in `verified-urls.json`. Each embed carries a three-step script that **names the live hostname**, deep links that match fixture statuses (including P5’s intentional 401), and an honesty line that third-party iframes may be blank on mobile. P1 is a clone card: `git clone`, DEMO-DAY in the flagship repo, Filtering chip, stream, `/evals` — never an Ipsura frame.

**Interview** is a forty-five minute script with minute marks, pinned SHAs, and HOSTED/CLONE modes. Every `*.vercel.app` hostname in the kit must appear in the fixture or the unit test fails. Print CSS makes the kit usable offline at a whiteboard without restyling the site for marketing.

**Architecture poster** is exact type (SVG), not an image model. HOSTED vs CLONE chips are required to match `pins.json` and the hosted blocks in `portfolio.json`.

## Anti-rot pipeline (what v1 actually automates)

| Layer | Role |
| --- | --- |
| `content/pins.json` | Authoritative SHAs, modes, hosts |
| `content/verified-urls.json` | Observed HTTP statuses for every published host |
| `content/portfolio.json` | Prose and structure derived from the two fixtures |
| `content/releases.json` | Vendored GitHub release notes for `/changelog` |
| `npm test` | Static honesty: hosted claims, studio scripts, interview hosts, no Ipsura URL, poster chips, release tags |
| `npm run check:pins` | pins ↔ portfolio agreement; optional `--live` |
| `npm run verify:urls` | Live curl of the fixture |
| Playwright visual | `/` `/studio` `/interview` desktop + mobile baselines |
| CI | lint, typecheck, unit tests, pins check, content-only URL agreement, build, visual regression |

The failure mode we optimize for is **afternoon rot**: a sibling ships at 16:00, the site still claims morning SHAs, and a hiring manager notices before we do. Schedule + offline gates close that gap without requiring a human to re-read every card.

## Bilingual system pages (ES/EN)

Hiring in Chile is bilingual. System pages expose an ES/EN toggle over the same evidence (phase, SHAs, hosts). The toggle does not invent a second product story — it translates pitch and contract language so a Spanish-speaking reviewer is not forced through English-only walls. Accessibility (axe) and contrast fixes land only when checks fail; cinematic restyle is explicitly out of scope for the season.

## Changelog as a test, not a blog

`/changelog` renders vendored release bodies for all five systems. The test asserts each release tag equals the pin’s `release` field and that five entries exist. If someone bumps pins to v0.4.0 without refreshing `releases.json`, CI fails. That is intentional friction.

## What we still refuse to claim

- That free-path goldens are retrieval or answer **quality**.
- That P5 hosts or runs P1–P4 (upstreams stay unconfigured on the public fixture).
- That `dev-local` is a credential.
- That the field allowlist on P1 is access control.
- That profile chrome was updated via API when it 403’d.
- That a pin bump alone is “done.”

## Season gate for site-v1.0.0

Tag `site-v1.0.0` only when:

1. Visual regression is green in CI for `/` `/studio` `/interview` at desktop and mobile.
2. `verified-urls.json` has at least ten checks.
3. Final pin pass matches `origin/main` for P1–P5 the same day.
4. Ipsura and stale PR#3 copy remain absent from published content.

The profile repository is **not** tagged. It is a README surface, not a product version.

## Closing

The hiring surface is an **evidence product**. Its job is to make a staff engineer’s distrust cheap to resolve: open the host, run the free path, read the refusal, check the SHA, re-run the fixture. Pins will still drift — that is physics. What changes at v1 is that drift becomes a failing job instead of a confident lie.

Word count target for this case study is ≥1500 words of honest constraint narrative; the operational detail lives in `docs/SEASON.md`, `content/pins.json`, and the tests that refuse to ship a pretty falsehood.

## Appendix A — Day-of operator loop

Before any interview, the operator runs three commands from the paxdev checkout: `npm run verify:urls`, `npm run check:pins -- --live`, and `npm test`. The first curls every host the site publishes and rewrites observed statuses only when the human passes `--write`. The second asks GitHub for each system’s `main` SHA and compares it to `content/pins.json`, then hits health endpoints for hosted systems. The third freezes the static honesty graph: studio scripts name live hostnames, interview hostnames sit inside the fixture, poster chips match modes, release tags match pins, and the Ipsura URL never appears as a portfolio citation.

If any step fails, the correct response is not to soft-edit the interview script by hand in a Google Doc. The correct response is to update `pins.json`, re-run the repin helper or edit `portfolio.json` deliberately, refresh captures only after comparing blob SHAs, commit, deploy, and re-verify production HTML still contains the five short SHAs. That loop is boring on purpose. Boring loops survive demo day.

## Appendix B — What reviewers actually click

Empirically, hiring managers open three things: the profile README, the portfolio root, and one hosted demo. They rarely clone P1 on the first call. That is why hosted demos must be honest about fixtures and why the interview kit leads with RepoMind `path:line`, the research agent’s stop reason, orchestration’s ordered timeline, and the gateway’s unconfigured upstreams. P1 remains the depth beat for people who return for a second hour with Docker available.

The studio exists for asynchronous review. A manager who will not schedule forty-five minutes can still follow three steps per hosted system without the candidate in the room. If the iframe is blank, the deep link is the product. If the deep link 404s, the fixture was wrong and CI should have failed earlier.

## Appendix C — Failure modes we encode as tests

- Content claims a host that is not in `verified-urls.json`.
- Content claims status 200 for a route the fixture observed as 401 (or the reverse) without updating the studio deep link expect field.
- Interview kit mentions a Vercel hostname absent from the fixture.
- Architecture poster marks a system HOSTED while `hosted` is null, or CLONE while a host exists.
- P1 prose still says PR #3 is open or NOT SHIPPED after merge.
- Changelog release tag disagrees with pins.
- Verified URL count drops below the v1 gate (ten checks).
- Playwright screenshot deltas exceed the allowed ratio on home, studio, or interview at desktop or mobile.

Each of these failed in conversation or in a prior wave. Encoding them is how the site earns the right to say “verified.”

## Appendix D — Relationship to the five system CASESTUDY files

Each system repository has its own case study describing architecture and non-goals. This site case study does not replace them. It explains the **meta-product**: how five independent evidence surfaces are composed into one hiring narrative without becoming a slide deck. When a system’s CASESTUDY changes a boundary (for example, P5 still does not run P1–P4), the site must absorb that sentence into hosted notes and interview watch-outs. The pin pipeline does not auto-summarize CASESTUDY prose; humans still own narrative. The pipeline owns **identifiers**: SHAs, hosts, release tags, modes.

## Appendix E — Why visual regression is part of honesty

Visual regression is not about brand. It catches accidental blank pages, missing sections, and layout collapses that unit tests do not see — for example, a CSS change that hides the clone card grid on mobile, or a content change that removes the architecture poster from `/interview`. Desktop and mobile baselines force both viewports to stay reviewable. The allowed pixel ratio is deliberately loose enough to tolerate font raster differences across CI images and tight enough to fail a missing section.

## Appendix F — Tagging policy

`site-v1.0.0` is a product tag on paxdev only. It does not claim that P1–P5 are “done.” It claims that the hiring surface’s anti-rot checklist is green on a named day. The profile repo is never tagged for this season; tagging a README confuses release consumers. If pins move the next morning, the correct action is a new commit and, if the contract changes materially, a new site tag later — not silent README edits without tests.

