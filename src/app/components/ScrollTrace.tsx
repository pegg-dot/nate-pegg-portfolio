"use client";

import { useEffect, useRef, useState } from "react";

const TRACE = "M 512 20 C 480 125 566 202 506 298 C 454 380 419 463 470 558 C 520 652 654 675 692 774 C 731 875 637 956 525 984 C 388 1019 247 978 207 1107 C 175 1210 270 1262 389 1277 C 548 1298 701 1243 742 1384 C 777 1508 655 1575 524 1598 C 374 1625 265 1715 306 1850 C 347 1984 548 1998 620 2093 C 692 2188 615 2290 472 2318 C 337 2344 249 2461 298 2592 C 353 2737 544 2740 680 2840 C 781 2914 732 3069 593 3137 C 470 3197 317 3217 289 3350 C 258 3495 405 3553 539 3589 C 700 3632 747 3764 680 3902 C 613 4043 431 4077 345 4187 C 258 4298 315 4423 458 4484 C 587 4539 714 4579 735 4700 C 758 4835 619 4917 482 4992 C 342 5068 312 5237 413 5340 C 508 5437 686 5441 718 5588 C 750 5737 597 5824 500 5921 C 447 5974 429 6063 456 6180";

export default function ScrollTrace() {
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(1);
  const [progress, setProgress] = useState(0);
  const [heroReveal, setHeroReveal] = useState(0);
  const [point, setPoint] = useState({ x: 512, y: 20 });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    setLength(total);
    setPoint(path.getPointAtLength(0));
  }, []);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const sync = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const next = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      setProgress(next);
      setHeroReveal(Math.min(1, Math.max(0, scrollY / (innerHeight * .62))));
      const path = pathRef.current;
      if (path && length > 1) {
        setPoint(path.getPointAtLength(Math.min(length, length * next * 1.08)));
      }
      raf = 0;
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(sync); };
    sync();
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    return () => {
      removeEventListener("scroll", queue);
      removeEventListener("resize", queue);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [length, reduced]);

  const draw = reduced ? 1 : Math.min(1, progress * 1.08);

  return (
    <>
      <div className="scrollProgress" aria-hidden="true"><span style={{ transform: `scaleX(${Math.max(.015, progress)})` }} /></div>
      <svg className="storyLine" viewBox="0 0 1000 6200" preserveAspectRatio="none" aria-hidden="true">
        <path className="traceGhost" d={TRACE} fill="none" />
        <path
          ref={pathRef}
          className="traceInk"
          d={TRACE}
          fill="none"
          style={{ strokeDasharray: length, strokeDashoffset: length * (1 - draw) }}
        />
        {!reduced && draw < .995 ? (
          <g transform={`translate(${point.x} ${point.y}) rotate(18)`} className="pencilNib">
            <path d="M -8 -3 L 10 0 L -8 3 Z" />
            <circle cx="-9" cy="0" r="2.2" />
          </g>
        ) : null}
      </svg>
      <style>{`:root{--hero-reveal:${heroReveal}}`}</style>
    </>
  );
}
