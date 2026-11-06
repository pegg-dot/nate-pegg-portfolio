'use client';
import { useMemo, type ReactNode } from 'react';
import { seq } from './pencil';
import { clamp } from './pages';
import Sketch from './Sketch';
import { WIREFRAMES, hatch } from './wireframes';
import styles from './sketchbook.module.css';

/**
 * Sketch becomes real, with the same shapes: the pencil draws the wireframe of the real
 * screen, hatches over it, and the real image comes through in place.
 */
export default function Reveal({ kind, progress, active, boil, media }: { kind: keyof typeof WIREFRAMES; progress: number; active: boolean; boil: number; media: ReactNode }) {
  const wf = WIREFRAMES[kind];
  const wire = useMemo(() => seq(wf.strokes, 0.12, 0.5, 'wire', 2.2), [wf]);
  const shade = useMemo(() => seq(hatch(wf.w, wf.h), 0.55, 0.8, 'hatch', 1.6), [wf]);
  return (
    <div className={styles.canvas} data-zone="canvas" style={{ aspectRatio: `${wf.w} / ${wf.h}`, maxWidth: `calc(var(--canvas-max-h) * ${(wf.w / wf.h).toFixed(4)})` }}>
      <div className={styles.media} data-media="" style={{ opacity: clamp((progress - 0.6) / 0.2).toFixed(3) }}>{media}</div>
      <Sketch name="wireframe" strokes={wire} progress={progress} active={active} boil={boil} viewBox={wf.viewBox} className={styles.wireSvg} strokeWidth={1.6} style={{ opacity: 1 - clamp((progress - 0.78) / 0.1) }} />
      <Sketch name="hatch" strokes={shade} progress={progress} active={active} boil={boil} viewBox={wf.viewBox} className={`${styles.wireSvg} ${styles.clipSvg}`} strokeWidth={1.1} style={{ opacity: 1 - clamp((progress - 0.86) / 0.08) }} />
    </div>
  );
}
