import fs from 'node:fs/promises';
import path from 'node:path';
const origin = 'https://norticam.com';
const out = path.resolve('.tmp', process.argv[2] || 'launch-before');
await fs.mkdir(out, {recursive:true});
const get = async url => {
  const start = performance.now();
  let r = await fetch(url, {signal:AbortSignal.timeout(30000)});
  for(let attempt=0;r.status===429 && attempt<2;attempt++) {
    await r.arrayBuffer();
    await new Promise(resolve=>setTimeout(resolve,5000*(attempt+1)));
    r = await fetch(url, {signal:AbortSignal.timeout(30000)});
  }
  return {url,status:r.status,finalUrl:r.url,ms:Math.round(performance.now()-start),html:await r.text()};
};
const locations = html => [...html.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1].replaceAll('&amp;','&'));
const root = await get(origin+'/sitemap.xml');
const maps = await Promise.all(locations(root.html).filter(u=>u.includes('.xml')).map(get));
const urls = [...new Set([origin+'/',...maps.flatMap(m=>locations(m.html)).filter(u=>new URL(u).origin===origin && !u.endsWith('.md'))])];
const clean = s => s.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const pages=[];
for(let i=0;i<urls.length;i++) {
  await new Promise(resolve=>setTimeout(resolve,650));
  for(const p of await Promise.all(urls.slice(i,i+1).map(async u=>{try{return await get(u)}catch(e){return {url:u,error:e.message,html:''}}}))) {
    const main=p.html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1]||'';
    const tags=[...p.html.matchAll(/<meta\b[^>]+>/g)].map(m=>m[0]);
    const meta=name=>tags.find(t=>new RegExp('(?:name|property)=["\x27]'+name+'["\x27]').test(t))?.match(/content=["\x27]([^"\x27]*)/)?.[1]||'';
    const schemas=[...p.html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g)].map(m=>{try{return JSON.parse(m[1])}catch{return {parseError:true}}});
    const row={url:p.url,status:p.status,finalUrl:p.finalUrl,ms:p.ms,error:p.error,title:clean(p.html.match(/<title>([\s\S]*?)<\/title>/)?.[1]||''),description:meta('description'),canonical:[...p.html.matchAll(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/g)].map(m=>m[1]),robots:meta('robots'),h1:[...main.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m=>clean(m[1])),words:clean(main).split(' ').length,missingAlt:[...main.matchAll(/<img\b[^>]*>/g)].filter(m=>!m[0].includes('alt=')).length,links:[...main.matchAll(/href=["']([^"']+)/g)].map(m=>m[1]),schemas};
    pages.push(row);
    if(p.url===origin+'/') await fs.writeFile(path.join(out,'home.html'),p.html);
  }
}
const diagnostics=await Promise.all([origin+'/robots.txt','https://www.norticam.com/','http://norticam.com/',origin+'/norticam-audit-nonexistent-404'].map(get));
const duplicate=(key)=>Object.entries(Object.groupBy(pages,p=>p[key])).filter(([k,v])=>k&&v.length>1).map(([value,rows])=>({value,urls:rows.map(p=>p.url)}));
const issues=pages.filter(p=>p.status!==200||p.h1.length!==1||!p.title||!p.description||p.canonical.length!==1||p.canonical[0]!==p.url||/noindex/.test(p.robots)||p.schemas.some(s=>s.parseError));
const result={at:new Date().toISOString(),count:pages.length,issues,duplicateTitles:duplicate('title'),duplicateDescriptions:duplicate('description'),diagnostics:diagnostics.map(({html,...p})=>({...p,...(p.url.endsWith('robots.txt')?{text:html}:{})})),pages};
await fs.writeFile(path.join(out,'audit.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify({...result,pages:undefined,issues:issues.map(({schemas,links,...p})=>p)},null,2));
