import { expect, test, type Page } from "@playwright/test";

/**
 * The keyboard map and the sheet, exercised. A key nobody presses is a key that has already
 * broken, and a canvas nobody checks is a canvas that will one day survive reduced motion.
 */

/** The keys are bound in an effect, so wait for the flag that says they are live. */
async function openWithKeys(page: Page, path = "/") {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("html[data-keys='ready']", { timeout: 20_000 });
}

test.describe("keys", () => {
  test("a digit opens its chapter", async ({ page }) => {
    await openWithKeys(page);
    await page.keyboard.press("2");
    await expect(page).toHaveURL(/\/systems\/agentic-rag-research$/);
  });

  test("g then i turns to the interview kit", async ({ page }) => {
    await openWithKeys(page);
    await page.keyboard.press("g");
    await page.keyboard.press("i");
    await expect(page).toHaveURL(/\/interview$/);
  });

  test("? typesets the legend and Esc closes it", async ({ page }) => {
    await openWithKeys(page);
    await page.keyboard.press("?");

    const legend = page.locator("dialog.legend");
    await expect(legend).toBeVisible();
    await expect(legend).toContainText("How to turn the pages");
    await expect(legend).toContainText("Chapters");

    await page.keyboard.press("Escape");
    await expect(legend).toBeHidden();
  });

  test("jump reaches a system by a word that is not its name", async ({ page }) => {
    await openWithKeys(page);
    await page.keyboard.press("/");

    const input = page.locator("#jump-input");
    await expect(input).toBeFocused();
    await input.fill("budget");
    await expect(page.locator("#jump-list li").first()).toContainText("Multi-Agent");

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/systems\/multi-agent$/);
  });

  test("keys sleep while a field has focus", async ({ page }) => {
    await openWithKeys(page);
    await page.keyboard.press("/");
    await page.keyboard.type("g");
    await expect(page.locator("#jump-input")).toHaveValue("g");
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe("the sheet", () => {
  test("is drawn when motion is welcome", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".sheet canvas")).toBeVisible({ timeout: 20_000 });
    await expect(page.locator(".sheet figcaption")).toContainText("raking light");
  });

  test("never loads under reduced motion, and leaves no hole", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.locator(".sheet figcaption")).toHaveCount(0);
    await expect(page.locator(".sheet.is-live")).toHaveCount(0);
    await expect(page.locator("h1")).toContainText("AI systems that show their work");

    await context.close();
  });
});

test("the reading copy is prose, with no chips and no embedded hosts", async ({ page }) => {
  await page.goto("/read", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toContainText("Forty-five minutes");
  await expect(page.locator(".read-part").first()).toBeVisible();
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.locator(".status")).toHaveCount(0);

  const body = await page.locator("body").innerText();
  expect(body).not.toMatch(/https:\/\/production-rag\.vercel\.app/i);
});
