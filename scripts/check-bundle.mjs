#!/usr/bin/env node
/**
 * The weight gate for the one piece of craft that has weight.
 *
 * three is imported dynamically, inside an effect, in a component only the home page renders.
 * That intent is worth nothing unless something checks it, so this reads the prerendered HTML
 * of every route — the scripts a browser is actually told to fetch — and fails if three is in
 * any of them. /interview above all.
 *
 * It also fails if three is missing from the build entirely, because a rule that passes when
 * the feature was deleted is not a rule.
 *
 * Run after `npm run build`.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const nextDir = join(root, ".next");
const appDir = join(nextDir, "server", "app");
const chunkDir = join(nextDir, "static", "chunks");

/**
 * A string three emits and nothing else on this site would. It is an internal warning prefix,
 * not API, so a three upgrade that rewords or strips it will make this gate fail loudly with
 * "no chunk contains ..." even though nothing is actually wrong. That is the intended direction
 * of the failure -- if the marker ever needs changing, change it here and say why in the commit.
 */
const THREE_MARKER = "THREE.WebGLRenderer";

let failed = false;
function fail(message) {
  console.error(`check-bundle: ${message}`);
  failed = true;
}

function walk(dir, test) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, test));
    else if (test(entry.name)) out.push(full);
  }
  return out;
}

let chunkFiles;
try {
  chunkFiles = walk(chunkDir, (name) => name.endsWith(".js"));
} catch {
  console.error("check-bundle: no .next/static/chunks. Run npm run build first.");
  process.exit(1);
}

/** Chunks that actually carry three, as browser paths. */
const threeChunks = new Set();
for (const file of chunkFiles) {
  if (readFileSync(file, "utf8").includes(THREE_MARKER)) {
    threeChunks.add(`/_next/${relative(nextDir, file).split("\\").join("/")}`);
  }
}

if (threeChunks.size === 0) {
  fail(`no chunk contains ${THREE_MARKER}: the paper sheet is not in this build`);
}

// Guarded like the chunk walk above: a changed Next output layout should report what is
// missing, not throw a stack trace at whoever ran the build.
let pages;
try {
  pages = walk(appDir, (name) => name.endsWith(".html")).filter(
    (file) => !/_global-error|_not-found/.test(file),
  );
} catch {
  pages = [];
}

if (pages.length === 0) {
  fail("no prerendered HTML under .next/server/app");
}

const rows = [];
for (const page of pages) {
  const html = readFileSync(page, "utf8");
  const route =
    "/" +
    relative(appDir, page).replace(/\\/g, "/").replace(/\.html$/, "").replace(/^index$/, "");

  // Everything the document tells the browser to fetch before it is interactive.
  const scripts = new Set(
    [...html.matchAll(/["'](\/_next\/static\/[^"']+\.js)["']/g)].map((match) => match[1]),
  );

  let bytes = 0;
  for (const script of scripts) {
    try {
      bytes += statSync(join(nextDir, script.replace("/_next/", ""))).size;
    } catch {
      // A chunk named in the document but not on disk is Next's problem, not this gate's.
    }
  }

  const leaked = [...scripts].filter((script) => threeChunks.has(script));
  rows.push({ route, scripts: scripts.size, kb: Math.round(bytes / 1024), leaked });
}

rows.sort((a, b) => b.kb - a.kb);
for (const row of rows) {
  console.log(
    `${row.route.padEnd(24)} ${String(row.kb).padStart(5)} KB  ${String(row.scripts).padStart(2)} scripts${
      row.leaked.length > 0 ? "   <-- three" : ""
    }`,
  );
}

for (const row of rows) {
  if (row.leaked.length > 0) {
    fail(`${row.route} loads three before it is interactive: ${row.leaked.join(", ")}`);
  }
}

if (!rows.some((row) => row.route === "/interview")) {
  fail("/interview was not prerendered, so this gate proved nothing about it");
}

if (failed) {
  process.exit(1);
}

console.log(
  `check-bundle: three is in ${threeChunks.size} runtime-only chunk(s) and in no route's initial scripts.`,
);
