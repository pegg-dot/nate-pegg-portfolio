import { test, expect } from '@playwright/test';
import { dense, wobble, toPath, circle, seq, variants, rect, type Pt } from '../src/app/sketchbook/pencil';

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
