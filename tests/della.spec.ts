import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import original from "./fixtures/della-original-copy.json";
import { bookingReducer, bookingVerified, initialBooking, type BookingState } from "../src/app/work/della/demo-state";

async function openStory(page: Page) {
  await page.goto("/work/della", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Della.");
}
async function completeBooking(page: Page) {
  for (const name of ["Check availability", "Confirm the time", "Attempt booking", "Check the outcome"]) {
    await page.getByRole("button", { name, exact: true }).click();
  }
}
async function assertNoOverflow(page: Page) {
  const size = await page.evaluate(() => ({ view: innerWidth, document: document.documentElement.scrollWidth }));
  expect(size.document).toBeLessThanOrEqual(size.view + 1);
}

test("state machine requires a matching receipt and clears it on back/reset/scenario changes", () => {
  for (const scenario of ["success", "failure"] as const) {
    let state = bookingReducer(initialBooking, { type: "scenario", scenario });
    for (let i = 0; i < 4; i++) {
      expect(state.step).toBe(i);
      expect(bookingVerified(state)).toBe(false);
      expect(state.receipt).toBeNull();
      state = bookingReducer(state, { type: "next" });
    }
    expect(bookingVerified(state)).toBe(scenario === "success");
    expect(bookingReducer(state, { type: "next" })).toEqual(state);
    const previous = bookingReducer(state, { type: "previous" });
    expect(previous.step).toBe(3);
    expect(previous.receipt).toBeNull();
    expect(bookingVerified(previous)).toBe(false);
    expect(bookingReducer(state, { type: "reset" })).toEqual({ ...initialBooking, scenario });
    expect(bookingReducer(state, { type: "scenario", scenario: "failure" })).toEqual({ ...initialBooking, scenario: "failure" });
  }
  const forged = { ...initialBooking, step: 4, receipt: { source: "illustration", exists: true, id: "DEMO", service: "Different service", time: "16:30" } } as BookingState;
  expect(bookingVerified(forged)).toBe(false);
});

test("all 16 approved prose blocks and four brief facts remain verbatim", async ({ page }) => {
  await openStory(page);
  for (const text of [...original.prose, ...original.brief]) await expect(page.locator("main")).toContainText(text);
  await expect(page.locator(".projectBrief, .lessonGrid")).toHaveCount(0);
  await expect(page).toHaveTitle("Della | Nate Pegg");
});

test("successful booking moves the request and only verifies at the final check", async ({ page }) => {
  await openStory(page);
  const demo = page.getByTestId("booking-demo");
  await expect(demo).toHaveAttribute("data-verified", "false");
  await expect(demo.getByRole("button", { name: "Previous", exact: true })).toBeDisabled();
  for (const [i, name] of ["Check availability", "Confirm the time", "Attempt booking"].entries()) {
    await demo.getByRole("button", { name, exact: true }).click();
    await expect(demo).toHaveAttribute("data-step", String(i + 1));
    await expect(demo).toHaveAttribute("data-verified", "false");
    await expect(page.getByTestId("request-ticket")).toHaveCount(1);
  }
  await expect(demo).toContainText("An attempt is not a result.");
  await demo.getByRole("button", { name: "Check the outcome", exact: true }).click();
  await expect(demo).toHaveAttribute("data-verified", "true");
  await expect(demo).toContainText("DEMO-0430");
  await expect(demo).toContainText("The demo appointment exists.");
  await demo.getByRole("button", { name: "Previous", exact: true }).click();
  await expect(demo).toHaveAttribute("data-verified", "false");
  await expect(demo).not.toContainText("DEMO-0430");
  await demo.getByRole("button", { name: "Check the outcome", exact: true }).click();
  await demo.getByRole("button", { name: "Replay the booking" }).click();
  await expect(demo).toHaveAttribute("data-step", "0");
  await expect(demo).toHaveAttribute("data-verified", "false");
});

test("failed booking never becomes a success, including after changing an already completed scenario", async ({ page }) => {
  await openStory(page);
  await completeBooking(page);
  await page.getByLabel("Booking fails", { exact: true }).check();
  const demo = page.getByTestId("booking-demo");
  await expect(demo).toHaveAttribute("data-step", "0");
  await expect(demo).toHaveAttribute("data-verified", "false");
  await completeBooking(page);
  await expect(demo).toHaveAttribute("data-verified", "false");
  await expect(demo).toContainText("Not booked. No false confirmation.");
  await expect(demo).not.toContainText("DEMO-0430");
  await expect(demo).not.toContainText("Verified in this demo");
  await demo.getByRole("button", { name: "Replay the booking" }).click();
  await expect(page.getByLabel("Booking fails", { exact: true })).toBeChecked();
});

test("the same memory moves to the second recollection and replays", async ({ page }) => {
  await openStory(page);
  const demo = page.getByTestId("memory-demo");
  await expect(demo).toHaveAttribute("data-call", "1");
  await expect(demo).toContainText("Nate's recollection, not a verbatim transcript.");
  await demo.getByRole("button", { name: "Carry it into the next call" }).click();
  await expect(demo).toHaveAttribute("data-call", "2");
  await expect(page.getByTestId("memory-token")).toHaveCount(1);
  await expect(page.getByTestId("memory-token").locator("../..")).toContainText(original.prose[7]);
  await demo.getByRole("button", { name: "Replay the memory" }).click();
  await expect(demo).toHaveAttribute("data-call", "1");
  await expect(page.getByTestId("memory-token").locator("../..")).toContainText(original.prose[6]);
});

test("approval drawer traps focus, closes with Escape, restores focus, and only approves locally", async ({ page }) => {
  await openStory(page);
  const review = page.getByRole("button", { name: "Review", exact: true });
  await review.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Close review" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Approve in demo" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Close review" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(review).toBeFocused();
  await review.click();
  await dialog.getByRole("button", { name: "Keep for review" }).click();
  await expect(page.getByTestId("approval-demo")).toContainText("Waiting for your OK");
  await review.click();
  await dialog.getByRole("button", { name: "Approve in demo" }).click();
  await expect(dialog.getByRole("status")).toContainText("No message was sent.");
  await dialog.getByRole("button", { name: "Back to the story" }).click();
  await expect(page.getByRole("button", { name: "View decision" })).toBeFocused();
  await expect(page.getByTestId("approval-demo")).toContainText("Approved locally. No message was sent.");
  await page.getByRole("button", { name: "Reset demo" }).click();
  await expect(page.getByTestId("approval-demo")).toContainText("Waiting for your OK");
});

test("demo interactions never send mutating requests or contact Della/Square", async ({ page }) => {
  const unsafe: string[] = [];
  page.on("request", request => {
    if (!["GET", "HEAD"].includes(request.method()) || /hellodella|squareup|retellai|telnyx/.test(new URL(request.url()).hostname)) unsafe.push(`${request.method()} ${request.url()}`);
  });
  await openStory(page);
  await completeBooking(page);
  await page.getByLabel("Booking fails", { exact: true }).check();
  await completeBooking(page);
  await page.getByRole("button", { name: "Review", exact: true }).click();
  await page.getByRole("button", { name: "Approve in demo" }).click();
  await page.getByRole("button", { name: "Back to the story" }).click();
  await page.getByRole("button", { name: "Carry it into the next call" }).click();
  await page.getByRole("button", { name: "Live availability", exact: true }).click();
  expect(unsafe).toEqual([]);
});

test("context choices explain distinct sources without implying a live query", async ({ page }) => {
  await openStory(page);
  const demo = page.getByTestId("context-demo");
  await expect(demo).toContainText("Confirmed salon knowledge");
  await demo.getByRole("button", { name: "Live availability" }).click();
  await expect(demo).toContainText("The booking system");
  await expect(demo).toContainText("not a live lookup");
  await expect(demo.getByRole("button", { name: "Live availability" })).toHaveAttribute("aria-pressed", "true");
});

for (const width of [360, 390, 768, 1024, 1440]) {
  test(`responsive at ${width}px, including failure, memory and open drawer`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    await openStory(page);
    await assertNoOverflow(page);
    await completeBooking(page);
    await assertNoOverflow(page);
    await page.getByLabel("Booking fails", { exact: true }).check();
    await completeBooking(page);
    await assertNoOverflow(page);
    await page.getByRole("button", { name: "Carry it into the next call" }).click();
    await assertNoOverflow(page);
    await page.getByRole("button", { name: "Review", exact: true }).click();
    const rect = await page.getByRole("dialog").boundingBox();
    expect(rect).not.toBeNull();
    expect(rect!.x).toBeGreaterThanOrEqual(-1);
    expect(rect!.width).toBeLessThanOrEqual(width + 1);
    await page.getByRole("button", { name: "Approve in demo" }).click();
    await page.getByRole("button", { name: "Back to the story" }).click();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    await assertNoOverflow(page);
    expect(errors).toEqual([]);
  });
}

test("reduced motion keeps all explanations and disables animated layout transitions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openStory(page);
  for (const text of original.prose) await expect(page.locator("main")).toContainText(text);
  await expect(page.getByTestId("booking-demo").locator("details")).toHaveAttribute("open", "");
  await completeBooking(page);
  await page.getByRole("button", { name: "Carry it into the next call" }).click();
  await page.getByRole("button", { name: "Review", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCSS("animation-name", "none");
  await page.keyboard.press("Escape");
  const transforms = await page.getByTestId("memory-token").evaluate(el => getComputedStyle(el).transform);
  expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(transforms);
});

test("story and a full native booking explanation work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${test.info().project.use.baseURL || process.env.DELLA_TEST_URL || "http://127.0.0.1:3147"}/work/della`);
  for (const text of original.prose) await expect(page.locator("main")).toContainText(text);
  await page.getByText("Read the whole sequence without playing it", { exact: true }).click();
  await expect(page.getByTestId("booking-demo").locator("details ol")).toBeVisible();
  await expect(page.locator("noscript p")).toContainText("readable without JavaScript");
  await context.close();
});

test("workspace image loads and its disclosure is visible", async ({ page }) => {
  await openStory(page);
  const image = page.getByRole("img", { name: /Earlier Della workspace/ });
  await image.scrollIntoViewIfNeeded();
  await expect.poll(() => image.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await expect(page.getByText(/Shown for interface context, not as evidence/)).toBeVisible();
});

test("automated accessibility check on the page and the review drawer", async ({ page }) => {
  await openStory(page);
  const before = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(before.violations).toEqual([]);
  await page.getByRole("button", { name: "Review", exact: true }).click();
  const after = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(after.violations).toEqual([]);
});

test("skip link and fast forward/backward scrolling retain the complete story", async ({ page, browserName }) => {
  await openStory(page);
  // WebKit on macOS uses Option+Tab for full keyboard access without changing user preferences.
  await page.keyboard.press(browserName === "webkit" && process.platform === "darwin" ? "Alt+Tab" : "Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
  await expect(page.getByTestId("booking-demo")).toHaveAttribute("data-step", "0");
  await expect(page.getByTestId("memory-demo")).toHaveAttribute("data-call", "1");
});


test("motion preference can change without reloading the story", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openStory(page);
  const explanation = page.getByTestId("booking-demo").locator("details");
  await expect(explanation).not.toHaveAttribute("open");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(explanation).toHaveAttribute("open", "");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(explanation).not.toHaveAttribute("open");
});
