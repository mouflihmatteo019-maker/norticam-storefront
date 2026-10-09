import { themeRuntime } from './theme-runtime';
import type { ShopifyCart } from './shopify';

export async function themeRequest(path: string, body?: unknown) {
  const response = await fetch(`${themeRuntime()!.root}${path}`, {
    method: body === undefined ? 'GET' : 'POST', credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(15000),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.description || data.message || 'Impossible de mettre à jour votre panier.');
  return data;
}
export function mapThemeCart(raw: any): ShopifyCart {
  const currency = raw.currency || themeRuntime()?.currency || 'EUR';
  const amount = (cents: number) => ({ amount: String(cents / 100), currencyCode: currency });
  return { id: 'norticam-native-cart', checkoutUrl: new URL(`${themeRuntime()!.root}checkout`, window.location.origin).href,
    totalQuantity: raw.item_count, cost: { subtotalAmount: amount(raw.items_subtotal_price), totalAmount: amount(raw.total_price) },
    lines: { nodes: raw.items.map((line: any) => ({ id: line.key, quantity: line.quantity,
      cost: { amountPerQuantity: amount(line.final_price), totalAmount: amount(line.final_line_price) },
      merchandise: { id: `gid://shopify/ProductVariant/${line.variant_id}`, title: line.variant_title || 'Standard',
        availableForSale: true, product: { id: `gid://shopify/Product/${line.product_id}`, handle: line.handle,
          title: line.product_title, vendor: line.vendor, featuredImage: { url: line.featured_image?.url || line.image, altText: line.product_title } } },
    })) },
  };
}
export async function getThemeCart() { return mapThemeCart(await themeRequest('cart.js')); }
const cartSection = 'norticam-cart-data';
function isCompleteCart(raw: any): boolean {
  return raw && Array.isArray(raw.items) && Number.isFinite(raw.item_count)
    && Number.isFinite(raw.items_subtotal_price) && Number.isFinite(raw.total_price)
    && raw.items.every((line: any) => line.key && line.variant_id && Number.isFinite(line.quantity)
      && Number.isFinite(line.final_price) && Number.isFinite(line.final_line_price));
}
// Shopify renders this section AFTER the mutation. Keep server prices/discounts,
// but avoid a second network round trip. Never retry an add when rendering fails.
export function bundledThemeCart(response: any): ShopifyCart | null {
  if (isCompleteCart(response)) return mapThemeCart(response);
  const html = response?.sections?.[cartSection];
  if (typeof html !== 'string') return null;
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const raw = JSON.parse(doc.querySelector('[data-norticam-cart-json]')?.textContent || 'null');
    return isCompleteCart(raw) ? mapThemeCart(raw) : null;
  } catch { return null; }
}
export async function mutateThemeCart(operation: string, variables: Record<string, any>) {
  let response: any;
  if (operation === 'cartCreate' || operation === 'cartLinesAdd') {
    const lines = operation === 'cartCreate' ? variables.input.lines : variables.lines;
    response = await themeRequest('cart/add.js', {
      items: lines.map((line: any) => ({ id: line.merchandiseId.split('/').pop(), quantity: line.quantity })),
      sections: [cartSection], sections_url: themeRuntime()!.root,
    });
  } else if (operation === 'cartLinesUpdate') {
    for (const line of variables.lines) response = await themeRequest('cart/change.js', { id: line.id, quantity: line.quantity });
  } else if (operation === 'cartLinesRemove') {
    const updates = Object.fromEntries(variables.lineIds.map((id: string) => [id, 0]));
    response = await themeRequest('cart/update.js', { updates });
  } else throw new Error('Opération panier non prise en charge.');
  return { cart: bundledThemeCart(response) || await getThemeCart(), warning: '' };
}
