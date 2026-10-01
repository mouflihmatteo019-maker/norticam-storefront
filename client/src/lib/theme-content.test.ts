import { describe, expect, it, afterEach, vi } from 'vitest';
import fs from 'node:fs/promises';
import { Liquid } from 'liquidjs';
import { mapProduct } from './shopify';
import { products } from './store-data';
import { resolveProductHandle, themePath } from './theme-runtime';

const engine = new Liquid();
engine.registerFilter('t', key => key);
const stripDoc = (source: string) => source.replace(/{% doc %}[\s\S]*?{% enddoc %}/g, '');
const rawProduct = (description = 'Description Shopify mise à jour') => ({
  id: products[0].id, handle:'nouvelle-url-shopify', title:'Titre Shopify actuel', vendor:'Fabricant', productType:'Dashcam moto',
  description, descriptionHtml:'<p>Texte Shopify <strong>formaté</strong>.</p>', seo:{title:'Titre SEO Shopify',description:'Meta Shopify'},
  availableForSale:true, images:{nodes:[]}, variants:{nodes:[{id:'gid://shopify/ProductVariant/123',title:'Kit',availableForSale:true,price:{amount:'42',currencyCode:'EUR'},selectedOptions:[],image:null}]},
});
afterEach(() => vi.unstubAllGlobals());

describe('Shopify-managed product content and URLs', () => {
  it('uses current plain and formatted descriptions and SEO instead of editorial snapshots', () => {
    const product=mapProduct(rawProduct());
    expect(product.description).toBe('Description Shopify mise à jour');
    expect(product.descriptionHtml).toContain('<strong>formaté</strong>');
    expect(product.seo?.title).toBe('Titre SEO Shopify');
    expect(product.seo?.description).toBe('Meta Shopify');
  });
  it('does not silently restore old descriptions when an owner clears the field', () => {
    expect(mapProduct({...rawProduct(''),descriptionHtml:''}).description).toBe('');
  });
  it('keeps editorial links and featured products connected after a handle changes', () => {
    const current=mapProduct(rawProduct());
    expect(resolveProductHandle(products[0].handle,[current])).toBe(current);
    vi.stubGlobal('window',{NorticamTheme:{products:[rawProduct()]}});
    expect(themePath('/produits/'+products[0].handle+'/?variant=123#kit')).toBe('/products/nouvelle-url-shopify?variant=123#kit');
  });
  it('prefers an exact handle to an editorial legacy alias', () => {
    const exact={id:'different',handle:products[0].handle};
    expect(resolveProductHandle(products[0].handle,[mapProduct(rawProduct()),exact])).toBe(exact);
  });
  it('keeps Shopify SEO title and description in the server-rendered head', async () => {
    const layout=await fs.readFile('layout/theme.liquid','utf8');
    const head=layout.slice(0,layout.indexOf('<link rel="canonical"'));
    const html=await engine.parseAndRender(head,{request:{page_type:'product',path:'/products/new',locale:{iso_code:'fr'}},routes:{root_url:'/'},product:{handle:'new',description:'Fallback description'},page_title:'SEO & Shopify',page_description:'Meta saisie dans Shopify'});
    expect(html).toContain('<title>SEO &amp; Shopify</title>');
    expect(html).toContain('content="Meta saisie dans Shopify"');
  });
});

async function renderPolicy(kind: string, shop: Record<string,unknown>, content = '') {
  const source=stripDoc(await fs.readFile('snippets/norticam-policy-content.liquid','utf8'));
  return engine.parseAndRender(source,{kind,shop,page:{content},pages:{}});
}
describe('Shopify-authored legal and policy content', () => {
  it('renders the saved legal page, not terms of sale', async () => {
    const html=await renderPolicy('mentions-legales',{terms_of_service:{body:'Wrong terms'}},'<p>Mentions légales enregistrées</p>');
    expect(html).toContain('<p>Mentions légales enregistrées</p>');
    expect(html).not.toContain('Wrong terms');
  });
  it('uses a dedicated legal-notice policy when one is available', async () => {
    expect(await renderPolicy('mentions-legales',{policies:[{url:'/policies/legal-notice',body:'Mentions mises à jour'}]},'Ancienne page')).toContain('Mentions mises à jour');
  });
  it('renders current privacy, shipping and refund text inline', async () => {
    expect(await renderPolicy('confidentialite',{privacy_policy:{body:'Nouvelle confidentialité'}},'Page fallback')).toContain('Nouvelle confidentialité');
    const html=await renderPolicy('livraison-retours',{shipping_policy:{body:'Nouvelle livraison'},refund_policy:{body:'Nouveaux retours'}});
    expect(html).toContain('Nouvelle livraison');expect(html).toContain('Nouveaux retours');
  });
  it('does not fabricate legal content when no Shopify source exists', async () => {
    const html=await renderPolicy('mentions-legales',{});
    expect(html).toContain('policies.unavailable');expect(html).toContain('contact@norticam.com');
  });
});
