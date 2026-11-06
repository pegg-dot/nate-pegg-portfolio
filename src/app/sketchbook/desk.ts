/**
 * The desk page's walk and the thing he hops, as plain math (no React), so the pure tests can
 * check the leap without a browser.
 */
import { clamp, endX, lerp } from './pages';
import type { FigureScript } from './types';
import type { Pt } from './pencil';
import { ROTUNDA } from './wireframes';

/** Where each desk object stands on a desktop, as a fraction of the width. */
export const SPOTS = [0.12, 0.24, 0.36, 0.52, 0.66, 0.8];
/** On a phone the objects share one spot, drawn one after another. */
export const spotX = (i: number, vw: number) => (vw <= 780 ? 0.58 : SPOTS[i]);
const P0 = 0.05, P1 = 0.95;

/** A linear walk across the desk, so each object draws exactly as he reaches it. */
export const walkX = (p: number, vw: number, figW: number) => lerp(vw * 0.04, endX(vw, figW), clamp((p - P0) / (P1 - P0)));
/** The progress at which his centre reaches a spot (as a fraction of the width). */
export function arrival(spot: number, vw: number, figW: number) {
  const x0 = vw * 0.04, x1 = endX(vw, figW);
  return P0 + (P1 - P0) * clamp((spot * vw - figW / 2 - x0) / (x1 - x0));
}

/**
 * The Rotunda paperweight he leaps: where it stands (fraction of the width), its strokes, and its
 * box in px along the ground line. On a desktop it sits in the gap between the chart and the
 * bottle, full size; on a phone it is smaller and earlier, clear of the shared object spot.
 * `room` is how far before its left edge he takes off and past its right edge he lands.
 */
export function obstacle(vw: number) {
  const mobile = vw <= 780;
  const x = mobile ? 0.3 : 0.455, scale = mobile ? 0.7 : 1, room = mobile ? 10 : 24;
  const strokes = ROTUNDA.map(s => s.map(([px, py]) => [px * scale, py * scale] as Pt));
  const pts = strokes.flat();
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  return { x, scale, room, strokes, left: x * vw + Math.min(...xs), right: x * vw + Math.max(...xs), height: -Math.min(...ys) };
}

/** How high the leap goes at its apex, in px: the dome with a little to spare (his legs tuck in the hop, so his feet clear it by more). */
export const leap = (o: ReturnType<typeof obstacle>) => o.height + 6 * o.scale;

export const figureScript: FigureScript = (p, vw, figW) => {
  const x = walkX(p, vw, figW);
  const cx = x + figW / 2;
  const o = obstacle(vw);
  const a = o.left - o.room, b = o.right + o.room;
  if (cx >= a && cx <= b) return { x, pose: 'hop', lift: -leap(o) * Math.sin(Math.PI * ((cx - a) / (b - a))) };
  return { x };
};
