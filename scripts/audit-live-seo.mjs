// Read-only HTTP audit. Indexability signals are not proof of Google indexation.
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { DOMParser, parseHTML } from 'linkedom';

export function sitemapLocations(xml) {
  const document = new DOMParser().parseFromString(xml, 'text/xml');
  const root = document.documentElement;
  if (!['sitemapindex', 'urlset'].includes(root?.localName)) throw new Error('Not a sitemap XML document');
  const entry = root.localName === 'sitemapindex' ? 'sitemap' : 'url';
  return {
    type: root.localName,
    // Only direct URL entries, never image:loc, video or alternate-language URLs.
    locations: [...root.children].filter(n => n.localName === entry)
      .flatMap(n => [...n.children].filter(c => c.nodeName === 'loc').map(c => c.textContent.trim())),
  };
}

export function inspectPage({ url, finalUrl = url, status, html, xRobots = '', contentType = 'text/html' }) {
  // Preserve HTTP evidence even when the body is a plain-text rate limit/error.
  if (status !== 200) return { url, finalUrl, status, contentType, issues: [`HTTP ${status}`] };
  // Shopify also publishes agentic Markdown resources; those are not HTML pages.
  if (!/text\/html|application\/xhtml\+xml/i.test(contentType)) {
    return { url, finalUrl, status, contentType, kind: 'non-html-resource', issues: [] };
  }
  if (!html.trim()) return { url, finalUrl, status, issues: ['Empty HTML response'] };
  const { document } = parseHTML(html);
  const text = node => node?.textContent.replace(/\s+/g, ' ').trim() || '';
  const meta = name => [...document.querySelectorAll('meta[name]')]
    .filter(n => n.getAttribute('name').toLowerCase() === name)
    .map(n => n.getAttribute('content') || '').join(', ');
  const canonicals = [...document.querySelectorAll('link[rel]')]
    .filter(n => n.getAttribute('rel').toLowerCase().split(/\s+/).includes('canonical'))
    .map(n => n.getAttribute('href'));
  const robots = [meta('robots'), meta('googlebot'), xRobots].filter(Boolean).join(', ');
  const h1 = [...document.querySelectorAll('h1')].map(text);
  const title = text(document.querySelector('title'));
  const description = meta('description');
  const links = [...document.querySelectorAll('a[href],area[href]')].map(n => n.getAttribute('href'));
  const baseHref = document.querySelector('base[href]')?.getAttribute('href');
  let baseUrl = finalUrl;
  try { if (baseHref) baseUrl = new URL(baseHref, finalUrl).href; } catch { /* Report below. */ }
  const malformedLinks = links.filter(href => {
    let decoded = href;
    for (let i = 0; i < 4; i++) { try { decoded = decodeURIComponent(decoded); } catch { break; } }
    return /\$\{[^}]*\}|\{\{|\{%/.test(decoded) || /%(?:24|25|7b|7d)/i.test(decoded);
  });
  const legacyLinks = links.filter(href => {
    try {
      const target = new URL(href, baseUrl);
      return ['norticam.com', 'www.norticam.com', 'checkout.norticam.com'].includes(target.hostname) &&
        (target.hostname !== 'norticam.com' || /^\/(?:produits|conseils)(?:\/|$)/.test(target.pathname));
    } catch { return true; }
  });
  const schemaErrors = [...document.querySelectorAll('script[type="application/ld+json"]')]
    .flatMap((n, i) => { try { JSON.parse(n.textContent); return []; } catch { return [i]; } });
  const issues = [];
  try { if (baseHref) new URL(baseHref, finalUrl); } catch { issues.push('Invalid HTML base URL'); }
  if (url !== finalUrl) issues.push('Sitemap URL redirects');
  if (canonicals.length !== 1 || canonicals[0] !== url) issues.push('Canonical differs or is not unique');
  if (/\b(?:noindex|none)\b/i.test(robots)) issues.push('Noindex URL in sitemap');
  if (!title) issues.push('Missing title');
  if (!description) issues.push('Missing description');
  if (h1.length !== 1) issues.push(`H1 count ${h1.length}`);
  if (malformedLinks.length) issues.push('Unresolved template in rendered link');
  if (legacyLinks.length) issues.push('Legacy internal link');
  if (schemaErrors.length) issues.push('Invalid JSON-LD');
  return { url, status, finalUrl, title, description, canonicals, robots, h1, links,
    malformedLinks, legacyLinks, schemaErrors, issues };
}

export async function auditSite({ origin, get, maxMaps = 30, maxPages = 250, pauseMs = 0 }) {
  const queue = [`${origin}/sitemap.xml`], seen = new Set(), urls = new Set(), maps = [];
  while (queue.length) {
    const url = queue.shift();
    if (seen.has(url)) continue;
    if (new URL(url).origin !== origin) throw new Error(`External sitemap rejected: ${url}`);
    if (seen.size >= maxMaps) throw new Error('Sitemap limit exceeded; audit incomplete');
    seen.add(url);
    const response = await get(url);
    if (response.status !== 200) throw new Error(`Sitemap HTTP ${response.status}: ${url}`);
    const parsed = sitemapLocations(response.html);
    maps.push({ url, finalUrl: response.finalUrl, type: parsed.type, entries: parsed.locations.length });
    for (const loc of parsed.locations) {
      if (new URL(loc).origin !== origin) throw new Error(`External sitemap entry rejected: ${loc}`);
      if (parsed.type === 'sitemapindex') queue.push(loc);
      else urls.add(loc);
    }
  }
  if (urls.size > maxPages) throw new Error('Page limit exceeded; audit incomplete');
  const pages = [];
  const list = [...urls].sort();
  for (const url of list) {
    if (pauseMs) await new Promise(resolve => setTimeout(resolve, pauseMs));
    try { pages.push(inspectPage({ url, ...await get(url) })); }
    catch (error) { pages.push({ url, issues: ['Request failed'], error: error.message }); }
  }
  pages.sort((a, b) => a.url.localeCompare(b.url));
  return { at: new Date().toISOString(), origin, maps, pages, issues: pages.filter(p => p.issues.length) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const origin = new URL(process.env.AUDIT_ORIGIN || 'https://norticam.com').origin;
  const get = async url => {
    const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
    return { status: response.status, finalUrl: response.url, html: await response.text(),
      xRobots: response.headers.get('x-robots-tag') || '', contentType: response.headers.get('content-type') || '' };
  };
  const result = await auditSite({ origin, get, pauseMs: 1000 });
  const output = process.argv[2] || 'release/live-seo-audit.json';
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ output, maps: result.maps, pages: result.pages.length,
    issues: result.issues.map(({ links, ...p }) => p) }, null, 2));
  if (result.issues.length) process.exitCode = 1;
}
