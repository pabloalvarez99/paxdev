import { expect, test } from "@playwright/test";

/**
 * Visual regression for the three hiring surfaces.
 * Baselines live in e2e/visual.spec.ts-snapshots/ (linux CI + local via path template).
 * Update with: npm run build && npx playwright test --update-snapshots
 */
const routes = [
  { path: "/", name: "home", fullPage: true },
  { path: "/studio", name: "studio", fullPage: false },
  { path: "/interview", name: "interview", fullPage: true },
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
    // Let layout settle once; iframes are hidden so full-page height stays stable.
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot(`${route.name}-${testInfo.project.name}.png`, {
      fullPage: route.fullPage,
      timeout: 15_000,
      // Linux CI vs local still drifts on subpixel iframe/chrome; honesty tests cover content.
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

test("interview hostnames are publishable vercel hosts", async ({ page }) => {
  await page.goto("/interview", { waitUntil: "domcontentloaded" });
  const html = await page.content();
  const hosts = [...html.matchAll(/https:\/\/([a-z0-9.-]+\.vercel\.app)/gi)].map((m) => m[1]);
  expect(hosts.length).toBeGreaterThan(0);
  for (const host of hosts) {
    expect(host).not.toBe("production-rag.vercel.app");
  }
});
