'use client';
import { HOME_COPY } from '../copy';
import { clamp, copyOn, ease, lerp } from '../pages';
import ShadedHeading from '../ShadedHeading';
import type { FigureScript, PageProps } from '../types';
import styles from '../sketchbook.module.css';

/** He walks to the middle, and once the reader reaches the fun fact the shirt gets its color. */
export const figureScript: FigureScript = (p, vw, figW) => ({ x: lerp(vw * 0.04, vw / 2 - figW / 2, ease(clamp(p / 0.5))), colored: p > 0.6 });

export default function About({ progress, seen }: PageProps) {
  const a = HOME_COPY.about;
  return (
    <div className={[styles.copy, styles.aboutCopy, copyOn(progress, seen) ? styles.on : ''].join(' ')} data-zone="copy">
      <ShadedHeading lines={[a.heading]} progress={clamp((progress - 0.02) / 0.25)} />
      <p>{a.p1}</p>
      <p>{a.p2}</p>
      <p className={styles.funFact}>{a.p3}</p>
    </div>
  );
}
