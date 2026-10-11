# VialGrade portfolio story

## Scope

Replace only `/work/vialgrade`'s generic case-study template with a source-inspection narrative. The homepage, Della, shared CaseShell, rowing, signature, and After Abundance writing note remain unchanged.

## Content and evidence boundaries

- The original introduction, all 12 original body paragraphs, and all four brief facts are preserved in `story-copy.json`. `tests/fixtures/vial-original-copy.json` is frozen from portfolio commit `f59ad2e`.
- Earlier usage numbers are explicitly historical, not represented as live analytics.
- The document examples use fictional vendors, a fictional lab, and fictional compound/batch fields. They are not accusations or certificates concerning actual businesses.
- The document matcher is a deliberately simplified, local illustration. It is not the product's ingestion or upstream verification engine.
- The grade demo runs the real, pure `gradeFromVerdict` projection pinned from `pegg-dot/vial` commit `5a08f288a136d2af232e224770e07408902878bd`. Only comments and erased type imports differ. Runtime SHA-256 after TypeScript ES2017/CommonJS transpilation with comments removed: `53064d9440a4a1f5f4264d13909496a3413db68c9c04a3c461548896ceb92aa0`.
- Grade inputs are prepared and fictional. The upstream composed verdict is supplied, not computed here. Three independent tests alone do not establish a trusted verdict. The independent grade examples do not grade the separate document-comparison example.
- A matched document and an evidence grade are not product safety certifications. Missing evidence is not proof of wrongdoing.
- The expanded outbound link uses `vendor.example` and is not clickable. No tracking request is sent and no purchase is inferred.

## Presentation

Document-shaped surfaces with aligned batch, compound, and manufacturer fields. Both highlights move together when a field is selected. A paired-value readout keeps the comparison usable on phones, where documents stack. A missing source has its own neutral result, distinct from a document conflict. Grades expose each evidence dimension and the specific projection rule.

The earlier product screenshot remains available in full; a 63 KB WebP derivative is used in the page with the correct aspect ratio and an earlier-capture label.

## Verification

`npm run lint` and `npm run build` must pass before browser checks.

`npm run test:vial` runs 50 checks across installed Chrome and Playwright WebKit: frozen copy, pinned runtime, real grade rules, local document matching, state switching, simultaneous highlight motion, no-write/network isolation, keyboard use, reduced-motion changes, no-JavaScript reading, image sizing, automated accessibility, and reviewed screenshot baselines. Responsive widths: 320, 390, 768, 1024, 1440 pixels.

The visual baselines were inspected for the opening, matching/missing/conflicting documents, grade outcomes, and mobile readout. Baselines may only be updated after inspecting a deliberate design change. Tests have no retries or skips.

Use `VIAL_TEST_URL=https://nate-pegg-portfolio.vercel.app npm run test:vial` to target the deployed portfolio. Unit/source checks still run locally; browser checks target that origin. None of the tests clicks outbound product or source links.

The existing Della (42 checks) and footer-writing (14 checks) suites were also run against the candidate build. This does not certify the entire portfolio or VialGrade's production backend.
