import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { themeHref, themePath } from './theme-runtime';
import { mapThemeCart, mutateThemeCart, themeRequest } from './theme-commerce';

const raw = {currency:'EUR', item_count:2, items_subtotal_price:19980, total_price:17980, items:[{
  key:'123:unique-key', quantity:2, final_price:8990, final_line_price:17980,
  variant_id:123, product_id:456, handle:'camera', product_title:'Camera', vendor:'NORTICAM',
  variant_title:'64 Go', featured_image:{url:'https://cdn.shopify.com/camera.jpg'},
}]};
beforeEach(()=>vi.stubGlobal('window',{location:{origin:'https://example.myshopify.com'},NorticamTheme:{root:'/',currency:'EUR'}}));
afterEach(()=>vi.unstubAllGlobals());
describe('native Shopify routes',()=>{
  it.each([
    ['/','/'],['/boutique/','/collections/all'],['/produits/camera?variant=123#details','/products/camera?variant=123#details'],
    ['/mode-parking/','/collections/dashcam-mode-parking'],['/informations/contact','/pages/contact'],
    ['/conseils','/blogs/guides-dashcam'],['/blogs/guides-dashcam/article','/blogs/guides-dashcam/article'],
    ['/conseils/dashcam-nuit','/pages/conseils-dashcam-nuit'],['/cart','/cart'],
    ['https://norticam.com','https://norticam.com'],['#avis','#avis'],['//cdn.shopify.com/a','//cdn.shopify.com/a'],
  ])('maps %s', (input,output)=>expect(themePath(input)).toBe(output));
  it('preserves the locale root',()=>{
    window.NorticamTheme!.root='/fr/';
    expect(themeHref('/quiz')).toBe('/fr/pages/quiz');
  });
});
describe('native Shopify cart',()=>{
  it('uses real totals, discounted prices and unique line keys',()=>{
    const cart=mapThemeCart(raw);
    expect(cart.totalQuantity).toBe(2);
    expect(cart.cost.subtotalAmount.amount).toBe('199.8');
    expect(cart.cost.totalAmount.amount).toBe('179.8');
    expect(cart.lines.nodes[0].id).toBe('123:unique-key');
    expect(cart.lines.nodes[0].cost.amountPerQuantity.amount).toBe('89.9');
    expect(cart.checkoutUrl).toBe('https://example.myshopify.com/checkout');
  });
  it('adds real variant IDs and re-reads the server cart',async()=>{
    const fetcher=vi.fn().mockResolvedValueOnce({ok:true,json:async()=>({})}).mockResolvedValueOnce({ok:true,json:async()=>raw});
    vi.stubGlobal('fetch',fetcher);
    await mutateThemeCart('cartLinesAdd',{lines:[{merchandiseId:'gid://shopify/ProductVariant/123',quantity:2}]});
    expect(fetcher.mock.calls[0][0]).toBe('/cart/add.js');
    expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({items:[{id:'123',quantity:2}]});
    expect(fetcher.mock.calls[1][0]).toBe('/cart.js');
  });
  it('removes by line key, not a potentially ambiguous variant ID',async()=>{
    const fetcher=vi.fn().mockResolvedValue({ok:true,json:async()=>raw});vi.stubGlobal('fetch',fetcher);
    await mutateThemeCart('cartLinesRemove',{lineIds:['123:unique-key']});
    expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({updates:{'123:unique-key':0}});
  });
  it('surfaces Shopify stock errors without claiming success',async()=>{
    vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:false,json:async()=>({description:'Stock insuffisant'})}));
    await expect(themeRequest('cart/add.js',{})).rejects.toThrow('Stock insuffisant');
  });
});
