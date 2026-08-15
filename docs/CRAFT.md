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

`npm run check:bundle` reads `.next/app-build-manifest.json` after a build and fails if any
route's chunk list mentions `three`, or if `/interview` gained weight it did not ask for.
The rule is enforced by a script rather than by intent.

## Verifying the craft

```
npm run check        # lint · typecheck · unit · pins · urls · build · bundle
npm run test:e2e     # visual baselines + keyboard behaviour
```

`e2e/keyboard.spec.ts` presses `2`, presses `?`, presses `Esc`, and opens jump with `/`,
because a keyboard map nobody exercises is a keyboard map that has already broken.
