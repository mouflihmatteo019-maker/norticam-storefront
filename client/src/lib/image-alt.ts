import type { Product } from './store-data';

/** Describe the actual image; never add rankings, offers or unrelated keywords. */
export function productImageAlt(product: Pick<Product, 'title' | 'imageAlt'>, authored: string | null | undefined = product.imageAlt): string {
  const alt = (authored || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  if (alt && !/^(?:image|photo|product|produit|img)(?:[\s_-]*\d+)?(?:\.(?:jpg|png|webp))?$/i.test(alt) && !/^https?:\/\//i.test(alt)) return alt;
  return product.title.replace(/\s+/g, ' ').trim();
}
