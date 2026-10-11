import { test, expect, type Page } from "@playwright/test";

async function openStory(page: Page) {
  await page.goto("/work/vialgrade");
  await expect(page.getByTestId("claim-batch")).toBeEnabled();
  await page.evaluate(() => document.fonts.ready);
}

// Candidate images must be inspected before accepting new baselines.
// No production records or external services are used in these interactions.
test("desktop opening and document-comparison composition", async ({ page }) => {
  await openStory(page);
  await expect(page).toHaveScreenshot("desktop-opening.png", { animations: "disabled" });
  await page.setViewportSize({ width: 1440, height: 1400 });
  await expect(page.getByTestId("evidence-demo")).toHaveScreenshot("document-match.png", { animations: "disabled" });
  await page.getByRole("radio", { name: "Conflicting record", exact: true }).check();
  await expect(page.getByTestId("claim-manufacturer")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("evidence-demo")).toHaveScreenshot("document-conflict.png", { animations: "disabled" });
});

test("missing-source state and actual grade examples remain visually distinct", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1400 });
  await openStory(page);
  await page.getByRole("radio", { name: "No matching record", exact: true }).check();
  await expect(page.getByTestId("evidence-demo")).toHaveScreenshot("document-missing.png", { animations: "disabled" });
  for (const [name, file] of [["Missing evidence", "grade-unknown"], ["Supported record", "grade-supported"], ["Verified concern", "grade-concern"]]) {
    await page.getByRole("radio", { name, exact: true }).check();
    await expect(page.getByTestId("grade-demo")).toHaveScreenshot(`${file}.png`, { animations: "disabled" });
  }
});

test("phone opening and paired values are readable without chasing the documents", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openStory(page);
  await expect(page).toHaveScreenshot("phone-opening.png", { animations: "disabled" });
  await page.getByRole("radio", { name: "Conflicting record", exact: true }).check();
  await expect(page.getByTestId("selected-comparison")).toHaveScreenshot("phone-selected-comparison.png", { animations: "disabled" });
  await page.getByRole("radio", { name: "Verified concern", exact: true }).check();
  await expect(page.getByTestId("grade-demo")).toHaveScreenshot("phone-grade-concern.png", { animations: "disabled" });
});
