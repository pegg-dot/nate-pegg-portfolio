"use client";

import { useEffect, useRef, useState } from "react";

const GAP = 42;

// One path per natural pen stroke instead of one path per straight segment.
// The pencil also travels through the air between strokes, so it never teleports.
const strokes = [
  "M92 220 C90 176 90 124 94 80 C125 122 157 171 194 220 C198 176 200 126 204 82",
  "M254 220 C278 166 305 112 334 80 C365 125 393 172 422 220",
  "M282 161 C320 154 360 154 395 160",
  "M492 82 C490 126 490 177 492 220",
  "M447 84 C488 80 532 80 575 84",
  "M652 82 C620 84 605 90 605 106 C606 126 638 133 684 133 C647 134 610 139 608 157 C606 178 644 188 696 188 C664 189 625 196 608 218 C646 219 684 220 723 218",
  "M95 460 C94 410 94 354 98 298 C157 292 211 306 213 343 C216 384 158 398 99 389",
  "M290 298 C258 300 244 307 244 323 C245 343 279 350 324 350 C286 352 250 357 248 375 C247 397 284 407 336 407 C302 410 263 418 247 457 C285 459 324 460 364 458",
  "M515 340 C494 305 430 291 397 323 C366 354 377 422 425 448 C467 472 523 449 535 408 C539 394 537 381 531 369 C512 368 489 369 467 371",
  "M728 340 C707 305 643 291 610 323 C579 354 590 422 638 448 C680 472 736 449 748 408 C752 394 750 381 744 369 C724 368 702 369 680 371",
  "M744 407 C775 431 803 452 837 470"
];

type Metrics = {
  lengths: number[];
  starts: number[];
  total: number;
  strokeStarts: { x: number; y: number }[];
  strokeEnds: { x: number; y: number }[];
};

export default function HandwrittenName() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const refs = useRef<Array<SVGPathElement | null>>([]);
  const [metrics, setMetrics] = useState<Metrics>({ lengths: [], starts: [], total: 1, strokeStarts: [], strokeEnds: [] });
  const [progress, setProgress] = useState(0);
  const [tip, setTip] = useState({ x: 92, y: 220, angle: -90 });
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
    let running = 0;
    const starts = lengths.map((len) => {
      const start = running;
      running += len + GAP;
      return start;
    });
    setMetrics({
      lengths,
      starts,
      total: Math.max(1, running - GAP),
      strokeStarts,
      strokeEnds
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
        if (target <= start + len + GAP) {
          index = i;
          break;
        }
      }

      const path = refs.current[index];
      const start = metrics.starts[index] ?? 0;
      const len = metrics.lengths[index] ?? 0;
      const local = target - start;

      if (path && local <= len) {
        const here = path.getPointAtLength(Math.max(0, local));
        const ahead = path.getPointAtLength(Math.min(len, Math.max(0, local) + 4));
        const angle = Math.atan2(ahead.y - here.y, ahead.x - here.x) * 180 / Math.PI;
        setTip({ x: here.x, y: here.y, angle });
      } else {
        const from = metrics.strokeEnds[index];
        const to = metrics.strokeStarts[index + 1];
        if (from && to) {
          const t = Math.min(1, Math.max(0, (local - len) / GAP));
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
      <svg viewBox="0 0 900 540" role="img" aria-hidden="true">
        <defs>
          <filter id="graphiteRough" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.016 0.11" numOctaves="1" seed="8" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.15" />
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
      <span className="nameHint">{progress < .98 ? "keep scrolling — the pencil stays with you" : "made by hand, then code"}</span>
    </div>
  );
}
