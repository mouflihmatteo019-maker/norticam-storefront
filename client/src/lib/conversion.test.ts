import { describe, it, expect } from 'vitest';
import { products } from './store-data';
import { conversionCopy, initialVariant } from './product-conversion';
import { commercialPages } from './commercial-pages';
import { commercialDecisions } from './commercial-decisions';
describe('CRO content integrity',()=>{
 it('gives every catalogue model distinct positioning and sourced benefits',()=>{
  expect(new Set(products.map(p=>conversionCopy(p).ideal)).size).toBe(products.length);
  for(const p of products){const c=conversionCopy(p);expect(c.benefits.length).toBe(3);expect(c.benefits.every(b=>p.details.includes(b.feature))).toBe(true);expect(c.installation).toHaveLength(3);expect(c.faq).toHaveLength(5);}
 });
 it('keeps important compatibility limits visible',()=>{expect(conversionCopy(products.find(p=>p.handle==='dashcam-moto-carplay-dvr')!).limit).toContain('hors mode CarPlay');expect(conversionCopy(products.find(p=>p.handle==='dashcam-voiture-360-4k')!).limit).toContain('pas nécessairement');});
 it('uses only real products on all eight existing commercial pages',()=>{expect(Object.keys(commercialDecisions)).toHaveLength(8);for(const [route,d] of Object.entries(commercialDecisions)){expect(commercialPages[route]).toBeDefined();expect(d.choices).toHaveLength(3);expect(d.picks.every(([h])=>products.some(p=>p.handle===h))).toBe(true);}});
});
describe('variant landing consistency',()=>{
 const base=products[0].variants[0];const variants=[{...base,id:'gid/1',numericId:'1',price:200},{...base,id:'gid/2',numericId:'2',price:100},{...base,id:'gid/3',numericId:'3',price:50,availableForSale:false}];
 it('opens the lowest available price shown by listing cards',()=>{expect(initialVariant(variants,null)?.price).toBe(100);});
 it('preserves the advertised variant even if it is unavailable',()=>{expect(initialVariant(variants,'3')?.availableForSale).toBe(false);expect(initialVariant(variants,'1')?.price).toBe(200);});
 it('never silently substitutes an invalid requested variant',()=>{expect(initialVariant(variants,'999')).toBeUndefined();});
});
