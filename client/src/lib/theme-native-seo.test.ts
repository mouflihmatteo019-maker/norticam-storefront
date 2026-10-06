import { describe, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import { Liquid } from 'liquidjs';

const stripDoc = (value: string) => value.replace(/{% doc %}[\s\S]*?{% enddoc %}/g,'');
const translations = {
  'general.home':'Accueil', 'breadcrumbs.catalog':'Boutique',
  'tracking.seo_title':'Suivre ma commande | NORTICAM',
  'tracking.seo_description':'Retrouvez le suivi de votre commande NORTICAM.',
};
const engine = new Liquid();
engine.registerFilter('json', value=>JSON.stringify(value ?? null));
engine.registerFilter('t', value=>translations[value as keyof typeof translations] ?? value);
engine.registerFilter('asset_url', value=>`//norticam.com/cdn/assets/${value}`);
engine.registerFilter('image_url', value=>value.url);
engine.registerFilter('stylesheet_tag', value=>`<link rel="stylesheet" href="${value}">`);
engine.registerFilter('structured_data', value=>JSON.stringify(value.schema));

async function head(type: string, path: string, values: Record<string,unknown> = {}) {
  let raw = (await fs.readFile('layout/theme.liquid','utf8')).split('</head>')[0];
  for (const [name,parameters] of [
    ['norticam-social-meta','{% assign title = n_title %}{% assign description = n_description %}{% assign url = n_canonical %}'],
    ['norticam-organization-schema',''],
    ['norticam-breadcrumb-schema','{% assign url = n_canonical %}'],
  ]) {
    const snippet=stripDoc(await fs.readFile(`snippets/${name}.liquid`,'utf8'));
    raw=raw.replace(new RegExp(`{% render '${name}'[^%]*%}`,'g'),parameters+snippet);
  }
  raw=raw.replace("{% render 'norticam-fonts' %}",'');
  const seoField=stripDoc(await fs.readFile('snippets/norticam-seo-field.liquid','utf8'));
  raw=raw.replace("{% render 'norticam-seo-field', field: n_seo_resource.metafields.global.title_tag, value: page_title, fallback: n_title %}","{% assign field = n_seo_resource.metafields.global.title_tag %}{% assign value = page_title %}{% assign fallback = n_title %}"+seoField)
    .replace("{% render 'norticam-seo-field', field: n_seo_resource.metafields.global.description_tag, value: page_description, fallback: n_description %}","{% assign field = n_seo_resource.metafields.global.description_tag %}{% assign value = page_description %}{% assign fallback = n_description %}"+seoField);
  return engine.parseAndRender(raw,{
    request:{page_type:type,path,locale:{iso_code:'fr'},design_mode:false},
    shop:{url:'https://norticam.com',name:'NORTICAM'},
    routes:{root_url:'/',all_products_collection_url:'/collections/all'},
    page_title:'Titre Shopify éditable', page_description:'Description Shopify éditable',
    canonical_url:`https://norticam.com${path}`, current_page:1, ...values,
  });
}

function schemas(html: string) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match=>JSON.parse(match[1]));
}

describe('native Shopify SEO additions',()=>{
  it('uses Shopify product SEO and a single unmodified native product schema',async()=>{
    const native={ '@type':'ProductGroup', hasVariant:[{'@type':'Product',sku:'supplier-real',offers:{price:'149.90',priceCurrency:'EUR'}}] };
    const html=await head('product','/products/live',{product:{title:'Caméra & kit',handle:'live',description:'Description',featured_image:{url:'https://norticam.com/cdn/product.webp',alt:'Caméra avec kit'},schema:native},page_title:'SEO Shopify & actuel'});
    expect(html).toContain('<title>SEO Shopify &amp; actuel</title>');
    expect(html).toContain('content="Description Shopify éditable"');
    expect(html).toContain('property="og:type" content="product"');
    expect(html).toContain('name="twitter:image" content="https://norticam.com/cdn/product.webp"');
    const data=schemas(html);
    expect(data.filter(schema=>schema['@type']==='ProductGroup')).toEqual([native]);
    expect(data.some(schema=>schema['@type']==='Review'||schema['@type']==='AggregateRating')).toBe(false);
    expect(data.find(schema=>schema['@type']==='BreadcrumbList').itemListElement.map((item:any)=>item.item)).toEqual(['https://norticam.com/','https://norticam.com/collections/all','https://norticam.com/products/live']);
    expect(data.find(schema=>schema['@type']==='Organization').logo).toBe('https://norticam.com/cdn/assets/norticam-mark.png');
  });
  it('gives native articles article metadata and canonical blog breadcrumbs',async()=>{
    const html=await head('article','/blogs/guides-dashcam/parking',{article:{title:'Parking',schema:{'@type':'Article'},image:{url:'//norticam.com/cdn/parking.webp'},published_at:'2026-10-01',updated_at:'2026-10-02'},blog:{title:'Guides',url:'/blogs/guides-dashcam'}});
    expect(html).toContain('property="og:type" content="article"');
    expect(html).toContain('property="og:image" content="https://norticam.com/cdn/parking.webp"');
    expect(schemas(html).find(schema=>schema['@type']==='BreadcrumbList').itemListElement[1].item).toBe('https://norticam.com/blogs/guides-dashcam');
  });
  it('keeps Track123 utility pages noindex with French metadata in the theme head',async()=>{
    for(const path of ['/apps/track123','/apps/track123/lookup']) {
      const html=await head('page',path);
      expect(html).toContain('<title>Suivre ma commande | NORTICAM</title>');
      expect(html.match(/<meta name="description"/g)).toHaveLength(1);
      expect(html).toContain('name="robots" content="noindex,follow"');
      expect(schemas(html).some(schema=>schema['@type']==='BreadcrumbList')).toBe(false);
    }
    expect(await head('page','/apps/track123-other')).toContain('name="robots" content="index,follow');
  });
  it('does not index artificial small collection pagination but preserves genuine future pagination',async()=>{
    const collection={title:'Voiture',url:'/collections/dashcam-voiture',all_products_count:12};
    const html=await head('collection','/collections/dashcam-voiture',{collection,current_page:2,canonical_url:'https://norticam.com/collections/dashcam-voiture?page=2'});
    expect(html).toContain('rel="canonical" href="https://norticam.com/collections/dashcam-voiture"');
    expect(html).toContain('name="robots" content="noindex,follow"');
    const future=await head('collection','/collections/new',{collection:{...collection,all_products_count:75},current_page:2,canonical_url:'https://norticam.com/collections/new?page=2'});
    expect(future).toContain('rel="canonical" href="https://norticam.com/collections/new?page=2"');
    expect(future).toContain('name="robots" content="index,follow');
  });
  it('preserves valid blog page two indexing and its canonical',async()=>{
    const html=await head('blog','/blogs/guides-dashcam',{blog:{title:'Guides',handle:'guides-dashcam'},current_page:2,canonical_url:'https://norticam.com/blogs/guides-dashcam?page=2'});
    expect(html).toContain('rel="canonical" href="https://norticam.com/blogs/guides-dashcam?page=2"');
    expect(html).toContain('name="robots" content="index,follow');
  });
  it('uses collection SEO explicitly saved in Shopify without changing its canonical',async()=>{
    const collection={title:'Voiture',url:'/collections/dashcam-voiture',all_products_count:12,metafields:{global:{title_tag:{type:'single_line_text_field',value:'Titre explicite'},description_tag:{type:'single_line_text_field',value:'Meta explicite'}}}};
    const html=await head('collection','/collections/dashcam-voiture',{collection,page_title:'Titre SEO actuel Shopify',page_description:'Description actuelle Shopify'});
    expect(html).toContain('<title>Titre SEO actuel Shopify</title>');
    expect(html).toContain('name="description" content="Description actuelle Shopify"');
    expect(html).toContain('rel="canonical" href="https://norticam.com/collections/dashcam-voiture"');
    expect(html).toContain('name="robots" content="index,follow');
  });
  it('retains collection editorial SEO fallbacks when no explicit metadata exists or fields are blank',async()=>{
    for(const global of [{},{title_tag:{type:'single_line_text_field',value:''},description_tag:{type:'single_line_text_field',value:'  '}}]) {
      const html=await head('collection','/collections/dashcam-voiture',{collection:{title:'Voiture',all_products_count:12,metafields:{global}},page_title:'Titre auto Shopify',page_description:'Description auto Shopify'});
      expect(html).toContain('<title>Dashcam voiture : choisir et comparer les modèles | NORTICAM</title>');
      expect(html).toContain('name="description" content="Trouvez une dashcam voiture adaptée');
      expect(html).not.toContain('Description auto Shopify');
    }
  });
  it('uses page SEO explicitly saved in Shopify while preserving its existing noindex',async()=>{
    const html=await head('page','/pages/informations-mentions-legales',{page:{title:'Mentions légales',metafields:{global:{title_tag:'Titre explicite legacy',description_tag:'Meta explicite legacy'}}},page_title:'Mentions éditées Shopify',page_description:'Informations éditées Shopify'});
    expect(html).toContain('<title>Mentions éditées Shopify</title>');
    expect(html).toContain('name="description" content="Informations éditées Shopify"');
    expect(html).toContain('name="robots" content="noindex,follow"');
  });
  it('uses brand social imagery when no page image exists and escapes schema names',async()=>{
    const html=await head('page','/pages/example',{page:{title:'Un titre </script><script>injection</script>'}});
    expect(html).toContain('property="og:image" content="https://norticam.com/cdn/assets/norticam-mark.png"');
    expect(schemas(html).find(schema=>schema['@type']==='BreadcrumbList').itemListElement[1].name).toContain('</script>');
    expect(html).not.toContain('<script>injection</script>');
  });
  it('keeps generators aligned with the added native snippets and metadata controls',async()=>{
    const source=await fs.readFile('scripts/build-shopify-theme.mjs','utf8');
    for(const name of ['norticam-social-meta','norticam-breadcrumb-schema','norticam-organization-schema','norticam-catalog-json']) expect(source).toContain(`render '${name}'`);
    expect(source).toContain('catalog.length > 50');
    expect(source).toContain("p.metafields.custom.norticam_specs.type == 'json'");
    expect(source).not.toContain('"@type":"Review"');
  });
});
