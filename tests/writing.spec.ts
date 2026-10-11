import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHash } from "node:crypto";
import { mkdirSync } from "node:fs";

const originalPdfSha = "3bdb1da4a89c997beda1f92650606834b7f199193533a97666d99231ea24dfb0";

test("quiet footer disclosure opens with keyboard and preserves the original links", async ({ page }) => {
  const unexpected: string[] = [];
  page.on("pageerror", e => unexpected.push(e.message));
  const pdfRequests: string[] = [];
  page.on("request", request => { if (request.url().endsWith("after-abundance.pdf")) pdfRequests.push(request.url()); });
  await page.goto("/");
  const note = page.getByTestId("writing-note");
  await expect(note).not.toHaveAttribute("open");
  await note.scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("footer").getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/pegg-dot");
  await expect(page.locator("footer").getByRole("link", { name: "Email" })).toHaveAttribute("href", "mailto:nate@natepegg.com");
  const trigger = note.locator("summary");
  await trigger.focus();
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(note).toHaveAttribute("open", "");
  await expect(note.getByRole("heading", { name: "After Abundance" })).toBeVisible();
  await expect(note).toContainText("If everything is cheap, what does a person actually do?");
  await expect(note).toContainText("AI-assisted drafting and human direction");
  await page.keyboard.press("Space");
  await expect(note).not.toHaveAttribute("open");
  expect(pdfRequests).toEqual([]); // The paper is not downloaded until the visitor requests it.
  expect(unexpected).toEqual([]);
});

test("the linked PDF is the original 42-page file, byte for byte", async ({ request }) => {
  const response = await request.get("/writing/after-abundance.pdf");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  const bytes = await response.body();
  expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
  expect(createHash("sha256").update(bytes).digest("hex")).toBe(originalPdfSha);
});

for (const width of [360, 390, 768, 1440]) {
  test(`footer reads and fits at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const note = page.getByTestId("writing-note");
    await note.locator("summary").click();
    await page.evaluate(() => document.fonts.ready);
    await expect(note.getByRole("link", { name: /Read the paper/ })).toBeVisible();
    await expect(note.getByRole("link", { name: /Read the paper/ })).toHaveAttribute("target", "_blank");
    const rect = await page.locator("footer").boundingBox();
    expect(rect).not.toBeNull();
    expect(rect!.width).toBeLessThanOrEqual(width + 1);
    for (const el of await note.locator("article, blockquote, a").all()) {
      const box = await el.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
    }
    const result = await new AxeBuilder({ page }).include("footer").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(result.violations).toEqual([]);
    mkdirSync("/tmp/portfolio-writing-qa", { recursive: true });
    await page.locator("footer").screenshot({ path: `/tmp/portfolio-writing-qa/footer-${width}-${info.project.name}.png`, animations: "disabled" });
  });
}

test("writing is readable with JavaScript disabled and reduced motion enabled", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(baseURL!);
  const note = page.getByTestId("writing-note");
  await note.locator("summary").click();
  await expect(note.getByRole("heading", { name: "After Abundance" })).toBeVisible();
  await expect(note.getByRole("link", { name: /Read the paper/ })).toHaveAttribute("href", "/writing/after-abundance.pdf");
  await context.close();
});
