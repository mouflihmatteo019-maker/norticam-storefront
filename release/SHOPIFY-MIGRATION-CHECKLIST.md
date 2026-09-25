# Migration: prepared, not activated

Branch: `shopify-native-faithful`. Do not merge into the Hostinger `main` branch to publish this theme.

## Prepared

- `shopify-redirects.csv`: old React routes to Shopify-native routes, including slash variants.
- `node scripts/audit-shopify-redirects.mjs`: coverage, duplicate sources, loops, chains and local-target validation against the theme manifest.
- Products use Shopify-native structured data; canonicals come from Shopify.
- Blogs and articles retain their existing Shopify URLs and dynamically read the published content.
- The 26 required Pages/Collections have been checked in the real draft preview.

## Before a live switch (owner approval required)

1. Preserve the current site and Git commit; export any existing Shopify redirects before importing the prepared file. Review conflicts instead of overwriting silently.
2. Review legal policies, contact email delivery, shipping configuration, payment availability and tracking consent. Verify a test purchase and its event deduplication in provider test tools, not by emitting purchase on checkout click.
3. Approve the theme visually in Shopify preview. Only then plan domain/theme publication with a rollback path; no DNS change has been made.
4. At migration time, import the reviewed redirects, connect the primary storefront domain and publish the approved theme. Check HTTPS and preserve the requested path in www/non-www redirects.
5. Verify old URLs return permanent redirects directly to the intended new URLs; destination must return 200, one correct canonical and the expected content. Check representative product, guide, collection, contact and blog routes.
6. Inspect the Shopify sitemap on the final domain and submit its final URL to Search Console. Do not remove indexed URLs merely because they are migrating.
7. Verify Merchant Center landing pages match their feed price/availability, and monitor 404s, indexing and conversion events after the switch.

The CSV covers the routes known to this theme build, not historical URLs from Search Console or URLs added to the current live site afterward. Reconcile those sources before claiming complete historical redirect coverage.
