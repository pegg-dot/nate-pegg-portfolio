/** Scroll math for the sketchbook pages. Pure. */
export const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (t: number) => t * t * (3 - 2 * t);

/** p runs 0 → 1 while the page's sticky stage is pinned; leaving rises over the last 120 px as the stage scrolls away. */
export function pageProgress(top: number, height: number, scroll: number, vh: number): { p: number; leaving: number } {
  const span = Math.max(1, height - vh);
  return { p: clamp((scroll - top) / span), leaving: clamp((vh - (top + height - scroll)) / 120) };
}

/** The last page whose top has been reached. */
export function activeIndex(tops: number[], scroll: number): number {
  let a = 0;
  for (let i = 0; i < tops.length; i++) if (tops[i] <= scroll) a = i;
  return a;
}
