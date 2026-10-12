# Reworking the three portfolio project pages

## What Nate asked

The Transformer, Della and VialGrade pages still looked AI-like after several readability passes. Nate asked for a joint review of why they felt that way, followed by implementation. The previous snapshots and source were inspected together, not treated as three independent polish tasks.

## Diagnosis from the rendered pages

The common template had become the dominant content. Each opening put a large project name and explanatory paragraph beside a miniature demo. Below it, a large heading faced a paragraph across the same wide gutter, then a rule reset the layout for the next equal-weight section. At a reduced zoom the pages were effectively the same outline in three accent colors.

The copy had the same problem. The sequence repeatedly became origin, problem, lesson, result. Headings announced a neat takeaway before the paragraph had said what happened. Many transitions used a short contrast or a summary of the demonstration instead of Nate's account of the work. Changing contractions and removing jargon had not addressed that underlying rhythm.

The evidence hierarchy was also wrong. The actual workspace and visualizer images were secondary to facsimile interfaces made for the portfolio. Those facsimiles then needed extra labels, controls and disclaimers. The reader spent attention learning how to operate a miniature tutorial rather than looking at the project. Large section headings and little product labels also gave an incidental example the same weight as a major decision.

This is a design judgment grounded in those pages, not a claim that a font, a color, or any use of AI has a universally identifiable appearance. The earlier tests established mechanical behavior, not that the design was good. Some tests had inadvertently frozen the template by requiring a demo in the first viewport; those presentation expectations have been changed explicitly while the underlying truth and interaction checks remain.

## The new compositions

### Della

The real, already-redacted owner workspace leads. A choice of the focused crop and full capture changes which original image is visible; it never simulates a live workspace state. The introductory account sits in its margin. The rest is a continuous account of starting with OpenOperator, choosing salons, and getting the booking action to match what the caller was told.

The booking illustration now appears after the failure it explains. Its guarded state machine is unchanged. The chipped-nail anecdote is a personal aside rather than a feature card. The editable owner draft is retained near the account of permissions. There are two subject-specific headings rather than a title for every paragraph.

The new crop is a derivative of `public/della/workspace-context.webp`, not a newly generated product image. It starts below the previous dark banner and keeps the existing redactions. The original full image is unchanged. Labels identify the capture as earlier and the displayed counts as not current usage.

### VialGrade

This is composed as a research essay. The idea, the friend who brought up the market, and the uncertainty around uploaded certificates establish the question before a comparison appears. The comparison is part of that account, not the cover or a second product dashboard.

The absence of a grade is shown in the actual grade code (`letter: null`). The displayed fragment is a contiguous excerpt of the unchanged pinned projection; the text says the return continues. The prepared grade examples remain inspectable in a native disclosure and still use the same function and fictional inputs. Their separation from the document matcher is preserved.

Referral attribution is explained beside an inspectable example URL rather than in a second three-step infographic. The real site screenshot and historical early-use account remain. Missing evidence is not an accusation, and evidence grades are not physical-product safety findings.

### Transformer

The cover is the actual visualizer, on its own dark background, with an image choice for attention and training. It does not imitate the visualizer with another generic card. The model-building account follows it as continuous prose.

The residual example now starts in `model/gpt.py`, with the two real additions highlighted and one actual coordinate beside the code. The source excerpt is pinned to commit `f6ba652589871a0b95f71a41b9910269ec7cf8db`; its source hash and lines are recorded in `source-slices/gpt-block.json`. The prediction readout and complete computation explorer remain below the account that motivates them. All original math, saved tensors, full-vocabulary sampling, and advanced controls are retained.

## What is shared, and what is not

Only utility navigation, footer and basic reading/figure primitives are shared. The pages no longer use the same hero grid or repeated heading-and-copy sections. There are no invented handwritten notes, random rotations, fake notebook textures or decorative scratches added to manufacture personality. Real source artifacts and decisions do the distinguishing work.

The prose is a new edit from Nate's recorded explanations, not labeled verbatim. The original prose fixtures remain intact. No customer transcript, training result, current usage count or business claim has been invented. The actual product backends and the separate full Transformer visualizer are not modified.

## Verification scope

`docs/verification/authored-preserved-files.json` records the unchanged application sources, model/grading data, original fixtures, source screenshots and writing PDF against baseline `0fcf1e3`.

`playwright-authored.config.ts` runs the prior behavioral and numerical suites plus checks for the new artifacts, source-excerpt fidelity, responsive layouts, keyboard operation, native disclosures, static reading and accessibility. The initial local run caught image-choice buttons below the existing target-size requirement; these were enlarged. A VialGrade keyboard test needed its new disclosure-opening step moved after the original first-Tab assertion; the focus assertions were preserved.

`playwright-authored-visual.config.ts` captures the deliberately changed compositions separately. Baselines are accepted only after inspecting the rendered pages and images, including narrow screens. The tests are not an aesthetic score. Deploy verification is recorded below after release.

## Image review refinement

The first visual review exposed that the original 900px Transformer captures became soft when promoted to the cover. New 3200 x 1752 captures were taken from the actual live visualizer, using its Play and scene controls, for the query/key/value and gradient-descent scenes. These replace only the images used on the new cover; the old files remain byte-identical. The live visualizer code was not modified. Capture provenance is in `source-slices/visualizer-captures.json`. The training caption continues to identify its scene as a teaching illustration.

## Local release gate

Lint and the production build passed. All 254 behavioral, numerical, accessibility and artifact checks passed in Chromium and WebKit. The 16 visual tests also passed on a normal run against the 50 reviewed images, after intentional baseline creation and inspection. The original image baselines are in Git history rather than retained as active expectations for this deliberately different layout. No tests are skipped and retries remain disabled.

The protected-file manifest was rechecked before release: all 21 baseline files match byte for byte. The CI job checks the same manifest before building. This covers the homepage, its animation sources, the original writing PDF, original screenshots, source fixtures, and the model/grade state that this design change must not alter.
