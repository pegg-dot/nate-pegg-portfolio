"use client";

import { useEffect, useRef, useState } from "react";
import DrawingPencil from "./DrawingPencil";

// A coastal double seen from above: broad hull, two rowers, four sculls.
const strokes = [
  "M30 100 C34 82 75 73 148 75 C212 76 272 85 306 100 C270 115 211 125 148 125 C75 127 34 118 30 100 Z",
  "M48 100 C74 85 121 83 153 85 L215 91 Q232 100 215 109 L153 115 C121 117 74 115 48 100 Z",
  "M103 89 L91 70 L117 70 M103 111 L91 130 L117 130 M174 89 L162 70 L188 70 M174 111 L162 130 L188 130",
  "M116 100 C116 92 130 92 130 100 C130 108 116 108 116 100 M121 96 L105 90 L96 100 L105 110 L121 104 M105 92 L116 100 L105 108",
  "M187 100 C187 92 201 92 201 100 C201 108 187 108 187 100 M192 96 L176 90 L167 100 L176 110 L192 104 M176 92 L187 100 L176 108",
];
const oars = [
  { pivotX: 102, pivotY: 70, side: 1, bladeX: 80, shaft: "M113 99 L86 28", blade: "M86 28 L81 14 Q78 10 72 14 L76 30 Z" },
  { pivotX: 102, pivotY: 130, side: -1, bladeX: 80, shaft: "M113 101 L86 172", blade: "M86 172 L81 186 Q78 190 72 186 L76 170 Z" },
  { pivotX: 173, pivotY: 70, side: 1, bladeX: 151, shaft: "M184 99 L157 28", blade: "M157 28 L152 14 Q149 10 143 14 L147 30 Z" },
  { pivotX: 173, pivotY: 130, side: -1, bladeX: 151, shaft: "M184 101 L157 172", blade: "M157 172 L152 186 Q149 190 143 186 L147 170 Z" },
];
const drawingPaths = [...strokes, ...oars.flatMap((oar) => [oar.shaft, oar.blade])];
const clamp = (n: number) => Math.max(0, Math.min(1, n));

export default function RowingSketch() {
  const container = useRef<HTMLDivElement>(null);
  const paths = useRef<Array<SVGPathElement | null>>([]);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [width, setWidth] = useState(1000);
  const [lengths, setLengths] = useState<number[]>([]);
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const measure = () => setWidth(Math.max(330, el.clientWidth));
    const preference = () => setReduced(media.matches);
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    measure();
    preference();
    setLengths(paths.current.map((p) => p?.getTotalLength() ?? 0));
    media.addEventListener("change", preference);
    return () => { observer.disconnect(); media.removeEventListener("change", preference); };
  }, []);

  useEffect(() => {
    if (reduced || !lengths.length) return;
    let frame = 0;
    let last = 0;
    let current = 0;
    const total = lengths.reduce((sum, n) => sum + n, 0);
    const animate = (time: number) => {
      const el = container.current;
      if (!el) return;
      const elapsed = last ? Math.min(48, time - last) : 16;
      last = time;
      const rect = el.getBoundingClientRect();
      const target = clamp((window.innerHeight * .92 - rect.top) / (window.innerHeight * .78));
      const delta = target - current;
      const step = delta * (1 - Math.exp(-elapsed / 140));
      current = Math.abs(delta) < .0005 ? target : current + Math.sign(step) * Math.min(Math.abs(step), elapsed / 2400);
      setProgress(current);
      const drawnLength = clamp(current / .48) * total;
      let offset = 0;
      let nextTip = null;
      for (let i = 0; i < lengths.length; i++) {
        if (drawnLength < offset + lengths[i]) {
          const point = paths.current[i]?.getPointAtLength(Math.max(0, drawnLength - offset));
          if (point && current > 0) nextTip = { x: point.x, y: point.y };
          break;
        }
        offset += lengths[i];
      }
      setTip(nextTip);
      frame = current !== target ? requestAnimationFrame(animate) : 0;
      if (!frame) last = 0;
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(animate); };
    queue();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, [lengths, reduced]);

  const drawn = reduced ? 1 : clamp(progress / .48);
  const travel = reduced ? .35 : clamp((progress - .48) / .52);
  const scale = width < 600 ? .72 : 1;
  const x = 4 + travel * Math.max(0, width - 320 * scale);
  const total = lengths.reduce((sum, n) => sum + n, 0);
  // Both scullers move together. The blades feather on the forward recovery
  // and square up for the drive back toward the stern.
  const phase = reduced ? 0 : (travel * 3) % 1;
  const sweep = 30 * (1 - Math.cos(phase * Math.PI * 2));
  const feather = phase < .5 ? 1 - .8 * Math.sin(phase * Math.PI * 2) : 1;
  const path = (i: number) => {
    const length = lengths[i] || 1;
    const start = lengths.slice(0, i).reduce((sum, n) => sum + n, 0);
    const visible = reduced ? 1 : clamp((drawn * total - start) / length);
    return <path key={i} ref={(el) => { paths.current[i] = el; }} className="rowingSketchLine" d={drawingPaths[i]} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - visible} />;
  };

  return (
    <div className="rowingSketch" ref={container} aria-hidden="true">
      <svg viewBox={`0 0 ${width} 210`}>
        <g className="rowingWake" opacity={reduced ? .35 : travel * .5}>
          <path d={`M10 98 Q${x * .3} 92 ${x + 20} 100 M4 110 Q${x * .6} 118 ${x + 20} 108`} />
        </g>
        <g transform={`translate(${x} ${104 - 100 * scale}) scale(${scale})`}>
          {strokes.map((_, i) => path(i))}
          {oars.map((oar, i) => (
            <g key={i} className="rowingOar" transform={`rotate(${sweep * oar.side} ${oar.pivotX} ${oar.pivotY})`}>
              {path(strokes.length + i * 2)}
              <g className="rowingBlade" transform={`translate(${oar.bladeX} 0) scale(${feather} 1) translate(${-oar.bladeX} 0)`}>
                {path(strokes.length + i * 2 + 1)}
              </g>
            </g>
          ))}
          {!reduced && tip ? <DrawingPencil x={tip.x} y={tip.y} scale={.7} /> : null}
        </g>
      </svg>
    </div>
  );
}
