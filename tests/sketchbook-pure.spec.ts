import { test, expect } from '@playwright/test';
import { dense, wobble, toPath, circle, seq, variants, rect, type Pt } from '../src/app/sketchbook/pencil';
import { figureScript as deskScript, obstacle, spotX } from '../src/app/sketchbook/desk';
import { DESK_OBJECTS } from '../src/app/sketchbook/wireframes';
import { GROUND_Y } from '../src/app/sketchbook/figure';
import { figureScript as originScript, originScene, W, type OriginMarks } from '../src/app/sketchbook/origin';
import { figureMetrics } from '../src/app/sketchbook/pages';
import { figureScript as vialScript, vialScene, inspectHand, INSPECT } from '../src/app/sketchbook/vial';
import { COUNT, startOf, topAt } from '../src/app/sketchbook/drawings';

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
  const kinds: PoseKind[] = ['walk', 'idle', 'hop', 'sit', 'row', 'lookup', 'inspect', 'crouch', 'peer'];

  test('every pose has exactly fifteen strokes', () => {
    for (const k of kinds) expect(pose(k, 0), k).toHaveLength(STROKE_COUNT);
    expect(STROKE_CLASSES).toHaveLength(STROKE_COUNT);
    expect(STROKE_CLASSES[7]).toBe('s1');
    expect(STROKE_CLASSES[10]).toBe('alien');
    expect(STROKE_CLASSES[14]).toBe('pencil');
  });

  test('standing poses rest their feet on the ground line', () => {
    for (const k of ['walk', 'idle', 'lookup', 'inspect', 'crouch', 'peer'] as PoseKind[]) {
      for (let f = 0; f < FRAME_COUNTS[k]; f++) {
        const legs = [...(pose(k, f / Math.max(1, FRAME_COUNTS[k] - (k === 'walk' ? 0 : 1)))[4] ?? []), ...(pose(k, 0)[5] ?? [])];
        const lowest = Math.max(...legs.map(p => p[1]));
        expect(Math.abs(lowest - 82), `${k} frame ${f}`).toBeLessThanOrEqual(1);
      }
    }
  });

  test('the inspect pose raises a hand forward to chest height, feet on the ground', () => {
    const S = pose('inspect', 0);
    const arm = S[3];
    expect(arm, 'a right arm').toBeTruthy();
    const [hx, hy] = arm![arm!.length - 1];
    expect(hx, 'hand out in front').toBeGreaterThan(45);
    expect(hy, 'hand up at chest height').toBeLessThan(40);
    expect(hy).toBeGreaterThan(26);
    expect(pose('inspect', 0)).not.toEqual(pose('inspect', 1));
  });

  test('the crouch bends the legs wide and drops him, feet on the ground', () => {
    const S = pose('crouch', 0), I = pose('idle', 0);
    const feet = Math.max(...S.slice(4, 6).flatMap(st => st ?? []).map(pt => pt[1]));
    expect(Math.abs(feet - 82)).toBeLessThanOrEqual(1);
    const kneeSpread = Math.abs(S[4]![1][0] - S[5]![1][0]);
    expect(kneeSpread, 'knees out').toBeGreaterThan(12);
    expect(S[0]![0][1], 'lower than standing').toBeGreaterThan(I[0]![0][1] + 3);
  });

  test('the peer pose puts both hands up at head height, one each side, feet on the ground', () => {
    const S = pose('peer', 0);
    const l = S[2]![S[2]!.length - 1], r = S[3]![S[3]!.length - 1];
    expect(l[1], 'left hand up').toBeLessThan(24); expect(r[1], 'right hand up').toBeLessThan(24);
    expect(l[0], 'left of the head').toBeLessThan(24); expect(r[0], 'right of the head').toBeGreaterThan(36);
    expect(pose('peer', 0)).not.toEqual(pose('peer', 1));
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


test.describe('how I got into this (Nate, 2026-11-07: "build a city, jump on letters and over words, come up to the camera")', () => {
  /** Measured boxes a desktop or phone layout would produce: two heading lines of words, the first paragraph line's words, the copy block. */
  function fakeMarks(vw: number, vh = 1000): OriginMarks {
    const mobile = vw <= 780;
    const left = mobile ? 16 : 72, capH = mobile ? 38 : 72, lineH = mobile ? 24 : 31, gap = mobile ? 8 : 16;
    const headY = mobile ? 120 : vh <= 740 ? 140 : 200;
    const head1 = [['I\'ve', 0.9], ['always', 1.6], ['liked', 1.2]] as const, head2 = [['creating', 2.1], ['things.', 1.7]] as const;
    const lineOf = (ws: readonly (readonly [string, number])[], y: number) => { let x = left; return ws.map(([, k]) => { const b = { x, y, w: k * capH, h: capH }; x += b.w + gap; return b; }); };
    const head = [lineOf(head1, headY), lineOf(head2, headY + capH * 1.02)];
    const wordsY = headY + capH * 2.3;
    const text = 'I\'ve always liked making things. More recently, most of my side projects have';
    let x = left; const words = text.split(' ').map(w => { const b = { x, y: wordsY, w: w.length * lineH * 0.42, h: lineH }; x += b.w + lineH * 0.3; return b; }).filter(b => b.x + b.w <= vw - left);
    const copy = { x: left, y: headY - 40, w: Math.min(vw - 2 * left, 900), h: wordsY + lineH * 3.2 - (headY - 40) };
    return { head, words, copy };
  }
  const sizes: [number, number][] = [[1440, 1000], [1024, 768], [1440, 700], [390, 844]];
  /** His feet and centre on the page at a script result, from the shell's metrics (origin at the layer's bottom centre). */
  const where = (vw: number, vh: number, r: { x: number; lift?: number; scale?: number }) => {
    const M = figureMetrics(vw, vh), s = r.scale ?? 1;
    return { cx: r.x + M.figW / 2, feet: vh - M.bottom + (r.lift ?? 0) - M.footGap * s, top: vh - M.bottom + (r.lift ?? 0) - M.figH * s, s };
  };
  const mid = ([a, b]: readonly [number, number]) => (a + b) / 2;

  test('without measured marks he just walks in', () => {
    for (const [vw, vh] of sizes) for (const p of [0, 0.3, 0.7, 1]) {
      const r = originScript(p, vw, figureMetrics(vw, vh).figW, { vh });
      expect(Number.isFinite(r.x), `${vw} p ${p}`).toBe(true);
      expect(r.scale ?? 1).toBe(1); expect(r.lift ?? 0).toBe(0);
    }
  });

  test('he crouches, leaps up onto the second line of the heading, walks its letters, and hops the gap between its words', () => {
    for (const [vw, vh] of sizes) {
      const m = fakeMarks(vw, vh), figW = figureMetrics(vw, vh).figW, ctx = { vh, marks: m };
      const line = m.head[0], top = Math.min(...line.map(b => b.y)), L = line[0].x, R = line[line.length - 1].x + line[line.length - 1].w;
      expect(originScript(mid(W.crouch), vw, figW, ctx).pose, `${vw}: crouches first`).toBe('crouch');
      const up = originScript(mid(W.up), vw, figW, ctx); expect(up.pose, `${vw}: leaps`).toBe('hop');
      let onLetters = 0, gapHops = 0;
      for (let p = W.line[0]; p < W.line[1]; p += 0.001) {
        const r = originScript(p, vw, figW, ctx), q = where(vw, vh, r);
        expect(q.s, `${vw}: full size on the heading`).toBe(1);
        expect(q.cx, `${vw}: stays over the line (p ${p.toFixed(3)})`).toBeGreaterThanOrEqual(L - 2);
        expect(q.cx, `${vw}`).toBeLessThanOrEqual(R + 2);
        const over = line.find(b => q.cx >= b.x && q.cx <= b.x + b.w);
        if (over && r.pose !== 'hop') { onLetters++; expect(Math.abs(q.feet - top), `${vw}: feet on the letters (p ${p.toFixed(3)})`).toBeLessThanOrEqual(2); }
        if (!over) { gapHops++; expect(r.pose, `${vw}: hops the gap (p ${p.toFixed(3)})`).toBe('hop'); expect(q.feet, `${vw}: above the line in the gap`).toBeLessThan(top - 6); }
      }
      expect(onLetters, `${vw}: walks on the letters`).toBeGreaterThan(50);
      expect(gapHops, `${vw}: hops the gap`).toBeGreaterThan(5);
    }
  });

  test('he dives to the first line of the paragraph at word size and hurdles every word as far as mid-page', () => {
    for (const [vw, vh] of sizes) {
      const m = fakeMarks(vw, vh), figW = figureMetrics(vw, vh).figW, ctx = { vh, marks: m };
      const o = originScene(vw, vh, m, figW);
      expect(o.hurdles.length, `${vw}: some words to hurdle`).toBeGreaterThanOrEqual(3);
      expect(o.hurdles.every(b => b.x + b.w <= vw * 0.55), `${vw}: only as far as mid-page`).toBe(true);
      const base = o.hurdles[0].y + o.hurdles[0].h;
      const cleared = new Set<number>(); let onBase = 0;
      for (let p = W.hurdle[0]; p < W.hurdle[1]; p += 0.0005) {
        const r = originScript(p, vw, figW, ctx), q = where(vw, vh, r);
        expect(q.s, `${vw}: word-sized (p ${p.toFixed(3)})`).toBeLessThan(0.6); expect(q.s).toBeGreaterThan(0.2);
        const k = o.hurdles.findIndex(b => q.cx >= b.x && q.cx <= b.x + b.w);
        if (k >= 0 && q.feet <= o.hurdles[k].y - 2) cleared.add(k);
        if (k < 0 && r.pose !== 'hop') { onBase++; expect(Math.abs(q.feet - base), `${vw}: runs the baseline between words (p ${p.toFixed(3)})`).toBeLessThanOrEqual(4); }
      }
      expect([...cleared].length, `${vw}: clears every word`).toBe(o.hurdles.length);
      expect(onBase, `${vw}: lands between the words`).toBeGreaterThan(5);
      expect(originScript(mid(W.dive), vw, figW, ctx).pose, `${vw}: dives`).toBe('hop');
    }
  });

  test('he lands, sits and sketches the first house, and the city rises as he passes, taller to the right', () => {
    for (const [vw, vh] of sizes) {
      const m = fakeMarks(vw, vh), figW = figureMetrics(vw, vh).figW, ctx = { vh, marks: m };
      const o = originScene(vw, vh, m, figW);
      const sit = originScript(mid(W.sit), vw, figW, ctx);
      expect(sit.pose, `${vw}: sits`).toBe('sit'); expect(sit.scale ?? 1).toBe(1); expect(sit.lift ?? 0).toBe(0);
      expect(o.house.left - o.pencilX, `${vw}: the house starts just past his pencil`).toBeGreaterThanOrEqual(0);
      expect(o.house.left - o.pencilX).toBeLessThanOrEqual(20);
      expect(W.sketch[0]).toBeGreaterThanOrEqual(W.sit[0]); expect(W.sketch[1]).toBeLessThanOrEqual(W.sit[1]);
      expect(o.city.length, `${vw}: a city, not a house`).toBeGreaterThanOrEqual(3);
      for (let i = 1; i < o.city.length; i++) {
        expect(o.city[i].cx, `${vw}: laid out left to right`).toBeGreaterThan(o.city[i - 1].cx + 10);
        expect(o.city[i].height, `${vw}: taller to the right`).toBeGreaterThan(o.city[i - 1].height);
      }
      expect(o.city[0].left, `${vw}: the city starts past the house`).toBeGreaterThan(o.house.right);
      const tallest = o.city[o.city.length - 1];
      expect(tallest.height, `${vw}: the skyscraper is taller than him`).toBeGreaterThan(figureMetrics(vw, vh).figH * 1.4);
      expect(tallest.right, `${vw}: inside the page`).toBeLessThan(vw - 8);
      // each building is drawn as he reaches it
      for (const b of o.city) {
        let arrival = -1;
        for (let p = W.city[0]; p <= W.city[1] + 1e-9; p += 0.001) { const q = where(vw, vh, originScript(p, vw, figW, ctx)); if (q.cx >= b.cx - 30) { arrival = p; break; } }
        expect(arrival, `${vw}: he reaches building at ${b.cx.toFixed(0)}`).toBeGreaterThan(0);
        expect(Math.abs(b.start - arrival), `${vw}: it draws as he arrives`).toBeLessThanOrEqual(0.03);
      }
    }
  });

  test('he comes up to the glass: centred, big, hands on it, head under the copy, and back to size by the end', () => {
    for (const [vw, vh] of sizes) {
      const m = fakeMarks(vw, vh), M = figureMetrics(vw, vh), ctx = { vh, marks: m };
      const o = originScene(vw, vh, m, M.figW);
      const at = originScript(mid(W.hands), vw, M.figW, ctx), q = where(vw, vh, at);
      expect(at.pose, `${vw}: hands on the glass`).toBe('peer');
      expect(q.s, `${vw}: big`).toBeGreaterThanOrEqual(2.2);
      expect(Math.abs(q.cx - vw / 2), `${vw}: centred`).toBeLessThanOrEqual(2);
      expect(q.top, `${vw}: head stays under the copy`).toBeGreaterThanOrEqual(m.copy.y + m.copy.h + 8);
      expect(M.figW * q.s, `${vw}: fits the width`).toBeLessThanOrEqual(vw * 0.85);
      expect(o.lens.r, `${vw}: a porthole around the stage`).toBeGreaterThan(Math.min(vw, vh) * 0.4);
      expect(Math.abs(o.lens.cx - vw / 2), `${vw}: centred on the stage`).toBeLessThanOrEqual(1);
      expect(Math.abs(o.lens.cy - vh / 2), `${vw}`).toBeLessThanOrEqual(1);
      const headY = q.top + (14 / 92) * M.figH * q.s;
      expect(Math.hypot(headY - o.lens.cy, q.cx - o.lens.cx), `${vw}: his head is inside the glass`).toBeLessThan(o.lens.r);
      expect(o.palms.length, `${vw}: two palms on the glass`).toBe(2);
      expect(originScript(mid(W.knock), vw, M.figW, ctx).pose).toBe('peer');
      const end = where(vw, vh, originScript(1, vw, M.figW, ctx));
      expect(end.s, `${vw}: back to size`).toBeLessThanOrEqual(1.02);
      for (let p = 0; p <= 1; p += 0.002) { const r = originScript(p, vw, M.figW, ctx); expect(Number.isFinite(r.x) && Number.isFinite(r.lift ?? 0) && Number.isFinite(r.scale ?? 1), `${vw}: finite at p ${p.toFixed(3)}`).toBe(true); }
    }
  });
});

test.describe('VialGrade (Nate, 2026-11-07: "what is the guy doing?")', () => {
  const widths: [number, number][] = [[1440, 78], [1024, 78], [1440, 70], [768, 56], [390, 56]];

  test('he stops, raises the magnifier so the lens sits on the bottle, and the handle starts in his hand', () => {
    const [hx, hy] = inspectHand();
    for (const [vw, figW] of widths) {
      const o = vialScene(vw, figW), s = figW / 60;
      expect(o.lens.cx, `${vw}: the lens is over the bottle (x)`).toBeGreaterThanOrEqual(o.vialBox.left);
      expect(o.lens.cx, `${vw}`).toBeLessThanOrEqual(o.vialBox.right);
      expect(-o.lens.cy, `${vw}: the lens is over the bottle (y), not above it`).toBeLessThanOrEqual(o.vialBox.top - o.lens.r / 2);
      expect(-o.lens.cy, `${vw}`).toBeGreaterThanOrEqual(o.lens.r);
      expect(Math.abs(o.hand[0] - (o.standX + hx * s)), `${vw}: the hand is the pose's hand (x)`).toBeLessThan(1);
      expect(Math.abs(o.hand[1] + (GROUND_Y - hy) * s), `${vw}: the hand is the pose's hand (y)`).toBeLessThan(1);
      expect(o.lens.strokes.some(st => Math.hypot(st[0][0], st[0][1] - o.hand[1]) < 3), `${vw}: a handle stroke starts in his hand`).toBe(true);
      expect(o.check.strokes.length, `${vw}: a check to draw in the lens once the screen is up`).toBeGreaterThan(0);
      for (let p = 0; p <= 1; p += 0.002) {
        const f = vialScript(p, vw, figW);
        if (p >= INSPECT[0] && p < INSPECT[1]) { expect(f.pose, `${vw}: inspecting at p ${p.toFixed(3)}`).toBe('inspect'); expect(f.x, `${vw}: standing still`).toBe(o.standX); }
        else expect(f.pose, `${vw}: not inspecting at p ${p.toFixed(3)}`).toBeUndefined();
      }
    }
  });
});

test.describe('the drawings pile', () => {
  test('the piece that has just started is the one on top, at its exact start', () => {
    // floor((p - FIRST) / STEP) rounds 2.9999… down at the boundary, so the top said one piece while the next was already shown over it.
    for (let i = 0; i < COUNT; i++) {
      expect(topAt(startOf(i)), `piece ${i} at its start`).toBe(i);
      expect(topAt(startOf(i) - 0.0001), `just before piece ${i}`).toBe(i - 1);
    }
    expect(topAt(0)).toBe(-1);
    expect(topAt(1)).toBe(COUNT - 1);
  });
});
