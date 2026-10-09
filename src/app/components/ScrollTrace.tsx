"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Mode = "circle" | "underline" | "bracket" | "note" | "arrow";

type Spec = {
  id: string;
  selector: string;
  mode: Mode;
  tone: "ink" | "paper";
  delay?: number;
  label?: string;
};

type Geometry = Spec & {
  d: string;
  start: number;
  end: number;
  labelX?: number;
  labelY?: number;
  labelAngle?: number;
};

const specs: Spec[] = [
  { id: "della", selector: '[data-pencil-target="della"]', mode: "circle", tone: "ink" },
  { id: "vial", selector: '[data-pencil-target="vial"]', mode: "underline", tone: "ink" },
  { id: "transformer", selector: '[data-pencil-target="transformer"]', mode: "bracket", tone: "paper" },
  { id: "marley", selector: '[data-pencil-target="marley"]', mode: "note", tone: "ink", label: "Bob Marley" },
  { id: "dog", selector: '[data-pencil-target="dog"]', mode: "note", tone: "ink", label: "Mowgli" },
  { id: "miami", selector: '[data-pencil-target="miami"]', mode: "note", tone: "ink", label: "a little Miami" },
  { id: "rowing", selector: '[data-pencil-target="rowing"]', mode: "arrow", tone: "paper" },
  { id: "about", selector: '[data-pencil-target="about"]', mode: "circle", tone: "ink" },
];

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

function circlePath(x: number, y: number, w: number, h: number) {
  const px = Math.max(12, Math.min(24, w * .04));
  const py = Math.max(10, Math.min(18, h * .22));
  const left = x - px;
  const right = x + w + px;
  const top = y - py;
  const bottom = y + h + py;
  const rx = (right - left) / 2;
  const ry = (bottom - top) / 2;
  const cx = left + rx;
  const cy = top + ry;
  return [
    `M ${right - rx * .08} ${cy - ry * .72}`,
    `C ${right + rx * .05} ${cy - ry * .12}, ${right - rx * .02} ${cy + ry * .63}, ${cx + rx * .08} ${bottom}`,
    `C ${cx - rx * .54} ${bottom + 4}, ${left - 4} ${cy + ry * .55}, ${left} ${cy - ry * .06}`,
    `C ${left + 3} ${top + ry * .22}, ${cx - rx * .42} ${top - 5}, ${cx + rx * .15} ${top}`,
    `C ${cx + rx * .62} ${top + 3}, ${right + 4} ${cy - ry * .42}, ${right - rx * .08} ${cy - ry * .72}`,
  ].join(" ");
}

function underlinePath(x: number, y: number, w: number, h: number) {
  const yy = y + h + Math.max(10, Math.min(17, h * .3));
  return `M ${x - 5} ${yy} C ${x + w * .22} ${yy + 7}, ${x + w * .42} ${yy - 5}, ${x + w * .62} ${yy + 2} S ${x + w * .9} ${yy + 4}, ${x + w + 8} ${yy - 1}`;
}

function bracketPath(x: number, y: number, w: number, h: number) {
  const bx = x + w + Math.max(18, Math.min(38, w * .06));
  const top = y - 5;
  const bottom = y + h + 5;
  const mid = (top + bottom) / 2;
  return `M ${bx - 20} ${top} C ${bx} ${top}, ${bx} ${top + 14}, ${bx} ${top + 28} L ${bx} ${mid - 16} C ${bx} ${mid - 5}, ${bx + 12} ${mid - 4}, ${bx + 20} ${mid} C ${bx + 12} ${mid + 4}, ${bx} ${mid + 5}, ${bx} ${mid + 16} L ${bx} ${bottom - 28} C ${bx} ${bottom - 14}, ${bx} ${bottom}, ${bx - 20} ${bottom}`;
}

function noteGeometry(id: string, x: number, y: number, w: number, h: number, narrow: boolean) {
  if (id === "dog" && !narrow) {
    // A small loop beside the portrait, pointing back into its right edge.
    const right = x + w;
    const endY = y + h * .43;
    return {
      d: `M ${right + 42} ${y + h * .25 + 18} C ${right + 95} ${y + h * .29}, ${right + 92} ${endY + 14}, ${right + 12} ${endY} Q ${right + 18} ${endY - 6}, ${right + 26} ${endY - 9} Q ${right + 17} ${endY - 3}, ${right + 12} ${endY} L ${right + 25} ${endY + 10}`,
      anchorY: y + h * .25,
      labelX: right + 24, labelY: y + h * .25 + 2, labelAngle: 8,
    };
  }
  if (id === "miami" || id === "dog") {
    // A low, wandering tail that turns upward from the note below the drawing.
    const bottom = y + h;
    const endX = x + w * (id === "miami" ? .86 : .65);
    const endY = bottom + 12;
    return {
      d: `M ${x + w * (id === "miami" ? .61 : .28)} ${bottom + 48} C ${x + w * .79} ${bottom + 89}, ${x + w * .98} ${bottom + 57}, ${endX} ${endY} Q ${endX - 1} ${endY + 10}, ${endX - 4} ${endY + 18} Q ${endX - 1} ${endY + 7}, ${endX} ${endY} L ${endX + 15} ${endY + 9}`,
      anchorY: bottom + 30,
      labelX: x + w * .08, labelY: bottom + 51, labelAngle: id === "miami" ? -3 : 6,
    };
  }
  // A broad swoop above Marley, turning down toward the top-left corner.
  const endX = x + w * .18;
  const endY = y - 10;
  return {
    d: `M ${x + w * .62} ${y - 48} C ${x + w * .48} ${y - 80}, ${x + w * .13} ${y - 78}, ${endX} ${endY} Q ${endX - 7} ${endY - 5}, ${endX - 13} ${endY - 14} Q ${endX - 5} ${endY - 5}, ${endX} ${endY} Q ${endX + 6} ${endY - 9}, ${endX + 14} ${endY - 13}`,
    anchorY: y - 40,
    labelX: x + w * .63, labelY: y - 45, labelAngle: -5,
  };
}

function arrowPath(x: number, y: number, w: number, h: number) {
  const targetX = x + w * .72;
  const targetY = y + h * .72;
  const startX = x + w + 145;
  const startY = y + h * .18;
  const controlX = x + w + 70;
  const controlY = y + h * .42;
  return `M ${startX} ${startY} C ${controlX} ${controlY}, ${targetX + 110} ${targetY - 80}, ${targetX} ${targetY} M ${targetX + 28} ${targetY - 8} L ${targetX} ${targetY} L ${targetX + 12} ${targetY - 29}`;
}

function buildPath(mode: Mode, x: number, y: number, w: number, h: number) {
  if (mode === "circle") return circlePath(x, y, w, h);
  if (mode === "underline") return underlinePath(x, y, w, h);
  if (mode === "bracket") return bracketPath(x, y, w, h);
  return arrowPath(x, y, w, h);
}

export default function ScrollTrace() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const [geometry, setGeometry] = useState<Geometry[]>([]);
  const [page, setPage] = useState({ width: 1, height: 1 });
  const [scrollY, setScrollY] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [tip, setTip] = useState<{ x: number; y: number; angle: number; tone: "ink" | "paper" } | null>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const measure = () => {
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.scrollHeight;
      setPage({ width, height });

      const next = specs.flatMap((spec) => {
        const el = document.querySelector<HTMLElement>(spec.selector);
        if (!el) return [];
        const r = el.getBoundingClientRect();
        const x = r.left + window.scrollX;
        const y = r.top + window.scrollY;
        const w = r.width;
        const h = r.height;
        const note = spec.mode === "note" ? noteGeometry(spec.id, x, y, w, h, width <= 680) : null;
        const start = Math.max(0, (note?.anchorY ?? y) - window.innerHeight * (note ? .82 : .72) + (spec.delay ?? 0));
        const duration = spec.mode === "note" ? Math.min(240, window.innerHeight * .3) : Math.max(260, Math.min(460, 230 + h * .8));
        return [{ ...spec, d: note?.d ?? buildPath(spec.mode, x, y, w, h), start, end: start + duration, labelX: note?.labelX, labelY: note?.labelY, labelAngle: note?.labelAngle }];
      });
      setGeometry(next);
      requestAnimationFrame(() => setTick((v) => v + 1));
    };

    const afterFonts = () => requestAnimationFrame(() => requestAnimationFrame(measure));
    if (document.fonts?.ready) document.fonts.ready.then(afterFonts);
    else afterFonts();

    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, []);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let easedY = window.scrollY;
    let lastTime = 0;

    const sync = (time: number) => {
      const elapsed = lastTime ? Math.min(64, time - lastTime) : 16;
      lastTime = time;
      easedY += (window.scrollY - easedY) * (1 - Math.exp(-elapsed / 65));
      if (Math.abs(window.scrollY - easedY) < .2) easedY = window.scrollY;
      const y = easedY;
      setScrollY(y);

      const active = geometry.find((g) => {
        const p = clamp((y - g.start) / Math.max(1, g.end - g.start));
        return p > 0 && p < 1;
      });

      if (active) {
        const path = pathRefs.current[active.id];
        if (path) {
          const p = clamp((y - active.start) / Math.max(1, active.end - active.start));
          const len = path.getTotalLength();
          const local = len * p;
          const here = path.getPointAtLength(local);
          const ahead = path.getPointAtLength(Math.min(len, local + 4));
          setTip({
            x: here.x,
            y: here.y,
            angle: Math.atan2(ahead.y - here.y, ahead.x - here.x) * 180 / Math.PI,
            tone: active.tone,
          });
        }
      } else {
        setTip(null);
      }

      raf = easedY !== window.scrollY ? requestAnimationFrame(sync) : 0;
      if (!raf) lastTime = 0;
    };

    const queue = () => { if (!raf) raf = requestAnimationFrame(sync); };
    raf = requestAnimationFrame(sync);
    window.addEventListener("scroll", queue, { passive: true });
    return () => {
      window.removeEventListener("scroll", queue);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [geometry, reduced]);

  const progress = useMemo(() => {
    const map: Record<string, number> = {};
    geometry.forEach((g) => {
      map[g.id] = reduced ? 1 : clamp((scrollY - g.start) / Math.max(1, g.end - g.start));
    });
    return map;
  }, [geometry, reduced, scrollY]);

  return (
    <svg
      ref={svgRef}
      className="storyLine semanticLine"
      viewBox={`0 0 ${page.width} ${page.height}`}
      width={page.width}
      height={page.height}
      style={{ width: page.width, height: page.height, top: 0 }}
      aria-hidden="true"
    >
      {geometry.map((g) => (
        <g key={g.id}>
        <path
          ref={(el) => { pathRefs.current[g.id] = el; }}
          className={`semanticInk ${g.tone === "paper" ? "paperInk" : ""}`}
          d={g.d}
          pathLength={1}
          fill="none"
          style={{
            strokeDasharray: 1,
            strokeDashoffset: 1 - (progress[g.id] ?? 0),
          }}
        />
        {g.label ? <text className="pencilNote" x={g.labelX} y={g.labelY} transform={`rotate(${g.labelAngle ?? 0} ${g.labelX} ${g.labelY})`} style={{ opacity: clamp(((progress[g.id] ?? 0) - .45) / .45) }}>{g.label}</text> : null}
        </g>
      ))}

      {!reduced && tip ? (
        <g className={`storyPencil semanticPencil ${tip.tone === "paper" ? "paperPencil" : ""}`} transform={`translate(${tip.x} ${tip.y}) rotate(${tip.angle})`}>
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
