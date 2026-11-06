import type { Page } from '@playwright/test';

/** Scroll a sketchbook page to progress p and wait for the eased scroll and the figure to settle. */
export async function settle(page: Page, index: number, p: number) {
  await page.evaluate(([i, q]) => { const el = document.querySelector(`[data-page="${i}"]`) as HTMLElement; window.scrollTo({ top: el.offsetTop + q * (el.offsetHeight - innerHeight), behavior: 'instant' as ScrollBehavior }); }, [index, p] as const);
  let prev = '';
  for (let k = 0; k < 24; k++) { await page.waitForTimeout(150); const t = await page.evaluate(() => (document.querySelector('[data-zone="pagenum"]')?.textContent ?? '') + (document.querySelector('div[data-zone="figure"]')?.getAttribute('style') ?? '')); if (t === prev && k > 2) break; prev = t; }
  await page.waitForTimeout(450);
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
