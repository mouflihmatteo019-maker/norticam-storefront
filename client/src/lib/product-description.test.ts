import { describe, expect, it } from 'vitest';
import { Liquid } from 'liquidjs';
import { parseHTML } from 'linkedom';
import fs from 'node:fs/promises';
import { cleanProductDescriptionHtml, cleanProductDescriptionText, cleanProductTitle } from './product-description';
// @ts-expect-error The Node-only generator intentionally has no client dependency.
import { productDescriptionLiquid } from '../../../scripts/product-description-liquid.mjs';

const engine = new Liquid({
  relativeReference: false,
  fs: {
    readFileSync: () => productDescriptionLiquid(),
    readFile: async () => productDescriptionLiquid(),
    existsSync: () => true,
    exists: async () => true,
    resolve: (_root: string, file: string) => file,
    dirname: () => '.',
    contains: () => true,
  },
});
const native = (description: string, mode?: string, productId?: string | number) => engine.parseAndRender(productDescriptionLiquid(), { description, mode, product: { id: productId } });

describe('shared product-description editorial omission', () => {
  it('omits unknown statements and preserves safety/conditional facts in the same paragraph', () => {
    const html = '<h2>Installation</h2><p>Confirmez le nombre de caméras fourni. Prévoyez une alimentation adaptée. Le Wi-Fi ne donne pas accès à Internet.</p><ul><li>Capteur non précisé.</li><li>Le mode parking nécessite un kit compatible.</li></ul>';
    const cleaned = cleanProductDescriptionHtml(html);
    const { document } = parseHTML(cleaned);
    expect(document.querySelectorAll('p')).toHaveLength(1);
    expect(document.querySelectorAll('li')).toHaveLength(1);
    expect(cleaned).not.toMatch(/confirmez|non précisé/i);
    expect(cleaned).toContain('Prévoyez une alimentation adaptée.');
    expect(cleaned).toContain('Le Wi-Fi ne donne pas accès à Internet.');
    expect(cleaned).toContain('Le mode parking nécessite un kit compatible.');
  });
  it('retains unchanged rich-text formatting, true variant conditions and operational limits', async () => {
    const html = '<p><strong>Filmez vos trajets.</strong></p><ul><li>Caméra arrière selon le kit choisi.</li><li>Autonomie non garantie : elle dépend de l’usage.</li><li>La rotation 360° ne filme pas simultanément tous les angles.</li></ul>';
    expect(cleanProductDescriptionHtml(html)).toBe(html);
    expect(await native(html)).toBe(html);
  });
  it('keeps mixed inline markup valid when removing an unknown sentence', async () => {
    const html = '<h2>Montage</h2><p class="copy"><strong>Vérifiez la référence D6WL ou D6RL. Protégez les connexions.</strong></p><h2>À savoir</h2><p>Accessoires inclus à vérifier.</p>';
    const expected = '<h2>Montage</h2><p class="copy">Protégez les connexions.</p>';
    expect(cleanProductDescriptionHtml(html)).toBe(expected);
    expect(await native(html)).toBe(expected);
    const { document } = parseHTML(expected);
    expect(document.querySelector('p')?.textContent).toBe('Protégez les connexions.');
  });
  it('does not replace unknown specifications with made-up facts', async () => {
    const html = '<h2>Spécifications</h2><ul><li>Capteur non documenté.</li><li>GPS à confirmer.</li></ul>';
    expect(cleanProductDescriptionHtml(html)).toBe('');
    expect(await native(html)).toBe('');
    expect(cleanProductDescriptionText('Capteur non précisé. GPS à confirmer.')).toBe('');
  });
  it('omits empty multiline lists and their headings without broken list markup', async () => {
    for (const html of [
      '<h2>Spécifications</h2><ul>\n<li>Capteur non documenté.</li>\n<li>GPS à confirmer.</li>\n</ul>',
      '<ul>\n<li>Capteur non documenté.</li>\n<li>GPS à confirmer.</li>\n</ul>',
      '<h2>Spécifications</h2><ul class="specifications">\n<li>Capteur non documenté.</li>\n<li>GPS à confirmer.</li>\n</ul>',
    ]) {
      expect(cleanProductDescriptionHtml(html)).toBe('');
      expect(await native(html)).toBe('');
    }
  });
  it('omits only ambiguous model alternatives in product titles', async () => {
    for (const title of ['Dashcam moto étanche — VSYS D6WL/D6RL', 'VSYS D6WL ou D6RL : double dashcam moto']) {
      expect(await native(title, 'title')).toBe(cleanProductTitle(title));
      expect(cleanProductTitle(title)).toContain('VSYS');
      expect(cleanProductTitle(title)).not.toMatch(/D6[WR]L/);
    }
  });
  it('separates adjacent rich-text blocks when deriving plain/schema text', async () => {
    const html = '<p>Vidéo HDR.</p><p>Le mode parking nécessite un kit compatible.</p><h2>Installation</h2><p>Ne branchez jamais la caméra directement sur le 12 V.</p>';
    const text = cleanProductDescriptionText(html);
    expect(text).toContain('HDR. Le mode parking');
    expect(text).toContain('Installation Ne branchez');
    expect(await native(html, 'text')).toBe(text);
  });
  it('omits unsupported A210 claims without removing established features of other models', async () => {
    const html = '<ul><li>Wi-Fi 6 pour une connexion rapide.</li><li>Supercondensateur et surveillance selon l’équipement.</li><li>Fonctions GPS selon la variante.</li><li>Vidéo HDR 1080p.</li></ul>';
    const a210 = 'gid://shopify/Product/16413273293149';
    expect(cleanProductDescriptionHtml(html, a210)).toBe('<ul><li>Vidéo HDR 1080p.</li></ul>');
    expect(await native(html, undefined, 16413273293149)).toBe(cleanProductDescriptionHtml(html, a210));
    expect(cleanProductDescriptionHtml(html, '16413273620829')).toBe(html);
    expect(await native(html, undefined, 16413273620829)).toBe(html);
  });
  it('renders identical native and JavaScript content for all 22 current Shopify descriptions', async () => {
    const catalogue = JSON.parse(await fs.readFile('release/theme-catalog-reference.json', 'utf8'));
    expect(catalogue).toHaveLength(22);
    for (const product of catalogue) {
      expect(await native(product.descriptionHtml, undefined, product.id), product.handle).toBe(cleanProductDescriptionHtml(product.descriptionHtml, product.id));
      expect(await native(product.description, 'text', product.id), product.handle).toBe(cleanProductDescriptionText(product.description, product.id));
      expect(await native(product.title, 'title'), product.handle).toBe(cleanProductTitle(product.title));
    }
  });
});
