import { describe, expect, it } from 'vitest';
import { products } from './store-data';
import { mapProduct, catalogProductFields } from './shopify';
import { parseProductSpecs, type ProductSpecs } from './product-specs';
import { isHelmetCamera, productFacts, recommend } from './product-facts';
import { conversionCopy } from './product-conversion';

const a510 = products.find(product => product.handle === 'dashcam-3k-voiture')!;
const a510Specs: ProductSpecs = {
  version: 1, vehicle: 'voiture', mount: 'vehicle',
  facts: { resolution: '3K HDR 2592 × 1944 px', coverage: 'Caméra avant et caméra arrière incluse', gps: 'GPS intégré', wifi: 'Wi-Fi + application 70mai', parking: 'Mode parking avec kit d’alimentation compatible non inclus', night: 'Traitement nocturne 70mai avec capteur Sony IMX675', storage: 'Carte microSD non incluse : carte compatible à prévoir', loop: 'Enregistrement en boucle' },
  capabilities: { dual: true, gps: true, wifi: true, parking: true, night: true, loop: true },
  kit: ['Caméra arrière incluse', 'Carte microSD non incluse', 'Kit d’alimentation parking non inclus'],
};
const rawProduct = (specs?: unknown, id = a510.id) => ({
  id, handle: 'handle-shopify-actuel', title: 'Titre Shopify actuel', vendor: '70mai', productType: 'Dashcam voiture',
  norticamSpecs: specs, description: 'Description actuelle', descriptionHtml: '<p>Description actuelle</p>',
  availableForSale: true, images: { nodes: [] }, variants: { nodes: [{ id: 'gid://shopify/ProductVariant/123', title: 'Kit actuel', availableForSale: true, price: { amount: '17.42', currencyCode: 'EUR' }, selectedOptions: [], image: null }] },
});
const answers = { vehicle: 'voiture', coverage: 'dual', priority: 'night', parking: 'yes', budget: '100' };

describe('validated Shopify-managed product facts', () => {
  it('accepts Liquid JSON and Storefront JSON metafields using the same contract', () => {
    expect(parseProductSpecs(a510Specs)).toEqual(a510Specs);
    expect(parseProductSpecs({ type: 'json', value: JSON.stringify(a510Specs) })).toEqual(a510Specs);
    expect(catalogProductFields(true)).toContain('metafield(namespace: "custom", key: "norticam_specs") { type value }');
  });
  it('rejects malformed data, unsupported versions and unbounded or HTML content', () => {
    for (const invalid of [null, { version: 2 }, { version: 1, capabilities: { gps: 'yes' } }, { version: 1, facts: { storage: '<script>alert(1)</script>' } }, { version: 1, kit: ['x'.repeat(501)] }, { type: 'single_line_text_field', value: JSON.stringify(a510Specs) }, { type: 'json', value: '{bad' }]) {
      expect(parseProductSpecs(invalid)).toBeUndefined();
    }
  });
  it('keeps the documented fallback when optional metafield is absent or invalid', () => {
    expect(mapProduct(rawProduct()).details).toEqual(a510.details);
    expect(mapProduct(rawProduct({ version: 2 })).details).toEqual(a510.details);
    const unknown = mapProduct(rawProduct(null, 'gid://shopify/Product/999999'));
    expect(unknown.details).toEqual([]);
    expect(productFacts(unknown).gps).toBe('Non précisé');
  });
  it('takes validated specs as authoritative without restoring omitted snapshot facts', () => {
    const product = mapProduct(rawProduct({ version: 1, facts: { resolution: '1080p' }, capabilities: { gps: false } }));
    expect(productFacts(product).resolution).toBe('1080p');
    expect(productFacts(product).gps).toBe('Non');
    expect(productFacts(product).night).toBe('Non précisée');
    expect(productFacts(product).dual).toBe(false);
    expect(product.details).not.toContain('GPS intégré : vitesse et position enregistrées sur la vidéo');
    expect(conversionCopy(product).ideal).not.toContain('3K');
    expect(conversionCopy(product).ideal).not.toContain('avant et arrière');
  });
  it('never uses the custom data as a price, stock, variant or SEO override', () => {
    const product = mapProduct(rawProduct({ ...a510Specs, price: 0, available: false, variants: [], seo: { title: 'Wrong' } }));
    expect(product.price).toBe(17.42); expect(product.available).toBe(true); expect(product.variants).toHaveLength(1);
    expect(product.specs).not.toHaveProperty('price'); expect(product.specs).not.toHaveProperty('seo');
    expect(product.descriptionHtml).toBe('<p>Description actuelle</p>');
  });
  it('updates new products, comparison facts, feature filters and quiz eligibility without a hard-coded identity', () => {
    const current = mapProduct(rawProduct(a510Specs, 'gid://shopify/Product/999999'));
    expect(productFacts(current).dual).toBe(true);
    expect(productFacts(current).gps.startsWith('Non')).toBe(false);
    expect(productFacts(current).parking.startsWith('Non')).toBe(false);
    expect(recommend([current], answers)[0]?.product.id).toBe(current.id);
    const changed = mapProduct(rawProduct({ version: 1, vehicle: 'voiture', facts: { gps: 'GPS dans une autre configuration' }, capabilities: { dual: false, gps: false, parking: null, night: null } }, 'gid://shopify/Product/999999'));
    expect(productFacts(changed).gps.startsWith('Non')).toBe(true);
    expect(productFacts(changed).parking).toBe('Non documenté pour ce modèle');
    expect(productFacts(changed).dual).toBe(false);
    expect(recommend([changed], answers)).toEqual([]);
    expect(recommend([changed], { ...answers, coverage: 'front', parking: 'no' })).toEqual([]);
  });
  it('does not turn a text mentioning an unconfirmed capability into a benefit or filter match', () => {
    const product = mapProduct(rawProduct({ version: 1, details: ['Wi-Fi à confirmer', 'Vision nocturne à confirmer'], facts: { night: 'Vision nocturne à confirmer' }, capabilities: { wifi: null, night: null } }));
    expect(product.details).toEqual([]);
    expect(productFacts(product).wifi).toBe('Non précisé');
    expect(conversionCopy(product).emotionalBenefits[2].title).not.toBe('Retrouver plus simplement une séquence utile');
  });
  it('uses structured mounting rather than a legacy handle to recommend helmet products', () => {
    const current = mapProduct({ ...rawProduct({ version: 1, vehicle: 'moto', mount: 'helmet', facts: { resolution: '1080p' } }, 'gid://shopify/Product/999999'), productType: 'Dashcam moto' });
    expect(isHelmetCamera(current)).toBe(true);
    expect(recommend([current], { vehicle: 'moto', coverage: 'helmet', priority: 'value', parking: 'no', budget: '100' })).toHaveLength(1);
    expect(isHelmetCamera({ ...products[0], specs: { version: 1, mount: 'vehicle' } })).toBe(false);
  });
  it('updates kit and objections from the structured source, including explicitly cleared kit lists', () => {
    const product = mapProduct(rawProduct(a510Specs));
    const copy = conversionCopy(product);
    expect(copy.kit).toEqual(a510Specs.kit);
    expect(copy.faq.find(([question]) => question.includes('carte mémoire'))?.[1]).toContain('microSD non incluse');
    expect(copy.faq.find(([question]) => question.includes('garé'))?.[1]).toContain('non inclus');
    const cleared = mapProduct(rawProduct({ version: 1, kit: [], capabilities: { parking: false } }));
    expect(conversionCopy(cleared).kit).toEqual([]);
    expect(conversionCopy(cleared).faq.find(([question]) => question.includes('carte mémoire'))?.[1]).toContain('ne précise pas');
    expect(conversionCopy(cleared).faq.find(([question]) => question.includes('garé'))?.[1]).toContain('n’est pas proposé');
  });
  it('fixes only verified A510 omissions in the existing fallback', () => {
    expect(productFacts(a510).storage).toContain('microSD non incluse');
    expect(productFacts(a510).loop).toBe('Enregistrement en boucle');
    expect(conversionCopy(a510).faq.find(([question]) => question.includes('carte mémoire'))?.[1]).toContain('microSD non incluse');
  });
  it('does not treat HDR alone or negative feature mentions as documented capabilities', () => {
    const product = { ...a510, details: ['HDR', 'Sans GPS', 'Wi-Fi non disponible', 'Vision nocturne non disponible'] };
    expect(productFacts(product).gps.startsWith('Non')).toBe(true);
    expect(productFacts(product).wifi.startsWith('Non')).toBe(true);
    expect(productFacts(product).night.startsWith('Non')).toBe(true);
    expect(productFacts({ ...product, details: ['HDR'] }).night).toBe('Non précisée');
    expect(productFacts({ ...product, details: ['Sans mode parking', 'Pas de caméra arrière incluse'] }).parking.startsWith('Non')).toBe(true);
    expect(productFacts({ ...product, details: ['Pas de caméra arrière incluse'] }).dual).toBe(false);
  });
  it('keeps specialized rotation and CarPlay criteria controlled by structured capability flags', () => {
    const product = mapProduct(rawProduct({ version: 1, facts: { rotation: 'Caméra orientable à 360°', carplay: 'CarPlay selon un autre kit' }, capabilities: { rotation: true, carplay: false } }));
    expect(productFacts(product).rotation).toBe('Caméra orientable à 360°');
    expect(productFacts(product).carplay.startsWith('Non')).toBe(true);
  });
});
