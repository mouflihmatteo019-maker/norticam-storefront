import { describe, expect, it } from 'vitest';
import { Liquid } from 'liquidjs';
import { parseHTML } from 'linkedom';
import fs from 'node:fs/promises';
import { practicalByProductId } from './product-practical';

const withoutDocs = (text: string) => text.replace(/{%\s*doc\s*%}[\s\S]*?{%\s*enddoc\s*%}/g, '');
const engine = new Liquid();
async function render(product: object) {
  const selection = withoutDocs(await fs.readFile('snippets/norticam-practical-selection.liquid', 'utf8'));
  const source = withoutDocs(await fs.readFile('snippets/norticam-product-practical.liquid', 'utf8'))
    .replaceAll("{% render 'norticam-practical-selection', product: product %}", selection);
  return engine.parseAndRender(source, { product });
}

describe('initial Shopify practical information', () => {
  it('serves three reviewed disclosures for every stable product ID before JavaScript', async () => {
    for (const id of Object.keys(practicalByProductId)) {
      const html = await render({ id: Number(id), selected_or_first_available_variant: { title: 'Default Title' } });
      const { document } = parseHTML(html);
      expect(document.querySelectorAll('details')).toHaveLength(3);
      expect(document.querySelectorAll('details[open]')).toHaveLength(0);
      expect(html).toContain(practicalByProductId[id].usage[0].label);
    }
  });
  it('uses the request-selected variant and escapes its title', async () => {
    const html = await render({ id: 16413273620829, selected_or_first_available_variant: { title: 'Kit <front> / 128GB' } });
    expect(html).toContain('Kit &lt;front&gt; / 128GB');
    expect(html).not.toContain('Sans carte mémoire');
    expect(html).not.toContain('n’est pas inclus');
  });
  it('only identifies missing accessories explicitly excluded by that variant', async () => {
    const html = await render({ id: 16413273620829, selected_or_first_available_variant: { title: 'Cam / No TF Card / NO HW' } });
    expect(html).toContain('Sans carte mémoire');
    expect(html).toContain('n’est pas inclus');
  });
  it('keeps a safe native fallback for future products', async () => {
    const html = await render({ id: 999999, selected_or_first_available_variant: { title: 'Default Title' } });
    expect(parseHTML(html).document.querySelectorAll('details')).toHaveLength(3);
    expect(html).not.toContain('Default Title');
    expect(html).not.toContain('5 V / 2 A');
  });
  it('binds every generated product page to the live product rather than a frozen kit', async () => {
    const manifest = JSON.parse(await fs.readFile('release/shopify-theme-manifest.json', 'utf8'));
    const routes = manifest.routes as { route: string; native: string }[];
    const productRoutes = routes.map((route, index) => ({ ...route, index })).filter(route => route.native.startsWith('/products/'));
    expect(productRoutes).toHaveLength(22);
    for (const route of productRoutes) {
      const source = await fs.readFile(`snippets/norticam-view-${route.index}.liquid`, 'utf8');
      expect(source).toContain("{% render 'norticam-product-practical', product: product %}");
      expect(source).not.toContain('data-practical-selection');
    }
  });
});
