import assert from 'node:assert/strict';
import { test } from 'node:test';
import { auditSite, inspectPage, sitemapLocations } from './audit-live-seo.mjs';
const origin = 'https://norticam.com';
const html = (extra = '') => `<html><head><title>Dashcam</title>
<link href="${origin}/" rel='canonical'><meta content="Choisir une caméra" name='description'>
</head><body><main><h1>Dashcam</h1>${extra}</main></body></html>`;
test('sitemap extracts only direct loc entries and decodes XML ampersands', () => {
  assert.deepEqual(sitemapLocations('<sitemapindex><sitemap><loc>https://norticam.com/p.xml?a=1&amp;b=2</loc></sitemap></sitemapindex>').locations, [`${origin}/p.xml?a=1&b=2`]);
  assert.deepEqual(sitemapLocations('<urlset xmlns:image="http://example.com"><url><loc>https://norticam.com/</loc><image:image><image:loc>https://cdn.example.com/p.jpg</image:loc></image:image></url></urlset>').locations, [`${origin}/`]);
  assert.throws(() => sitemapLocations('<html>Error</html>'), /Not a sitemap/);
});
test('HTML attributes are order independent; clean page passes', () => {
  assert.deepEqual(inspectPage({ url: `${origin}/`, status: 200, html: html() }).issues, []);
});
test('preserves non-HTML HTTP errors and separates agentic Markdown from pages', () => {
  const failed = inspectPage({url: origin, status: 429, html: 'local_rate_limited', contentType: 'text/plain'});
  assert.equal(failed.status, 429);
  assert.deepEqual(failed.issues, ['HTTP 429']);
  const markdown = inspectPage({url: `${origin}/agents.md`, status: 200, html: '# Shop', contentType:'text/markdown'});
  assert.equal(markdown.kind, 'non-html-resource');
  assert.deepEqual(markdown.issues, []);
  assert.deepEqual(inspectPage({url:origin,status:200,html:''}).issues,['Empty HTML response']);
});
test('includes navigation and footer links outside main', () => {
  const page = inspectPage({url:`${origin}/`,status:200,html:html().replace('</body>','<footer><a href="/produits/old">Old</a></footer></body>')});
  assert.equal(page.legacyLinks.length, 1);
});
test('robots headers and googlebot restrictions are not ignored', () => {
  assert(inspectPage({ url: `${origin}/`, status: 200, html: html(), xRobots: 'noindex' }).issues.includes('Noindex URL in sitemap'));
  assert(inspectPage({ url: `${origin}/`, status: 200, html: html().replace('</head>', '<meta name="googlebot" content="none"></head>') }).issues.includes('Noindex URL in sitemap'));
});
test('detects rendered link templates without matching script strings', () => {
  const page = inspectPage({ url: `${origin}/`, status: 200, html: html('<a href="/%24%257Bt%257D">Bad</a><script>const s="${t}";</script>') });
  assert.equal(page.malformedLinks.length, 1);
  assert.equal(inspectPage({ url: `${origin}/`, status: 200, html: html('<script>const s="${t}";</script>') }).malformedLinks.length, 0);
});
test('detects old internal aliases, ignores third party paths', () => {
  const page = inspectPage({ url: `${origin}/`, status: 200, html: html('<a href="/produits/camera">Old</a><a href="//checkout.norticam.com/">Alias</a><a href="https://example.com/conseils/a">Other</a>') });
  assert.equal(page.legacyLinks.length, 2);
});
test('follows nested sitemap indexes once, deduplicates pages', async () => {
  const calls = [];
  const fixtures = {
    '/sitemap.xml': `<sitemapindex><sitemap><loc>${origin}/child.xml</loc></sitemap></sitemapindex>`,
    '/child.xml': `<sitemapindex><sitemap><loc>${origin}/urls.xml</loc></sitemap><sitemap><loc>${origin}/sitemap.xml</loc></sitemap></sitemapindex>`,
    '/urls.xml': `<urlset><url><loc>${origin}/</loc></url><url><loc>${origin}/</loc></url></urlset>`,
    '/': html(),
  };
  const result = await auditSite({ origin, get: async url => {
    calls.push(url); assert(fixtures[new URL(url).pathname]);
    return { status: 200, finalUrl: url, html: fixtures[new URL(url).pathname] };
  } });
  assert.equal(result.pages.length, 1); assert.equal(calls.length, 4);
  assert.equal(result.issues.length, 0);
});
test('rejects external entries and explicit limits rather than claiming complete audit', async () => {
  await assert.rejects(auditSite({ origin, get: async () => ({status:200, html:'<urlset><url><loc>https://example.com/</loc></url></urlset>'}) }), /External/);
  await assert.rejects(auditSite({ origin, maxMaps: 0, get: async () => { throw new Error('not called'); } }), /limit exceeded/);
});
test('reports request failures instead of silently dropping pages', async () => {
  const result = await auditSite({ origin, get: async url => {
    if (url.endsWith('.xml')) return {status:200, html:`<urlset><url><loc>${origin}/</loc></url></urlset>`};
    throw new Error('timeout');
  } });
  assert.equal(result.pages.length, 1); assert.equal(result.issues[0].error, 'timeout');
});
