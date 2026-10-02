# NORTICAM — visual refresh, 2026-10-02

## Applied to Shopify

66 new images were appended to the 22 active products: product-only studio image,
documented-feature infographic, contextual/installation illustration.
Original images, their order, their media IDs, the primary image and product variants
were preserved. No product prices, descriptions, availability or option values were changed.
See attachment-audit.json for the exact media IDs and URLs.

Generated images use white backgrounds, soft shadows and restrained navy/blue accents.
Illustrations are not evidence of camera performance; accessories and installation
must be checked against the selected product configuration.
The two discarded R1 Pro v1 generations were not uploaded; the single-device v2 was used.

## Local hero preview — not published

The homepage hero preserves the existing heading, paragraph and two CTA destinations.
The featured product panel is replaced by a static road scene. Mobile uses a separate
composition with the scene below the copy; desktop uses a shaded background.
No routing, commerce, checkout, tracking, reviews or structured-data logic was changed.
The gallery category badge is suppressed over the new NORTICAM artwork to avoid covering its text.

Preview: http://127.0.0.1:4331/
Restart with the existing theme:preview command.
The preview cart is an isolated fixture, not a live Shopify transaction.
Real checkout was not completed; its logic is unchanged.

## Verification

- TypeScript check: passed.
- Automated tests: 63 passed across 10 files.
- React production build: passed.
- Shopify theme build: passed.
- Theme audit: passed (56 views, 22 products, 26 resource definitions).
- Shopify Liquid validation: all 23 modified snippets passed without findings.
- Browser hero: 320, 390, 768 and 1440 pixel widths; two CTAs visible, no horizontal overflow.
- Browser gallery: live A510 and N1 additions confirmed; local infographics do not have overlapping category badges.
- Preview cart: add and remove confirmed; no browser JavaScript errors.
- Shopify attachment audit: 22/22 original image sequences preserved; three additions each.

## Local-only materials

Reference photographs, generated masters, prompts, before/after screenshots and the
original Admin catalogue backup are kept locally in this directory.
Do not publish catalog-before.json: it includes operational inventory and SKU data.
The generated images are hosted by Shopify; no master PNG needs to be committed to load them.
The hero code and built theme files are saved locally on shopify-native-faithful,
awaiting visual approval before live publication.
