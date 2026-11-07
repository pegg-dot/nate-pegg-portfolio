/**
 * Page one ("how I got into this"): where he sits, the house beside his pencil, and the river he
 * leaps, as plain math (no React) so the pure tests can check the scene without a browser.
 */
import { clamp, ease, endX, lerp } from './pages';
import type { Pt } from './pencil';
import type { FigureScript } from './types';
import { HOUSE, HOUSE_BUILT, RIVER } from './wireframes';

/** He sits between these; the sketch draws inside that; the build happens while he stands; then he goes. */
export const SIT = [0.14, 0.44] as const, SKETCH = [0.17, 0.41] as const, BUILD = [0.44, 0.53] as const, GO = 0.54;

const scaled = (strokes: Pt[][], k: number) => strokes.map(st => st.map(([x, y]) => [x * k, y * k] as Pt));
const box = (strokes: Pt[][]) => { const pts = strokes.flat(); return { left: Math.min(...pts.map(q => q[0])), right: Math.max(...pts.map(q => q[0])), top: -Math.min(...pts.map(q => q[1])) }; };

/** Where he sits (his left edge, px), the house just past the pencil in his sitting hand, and the river. Smaller and earlier on a phone. */
export function originScene(vw: number, figW: number) {
  const mobile = vw <= 780, k = mobile ? 0.7 : 1, s = figW / 60;
  const sitX = vw * (mobile ? 0.06 : 0.18);
  const pencilX = sitX + 52 * s;
  const house = scaled(HOUSE, k), built = scaled(HOUSE_BUILT, k), river = scaled(RIVER, k);
  const hb = box(house), rb = box(river);
  const houseX = (pencilX + 6 - hb.left) / vw;
  const riverX = mobile ? 0.46 : 0.62;
  return {
    k, sitX, pencilX,
    house: { x: houseX, strokes: house, left: houseX * vw + hb.left, right: houseX * vw + hb.right },
    built: { x: houseX, strokes: built },
    river: { x: riverX, strokes: river, left: riverX * vw + rb.left, right: riverX * vw + rb.right, bank: rb.top, room: 20 * k, lift: 40 * k },
  };
}

/** He walks in, sits and sketches the house, stands while it is built, then walks on and leaps the river. */
export const figureScript: FigureScript = (p, vw, figW) => {
  const o = originScene(vw, figW);
  if (p < SIT[0]) return { x: lerp(-figW, o.sitX, ease(clamp(p / SIT[0]))) };
  if (p < SIT[1]) return { x: o.sitX, pose: 'sit' };
  if (p < GO) return { x: o.sitX, pose: 'idle' };
  const x = lerp(o.sitX, endX(vw, figW), clamp((p - GO) / (1 - GO)));
  const cx = x + figW / 2, a = o.river.left - o.river.room, b = o.river.right + o.river.room;
  if (cx >= a && cx <= b) return { x, pose: 'hop', lift: -o.river.lift * Math.sin(Math.PI * ((cx - a) / (b - a))) };
  return { x };
};
