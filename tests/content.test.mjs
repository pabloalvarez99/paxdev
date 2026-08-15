import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = new URL("..", import.meta.url).pathname.replace(/^\/(.:\/)/, "$1");
const content = JSON.parse(readFileSync(join(root, "content", "portfolio.json"), "utf8"));
const verified = JSON.parse(readFileSync(join(root, "content", "verified-urls.json"), "utf8"));
const page = readFileSync(join(root, "app", "page.tsx"), "utf8");
const config = readFileSync(join(root, "next.config.ts"), "utf8");

test("the AI ladder has five ordered, unique systems", () => {
  assert.equal(content.aiSystems.length, 5);
  assert.deepEqual(
    content.aiSystems.map((system) => system.number),
    ["01", "02", "03", "04", "05"],
  );
  assert.equal(new Set(content.aiSystems.map((system) => system.slug)).size, 5);
});

test("the proof strip counts live systems", () => {
  const publicSystems = content.aiSystems.filter((system) => system.status === "LIVE");
  const proof = content.proof.find((item) => item.label === "LIVE AI systems");
  assert.ok(proof);
  assert.equal(Number(proof.value), publicSystems.length);
});

test("public status claims require public evidence", () => {
  const publicStatuses = new Set(["LIVE", "IN PROGRESS"]);
  const allowedStatuses = new Set(["LIVE", "IN PROGRESS", "PLANNED"]);

  for (const system of content.aiSystems) {
    assert.ok(allowedStatuses.has(system.status), `${system.name} uses an unknown status`);
    if (publicStatuses.has(system.status)) {
      assert.ok(system.links.length > 0, `${system.name} needs a public evidence link`);
      assert.ok(system.evidence.length > 0, `${system.name} needs concrete evidence`);
      assert.match(system.links[0].url, /^https:\/\/github\.com\/pabloalvarez99\//);
      for (const item of system.evidence) {
        assert.match(item.label, /\S/);
        assert.match(item.url, /^https:\/\/github\.com\/pabloalvarez99\//);
      }
    }
    if (system.status === "PLANNED") {
      assert.deepEqual(system.links, [], `${system.name} must not link an uncreated repository`);
      assert.deepEqual(system.evidence, [], `${system.name} must not present planned evidence as built`);
    }
  }
});

test("each live system links its repository and each claimed release", () => {
  for (const system of content.aiSystems.filter((item) => item.status === "LIVE")) {
    assert.ok(
      system.links.some((link) => link.label === "Repository"),
      `${system.name} needs a Repository link`,
    );
    if (/v\d+\.\d+\.\d+/.test(system.phase)) {
      assert.ok(
        system.links.some((link) => /v\d+\.\d+\.\d+/.test(link.label)),
        `${system.name} claims a release but does not link it`,
      );
    }
  }
});

test("hosted systems link the running deployment and state their boundary", () => {
  const hosted = content.aiSystems.filter((system) => system.hosted !== null);
  const proof = content.proof.find((item) => item.label === "hosted demos");
  assert.ok(proof);
  assert.equal(Number(proof.value), hosted.length);

  for (const system of hosted) {
    assert.equal(system.status, "LIVE", `${system.name} cannot host what it does not run`);
    assert.match(system.hosted.url, /^https:\/\//);
    assert.match(system.hosted.label, /\S/);
    assert.ok(
      system.links.some((link) => link.url === system.hosted.url),
      `${system.name} must link its hosted URL alongside its repository`,
    );
    assert.ok(
      system.hosted.note.length > 80,
      `${system.name} must say what the hosted instance does not do, not only what it does`,
    );
  }

  const gateway = content.aiSystems.find((system) => system.slug === "ai-platform");
  assert.ok(gateway.hosted);
  assert.match(
    gateway.hosted.note,
    /does not run P1-P4/,
    "the hosted gateway must not read as a hosted P1-P4",
  );
});

test("selected work links only to HTTPS public surfaces", () => {
  for (const project of content.selectedWork) {
    assert.match(project.repo, /^https:\/\/github\.com\/pabloalvarez99\//);
    if (project.demo !== null) {
      assert.match(project.demo, /^https:\/\//);
    }
  }
});

test("prototype health boundary remains visible", () => {
  const prescribo = content.selectedWork.find((project) => project.name === "Prescribo");
  assert.ok(prescribo);
  assert.equal(prescribo.status, "PROTOTYPE");
  assert.match(prescribo.note, /not for real PHI/i);
});

test("the anonymous landing has no credential or lead collection form", () => {
  assert.doesNotMatch(page, /<form\b/i);
  assert.doesNotMatch(page, /type=["'](?:email|password)["']/i);
  assert.match(page, /Sin registro\. Sin recolección de datos\./);
});

test("security headers cover the static public surface", () => {
  for (const required of [
    "Content-Security-Policy",
    "Permissions-Policy",
    "Referrer-Policy",
    "X-Content-Type-Options",
    "X-Frame-Options",
  ]) {
    assert.match(config, new RegExp(required));
  }
  assert.match(config, /frame-ancestors 'none'/);
  assert.match(config, /object-src 'none'/);
});

test("a hosted claim requires a fixture that observed the status it claims", () => {
  const reachable = new Map(
    verified.checks
      .filter((check) => check.observed === 200)
      .map((check) => [check.url.replace(/\/$/, ""), check]),
  );
  const absent = new Set(verified.absent.map((entry) => entry.url.replace(/\/$/, "")));

  for (const system of content.aiSystems) {
    if (system.hosted === null) {
      continue;
    }
    const url = system.hosted.url.replace(/\/$/, "");
    assert.ok(
      reachable.has(url),
      `${system.name} claims ${url} but content/verified-urls.json has no 200 for it`,
    );
    assert.ok(!absent.has(url), `${system.name} claims a URL recorded as absent`);
  }

  for (const project of content.selectedWork) {
    if (project.demo === null) {
      continue;
    }
    assert.ok(
      reachable.has(project.demo.replace(/\/$/, "")),
      `${project.name} links ${project.demo} with no verified 200`,
    );
  }
});

test("the fixture file is dated and never records a status it did not observe", () => {
  assert.match(verified.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(verified.verifiedAt, content.site.lastVerified);
  assert.ok(verified.checks.length > 0);
  for (const check of verified.checks) {
    assert.match(check.url, /^https:\/\//);
    assert.equal(
      check.observed,
      check.expect,
      `${check.url} expects ${check.expect} but the fixture observed ${check.observed}`,
    );
  }
  for (const entry of verified.absent) {
    assert.notEqual(entry.observed, 200, `${entry.url} cannot be absent and reachable`);
  }
});

test("every capture is pinned to a commit, never to a moving branch", () => {
  for (const system of content.aiSystems) {
    const captures = [system.capture, system.secondaryCapture].filter(Boolean);
    assert.ok(captures.length > 0, `${system.name} needs at least one capture`);
    for (const capture of captures) {
      assert.match(
        capture.sourceUrl,
        /^https:\/\/github\.com\/pabloalvarez99\/[a-z-]+\/blob\/[0-9a-f]{7,40}\//,
        `${system.name} capture must cite a commit SHA, not ${capture.sourceUrl}`,
      );
      assert.match(capture.src, /^\/[a-z0-9-]+\.png$/);
      assert.ok(capture.width > 0 && capture.height > 0);
      assert.match(capture.alt, /\S/);
    }
  }
});

test("each system pins the main it claims inside its own evidence links", () => {
  for (const system of content.aiSystems.filter((item) => item.status === "LIVE")) {
    const main = /main ([0-9a-f]{7,40})/.exec(system.phase);
    assert.ok(main, `${system.name} must state the main commit it was verified against`);
    assert.ok(
      [system.capture, system.secondaryCapture]
        .filter(Boolean)
        .some((capture) => capture.sourceUrl.includes(main[1])) ||
        system.evidence.some((item) => item.url.includes(main[1])),
      `${system.name} claims main ${main[1]} but pins no evidence to it`,
    );
  }
});

test("canonical metadata points to the intended production domain", () => {
  assert.equal(content.site.canonicalUrl, "https://pablofigueroa99dev.vercel.app");
  // The site is signed Pablo Figueroa; the GitHub account that owns the five system
  // repositories is pabloalvarez99. Both are true at once, and the link has to keep
  // pointing at the account that actually holds the code being cited.
  assert.equal(content.site.githubUrl, "https://github.com/pabloalvarez99");
  assert.equal(content.site.owner, "Pablo Figueroa");
  assert.match(content.site.lastVerified, /^\d{4}-\d{2}-\d{2}$/);
});
