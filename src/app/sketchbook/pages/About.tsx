'use client';
import { HOME_COPY } from '../copy';
import { clamp, copyOn, ease, headOn, lerp } from '../pages';
import ShadedHeading from '../ShadedHeading';
import type { FigureScript, PageProps } from '../types';
import styles from '../sketchbook.module.css';

/** He walks to the middle, and once he is there his shirt gets its color: this page is him, not a draft. */
export const figureScript: FigureScript = (p, vw, figW) => ({ x: lerp(vw * 0.04, vw / 2 - figW / 2, ease(clamp(p / 0.5))), colored: p > 0.6 });

export default function About({ progress, vw, entering, seen }: PageProps) {
  const a = HOME_COPY.about;
  return (
    <div className={[styles.copy, styles.aboutCopy, copyOn(progress, seen, entering, vw) ? styles.on : ''].join(' ')} data-zone="copy">
      <ShadedHeading lines={[a.heading]} progress={headOn(progress, entering, vw)} />
      <p>{a.p1}</p>
      <p>{a.p2}</p>
    </div>
  );
}
