'use client';
import { useEffect, useRef } from 'react';
import rough from 'roughjs';
import styles from './sketchbook.module.css';

/** The spiral binding along the top edge, like the pad the Miami drawing lives on. */
export default function Binding() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const draw = () => {
      const w = window.innerWidth;
      svg.setAttribute('viewBox', `0 0 ${w} 38`);
      const r = rough.svg(svg);
      const frag = document.createDocumentFragment();
      for (let x = 30, i = 0; x < w - 10; x += 38, i++) {
        frag.appendChild(r.ellipse(x, 30, 12, 10, { roughness: 1.1, stroke: '#2a2924', strokeWidth: 1.1, fill: '#e6dfcf', fillStyle: 'solid', seed: 10 + i }));
        frag.appendChild(r.ellipse(x, 10, 9, 22, { roughness: 1.4, stroke: '#2a2924', strokeWidth: 1.6, seed: 50 + i }));
      }
      svg.replaceChildren(frag);
    };
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, []);
  return <div className={styles.binding} aria-hidden="true"><svg ref={ref} /></div>;
}
