import { describe, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import { Liquid } from 'liquidjs';

const engine = new Liquid();
engine.registerFilter('json', value => JSON.stringify(value ?? null));
engine.registerFilter('asset_url', value => `/assets/${value}`);
engine.registerFilter('payment_type_svg_tag', () => '');

const product = (id: number) => ({ id, handle: `camera-${id}`, title: `Camera ${id}`, vendor: 'Example', type: 'Dashcam', available: true, description: 'Description', images: [], options: ['Title'], variants: [{id:id * 10, title:'Default', available:true, price:10000, options:['Default']}] });
async function bootstrap(current: ReturnType<typeof product> | null, all: ReturnType<typeof product>[]) {
  const raw = await fs.readFile('snippets/norticam-bootstrap.liquid', 'utf8');
  const item = (await fs.readFile('snippets/norticam-product-json.liquid','utf8')).replace(/{% doc %}[\s\S]*?{% enddoc %}/g,'');
  const source=raw.replace(/{% doc %}[\s\S]*?{% enddoc %}/g,'').replace(/{% (?:paginate[^%]*|endpaginate) %}/g,'')
    .replace(/{% render 'norticam-product-json', p: product %}/g,`{% assign p = product %}${item}`)
    .replace(/{% render 'norticam-product-json', p: p %}/g,item);
  const html=await engine.parseAndRender(source,{product:current,collections:{all:{products:all}},shop:{enabled_payment_types:[]},routes:{root_url:'/'},cart:{currency:{iso_code:'EUR'}},n_route:'/products/camera'});
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
});
