'use client';
import { useMemo } from 'react';
import { HOME_COPY } from '../copy';
import Ground, { type GroundObject } from '../Ground';
import { BUILD, figureScript, originScene, SKETCH } from '../origin';
import { copyOn, headOn } from '../pages';
import ShadedHeading from '../ShadedHeading';
import type { PageProps } from '../types';
import styles from '../sketchbook.module.css';

export { figureScript };

/** "I've always liked creating things": he sits and sketches a house, it gets built, and he leaps a river on his way out. */
export default function Origin({ progress, vw, entering, seen, active, boil }: PageProps) {
  const figW = vw <= 780 ? 56 : 78;
  const objects = useMemo<GroundObject[]>(() => {
    const o = originScene(vw, figW);
    return [
      { x: o.river.x, strokes: o.river.strokes, start: 0.02, end: 0.1, cls: 'river' },
      { x: o.house.x, strokes: o.house.strokes, start: SKETCH[0], end: SKETCH[1], cls: 'house', amp: 1.3 },
      { x: o.built.x, strokes: o.built.strokes, start: BUILD[0], end: BUILD[1], cls: 'built', amp: 0.5 },
    ];
  }, [vw, figW]);
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
