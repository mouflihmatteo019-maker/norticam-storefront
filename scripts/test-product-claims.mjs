// Run against the isolated Liquid preview; no orders, supplier changes or Google actions.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { parseHTML } from 'linkedom';

const catalogue = JSON.parse(await fs.readFile('release/theme-catalog-reference.json', 'utf8'));
const base = process.env.NORTICAM_CLAIMS_PREVIEW || 'http://127.0.0.1:4331';
const uncertain = /non\s+(?:précisé|documenté|renseigné)|à\s+confirmer|génération\s+livrée|version\s+livrée|D6WL\s*(?:ou|\/)\s*D6RL|confirmez\s+le\s+nombre\s+de\s+caméras|selon\s+(?:la\s+)?version/i;
let fields = 0;
for (const product of catalogue) {
  const response = await fetch(`${base}/products/${product.handle}`);
  assert.equal(response.status, 200, product.handle);
  const { document } = parseHTML(await response.text());
  const main = document.querySelector('main');
  assert(main, product.handle);
  assert.equal(main.querySelectorAll('h1').length, 1, product.handle);
  assert(!uncertain.test(main.textContent), `Uncertain visible copy: ${product.handle}: ${main.textContent.match(uncertain)?.[0]}`);
  for (const field of main.querySelectorAll('[data-product-fact]')) {
    assert(field.textContent.trim(), `Empty technical row: ${product.handle}`);
    fields++;
  }
  for (const image of main.querySelectorAll('img[alt]')) assert(!uncertain.test(image.getAttribute('alt')), `Uncertain ALT: ${product.handle}`);
  assert(main.querySelector('[data-shopify-add]'), `Missing purchase action: ${product.handle}`);
  assert(main.querySelector('[data-product-practical]'), `Missing practical accordion: ${product.handle}`);
  assert(main.querySelector('[data-shopify-native-offer] input[name="id"]')?.value, `Missing native variant binding: ${product.handle}`);
  for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
    assert(!uncertain.test(script.textContent), `Uncertain structured data: ${product.handle}`);
    JSON.parse(script.textContent);
  }
}
console.log(`PASS: ${catalogue.length} product pages, ${fields} populated technical fields, initial HTML/ALT/schema without uncertain claims, purchase and practical markers retained.`);
