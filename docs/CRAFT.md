# Craft

What this site adds beyond text, what it refuses to add, and the conditions under which
the added thing removes itself.

The reference is a bound book: cream cloth, black type, wide margins, one idea to a page.
A portfolio that reads like a landing page is a portfolio a reviewer has already seen four
hundred times. So the additions below are all bindery work — type, paper, a light, and a
set of keys — not product decoration.

## What is added

### 1. A type program, self-hosted

Source Serif 4 (variable, latin subset, roman + italic), served from this origin through
`next/font/local`. Two `.woff2` files, 102 KB total, no request to a font CDN at runtime
and no request to one at build time either: the files are committed under `app/fonts/`
with their OFL licence.

Serif for everything a person reads, including the small capitals that used to be set in
Consolas. Monospace survives only where it carries meaning a proportional face would
destroy: commit SHAs, hostnames, curl lines, code.

The export carrying the face is named `sourceSerif`, not `serif`. `next/font/local` names
the generated `@font-face` after the binding it is assigned to, so `export const serif`
would have produced `font-family: "serif"` — the CSS generic keyword, wearing quotes.
Quoted, a browser still resolves it to Source Serif 4 and the page looks correct, which is
exactly why the mistake is invisible: the moment anything downstream drops those quotes,
the family falls back to whatever the system calls generic serif, with no error and a page
that still reads as a serif face at a glance. `tests/craft.test.mjs` checks the export name
against the list of CSS generic families so this cannot ship again.

### 2. One sheet of paper, in WebGL

`components/paper-sheet.tsx`. A single subdivided plane under one raking light, rendered
with a hand-written shader: shallow warp, paper fibre, laid lines, deckle edge, and a soft
band of window light that drifts across the sheet over about two minutes.

It is a material study, not a demo. There is no orbit control, no bloom, no fog, no
particle system, no icosahedron, no neural-network line art. Nothing is clickable. The
whole thing lives in a band under the opening sentence and never sits behind type.

The colours are the page colours: shade `#e6e0d3`, sheet `#f4f0e6`, lit `#fdfbf5`, against
a `#f7f4ed` page. Turned off, the page loses a rectangle of very slightly warmer cream.
That is the intended amount of loss.

The canvas also needs its CSS size set, not only its drawing-buffer size.
`renderer.setPixelRatio` scales the buffer so the sheet stays sharp on dense screens, but
`renderer.setSize(width, height, false)` writes only the canvas's `width`/`height`
attributes, and an element with no CSS size of its own lays out at its attribute size. The
first version of this component called `setSize` with that third argument `false`, so on a
2x screen the 384px frame (`.sheet-stage`'s `max-width: 24rem`) held a canvas whose
attributes had already been doubled to 768px, cropped by `overflow: hidden` to one corner
of the sheet. It looked perfect on the machine that built it: Playwright's default
`deviceScaleFactor` is 1, where the attribute size and the CSS size are the same number, so
no screenshot test ever saw the bug, and at 1x there genuinely was none to see. The fix is
that third argument, `true`. `e2e/craft.spec.ts` now opens a context at
`deviceScaleFactor: 2` and asserts the canvas fits inside `.sheet-stage`, so an ordinary
laptop or phone screen is exactly what the regression would need to come back.

**It does not prove anything about retrieval.** It is on this site because a bookbinder
who ships Next.js should be able to light a sheet of paper, and for no other reason.

### 3. Keys

Every route carries the same keyboard map, mounted once in the root layout:

| Key | Does |
| --- | --- |
| `1`–`5` | Open chapters one to five — the five systems, in ladder order |
| `g` `h` | Home |
| `g` `i` | Interview kit |
| `g` `s` | Studio |
| `/` or `Ctrl`/`⌘` + `K` | Jump: type a word, go to the page that word belongs to |
| `?` | The legend, typeset |
| `Esc` | Close whatever is open |

Jump matches names and a small hand-written vocabulary, so a reviewer who remembers a
concept but not a product name still arrives: `refuse` and `RRF` reach P1, `budget` reaches
P3, `path:line` reaches P4, `quota` reaches P5. It is a lookup table, not a chat box. It
never generates a sentence and it never posts anywhere.

Keys are ignored while a field has focus, so typing `g` into the jump box types a `g`.

### 4. A chapbook

`/read` sets the forty-five minute interview script as continuous prose — no chips, no
status pills, no cards. `Ctrl`/`⌘` + `P` from that page produces a folded reading copy:
22 mm margins, running heads, orphan and widow control, and every external link printed
with its URL beside it, because paper cannot be clicked.

### 5. Honesty on the first screen

The two claims most easily inflated are stated before a reader scrolls:

- P1 Production RAG is clone-only. It is not hosted.
- P5 AI Platform is hosted and reports four unconfigured upstreams.

`production-rag.vercel.app` belongs to a different product and is never linked as P1.
`tests/craft.test.mjs` fails the build if either sentence leaves the first section.

## What is refused

- Dark mode as the default, or at all. The book is cream.
- Gradient text, glass, glow, mint, aurora, HUD grids, badge clouds.
- Any generated hero image, and any generated screenshot of an interface that does not
  exist. Captures come from real runs and cite the commit they were taken at.
- A chat widget. Nothing on this site talks back.
- Motion that has an opinion. One sheet, one light, two-minute cycle, 30 frames a second.

## How the added thing removes itself

The sheet has four independent kill switches. Any one of them leaves a page of pure type,
with no gap where the canvas was — the figure collapses rather than reserving space.

1. **`prefers-reduced-motion: reduce`** — `three` is never imported. Not paused, not
   hidden: the dynamic import does not happen. The media query is also watched live, so
   changing the system setting unmounts the canvas without a reload.
2. **No WebGL** — context creation is attempted inside a `try`; a throw or a null context
   disposes everything and renders nothing. Same path if the `three` chunk fails to load.
3. **Tab hidden** — `visibilitychange` cancels the animation frame. A background tab costs
   zero frames.
4. **Scrolled away** — an `IntersectionObserver` stops the loop when the figure leaves the
   viewport.

The renderer, geometry, material and canvas are disposed on unmount in every path.

## Where the weight goes

`three` is imported dynamically, inside an effect, in a component only the home page
renders. It is therefore in its own async chunk, requested by no other route and by no
reviewer who asked for reduced motion.

`npm run check:bundle` enforces that by script rather than by intent. Next 16 with Turbopack
emits no `app-build-manifest.json`, so the gate reads the prerendered HTML instead: it first
finds which built chunks carry `three` by searching them for a string only `three` emits, then
for every route collects the `/_next/static/**.js` files that route's document tells a browser
to fetch, and fails if any of them is one of those chunks. No route may name a `three` chunk in
its document — not even the home page, where the import is supposed to happen later, at
runtime, from inside an effect. `/interview` is additionally required to have been prerendered
at all, because a route that is missing proves nothing by passing.

Two properties the manifest did not have: it measures what a browser will be told to fetch
rather than what the build intended to ship, and it also fails when *no* chunk carries `three`,
so the gate cannot start passing because the feature was deleted.

## Verifying the craft

```
npm run check        # lint · typecheck · unit · pins · urls · build · bundle
npm run test:e2e     # visual baselines + keyboard behaviour
```

The visual baselines under `e2e/visual.spec.ts-snapshots/` are viewport screenshots, never
full-page. A full-page shot of a page that is mostly text is really a height measurement,
and text height moves with the host's font stack, hinting and scrollbar: baselines taken on
the Windows machine that wrote this branch were 1372×17590, and the Linux runner produced
1490×18397 from the same commit. Playwright rejects a comparison on size before
`maxDiffPixelRatio` ever gets a say, so the tolerance never even applied. Baselines are
generated inside the Playwright container CI reads from, pinned to the version in
`package.json`:

```
docker run --rm -v "$PWD:/w" -v /w/node_modules -v /w/.next -w /w \
  mcr.microsoft.com/playwright:v1.55.0-noble \
  bash -lc "npm ci && npm run build && npx playwright test e2e/visual.spec.ts -u"
```

Baselines built outside that container, on any host OS, will not match what CI sees.

`e2e/craft.spec.ts` presses `2`, presses `?`, presses `Esc`, and opens jump with `/`,
because a keyboard map nobody exercises is a keyboard map that has already broken.
