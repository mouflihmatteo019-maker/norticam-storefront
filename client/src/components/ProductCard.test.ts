import { describe, expect, it } from 'vitest';
import { imageUrl } from '../lib/image-url';

describe('Shopify responsive images', () => {
  it.each([
    'https://cdn.shopify.com/s/files/1/example.webp?v=1&width=1600',
    'https://norticam.com/cdn/shop/files/example.webp?v=1&width=1600',
  ])('resizes CDN images without retaining the 1600px download: %s', (source) => {
    const result = new URL(imageUrl(source, 640));
    expect(result.searchParams.getAll('width')).toEqual(['640']);
    expect(result.searchParams.get('v')).toBe('1');
  });
  it('does not rewrite unrelated image services', () => {
    expect(imageUrl('https://example.com/image.jpg', 320)).toBe('https://example.com/image.jpg');
  });
});
