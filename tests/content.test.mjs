import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = new URL("..", import.meta.url).pathname.replace(/^\/(.:\/)/, "$1");
const content = JSON.parse(readFileSync(join(root, "content", "portfolio.json"), "utf8"));
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

test("public status claims require public evidence", () => {
  const publicStatuses = new Set(["LIVE", "IN PROGRESS"]);
  const allowedStatuses = new Set(["LIVE", "IN PROGRESS", "PLANNED"]);

  for (const system of content.aiSystems) {
    assert.ok(allowedStatuses.has(system.status), `${system.name} uses an unknown status`);
    if (publicStatuses.has(system.status)) {
      assert.ok(system.links.length > 0, `${system.name} needs a public evidence link`);
      assert.ok(system.evidence.length > 0, `${system.name} needs concrete evidence`);
      assert.match(system.links[0].url, /^https:\/\/github\.com\/pabloalvarez99\//);
    }
    if (system.status === "PLANNED") {
      assert.deepEqual(system.links, [], `${system.name} must not link an uncreated repository`);
      assert.deepEqual(system.evidence, [], `${system.name} must not present planned evidence as built`);
    }
  }
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
  assert.match(page, /No login\. No data collection\./);
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

test("canonical metadata points to the intended production domain", () => {
  assert.equal(content.site.canonicalUrl, "https://paxdev.vercel.app");
  assert.equal(content.site.githubUrl, "https://github.com/pabloalvarez99");
  assert.match(content.site.lastVerified, /^\d{4}-\d{2}-\d{2}$/);
});
