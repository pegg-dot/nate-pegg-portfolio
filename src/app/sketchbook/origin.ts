/**
 * Page one ("how I got into this"), the scene, as plain math driven by the boxes the page measures:
 * he walks in, crouches and leaps onto the heading's second line, walks its letters and hops the gap
 * between the words, dives to the paragraph at word size and hurdles its words as far as mid-page,
 * leaps down to size, sits and sketches a house, walks a city up building by building, then comes to
 * the centre and up to the glass: hands on the lens, a knock, a step back. No React, so the pure tests
 * can play the whole thing with synthetic marks.
 */
import { pose } from './figure';
import type { Box } from './landmarks';
import { clamp, ease, figureMetrics, lerp } from './pages';
import { circle, type Pt, type Stroke } from './pencil';
import type { FigureScript } from './types';
import { CITY, HOUSE, HOUSE_BUILT } from './wireframes';

export type { Box };
/** What the page measures for the script: the heading's words per line, the first paragraph line's words, the copy block. Stage coordinates. */
export type OriginMarks = { head: Box[][]; words: Box[]; copy: Box };

/** The beats, as progress windows. */
export const W = {
  in: [0, 0.05], crouch: [0.05, 0.065], up: [0.065, 0.11], land: [0.11, 0.125], line: [0.125, 0.3], dive: [0.3, 0.35],
  hurdle: [0.35, 0.57], down: [0.57, 0.62], sit: [0.62, 0.72], sketch: [0.63, 0.71], build: [0.72, 0.745], city: [0.745, 0.88],
  approach: [0.88, 0.94], hands: [0.94, 0.965], knock: [0.965, 0.985], back: [0.985, 1],
} as const;

const seg = (p: number, [a, b]: readonly [number, number]) => clamp((p - a) / (b - a));
const line = (x0: number, y0: number, x1: number, y1: number): Pt[] => [[x0, y0], [x1, y1]];
const scaled = (strokes: Pt[][], k: number) => strokes.map(st => st.map(([x, y]) => [x * k, y * k] as Pt));
const box = (strokes: Pt[][]) => { const pts = strokes.flat(); return { left: Math.min(...pts.map(q => q[0])), right: Math.max(...pts.map(q => q[0])), top: -Math.min(...pts.map(q => q[1])) }; };

export type CityBuilding = { slug: string; cx: number; left: number; right: number; height: number; strokes: Pt[][]; start: number; end: number };

/**
 * Everything the script and the page need, from the viewport and the measured marks: where the
 * heading line and the hurdled words are, where he lands and sits, the house past his pencil, the
 * city laid out to the right edge and timed to his walk, the camera scale that keeps his head under
 * the copy, and the lens overlay (ring, glint, palms, knock rings) in page px.
 */
export function originScene(vw: number, vh: number, marks: OriginMarks | undefined, figW: number) {
  const M = figureMetrics(vw, vh);
  const mobile = vw <= 780, k = mobile ? 0.7 : 1, s = figW / 60;
  const groundFeet = vh - M.bottom - M.footGap;
  const ready = !!marks && marks.head.length > 0 && marks.head[0].length > 0 && marks.words.length > 0;
  // he walks the top line of the heading, so nothing is drawn behind him
  const lineWords = ready ? marks!.head[0] : [];
  const lineTop = lineWords.length ? Math.min(...lineWords.map(b => b.y)) : 0;
  const lineL = lineWords.length ? lineWords[0].x : 0;
  const lineR = lineWords.length ? lineWords[lineWords.length - 1].x + lineWords[lineWords.length - 1].w : 0;
  // the words he hurdles: the first paragraph line, as far as mid-page
  const hurdles = ready ? marks!.words.filter(b => b.x + b.w <= vw * 0.52) : [];
  const wordH = hurdles.length ? hurdles[0].h : 24;
  const wordScale = clamp((1.6 * wordH) / M.figH, 0.25, 0.6);
  const base = hurdles.length ? hurdles[0].y + hurdles[0].h : 0;
  // where he lands from the line, so the city has the right of the page
  const lastRight = hurdles.length ? hurdles[hurdles.length - 1].x + hurdles[hurdles.length - 1].w : vw * 0.3;
  // a narrow phone lands him near the left so the city has room; the page corner (the curl) stays clear on the right
  const landCx = Math.max(figW / 2 + 8, vw < 500 ? vw * 0.15 : lastRight - (mobile ? 50 : 20));
  const sitX = landCx - figW / 2;
  const pencilX = sitX + 52 * s;
  const house = scaled(HOUSE, k), built = scaled(HOUSE_BUILT, k);
  const hb = box(house);
  const houseX = (pencilX + 6 - hb.left) / vw;
  const houseLeft = houseX * vw + hb.left, houseRight = houseX * vw + hb.right;
  // the city: from past the house to the right edge (clear of the tab column on a desktop), scaled to fit, taller to the right
  const set = mobile ? CITY.filter(b => b.phone) : CITY;
  const spanL = houseRight + 26 * k, spanR = vw - (mobile ? 100 : 84);
  const natural = set.reduce((a, b) => a + b.w, 0) + 16 * (set.length - 1);
  const ck = clamp((spanR - spanL) / natural, 0.5, 1);
  const city: CityBuilding[] = [];
  let cx0 = spanL;
  for (const b of set) { const w = b.w * ck; city.push({ slug: b.slug, cx: cx0 + w / 2, left: cx0, right: cx0 + w, height: b.h * ck, strokes: scaled(b.strokes, ck), start: 0, end: 0 }); cx0 += w + 16 * ck; }
  // he stops at the foot of the last building (just inside where its drawing is triggered)
  const cityEndCx = city.length ? city[city.length - 1].cx - 24 * ck : landCx;
  for (const b of city) {
    const t = clamp((b.cx - 30 - landCx) / Math.max(1, cityEndCx - landCx));
    b.start = Math.max(W.city[0], W.city[0] + t * (W.city[1] - W.city[0]) - 0.01);
    b.end = b.start + 0.035;
  }
  // the camera: as big as fits under the copy and inside the width
  const copyBottom = ready ? marks!.copy.y + marks!.copy.h : vh * 0.5;
  const camScale = clamp(Math.min((vh - M.bottom - copyBottom - 16) / M.figH, (vw * 0.85) / M.figW, 3.6), 1.2, 3.6);
  const headCy = vh - M.bottom - M.figH * camScale * (1 - 14 / 92);
  // the lens is the viewer's: a porthole around the whole stage, drawn soft behind the copy; he comes up to its glass
  const lens = { cx: vw / 2, cy: vh / 2, r: Math.min(vw, vh) * 0.46, headCy };
  const P = pose('peer', 0);
  const handAt = (st: Pt[] | null) => { const h = st![st!.length - 1]; return { x: vw / 2 + (h[0] - 30) * s * camScale, y: vh - M.bottom - (92 - h[1]) * (M.figH / 92) * camScale }; };
  const hands = [handAt(P[2]), handAt(P[3])];
  const palms: Box[] = hands.map(h => ({ x: h.x, y: h.y, w: 0, h: 0 }));
  const u = camScale * (figW / 78) * 0.9;
  const palm = (hx: number, hy: number, m: number): Pt[][] => [
    circle(hx, hy, 6 * u, 12),
    line(hx - 4 * u, hy - 5 * u, hx - 6 * u, hy - 16 * u), line(hx - 1 * u, hy - 7 * u, hx - 1.5 * u, hy - 19 * u),
    line(hx + 2.5 * u, hy - 7 * u, hx + 3.5 * u, hy - 18 * u), line(hx + 5.5 * u, hy - 4 * u, hx + 8 * u, hy - 13 * u),
    line(hx + 6 * u * m, hy, hx + 12 * u * m, hy - 5 * u),
  ];
  const win = (pts: Pt[][], start: number, end: number, cls: string, amp = 1): Stroke[] => pts.map((q, i, a) => ({ pts: q, start: start + ((end - start) * i) / a.length, end: start + ((end - start) * (i + 1)) / a.length, cls, amp }));
  const glint = (): Pt[] => { const r = lens.r * 0.28, cx = lens.cx - lens.r * 0.5, cy = lens.cy - lens.r * 0.5, out: Pt[] = []; for (let i = 0; i <= 8; i++) { const a = Math.PI * 1.05 + (Math.PI * 0.5 * i) / 8; out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } return out; };
  const overlay: Stroke[] = ready ? [
    ...win([circle(lens.cx, lens.cy, lens.r, 56)], W.approach[0] + 0.02, W.approach[1], 'porthole', 0.8),
    ...win([glint()], W.approach[1] - 0.015, W.approach[1] + 0.01, 'porthole', 0.6),
    ...win(palm(hands[0].x, hands[0].y, -1), W.hands[0], W.hands[0] + 0.012, 'palm', 0.7),
    ...win(palm(hands[1].x, hands[1].y, 1), W.hands[0] + 0.01, W.hands[0] + 0.022, 'palm', 0.7),
    ...win([circle(hands[1].x, hands[1].y, 14 * u, 20)], W.knock[0], W.knock[0] + 0.008, 'knock', 0.5),
    ...win([circle(hands[1].x, hands[1].y, 26 * u, 24)], W.knock[0] + 0.006, W.knock[0] + 0.016, 'knock', 0.5),
  ] : [];
  return {
    ready, M, k, groundFeet, line: { top: lineTop, L: lineL, R: lineR, words: lineWords }, hurdles, wordScale, base, landCx, sitX, pencilX,
    house: { x: houseX, strokes: house, left: houseLeft, right: houseRight }, built: { x: houseX, strokes: built },
    city, cityEndCx, camScale, lens, palms, overlay,
  };
}

/** The gap between two neighbouring words that `cx` falls in, widened by `room` on each side, or null. */
function gapAt(cx: number, words: Box[], room: number): { a: number; b: number } | null {
  for (let i = 0; i + 1 < words.length; i++) {
    const a = words[i].x + words[i].w - room, b = words[i + 1].x + room;
    if (cx >= a && cx <= b) return { a, b };
  }
  return null;
}

export const figureScript: FigureScript = (p, vw, figW, ctx) => {
  const vh = ctx?.vh ?? 1000;
  const o = originScene(vw, vh, ctx?.marks as OriginMarks | undefined, figW);
  // Before the page has measured its words (the first frame, no JavaScript), he walks in and stops under the heading.
  if (!o.ready) return { x: lerp(-figW, vw * 0.3, ease(clamp(p / 0.6))) };
  const M = o.M;
  const feetLift = (feetY: number, sc = 1) => feetY - (vh - M.bottom) + M.footGap * sc;
  const toX = (cx: number) => cx - figW / 2;
  const first = o.line.words[0], last = o.line.words[o.line.words.length - 1];
  const startCx = o.line.L + Math.min(40, first.w / 2), endLineCx = o.line.R - Math.min(20, last.w / 3);
  const firstCx = o.hurdles[0].x - 8, lastCx = o.hurdles[o.hurdles.length - 1].x + o.hurdles[o.hurdles.length - 1].w + 8;
  if (p < W.in[1]) return { x: lerp(-figW, toX(startCx), ease(seg(p, W.in))) };
  if (p < W.crouch[1]) return { x: toX(startCx), pose: 'crouch' };
  if (p < W.up[1]) { const t = ease(seg(p, W.up)); return { x: toX(startCx), lift: feetLift(lerp(o.groundFeet, o.line.top, t)) - 24 * Math.sin(Math.PI * t), pose: 'hop' }; }
  if (p < W.land[1]) return { x: toX(startCx), lift: feetLift(o.line.top), pose: 'crouch' };
  if (p < W.line[1]) {
    const cx = lerp(startCx, endLineCx, seg(p, W.line));
    const gap = gapAt(cx, o.line.words, 10);
    if (gap) return { x: toX(cx), lift: feetLift(o.line.top) - 30 * Math.sin((Math.PI * (cx - gap.a)) / (gap.b - gap.a)), pose: 'hop' };
    return { x: toX(cx), lift: feetLift(o.line.top) };
  }
  if (p < W.dive[1]) { const t = ease(seg(p, W.dive)), sc = lerp(1, o.wordScale, t); return { x: toX(lerp(endLineCx, firstCx, t)), lift: feetLift(lerp(o.line.top, o.base, t), sc) - 50 * Math.sin(Math.PI * t), scale: sc, pose: 'hop' }; }
  if (p < W.hurdle[1]) {
    const cx = lerp(firstCx, lastCx, seg(p, W.hurdle)), sc = o.wordScale;
    const over = o.hurdles.find(b => cx >= b.x - 2 && cx <= b.x + b.w + 2);
    if (over) { const a = over.x - 2, b = over.x + over.w + 2; return { x: toX(cx), lift: feetLift(o.base, sc) - over.h * 1.3 * Math.sin((Math.PI * (cx - a)) / (b - a)), scale: sc, pose: 'hop' }; }
    return { x: toX(cx), lift: feetLift(o.base, sc), scale: sc };
  }
  if (p < W.down[1]) { const t = ease(seg(p, W.down)), sc = lerp(o.wordScale, 1, t); return { x: toX(lerp(lastCx, o.landCx, t)), lift: feetLift(lerp(o.base, o.groundFeet, t), sc) - 40 * Math.sin(Math.PI * t), scale: sc, pose: 'hop' }; }
  if (p < W.sit[1]) return { x: o.sitX, pose: 'sit' };
  if (p < W.build[1]) return { x: o.sitX, pose: 'idle' };
  if (p < W.city[1]) return { x: toX(lerp(o.landCx, o.cityEndCx, seg(p, W.city))) };
  if (p < W.approach[1]) { const t = ease(seg(p, W.approach)); return { x: toX(lerp(o.cityEndCx, vw / 2, t)), scale: lerp(1, o.camScale, t) }; }
  if (p < W.knock[1]) return { x: toX(vw / 2), scale: o.camScale, pose: 'peer' };
  return { x: toX(vw / 2), scale: lerp(o.camScale, 1, ease(seg(p, W.back))), pose: 'idle' };
};
