/**
 * Drift guard: every vercel.app / hosted URL published in content/ must appear in
 * content/verified-urls.json with an observed status that matches expect.
 *
 *   npm run verify:urls           # re-curl fixture URLs, fail on mismatch
 *   npm run verify:urls -- --write  # rewrite observed statuses after a successful curl
 *   npm run verify:urls -- --content-only  # offline: content ⊆ fixture (used by `npm test` peer)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentPath = join(root, "content", "portfolio.json");
const fixturePath = join(root, "content", "verified-urls.json");

const args = new Set(process.argv.slice(2));
const writeMode = args.has("--write");
const contentOnly = args.has("--content-only");

const content = JSON.parse(readFileSync(contentPath, "utf8"));
const fixture = JSON.parse(readFileSync(fixturePath, "utf8"));

const normalise = (url) => url.replace(/\/$/, "");

/** Collect every absolute URL that must be fixture-backed. */
function collectPublishedUrls() {
  const found = new Set();
  const walk = (value) => {
    if (typeof value === "string") {
      if (/^https:\/\/[a-z0-9.-]+\.vercel\.app(?:\/|$|\?)/i.test(value)) {
        found.add(value);
      }
      return;
    }
    if (Array.isArray(value)) {
      for (const item of value) walk(item);
      return;
    }
    if (value && typeof value === "object") {
      for (const item of Object.values(value)) walk(item);
    }
  };
  walk(content);
  return found;
}

function fixtureMap() {
  const byUrl = new Map();
  for (const check of fixture.checks) {
    byUrl.set(normalise(check.url), check);
  }
  for (const entry of fixture.absent) {
    byUrl.set(normalise(entry.url), { ...entry, expect: entry.observed, method: "GET" });
  }
  return byUrl;
}

async function request(url, method = "GET") {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25_000);
  try {
    const response = await fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "paxdev-verify-urls/1.0" },
    });
    return response.status;
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(`timeout after 25s: ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

const published = collectPublishedUrls();
const known = fixtureMap();
const failures = [];

// content must not publish a host the fixture never saw
for (const url of published) {
  if (!known.has(normalise(url))) {
    failures.push(`content publishes ${url} but content/verified-urls.json has no entry for it`);
  }
}

// hosted blocks must be 200 in the fixture
for (const system of content.aiSystems) {
  if (!system.hosted) continue;
  const entry = known.get(normalise(system.hosted.url));
  if (!entry) {
    failures.push(`${system.slug} hosted ${system.hosted.url} missing from fixture`);
    continue;
  }
  if (entry.observed !== 200) {
    failures.push(
      `${system.slug} hosted ${system.hosted.url} fixture observed ${entry.observed}, not 200`,
    );
  }
}

// never allow Ipsura
const serialised = JSON.stringify(content) + JSON.stringify(fixture);
if (/https:\/\/production-rag\.vercel\.app/.test(serialised)) {
  failures.push("production-rag.vercel.app (Ipsura) must never appear in content or the fixture");
}

if (content.site.lastVerified !== fixture.verifiedAt) {
  failures.push(
    `site.lastVerified (${content.site.lastVerified}) !== fixture.verifiedAt (${fixture.verifiedAt})`,
  );
}

if (contentOnly) {
  if (failures.length) {
    console.error("verify:urls --content-only FAILED");
    for (const line of failures) console.error(`  - ${line}`);
    process.exit(1);
  }
  console.log(`verify:urls --content-only OK (${published.size} hosted URLs covered by fixture)`);
  process.exit(0);
}

// live re-curl every fixture check
const nextChecks = [];
for (const check of fixture.checks) {
  process.stdout.write(`${check.method || "GET"} ${check.url} … `);
  try {
    const observed = await request(check.url, check.method || "GET");
    process.stdout.write(`${observed}\n`);
    if (observed !== check.expect) {
      failures.push(`${check.url} expected ${check.expect}, got ${observed}`);
    }
    nextChecks.push({ ...check, observed });
  } catch (error) {
    process.stdout.write("ERR\n");
    failures.push(`${check.url}: ${error.message}`);
    nextChecks.push(check);
  }
}

// confirm absent hosts are still not 200
const nextAbsent = [];
for (const entry of fixture.absent) {
  process.stdout.write(`ABSENT probe ${entry.url} … `);
  try {
    const observed = await request(entry.url);
    process.stdout.write(`${observed}\n`);
    if (observed === 200) {
      failures.push(
        `${entry.url} returned 200 — promote it to checks and publish it, do not keep it absent`,
      );
    }
    nextAbsent.push({ ...entry, observed });
  } catch {
    process.stdout.write("ERR (still absent)\n");
    nextAbsent.push({ ...entry, observed: entry.observed });
  }
}

if (writeMode && failures.length === 0) {
  const today = new Date().toISOString().slice(0, 10);
  const next = {
    ...fixture,
    verifiedAt: today,
    checks: nextChecks,
    absent: nextAbsent,
  };
  writeFileSync(fixturePath, `${JSON.stringify(next, null, 2)}\n`);
  content.site.lastVerified = today;
  writeFileSync(contentPath, `${JSON.stringify(content, null, 2)}\n`);
  console.log(`wrote ${fixturePath} and updated site.lastVerified to ${today}`);
}

if (failures.length) {
  console.error("verify:urls FAILED");
  for (const line of failures) console.error(`  - ${line}`);
  process.exit(1);
}

console.log(
  `verify:urls OK — ${fixture.checks.length} checks, ${published.size} content hosts, verifiedAt ${fixture.verifiedAt}`,
);
