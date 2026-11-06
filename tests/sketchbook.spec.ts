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

export async function scrollToPage(page: Page, index: number, p: number) {
  await page.evaluate(([i, q]) => {
    const el = document.querySelector(`[data-page="${i}"]`) as HTMLElement;
    window.scrollTo({ top: el.offsetTop + q * (el.offsetHeight - innerHeight), behavior: 'instant' as ScrollBehavior });
  }, [index, p] as const);
  await page.waitForTimeout(900);
}
const ownOpacity = (page: Page, sel: string) => page.$eval(sel, el => parseFloat(getComputedStyle(el).opacity));
const visibleRings = (page: Page) => page.$$eval('[data-page="2"] path.ring', ps => ps.filter(p => getComputedStyle(p).visibility === 'visible' && parseFloat(getComputedStyle(p).opacity) > 0.1).length);

test('della wireframe becomes the real screen', async ({ page }) => {
  await page.goto('/');
  await scrollToPage(page, 2, 0.95);
  expect(await ownOpacity(page, '[data-page="2"] [data-media]')).toBeGreaterThanOrEqual(0.99);
  expect(await ownOpacity(page, '[data-page="2"] [data-sketch="wireframe"]')).toBeLessThanOrEqual(0.01);
});

test('ring lines only while the phone rings', async ({ page }) => {
  await page.goto('/');
  await scrollToPage(page, 2, 0.08);
  expect(await visibleRings(page)).toBe(0);
  await scrollToPage(page, 2, 0.2);
  expect(await visibleRings(page)).toBeGreaterThan(0);
  await scrollToPage(page, 2, 0.4);
  expect(await visibleRings(page)).toBe(0);
});

test('della reveal shows the fallback image when video is paused', async ({ page }) => {
  await page.goto('/');
  await scrollToPage(page, 2, 0.95);
  await page.evaluate(() => document.querySelector('video')?.pause());
  await page.waitForTimeout(300);
  expect(await ownOpacity(page, '[data-page="2"] video')).toBeLessThanOrEqual(0.01);
  expect(await ownOpacity(page, '[data-page="2"] [data-fallback]')).toBeGreaterThanOrEqual(0.99);
});
