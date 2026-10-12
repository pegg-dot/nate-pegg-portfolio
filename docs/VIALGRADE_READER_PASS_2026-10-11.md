# VialGrade reader-first pass

## Requested scope

Nate asked to follow the Della hardening with VialGrade. The goal is a case study that reads like his explanation of what he built, with simple examples that make sense before visitors click anything. This explicitly supersedes the old VialGrade verbatim-copy lock. The original prose fixture remains unchanged as provenance. No Della, Transformer, homepage, rowing, signature or writing-note application files are changed.

## What changed

- Removed the separate decorative claim card and the second, oversized document inspector. A single comparison beside the introduction shows the claim, both sets of fields, and what their agreement actually establishes.
- Kept the document character without fictional stamps, nested selectors, duplicate readouts or labels about operating the demo. Corresponding values remain in the same table row on phones.
- Kept matching, missing and conflicting cases. The whole matching example is readable at rest; native disclosure supplies the alternatives without JavaScript.
- Put all three grade examples in view at once. Numerical and dimension logic is unchanged. Prepared grades are explicitly separate from the document example, and the supplied assessments are available in optional detail.
- Condensed the referral explanation. The path shows what an outbound click can establish, and why it does not prove a purchase. The optional illustrative link remains non-clickable and makes no tracking request.
- Preserved the existing full screenshot and image bytes. Early usage figures are described as an earlier monthly update, not current analytics.

## Writing and evidence

The rewrite uses Nate's own origin: a friend interested in biomedicine and peptides, vendors whose claims were difficult to compare, the decision to cross-check records, the challenge of grading missing information, checkout/referral work and the surprise of early usage. It uses his requested 'wanted a better way to compare' framing and does not reintroduce the unwanted 'not making money' framing.

There are no invented customers, current usage claims, real accusations or product-safety assurances. A lab-record metadata match remains distinct from establishing what a physical vial contains. A vendor evidence grade is not a safety certification.

## Immutable logic

`evidence-model.ts`, `grade-projection.ts`, `grade-types.ts`, `tests/fixtures/vial-grade-source.json`, and the original copy fixture are unchanged. The exact existing matcher and grade projection are reused. The first three source/numerical tests from the prior behavior suite remain intact. In particular, the supported example's A- requires its supplied trusted verdict as well as three independent tests; this page does not claim to compute that upstream verdict. The document inspector never changes the separate grade examples.

## Test and review gates

Inspect the rendered opening, record cases, grade explanations, retained product image and phone layouts. Check mouse and keyboard interaction, changing motion preference, static reading without JavaScript, no mutating/vendor requests, and five widths from 320 to 1440 pixels. Verify the unchanged projection's runtime hash and numerical boundaries. Baselines are replaced only for the intentionally redesigned VialGrade route after visual inspection.

Run `npm run lint`, `npm run build`, and `npm run test:vial`. For cross-project behavior use the existing `playwright-della-harden.config.ts`, which also exercises VialGrade, Transformer and the footer writing note. Target deployment with `VIAL_TEST_URL` for VialGrade and `PORTFOLIO_TEST_URL` for the cross-project suite. Browser tests use those origins; numerical tests still run in the test runner.

No independent subagent review or complete accessibility certification is claimed. The point of the browser suite is to catch regressions, not to substitute for reading the page and inspecting it.

## Local release gate

Lint and the production build passed. The 160-check cross-project behavior suite, 60-check VialGrade suite (including reviewed screenshot comparisons), and unchanged 52-check Della suite passed on the candidate. The mobile heading check also guards against joined words when desktop line breaks are hidden. These suites overlap and are not summed as distinct tests. Deployment verification is still to follow.
