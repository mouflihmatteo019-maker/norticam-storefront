import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const manifest=JSON.parse(await fs.readFile('release/shopify-theme-manifest.json','utf8'));
const csv=await fs.readFile('release/shopify-redirects.csv','utf8');
const [header,...rows]=csv.trim().split(/\r?\n/);
assert.equal(header,'Redirect from,Redirect to');
const redirects=new Map();
for(const row of rows) {
  const columns=row.split(',');assert.equal(columns.length,2,`Malformed row: ${row}`);
  const [from,to]=columns;
  assert(from.startsWith('/')&&!from.startsWith('//')&&to.startsWith('/')&&!to.startsWith('//'),`Relative local paths required: ${row}`);
  assert(!redirects.has(from),`Duplicate source: ${from}`);
  assert.notEqual(from.replace(/\/$/,''),to.replace(/\/$/,''),`Self redirect: ${row}`);
  assert(!/[?#]/.test(from+to),`Unexpected query or fragment: ${row}`);
  assert(!['/','/__not-found__','/404'].includes(from),`Invalid source: ${from}`);
  redirects.set(from,to);
}
const targets=new Set(manifest.routes.map(r=>r.native));
for(const [from,to] of redirects) {
  assert(targets.has(to),`Unknown native target: ${from} -> ${to}`);
  assert(!redirects.has(to),`Redirect chain or loop: ${from} -> ${to}`);
}
for(const route of manifest.routes.filter(r=>r.route!=='/'&&r.route!=='/__not-found__')) {
  assert.equal(redirects.get(route.route),route.native,`Missing source: ${route.route}`);
  assert.equal(redirects.get(route.route+'/'),route.native,`Missing trailing-slash source: ${route.route}`);
}
console.log(`PASS: ${redirects.size} redirect entries; ${new Set(redirects.values()).size} native destinations; no collisions, chains, external targets or loops. NOT imported into Shopify.`);
