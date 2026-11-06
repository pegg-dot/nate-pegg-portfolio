import type { Page } from '@playwright/test';

/** Scroll a sketchbook page to progress p and wait for the eased scroll and the figure to settle. */
export async function settle(page: Page, index: number, p: number) {
  await page.evaluate(([i, q]) => { const el = document.querySelector(`[data-page="${i}"]`) as HTMLElement; const overlap = Math.max(0, -parseFloat(getComputedStyle(el).marginBottom) || 0); const travel = el.offsetHeight - innerHeight - overlap; window.scrollTo({ top: el.offsetTop + Math.min(1, q) * travel + Math.max(0, q - 1) * overlap, behavior: 'instant' as ScrollBehavior }); }, [index, p] as const);
  let prev = '';
  for (let k = 0; k < 24; k++) { await page.waitForTimeout(150); const t = await page.evaluate(() => (document.querySelector('[data-zone="pagenum"]')?.textContent ?? '') + (document.querySelector('div[data-zone="figure"]')?.getAttribute('style') ?? '')); if (t === prev && k > 2) break; prev = t; }
  await page.waitForTimeout(450);
}

/** Poll `read` until `ok` accepts its value or `ms` runs out; returns the last value. Fixed waits race a loaded CI runner. */
export async function until<T>(read: () => Promise<T>, ok: (v: T) => boolean, ms = 6000, step = 100): Promise<T> {
  const t0 = Date.now();
  let v = await read();
  while (!ok(v) && Date.now() - t0 < ms) { await new Promise(r => setTimeout(r, step)); v = await read(); }
  return v;
}

/** Opacity as a reader sees it: the product of the element's and its ancestors' opacities, 0 if any is hidden. */
export const effectiveOpacity = (page: Page, selector: string) => page.$eval(selector, el => {
  let e: HTMLElement | null = el as HTMLElement, op = 1;
  while (e && e !== document.body) { const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none' || e.hidden) return 0; op *= parseFloat(cs.opacity); e = e.parentElement; }
  return op;
});
export const effectiveOpacities = (page: Page, selector: string) => page.$$eval(selector, els => els.map(el => {
  let e: HTMLElement | null = el as HTMLElement, op = 1;
  while (e && e !== document.body) { const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none' || e.hidden) return 0; op *= parseFloat(cs.opacity); e = e.parentElement; }
  return op;
}));
