/**
 * Little Nate: a stick figure in the striped alien shirt, drawn as fifteen strokes
 * in a 60 × 92 box. Standing poses are grounded so the lowest foot sits on y = 82,
 * which is what gives the walk its bob. Pure geometry; no DOM.
 */
import { circle, dense, toPath, wobble, type Pt } from './pencil';

export type PoseKind = 'walk' | 'idle' | 'hop' | 'sit' | 'row' | 'lookup' | 'inspect';
export const STROKE_COUNT = 15;
export const GROUND_Y = 82;
export const FRAME_COUNTS: Record<PoseKind, number> = { walk: 8, idle: 2, hop: 1, sit: 4, row: 2, lookup: 1, inspect: 2 };
/** 0 head, 1 torso, 2–3 arms, 4–5 legs, 6 shirt, 7–9 stripes, 10 alien, 11–12 alien eyes, 13 eye, 14 pencil */
export const STROKE_CLASSES = ['', '', '', '', '', '', '', 's1', 's2', 's3', 'alien', 'alienEye', 'alienEye', 'eye', 'pencil'];

const D = Math.PI / 180;
/** Two-segment limb from (x, y): first segment at angle a1 (degrees from straight down), second at a2. */
function limb(x: number, y: number, a1: number, l1: number, a2: number, l2: number): Pt[] {
  const kx = x + Math.sin(a1 * D) * l1;
  const ky = y + Math.cos(a1 * D) * l1;
  return [[x, y], [kx, ky], [kx + Math.sin(a2 * D) * l2, ky + Math.cos(a2 * D) * l2]];
}
const shift = (S: (Pt[] | null)[], dx: number, dy: number) => S.map(s => (s ? s.map(([x, y]) => [x + dx, y + dy] as Pt) : s));

export function pose(kind: PoseKind, phase: number): (Pt[] | null)[] {
  const S: (Pt[] | null)[] = new Array(STROKE_COUNT).fill(null);
  const hipY = kind === 'sit' || kind === 'row' ? 48 : 52;
  const headY = 14;
  S[0] = circle(30, headY, 8.5);
  S[1] = [[30, 22.5], [30, hipY]];
  if (kind === 'walk') {
    const a = 30 * Math.sin(phase * 2 * Math.PI);
    S[4] = limb(30, hipY, a, 15, a * 0.55 + (a < 0 ? -22 : 6), 15);
    S[5] = limb(30, hipY, -a, 15, -a * 0.55 + (-a < 0 ? -22 : 6), 15);
    S[2] = limb(30, 28, -a * 0.7, 12, -a * 0.5, 11);
    S[3] = limb(30, 28, a * 0.7, 12, a * 0.5, 11);
  } else if (kind === 'idle' || kind === 'lookup') {
    S[4] = limb(30, hipY, -6, 15, -4, 15);
    S[5] = limb(30, hipY, 7, 15, 5, 15);
    S[2] = limb(30, 28, -8, 12, -4 + phase * 2, 11);
    S[3] = limb(30, 28, 9, 12, 5 - phase * 2, 11);
  } else if (kind === 'inspect') {
    // Standing, the right arm raised straight out: he holds a magnifier up to something in front of him.
    S[4] = limb(30, hipY, -6, 15, -4, 15);
    S[5] = limb(30, hipY, 7, 15, 5, 15);
    S[2] = limb(30, 28, -8, 12, -4, 11);
    S[3] = limb(30, 28, 90, 12, 60 + phase * 4, 11);
  } else if (kind === 'hop') {
    S[4] = limb(30, hipY, -40, 13, 50, 13);
    S[5] = limb(30, hipY, -20, 13, 70, 13);
    S[2] = limb(30, 28, -135, 12, -165, 11);
    S[3] = limb(30, 28, 135, 12, 165, 11);
  } else if (kind === 'sit') {
    // Sketching: the forearm circles from the elbow, so the pencil visibly sweeps the page beside him (the old 2 px shuffle vanished under the boil).
    const a = (phase / FRAME_COUNTS.sit) * 2 * Math.PI;
    const hx = 52 + 6 * Math.sin(a), hy = 43 + 3 * Math.cos(a);
    S[1] = [[30, 22.5], [31, hipY]];
    S[4] = [[31, hipY], [44, 50], [44, 64]];
    S[5] = [[31, hipY], [41, 51], [41, 65]];
    S[2] = [[30, 28], [42, 35], [hx, hy]];
    S[3] = [[30, 28], [25, 38], [29, 44]];
    S[14] = [[hx, hy], [hx + 6, hy + 8]];
  } else if (kind === 'row') {
    // Facing the stern: legs bent forward inside the hull, both arms reach then pull.
    S[1] = [[30, 22.5], [31, hipY]];
    S[4] = [[31, hipY], [44, 52], [50, 60]];
    S[5] = [[31, hipY], [42, 53], [48, 61]];
    const reach = phase ? -8 : 14;
    S[2] = [[30, 28], [30 + reach, 36], [30 + reach * 1.4, 44]];
    S[3] = [[30, 28], [30 + reach - 2, 37], [30 + reach * 1.4 - 2, 45]];
  }
  S[6] = [[22, 25], [38, 25], [39, 47], [21, 47], [22, 25]];
  S[7] = [[22, 31], [38, 31]];
  S[8] = [[22, 37], [38, 37]];
  S[9] = [[21, 43], [39, 43]];
  S[10] = circle(30, 40, 3.2, 16);
  S[11] = circle(28.9, 39.4, 0.5, 6);
  S[12] = circle(31.1, 39.4, 0.5, 6);
  S[13] = circle(33.5, kind === 'lookup' ? headY - 3 : headY - 1, 0.6, 6);
  if (kind === 'walk' || kind === 'idle' || kind === 'lookup' || kind === 'sit' || kind === 'inspect') {
    const lowest = Math.max(...[...(S[4] ?? []), ...(S[5] ?? [])].map(p => p[1]));
    return shift(S, 0, GROUND_Y - lowest);
  }
  return S;
}

export type Frames = Record<PoseKind, string[][][]>;
let cache: Frames | null = null;
/** [kind][frame][variant][stroke] → path d. Two seeded wobbles per frame, amp .9. */
export function buildFrames(): Frames {
  if (cache) return cache;
  const out = {} as Frames;
  (Object.keys(FRAME_COUNTS) as PoseKind[]).forEach(kind => {
    const n = FRAME_COUNTS[kind];
    out[kind] = [];
    for (let f = 0; f < n; f++) {
      const phase = kind === 'walk' ? f / n : n === 1 ? 0 : f;
      const S = pose(kind, phase);
      out[kind].push([0, 1].map(v => S.map((pts, i) => (pts ? toPath(wobble(dense(pts, 2.5), (i + 7) * 53 + f * 311 + v * 997 + kind.length * 17, 0.9)) : 'M0 0'))));
    }
  });
  cache = out;
  return out;
}
