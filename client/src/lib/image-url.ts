const shopImagePath = /^\/cdn\/shop\/(files|products)\//;
const storefrontHosts = new Set(['norticam.com', 'www.norticam.com', 'checkout.norticam.com']);

/** Resize Shopify media only; unrelated, invalid and non-HTTP sources stay untouched. */
export function imageUrl(url: string, width: number): string {
  if (!Number.isSafeInteger(width) || width <= 0) return url;
  const relative = url.startsWith('/') && !url.startsWith('//');
  const protocolRelative = url.startsWith('//');
  if (!relative && !protocolRelative && !/^https?:\/\//i.test(url)) return url;
  // Only root-relative Shopify media paths have a known resizing contract.
  if (relative && !shopImagePath.test(url)) return url;
  try {
    const u = new URL(url, 'https://norticam.com');
    if (!['https:', 'http:'].includes(u.protocol) || u.username || u.password) return url;
    const shopHost = storefrontHosts.has(u.hostname) || u.hostname.endsWith('.myshopify.com');
    if (u.hostname !== 'cdn.shopify.com' && !(shopHost && shopImagePath.test(u.pathname))) return url;
    // set() replaces every existing width, while keeping version/crop/other parameters and the fragment.
    u.searchParams.set('width', String(width));
    if (relative) return `${u.pathname}${u.search}${u.hash}`;
    if (protocolRelative) return `//${u.host}${u.pathname}${u.search}${u.hash}`;
    return u.href;
  } catch {
    return url;
  }
}

export type ProductImageContext = 'card' | 'gallery' | 'compact' | 'hero';

const imageProfiles = {
  card: {
    widths: [240, 320, 400, 480, 640, 800, 960, 1200],
    width: 640,
    // Existing one/two/three-column grid, including container and card padding.
    sizes: '(min-width:1280px) 368px, (min-width:1024px) calc((100vw - 182px) / 3), (min-width:640px) calc((100vw - 128px) / 2), calc(100vw - 66px)',
  },
  gallery: {
    widths: [320, 480, 640, 800, 1000, 1200, 1600],
    width: 800,
    sizes: '(min-width:1280px) 616px, (min-width:1024px) calc(53vw - 64px), (min-width:640px) calc(100vw - 56px), calc(100vw - 40px)',
  },
  compact: { widths: [80, 160, 240, 320, 480], width: 320, sizes: '160px' },
  hero: { widths: [640, 960, 1280, 1600], width: 1600, sizes: '100vw' },
} satisfies Record<ProductImageContext, { widths: number[]; width: number; sizes: string }>;

/** A non-resizable original must not masquerade as several different-width candidates. */
export function productImageSources(url: string, context: ProductImageContext = 'gallery') {
  const profile = imageProfiles[context];
  const candidates = profile.widths.map(width => ({ width, url: imageUrl(url, width) }));
  const hasResponsiveVariants = new Set(candidates.map(candidate => candidate.url)).size > 1;
  return {
    src: imageUrl(url, profile.width),
    srcSet: hasResponsiveVariants ? candidates.map(candidate => `${candidate.url} ${candidate.width}w`).join(', ') : undefined,
    sizes: hasResponsiveVariants ? profile.sizes : undefined,
  };
}
