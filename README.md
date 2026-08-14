# PAX / DEV

[![CI](https://github.com/pabloalvarez99/paxdev/actions/workflows/ci.yml/badge.svg)](https://github.com/pabloalvarez99/paxdev/actions/workflows/ci.yml)

The public engineering portfolio of Pablo Alvarez: production-shaped AI systems, selected
product work, and a capability map linked to public evidence.

**Production:** <https://paxdev.vercel.app>

## What this site does

- Leads with the five-system AI Engineering ladder: retrieval → agents → orchestration → code
  intelligence → platform operations.
- Separates `LIVE`, `IN PROGRESS`, and `PLANNED` work. Uncreated repositories have no fake links.
- Presents selected public product work across Rust, Python, TypeScript, Kotlin, web, desktop,
  and mobile surfaces.
- Uses generated Open Graph metadata, sitemap and robots routes for a strong public surface.
- Ships without login, forms, analytics, cookies, third-party scripts, or runtime credentials.

The content source is [`content/portfolio.json`](content/portfolio.json). Its claims and links
are checked by [`tests/content.test.mjs`](tests/content.test.mjs). Source provenance is recorded
in [`docs/content-provenance.md`](docs/content-provenance.md).

## Run locally

Requires Node.js 22 or newer.

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>.

## Verify

```bash
npm run check
```

That runs ESLint, strict TypeScript, content/trust tests, and a production Next.js build. CI runs
the same gates with no environment variables or credentials.

## Architecture

- Next.js App Router, React, and strict TypeScript.
- Server-rendered single-page portfolio; no client state or data API is required.
- Repository-native CSS and SVG visuals; no component or icon runtime dependency.
- Local, versioned product imagery from the public `production-rag` demo.
- Security headers are defined in `next.config.ts`.
- Vercel supplies the production edge and immutable deployment history.

## Content policy

1. A `LIVE` or `IN PROGRESS` system links to public evidence.
2. A `PLANNED` system has no repository link until that repository exists.
3. Fake-provider metrics are never presented as model or retrieval quality.
4. Product prototypes keep their safety and legal boundaries visible.
5. No private repository needs to become public merely to populate the site.

## License

MIT. Product repositories linked from the site keep their own licenses.
