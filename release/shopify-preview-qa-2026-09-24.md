# Shopify preview verification — 24 September 2026

Target: unpublished theme 210340970845, branch `shopify-native-faithful`.
Functional commits: `ddf6c01`, `855ae4b` (in addition to the earlier blog integration).

## Corrections verified

- All 26 Pages/Collections from `shopify-resources.json` opened in the real Chrome preview and displayed their expected H1, with no 404. This includes the 14 new Pages and 8 new Collections.
- The eight new Collections initially had no resource publication despite the creation tool describing automatic publication. Explicitly published these eight existing IDs to the same channel as the working vehicle collections. No duplicates created.
- Quiz completed: car, front/rear, value, no parking, EUR 150. Recommendation: A510 at EUR 149.90; alternative N1 Dual, with native product URLs.
- Comparator selection changed from A810S to X800 Omni; displayed price and features updated.
- Comparator and collection checked at 390px, policy page at 1440px. No page-level horizontal overflow observed on the mobile comparator; its table retains its dedicated scrolling region.
- Tracking page presents the real `/account` entry and confirmation/dispatch email guidance, without a fabricated delivery state.
- Shipping/refund buttons initially had no destination because Liquid serializes a policy object as its body string. Fixed explicit URL serialization. Both buttons now point to the correct native `/policies/` URLs; shipping policy opened successfully.
- Keyboard activation verified for the footer link; Shopify's preview bar can cover the bottom of the viewport.

## Automated checks

- TypeScript: passed.
- Vitest: 38 tests passed, 5 files.
- Theme generated: 56 views, 22 live-reference products, 26 resource definitions.
- Theme structural audit: passed; policy URL and native tracking regression assertions added.
- Official local Theme Check: bootstrap, tracking snippet, tracking view and translations valid; revised policy bootstrap also validated.
- A plain HTTP sweep could not load the draft theme (preview session required). It is not counted as a passed test; real-browser checks above replaced it.

## Earlier checks in this same migration

- Native blog pagination (12 + 2 articles), article content, table of contents and product navigation; desktop/mobile.
- X800 Omni selected variant: EUR 276.73 matched product, native cart and HTTPS checkout. No order placed and test item removed.
- Native contact form and required fields inspected. No message sent.

## Still not a production sign-off

- Owner's current native policies contain draft wording and incomplete return-address information; terms of service are not populated. No legal content was fabricated or silently rewritten.
- Email receipt, pixels/consent end-to-end and a completed test order remain unverified.
- Domain migration and legacy URL redirects must be checked before any switch of the live site. No DNS, main-branch merge or theme publication performed.
- Layout remains the faithful compiled React adaptation, not a drag-and-drop theme. Product structural changes require rebuilding the initial compiled views; prices/availability are live. Shopify blog articles are dynamic without rebuilding.
- Newly created Pages/Collections are shared Shopify resources, created/published with owner approval; the theme itself remains unpublished.
