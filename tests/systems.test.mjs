import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = new URL("..", import.meta.url).pathname.replace(/^\/(.:\/)/, "$1");
const content = JSON.parse(readFileSync(join(root, "content", "portfolio.json"), "utf8"));
const verified = JSON.parse(readFileSync(join(root, "content", "verified-urls.json"), "utf8"));

const REQUIRED_ROUTES = [
  "/systems/production-rag",
  "/systems/agentic-rag-research",
  "/systems/multi-agent",
  "/systems/repomind",
  "/systems/ai-platform",
];

const normalise = (url) => url.replace(/\/$/, "");
const reachable = new Set(
  verified.checks.filter((check) => check.observed === 200).map((check) => normalise(check.url)),
);
const byStatus = new Map(verified.checks.map((check) => [normalise(check.url), check.observed]));
const absent = new Set(verified.absent.map((entry) => normalise(entry.url)));

/** A URL a page may send a reviewer to: GitHub, or a host we personally observed answering. */
function assertPublishable(url, where) {
  if (url.startsWith("https://github.com/pabloalvarez99/")) {
    return;
  }
  assert.ok(
    byStatus.has(normalise(url)),
    `${where} links ${url}, which is neither a github.com URL nor a URL in content/verified-urls.json`,
  );
  assert.ok(!absent.has(normalise(url)), `${where} links ${url}, which is recorded as absent`);
}

test("every system has the route its page is published at", () => {
  assert.deepEqual(
    content.aiSystems.map((system) => system.route),
    REQUIRED_ROUTES,
  );
  for (const system of content.aiSystems) {
    assert.match(system.route, /^\/systems\/[a-z0-9-]+$/);
  }
});

test("every system page carries the sections a reviewer was promised", () => {
  for (const system of content.aiSystems) {
    const page = system.page;
    assert.ok(page, `${system.name} has no page content`);
    for (const field of ["title", "kicker", "headline", "pitch"]) {
      assert.match(page[field], /\S/, `${system.name} page is missing ${field}`);
    }
    assert.ok(page.pitch.length > 200, `${system.name} needs a real hiring pitch, not a tagline`);
    assert.ok(page.live.length >= 3, `${system.name} must list what is LIVE`);
    assert.ok(
      page.planned.length >= 3,
      `${system.name} must state what is not shipped, in at least as much detail as what is`,
    );
    assert.equal(page.interview.length, 3, `${system.name} needs exactly three interview questions`);
    for (const item of page.interview) {
      assert.match(item.question, /\?$/, `${system.name} interview entries must be questions`);
      assert.ok(item.why.length > 120, `${system.name} interview answers must argue, not assert`);
    }
    assert.ok(page.docs.length >= 3, `${system.name} must link its primary sources`);
  }
});

test("every page links the case study and the SHIP contract it is derived from", () => {
  for (const system of content.aiSystems) {
    const labels = system.page.docs.map((doc) => doc.label).join(" | ");
    assert.match(labels, /Case study/, `${system.name} must link its CASESTUDY`);
    assert.match(labels, /SHIP/, `${system.name} must link its SHIP contract`);
  }
  const flagship = content.aiSystems[0];
  assert.match(
    flagship.page.docs.map((doc) => doc.label).join(" | "),
    /demo-day/i,
    "the flagship must link the demo-day script",
  );
});

test("every CTA and doc link is GitHub or a URL we personally requested", () => {
  for (const system of content.aiSystems) {
    assertPublishable(system.page.cta.url, `${system.name} CTA`);
    for (const doc of system.page.docs) {
      assertPublishable(doc.url, `${system.name} doc "${doc.label}"`);
    }
    assert.match(system.page.cta.command, /^(curl|git clone) /, `${system.name} CTA needs a command`);
    assert.ok(
      ["hosted", "clone"].includes(system.page.cta.kind),
      `${system.name} CTA kind must be hosted or clone`,
    );
    if (system.page.cta.kind === "clone") {
      assert.equal(system.hosted, null, `${system.name} offers a clone CTA but claims a host`);
    } else {
      assert.ok(system.hosted, `${system.name} offers a hosted CTA with no hosted block`);
      assert.ok(
        reachable.has(normalise(system.page.cta.url)),
        `${system.name} hosted CTA must point at a URL observed answering 200`,
      );
    }
  }
});

test("the studio embeds only hosted UIs, and keeps every unhosted system as a clone card", () => {
  const studio = content.studio;
  assert.ok(studio, "the studio needs content");

  const hostedSlugs = content.aiSystems
    .filter((system) => system.hosted !== null)
    .map((system) => system.slug);
  assert.deepEqual(
    studio.embeds.map((embed) => embed.slug),
    hostedSlugs,
    "the studio must embed exactly the hosted systems, in ladder order",
  );
  assert.deepEqual(
    studio.cloneCards.map((card) => card.slug),
    content.aiSystems.filter((system) => system.hosted === null).map((system) => system.slug),
    "every system without a host must appear as a clone card",
  );
  assert.ok(
    hostedSlugs.includes("multi-agent-orchestration"),
    "P3 is hosted at pax-orchestration; the studio must embed it after /health returned 200",
  );
  assert.deepEqual(
    studio.cloneCards.map((card) => card.slug),
    ["production-rag"],
    "only Production RAG stays clone-only until a real host is verified",
  );

  for (const embed of studio.embeds) {
    const system = content.aiSystems.find((item) => item.slug === embed.slug);
    assert.equal(
      normalise(embed.embedUrl),
      normalise(system.hosted.url),
      `${embed.slug} must embed the same origin its card publishes`,
    );
    assert.ok(reachable.has(normalise(embed.embedUrl)), `${embed.slug} embeds an unverified URL`);
    assert.ok(embed.deepLinks.length > 0, `${embed.slug} needs at least one probe`);
    assert.equal(embed.script.length, 3, `${embed.slug} needs a three-step studio script`);
    const host = new URL(embed.embedUrl).hostname;
    const scriptText = embed.script.join("\n");
    for (const step of embed.script) {
      assert.match(step, /\S/, `${embed.slug} script step must not be empty`);
    }
    assert.ok(
      scriptText.includes(host),
      `${embed.slug} script text must name the live hostname ${host} from the fixture`,
    );
    assert.match(embed.captureSrc, /^\/[a-z0-9-]+\.png$/);
    assert.ok(
      [system.capture, system.secondaryCapture]
        .filter(Boolean)
        .some((capture) => capture.src === embed.captureSrc),
      `${embed.slug} captureSrc must match a capture the system already vendors`,
    );
    // The honesty line has to match what the host actually does, and the two cases are not
    // the same claim. "May be blocked" is true of a host that sends no framing header and
    // false -- overclaiming -- of one that sends X-Frame-Options: DENY, where the frame is
    // not uncertain, it is guaranteed empty. A non-framable embed must say so, name the
    // header, and not be rendered at all.
    assert.equal(
      typeof embed.framable,
      "boolean",
      `${embed.slug} must declare whether its host allows framing`,
    );
    if (embed.framable) {
      assert.match(
        embed.iframeHonesty,
        /can still be blocked/i,
        `${embed.slug} must keep the third-party iframe caveat`,
      );
    } else {
      assert.match(
        embed.iframeHonesty,
        /X-Frame-Options/i,
        `${embed.slug} must name the header that makes the frame impossible`,
      );
      assert.doesNotMatch(
        embed.iframeHonesty,
        /may be blocked/i,
        `${embed.slug} refuses framing outright; "may be blocked" understates it`,
      );
    }
    for (const link of embed.deepLinks) {
      const observed = byStatus.get(normalise(link.url));
      assert.notEqual(
        observed,
        undefined,
        `${embed.slug} publishes ${link.url}, which was never requested`,
      );
      assert.equal(
        observed,
        link.expect,
        `${embed.slug} claims ${link.expect} for ${link.url} but the fixture observed ${observed}`,
      );
      assert.ok(
        link.url.startsWith(embed.embedUrl),
        `${embed.slug} probes ${link.url}, which is not on the embedded origin`,
      );
    }
    assert.ok(embed.boundary.length > 60, `${embed.slug} must state what the hosted copy does not do`);
  }

  for (const card of studio.cloneCards) {
    assert.ok(
      absent.has(normalise(card.absentUrl)),
      `${card.slug} claims ${card.absentUrl} is absent, but the fixture never observed it`,
    );
    assert.match(card.command, /^git clone https:\/\/github\.com\/pabloalvarez99\//);
  }
});

test("no page cites the unrelated production-rag.vercel.app deployment", () => {
  const serialised = JSON.stringify(content) + JSON.stringify(verified);
  assert.doesNotMatch(
    serialised,
    /https:\/\/production-rag\.vercel\.app/,
    "production-rag.vercel.app belongs to another product and must never be cited",
  );
});

test("the site states when it was last verified, and the pages inherit it", () => {
  assert.match(content.site.lastVerified, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(content.site.lastVerified, verified.verifiedAt);

  const systemPage = readFileSync(join(root, "app", "systems", "[system]", "page.tsx"), "utf8");
  const studioPage = readFileSync(join(root, "app", "studio", "page.tsx"), "utf8");
  for (const [name, source] of [
    ["the system page", systemPage],
    ["the studio page", studioPage],
  ]) {
    assert.match(source, /site\.lastVerified/, `${name} must render the verification date`);
  }
});

test("the interview kit is a 45-minute script with publishable steps and an architecture poster", () => {
  const kit = content.interviewKit;
  const poster = content.architecturePoster;
  assert.ok(kit, "interview kit content is required");
  assert.ok(poster, "architecture poster content is required");
  assert.equal(kit.beats.length, 5, "one beat per system");
  assert.equal(poster.layers.length, 5);
  assert.equal(kit.dayOfChecklist.command, "npm run verify:urls");
  assert.match(kit.dayOfChecklist.body, /verified-urls\.json/);

  let minutesCovered = 0;
  for (const beat of kit.beats) {
    assert.match(beat.clock, /^\d+–\d+$/, `${beat.system} needs a minute range`);
    assert.ok(["HOSTED", "CLONE"].includes(beat.mode), `${beat.system} mode must be HOSTED or CLONE`);
    assert.match(beat.sha, /^[0-9a-f]{7,40}$/, `${beat.system} minute mark needs a pinned SHA`);
    assert.ok(beat.steps.length >= 3, `${beat.system} needs concrete steps`);
    assert.match(beat.watch, /\S/);
    assert.ok(
      beat.title.includes(beat.sha),
      `${beat.system} minute-mark title must name the pinned SHA`,
    );
    for (const step of beat.steps) {
      if (step.url) {
        if (step.url.startsWith("/")) {
          assert.match(step.url, /^\/(systems|studio|interview)/);
        } else {
          assertPublishable(step.url, `interview kit ${beat.system}`);
        }
      }
      if (step.kind === "command") {
        assert.match(step.value, /^(curl|git clone) /);
      }
    }
    if (beat.mode === "HOSTED") {
      const system = content.aiSystems.find((item) => item.slug === beat.system);
      assert.ok(system?.hosted, `${beat.system} is HOSTED in the kit but has no hosted block`);
      assert.equal(beat.host, system.hosted.url, `${beat.system} host must match the card`);
      assert.ok(
        beat.title.includes(new URL(beat.host).hostname),
        `${beat.system} minute-mark title must name the live hostname`,
      );
    } else {
      const system = content.aiSystems.find((item) => item.slug === beat.system);
      assert.equal(system?.hosted, null, `${beat.system} is CLONE in the kit but claims a host`);
      assert.equal(beat.host, null);
    }
    minutesCovered += 1;
  }
  assert.equal(minutesCovered, 5);

  for (const layer of poster.layers) {
    assert.ok(["HOSTED", "CLONE"].includes(layer.chip));
    assert.match(layer.name, /\S/);
    assert.match(layer.role, /\S/);
    assert.match(layer.oneLiner, /\S/);
  }
  const hostedNames = new Set(
    content.aiSystems.filter((system) => system.hosted).map((system) => system.name),
  );
  for (const layer of poster.layers) {
    if (layer.chip === "HOSTED") {
      assert.ok(hostedNames.has(layer.name), `poster marks ${layer.name} HOSTED without a host`);
    } else {
      assert.ok(!hostedNames.has(layer.name), `poster marks ${layer.name} CLONE while it is hosted`);
    }
  }

  const interviewPage = readFileSync(join(root, "app", "interview", "page.tsx"), "utf8");
  assert.match(interviewPage, /site\.lastVerified/);
  assert.match(interviewPage, /ArchitecturePoster/);
  assert.match(interviewPage, /dayOfChecklist/);
  assert.match(interviewPage, /beat\.sha/);
  assert.match(interviewPage, /beat\.host/);
});

test("interview kit hostnames must all appear in verified-urls.json", () => {
  const kit = content.interviewKit;
  const knownHosts = new Set(
    verified.checks.map((check) => new URL(check.url).hostname),
  );
  const knownOrigins = new Set(
    verified.checks.map((check) => new URL(check.url).origin),
  );
  const serialised = JSON.stringify(kit);
  const hostnames = new Set(
    [...serialised.matchAll(/https:\/\/([a-z0-9.-]+\.vercel\.app)/gi)].map((match) => match[1]),
  );
  assert.ok(hostnames.size > 0, "interview kit must name at least one vercel host");
  for (const hostname of hostnames) {
    assert.ok(
      knownHosts.has(hostname),
      `/interview mentions ${hostname}, which is not in content/verified-urls.json`,
    );
    assert.ok(
      knownOrigins.has(`https://${hostname}`),
      `/interview origin https://${hostname} missing from the fixture`,
    );
  }
  for (const beat of kit.beats) {
    if (beat.host) {
      assert.ok(
        knownOrigins.has(normalise(beat.host)) || knownHosts.has(new URL(beat.host).hostname),
        `beat ${beat.system} host ${beat.host} is not in the fixture`,
      );
    }
  }
});

test("frame-src is derived from the fixture, so an unverified origin cannot be embedded", () => {
  const config = readFileSync(join(root, "next.config.ts"), "utf8");
  assert.match(config, /verified-urls\.json/, "the policy must read the fixture, not a hand list");
  const directive = /`frame-src \$\{frameSources\.join\(" "\)\}`/.exec(config);
  assert.ok(directive, "frame-src must be built from the verified origins");

  const origins = new Set(
    verified.checks
      .filter((check) => check.observed === 200)
      .map((check) => new URL(check.url).origin)
      .filter((origin) => origin.startsWith("https://pax-")),
  );
  assert.ok(origins.size > 0, "the studio cannot embed anything without a verified origin");
  for (const origin of origins) {
    assert.match(origin, /^https:\/\/pax-[a-z0-9-]+\.vercel\.app$/, `${origin} is not a portfolio host`);
  }
  for (const embed of content.studio.embeds) {
    assert.ok(
      origins.has(new URL(embed.embedUrl).origin),
      `${embed.slug} would be blocked by its own frame-src`,
    );
  }
});
