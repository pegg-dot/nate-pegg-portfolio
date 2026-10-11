# Della story redesign

Status: implementation complete in an isolated worktree; local release verification completed. Production verification follows the release commit.

## Scope
Replace only /work/della with a Della-specific narrative. Preserve approved prose from f5bc2c8 verbatim. The homepage, signature and rowing animation are out of scope.

## Design
Paper and editorial type carry Nate's narration. White and cobalt product surfaces carry the work. One booking moves through guarded states; customer context carries between two recollections; a draft stops at the owner approval boundary. No forced scroll playback, invented transcript, live backend connection, or invented performance data.

## Implementation and review
Existing Next/React application + Motion. Small deterministic local state machines; no agent runtime in the public portfolio. Review copy/evidence separately from browser interaction. Run browser tests, accessibility scans and inspect screenshots. No tests skipped or weakened to pass.

## Release gates
- Every original paragraph and brief fact remains available.
- A demo booking can only be verified after a successful demo receipt.
- A failed booking is never presented as booked.
- Replay, previous, scenario switching, keyboard, Escape and focus restoration work.
- No action calls the actual Della or Square services.
- No private customer details in new assets. Captures are not traction claims.
- Responsive at 360, 390, 768, 1024 and 1440 pixels.
- Reduced-motion and no-JavaScript retain the explanation.
- Lint, build, Chromium and WebKit checks pass.
- Inspect local screenshots, then verify deployed route and retained home route.


## Implementation evidence

- Baseline source: `f5bc2c8`. All 16 prose blocks and four brief facts retained verbatim. The four facts are now in native expandable Project notes, not equal-sized summary cards.
- The deterministic demo reducer cannot generate a matching receipt before step 4. Previous/reset/scenario switches clear any receipt. Failure never presents a verified booking.
- Browser request monitoring exercised success, failure, approval, memory and context controls without contacting Della, Square, Retell or Telnyx and without mutating requests.
- Measured browser positions showed the booking request travel from x=657.86 to x=1005.56 through intermediate frames. The memory token moved from x=124.11 to x=763, also through intermediate frames. This verifies rendered movement, not just state attributes.
- Chrome and WebKit exercise all core flows at 360, 390, 768, 1024 and 1440px widths. The suite also checks changing reduced-motion preference without reloading, no-JavaScript reading, keyboard navigation, and automated WCAG A/AA checks on both the page and the modal drawer.
- Ten reviewed baseline screenshots cover the opening, verified booking, approval drawer, mobile booking and mobile memory in both browser engines. Baselines are macOS-specific.
- Native dialogs were supplemented with explicit focus cycling because native Shift+Tab could leave focus on browser chrome. Mac WebKit's full keyboard access uses Option+Tab for the skip-link test without changing the user's system preferences.
- Reduced-motion preference uses a direct `useSyncExternalStore` media query subscription for SSR-safe initialization and runtime preference changes.
- Automated accessibility checks are useful coverage, not a guarantee of complete accessibility. Keyboard and rendered-state inspection are separate checks.

## Asset provenance and scope

`public/della/workspace-context.webp` is a 1760x1250, approximately 131KB derivative of the existing earlier `room-identity.png`. Phone and identifying name/account areas are burned out of the pixels before export. The caption explicitly says it is an earlier interface capture, not traction or revenue evidence. The original public images elsewhere in the portfolio are not removed or replaced by this scoped change. The more recent uploaded dashboard screenshots are not published by this change.

No invented real customer, quote, API receipt, revenue figure or latency measurement is added. Booking data and draft copy are explicitly illustrative. The chipped-nail text stays a recollection, not a verbatim transcript.

## Review limitation

A read-only independent Claude Code review was attempted with tools limited to Read/Glob/Grep, but could not run because that account's weekly usage limit had been reached. It is not counted as a completed independent review. Source review, direct visual inspection, deterministic checks and Playwright verification were performed separately.
