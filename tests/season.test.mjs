import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = new URL("..", import.meta.url).pathname.replace(/^\/(.:\/)/, "$1");
const content = JSON.parse(readFileSync(join(root, "content", "portfolio.json"), "utf8"));
const pins = JSON.parse(readFileSync(join(root, "content", "pins.json"), "utf8"));
const verified = JSON.parse(readFileSync(join(root, "content", "verified-urls.json"), "utf8"));
const releases = JSON.parse(readFileSync(join(root, "content", "releases.json"), "utf8"));
const casestudy = readFileSync(join(root, "docs", "CASESTUDY.md"), "utf8");
// pins.json may list Ipsura under forbiddenHosts; published content must not cite it.
const published = JSON.stringify(content) + JSON.stringify(verified) + JSON.stringify(releases);

test("never cite Ipsura production-rag.vercel.app as a portfolio URL", () => {
  assert.doesNotMatch(published, /https:\/\/production-rag\.vercel\.app/);
});

test("P1 content must not claim PR #3 is still NOT SHIPPED", () => {
  const p1 = content.aiSystems.find((s) => s.slug === "production-rag");
  const blob = JSON.stringify(p1);
  assert.doesNotMatch(blob, /PR #3[\s\S]{0,80}NOT SHIPPED|is OPEN and NOT SHIPPED/i);
  assert.doesNotMatch(blob, /PR #3[\s\S]{0,40}is OPEN/i);
});

test("poster chips match pins.json modes", () => {
  const layers = content.architecturePoster.layers;
  assert.equal(layers.length, pins.systems.length);
  for (let i = 0; i < pins.systems.length; i += 1) {
    const pin = pins.systems[i];
    const layer = layers[i];
    assert.equal(layer.chip, pin.mode, `${pin.id} poster chip ${layer.chip} !== pin ${pin.mode}`);
    assert.ok(
      content.architecturePoster.subtitle.includes(pin.main),
      `poster subtitle missing ${pin.main}`,
    );
  }
});

test("changelog releases cover five systems and match pin release tags", () => {
  assert.equal(releases.releases.length, 5);
  assert.match(releases.fetchedAt, /^\d{4}-\d{2}-\d{2}$/);
  const bySlug = new Map(releases.releases.map((r) => [r.slug, r]));
  for (const pin of pins.systems) {
    const rel = bySlug.get(pin.slug);
    assert.ok(rel, `releases.json missing ${pin.slug}`);
    assert.equal(
      rel.tag,
      pin.release,
      `${pin.slug} release fixture ${rel.tag} !== pin ${pin.release}`,
    );
    assert.ok(rel.body === "" || rel.body.length > 20, `${pin.slug} release body too thin`);
    assert.match(rel.htmlUrl, /^https:\/\/github\.com\//);
  }
});

test("verified URL checks meet site-v1 gate (>= 10)", () => {
  assert.ok(
    verified.checks.length >= 10,
    `verified checks ${verified.checks.length} < 10`,
  );
});

test("site CASESTUDY is substantial (>= 1500 words)", () => {
  const words = casestudy.trim().split(/\s+/).filter(Boolean).length;
  assert.ok(words >= 1500, `CASESTUDY words ${words} < 1500`);
});

test("studio clone card for P1 points at clone path, not a hosted embed", () => {
  const card = content.studio.cloneCards.find((c) => c.slug === "production-rag");
  assert.ok(card);
  assert.match(card.command, /git clone/);
  assert.ok(content.studio.embeds.every((e) => e.slug !== "production-rag"));
});

test("P1 interview / source links DEMO-DAY at pinned main", () => {
  const p1 = pins.systems.find((s) => s.slug === "production-rag");
  assert.ok(content.interviewKit.source.url.includes(p1.main));
  assert.match(content.interviewKit.source.url, /DEMO-DAY/);
  const beat = content.interviewKit.beats.find((b) => b.system === "production-rag");
  assert.equal(beat.mode, "CLONE");
  assert.equal(beat.host, null);
  const joined = JSON.stringify(beat);
  assert.match(joined, /Filtering|filter/i);
});
