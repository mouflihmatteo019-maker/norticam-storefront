import { describe, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import { Liquid } from 'liquidjs';

const engine = new Liquid();
engine.registerFilter('json', value => JSON.stringify(value ?? null));
engine.registerFilter('asset_url', value => `/assets/${value}`);
engine.registerFilter('payment_type_svg_tag', () => '');

const product = (id: number) => ({ id, handle: `camera-${id}`, title: `Camera ${id}`, vendor: 'Example', type: 'Dashcam', available: true, description: 'Description', images: [], options: ['Title'], variants: [{id:id * 10, title:'Default', available:true, price:10000, options:['Default']}] });
async function bootstrap(current: ReturnType<typeof product> | null, all: ReturnType<typeof product>[], currentPage = 1) {
  const raw = await fs.readFile('snippets/norticam-bootstrap.liquid', 'utf8');
  const item = (await fs.readFile('snippets/norticam-product-json.liquid','utf8')).replace(/{% doc %}[\s\S]*?{% enddoc %}/g,'');
  const catalogue = (await fs.readFile('snippets/norticam-catalog-json.liquid','utf8'))
    .replace(/{% doc %}[\s\S]*?{% enddoc %}/g,'').replaceAll('current_product','product');
  const source=raw.replace(/{% doc %}[\s\S]*?{% enddoc %}/g,'').replace(/{% (?:paginate[^%]*|endpaginate) %}/g,'')
    .replaceAll("{% render 'norticam-catalog-json', current_product: product %}",catalogue)
    .replace(/{% render 'norticam-product-json', p: product %}/g,`{% assign p = product %}${item}`)
    .replace(/{% render 'norticam-product-json', p: p %}/g,item);
  const html=await engine.parseAndRender(source,{product:current,collections:{all:{products:all,all_products_count:all.length}},shop:{enabled_payment_types:[]},routes:{root_url:'/'},cart:{currency:{iso_code:'EUR'}},n_route:'/products/camera',current_page:currentPage});
  return JSON.parse(html.match(/id="norticam-theme-data"[^>]*>([\s\S]*?)<\/script>/)![1]);
}

describe('live Liquid product bootstrap',()=>{
  it('includes a product added outside the catalogue page without rebuilding',async()=>{
    const data=await bootstrap(product(9),[product(1),product(2)]);
    expect(data.products.map((p:any)=>p.handle)).toEqual(['camera-9','camera-1','camera-2']);
  });
  it('does not duplicate the current product',async()=>{
    const data=await bootstrap(product(1),[product(1),product(2)]);
    expect(data.products.map((p:any)=>p.id)).toEqual(['gid://shopify/Product/1','gid://shopify/Product/2']);
  });
  it('handles an empty catalogue and pages without a current product',async()=>{
    expect((await bootstrap(null,[])).products).toEqual([]);
    expect((await bootstrap(null,[product(2)])).products).toHaveLength(1);
  });
  it('uses current Shopify variant prices, not a previous ordering',async()=>{
    const p=product(1);p.variants=[{...p.variants[0],id:11,price:12500},{...p.variants[0],id:10,price:8900}];
    const data=await bootstrap(p,[]);
    expect(data.products[0].variants.nodes.map((v:any)=>[v.id,v.price.amount])).toEqual([['gid://shopify/ProductVariant/11',125],['gid://shopify/ProductVariant/10',89]]);
  });
  it('keeps the small live catalogue independent of a blog or collection page query',async()=>{
    const raw=await fs.readFile('snippets/norticam-bootstrap.liquid','utf8');
    const branch=raw.match(/{% if collections\.all\.all_products_count <= 50 %}([\s\S]*?){% else %}/)![1];
    expect(branch).not.toContain('paginate');
    expect(await bootstrap(null,[product(1),product(2)],2)).toEqual(await bootstrap(null,[product(1),product(2)],1));
  });
  it('exposes only a typed optional merchant specifications field without changing price',async()=>{
    const p={...product(1),metafields:{custom:{norticam_specs:{type:'json',value:{version:1,facts:{resolution:'3K HDR'}}}}}};
    const result=await bootstrap(p,[]);
    expect(result.products[0].norticamSpecs).toEqual(p.metafields.custom.norticam_specs.value);
    expect(result.products[0].variants.nodes[0].price.amount).toBe(100);
    expect((await bootstrap(product(1),[])).products[0].norticamSpecs).toBeNull();
    expect((await bootstrap({...p,metafields:{custom:{norticam_specs:{type:'single_line_text_field',value:'not JSON'}}}},[])).products[0].norticamSpecs).toBeNull();
  });
});
