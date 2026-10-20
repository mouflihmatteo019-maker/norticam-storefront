import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { auditStaticInternalLinks, auditRenderedInternalLinks } from './audit-shopify-theme.mjs';
import { parseHTML } from 'linkedom';

describe('rendered Shopify links, after Liquid and hydration', () => {
  const audit = html => auditRenderedInternalLinks(parseHTML(html).document);
  it('rejects raw and encoded template expressions in real href attributes', () => {
    for (const href of ['/${t}', '/%24%7Bt%7D', '/%2524%257Bt%257D', '{{ product.url }}', '{% bad %}']) {
      assert.throws(() => audit(`<a href="${href}">Lien</a>`), /Unresolved rendered href/);
    }
  });
  it('does not mistake scripts, class names or data attributes for navigable URLs', () => {
    assert.equal(audit('<a href="/products/camera" class="${t}" data-href="${t}">OK</a><script>const s="${t}";</script>'), 1);
  });
  it('checks footer and navigation, but permits native merchant links and actions', () => {
    assert.equal(audit('<nav><a href="/blogs/custom/article">Blog</a></nav><footer><a href="mailto:contact@norticam.com">Contact</a><a href="/policies/refund-policy">Retours</a></footer>'), 2);
    assert.throws(() => audit('<footer><a href="/produits/old">Old</a></footer>'), /Rendered legacy/);
    assert.throws(() => audit('<nav><a href="//checkout.norticam.com/cart">Cart</a></nav>'), /Rendered alias/);
  });
});

// Pixel Office Mia #64: preventive cases, not claims about observed live defects.
describe('Mia #64 rendered-link matrix', () => {
  const base = 'https://norticam.com/collections/dashcam-moto';
  const product = '/products/dashcam-avant-arriere';
  const guide = '/blogs/guides-dashcam/meilleure-dashcam-voiture';
  const run = html => auditRenderedInternalLinks(parseHTML(html).document, base);
  const links = hrefs => hrefs.map(href => `<a href="${href}">Link</a>`).join('');
  it('F01 literal and HTML entity templates', () => {
    for (const href of ['/${t}', '/&#36;&#123;t&#125;']) assert.throws(() => run(links([href])), /Unresolved/);
  });
  it('F02 single, mixed and double URL encoding', () => {
    for (const href of ['/%24%7Bt%7D', '/$%7bt%7d', '/%2524%257Bt%257D']) assert.throws(() => run(links([href])), /Unresolved/);
  });
  it('F03 templates inside query and fragment', () => {
    for (const href of ['?x=%24%7Bt%7D', '#%24%7Bt%7D']) assert.throws(() => run(links([href])), /Unresolved/);
  });
  it('F04 class names are not navigation', () => assert.equal(run(`<a class="\${t}" href="${product}">Link</a>`), 1));
  it('F05 resolved Liquid product URL passes', () => assert.equal(run(links([product])), 1));
  it('F06 unresolved Liquid fails', () => assert.throws(() => run(links(['{{product.url}}'])), /Unresolved/));
  it('F07 catches a DOM href mutation after a clean initial fixture', () => {
    const { document } = parseHTML(links([product]));
    assert.equal(auditRenderedInternalLinks(document, base), 1);
    document.querySelector('a').setAttribute('href', '/${t}');
    assert.throws(() => auditRenderedInternalLinks(document, base), /Unresolved/);
  });
  it('F08 legacy product including query and fragment', () => assert.throws(() => run(links(['/produits/dashcam-avant-arriere/?a=1#d'])), /Rendered legacy/));
  it('F09 legacy guide with or without trailing slash', () => {
    for (const href of ['/conseils/meilleure-dashcam-voiture', '/conseils/meilleure-dashcam-voiture/']) assert.throws(() => run(links([href])), /Rendered legacy/);
  });
  it('F10 native absolute, relative and protocol-relative routes', () => {
    assert.equal(run(links([product, `https://norticam.com${product}`, `..${product}`, `//norticam.com${product}`, guide])), 5);
  });
  it('F11 query, fragment and neighboring prefixes are not legacy routes', () => assert.equal(run(links([`${product}?next=/produits/x#conseils`, '/produits-extra/x'])), 2));
  it('F12 exact hostname boundaries', () => {
    assert.throws(() => run(links(['//www.norticam.com/products/x'])), /Rendered alias/);
    assert.equal(run(links(['https://norticam.com.exemple.invalid/produits/x'])), 0);
  });
  it('F13 contact actions and clean in-page fragment', () => assert.equal(run(links(['mailto:a@exemple.invalid', 'tel:+33123456789', '#details'])), 0));
  it('honors an explicit HTML base and rejects bare legacy roots', () => {
    assert.throws(() => run('<base href="https://www.norticam.com/"><a href="products/x">Link</a>'), /Rendered alias/);
    for (const href of ['/produits', '/conseils']) assert.throws(() => run(links([href])), /Rendered legacy/);
  });
});

const manifest = { routes: [
  { native: '/' },
  { native: '/collections/dashcam-moto' },
  { native: '/collections/dashcam-voiture' },
  { native: '/collections/all' },
] };
function audit(html, index = 0, knownMerchantPaths = []) {
  const views = manifest.routes.map(() => '');
  views[index] = html;
  return auditStaticInternalLinks(manifest, views, knownMerchantPaths);
}

describe('generated Shopify static-link audit', () => {
  it('accepts the exact root and collection expressions generated by the theme', () => {
    assert.equal(audit(`
      <a href="{{ routes.root_url }}">Accueil</a>
      <a href="{{ routes.all_products_collection_url }}">Boutique</a>
      <a href="{{ routes.root_url | append: 'collections/dashcam-voiture' }}">Voiture</a>
      <a href='{{ routes.root_url | append: "collections/dashcam-moto" }}'>Moto</a>
    `), 4);
  });

  it('rejects an unknown route with either HTML attribute quote style', () => {
    for (const html of [
      '<a href="/collections/unknown-link-fixture">Inconnu</a>',
      "<a href='/collections/unknown-link-fixture'>Inconnu</a>",
      '<area href=/collections/unknown-link-fixture>',
    ]) {
      assert.throws(() => audit(html), /Unknown internal destination/);
    }
  });

  it('does not interpret data-href, comments or script strings as live anchors', () => {
    assert.equal(audit(`
      <div data-href="/collections/unknown-link-fixture">Métadonnée</div>
      <a data-href="/collections/unknown-link-fixture">Sans destination</a>
      <!-- <a href="/collections/unknown-link-fixture">Commentaire</a> -->
      <script>const markup = '<a href="/collections/unknown-link-fixture">Texte</a>';</script>
    `), 0);
  });

  it('resolves relative links from the current route rather than always from the domain root', () => {
    assert.equal(audit('<a href="./dashcam-voiture?sort_by=price&amp;filter=x#choix">Voiture</a>', 1), 1);
    assert.throws(() => audit('<a href="./unknown-link-fixture">Inconnu</a>', 1), /Unknown internal destination in \/collections\/dashcam-moto/);
  });

  it('rejects root expressions that accidentally become protocol-relative URLs', () => {
    assert.throws(() => audit('<a href="{{ routes.root_url | append: \'/collections/dashcam-voiture\' }}">Voiture</a>'), /Root route append must not start with/);
    assert.throws(() => audit('<a href="{{ routes.root_url }}/collections/dashcam-voiture">Voiture</a>'), /protocol-relative URL/);
  });

  it('rejects known noncanonical hosts with absolute or protocol-relative links', () => {
    for (const href of ['https://www.norticam.com/collections/all', '//checkout.norticam.com/cart']) {
      assert.throws(() => audit(`<a href="${href}">Alias</a>`), /Alias link/);
    }
  });

  it('keeps unresolved merchant Liquid and external/action links outside the route-existence assertion', () => {
    assert.equal(audit(`
      <a href="{{ product.url }}">Produit dynamique</a>
      <a href="https://example.com/">Externe</a>
      <a href="mailto:contact@norticam.com">Email</a>
      <a href="#main-content">Ancre</a>
      <a href="/cart">Panier</a>
      <a href="/policies/privacy-policy">Politique Shopify</a>
    `), 2);
  });

  it('rejects missing view fixtures instead of silently auditing only a subset', () => {
    assert.throws(() => auditStaticInternalLinks(manifest, ['']), /one view per route/);
  });

  it('allows only exact known merchant resources, not arbitrary articles in the same blog', () => {
    const known = ['/blogs/guides-dashcam/meilleure-dashcam-voiture'];
    const html = '<a href="/blogs/guides-dashcam/meilleure-dashcam-voiture">Guide existant</a>';
    assert.throws(() => audit(html), /Unknown internal destination/);
    assert.equal(audit(html, 0, known), 1);
    assert.throws(() => audit('<a href="/blogs/guides-dashcam/unknown-link-fixture">Inconnu</a>', 0, known), /Unknown internal destination/);
  });
});
