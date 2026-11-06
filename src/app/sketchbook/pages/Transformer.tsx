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
import { tokenBlock } from '../wireframes';
import styles from '../sketchbook.module.css';

const BLOCKS = [0.1, 0.19, 0.28, 0.37, 0.46, 0.55];
const blockH = (vw: number) => (vw <= 780 ? 20 : 40);

/** Six blocks on the ground; he climbs onto the first and walks the row while the attention screen is drawn. */
export const figureScript: FigureScript = (p, vw, figW) => {
  const BLOCK_H = blockH(vw);
  const first = BLOCKS[0] * vw - figW / 2, last = BLOCKS[5] * vw - figW / 2;
  if (p < 0.08) return { x: lerp(vw * 0.02, first, ease(p / 0.08)) };
  if (p < 0.5) return { x: first, lift: -BLOCK_H * ease(clamp((p - 0.08) / 0.04)) };
  if (p < 0.8) return { x: lerp(first, last, ease((p - 0.5) / 0.3)), lift: -BLOCK_H };
  const down = ease(clamp((p - 0.8) / 0.08));
  return { x: lerp(last, endX(vw, figW), ease(clamp((p - 0.8) / 0.2))), lift: -BLOCK_H * (1 - down) };
};


export default function Transformer({ progress, entering, active, boil, vw, seen }: PageProps) {
  const h = blockH(vw);
  const objects = useMemo(() => { const block = tokenBlock(h); return BLOCKS.map((x, i) => ({ x, strokes: block, start: 0.02 + i * 0.01, end: 0.07 + i * 0.01, cls: 'wire' })); }, [h]);
  return (
    <>
      <Stack progress={progress}>
        <div className={styles.split}>
          <ProjectCopy project={HOME_COPY.projects.transformer} progress={progress} entering={entering} vw={vw} active={active} boil={boil} seen={seen} />
          <Reveal kind="transformer" progress={progress} active={active} boil={boil} media={<Image src="/transformer/qkv.webp" alt="Transformer visualizer showing query, key and value projections" fill sizes="(max-width: 780px) 92vw, 54vw" className={styles.mediaImg} />} />
        </div>
      </Stack>
      <Ground objects={objects} vw={vw} progress={progress} active={active} boil={boil} />
    </>
  );
}
