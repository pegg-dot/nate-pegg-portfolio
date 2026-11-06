'use client';
import Link from 'next/link';
import { useMemo } from 'react';
import { HOME_COPY } from '../copy';
import Ground, { type GroundObject } from '../Ground';
import { arrival, figureScript, leap, obstacle, spotX } from '../desk';
import { copyOn, headOn } from '../pages';
import { seq } from '../pencil';
import ShadedHeading from '../ShadedHeading';
import Sketch from '../Sketch';
import Stack from '../Stack';
import type { PageProps } from '../types';
import { DESK_OBJECTS } from '../wireframes';
import styles from '../sketchbook.module.css';

export { figureScript };

const UNDERLINE = [[[0, 5], [30, 7], [60, 4], [100, 6]] as [number, number][]];

export default function Desk({ progress, entering, active, boil, vw, seen }: PageProps) {
  const mobile = vw <= 780;
  const figW = mobile ? 56 : 78;
  const { objects, windows } = useMemo(() => {
    const arrivals = DESK_OBJECTS.map((_, i) => (mobile ? 0.12 + i * 0.14 : arrival(spotX(i, vw), vw, figW)));
    const objects: GroundObject[] = DESK_OBJECTS.map((o, i) => ({
      x: spotX(i, vw), strokes: o.strokes, start: arrivals[i] - 0.04, end: arrivals[i] + 0.04, cls: 'wire',
      until: mobile && i < DESK_OBJECTS.length - 1 ? arrivals[i + 1] - 0.04 : undefined,
    }));
    const ob = obstacle(vw);
    objects.unshift({ x: ob.x, strokes: ob.strokes, start: 0, end: 0.08, cls: 'rotunda' });
    const windows = arrivals.map(a => seq(UNDERLINE, a - 0.04, a + 0.04, undefined, 0.6));
    return { objects, windows };
  }, [vw, figW, mobile]);
  const { story, live, arrowStory, arrowLive } = HOME_COPY.desk.rowActions;
  const room = Math.ceil(leap(obstacle(vw))) + 4;
  return (
    <>
      <Stack progress={progress} room={room}>
        <div className={[styles.copy, copyOn(progress, seen, entering, vw) ? styles.on : ''].join(' ')} data-zone="copy">
          <span className={styles.micro}>{HOME_COPY.desk.label}</span>
          <ShadedHeading lines={[HOME_COPY.desk.heading]} progress={headOn(progress, entering, vw)} className={styles.deskHeading} />
          <div className={styles.originList}>
            {HOME_COPY.desk.rows.map((row, i) => {
              const title = <h3 className={styles.originTitle}>{row.liveHref ? <Link href={row.href}>{row.title}</Link> : row.title}<Sketch strokes={windows[i]} progress={progress} active={active} boil={boil} viewBox="0 0 100 10" preserveAspectRatio="none" className={styles.rowLine} strokeWidth={1.3} /></h3>;
              const body = (
                <>
                  <span className={styles.originNum}>{row.num}</span>
                  <div className={styles.originBody}>
                    {title}
                    <p className={styles.originWhat}>{row.what}</p>
                    <small>{row.meta}</small>
                    {row.liveHref ? <div className={styles.originActions}><Link href={row.href}>{story}</Link><a href={row.liveHref} target="_blank" rel="noreferrer">{live}</a></div> : null}
                  </div>
                  <span className={styles.originArrow}>{row.liveHref ? arrowLive : arrowStory}</span>
                </>
              );
              return row.liveHref
                ? <div key={row.title} className={styles.originRow}>{body}</div>
                : <Link key={row.title} className={styles.originRow} href={row.href}>{body}</Link>;
            })}
          </div>
        </div>
      </Stack>
      <Ground objects={objects} vw={vw} progress={progress} active={active} boil={boil} />
    </>
  );
}
