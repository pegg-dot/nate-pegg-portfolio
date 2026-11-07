import { useLayoutEffect, useRef } from 'react';
import DrawingPencil from '../components/DrawingPencil';
import { buildFrames, FRAME_COUNTS, STROKE_CLASSES, STROKE_COUNT, type PoseKind } from './figure';

export type FigureState = { pose: PoseKind; frame: number; variant: number; drawn: number; colored: boolean };

/** How much of stroke k is drawn at `drawn`: strokes start one after another and each takes a sixth of the run. */
const visibleAt = (drawn: number, k: number) => Math.min(1, Math.max(0, (drawn - k / STROKE_COUNT) * 6));

/** Renders little Nate in one pose/frame/variant. Draw-on comes from `drawn` (0–1), stroke by stroke, with the pencil on the stroke being drawn. */
export default function Figure({ state, className }: { state: FigureState; className?: string }) {
  const frames = buildFrames();
  const n = FRAME_COUNTS[state.pose];
  const frame = frames[state.pose][((state.frame % n) + n) % n][state.variant & 1];
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const pencil = useRef<SVGGElement>(null);
  // The pencil sits on the newest stroke still in progress and lifts once he is complete.
  useLayoutEffect(() => {
    const g = pencil.current;
    if (!g) return;
    let k = -1;
    for (let i = 0; i < STROKE_COUNT; i++) { const v = visibleAt(state.drawn, i); if (v > 0 && v < 1) k = i; }
    const el = k >= 0 ? paths.current[k] : null;
    if (!el || state.drawn <= 0 || state.drawn >= 1) { g.style.visibility = 'hidden'; return; }
    const q = el.getPointAtLength(visibleAt(state.drawn, k) * el.getTotalLength());
    g.setAttribute('transform', `translate(${q.x.toFixed(2)} ${q.y.toFixed(2)})`);
    g.style.visibility = 'visible';
  });
  return (
    <svg viewBox="0 0 60 92" className={[className, state.colored ? 'colored' : ''].filter(Boolean).join(' ')} data-zone="figure" data-pose={state.pose} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      {Array.from({ length: STROKE_COUNT }, (_, k) => {
        const v = visibleAt(state.drawn, k);
        return <path key={k} ref={el => { paths.current[k] = el; }} d={frame[k]} className={STROKE_CLASSES[k] || undefined} pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 - v, visibility: v > 0 ? 'visible' : 'hidden' }} />;
      })}
      <g ref={pencil} data-pencil="" style={{ visibility: 'hidden' }}><DrawingPencil x={0} y={0} scale={1.1} /></g>
    </svg>
  );
}
