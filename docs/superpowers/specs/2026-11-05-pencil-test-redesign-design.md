# Pencil Test — portfolio home redesign (design)

Date: 2026-11-05. Status: draft for Nate's approval. Repo: `pegg-dot/nate-pegg-portfolio`, branch `design/sketchbook-20261105`.

"Pencil test" is the animation term for the rough, frame-by-frame line animation shot on paper before clean-up or color. That is the whole aesthetic and the whole idea: the site is Nate's sketchbook being drawn in front of you, one imperfect frame at a time.

## 1. Intent and why

The current home page is a clean scroll of sections with one good trick (the pencil writing the name). It says what Nate built but not who he is. Nate's own words for the goal: make it "absolutely cracked," "say a lot about me," keep every sentence his, and convey all the work.

Who Nate is, from the site and his words: he has drawn since preschool (photoreal graphite portraits, dog commissions through Instagram, a full-color Miami collage on a spiral pad), he builds things to understand them (a transformer from scratch, Della, VialGrade), he rowed for Team USA, he grew up in Miami, he is a first-year at UVA, and at four he wore the same striped alien shirt every day. The medium that is unmistakably his is pencil on paper. The reference he sent is a beginner's guide to animating on paper (flipbook, line boil, drawn on twos). The advice he got from the Anthropic person was that who you are is everything and the site should carry it. For that person it was a math thing. For Nate it is a drawing thing.

The one-sentence thesis: **"I draw it, then I build it."** Every project on the page is first sketched by the pencil and then the sketch becomes the real thing. The drawings section runs the same move in reverse: a real photo becomes his graphite. That transition is the signature of the site, and it is literally what he does.

## 2. Goals

1. A reader who gives the page ninety seconds understands the person first (draws, builds, rows, Miami, UVA) and can find every project in one click.
2. The page feels drawn on paper, frame by frame, imperfect on purpose: pencil grain, line boil, page corners, onion-skin ghosts, hand-numbered pages.
3. A small drawn character ("little Nate", a stick figure in the striped alien shirt) walks through the sketchbook as you scroll and reacts to each project. He is the personality. He never blocks the content.
4. Every first-person sentence stays exactly as it is on the live site today. Structure changes; the autobiography does not (VOICE_PASS.md).
5. All eleven subjects remain reachable from the home page: Della, VialGrade, Transformer, LOT, WeBuddy, NPGKTrades, Say No To Plastic, Grounds Guide, MoveMate, Drawings, Rowing, plus About, the footer writing note, GitHub and email.
6. Works with reduced motion, without JavaScript, on a phone, and faster than the current page above the fold.

## 3. Non-goals

- No rewriting, adding, or "improving" Nate's copy. No new first-person sentences. New text is limited to labels already in use ("story →", "live ↗", "code ↗", page numbers).
- No changes to the deep pages under `/work/*`, not even the shared chrome. Those pages carry verified copy, pixel baselines and CI workflows; Della and VialGrade have their own headers. Paper chrome on the deep pages is a separate follow-up after this ships (my call, from the builder check).
- No 3D, WebGL, or shader post-processing. 2D SVG and canvas only.
- No game: no collision, no score, no fail state, no required input beyond scrolling.
- No sound.
- No CMS or admin; content stays in code.

## 4. Anti-goals (what would make this a failure even if it works)

- Looks like a "sketchy theme": rough.js on every box, wobble on everything, Comic-Sans energy. Boil belongs on pencil marks, never on paragraphs.
- An intro you cannot skip, or a reviewer trapped in a side-scroller looking for the work.
- Slower on a phone than today, or jank while scrolling on a 2020 MacBook Air.
- Any sentence Nate would read and think "I would never say that."
- Decoration without meaning. Pivot 3 in ROADMAP.md stands: the pencil only marks what it has something to say about.

## 5. The experience, page by page

The home page is a spiral-bound sketchbook, binding along the top edge like Nate's Miami pad. Each section is a page. Scrolling is the flipbook thumb: as you move between pages the bottom-right corner curls, the previous page ghosts through at low opacity for a beat (onion skin, the animator's tool), and the new page's elements draw themselves in. Page numbers are hand-written in the corner. Nothing on a page is pre-rendered chrome; frames, rules, labels and headings are drawn on as you arrive. "It builds itself," as Nate put it.

Little Nate walks along the bottom of the paper as you scroll. His position is a function of scroll progress inside each page. He walks when you scroll, idles when you stop (two-frame idle so the lines keep breathing), hops over a couple of placed obstacles between pages, and performs one small reaction per project. He is drawn in true flipbook style: two hand-drawn variants per pose, swapped on twos (twelve frames a second, six changes), so his lines boil like a real pencil test rather than a smoothed vector.

Color rule (this is the "ultra realistic, then colorful, then gray" range Nate described, made into a rule rather than a mood): the sketchbook is graphite on cream. Color enters only when something is real or built: the real product screenshot or video inside the drawn frame, the colored pencil Coke can, the Miami page, and, once, on the character's shirt in About when the fun fact lands. Gray is imagination and drafts; color is the built or lived thing.

Pages:

0. **Cover.** Blank paper. The existing pencil writes "Nate Pegg" using the strokes already in `HandwrittenName`, but on a clock, not on scroll: it writes itself in about three seconds on arrival, and any scroll, key press or tap finishes it instantly (my call; today it is scroll-driven across a tall hero, which leaves a blank first screen). The intro line and the nav tabs are visible without scrolling. The pencil then draws little Nate at the bottom, who looks up at the name. The intro line appears in place: "I'm a first-year at UVA. I like building things, drawing, and messing around with AI." The "RIGHT NOW: DELLA · VIALGRADE · MOVEMATE · GROUNDS GUIDE" line becomes a thought bubble over his head; each name is a link. Nav (work / drawings / rowing / about / github ↗) is drawn as tabs sticking out of the sketchbook's right edge and stays reachable on every page. A drawn corner curl hints at the flip.

1. **How I got into this.** Heading "I've always liked creating things." and its paragraph, verbatim. Little Nate walks in from the left carrying a pencil.

2. **Della (01).** Little Nate walks up to a drawn phone on a drawn desk; it rings (boiling sound lines). The pencil sketches a calendar and a storefront; the sketch becomes real: the lines dissolve under a hatching wipe into the actual Della video (`/della/della-promo-home.mp4`) inside the drawn frame. Copy verbatim: WHAT IT IS paragraph, the two actions, THE BUILD heading and paragraph, the four chips (as handwritten labels with pencil underlines).

3. **VialGrade (02).** Little Nate holds a drawn magnifying glass over a drawn vial; sketched documents slide in; the sketch becomes the real `vialgrade/home.jpg`. Copy verbatim, three actions.

4. **Transformer (03).** This page is shaded dark with heavy graphite hatching (the one dark page, replacing today's dark band), with white-pencil lines. Little Nate stands tiny on a token; a sketched attention grid lights up and becomes the real `transformer/qkv.webp`. Copy verbatim, three actions, four chips.

5. **Other things (04, "the rest of the desk").** Heading "A few other things I've built or am still working on." verbatim. Drawn literally as objects on a desk: a house (LOT), a storefront (WeBuddy), a chart (NPGKTrades), a bottle and body outline (Say No To Plastic), a map pin (Grounds Guide), a moving box (MoveMate). Little Nate walks the desk; each object draws itself as he reaches it and its row of existing text appears beside it. He hops over a coffee mug between two of them. Rows keep today's copy, numbering, links, and MoveMate's two actions.

6. **Drawings (10).** Little Nate sits down and starts drawing; the view zooms toward the paper under his hand (Nate's "zoom into the hand" idea) and the drawings arrive in order graphite portrait (Bob Marley), commission portrait (dog), architecture study, graphite (moose), colored pencil (Coke can), Miami. Each arrives as its traced outline drawing on, then the real photo fading in beneath (real becomes drawing, the reverse of the project move). Captions and both paragraphs verbatim, Instagram link kept.

7. **Rowing (11).** The existing `RowingSketch` boat, but little Nate is one of the two rowers. Photos are taped-in prints (drawn tape). Both paragraphs verbatim, LA28 link kept.

8. **About.** Three paragraphs verbatim. When the reader reaches the fun fact, little Nate walks in and the pencil colors his shirt: blue and red stripes and the little green alien. This is the only time color touches the character and it is the payoff for why he wore that shirt the whole way. (The "tigre?" easter egg exists as a component but is not on the live page; it stays off unless Nate wants it back, see section 9.)

9. **Footer.** "one more thing..." disclosure and the After Abundance PDF stay. Signature, GitHub, email, top.

Reviewer path: the nav tabs and the thought bubble are always one click from any project; each page is a real section with an id, so deep links and the tab key work. A reader who never scrolls still sees the name, the intro line, and the nav.

## 6. Constraints

- Keep Next.js 16 and React 19. The home page ships no animation library today (Motion is only imported on deep pages), so the home page keeps the repo's existing hand-rolled requestAnimationFrame scroll pattern (see `HandwrittenName`, `RowingSketch`, `ScrollTrace`) plus `roughjs`. No Motion on the home page, no GSAP. The 60 KB budget below counts everything newly shipped to the home page.
- Reduced motion: no boil, no walking, no draw-on; every page in its final drawn state, real images visible, character standing still. This is a static version of the same page, not a different page.
- No JavaScript: server-rendered final state with all copy and images. Build this from scratch: a one-line inline script in `layout.tsx` adds a `js` class to `<html>`; without it, CSS shows every page in its final drawn state. Nothing like this exists in the repo yet.
- Performance budget: added JavaScript under 60 KB gzipped; 60 fps scrolling on an M1 MacBook Air and iPhone 13; Largest Contentful Paint under 2.5 s (the cover is SVG, no image above the fold). Boil runs only for elements in the viewport; off-screen marks freeze.
- Accessibility: all copy is real DOM text; pencil marks and the character are `aria-hidden`; drawn buttons are real links; focus states visible; axe clean on the home page.
- Copy parity test (the voice lock): a frozen fixture, same pattern as `tests/fixtures/della-original-copy.json`, of every first-person sentence and paragraph, every project description and meta line, every heading, every caption, and every rail label that describes content ("APR 2026 → NOW", "LIVE", "FROM SCRATCH", "GRAPHITE / COLOR", "GENOA · 2024"), plus the sr-only h1. Chrome words ("SCROLL", "NATE PEGG / 2026") and the three pencil-note labels ("Bob Marley", "Mowgli", "a little Miami") are not locked; keep the pencil notes where the marks survive.
- Mobile: pages stack vertically as today; little Nate walks along the bottom edge; bubbles become inline lines; the dark Transformer page stays dark.
- Desktop first, 360 to 1440 px checked, Chrome and WebKit, as the existing Playwright configs do.

## 7. Technical decisions (Nate handed these to me; marked as my calls)

- **Line boil, two ways.** Freeform pencil marks (sketch icons, arrows, bubbles, underlines) get three pre-computed wobble variants per path: sample the path, offset points perpendicular to the stroke by a seeded amplitude, re-emit as a smooth path. Cycle variants at 8 fps while on screen. This is the "draw it three times" method real pencil tests use, costs nothing per frame, and avoids SVG displacement filters on large areas (they are slow). The displacement-filter boil (feTurbulence + feDisplacementMap, baseFrequency cycling) is reserved for small headline elements if needed at all.
- **Character frames.** SVG path groups per pose: walk (8 frames × 2 variants), idle (2 × 2), hop (4), sit-and-draw (2), look-up (1), row (2). Shipped first as my own drawings so nothing blocks. A drop-in path lets Nate's own paper drawings replace mine: PNG frames under `public/figure/<pose>/<n>.png` (phone photo, thresholded by a build script) are used instead of the SVG when present. A `scripts/trace-figure.mjs` step with `potrace` vectorizes them if he prefers vector.
- **Sketch becomes real.** For each featured project a hand-authored SVG sketch draws on (stroke-dasharray), then a hatching mask (SVG mask of diagonal pencil strokes animating in) reveals the real image or video beneath while the sketch lines fade. For drawings, a build script (`scripts/trace-art.mjs`, node `potrace`) produces an outline SVG per image under `public/art/traced/`; the outline draws on, then the photo fades in beneath.
- **Hand-drawn chrome.** `roughjs` (MIT, ~9 KB) for buttons, frames, tape, and the nav tabs, rendered as SVG with a fixed seed so server and client match; two seeds swapped at 4 fps on hover only.
- **Scroll.** One requestAnimationFrame loop (the pattern already in the repo) with an eased scroll value. Each page is a 150–200 vh section with a sticky stage so draw-on is scrubbed by scroll; the character's x-position and the flip progress derive from the same value. Keyboard left/right nudge the scroll; space makes him hop (cosmetic). No CSS scroll-timeline dependency, since Safari and Firefox support is uneven.
- **Paper.** Keep the existing cream (`--paper`) and grain; add a fixed spiral binding along the top, a faint vignette, and occasional eraser smudges as static SVG. Dark page = heavy graphite hatching, not a flat black.
- **Type.** Kalam (already shipped, OFL) for labels, bubbles, captions, tabs, page numbers. Body paragraphs stay in a readable serif, not handwriting, because Nate's sentences must be easy to read. Big headings keep the heavy sans but appear by being pencil-shaded in (a scribble mask), so the one typeset thing on the page still gets drawn. If Nate produces a font of his own handwriting (Calligraphr, free tier covers the needed glyphs), it replaces Kalam with no code change.
- **Delivery.** Worktree `~/nate-pegg-portfolio-sketchbook`, branch `design/sketchbook-20261105`, Vercel preview from the branch, PR to main when Nate signs off.

## 8. Left to the builder

- Exact drawings of the sketch icons and the character poses (within the rule: pencil, imperfect, no clip-art look).
- Easing, durations, hop placements, and how many frames each draw-on takes.
- Exact page heights and sticky breakpoints per page.
- How the thought bubble and nav tabs collapse on phones.
- Which mark the pencil makes on each heading (circle, underline, bracket), continuing the current `ScrollTrace` vocabulary.
- Test file layout, following the existing Playwright configs.

## 9. Open items for Nate (answered in section 10 once he replies)

1. Will he draw little Nate's frames himself on paper (the video he sent is the method)? Shot list: walk 8, idle 2, hop 4, sit-and-draw 2, look-up 1, row 2, each in a 4 by 4 inch box with a corner registration mark, photographed from above in daylight. My SVG frames ship either way.
2. Does he want a 5-second phone video of his own hand drawing the first line for the cover (the "zoom into the hand" opening)? Without it the cover uses the SVG pencil.
3. Will he make a handwriting font of his own hand for the labels (Calligraphr template, about twenty minutes)? Kalam ships either way.
4. Is this still primarily for the Academy reviewer (ROADMAP.md), which keeps the "find every project in one click" rule as a hard requirement? I am treating it as yes.
5. Small one: the "tigre?" easter egg ("Tigre. It was a giraffe blanket. I called it tiger anyway.") exists in code but is not on the live page. Bring it back on the About page, or leave it off? Default: off.

## 10. Nate's answers (2026-11-05)

- Concept approved ("I like it"), with one correction: parts of the pencil test looked weird, things sat on top of other things, some moves did not make sense. Cross-check and cross-verify everything. Section 11 turns that into rules.
- Character frames: not something he wants to commit to now. My SVG frames ship; the drop-in path for his own paper frames stays so it can happen later without code changes.
- Hand video for the cover and a handwriting font: not now. The SVG pencil and Kalam ship.
- Academy reviewer first: yes. "Every project one click away" stays a hard rule.
- "tigre?" easter egg: off.

## 11. Corrections from the pencil test review

These are design rules now, not polish.

1. **One space.** Little Nate and every drawn object stand on the same ground line. On each page the ground line is the desk edge or the page's bottom rule, and the objects he walks past are drawn on it at his scale. Nothing he reacts to floats in a separate box above him.
2. **Sketch becomes real means the same shapes.** The pencil draws a wireframe of the actual screenshot or video frame (its panels, rows, headers, traced from the real image), and that wireframe becomes the image in place. A different drawing with a photo fading in on top is not allowed.
3. **He only hops over something visible.** A mug, a gap in the desk, a stack of papers. No hop over nothing.
4. **Nothing overlaps anything it should not.** Figure, thought bubble, tabs, page curl, captions, page number and the text and image columns each own a zone. A Playwright test reads the bounding boxes at several scroll positions and widths and fails on any intersection between those zones.
5. **The curl belongs to its page.** It never shows at the top of the next page. It fades out as its page leaves.
6. **Phones get a reserved strip.** The figure walks in a strip above the tabs; no canvas, caption or text enters that strip.
7. **Every pencil mark has a reason.** Ring lines only while the phone rings, hatching only during a reveal, and nothing blinks for decoration.

Added after Nate's second review (2026-11-06, on the Vercel preview):

8. **Slower.** A page plays over two screens of scroll (`TRAVEL_VH` = 200; the cover and About over 120, the walk-in over 100). The first build used one screen and moved him too fast.
9. **A turn is a sheet laid over.** The pinned page stays where it is and the next page rises over it from the bottom edge, with a paper edge and shadow. A page never slides up under the binding (the first build did, and the rowing copy ran under the coils). Each page overlaps the one before by one screen (`OVERLAP_VH`) and stacks above it. Little Nate is drawn on the active sheet, stacked just above it, so the rising sheet covers him and the pencil draws him again at the start of the next page. On a desktop the rising sheet already carries its typed copy and its heading shades in as it rises; on a phone, where the sheet passes behind the bottom tab row, copy waits for the pin. Drawing starts when the sheet pins.
10. **Nate rows bow.** In the coastal double he is in the bow seat, the seat nearer the bow, the end the boat moves toward. The "me" note points there.
11. **One pencil, and it moves.** On the cover the pencil writes the name, lifts, then draws him (never two pencils at once: the name finishes before he starts). At the start of every page the same pencil draws him again, stroke by stroke, and lifts when he is complete. When he sits and draws, his hand sweeps the page; a hand that shuffles a pixel or two reads as a pencil that does not move.
12. **The video starts when the screen does.** The Della demo does not play in the background while its wireframe is being drawn. It starts from the beginning once the real screen is up, stops and rewinds once the reader has moved on, and never starts by itself under reduced motion.

## 12. Decisions log

- 2026-11-05: design drafted after reading the live site, the repo, ROADMAP.md, VOICE_PASS.md, the eight drawings, and the reference video.
- 2026-11-05: Nate reviewed the pencil test: concept approved, execution corrections recorded in section 11, answers in section 10. Build proceeds.
- 2026-11-06 (merged, then): the Della video was already half over when the reveal finished, because it autoplayed from the moment the page scrolled into view. Rule 12 added.
- 2026-11-06 (later): "the pencil didn't move." The cover pencil was verified moving in a production build on both engines; the two real gaps were the sitting hand (a 2 px shuffle under the boil) and the figure drawing on with no pencil. Rule 11 added.
- 2026-11-06: Nate's second review on the preview: scrolling moved him too fast, and "me" sat in the stroke seat (he rows bow). His screenshot also showed the rowing copy sliding under the coils at a page turn. Rules 8–10 added; the turn reworked as a sheet laid over.
- 2026-11-05: builder check run. Settled without Nate: cover name writes on a clock and is skippable; the voice lock is defined precisely in section 6; `/work/*` is fully out of scope; the home page uses the existing rAF pattern plus roughjs, no Motion; the no-JS fallback is new work. Left for Nate: the five items in section 9.
