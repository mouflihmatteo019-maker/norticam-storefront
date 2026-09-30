# Performance and guest tracking — 2026-09-28

Branch: `perf-tracking-20260928`. Not deployed.

## Baseline

PageSpeed mobile report: https://pagespeed.web.dev/analysis/https-norticam-com/q85braq9m7?form_factor=mobile

- Performance 67, FCP 3.2 s, LCP 7.4 s (hero heading), TBT 170 ms, CLS 0.
- SEO 100; this is only Lighthouse's technical score, not an indexing guarantee.
- Blocking CSS estimate: 1460 ms. Image savings estimate: 290 KiB.

## Implemented

- Responsive image helper now resizes custom-domain Shopify CDN URLs as well as cdn.shopify.com URLs. Previously every srcset candidate retained width=1600 on the custom domain.
- Homepage component is synchronous, avoiding a lazy/Suspense blank replacement of its server-rendered hero.
- Correct full browser user-agent obtains real WOFF2 fonts instead of TTF binaries mislabeled .woff2. Both original typefaces and requested weights are retained.
- Inline font declarations and preload two Latin fonts; editorial CSS bundled with main stylesheet to eliminate two blocking stylesheet requests.
- Account CTA removed from guest tracking help; no false order lookup is presented.
- Three responsive image regression tests added.

## Verified

- TypeScript check, 45 unit tests, theme build and 56-route theme audit passed.
- Shopify validator passed layout/theme.liquid, snippets/norticam-fonts.liquid and snippets/norticam-order-help.liquid.
- Desktop homepage preview inspected. Mobile/product/cart browser tests remain incomplete due Chrome control errors.

## Pending

- Track123 browser tab now shows `/apps/track123/track/onBoarding`; installation appears to have been completed by the owner. No installation or paid subscription submitted by the agent.
- Finish Track123 onboarding, confirm free Starter plan (App Store advertised 50 orders/month), verify guest lookup and actual generated page URL, then connect the existing tracking page without account links.
- Do not invent a Track123 embed URL or expose Admin API credentials.
- Finish browser QA before deploying; then rerun PageSpeed. No improved live score claimed yet.
- Production branch is shopify-native-faithful; pushing there may auto-deploy. Current changes are isolated and not pushed to that branch.
- Untracked migration reports, Microsoft directory and verify-migration-http.mjs predate this task and were not included.
