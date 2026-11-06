/**
 * Pencil primitives. Every mark on the sketchbook is a list of points that gets
 * densified, wobbled with a seeded random walk, and emitted as a smooth path.
 * Three seeded wobbles of one mark are the three drawings a pencil test cycles
 * through (line boil). Pure functions; no DOM.
 */
export type Pt = [number, number];
export type Stroke = { pts: Pt[]; start: number; end: number; cls?: string; amp?: number; seed?: number };

/** mulberry32: small, fast, deterministic. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Resample a polyline so points sit about `step` units apart. */
export function dense(pts: Pt[], step = 3): Pt[] {
  if (pts.length < 2) return pts.slice();
  const out: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / step));
    for (let k = 0; k < n; k++) {
      const t = k / n;
      out.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

/** Perpendicular drift (decay .72) plus a little slip along the stroke. Bounded by ~2 × amp. */
export function wobble(pts: Pt[], seed: number, amp: number): Pt[] {
  const r = rng(seed);
  const n = pts.length;
  const out: Pt[] = [];
  let drift = 0;
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const q = pts[Math.min(n - 1, i + 1)];
    const o = pts[Math.max(0, i - 1)];
    let dx = q[0] - o[0];
    let dy = q[1] - o[1];
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    drift = drift * 0.72 + (r() - 0.5) * amp;
    const slip = (r() - 0.5) * amp * 0.35;
    out.push([p[0] - dy * drift + dx * slip, p[1] + dx * drift + dy * slip]);
  }
  return out;
}

/** Quadratic curve through segment midpoints; reads as a soft pencil line. */
export function toPath(pts: Pt[]): string {
  if (!pts || pts.length < 2) return 'M0 0';
  let d = `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
    const my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += `Q${pts[i][0].toFixed(2)} ${pts[i][1].toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)}`;
  }
  const l = pts[pts.length - 1];
  return d + `L${l[0].toFixed(2)} ${l[1].toFixed(2)}`;
}

/** A circle that overshoots its start by `over - 2` half-turns, the way a hand closes one. */
export function circle(cx: number, cy: number, r: number, n = 28, start = -1.2, over = 2.08): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const a = start + (i / n) * Math.PI * over;
    out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return out;
}

export function arc(cx: number, cy: number, r: number, a0: number, a1: number, n = 10): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return out;
}

/** Four separate strokes with 2-unit overshoot at the corners, like a quickly boxed sketch. */
export function rect(x: number, y: number, w: number, h: number): Pt[][] {
  return [
    [[x - 2, y], [x + w + 2, y]],
    [[x + w, y - 2], [x + w, y + h + 2]],
    [[x + w + 2, y + h], [x - 2, y + h]],
    [[x, y + h + 2], [x, y - 2]],
  ];
}

/** The boil frames for one mark: `count` seeded wobbles of the densified points. */
export function variants(pts: Pt[], seed: number, amp: number, count = 3): string[] {
  const d = dense(pts, 3);
  const out: string[] = [];
  for (let v = 0; v < count; v++) out.push(toPath(wobble(d, seed + v * 977, amp)));
  return out;
}

/** Spread a group of marks evenly across a progress window so they draw on in order. */
export function seq(groups: Pt[][], start: number, end: number, cls?: string, amp?: number): Stroke[] {
  const w = (end - start) / groups.length;
  return groups.map((pts, i) => ({ pts, start: start + w * i, end: start + w * (i + 1), cls, amp }));
}
