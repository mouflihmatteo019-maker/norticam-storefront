/** Shopify serves images on both its CDN host and the shop's custom domain. */
export function imageUrl(url: string, width: number) {
  try {
    const u = new URL(url);
    if (u.hostname === 'cdn.shopify.com' || /^\/cdn\/shop\/(files|products)\//.test(u.pathname)) {
      u.searchParams.set('width', String(width));
    }
    return u.href;
  } catch { return url; }
}
