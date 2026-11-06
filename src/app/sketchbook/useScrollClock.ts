'use client';
import { useEffect, useRef } from 'react';

export type Clock = { scroll: number; dt: number; elapsed: number; boil: number; reduced: boolean; vw: number; vh: number };

/**
 * One requestAnimationFrame loop for the whole sketchbook: an eased scroll value
 * (the flipbook thumb catching up) and the boil tick at 8 Hz. Under reduced motion
 * the scroll is raw and the boil never ticks.
 */
export function useScrollClock(onFrame: (c: Clock) => void): void {
  const cb = useRef(onFrame);
  useEffect(() => { cb.current = onFrame; }, [onFrame]);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = media.matches;
    const onMedia = () => { reduced = media.matches; };
    media.addEventListener('change', onMedia);
    let raf = 0;
    const start = performance.now();
    let last = start;
    let cur = window.scrollY;
    const loop = (now: number) => {
      const dt = Math.min(250, now - last);
      last = now;
      const target = window.scrollY;
      // The thumb never trails by more than a screen and a half (anchor jumps, instant scrolls).
      const maxLag = window.innerHeight * 1.5;
      if (Math.abs(target - cur) > maxLag) cur = target - Math.sign(target - cur) * maxLag;
      cur = reduced ? target : cur + (target - cur) * (1 - Math.exp(-dt / 90));
      if (Math.abs(target - cur) < 0.05) cur = target;
      const elapsed = now - start;
      cb.current({ scroll: cur, dt, elapsed, boil: reduced ? 0 : Math.floor(elapsed / 125), reduced, vw: window.innerWidth, vh: window.innerHeight });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); media.removeEventListener('change', onMedia); };
  }, []);
}
