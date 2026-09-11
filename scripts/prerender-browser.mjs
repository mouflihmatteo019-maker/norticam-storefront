// Generate SEO from the real React UI and verified public Shopify reads.
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const output = path.resolve('dist/public');
const origin = (process.env.VITE_SITE_URL || 'https://norticam.com').replace(/\/$/, '');
const shell = fs.readFileSync(path.join(output,'index.html'),'utf8');
const app = express(); app.use(express.static(output)); app.get('*', (_req,res) => res.send(shell));
const server = app.listen(0,'127.0.0.1'); await new Promise(resolve=>server.on('listening',resolve));
const base = 'http://127.0.0.1:' + server.address().port;
const browser = await chromium.launch({ headless:true, ...(process.env.BROWSER_CHANNEL ? {channel:process.env.BROWSER_CHANNEL} : {}) });
const context = await browser.newContext({ viewport:{width:1440,height:1000} });
const responses = new Map();
await context.route('**/api/*/graphql.json', async route=>{
  const request=route.request(), body=request.postData(), query=JSON.parse(body).query;
  if (/mutation|query Cart/.test(query)) throw new Error('Unexpected cart action during build');
  if (!responses.has(body)) responses.set(body,fetch(request.url(),{method:'POST',headers:{'Content-Type':'application/json',...(process.env.VITE_SHOPIFY_PUBLIC_TOKEN ? {'X-Shopify-Storefront-Access-Token':process.env.VITE_SHOPIFY_PUBLIC_TOKEN} : {})},body}).then(async r=>({status:r.status,body:await r.text()})));
  await route.fulfill({...await responses.get(body),contentType:'application/json',headers:{'access-control-allow-origin':'*'}});
});
const routes=['/suivi-colis','/conseils/dashcam-2k-vs-4k','/conseils/70mai-vs-ddpai','/conseils/dashcam-mode-parking-guide','/conseils/dashcam-nuit','/meilleure-dashcam','/dashcam-gps','/dashcam-vision-nocturne','/','/boutique','/dashcam-voiture','/dashcam-moto','/mode-parking','/dashcam-avant-arriere','/dashcam-voiture-4k','/dashcam-voiture-360','/dashcam-moto-casque','/ecran-moto-carplay','/comparatif','/quiz','/conseils','/conseils/quelle-dashcam-voiture-choisir','/conseils/dashcam-avant-arriere-guide','/conseils/dashcam-moto-guide','/informations/contact','/informations/mentions-legales','/informations/confidentialite','/informations/livraison-retours'];
const completed=[];
try {
  const discovery=await context.newPage(); await discovery.goto(base+'/boutique',{waitUntil:'domcontentloaded'});
  await discovery.waitForSelector('[data-catalog-ready="true"]',{timeout:60000});
  routes.push(...await discovery.locator('a[href^="/produits/"]').evaluateAll(links=>[...new Set(links.map(a=>a.getAttribute('href')))])); await discovery.close();
  let cursor=0;
  await Promise.all(Array.from({length:3},async ()=>{
    const page=await context.newPage();
    while(cursor<routes.length) {
      const route=routes[cursor++]; await page.goto(base+route,{waitUntil:'domcontentloaded'});
      await page.waitForSelector('[data-catalog-ready="true"]',{timeout:60000});
      if(await page.locator('h1').count()!==1) throw new Error('Invalid H1: '+route);
      await page.evaluate(()=>{document.querySelectorAll('link[rel="modulepreload"]').forEach(n=>n.remove());document.getElementById('root').setAttribute('data-prerendered','true');});
      const html=await page.content(); const target=route==='/'?path.join(output,'index.html'):path.join(output,route,'index.html');fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,html);completed.push({route,noindex:html.includes('content="noindex,follow"')});
    }
    await page.close();
  }));
  const page=await context.newPage(); await page.goto(base+'/__not-found__',{waitUntil:'domcontentloaded'});await page.getByText('Cette page est introuvable.').waitFor();fs.writeFileSync(path.join(output,'404.html'),await page.content());
  fs.writeFileSync(path.join(output,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+completed.filter(p=>!p.noindex).sort((a,b)=>a.route.localeCompare(b.route)).map(p=>'<url><loc>'+origin+(p.route==='/'?'/':p.route+'/')+'</loc></url>').join('')+'</urlset>');
  fs.writeFileSync(path.join(output,'robots.txt'),'User-agent: *\nAllow: /\nDisallow: /cart\nDisallow: /checkout\nSitemap: '+origin+'/sitemap.xml\n');
  fs.writeFileSync(path.join(output,'.htaccess'),'Options -MultiViews\nDirectoryIndex index.html\nErrorDocument 404 /404.html\nRewriteEngine On\nRewriteCond %{HTTP_HOST} ^www\\.norticam\\.com$ [NC]\nRewriteRule ^ https://norticam.com%{REQUEST_URI} [R=301,L]\n<IfModule mod_headers.c>\nHeader always set X-Content-Type-Options "nosniff"\nHeader always set Referrer-Policy "strict-origin-when-cross-origin"\nHeader always set X-Frame-Options "SAMEORIGIN"\n<FilesMatch "\\.(js|css|woff2)$">\nHeader set Cache-Control "public, max-age=31536000, immutable"\n</FilesMatch>\n</IfModule>\n');
  fs.writeFileSync(path.join(output,'build-manifest.json'),JSON.stringify({builtAt:new Date().toISOString(),routes:completed.length,source:'Live Shopify Storefront API'},null,2));
  console.log('Rendered '+completed.length+' real pages; sitemap and 404 generated.');
} finally {await browser.close();server.close();}
