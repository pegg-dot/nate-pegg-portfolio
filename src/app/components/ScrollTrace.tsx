"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Mode = "circle" | "underline" | "bracket" | "star" | "arrow";

type Spec = {
  id: string;
  selector: string;
  mode: Mode;
  tone: "ink" | "paper";
  delay?: number;
};

type Geometry = Spec & {
  d: string;
  start: number;
  end: number;
};

const specs: Spec[] = [
  { id: "della", selector: '[data-pencil-target="della"]', mode: "circle", tone: "ink" },
  { id: "vial", selector: '[data-pencil-target="vial"]', mode: "underline", tone: "ink" },
  { id: "transformer", selector: '[data-pencil-target="transformer"]', mode: "bracket", tone: "paper" },
  { id: "art", selector: '[data-pencil-target="art"]', mode: "star", tone: "ink" },
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

function starPath(x: number, y: number, w: number, h: number) {
  const cx = x + w * .82;
  const cy = y + h * .18;
  const outer = Math.max(34, Math.min(62, Math.min(w, h) * .15));
  const inner = outer * .42;
  const pts: string[] = [];
  for (let i = 0; i < 10; i += 1) {
    const r = i % 2 === 0 ? outer : inner;
    const a = -Math.PI / 2 + (Math.PI * i) / 5;
    pts.push(`${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r}`);
  }
  return `M ${pts[0]} L ${pts.slice(1).join(" L ")} Z`;
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
  if (mode === "star") return starPath(x, y, w, h);
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
        const start = Math.max(0, y - window.innerHeight * .72 + (spec.delay ?? 0));
        const duration = Math.max(260, Math.min(460, 230 + h * .8));
        return [{ ...spec, d: buildPath(spec.mode, x, y, w, h), start, end: start + duration }];
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

    const sync = () => {
      const y = window.scrollY;
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

      raf = 0;
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
        <path
          key={g.id}
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
