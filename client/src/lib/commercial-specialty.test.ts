import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { commercialPages, contextualCollectionLinks, specialtyCollectionProducts } from './commercial-pages';
import { commercialDecisions } from './commercial-decisions';
import { products } from './store-data';
import { themePath } from './theme-runtime';
import type { StoreProduct } from './shopify';
import type { ProductSpecs } from './product-specs';

const catalog: StoreProduct[] = products.map(product => ({ ...product, verified: true, currency: 'EUR' }));
const omni = catalog.find(product => product.handle === 'dashcam-voiture-360-4k')!;
const jmcq = catalog.find(product => product.handle === 'dashcam-moto-carplay-dvr')!;
const routes = ['/dashcam-voiture-360', '/ecran-moto-carplay'];

describe('distinct existing specialty collection intentions', () => {
  it('selects only real relevant catalogue products, without creating a product', () => {
    expect(specialtyCollectionProducts(routes[0], catalog)?.map(product => product.handle)).toEqual(['dashcam-voiture-360-4k']);
    expect(specialtyCollectionProducts(routes[1], catalog)?.map(product => product.handle)).toEqual(['dashcam-moto-4k', 'dashcam-moto-carplay-dvr']);
    expect(specialtyCollectionProducts('/dashcam-voiture', catalog)).toBeUndefined();
    expect(specialtyCollectionProducts(routes[0], [])).toEqual([]);
  });

  it('does not revive omitted or denied structured capabilities from an old title', () => {
    for (const state of [false, null, undefined]) {
      const rotation: ProductSpecs = { version: 1, vehicle: 'voiture', capabilities: { rotation: state } };
      const carplay: ProductSpecs = { version: 1, vehicle: 'moto', capabilities: { carplay: state } };
      expect(specialtyCollectionProducts(routes[0], [{ ...omni, specs: rotation }])).toEqual([]);
      expect(specialtyCollectionProducts(routes[1], [{ ...jmcq, specs: carplay }])).toEqual([]);
    }
  });

  it('uses explicitly positive structured data and the documented vehicle', () => {
    const rotating = { ...omni, productType: 'Ancienne classification moto', title: 'Caméra orientable', specs: { version: 1 as const, vehicle: 'voiture' as const, facts: { rotation: 'Objectif motorisé à 360°' }, capabilities: { rotation: true } } };
    const screen = { ...jmcq, title: 'Nouvel écran connecté', productType: 'Ancienne classification voiture', specs: { version: 1 as const, vehicle: 'moto' as const, capabilities: { carplay: true } } };
    expect(specialtyCollectionProducts(routes[0], [rotating])).toEqual([rotating]);
    expect(specialtyCollectionProducts(routes[1], [screen])).toEqual([screen]);
    expect(specialtyCollectionProducts(routes[0], [{ ...rotating, specs: { ...rotating.specs, facts: { rotation: 'Rotation de 180°' } } }])).toEqual([]);
  });

  it('does not turn an explicit negative or a competing-product comparison into a capability', () => {
    expect(specialtyCollectionProducts(routes[0], [{ ...omni, description: 'Rotation 360 non disponible' }])).toEqual([]);
    expect(specialtyCollectionProducts(routes[1], [{ ...jmcq, description: 'Sans CarPlay' }])).toEqual([]);
    expect(specialtyCollectionProducts(routes[1], [{ ...jmcq, description: 'CarPlay non pris en charge' }])).toEqual([]);
    expect(specialtyCollectionProducts(routes[0], [{ ...omni, title: 'Caméra fixe', details: [], description: 'Comparez aussi notre caméra 360°.' }])).toEqual([]);
    expect(specialtyCollectionProducts(routes[1], [{ ...jmcq, title: 'Caméra moto', details: [], description: 'Une alternative à notre écran CarPlay.' }])).toEqual([]);
  });

  it('preserves live commerce objects rather than replacing their price, stock or variants', () => {
    const current = { ...omni, handle: 'nouveau-handle-shopify', price: 347.21, currency: 'EUR', available: false, variants: [{ ...omni.variants[0], price: 347.21, availableForSale: false }] };
    expect(specialtyCollectionProducts(routes[0], [current])?.[0]).toBe(current);
  });

  it('can include newly added Shopify products from explicit descriptions, without a fixed handle list', () => {
    const rotation = { ...omni, id: 'new-product-id', handle: 'new-camera', title: 'Nouvelle caméra voiture', description: 'Caméra 4K rotative à 360°.', details: [] };
    const screen = { ...jmcq, id: 'new-screen-id', handle: 'new-screen', title: 'Nouvel écran moto', description: 'Écran avec Apple CarPlay sans fil.', details: [] };
    expect(specialtyCollectionProducts(routes[0], [rotation])).toEqual([rotation]);
    expect(specialtyCollectionProducts(routes[1], [screen])).toEqual([screen]);
  });

  it('provides focused criteria, FAQs and distinct titles without extending the route catalogue', () => {
    const rotation = commercialPages[routes[0]];
    const carplay = commercialPages[routes[1]];
    expect(rotation.title).toMatch(/360°.*rotative/);
    expect(carplay.title).toMatch(/CarPlay.*navigation.*DVR/);
    expect(rotation.title).not.toBe(carplay.title);
    for (const route of routes) {
      const page = commercialPages[route];
      expect(page.criteria).toHaveLength(3);
      expect(page.faq).toHaveLength(5);
      expect(page.intro.split(/\s+/).length).toBeLessThan(65);
      expect(page.related).toHaveLength(3);
      expect(commercialDecisions[route].picks.every(([handle]) => products.some(product => product.handle === handle))).toBe(true);
    }
  });

  it('keeps rotation, remote access, kit and simultaneous CarPlay/DVR limits explicit', () => {
    const rotation = JSON.stringify(commercialPages[routes[0]]);
    const carplay = JSON.stringify(commercialPages[routes[1]]);
    expect(rotation).toContain('pas nécessairement');
    expect(rotation).toContain('simultanément');
    expect(rotation).toContain('4G incluse');
    expect(rotation).not.toMatch(/regarde partout|couvre tous les angles|oriente automatiquement|se dirige automatiquement/i);
    expect(carplay).toContain('hors mode CarPlay');
    expect(carplay).toContain('ne promettons pas une compatibilité universelle');
    expect(carplay).toContain('faisceau ACC fourni');
  });

  it('links broad vehicle collections to native specialist destinations, never frontpage', () => {
    expect(themePath(contextualCollectionLinks['/dashcam-voiture'].href)).toBe('/collections/dashcam-voiture-360');
    expect(themePath(contextualCollectionLinks['/dashcam-moto'].href)).toBe('/collections/ecran-moto-carplay');
    expect(JSON.stringify(contextualCollectionLinks)).not.toContain('frontpage');
    for (const route of routes) {
      for (const [href] of commercialPages[route].related!) {
        expect(themePath(href)).toMatch(/^\/(?:collections|pages|blogs)\//);
        expect(href).not.toContain('frontpage');
      }
    }
  });

  it('renders links and products in the existing server-compatible React tree, not in an effect', async () => {
    const shop = await readFile('client/src/pages/ShopifyStorePages.tsx', 'utf8');
    const content = await readFile('client/src/components/CommercialContent.tsx', 'utf8');
    expect(shop).toContain('const specialty = specialtyCollectionProducts(location, products)');
    expect(shop).toContain('href={contextualLink.href}');
    expect(shop).toContain('imageContext="compact"');
    expect(shop.indexOf('<ProductCard key={product.id}')).toBeLessThan(shop.indexOf('<CommercialContent route={location}'));
    expect(content).toContain('page.related.map');
    expect(content).toContain('href={href}');
    expect(content).toContain('money(p.price,p.currency)');
    expect(content).toContain('href="/quiz"');
    expect(content).toContain('href="/comparatif"');
  });

  it('aligns the unused legacy specialty SEO copy without unsupported 360 or popularity promises', async () => {
    const legacy = await readFile('scripts/prerender-seo.ts', 'utf8');
    for (const route of routes) {
      expect(legacy).toContain(`title: commercialPages["${route}"].title`);
      expect(legacy).toContain(`faq: commercialPages["${route}"].faq.map`);
    }
    expect(legacy).not.toMatch(/70 % des conducteurs|couverture maximale.*360|regarde partout|rotation permet d’orienter.*événement détecté/i);
  });
});
