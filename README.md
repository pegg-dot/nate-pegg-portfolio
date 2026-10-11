# Nate Pegg — portfolio

A scroll-driven portfolio for the Horowitz Andreessen Academy application.

## North star

The site should feel like meeting Nate through the things he keeps building, not like reading a resume or an argument that he built them.

The homepage works as an index: first say plainly what each project is, then show why it exists and a real visual of the thing. The deeper project pages carry the pivots, mistakes, learning and technical detail.

The recurring visual language is a pencil in the margins. It stays pinned while it writes the name, then only returns when it has something specific to annotate: circle a project definition, underline a claim, bracket a section, mark a drawing, or point at a moment.

## Current structure

- pencil-written name on scroll
- homepage spotlights for Della, VialGrade and Transformer
- quick explanations for the rest of the workbench
- original art scans
- Team USA story
- fuller About section
- deeper project pages for Della, VialGrade, Transformer, LOT, WeBuddy, NPGKTrades, Say No To Plastic, Grounds Guide and MoveMate
- shared project orientation on the other case studies; Della has its own narrative with local interactive booking, memory, and approval walkthroughs

## Content rule

Long-form personal prose should remain Nate's. Short copy can be assembled from Nate's own explanations and edited for clarity, but the portfolio should not become polished AI autobiography.

## Local

```bash
npm install
npm run dev
```

## Della story verification

The `/work/della` page preserves its original approved prose in `story-copy.json`. The frozen source fixture is `tests/fixtures/della-original-copy.json` (baseline commit `f5bc2c8`). Illustrative interactions have no connection to the Della backend or Square.

```bash
npm run lint
npm run build
npx playwright install webkit
npm run test:della
```

The suite uses installed Google Chrome plus Playwright WebKit on macOS. Visual baselines are platform-specific and should only be updated after inspecting the rendered changes, never just to make tests pass. Browser screenshots and reports are ignored build artifacts; the reviewed baseline images are tracked in `tests/della-visual.spec.ts-snapshots/`.

For deployed-route checks, set `DELLA_TEST_URL` to the portfolio origin. The tests never click the external Open Della links or send real messages.

## Footer writing note

The homepage footer has a native, keyboard-accessible disclosure for *After Abundance*. The PDF is the original 42-page file, unchanged (SHA-256 `3bdb1da4a89c997beda1f92650606834b7f199193533a97666d99231ea24dfb0`). It is not downloaded until a visitor follows the link. The paper retains its human-direction / AI-assisted drafting attribution.

Run `npx playwright test -c playwright-writing.config.ts` after a production build. Set `PORTFOLIO_TEST_URL` to verify a deployed origin.

## VialGrade story verification

The `/work/vialgrade` route has a project-specific document comparison, a pinned real grade projection with fictional inputs, and a non-networked referral-link explanation. Original prose is frozen in `tests/fixtures/vial-original-copy.json`.

Run `npm run test:vial` after a production build. Set `VIAL_TEST_URL` to target a deployed origin. The filename glob intentionally does not match worktree directory names. See `docs/VIALGRADE_STORY_2026-10-11.md` for source provenance, scope, and test coverage.
