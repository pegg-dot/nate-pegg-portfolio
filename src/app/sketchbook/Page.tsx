import type { ReactNode } from 'react';
import { clamp, OVERLAP_VH, pageHeightVh } from './pages';
import styles from './sketchbook.module.css';

/**
 * One sketchbook page: a tall section whose sticky stage is pinned while `progress` runs 0 → 1 over `travel` vh.
 * Each page overlaps the one before by OVERLAP_VH and stacks above it, so a turn is the next sheet rising over
 * the pinned page. A page never slides up under the binding.
 */
export default function Page({ id, index, rail, dark, travel, last, progress, leaving, children, className }: {
  id: string; index: number; rail?: [string, string, string]; dark?: boolean; travel: number; last: boolean; progress: number; leaving: number; children: ReactNode; className?: string;
}) {
  const curl = 0.18 + 0.82 * clamp((progress - 0.8) / 0.2);
  const overlap = last ? 0 : OVERLAP_VH;
  return (
    <section className={[styles.page, className].filter(Boolean).join(' ')} id={id} data-page={index} data-travel={travel}
      style={{ height: `${pageHeightVh(travel, last)}vh`, marginBottom: overlap ? `-${overlap}vh` : undefined, zIndex: 10 + 2 * index }}>
      <div className={styles.stage} data-dark={dark ? 'true' : undefined}>
        {rail ? <div className={styles.rail} data-zone="rail"><span>{rail[0]}</span><span>{rail[1]}</span><span>{rail[2]}</span></div> : null}
        {children}
        <div className={styles.curl} data-zone="curl" aria-hidden="true" style={{ transform: `scale(${curl.toFixed(3)})`, opacity: 1 - leaving }}>
          <svg viewBox="0 0 120 120"><path d="M120 0 L120 120 L0 120 Z" fill="#e6dfcf" /><path d="M118 4 C80 30 40 70 4 118 L118 118 Z" fill="#f3efe3" stroke="#2a2924" strokeWidth="2" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </section>
  );
}
