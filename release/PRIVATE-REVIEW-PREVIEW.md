# Private review preview

Synthetic data live only in `client/src/lib/mock-reviews.ts`.
Never display them on a public shop or export them to schema/feeds/Shopify.
Default builds leave `VITE_PREVIEW_REVIEWS` unset/false. Even preview builds refuse public hostnames.

After `pnpm theme:build`, run `pnpm reviews:preview`, then open
`http://127.0.0.1:4331/products/dashcam-3k-voiture` on this computer.
The server listens only on loopback and uses separate `.tmp/review-preview-assets`.
Stop the preview to disable it. Never upload `.tmp` or use preview assets for production.

Summary, stars, distribution, filters and pagination components remain unchanged.
For genuine reviews, replace the data source behind `reviewsFor` with records from your review provider.
Only mark a real review verified when its purchase has been verified.

The owner confirms free returns within 14 days. This offer now appears on product pages,
in the cart and footer. Keep the Shopify refund policy consistent with the offer.
