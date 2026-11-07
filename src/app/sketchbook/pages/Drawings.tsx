'use client';
import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { HOME_COPY } from '../copy';
import Outline from '../Outline';
import { startOf, topAt } from '../drawings';
import { clamp, copyOn, ease, headOn, lerp } from '../pages';
import { RoughBox, RoughTape } from '../Rough';
import ShadedHeading from '../ShadedHeading';
import Stack from '../Stack';
import type { FigureScript, PageProps } from '../types';
import styles from '../sketchbook.module.css';

type Traced = { w: number; h: number; paths: string[] };
const NAMES = ['bob-marley', 'dog-scarf', 'house', 'moose', 'coke-can', 'miami'];
const TILT = [-2.5, 1.5, -1, 2, -1.5, 1];
/** Each drawing's slot (see drawings.ts): the outline over .035, the photo from .03 over .03, the outline gone by .075, then it holds on top until the next starts. */
const ASPECT: Record<string, number> = { 'bob-marley': 800 / 1058, 'dog-scarf': 3 / 4, house: 800 / 621, moose: 3 / 4, 'coke-can': 800 / 1281, miami: 3 / 4 };

/** He walks to the left side of the desk, sits down and draws; the pile of finished drawings grows beside him. */
export const figureScript: FigureScript = (p, vw) => (p < 0.3 ? { x: lerp(vw * 0.04, vw * 0.16, ease(p / 0.3)) } : { x: vw * 0.16, pose: 'sit' });

export default function Drawings({ progress, vw, entering, active, seen }: PageProps) {
  const [traced, setTraced] = useState<Record<string, Traced>>({});
  // Pieces are sized from the measured pile box: engines disagree on aspect-ratio boxes under max-height.
  const pileRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const el = pileRef.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    if (!active || Object.keys(traced).length) return;
    let gone = false;
    Promise.all(NAMES.map(n => fetch(`/art/traced/${n}.json`).then(r => r.json() as Promise<Traced>)))
      .then(all => { if (!gone) setTraced(Object.fromEntries(NAMES.map((n, i) => [n, all[i]]))); })
      .catch(() => {});
    return () => { gone = true; };
  }, [active, traced]);
  const top = topAt(progress);
  const zoom = 0.74 + 0.26 * ease(clamp((progress - 0.3) / 0.3));
  const d = HOME_COPY.drawings;
  const cut = d.p2.indexOf(d.igHandle);
  return (
    <Stack progress={progress}>
      <div className={styles.split}>
        <div className={[styles.copy, copyOn(progress, seen, entering, vw) ? styles.on : ''].join(' ')} data-zone="copy">
          <ShadedHeading lines={[d.heading]} progress={headOn(progress, entering, vw)} />
          <p>{d.p1}</p>
          <p>{d.p2.slice(0, cut)}<a href={d.igHref} target="_blank" rel="noreferrer">{d.igHandle}</a>{d.p2.slice(cut + d.igHandle.length)}</p>
        </div>
        <div ref={pileRef} className={styles.pile} style={{ transform: `scale(${zoom.toFixed(3)})` }}>
          {d.pieces.map((piece, i) => {
            const name = NAMES[i];
            const s = startOf(i);
            const outline = clamp((progress - s) / 0.035);
            const photo = clamp((progress - s - 0.03) / 0.03);
            const shown = i <= top;
            const depth = Math.max(0, top - i);
            const ratio = ASPECT[name];
            const h = box ? Math.min(box.h * 0.76, (box.w * 0.76) / ratio) : 0;
            const size: CSSProperties = box ? { width: h * ratio, height: h, left: (box.w - h * ratio) / 2, right: 'auto' } : { aspectRatio: String(ratio) };
            const style: CSSProperties = { ...size, zIndex: i + 1, opacity: shown ? 1 - Math.min(0.5, depth * 0.12) : 0, transform: `translate(${(-6 * Math.min(depth, 3)).toFixed(0)}px, ${(-6 * Math.min(depth, 3)).toFixed(0)}px) rotate(${TILT[i]}deg)` };
            const t = traced[name];
            return (
              <figure key={name} className={styles.piece} style={style} data-piece={name}>
                <div className={styles.pieceFrame} data-zone="canvas">
                  <RoughBox seed={500 + i} fill="#faf7ef" />
                  <div className={styles.media} data-media="" style={{ opacity: photo.toFixed(3) }}>
                    <Image src={piece.src} alt={piece.alt} fill sizes="(max-width: 780px) 80vw, 36vw" className={styles.pieceImg} />
                  </div>
                  {t ? <Outline paths={t.paths} w={t.w} h={t.h} progress={outline} style={{ opacity: 1 - clamp((progress - s - 0.06) / 0.015) }} /> : null}
                  <RoughTape seed={520 + i} corner="tl" />
                  <RoughTape seed={540 + i} corner="br" />
                </div>
                <figcaption className={[styles.caption, i === top && shown ? styles.on : ''].join(' ')} data-zone="caption">{piece.caption}</figcaption>
                {piece.note ? <span className={[styles.pencilNote, i === top && shown ? styles.on : ''].join(' ')} aria-hidden="true">{piece.note}</span> : null}
              </figure>
            );
          })}
        </div>
      </div>
    </Stack>
  );
}
