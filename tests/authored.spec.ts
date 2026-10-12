import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import source from '../docs/source-slices/gpt-block.json';

const slugs = ['della', 'vialgrade', 'transformer'] as const;
async function open(page: Page, slug: string) {
  await page.goto(`/work/${slug}`);
  await page.evaluate(() => document.fonts.ready);
  for (const img of await page.locator('main img:visible').all()) {
    await img.scrollIntoViewIfNeeded();
    await img.evaluate((el: HTMLImageElement) => el.decode());
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
}

test('the covers are composed around different artifacts, not a cloned demo-and-heading layout', async ({ page }) => {
  await open(page, 'della');
  const image = await page.getByTestId('della-artifact').boundingBox();
  const booking = await page.getByTestId('booking-demo').boundingBox();
  expect(image!.y + image!.height).toBeLessThan(booking!.y);
  await expect(page.getByTestId('della-artifact').getByRole('img')).toBeInViewport();
  await open(page, 'vialgrade');
  const essay = await page.locator('#origin').boundingBox();
  const comparison = await page.getByTestId('evidence-demo').boundingBox();
  expect(essay!.y + essay!.height).toBeLessThan(comparison!.y);
  await expect(page.getByTestId('grade-details')).not.toHaveAttribute('open');
  await open(page, 'transformer');
  const work = await page.getByTestId('transformer-artifact').boundingBox();
  const numbers = await page.getByTestId('prediction-preview').boundingBox();
  expect(work!.y + work!.height).toBeLessThan(numbers!.y);
  await expect(page.getByTestId('transformer-artifact').getByRole('img')).toBeInViewport();
});

test('the visible source examples are excerpts of the actual source, not illustrative pseudocode', async ({ page }) => {
  await open(page, 'vialgrade');
  const gradeExcerpt = await page.getByTestId('grade-source-excerpt').locator('pre').textContent();
  const gradeSource = readFileSync('src/app/work/vialgrade/grade-projection.ts', 'utf8');
  expect(gradeSource.replace(/\s+/g, ' ')).toContain(gradeExcerpt!.replace(/\s+/g, ' '));
  await open(page, 'transformer');
  const excerpt = await page.getByTestId('residual-example').locator('pre').textContent();
  expect(excerpt!.replace(/\s+/g, ' ').trim()).toBe(source.excerpt.replace(/\s+/g, ' ').trim());
  await expect(page.getByTestId('residual-example').locator('mark')).toHaveText(['x +', 'x +']);
});

for (const slug of slugs) {
  test(`${slug}: original work remains visible, navigation identifies this project, no browser errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    await open(page, slug);
    await expect(page.locator('nav a[aria-current="page"]')).toHaveAttribute('href', `/work/${slug}`);
    await expect(page.locator('main img:visible').first()).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    expect(await page.locator('main h2:visible').count()).toBeLessThanOrEqual(2);
    expect(errors).toEqual([]);
  });
  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`${slug}: artifact and prose fit at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 950 });
      await open(page, slug);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
      for (const locator of ['main h1', 'main img:visible']) {
        for (const element of await page.locator(locator).all()) {
          const box = await element.boundingBox();
          expect(box!.x).toBeGreaterThanOrEqual(-1);
          expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
        }
      }
      if (slug === 'vialgrade') {
        await page.getByTestId('grade-details').locator(':scope > summary').click();
        await page.getByRole('radio', { name: 'Different maker', exact: true }).check();
      } else if (slug === 'transformer') {
        await page.getByTestId('transformer-artifact').getByRole('button', { name: 'Training', exact: true }).click();
        await page.getByRole('radio', { name: 'Preview after ROMEO:', exact: true }).check();
      } else {
        await page.getByTestId('della-artifact').getByRole('button', { name: 'Full workspace', exact: true }).click();
        await page.getByRole('button', { name: "What if it doesn't book?", exact: true }).click();
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    });
  }
  test(`${slug}: initial and expanded page pass accessibility checks`, async ({ page }) => {
    await open(page, slug);
    const scan = async () => {
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, text: n.failureSummary })) }))).toEqual([]);
    };
    await scan();
    if (slug === 'della') {
      await page.getByRole('button', { name: 'Full workspace', exact: true }).click();
      await page.getByRole('button', { name: 'Edit message', exact: true }).click();
    } else if (slug === 'vialgrade') {
      await page.getByTestId('grade-details').locator(':scope > summary').click();
      await page.getByTestId('grade-demo').locator('summary').click();
    } else {
      await page.getByRole('button', { name: 'Training', exact: true }).click();
      await page.getByRole('button', { name: 'Pick a character', exact: true }).click();
    }
    await scan();
  });
  test(`${slug}: no JavaScript still gives an intelligible page and real imagery`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    try {
      const page = await context.newPage();
      await page.goto(`${baseURL}/work/${slug}`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const image = page.locator('main img:visible').first();
      await image.scrollIntoViewIfNeeded();
      await expect(image).toBeVisible();
      if (slug === 'vialgrade') {
        await page.getByTestId('grade-details').locator(':scope > summary').click();
        await expect(page.getByTestId('grade-unknown')).toBeVisible();
      }
      await expect(page.locator('main [data-interactive="true"]:visible')).toHaveCount(0);
    } finally { await context.close(); }
  });
}

test('image switches can be operated by keyboard and do not claim a new live app state', async ({ page }) => {
  await open(page, 'della');
  const full = page.getByTestId('della-artifact').getByRole('button', { name: 'Full workspace', exact: true });
  await full.focus(); await page.keyboard.press('Enter');
  await expect(full).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('della-artifact')).toContainText('This is an image');
  await open(page, 'transformer');
  const training = page.getByTestId('transformer-artifact').getByRole('button', { name: 'Training', exact: true });
  await training.focus(); await page.keyboard.press('Enter');
  await expect(training).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('transformer-artifact')).toContainText('not a measured loss surface');
});

test('capture current desktop and mobile views for review, including decoded images', async ({ page }, info) => {
  mkdirSync('qa/authored', { recursive: true });
  const measurements = [];
  for (const slug of slugs) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await open(page, slug);
    await page.screenshot({ path: `qa/authored/${slug}-desktop-${info.project.name}.png`, animations: 'disabled' });
    await page.screenshot({ path: `qa/authored/${slug}-full-${info.project.name}.png`, fullPage: true, animations: 'disabled' });
    measurements.push({ slug, height: await page.evaluate(() => document.body.scrollHeight), headings: await page.locator('main h2:visible').allTextContents() });
    await page.setViewportSize({ width: 390, height: 844 });
    await open(page, slug);
    await page.screenshot({ path: `qa/authored/${slug}-phone-${info.project.name}.png`, animations: 'disabled' });
  }
  writeFileSync(`qa/authored/review-${info.project.name}.json`, JSON.stringify(measurements, null, 2));
});
