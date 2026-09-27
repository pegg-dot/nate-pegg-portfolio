"use client";

import { useEffect, useRef, useState } from "react";

const strokes = [
  // N
  "M92 72 C90 116 92 166 94 216",
  "M94 74 C126 116 158 168 198 216",
  "M198 74 C200 116 200 167 202 216",
  // A
  "M250 216 C274 166 302 112 334 72",
  "M334 72 C366 112 394 166 424 216",
  "M280 162 C316 156 356 156 394 160",
  // T
  "M462 76 C510 72 555 73 604 76",
  "M534 76 C532 122 533 169 535 216",
  // E
  "M650 76 C648 120 649 170 651 216",
  "M651 76 C690 73 724 74 758 77",
  "M651 145 C682 142 712 143 738 146",
  "M651 216 C689 213 726 214 764 217",
  // P
  "M92 292 C90 342 91 394 94 454",
  "M94 294 C132 287 178 291 188 323 C198 356 157 372 95 365",
  // E
  "M246 294 C244 338 245 397 247 454",
  "M247 294 C283 291 317 292 350 295",
  "M247 369 C278 366 309 367 335 370",
  "M247 454 C283 451 320 452 357 455",
  // G
  "M493 322 C470 287 408 284 384 332 C359 381 384 447 443 458 C492 467 532 432 526 386",
  "M526 386 C501 386 479 388 459 392",
  // G
  "M682 322 C659 287 597 284 573 332 C548 381 573 447 632 458 C681 467 721 432 715 386",
  "M715 386 C690 386 668 388 648 392",
];

type Point = { x: number; y: number };
type Metrics = {
  lengths: number[];
  starts: number[];
  travels: number[];
  total: number;
  strokeStarts: Point[];
  strokeEnds: Point[];
};

export default function HandwrittenName() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const refs = useRef<Array<SVGPathElement | null>>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    lengths: [],
    starts: [],
    travels: [],
    total: 1,
    strokeStarts: [],
    strokeEnds: [],
  });
  const [progress, setProgress] = useState(0);
  const [tip, setTip] = useState({ x: 92, y: 72, angle: 90 });
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
    const strokeStarts = refs.current.map((p) => p?.getPointAtLength(0) ?? { x: 0, y: 0 });
    const strokeEnds = refs.current.map((p, i) => p?.getPointAtLength(lengths[i] ?? 0) ?? { x: 0, y: 0 });
    const travels = lengths.map((_, i) => {
      const from = strokeEnds[i];
      const to = strokeStarts[i + 1];
      if (!from || !to) return 0;
      const distance = Math.hypot(to.x - from.x, to.y - from.y);
      return Math.min(78, Math.max(22, distance * .46));
    });

    let running = 0;
    const starts = lengths.map((len, i) => {
      const start = running;
      running += len + (travels[i] ?? 0);
      return start;
    });

    setMetrics({
      lengths,
      starts,
      travels,
      total: Math.max(1, running - (travels[travels.length - 1] ?? 0)),
      strokeStarts,
      strokeEnds,
    });
  }, []);

  useEffect(() => {
    if (reduced || metrics.total <= 1) return;
    let raf = 0;

    const sync = () => {
      const hero = canvasRef.current?.closest<HTMLElement>(".hero");
      if (!hero) return;

      const range = Math.max(1, hero.offsetHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, (window.scrollY - hero.offsetTop) / range));
      setProgress(p);

      const target = metrics.total * p;
      let index = strokes.length - 1;
      for (let i = 0; i < strokes.length; i += 1) {
        const start = metrics.starts[i] ?? 0;
        const len = metrics.lengths[i] ?? 0;
        const travel = metrics.travels[i] ?? 0;
        if (target <= start + len + travel) {
          index = i;
          break;
        }
      }

      const path = refs.current[index];
      const start = metrics.starts[index] ?? 0;
      const len = metrics.lengths[index] ?? 0;
      const travel = metrics.travels[index] ?? 0;
      const local = target - start;

      if (path && local <= len) {
        const here = path.getPointAtLength(Math.max(0, local));
        const ahead = path.getPointAtLength(Math.min(len, Math.max(0, local) + 4));
        const angle = Math.atan2(ahead.y - here.y, ahead.x - here.x) * 180 / Math.PI;
        setTip({ x: here.x, y: here.y, angle });
      } else {
        const from = metrics.strokeEnds[index];
        const to = metrics.strokeStarts[index + 1];
        if (from && to && travel > 0) {
          const t = Math.min(1, Math.max(0, (local - len) / travel));
          const eased = t * t * (3 - 2 * t);
          const x = from.x + (to.x - from.x) * eased;
          const y = from.y + (to.y - from.y) * eased;
          const angle = Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI;
          setTip({ x, y, angle });
        }
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
    <div ref={canvasRef} className="nameCanvas" aria-label="Nate Pegg">
      <svg viewBox="0 0 860 525" role="img" aria-hidden="true">
        <defs>
          <filter id="graphiteRough" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.014 0.09" numOctaves="1" seed="8" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.05" />
          </filter>
        </defs>

        <g className="nameInk" filter="url(#graphiteRough)">
          {strokes.map((d, i) => {
            const len = metrics.lengths[i] || 1;
            const start = metrics.starts[i] || 0;
            const visible = reduced ? 1 : Math.min(1, Math.max(0, (target - start) / len));
            return (
              <path
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                d={d}
                style={{ strokeDasharray: len, strokeDashoffset: len * (1 - visible) }}
              />
            );
          })}
        </g>

        {!reduced && progress < .999 ? (
          <g className="heroPencil" transform={`translate(${tip.x} ${tip.y}) rotate(${tip.angle})`}>
            <path className="pencilWood" d="M0 0 L-15 -8 L-15 8 Z" />
            <path className="pencilGraphite" d="M0 0 L-5.5 -3 L-5.5 3 Z" />
            <rect className="pencilBody" x="-92" y="-8" width="77" height="16" rx="2" />
            <path className="pencilEdge" d="M-92 -2 L-15 -2" />
            <rect className="pencilFerrule" x="-108" y="-8" width="16" height="16" />
            <rect className="pencilEraser" x="-128" y="-8" width="20" height="16" rx="5" />
          </g>
        ) : null}
      </svg>
      <span className="nameHint">{progress < .98 ? "keep scrolling — I am writing it" : "made by hand, then code"}</span>
    </div>
  );
}
