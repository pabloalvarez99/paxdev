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
    await expect(legend).toContainText("Cómo pasar las páginas");
    await expect(legend).toContainText("Capítulos");

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

  test("jump keeps a single real focus -- Tab does not land on an option", async ({ page }) => {
    await openWithKeys(page);
    await page.keyboard.press("/");

    const input = page.locator("#jump-input");
    await expect(input).toBeFocused();
    await input.fill("budget");
    await expect(page.locator("#jump-list li[role='option']").first()).toBeVisible();

    // The options are not in the tab sequence in this pattern; aria-activedescendant on the
    // input is what marks the active one. Before the fix, each option wrapped a real <button>,
    // so Tab landed inside #jump-list. Whether the browser's modal focus trap then keeps focus
    // on the input or drops it to the document is an implementation detail -- what must never
    // happen again is focus landing on an option.
    await page.keyboard.press("Tab");
    const focusedInsideOptions = await page.evaluate(
      () => document.activeElement?.closest("#jump-list") != null,
    );
    expect(focusedInsideOptions).toBe(false);
  });

  test("keys sleep while a field has focus", async ({ page }) => {
    await openWithKeys(page);
    await page.keyboard.press("/");
    await page.keyboard.type("g");
    await expect(page.locator("#jump-input")).toHaveValue("g");
    await expect(page).toHaveURL(/\/$/);
  });
});

/**
 * WCAG 2.1.4.1 Character Key Shortcuts, the "turn it off" branch. The keys start on for a
 * fresh visitor (a fresh browser context here means empty localStorage), so every test opens
 * the legend with `?` once while the keys are still live, then flips the switch through the
 * real checkbox -- the same control a reader would use.
 */
test.describe("the off switch", () => {
  async function turnKeysOff(page: Page) {
    await page.keyboard.press("?");
    const toggle = page.getByRole("checkbox", { name: "Atajos de una sola tecla" });
    await expect(toggle).toBeChecked();
    await toggle.click();
    await expect(toggle).not.toBeChecked();
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog.legend")).toBeHidden();
  }

  test("off stops a chapter digit from navigating", async ({ page }) => {
    await openWithKeys(page);
    await turnKeysOff(page);

    await page.keyboard.press("2");
    await expect(page).toHaveURL(/\/$/);
  });

  test("off stops ? from opening the legend", async ({ page }) => {
    await openWithKeys(page);
    await turnKeysOff(page);

    await page.keyboard.press("?");
    await expect(page.locator("dialog.legend")).toBeHidden();
  });

  test("the hero button still opens the legend when the keys are off", async ({ page }) => {
    await openWithKeys(page);
    await turnKeysOff(page);

    await page.locator("[data-legend-open]").click();
    const legend = page.locator("dialog.legend");
    await expect(legend).toBeVisible();
    await expect(legend).toContainText("Los atajos de una sola tecla están desactivados");
  });

  test("turning the keys back on restores the chapter digit", async ({ page }) => {
    await openWithKeys(page);
    await turnKeysOff(page);

    // The button just opened is now the only way back to the switch.
    await page.locator("[data-legend-open]").click();
    const toggle = page.getByRole("checkbox", { name: "Atajos de una sola tecla" });
    await expect(toggle).not.toBeChecked();
    await toggle.click();
    // Wait for the flip to actually land before driving more keys at it -- otherwise the
    // keydown listener can still be mid re-attach with the stale, disabled closure.
    await expect(toggle).toBeChecked();
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog.legend")).toBeHidden();

    await page.keyboard.press("2");
    await expect(page).toHaveURL(/\/systems\/agentic-rag-research$/);
  });

  test("the off choice survives a reload", async ({ page }) => {
    await openWithKeys(page);
    await turnKeysOff(page);

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector("html[data-keys='ready']", { timeout: 20_000 });

    await page.keyboard.press("2");
    await expect(page).toHaveURL(/\/$/);

    await page.locator("[data-legend-open]").click();
    await expect(page.getByRole("checkbox", { name: "Atajos de una sola tecla" })).not.toBeChecked();
  });
});

test.describe("the sheet", () => {
  test("is drawn when motion is welcome", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".sheet canvas")).toBeVisible({ timeout: 20_000 });
    await expect(page.locator(".sheet figcaption")).toContainText("luz rasante");
  });

  test("stays inside its box on a high-density screen", async ({ browser }) => {
    // The default scale factor is 1, where a canvas sized only by its attributes happens to
    // look right. Most laptops and every phone are 2 or 3, and that is where a renderer that
    // skips the CSS size overflows its frame and shows a corner of the sheet.
    const context = await browser.newContext({ deviceScaleFactor: 2 });
    const page = await context.newPage();
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.locator(".sheet canvas").waitFor({ state: "visible", timeout: 20_000 });

    const fits = await page.evaluate(() => {
      const canvas = document.querySelector(".sheet canvas")!.getBoundingClientRect();
      const stage = document.querySelector(".sheet-stage")!.getBoundingClientRect();
      return canvas.width <= stage.width + 1 && canvas.height <= stage.height + 1;
    });
    expect(fits).toBe(true);

    await context.close();
  });

  test("never loads under reduced motion, and leaves no hole", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.locator(".sheet figcaption")).toHaveCount(0);
    await expect(page.locator(".sheet.is-live")).toHaveCount(0);
    await expect(page.locator("h1")).toContainText(
      "Sistemas de inteligencia artificial que se pueden abrir y revisar",
    );

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
