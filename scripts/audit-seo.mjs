import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const dir = path.resolve('dist/public');
const sitemap = await fs.readFile(path.join(dir,'sitemap.xml'),'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
const failures = []; let offers = 0; let links = 0;
const legacy = new Set(['/conseils/meilleure-dashcam-voiture/']);
for (const url of urls) {
  const route = new URL(url).pathname;
  const html = await fs.readFile(path.join(dir,route,'index.html'),'utf8');
  try {
    assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,'H1');
    assert.equal((html.match(/rel="canonical"/g)||[]).length,1,'canonical unique');
    assert.ok(html.includes(`rel="canonical" href="${url}"`),'canonical matches sitemap');
    assert.ok(!html.includes('noindex'),'indexed sitemap entry');
    assert.ok(html.includes('data-prerendered="true"'),'actual React prerender');
    const text=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,' ');
    assert.ok(!/\bShopify\b/i.test(text),'no visible provider branding');
    assert.ok(!html.includes('Achat vérifié'),'no fictional verified buyers');
    const schemas=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1]));
    for(const schema of schemas) {
      assert.ok(!schema.aggregateRating && !schema.review,'no fictional review schema');
      if(schema['@type']==='Product') { offers++; assert.ok(schema.offers); assert.ok(Number.isFinite(Number(schema.offers.price))); assert.ok(schema.offers.priceCurrency); }
    }
    for(const m of html.matchAll(/href="(\/(?!\/)[^"#?]*)(?:[?#][^"]*)?"/g)) {
      const href=m[1]; links++;
      if(legacy.has(href)) continue;
      const target=path.join(dir,href, ...(path.extname(href) ? [] : ['index.html']));
      assert.ok(await fs.stat(target).catch(()=>null), 'broken link '+href);
      if(!path.extname(href)) assert.ok(href.endsWith('/'),'redirecting internal link '+href);
    }
  } catch(e) { failures.push(`${route}: ${e.message}`); }
}
assert.equal(new Set(urls).size,urls.length,'duplicate sitemap routes');
assert.ok(offers>0,'product offers present');
assert.deepEqual(failures,[]);
console.log(JSON.stringify({indexedPages:urls.length,productOffers:offers,internalLinksChecked:links,failures},null,2));
