'use client';
import Image from 'next/image';
import { useMemo } from 'react';
import { HOME_COPY } from '../copy';
import Ground from '../Ground';
import { clamp, ease, endX, lerp } from '../pages';
import ProjectCopy from '../ProjectCopy';
import Reveal from '../Reveal';
import Stack from '../Stack';
import type { FigureScript, PageProps } from '../types';
import { MAGNIFIER, VIAL } from '../wireframes';
import styles from '../sketchbook.module.css';

/** He walks up to the vial, holds a magnifier over it while the screen is drawn, then crosses the page. */
export const figureScript: FigureScript = (p, vw, figW) => ({
  x: p < 0.5 ? lerp(vw * 0.04, vw * 0.3 - figW - 24, ease(clamp(p / 0.14))) : lerp(vw * 0.3 - figW - 24, endX(vw, figW), ease(clamp((p - 0.5) / 0.5))),
});

export default function Vial({ progress, entering, active, boil, vw, seen }: PageProps) {
  const figW = vw <= 780 ? 56 : 78;
  const fx = Math.round(figureScript(progress, vw, figW).x);
  const objects = useMemo(() => [
    { x: 0.3, strokes: VIAL, start: 0.05, end: 0.12, cls: 'wire' },
    { x: (fx + figW * 0.78) / vw, strokes: MAGNIFIER, start: 0.1, end: 0.16, cls: 'wire', until: 0.5 },
  ], [fx, figW, vw]);
  return (
    <>
      <Stack progress={progress}>
        <div className={styles.split}>
          <ProjectCopy project={HOME_COPY.projects.vialgrade} progress={progress} entering={entering} vw={vw} active={active} boil={boil} seen={seen} />
          <Reveal kind="vialgrade" progress={progress} active={active} boil={boil} media={<Image src="/vialgrade/home.jpg" alt="VialGrade homepage and search interface" fill sizes="(max-width: 780px) 92vw, 54vw" className={styles.mediaImg} />} />
        </div>
      </Stack>
      <Ground objects={objects} vw={vw} progress={progress} active={active} boil={boil} />
    </>
  );
}
