import { expect, test } from "@playwright/test";

/**
 * Visual regression for the three hiring surfaces.
 *
 * Viewport, never fullPage. A full-page shot of a page made of text is really a
 * height-measuring device, and text height moves with the host's fonts and hinting: the
 * same commit rendered 17590px tall on one Linux box and 18397px on another, which
 * Playwright rejects on size before maxDiffPixelRatio ever applies. The viewport shot
 * still catches the regressions this gate exists for — type, colour, layout above the
 * fold — and what is below it is covered by tests/*.test.mjs and e2e/craft.spec.ts.
 *
 * Baselines live in e2e/visual.spec.ts-snapshots/, one set for every OS, so generate them
 * the way CI will read them:
 *   docker run --rm -v "$PWD:/w" -v /w/node_modules -v /w/.next -w /w \
 *     mcr.microsoft.com/playwright:v1.55.0-noble \
 *     bash -lc "npm ci && npm run build && npx playwright test e2e/visual.spec.ts -u"
 */
const routes = [
  { path: "/", name: "home" },
  { path: "/studio", name: "studio" },
  { path: "/interview", name: "interview" },
] as const;

/**
 * Baselines are taken under reduced motion, so the home page is type alone and the sheet
 * cannot make a screenshot flap. e2e/craft.spec.ts is what proves the canvas draws at all.
 */
test.use({ contextOptions: { reducedMotion: "reduce" } });

for (const route of routes) {
  test(`visual ${route.name}`, async ({ page }, testInfo) => {
    await page.goto(route.path, { waitUntil: "domcontentloaded" });
    await page.addStyleTag({
      content: `
        html,body{scrollbar-width:none}
        *{scrollbar-width:none; animation:none !important; transition:none !important}
        iframe{visibility:hidden !important; min-height:480px !important}
      `,
    });
    // Let layout settle once; iframes are hidden so nothing reflows under the shot.
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot(`${route.name}-${testInfo.project.name}.png`, {
      timeout: 15_000,
      // Hinting and subpixel drift between hosts; honesty tests cover the content itself.
      maxDiffPixelRatio: 0.15,
    });
  });
}

test("studio keeps P1 as clone card, never Ipsura iframe", async ({ page }) => {
  await page.goto("/studio", { waitUntil: "domcontentloaded" });
  const body = await page.locator("body").innerText();
  expect(body).toMatch(/clone|CLONE|not hosted/i);
  expect(body).not.toMatch(/https:\/\/production-rag\.vercel\.app/i);
  const iframes = page.locator("iframe");
  const count = await iframes.count();
  for (let i = 0; i < count; i += 1) {
    const src = (await iframes.nth(i).getAttribute("src")) ?? "";
    expect(src).not.toMatch(/production-rag\.vercel\.app/);
  }
  // DEMO-DAY clone path must be named for P1
  expect(body).toMatch(/DEMO-DAY|Filtering|clone/i);
});

test("studio embeds no host that refuses to be framed", async ({ page }) => {
  // pax-ai-gateway sends X-Frame-Options: DENY. An iframe pointed at it is an empty
  // rectangle and a console error for every reader, every time -- the page has to say that
  // in words instead of rendering the frame and hoping.
  await page.goto("/studio", { waitUntil: "domcontentloaded" });

  const srcs = await page.locator("iframe").evaluateAll((frames) =>
    frames.map((frame) => frame.getAttribute("src") ?? ""),
  );
  expect(srcs.some((src) => /pax-ai-gateway/.test(src))).toBe(false);
  expect(srcs.length).toBeGreaterThan(0);

  const section = page.locator("#ai-platform");
  await expect(section.locator("iframe")).toHaveCount(0);
  await expect(section).toContainText("X-Frame-Options");
});

test("interview hostnames are publishable vercel hosts", async ({ page }) => {
  await page.goto("/interview", { waitUntil: "domcontentloaded" });
  const html = await page.content();
  const hosts = [...html.matchAll(/https:\/\/([a-z0-9.-]+\.vercel\.app)/gi)].map((m) => m[1]);
  expect(hosts.length).toBeGreaterThan(0);
  for (const host of hosts) {
    expect(host).not.toBe("production-rag.vercel.app");
  }
});
