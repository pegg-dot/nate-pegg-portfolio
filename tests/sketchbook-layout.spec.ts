import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

type Box = { zone: string; l: number; t: number; r: number; b: number; tag: string };

/** Visible, clipped, viewport-intersected boxes of every zoned element. */
async function zoneBoxes(page: Page): Promise<Box[]> {
  return page.evaluate(() => {
    const inter = (a: DOMRect | { left: number; top: number; right: number; bottom: number }, b: { left: number; top: number; right: number; bottom: number }) => ({ left: Math.max(a.left, b.left), top: Math.max(a.top, b.top), right: Math.min(a.right, b.right), bottom: Math.min(a.bottom, b.bottom) });
    const out: Box[] = [];
    for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-zone]'))) {
      let e: HTMLElement | null = el, op = 1, ok = true;
      while (e && e !== document.body) { const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none' || e.hidden) { ok = false; break; } op *= parseFloat(cs.opacity); e = e.parentElement; }
      if (!ok || op <= 0.05) continue;
      let r: { left: number; top: number; right: number; bottom: number } = el.getBoundingClientRect();
      let a = el.parentElement;
      while (a && a !== document.body) { const cs = getComputedStyle(a); if (/hidden|clip/.test(cs.overflow)) r = inter(r, a.getBoundingClientRect()); a = a.parentElement; }
      r = inter(r, { left: 0, top: 0, right: innerWidth, bottom: innerHeight });
      if (r.right - r.left <= 2 || r.bottom - r.top <= 2) continue;
      out.push({ zone: el.dataset.zone!, l: r.left, t: r.top, r: r.right, b: r.bottom, tag: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') });
    }
    return out;
  });
}

export async function settle(page: Page, index: number, p: number) {
  await page.evaluate(([i, q]) => { const el = document.querySelector(`[data-page="${i}"]`) as HTMLElement; window.scrollTo({ top: el.offsetTop + q * (el.offsetHeight - innerHeight), behavior: 'instant' as ScrollBehavior }); }, [index, p] as const);
  let prev = '';
  for (let k = 0; k < 24; k++) { await page.waitForTimeout(150); const t = await page.evaluate(() => (document.querySelector('[data-zone="pagenum"]')?.textContent ?? '') + (document.querySelector('div[data-zone="figure"]')?.getAttribute('style') ?? '')); if (t === prev && k > 2) break; prev = t; }
  await page.waitForTimeout(450);
}

const VIEWPORTS: [number, number][] = [[360, 780], [390, 844], [768, 1024], [1024, 768], [1440, 1000], [1440, 700]];

for (const [w, h] of VIEWPORTS) {
  test(`nothing overlaps at ${w}×${h}`, async ({ browser }) => {
    test.setTimeout(240_000);
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    await page.goto('/');
    await page.waitForTimeout(500);
    const pages = await page.locator('[data-page]').count();
    const problems: string[] = [];
    for (let i = 0; i < pages; i++) for (const p of [0.1, 0.5, 0.9]) {
      await settle(page, i, p);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      if (scrollWidth > w) problems.push(`page ${i} p ${p}: horizontal scroll (${scrollWidth} > ${w})`);
      const boxes = await zoneBoxes(page);
      for (let a = 0; a < boxes.length; a++) for (let b = a + 1; b < boxes.length; b++) {
        const A = boxes[a], B = boxes[b];
        if (A.zone === B.zone) continue;
        const iw = Math.min(A.r, B.r) - Math.max(A.l, B.l), ih = Math.min(A.b, B.b) - Math.max(A.t, B.t);
        if (iw > 2 && ih > 2) problems.push(`page ${i} p ${p}: ${A.zone}(${A.tag}) overlaps ${B.zone}(${B.tag}) by ${Math.round(iw)}×${Math.round(ih)}`);
      }
    }
    await ctx.close();
    expect(problems, problems.join('\n')).toEqual([]);
  });
}

test('copy stays visible after a fast scroll', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(300);
  await page.mouse.wheel(0, 20_000);
  await page.waitForTimeout(1500);
  const opacities = await page.$$eval('[data-zone="copy"]', els => els.map(e => parseFloat(getComputedStyle(e).opacity)));
  expect(opacities.length).toBeGreaterThan(8);
  opacities.forEach(o => expect(o).toBeGreaterThanOrEqual(0.99));
});

test('reduced motion shows the finished page', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.waitForTimeout(1200);
  const offsets = await page.$$eval('[data-sketch] path[data-stroke], [data-name] path[data-stroke]', ps => ps.map(p => parseFloat(getComputedStyle(p).strokeDashoffset)));
  expect(offsets.length).toBeGreaterThan(50);
  offsets.forEach(o => expect(o).toBe(0));
  const media = await page.$$eval('[data-media]', els => els.map(e => parseFloat(getComputedStyle(e).opacity)));
  media.forEach(o => expect(o).toBeGreaterThanOrEqual(0.99));
  const a = await page.$eval('div[data-zone="figure"]', e => e.getAttribute('style'));
  await page.waitForTimeout(600);
  const b = await page.$eval('div[data-zone="figure"]', e => e.getAttribute('style'));
  expect(a).toBe(b);
});

test('no javascript shows the finished page', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();
  await page.goto('/');
  const offsets = await page.$$eval('[data-stroke]', ps => ps.map(p => parseFloat(getComputedStyle(p).strokeDashoffset)));
  expect(offsets.length).toBeGreaterThan(50);
  offsets.forEach(o => expect(o).toBe(0));
  const media = await page.$$eval('[data-media]', els => els.map(e => parseFloat(getComputedStyle(e).opacity)));
  expect(media.length).toBeGreaterThan(5);
  media.forEach(o => expect(o).toBeGreaterThanOrEqual(0.99));
  const copies = await page.$$eval('[data-zone="copy"]', els => els.map(e => parseFloat(getComputedStyle(e).opacity)));
  copies.forEach(o => expect(o).toBeGreaterThanOrEqual(0.99));
  await ctx.close();
});

test('tab order reaches all eleven subjects', async ({ page, browserName }) => {
  await page.goto('/');
  await page.waitForTimeout(300);
  const seen = new Set<string>();
  // WebKit only tabs through links with Option held (Safari's default), the way a keyboard user there would.
  const key = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  for (let k = 0; k < 90; k++) {
    await page.keyboard.press(key);
    const href = await page.evaluate(() => (document.activeElement as HTMLAnchorElement | null)?.getAttribute('href') ?? '');
    if (href) seen.add(href);
  }
  for (const href of ['/work/della', '/work/vialgrade', '/work/transformer', '/work/lot', '/work/webuddy', '/work/npgktrades', '/work/say-no-to-plastic', '/work/grounds-guide', '/work/movemate', '#draw', '#row']) expect(seen.has(href), href).toBe(true);
});

test('home has no serious axe violations', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(800);
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter(v => v.impact === 'serious' || v.impact === 'critical');
  expect(serious.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);
});
