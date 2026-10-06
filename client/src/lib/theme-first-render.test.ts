import { afterEach, describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { Router } from 'wouter';
import App, { defaultPages, type StorefrontPages } from '../App';
import { CatalogProvider, useCatalog } from '../contexts/CatalogContext';
import { RenderContext } from './seo-render';
import { mapProduct } from './shopify';
import fs from 'node:fs/promises';

const raw = {
  id: 'gid://shopify/Product/999999', handle: 'nouveau-modele', title: 'Modèle Shopify actuel', vendor: 'Fabricant', productType: 'Dashcam voiture',
  description: 'Description actuelle', descriptionHtml: '<p>Description actuelle</p>', availableForSale: true,
  images: { nodes: [] }, norticamSpecs: { version: 1, facts: { resolution: '1080p' } },
  variants: { nodes: [{ id: 'gid://shopify/ProductVariant/123', title: 'Kit actuel', availableForSale: true, price: { amount: '17.42', currencyCode: 'EUR' }, selectedOptions: [], image: null }] },
};
const pages = Object.fromEntries(Object.keys(defaultPages).map(name => [name, function PageProbe() {
  const { loading, products, error } = useCatalog();
  return createElement('main', null, `${name}|loading:${loading}|products:${products.length}|price:${products[0]?.price}|error:${error}`);
}])) as StorefrontPages;
function CatalogProbe() {
  const { loading, products } = useCatalog();
  return createElement('p', null, `${loading ? 'loading' : 'ready'}:${products.length}:${products[0]?.price}`);
}
afterEach(() => vi.unstubAllGlobals());
function native() {
  vi.stubGlobal('window', { NorticamTheme: { path: '/', root: '/', currency: 'EUR', products: [raw], assets: {}, payments: '', contactForm: '' } });
}

describe('first render stays populated without an artificial catalogue or route loading phase', () => {
  it('uses the Liquid catalogue immediately and does not fetch during its first render', () => {
    native();
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
    const html = renderToString(createElement(CatalogProvider, null, createElement(CatalogProbe)));
    expect(html).toContain('ready:1:17.42');
    expect(html).not.toContain('loading');
    expect(fetch).not.toHaveBeenCalled();
  });
  it('keeps an explicitly empty native catalogue empty rather than injecting snapshot products', () => {
    native(); (window as any).NorticamTheme.products = [];
    expect(renderToString(createElement(CatalogProvider, null, createElement(CatalogProbe)))).toContain('ready:0:');
  });
  it('takes the supplied SSR catalogue as authoritative', () => {
    native();
    const supplied = [{ ...mapProduct(raw), price: 42 }];
    const html = renderToString(createElement(RenderContext.Provider, { value: { path: '/', catalog: supplied } }, createElement(CatalogProvider, null, createElement(CatalogProbe))));
    expect(html).toContain('ready:1:42');
  });
  it.each([['/', 'Home'], ['/dashcam-voiture', 'Shop'], ['/produits/nouveau-modele', 'ProductDetail'], ['/conseils/mode-parking', 'GuideArticle'], ['/quiz', 'Quiz'], ['/suivi-colis', 'OrderTracking']])('renders %s from the synchronous native page set on the first pass', (path, name) => {
    native();
    const html = renderToString(createElement(Router, { ssrPath: path }, createElement(App, { pages })));
    expect(html).toContain(`${name}|loading:false|products:1|price:17.42`);
    expect(html).not.toContain('Chargement de la page NORTICAM');
    expect(html).not.toContain('Switched to client rendering');
  });
  it('keeps SSR homepage synchronous and downloads the native page before touching existing HTML', async () => {
    expect((defaultPages.Home as any).$$typeof).not.toBe(Symbol.for('react.lazy'));
    const source = await fs.readFile('client/src/theme-entry.tsx', 'utf8');
    expect(source).toContain('await loadThemePage(runtime.path');
    expect(source.indexOf('await loadThemePage')).toBeLessThan(source.indexOf('prepareHomeIslands(root, runtime)'));
    expect(source).not.toContain("import Home from");
    expect(source).toContain('<Route path={route}><Page /></Route>');
  });
});
