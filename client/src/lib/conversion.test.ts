import { describe, it, expect } from 'vitest';
import { products } from './store-data';
import { conversionCopy, initialVariant } from './product-conversion';
import { commercialPages } from './commercial-pages';
import { commercialDecisions } from './commercial-decisions';
import { productFacts } from './product-facts';
describe('CRO content integrity',()=>{
 it('keeps MINI Pro resolution consistent without renaming its existing URL',()=>{
  const mini=products.find(p=>p.handle==='dashcam-2k-voiture')!;
  expect(mini.title).toContain('1296p');
  expect(conversionCopy(mini).ideal).toContain('1296p');
  expect(productFacts(mini).resolution).toBe('2304 × 1296');
  expect(productFacts(mini).parking).not.toMatch(/24\s*h/);
 });
 it('gives every catalogue model distinct positioning and sourced benefits',()=>{
  expect(new Set(products.map(p=>conversionCopy(p).ideal)).size).toBe(products.length);
  for(const p of products){const c=conversionCopy(p);expect(c.benefits.length).toBeLessThanOrEqual(3);expect(c.benefits.every(b=>p.details.includes(b.feature))).toBe(true);expect(c.emotionalBenefits).toHaveLength(3);expect(new Set(c.emotionalBenefits.map(b=>b.title)).size).toBe(3);expect(c.installation).toHaveLength(3);expect(c.faq.length).toBeGreaterThanOrEqual(3);expect(c.faq.length).toBeLessThanOrEqual(5);}
 });
 it('keeps important compatibility limits visible',()=>{expect(conversionCopy(products.find(p=>p.handle==='dashcam-moto-carplay-dvr')!).limit).toContain('hors mode CarPlay');expect(conversionCopy(products.find(p=>p.handle==='dashcam-voiture-360-4k')!).limit).toContain('ne correspond pas à une capture panoramique simultanée');});
 it('omits unanswered kit and parking questions rather than publishing uncertainty',()=>{
  const product={...products[0],specs:{version:1 as const,kit:[],capabilities:{parking:null,wifi:null}},details:[]};
  const copy=conversionCopy(product);
  expect(copy.kit).toEqual([]);
  expect(copy.faq.find(([question])=>question.includes('carte mémoire'))).toBeUndefined();
  expect(copy.faq.find(([question])=>question.includes('garé'))).toBeUndefined();
  expect(JSON.stringify(copy)).not.toMatch(/non précisé|non documenté|à confirmer|confirmez le nombre|génération livrée/i);
  expect(copy.emotionalBenefits[2].title).not.toBe('Retrouver plus simplement une séquence utile');
 });
 it('does not promote uncertain feature or kit values to selling points',()=>{
  const copy=conversionCopy({...products[0],specs:{version:1 as const,kit:['Carte mémoire à confirmer']},details:['Wi-Fi à confirmer','Capteur non précisé','D6WL ou D6RL']});
  expect(copy.benefits).toEqual([]);
  expect(copy.kit).toEqual([]);
 });
 it('keeps the model positioning after a Shopify URL changes',()=>{const p=products[0];expect(conversionCopy({...p,handle:'new-handle'}).ideal).toBe(conversionCopy(p).ideal);});
 it('uses only real products on every commercial decision page',()=>{expect(Object.keys(commercialDecisions).sort()).toEqual(Object.keys(commercialPages).sort());for(const [route,d] of Object.entries(commercialDecisions)){expect(commercialPages[route]).toBeDefined();expect(d.choices).toHaveLength(3);expect(d.picks.every(([h])=>products.some(p=>p.handle===h))).toBe(true);}});
});
describe('variant landing consistency',()=>{
 const base=products[0].variants[0];const variants=[{...base,id:'gid/1',numericId:'1',price:200},{...base,id:'gid/2',numericId:'2',price:100},{...base,id:'gid/3',numericId:'3',price:50,availableForSale:false}];
 it('opens the lowest available price shown by listing cards',()=>{expect(initialVariant(variants,null)?.price).toBe(100);});
 it('preserves the advertised variant even if it is unavailable',()=>{expect(initialVariant(variants,'3')?.availableForSale).toBe(false);expect(initialVariant(variants,'1')?.price).toBe(200);});
 it('never silently substitutes an invalid requested variant',()=>{expect(initialVariant(variants,'999')).toBeUndefined();});
});
