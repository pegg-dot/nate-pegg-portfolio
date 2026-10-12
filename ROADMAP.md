# Portfolio roadmap

## Goal anchor

- **Final goal:** a memorable Academy portfolio that shows what Nate builds and why he keeps building it.
- **Primary reader:** an Academy reviewer moving quickly through many applications.
- **Core value:** the reviewer should understand the person and the curiosity behind the projects first, then be able to inspect the work as deeply as they want.
- **Non-goals:** resume site, traction dashboard, proof-of-authorship dossier, generic founder landing page, inflated polish.
- **Constraints:** preserve Nate's voice; facts must stay honest; distinguish finished from in-progress; desktop-first but responsive; reduced motion must work.

## Pivot — 2026-09-26

**Old sequence → New sequence**

`proof artifact → metrics → technical detail` → `origin / meaning → evolution → supporting evidence`

**Why:** the first version made the visitor feel like Nate was trying to prove he built things. The application already asks for inspectable work. The portfolio should use that evidence quietly and spend its main surface showing why each project exists and what building it changed.

**Deferred:** deeper proof-artifact treatment for every secondary project.

**Revisit checkpoint:** once every project has an origin story and one meaningful artifact, add deeper technical evidence only where it improves the story.

## Pivot — 2026-09-26, pass 2

**Old sequence → New sequence**

`homepage explains the project and then keeps going into pivots / moments / implementation` → `homepage says what it is + why it exists + shows the thing; project page carries the full story`

**Why:** the main page needs to work as a fast portfolio index. A reviewer should understand Della, VialGrade or the Transformer before deciding whether to go deeper. The detailed moments matter more after that click.

**Deferred:** no deletion of the deeper stories; they move into the project pages instead of crowding the index.

**Revisit checkpoint:** once WeBuddy and Grounds Guide have their own story pages, check whether any homepage spotlight still contains information that belongs one level deeper.

## Pivot — 2026-09-26, pass 3

**Old sequence → New sequence**

`one continuous decorative pencil line through the page` → `the pencil only appears when it has something specific to say: circle, underline, bracket, star, or point at real content`

**Why:** the continuous line looked programmatic and became decoration for its own sake. The pencil should feel like Nate annotating his own portfolio, not a screensaver.

**Deferred:** no more ambient doodles unless they are tied to a real sentence, image, or idea.

**Revisit checkpoint:** every pencil mark should be understandable without explaining the animation to the reviewer.

## Pivot — 2026-10-06, MoveMate

**Old sequence → New sequence**

`HOOS Moving as a broad UVA marketplace project` → `MoveMate as move-in / move-out help, with the marketplace as the backbone`

**Why:** the team mapped roughly 20 assumptions by importance and confidence and focused on the important ones with the least evidence. Moving is a sharper, higher-value job than asking a marketplace to create its own liquidity first.

**Deferred:** recruiting a large student-mover network and building the full marketplace before demand is proven.

**Revisit checkpoint:** after the launch MVP and poster campaign produce the first real users, update the case study with what students actually requested and what the team changed.

## Pivot — 2026-10-06, WeBuddy

**Old sequence → New sequence**

`WebBuddy as a generic salon website generator` → `WeBuddy as a structured salon-data system that maps one shared business model across reusable templates`

**Why:** the real work is the formalization layer: public business data + owner answers → a 96-field ClientSite record → shared mapping → differentiated templates. The project was also built as a way to get a foot in the door with salon owners, and outbound is starting now.

**Deferred:** do not surface the live WeBuddy product link in the Academy portfolio until the exposed Google Places key is restricted or proxied.

**Revisit checkpoint:** once the Google key exposure is fixed, add the live product link; once outbound produces real owner conversations, update the final section with what actually happened.

## Content rule — final voice pass

The current copy is structure and factual draft material, not final application prose. Before submission, every first-person paragraph gets rewritten from Nate's own spoken answer, then lightly cut for clarity. No invented lessons, founder slogans, or polished autobiography.

## Roadmap ledger

### Completed — story + motion
- [x] pencil stays pinned in the viewport while it writes the name
- [x] connected, cursive-style name writing with only natural pen lifts (crossing the t + moving to the last name)
- [x] scroll input is eased so the pencil catches up smoothly instead of stepping with the scroll wheel
- [x] decorative long trace replaced by semantic pencil marks tied to actual content
- [x] homepage spotlights now say what each project is before the deeper story
- [x] existing project pages answer what / why / how / when before the deeper narrative
- [x] fuller About section includes a real photo, current builds, and personal context
- [x] Della reframed around origin, pivots and persistent context
- [x] VialGrade reframed around trust / provenance instead of page views
- [x] Transformer reframed around learning / black-box motivation
- [x] secondary projects reframed around why they started
- [x] LOT, NPGKTrades and Say No To Plastic story pages
- [x] art and rowing kept as personal chapters
- [x] Nate pass on all first-person wording using his spoken answers as the source
  - [x] Homepage opening, featured-project motivations, WeBuddy/Grounds Guide origins, and About intro rewritten from Nate voice dump
  - [x] Deep project pages completed in Nate's voice
    - [x] Della deep page rewritten from Nate voice dump and tightened into a denser case-study layout
    - [x] VialGrade deep page rewritten from Nate voice dump, grounded in the actual grading/attribution code, and tightened to the Della density
    - [x] Transformer deep page rewritten from Nate voice dump and grounded in the actual model/visualizer repo
    - [x] LOT deep page rewritten from current + prior-chat voice context and grounded in the real-estate repo
    - [x] WeBuddy deep page rewritten from prior-chat voice context, shortened, and grounded in the existing product architecture
    - [x] NPGKTrades deep page rewritten from Nate voice context and grounded in the actual copy-trading pipeline
    - [x] Say No To Plastic deep page rewritten from Nate voice context and grounded in the live client project + source/validation architecture
    - [x] MoveMate deep page rewritten in Nate voice around the marketplace → moving-help shift, assumption testing, campus posters, and current MVP
    - [x] Grounds Guide deep page grounded in the routing repo, current local preview, schedule ingestion, validation limits, and Nate's UVA origin story

### Completed — deepen the remaining stories
- [x] MoveMate story replaces HOOS Moving and captures the marketplace → moving-help pivot
- [x] MoveMate campus poster campaign restored
- [x] WeBuddy artifact + story, including structured data model, template mapping, owner dashboard, SEO scope and Base44 split
- [x] Grounds Guide artifact + story

### Current phase — launch hardening
- [ ] image/performance pass
- [ ] mobile pass
- [ ] accessibility / reduced-motion pass
- [ ] final links + resume + artist account
- [ ] final domain

## Della case study - approved design iteration, October 11, 2026

The shared four-column brief remains on other project pages. Della now has a project-specific story: a booking request moves to the calendar, customer context persists between two recollections, and a proposed message stops at an owner-approval boundary. This changes the presentation of Della, not the portfolio's goal or the other project pages.

- [x] Preserve all 16 original prose blocks and all four brief facts, with a frozen copy test.
- [x] Della-specific opening, booking illustration, memory transition and approval drawer.
- [x] Explicit failed booking outcome; no confirmation without a matching illustrative receipt.
- [x] Source-of-truth explanation and unmeasured latency dependency illustration.
- [x] Earlier workspace image retained as a labeled, redacted derivative.
- [x] Local-only interactions, keyboard focus loop, reduced-motion and no-JavaScript explanations.
- [x] Responsive checks at 360, 390, 768, 1024 and 1440 pixels; Chrome and WebKit browser coverage.
- [x] Inspect movement, visual states, and screenshot baselines before release.

This does not mark the entire portfolio's image, accessibility, mobile, link or domain pass complete. Those remain the launch-hardening items above.

## Footer writing note - October 11, 2026

- [x] Add a quiet "one more thing..." disclosure at the bottom of the homepage.
- [x] Link the original *After Abundance* PDF without rewriting the paper or removing its attribution.
- [x] Keep the existing footer links and preserve all project pages, the signature, and rowing source.
- [x] Verify keyboard use, no-JavaScript reading, four responsive widths, footer accessibility and original-file integrity in Chrome and WebKit.

The writing-note iteration did not change VialGrade. Its subsequent redesign is recorded below.


## VialGrade case study - approved design iteration, October 11, 2026

- [x] Replace the shared brief layout with a document-inspection story without rewriting the original prose.
- [x] Compare matching, missing, and conflicting fictional records; synchronized field highlights and a mobile paired-value readout.
- [x] Use the actual pinned letter-grade projection with fictional, explicitly supplied verdicts. Missing evidence remains ungraded.
- [x] Explain referral tags without sending tracking requests or implying a completed purchase.
- [x] Mark old metrics and the retained product image as historical.
- [x] Verify source parity, keyboard use, motion, static reading, accessibility, and five responsive widths in Chrome and WebKit.
- [x] Inspect the rendered states and preserve reviewed visual baselines.

The remaining site-wide launch-hardening items above are not marked complete by this route-specific work.


## Della reader-first hardening - October 11, 2026

- [x] Rewrite the narrative from Nate's existing explanations at his request, retaining the underlying facts and current-versus-planned distinction.
- [x] Replace duplicate booking panels with a complete illustrated call and calendar, visible before interacting.
- [x] Make replay optional, pausable and reduced-motion aware; preserve failed-booking and receipt guards.
- [x] Turn the memory example back into a personal story and show the owner's editable draft inline.
- [x] Preserve the actual workspace imagery with an earlier-screen label.
- [x] Complete local visual review and cross-project regression checks.
- [x] Verify the released page after deployment (150 cross-project checks and the 52-check Della suite, including screenshot comparisons).

This supersedes the previous Della-only verbatim-copy lock, not the protections on other routes.


## VialGrade reader-first hardening - October 11, 2026

- [x] Rewrite the explanation from Nate's stated reasons, with the requested better-way-to-compare framing.
- [x] Show the complete claim/record comparison immediately, with paired rows on phones.
- [x] Show missing, supported and adverse grade examples together, separately from document matching.
- [x] Keep the original numerical rules, fictional-input boundaries and historical usage labels.
- [x] Simplify referral attribution and preserve the real interface screenshot.
- [x] Complete local cross-project checks and visual review.
- [x] Verify the released VialGrade page after deployment (60 VialGrade checks, including screenshots, and the 160-check cross-project suite).

The prior VialGrade prose fixture remains an archive; this requested rewrite supersedes its verbatim presentation rule.


## Transformer reader-first hardening - October 11, 2026

- [x] Rewrite the story from Nate's own learning process and keep Karpathy/3Blue1Brown attribution.
- [x] Show real next-character probabilities immediately, with optional prefix selection and sampling.
- [x] Explain a residual update using one actual captured coordinate.
- [x] Preserve both visualizer images and the full advanced computation explorer.
- [x] Keep source data, math and original prose archive unchanged.
- [ ] Complete browser review, cross-project checks and deployed verification.
