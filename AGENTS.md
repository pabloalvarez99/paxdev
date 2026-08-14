# Agent instructions

This repository is the public PAX / DEV portfolio site.

On the captain's machine, strategy is governed by:

`C:\Users\Administrator\Desktop\github porfolio\GITHUB-PORTFOLIO-MASTER-PLAN.md`

## Non-negotiable rules

- Keep `LIVE`, `IN PROGRESS`, and `PLANNED` honest.
- A public claim needs a public repository, test, release, or runnable surface.
- Do not expose vault content, filesystem inventory, credentials, private repository names, or
  personal data.
- Do not add login, lead collection, analytics, cookies, or third-party scripts without an
  explicit product decision and privacy review.
- Preserve accessibility, responsive behavior, metadata, security headers, and reduced-motion
  support.
- Run `npm run check` before merging or pushing `main`.
- Follow the exact pushed commit through GitHub CI and Vercel production.

Public content is in `content/portfolio.json`; update `docs/content-provenance.md` with it.
