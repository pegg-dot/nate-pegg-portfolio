'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import DrawingPencil from '../components/DrawingPencil';
import { toPath, wobble, type Pt } from './pencil';
import { clamp } from './pages';
import styles from './sketchbook.module.css';

/** The same three strokes HandwrittenName writes: "Nate", the crossed t, "Pegg". */
export const NAME_STROKES = [
  'M104 218 C96 179 97 112 111 78 C118 61 128 65 130 88 C134 126 123 176 110 214 C136 180 169 126 198 86 C208 72 215 77 214 99 C212 135 205 178 208 204 C210 221 226 217 239 198 C250 180 257 164 274 163 C290 161 297 174 291 190 C285 207 268 217 254 209 C241 202 243 183 258 173 C274 162 290 173 291 192 C291 208 295 218 306 217 C321 216 330 197 336 179 C343 157 347 129 350 101 C352 83 359 82 361 98 C364 126 354 164 347 187 C341 207 345 218 359 217 C372 216 380 202 388 187 C396 173 409 168 419 174 C429 180 424 191 411 197 C399 202 386 200 382 197 C384 212 395 219 411 217 C425 215 437 207 449 195 C458 186 466 183 474 184',
  'M323 145 C338 142 354 141 371 143',
  'M116 456 C114 414 115 348 120 304 C122 282 130 274 135 293 C141 316 138 351 131 389 C140 344 158 305 187 297 C211 290 229 301 230 320 C232 341 207 355 177 354 C154 353 139 343 133 331 C137 364 140 406 143 431 C146 447 154 449 163 434 C171 418 179 397 195 394 C210 392 218 403 211 414 C204 425 188 429 174 423 C178 438 191 445 207 440 C220 436 227 424 234 412 C241 401 253 399 263 405 C274 412 273 427 263 438 C252 449 237 446 233 434 C230 422 239 410 252 407 C265 404 275 414 275 429 C275 447 269 473 261 489 C254 503 242 509 233 503 C224 497 229 488 240 489 C254 491 265 503 282 498 C298 493 305 477 309 457 C313 437 311 416 320 407 C329 398 342 399 351 406 C362 415 360 429 350 439 C339 450 325 446 321 434 C318 422 327 410 340 407 C354 404 364 414 364 430 C364 451 357 477 349 492 C342 505 332 510 323 505 C315 500 319 490 330 490 C345 491 358 503 376 498 C397 492 413 475 429 454 C444 435 458 421 477 413 C492 407 507 407 523 410',
];
type Item = { variants: string[]; start: number; end: number };
// Server-rendered fallback: the raw strokes, spread by rough length share, so the name exists without JavaScript.
const SHARE = [0.47, 0.03, 0.5];
const initial: Item[] = NAME_STROKES.map((d, k) => ({ variants: [d, d, d], start: SHARE.slice(0, k).reduce((a, b) => a + b, 0), end: SHARE.slice(0, k + 1).reduce((a, b) => a + b, 0) }));

/** Writes the name on `clock` (0–1); the pencil follows the tip and lifts when it is done. */
export default function NameCover({ clock, boil }: { clock: number; boil: number }) {
  const srcRefs = useRef<(SVGPathElement | null)[]>([]);
  const pencilRef = useRef<SVGGElement>(null);
  const lens = useRef<number[]>([]);
  const [items, setItems] = useState<Item[]>(initial);
  useEffect(() => {
    const paths = srcRefs.current.filter(Boolean) as SVGPathElement[];
    const L = paths.map(p => p.getTotalLength());
    lens.current = L;
    const total = L.reduce((a, b) => a + b, 0) || 1;
    let acc = 0;
    setItems(paths.map((sp, k) => {
      const pts: Pt[] = [];
      for (let l = 0; l <= L[k]; l += 4) { const q = sp.getPointAtLength(l); pts.push([q.x, q.y]); }
      const start = acc / total; acc += L[k];
      return { variants: [0, 1, 2].map(v => toPath(wobble(pts, 400 + k * 97 + v * 31, 1.5))), start, end: acc / total };
    }));
  }, []);
  useLayoutEffect(() => {
    const g = pencilRef.current; const L = lens.current;
    if (!g || !L.length) return;
    const total = L.reduce((a, b) => a + b, 0);
    const target = total * clamp(clock);
    let acc = 0;
    for (let k = 0; k < L.length; k++) {
      if (target <= acc + L[k] || k === L.length - 1) {
        const q = srcRefs.current[k]?.getPointAtLength(clamp(target - acc, 0, L[k]));
        if (q) g.setAttribute('transform', `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)})`);
        break;
      }
      acc += L[k];
    }
    g.style.opacity = clock >= 1 ? '0' : '1';
  }, [clock, items]);
  return (
    <svg viewBox="70 40 480 480" className={styles.name} data-name="" role="img" aria-label="Nate Pegg">
      {NAME_STROKES.map((d, k) => <path key={'src' + k} ref={el => { srcRefs.current[k] = el; }} d={d} data-src="" fill="none" style={{ opacity: 0 }} />)}
      {items.map((it, k) => {
        const t = clamp((clock - it.start) / (it.end - it.start));
        return <path key={k} d={it.variants[boil % 3]} data-stroke="" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 - t, visibility: t > 0 ? 'visible' : 'hidden' }} />;
      })}
      <g ref={pencilRef} style={{ opacity: 0 }}><DrawingPencil x={0} y={0} scale={1.6} /></g>
    </svg>
  );
}
