import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import ts from "typescript";
import original from "./fixtures/vial-original-copy.json";
import pinned from "./fixtures/vial-grade-source.json";
import {
  claim, fields, compareDocuments, recordFor, exampleGrade, gradeExamples, linkParts, exampleTaggedUrl,
} from "../src/app/work/vialgrade/evidence-model";
import { gradeFromVerdict } from "../src/app/work/vialgrade/grade-projection";

async function openStory(page: Page) {
  await page.goto("/work/vialgrade");
  await expect(page.getByTestId("claim-batch")).toBeEnabled();
  await page.evaluate(() => document.fonts.ready);
}

test("preserves the original introduction, 12 prose blocks and all four brief facts", async ({ page }) => {
  await openStory(page);
  await expect(page.locator("main")).toContainText(original.subtitle);
  for (const text of original.prose) await expect(page.locator("main")).toContainText(text);
  await page.getByText("Project notes", { exact: true }).click();
  for (const item of original.brief) await expect(page.locator("main")).toContainText(item.text);
  await expect(page.getByText("Preserved from the original case study. These are earlier reported figures, not live metrics.")).toBeVisible();
});

test("grade runtime is byte-identical to the pinned source after TypeScript transpilation", () => {
  const source = readFileSync("src/app/work/vialgrade/grade-projection.ts", "utf8");
  const runtime = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.CommonJS, removeComments: true } }).outputText;
  expect(createHash("sha256").update(runtime).digest("hex")).toBe(pinned.runtimeSha256);
});

test("document comparison detects a mismatch in every field and treats missing as unknown", () => {
  expect(compareDocuments(claim, recordFor("match")).status).toBe("match");
  expect(compareDocuments(claim, null)).toEqual({ status: "missing", disagreements: [] });
  for (const { key } of fields) expect(compareDocuments(claim, { ...claim, [key]: "Different" })).toEqual({ status: "mismatch", disagreements: [key] });
  expect(compareDocuments(claim, recordFor("mismatch")).disagreements).toEqual(["manufacturer"]);
});

test("real grade rules preserve uncertainty, testing thresholds and verified adverse findings", () => {
  expect(exampleGrade("unknown").letter).toBeNull();
  expect(exampleGrade("unknown").dimensions.find(d => d.key === "testing")?.state).toBe("absent");
  expect(exampleGrade("unknown").dimensions.find(d => d.key === "regulatory")?.state).toBe("clear");
  expect(exampleGrade("unknown").dimensions.find(d => d.key === "operations")?.state).toBe("noted");
  expect(exampleGrade("supported").letter).toBe("A-");
  expect(exampleGrade("concern").letter).toBe("C-");
  const { verdict, input } = gradeExamples.supported;
  expect(gradeFromVerdict(verdict, { ...input, coaCount: 0 }).letter).toBe("B");
  expect(gradeFromVerdict(verdict, { ...input, coaCount: 1 }).letter).toBe("B+");
  expect(gradeFromVerdict(verdict, { ...input, coaCount: 10 }).letter).toBe("A");
  expect(gradeFromVerdict(gradeExamples.concern.verdict, { ...input, coaCount: 10 }).letter).toBe("C-");
  expect(gradeFromVerdict({ ...verdict, verdict: "avoid", factors: [{ label: "Site status", ok: false, confidence: "inferred", detail: "A scan only" }] }, input).letter).toBeNull();
  expect(gradeFromVerdict(verdict, { ...input, listingCount: 0 }).letter).toBeNull();
  expect(gradeFromVerdict({ ...gradeExamples.concern.verdict, verdict: "avoid" }, { ...input, listingCount: 0 }).letter).toBe("F");
});

test("selecting either document highlights the same field in both and aligns desktop rows", async ({ page }) => {
  await openStory(page);
  const demo = page.getByTestId("evidence-demo");
  await expect(demo).toHaveAttribute("data-result", "match");
  for (const { key, label } of fields) {
    await page.getByTestId(`claim-${key}`).click();
    await expect(page.getByTestId(`record-${key}`)).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByTestId("selected-comparison")).toContainText(`Claim: ${label}`);
    await expect(page.getByTestId("selected-comparison")).toContainText("This field matches");
    const left = await page.getByTestId(`claim-${key}`).boundingBox();
    const right = await page.getByTestId(`record-${key}`).boundingBox();
    expect(Math.abs(left!.y - right!.y)).toBeLessThanOrEqual(1);
  }
  await page.getByTestId("record-batch").click();
  await expect(page.getByTestId("claim-batch")).toHaveAttribute("aria-pressed", "true");
  await expect(demo.getByRole("button", { pressed: true })).toHaveCount(3);
  await expect(page.getByTestId("evidence-finding")).toContainText("not a safety certification");
});

test("a missing record stays unresolved and is not turned into a matching or adverse finding", async ({ page }) => {
  await openStory(page);
  await page.getByRole("radio", { name: "No matching record", exact: true }).check();
  await expect(page.getByTestId("evidence-demo")).toHaveAttribute("data-result", "missing");
  await expect(page.getByTestId("record-batch")).toHaveCount(0);
  await expect(page.getByTestId("evidence-finding")).toContainText("Unbacked here. Not proven false.");
  await expect(page.getByTestId("selected-comparison")).toContainText("Not on file");
  await page.getByRole("group", { name: "Choose a field to compare" }).getByRole("button", { name: "Manufacturer", exact: true }).click();
  await expect(page.getByTestId("selected-comparison")).toContainText("No source to compare");
  await expect(page.getByTestId("evidence-finding")).toContainText("not evidence of wrongdoing");
});

test("conflicting fields remain explicit even when inspecting a matching batch; reset clears them", async ({ page }) => {
  await openStory(page);
  await page.getByRole("radio", { name: "Conflicting record", exact: true }).check();
  await expect(page.getByTestId("evidence-demo")).toHaveAttribute("data-result", "mismatch");
  await expect(page.getByTestId("claim-manufacturer")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("selected-comparison")).toContainText("Example Research B");
  await expect(page.getByTestId("selected-comparison")).toContainText("This field disagrees");
  await page.getByTestId("claim-batch").click();
  await expect(page.getByTestId("selected-comparison")).toContainText("This field matches");
  await expect(page.getByTestId("evidence-finding")).toContainText("Different manufacturer");
  await page.getByRole("radio", { name: "Matching record", exact: true }).check();
  await expect(page.getByTestId("evidence-demo")).toHaveAttribute("data-result", "match");
  await expect(page.getByTestId("record-manufacturer")).toContainText("Example Research A");
});

test("grade cases display their actual projection and retain the scope of the prepared inputs", async ({ page }) => {
  await openStory(page);
  const demo = page.getByTestId("grade-demo");
  await expect(demo).toHaveAttribute("data-letter", "none");
  await demo.getByRole("radio", { name: "Supported record", exact: true }).check();
  await expect(demo).toHaveAttribute("data-letter", "A-");
  await expect(page.getByTestId("grade-rule")).toContainText("Three tests alone do not establish that verdict.");
  await demo.getByRole("radio", { name: "Verified concern", exact: true }).check();
  await expect(demo).toHaveAttribute("data-letter", "C-");
  await demo.locator('details[data-state="adverse"] summary').click();
  await expect(demo.locator('details[data-state="adverse"]')).toContainText("COA integrity");
  await demo.getByText("What this example does and does not run", { exact: true }).click();
  await expect(demo).toContainText("does not rate the document example above");
  await expect(demo.getByRole("link", { name: /Inspect the source rule/ })).toHaveAttribute("href", new RegExp(pinned.commit));
  await demo.getByRole("radio", { name: "Missing evidence", exact: true }).check();
  await expect(demo).toHaveAttribute("data-letter", "none");
  await expect(demo.locator('details[data-state="adverse"]')).toHaveCount(0);
});

test("referral tags are inspectable without a tracking call or a claim that a purchase happened", async ({ page }) => {
  await openStory(page);
  const demo = page.getByTestId("handoff-demo");
  await demo.locator("summary").click();
  for (const part of linkParts) await expect(demo).toContainText(part.key);
  await expect(demo.locator("code").nth(1)).toHaveText(exampleTaggedUrl);
  await expect(demo.locator("a")).toHaveCount(0);
  await expect(demo).toContainText("A completed purchase.");
  await expect(demo).toContainText("Expanding it sends nothing and records no referral.");
});

test("all demonstrations remain local and never send writes or contact vendors, labs or the live product", async ({ page, baseURL }) => {
  const forbidden: string[] = [];
  await page.route("**/*", async route => {
    const req = route.request();
    if (!["GET", "HEAD"].includes(req.method()) || new URL(req.url()).origin !== new URL(baseURL!).origin) {
      forbidden.push(`${req.method()} ${req.url()}`); await route.abort();
    } else await route.continue();
  });
  await openStory(page);
  for (const name of ["No matching record", "Conflicting record", "Matching record", "Supported record", "Verified concern", "Missing evidence"]) await page.getByRole("radio", { name, exact: true }).check();
  await page.getByTestId("claim-compound").click();
  await page.getByTestId("handoff-demo").locator("summary").click();
  expect(forbidden).toEqual([]);
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`fits at ${width}px with readable selected pairs and every expanded disclosure`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await openStory(page);
    await page.getByRole("radio", { name: "Conflicting record", exact: true }).check();
    await page.getByRole("radio", { name: "Verified concern", exact: true }).check();
    await page.evaluate(() => document.querySelectorAll("details").forEach(d => d.open = true));
    for (const selector of ["main", '[data-testid="evidence-demo"]', '[data-testid="selected-comparison"]', '[data-testid="grade-demo"]', '[data-testid="handoff-demo"]']) {
      const box = await page.locator(selector).boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(-1);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
    }
    const overflowing = await page.locator("main").evaluate(el => Array.from(el.querySelectorAll("p, h1, h2, h3, code, dd, button, input")).filter(node => {
      const e = node as HTMLElement; const r = e.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && (r.x < -1 || r.right > innerWidth + 1 || e.scrollWidth > e.clientWidth + 2 && !["CODE"].includes(e.tagName));
    }).map(n => n.outerHTML.slice(0, 250)));
    expect(overflowing).toEqual([]);
    await expect(page.getByTestId("selected-comparison")).toContainText("Example Research A");
    await expect(page.getByTestId("selected-comparison")).toContainText("Example Research B");
  });
}

test("keyboard navigation reaches the content and all comparison controls", async ({ page, browserName }) => {
  await openStory(page);
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  const radio = page.getByRole("radio", { name: "Matching record", exact: true });
  await radio.focus(); await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("evidence-demo")).toHaveAttribute("data-case", "missing");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("evidence-demo")).toHaveAttribute("data-case", "mismatch");
  const button = page.getByRole("group", { name: "Choose a field to compare" }).getByRole("button", { name: "Compound", exact: true });
  await button.focus(); await page.keyboard.press("Enter");
  await expect(page.getByTestId("claim-compound")).toHaveAttribute("aria-pressed", "true");
  await page.getByTestId("handoff-demo").locator("summary").focus(); await page.keyboard.press("Space");
  await expect(page.getByTestId("handoff-demo").locator("details")).toHaveAttribute("open", "");
});

test("reduced-motion changes work without reloading, with static explanations still available", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openStory(page);
  await expect(page.getByTestId("evidence-demo")).toHaveAttribute("data-reduced", "true");
  await expect(page.getByTestId("evidence-demo").locator("details")).toHaveAttribute("open", "");
  await expect(page.getByTestId("grade-demo").locator("details").last()).toHaveAttribute("open", "");
  await page.getByTestId("claim-manufacturer").click();
  await expect(page.getByTestId("record-manufacturer")).toHaveAttribute("aria-pressed", "true");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.getByTestId("evidence-demo")).toHaveAttribute("data-reduced", "false");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByTestId("evidence-demo")).toHaveAttribute("data-reduced", "true");
});

test("full prose, static outcomes and link explanations remain usable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/work/vialgrade`);
  for (const text of original.prose) await expect(page.locator("main")).toContainText(text);
  await page.getByText("Read all three outcomes without switching records", { exact: true }).click();
  await expect(page.getByTestId("evidence-demo").locator("details")).toContainText("Missing evidence is a gap");
  await page.getByText("What this example does and does not run", { exact: true }).click();
  await expect(page.getByTestId("grade-demo")).toContainText("All prepared outcomes");
  await expect(page.getByTestId("claim-batch")).toBeDisabled();
  await page.getByTestId("handoff-demo").locator("summary").click();
  await expect(page.getByTestId("handoff-demo").locator("dl")).toBeVisible();
  await context.close();
});

test("automated accessibility checks pass for missing, matching, conflicting and expanded grade states", async ({ page }) => {
  await openStory(page);
  for (const [record, grade] of [["Matching record", "Missing evidence"], ["No matching record", "Supported record"], ["Conflicting record", "Verified concern"]]) {
    await page.getByRole("radio", { name: record, exact: true }).check();
    await page.getByRole("radio", { name: grade, exact: true }).check();
    await page.evaluate(() => document.querySelectorAll("details").forEach(d => d.open = true));
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) }))).toEqual([]);
  }
});

test("screenshot loads with its actual aspect ratio and its historical label", async ({ page }) => {
  await openStory(page);
  const image = page.getByAltText("Earlier VialGrade homepage with its verification search and source-focused layout");
  await image.scrollIntoViewIfNeeded();
  await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  const aspect = await image.evaluate((img: HTMLImageElement) => ({ rendered: img.width / img.height, source: img.naturalWidth / img.naturalHeight }));
  expect(Math.abs(aspect.rendered - aspect.source)).toBeLessThan(.01);
  await expect(page.locator("figcaption")).toContainText("not a statement of current activity or product safety");
});

test("fast scrolling and backward navigation never leave the story hidden or the page broken", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
  await openStory(page);
  for (const y of [8000, 0, 3000, 7000, 0]) await page.evaluate(y => window.scrollTo({ top: y, behavior: "instant" }), y);
  await page.getByRole("link", { name: /Inspect a claim/ }).click();
  await expect(page).toHaveURL(/#evidence$/);
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const skipBottom = await page.getByRole("link", { name: "Skip to content" }).evaluate(el => el.getBoundingClientRect().bottom);
  expect(skipBottom).toBeLessThanOrEqual(0);
  expect(errors).toEqual([]);
});

test("both highlights visibly travel between fields and settle on the same row", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1300 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openStory(page);
  await page.getByTestId("evidence-demo").scrollIntoViewIfNeeded();
  const motion = await page.evaluate(async () => {
    const position = (side: string) => document.querySelector(`[data-testid="${side}-highlight"]`)!.getBoundingClientRect().y;
    const start = { left: position("claim"), right: position("record") };
    (document.querySelector('[data-testid="claim-manufacturer"]') as HTMLButtonElement).click();
    const samples: Array<{ left: number; right: number }> = [];
    for (let i = 0; i < 32; i++) {
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      samples.push({ left: position("claim"), right: position("record") });
    }
    return { start, samples };
  });
  const end = motion.samples.at(-1)!;
  expect(end.left - motion.start.left).toBeGreaterThan(100);
  expect(end.right - motion.start.right).toBeGreaterThan(100);
  expect(motion.samples.some(s => s.left > motion.start.left + 2 && s.left < end.left - 2)).toBe(true);
  expect(motion.samples.some(s => s.right > motion.start.right + 2 && s.right < end.right - 2)).toBe(true);
  expect(Math.abs(end.left - end.right)).toBeLessThan(1);
});
