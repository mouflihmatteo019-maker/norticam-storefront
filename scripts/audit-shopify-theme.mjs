import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { parseHTML } from 'linkedom';
// Run after Liquid rendering or DOM hydration: templates are no longer valid here.
// Unlike the static audit, this accepts merchant-managed native destinations.
export function auditRenderedInternalLinks(document, pageUrl = 'https://norticam.com/') {
  let checked = 0;
  const baseHref = document.querySelector('base[href]')?.getAttribute('href');
  const baseUrl = baseHref ? new URL(baseHref, pageUrl).href : pageUrl;
  for (const anchor of document.querySelectorAll('a[href],area[href]')) {
    const href = (anchor.getAttribute('href') || '').trim();
    if (!href) continue;
    let decoded = href;
    for (let i = 0; i < 4; i++) {
      try {
        const next = decodeURIComponent(decoded);
        if (next === decoded) break;
        decoded = next;
      } catch { break; }
    }
    assert(!/\$\{[^}]*\}|\{\{|\{%/.test(decoded), `Unresolved rendered href in ${pageUrl}: ${href}`);
    assert(!/%(?:24|25|7b|7d)/i.test(decoded), `Overencoded rendered href needs review: ${href}`);
    const url = new URL(href, baseUrl);
    if (!['http:', 'https:'].includes(url.protocol)) continue;
    assert(!['www.norticam.com', 'checkout.norticam.com'].includes(url.hostname), `Rendered alias link: ${href}`);
    if (url.hostname !== 'norticam.com') continue;
    assert(!/^\/(?:produits|conseils)(?:\/|$)/.test(url.pathname), `Rendered legacy link: ${href}`);
    if (href.startsWith('#')) continue;
    checked++;
  }
  return checked;
}
// Pure so deterministic regression fixtures can exercise the exact CLI checks.
export function auditStaticInternalLinks(manifest, views, knownMerchantPaths = []) {
  assert.equal(views.length, manifest.routes.length, 'Static-link audit needs one view per route');
  const normalize = path => path.replace(/\/+$/, '') || '/';
  const nativePaths = new Set([...manifest.routes.map(({ native }) => normalize(native)), ...knownMerchantPaths.map(normalize)]);
  const commerceEndpoint = /^\/(?:cart|checkout|account|search|policies|apps)(?:\/|$)/;
  let checkedLinks = 0;
  for (let index = 0; index < manifest.routes.length; index++) {
    const native = manifest.routes[index].native;
    const { document } = parseHTML(views[index]);
    // Attribute parsing supports either quote style and excludes data-href, comments and script text.
    for (const anchor of document.querySelectorAll('a[href], area[href]')) {
      const rawHref = (anchor.getAttribute('href') || '').trim();
      const usesRoot = /{{\s*routes\.root_url\b/.test(rawHref);
      const href = rawHref
        .replace(/{{\s*routes\.root_url\s*\|\s*append:\s*(['"])(.*?)\1\s*}}/g, (_match, _quote, suffix) => {
          assert(!suffix.startsWith('/'), `Root route append must not start with / in ${native}: ${rawHref}`);
          return `/${suffix}`;
        })
        .replace(/{{\s*routes\.root_url\s*}}/g, '/')
        .replace(/{{\s*routes\.all_products_collection_url\s*}}/g, '/collections/all');
      if (!href || href.startsWith('#') || /\{[{%]/.test(href)) continue;
      assert(!(usesRoot && href.startsWith('//')), `Root route expression produced a protocol-relative URL in ${native}: ${rawHref}`);
      const url = new URL(href, new URL(native, 'https://norticam.com'));
      if (!['http:', 'https:'].includes(url.protocol)) continue;
      assert(!['checkout.norticam.com', 'www.norticam.com'].includes(url.hostname), `Alias link in ${native}: ${href}`);
      if (url.hostname !== 'norticam.com') continue;
      const path = url.pathname.replace(/\/+$/, '') || '/';
      assert(nativePaths.has(path) || commerceEndpoint.test(path), `Unknown internal destination in ${native}: ${href}`);
      checkedLinks++;
    }
  }
  return checkedLinks;
}

// Importing the pure link audit in tests must not inspect or mutate a theme build.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
const read=file=>fs.readFile(file,'utf8');
for(const file of ['layout/theme.liquid','templates/index.json','templates/product.json','templates/collection.json','templates/page.json','templates/cart.json','templates/404.json','config/settings_schema.json','config/settings_data.json','locales/fr.default.json','assets/norticam-app.js','assets/norticam-style.css']) assert((await fs.stat(file)).size>0,`${file} missing`);
const layout=await read('layout/theme.liquid');
assert(layout.includes('{{ content_for_header }}'));
assert(layout.includes('{{ content_for_layout }}'));
assert(layout.includes('canonical_url'));
assert(layout.includes('<script type="module" src="'), 'Theme entry must load as an ES module');
const runtimeFiles = (await fs.readdir('dist/theme-runtime')).filter(name => name.endsWith('.js'));
for (const name of runtimeFiles) {
  const script = await read(`assets/${name}`);
  for (const match of script.matchAll(/(?:from\s*|import\s*\()?["'](\.\/norticam-[^"']+\.js)["']/g)) {
    assert(runtimeFiles.includes(match[1].slice(2)), `Missing module dependency in ${name}: ${match[1]}`);
  }
  assert(!/["']\/norticam-chunk-/.test(script), `Wrong CDN root for modules: ${name}`);
}
for(const folder of ['config','locales','templates']) for(const file of await fs.readdir(folder)) if(file.endsWith('.json')) JSON.parse(await read(`${folder}/${file}`));
for(const file of await fs.readdir('snippets')) {
  const source=await read(`snippets/${file}`);
  assert(!/700\d{3}[,.]97/.test(source),`Unconverted price token: ${file}`);
  assert(!source.includes('AggregateRating'),`Review schema: ${file}`);
  assert(!/href="\/produits\//.test(source),`Legacy link: ${file}`);
  assert(!/n_product_\d+\.variants\[\d+\]/.test(source),`Variant price must use stable IDs, not positions: ${file}`);
}
const manifest=JSON.parse(await read('release/shopify-theme-manifest.json'));
// Check the links actually shipped in each prerendered view, not only the route list.
// Shopify-managed policy/app/action endpoints and dynamic Liquid links are separate.
const views = await Promise.all(manifest.routes.map((_, index) => read(`snippets/norticam-view-${index}.liquid`)));
// Existing merchant-managed article, outside the generated React route manifest.
// Exact public destination checked HTTP 200 in the NORTICAM owner audit, 2026-10-19.
// Do not replace this evidence-based list with a wildcard accepting any blog URL.
const knownMerchantPaths = ['/blogs/guides-dashcam/meilleure-dashcam-voiture'];
const checkedLinks = auditStaticInternalLinks(manifest, views, knownMerchantPaths);
assert(checkedLinks > 100, 'Internal-link audit did not resolve the generated Shopify route expressions');
console.log(`PASS: ${checkedLinks} static internal links in ${manifest.routes.length} native views resolve to declared routes or Shopify endpoints; merchant-managed dynamic links remain separate.`);
for(const file of ['blog.json','blog.dashcam.json','article.json','page.contact.json']) assert(JSON.parse(await read(`templates/${file}`)).sections.main.type==='norticam-storefront',`${file} must use the shared storefront`);
const editorial=await read('snippets/norticam-editorial.liquid');
assert(editorial.includes('{{ article.content }}') && editorial.includes('paginate blog.articles by 12'),'Blog must read live Shopify articles');
assert((await read('snippets/norticam-editorial-shell.liquid')).includes('data-native-content'),'Editorial shell missing');
assert((await read('snippets/norticam-bootstrap.liquid')).includes('nativeContent=nEditorial.innerHTML'),'Editorial hydration missing');
const bootstrap=await read('snippets/norticam-bootstrap.liquid');
assert((await read('snippets/norticam-product-json.liquid')).includes('"descriptionHtml":{{ p.description | json }}'),'Formatted product description must be live');
assert((await read('snippets/norticam-policy-content.liquid')).includes('page.content'),'Legal content must be merchant-managed');
for(const route of ['mentions-legales','confidentialite','livraison-retours']) {
  const view=manifest.routes.findIndex(r=>r.route===`/informations/${route}`);
  assert((await read(`snippets/norticam-view-${view}.liquid`)).includes("render 'norticam-policy-content'"),'Policy must render current Shopify content');
}
for(const policy of ['privacy_policy','refund_policy','shipping_policy','terms_of_service']) {
  assert(bootstrap.includes(`shop.${policy}.url | json`),`Missing policy URL: ${policy}`);
  assert(!bootstrap.includes(`shop.${policy} | json`),`Policy object serializes to a string, not a URL object: ${policy}`);
}
assert(!(await read('snippets/norticam-order-help.liquid')).includes('routes.account_url'),'Guest tracking must not redirect to customer accounts');
assert((await read('snippets/norticam-view-16.liquid')).includes("render 'norticam-order-help'"),'Tracking page must render the native order help');
assert(!JSON.parse(await read('release/shopify-resources.json')).some(r=>r.handle==='__not-found__'),'404 must never be created as a published page');
assert.equal(new Set(manifest.routes.map(r=>r.native)).size,manifest.routes.length,'Native URL collision');
assert(!/localhost|127\.0\.0\.1/.test(await read('assets/norticam-app.js')),'Preview URL in production bundle');
console.log(`PASS: root Shopify structure, JSON, canonical, assets, ${manifest.routes.length} unique routes, no preview URL or mock review schema.`);
}
