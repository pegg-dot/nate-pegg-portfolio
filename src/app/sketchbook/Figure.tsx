import { buildFrames, FRAME_COUNTS, STROKE_CLASSES, STROKE_COUNT, type PoseKind } from './figure';

export type FigureState = { pose: PoseKind; frame: number; variant: number; drawn: number; colored: boolean };

/** Renders little Nate in one pose/frame/variant. Draw-on comes from `drawn` (0–1), stroke by stroke. */
export default function Figure({ state, className }: { state: FigureState; className?: string }) {
  const frames = buildFrames();
  const n = FRAME_COUNTS[state.pose];
  const frame = frames[state.pose][((state.frame % n) + n) % n][state.variant & 1];
  return (
    <svg viewBox="0 0 60 92" className={[className, state.colored ? 'colored' : ''].filter(Boolean).join(' ')} data-zone="figure" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      {Array.from({ length: STROKE_COUNT }, (_, k) => {
        const v = Math.min(1, Math.max(0, (state.drawn - k / STROKE_COUNT) * 6));
        return <path key={k} d={frame[k]} className={STROKE_CLASSES[k] || undefined} pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 - v, visibility: v > 0 ? 'visible' : 'hidden' }} />;
      })}
    </svg>
  );
}
