import { test, expect } from '@playwright/test';
import { effectiveOpacities, effectiveOpacity, settle } from './helpers/sketchbook';

test('clicking a tab lands on a page with its copy showing', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(600);
  for (const [href, index] of [['#work', 1], ['#draw', 6], ['#row', 7], ['#about', 8]] as const) {
    await page.click(`nav a[href="${href}"]`);
    await page.waitForTimeout(1600);
    expect(await page.$eval('[data-zone="pagenum"]', e => e.textContent), href).toBe(String(index + 1));
    expect(await effectiveOpacity(page, `[data-page="${index}"] [data-zone="copy"]`), href).toBeGreaterThanOrEqual(0.99);
  }
});

test('loading a project anchor lands on a page with its copy showing', async ({ page }) => {
  for (const [hash, index] of [['#della', 2], ['#vialgrade', 3]] as const) {
    await page.goto(`/${hash}`);
    await page.waitForTimeout(1600);
    expect(await effectiveOpacity(page, `[data-page="${index}"] [data-zone="copy"]`), hash).toBeGreaterThanOrEqual(0.99);
  }
});

test('tabbing into a page shows what is focused', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(600);
  await page.focus('[data-page="2"] a[href="/work/della"]');
  await page.waitForTimeout(1600);
  expect(await effectiveOpacity(page, '[data-page="2"] [data-zone="copy"]')).toBeGreaterThanOrEqual(0.99);
  expect(await page.$eval('[data-page="2"] a[href="/work/della"]', el => { const r = el.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; })).toBe(true);
});

test('scrolling back up over a page keeps its copy visible', async ({ page }) => {
  await page.goto('/');
  await settle(page, 2, 0.5);
  await settle(page, 2, 0);
  expect(await effectiveOpacity(page, '[data-page="2"] [data-zone="copy"]')).toBeGreaterThanOrEqual(0.99);
});

test('no javascript shows the drawings and prints with no wireframes on top', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();
  await page.goto('/');
  for (const sel of ['[data-page="6"] [data-media]', '[data-page="7"] [data-zone="canvas"]']) {
    const ops = await effectiveOpacities(page, sel);
    expect(ops.length, sel).toBeGreaterThan(0);
    ops.forEach(o => expect(o, sel).toBeGreaterThanOrEqual(0.99));
  }
  const captions = await effectiveOpacities(page, '[data-page="6"] [data-zone="caption"]');
  expect(captions.filter(o => o >= 0.99).length).toBeGreaterThanOrEqual(1);
  const wires = await page.$$eval('[data-sketch="wireframe"], [data-sketch="hatch"]', els => els.map(el => getComputedStyle(el).display));
  expect(wires.length).toBeGreaterThan(0);
  wires.forEach(d => expect(d).toBe('none'));
  await ctx.close();
});

test('a video that cannot play stays hidden behind the real screen', async ({ page }) => {
  // The autoplay attribute does not go through the scripted play(), so the source is cut as well: the video can never reach `playing`.
  await page.route(/\.(mp4|webm|mov)(\?|$)/, r => r.abort());
  await page.addInitScript(() => { HTMLMediaElement.prototype.play = function () { return Promise.reject(new DOMException('blocked', 'NotAllowedError')); }; });
  await page.goto('/');
  await settle(page, 2, 0.98);
  expect(await page.$eval('[data-page="2"] video', v => parseFloat(getComputedStyle(v).opacity))).toBeLessThanOrEqual(0.01);
  expect(await effectiveOpacity(page, '[data-page="2"] [data-fallback]')).toBeGreaterThanOrEqual(0.99);
});

test('the video keeps its controls and label and does not autoplay under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.waitForTimeout(500);
  const v = page.locator('[data-page="2"] video');
  await expect(v).toHaveAttribute('controls', '');
  await expect(v).toHaveAttribute('aria-label', 'Della product demo');
  expect(await v.getAttribute('autoplay')).toBeNull();
});
