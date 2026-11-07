/**
 * Page one ("how I got into this"): he builds the city with a hammer. He walks to each site, swings
 * while the building rises under the hammer, sparks at the strike, then moves to the next, left to
 * right and taller to the right, and walks off. Plain math (no React) so the pure tests can play it.
 */
import { pose } from './figure';
import { clamp, ease, endX, lerp } from './pages';
import type { Pt } from './pencil';
import type { FigureScript } from './types';
import { CITY } from './wireframes';

/** He is at the first site by WALK_IN and leaves the last by WALK_OFF. */
export const WALK_IN = 0.06, WALK_OFF = 0.92;

const scaled = (strokes: Pt[][], k: number) => strokes.map(st => st.map(([x, y]) => [x * k, y * k] as Pt));

export type Site = { slug: string; cx: number; left: number; right: number; height: number; strokes: Pt[][]; standX: number; walk: [number, number]; hammer: [number, number]; strike: Pt };

/** Three short lines flying off a strike point (local to a ground object). */
export const sparks = (x: number, y: number): Pt[][] => [[[x + 3, y - 3], [x + 9, y - 10]], [[x + 4, y], [x + 12, y - 1]], [[x + 3, y + 3], [x + 9, y + 8]]];

/**
 * The city laid out from a little way in to the right edge (clear of the tab column on a desktop), scaled to
 * fit and spread with a gap, each site with where he stands to hammer it, its walk and hammer windows, and
 * where the hammer lands.
 */
export function originScene(vw: number, figW: number) {
  const mobile = vw <= 780, s = figW / 60;
  const set = mobile ? CITY.filter(b => b.phone) : CITY;
  const spanL = mobile ? 24 : vw * 0.12, spanR = vw - (mobile ? 60 : 84);
  const sumW = set.reduce((a, b) => a + b.w, 0);
  const ck = clamp((spanR - spanL) / (sumW + 18 * (set.length - 1)), 0.45, 1);
  const gap = Math.min(110, (spanR - spanL - sumW * ck) / Math.max(1, set.length - 1));
  const head = pose('hammer', 1)[14]![1];
  const reach = head[0] * s, strikeUp = (82 - head[1]) * s;
  const slot = (WALK_OFF - WALK_IN) / set.length;
  let x = spanL;
  const sites: Site[] = set.map((b, k) => {
    const w = b.w * ck, left = x;
    x += w + gap;
    const t0 = WALK_IN + k * slot;
    return { slug: b.slug, cx: left + w / 2, left, right: left + w, height: b.h * ck, strokes: scaled(b.strokes, ck), standX: left + 2 - reach, walk: [t0, t0 + 0.2 * slot], hammer: [t0 + 0.2 * slot, t0 + slot], strike: [left + 2, -strikeUp] };
  });
  const off = mobile ? vw - 16 - figW : endX(vw, figW);
  return { sites, off, reach, strikeUp };
}

/** He walks in, then for each site walks over and hammers until the building is up, and walks off after the last. */
export const figureScript: FigureScript = (p, vw, figW) => {
  const o = originScene(vw, figW);
  if (p < WALK_IN) return { x: lerp(-figW, o.sites[0].standX, ease(clamp(p / WALK_IN))) };
  for (let k = 0; k < o.sites.length; k++) {
    const b = o.sites[k], from = k ? o.sites[k - 1].standX : b.standX;
    if (p < b.walk[1]) return { x: lerp(from, b.standX, ease(clamp((p - b.walk[0]) / (b.walk[1] - b.walk[0])))) };
    if (p < b.hammer[1]) return { x: b.standX, pose: 'hammer' };
  }
  const last = o.sites[o.sites.length - 1];
  return { x: lerp(last.standX, o.off, ease(clamp((p - WALK_OFF) / (1 - WALK_OFF)))) };
};
