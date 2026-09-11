import { products as editorial, type Product } from './store-data';
export const SHOP_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN || 'z4a1f0-p0.myshopify.com';
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://norticam.com').replace(/\/$/, '');
export type Money = { amount: string; currencyCode: string };
export type StoreProduct = Product & { verified?: boolean; currency?: string; images?: { url: string; altText: string | null }[] };
export async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const token = import.meta.env.VITE_SHOPIFY_PUBLIC_TOKEN;
  const response = await fetch(`https://${SHOP_DOMAIN}/api/2026-07/graphql.json`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { 'X-Shopify-Storefront-Access-Token': token } : {}) }, body: JSON.stringify({ query, variables }), signal: AbortSignal.timeout(15000) }).catch(() => { throw new Error("Connexion à la boutique interrompue. Vérifiez votre connexion puis réessayez."); });
  if (!response.ok) throw new Error('La boutique est temporairement indisponible. Réessayez dans un instant.');
  const body = await response.json();
  if (body.errors?.length || !body.data) throw new Error('Impossible de vérifier les informations de la boutique. Veuillez réessayer.');
  return body.data;
}
export const VARIANT_FIELDS = `id title availableForSale price { amount currencyCode } selectedOptions { name value } image { url }`;
export const PRODUCT_FIELDS = `id handle title vendor productType description availableForSale featuredImage { url altText } images(first: 12) { nodes { url altText } } variants(first: 100) { nodes { ${VARIANT_FIELDS} } pageInfo { hasNextPage endCursor } }`;
export function mapProduct(raw: any): StoreProduct {
  const copy = editorial.find(p => p.id === raw.id);
  const variants = raw.variants.nodes.map((v: any) => ({ id: v.id, numericId: v.id.split('/').pop(), title: v.title, availableForSale: v.availableForSale, price: Number(v.price.amount), options: v.selectedOptions, image: v.image?.url || null }));
  return { ...copy, id: raw.id, handle: raw.handle, title: raw.title, shortTitle: copy?.shortTitle || raw.title.split(/ [—–] /).pop(), vendor: raw.vendor, productType: raw.productType, type: /accessoire/i.test(raw.productType) ? 'Accessoire' : 'Dashcam', price: Math.min(...(variants.some((v: any) => v.availableForSale) ? variants.filter((v: any) => v.availableForSale) : variants).map((v: any) => v.price)), available: raw.availableForSale, image: raw.featuredImage?.url || null, imageAlt: raw.featuredImage?.altText || raw.title, badge: copy?.badge || raw.productType, description: copy?.description || raw.description, story: copy?.story || raw.description, details: copy?.details || [], variants, shopifyUrl: `https://${SHOP_DOMAIN}/products/${raw.handle}`, verified: true, currency: raw.variants.nodes[0]?.price.currencyCode || 'EUR', images: raw.images.nodes } as StoreProduct;
}
export async function loadCatalog() {
  const result: StoreProduct[] = []; let after: string | null = null;
  do {
    const data: any = await storefront(`query Catalog($after: String) @inContext(country: FR, language: FR) { products(first: 6, after: $after) { nodes { ${PRODUCT_FIELDS} } pageInfo { hasNextPage endCursor } } }`, { after });
    for (const product of data.products.nodes) {
      while (product.variants.pageInfo.hasNextPage) {
        const extra: any = await storefront(`query Variants($id: ID!, $after: String!) @inContext(country: FR, language: FR) { product(id: $id) { variants(first: 100, after: $after) { nodes { ${VARIANT_FIELDS} } pageInfo { hasNextPage endCursor } } } }`, { id: product.id, after: product.variants.pageInfo.endCursor });
        product.variants.nodes.push(...extra.product.variants.nodes); product.variants.pageInfo = extra.product.variants.pageInfo;
      }
    }
    result.push(...data.products.nodes.map(mapProduct)); after = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null;
  } while (after);
  return result;
}
export const CART_FIELDS = `id checkoutUrl totalQuantity cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } } lines(first: 100) { nodes { id quantity cost { amountPerQuantity { amount currencyCode } totalAmount { amount currencyCode } } merchandise { ... on ProductVariant { id title availableForSale product { id handle title vendor featuredImage { url altText } } } } } }`;
export type ShopifyCart = { id: string; checkoutUrl: string; totalQuantity: number; cost: { subtotalAmount: Money; totalAmount: Money }; lines: { nodes: any[] } };
export async function getCart(id: string) { return (await storefront<{ cart: ShopifyCart | null }>(`query Cart($id: ID!) @inContext(country: FR, language: FR) { cart(id: $id) { ${CART_FIELDS} } }`, { id })).cart; }
export async function mutateCart(operation: 'cartCreate' | 'cartLinesAdd' | 'cartLinesUpdate' | 'cartLinesRemove', variables: Record<string, unknown>) {
  const signatures = { cartCreate: ['$input: CartInput!', 'input: $input'], cartLinesAdd: ['$cartId: ID!, $lines: [CartLineInput!]!', 'cartId: $cartId, lines: $lines'], cartLinesUpdate: ['$cartId: ID!, $lines: [CartLineUpdateInput!]!', 'cartId: $cartId, lines: $lines'], cartLinesRemove: ['$cartId: ID!, $lineIds: [ID!]!', 'cartId: $cartId, lineIds: $lineIds'] };
  const [signature, args] = signatures[operation];
  const data: any = await storefront(`mutation Change(${signature}) @inContext(country: FR, language: FR) { ${operation}(${args}) { cart { ${CART_FIELDS} } userErrors { message } warnings { message } } }`, variables);
  const result = data[operation];
  if (result.userErrors.length || !result.cart) throw new Error(result.userErrors.map((e: any) => e.message).join(' ') || 'Le panier ne peut pas être mis à jour.');
  return { cart: result.cart as ShopifyCart, warning: result.warnings?.map((w: any) => w.message).join(' ') || '' };
}
export const money = (value: number, currency = 'EUR') => new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(value);
