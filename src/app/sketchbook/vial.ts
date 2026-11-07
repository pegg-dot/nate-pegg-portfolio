/**
 * The VialGrade page: the bottle, where he stops, and the magnifier he holds over it, as plain
 * math (no React) so the pure tests can check that the lens is on the bottle and in his hand.
 */
import { GROUND_Y, pose } from './figure';
import { clamp, ease, endX, lerp } from './pages';
import { circle, type Pt } from './pencil';
import type { FigureScript } from './types';
import { VIAL } from './wireframes';

/** He stands and inspects between these. */
export const INSPECT = [0.14, 0.5] as const;

/** The raised hand of the inspect pose, in figure units (60 wide). */
export function inspectHand(): Pt {
  const arm = pose('inspect', 0)[3]!;
  return arm[arm.length - 1];
}

/**
 * Where the bottle stands (a fraction of the width), where he stops so his raised hand holds the
 * lens over it, and the magnifier's strokes around that hand (px, base on the ground line; the
 * object's x is the hand). Three quarters size on a phone.
 */
export function vialScene(vw: number, figW: number) {
  const mobile = vw <= 780, k = mobile ? 0.75 : 1, s = figW / 60;
  const [hx, hy] = inspectHand();
  const vialX = 0.3;
  const vial = VIAL.map(st => st.map(([x, y]) => [x * k, y * k] as Pt));
  const vpts = vial.flat();
  const vialBox = { left: vialX * vw + Math.min(...vpts.map(q => q[0])), right: vialX * vw + Math.max(...vpts.map(q => q[0])), top: -Math.min(...vpts.map(q => q[1])) };
  const handY = -(GROUND_Y - hy) * s;
  const standX = vialX * vw - 48 * k - hx * s;
  const handX = standX + hx * s;
  const cx = 36 * k, r = 18 * k;
  const magnifier: Pt[][] = [
    circle(cx, handY, r, 20),
    [[0, handY - 1.5 * k], [cx - r, handY - 1.5 * k]],
    [[0, handY + 1.5 * k], [cx - r, handY + 1.5 * k]],
  ];
  const check: Pt[][] = [[[28 * k, handY - 1 * k], [34 * k, handY + 6 * k], [46 * k, handY - 9 * k]]];
  return { k, vialX, vial, vialBox, standX, hand: [handX, handY] as Pt, lens: { x: handX / vw, strokes: magnifier, cx: handX + cx, cy: handY, r }, check: { x: handX / vw, strokes: check } };
}

/** He walks up to the bottle, holds the magnifier over it while the screen is drawn, then crosses the page. */
export const figureScript: FigureScript = (p, vw, figW) => {
  const o = vialScene(vw, figW);
  if (p < INSPECT[0]) return { x: lerp(vw * 0.04, o.standX, ease(clamp(p / INSPECT[0]))) };
  if (p < INSPECT[1]) return { x: o.standX, pose: 'inspect' };
  return { x: lerp(o.standX, endX(vw, figW), ease(clamp((p - INSPECT[1]) / (1 - INSPECT[1])))) };
};
