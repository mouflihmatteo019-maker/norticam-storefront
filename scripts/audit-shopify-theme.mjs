import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const read=file=>fs.readFile(file,'utf8');
for(const file of ['layout/theme.liquid','templates/index.json','templates/product.json','templates/collection.json','templates/page.json','templates/cart.json','templates/404.json','config/settings_schema.json','config/settings_data.json','locales/fr.default.json','assets/norticam-app.js','assets/norticam-style.css']) assert((await fs.stat(file)).size>0,`${file} missing`);
const layout=await read('layout/theme.liquid');
assert(layout.includes('{{ content_for_header }}'));
assert(layout.includes('{{ content_for_layout }}'));
assert(layout.includes('canonical_url'));
for(const folder of ['config','locales','templates']) for(const file of await fs.readdir(folder)) if(file.endsWith('.json')) JSON.parse(await read(`${folder}/${file}`));
for(const file of await fs.readdir('snippets')) {
  const source=await read(`snippets/${file}`);
  assert(!/700\d{3}[,.]97/.test(source),`Unconverted price token: ${file}`);
  assert(!source.includes('AggregateRating'),`Review schema: ${file}`);
  assert(!/href="\/produits\//.test(source),`Legacy link: ${file}`);
}
const manifest=JSON.parse(await read('release/shopify-theme-manifest.json'));
assert.equal(new Set(manifest.routes.map(r=>r.native)).size,manifest.routes.length,'Native URL collision');
assert(!/localhost|127\.0\.0\.1/.test(await read('assets/norticam-app.js')),'Preview URL in production bundle');
console.log(`PASS: root Shopify structure, JSON, canonical, assets, ${manifest.routes.length} unique routes, no preview URL or mock review schema.`);
