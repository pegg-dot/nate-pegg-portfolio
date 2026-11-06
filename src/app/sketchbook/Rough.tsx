'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import rough from 'roughjs';
import styles from './sketchbook.module.css';

const INK = 'currentColor';

/** A hand-boxed outline drawn behind its siblings. The parent must be position: relative. */
export function RoughBox({ seed, fill, children }: { seed: number; fill?: string; children?: ReactNode }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    const host = svg?.parentElement;
    if (!svg || !host) return;
    const draw = () => {
      const w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      svg.setAttribute('viewBox', `-4 -4 ${w + 8} ${h + 8}`);
      svg.replaceChildren(rough.svg(svg).rectangle(0, 0, w, h, { roughness: 1.6, bowing: 1.4, stroke: INK, strokeWidth: 1.5, seed, fill, fillStyle: fill ? 'solid' : undefined }));
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(host);
    return () => ro.disconnect();
  }, [seed, fill]);
  return <><svg ref={ref} className={styles.roughBox} aria-hidden="true" />{children}</>;
}

/** Two short strips of masking tape across a corner. */
export function RoughTape({ seed, corner }: { seed: number; corner: 'tl' | 'tr' | 'bl' | 'br' }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const r = rough.svg(svg);
    const flipX = corner.endsWith('r') ? -1 : 1, flipY = corner.startsWith('b') ? -1 : 1;
    const pt = (x: number, y: number): [number, number] => [24 + flipX * (x - 24), 24 + flipY * (y - 24)];
    const a = r.polygon([pt(2, 30), pt(30, 2), pt(38, 10), pt(10, 38)], { roughness: 1.2, stroke: INK, strokeWidth: 1.1, fill: 'rgba(230,223,207,.9)', fillStyle: 'solid', seed });
    svg.replaceChildren(a);
  }, [seed, corner]);
  return <svg ref={ref} viewBox="0 0 48 48" className={`${styles.tape} ${styles['tape_' + corner]}`} aria-hidden="true" />;
}
