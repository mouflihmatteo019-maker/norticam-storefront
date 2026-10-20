import { describe, expect, it, vi, afterEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'node:fs/promises';
import { Liquid } from 'liquidjs';
import { CartExpiryNotice } from '../components/CartExpiryNotice';
import { cartExpiryAllowed } from './cart-expiry-policy';
import { merchantContact } from './merchant-contact';
// The build transformer is also tested against Liquid without browser hydration.
// @ts-expect-error build script has no TypeScript declaration
import { bindProductOffer, bindPaymentBadges, bindProductFacts } from '../../../scripts/product-offer-bindings.mjs';

afterEach(() => vi.unstubAllGlobals());
const engine = new Liquid();
engine.registerFilter('money', n => `${(Number(n) / 100).toFixed(2)} EUR`);
const offer = `<p data-shopify-selected-price>OLD PRICE</p><span data-shopify-availability>Disponible</span><div data-shopify-variant-picker><fieldset>OLD OPTION</fieldset></div><button data-shopify-add disabled="">Ajouter</button><p data-shopify-selected-price>OLD PRICE</p><button data-shopify-add>Ajouter</button>`;
describe('merchant transparency safeguards', () => {
  it('does not render a timer, including for expired dates persisted by the old version', () => {
    expect(cartExpiryAllowed()).toBe(false);
    expect(renderToStaticMarkup(<CartExpiryNotice expiresAt={1} onExpire={() => { throw new Error('Must not expire'); }} />)).toBe('');
  });
  it('guards restoring and clearing carts against the disabled legacy timer', async () => {
    const code = await fs.readFile('client/src/contexts/CartContext.tsx', 'utf8');
    expect(code).toMatch(/function savedExpiry\(\) \{\s+if \(!cartExpiryAllowed\(\)\) return null/);
    expect(code).toMatch(/async function expire[^}]+if \(!cartExpiryAllowed\(\)\) return/);
    expect(code).toContain('if (!cartExpiryAllowed()) persistExpiry(null)');
    expect(code).toContain('if (cartExpiryAllowed() && restored?.totalQuantity');
  });
  it('exposes only owner-confirmed contact facts, without invented service hours or response promises', () => {
    expect(merchantContact.phoneHref).toBe('tel:+33784390443');
    expect(merchantContact.availability).toContain('Sans horaires fixes');
    expect(merchantContact.availability).not.toMatch(/24 h|48 h|9h|17h/);
    expect(merchantContact.salesTerms).toBe('/policies/terms-of-sale');
  });
  it.each([true, false])('uses the request-selected live price and stock before JS (%s)', async available => {
    const selected = { id: '202', title: 'Kit actuel', price: 12345, available };
    const html = await engine.parseAndRender(bindProductOffer(offer), {
      product: {url:'/products/current', variants:[{id:'101',title:'Autre',price:5000,available:true},selected], selected_or_first_available_variant:selected},
      routes:{root_url:'/fr/'},
    });
    expect(html.match(/123\.45 EUR/g)?.length).toBeGreaterThanOrEqual(2);
    expect(html).not.toMatch(/OLD PRICE|OLD OPTION/);
    expect(html).toContain('value="202" selected');
    expect(html.match(/name="id" value="202"/g)).toHaveLength(2);
    expect(html).toContain('action="/fr/cart/add"');
    expect(html).toContain(available ? '>Disponible</span>' : '>Indisponible</span>');
    expect(html.match(/<button[^>]* disabled/g)?.length || 0).toBe(available ? 0 : 2);
  });
  it('does not advertise a price or enabled purchase if no variant exists', async () => {
    const html = await engine.parseAndRender(bindProductOffer(offer), {product:{variants:[]}, routes:{root_url:'/'}});
    expect(html).toContain('Configuration à vérifier');
    expect(html.match(/<button[^>]* disabled/g)).toHaveLength(2);
  });
  it('fails the build when purchase markers disappear', () => {
    expect(() => bindProductOffer('<p>Changed template</p>')).toThrow('markers missing');
  });
  it('renders only enabled Shopify payment methods in the initial response', async () => {
    const native = new Liquid();
    native.registerFilter('payment_type_svg_tag', n => `<svg aria-label="${n}"></svg>`);
    const html = await native.parseAndRender(bindPaymentBadges('<div aria-label="Moyens de paiement acceptés"><span>Unverified card</span></div>'), {shop:{enabled_payment_types:['visa']}});
    expect(html).toContain('aria-label="visa"');
    expect(html).not.toContain('Unverified card');
  });
  it('uses live technical facts and does not restore a capability absent from the current record', async () => {
    const source = '<table><tr><td data-product-fact="resolution">OLD 4K</td><td data-product-fact="gps">OLD GPS</td><td data-product-fact="wifi">OLD WIFI</td><td data-product-fact="sensor">OLD SENSOR</td></tr></table>';
    const product = {metafields:{custom:{norticam_specs:{type:'json',value:{version:1,facts:{resolution:'3K <verified>',gps:'External module'},capabilities:{gps:false}}}}}};
    const html = await engine.parseAndRender(bindProductFacts(source), {product});
    expect(html).toContain('3K &lt;verified&gt;');
    expect(html).toContain('Non — External module');
    expect(html).toContain('Non précisé');
    expect(html).toContain('Capteur non précisé');
    expect(html).not.toContain('OLD');
  });
  it('preserves reviewed fallback facts only when no supported Shopify technical record exists', async () => {
    expect(await engine.parseAndRender(bindProductFacts('<td data-product-fact="resolution">1080p</td>'), {product:{}})).toContain('1080p');
    expect(() => bindProductFacts('<td data-product-fact="invented">bad</td>')).toThrow('Unknown product fact');
  });
});
