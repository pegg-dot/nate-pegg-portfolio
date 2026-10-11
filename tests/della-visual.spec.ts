import { test, expect } from "@playwright/test";

test("reviewed desktop composition, completed booking and approval drawer", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work/della", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveScreenshot("desktop-opening.png", { animations: "disabled", maxDiffPixelRatio: 0.001 });
  for (const name of ["Check availability", "Confirm the time", "Attempt booking", "Check the outcome"]) await page.getByRole("button", { name, exact: true }).click();
  await expect(page.getByTestId("booking-demo")).toHaveScreenshot("booking-verified.png", { animations: "disabled", maxDiffPixelRatio: 0.001 });
  await page.getByRole("button", { name: "Review", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveScreenshot("approval-drawer.png", { animations: "disabled", maxDiffPixelRatio: 0.001 });
});

test("reviewed mobile booking and memory composition", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work/della", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByTestId("booking-demo")).toHaveScreenshot("mobile-booking.png", { animations: "disabled", maxDiffPixelRatio: 0.001 });
  await page.getByRole("button", { name: "Carry it into the next call" }).click();
  await expect(page.getByTestId("memory-demo")).toHaveScreenshot("mobile-memory.png", { animations: "disabled", maxDiffPixelRatio: 0.001 });
});
