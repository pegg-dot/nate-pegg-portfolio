'use client';
import { Fragment } from 'react';
import { HOME_COPY } from '../copy';
import NameCover from '../NameCover';
import { clamp, ease, endX, lerp } from '../pages';
import type { FigureScript, PageProps } from '../types';
import styles from '../sketchbook.module.css';

/** He is drawn under the name at centre, looks up at it, then walks off to the right as the page turns. */
export const figureScript: FigureScript = (p, vw, figW) => ({ x: lerp(vw / 2 - figW / 2, endX(vw, figW), ease(clamp((p - 0.15) / 0.85))) });

export default function Cover({ clock, boil }: PageProps) {
  const on = clock > 0.9;
  return (
    <>
      <span className={styles.chrome} aria-hidden="true">{HOME_COPY.chrome[0]}</span>
      <div className={styles.nameWrap}><NameCover clock={clamp(clock / 0.74)} boil={boil} /></div>
      <div id="intro" className={[styles.intro, styles.copy, on ? styles.on : ''].join(' ')} data-zone="copy">
        <p>{HOME_COPY.intro}</p>
        <p className={styles.rightNowInline}>RIGHT NOW: {HOME_COPY.rightNowLinks.map((l, i) => <Fragment key={l.href}>{i > 0 ? ' · ' : ''}<a href={l.href}>{l.label}</a></Fragment>)}</p>
      </div>
    </>
  );
}
