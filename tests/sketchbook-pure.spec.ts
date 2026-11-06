import { test, expect } from '@playwright/test';
import { dense, wobble, toPath, circle, seq, variants, rect, type Pt } from '../src/app/sketchbook/pencil';
import { figureScript as deskScript, obstacle, spotX } from '../src/app/sketchbook/desk';
import { DESK_OBJECTS } from '../src/app/sketchbook/wireframes';
import { GROUND_Y } from '../src/app/sketchbook/figure';

const line: Pt[] = [[0, 0], [30, 0]];

test.describe('pencil', () => {
  test('wobble is deterministic for a seed and differs across seeds', () => {
    const a = wobble(dense(line), 7, 1);
    const b = wobble(dense(line), 7, 1);
    const c = wobble(dense(line), 8, 1);
    expect(a).toEqual(b);
    expect(a).not.toEqual(c);
  });

  test('wobble never moves a point more than three times the amplitude', () => {
    const pts = dense(line);
    for (const amp of [0.5, 1, 1.5]) {
      const w = wobble(pts, 3, amp);
      w.forEach((q, i) => expect(Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1])).toBeLessThanOrEqual(3 * amp));
    }
  });

  test('dense splits a 30 px segment at step 3 into 11 points', () => {
    expect(dense(line, 3)).toHaveLength(11);
  });

  test('toPath of fewer than two points is an empty move', () => {
    expect(toPath([[5, 5]])).toBe('M0 0');
    expect(toPath([])).toBe('M0 0');
  });

  test('circle overshoots its start like a pencil', () => {
    const c = circle(0, 0, 10);
    const first = c[0], last = c[c.length - 1];
    const a0 = Math.atan2(first[1], first[0]), a1 = Math.atan2(last[1], last[0]);
    const swept = ((a1 - a0) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    expect(swept).toBeGreaterThan(0);
    expect(swept).toBeLessThan(0.3);
    expect(c.length).toBeGreaterThan(20);
  });

  test('seq spreads groups evenly over a window', () => {
    const s = seq([line, line, line, line], 0.2, 0.6);
    expect(s.map(x => Number(x.start.toFixed(3)))).toEqual([0.2, 0.3, 0.4, 0.5]);
    expect(Number(s[3].end.toFixed(3))).toBe(0.6);
  });

  test('variants returns three distinct path strings', () => {
    const v = variants(line, 11, 1);
    expect(v).toHaveLength(3);
    expect(new Set(v).size).toBe(3);
    v.forEach(d => expect(d.startsWith('M')).toBe(true));
  });

  test('rect is four strokes that overshoot the corners', () => {
    const r = rect(0, 0, 100, 50);
    expect(r).toHaveLength(4);
    expect(r[0][1][0]).toBeGreaterThan(100);
  });
});

import { pose, buildFrames, FRAME_COUNTS, STROKE_COUNT, STROKE_CLASSES, type PoseKind } from '../src/app/sketchbook/figure';

test.describe('little Nate', () => {
  const kinds: PoseKind[] = ['walk', 'idle', 'hop', 'sit', 'row', 'lookup'];

  test('every pose has exactly fifteen strokes', () => {
    for (const k of kinds) expect(pose(k, 0), k).toHaveLength(STROKE_COUNT);
    expect(STROKE_CLASSES).toHaveLength(STROKE_COUNT);
    expect(STROKE_CLASSES[7]).toBe('s1');
    expect(STROKE_CLASSES[10]).toBe('alien');
    expect(STROKE_CLASSES[14]).toBe('pencil');
  });

  test('standing poses rest their feet on the ground line', () => {
    for (const k of ['walk', 'idle', 'lookup'] as PoseKind[]) {
      for (let f = 0; f < FRAME_COUNTS[k]; f++) {
        const legs = [...(pose(k, f / Math.max(1, FRAME_COUNTS[k] - (k === 'walk' ? 0 : 1)))[4] ?? []), ...(pose(k, 0)[5] ?? [])];
        const lowest = Math.max(...legs.map(p => p[1]));
        expect(Math.abs(lowest - 82), `${k} frame ${f}`).toBeLessThanOrEqual(1);
      }
    }
  });

  test('the hop tucks the legs', () => {
    const all = pose('hop', 0).flatMap(s => s ?? []);
    expect(Math.max(...all.map(p => p[1]))).toBeLessThanOrEqual(78);
  });

  test('frames are built with two boil variants each', () => {
    const F = buildFrames();
    expect(F.walk).toHaveLength(8);
    for (const k of kinds) {
      expect(F[k], k).toHaveLength(FRAME_COUNTS[k]);
      for (const frame of F[k]) {
        expect(frame).toHaveLength(2);
        for (const v of frame) expect(v).toHaveLength(STROKE_COUNT);
      }
    }
  });

  test('sit and row move between their two frames', () => {
    expect(pose('sit', 0)).not.toEqual(pose('sit', 1));
    expect(pose('row', 0)).not.toEqual(pose('row', 1));
  });

  test('the rower keeps its legs inside the hull', () => {
    const all = pose('row', 0).flatMap(s => s ?? []);
    expect(Math.max(...all.map(p => p[1]))).toBeLessThanOrEqual(70);
  });
});

import { pageProgress, activeIndex, pageHeightVh, copyOn, headOn, TRAVEL_VH, OVERLAP_VH, PIN_VH } from '../src/app/sketchbook/pages';

test.describe('page math', () => {
  test('progress runs 0 → 1 across the scrollable part of a page', () => {
    expect(pageProgress(1000, 2000, 1000, 800).p).toBe(0);
    expect(pageProgress(1000, 2000, 2200, 800).p).toBe(1);
    expect(pageProgress(1000, 2000, 1600, 800).p).toBeCloseTo(0.5, 5);
    expect(pageProgress(1000, 2000, 0, 800).p).toBe(0);
    expect(pageProgress(1000, 2000, 9000, 800).p).toBe(1);
  });

  test('leaving rises only once the page bottom climbs above the viewport bottom', () => {
    expect(pageProgress(1000, 2000, 2200, 800).leaving).toBe(0);
    expect(pageProgress(1000, 2000, 2260, 800).leaving).toBeCloseTo(0.5, 5);
    expect(pageProgress(1000, 2000, 2320, 800).leaving).toBe(1);
  });

  test('the active page is the last one whose top has been reached', () => {
    expect(activeIndex([0, 1600, 3200], 1599)).toBe(0);
    expect(activeIndex([0, 1600, 3200], 1600)).toBe(1);
    expect(activeIndex([0, 1600, 3200], 9999)).toBe(2);
  });
});

import { readFileSync, statSync } from 'node:fs';

test.describe('traced art', () => {
  const names = ['bob-marley', 'dog-scarf', 'house', 'moose', 'coke-can', 'miami'];
  test('traced art is small and present', () => {
    for (const n of names) {
      const file = `public/art/traced/${n}.json`;
      expect(statSync(file).size, file).toBeLessThan(60_000);
      const data = JSON.parse(readFileSync(file, 'utf8')) as { w: number; h: number; paths: string[] };
      expect(data.w, n).toBeGreaterThan(0);
      expect(data.h, n).toBeGreaterThan(0);
      expect(data.paths.length, n).toBeGreaterThan(0);
      expect(data.paths.length, n).toBeLessThanOrEqual(80);
    }
  });
});

test.describe('page turn (Nate, 2026-11-06: slower, and a sheet laid over)', () => {
  test('a page plays through over its travel, then holds while the next sheet covers it', () => {
    // top 1000, travel 2000, stage 1000, overlap 1000 → height 4000
    expect(pageProgress(1000, 4000, 2000, 1000, 1000).p).toBeCloseTo(0.5);
    expect(pageProgress(1000, 4000, 3000, 1000, 1000).p).toBe(1);
    expect(pageProgress(1000, 4000, 3500, 1000, 1000).p).toBe(1);
  });

  test('entering runs 0 → 1 over the screen before a page pins', () => {
    expect(pageProgress(3000, 4000, 2000, 1000, 1000).entering).toBe(0);
    expect(pageProgress(3000, 4000, 2500, 1000, 1000).entering).toBeCloseTo(0.5);
    expect(pageProgress(3000, 4000, 3000, 1000, 1000).entering).toBe(1);
  });

  test('a page is its travel plus the stage, plus the overlap unless it is last', () => {
    expect(pageHeightVh(200, false)).toBe(200 + PIN_VH + OVERLAP_VH);
    expect(pageHeightVh(120, true)).toBe(120 + PIN_VH);
    expect(TRAVEL_VH).toBeGreaterThanOrEqual(200);
    expect(OVERLAP_VH).toBe(100);
  });

  test('copy is on while a sheet rises on a desktop, and from the pin on a phone', () => {
    expect(copyOn(0, false, 0.5, 1440)).toBe(true);
    expect(copyOn(0, false, 0.1, 1440)).toBe(false);
    expect(copyOn(0, false, 0.5, 390)).toBe(false);
    expect(copyOn(0.1, false, 1, 390)).toBe(true);
    expect(copyOn(0, true, 0, 390)).toBe(true);
  });

  test('a heading shades in as its sheet rises, or with progress once pinned', () => {
    expect(headOn(0, 0.3)).toBe(0);
    expect(headOn(0, 0.95)).toBe(1);
    expect(headOn(0.3, 0)).toBe(1);
    expect(headOn(0.02, 0)).toBe(0);
    expect(headOn(0, 0.6)).toBeGreaterThan(0.2);
  });
});

test.describe('the pencil (Nate, 2026-11-06: "the pencil didn\'t move")', () => {
  test('sitting, his pencil sweeps across the page instead of sitting still', () => {
    const n = FRAME_COUNTS.sit;
    expect(n).toBeGreaterThanOrEqual(4);
    const tips = Array.from({ length: n }, (_, f) => pose('sit', f)[14]![0]);
    const xs = tips.map(q => q[0]), ys = tips.map(q => q[1]);
    expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThanOrEqual(8);
    expect(Math.max(...ys) - Math.min(...ys)).toBeGreaterThanOrEqual(3);
  });
});

test.describe('the desk (Nate, 2026-11-06: "why is he jumping over a beer can?")', () => {
  // Desktop and phone widths, with the figure width the shell uses at each.
  const widths: [number, number][] = [[1440, 78], [1024, 78], [781, 78], [768, 56], [375, 56]];

  test('what he hops is drawn at the scale of the other desk objects, and his feet clear it', () => {
    const smallest = Math.min(...DESK_OBJECTS.map(o => -Math.min(...o.strokes.flat().map(pt => pt[1]))));
    // In the hop his legs tuck: his feet ride this far above the ground line (figure units, 60 wide).
    const feet = Math.max(...pose('hop', 0).slice(4, 6).flatMap(s => s ?? []).map(pt => pt[1]));
    for (const [vw, figW] of widths) {
      const o = obstacle(vw);
      expect(o.height, `${vw}: not a mug among houses`).toBeGreaterThanOrEqual(0.75 * smallest * o.scale);
      const tuck = (GROUND_Y - feet) * (figW / 60);
      let apex = 0, first = Infinity, last = -Infinity, hops = 0;
      for (let p = 0; p <= 1; p += 0.001) {
        const s = deskScript(p, vw, figW);
        const cx = s.x + figW / 2;
        if (s.pose === 'hop') { hops++; apex = Math.min(apex, s.lift ?? 0); first = Math.min(first, cx); last = Math.max(last, cx); }
        else expect(s.lift ?? 0, `${vw}: no lift except in the hop`).toBe(0);
      }
      expect(hops, `${vw}: he hops`).toBeGreaterThan(0);
      expect(first, `${vw}: takes off before its left edge`).toBeLessThanOrEqual(o.left);
      expect(last, `${vw}: lands past its right edge`).toBeGreaterThanOrEqual(o.right);
      expect(tuck - apex, `${vw}: his feet clear its top`).toBeGreaterThanOrEqual(o.height + 4);
    }
  });

  test('it stands clear of the desk objects at every width', () => {
    for (const [vw] of widths) {
      const o = obstacle(vw);
      for (const [i, d] of DESK_OBJECTS.entries()) {
        const xs = d.strokes.flat().map(pt => pt[0]);
        const cx = spotX(i, vw) * vw;
        const l = cx + Math.min(...xs), r = cx + Math.max(...xs);
        expect(r <= o.left - 4 || l >= o.right + 4, `${vw}: ${d.slug} ${l.toFixed(0)}–${r.toFixed(0)} against ${o.left.toFixed(0)}–${o.right.toFixed(0)}`).toBe(true);
      }
    }
  });
});
