import { describe, it, expect, vi, beforeEach } from 'vitest';
import { recommend, productFacts } from './product-facts';
import { products } from './store-data';
import { mapProduct, storefront, mutateCart } from './shopify';
import { trackCommerce } from './analytics';
const catalog=products.map(p=>({...p,verified:true,currency:'EUR'}));
describe('recommendation constraints',()=>{
 it('never recommends a car camera for a helmet request',()=>{
  const r=recommend(catalog,{vehicle:'moto',coverage:'helmet',priority:'value',parking:'no',budget:'250'});
  expect(r.length).toBeGreaterThan(0); expect(r.every(r=>/moto/i.test(r.product.productType)&&/casque/i.test(r.product.description))).toBe(true);
 });
 it('does not exceed budget or recommend unavailable products',()=>{
  const r=recommend(catalog,{vehicle:'voiture',coverage:'front',priority:'value',parking:'no',budget:'100'});
  expect(r.every(r=>r.product.price<=100&&r.product.available)).toBe(true);
  expect(recommend(catalog.map(p=>({...p,available:false})),{vehicle:'voiture',coverage:'front',priority:'value',parking:'no',budget:'100'})).toEqual([]);
 });
 it('does not fabricate a match or undocumented features',()=>{
  expect(recommend(catalog,{vehicle:'moto',coverage:'helmet',priority:'value',parking:'yes',budget:'10'})).toEqual([]);
  expect(productFacts({...products[0],details:[]}).gps).toBe('Non précisé');
 });
});
describe('Shopify is the commercial source of truth',()=>{
 it('replaces old prices and variants with the API response',()=>{
  const p=mapProduct({id:products[0].id,handle:products[0].handle,title:'Live',vendor:'Live',productType:'Dashcam moto',description:'Live',availableForSale:true,images:{nodes:[]},variants:{nodes:[{id:'gid://shopify/ProductVariant/123',title:'Live kit',availableForSale:true,price:{amount:'17.42',currencyCode:'EUR'},selectedOptions:[],image:null}]}});
  expect(p.price).toBe(17.42);expect(p.variants).toHaveLength(1);expect(p.variants[0].numericId).toBe('123');expect(p.verified).toBe(true);
 });
 it('does not accept GraphQL failures as successful operations',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({errors:[{message:'Denied'}]})}));
  await expect(storefront('{ shop { name } }')).rejects.toThrow();
 });
 it('surfaces cart validation errors instead of inventing a cart',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({data:{cartLinesAdd:{cart:null,userErrors:[{message:'Unavailable'}],warnings:[]}}})}));
  await expect(mutateCart('cartLinesAdd',{})).rejects.toThrow('Unavailable');
 });
});
describe('consent-gated commerce events',()=>{
 const gtag=vi.fn(),fbq=vi.fn(); let consent:any=null;
 beforeEach(()=>{vi.clearAllMocks();vi.stubEnv('VITE_GA4_ID','G-TEST');vi.stubEnv('VITE_META_PIXEL_ID','TEST');vi.stubGlobal('window',{gtag,fbq});vi.stubGlobal('localStorage',{getItem:()=>JSON.stringify(consent)});consent=null;});
 it('sends nothing without consent',()=>{trackCommerce('add_to_cart',[{id:'123',name:'Camera',price:12.5,quantity:2}],'EUR');expect(gtag).not.toHaveBeenCalled();expect(fbq).not.toHaveBeenCalled();});
 it('rejects invalid totals, quantities and currencies even with consent',()=>{consent={analytics:true,marketing:true};for(const [price,quantity,currency,total] of [[-1,1,'EUR',1],[1,NaN,'EUR',1],[1,1,'bad',1],[1,1,'EUR',NaN]] as const){trackCommerce('begin_checkout',[{id:'123',name:'Camera',price,quantity}],currency,total);}expect(gtag).not.toHaveBeenCalled();expect(fbq).not.toHaveBeenCalled();});
 it('uses real variant IDs, quantities, value and currency once per call',()=>{consent={analytics:true,marketing:false};trackCommerce('add_to_cart',[{id:'123',name:'Camera',price:12.5,quantity:2}],'EUR');expect(gtag).toHaveBeenCalledTimes(1);expect(gtag).toHaveBeenCalledWith('event','add_to_cart',expect.objectContaining({value:25,currency:'EUR',items:[{item_id:'123',item_name:'Camera',price:12.5,quantity:2}]}));expect(fbq).not.toHaveBeenCalled();});
});
