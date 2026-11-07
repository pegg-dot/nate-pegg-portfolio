'use client';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { HOME_COPY } from '../copy';
import Ground, { type GroundObject } from '../Ground';
import { elementBox, setMarks, wordBoxes } from '../landmarks';
import { figureScript, originScene, W, type OriginMarks } from '../origin';
import { copyOn, figureMetrics, headOn } from '../pages';
import ShadedHeading from '../ShadedHeading';
import Sketch from '../Sketch';
import type { PageProps } from '../types';
import styles from '../sketchbook.module.css';

export { figureScript };

/**
 * "I've always liked creating things", shown: he leaps onto the heading and walks its letters, hurdles the
 * words of the paragraph, sketches a house, walks a city up, and comes up to the glass. The page measures its
 * heading words, its first paragraph line, and its copy block for the script (see origin.ts).
 */
export default function Origin({ progress, vw, vh, entering, seen, active, boil }: PageProps) {
  const copyRef = useRef<HTMLDivElement>(null);
  const [marks, setLocal] = useState<OriginMarks | undefined>();
  useLayoutEffect(() => {
    const copy = copyRef.current;
    if (!copy) return;
    const measure = () => {
      const h2 = copy.querySelector('h2'), para = copy.querySelector('p');
      if (!h2 || !para) return;
      // Each heading word: its x and width from the text, its top and height from the line box (the Range's box is the font's ascender line, well above the letters).
      const head = Array.from(h2.querySelectorAll('span')).map(sp => { const lineBox = elementBox(sp as HTMLElement, copy); return wordBoxes(sp as HTMLElement, copy).map(b => ({ ...b, y: lineBox.y, h: lineBox.h })); });
      const all = wordBoxes(para as HTMLElement, copy);
      const words = all.length ? all.filter(b => Math.abs(b.y - all[0].y) < 2) : [];
      const m: OriginMarks = { head, words, copy: elementBox(copy, copy) };
      setMarks('work', m);
      setLocal(prev => (JSON.stringify(prev) === JSON.stringify(m) ? prev : m));
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    const ro = new ResizeObserver(measure);
    ro.observe(copy);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);
  const figW = figureMetrics(vw, vh).figW;
  const o = useMemo(() => originScene(vw, vh, marks, figW), [vw, vh, marks, figW]);
  const objects = useMemo<GroundObject[]>(() => [
    { x: o.house.x, strokes: o.house.strokes, start: W.sketch[0], end: W.sketch[1], cls: 'house', amp: 1.3 },
    { x: o.built.x, strokes: o.built.strokes, start: W.build[0], end: W.build[1], cls: 'built', amp: 0.5 },
    ...o.city.map(b => ({ x: b.cx / vw, strokes: b.strokes, start: b.start, end: b.end, cls: 'city', amp: 0.8 })),
  ], [o, vw]);
  return (
    <>
      <div ref={copyRef} className={[styles.copy, styles.originCopy, copyOn(progress, seen, entering, vw) ? styles.on : ''].join(' ')} data-zone="copy">
        <span className={styles.micro}>{HOME_COPY.origin.label}</span>
        <ShadedHeading lines={HOME_COPY.origin.heading} progress={headOn(progress, entering, vw, 0.02, 0.1)} />
        <p>{HOME_COPY.origin.body}</p>
      </div>
      <Ground objects={objects} vw={vw} progress={progress} active={active} boil={boil} />
      <Sketch name="lens" strokes={o.overlay} progress={progress} active={active} boil={boil} viewBox={`0 0 ${Math.max(320, vw)} ${Math.max(320, vh)}`} preserveAspectRatio="none" className={styles.lensLayer} strokeWidth={1.8} />
    </>
  );
}
