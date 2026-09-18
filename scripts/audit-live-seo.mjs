import fs from 'node:fs/promises';
const origin = process.env.AUDIT_ORIGIN || 'https://norticam.com';
const sitemap = await (await fetch(origin + '/sitemap.xml')).text();
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
const pages = [];
for (let i = 0; i < urls.length; i += 5) {
  await Promise.all(urls.slice(i, i + 5).map(async url => {
    const response = await fetch(url, {signal: AbortSignal.timeout(25000)});
    const html = await response.text();
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || html;
    const text = main.replace(/<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    const canonicals = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"[^>]*>/g)].map(m=>m[1]);
    const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m=>m[1].replace(/<[^>]+>/g,''));
    const links = [...main.matchAll(/href="(\/[^"?#]*)/g)].map(m=>m[1]);
    pages.push({url,status:response.status,finalUrl:response.url,canonicals,h1,title:html.match(/<title>(.*?)<\/title>/)?.[1],robots:html.match(/<meta name="robots" content="([^"]*)"/)?.[1],words:text.split(/\s+/).length,links,text});
  }));
}
pages.sort((a,b)=>a.url.localeCompare(b.url));
await fs.mkdir('release',{recursive:true});
await fs.writeFile('release/live-seo-audit.json',JSON.stringify(pages,null,2));
console.log(JSON.stringify(pages.map(({text,links,...page})=>({...page,internalLinks:links.length})),null,2));
const failures=pages.filter(p=>p.status!==200 || p.finalUrl!==p.url || p.canonicals.length!==1 || p.canonicals[0]!==p.url || p.h1.length!==1 || /noindex/.test(p.robots));
console.log(JSON.stringify({pages:pages.length,failures},null,2));
if(failures.length) process.exitCode=1;
