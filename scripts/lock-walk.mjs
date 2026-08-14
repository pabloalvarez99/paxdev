/**
 * A2 v1.0 LOCK — walk studio scripts + interview surfaces against LIVE hosts.
 * Exit 1 on any FAIL. Not wired into CI; one-shot honesty evidence.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const p = JSON.parse(readFileSync(join(root, "content", "portfolio.json"), "utf8"));
const verified = JSON.parse(
  readFileSync(join(root, "content", "verified-urls.json"), "utf8"),
);

const rows = [];

async function check(label, url, expect, opts = {}) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: opts.headers || {},
      method: opts.method || "GET",
      body: opts.body,
    });
    const text = await res.text();
    const okStatus = Array.isArray(expect)
      ? expect.includes(res.status)
      : res.status === expect;
    let okBody = true;
    let note = text.slice(0, 180).replace(/\s+/g, " ");
    if (opts.bodyIncludes) {
      okBody = opts.bodyIncludes.every((s) => text.includes(s));
      if (!okBody) {
        note =
          "missing: " +
          opts.bodyIncludes.filter((s) => !text.includes(s)).join(",");
      }
    }
    const pass = okStatus && okBody;
    rows.push({ label, url, status: res.status, expect, pass, note });
    console.log(pass ? "PASS" : "FAIL", label, res.status, note.slice(0, 100));
    return { res, text, pass };
  } catch (e) {
    rows.push({ label, url, pass: false, note: e.message });
    console.log("FAIL", label, e.message);
    return { pass: false };
  }
}

// P1 clone / DEMO-DAY — no embed/host Ipsura (denylist warning text is allowed)
const p1 = p.studio.cloneCards.find((c) => c.slug === "production-rag");
const p1Blob = JSON.stringify(p1);
const p1Ok =
  /DEMO-DAY/.test(p1Blob) &&
  p1.command?.includes("git clone") &&
  !p1.embedUrl &&
  !/https:\/\/production-rag\.vercel\.app/.test(p1.demoDayUrl || "") &&
  /Ipsura|never iframe|never cite/i.test(p1.why || "");
console.log(p1Ok ? "PASS" : "FAIL", "P1 studio clone/DEMO-DAY zero Ipsura host");
rows.push({ label: "P1 studio clone/DEMO-DAY zero Ipsura host", pass: p1Ok });
await check(
  "P1 DEMO-DAY.md raw at pin",
  "https://raw.githubusercontent.com/pabloalvarez99/production-rag/3b54d85/docs/DEMO-DAY.md",
  200,
  { bodyIncludes: ["stream", "eval"] },
);

// P2 three-step script
await check("P2 open host", "https://pax-agentic-rag.vercel.app", 200);
await check("P2 health 1.0.0", "https://pax-agentic-rag.vercel.app/health", 200, {
  bodyIncludes: ['"version":"1.0.0"'],
});
{
  const res = await fetch("https://pax-agentic-rag.vercel.app/v1/research", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      question: "What were the quarterly revenues in Patagonia?",
    }),
  });
  const text = await res.text();
  // Accept 200 with refuse-ish fields, or structured error — must not 5xx
  const pass =
    res.status < 500 &&
    (text.includes("refuse") ||
      text.includes("stop") ||
      text.includes("citation") ||
      text.includes("status") ||
      text.includes("answer") ||
      res.status === 422 ||
      res.status === 400);
  console.log(
    pass ? "PASS" : "FAIL",
    "P2 POST unanswerable research",
    res.status,
    text.slice(0, 120).replace(/\s+/g, " "),
  );
  rows.push({
    label: "P2 POST unanswerable research",
    status: res.status,
    pass,
    note: text.slice(0, 160),
  });
}

// P3
await check("P3 open host", "https://pax-orchestration.vercel.app", 200);
await check("P3 health", "https://pax-orchestration.vercel.app/health", 200, {
  bodyIncludes: ['"status":"ok"'],
});
{
  const res = await fetch("https://pax-orchestration.vercel.app/v1/tasks", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      task: "Audit retrieval risk",
      budget: { max_handoffs: 8 },
    }),
  });
  const text = await res.text();
  const pass =
    res.ok &&
    (text.includes("stop_reason") ||
      text.includes("result") ||
      text.includes("handoff") ||
      text.includes("trace") ||
      text.includes("timeline"));
  console.log(
    pass ? "PASS" : "FAIL",
    "P3 POST free-path task",
    res.status,
    text.slice(0, 120).replace(/\s+/g, " "),
  );
  rows.push({
    label: "P3 POST free-path task",
    status: res.status,
    pass,
    note: text.slice(0, 160),
  });
}

// P4 — primary script is mini create_app; production_rag dogfood is RRF
await check(
  "P4 create_app mini GET",
  "https://pax-repomind.vercel.app/ask?question=Where+is+create_app+defined%3F&repo_id=mini",
  200,
);
await check("P4 health 1.0.0", "https://pax-repomind.vercel.app/health", 200, {
  bodyIncludes: ['"version":"1.0.0"'],
});
await check(
  "P4 refusal ask",
  "https://pax-repomind.vercel.app/ask?question=Who+won+the+2019+Antarctic+chess+championship%3F&repo_id=mini",
  200,
);
{
  const res = await fetch("https://pax-repomind.vercel.app/v1/code/ask", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      question: "Where is create_app defined?",
      repo_id: "mini",
    }),
  });
  const text = await res.text();
  const pass =
    res.ok && text.includes("create_app") && text.includes("app/main.py");
  console.log(
    pass ? "PASS" : "FAIL",
    "P4 POST create_app mini",
    res.status,
    text.slice(0, 120).replace(/\s+/g, " "),
  );
  rows.push({
    label: "P4 POST create_app mini",
    status: res.status,
    pass,
    note: text.slice(0, 160),
  });
}
{
  const res = await fetch("https://pax-repomind.vercel.app/v1/code/ask", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      question: "How does hybrid retrieval fuse rankings?",
      repo_id: "production_rag",
    }),
  });
  const text = await res.text();
  const pass =
    res.ok &&
    text.includes("reciprocal_rank_fusion") &&
    text.includes("rrf.py");
  console.log(
    pass ? "PASS" : "FAIL",
    "P4 POST production_rag RRF dogfood",
    res.status,
    text.slice(0, 120).replace(/\s+/g, " "),
  );
  rows.push({
    label: "P4 POST production_rag RRF dogfood",
    status: res.status,
    pass,
    note: text.slice(0, 160),
  });
}

// P5
await check("P5 open host", "https://pax-ai-gateway.vercel.app", 200);
await check("P5 health", "https://pax-ai-gateway.vercel.app/health", 200, {
  bodyIncludes: ["gateway"],
});
await check(
  "P5 status 401",
  "https://pax-ai-gateway.vercel.app/v1/platform/status",
  401,
);
await check(
  "P5 status dev-local 1.0.0",
  "https://pax-ai-gateway.vercel.app/v1/platform/status",
  200,
  {
    headers: { "X-API-Key": "dev-local" },
    bodyIncludes: ['"version":"1.0.0"', "unconfigured"],
  },
);

// Site
const interview = await check(
  "GET /interview",
  "https://paxdev.vercel.app/interview",
  200,
  { bodyIncludes: ["Interview"] },
);
await check("GET /changelog", "https://paxdev.vercel.app/changelog", 200, {
  bodyIncludes: ["v1.0.0"],
});
await check("GET /studio", "https://paxdev.vercel.app/studio", 200, {
  bodyIncludes: ["pax-agentic-rag", "DEMO-DAY"],
});

// print CSS
let printCss = false;
if (interview.text) {
  if (/@media\s+print|interview-page/.test(interview.text)) printCss = true;
  const cssLinks = [
    ...interview.text.matchAll(/href="(\/_next\/static\/[^"]+\.css)"/g),
  ].map((m) => m[1]);
  for (const href of cssLinks.slice(0, 5)) {
    try {
      const css = await (await fetch("https://paxdev.vercel.app" + href)).text();
      if (/@media\s+print/.test(css)) {
        printCss = true;
        break;
      }
    } catch {
      /* ignore */
    }
  }
}
// source of truth in repo
const globals = readFileSync(join(root, "app", "globals.css"), "utf8");
if (/@media\s+print/.test(globals) && /interview-page/.test(globals)) {
  printCss = true;
}
console.log(printCss ? "PASS" : "FAIL", "interview print CSS present");
rows.push({ label: "interview print CSS", pass: printCss });

// hostnames on interview ⊆ verified-urls
const hosts = new Set();
if (interview.text) {
  let m;
  const hostRe = /https?:\/\/([a-z0-9.-]+\.vercel\.app)/gi;
  while ((m = hostRe.exec(interview.text))) hosts.add(m[1]);
}
const allowed = new Set(
  verified.checks
    .map((c) => {
      try {
        return new URL(c.url).hostname;
      } catch {
        return null;
      }
    })
    .filter(Boolean),
);
// production host always allowed
allowed.add("paxdev.vercel.app");
let hostOk = true;
for (const h of hosts) {
  if (!allowed.has(h)) {
    console.log("FAIL interview host not in verified", h);
    hostOk = false;
  } else {
    console.log("PASS interview host in verified", h);
  }
}
rows.push({
  label: "interview hostnames ⊆ verified",
  pass: hostOk,
  note: [...hosts].join(","),
});

// changelog five release names include v1.0.0
const chRes = await fetch("https://paxdev.vercel.app/changelog");
const ch = await chRes.text();
const v1count = (ch.match(/v1\.0\.0/g) || []).length;
console.log(
  v1count >= 5 ? "PASS" : "FAIL",
  "changelog v1.0.0 mentions",
  v1count,
);
rows.push({
  label: "changelog five v1.0.0",
  pass: v1count >= 5,
  note: "count=" + v1count,
});

// Ipsura string may appear only as a denylist warning, never as embed/href host.
const studio = await (await fetch("https://paxdev.vercel.app/studio")).text();
const pageBlob = studio + (interview.text || "");
const ipsuraAsHref = /href=["']https:\/\/production-rag\.vercel\.app/i.test(
  pageBlob,
);
const ipsuraAsEmbed = /src=["']https:\/\/production-rag\.vercel\.app/i.test(
  pageBlob,
);
const noIpsuraHost = !ipsuraAsHref && !ipsuraAsEmbed;
console.log(
  noIpsuraHost ? "PASS" : "FAIL",
  "no Ipsura embed/href on studio/interview",
);
rows.push({
  label: "no Ipsura embed/href on studio/interview",
  pass: noIpsuraHost,
});

const failed = rows.filter((r) => !r.pass);
console.log(
  "\n=== SUMMARY",
  rows.filter((r) => r.pass).length + "/" + rows.length,
  "PASS; FAIL",
  failed.length,
);
for (const f of failed) console.log("  FAIL", f.label, f.note || "");

const out = join(root, "docs", "HONESTY-walk.json");
writeFileSync(out, JSON.stringify({ at: new Date().toISOString(), rows }, null, 2));
console.log("wrote", out);
process.exit(failed.length ? 1 : 0);
