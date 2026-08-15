import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = new URL("..", import.meta.url).pathname.replace(/^\/(.:\/)/, "$1");
const read = (...parts) => readFileSync(join(root, ...parts), "utf8");

const content = JSON.parse(read("content", "portfolio.json"));
const jump = JSON.parse(read("content", "jump.json"));
const homePage = read("app", "page.tsx");
const keyboardNav = read("components", "keyboard-nav.tsx");
const paperSheet = read("components", "paper-sheet.tsx");
const craftDoc = read("docs", "CRAFT.md");
const fonts = read("app", "fonts.ts");
const layout = read("app", "layout.tsx");

/** Everything above the first section break on the home page: what a stranger sees first. */
const firstScreen = homePage.slice(0, homePage.indexOf("</section>"));

test("the first screen states that P1 is clone-only", () => {
  assert.match(firstScreen, /clone-only/i);
  assert.match(firstScreen, /P1 Production RAG/);
});

test("the first screen states that P5 reports four unconfigured upstreams", () => {
  assert.match(firstScreen, /four unconfigured/i);
  assert.match(firstScreen, /P5 AI Platform/);
});

test("production-rag.vercel.app is never presented as a system of this series", () => {
  for (const system of content.aiSystems) {
    assert.doesNotMatch(system.hosted?.url ?? "", /production-rag\.vercel\.app/);
    for (const link of system.links) {
      assert.doesNotMatch(link.url, /production-rag\.vercel\.app/);
    }
  }
  // Where it does appear, it appears as the disclaimer it is.
  assert.match(firstScreen, /production-rag\.vercel\.app is a different product/);
});

test("the jump vocabulary is lowercase and every term belongs to one destination", () => {
  const owner = new Map();
  const entries = [
    ...Object.entries(jump.systemTerms),
    ...jump.pages.map((page) => [page.href, page.terms]),
  ];

  for (const [destination, terms] of entries) {
    for (const term of terms) {
      assert.equal(term, term.toLowerCase(), `"${term}" must be lowercase to be matched`);
      assert.ok(
        !owner.has(term),
        `"${term}" points at both ${owner.get(term)} and ${destination}`,
      );
      owner.set(term, destination);
    }
  }
});

test("a reviewer who remembers the mechanism reaches the system", () => {
  const expected = {
    refuse: "production-rag",
    rrf: "production-rag",
    budget: "multi-agent-orchestration",
    "path:line": "repomind",
    quota: "ai-platform",
    golden: "agentic-rag-research",
  };

  for (const [term, slug] of Object.entries(expected)) {
    const matches = Object.entries(jump.systemTerms).filter(([, terms]) =>
      terms.includes(term),
    );
    assert.equal(matches.length, 1, `"${term}" should reach exactly one system`);
    assert.equal(matches[0][0], slug, `"${term}" should reach ${slug}`);
  }
});

test("every jump destination is a route this site publishes", () => {
  const routes = new Set([
    "/",
    "/interview",
    "/read",
    "/studio",
    "/changelog",
    "/casestudy",
    ...content.aiSystems.map((system) => system.route),
  ]);
  for (const page of jump.pages) {
    assert.ok(routes.has(page.href), `${page.href} is not a published route`);
  }
  for (const slug of Object.keys(jump.systemTerms)) {
    assert.ok(
      content.aiSystems.some((system) => system.slug === slug),
      `jump.json has vocabulary for ${slug}, which is not a system`,
    );
  }
});

test("the legend documents every key that is bound", () => {
  for (const key of ["1", "5", "g", "h", "i", "s", "?", "/", "Esc"]) {
    assert.ok(
      keyboardNav.includes(`<kbd>${key}</kbd>`),
      `the legend never shows ${key}, so nobody can discover it`,
    );
  }
  assert.match(keyboardNav, /GOTO[^=]*=\s*\{\s*h:/, "g h must be bound");
});

test("three is loaded dynamically, from one component, and never imported statically", () => {
  const sources = [];
  const collect = (dir) => {
    for (const entry of readdirSync(join(root, ...dir), { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      if (entry.isDirectory()) collect([...dir, entry.name]);
      else if (/\.tsx?$/.test(entry.name)) sources.push([...dir, entry.name]);
    }
  };
  collect(["app"]);
  collect(["components"]);

  const dynamic = [];
  for (const parts of sources) {
    const source = read(...parts);
    assert.doesNotMatch(
      source,
      /^\s*import[^\n]*from ["']three["']/m,
      `${parts.join("/")} imports three statically, which puts it in a route's payload`,
    );
    if (/import\(["']three["']\)/.test(source)) {
      dynamic.push(parts.join("/"));
    }
  }

  assert.deepEqual(dynamic, ["components/paper-sheet.tsx"]);
});

test("the sheet keeps all four of the switches that take it away", () => {
  assert.match(paperSheet, /prefers-reduced-motion/, "reduced motion must be honoured");
  assert.match(paperSheet, /visibilitychange/, "a hidden tab must cost no frames");
  assert.match(paperSheet, /IntersectionObserver/, "a scrolled-away sheet must stop");
  assert.match(paperSheet, /return; \/\/ No WebGL context/, "WebGL must fail open");
  assert.match(paperSheet, /renderer\.dispose\(\)/, "the context must be released");
});

test("the self-hosted face is not named after a CSS generic", () => {
  // next/font derives the @font-face family from the export name, so `export const serif`
  // emits `font-family: "serif"` -- the generic keyword wearing quotes. It renders correctly
  // until something drops the quotes, and then the page silently uses whatever the system
  // calls serif while every other test still passes.
  const generics = [
    "serif",
    "sans-serif",
    "monospace",
    "cursive",
    "fantasy",
    "system-ui",
    "ui-serif",
  ];
  const exported = [...fonts.matchAll(/export const (\w+) = localFont\(/g)].map((m) => m[1]);
  assert.ok(exported.length > 0, "app/fonts.ts must export at least one face");
  for (const name of exported) {
    assert.ok(
      !generics.includes(name),
      `app/fonts.ts exports "${name}", which next/font turns into the CSS generic of the same name`,
    );
  }
  assert.match(layout, /sourceSerif\.variable/, "the layout must carry the face's variable");
});

test("the craft document exists and names what it refuses", () => {
  assert.match(craftDoc, /## What is refused/);
  assert.match(craftDoc, /prefers-reduced-motion/);
  assert.match(craftDoc, /WebGL/);
});

test("the reviewer-facing copy carries none of the words that mark a generated page", () => {
  const banned = /\b(ultra|cinematic|legendary|wow|futuristic|production-shaped)\b/i;
  const surfaces = [["content", "portfolio.json"]];
  const collect = (dir) => {
    for (const entry of readdirSync(join(root, ...dir), { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue;
      if (entry.isDirectory()) collect([...dir, entry.name]);
      else if (/\.tsx?$/.test(entry.name)) surfaces.push([...dir, entry.name]);
    }
  };
  collect(["app"]);
  collect(["components"]);

  for (const parts of surfaces) {
    const match = banned.exec(read(...parts));
    assert.equal(match, null, `${parts.join("/")} says "${match?.[0]}"`);
  }
});
