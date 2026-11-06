'use client';
import Image from 'next/image';
import { useState } from 'react';
import { HOME_COPY } from '../copy';
import Ground from '../Ground';
import { clamp, ease, lerp } from '../pages';
import ProjectCopy from '../ProjectCopy';
import Reveal from '../Reveal';
import type { FigureScript, PageProps } from '../types';
import { DESK_PHONE, RING } from '../wireframes';
import styles from '../sketchbook.module.css';

/** He walks up to the phone, waits while it rings, then crosses the page once the screen is real. */
export const figureScript: FigureScript = (p, vw, figW) => ({
  x: p < 0.5 ? lerp(vw * 0.04, vw * 0.3 - figW - 30, ease(clamp(p / 0.14))) : lerp(vw * 0.3 - figW - 30, vw * 0.9 - figW, ease(clamp((p - 0.5) / 0.5))),
});

const OBJECTS = [
  { x: 0.3, strokes: DESK_PHONE, start: 0.05, end: 0.14, cls: 'wire' },
  { x: 0.3, strokes: RING, start: 0.14, end: 0.17, cls: 'ring', until: 0.3, blink: true },
];

/** The concept demo plays over the real workspace screenshot; if it cannot play, the screenshot stays. */
function DellaMedia({ progress }: { progress: number }) {
  const [paused, setPaused] = useState(false);
  const late = clamp((progress - 0.88) / 0.1);
  return (
    <>
      <Image src="/della/room-identity.png" alt="Della workspace showing the AI employee's permissions, activity and state" fill sizes="(max-width: 780px) 92vw, 54vw" data-fallback="" className={styles.mediaImg} />
      <video className={styles.mediaVideo} src="/della/della-promo-home.mp4" autoPlay muted loop playsInline preload="metadata" aria-label="Della concept demo showing how the product could work" onPause={() => setPaused(true)} onPlaying={() => setPaused(false)} style={{ opacity: paused ? 0 : late }} />
    </>
  );
}

export default function Della({ progress, active, boil, vw }: PageProps & { vw: number }) {
  return (
    <>
      <div className={styles.split}>
        <ProjectCopy project={HOME_COPY.projects.della} progress={progress} active={active} boil={boil} />
        <Reveal kind="della" progress={progress} active={active} boil={boil} media={<DellaMedia progress={progress} />} />
      </div>
      <Ground objects={OBJECTS} vw={vw} progress={progress} active={active} boil={boil} />
    </>
  );
}
