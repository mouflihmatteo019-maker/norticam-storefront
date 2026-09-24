import fs from 'node:fs/promises';
import path from 'node:path';
import { render, loadCatalog, themePath, themeCategories, productsForRoute } from '../dist/ssr/entry-server.js';

// Shopify's GitHub integration reads theme directories at repository root.
const root = path.resolve('.');
const write = async (name, data) => { const file=path.join(root,name); await fs.mkdir(path.dirname(file),{recursive:true}); await fs.writeFile(file,data); };
const json = (name, data) => write(name, JSON.stringify(data,null,2)+'\n');
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const literal = value => "'" + value.replace(/'/g,'’').replace(/[\r\n]+/g,' ') + "'";
const catalog = await loadCatalog();
if (!catalog.length || catalog.length > 250 || catalog.some(p=>!p.verified)) throw new Error('A verified catalogue of 1–250 products is required.');
await fs.mkdir('release',{recursive:true});
await fs.writeFile('release/theme-catalog-reference.json', JSON.stringify(catalog,null,2));

const routes = ['/', '/boutique', ...themeCategories.map(c=>'/'+c), '/comparatif', '/quiz', '/conseils', '/suivi-colis',
  ...['contact','mentions-legales','confidentialite','livraison-retours'].map(s=>'/informations/'+s),
  ...['quelle-dashcam-voiture-choisir','dashcam-avant-arriere-guide','dashcam-moto-guide','dashcam-2k-vs-4k','70mai-vs-ddpai','dashcam-mode-parking-guide','dashcam-nuit','dashcam-sans-fil','dashcam-voiture-discrete'].map(s=>'/conseils/'+s),
  ...['70mai-a510-vs-ddpai-z50-pro','70mai-a510-vs-ddpai-n1-dual','freedconn-r1-plus-vs-fodsports-fx60c'].map(s=>'/comparatif/'+s),
  ...catalog.map(p=>'/produits/'+p.handle), '/__not-found__'];

// Compile the existing components themselves. Unique money tokens become LIVE Liquid prices.
// This keeps prices out of generated editorial markup without rebuilding its design.
const tokens = new Map(); let token=700000;
const symbolic = catalog.map((p,i)=> {
  const bind = expression => { const value=++token + .97; tokens.set(new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(value),expression); return value; };
  const values = new Map();
  for(const price of [...new Set(p.variants.map(v=>v.price))].sort((a,b)=>a-b)) {
    const index=p.variants.findIndex(v=>v.price===price);
    values.set(price,bind(`n_product_${i}.variants[${index}].price`));
  }
  return {...p, currency:'EUR', price:values.get(p.price) || bind(`n_product_${i}.price`),
    variants:p.variants.map(v=>({...v,price:values.get(v.price)}))};
});
function convert(html) {
  html=html.replace(/<link rel="preload"[^>]*>/g,'');
  html=html.replace(/href="(\/(?!\/)[^"]*)"/g,(_,href)=>{
    const native=themePath(href);
    const expression=native==='/' ? 'routes.root_url' : native==='/collections/all' ? 'routes.all_products_collection_url' : `routes.root_url | append: '${native.slice(1)}'`;
    return `href="{{ ${expression} }}"`;
  });
  html=html.replaceAll('src="/norticam-mark.png"',`src="{{ 'norticam-mark.png' | asset_url }}"`);
  for(const [money,expression] of tokens) html=html.replaceAll(money,`{{ ${expression} | money }}`);
  return html;
}
const records=[];
for (let i=0;i<routes.length;i++) {
  const route=routes[i], result=await render(route,symbolic);
  const normal=await render(route,catalog);
  let html=convert(result.html);
  if(route.startsWith('/produits/')) {
    // Native form remains available without JavaScript; the original interactive UI takes over.
    html+=`<noscript>{% render 'norticam-product-form' %}</noscript>`;
  }
  if(route==='/informations/contact') {
    html=html.replace(/<form([^>]*)>/,`{% form 'contact', class: 'space-y-5 rounded-2xl bg-white p-6 sm:p-8' %}{{ form.errors | default_errors }}{% if form.posted_successfully? %}<p role="status">{{ 'contact.success' | t }}</p>{% endif %}`)
      .replace('</form>','{% endform %}').replace('Ouvrir mon email pour envoyer','Envoyer mon message')
      .replace('Votre message s’ouvrira dans votre application email pour que vous puissiez l’envoyer.','Votre message est transmis à notre support.');
    for(const field of ['name','email','subject','order','message']) html=html.replaceAll(`name="${field}"`,`name="contact[${field==='message'?'body':field}]"`);
  }
  await write(`snippets/norticam-view-${i}.liquid`,html+'\n');
  const native=themePath(route);
  records.push({route,native,snippet:`norticam-view-${i}`,head:normal.head});
}
// render creates isolated scope, so product variables must be assigned inside each compiled view.
for(const r of records) {
  const file=path.join(root,`snippets/${r.snippet}.liquid`), html=await fs.readFile(file,'utf8');
  const needed=new Set([...html.matchAll(/n_product_(\d+)\./g)].map(m=>Number(m[1])));
  const assigns=catalog.flatMap((p,i)=>needed.has(i)?[`{% assign n_product_${i} = collections.all.products | where: 'handle', '${p.handle}' | first %}`]:[]).join('\n');
  await fs.writeFile(file,`{% doc %}Original NORTICAM React markup compiled for Shopify. Prices are live.{% enddoc %}\n{% paginate collections.all.products by 250 %}\n${assigns}\n${html}\n{% endpaginate %}\n`);
}
const routeCases=records.filter(r=>!r.route.startsWith('/produits/')&&r.route!=='/__not-found__').map(r=>`{% when '${r.native}' %}{% assign n_route = '${r.route}' %}`).join('\n');
const routeSetup=`{% assign n_route = '/__native__' %}\n{% if request.page_type == '404' %}{% assign n_route = '/__not-found__' %}{% endif %}\n{% assign n_request_path = request.path | remove_first: routes.root_url | prepend: '/' %}\n{% case n_request_path %}\n${routeCases}\n{% endcase %}\n{% if request.page_type == 'product' %}{% assign n_route = '/produits/' | append: product.handle %}{% endif %}\n`;
const dispatch=records.map(r=>`{% when '${r.route}' %}{% render '${r.snippet}' %}`).join('\n');
await write('sections/norticam-storefront.liquid',`${routeSetup}<div id="root" data-norticam-original-path="{{ n_route | escape }}">{% case n_route %}${dispatch}{% else %}{% render 'norticam-native-page' %}{% endcase %}</div>\n{% schema %}\n{"name":"NORTICAM fidèle","settings":[],"presets":[{"name":"NORTICAM fidèle"}]}\n{% endschema %}`);
for(const type of ['index','product','collection','page','404']) await json(`templates/${type}.json`,{sections:{main:{type:'norticam-storefront'}},order:['main']});

const headCases=records.map(r=>`{% when '${r.route}' %}{% assign n_title = ${literal(r.head.title)} %}{% assign n_description = ${literal(r.head.description)} %}{% assign n_noindex = ${!!r.head.noindex} %}`).join('\n');
const fontResponse=await fetch('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Manrope:wght@600;700;800&display=swap', {headers:{'User-Agent':'Mozilla/5.0 Chrome/130.0.0.0 Safari/537.36'}});
if(!fontResponse.ok)throw new Error('Unable to package original fonts.');
let fontCss=await fontResponse.text();let fontIndex=0;
for(const url of [...new Set([...fontCss.matchAll(/url\((https:[^)]+)\)/g)].map(m=>m[1]))]) {
  const name=`norticam-font-${fontIndex++}.woff2`;const response=await fetch(url);if(!response.ok)throw new Error('Font unavailable: '+url);
  await write('assets/'+name,Buffer.from(await response.arrayBuffer()));fontCss=fontCss.replaceAll(url,name);
}
await write('assets/norticam-fonts.css',fontCss);
const fontLink="{{ 'norticam-fonts.css' | asset_url | stylesheet_tag }}";
await write('layout/theme.liquid',`<!doctype html>
<html lang="{{ request.locale.iso_code }}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
${routeSetup}
{% assign n_title = page_title %}{% assign n_description = page_description %}{% assign n_noindex = false %}
{% case n_route %}${headCases}{% endcase %}
{% if request.page_type == 'product' %}{% assign n_title = page_title %}{% assign n_description = page_description | default: product.description | strip_html %}{% endif %}
<title>{{ n_title | escape }}</title><meta name="description" content="{{ n_description | escape }}">
<link rel="canonical" href="{{ canonical_url }}">
{% if n_noindex or request.design_mode or request.page_type == 'cart' or request.page_type == 'search' or request.page_type == '404' %}<meta name="robots" content="noindex,follow">{% else %}<meta name="robots" content="index,follow,max-image-preview:large">{% endif %}
<meta property="og:title" content="{{ n_title | escape }}"><meta property="og:description" content="{{ n_description | escape }}"><meta property="og:url" content="{{ canonical_url }}"><meta property="og:site_name" content="{{ shop.name | escape }}"><meta property="og:type" content="website">
{% if page_image %}<meta property="og:image" content="https:{{ page_image | image_url: width: 1200 }}">{% endif %}
<link rel="icon" href="{{ 'norticam-mark.png' | asset_url }}"><link rel="apple-touch-icon" href="{{ 'norticam-mark.png' | asset_url }}">
${fontLink}
{{ 'norticam-style.css' | asset_url | stylesheet_tag }}
{{ content_for_header }}
{% if request.page_type == 'product' %}<script type="application/ld+json">{{ product | structured_data }}</script>{% endif %}
{% if request.page_type == 'article' %}<script type="application/ld+json">{{ article | structured_data }}</script>{% endif %}
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":{{ shop.name | json }},"url":{{ shop.url | json }}}</script>
</head><body>
{{ content_for_layout }}
{% render 'norticam-bootstrap', n_route: n_route %}
{% unless n_route == '/__not-found__' or n_route == '/__native__' %}<script src="{{ 'norticam-app.js' | asset_url }}" defer></script>{% endunless %}
</body></html>`);

await write('snippets/norticam-product-form.liquid',`{% doc %}Native product form fallback.{% enddoc %}
<div class="container max-w-3xl py-8">{% form 'product', product %}<label for="native-variant">{{ 'product.configuration' | t }}</label><select id="native-variant" name="id" class="w-full rounded-xl border p-3">{% for variant in product.variants %}<option value="{{ variant.id }}" {% unless variant.available %}disabled{% endunless %} {% if variant == product.selected_or_first_available_variant %}selected{% endif %}>{{ variant.title | escape }} — {{ variant.price | money }}</option>{% endfor %}</select><button class="btn-primary mt-4" type="submit" {% unless product.available %}disabled{% endunless %}>{{ 'product.add' | t }}</button>{% endform %}</div>`);
await write('snippets/norticam-native-page.liquid',`{% doc %}Native fallback for resources added after theme compilation.{% enddoc %}
<main class="container py-16"><a class="btn-secondary" href="{{ routes.root_url }}">{{ 'general.home' | t }}</a><h1 class="section-title">{{ page.title | default: product.title | default: collection.title | default: page_title | escape }}</h1><div class="mt-8 leading-8">{{ page.content }}{{ article.content }}{{ collection.description }}{{ product.description }}</div>{% if product %}{% render 'norticam-product-form' %}{% endif %}</main>`);

await write('snippets/norticam-bootstrap.liquid',`{% doc %}Live Liquid catalogue and native commerce configuration. @param {string} n_route{% enddoc %}
{% capture n_products %}[
{% paginate collections.all.products by 250 %}{% for p in collections.all.products %}{% unless forloop.first %},{% endunless %}{% render 'norticam-product-json', p: p %}{% endfor %}{% endpaginate %}
]{% endcapture %}
{% capture n_payments %}{% for type in shop.enabled_payment_types %}{{ type | payment_type_svg_tag: class: 'h-7 w-11' }}{% endfor %}{% endcapture %}
<script id="norticam-theme-data" type="application/json">{"path":{{ n_route | json }},"root":{{ routes.root_url | json }},"currency":{{ cart.currency.iso_code | json }},"assets":{"logo":{{ 'norticam-mark.png' | asset_url | json }}},"products":{{ n_products | replace: '</', '\\u003c/' }},"payments":{{ n_payments | json | replace: '</', '\\u003c/' }}}</script>
<script>window.NorticamTheme=JSON.parse(document.getElementById('norticam-theme-data').textContent);if(window.NorticamTheme.path==='/informations/contact'){window.NorticamTheme.contactForm=document.querySelector('#root main').innerHTML;}</script>`);
await write('snippets/norticam-product-json.liquid',`{% doc %}Public product data from the active Shopify sales channel. @param {product} p{% enddoc %}
{"id":"gid://shopify/Product/{{ p.id }}","handle":{{ p.handle | json }},"title":{{ p.title | json }},"vendor":{{ p.vendor | json }},"productType":{{ p.type | json }},"description":{{ p.description | strip_html | json }},"availableForSale":{{ p.available | json }},"featuredImage":{"url":{% if p.featured_image %}{{ p.featured_image | image_url: width: 1600 | prepend: 'https:' | json }}{% else %}null{% endif %},"altText":{{ p.featured_image.alt | json }}},"images":{"nodes":[{% for image in p.images %}{% unless forloop.first %},{% endunless %}{"url":{{ image | image_url: width: 1600 | prepend: 'https:' | json }},"altText":{{ image.alt | json }}}{% endfor %}]},"variants":{"pageInfo":{"hasNextPage":false},"nodes":[{% for v in p.variants %}{% unless forloop.first %},{% endunless %}{"id":"gid://shopify/ProductVariant/{{ v.id }}","title":{{ v.title | json }},"availableForSale":{{ v.available | json }},"price":{"amount":{{ v.price | divided_by: 100.0 | json }},"currencyCode":{{ cart.currency.iso_code | json }}},"selectedOptions":[{% for option in p.options %}{% unless forloop.first %},{% endunless %}{"name":{{ option | json }},"value":{{ v.options[forloop.index0] | json }}}{% endfor %}],"image":{% if v.featured_image %}{"url":{{ v.featured_image | image_url: width: 1600 | prepend: 'https:' | json }}}{% else %}null{% endif %}}{% endfor %}]}}`);

await write('sections/norticam-cart.liquid',`<main class="container max-w-4xl py-16"><a href="{{ routes.root_url }}" class="btn-secondary">{{ 'general.home' | t }}</a><h1 class="section-title">{{ 'cart.title' | t }} ({{ cart.item_count }})</h1>{% if cart.empty? %}<p class="mt-6">{{ 'cart.empty' | t }}</p><a class="btn-primary mt-6" href="{{ routes.all_products_collection_url }}">{{ 'cart.continue' | t }}</a>{% else %}{% form 'cart', cart %}{% for item in cart.items %}<div class="mt-6 flex flex-wrap items-center gap-5 rounded-2xl bg-white p-5">{% if item.image %}{{ item.image | image_url: width: 200 | image_tag: width: 100, height: 100, loading: 'lazy' }}{% endif %}<a href="{{ item.url }}" class="flex-1 font-bold">{{ item.product.title | escape }}<small class="block">{{ item.variant.title | escape }}</small></a><label>{{ 'cart.quantity' | t }}<input class="ml-2 w-20 rounded-lg border p-2" type="number" name="updates[]" value="{{ item.quantity }}" min="0"></label><strong>{{ item.final_line_price | money }}</strong><a href="{{ item.url_to_remove }}">{{ 'cart.remove' | t }}</a></div>{% endfor %}<p class="my-6 text-right text-2xl font-bold">{{ cart.total_price | money_with_currency }}</p><button class="btn-secondary" name="update">{{ 'cart.update' | t }}</button><button class="btn-primary ml-3" name="checkout">{{ 'cart.checkout' | t }}</button>{% endform %}{% endif %}</main>{% schema %}{"name":"Panier NORTICAM","settings":[]}{% endschema %}`);
await json('templates/cart.json',{sections:{main:{type:'norticam-cart'}},order:['main']});
await write('sections/norticam-search.liquid',`<main class="container py-16"><a href="{{ routes.root_url }}" class="btn-secondary">{{ 'general.home' | t }}</a><h1 class="section-title">{{ 'search.title' | t }}</h1><form action="{{ routes.search_url }}" method="get" role="search"><label for="q">{{ 'search.query' | t }}</label><input id="q" name="q" value="{{ search.terms | escape }}" class="m-4 rounded-xl border p-3"><button class="btn-primary">{{ 'search.submit' | t }}</button></form>{% paginate search.results by 12 %}<div class="grid gap-5 sm:grid-cols-3">{% for result in search.results %}<a href="{{ result.url }}" class="rounded-2xl bg-white p-6">{% if result.featured_image %}{{ result.featured_image | image_url: width: 500 | image_tag: loading: 'lazy' }}{% endif %}<h2 class="mt-4 font-bold">{{ result.title | escape }}</h2>{% if result.object_type == 'product' %}{{ result.price | money }}{% endif %}</a>{% endfor %}</div>{{ paginate | default_pagination }}{% endpaginate %}</main>{% schema %}{"name":"Recherche NORTICAM","settings":[]}{% endschema %}`);
await json('templates/search.json',{sections:{main:{type:'norticam-search'}},order:['main']});
await json('templates/article.json',{sections:{main:{type:'norticam-storefront'}},order:['main']});
await write('templates/password.liquid',`{% layout 'theme' %}<main class="container max-w-xl py-20"><h1 class="section-title">{{ shop.name | escape }}</h1><p class="my-6">{{ shop.password_message }}</p>{% form 'storefront_password' %}{{ form.errors | default_errors }}<label for="password">{{ 'general.password' | t }}</label><input class="m-3 rounded-xl border p-3" id="password" type="password" name="password"><button class="btn-primary">{{ 'general.enter' | t }}</button>{% endform %}</main>`);
await json('config/settings_schema.json',[{name:'theme_info',theme_name:'NORTICAM Fidèle',theme_version:'1.0.0',theme_author:'NORTICAM',theme_documentation_url:'https://github.com/mouflihmatteo019-maker/norticam-storefront',theme_support_url:'https://norticam.com/informations/contact/'}]);
await json('config/settings_data.json',{current:{}});
await json('locales/fr.default.json',{general:{home:'Accueil',password:'Mot de passe',enter:'Entrer'},product:{configuration:'Configuration',add:'Ajouter au panier'},contact:{success:'Votre message a bien été envoyé. Nous vous répondrons par email.'},cart:{title:'Panier',empty:'Votre panier est vide.',continue:'Découvrir la sélection',quantity:'Quantité',remove:'Retirer',update:'Actualiser',checkout:'Continuer vers le paiement sécurisé'},search:{title:'Rechercher une dashcam',query:'Votre recherche',submit:'Rechercher'}});
for(const name of await fs.readdir('dist/theme-runtime')) await fs.copyFile(path.join('dist/theme-runtime',name),path.join(root,'assets',name)).catch(async()=>{await fs.mkdir(path.join(root,'assets'),{recursive:true});await fs.copyFile(path.join('dist/theme-runtime',name),path.join(root,'assets',name));});
for(const name of ['norticam-mark.png','norticam-logo.png','favicon.svg']) await fs.copyFile('client/public/'+name,path.join(root,'assets',name));
const resources=records.filter(r=>r.native.startsWith('/pages/')).map(r=>({type:'page',handle:r.native.split('/').pop(),title:r.head.title,description:r.head.description,original:r.route,url:r.native}));
for(const category of themeCategories) resources.push({type:'collection',handle:category,title:records.find(r=>r.route==='/'+category).head.title,productIds:productsForRoute('/'+category,catalog).map(p=>p.id),url:'/collections/'+category});
await fs.writeFile('release/shopify-resources.json',JSON.stringify(resources,null,2));
await fs.writeFile('release/shopify-redirects.csv','Redirect from,Redirect to\n'+records.filter(r=>r.route!=='/'&&r.route!=='/__not-found__').flatMap(r=>[`${r.route},${r.native}`,`${r.route}/,${r.native}`]).join('\n')+'\n');
await fs.writeFile('release/shopify-theme-manifest.json',JSON.stringify({sourceCommit:'2c63b79147110b49960835ebfccaa99c6d4a458a',builtAt:new Date().toISOString(),products:catalog.length,pages:records.length,resources:resources.length,routes:records.map(({route,native})=>({route,native}))},null,2));
console.log(`Shopify theme: ${records.length} faithful views; ${catalog.length} live products; ${resources.length} resource definitions.`);
