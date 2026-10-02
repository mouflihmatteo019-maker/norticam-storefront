import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';

describe('compiled Shopify road hero', () => {
  async function hero() {
    const html = await readFile('snippets/norticam-view-0.liquid', 'utf8');
    const section = html.match(/<section[^>]*norticam-road-hero[\s\S]*?<\/section>/)?.[0];
    expect(section).toBeTruthy();
    return section!;
  }

  it('keeps the existing heading and the two purchase-orientation links', async () => {
    const html = await hero();
    expect(html).toContain('La bonne dashcam.');
    expect(html).toContain('Pour votre vrai usage.');
    expect(html).toContain('Trouver ma dashcam');
    expect(html).toContain('Voir tous les modèles');
    expect(html.match(/<a\b/g)).toHaveLength(2);
    expect(html).toContain('pages/quiz');
    expect(html).toContain('routes.all_products_collection_url');
  });

  it('removes the featured product panel rather than adding a competing CTA', async () => {
    const html = await hero();
    expect(html).not.toContain('Sélection NORTICAM');
    expect(html).not.toContain('product-visual');
    expect(html).not.toContain('/products/');
  });

  it('reserves image dimensions and exposes responsive Shopify image sizes', async () => {
    const html = await hero();
    expect(html).toContain('norticam-hero-habitacle-v2.png');
    expect(html).not.toContain('norticam-hero-route-v1.png');
    expect(html).toContain('width="1672" height="941"');
    expect(html).toContain('sizes="100vw"');
    expect(html).toContain('640w');
    expect(html).toContain('1600w');
    expect(html).toContain('fetchPriority="high"');
    expect(html).toContain('alt="" aria-hidden="true"');
  });

  it('keeps the mobile image compact and above the copy with a bottom fade', async () => {
    const css = await readFile('client/src/index.css', 'utf8');
    expect(css).toContain('--hero-image-height: clamp(140px, 44vw, 200px)');
    expect(css).toMatch(/\.norticam-road-hero__image\s*\{[^}]*inset: 0 0 auto/);
    expect(css).toContain('padding-top: calc(var(--hero-image-height) - 12px)');
    expect(css).toMatch(/\.norticam-road-hero__shade\s*\{[^}]*#05091b 100%/);
    expect(css).toContain('.norticam-road-hero__copy { padding-top: 80px; padding-bottom: 80px; }');
  });
});
