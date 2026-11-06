'use client';
import Link from 'next/link';
import { useMemo } from 'react';
import { HOME_COPY } from '../copy';
import Ground, { type GroundObject } from '../Ground';
import { clamp, endX, lerp } from '../pages';
import { seq } from '../pencil';
import ShadedHeading from '../ShadedHeading';
import Sketch from '../Sketch';
import Stack from '../Stack';
import type { FigureScript, PageProps } from '../types';
import { DESK_OBJECTS, MUG } from '../wireframes';
import styles from '../sketchbook.module.css';

const SPOTS = [0.12, 0.24, 0.36, 0.52, 0.66, 0.8];
const MUG_X = 0.42;
const P0 = 0.05, P1 = 0.95;
const UNDERLINE = [[[0, 5], [30, 7], [60, 4], [100, 6]] as [number, number][]];

/** A linear walk across the desk, so each object draws exactly as he reaches it. */
const walkX = (p: number, vw: number, figW: number) => lerp(vw * 0.04, endX(vw, figW), clamp((p - P0) / (P1 - P0)));
/** The progress at which his centre reaches a spot (as a fraction of the width). */
function arrival(spot: number, vw: number, figW: number) {
  const x0 = vw * 0.04, x1 = endX(vw, figW);
  return P0 + (P1 - P0) * clamp((spot * vw - figW / 2 - x0) / (x1 - x0));
}

export const figureScript: FigureScript = (p, vw, figW) => {
  const x = walkX(p, vw, figW);
  const cx = x + figW / 2;
  const a = (MUG_X - 0.03) * vw, b = (MUG_X + 0.03) * vw;
  if (cx >= a && cx <= b) return { x, pose: 'hop', lift: -56 * Math.sin(Math.PI * ((cx - a) / (b - a))) };
  return { x };
};

export default function Desk({ progress, active, boil, vw }: PageProps) {
  const mobile = vw <= 780;
  const figW = mobile ? 56 : 78;
  const { objects, windows } = useMemo(() => {
    const arrivals = DESK_OBJECTS.map((_, i) => (mobile ? 0.12 + i * 0.14 : arrival(SPOTS[i], vw, figW)));
    const objects: GroundObject[] = DESK_OBJECTS.map((o, i) => ({
      x: mobile ? 0.68 : SPOTS[i], strokes: o.strokes, start: arrivals[i] - 0.04, end: arrivals[i] + 0.04, cls: 'wire',
      until: mobile && i < DESK_OBJECTS.length - 1 ? arrivals[i + 1] - 0.04 : undefined,
    }));
    objects.unshift({ x: MUG_X, strokes: MUG, start: 0, end: 0.05, cls: 'mug' });
    const windows = arrivals.map(a => seq(UNDERLINE, a - 0.04, a + 0.04, undefined, 0.6));
    return { objects, windows };
  }, [vw, figW, mobile]);
  const { story, live, arrowStory, arrowLive } = HOME_COPY.desk.rowActions;
  return (
    <>
      <Stack progress={progress}>
        <div className={[styles.copy, progress > 0.06 ? styles.on : ''].join(' ')} data-zone="copy">
          <span className={styles.micro}>{HOME_COPY.desk.label}</span>
          <ShadedHeading lines={[HOME_COPY.desk.heading]} progress={clamp((progress - 0.02) / 0.25)} className={styles.deskHeading} />
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
