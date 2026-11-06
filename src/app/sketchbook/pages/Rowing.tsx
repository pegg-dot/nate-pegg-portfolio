'use client';
import Image from 'next/image';
import RowingSketch from '../../components/RowingSketch';
import { HOME_COPY } from '../copy';
import { copyOn, headOn } from '../pages';
import { RoughBox, RoughTape } from '../Rough';
import ShadedHeading from '../ShadedHeading';
import Stack from '../Stack';
import type { FigureScript, PageProps } from '../types';
import styles from '../sketchbook.module.css';

/** He is in the boat on this page, so the walking figure stays hidden. */
export const figureScript: FigureScript = (p, vw, figW) => ({ x: vw * 0.5 - figW / 2, hidden: true });

/** Nate rows bow: the seat nearer the bow, the end the boat moves toward (the hull travels +x, so the right-hand seat). */
const me = (
  <g data-rower="" aria-hidden="true">
    <text className="pencilNote" x="214" y="58" transform="rotate(6 214 58)">me</text>
    <path d="M216 63 C213 72 208 81 202 88 M199 79 L202 89 L212 87" fill="none" stroke="#514b3f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

export default function Rowing({ progress, vw, entering, seen }: PageProps) {
  const r = HOME_COPY.rowing;
  const cut = r.p2.indexOf(r.la28Text);
  return (
    <>
      <Stack progress={progress}>
        <div className={styles.split}>
          <div className={[styles.copy, copyOn(progress, seen, entering, vw) ? styles.on : ''].join(' ')} data-zone="copy">
            <ShadedHeading lines={[r.heading]} progress={headOn(progress, entering, vw)} />
            <p>{r.p1}</p>
            <p>{r.p2.slice(0, cut)}<a href={r.la28Href} target="_blank" rel="noreferrer">{r.la28Text}</a></p>
          </div>
          <div className={styles.prints}>
            {r.photos.map((ph, i) => (
              <figure key={ph.src} className={styles.print} data-zone="canvas" style={{ opacity: progress > 0.08 + i * 0.1 ? 1 : 0, transform: `rotate(${i ? 1.5 : -2}deg)` }}>
                <RoughBox seed={600 + i} fill="#faf7ef" />
                <div className={styles.printImg}><Image src={ph.src} alt={ph.alt} fill sizes="(max-width: 780px) 46vw, 26vw" className={styles.mediaImg} /></div>
                <RoughTape seed={620 + i} corner={i ? 'tr' : 'tl'} />
                <RoughTape seed={640 + i} corner={i ? 'bl' : 'br'} />
              </figure>
            ))}
          </div>
        </div>
      </Stack>
      <div className={styles.water} aria-hidden="true"><RowingSketch progress={progress} rower={me} /></div>
    </>
  );
}
