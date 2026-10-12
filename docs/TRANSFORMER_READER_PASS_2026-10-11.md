# Transformer reader-first hardening

## Request and scope

Nate asked for the same editorial and visual pass just completed for Della and VialGrade. The reading layer should sound like his explanation of what he built, show why it was useful to him, and be understandable before operating a technical explorer. This supersedes the old Transformer verbatim-prose lock. The original prose fixture remains unchanged as provenance.

Only the Transformer portfolio route changes. Della, VialGrade, the homepage signature and rowing animation, the After Abundance writing note, and the separate full visualizer remain unchanged.

## Reading and visuals

- A complete next-character example appears beside the opening. At RO, M has about 51.1% of the probability; the exact distribution comes from the saved trained-model logits at that position.
- The reader can inspect RO, ROM and ROMEO: or draw one character. This is not a new model run or an editable prompt. Sampling uses all 65 characters, including the 62 not individually shown. The remainder is displayed without renormalizing the top three.
- A short explanation connects character embeddings, context updates and output probabilities. It does not require the reader to know the architecture first.
- The residual connection uses one actual coordinate: 0.5370 plus 0.8794 gives 1.4164 after display rounding. It identifies its position, block and limited dimensional scope, without assigning a made-up semantic meaning to the coordinate.
- Both original visualizer images remain visible. The training scene is described as an illustration, not a measured loss landscape.
- The full five-view computation explorer remains available inside a native disclosure. All block/head/branch/temperature controls and source explanations are preserved. The new preview does not mutate its state.

## Writing

The narrative comes from Nate's original learning story: he could repeat the transformer steps but struggled to picture residual connections and training; Karpathy and 3Blue1Brown helped; implementing the model and training on Tiny Shakespeare made the parts fit together; designing a faithful visualizer was its own task. The distinction between tracing a computation and interpreting a learned representation remains explicit. No new training result or performance claim is invented.

## Protected data and verification

`capture.json` and `capture-model.ts` remain unchanged. The original numerical tests for causal attention, embeddings, residual additions, stable softmax and full-vocabulary sampling remain. The source-capture preparation script still verifies the pinned source and original prose archive; it no longer restores archived wording over the requested new copy.

The default snapshot has no automatic playback. Reduced motion is observed at load and on preference changes. Without JavaScript the prediction, residual calculation, story and model-details disclosure remain readable; inert interactive controls are hidden.

Run lint, the production build and `playwright-transformer.config.ts` for the existing advanced checks plus the new reading-layer checks. Run `playwright-model-reading-visual.config.ts` for reviewed platform-specific screenshots. Cross-project regression uses `playwright-della-harden.config.ts`. Browser tests can target production with `TRANSFORMER_TEST_URL` or `PORTFOLIO_TEST_URL`, respectively. Numerical checks still run in the test runner.

Screenshot baselines must be visually reviewed, not updated to silence a regression. Passing tests do not certify taste or complete accessibility. No independent agent review is claimed.

Test selection uses filename globs rather than a greedy pattern that can accidentally match the worktree directory name. The cross-project suite still exercises every intended behavioral case; platform-specific visual baselines run separately.

## Released and verified

Application commit `7f5eaeb53beb66f9a1102ecec5d920af134408c7` is live. The 82-check Transformer suite and six visual tests (16 reviewed image comparisons) passed against the deployed portfolio. The 198-check cross-project suite also passed on its complete final rerun. These suites overlap and are not additive counts of distinct checks. Browser checks targeted production in Chromium and WebKit; numerical/source checks still ran in the test runner.

The first production cross-project run had one network navigation timeout (`net::ERR_TIMED_OUT`) on the unchanged homepage during a 360px footer check. Its other 197 checks passed. The same full suite was rerun, without changing assertions or retry settings, and all 198 passed. This is recorded rather than described as an entirely failure-free release history. The final reports have zero failed, skipped or flaky results. Structured results are in `verification/transformer-reader-2026-10-11.json`.

The latest deployed whole-page and narrow-phone captures were inspected. The original capture, math, advanced explorer source and both image files are byte-identical to the pre-pass version. Della and VialGrade application sources, the homepage animations and the writing note are unchanged. Their 52- and 60-check local suites, including existing visual baselines, also passed before release.
