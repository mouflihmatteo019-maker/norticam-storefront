// Prerender the actual React pages, not a second, divergent SEO-only catalogue.
import fs from 'node:fs/promises';
import path from 'node:path';
import { gzipSync, brotliCompressSync } from 'node:zlib';
import { render, loadCatalog, SITE_URL } from '../dist/ssr/entry-server.js';
const output = path.resolve('dist/public');
const shell = await fs.readFile(path.join(output, 'index.html'), 'utf8');
const origin = SITE_URL;
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const canonical = route => origin + (route === '/' ? '/' : route.replace(/\/+$/, '') + '/');
const catalog = await loadCatalog(); // Fail the build on API errors; never publish invented offers.
if (!catalog.length || catalog.some(p => !p.verified || !p.variants.length)) throw new Error('Catalogue non vérifié : publication interrompue.');
const routes = [
  '/', '/boutique', '/dashcam-voiture', '/dashcam-moto', '/meilleure-dashcam', '/dashcam-vision-nocturne', '/dashcam-gps', '/dashcam-voiture-4k', '/dashcam-voiture-360', '/dashcam-moto-casque', '/ecran-moto-carplay', '/dashcam-avant-arriere', '/mode-parking', '/comparatif', '/quiz', '/conseils', '/suivi-colis',
  ...['contact','mentions-legales','confidentialite','livraison-retours'].map(s => '/informations/' + s),
  ...['quelle-dashcam-voiture-choisir','dashcam-avant-arriere-guide','dashcam-moto-guide','dashcam-2k-vs-4k','70mai-vs-ddpai','dashcam-mode-parking-guide','dashcam-nuit','dashcam-sans-fil','dashcam-voiture-discrete'].map(s => '/conseils/' + s),
  ...['70mai-a510-vs-ddpai-z50-pro','70mai-a510-vs-ddpai-n1-dual','freedconn-r1-plus-vs-fodsports-fx60c'].map(s => '/comparatif/' + s),
  ...catalog.map(p => '/produits/' + p.handle),
];
const indexed = [];
for (const route of [...routes, '/__not-found__']) {
  const { html, head } = await render(route, catalog);
  const is404 = route === '/__not-found__';
  if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) throw new Error('H1 invalide : ' + route);
  if (!is404 && /introuvable/i.test(head.title)) throw new Error('Route cassée : ' + route);
  const schemas = head.noindex ? [] : [
    {'@context':'https://schema.org','@type':'Organization',name:'NORTICAM',url:origin,logo:origin+'/norticam-logo.png'},
    ...(route !== '/' ? [{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Accueil',item:origin+'/'},{'@type':'ListItem',position:2,name:head.title.split('|')[0].trim(),item:canonical(route)}]}] : []),
    ...(head.jsonLd ? Array.isArray(head.jsonLd) ? head.jsonLd : [head.jsonLd] : []),
  ];
  const meta = `<title>${esc(head.title)}</title><meta name="description" content="${esc(head.description)}"><meta name="robots" content="${head.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}">${head.noindex ? '' : `<link rel="canonical" href="${canonical(route)}">`}<meta property="og:title" content="${esc(head.title)}"><meta property="og:description" content="${esc(head.description)}"><meta property="og:url" content="${canonical(route)}"><meta property="og:type" content="${head.type === 'article' ? 'article' : 'website'}"><meta name="twitter:card" content="summary_large_image">${head.image ? `<meta property="og:image" content="${esc(head.image)}">` : ''}<script type="application/ld+json">${JSON.stringify(schemas).replace(/</g,'\\u003c')}</script>`;
  const normalized = html.replace(/href="(\/(?!\/)[^"?#]*)([?#][^"]*)?"/g, (full, pathname, suffix = '') => /\.[a-z0-9]+$/i.test(pathname) ? full : `href="${pathname === '/' ? '/' : pathname.replace(/\/+$/, '') + '/'}${suffix}"`);
  const result = shell.replace(/<title>[\s\S]*?<\/title>|<meta name="(?:description|robots)"[^>]*>/g, '').replace('</head>', meta + '</head>').replace('<div id="root"></div>', `<div id="root" data-prerendered="true">${normalized}</div>`);
  const target = is404 ? path.join(output,'404.html') : path.join(output, route, 'index.html');
  await fs.mkdir(path.dirname(target), {recursive:true}); await fs.writeFile(target, result);
  if (!head.noindex && !is404) indexed.push(route);
}
await fs.writeFile(path.join(output,'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + indexed.map(route => `<url><loc>${canonical(route)}</loc></url>`).join('') + '</urlset>');
await fs.writeFile(path.join(output,'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /cart\nDisallow: /checkout\nSitemap: ${origin}/sitemap.xml\n`);
await fs.writeFile(path.join(output,'build-manifest.json'), JSON.stringify({builtAt:new Date().toISOString(),routes:routes.length,source:'React + verified catalogue'},null,2));
console.log(`${routes.length} pages React générées ; ${indexed.length} URL dans le sitemap.`);
async function compress(dir) {
  for (const entry of await fs.readdir(dir, {withFileTypes:true})) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await compress(file);
    else if (/\.(html|js|css|svg|xml|json|txt)$/.test(file)) {
      const bytes = await fs.readFile(file);
      if (bytes.length > 1024) { await fs.writeFile(file+'.gz', gzipSync(bytes)); await fs.writeFile(file+'.br', brotliCompressSync(bytes)); }
    }
  }
}
await compress(output);
