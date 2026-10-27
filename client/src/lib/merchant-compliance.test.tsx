import { describe, expect, it, vi, afterEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'node:fs/promises';
import { Liquid } from 'liquidjs';
import { CartExpiryNotice } from '../components/CartExpiryNotice';
import { cartExpiryAllowed } from './cart-expiry-policy';
import { merchantContact } from './merchant-contact';
import { SupportFAQ, supportQuestions } from '../components/SupportFAQ';
import { PromoBanner } from '../components/PromoBanner';
import { serviceCopy } from './service-copy';
import { products } from './store-data';
import { Router } from 'wouter';
// The build transformer is also tested against Liquid without browser hydration.
// @ts-expect-error build script has no TypeScript declaration
import { bindProductOffer, bindPaymentBadges, bindProductFacts } from '../../../scripts/product-offer-bindings.mjs';

afterEach(() => vi.unstubAllGlobals());
const engine = new Liquid();
engine.registerFilter('money', n => `${(Number(n) / 100).toFixed(2)} EUR`);
const offer = `<p data-shopify-selected-price>OLD PRICE</p><span data-shopify-availability>Disponible</span><div data-shopify-variant-picker><fieldset>OLD OPTION</fieldset></div><button data-shopify-add disabled="">Ajouter</button><p data-shopify-selected-price>OLD PRICE</p><button data-shopify-add>Ajouter</button>`;
describe('merchant transparency safeguards', () => {
  it('does not restore fixed parking duration promises from the fallback catalogue', () => {
    for (const handle of ['dashcam-3k-voiture', 'dashcam-wifi-5ghz', 'dashcam-4k-avant-arriere', 'dashcam-voiture-discrete-2k']) {
      const product = products.find(p => p.handle === handle)!;
      expect(product).toBeDefined();
      expect([product.description, ...product.details].join(' ')).not.toMatch(/\b(?:24|48)\s*h\b/i);
      expect(product.details.join(' ')).toContain('énergie disponible');
    }
  });
  it('renders neutral service labels without hiding the actual shipping and return terms', () => {
    const banner = renderToStaticMarkup(<PromoBanner />);
    expect(banner).toContain('Livraison en France métropolitaine');
    expect(banner).not.toMatch(/gratuite|offerte|🇫🇷/i);
    expect(Object.values(serviceCopy).join(' ')).not.toMatch(/gratuite|offerte/i);
    const faq = renderToStaticMarkup(<Router ssrPath="/informations/contact"><SupportFAQ /></Router>);
    expect(faq).toContain('La livraison est gratuite sans minimum');
    expect(faq).toContain('Chine');
    expect(faq).toContain('15e et le 30e jour');
  });
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
  it('exposes the service hours and response time confirmed by the owner on 20 October', () => {
    expect(merchantContact.phoneHref).toBe('tel:+33784390443');
    expect(merchantContact.availability).toContain('9 h à 17 h, 7 j/7 (heure de Paris)');
    expect(merchantContact.availability).toContain('Réponse sous 24 h');
    expect(merchantContact.salesTerms).toBe('/policies/terms-of-sale');
  });
  it('publishes accessible answers with explicit transit and distinct return costs', () => {
    const html = renderToStaticMarkup(<Router ssrPath="/informations/contact"><SupportFAQ /></Router>);
    expect(html).toContain('id="faq"');
    expect(html.match(/<details/g)).toHaveLength(supportQuestions.length);
    expect(html).toContain('5 à 10 jours ouvrés de transport');
    expect(html).toContain('1 à 2 jours ouvrés de préparation');
    expect(html).toContain('6 à 12 jours ouvrés');
    expect(html).toContain('pas d’une date de livraison garantie');
    expect(html).toContain('rembourse sur justificatif');
    expect(html).toContain('15e et le 30e jour');
    expect(html).toContain('NORTICAM prend en charge les frais de retour');
  });
  it('links identity and FAQ in the shared shell and preserves native contact content', async () => {
    const shell = await fs.readFile('client/src/components/StorefrontLayout.tsx', 'utf8');
    const contact = await fs.readFile('client/src/pages/Contact.tsx', 'utf8');
    expect(shell).toContain('href: "/informations/contact#identite", label: "À propos"');
    expect(shell).toContain('href="/informations/contact#faq"');
    expect(contact).toContain('<SupportFAQ />');
    expect(contact).toContain('dangerouslySetInnerHTML={{__html:nativeForm}}');
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
    expect(html).not.toContain('Non précisé');
    expect(html).not.toContain('Capteur non précisé');
    expect(html).not.toContain('OLD WIFI');
    expect(html).not.toContain('OLD SENSOR');
    expect(html).not.toContain('OLD');
  });
  it('preserves reviewed fallback facts only when no supported Shopify technical record exists', async () => {
    expect(await engine.parseAndRender(bindProductFacts('<td data-product-fact="resolution">1080p</td>'), {product:{}})).toContain('1080p');
    expect(() => bindProductFacts('<td data-product-fact="invented">bad</td>')).toThrow('Unknown product fact');
  });
  it('omits entire unknown rows and accepts newly added live facts without a rebuild', async () => {
    const source = '<table><tbody data-product-facts><tr><td data-product-fact="resolution">OLD 4K</td></tr></tbody></table>';
    const product = {metafields:{custom:{norticam_specs:{type:'json',value:{version:1,facts:{resolution:'3K',sensor:'Capteur non précisé',storage:'Carte à confirmer',power:'USB-C'},capabilities:{gps:null,wifi:false}}}}}};
    const html = await engine.parseAndRender(bindProductFacts(source), {product});
    expect(html.match(/<tr /g)).toHaveLength(3);
    expect(html).toContain('USB-C');
    expect(html).toContain('>Non</td>');
    expect(html).not.toMatch(/OLD|non précisé|à confirmer|>Capteur<|>Stockage<|>GPS</);
    expect(html).not.toMatch(/<td[^>]*>\s*<\/td>/);
  });
  it('keeps A510 sensor information consistent with its current night fact', async () => {
    const product = {metafields:{custom:{norticam_specs:{type:'json',value:{version:1,facts:{resolution:'3K',night:'Capteur Sony IMX675 et traitement HDR'},capabilities:{night:true}}}}}};
    const html = await engine.parseAndRender(bindProductFacts('<table><tbody data-product-facts></tbody></table>'), {product});
    expect(html).toMatch(/data-product-fact="sensor"[^>]*>Capteur Sony IMX675/);
    expect(html).not.toMatch(/non précisé/);
    product.metafields.custom.norticam_specs.value.capabilities.night = false;
    const withoutNight = await engine.parseAndRender(bindProductFacts('<table><tbody data-product-facts></tbody></table>'), {product});
    expect(withoutNight).not.toContain('data-product-fact="sensor"');
  });
  it('does not resurrect ambiguous aliases or disabled GPS facts as a sensor', async () => {
    const product = {metafields:{custom:{norticam_specs:{type:'json',value:{version:1,facts:{resolution:'D6WL / D6RL',gps:'Capteur GPS externe',power:'Alimentation à verifier'},capabilities:{gps:false}}}}}};
    const html = await engine.parseAndRender(bindProductFacts('<table><tbody data-product-facts></tbody></table>'), {product});
    expect(html).toContain('Non — Capteur GPS externe');
    expect(html).not.toMatch(/data-product-fact="(?:sensor|resolution|power)"/);
  });
});
