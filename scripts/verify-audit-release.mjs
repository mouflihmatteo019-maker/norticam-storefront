import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

// Public HTTP verification only: no browser, login, form, cart, or checkout action.
const argument = name => process.argv.find(value => value.startsWith(`--${name}=`))?.slice(name.length + 3);
const origin = new URL(argument('origin') || 'https://norticam.com');
if (origin.protocol !== 'https:') throw new Error('HTTPS origin required.');
const routes = [
  '/', '/products/dashcam-3k-voiture', '/collections/dashcam-voiture',
  '/collections/dashcam-voiture?page=2', '/collections/dashcam-voiture-360',
  '/collections/ecran-moto-carplay', '/blogs/guides-dashcam/mode-parking-dashcam',
  '/blogs/guides-dashcam?page=2', '/pages/contact', '/pages/suivi-colis',
  '/pages/informations-mentions-legales', '/__norticam_release_missing_20261006__',
];
const decode = value => (value || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(match => [match[1].toLowerCase(), decode(match[2] ?? match[3])]));
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const localAssets = new Map(await Promise.all(['norticam-app.js', 'norticam-style.css'].map(async name => [name, digest(await fs.readFile(path.join('assets', name)))])));
const remoteAssets = new Map();
const pages = [];
for (const route of routes) {
  try {
    const response = await fetch(new URL(route, origin), { redirect: 'follow', signal: AbortSignal.timeout(25000), headers: { Accept: 'text/html' } });
    if (response.status === 429) {
      pages.push({ route, status: response.status, retryAfter: response.headers.get('retry-after'), note: 'Rate limited: stopped the audit without retrying or interpreting this response as site HTML.' });
      await response.arrayBuffer();
      break;
    }
    const html = await response.text();
    const tags = [...html.matchAll(/<(?:meta|link|script)\b[^>]*>/gi)].map(match => attributes(match[0]));
    const canonical = tags.filter(tag => tag.rel === 'canonical').map(tag => tag.href);
    const robots = tags.filter(tag => tag.name === 'robots').map(tag => tag.content);
    const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map(match => { try { return JSON.parse(match[1]); } catch { return { invalidJson: true }; } });
    const themeDataRaw = html.match(/<script\b[^>]*id="norticam-theme-data"[^>]*>([\s\S]*?)<\/script>/i)?.[1];
    let themeData;
    try { themeData = themeDataRaw ? JSON.parse(themeDataRaw) : undefined; } catch { themeData = { invalidJson: true }; }
    for (const tag of tags) {
      const asset = tag.src || tag.href;
      if (!asset || !/norticam-(app\.js|style\.css)(?:\?|$)/.test(asset)) continue;
      const url = new URL(asset, response.url).href;
      if (!remoteAssets.has(url)) {
        const assetResponse = await fetch(url, { signal: AbortSignal.timeout(25000) });
        const bytes = Buffer.from(await assetResponse.arrayBuffer());
        const name = new URL(url).pathname.split('/').pop();
        remoteAssets.set(url, { name, url, status: assetResponse.status, bytes: bytes.length, sha256: digest(bytes), matchesLocal: digest(bytes) === localAssets.get(name) });
      }
    }
    pages.push({ route, status: response.status, finalUrl: response.url, title: decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]), description: tags.find(tag => tag.name === 'description')?.content, canonical, robots, h1Count: [...html.matchAll(/<h1\b/gi)].length, schemas: schemas.map(schema => ({ type: schema['@type'], invalidJson: schema.invalidJson || false })), themeData: themeData ? { invalidJson: themeData.invalidJson || false, products: themeData.products?.length, a510Specs: Boolean(themeData.products?.find(product => product.handle === 'dashcam-3k-voiture')?.norticamSpecs) } : null });
  } catch (error) { pages.push({ route, error: error.message }); }
  await new Promise(resolve => setTimeout(resolve, 1500));
}
const report = { recordedAt: new Date().toISOString(), scope: 'Public HTTP and compiled assets only; no browser UX, PageSpeed or conversion attribution validation.', pages, assets: [...remoteAssets.values()] };
const output = argument('output');
if (output) { await fs.mkdir(path.dirname(path.resolve(output)), { recursive: true }); await fs.writeFile(path.resolve(output), JSON.stringify(report, null, 2) + '\n'); }
console.log(JSON.stringify(report, null, 2));
if (pages.some(page => page.error || page.status !== (page.route.includes('__norticam_release_missing_') ? 404 : 200)) || !remoteAssets.size || [...remoteAssets.values()].some(asset => !asset.matchesLocal)) process.exitCode = 1;
