import { test, expect, type Page } from '@playwright/test';
import { until } from './helpers/sketchbook';

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
  // The page is live once the name has started writing (the frame loop is running), so the wheel reaches a hydrated page.
  await until(() => nameOffsets(page), o => o.length > 0 && o.some(v => v < 1), 8000);
  await page.mouse.wheel(0, 300);
  const offsets = await until(() => nameOffsets(page), o => o.length > 0 && o.every(v => v === 0), 1500);
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
    // p ≤ 1 runs the page's travel; 1 < p ≤ 2 runs into the turn, where the next sheet rises over it.
    const overlap = Math.max(0, -parseFloat(getComputedStyle(el).marginBottom) || 0);
    const travel = el.offsetHeight - innerHeight - overlap;
    window.scrollTo({ top: el.offsetTop + Math.min(1, q) * travel + Math.max(0, q - 1) * overlap, behavior: 'instant' as ScrollBehavior });
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

test('the hop happens over the Rotunda, and it is a real leap', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/');
  const lifts: number[] = [];
  for (let p = 0.3; p <= 0.6; p += 0.02) {
    await scrollToPage(page, 5, p);
    const s = await page.evaluate(() => {
      const fig = document.querySelector('[data-zone="figure"]') as HTMLElement;
      const m = fig.style.transform.match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/);
      const fr = fig.getBoundingClientRect();
      const parts = Array.from(document.querySelectorAll('[data-page="5"] path.rotunda')).map(e => e.getBoundingClientRect());
      const left = Math.min(...parts.map(r => r.left)), right = Math.max(...parts.map(r => r.right));
      // The copy's visible bottom edge: its box, clipped by every overflow-hidden ancestor (the stack).
      const copy = document.querySelector('[data-page="5"] [data-zone="copy"]') as HTMLElement;
      let copyBottom = copy.getBoundingClientRect().bottom;
      for (let a = copy.parentElement; a && a !== document.body; a = a.parentElement) if (/hidden|clip/.test(getComputedStyle(a).overflow)) copyBottom = Math.min(copyBottom, a.getBoundingClientRect().bottom);
      return { cx: fr.left + fr.width / 2, top: fr.top, lift: m ? parseFloat(m[2]) : 0, left, right, drawn: parts.length, copyBottom };
    });
    expect(s.drawn, 'a Rotunda is drawn on the desk').toBeGreaterThan(0);
    expect(s.top, `he never leaps into the words (lift ${s.lift}, p ${p.toFixed(2)})`).toBeGreaterThanOrEqual(s.copyBottom - 2);
    const over = s.cx >= s.left - 40 && s.cx <= s.right + 40;
    if (s.lift < -10) { lifts.push(s.lift); expect(over, `lift ${s.lift} at x ${s.cx} (Rotunda ${s.left}–${s.right}, p ${p.toFixed(2)})`).toBe(true); }
  }
  expect(lifts.length, 'he hops').toBeGreaterThan(0);
  expect(Math.min(...lifts), 'a leap that clears a dome, not a hop over a mug').toBeLessThan(-40);
});

test('on page one he draws a house, it gets built, and he leaps a river (Nate, 2026-11-07)', async ({ page }) => {
  test.setTimeout(180_000);
  await page.goto('/');
  expect(await page.$eval('[data-page="1"]', el => Number(el.getAttribute('data-travel'))), 'the page has two screens of scroll for the scene').toBeGreaterThanOrEqual(200);
  const drawnCount = (cls: string) => page.$$eval(`[data-page="1"] path.${cls}`, es => es.filter(e => getComputedStyle(e).visibility !== 'hidden' && parseFloat(getComputedStyle(e).strokeDashoffset) < 0.5).length);
  const poseNow = () => page.$eval('div[data-zone="figure"] svg', e => e.getAttribute('data-pose'));
  await scrollToPage(page, 1, 0.3);
  expect(await poseNow(), 'he sits to draw').toBe('sit');
  expect(await drawnCount('house'), 'the house is being drawn beside him').toBeGreaterThan(0);
  expect(await drawnCount('built'), 'not built yet').toBe(0);
  await scrollToPage(page, 1, 0.52);
  expect(await poseNow(), 'he stands while it is built').toBe('idle');
  expect(await drawnCount('built'), 'the house is built').toBeGreaterThan(3);
  const lifts: number[] = [];
  for (let p = 0.56; p <= 0.98; p += 0.02) {
    await scrollToPage(page, 1, p);
    const s = await page.evaluate(() => {
      const fig = document.querySelector('[data-zone="figure"]') as HTMLElement;
      const m = fig.style.transform.match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/);
      const fr = fig.getBoundingClientRect();
      const rs = Array.from(document.querySelectorAll('[data-page="1"] path.river')).map(e => e.getBoundingClientRect());
      return { cx: fr.left + fr.width / 2, lift: m ? parseFloat(m[2]) : 0, left: Math.min(...rs.map(r => r.left)), right: Math.max(...rs.map(r => r.right)), n: rs.length };
    });
    expect(s.n, 'a river is drawn across his path').toBeGreaterThan(0);
    if (s.lift < -6) { lifts.push(s.lift); expect(s.cx >= s.left - 40 && s.cx <= s.right + 40, `lift ${s.lift} at ${s.cx} (river ${s.left}–${s.right}, p ${p.toFixed(2)})`).toBe(true); }
  }
  expect(lifts.length, 'he leaps the river').toBeGreaterThan(0);
  expect(Math.min(...lifts), 'a real leap').toBeLessThan(-25);
});

test('on the VialGrade page he holds a magnifier over the bottle (Nate, 2026-11-07: "what is the guy doing?")', async ({ page }) => {
  await page.goto('/');
  await scrollToPage(page, 3, 0.3);
  const s = await page.evaluate(() => {
    const vis = (sel: string) => Array.from(document.querySelectorAll<SVGPathElement>(sel)).filter(e => getComputedStyle(e).visibility !== 'hidden' && parseFloat(getComputedStyle(e).strokeDashoffset) < 0.05).map(e => e.getBoundingClientRect());
    const box = (rs: DOMRect[]) => ({ l: Math.min(...rs.map(r => r.left)), r: Math.max(...rs.map(r => r.right)), t: Math.min(...rs.map(r => r.top)), b: Math.max(...rs.map(r => r.bottom)) });
    const vial = vis('[data-page="3"] path.vial'), lens = vis('[data-page="3"] path.lens');
    return { pose: document.querySelector('div[data-zone="figure"] svg')?.getAttribute('data-pose'), vial: box(vial), lens: box(lens), nVial: vial.length, nLens: lens.length };
  });
  expect(s.pose, 'his arm is up, holding it').toBe('inspect');
  expect(s.nVial, 'a bottle').toBeGreaterThan(0);
  expect(s.nLens, 'a magnifier').toBeGreaterThan(0);
  const iw = Math.min(s.vial.r, s.lens.r) - Math.max(s.vial.l, s.lens.l), ih = Math.min(s.vial.b, s.lens.b) - Math.max(s.vial.t, s.lens.t);
  expect(iw, 'the lens sits over the bottle').toBeGreaterThan(10);
  expect(ih, 'the lens sits over the bottle').toBeGreaterThan(10);
  await scrollToPage(page, 3, 0.48);
  const checked = await page.$$eval('[data-page="3"] path.lens', es => es.filter(e => parseFloat(getComputedStyle(e).strokeDashoffset) < 0.05).length);
  expect(checked, 'a check appears in the lens once the screen is up').toBeGreaterThanOrEqual(4);
});

test('each drawing holds on top, fully real, long enough to look at (Nate, 2026-11-07: "moves through them too quickly")', async ({ page }) => {
  test.setTimeout(240_000);
  await page.goto('/');
  const travel = await page.$eval('[data-page="6"]', el => Number(el.getAttribute('data-travel')));
  const vh = await page.evaluate(() => innerHeight);
  const hold: Record<string, number> = {};
  const STEP = 0.015;
  for (let p = 0.05; p <= 1.0001; p += STEP) {
    await scrollToPage(page, 6, p);
    const top = await page.evaluate(() => {
      const figs = Array.from(document.querySelectorAll<HTMLElement>('[data-page="6"] [data-piece]')).filter(f => parseFloat(getComputedStyle(f).opacity) > 0.5);
      if (!figs.length) return null;
      const t = figs.reduce((a, b) => (parseInt(getComputedStyle(b).zIndex, 10) > parseInt(getComputedStyle(a).zIndex, 10) ? b : a));
      const photo = parseFloat(getComputedStyle(t.querySelector('[data-media]') as HTMLElement).opacity);
      const o = t.querySelector('[data-sketch="outline"]') as HTMLElement | null;
      return { name: t.dataset.piece!, photo, outline: o ? parseFloat(getComputedStyle(o).opacity) : 0 };
    });
    if (top && top.photo >= 0.99 && top.outline <= 0.02) hold[top.name] = (hold[top.name] ?? 0) + 1;
  }
  for (const name of ['bob-marley', 'dog-scarf', 'house', 'moose', 'coke-can', 'miami']) {
    const span = (hold[name] ?? 0) * STEP;
    expect(span, `${name} holds for a share of the page`).toBeGreaterThanOrEqual(0.06);
    expect(span * travel * vh / 100, `${name} holds for real scrolling (px)`).toBeGreaterThanOrEqual(180);
  }
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

test.describe('Nate, 2026-11-06: slower, a sheet laid over, bow seat', () => {
  test('a page takes at least two screens of scroll to play through', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(300);
    const travel = await page.evaluate(() => {
      const el = document.querySelector('[data-page="2"]') as HTMLElement;
      return (el.offsetHeight - innerHeight + (parseFloat(getComputedStyle(el).marginBottom) || 0)) / innerHeight;
    });
    expect(travel).toBeGreaterThanOrEqual(1.99);
  });

  test('the next sheet rises over the pinned page; the page never slides under the binding', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(300);
    await scrollToPage(page, 2, 1.5);
    const r = await page.evaluate(() => {
      const stage = (i: number) => (document.querySelector(`[data-page="${i}"] > div`) as HTMLElement).getBoundingClientRect();
      const z = (i: number) => parseInt(getComputedStyle(document.querySelector(`[data-page="${i}"]`) as HTMLElement).zIndex, 10);
      return { top2: stage(2).top, top3: stage(3).top, z2: z(2), z3: z(3), vh: innerHeight };
    });
    expect(Math.abs(r.top2)).toBeLessThanOrEqual(1);
    expect(r.top3).toBeGreaterThan(r.vh * 0.3);
    expect(r.top3).toBeLessThan(r.vh * 0.7);
    expect(r.z3).toBeGreaterThan(r.z2);
  });

  test('the rising sheet already carries its copy, and he is behind it until it pins', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(300);
    await scrollToPage(page, 2, 1.5);
    await page.waitForTimeout(600);
    expect(await ownOpacity(page, '[data-page="3"] [data-zone="copy"]')).toBeGreaterThanOrEqual(0.99);
    const z = await page.evaluate(() => ({
      fig: parseInt(getComputedStyle(document.querySelector('div[data-zone="figure"]') as HTMLElement).zIndex, 10),
      p2: parseInt(getComputedStyle(document.querySelector('[data-page="2"]') as HTMLElement).zIndex, 10),
      p3: parseInt(getComputedStyle(document.querySelector('[data-page="3"]') as HTMLElement).zIndex, 10),
    }));
    expect(z.fig).toBeGreaterThan(z.p2);
    expect(z.fig).toBeLessThan(z.p3);
  });

  test('"me" sits in the bow seat, the end the boat moves toward', async ({ page }) => {
    await page.goto('/');
    await scrollToPage(page, 7, 0.6);
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => {
      const me = (document.querySelector('[data-page="7"] .rowingSketch [data-rower] text') as SVGGraphicsElement).getBoundingClientRect();
      const hull = (document.querySelector('[data-page="7"] .rowingSketch svg g[transform] > path') as SVGGraphicsElement).getBoundingClientRect();
      return { me: me.left + me.width / 2, hull: hull.left + hull.width / 2 };
    });
    expect(r.me).toBeGreaterThan(r.hull);
  });
});

test.describe('the pencil (Nate, 2026-11-06: "the pencil didn\'t move")', () => {
  const pencil = (page: Page) => page.$eval('div[data-zone="figure"] [data-pencil]', g => ({ t: g.getAttribute('transform'), on: getComputedStyle(g).visibility !== 'hidden' && parseFloat(getComputedStyle(g).opacity) > 0.5 }));

  test('the pencil draws him at the start of a page, then lifts', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(300);
    await scrollToPage(page, 3, 0.012);
    expect(await page.$('div[data-zone="figure"] [data-pencil]'), 'a pencil glyph in the figure').not.toBeNull();
    const a = await pencil(page);
    await scrollToPage(page, 3, 0.03);
    const b = await pencil(page);
    await scrollToPage(page, 3, 0.1);
    const c = await pencil(page);
    expect(a.on, 'drawing his first strokes').toBe(true);
    expect(b.on, 'still drawing').toBe(true);
    expect(a.t, 'the pencil moved between the two').not.toBe(b.t);
    expect(c.on, 'lifted once he is complete').toBe(false);
  });

  test('sitting on the Drawings page, his pencil keeps moving', async ({ page }) => {
    await page.goto('/');
    await scrollToPage(page, 6, 0.6);
    await page.waitForTimeout(400);
    const xs: number[] = [];
    for (let k = 0; k < 10; k++) {
      await page.waitForTimeout(120);
      xs.push(await page.$eval('div[data-zone="figure"] svg path.pencil', p => (p as SVGPathElement).getPointAtLength(0).x));
    }
    expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThanOrEqual(8);
  });

  test('on the cover, one pencil: it writes the name, then draws him', async ({ page }) => {
    await page.goto('/');
    let both = 0, figSeen = 0, nameSeen = 0;
    for (let k = 0; k < 60; k++) {
      await page.waitForTimeout(100);
      const s = await page.evaluate(() => {
        const vis = (el: Element | null) => !!el && getComputedStyle(el).visibility !== 'hidden' && parseFloat(getComputedStyle(el).opacity) > 0.5;
        return { name: vis(document.querySelector('[data-name] > g')), fig: vis(document.querySelector('div[data-zone="figure"]')) && vis(document.querySelector('div[data-zone="figure"] [data-pencil]')) };
      });
      if (s.name && s.fig) both++;
      if (s.fig) figSeen++;
      if (s.name) nameSeen++;
    }
    expect(nameSeen, 'the name pencil was seen').toBeGreaterThan(0);
    expect(figSeen, 'the pencil was seen drawing him').toBeGreaterThan(0);
    expect(both, 'never two pencils at once').toBe(0);
  });
});

test.describe('the Della video (Nate, 2026-11-06: start it when the reveal finishes)', () => {
  const state = (page: Page) => page.$eval('[data-page="2"] video', v => ({ paused: (v as HTMLVideoElement).paused, t: (v as HTMLVideoElement).currentTime }));

  test('it waits at the start until the real screen is up, then plays from the beginning, and stops when you move on', async ({ page }) => {
    await page.goto('/');
    // The way a reader arrives: the sheet is on screen while the sketch is still being drawn (the video element is in view, invisible).
    await scrollToPage(page, 2, 0.1);
    await page.waitForTimeout(3000);
    const before = await state(page);
    expect(before.paused, 'not playing in the background while the sketch is drawn').toBe(true);
    expect(before.t, 'still at the start').toBeLessThanOrEqual(0.05);
    const t0 = Date.now();
    await scrollToPage(page, 2, 0.95);
    const after = await until(() => state(page), s => !s.paused && s.t > 0, 8000);
    const elapsed = (Date.now() - t0) / 1000;
    expect(after.paused, 'playing once the real screen is up').toBe(false);
    expect(after.t, 'from the beginning').toBeLessThanOrEqual(elapsed + 0.3);
    await scrollToPage(page, 4, 0.5);
    const away = await until(() => state(page), s => s.paused, 3000);
    expect(away.paused, 'paused once the reader has moved on').toBe(true);
  });
});
