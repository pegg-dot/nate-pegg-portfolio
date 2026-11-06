# Pencil Test Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio home page as a scroll-driven, pencil-on-paper sketchbook with a walking stick-figure Nate, without changing one word of Nate's copy.

**Architecture:** A new `src/app/sketchbook/` tree replaces `PortfolioStory` behind `page.tsx`. Pure modules (`pencil.ts`, `figure.ts`, `pages.ts`, `wireframes.ts`, `copy.ts`) hold all geometry and text and are unit-tested through Playwright imports, the way `tests/della.spec.ts` imports `demo-state`. One client component (`Sketchbook.tsx`) owns a single requestAnimationFrame clock (eased scroll + 8 Hz boil tick) and passes a progress value to each page; pages are presentational. Styles live in one CSS module so `globals.css` and every `/work/*` page stay byte-identical.

**Tech Stack:** Next.js 16 app router, React 19, TypeScript strict, CSS modules, `roughjs` 4.6.6 (new runtime dep), `potrace` 2.1.8 (new dev dep, build-time only), Playwright 1.64 + axe (existing).

**Spec:** `docs/superpowers/specs/2026-11-05-pencil-test-redesign-design.md`

## Global Constraints

- Every string in `tests/fixtures/home-original-copy.json` must appear verbatim on `/` (spec §6, voice lock). No new first-person sentences anywhere.
- `globals.css` and everything under `src/app/work/` are not modified (spec §3, §10). `RowingSketch.tsx` gets one additive prop only.
- Added JavaScript shipped to `/` stays under 60 KB gzipped over the baseline recorded in Task 1 (spec §6).
- Boil runs only on the active page and its neighbors; off-screen strokes freeze (spec §6).
- Reduced motion and no-JS both render the final drawn state with all copy and images (spec §6).
- No element in zones `figure, bubble, tabs, curl, copy, canvas, caption, pagenum` may overlap another zone at widths 360, 390, 768, 1024, 1440 and page progress 0.1, 0.5, 0.9 (spec §11.4).
- Little Nate and desk objects share the ground line; the figure walks in a reserved bottom strip (`--strip`) no content enters (spec §11.1, §11.6).
- Sketch-becomes-real uses a wireframe traced from the real image, revealed in place (spec §11.2). He hops only over the mug on the desk page (spec §11.3). The curl fades as its page leaves (spec §11.5).
- Color appears only on real images/video, the Coke can, Miami, and the shirt on the About page after the fun fact (spec §5).
- Commit after every task with a `feat:`/`test:`/`chore:` prefix and the Co-Authored-By trailer used in this repo's recent commits.

## Review Focus

1. A reader who scrolls fast (trackpad fling) must never see a page with copy hidden: copy turns on at p > 0.06 and stays on once a page has been passed. Test in Task 11 (`copy stays visible after fast scroll`).
2. A 1440 × 700 short-and-wide viewport (laptop with a docked bar): the canvas must not push the copy into the strip. Test in Task 11 overlap matrix, add viewport 1440 × 700.
3. Fonts not yet loaded on first frame: Kalam swaps in; layout must not jump the tabs or bubble. Test in Task 5 (`tabs do not move after fonts.ready`).
4. The Della video blocked by autoplay policy (Safari low power): the fallback image must sit under the wireframe so the reveal still shows a real screen. Test in Task 6 (`della reveal shows the fallback image when video is paused`).
5. Keyboard-only reader: Tab order reaches every project link without the figure or bubble stealing focus; the bubble's links are only focusable while the bubble is shown. Test in Task 11 (`tab order reaches all eleven subjects`).

---

### Task 1: Voice lock and baseline

**Files:**
- Create: `src/app/sketchbook/copy.ts`
- Create: `tests/fixtures/home-original-copy.json`
- Create: `tests/sketchbook-copy.spec.ts`
- Create: `playwright-sketchbook.config.ts`
- Modify: `package.json` (scripts `test:sketchbook`, deps)

**Interfaces:**
- Produces: `HOME_COPY` from `copy.ts`: `{ intro, rightNow, origin: { label, heading, body }, projects: { della, vialgrade, transformer }: { rail: [string,string,string], whatLabel, lead, rest, actions: {label, href, external}[], buildLabel, buildHeading, buildBody, chips: string[] }, desk: { rail, label, heading, rows: {num, title, what, meta, href, liveHref?}[] }, drawings: { rail, heading, p1, p2, igHandle, igHref, pieces: {src, alt, caption, note?}[] }, rowing: { rail, heading, p1, p2, la28Href, la28Text, photos }, about: { heading, p1, p2, p3 }, nav: {label, href}[] }`. Every string copied character-for-character from `src/app/PortfolioStory.tsx` at commit `0b8dbd0` (curly apostrophes in the drawings paragraphs stay curly).

- [ ] **Step 1: Write the fixture** `tests/fixtures/home-original-copy.json` as `{ "sourceCommit": "0b8dbd0", "strings": [...] }` holding: the sr-only h1, the intro sentence, the "RIGHT NOW" line, the origin heading and paragraph, for each of Della/VialGrade/Transformer the WHAT IT IS paragraph (one string, lead + rest), the build heading and paragraph, every chip, every rail label, the desk heading, every desk row `what` and `meta`, the two drawings paragraphs, the six captions, the two rowing paragraphs, the three About paragraphs, and the footer strings "one more thing...", "After Abundance", "Read the paper".
- [ ] **Step 2: Write the parity test** in `tests/sketchbook-copy.spec.ts`:

```ts
import fixture from './fixtures/home-original-copy.json';
test('every locked string is on the home page', async ({ page }) => {
  await page.goto('/');
  const main = page.locator('main');
  for (const s of fixture.strings) await expect(main).toContainText(s);
});
test('every subject is one click away', async ({ page }) => {
  await page.goto('/');
  for (const href of ['/work/della','/work/vialgrade','/work/transformer','/work/lot','/work/webuddy','/work/npgktrades','/work/say-no-to-plastic','/work/grounds-guide','/work/movemate','#draw','#row','#about','https://github.com/pegg-dot','mailto:nate@natepegg.com','/writing/after-abundance.pdf'])
    await expect(page.locator(`a[href="${href}"]`).first()).toBeAttached();
});
```
- [ ] **Step 3: Write `playwright-sketchbook.config.ts`** copied from `playwright.config.ts` with `testMatch: "**/sketchbook*.spec.ts"`, port `3149`, env `SKETCHBOOK_TEST_URL`, json output `test-results/sketchbook-results.json`.
- [ ] **Step 4: Add scripts and deps**: `"test:sketchbook": "playwright test -c playwright-sketchbook.config.ts"`, `"trace:art": "node scripts/trace-art.mjs"`; `npm i roughjs@4.6.6` and `npm i -D potrace@2.1.8`.
- [ ] **Step 5: Run the parity test against today's page**: `npm run build && npm run test:sketchbook -- sketchbook-copy`. Expected: PASS on both browsers (this proves the fixture is correct before anything changes). Record the build output line for route `/` (First Load JS) in the commit message as the baseline.
- [ ] **Step 6: Write `copy.ts`** with `HOME_COPY` as specified; add to the parity spec a test that every fixture string is contained in `JSON.stringify(HOME_COPY)`, run it (no server needed), expect PASS.
- [ ] **Step 7: Commit** `test: lock home copy and record baseline`.

### Task 2: Pencil primitives

**Files:**
- Create: `src/app/sketchbook/pencil.ts`
- Test: `tests/sketchbook-pure.spec.ts`

**Interfaces:**
- Produces: `type Pt = [number, number]`; `rng(seed: number): () => number` (mulberry32); `dense(pts: Pt[], step = 3): Pt[]`; `wobble(pts: Pt[], seed: number, amp: number): Pt[]` (perpendicular drift with 0.72 decay, as in the pencil test); `toPath(pts: Pt[]): string` (quadratic through midpoints, `'M0 0'` for fewer than 2 points); `circle(cx, cy, r, n = 28, start = -1.2, over = 2.08): Pt[]`; `arc(cx, cy, r, a0, a1, n = 10): Pt[]`; `rect(x, y, w, h): Pt[][]` (four strokes with 2 px overshoot at corners); `variants(pts: Pt[], seed: number, amp: number, count = 3): string[]`; `type Stroke = { pts: Pt[]; start: number; end: number; cls?: string; amp?: number; seed?: number }`; `seq(groups: Pt[][], start: number, end: number, cls?: string, amp?: number): Stroke[]` (equal sub-ranges in order).

- [ ] **Step 1: Write failing tests**: `wobble` is deterministic for a seed and differs across seeds; `wobble` never moves a point more than `3 * amp`; `dense` of a 30 px segment at step 3 has 11 points; `toPath` of one point is `'M0 0'`; `circle` ends past its start (overshoot); `seq` of 4 groups over [0.2, 0.6] yields starts `0.2, 0.3, 0.4, 0.5`; `variants` returns 3 distinct strings.
- [ ] **Step 2: Run** `npm run test:sketchbook -- sketchbook-pure` → FAIL (module missing).
- [ ] **Step 3: Implement `pencil.ts`** with the signatures above.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** `feat: pencil primitives for boil and draw-on`.

### Task 3: Little Nate

**Files:**
- Create: `src/app/sketchbook/figure.ts`, `src/app/sketchbook/Figure.tsx`
- Test: `tests/sketchbook-pure.spec.ts` (append)

**Interfaces:**
- Consumes: `pencil.ts`.
- Produces: `type PoseKind = 'walk' | 'idle' | 'hop' | 'sit' | 'row' | 'lookup'`; `STROKE_COUNT = 15`; `STROKE_CLASSES: string[]` (index 7 `s1`, 8 `s2`, 9 `s3`, 10 `alien`, 13 `eye`, 14 `pencil`, others `''`); `FRAME_COUNTS: Record<PoseKind, number> = { walk: 8, idle: 2, hop: 1, sit: 2, row: 2, lookup: 1 }`; `pose(kind: PoseKind, phase: number): (Pt[] | null)[]` in a 60 × 92 box, feet at y = 82 for standing poses; `buildFrames(): Record<PoseKind, string[][][]>` indexed `[frame][variant][stroke]` with 2 variants, amp 0.9; `type FigureState = { pose: PoseKind; frame: number; variant: number; drawn: number; colored: boolean }`; `Figure({ state, className }: { state: FigureState; className?: string })` renders `<svg viewBox="0 0 60 92" data-zone="figure">` with 15 `<path pathLength="1">`, draw-on via `drawn` (stroke k visible when `drawn > k/15`), class `colored` toggles stripes blue/red/blue and alien green.
- `row` pose: seated, both arms forward then back across the two frames, no legs below the hull line (y > 70 empty). `lookup`: idle with the eye dot 2 units higher.

- [ ] **Step 1: Write failing tests**: `pose` returns exactly 15 entries for every kind; standing poses put the lowest leg point within 1 of y = 82; `hop` has no point below y = 78 (legs tucked); `buildFrames().walk.length === 8`, each frame has 2 variants of 15 strings; `sit` and `row` differ between frame 0 and 1.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement `figure.ts` and `Figure.tsx`**. Geometry from the pencil test (head r 8.5 at (30,14), hip at y 52, limb helper), moved down so feet rest at y 82.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** `feat: little Nate poses and figure component`.

### Task 4: Clock, pages and sketch components

**Files:**
- Create: `src/app/sketchbook/useScrollClock.ts`, `src/app/sketchbook/pages.ts`, `src/app/sketchbook/Page.tsx`, `src/app/sketchbook/Sketch.tsx`, `src/app/sketchbook/Rough.tsx`, `src/app/sketchbook/sketchbook.module.css`
- Modify: `src/app/layout.tsx` (add `<script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />` as the first child of `<body>`)
- Test: `tests/sketchbook-pure.spec.ts` (append)

**Interfaces:**
- Produces: `type Clock = { scroll: number; dt: number; elapsed: number; boil: number; reduced: boolean; vw: number; vh: number }`; `useScrollClock(onFrame: (c: Clock) => void): void` (one rAF loop, `scroll` eased by `1 - exp(-dt/90)`, `boil = floor(elapsed / 125)`, `reduced` from `prefers-reduced-motion` and then `scroll = window.scrollY` unsmoothed); `pageProgress(top: number, height: number, scroll: number, vh: number): { p: number; leaving: number }` with `p = clamp((scroll - top) / (height - vh))` and `leaving = clamp((vh - (top + height - scroll)) / 120)`; `activeIndex(tops: number[], scroll: number): number` (last top ≤ scroll + 1).
- `Page({ id, index, rail, dark, height, progress, leaving, children })`: `<section class="page" id data-page>` with `.stage` (sticky, `padding-bottom: var(--strip)`), rail `data-zone="rail"`, children, curl `data-zone="curl"` scaled by `0.18 + 0.82 * clamp((p - .8) / .2)` and opacity `1 - leaving`, page number `data-zone="pagenum"` only on the active page (rendered once in `Sketchbook`, not per page).
- `Sketch({ strokes, progress, active, viewBox, className, boil })`: `<svg data-sketch>` of `<path pathLength="1" data-stroke>`; per stroke `visibility = v > 0 ? visible : hidden`, `stroke-dashoffset = 1 - v`; `d = variants[boil % 3]` only when `active`. Variants memoized on the `strokes` array identity.
- `RoughBox({ seed, fill, className, children })`: an absolutely positioned `<svg>` behind `children`, drawn with `rough.svg(...).rectangle` (roughness 1.6, bowing 1.4, stroke `#2a2924`) after mount via `ResizeObserver`; renders nothing server-side; `RoughTape({ seed, side })` two short diagonal rough lines.
- CSS module tokens: `--paper #f3efe3`, `--ink #2a2924`, `--ink-soft`, `--ink-faint`, `--red #c9442f`, `--blue #2335db`, `--green #3fa34d`, `--strip: 150px` (desktop) / `112px` (≤ 780 px), `--hand: 'Pencil Notes', cursive` (already declared in globals), paper grain, vignette, binding strip, `html:not(.js)` block forcing final state with `!important`.

- [ ] **Step 1: Write failing tests** for `pageProgress` (p = 0 at top, 1 at `top + height - vh`, leaving = 0 while the section bottom is below the viewport, 1 when it is 120 px above) and `activeIndex` (`[0, 1600, 3200]` with scroll 1599 → 0, 1600 → 1).
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** `pages.ts`, `useScrollClock.ts`, `Page.tsx`, `Sketch.tsx`, `Rough.tsx`, the CSS module, and the layout script.
- [ ] **Step 4: Run** → PASS; `npx tsc --noEmit` → clean.
- [ ] **Step 5: Commit** `feat: scroll clock, page shell, sketch and rough primitives`.

### Task 5: Cover and shell

**Files:**
- Create: `src/app/sketchbook/Sketchbook.tsx`, `src/app/sketchbook/pages/Cover.tsx`, `src/app/sketchbook/NameCover.tsx`, `src/app/sketchbook/Tabs.tsx`, `src/app/sketchbook/Bubble.tsx`, `src/app/sketchbook/Binding.tsx`
- Modify: `src/app/page.tsx` (render `<Sketchbook />`)
- Test: `tests/sketchbook.spec.ts`

**Interfaces:**
- Produces: `type FigureScript = (p: number, vw: number, figW: number) => { x: number; pose?: PoseKind; lift?: number; hidden?: boolean }`; every page module exports `figureScript: FigureScript` and a default component `({ progress, active, boil, reduced })`.
- `Sketchbook` also owns a `keydown` handler: ArrowRight/ArrowLeft scroll by 0.35 vh (smooth), Space triggers a cosmetic hop (`lift` arc over 500 ms) without scrolling the page (`preventDefault` only when the target is `body`).
- `Sketchbook` composes: `Binding`, `Tabs` (`data-zone="tabs"`, five links from `HOME_COPY.nav`, vertical on the right ≥ 781 px, horizontal bottom row below the strip on phones), pages in order, the fixed figure layer `data-zone="figure"` (hidden on the rowing page), `Bubble` (`data-zone="bubble"`, cover only, `inert` when hidden), page number, `PortfolioFooter` (unchanged).
- `NameCover`: the three stroke strings from `HandwrittenName.tsx`, sampled every 4 px, three variants amp 1.5, written on a clock over 3.4 s from mount; `document.fonts.ready` not required; any `scroll`, `keydown`, `pointerdown` sets the clock to done. Pencil group from `DrawingPencil` follows the tip. The figure draws on from 62% to 84% of the clock, then `lookup` pose for 1 s, then idle.
- Cover figure script: `x` from `vw/2 - figW/2` to `0.86 vw` over p 0.15 → 1.

- [ ] **Step 1: Write failing tests** in `tests/sketchbook.spec.ts`: `the cover is complete at rest`: after `goto('/')` and 4 s, every `[data-name] path` has `stroke-dashoffset` `0` and `#intro` opacity 1; `scrolling finishes the name instantly`: goto, `mouse.wheel(0, 300)` at 200 ms, then every name path offset `0` within 300 ms; `tabs do not move after fonts.ready`: record tab rects before and after `document.fonts.ready`, equal within 1 px.
- [ ] **Step 2: Run** → FAIL (old page has no `[data-name]`).
- [ ] **Step 3: Implement** the files above; wire `page.tsx`.
- [ ] **Step 4: Run** → PASS. Then start `next dev -p 3149`, open `/` in the browser pane at 1024 and 375 wide, screenshot the cover at rest and after a scroll; confirm nothing overlaps the name.
- [ ] **Step 5: Commit** `feat: sketchbook shell and cover`.

### Task 6: Della page (the signature move)

**Files:**
- Create: `src/app/sketchbook/wireframes.ts`, `src/app/sketchbook/pages/Origin.tsx`, `src/app/sketchbook/pages/Della.tsx`, `src/app/sketchbook/ProjectCopy.tsx`, `src/app/sketchbook/Reveal.tsx`
- Test: `tests/sketchbook.spec.ts` (append)

**Interfaces:**
- `wireframes.ts` produces `WIREFRAMES: Record<'della' | 'vialgrade' | 'transformer', { viewBox: string; strokes: Pt[][] }>` traced by hand from `public/della/room-identity.png` (3520 × 2500), `public/vialgrade/home.jpg` (1440 × 1000) and `public/transformer/qkv.webp` (measure it): the sidebar, header bar, main panels and 6–10 row lines of each, as `rect`/line strokes in image pixel coordinates, 18–30 strokes each. Also `DESK_PHONE`, `RING: Pt[][]` (three arcs), `MUG`, `MAGNIFIER`, `VIAL`, `TOKEN_BLOCK`, and `DESK_OBJECTS: { slug: string; strokes: Pt[][] }[]` for house, storefront, chart, bottle, map pin, moving box, each 60–90 units tall with its base at y = 0 (ground line).
- `Reveal({ kind, progress, active, boil, media })`: `data-zone="canvas"`, draws `WIREFRAMES[kind]` over p 0.12 → 0.5, hatch strokes (26 diagonals, `cls: 'hatch'`) over 0.55 → 0.8, `media` (an `<Image fill>` or `<video>` with its fallback `<Image>` underneath) opacity `clamp((p - .6) / .2)`, wireframe opacity `1 - clamp((p - .78) / .1)`, hatch opacity `1 - clamp((p - .86) / .08)`; aspect ratio from the viewBox.
- `ShadedHeading({ text, progress, as = 'h2' })`: the heavy sans heading revealed by a pencil-shading mask (CSS `mask-image` of a repeating 45° hatch gradient whose `mask-size` width grows with `progress`, final state full), used for every big heading from here on.
- `ProjectCopy({ project })`: `data-zone="copy"`, the WHAT IT IS block, actions as `RoughBox` links, THE BUILD heading/paragraph, chips as handwritten labels with a pencil underline stroke.
- `Della` page: rail `HOME_COPY.projects.della.rail`; ground objects: `DESK_PHONE` on the ground line at x = 0.3 vw drawn over p 0.05 → 0.14, `RING` visible only for p in (0.14, 0.3) alternating opacity on the boil tick; `Reveal kind="della"` with the existing `<video src="/della/della-promo-home.mp4" autoPlay muted loop playsInline>` and fallback `<Image src="/della/room-identity.png">`. Figure script: x from 0.04 vw to 0.26 vw over p 0 → 0.14 (stops beside the phone), then to 0.9 vw over 0.5 → 1. `Origin` page: label, heading, paragraph; figure walks in from the left carrying the pencil stroke (index 14 shown).

- [ ] **Step 1: Write failing tests**: `della wireframe becomes the real screen`: scroll to Della p = 0.95, expect the video (or fallback image) opacity ≥ 0.99 and every `[data-sketch="wireframe"] path` opacity ≤ 0.01; `ring lines only while the phone rings`: at p = 0.08 and p = 0.4 no `.ring` path is visible, at p = 0.2 at least one is; `della reveal shows the fallback image when video is paused`: `page.evaluate(() => document.querySelector('video').pause())`, p = 0.95, fallback image opacity 1.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement.** Open the three screenshots with the Read tool and write the wireframe rectangles from what is there (sidebar width, header height, row pitch) before writing `wireframes.ts`.
- [ ] **Step 4: Run** → PASS; screenshot the Della page at p 0.1, 0.25, 0.45, 0.7, 0.95 at 1024 and 375; confirm the wireframe lines sit on the real panels.
- [ ] **Step 5: Commit** `feat: origin and Della pages with wireframe reveal`.

### Task 7: VialGrade and Transformer pages

**Files:**
- Create: `src/app/sketchbook/pages/Vial.tsx`, `src/app/sketchbook/pages/Transformer.tsx`
- Modify: `sketchbook.module.css` (dark page hatch)

**Interfaces:**
- `Vial`: ground objects `VIAL` at 0.3 vw and `MAGNIFIER` held by the figure (stroke drawn from his hand, p 0.1 → 0.16); `Reveal kind="vialgrade"` with `<Image src="/vialgrade/home.jpg">`. `Transformer`: `dark` page (background `#23221e`, hatch pattern overlay, text and strokes in `--paper`), ground object `TOKEN_BLOCK` row of six blocks at his scale, figure stands on the first block (`lift` = block height); `Reveal kind="transformer"` with `<Image src="/transformer/qkv.webp">`.

- [ ] **Step 1: Write failing tests**: `vialgrade and transformer reveal their real screens` (same assertions as Della at p = 0.95 for `[data-page="3"]` and `[data-page="4"]`); `the transformer page is the only dark page` (exactly one `.stage[data-dark="true"]`).
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement.** **Step 4: Run** → PASS, screenshots at 1024/375. **Step 5: Commit** `feat: VialGrade and Transformer pages`.

### Task 8: The rest of the desk

**Files:**
- Create: `src/app/sketchbook/pages/Desk.tsx`

**Interfaces:**
- Rows from `HOME_COPY.desk.rows` rendered as today's `originList` (numbers 04–09, links, MoveMate's two actions), `data-zone="copy"`. Six `DESK_OBJECTS` on the ground line at x = 0.12, 0.24, 0.36, 0.52, 0.66, 0.80 vw (phone: at the figure's position, one at a time), each drawn over a 0.08 window as the figure arrives; the matching row gets a pencil underline stroke. `MUG` on the ground at 0.44 vw; figure script: hop (`pose: 'hop'`, `lift = -70 * sin(pi * t)`) while x crosses 0.40 → 0.48 vw. Heading `HOME_COPY.desk.heading` verbatim.

- [ ] **Step 1: Write failing tests**: `the hop happens over the mug`: sample figure `x` and `transform` at p from 0.3 to 0.6 in 0.02 steps; `lift < -10` only while the figure's center x is within the mug's bounding box ± 40 px; `each desk row keeps its link` (nine hrefs from `HOME_COPY.desk.rows`).
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement.** **Step 4: Run** → PASS, screenshots. **Step 5: Commit** `feat: desk page with objects and the mug hop`.

### Task 9: Drawings page with traced outlines

**Files:**
- Create: `scripts/trace-art.mjs`, `public/art/traced/*.json` (generated, committed), `src/app/sketchbook/pages/Drawings.tsx`
- Test: `tests/sketchbook-pure.spec.ts` (append)

**Interfaces:**
- `scripts/trace-art.mjs`: for each of the six home drawings (`bob-marley, dog-scarf, house, moose, coke-can, miami`) read `public/art/<name>.jpg`, resize to 800 px wide, threshold 128 (`potrace` options `turdSize: 40, optTolerance: 0.4`), take the 80 longest paths, write `public/art/traced/<name>.json` as `{ w, h, paths: string[] }` under 60 KB each. If `potrace`'s bundled jimp fails on Node 26, run the script with Node 22 (`nvm use 22`) and note it in the commit.
- `Drawings`: `data-zone="copy"` (heading, two paragraphs, Instagram link), six pieces in the order graphite portrait, commission portrait, architecture study, graphite, colored pencil, Miami; each piece `data-zone="canvas"` with a `RoughBox` frame + `RoughTape`, the traced outline drawing on over its 0.1 window, then the `<Image>` fading in beneath; captions `data-zone="caption"`; the three pencil notes ("Bob Marley", "Mowgli", "a little Miami") as handwritten notes beside those pieces. Figure script: walks to 0.16 vw by p 0.3 then `sit` (two frames on the boil tick); the view scales the active piece from 0.74 to 1 toward his hand.

- [ ] **Step 1: Write failing tests**: `traced art is small and present`: each JSON exists, `paths.length ≤ 80`, file size < 60 KB; `drawings arrive real after their outline`: at p = 0.95 all six images opacity 1.
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement** script, run `npm run trace:art`, commit the JSON, build the page. **Step 4: Run** → PASS, screenshots. **Step 5: Commit** `feat: drawings page with traced outlines`.

### Task 10: Rowing, About, footer

**Files:**
- Modify: `src/app/components/RowingSketch.tsx` (add optional prop `rower?: ReactNode`, rendered inside the boat group at the stern seat translate, nothing else changes)
- Create: `src/app/sketchbook/pages/Rowing.tsx`, `src/app/sketchbook/pages/About.tsx`

**Interfaces:**
- `Rowing`: two photos as taped prints (`RoughTape`), copy verbatim with the LA28 link, `RowingSketch rower={<Figure state={{ pose: 'row', ... }} />}`; the fixed figure layer is `hidden` on this page. `About`: three paragraphs; figure walks to center by p 0.5; `colored` true once p > 0.6. Footer: `PortfolioFooter` unchanged after the About page.

- [ ] **Step 1: Write failing tests**: `the shirt gets its color only on the About page`: at every page p = 0.95 except About, `[data-zone="figure"]` lacks class `colored`; at About p = 0.95 it has it; `rowing hides the walking figure` (fixed layer `hidden` while rowing is active); `RowingSketch still renders without a rower` (default export renders 5 hull strokes + 8 oar strokes as today).
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement.** **Step 4: Run** → PASS; run the existing `npm run test:della` and `test:vial` to prove deep pages unchanged. **Step 5: Commit** `feat: rowing, about and footer on the sketchbook`.

### Task 11: Overlap, motion, no-JS, keyboard and axe

**Files:**
- Create: `tests/sketchbook-layout.spec.ts`

- [ ] **Step 1: Write the overlap matrix test**: for each viewport in `[[360,780],[390,844],[768,1024],[1024,768],[1440,1000],[1440,700]]`, for each page index, for each p in `[0.1, 0.5, 0.9]`, scroll to `top + p * (height - vh)`, wait 400 ms, collect `getBoundingClientRect` of every `[data-zone]` element that is visible (opacity > 0.05, visibility visible, inside the viewport) and assert no two rects from different zones intersect by more than 2 px. Report the pair and page on failure. Also assert `document.documentElement.scrollWidth === innerWidth`.
- [ ] **Step 2: Write** `copy stays visible after fast scroll` (wheel 20 000 px in one call, then every `.copy` on passed pages has class `on`), `reduced motion shows the finished page` (`emulateMedia({ reducedMotion: 'reduce' })`, scroll 0: every `[data-sketch] path` offset 0, every canvas image opacity 1, figure static), `no javascript shows the finished page` (context `javaScriptEnabled: false`: same assertions via computed style), `tab order reaches all eleven subjects` (press Tab until focus loops; collect hrefs; expect the nine `/work/*` links plus `#draw` and `#row`), `home has no serious axe violations`.
- [ ] **Step 3: Run** `npm run test:sketchbook` → fix every failure in the page components or CSS (not by loosening the test), re-run until PASS on chromium and webkit.
- [ ] **Step 4: Commit** `test: layout, motion, no-js, keyboard and axe coverage`.

### Task 12: Budget, CI, preview, review

**Files:**
- Create: `.github/workflows/sketchbook.yml` (copy `della-reader.yml`; branches `design/sketchbook-20261105, main`; paths `src/app/sketchbook/**, src/app/page.tsx, src/app/layout.tsx, src/app/components/RowingSketch.tsx, public/art/traced/**, tests/sketchbook*, playwright-sketchbook.config.ts`)
- Modify: `ROADMAP.md` (one dated entry under the ledger: what shipped, what is deferred: his own frames, hand video, handwriting font, deep-page chrome, and the onion-skin ghost between pages from spec §5, which is left out of this plan as polish)

- [ ] **Step 1: Stop the dev server, run `npm run build`**, compare route `/` First Load JS to the Task 1 baseline; expected within 60 KB gzipped. If over, lazy-load `wireframes.ts` traced JSON per page with `next/dynamic` and re-measure.
- [ ] **Step 2: Run everything**: `npm run lint`, `npx tsc --noEmit`, `npm run test:sketchbook`, `npm run test:della`, `npm run test:vial`, `npx playwright test -c playwright-transformer.config.ts`. Expected: all PASS.
- [ ] **Step 3: Push the branch** and confirm a Vercel preview exists: `gh api repos/pegg-dot/nate-pegg-portfolio/deployments?ref=design/sketchbook-20261105` lists one with a `vercel` environment URL; open it in the browser pane and repeat the five-page screenshot pass at 1024 and 375.
- [ ] **Step 4: Request review** with superpowers:requesting-code-review on the whole branch against the spec; fix findings; commit.
- [ ] **Step 5: Commit** `chore: sketchbook CI, roadmap note`.
