import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseHTML } from 'linkedom';
import { ProductPractical } from '../components/ProductPractical';
import { products } from './store-data';
import { practicalByProductId, productPractical, selectedKitFacts } from './product-practical';
import fs from 'node:fs/promises';

describe('product practical accordions', () => {
  it('covers all 22 catalogue models with three nonempty reviewed sections', () => {
    expect(Object.keys(practicalByProductId)).toHaveLength(22);
    for (const product of products) {
      const data = productPractical(product);
      expect(data.sources.length).toBeGreaterThan(0);
      for (const group of [data.usage, data.installation, data.preparation]) {
        expect(group.length).toBeGreaterThan(0);
        expect(group.every(f => f.label && f.text)).toBe(true);
      }
    }
  });
  it('uses stable product identity, never a handle or similar model name', () => {
    const product = products.find(p => p.handle === 'dashcam-3k-voiture')!;
    expect(productPractical({ ...product, handle: 'new-handle' } as any)).toBe(productPractical(product));
    const unknown = productPractical({ ...product, id:'gid://shopify/Product/999999' });
    expect(unknown.usage.map(f=>f.text).join(' ')).not.toContain('256 Go');
    expect(unknown.installation.map(f=>f.text).join(' ')).not.toContain('5 V / 2 A');
  });
  it('renders three native, initially closed, keyboard-operable disclosures without extra JS', () => {
    const html = renderToStaticMarkup(createElement(ProductPractical, { product:products[0], selected:products[0].variants[0] }));
    const { document } = parseHTML(html);
    expect(document.querySelectorAll('details')).toHaveLength(3);
    expect(document.querySelectorAll('details[open]')).toHaveLength(0);
    expect(document.querySelectorAll('details > summary')).toHaveLength(3);
    expect(document.querySelector('[data-product-practical]')?.getAttribute('aria-label')).toBe('Informations pratiques du produit');
    expect(html).toContain('sm:grid-cols-3');
  });
  it('only asserts missing accessories when the selected live variant explicitly says so', () => {
    const base = products[0].variants[0];
    expect(selectedKitFacts({ ...base, title:'Cam / No TF Card / NO HW', options:[] }).map(f=>f.text).join(' ')).toContain('n’est pas inclus');
    expect(selectedKitFacts({ ...base, title:'Cam / 128GB', options:[] }).map(f=>f.text).join(' ')).not.toContain('Sans carte');
    expect(selectedKitFacts({ ...base, title:'Default Title', options:[{ name:'Title', value:'Default Title' }] })).toEqual([]);
    expect(selectedKitFacts(undefined)[0].text).toContain('Sélectionnez');
  });
  it('does not merge ambiguous generations or invent undocumented specs', () => {
    for (const id of ['16413273653597','16413273456989','16413273489757','16413274014045','16413273981277','16413273882973','16413273719133','16413273686365']) {
      const data = practicalByProductId[id];
      const copy = [...data.usage,...data.installation,...data.preparation].map(f=>f.text).join(' ');
      expect(copy).not.toMatch(/5 V \/ [12] A|IP6[5678]|jusqu’à \d+ Go|\d+ h de vidéo/);
    }
  });
  it('places the block after payment, delivery and returns in the purchase column', async () => {
    const source = await fs.readFile('client/src/pages/ProductConversion.tsx','utf8');
    expect(source.indexOf('<ProductPractical')).toBeGreaterThan(source.indexOf('{reassurance.map'));
    expect(source.indexOf('<ProductPractical')).toBeLessThan(source.indexOf('product-emotional-benefits'));
  });
});
