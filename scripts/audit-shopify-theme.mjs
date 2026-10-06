import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
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
