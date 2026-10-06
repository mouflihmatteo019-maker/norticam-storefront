// Node DOM integration test, not a browser, network test or visual/Lighthouse test.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { parseHTML } from 'linkedom';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const source = await fs.readFile('snippets/norticam-view-0.liquid', 'utf8');
const html = source.replace(/{%[\s\S]*?%}/g, '').replace(/{{[\s\S]*?}}/g, '');
const { window } = parseHTML(`<!doctype html><html><head></head><body><div id="root">${html}</div></body></html>`);
const location = { origin: 'https://norticam.com', pathname: '/', search: '', hash: '', href: 'https://norticam.com/', assign: url => { location.destination = url; } };
const store = new Map();
const storage = { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, v), removeItem: k => store.delete(k) };
Object.assign(globalThis, { window, document: window.document, HTMLElement: window.HTMLElement, Element: window.Element, Node: window.Node, location, localStorage: storage });
window.location = location;
window.scrollTo = () => {};
window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
globalThis.addEventListener = window.addEventListener.bind(window);
globalThis.removeEventListener = window.removeEventListener.bind(window);
globalThis.dispatchEvent = window.dispatchEvent.bind(window);
window.NorticamTheme = { path: '/', root: '/', currency: 'EUR', products: [], assets: {}, payments: '', contactForm: '' };
window.Shopify = { customerPrivacy: { currentVisitorConsent: () => ({ analytics: 'yes', marketing: 'yes' }) } };
const cart = { currency: 'EUR', item_count: 1, items_subtotal_price: 9990, total_price: 9990, items: [{ key: '123:test', quantity: 1, final_price: 9990, final_line_price: 9990, variant_id: 123, product_id: 456, handle: 'test-camera', product_title: 'Test caméra', vendor: 'NORTICAM', variant_title: 'Kit', featured_image: null }] };
const requests = [];
globalThis.fetch = async url => {
  requests.push(String(url));
  assert.match(String(url), /\/cart\.js(?:\?|$)/, 'No external requests allowed by DOM test');
  return { ok: true, json: async () => cart };
};
const originalHero = document.querySelector('.norticam-road-hero');
const originalImage = document.querySelector('.norticam-road-hero__image');
const originalMarkup = originalHero.outerHTML;
const main = document.getElementById('main-content');
await import(pathToFileURL(path.resolve('assets/norticam-app.js')).href);
async function until(predicate) {
  for (let i = 0; i < 100; i++) {
    if (predicate()) return;
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  throw new Error('DOM interaction timed out');
}
await until(() => document.getElementById('norticam-home-runtime') && document.querySelector('[data-home-header] button'));
await until(() => document.querySelector('[aria-label="Ouvrir le panier"]')?.textContent.includes('1'));
assert.equal(document.getElementById('main-content'), main);
assert.equal(document.querySelector('.norticam-road-hero'), originalHero);
assert.equal(document.querySelector('.norticam-road-hero__image'), originalImage);
assert.equal(originalHero.outerHTML, originalMarkup);
assert.equal(document.querySelectorAll('#home-hero-title').length, 1);
const click = element => { assert(element); element.dispatchEvent(new window.Event('click', { bubbles: true })); };
click(document.querySelector('[aria-label="Ouvrir le menu"]'));
await until(() => document.querySelector('[aria-label="Fermer le menu"]'));
assert(document.querySelector('#mobile-navigation a[href="/pages/contact"]'));
click(document.querySelector('[aria-label="Fermer le menu"]'));
click(document.querySelector('[aria-label="Ouvrir le panier"]'));
await until(() => document.querySelector('[role="dialog"]'));
assert(document.querySelector('[role="dialog"]').textContent.includes('Test caméra'));
const checkout = [...document.querySelectorAll('[role="dialog"] button')].find(button => button.textContent.includes('Continuer vers le paiement sécurisé'));
click(checkout);
await until(() => location.destination);
assert.equal(location.destination, 'https://norticam.com/checkout');
assert(requests.length >= 2, 'Checkout revalidates server cart');
assert.equal(document.querySelector('.norticam-road-hero__image'), originalImage);
console.log('PASS: compiled ES modules, retained hero/main identity and markup, one H1, menu/contact link, cart restore/open, checkout URL after mocked cart revalidation. No real requests or orders.');
process.exit(0);
