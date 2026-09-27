"use client";

import { useEffect, useRef, useState } from "react";

// The long line is intentionally not a lazy sine wave. It pauses to circle,
// underline, star and point at things as it moves through the page.
const TRACE = [
  "M 520 35",
  "C 500 155 610 230 565 355",
  "C 525 465 390 495 360 620",
  // loop
  "C 325 755 450 835 585 800",
  "C 705 770 746 650 675 575",
  "C 610 510 490 548 505 650",
  "C 520 748 690 875 650 1015",
  "C 610 1148 420 1128 335 1245",
  // underline
  "C 420 1290 560 1300 725 1270",
  "C 610 1340 480 1395 405 1495",
  // star doodle
  "L 435 1562 L 505 1548 L 470 1610 L 515 1660 L 448 1642 L 414 1705 L 408 1635 L 338 1620 L 400 1588",
  "C 330 1690 304 1810 390 1895",
  "C 505 2008 704 1945 730 2098",
  "C 752 2235 602 2300 492 2375",
  // spiral
  "C 385 2448 360 2590 462 2655",
  "C 564 2720 683 2644 650 2545",
  "C 620 2460 505 2470 493 2545",
  "C 482 2620 575 2660 615 2612",
  "C 645 2575 610 2538 575 2558",
  "C 545 2578 558 2608 582 2610",
  "C 700 2710 770 2838 676 2952",
  // arrow-like point
  "C 590 3050 420 3065 355 3195",
  "C 420 3240 485 3260 560 3250",
  "L 520 3218 M 560 3250 L 520 3282",
  "M 560 3250 C 705 3295 760 3425 685 3560",
  "C 610 3692 420 3690 348 3830",
  // little double loop
  "C 290 3940 362 4048 472 4020",
  "C 560 3995 558 3898 485 3890",
  "C 405 3880 392 3972 462 4000",
  "C 535 4032 640 4065 675 4170",
  // wave
  "C 700 4250 650 4320 590 4380",
  "C 530 4440 470 4510 505 4570",
  "C 545 4635 650 4625 700 4705",
  "C 750 4788 682 4880 600 4930",
  "C 520 4980 390 4998 350 5118",
  // final circle / signature turn
  "C 310 5245 440 5360 570 5310",
  "C 710 5258 738 5390 650 5485",
  "C 575 5568 455 5535 392 5625",
  "C 360 5670 375 5715 430 5748"
].join(" ");

export default function ScrollTrace() {
  const ref = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(1);
  const [progress, setProgress] = useState(0);
  const [tip, setTip] = useState({ x: 520, y: 35, angle: 90 });
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
      const start = window.innerHeight * 1.55;
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
    <svg className="storyLine" viewBox="0 0 1000 5780" preserveAspectRatio="none" aria-hidden="true">
      <path className="traceGhost" d={TRACE} fill="none" vectorEffect="non-scaling-stroke" />
      <path
        ref={ref}
        className="traceInk"
        d={TRACE}
        fill="none"
        vectorEffect="non-scaling-stroke"
        style={{ strokeDasharray: length, strokeDashoffset: length * (1 - draw) }}
      />
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
