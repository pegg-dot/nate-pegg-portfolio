'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { HOME_COPY } from '../copy';
import Ground from '../Ground';
import { clamp, ease, endX, lerp } from '../pages';
import ProjectCopy from '../ProjectCopy';
import Reveal from '../Reveal';
import Stack from '../Stack';
import type { FigureScript, PageProps } from '../types';
import { DESK_PHONE, RING } from '../wireframes';
import styles from '../sketchbook.module.css';

/** He walks up to the phone, waits while it rings, then crosses the page once the screen is real. */
export const figureScript: FigureScript = (p, vw, figW) => ({
  x: p < 0.5 ? lerp(vw * 0.04, vw * 0.3 - figW - 30, ease(clamp(p / 0.14))) : lerp(vw * 0.3 - figW - 30, endX(vw, figW), ease(clamp((p - 0.5) / 0.5))),
});

const OBJECTS = [
  { x: 0.3, strokes: DESK_PHONE, start: 0.05, end: 0.14, cls: 'wire' },
  { x: 0.3, strokes: RING, start: 0.14, end: 0.17, cls: 'ring', until: 0.3, blink: true },
];

/**
 * The concept demo plays over the real workspace screenshot; if it cannot play, the screenshot stays.
 * Nate, 2026-11-06: it starts from the beginning once the real screen is up, not in the background while the
 * sketch is being drawn (a reader used to arrive at a clip already half over). It stops and rewinds once the
 * reader has moved on, so coming back starts it again. Under reduced motion it never starts by itself.
 */
function DellaMedia({ progress, active, reduced }: { progress: number; active: boolean; reduced: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  // Hidden until it is actually playing, so a blocked start never covers the real screen with a frozen first frame.
  const [playing, setPlaying] = useState(false);
  const late = clamp((progress - 0.88) / 0.1);
  const armed = !reduced && active && progress >= 0.88;
  const parked = !active || progress < 0.6;
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (armed) { if (v.paused) { v.currentTime = 0; v.play().catch(() => { /* the screenshot stays */ }); } }
    else if (parked && !v.paused) { v.pause(); v.currentTime = 0; }
  }, [armed, parked]);
  return (
    <>
      <Image src="/della/room-identity.png" alt="Della workspace showing the AI employee's permissions, activity and state" fill sizes="(max-width: 780px) 92vw, 54vw" data-fallback="" className={styles.mediaImg} />
      <video ref={ref} className={styles.mediaVideo} src="/della/della-promo-home.mp4" muted loop playsInline controls preload="metadata" aria-label="Della product demo" onPause={() => setPlaying(false)} onPlaying={() => setPlaying(true)} style={{ opacity: playing || reduced ? late : 0 }} />
    </>
  );
}

export default function Della({ progress, entering, active, boil, vw, seen, reduced }: PageProps) {
  return (
    <>
      <Stack progress={progress}>
        <div className={styles.split}>
          <ProjectCopy project={HOME_COPY.projects.della} progress={progress} entering={entering} vw={vw} active={active} boil={boil} seen={seen} />
          <Reveal kind="della" progress={progress} active={active} boil={boil} media={<DellaMedia progress={progress} active={active} reduced={reduced} />} />
        </div>
      </Stack>
      <Ground objects={OBJECTS} vw={vw} progress={progress} active={active} boil={boil} />
    </>
  );
}
