'use client';
import Image from 'next/image';
import { useMemo } from 'react';
import { HOME_COPY } from '../copy';
import Ground from '../Ground';
import ProjectCopy from '../ProjectCopy';
import Reveal from '../Reveal';
import Stack from '../Stack';
import type { PageProps } from '../types';
import { figureScript, INSPECT, vialScene } from '../vial';
import styles from '../sketchbook.module.css';

export { figureScript };

export default function Vial({ progress, entering, active, boil, vw, seen }: PageProps) {
  const figW = vw <= 780 ? 56 : 78;
  // The bottle, the magnifier he raises over it, and a check in the lens once the real screen is up.
  const objects = useMemo(() => {
    const o = vialScene(vw, figW);
    return [
      { x: o.vialX, strokes: o.vial, start: 0.05, end: 0.12, cls: 'vial' },
      { x: o.lens.x, strokes: o.lens.strokes, start: INSPECT[0], end: INSPECT[0] + 0.06, cls: 'lens', until: INSPECT[1] },
      { x: o.check.x, strokes: o.check.strokes, start: 0.4, end: 0.46, cls: 'lens', until: INSPECT[1] },
    ];
  }, [figW, vw]);
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
