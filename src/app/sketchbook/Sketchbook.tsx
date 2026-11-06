'use client';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import PortfolioFooter from '../components/PortfolioFooter';
import Binding from './Binding';
import Bubble from './Bubble';
import { HOME_COPY } from './copy';
import Figure, { type FigureState } from './FigureView';
import { FRAME_COUNTS, type PoseKind } from './figure';
import Page from './Page';
import { activeIndex, clamp, pageProgress, TRAVEL_VH } from './pages';
import Tabs from './Tabs';
import type { PageDef, PageProps } from './types';
import { useScrollClock } from './useScrollClock';
import styles from './sketchbook.module.css';
import Cover, { figureScript as coverScript } from './pages/Cover';
import Origin, { figureScript as originScript } from './pages/Origin';
import Della, { figureScript as dellaScript } from './pages/Della';
import Vial, { figureScript as vialScript } from './pages/Vial';
import Transformer, { figureScript as transformerScript } from './pages/Transformer';
import Desk, { figureScript as deskScript } from './pages/Desk';
import Drawings, { figureScript as drawScript } from './pages/Drawings';
import Rowing, { figureScript as rowScript } from './pages/Rowing';
import About, { figureScript as aboutScript } from './pages/About';

/** The pages, in order. Each owns its own figure script. */
export const PAGES: PageDef[] = [
  { id: 'cover', travel: 120, script: coverScript, render: p => <Cover {...p} /> },
  { id: 'work', travel: 100, script: originScript, render: p => <Origin {...p} /> },
  { id: 'della', rail: HOME_COPY.projects.della.rail, script: dellaScript, render: p => <Della {...p} /> },
  { id: 'vialgrade', rail: HOME_COPY.projects.vialgrade.rail, script: vialScript, render: p => <Vial {...p} /> },
  { id: 'transformer', rail: HOME_COPY.projects.transformer.rail, dark: true, script: transformerScript, render: p => <Transformer {...p} /> },
  { id: 'desk', rail: HOME_COPY.desk.rail, script: deskScript, render: p => <Desk {...p} /> },
  { id: 'draw', rail: HOME_COPY.drawings.rail, script: drawScript, render: p => <Drawings {...p} /> },
  { id: 'row', rail: HOME_COPY.rowing.rail, script: rowScript, render: p => <Rowing {...p} /> },
  { id: 'about', travel: 120, script: aboutScript, render: p => <About {...p} /> },
];

type Fig = FigureState & { x: number; lift: number; hidden: boolean };
type Frame = { scroll: number; boil: number; reduced: boolean; vw: number; vh: number; clock: number; P: { p: number; leaving: number; entering: number }[]; ai: number; fig: Fig; scrolled: boolean; seen: boolean[] };
const initialFrame: Frame = {
  scroll: 0, boil: 0, reduced: false, vw: 1024, vh: 768, clock: 0, P: PAGES.map((_, i) => ({ p: 0, leaving: 0, entering: i === 0 ? 1 : 0 })), ai: 0,
  fig: { pose: 'idle', frame: 0, variant: 0, drawn: 0, colored: false, x: 0, lift: 0, hidden: false }, scrolled: false, seen: PAGES.map(() => false),
};

/** A page's content re-renders only when something it shows changes (inactive pages skip the boil tick). */
const PageBody = memo(function PageBody({ def, ...props }: { def: PageDef } & PageProps) {
  return <>{def.render(props)}</>;
});

export default function Sketchbook() {
  const [f, setFrame] = useState<Frame>(initialFrame);
  const geom = useRef<{ tops: number[]; heights: number[]; overlaps: number[] }>({ tops: [], heights: [], overlaps: [] });
  const sim = useRef({ x: NaN, acc: 0, idleT: 0, frame: 0, pose: 'idle' as PoseKind, skipped: false, hopAt: -1, lookupUntil: 0, drawnOnce: false, seen: PAGES.map(() => false), P: PAGES.map(() => 0), last: { scroll: -1, boil: -1, vw: 0, vh: 0, elapsed: 0 } });

  /** Scroll so a page is pinned a little way in: its copy is on and its first marks are drawn. Used by anchors and focus. */
  const revealPage = useCallback((i: number, behavior: ScrollBehavior = 'smooth') => {
    const g = geom.current;
    if (g.tops[i] === undefined) return;
    sim.current.skipped = true;
    const top = g.tops[i] + 0.12 * Math.max(0, g.heights[i] - window.innerHeight - (g.overlaps[i] ?? 0));
    // Nearby: glide. Far away: turn straight to the page; the thumb catches up over the last screen and a half.
    const far = Math.abs(top - window.scrollY) > window.innerHeight * 2;
    window.scrollTo({ top, behavior: far ? 'instant' : behavior });
  }, []);

  const measure = useCallback(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-page]'));
    geom.current = { tops: els.map(e => e.offsetTop), heights: els.map(e => e.offsetHeight), overlaps: els.map(e => Math.max(0, -parseFloat(getComputedStyle(e).marginBottom) || 0)) };
  }, []);
  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => { window.removeEventListener('resize', measure); ro.disconnect(); };
  }, [measure]);

  // Anchors (#della, #draw…), the initial hash and keyboard focus all land on a page with its copy showing.
  useEffect(() => {
    const indexOf = (hash: string) => PAGES.findIndex(p => '#' + p.id === hash);
    const fromHash = (behavior: ScrollBehavior) => { const i = indexOf(window.location.hash); if (i >= 0) { measure(); revealPage(i, behavior); } };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute('href') ?? '';
      const i = indexOf(hash);
      if (i < 0) return;
      e.preventDefault();
      history.replaceState(null, '', hash);
      revealPage(i);
    };
    const onFocus = (e: FocusEvent) => {
      const sec = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-page]');
      if (!sec) return;
      const i = Number(sec.dataset.page);
      // Not yet reached, or already covered by the next sheet: bring the page back so the focused link is visible.
      const covered = i < PAGES.length - 1 && window.scrollY >= (geom.current.tops[i + 1] ?? Infinity) - 2;
      if (sim.current.P[i] < 0.1 || covered) revealPage(i);
    };
    const onHash = () => fromHash('smooth');
    const t = window.setTimeout(() => fromHash('instant'), 60);
    document.addEventListener('click', onClick);
    document.addEventListener('focusin', onFocus);
    window.addEventListener('hashchange', onHash);
    return () => { window.clearTimeout(t); document.removeEventListener('click', onClick); document.removeEventListener('focusin', onFocus); window.removeEventListener('hashchange', onHash); };
  }, [measure, revealPage]);

  useEffect(() => {
    const skip = () => { sim.current.skipped = true; };
    const key = (e: KeyboardEvent) => {
      sim.current.skipped = true;
      if (e.key === 'ArrowRight') window.scrollBy({ top: window.innerHeight * 0.5, behavior: 'smooth' });
      if (e.key === 'ArrowLeft') window.scrollBy({ top: -window.innerHeight * 0.5, behavior: 'smooth' });
      if (e.key === ' ' && e.target === document.body) { e.preventDefault(); sim.current.hopAt = performance.now(); }
    };
    window.addEventListener('scroll', skip, { passive: true });
    window.addEventListener('pointerdown', skip);
    window.addEventListener('keydown', key);
    return () => { window.removeEventListener('scroll', skip); window.removeEventListener('pointerdown', skip); window.removeEventListener('keydown', key); };
  }, []);

  useScrollClock(c => {
    const s = sim.current, g = geom.current, n = PAGES.length;
    // The cover clock: the name writes until .74, the pencil draws him .76–.9, he looks up, the intro and the thought follow. One pencil at a time.
    const clock = c.reduced || s.skipped ? 1 : clamp((c.elapsed - 300) / 4600);
    const P = PAGES.map((_, i) => (c.reduced ? { p: 1, leaving: 0, entering: 1 } : pageProgress(g.tops[i] ?? 0, g.heights[i] ?? c.vh, c.scroll, c.vh, g.overlaps[i] ?? 0)));
    P.forEach((q, i) => { s.P[i] = q.p; if (q.p > 0.06) s.seen[i] = true; });
    const ai = Math.min(n - 1, activeIndex(g.tops.length ? g.tops : [0], c.scroll));
    const figW = c.vw <= 780 ? 56 : c.vh <= 740 ? 70 : 78;
    const script = PAGES[ai].script(P[ai].p, c.vw, figW);
    const targetX = c.reduced ? c.vw / 2 - figW / 2 : script.x;
    const dx = Number.isNaN(s.x) ? 0 : targetX - s.x;
    s.x = targetX;
    s.acc += Math.abs(dx);
    if (Math.abs(dx) > 0.15) { s.idleT = 0; if (s.acc > 15) { s.acc = 0; s.frame = (s.frame + 1) % 8; } s.pose = 'walk'; }
    else { s.idleT += c.dt; if (s.idleT > 180) { s.pose = 'idle'; s.frame = Math.floor(c.elapsed / 420) % 2; } }
    if (ai === 0 && clock >= 0.9 && !s.drawnOnce) { s.drawnOnce = true; s.lookupUntil = c.elapsed + 1000; }
    let pose: PoseKind = script.pose ?? s.pose;
    let frame = s.frame;
    if (pose === 'sit' || pose === 'row') frame = Math.floor(c.elapsed / 180) % FRAME_COUNTS[pose];
    if (!script.pose && s.pose === 'idle' && c.elapsed < s.lookupUntil) pose = 'lookup';
    let lift = script.lift ?? 0;
    if (s.hopAt >= 0) {
      const t = (performance.now() - s.hopAt) / 500;
      if (t < 1) { lift += -70 * Math.sin(Math.PI * t); pose = 'hop'; } else s.hopAt = -1;
    }
    if (c.reduced) { pose = 'idle'; frame = 0; lift = 0; }
    // Each sheet has its own drawing of him: on the cover the pencil draws him after the name, on every later page at its start.
    const drawn = c.reduced ? 1 : ai === 0 ? clamp((clock - 0.76) / 0.14) : clamp(P[ai].p / 0.04);
    const pastEnd = c.scroll > (g.tops[n - 1] ?? 0) + (g.heights[n - 1] ?? 0) - c.vh + 4;
    const fig: Fig = { pose, frame, variant: c.boil & 1, drawn, colored: !!script.colored, x: targetX, lift, hidden: !!script.hidden || pastEnd };
    const L = s.last;
    const moved = Math.abs(c.scroll - L.scroll) > 0.3 || c.boil !== L.boil || c.vw !== L.vw || c.vh !== L.vh || (clock < 1 && c.elapsed - L.elapsed > 30) || s.hopAt >= 0 || c.elapsed < s.lookupUntil + 50;
    if (!moved) return;
    s.last = { scroll: c.scroll, boil: c.boil, vw: c.vw, vh: c.vh, elapsed: c.elapsed };
    setFrame({ scroll: c.scroll, boil: c.boil, reduced: c.reduced, vw: c.vw, vh: c.vh, clock, P, ai, fig, scrolled: s.skipped, seen: s.seen.slice() });
  });

  const mobile = f.vw <= 780;
  const short = !mobile && f.vh <= 740;
  const bubbleW = 330, figH = mobile ? 86 : short ? 108 : 120, figBottom = mobile ? 52 : 18;
  const bubbleShown = !mobile && f.clock > 0.95 && f.ai === 0 && (f.P[0]?.p ?? 0) < 0.6 && !f.fig.hidden;
  // Desktop: the thought sits beside his head, inside the strip. Phones: above him.
  const figW = mobile ? 56 : short ? 70 : 78;
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
      <Bubble shown={bubbleShown} x={bubbleX} y={bubbleY} />
      {PAGES.map((pg, i) => {
        const active = Math.abs(i - f.ai) <= 1;
        return (
          <Page key={pg.id} id={pg.id} index={i} rail={pg.rail} dark={pg.dark} travel={pg.travel ?? TRAVEL_VH} last={i === PAGES.length - 1} progress={f.P[i]?.p ?? 0} leaving={f.P[i]?.leaving ?? 0}>
            <PageBody def={pg} progress={f.P[i]?.p ?? 0} entering={f.P[i]?.entering ?? 0} active={active} boil={active ? f.boil : 0} reduced={f.reduced} clock={i === 0 ? f.clock : 1} vw={f.vw} seen={f.seen[i] ?? false} />
          </Page>
        );
      })}
      <PortfolioFooter />
      {/* He is drawn on the active page: stacked just above its sheet, so the next sheet rising over it covers him too. */}
      <div className={[styles.figureLayer, PAGES[f.ai]?.dark ? styles.figureOnDark : ''].join(' ')} data-zone="figure" data-owner={f.ai} hidden={f.fig.hidden} style={{ transform: `translate(${f.fig.x.toFixed(1)}px, ${f.fig.lift.toFixed(1)}px)`, opacity: f.fig.drawn > 0 ? 1 : 0, zIndex: 11 + 2 * f.ai }}>
        <Figure state={f.fig} className={styles.figure} />
      </div>
      <div className={styles.pagenum} data-zone="pagenum" aria-hidden="true">{f.ai + 1}</div>
      {!f.scrolled && f.ai === 0 ? <div className={styles.note} aria-hidden="true">scroll ↓</div> : null}
    </main>
  );
}
