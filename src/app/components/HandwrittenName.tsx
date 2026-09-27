"use client";

import { useEffect, useRef, useState } from "react";

const strokes = [
  "M70 205 L70 65", "M70 65 L220 205", "M220 205 L220 65",
  "M270 205 L350 65", "M350 65 L430 205", "M305 150 L400 150",
  "M470 70 L650 70", "M560 70 L560 205",
  "M700 65 L700 205", "M700 65 L860 65", "M700 136 L820 136", "M700 205 L860 205",
  "M80 460 L80 295", "M80 300 C175 278 238 305 231 350 C224 392 155 404 80 382",
  "M300 295 L300 460", "M300 295 L465 295", "M300 375 L425 375", "M300 460 L465 460",
  "M720 330 C690 283 545 270 515 345 C485 420 545 468 625 463 C705 459 746 415 729 365", "M628 390 L732 390 L732 458",
  "M1000 330 C970 283 825 270 795 345 C765 420 825 468 905 463 C985 459 1026 415 1009 365", "M908 390 L1012 390 L1012 458",
  "M1015 458 C1055 500 1090 505 1135 520"
];

type Metrics = { lengths: number[]; starts: number[]; total: number };

export default function HandwrittenName() {
  const refs = useRef<Array<SVGPathElement | null>>([]);
  const [metrics, setMetrics] = useState<Metrics>({ lengths: [], starts: [], total: 1 });
  const [progress, setProgress] = useState(0);
  const [tip, setTip] = useState({ x: 70, y: 205, angle: -90 });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const lengths = refs.current.map((p) => p?.getTotalLength() ?? 0);
    let running = 0;
    const starts = lengths.map((len) => {
      const start = running;
      running += len + 18;
      return start;
    });
    const total = Math.max(1, running - 18);
    setMetrics({ lengths, starts, total });
  }, []);

  useEffect(() => {
    if (reduced || metrics.total <= 1) return;
    let raf = 0;
    const sync = () => {
      const p = Math.min(1, Math.max(0, (window.scrollY - 22) / (window.innerHeight * .88)));
      setProgress(p);
      const target = metrics.total * p;
      let active = strokes.length - 1;
      for (let i = 0; i < strokes.length; i += 1) {
        const start = metrics.starts[i] ?? 0;
        const len = metrics.lengths[i] ?? 0;
        if (target <= start + len + 18) { active = i; break; }
      }
      const path = refs.current[active];
      const start = metrics.starts[active] ?? 0;
      const len = metrics.lengths[active] ?? 0;
      if (path && len) {
        const local = Math.min(len, Math.max(0, target - start));
        const here = path.getPointAtLength(local);
        const next = path.getPointAtLength(Math.min(len, local + 3));
        const angle = Math.atan2(next.y - here.y, next.x - here.x) * 180 / Math.PI;
        setTip({ x: here.x, y: here.y, angle });
      }
      raf = 0;
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(sync); };
    sync();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [metrics, reduced]);

  const target = reduced ? metrics.total : metrics.total * progress;

  return (
    <div className="nameCanvas" aria-label="Nate Pegg">
      <svg viewBox="0 0 1200 560" role="img" aria-hidden="true">
        <defs>
          <filter id="graphiteRough" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.16" numOctaves="1" seed="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" />
          </filter>
        </defs>
        <g className="nameGhost" filter="url(#graphiteRough)">
          {strokes.map((d, i) => <path key={`g-${i}`} d={d} />)}
        </g>
        <g className="nameInk" filter="url(#graphiteRough)">
          {strokes.map((d, i) => {
            const len = metrics.lengths[i] || 1;
            const start = metrics.starts[i] || 0;
            const visible = reduced ? 1 : Math.min(1, Math.max(0, (target - start) / len));
            return <path key={i} ref={(el) => { refs.current[i] = el; }} d={d} style={{ strokeDasharray: len, strokeDashoffset: len * (1 - visible) }} />;
          })}
        </g>
        {!reduced && progress < .999 ? (
          <g className="heroPencil" transform={`translate(${tip.x} ${tip.y}) rotate(${tip.angle})`}>
            <path className="pencilWood" d="M0 0 L-16 -9 L-16 9 Z" />
            <path className="pencilGraphite" d="M0 0 L-6 -3.4 L-6 3.4 Z" />
            <rect className="pencilBody" x="-92" y="-9" width="76" height="18" rx="2" />
            <path className="pencilEdge" d="M-92 -2 L-16 -2" />
            <rect className="pencilFerrule" x="-108" y="-9" width="16" height="18" />
            <rect className="pencilEraser" x="-128" y="-9" width="20" height="18" rx="5" />
          </g>
        ) : null}
      </svg>
      <span className="nameHint">scroll and I&apos;ll draw it</span>
    </div>
  );
}
