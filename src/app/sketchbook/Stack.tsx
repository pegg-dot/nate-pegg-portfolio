'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { clamp, ease } from './pages';
import styles from './sketchbook.module.css';

/**
 * The page's content column. When it is taller than the pinned stage (phones), it scrolls
 * itself up between p .35 and .65 so the second half (the drawing) comes into view.
 * On a desktop it fits and this does nothing.
 */
export default function Stack({ progress, children }: { progress: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => { const o = el.scrollHeight - el.clientHeight; setOverflow(o > 8 ? o : 0); };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    for (const c of Array.from(el.children)) ro.observe(c);
    return () => ro.disconnect();
  }, []);
  const shift = overflow * ease(clamp((progress - 0.35) / 0.3));
  return <div ref={ref} className={styles.stack}><div className={styles.stackInner} style={{ transform: `translateY(${(-shift).toFixed(1)}px)` }}>{children}</div></div>;
}
