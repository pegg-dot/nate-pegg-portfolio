/**
 * Hand-traced wireframes of the real screens (image pixel space, so the lines land on the
 * real panels when the image fades in beneath them), plus the little objects on the desk.
 * Desk objects use a local frame with their base on y = 0; negative y is up.
 */
import { arc, circle, rect, type Pt } from './pencil';

const line = (x0: number, y0: number, x1: number, y1: number): Pt[] => [[x0, y0], [x1, y1]];
const hr = (x0: number, x1: number, y: number): Pt[] => line(x0, y, x1, y);

/** Della's owner workspace (room-identity.png, 3520 × 2500; traced at 2000 × 1420). */
const della: Pt[][] = [
  line(276, 0, 276, 1420),
  ...rect(20, 20, 32, 32), hr(60, 102, 36),
  ...rect(15, 68, 246, 60),
  hr(28, 110, 204), hr(28, 118, 240), hr(28, 92, 315), hr(28, 88, 351), hr(28, 100, 387),
  ...rect(15, 445, 246, 36), hr(28, 90, 498), hr(28, 90, 534),
  ...rect(306, 27, 50, 50), hr(372, 440, 40), hr(372, 905, 70), hr(372, 830, 90), hr(372, 866, 118),
  hr(306, 840, 156), hr(276, 1612, 181),
  ...rect(306, 204, 1276, 96),
  hr(326, 520, 332), ...rect(1458, 318, 106, 30),
  hr(326, 700, 384),
  hr(326, 514, 430), hr(326, 750, 453), ...rect(1450, 440, 112, 28),
  hr(326, 566, 531), hr(326, 758, 555), ...rect(1450, 541, 112, 28),
  ...rect(326, 622, 1238, 36),
  hr(326, 574, 699), hr(326, 704, 723), ...rect(1450, 709, 112, 28),
  hr(326, 562, 801), hr(326, 688, 824), ...rect(1450, 811, 112, 28),
  hr(326, 640, 898),
  hr(326, 470, 943), hr(326, 628, 966), ...rect(1440, 953, 122, 28),
  hr(326, 614, 1044), hr(326, 626, 1068), ...rect(1440, 1054, 122, 28),
  hr(326, 446, 1146), hr(326, 510, 1170), ...rect(1440, 1156, 122, 28),
  ...rect(326, 1236, 1238, 36),
  hr(326, 706, 1310),
  hr(326, 526, 1354), hr(326, 640, 1378), ...rect(1452, 1366, 110, 28),
  line(1612, 0, 1612, 1420),
  circle(1657, 75, 24, 20), hr(1694, 1932, 55), hr(1694, 1910, 76),
  hr(1634, 1700, 180), ...rect(1620, 235, 370, 80),
  hr(1634, 1978, 349), hr(1634, 1978, 387), hr(1634, 1978, 423),
  hr(1634, 1978, 524), hr(1634, 1978, 561), hr(1634, 1978, 598), hr(1634, 1978, 635),
  hr(1660, 1900, 748), hr(1660, 1900, 810), hr(1660, 1900, 871), hr(1660, 1900, 932),
];

/** VialGrade's home (home.jpg, 1440 × 1000, traced 1:1). */
const vialgrade: Pt[][] = [
  hr(0, 1440, 36),
  ...rect(92, 56, 34, 34), hr(134, 230, 73),
  hr(270, 310, 73), hr(338, 386, 73), hr(414, 498, 73), hr(526, 582, 73), hr(610, 650, 73), hr(678, 776, 73),
  ...rect(952, 54, 212, 38), ...rect(1174, 54, 74, 38), ...rect(1256, 52, 94, 44),
  hr(0, 1440, 110), hr(0, 1440, 152),
  hr(22, 186, 131), hr(306, 500, 131), hr(620, 852, 131), hr(970, 1166, 131), hr(1282, 1440, 131),
  ...rect(568, 246, 304, 34),
  ...rect(380, 322, 685, 100), ...rect(314, 430, 816, 100),
  hr(492, 948, 570), hr(496, 944, 602), hr(489, 951, 634),
  ...rect(386, 692, 668, 64), ...rect(952, 708, 82, 32),
  hr(300, 573, 796), hr(598, 869, 796), hr(895, 1142, 796),
  ...rect(80, 340, 72, 160), ...rect(97, 342, 38, 20),
  circle(1288, 300, 16, 16), circle(1318, 292, 14, 16), circle(1336, 330, 14, 16), circle(1298, 345, 12, 16),
  [[150, 772], [216, 772], [216, 820], [183, 848], [150, 820], [150, 772]],
  [[1262, 764], [1286, 764], [1286, 790], [1304, 836], [1244, 836], [1262, 790], [1262, 764]],
  hr(0, 1440, 918),
];

/** The transformer visualizer, Q/K/V scene (qkv.webp, 900 × 493, traced 1:1). */
const transformer: Pt[][] = [
  hr(0, 900, 30), hr(410, 515, 16), ...rect(796, 8, 40, 18),
  hr(40, 130, 55), ...rect(150, 70, 30, 13), ...rect(187, 70, 31, 13), ...rect(224, 70, 26, 13),
  hr(72, 98, 148), ...rect(72, 165, 26, 142),
  hr(72, 98, 181), hr(72, 98, 197), hr(72, 98, 213), hr(72, 98, 229), hr(72, 98, 245), hr(72, 98, 261), hr(72, 98, 277), hr(72, 98, 293),
  ...rect(195, 118, 50, 36), ...rect(195, 203, 50, 36), ...rect(195, 288, 50, 36),
  [[99, 236], [150, 200], [195, 136]], [[99, 236], [150, 226], [195, 221]], [[99, 236], [150, 272], [195, 306]],
  ...rect(308, 95, 22, 68), ...rect(308, 180, 22, 68), ...rect(308, 262, 22, 68),
  circle(319, 86, 6, 12), circle(319, 170, 6, 12), circle(319, 254, 6, 12),
  line(245, 136, 308, 130), line(245, 221, 308, 215), line(245, 306, 308, 296),
  hr(344, 430, 128), hr(344, 420, 142), hr(344, 406, 213), hr(344, 420, 227), hr(344, 404, 297), hr(344, 420, 311),
  line(620, 36, 620, 450), hr(632, 835, 88), hr(632, 880, 108), hr(632, 880, 122), hr(632, 880, 138), hr(632, 840, 152),
  ...rect(632, 168, 248, 24), ...rect(632, 200, 248, 70),
  hr(632, 880, 405), hr(632, 880, 418), hr(632, 800, 430),
  hr(190, 520, 390), hr(310, 590, 455), hr(40, 830, 478),
];

export const WIREFRAMES: Record<'della' | 'vialgrade' | 'transformer', { viewBox: string; w: number; h: number; strokes: Pt[][] }> = {
  della: { viewBox: '0 0 2000 1420', w: 2000, h: 1420, strokes: della },
  vialgrade: { viewBox: '0 0 1440 1000', w: 1440, h: 1000, strokes: vialgrade },
  transformer: { viewBox: '0 0 900 493', w: 900, h: 493, strokes: transformer },
};

/** 26 diagonals across a w × h frame, drawn bottom-left to top-right like quick pencil shading. */
export function hatch(w: number, h: number, n = 26): Pt[][] {
  const out: Pt[][] = [];
  const step = (w + h) / n;
  for (let i = 0; i < n; i++) { const o = -h + i * step; out.push([[o + 10, h], [o + h + 10, 0]]); }
  return out;
}

/* ---- things on the desk, base at y = 0 ---- */
export const DESK_PHONE: Pt[][] = [
  ...rect(-24, -26, 48, 26),
  [[-20, -27], [-20, -36], [-14, -40], [14, -40], [20, -36], [20, -27]],
  hr(-26, -14, -40), hr(14, 26, -40),
  hr(-12, -4, -14), hr(4, 12, -14), hr(-12, -4, -8), hr(4, 12, -8),
];
export const RING: Pt[][] = [arc(0, -34, 24, -2.3, -0.8, 8), arc(0, -34, 36, -2.2, -0.9, 8), arc(0, -34, 48, -2.1, -1.0, 8)];
/** The Rotunda, as a paperweight on the desk (he leaps it): two steps, four columns under a pediment, the drum, the dome. 64 wide, 66 tall. */
export const ROTUNDA: Pt[][] = [
  hr(-32, 32, 0), hr(-28, 28, -5),
  line(-16, -5, -16, -24), line(-5, -5, -5, -24), line(5, -5, 5, -24), line(16, -5, 16, -24),
  [[-22, -24], [0, -34], [22, -24], [-22, -24]],
  line(-26, -5, -26, -40), line(26, -5, 26, -40), hr(-26, 26, -40),
  arc(0, -40, 26, Math.PI, 2 * Math.PI, 14),
];
/** A little house, drawn in a hand's order: floor, walls, roof, chimney, door, window. 68 wide, 62 tall. */
export const HOUSE: Pt[][] = [
  hr(-32, 32, 0),
  line(-26, 0, -26, -34), line(26, 0, 26, -34),
  [[-34, -34], [0, -62], [34, -34]],
  [[14, -50], [14, -62], [22, -62], [22, -44]],
  [[-8, 0], [-8, -24], [8, -24], [8, 0]],
  ...rect(10, -32, 12, 12),
];
/** The second pass, once he stands: the same lines inked, the roof hatched, the window crossed, a knob, and smoke from the chimney. */
export const HOUSE_BUILT: Pt[][] = [
  hr(-32, 32, 0), line(-26, 0, -26, -34), line(26, 0, 26, -34), [[-34, -34], [0, -62], [34, -34]],
  [[14, -50], [14, -62], [22, -62], [22, -44]], [[-8, 0], [-8, -24], [8, -24], [8, 0]], ...rect(10, -32, 12, 12),
  line(-26, -36, -14, -46), line(-18, -36, -6, -46), line(-10, -36, 2, -46),
  hr(10, 22, -26), line(16, -20, 16, -32), circle(5, -12, 1.2, 8),
  arc(24, -69, 4, 0.6, 4.4, 8), arc(29, -79, 5, 3.4, 7.2, 8), arc(24, -91, 6, 0.6, 4.4, 8),
];
const wave = (x0: number, x1: number, y: number, step: number, amp: number): Pt[] => {
  const pts: Pt[] = [];
  for (let x = x0, i = 0; x <= x1; x += step, i++) pts.push([x, y + (i % 2 ? amp : -amp)]);
  return pts;
};
/** A river across his path: a near bank, a far bank, a stone at the foot of each, water between. 100 wide; the banks rise 16. */
export const RIVER: Pt[][] = [
  [[-50, -16], [-47, -8], [-44, 0]],
  [[44, 0], [47, -8], [50, -16]],
  circle(-46, -2, 2.2, 8), circle(46, -2, 2.2, 8),
  wave(-40, 40, -4, 8, 3), wave(-36, 36, -9, 8, 2.5), wave(-26, 26, -14, 8, 2),
];
/** A bottle that reads as one: shoulders, a neck, a cap, a label with two lines, the liquid line. 32 wide, 94 tall. */
export const VIAL: Pt[][] = [
  [[-16, 0], [-16, -62], [-12, -72], [-5, -76], [-5, -84], [5, -84], [5, -76], [12, -72], [16, -62], [16, 0], [-16, 0]],
  ...rect(-7, -94, 14, 10),
  ...rect(-11, -70, 22, 20), hr(-7, 7, -57), hr(-7, 1, -63),
  hr(-16, 16, -28),
];
export const tokenBlock = (h = 40): Pt[][] => [...rect(-20, -h, 40, h), hr(-14, 14, -h * 0.7), hr(-14, 14, -h * 0.5), hr(-14, 14, -h * 0.3)];

export const DESK_OBJECTS: { slug: string; strokes: Pt[][] }[] = [
  { slug: 'lot', strokes: [[[-30, 0], [-30, -36], [0, -64], [30, -36], [30, 0], [-30, 0]], ...rect(-8, -26, 16, 26), ...rect(-24, -30, 10, 10), hr(-36, 36, -36)] },
  { slug: 'webuddy', strokes: [...rect(-34, -40, 68, 40), [[-38, -40], [-30, -56], [-18, -40], [-6, -56], [6, -40], [18, -56], [30, -40], [38, -56]], hr(-38, 38, -56), ...rect(-8, -28, 16, 28), ...rect(14, -32, 14, 12)] },
  { slug: 'npgktrades', strokes: [...rect(-34, -50, 68, 50), [[-28, -12], [-16, -26], [-4, -18], [10, -38], [28, -44]], hr(-28, 28, -8), line(-28, -46, -28, -8)] },
  { slug: 'plastic', strokes: [[[-8, 0], [-10, -22], [-6, -30], [-6, -44], [6, -44], [6, -30], [10, -22], [8, 0], [-8, 0]], hr(-6, 6, -48), ...rect(-7, -46, 14, 4), hr(-8, 8, -16)] },
  { slug: 'grounds-guide', strokes: [[[0, 0], [-16, -30], [-16, -44], [0, -58], [16, -44], [16, -30], [0, 0]], circle(0, -42, 6, 14)] },
  { slug: 'movemate', strokes: [...rect(-30, -40, 60, 40), [[-30, -40], [-18, -54], [42, -54], [30, -40]], line(30, -40, 42, -54), line(42, -54, 42, -14), line(30, 0, 42, -14), hr(-20, 20, -24)] },
];
