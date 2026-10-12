# Della: reader-first editorial and visual pass

## Brief and scope

Nate asked to start a deeper hardening of the project pages with Della: clearer writing in his voice, less confusing illustrations and stronger product-specific visual explanations. This request explicitly supersedes the prior requirement to leave all 16 old prose blocks verbatim. Only the Della portfolio route changes. The Della product, other case studies, homepage animation and writing Easter egg do not change.

## What was confusing

The first version repeated the booking in two different panels. Its "call" showed a ticket, not a conversation. Five technical steps had to be clicked before the outcome made sense. Oversized memory cards turned a personal anecdote into a second UI tutorial. Owner approval opened a full-height modal to explain one short draft. The added copy described the demonstration more than the work.

## Editorial choices

- Start with what Della does while a customer is on the phone. Introduce the broader ambition separately and as a direction, not as already-operational autonomy.
- Keep Nate's original reasons, March 11/OpenOperator origin, medspa-to-nail-salon change, booking failure, chipped-nail recollection, live-vs-saved information distinction and ongoing reliability/latency work.
- Use first-person explanations and contractions. Remove report labels, placeholder success IDs and repetitive "in this demo" wording.
- Define the harness only in optional technical detail. Do not invent a customer, a transcript, a measured response time, revenue or paid-salon traction.
- Keep the original frozen fixture and previous design note as historical provenance. They are not silently replaced with the new copy and called original.

## New experience

The complete booking illustration is visible at rest, including without JavaScript. Replay is optional, user-started, pausable and finishes once. It pauses offscreen and when the tab is hidden. Reduced-motion readers get manual steps; changing the preference cannot silently restart playback. The failed case changes both the reply and the calendar, with no confirmation without a matching local receipt.

The memory story is now a short timeline of Nate's own calls, not invented quoted dialogue or a token the reader manually carries. A follow-up draft is visible inline. Local edits invalidate approval; an empty message cannot be approved. Approval is never presented as an actual send.

The original workspace capture remains available. A visible detail is cropped from the already-redacted `workspace-context.webp`, not newly generated product imagery. The full unchanged redacted capture opens on request. All imagery is labeled as an earlier interface, not current usage.

## Review and verification

Inspect the first viewport, full reading flow, failure state, edited/approved draft and phone layouts as distinct design checkpoints. Tests cover the complete default explanation, revised copy, receipt invariants, playback controls and visibility, reduced motion, keyboard operation, static reading, no network mutations, image integrity and five screen widths. The cross-project suite exercises the unchanged VialGrade, Transformer and writing behavior as well.

Run `npm run lint`, `npm run build`, and `npx playwright test -c playwright-della-harden.config.ts`. For a deployed site set `PORTFOLIO_TEST_URL` to the origin. `playwright.config.ts` continues to provide Della's reviewed macOS screenshot baselines. Do not update baselines merely to silence a regression.

Automated checks are not a verdict on writing quality or proof that every accessibility issue is absent. Inspect the actual rendered page separately. No independent agent review is claimed.

The unchanged Transformer select was additionally checked on macOS. Its regression test now uses native type-ahead (2 selects the second head) on macOS rather than assuming an ArrowDown commits a native menu choice. The original expected value and styling assertions remain. No Transformer UI source was changed.

The visible workspace detail uses a content-addressed filename to avoid reusing a stale optimized image after changing the crop. Its 1165 x 280 pixels are cropped at (250, 265) from the existing 1760 x 1250 redacted image.

Before release, 150 cross-project checks passed and the complete 160-check macOS run passed, including reviewed Della and unchanged VialGrade image baselines. The Della-specific config now scopes by filename glob rather than accidentally matching every test in a worktree whose directory contains "della". The old Della image baseline files are retained in history.

## Released and verified

Code commit `8fa3c8d02081585596264dcb6825834ad0fdbe3f` is deployed. The 150-check cross-project suite and 52-check Della suite both passed after deployment, with their browser checks directed at the public portfolio in Chromium and WebKit. Unit checks still execute in the test runner. These suites overlap; they are not 202 distinct checks. Both reports show zero failed, skipped or flaky tests. The Della suite includes the inspected desktop and phone screenshot comparisons, with no baseline updates during the deployed run.

The complete call and calendar are visible without clicking. Replay, failure, inline draft editing, keyboard operation, reduced motion, static reading and the actual image dimensions were checked. VialGrade, Transformer, the homepage and the writing-note application sources are unchanged.
