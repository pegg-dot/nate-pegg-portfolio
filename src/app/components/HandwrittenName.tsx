"use client";

import { useEffect, useRef, useState } from "react";

const strokes = [
  // "Nate" as one continuous handwriting stroke.
  "M104 218 C96 179 97 112 111 78 C118 61 128 65 130 88 C134 126 123 176 110 214 C136 180 169 126 198 86 C208 72 215 77 214 99 C212 135 205 178 208 204 C210 221 226 217 239 198 C250 180 257 164 274 163 C290 161 297 174 291 190 C285 207 268 217 254 209 C241 202 243 183 258 173 C274 162 290 173 291 192 C291 208 295 218 306 217 C321 216 330 197 336 179 C343 157 347 129 350 101 C352 83 359 82 361 98 C364 126 354 164 347 187 C341 207 345 218 359 217 C372 216 380 202 388 187 C396 173 409 168 419 174 C429 180 424 191 411 197 C399 202 386 200 382 197 C384 212 395 219 411 217 C425 215 437 207 449 195 C458 186 466 183 474 184",
  // Cross the t after finishing the word, like a real writer coming back.
  "M323 145 C338 142 354 141 371 143",
  // "Pegg" as one continuous handwriting stroke with two looped descenders.
  "M116 456 C114 414 115 348 120 304 C122 282 130 274 135 293 C141 316 138 351 131 389 C140 344 158 305 187 297 C211 290 229 301 230 320 C232 341 207 355 177 354 C154 353 139 343 133 331 C137 364 140 406 143 431 C146 447 154 449 163 434 C171 418 179 397 195 394 C210 392 218 403 211 414 C204 425 188 429 174 423 C178 438 191 445 207 440 C220 436 227 424 234 412 C241 401 253 399 263 405 C274 412 273 427 263 438 C252 449 237 446 233 434 C230 422 239 410 252 407 C265 404 275 414 275 429 C275 447 269 473 261 489 C254 503 242 509 233 503 C224 497 229 488 240 489 C254 491 265 503 282 498 C298 493 305 477 309 457 C313 437 311 416 320 407 C329 398 342 399 351 406 C362 415 360 429 350 439 C339 450 325 446 321 434 C318 422 327 410 340 407 C354 404 364 414 364 430 C364 451 357 477 349 492 C342 505 332 510 323 505 C315 500 319 490 330 490 C345 491 358 503 376 498 C397 492 413 475 429 454 C444 435 458 421 477 413 C492 407 507 407 523 410",
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
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const animationRef = useRef(0);
  const [metrics, setMetrics] = useState<Metrics>({
    lengths: [],
    starts: [],
    travels: [],
    total: 1,
    strokeStarts: [],
    strokeEnds: [],
  });
  const [progress, setProgress] = useState(0);
  const [tip, setTip] = useState({ x: 104, y: 218, angle: -75 });
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
      return Math.min(42, Math.max(14, distance * .18));
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

    const updateTip = (p: number) => {
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
        const ahead = path.getPointAtLength(Math.min(len, Math.max(0, local) + 7));
        const angle = Math.atan2(ahead.y - here.y, ahead.x - here.x) * 180 / Math.PI;
        setTip({ x: here.x, y: here.y, angle });
        return;
      }

      const from = metrics.strokeEnds[index];
      const to = metrics.strokeStarts[index + 1];
      if (from && to && travel > 0) {
        const t = Math.min(1, Math.max(0, (local - len) / travel));
        const eased = t * t * (3 - 2 * t);
        const arc = Math.sin(Math.PI * eased) * 18;
        const x = from.x + (to.x - from.x) * eased;
        const y = from.y + (to.y - from.y) * eased - arc;
        const angle = Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI;
        setTip({ x, y, angle });
      }
    };

    const animate = () => {
      const current = currentProgressRef.current;
      const target = targetProgressRef.current;
      const distance = target - current;

      if (Math.abs(distance) < .00045) {
        currentProgressRef.current = target;
        setProgress(target);
        updateTip(target);
        animationRef.current = 0;
        return;
      }

      const next = current + distance * .16;
      currentProgressRef.current = next;
      setProgress(next);
      updateTip(next);
      animationRef.current = requestAnimationFrame(animate);
    };

    const updateTarget = () => {
      const hero = canvasRef.current?.closest<HTMLElement>(".hero");
      if (!hero) return;
      const range = Math.max(1, hero.offsetHeight - window.innerHeight);
      targetProgressRef.current = Math.min(1, Math.max(0, (window.scrollY - hero.offsetTop) / range));
      if (!animationRef.current) animationRef.current = requestAnimationFrame(animate);
    };

    updateTarget();
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);
    return () => {
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = 0;
    };
  }, [metrics, reduced]);

  const target = reduced ? metrics.total : metrics.total * progress;

  return (
    <div ref={canvasRef} className="nameCanvas" aria-hidden="true">
      <svg viewBox="0 0 640 540" role="img" aria-hidden="true">
        <defs>
          <filter id="graphiteRough" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.075" numOctaves="1" seed="8" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale=".85" />
          </filter>
        </defs>

        <g className="nameInk nameInkScript" filter="url(#graphiteRough)">
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
          <g className="heroPencil heroPencilWriting" transform={`translate(${tip.x} ${tip.y}) rotate(${tip.angle})`}>
            <path className="pencilWood" d="M0 0 L-15 -8 L-15 8 Z" />
            <path className="pencilGraphite" d="M0 0 L-5.5 -3 L-5.5 3 Z" />
            <rect className="pencilBody" x="-92" y="-8" width="77" height="16" rx="2" />
            <path className="pencilEdge" d="M-92 -2 L-15 -2" />
            <rect className="pencilFerrule" x="-108" y="-8" width="16" height="16" />
            <rect className="pencilEraser" x="-128" y="-8" width="20" height="16" rx="5" />
          </g>
        ) : null}
      </svg>
      <span className="nameHint">{!reduced && progress < .98 ? "keep scrolling, I am writing it" : "made by hand, then code"}</span>
    </div>
  );
}
