import type { CSSProperties, ElementType } from 'react';
import { clamp, ease } from './pages';
import styles from './sketchbook.module.css';

/** The one typeset thing on the page, still drawn: a heavy heading that gets pencil-shaded in. */
export default function ShadedHeading({ lines, progress, as: Tag = 'h2', className }: { lines: string[]; progress: number; as?: ElementType; className?: string }) {
  const shade = ease(clamp(progress));
  return (
    <Tag className={[styles.heading, styles.shaded, className].filter(Boolean).join(' ')} style={{ '--shade': shade.toFixed(3) } as CSSProperties}>
      {lines.map((l, i) => <span key={i} className={styles.headingLine}>{l}</span>)}
    </Tag>
  );
}
