/**
 * Offline (default): content/pins.json must agree with content/portfolio.json.
 * --live: also compare origin/main (gh) and hosted health (curl) to pins.json.
 *
 * Week 1 scaffold for the anti-rot pipeline (see docs/SEASON.md §3).
 * Wire into CI offline always; --live on schedule / main.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const live = process.argv.includes("--live");
const pins = JSON.parse(readFileSync(join(root, "content", "pins.json"), "utf8"));
const content = JSON.parse(readFileSync(join(root, "content", "portfolio.json"), "utf8"));
const verified = JSON.parse(
  readFileSync(join(root, "content", "verified-urls.json"), "utf8"),
);

const failures = [];
const fail = (msg) => failures.push(msg);

if (pins.pinnedAt !== content.site.lastVerified) {
  fail(
    `pins.pinnedAt (${pins.pinnedAt}) !== site.lastVerified (${content.site.lastVerified})`,
  );
}
if (pins.pinnedAt !== verified.verifiedAt) {
  fail(
    `pins.pinnedAt (${pins.pinnedAt}) !== verified-urls.verifiedAt (${verified.verifiedAt})`,
  );
}

// Same rule as tests/systems.test.mjs: content + verified must never *cite* the Ipsura URL.
// pins.json may list it under forbiddenHosts as a denylist entry.
const published = JSON.stringify(content) + JSON.stringify(verified);
if (/https:\/\/production-rag\.vercel\.app/.test(published)) {
  fail("Ipsura host https://production-rag.vercel.app must never be cited as a portfolio URL");
}

for (const pin of pins.systems) {
  const system = content.aiSystems.find((s) => s.slug === pin.slug);
  if (!system) {
    fail(`portfolio missing system ${pin.slug}`);
    continue;
  }

  const main = /main ([0-9a-f]{7,40})/.exec(system.phase);
  if (!main || !main[1].startsWith(pin.main)) {
    fail(
      `${pin.id} phase main is ${main?.[1] ?? "(missing)"}; pins.json expects ${pin.main}`,
    );
  }
  if (!system.phase.includes(pin.release)) {
    fail(`${pin.id} phase must claim release ${pin.release}; got: ${system.phase}`);
  }

  if (pin.mode === "CLONE") {
    if (system.hosted !== null) {
      fail(`${pin.id} is CLONE in pins but portfolio has hosted ${system.hosted?.url}`);
    }
    if (system.page?.cta?.kind !== "clone") {
      fail(`${pin.id} CTA must be clone`);
    }
  } else {
    if (!system.hosted || system.hosted.url !== pin.host) {
      fail(
        `${pin.id} hosted URL is ${system.hosted?.url ?? "null"}; pins expect ${pin.host}`,
      );
    }
    const inFixture = verified.checks.some(
      (c) => c.url.replace(/\/$/, "") === pin.host.replace(/\/$/, "") && c.observed === 200,
    );
    if (!inFixture) {
      fail(`${pin.id} host ${pin.host} lacks observed 200 in verified-urls.json`);
    }
  }

  const kitBeat = content.interviewKit?.beats?.find((b) => b.system === pin.slug);
  if (kitBeat) {
    if (kitBeat.sha !== pin.main) {
      fail(`interview beat ${pin.slug} sha ${kitBeat.sha} !== pins ${pin.main}`);
    }
    if (pin.mode === "HOSTED" && kitBeat.host !== pin.host) {
      fail(`interview beat ${pin.slug} host ${kitBeat.host} !== pins ${pin.host}`);
    }
    if (pin.mode === "CLONE" && kitBeat.host !== null) {
      fail(`interview beat ${pin.slug} must have host null`);
    }
  }

  // Capture or evidence must pin the short SHA
  const pinnedEvidence =
    [system.capture, system.secondaryCapture]
      .filter(Boolean)
      .some((c) => c.sourceUrl.includes(pin.main)) ||
    system.evidence.some((e) => e.url.includes(pin.main));
  if (!pinnedEvidence) {
    fail(`${pin.id} claims main ${pin.main} but no capture/evidence URL includes it`);
  }
}

/*
 * Every commit-shaped string anywhere in the published content must be one this file knows
 * about. The checks above only reach `phase` and `interviewKit.beats[].sha`, so a SHA written
 * into prose -- a capability bullet, a CTA note, an interview rationale -- drifted silently:
 * P4 carried 4de0ac6 through twelve commits of its own repo and nothing failed, because
 * nothing was looking. A reader cannot tell a current SHA from a stale one by looking at it,
 * which is exactly why it has to be machine-checked.
 *
 * A SHA that genuinely refers to a past moment ("after X, the catalog decides...") belongs in
 * historicalShas in pins.json, with a reason. That makes keeping one a decision someone wrote
 * down, rather than an omission nobody noticed.
 */
const knownShas = new Set();
for (const pin of pins.systems) {
  knownShas.add(pin.main);
  knownShas.add(pin.mainFull);
  if (pin.releaseTagTarget) knownShas.add(pin.releaseTagTarget);
}
for (const entry of pins.historicalShas ?? []) {
  knownShas.add(entry.sha);
}

const shaLike = /\b[0-9a-f]{7,40}\b/g;
const seen = new Map();
for (const [label, blob] of [
  ["portfolio.json", JSON.stringify(content)],
  ["verified-urls.json", JSON.stringify(verified)],
]) {
  for (const match of blob.match(shaLike) ?? []) {
    // Hex-only words that are not commits: colours, hashes of assets, ids.
    if (/^\d+$/.test(match)) continue;
    if (knownShas.has(match)) continue;
    if ([...knownShas].some((known) => known.startsWith(match) || match.startsWith(known))) {
      continue;
    }
    seen.set(match, label);
  }
}
for (const [sha, label] of seen) {
  fail(
    `${label} cites ${sha}, which is neither a pinned SHA nor listed in pins.historicalShas`,
  );
}

// Poster subtitle must name all five short SHAs
const poster = content.architecturePoster?.subtitle ?? "";
for (const pin of pins.systems) {
  if (!poster.includes(pin.main)) {
    fail(`architecturePoster.subtitle missing pin ${pin.id} ${pin.main}`);
  }
}

// P1 must not claim PR #3 is still open / not shipped (the UI column label "NOT SHIPPED"
// for planned work lives in page.tsx, not in portfolio system copy).
const p1 = content.aiSystems.find((s) => s.slug === "production-rag");
const p1Blob = JSON.stringify(p1);
if (/PR #3[\s\S]{0,80}NOT SHIPPED|NOT SHIPPED[\s\S]{0,40}main|is OPEN and NOT SHIPPED/i.test(p1Blob)) {
  fail("P1 still claims PR #3 NOT SHIPPED — PR #3 is merged; clear that copy");
}
if (/PR #3[\s\S]{0,40}is OPEN/i.test(p1Blob)) {
  fail("P1 still claims PR #3 is OPEN — it is merged on main");
}

if (live) {
  for (const pin of pins.systems) {
    const gh = spawnSync(
      "gh",
      ["api", `repos/${pin.repo}/commits/main`, "--jq", ".sha"],
      { encoding: "utf8" },
    );
    if (gh.status !== 0) {
      fail(`gh main for ${pin.repo}: ${gh.stderr || gh.stdout}`);
      continue;
    }
    const liveSha = gh.stdout.trim();
    if (!liveSha.startsWith(pin.main) && liveSha !== pin.mainFull) {
      fail(
        `SHA drift ${pin.id} ${pin.repo}: pins ${pin.mainFull} live main ${liveSha}`,
      );
    }

    if (pin.health?.url) {
      try {
        const res = await fetch(pin.health.url, { redirect: "follow" });
        if (res.status !== pin.health.expect) {
          fail(
            `health ${pin.health.url} expected ${pin.health.expect} got ${res.status}`,
          );
        }
      } catch (err) {
        fail(`health fetch failed ${pin.health.url}: ${err.message}`);
      }
    }
  }
}

if (failures.length) {
  console.error(`check-pins ${live ? "--live " : ""}FAIL (${failures.length})`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log(
  `check-pins ${live ? "--live " : ""}OK — ${pins.systems.length} systems, pinnedAt ${pins.pinnedAt}`,
);
