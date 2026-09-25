// Local-only Liquid preview. Cart actions use an isolated fixture, never the live shop.
import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Liquid } from 'liquidjs';
import { render } from '../dist/ssr/entry-server.js';
const theme=path.resolve('.'), target=path.resolve('dist/liquid-preview');
const catalog=JSON.parse(await fs.readFile('release/theme-catalog-reference.json','utf8'));
const manifest=JSON.parse(await fs.readFile('release/shopify-theme-manifest.json','utf8'));
const translations=JSON.parse(await fs.readFile(theme+'/locales/fr.default.json','utf8'));
for(const folder of ['layout','snippets','sections']) {
  await fs.mkdir(path.join(target,folder),{recursive:true});
  for(const file of await fs.readdir(path.join(theme,folder))) {
    let text=await fs.readFile(path.join(theme,folder,file),'utf8');
    text=text.replace(/{%\s*(doc|schema)\s*%}[\s\S]*?{%\s*end\1\s*%}/g,'')
      .replace(/{%\s*(?:endpaginate|paginate[^%]*)\s*%}/g,'')
      .replace(/{%\s*form\s+'([^']+)'[^%]*%}/g,(_,kind)=>`<form action="${kind==='contact'?'/contact':kind==='product'?'/cart/add':'/cart'}" method="post"><input type="hidden" name="form_type" value="${kind}">`)
      .replace(/{%\s*endform\s*%}/g,'</form>');
    await fs.writeFile(path.join(target,folder,file),text);
  }
}
const engine=new Liquid({root:[target+'/snippets',target+'/sections',target+'/layout'],extname:'.liquid',strictFilters:true});
engine.registerFilter('json',v=>JSON.stringify(v??null));
engine.registerFilter('asset_url',v=>'/assets/'+v);
engine.registerFilter('stylesheet_tag',v=>`<link rel="stylesheet" href="${v}">`);
engine.registerFilter('money',v=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(Number(v)/100));
engine.registerFilter('money_with_currency',v=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(Number(v)/100));
engine.registerFilter('t',v=>v.split('.').reduce((o,k)=>o?.[k],translations)||v);
engine.registerFilter('image_url',v=>(v?.src||v?.url||v||'').replace(/^https:/,''));
engine.registerFilter('image_tag',v=>`<img src="${v}" alt="" width="100" height="100">`);
engine.registerFilter('payment_type_svg_tag',v=>`<span class="h-7 w-11 text-xs">${v}</span>`);
engine.registerFilter('structured_data',v=>JSON.stringify({'@context':'https://schema.org','@type':'Product',name:v.title}));
engine.registerFilter('default_errors',()=> ''); engine.registerFilter('default_pagination',()=> '');
const products=catalog.map(p=>({id:p.id.split('/').pop(),handle:p.handle,title:p.title,type:p.productType,vendor:p.vendor,description:p.description,available:p.available,price:Math.round(p.price*100),url:'/products/'+p.handle,
  featured_image:{src:p.image,alt:p.imageAlt},images:(p.images||[]).map(i=>({src:i.url,alt:i.altText})),options:p.variants[0]?.options.map(o=>o.name)||[],
  variants:p.variants.map(v=>({id:v.numericId,title:v.title,available:v.availableForSale,price:Math.round(v.price*100),options:v.options.map(o=>o.value),featured_image:v.image?{src:v.image}:null})),
}));
for(const p of products) p.selected_or_first_available_variant=p.variants.find(v=>v.available)||p.variants[0];
if(process.env.NORTICAM_TEST_NEW_PRODUCT==='true') {
  const sample=structuredClone(products[0]);
  Object.assign(sample,{id:'990001',handle:'local-new-product-check',url:'/products/local-new-product-check',title:'Produit de contrôle local — non publié'});
  sample.variants=sample.variants.slice(0,1).map(v=>({...v,id:'990002'}));
  sample.selected_or_first_available_variant=sample.variants[0];
  products.push(sample);
}
const app=express();app.use(express.json());app.use(express.urlencoded({extended:false}));app.use('/assets',express.static(theme+'/assets'));
let cartItems=[];
function cart(){return {currency:'EUR',items:cartItems,item_count:cartItems.reduce((s,i)=>s+i.quantity,0),items_subtotal_price:cartItems.reduce((s,i)=>s+i.final_line_price,0),total_price:cartItems.reduce((s,i)=>s+i.final_line_price,0)};}
app.get('/cart.js',(_,res)=>res.json(cart()));
app.post('/cart/add.js',(req,res)=>{
  for(const item of req.body.items||[]){
    const p=products.find(p=>p.variants.some(v=>v.id===String(item.id))),v=p?.variants.find(v=>v.id===String(item.id));
    if(!v?.available)return res.status(422).json({description:'Configuration indisponible.'});
    let line=cartItems.find(i=>i.variant_id===v.id);
    if(!line){line={key:v.id+':preview',variant_id:v.id,product_id:p.id,handle:p.handle,product_title:p.title,vendor:p.vendor,variant_title:v.title,featured_image:{url:p.featured_image.src},quantity:0,final_price:v.price,final_line_price:0};cartItems.push(line);}
    line.quantity+=Number(item.quantity);line.final_line_price=line.quantity*line.final_price;
  }res.json(cart());
});
app.post('/cart/change.js',(req,res)=>{const line=cartItems.find(i=>i.key===req.body.id);if(!line)return res.status(422).json({description:'Ligne introuvable.'});line.quantity=Number(req.body.quantity);line.final_line_price=line.quantity*line.final_price;cartItems=cartItems.filter(i=>i.quantity>0);res.json(cart());});
app.post('/cart/update.js',(req,res)=>{for(const line of cartItems){if(line.key in req.body.updates){line.quantity=Number(req.body.updates[line.key]);line.final_line_price=line.quantity*line.final_price;}}cartItems=cartItems.filter(i=>i.quantity>0);res.json(cart());});
app.get('/checkout',(_,res)=>res.send('<h1>Prévisualisation locale</h1><p>Le passage au checkout est correct. Aucune commande ni paiement n’est créé dans cette prévisualisation.</p>'));
app.post('/contact',(_,res)=>res.send('<h1>Prévisualisation locale</h1><p>Formulaire natif soumis. Aucun email n’est envoyé depuis le simulateur local.</p>'));
app.get('*',async(req,res,next)=>{try{
  const native=req.path.replace(/\/$/,'')||'/',record=manifest.routes.find(r=>r.native===native),p=products.find(p=>p.url===native);
  const pageType=native==='/'?'index':native==='/cart'?'cart':native==='/search'?'search':p?'product':native.startsWith('/collections/')?'collection':record?'page':'404';
  const data={request:{path:native,page_type:pageType,locale:{iso_code:'fr'},design_mode:true},routes:{root_url:'/',all_products_collection_url:'/collections/all',search_url:'/search'},
    shop:{name:'NORTICAM',url:'http://127.0.0.1:4331',enabled_payment_types:['visa','master','american_express','cartes_bancaires','apple_pay','paypal']},
    cart:{...cart(),currency:{iso_code:'EUR'}},collections:{all:{products}},product:p,page:{handle:native.split('/').pop()},collection:{title:'NORTICAM'},page_title:p?.title||'NORTICAM',canonical_url:'http://127.0.0.1:4331'+native,
    form:{posted_successfully:false},content_for_header:'',template:{name:pageType},search:{results:[],terms:req.query.q||''}};
  data.content_for_layout=await engine.renderFile(pageType==='cart'?'norticam-cart':pageType==='search'?'norticam-search':'norticam-storefront',data,{globals:data});
  const html=await engine.renderFile('theme',data,{globals:data});res.status(pageType==='404'?404:200).send(html);
}catch(e){next(e);}});
app.listen(4331,'127.0.0.1',()=>console.log('Shopify Liquid preview http://127.0.0.1:4331 (local fixture commerce only)'));
const original=express();original.use(express.static('dist/public'));
original.get('*',async(req,res,next)=>{try{const out=await render(req.path.replace(/\/$/,'')||'/',catalog);const shell=await fs.readFile('client/index.html','utf8');res.send(shell.replace('<div id="root"></div>',`<div id="root">${out.html}</div>`).replace('<script type="module" src="/src/main.tsx"></script>','').replace('</head>','<link rel="stylesheet" href="http://127.0.0.1:4331/assets/norticam-style.css"></head>'));}catch(e){next(e);}});
original.listen(4330,'127.0.0.1',()=>console.log('Original React reference http://127.0.0.1:4330'));
