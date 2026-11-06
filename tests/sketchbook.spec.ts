import { test, expect, type Page } from '@playwright/test';

const nameOffsets = (page: Page) => page.$$eval('[data-name] path[data-stroke]', ps => ps.map(p => parseFloat(getComputedStyle(p).strokeDashoffset)));

test('the cover is complete at rest', async ({ page }) => {
  await page.goto('/');
  // It writes itself in about three seconds without any input; allow for a loaded machine.
  let offsets: number[] = [];
  for (let k = 0; k < 40; k++) { await page.waitForTimeout(200); offsets = await nameOffsets(page); if (offsets.length && offsets.every(o => o === 0)) break; }
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
  // settle: the eased scroll and the figure stop moving
  let prev = '';
  for (let k = 0; k < 24; k++) {
    await page.waitForTimeout(150);
    const t = await page.evaluate(() => document.querySelector('[data-zone="figure"]')?.getAttribute('style') ?? '');
    if (t === prev && k > 2) break;
    prev = t;
  }
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

for (const [index, name] of [[3, 'vialgrade'], [4, 'transformer']] as const) {
  test(`${name} reveals its real screen`, async ({ page }) => {
    await page.goto('/');
    await scrollToPage(page, index, 0.95);
    expect(await ownOpacity(page, `[data-page="${index}"] [data-media]`)).toBeGreaterThanOrEqual(0.99);
    expect(await ownOpacity(page, `[data-page="${index}"] [data-sketch="wireframe"]`)).toBeLessThanOrEqual(0.01);
  });
}

test('the transformer page is the only dark page', async ({ page }) => {
  await page.goto('/');
  expect(await page.locator('[data-dark="true"]').count()).toBe(1);
  expect(await page.locator('[data-page="4"] [data-dark="true"]').count()).toBe(1);
});

import { HOME_COPY } from '../src/app/sketchbook/copy';

test('each desk row keeps its link', async ({ page }) => {
  await page.goto('/');
  for (const row of HOME_COPY.desk.rows) {
    await expect(page.locator(`[data-page="5"] a[href="${row.href}"]`).first(), row.href).toBeAttached();
    if (row.liveHref) await expect(page.locator(`[data-page="5"] a[href="${row.liveHref}"]`).first(), row.liveHref).toBeAttached();
  }
});

test('the hop happens over the mug', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/');
  let hops = 0;
  for (let p = 0.3; p <= 0.6; p += 0.02) {
    await scrollToPage(page, 5, p);
    const s = await page.evaluate(() => {
      const fig = document.querySelector('[data-zone="figure"]') as HTMLElement;
      const m = fig.style.transform.match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/);
      const fr = fig.getBoundingClientRect();
      const mugs = Array.from(document.querySelectorAll('[data-page="5"] path.mug')).map(e => e.getBoundingClientRect());
      const left = Math.min(...mugs.map(r => r.left)), right = Math.max(...mugs.map(r => r.right));
      return { cx: fr.left + fr.width / 2, lift: m ? parseFloat(m[2]) : 0, mugL: left, mugR: right };
    });
    const over = s.cx >= s.mugL - 40 && s.cx <= s.mugR + 40;
    if (s.lift < -10) { hops++; expect(over, `lift ${s.lift} at x ${s.cx} (mug ${s.mugL}–${s.mugR}, p ${p.toFixed(2)})`).toBe(true); }
  }
  expect(hops).toBeGreaterThan(0);
});

test('drawings arrive real after their outline', async ({ page }) => {
  await page.goto('/');
  await scrollToPage(page, 6, 0.95);
  const opacities = await page.$$eval('[data-page="6"] [data-media]', els => els.map(e => parseFloat(getComputedStyle(e).opacity)));
  expect(opacities).toHaveLength(6);
  opacities.forEach(o => expect(o).toBeGreaterThanOrEqual(0.99));
});

test('the shirt gets its color only on the About page', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/');
  const colored = () => page.$eval('div[data-zone="figure"] svg', el => el.classList.contains('colored'));
  for (const i of [0, 1, 2, 3, 4, 5, 6]) { await scrollToPage(page, i, 0.95); expect(await colored(), `page ${i}`).toBe(false); }
  await scrollToPage(page, 8, 0.95);
  expect(await colored()).toBe(true);
});

test('rowing hides the walking figure and keeps the boat', async ({ page }) => {
  await page.goto('/');
  await scrollToPage(page, 7, 0.5);
  expect(await page.$eval('div[data-zone="figure"]', el => (el as HTMLElement).hidden)).toBe(true);
  expect(await page.locator('[data-page="7"] .rowingSketchLine').count()).toBe(13);
  expect(await page.locator('[data-page="7"] .rowingSketch [data-rower]').count()).toBe(1);
});
