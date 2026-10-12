import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { capture, probabilities, residualValues } from '../src/app/work/transformer/capture-model';
import { previewPrediction, prefixChoices, drawPreview, residualExample, displayPercent } from '../src/app/work/transformer/reader-model';
import copy from '../src/app/work/transformer/story-copy.json';

async function openStory(page: Page) {
  await page.goto('/work/transformer');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('[data-transformer-edition="authored"]')).toBeVisible();
}

test('the reader gets a complete prediction without first opening the model explorer', async ({ page }) => {
  await openStory(page);
  await expect(page.getByTestId('preview-prefix')).toHaveText('RO');
  await expect(page.getByTestId('prediction-preview')).toContainText('51.1%');
  await expect(page.getByTestId('preview-explanation')).toContainText('M is the most likely');
  await expect(page.getByTestId('transformer-artifact').getByRole('img')).toBeInViewport();
  await expect(page.getByTestId('preview-explanation')).toBeVisible();
  await expect(page.getByTestId('model-explorer-disclosure')).not.toHaveAttribute('open');
  await expect(page.getByTestId('transformer-lab')).not.toBeVisible();
  await expect(page.getByTestId('preview-draw')).toHaveCount(0);
});

test('the reading copy is first-person and does not require a glossary of model components', async ({ page }) => {
  await openStory(page);
  const visible = await page.locator('main').innerText();
  expect(visible.split(/\s+/).length).toBeLessThan(850);
  expect(visible).toContain(copy.intro);
  expect(visible).not.toContain('residual dimensions');
  expect(visible).not.toContain('A prediction begins here');
  expect(visible).not.toContain('Queries');
  await expect(page.getByText(copy.residual, { exact: true })).toBeVisible();
  for (const paragraph of copy.takeaway) await expect(page.getByText(paragraph, { exact: true })).toBeVisible();
});

test('the preview uses the actual 65-way captured distribution, not made-up chart percentages', () => {
  for (const option of prefixChoices) {
    const result = previewPrediction(option.position);
    expect(result.prefix).toBe(option.text);
    expect(result.distribution).toEqual(probabilities(capture.logits[option.position], 1));
    expect(result.distribution).toHaveLength(65);
    expect(result.top).toHaveLength(3);
    expect(result.otherCount).toBe(62);
    expect(result.top.reduce((sum, row) => sum + row.probability, result.remainder)).toBeCloseTo(1, 12);
  }
  expect(previewPrediction(1).top[0].character).toBe('M');
  expect(previewPrediction(1).top[0].probability).toBeCloseTo(.5109560944, 9);
  expect(previewPrediction(5).top[0].character).toBe('\n');
  expect(() => previewPrediction(-1)).toThrow();
  expect(() => previewPrediction(1.5)).toThrow();
  expect(() => previewPrediction(6)).toThrow();
  expect(displayPercent(.0001)).toBe('<0.1%');
});

test('sampling includes characters outside the displayed top three and does not change model values', () => {
  for (const option of prefixChoices) {
    const distribution = previewPrediction(option.position).distribution;
    let cumulative = 0;
    for (let index = 0; index < distribution.length; index++) {
      const draw = cumulative + distribution[index] / 2;
      expect(drawPreview(option.position, draw)).toBe(index);
      cumulative += distribution[index];
    }
  }
  expect(() => drawPreview(1, 1)).toThrow();
});

test('the simple residual illustration uses one actual coordinate, with float32 precision', () => {
  const source = residualValues(5, 0, 'attention');
  expect(residualExample.original).toBe(source.input[1]);
  expect(residualExample.update).toBe(source.update[1]);
  expect(residualExample.result).toBe(source.output[1]);
  expect(residualExample.original + residualExample.update).toBeCloseTo(residualExample.result, 6);
  expect(residualExample.original.toFixed(4)).toBe('0.5370');
  expect(residualExample.update.toFixed(4)).toBe('0.8794');
  expect(residualExample.result.toFixed(4)).toBe('1.4164');
});

test('choosing a later prefix shows its saved probabilities and clears the previous draw', async ({ page }) => {
  await openStory(page);
  await page.getByRole('button', { name: 'Pick a character', exact: true }).click();
  await expect(page.getByTestId('preview-draw')).toBeVisible();
  await expect(page.getByTestId('preview-prefix')).toHaveText('RO');
  for (const option of prefixChoices.slice(1)) {
    await page.getByRole('radio', { name: `Preview after ${option.text}`, exact: true }).check();
    await expect(page.getByTestId('preview-prefix')).toHaveText(option.text);
    await expect(page.getByTestId('preview-draw')).toHaveCount(0);
    const values = await page.locator('[data-preview-probability]').evaluateAll(nodes => nodes.map(node => Number(node.getAttribute('data-preview-probability'))));
    expect(values.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 12);
  }
  await expect(page.getByTestId('preview-explanation')).toContainText('A new line');
  await expect(page.getByTestId('prediction-preview')).toContainText('<0.1%');
});

test('a draw can pick an undisplayed character without pretending to run the model again', async ({ page }) => {
  await openStory(page);
  const prediction = previewPrediction(1);
  const target = prediction.distribution.findIndex((_, index) => !prediction.top.some(item => item.index === index));
  const draw = prediction.distribution.slice(0, target).reduce((a, b) => a + b, 0) + prediction.distribution[target] / 2;
  await page.evaluate(value => { Math.random = () => value; }, draw);
  const before = await page.locator('[data-preview-probability]').allTextContents();
  await page.getByRole('button', { name: 'Pick a character', exact: true }).click();
  await expect(page.getByTestId('preview-draw')).toHaveAttribute('data-index', String(target));
  await expect(page.getByTestId('preview-draw')).toContainText("this isn't a new model run");
  await expect(page.getByTestId('preview-prefix')).toHaveText('RO');
  expect(await page.locator('[data-preview-probability]').allTextContents()).toEqual(before);
});

test('the detailed explorer keeps all five views and independent controls after opening', async ({ page }) => {
  await openStory(page);
  const detail = page.getByTestId('model-explorer-disclosure');
  await detail.locator(':scope > summary').click();
  const lab = page.getByTestId('transformer-lab');
  await expect(lab).toBeVisible();
  for (const name of ['Characters', 'Embeddings', 'Attention', 'Residual', 'Prediction']) {
    await lab.getByRole('group', { name: 'Follow the computation' }).getByRole('button', { name: new RegExp(name) }).click();
    await expect(lab).toHaveAttribute('data-stage', name);
  }
  await detail.locator(':scope > summary').click();
  await expect(lab).not.toBeVisible();
  await expect(page.getByTestId('preview-prefix')).toHaveText('RO');
});

test('native keyboard controls reach the story and change the preview', async ({ page, browserName }) => {
  await openStory(page);
  await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.getByRole('radio', { name: 'Preview after RO', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByTestId('preview-prefix')).toHaveText('ROM');
  const summary = page.getByTestId('model-explorer-disclosure').locator(':scope > summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('transformer-lab')).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('transformer-lab')).not.toBeVisible();
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`the reading layer and residual equation fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    await openStory(page);
    for (const option of prefixChoices) {
      await page.getByRole('radio', { name: `Preview after ${option.text}`, exact: true }).check();
      await page.getByRole('button', { name: 'Pick a character', exact: true }).click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    }
    for (const selector of ['[data-testid="prediction-preview"]', '[data-testid="residual-example"]', 'h1']) {
      const rect = await page.locator(selector).boundingBox();
      expect(rect!.x).toBeGreaterThanOrEqual(0);
      expect(rect!.x + rect!.width).toBeLessThanOrEqual(width + 1);
    }
    for (const control of await page.getByTestId('prediction-preview').locator('label, button').all()) expect((await control.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  });
}

test('mobile headings keep their words separated when desktop line breaks disappear', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openStory(page);
  const headings = (await page.locator('main h2').allInnerTexts()).map(text => text.replace(/\s+/g, ' ').trim());
  expect(headings).toEqual(['A residual connection', 'A prediction from the model']);
});

test('reduced-motion changes affect the preview without automatically opening the advanced controls', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openStory(page);
  await expect(page.getByTestId('prediction-preview')).toHaveAttribute('data-reduced', 'true');
  await page.getByRole('radio', { name: 'Preview after ROMEO:', exact: true }).check();
  await expect(page.getByTestId('preview-explanation')).toContainText('A new line');
  await expect(page.getByTestId('model-explorer-disclosure')).not.toHaveAttribute('open');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.getByTestId('prediction-preview')).toHaveAttribute('data-reduced', 'false');
});

test('no inference service, model download or mutating request is involved', async ({ page }) => {
  const unexpected: string[] = [];
  page.on('request', request => {
    const url = new URL(request.url());
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method()) || /\.onnx|activations\.json|\/api\//.test(url.pathname) || !['localhost', '127.0.0.1', 'nate-pegg-portfolio.vercel.app'].includes(url.hostname)) unexpected.push(request.url());
  });
  await openStory(page);
  for (const option of prefixChoices) {
    await page.getByRole('radio', { name: `Preview after ${option.text}`, exact: true }).check();
    await page.getByRole('button', { name: 'Pick a character', exact: true }).click();
  }
  await page.getByTestId('model-explorer-disclosure').locator(':scope > summary').click();
  await expect(page.getByTestId('transformer-lab')).toBeVisible();
  expect(unexpected).toEqual([]);
});

test('both original images remain visible and keep their correct aspect ratio', async ({ page }) => {
  await openStory(page);
  for (const name of [/query, key and value/, /teaching illustration/]) {
    if (String(name).includes('teaching')) await page.getByTestId('transformer-artifact').getByRole('button', { name: 'Training', exact: true }).click();
    const image = page.getByRole('img', { name });
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((el: HTMLImageElement) => el.decode());
    expect(await image.evaluate((el: HTMLImageElement) => el.naturalWidth / el.naturalHeight)).toBeCloseTo(900 / 493, 2);
  }
  await expect(page.getByText('A gradient-descent illustration, not a measured loss surface.')).toBeVisible();
});

test('accessibility checks cover the reading layer, sample result and source disclosure', async ({ page }) => {
  await openStory(page);
  for (const option of prefixChoices) {
    await page.getByRole('radio', { name: `Preview after ${option.text}`, exact: true }).check();
    await page.getByRole('button', { name: 'Pick a character', exact: true }).click();
    await page.waitForTimeout(260);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.failureSummary) }))).toEqual([]);
  }
  await page.getByText('Model details and sources', { exact: false }).click();
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(result.violations).toEqual([]);
});
