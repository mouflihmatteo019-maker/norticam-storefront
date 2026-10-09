import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { imageUrl, productImageSources, type ProductImageContext } from './image-url';

describe('Shopify media URL resizing', () => {
  it.each([
    'https://cdn.shopify.com/s/files/1/camera.webp?v=123&width=1600&width=800&crop=center#detail',
    'https://norticam.com/cdn/shop/files/camera.webp?v=123&width=1600&width=800&crop=center#detail',
    'https://www.norticam.com/cdn/shop/products/camera.jpg?v=123&width=1600&width=800&crop=center#detail',
    'https://checkout.norticam.com/cdn/shop/files/camera.png?v=123&width=1600&width=800&crop=center#detail',
    'https://example.myshopify.com/cdn/shop/files/camera.png?v=123&width=1600&width=800&crop=center#detail',
  ])('replaces every width but preserves the original media, version and fragment: %s', source => {
    const original = new URL(source);
    const resized = new URL(imageUrl(source, 160));
    expect(resized.searchParams.getAll('width')).toEqual(['160']);
    expect(resized.searchParams.get('v')).toBe('123');
    expect(resized.searchParams.get('crop')).toBe('center');
    expect(resized.hash).toBe('#detail');
    expect(resized.origin + resized.pathname).toBe(original.origin + original.pathname);
  });

  it('keeps root-relative Shopify URLs relative and puts width before the hash', () => {
    const source = '/cdn/shop/files/camera.webp?v=2&width=1600#view';
    expect(imageUrl(source, 160)).toBe('/cdn/shop/files/camera.webp?v=2&width=160#view');
    expect(imageUrl('/cdn/shop/products/camera.jpg#view', 320)).toBe('/cdn/shop/products/camera.jpg?width=320#view');
  });

  it('keeps protocol-relative CDN URLs protocol-relative', () => {
    expect(imageUrl('//cdn.shopify.com/s/files/camera.webp?width=1600&v=2#view', 160))
      .toBe('//cdn.shopify.com/s/files/camera.webp?width=160&v=2#view');
  });

  it.each([
    'https://example.com/image.jpg?width=1600&signature=keep%20me#view',
    'https://example.com/cdn/shop/files/camera.jpg?width=1600',
    'https://cdn.shopify.com.example.com/image.jpg?width=1600',
    'https://shop.myshopify.com.example.com/cdn/shop/files/camera.jpg',
    'https://norticam.com/assets/hero.webp?width=1600',
    '/assets/hero.webp?width=1600#view',
    'cdn/shop/files/camera.webp?width=1600',
    './cdn/shop/files/camera.webp?width=1600',
    'data:image/svg+xml,%3Csvg%3E%3C/svg%3E',
    'blob:https://norticam.com/example',
    'javascript:alert(1)',
    'ftp://cdn.shopify.com/image.jpg?width=1600',
    'https://user:example@cdn.shopify.com/image.jpg?width=1600',
    'https://[invalid',
    '',
  ])('does not mutate a source without a known Shopify resizing contract: %s', source => {
    expect(imageUrl(source, 160)).toBe(source);
  });

  it.each([0, -1, 160.5, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1])(
    'does not send an invalid width %s', width => {
      const source = 'https://cdn.shopify.com/s/files/camera.webp?width=800';
      expect(imageUrl(source, width)).toBe(source);
    },
  );
});

describe('context-sized product image candidates', () => {
  const source = 'https://cdn.shopify.com/s/files/camera.webp?v=2&width=1600&width=800#view';

  it.each<ProductImageContext>(['card', 'gallery', 'compact', 'hero'])(
    'describes unique real CDN widths for the %s context', context => {
      const props = productImageSources(source, context);
      expect(props.srcSet).toBeTruthy();
      const candidates = props.srcSet!.split(', ');
      const widths = candidates.map(candidate => {
        const [url, descriptor] = candidate.split(' ');
        const parsed = new URL(url);
        expect(parsed.searchParams.getAll('width')).toHaveLength(1);
        expect(descriptor).toBe(`${parsed.searchParams.get('width')}w`);
        expect(parsed.searchParams.get('v')).toBe('2');
        expect(parsed.hash).toBe('#view');
        return descriptor;
      });
      expect(new Set(widths).size).toBe(widths.length);
    },
  );

  it('uses smaller card/compact candidates than the product gallery while preserving its quality', () => {
    const card = productImageSources(source, 'card');
    const gallery = productImageSources(source, 'gallery');
    const compact = productImageSources(source, 'compact');
    expect(new URL(card.src).searchParams.get('width')).toBe('640');
    expect(new URL(gallery.src).searchParams.get('width')).toBe('800');
    expect(new URL(compact.src).searchParams.get('width')).toBe('320');
    expect(card.sizes).toContain('368px');
    expect(card.sizes).toContain('/ 3');
    expect(gallery.sizes).toContain('616px');
    expect(gallery.srcSet).toContain('1600w');
    expect(compact.sizes).toBe('160px');
    expect(productImageSources(source, 'hero').sizes).toBe('100vw');
  });

  it.each(['https://example.com/camera.jpg?width=1600', '/camera.webp', 'data:image/svg+xml,%3Csvg%3E'])
    ('does not invent responsive widths for an original non-resizable image: %s', original => {
      const props = productImageSources(original, 'card');
      expect(props.src).toBe(original);
      expect(props.srcSet).toBeUndefined();
      expect(props.sizes).toBeUndefined();
    });

  it('keeps image layout/loading and variant gallery behavior while normalizing thumbnail URLs', async () => {
    const card = await readFile('client/src/components/ProductCard.tsx', 'utf8');
    const product = await readFile('client/src/pages/ProductConversion.tsx', 'utf8');
    const gallery = await readFile('client/src/components/ProductGallery.tsx', 'utf8');
    expect(card).toContain('imageContext="card"');
    expect(card).toContain('h-full w-full object-contain');
    expect(card).toContain('width={800} height={800}');
    expect(card).toContain("loading={priority ? 'eager' : 'lazy'}");
    expect(card).toContain("fetchPriority={priority ? 'high' : 'auto'}");
    expect(product).toContain('selectedImage={selected?.image}');
    expect(gallery).toContain('imageContext="gallery"');
    expect(gallery).toContain('src={imageUrl(image.url, 160)}');
    expect(gallery).not.toContain('"width=160"');
    expect(gallery).toContain('image.url === selectedImage');
    expect(gallery).toContain('onClick={() => show(i)}');
    expect(gallery).toContain('aria-pressed={i === index}');
  });
});
