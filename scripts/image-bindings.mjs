// Preserve authored Shopify ALT descriptions in server HTML, not only after hydration.
export function bindProductImages(html, catalog) {
  const key = url => { try { const u = new URL(url.replaceAll('&amp;', '&')); return u.origin + u.pathname; } catch { return ''; } };
  const images = new Map();
  catalog.forEach((p, i) => (p.images?.length ? p.images : [{ url: p.image }]).forEach((image, j) => {
    if (image.url) images.set(key(image.url), `n_product_${i}.images[${j}]`);
  }));
  return html.replace(/<img\b[^>]*>/g, tag => {
    const src = tag.match(/\bsrc="([^"]*)"/)?.[1], image = images.get(key(src || ''));
    if (!image) return tag;
    const owner = image.split('.images')[0];
    // Intentionally empty ALT remains empty on decorative controls and redundant links.
    tag = tag.replace(/\balt="([^"]+)"/, `alt="{{ ${image}.alt | default: ${owner}.title | escape }}"`);
    tag = tag.replace(/\bsrc="([^"]+)"/, (_, value) => {
      const width = new URL(value.replaceAll('&amp;', '&')).searchParams.get('width') || '800';
      return `src="{{ ${image} | image_url: width: ${Number(width) || 800} }}"`;
    });
    return tag.replace(/\bsrcSet="[^"]*"|\bsrcset="[^"]*"/g, attribute => {
      const sizes = [...attribute.matchAll(/\s(\d+)w/g)].map(m => Number(m[1]));
      return `srcset="${sizes.map(w => `{{ ${image} | image_url: width: ${w} }} ${w}w`).join(', ')}"`;
    });
  });
}
