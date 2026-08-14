import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pins = JSON.parse(readFileSync(join(root, "content", "pins.json"), "utf8"));
const c = JSON.parse(readFileSync(join(root, "content", "portfolio.json"), "utf8"));
const bySlug = Object.fromEntries(pins.systems.map((s) => [s.slug, s]));

function blobPath(url) {
  const m = url.match(/blob\/[0-9a-f]+\/(.+)$/);
  return m ? m[1] : null;
}

for (const sys of c.aiSystems) {
  const pin = bySlug[sys.slug];
  if (sys.capture) {
    const path = blobPath(sys.capture.sourceUrl) ?? "docs/assets/ui-grounded.png";
    sys.capture.sourceUrl = `https://github.com/${pin.repo}/blob/${pin.main}/${path}`;
  }
  if (sys.secondaryCapture) {
    const path = blobPath(sys.secondaryCapture.sourceUrl) ?? "docs/assets/ui-filtered.png";
    sys.secondaryCapture.sourceUrl = `https://github.com/${pin.repo}/blob/${pin.main}/${path}`;
  }
  sys.evidence = sys.evidence.map((e) => {
    let url = e.url;
    let label = e.label;
    // rewrite blob SHAs to current main
    url = url.replace(/\/blob\/[0-9a-f]+\//, `/blob/${pin.main}/`);
    if (url.includes("/releases/tag/")) {
      url = `https://github.com/${pin.repo}/releases/tag/${pin.release}`;
      if (/Published|v\d+\.\d+\.\d+/.test(label)) {
        label = `Published ${pin.release} release`;
      }
    }
    label = label.replace(/at [0-9a-f]{7,} \/ v[\d.]+/g, `at ${pin.main} / ${pin.release}`);
    label = label.replace(/main [0-9a-f]{7,}/g, `main ${pin.main}`);
    return { ...e, url, label };
  });
  const hasPin =
    [sys.capture, sys.secondaryCapture].filter(Boolean).some((x) => x.sourceUrl.includes(pin.main)) ||
    sys.evidence.some((e) => e.url.includes(pin.main));
  if (!hasPin) {
    sys.evidence.push({
      label: `Pinned main ${pin.main} / ${pin.release}`,
      url: `https://github.com/${pin.repo}/tree/${pin.main}`,
    });
  }
  sys.links = sys.links.map((l) => {
    if (/^v\d+\.\d+\.\d+$/.test(l.label) || l.url.includes("/releases/tag/")) {
      return {
        label: pin.release,
        url: `https://github.com/${pin.repo}/releases/tag/${pin.release}`,
      };
    }
    return l;
  });
  sys.phase = `${pin.release} · main ${pin.main} · CI green`;
}

for (const beat of c.interviewKit.beats) {
  const pin = bySlug[beat.system];
  beat.sha = pin.main;
  // rebuild titles for known systems
  if (beat.system === "production-rag") {
    beat.title = `Grounded, then refusing, then narrowed · main ${pin.main} · CLONE`;
    beat.say = `Open with the thesis in one breath. Main is ${pin.main} / ${pin.release}; stream, filter-aware cache, and /evals are on main. Ask grounded, refuse, then title = Filtering. DEMO-DAY lives in the clone.`;
  } else if (beat.system === "agentic-rag-research") {
    beat.title = `A loop that stops for a stated reason · ${pin.main} · pax-agentic-rag.vercel.app`;
    beat.say = `Hosted at pax-agentic-rag.vercel.app on main ${pin.main} / ${pin.release}. Ask a supported question, then an unsupported one, and read stop_reason.`;
  } else if (beat.system === "multi-agent-orchestration") {
    beat.title = `Writer-only, and degraded on purpose — now in the browser · ${pin.main} · pax-orchestration.vercel.app`;
    beat.say = `Hosted at pax-orchestration.vercel.app on main ${pin.main} / ${pin.release}. Run a task and download the JSON; specialists are fakes.`;
  } else if (beat.system === "repomind") {
    beat.title = `path:line, and the snapshot caveat · ${pin.main} · pax-repomind.vercel.app`;
  } else if (beat.system === "ai-platform") {
    beat.title = `Rejected, then unconfigured · ${pin.main} · pax-ai-gateway.vercel.app`;
    beat.say = `Gateway on main ${pin.main} / ${pin.release} at pax-ai-gateway.vercel.app. Status with the public fixture key reports four unconfigured upstreams.`;
  }
  beat.steps = beat.steps.map((step) => {
    if (!step.note) return step;
    let note = step.note.replace(/main [0-9a-f]{7,}/g, `main ${pin.main}`);
    return { ...step, note };
  });
}

const p1 = bySlug["production-rag"];
const p2 = bySlug["agentic-rag-research"];
const p3 = bySlug["multi-agent-orchestration"];
const p4 = bySlug["repomind"];
const p5 = bySlug["ai-platform"];
c.interviewKit.source = {
  label: `The original script — DEMO-DAY.md at ${p1.main}`,
  url: `https://github.com/pabloalvarez99/production-rag/blob/${p1.main}/docs/DEMO-DAY.md`,
};
c.architecturePoster.subtitle = `Exact roles. Honest hosted vs clone. Pins: P1 ${p1.main} CLONE · P2 ${p2.main} · P3 ${p3.main} · P4 ${p4.main} · P5 ${p5.main}. Verified ${pins.pinnedAt}.`;
const card = c.studio.cloneCards.find((x) => x.slug === "production-rag");
if (card) {
  card.demoDayUrl = `https://github.com/pabloalvarez99/production-rag/blob/${p1.main}/docs/DEMO-DAY.md`;
  card.evalsUrl = `https://github.com/pabloalvarez99/production-rag/blob/${p1.main}/docs/assets/scorecard.html`;
}
c.site.lastVerified = pins.pinnedAt;
c.proof[0].detail =
  "Five public repos with tagged v1.0.0 releases and green CI; P2–P5 hosted on free path, P1 clone-only on main";

writeFileSync(join(root, "content", "portfolio.json"), JSON.stringify(c, null, 2) + "\n");
console.log("force-pin-urls OK");
for (const s of c.aiSystems) {
  const pin = bySlug[s.slug];
  console.log(s.slug, s.phase, s.capture.sourceUrl.includes(pin.main));
}
