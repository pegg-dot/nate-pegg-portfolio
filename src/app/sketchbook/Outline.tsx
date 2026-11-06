'use client';
import { clamp } from './pages';
import styles from './sketchbook.module.css';

/** A traced drawing's outline paths drawing on in order. No boil: these are the real drawing's contours. */
export default function Outline({ paths, w, h, progress, style }: { paths: string[]; w: number; h: number; progress: number; style?: React.CSSProperties }) {
  const n = paths.length || 1;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={styles.wireSvg} data-sketch="outline" aria-hidden="true" preserveAspectRatio="xMidYMid meet" fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {paths.map((d, k) => {
        const t = clamp((progress - k / n) * 3);
        return <path key={k} d={d} pathLength={1} data-stroke="" vectorEffect="non-scaling-stroke" style={{ strokeDasharray: 1, strokeDashoffset: 1 - t, visibility: t > 0 ? 'visible' : 'hidden' }} />;
      })}
    </svg>
  );
}
