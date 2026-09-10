import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const base=process.env.TEST_URL || 'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL || 'chrome'});
const context=await browser.newContext({viewport:{width:390,height:844}});
const page=await context.newPage(); const report={routes:[],brokenLinks:[],errors:[],checkout:null,performance:null};
page.on('pageerror',e=>report.errors.push(e.message));
await page.addInitScript(()=>{window.__metrics={lcp:0,cls:0};new PerformanceObserver(list=>{for(const e of list.getEntries())window.__metrics.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__metrics.cls+=e.value;}).observe({type:'layout-shift',buffered:true});});
try {
 const xml=fs.readFileSync('dist/public/sitemap.xml','utf8');const routes=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
 for(const route of routes){
  const file=path.join('dist/public',route,'index.html'); const html=fs.readFileSync(file,'utf8');
  assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,route+' H1');assert.equal((html.match(/rel="canonical"/g)||[]).length,1,route+' canonical');assert.ok(!html.includes('content="noindex'),route+' indexable');
  const scripts=[...html.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)];
  assert.equal(scripts.length,1,route+' structured data'); const schema=JSON.parse(scripts[0][1]);
  if(route.startsWith('/produits/')) assert.ok(schema.some(s=>s['@type']==='Product'&&s.offers?.price),route+' live offer');
  for(const m of html.matchAll(/href="(\/[^"#?]*)/g)){const link=m[1];if(link.startsWith('/assets/')||link==='/favicon.svg')continue;if(!fs.existsSync(path.join('dist/public',link,'index.html')))report.brokenLinks.push({from:route,to:link);}
  report.routes.push(route);
 }
 assert.deepEqual(report.brokenLinks,[]);
 await page.goto(base,{waitUntil:'domcontentloaded'});await page.waitForSelector('[data-catalog-ready="true"]',{timeout:60000});
 await page.evaluate(async()=>{await document.fonts.ready;});
 report.performance=await page.evaluate(()=>({...window.__metrics,transferBytes:performance.getEntriesByType('resource').reduce((n,e)=>n+e.transferSize,0),note:'Local lab observation, not field Core Web Vitals'}));
 await page.screenshot({path:'test-results/home-viewport.png'});
 for(const route of ['/dashcam-gps','/meilleure-dashcam','/dashcam-vision-nocturne','/conseils/dashcam-2k-vs-4k','/conseils/70mai-vs-ddpai']){
  await page.goto(base+route,{waitUntil:'domcontentloaded'});await page.waitForSelector('[data-catalog-ready="true"]',{timeout:60000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' mobile overflow');
 }
 await page.goto(base+'/produits/dashcam-3k-voiture',{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Ajouter au panier',exact:true}).waitFor();await page.getByRole('button',{name:'Ajouter au panier',exact:true}).click();await page.getByRole('button',{name:'Continuer vers le paiement sécurisé'}).waitFor();await page.waitForFunction(()=>!document.querySelector('[role="dialog"]').textContent.includes('Mise à jour'));
 await page.getByRole('button',{name:/Retirer/}).click();await page.getByText('Votre panier est vide',{exact:true}).waitFor();await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Ajouter au panier',exact:true}).click();await page.getByRole('button',{name:'Continuer vers le paiement sécurisé'}).waitFor();await page.waitForFunction(()=>!document.querySelector('[role="dialog"]').textContent.includes('Mise à jour'));
 const checkoutNavigation=page.waitForURL(url=>url.origin!==new URL(base).origin,{timeout:30000,waitUntil:'domcontentloaded'});
 await page.getByRole('button',{name:'Continuer vers le paiement sécurisé'}).click();await checkoutNavigation;
 report.checkout={host:new URL(page.url()).hostname,title:await page.title(),reached:true};
 const offline=await context.newPage();await offline.route('**/api/*/graphql.json',r=>r.abort());await offline.goto(base+'/produits/dashcam-3k-voiture',{waitUntil:'domcontentloaded'});await offline.getByRole('alert').first().waitFor();assert.equal(await offline.getByRole('button',{name:'Ajouter au panier',exact:true}).count(),0);
 await offline.close();assert.deepEqual(report.errors,[]);
 fs.writeFileSync('test-results/launch-audit.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
} finally {await browser.close();}
