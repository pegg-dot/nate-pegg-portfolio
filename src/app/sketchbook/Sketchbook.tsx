'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import PortfolioFooter from '../components/PortfolioFooter';
import Binding from './Binding';
import Bubble from './Bubble';
import { HOME_COPY } from './copy';
import Figure, { type FigureState } from './FigureView';
import type { PoseKind } from './figure';
import Page from './Page';
import { activeIndex, clamp, pageProgress } from './pages';
import Tabs from './Tabs';
import type { PageDef } from './types';
import { useScrollClock } from './useScrollClock';
import styles from './sketchbook.module.css';
import Cover, { figureScript as coverScript } from './pages/Cover';
import Origin, { figureScript as originScript } from './pages/Origin';
import Della, { figureScript as dellaScript } from './pages/Della';
import Vial, { figureScript as vialScript } from './pages/Vial';
import Transformer, { figureScript as transformerScript } from './pages/Transformer';
import Desk, { figureScript as deskScript } from './pages/Desk';
import Drawings, { figureScript as drawScript } from './pages/Drawings';

/** The pages, in order. Each owns its own figure script. */
export const PAGES: PageDef[] = [
  { id: 'cover', height: '160vh', script: coverScript, render: p => <Cover {...p} /> },
  { id: 'work', height: '150vh', script: originScript, render: p => <Origin {...p} /> },
  { id: 'della', rail: HOME_COPY.projects.della.rail, script: dellaScript, render: p => <Della {...p} /> },
  { id: 'vialgrade', rail: HOME_COPY.projects.vialgrade.rail, script: vialScript, render: p => <Vial {...p} /> },
  { id: 'transformer', rail: HOME_COPY.projects.transformer.rail, dark: true, script: transformerScript, render: p => <Transformer {...p} /> },
  { id: 'desk', rail: HOME_COPY.desk.rail, script: deskScript, render: p => <Desk {...p} /> },
  { id: 'draw', rail: HOME_COPY.drawings.rail, script: drawScript, render: p => <Drawings {...p} /> },
];

type Fig = FigureState & { x: number; lift: number; hidden: boolean };
type Frame = { scroll: number; boil: number; reduced: boolean; vw: number; vh: number; clock: number; P: { p: number; leaving: number }[]; ai: number; fig: Fig; scrolled: boolean };
const initialFrame: Frame = {
  scroll: 0, boil: 0, reduced: false, vw: 1024, vh: 768, clock: 0, P: PAGES.map(() => ({ p: 0, leaving: 0 })), ai: 0,
  fig: { pose: 'idle', frame: 0, variant: 0, drawn: 0, colored: false, x: 0, lift: 0, hidden: false }, scrolled: false,
};

export default function Sketchbook() {
  const [f, setFrame] = useState<Frame>(initialFrame);
  const geom = useRef<{ tops: number[]; heights: number[] }>({ tops: [], heights: [] });
  const sim = useRef({ x: NaN, acc: 0, idleT: 0, frame: 0, pose: 'idle' as PoseKind, skipped: false, hopAt: -1, lookupUntil: 0, drawnOnce: false, last: { scroll: -1, boil: -1, vw: 0, vh: 0, elapsed: 0 } });

  const measure = useCallback(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-page]'));
    geom.current = { tops: els.map(e => e.offsetTop), heights: els.map(e => e.offsetHeight) };
  }, []);
  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => { window.removeEventListener('resize', measure); ro.disconnect(); };
  }, [measure]);

  useEffect(() => {
    const skip = () => { sim.current.skipped = true; };
    const key = (e: KeyboardEvent) => {
      sim.current.skipped = true;
      if (e.key === 'ArrowRight') window.scrollBy({ top: window.innerHeight * 0.35, behavior: 'smooth' });
      if (e.key === 'ArrowLeft') window.scrollBy({ top: -window.innerHeight * 0.35, behavior: 'smooth' });
      if (e.key === ' ' && e.target === document.body) { e.preventDefault(); sim.current.hopAt = performance.now(); }
    };
    window.addEventListener('scroll', skip, { passive: true });
    window.addEventListener('pointerdown', skip);
    window.addEventListener('keydown', key);
    return () => { window.removeEventListener('scroll', skip); window.removeEventListener('pointerdown', skip); window.removeEventListener('keydown', key); };
  }, []);

  useScrollClock(c => {
    const s = sim.current, g = geom.current, n = PAGES.length;
    const clock = c.reduced || s.skipped ? 1 : clamp((c.elapsed - 300) / 3400);
    const P = PAGES.map((_, i) => (c.reduced ? { p: 1, leaving: 0 } : pageProgress(g.tops[i] ?? 0, g.heights[i] ?? c.vh, c.scroll, c.vh)));
    const ai = Math.min(n - 1, activeIndex(g.tops.length ? g.tops : [0], c.scroll));
    const figW = c.vw <= 780 ? 56 : 78;
    const script = PAGES[ai].script(P[ai].p, c.vw, figW);
    const targetX = c.reduced ? c.vw / 2 - figW / 2 : script.x;
    const dx = Number.isNaN(s.x) ? 0 : targetX - s.x;
    s.x = targetX;
    s.acc += Math.abs(dx);
    if (Math.abs(dx) > 0.15) { s.idleT = 0; if (s.acc > 15) { s.acc = 0; s.frame = (s.frame + 1) % 8; } s.pose = 'walk'; }
    else { s.idleT += c.dt; if (s.idleT > 180) { s.pose = 'idle'; s.frame = Math.floor(c.elapsed / 420) % 2; } }
    if (ai === 0 && clock >= 0.84 && !s.drawnOnce) { s.drawnOnce = true; s.lookupUntil = c.elapsed + 1000; }
    let pose: PoseKind = script.pose ?? s.pose;
    let frame = s.frame;
    if (pose === 'sit' || pose === 'row') frame = Math.floor(c.elapsed / 260) % 2;
    if (!script.pose && s.pose === 'idle' && c.elapsed < s.lookupUntil) pose = 'lookup';
    let lift = script.lift ?? 0;
    if (s.hopAt >= 0) {
      const t = (performance.now() - s.hopAt) / 500;
      if (t < 1) { lift += -70 * Math.sin(Math.PI * t); pose = 'hop'; } else s.hopAt = -1;
    }
    if (c.reduced) { pose = 'idle'; frame = 0; lift = 0; }
    const drawn = ai === 0 ? (c.reduced ? 1 : clamp((clock - 0.62) / 0.22)) : 1;
    const pastEnd = c.scroll > (g.tops[n - 1] ?? 0) + (g.heights[n - 1] ?? 0) - c.vh + 4;
    const fig: Fig = { pose, frame, variant: c.boil & 1, drawn, colored: !!script.colored, x: targetX, lift, hidden: !!script.hidden || pastEnd };
    const L = s.last;
    const moved = Math.abs(c.scroll - L.scroll) > 0.3 || c.boil !== L.boil || c.vw !== L.vw || c.vh !== L.vh || (clock < 1 && c.elapsed - L.elapsed > 30) || s.hopAt >= 0 || c.elapsed < s.lookupUntil + 50;
    if (!moved) return;
    s.last = { scroll: c.scroll, boil: c.boil, vw: c.vw, vh: c.vh, elapsed: c.elapsed };
    setFrame({ scroll: c.scroll, boil: c.boil, reduced: c.reduced, vw: c.vw, vh: c.vh, clock, P, ai, fig, scrolled: s.skipped });
  });

  const mobile = f.vw <= 780;
  const bubbleW = 330, figH = mobile ? 86 : 120, figBottom = mobile ? 52 : 18;
  const bubbleShown = !mobile && f.clock > 0.92 && f.ai === 0 && (f.P[0]?.p ?? 0) < 0.6 && !f.fig.hidden;
  // Desktop: the thought sits beside his head, inside the strip. Phones: above him.
  const figW = mobile ? 56 : 78;
  const fitsRight = f.fig.x + figW + 12 + bubbleW < f.vw - 72;
  const bubbleX = fitsRight ? f.fig.x + figW + 10 : Math.max(8, f.fig.x - bubbleW - 10);
  const bubbleY = f.vh - figBottom - figH + 2;

  return (
    <main className={styles.root} id="main-content" tabIndex={-1}>
      <h1 className="srOnly">{HOME_COPY.h1}</h1>
      <Binding />
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
      <Tabs />
      {PAGES.map((pg, i) => (
        <Page key={pg.id} id={pg.id} index={i} rail={pg.rail} dark={pg.dark} height={pg.height} progress={f.P[i]?.p ?? 0} leaving={f.P[i]?.leaving ?? 0}>
          {pg.render({ progress: f.P[i]?.p ?? 0, active: Math.abs(i - f.ai) <= 1, boil: f.boil, reduced: f.reduced, clock: f.clock, vw: f.vw })}
        </Page>
      ))}
      <PortfolioFooter />
      <div className={[styles.figureLayer, PAGES[f.ai]?.dark ? styles.figureOnDark : ''].join(' ')} data-zone="figure" hidden={f.fig.hidden} style={{ transform: `translate(${f.fig.x.toFixed(1)}px, ${f.fig.lift.toFixed(1)}px)`, opacity: f.fig.drawn > 0 ? 1 : 0 }}>
        <Figure state={f.fig} className={styles.figure} />
      </div>
      <Bubble shown={bubbleShown} x={bubbleX} y={bubbleY} />
      <div className={styles.pagenum} data-zone="pagenum" aria-hidden="true">{f.ai + 1}</div>
      {!f.scrolled && f.ai === 0 ? <div className={styles.note} aria-hidden="true">scroll ↓</div> : null}
    </main>
  );
}
