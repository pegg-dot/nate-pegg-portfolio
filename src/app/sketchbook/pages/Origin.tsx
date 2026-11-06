'use client';
import { HOME_COPY } from '../copy';
import { clamp, copyOn, ease, lerp } from '../pages';
import ShadedHeading from '../ShadedHeading';
import type { FigureScript, PageProps } from '../types';
import styles from '../sketchbook.module.css';

/** He walks in from the left edge and stops under the heading. */
export const figureScript: FigureScript = (p, vw, figW) => ({ x: lerp(-figW, vw * 0.3, ease(clamp(p / 0.6))) });

export default function Origin({ progress, seen }: PageProps) {
  return (
    <div className={[styles.copy, styles.originCopy, copyOn(progress, seen) ? styles.on : ''].join(' ')} data-zone="copy">
      <span className={styles.micro}>{HOME_COPY.origin.label}</span>
      <ShadedHeading lines={HOME_COPY.origin.heading} progress={clamp((progress - 0.05) / 0.35)} />
      <p>{HOME_COPY.origin.body}</p>
    </div>
  );
}
