# Product gallery and cart responsiveness — 2026-10-09

- Native Shopify Ajax cart mutations now reuse the confirmed cart from the same response. Add requests use bundled section rendering (`norticam-cart-data`); change/remove reuse Shopify's full cart response. A failed/missing section falls back to one cart GET, never another add mutation.
- Empty-cart content is no longer shown while the initial add is pending. Prices, discounts, quantities and checkout validation remain server-authoritative. No optimistic purchase or tracking event was introduced.
- Product galleries use native horizontal scrolling and scroll snap, with touch swipe, keyboard navigation, arrows, thumbnails, variant image selection and reduced-motion support. Only the first large image is eager-loaded.
- No product, variant, price, availability, canonical, structured data or checkout URL was changed.

## Verification before publication

- TypeScript: passed.
- Unit tests: 210 passed, 24 files. Includes bundled section parsing/fallback, no duplicate mutation on stock errors, one-response quantity/removal, and gallery markup/navigation index tests.
- Shopify theme build, theme audit and compiled theme DOM smoke tests: passed.
- Browser at 1280 px and 390 × 844 px: arrows, Home/End, visible thumbnails, horizontal scroll to the next slide, no horizontal page overflow; add, quantity change and removal confirmed against the local Shopify-compatible fixture.
- Browser console: no errors during the local product/cart checks.
- Live response verification and GMC follow-up are recorded separately in the workspace audit, after the remote theme sync.

This removes an avoidable network round trip; it does not promise a fixed latency reduction on every connection. No real order was placed.
