import fs from 'node:fs/promises';
import { render } from '../dist/ssr/entry-server.js';
const resources=JSON.parse(await fs.readFile('release/shopify-resources.json','utf8'));
const catalog=JSON.parse(await fs.readFile('release/theme-catalog-reference.json','utf8'));
const pages=[];
for(const item of resources.filter(r=>r.type==='page')) {
  const result=await render(item.original,catalog);
  const main=result.html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  if(!main) throw new Error('Missing original page content: '+item.original);
  const seen=new Set();
  const fragments=[...main.matchAll(/<(p|h2|h3)\b[^>]*>([\s\S]*?)<\/\1>/g)].flatMap(([,tag,html])=>{
    const text=html.replace(/<svg\b[\s\S]*?<\/svg>/g,'').replace(/<[^>]+>/g,'').trim();
    if(!text || /€|\bEUR\b/.test(text) || seen.has(text)) return [];
    seen.add(text); return [`<${tag}>${text}</${tag}>`];
  });
  pages.push({...item,body:fragments.join('\n')});
}
await fs.writeFile('release/shopify-page-content.json',JSON.stringify(pages,null,2)+'\n');
console.log(JSON.stringify(pages.map(p=>({handle:p.handle,characters:p.body.length}))));
