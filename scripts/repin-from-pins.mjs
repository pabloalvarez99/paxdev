/**
 * One-shot Week 1 helper: rewrite content/portfolio.json SHAs and honesty lines
 * from content/pins.json. Not a substitute for human review of page.live/planned.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pins = JSON.parse(readFileSync(join(root, "content", "pins.json"), "utf8"));
const bySlug = Object.fromEntries(pins.systems.map((s) => [s.slug, s]));
const p1 = bySlug["production-rag"];
const p2 = bySlug["agentic-rag-research"];
const p3 = bySlug["multi-agent-orchestration"];
const p4 = bySlug["repomind"];
const p5 = bySlug["ai-platform"];

const content = JSON.parse(readFileSync(join(root, "content", "portfolio.json"), "utf8"));
content.site.lastVerified = pins.pinnedAt;
content.proof[0].detail =
  "Five public repos with tagged v1.0.0 releases and green CI; P2–P5 hosted on free path, P1 clone-only on main after PR #3 merge";

function pinPhase(sys) {
  return `${sys.release} · main ${sys.main} · CI green`;
}

const oldBySlug = {
  "production-rag": ["1cd8e4b", "d43f812", "678c554"],
  "agentic-rag-research": ["d62917d", "8bde9c9"],
  "multi-agent-orchestration": ["8155274", "78b3910"],
  repomind: ["5d4eefe", "bffc329", "0f91b7c"],
  "ai-platform": ["e9bec1b", "f0b5abc", "eba1e22"],
};

function replaceOld(text, olds, neu) {
  let out = text;
  for (const old of olds) out = out.split(old).join(neu);
  return out;
}

function rePinSystem(system, pin) {
  const olds = oldBySlug[system.slug] ?? [];
  system.phase = pinPhase(pin);

  system.evidence = system.evidence.map((e) => {
    let label = replaceOld(e.label, olds, pin.main);
    let url = replaceOld(e.url, olds, pin.main);
    label = label.replace(/v0\.2\.0/g, pin.release);
    if (/Published v0\.\d+\.\d+/.test(e.label) || /releases\/tag\/v0\.\d+\.\d+/.test(e.url)) {
      if (e.label.startsWith("Published") || /Published v0/.test(e.label)) {
        return {
          label: `Published ${pin.release} release`,
          url: `https://github.com/${pin.repo}/releases/tag/${pin.release}`,
        };
      }
    }
    if (/releases\/tag\/v0\.\d+\.\d+/.test(url) && !url.includes(pin.release)) {
      url = `https://github.com/${pin.repo}/releases/tag/${pin.release}`;
    }
    label = label.replace(/at [0-9a-f]{7,} \/ v[\d.]+/g, `at ${pin.main} / ${pin.release}`);
    label = label.replace(/\/ v0\.2\.0/g, ` / ${pin.release}`);
    return { ...e, label, url };
  });

  system.links = system.links.map((l) => {
    if (/^v\d+\.\d+\.\d+$/.test(l.label)) {
      return {
        label: pin.release,
        url: `https://github.com/${pin.repo}/releases/tag/${pin.release}`,
      };
    }
    return l;
  });
  if (
    system.status === "LIVE" &&
    !system.links.some((l) => l.label === pin.release)
  ) {
    system.links.push({
      label: pin.release,
      url: `https://github.com/${pin.repo}/releases/tag/${pin.release}`,
    });
  }

  if (system.capture) {
    system.capture.sourceUrl = replaceOld(system.capture.sourceUrl, olds, pin.main);
  }
  if (system.secondaryCapture) {
    system.secondaryCapture.sourceUrl = replaceOld(
      system.secondaryCapture.sourceUrl,
      olds,
      pin.main,
    );
  }

  system.page.live = system.page.live.map((line) =>
    replaceOld(line, olds, pin.main).replace(/v0\.2\.0/g, pin.release),
  );
  system.page.planned = system.page.planned.map((line) =>
    replaceOld(line, olds, pin.main),
  );
  if (system.page.cta?.note) {
    system.page.cta.note = replaceOld(system.page.cta.note, olds, pin.main)
      .replace(/version 0\.2\.0/g, "version 1.0.0")
      .replace(/v0\.2\.0/g, pin.release);
  }
}

// P1 special honesty
const s1 = content.aiSystems[0];
rePinSystem(s1, p1);
s1.evidence = s1.evidence.filter((e) => !/NOT SHIPPED/i.test(e.label));
if (!s1.evidence.some((e) => /stream|evals|filter-aware/i.test(e.label))) {
  s1.evidence.splice(4, 0, {
    label: `Stream, filter-aware cache, scorecard /evals at ${p1.main} / ${p1.release} (PR #3 merged)`,
    url: `https://github.com/pabloalvarez99/production-rag/blob/${p1.main}/docs/SHIP.md`,
  });
}
s1.page.live = s1.page.live.map((line) =>
  line.replace(
    /carrying the allowlisted metadata filter control merged at \S+\./,
    `carrying the allowlisted metadata filter control, additive stream, and filter-aware cache on main ${p1.main}.`,
  ),
);
if (!s1.page.live.some((l) => /stream|\/evals/i.test(l))) {
  s1.page.live.push(
    `Additive POST /v1/query/stream, filter-aware cache, and /evals scorecard replay shipped on main ${p1.main} / ${p1.release} (PR #3 merged).`,
  );
}
s1.page.planned = s1.page.planned.filter(
  (line) => !/PR #3|NOT SHIPPED|d43f812|OPEN and/i.test(line),
);
if (!s1.page.planned.some((l) => /Not hosted/i.test(l))) {
  s1.page.planned.push(
    "Not hosted. Hybrid retrieval needs a local Qdrant, so this system is clone-and-run until that changes. Never cite production-rag.vercel.app (Ipsura).",
  );
}
while (s1.page.planned.length < 3) {
  s1.page.planned.push(
    "No authentication, authorization, or rate limiting on the free path — that boundary is P5's.",
  );
}

rePinSystem(content.aiSystems[1], p2);
content.aiSystems[1].page.cta.note =
  `No clone, no key. Ask a question the fixture cannot support and read the typed refuse. Hosted health reports version 1.0.0; GET /health and GET /metrics both returned 200 on ${pins.pinnedAt}.`;
if (!content.aiSystems[1].page.live.some((l) => /0\.3\.0|compare/i.test(l))) {
  content.aiSystems[1].page.live.push(
    `Hosted health reports version 1.0.0 on main ${p2.main}; free path remains fixture-only.`,
  );
}

rePinSystem(content.aiSystems[2], p3);
content.aiSystems[2].page.cta.note =
  `No clone, no key. Health returned {"status":"ok"} on ${pins.pinnedAt}. Submit a task in the console, or POST /v1/tasks, and read the ordered trace. Hosted free path on main ${p3.main} / ${p3.release}.`;

rePinSystem(content.aiSystems[3], p4);

rePinSystem(content.aiSystems[4], p5);
content.aiSystems[4].page.cta.note =
  `No clone. Open /health without a key (200). /v1/platform/status is 401 without a header; X-API-Key: dev-local returns gateway up with four unconfigured upstreams and version 1.0.0. Main ${p5.main} / ${p5.release}.`;

// Interview kit
const kit = content.interviewKit;
kit.source = {
  label: `The original script — DEMO-DAY.md at ${p1.main}`,
  url: `https://github.com/pabloalvarez99/production-rag/blob/${p1.main}/docs/DEMO-DAY.md`,
};
const beatMap = {
  "production-rag": p1,
  "agentic-rag-research": p2,
  "multi-agent-orchestration": p3,
  repomind: p4,
  "ai-platform": p5,
};

kit.beats = kit.beats.map((beat) => {
  const pin = beatMap[beat.system];
  const oldSha = beat.sha;
  const olds = [oldSha, ...(oldBySlug[beat.system] ?? [])];
  beat.sha = pin.main;
  beat.title = replaceOld(beat.title, olds, pin.main).replace(/v0\.2\.0/g, pin.release);
  beat.say = replaceOld(beat.say, olds, pin.main)
    .replace(/v0\.2\.0/g, pin.release)
    .replace(
      /PR #3 \(stream, filter-aware cache, \/evals\) is OPEN and NOT SHIPPED\.?/g,
      `PR #3 (stream, filter-aware cache, /evals) is MERGED on main ${pin.main}.`,
    );
  beat.steps = beat.steps.map((step) => {
    const out = { ...step };
    if (out.note) {
      out.note = replaceOld(out.note, olds, pin.main).replace(/v0\.2\.0/g, pin.release);
    }
    if (out.url && typeof out.url === "string" && out.url.includes("github.com")) {
      out.url = replaceOld(out.url, olds, pin.main);
    }
    return out;
  });

  if (beat.system === "production-rag") {
    beat.title = `Grounded, then refusing, then narrowed · main ${p1.main} · CLONE`;
    beat.say =
      `Open with the thesis in one breath: a retrieval system is only as good as the evidence it can show for its own behaviour. Main is ${p1.main} / ${p1.release}; PR #3 (stream, filter-aware cache, /evals) is MERGED. Then ask three questions in an order that carries the argument — including title = Filtering — and point at DEMO-DAY in the repo.`;
    if (!beat.steps.some((s) => /DEMO-DAY|evals/i.test(JSON.stringify(s)))) {
      beat.steps.push({
        kind: "link",
        value: "DEMO-DAY + /evals in the repo",
        url: `https://github.com/pabloalvarez99/production-rag/blob/${p1.main}/docs/DEMO-DAY.md`,
        note: "Clone card only: stream path, Filtering chip, and scorecard live in-repo. Never open production-rag.vercel.app (Ipsura).",
      });
    }
  }
  if (beat.system === "agentic-rag-research") {
    beat.title = `A loop that stops for a stated reason · ${p2.main} · pax-agentic-rag.vercel.app`;
    beat.say =
      `The interesting output of an agent is not the answer. It is the record of why it stopped. Hosted at pax-agentic-rag.vercel.app on main ${p2.main} / ${p2.release}. Ask a question the corpus supports, then one it does not, and read stop_reason as a field.`;
  }
  if (beat.system === "multi-agent-orchestration") {
    beat.title = `Writer-only, and degraded on purpose — now in the browser · ${p3.main} · pax-orchestration.vercel.app`;
    beat.say =
      `A multi-agent system without budgets is a system that can bill you forever. Hosted at pax-orchestration.vercel.app on main ${p3.main} / ${p3.release}. Open the console, run a task, download the JSON; specialists are fakes on purpose.`;
  }
  if (beat.system === "repomind") {
    beat.title = `path:line, and the snapshot caveat · ${p4.main} · pax-repomind.vercel.app`;
  }
  if (beat.system === "ai-platform") {
    beat.title = `Rejected, then unconfigured · ${p5.main} · pax-ai-gateway.vercel.app`;
    beat.say =
      `This is a gateway on main ${p5.main} / ${p5.release} at pax-ai-gateway.vercel.app, and there is nothing behind it right now. The four upstream URLs are empty, so the console says unconfigured rather than pretending. Status reports version 1.0.0 with the public fixture key.`;
  }
  return beat;
});

kit.divergence =
  `DEMO-DAY.md at ${p1.main} may still describe localhost-first ports for the flagship free path. Four systems are hosted now (P2–P5). This page is the re-cut for the portfolio hosts. P1 stays clone-only; PR #3 is merged on main ${p1.main}. Never cite production-rag.vercel.app (Ipsura).`;

content.architecturePoster.subtitle =
  `Exact roles. Honest hosted vs clone. Pins: P1 ${p1.main} CLONE · P2 ${p2.main} · P3 ${p3.main} · P4 ${p4.main} · P5 ${p5.main}. Verified ${pins.pinnedAt}.`;

// Final global scrub for any leftover stale short SHAs in the whole document
const stalePairs = [
  ["1cd8e4b", p1.main],
  ["d62917d", p2.main],
  ["8155274", p3.main],
  ["5d4eefe", p4.main],
  ["e9bec1b", p5.main],
  ["f0b5abc", p5.main],
];
let raw = JSON.stringify(content);
for (const [from, to] of stalePairs) {
  raw = raw.split(from).join(to);
}
const finalContent = JSON.parse(raw);
finalContent.interviewKit.divergence = kit.divergence;
finalContent.architecturePoster.subtitle = content.architecturePoster.subtitle;
finalContent.aiSystems[0].page.planned = finalContent.aiSystems[0].page.planned.filter(
  (line) => !/NOT SHIPPED|PR #3 is OPEN/i.test(line),
);

writeFileSync(
  join(root, "content", "portfolio.json"),
  JSON.stringify(finalContent, null, 2) + "\n",
);

console.log("portfolio.json re-pinned from pins.json");
for (const s of finalContent.aiSystems) {
  console.log(`  ${s.slug}: ${s.phase} | ${s.hosted?.url ?? "CLONE"}`);
}
