# VialGrade portfolio: use the actual product language

## Requested correction

Nate supplied four screenshots and asked for the portfolio case study itself to look like VialGrade, with his own connected, conversational writing. The earlier beige serif article was the wrong interpretation. This change is to `/work/vialgrade`; it does not change the product, Della, Transformer or the portfolio homepage. No image generator was used.

## Reference checks

The screenshots were checked against the product repository at `5a08f288a136d2af232e224770e07408902878bd` and the live site's rendered styles. Sources: `src/app/globals.css`, `src/components/home/hero.tsx`, `src/components/home/manifesto.tsx`, `src/components/vial-art.tsx`, and `public/brand/vialgrade-icon.svg`.

The measured product background is #f7f7f4, ink #111214 and blue #2b31d8. Typography uses the product's Inter/system sans-serif stack and 800-weight headings. Reference panels have 2px borders, 22px corners and 5px hard offset shadows. The hero's 54px grid, pill controls and flat outlined vial/molecule/flask/shield art are carried across. The artwork and logo are the original product assets, with their hashes recorded in `reference/vial-product-source.json`, not approximations generated from screenshots.

The portfolio header says this is Nate's project and links back to his work. Its section links navigate real sections; there is no fake search, login, live-data status or market screen. The product site stays a separate external destination.

## Content and interaction

The writing is revised from Nate's account into longer connected paragraphs, preserving the friend/biomedicine origin, website-claim problem, missing-evidence decision, checkout/attribution issue and historical early use. It is not described as a verbatim transcript. The original copy fixture is unchanged.

The document comparison now appears as the product's paired black/blue-shadow panels, with the same existing matcher and fictional inputs. Choosing missing or conflicting evidence changes only local state. The matching fields remain aligned at phone widths; missing records are not negative findings. The real grade projection and its limits stay inspectable in native details controls.

The blue result band echoes the reference's visual treatment but uses the user's previously reported eight signups in an early one-month snapshot. It does not copy the screenshot's 450-certificate number or claim Nate read that many certificates. The actual earlier product screenshot remains a real image, with its existing historical caption and full-size link. No screenshot text, metrics or grades are fabricated.

## Verification

`tests/vial-product.spec.ts` checks the actual shipped colors, type, borders, shadows, pills and source-asset hashes, plus anchor behavior beneath the sticky navigation, responsive layouts, the historical-metric boundary and the revised paragraphs. The existing matching, numerical, keyboard, accessibility and no-network-mutation checks remain. Presentation assertions tying VialGrade to a serif essay or a table were updated to the requested product composition, not silently bypassed.

`docs/verification/vial-product-preserved.json` records the unchanged Della/Transformer/shared application sources, homepage components, grade/matcher code, source fixtures, original product images and writing PDF against `221c7d8`.

Component-only screenshot comparisons suppress sticky navigation so it cannot cover the component being captured. Full-page and viewport comparisons keep the real sticky header, and separate interaction tests check that anchors leave their controls visible. New VialGrade baselines are reviewed; Della and Transformer baselines are not regenerated.

Commands: `npm run lint`, `npm run build`, `npx playwright test -c playwright-authored.config.ts`, and `npx playwright test -c playwright-authored-visual.config.ts`. The focused VialGrade behavior suite is `playwright-vial-product.config.ts`. Set `PORTFOLIO_TEST_URL` for deployed runs using these configurations. The standalone legacy `playwright-vial.config.ts` uses `VIAL_TEST_URL`.

## Local review

The rendered desktop and phone pages, the two-panel comparison, all record states and the product palette were inspected before accepting the new VialGrade baselines. The 276-check cross-project suite passed, as did all 16 visual tests, including the unchanged Della/Transformer comparisons. Those suites overlap and are not summed as distinct checks. The preserved-file manifest still matches all 37 files. Production verification follows release.
