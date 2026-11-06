'use client';
import { Fragment, useEffect, useRef } from 'react';
import rough from 'roughjs';
import { HOME_COPY } from './copy';
import styles from './sketchbook.module.css';

/** Little Nate's thought bubble on the cover: what he is working on right now, each a link. */
export default function Bubble({ shown, x, y }: { shown: boolean; x: number; y: number }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    const host = svg?.parentElement;
    if (!svg || !host) return;
    const draw = () => {
      const w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      const r = rough.svg(svg);
      const frag = document.createDocumentFragment();
      frag.appendChild(r.ellipse(w / 2 + 12, h / 2, w - 38, h - 8, { roughness: 1.5, bowing: 2, stroke: '#2a2924', strokeWidth: 1.6, fill: '#f3efe3', fillStyle: 'solid', seed: 11 }));
      frag.appendChild(r.circle(21, h / 2 + 4, 14, { roughness: 1.3, stroke: '#2a2924', strokeWidth: 1.4, fill: '#f3efe3', fillStyle: 'solid', seed: 12 }));
      frag.appendChild(r.circle(7, h / 2 + 14, 8, { roughness: 1.3, stroke: '#2a2924', strokeWidth: 1.3, fill: '#f3efe3', fillStyle: 'solid', seed: 13 }));
      svg.replaceChildren(frag);
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);
  return (
    <div className={[styles.bubble, shown ? styles.bubbleOn : ''].join(' ')} data-zone="bubble" inert={!shown} aria-hidden={!shown} style={{ left: x, top: y }}>
      <svg ref={ref} aria-hidden="true" />
      <div className={styles.bubbleText}>
        <span>RIGHT NOW: {HOME_COPY.rightNowLinks.map((l, i) => <Fragment key={l.href}>{i > 0 ? ' · ' : ''}<a href={l.href}>{l.label}</a></Fragment>)}</span>
      </div>
    </div>
  );
}
