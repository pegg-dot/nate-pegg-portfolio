'use client';
import { useMemo } from 'react';
import { HOME_COPY } from '../copy';
import Ground, { type GroundObject } from '../Ground';
import { figureScript, originScene, sparks } from '../origin';
import { copyOn, figureMetrics, headOn } from '../pages';
import ShadedHeading from '../ShadedHeading';
import type { PageProps } from '../types';
import styles from '../sketchbook.module.css';

export { figureScript };

/** "I've always liked creating things": he builds the city with a hammer, one building at a time, sparks at the strike. */
export default function Origin({ progress, vw, vh, entering, seen, active, boil }: PageProps) {
  const figW = figureMetrics(vw, vh).figW;
  const objects = useMemo<GroundObject[]>(() => originScene(vw, figW).sites.flatMap(b => [
    { x: b.cx / vw, strokes: b.strokes, start: b.hammer[0], end: b.hammer[1], cls: 'city', amp: 0.8 },
    { x: b.left / vw, strokes: sparks(b.strike[0] - b.left, b.strike[1]), start: b.hammer[0], end: b.hammer[0] + 0.01, until: b.hammer[1], cls: 'spark', blink: true },
  ]), [vw, figW]);
  return (
    <>
      <div className={[styles.copy, styles.originCopy, copyOn(progress, seen, entering, vw) ? styles.on : ''].join(' ')} data-zone="copy">
        <span className={styles.micro}>{HOME_COPY.origin.label}</span>
        <ShadedHeading lines={HOME_COPY.origin.heading} progress={headOn(progress, entering, vw, 0.05, 0.35)} />
        <p>{HOME_COPY.origin.body}</p>
      </div>
      <Ground objects={objects} vw={vw} progress={progress} active={active} boil={boil} />
    </>
  );
}
