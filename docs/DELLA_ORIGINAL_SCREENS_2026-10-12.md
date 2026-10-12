# Della: original app screenshots and Nate's supplied wording

## Scope

Nate asked for an actual portfolio edit, not another generated product image, and supplied the wording of the origin story and the way he wanted the thoughts connected. This pass changes only the Della portfolio route and its tests. The product application is not modified.

## Writing

The origin begins with the supplied sentence: "I started working on Della in March of 2026 as OpenOperator." It keeps his foundations-of-AI study, the OpenClaw moment, his belief about agents doing computer tasks, and the missing business-specific systems/context. The adjacent move from medspas to nail salons and the lost-lead reason for starting with communications remain together in the following paragraph.

The chipped-nail anecdote and reaction are one continuous paragraph, rather than a series of short cards or one-line statements. The current work and longer-term direction are also joined. "Della" and "OpenOperator" are normalized from spoken spelling; the anecdote is a recollection, not a transcript of the screenshot. Prior testing is not described as paid-client traction.

## The images actually used

Two source crops replace the simulated booking and approval widgets. The first is the actual call activity record supplied from the app; the second is the actual inbox draft and reply area. Browser chrome, unrelated queue entries and contact details are outside the crops. One customer name in the draft greeting is covered by an opaque mask. No text, status, appointment, timestamp or UI module was invented or regenerated.

The call screenshot is not presented as a successful booking. Its activity step says "Booked", but the explanatory text says the booking system refused the write. The page acknowledges that inconsistency and the unsuccessful result. The inbox is marked "Approved. Copy and send it yourself." The caption does not claim the text was automatically sent.

`verification/della-original-crops.json` records source-image hashes, crop coordinates, the single redaction and the exact SHA-256 hashes of the two lossless WebP assets. The delivered files were checked byte for byte after transfer. The framed/generated alternatives are not deployed.

## Interaction and verification

The screenshot controls only open the original crop at its full size. There is no fake replay, approve, send or book action in the portfolio DOM. The technical explanation is a native disclosure that works without JavaScript. The page does not call Della, Square or a messaging API.

The old booking state machine is unchanged, and its numerical/receipt boundary tests remain, but the removed demonstration UI is no longer a presentation requirement. New tests check the dictated wording, merged paragraph flow, source-image integrity over HTTP, truthful captions, keyboard navigation, reduced motion, static reading and five screen widths. The first review caught two low-contrast small captions; their foreground colors were darkened without weakening the checks.

The 40-file manifest in `verification/della-originals-preserved.json` protects VialGrade, Transformer, shared layouts, homepage/animation components, original fixtures and the After Abundance PDF against the pre-pass commit. No unrelated application source is changed.

Run `npx playwright test -c playwright-authored.config.ts` for the cross-project suite. Run `npx playwright test -c playwright-authored-visual.config.ts` for reviewed image comparisons. Both accept `PORTFOLIO_TEST_URL` for deployed browser checks; unit/source checks still run in the test runner. Only the intentionally changed Della snapshots are regenerated during review, never during production verification.

## Local release checks

Lint and the production build passed. All 268 cross-project checks passed after darkening the two small captions. The 16 visual tests passed on a normal comparison run, including the newly reviewed Della views and the unchanged VialGrade and Transformer baselines. Only Della baselines were replaced; the superseded versions remain in Git history. The 40 protected files still match their baseline hashes.
