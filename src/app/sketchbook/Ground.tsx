'use client';
import { useMemo } from 'react';
import type { Pt, Stroke } from './pencil';
import Sketch from './Sketch';
import styles from './sketchbook.module.css';

export type GroundObject = { x: number; strokes: Pt[][]; start: number; end: number; cls?: string; until?: number; blink?: boolean; amp?: number };

/** Things standing on the ground line (the line little Nate's feet are on), at his scale, in px. */
export default function Ground({ objects, vw, progress, active, boil }: { objects: GroundObject[]; vw: number; progress: number; active: boolean; boil: number }) {
  const strokes = useMemo<Stroke[]>(() => objects.flatMap(o => {
    const n = o.strokes.length, w = (o.end - o.start) / n;
    return o.strokes.map((pts, i) => ({ pts: pts.map(([x, y]) => [o.x * vw + x, 100 + y] as Pt), start: o.start + w * i, end: o.start + w * (i + 1), cls: o.cls, until: o.until, blink: o.blink, amp: o.amp }));
  }), [objects, vw]);
  return <Sketch name="ground" strokes={strokes} progress={progress} active={active} boil={boil} viewBox={`0 0 ${Math.max(320, vw)} 100`} preserveAspectRatio="xMinYMax meet" className={styles.ground} strokeWidth={1.9} />;
}
