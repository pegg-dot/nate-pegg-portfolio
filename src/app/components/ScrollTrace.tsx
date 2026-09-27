"use client";

import { useEffect, useRef, useState } from "react";

const TRACE = "M 535 40 C 470 175 620 250 555 385 C 495 505 360 540 330 680 C 300 825 455 905 620 945 C 765 982 785 1125 650 1205 C 520 1280 330 1245 285 1390 C 245 1515 365 1590 505 1630 C 690 1680 760 1810 675 1950 C 590 2090 375 2105 320 2260 C 270 2405 420 2490 590 2520 C 745 2548 790 2700 670 2805 C 555 2905 355 2890 300 3055 C 255 3190 395 3280 550 3320 C 715 3365 770 3490 680 3625 C 585 3765 390 3810 340 3970 C 300 4110 435 4205 590 4240 C 735 4275 770 4415 660 4520 C 550 4625 365 4620 315 4785 C 275 4925 410 5015 565 5060 C 720 5105 755 5260 640 5365 C 525 5470 380 5505 360 5660";

export default function ScrollTrace() {
  const ref = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(1);
  const [progress, setProgress] = useState(0);
  const [tip, setTip] = useState({ x: 535, y: 40, angle: 90 });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (ref.current) setLength(ref.current.getTotalLength());
  }, []);

  useEffect(() => {
    if (reduced || length <= 1) return;
    let raf = 0;
    const sync = () => {
      const start = window.innerHeight * 1.12;
      const max = document.documentElement.scrollHeight - window.innerHeight - start;
      const nextProgress = max > 0 ? Math.min(1, Math.max(0, (window.scrollY - start) / max)) : 0;
      setProgress(nextProgress);
      const path = ref.current;
      if (path) {
        const local = length * nextProgress;
        const here = path.getPointAtLength(local);
        const ahead = path.getPointAtLength(Math.min(length, local + 5));
        const angle = Math.atan2(ahead.y - here.y, ahead.x - here.x) * 180 / Math.PI;
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
  }, [length, reduced]);

  const draw = reduced ? 1 : progress;

  return (
    <svg className="storyLine" viewBox="0 0 1000 5700" preserveAspectRatio="none" aria-hidden="true">
      <path className="traceGhost" d={TRACE} fill="none" />
      <path ref={ref} className="traceInk" d={TRACE} fill="none" style={{ strokeDasharray: length, strokeDashoffset: length * (1 - draw) }} />
      {!reduced && progress > .001 && progress < .997 ? (
        <g className="storyPencil" transform={`translate(${tip.x} ${tip.y}) rotate(${tip.angle})`}>
          <path className="pencilWood" d="M0 0 L-12 -7 L-12 7 Z" />
          <path className="pencilGraphite" d="M0 0 L-5 -2.7 L-5 2.7 Z" />
          <rect className="pencilBody" x="-68" y="-7" width="56" height="14" rx="2" />
          <path className="pencilEdge" d="M-68 -1.5 L-12 -1.5" />
          <rect className="pencilFerrule" x="-80" y="-7" width="12" height="14" />
          <rect className="pencilEraser" x="-94" y="-7" width="14" height="14" rx="4" />
        </g>
      ) : null}
    </svg>
  );
}
