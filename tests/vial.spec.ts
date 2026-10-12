import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import pinned from './fixtures/vial-grade-source.json';
import copy from '../src/app/work/vialgrade/story-copy.json';
import { claim, fields, compareDocuments, recordFor, exampleGrade, gradeExamples, exampleTaggedUrl, linkParts } from '../src/app/work/vialgrade/evidence-model';
import { gradeFromVerdict } from '../src/app/work/vialgrade/grade-projection';
import { readingComparison, readingCases, findings } from '../src/app/work/vialgrade/reading-model';

async function openStory(page: Page) {
  await page.goto('/work/vialgrade');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('[data-vial-edition="product-native"]')).toBeVisible();
}

// Nate requested the same editorial pass as Della. The original-copy fixture stays
// unchanged as provenance, not a false claim that this requested rewrite is verbatim.
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

test('the whole comparison makes sense on arrival without choosing a field', async ({ page }) => {
  await openStory(page);
  const demo = page.getByTestId('evidence-demo');
  await expect(demo).toHaveAttribute('data-result', 'match');
  await expect(page.getByTestId('evidence-finding')).toContainText('These details match.');
  await page.getByTestId('evidence-demo').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('evidence-finding')).toBeVisible();
  for (const { key } of fields) {
    await expect(page.getByTestId(`claim-${key}`)).toHaveText(claim[key]);
    await expect(page.getByTestId(`record-${key}`)).toHaveText(claim[key]);
  }
  await expect(demo.getByRole('button')).toHaveCount(0);
  await expect(demo.getByRole('group', { name: 'Compare the vendor claim and lab record', exact: true })).toHaveCount(1);
});

test('the revised story is personal and concise, without the rejected money line', async ({ page }) => {
  await openStory(page);
  for (const value of Object.values(copy)) {
    for (const text of Array.isArray(value) ? value : [value]) await expect(page.getByText(text, { exact: true })).toBeVisible();
  }
  const prose = await page.locator('main').innerText();
  expect(prose).toContain('wanted a better way to compare');
  expect(prose).not.toContain('not making money');
  expect(prose).not.toContain('no live affiliate deals');
  expect(prose).not.toContain('The fields match. The scope matters.');
  expect(prose).not.toContain('Unknown has to stay unknown');
  expect(prose.split(/\s+/).length).toBeLessThan(850);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('VialGrade');
});

test('reading copy uses the real local matcher for all prepared cases', () => {
  for (const item of readingCases) {
    const view = readingComparison(item.key);
    expect(view.status).toBe(compareDocuments(claim, recordFor(item.key)).status);
    expect(view.finding).toEqual(findings[view.status]);
  }
});

test('a missing source is visibly missing, not a fake match or an accusation', async ({ page }) => {
  await openStory(page);
  await page.getByRole('radio', { name: 'No record', exact: true }).check();
  await expect(page.getByTestId('evidence-demo')).toHaveAttribute('data-result', 'missing');
  for (const { key } of fields) await expect(page.getByTestId(`record-${key}`)).toHaveText('Not on file');
  await expect(page.getByTestId('evidence-finding')).toContainText("doesn't prove the vendor did something wrong");
  await expect(page.locator('[data-disagrees="true"]')).toHaveCount(0);
});

test('the conflicting maker remains explicit even though the batch and compound match', async ({ page }) => {
  await openStory(page);
  await page.getByRole('radio', { name: 'Different maker', exact: true }).check();
  await expect(page.getByTestId('evidence-demo')).toHaveAttribute('data-result', 'mismatch');
  await expect(page.getByTestId('record-manufacturer')).toContainText('Example Research B');
  await expect(page.getByTestId('claim-manufacturer')).toHaveText('Example Research A');
  await expect(page.getByTestId('record-manufacturer')).toContainText("Doesn't match");
  await expect(page.locator('[data-disagrees="true"]')).toHaveCount(1);
  await expect(page.getByTestId('evidence-finding')).toContainText('A matching batch code alone is not enough.');
  await expect(page.getByTestId('record-batch')).toHaveText(claim.batch);
  await page.getByRole('radio', { name: 'Details match', exact: true }).check();
  await expect(page.getByTestId('record-manufacturer')).toHaveText('Example Research A');
  await expect(page.locator('[data-disagrees="true"]')).toHaveCount(0);
});

test('all three grade examples can be opened together and use the unchanged projection', async ({ page }) => {
  await openStory(page);
  await page.getByTestId('grade-details').locator(':scope > summary').click();
  for (const key of ['unknown', 'supported', 'concern'] as const) {
    const grade = page.getByTestId(`grade-${key}`);
    await expect(grade).toBeVisible();
    await expect(grade).toHaveAttribute('data-letter', exampleGrade(key).letter ?? 'none');
  }
  await expect(page.getByTestId('grade-demo')).toContainText("The test count alone doesn't earn the grade.");
  await expect(page.getByTestId('grade-demo')).toContainText('not ratings of the records above');
  await expect(page.getByTestId('grade-demo').getByRole('radio')).toHaveCount(0);
});

test('changing a document case never silently rates that document or changes the independent grade examples', async ({ page }) => {
  await openStory(page);
  await page.getByTestId('grade-details').locator(':scope > summary').click();
  const before = await page.getByTestId('grade-demo').innerText();
  for (const item of readingCases) {
    await page.getByRole('radio', { name: item.label, exact: true }).check();
    expect(await page.getByTestId('grade-demo').innerText()).toBe(before);
  }
});

test('optional grade detail explains the supplied inputs rather than running an upstream verdict engine', async ({ page }) => {
  await openStory(page);
  await page.getByTestId('grade-details').locator(':scope > summary').click();
  const detail = page.getByTestId('grade-demo').locator('details');
  await expect(detail).not.toHaveAttribute('open');
  await detail.locator('summary').click();
  await expect(detail).toContainText('Assessment: unproven. Independent tests: 0. Grade: none.');
  await expect(detail).toContainText('Assessment: trusted. Independent tests: 3. Grade: A-.');
  await expect(detail).toContainText('Assessment: caution. Independent tests: 3. Grade: C-.');
  await expect(detail).toContainText("this page doesn't collect evidence");
});

test('the safety limit is beside both the comparison and the grades', async ({ page }) => {
  await openStory(page);
  await page.getByTestId('grade-details').locator(':scope > summary').click();
  await expect(page.getByTestId('evidence-demo')).toContainText("doesn't establish what's in a vial or whether it's safe for human use");
  await expect(page.getByTestId('grade-demo')).toContainText('evidence, not product safety');
  for (const item of readingCases) {
    await page.getByRole('radio', { name: item.label, exact: true }).check();
    await expect(page.getByTestId('evidence-demo')).toContainText('safe for human use');
  }
});

test('the referral explanation is readable without opening a URL and never implies a purchase', async ({ page }) => {
  await openStory(page);
  const handoff = page.getByTestId('handoff-demo');
  await expect(handoff).toContainText('The outbound click can be recorded.');
  await expect(handoff).toContainText("The link alone doesn't tell me.");
  await handoff.locator('summary').click();
  await expect(handoff.locator('details code')).toHaveText(exampleTaggedUrl);
  for (const part of linkParts) await expect(handoff).toContainText(part.meaning);
  await expect(handoff.getByRole('link')).toHaveCount(0);
  expect(new URL(exampleTaggedUrl).hostname).toBe('vendor.example');
});

test('all new interactions stay local and never contact a vendor, lab or production API', async ({ page }) => {
  await openStory(page);
  const unexpected: string[] = [];
  page.on('request', r => {
    const u = new URL(r.url());
    if (!['GET', 'HEAD', 'OPTIONS'].includes(r.method()) || /vendor\.example|vialgrade\.com|\/api\//.test(r.url()) || !['localhost', '127.0.0.1', 'nate-pegg-portfolio.vercel.app'].includes(u.hostname)) unexpected.push(`${r.method()} ${r.url()}`);
  });
  for (const item of readingCases) await page.getByRole('radio', { name: item.label, exact: true }).check();
  for (const summary of await page.locator('main summary').all()) await summary.click();
  await page.waitForTimeout(250);
  expect(unexpected).toEqual([]);
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`paired values and all expanded explanations fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await openStory(page);
    for (const item of readingCases) {
      await page.getByRole('radio', { name: item.label, exact: true }).check();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
      for (const { key } of fields) {
        const claimBox = await page.getByTestId(`claim-${key}`).boundingBox();
        const recordBox = await page.getByTestId(`record-${key}`).boundingBox();
        expect(Math.abs(claimBox!.y - recordBox!.y)).toBeLessThan(1);
        expect(recordBox!.x + recordBox!.width).toBeLessThanOrEqual(width + 1);
        expect(claimBox!.x).toBeGreaterThanOrEqual(0);
      }
    }
    for (const summary of await page.locator('main summary').all()) await summary.click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    for (const label of await page.getByTestId('evidence-demo').locator('label').all()) expect((await label.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  });
}

test('keyboard operation reaches the content, changes the radio choice and opens the methodology', async ({ page, browserName }) => {
  await openStory(page);
  await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.getByRole('radio', { name: 'Details match', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'No record', exact: true })).toBeChecked();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'Different maker', exact: true })).toBeChecked();
  const outer = page.getByTestId('grade-details').locator(':scope > summary');
  await outer.focus();
  await page.keyboard.press('Enter');
  const summary = page.getByTestId('grade-demo').locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('grade-demo').locator('details')).toHaveAttribute('open', '');
});

test('reduced motion responds to runtime changes and never hides a conclusion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openStory(page);
  await expect(page.getByTestId('evidence-demo')).toHaveAttribute('data-reduced', 'true');
  await page.getByRole('radio', { name: 'Different maker', exact: true }).check();
  await expect(page.getByTestId('record-manufacturer')).toHaveCSS('background-color', 'rgb(255, 236, 234)');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.getByTestId('evidence-demo')).toHaveAttribute('data-reduced', 'false');
  await expect(page.getByTestId('evidence-finding')).toContainText("The manufacturer doesn't match.");
});

test('without JavaScript every outcome, grade and explanation is still readable', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/work/vialgrade`);
    await expect(page.getByText(copy.intro, { exact: true })).toBeVisible();
    await expect(page.getByTestId('evidence-finding')).toContainText('These details match.');
    await expect(page.getByRole('radio', { name: 'Details match', exact: true })).not.toBeVisible();
    await page.getByText('Read the other outcomes', { exact: true }).click();
    await expect(page.getByText(findings.missing.text, { exact: false })).toBeVisible();
    await page.getByTestId('grade-details').locator(':scope > summary').click();
    await expect(page.getByTestId('grade-unknown')).toBeVisible();
    await expect(page.getByTestId('grade-supported')).toBeVisible();
    await expect(page.getByTestId('grade-concern')).toBeVisible();
    await page.getByTestId('grade-demo').locator('summary').click();
    await expect(page.getByTestId('grade-demo')).toContainText('Assessment: trusted');
    await page.getByTestId('handoff-demo').locator('summary').click();
    await expect(page.getByTestId('handoff-demo').locator('details code')).toHaveText(exampleTaggedUrl);
  } finally { await context.close(); }
});

test('the actual product image and historical figures remain clearly labeled', async ({ page }) => {
  await openStory(page);
  const image = page.getByRole('img', { name: /Earlier VialGrade homepage/ });
  await image.scrollIntoViewIfNeeded();
  await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  const ratio = await image.evaluate((el: HTMLImageElement) => el.naturalWidth / el.naturalHeight);
  expect(Math.abs(ratio - 1.44)).toBeLessThan(.01);
  await expect(page.getByRole('link', { name: /Open the full screenshot/ })).toHaveAttribute('href', '/vialgrade/home.jpg');
  await expect(page.getByText('Earlier reported figures, not live analytics.')).toBeVisible();
  await expect(page.getByText(copy.earlyUse, { exact: true })).toContainText('eight signups over a month');
});

test('accessibility checks cover every record and all expanded details', async ({ page }) => {
  await openStory(page);
  for (const item of readingCases) {
    await page.getByRole('radio', { name: item.label, exact: true }).check();
    await page.waitForTimeout(300);
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(r.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.failureSummary) }))).toEqual([]);
  }
  for (const summary of await page.locator('main summary').all()) await summary.click();
  const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(r.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.failureSummary) }))).toEqual([]);
});

test('fast scrolling and returning to the top leave the complete example readable without errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await openStory(page);
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  await expect(page.getByTestId('evidence-demo')).toHaveAttribute('data-result', 'match');
  expect(errors).toEqual([]);
});

test('the changed record is highlighted without moving or hiding its paired values', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openStory(page);
  const cell = page.getByTestId('record-manufacturer');
  const before = await cell.evaluate(el => getComputedStyle(el).backgroundColor);
  await page.getByRole('radio', { name: 'Different maker', exact: true }).check();
  const samples: string[] = [];
  for (let i = 0; i < 7; i++) { samples.push(await cell.evaluate(el => getComputedStyle(el).backgroundColor)); await page.waitForTimeout(40); }
  await expect(cell).toHaveCSS('background-color', 'rgb(255, 236, 234)');
  expect(samples.some(color => color !== before && color !== 'rgb(255, 236, 234)')).toBe(true);
  await expect(cell).toContainText('Example Research B');
  await expect(page.getByTestId('claim-manufacturer')).toHaveText('Example Research A');
});

test('the product-styled page has one title and correctly spaced mobile section headings', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openStory(page);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('VialGrade');
  const headings = await page.locator('main h2:visible').allInnerTexts();
  expect(headings.map(text => text.replace(/\s+/g, ' ').trim())).toEqual(['Why I started looking into it.', 'Figuring out the grades.', 'After someone leaves the site.', '8 signups', 'What I built.']);
  await expect(page.getByTestId('grade-source-excerpt')).toContainText('letter: null');
});
