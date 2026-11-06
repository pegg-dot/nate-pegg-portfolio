'use client';
import { useMemo } from 'react';
import { variants, type Stroke } from './pencil';
import { clamp } from './pages';
import styles from './sketchbook.module.css';

/**
 * An ordered set of pencil marks that draw on with `progress` and boil between
 * three seeded variants while `active`. Off-screen pages pass active=false and freeze.
 */
export default function Sketch({ strokes, progress, active, viewBox, className, boil, name, strokeWidth }: {
  strokes: Stroke[]; progress: number; active: boolean; viewBox: string; className?: string; boil: number; name?: string; strokeWidth?: number;
}) {
  const built = useMemo(() => strokes.map((s, i) => ({ s, v: variants(s.pts, (i + 1) * 131 + (s.seed ?? 0), s.amp ?? 1.3) })), [strokes]);
  return (
    <svg viewBox={viewBox} className={[styles.sk, className].filter(Boolean).join(' ')} data-sketch={name ?? 'sketch'} aria-hidden="true" preserveAspectRatio="xMidYMid meet" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 1.9} strokeLinecap="round" strokeLinejoin="round">
      {built.map(({ s, v }, i) => {
        const t = clamp((progress - s.start) / (s.end - s.start));
        return <path key={i} d={v[active ? boil % v.length : 0]} className={s.cls} pathLength={1} data-stroke="" style={{ strokeDasharray: 1, strokeDashoffset: 1 - t, visibility: t > 0 ? 'visible' : 'hidden' }} />;
      })}
    </svg>
  );
}
