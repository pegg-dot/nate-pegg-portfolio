import { test, expect, type Page } from '@playwright/test';

const nameOffsets = (page: Page) => page.$$eval('[data-name] path[data-stroke]', ps => ps.map(p => parseFloat(getComputedStyle(p).strokeDashoffset)));

test('the cover is complete at rest', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(4200);
  const offsets = await nameOffsets(page);
  expect(offsets.length).toBeGreaterThan(0);
  offsets.forEach(o => expect(o).toBe(0));
  await expect(page.locator('#intro')).toHaveCSS('opacity', '1');
});

test('scrolling finishes the name instantly', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(200);
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(300);
  const offsets = await nameOffsets(page);
  expect(offsets.length).toBeGreaterThan(0);
  offsets.forEach(o => expect(o).toBe(0));
});

test('tabs do not move after fonts.ready', async ({ page }) => {
  await page.goto('/');
  const rects = () => page.$$eval('[data-zone="tabs"] a', as => as.map(a => { const r = a.getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; }));
  const before = await rects();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const after = await rects();
  expect(after).toHaveLength(5);
  before.forEach((b, i) => b.forEach((v, k) => expect(Math.abs(v - after[i][k])).toBeLessThanOrEqual(1)));
});
