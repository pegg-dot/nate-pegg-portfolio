# Transformer portfolio story

This records the initial design. The later reader-first rewrite is documented in `TRANSFORMER_READER_PASS_2026-10-11.md`.

## Scope

A project-specific route at `/work/transformer`, not a rebuild of the full visualizer. The portfolio's homepage, Della, VialGrade, rowing, signature and writing note are unchanged.

The reading layer retains the approved introduction, all 12 original prose blocks, all four brief facts, model configuration and technology list. The four-box brief is now optional project notes.

## Experience

A single computation explorer follows one of the six character positions in `ROMEO:` through characters, embeddings, attention, residual updates and prediction. Visitors can select any of the six blocks and attention heads, inspect either residual branch, and adjust the temperature of the captured logits. Sampling draws one character without claiming a new forward pass or appending a fake continuation.

The page uses a dark computational workbench inside the portfolio's warm paper layout. The full Q/K/V and training screenshots still link or point to the existing visualizer. The training image is described as an illustration, not a measured loss surface.

## Data and provenance

- Model repository: `pegg-dot/Transformer`
- Pinned commit: `f6ba652589871a0b95f71a41b9910269ec7cf8db`
- Source: `viz/public/activations.json`
- Source SHA-256: `bf4f514ce66651b4cf9a977167205fa41f043e1f9a9c3fc12f8be6dfb56bb301`
- Small committed subset: six causal prompt positions; six blocks; six heads; first eight of 384 vector coordinates; 65 logits per position.
- Captured numerical values are not rounded in storage. Display rounding is disclosed.
- The original capture contains a later generated continuation. The causal mask prevents that suffix from affecting the prefix shown here.
- Attention weights are not represented as semantic importance or an explanation of internal reasoning.
- No ONNX model, 28 MB activation file, remote inference service or external model request loads in the portfolio browser.

`python3 scripts/prepare-transformer.py` verifies source hashes and regenerates missing snapshot files. The normal app build only imports committed snapshots and does not require a network fetch.

## Verification

`npm run lint`, `npm run build`, and `npx playwright test -c playwright-transformer.config.ts` cover the unchanged copy, real arithmetic, causal mask, all five views, keyboard controls, reduced motion, no-JavaScript reading, no live model requests, five viewport widths and automated accessibility. The tests export actual browser captures to `qa/` for visual inspection.

`npx playwright test -c playwright-preserved.config.ts` runs the existing Della, VialGrade and writing-note behavioral tests without overwriting their macOS screenshot baselines. Set `TRANSFORMER_TEST_URL` to a deployed origin for live verification.

The route's workflow is read-only after its one-time isolated-branch bootstrap. It does not deploy or merge automatically. Production requires an explicitly reviewed branch update.
