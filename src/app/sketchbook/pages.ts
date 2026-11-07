/** Scroll math for the sketchbook pages. Pure. */
export const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (t: number) => t * t * (3 - 2 * t);

/** The pinned stage is one screen tall. A page plays over its travel, then the next sheet rises over it for the overlap. */
export const PIN_VH = 100;
export const OVERLAP_VH = 100;
/** Scroll, in vh, that plays a page from 0 to 1. Nate, 2026-11-06: twice the first build, which moved him too fast. */
export const TRAVEL_VH = 200;
export const pageHeightVh = (travel: number, last: boolean) => travel + PIN_VH + (last ? 0 : OVERLAP_VH);

/**
 * p runs 0 → 1 over the page's travel while its stage is pinned and holds at 1 while the next sheet covers it.
 * entering runs 0 → 1 over the screen before the page pins: its sheet rising from the bottom edge.
 * leaving rises over the last 120 px as the stage finally scrolls away, already under the sheet that covered it.
 */
export function pageProgress(top: number, height: number, scroll: number, vh: number, overlap = 0): { p: number; leaving: number; entering: number } {
  const span = Math.max(1, height - vh - overlap);
  return { p: clamp((scroll - top) / span), leaving: clamp((vh - (top + height - scroll)) / 120), entering: clamp((scroll - top + vh) / vh) };
}

/** The last page whose top has been reached. */
export function activeIndex(tops: number[], scroll: number): number {
  let a = 0;
  for (let i = 0; i < tops.length; i++) if (tops[i] <= scroll) a = i;
  return a;
}

/** Where a walk across a page ends: short of the page curl and the tabs. */
export const endX = (vw: number, figW: number) => Math.min(vw * 0.9 - figW, vw - 130 - figW);

/**
 * Copy turns on just after a page starts and stays on once the page has been seen (scrolling back never hides it).
 * On a desktop the rising sheet already carries its typed copy; on a phone the sheet passes behind the bottom tabs, so copy waits for the pin.
 */
export const copyOn = (progress: number, seen: boolean, entering = 1, vw = 1024) => progress > 0.06 || seen || (vw > 780 && entering > 0.2);

/** A heading shades in as its sheet rises (desktop), or with progress once the page is pinned. */
export const headOn = (progress: number, entering: number, vw = 1024, from = 0.02, over = 0.25) =>
  Math.max(vw > 780 ? clamp((entering - 0.3) / 0.6) : 0, clamp((progress - from) / over));

/** The shell's figure sizing at a viewport: width, height, how far the layer sits above the viewport bottom, and the gap from the layer's bottom to his feet. Mirrors the CSS breakpoints. */
export function figureMetrics(vw: number, vh: number) {
  const mobile = vw <= 780, short = !mobile && vh <= 740;
  const figW = mobile ? 56 : short ? 70 : 78, figH = mobile ? 86 : short ? 108 : 120, bottom = mobile ? 52 : 18;
  return { figW, figH, bottom, footGap: figH * (1 - 82 / 92) };
}
