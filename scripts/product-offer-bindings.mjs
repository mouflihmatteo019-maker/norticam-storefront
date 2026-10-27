/**
 * Keep the first HTML response aligned with Shopify, including ?variant=.
 * No user-agent/Google branch: visitors and crawlers receive the same offer.
 */
export function bindProductOffer(html) {
  const variant = 'product.selected_or_first_available_variant';
  html = html.replace(/(<p\b[^>]*\bdata-shopify-selected-price[^>]*>)[\s\S]*?<\/p>/g,
    `$1{% if ${variant} %}{{ ${variant}.price | money }}{% else %}Configuration à vérifier{% endif %}</p>`);
  html = html.replace(/<span\b[^>]*\bdata-shopify-availability[^>]*>[\s\S]*?<\/span>/g,
    `<span data-shopify-availability class="rounded-full px-3 py-1.5 text-xs font-bold {% if ${variant}.available %}bg-emerald-50 text-emerald-700{% else %}bg-slate-100 text-slate-500{% endif %}">{% if ${variant}.available %}Disponible{% else %}Indisponible{% endif %}</span>`);
  html = html.replace(/<div\b[^>]*\bdata-shopify-variant-picker[^>]*>[\s\S]*?<\/div>/,
    `<div data-shopify-variant-picker>{% if product.variants.size > 1 %}<form action="{{ product.url }}" method="get" class="mt-6 space-y-3"><label class="block text-sm font-bold">Votre configuration<select name="variant" class="mt-2 block w-full rounded-xl border bg-white p-3">{% for v in product.variants %}<option value="{{ v.id }}" {% if v.id == ${variant}.id %}selected{% endif %}>{{ v.title | escape }} — {{ v.price | money }}{% unless v.available %} — indisponible{% endunless %}</option>{% endfor %}</select></label><button type="submit" class="text-sm font-bold text-[#1672d8] underline">Choisir cette configuration</button></form>{% endif %}</div>`);
  let formIndex = 0;
  html = html.replace(/<button\b([^>]*\bdata-shopify-add[^>]*)>[\s\S]*?<\/button>/g, (_, attrs) => {
    const clean = attrs.replace(/\sdisabled(?:="[^"]*")?/g, '').replace(/\stype="[^"]*"/g, '');
    return `<form action="{{ routes.root_url }}cart/add" method="post" class="contents" data-shopify-native-offer="${++formIndex}"><input type="hidden" name="id" value="{{ ${variant}.id }}"><input type="hidden" name="quantity" value="1"><button${clean} type="submit" {% unless ${variant}.available %}disabled{% endunless %}>{% if ${variant}.available %}Ajouter au panier{% else %}Variante indisponible{% endif %}</button></form>`;
  });
  if (formIndex !== 2 || !html.includes('data-shopify-selected-price') || !html.includes('data-shopify-availability')) {
    throw new Error('Product offer markers missing: refusing to emit a stale offer.');
  }
  return html;
}

/** Shopify payment methods, not a hard-coded list, even before hydration. */
export function bindPaymentBadges(html) {
  return html.replace(/(<div\b[^>]*aria-label="Moyens de paiement acceptés"[^>]*>)[\s\S]*?<\/div>/g,
    `$1{% for type in shop.enabled_payment_types %}{{ type | payment_type_svg_tag: class: 'h-7 w-11' }}{% endfor %}</div>`);
}

/** A current Shopify technical record must not revive outdated snapshot facts. */
export function bindProductFacts(html) {
  const labels = { resolution: 'Résolution', coverage: 'Couverture', wifi: 'Wi-Fi', gps: 'GPS', night: 'Image nocturne', parking: 'Mode parking', storage: 'Stockage', sensor: 'Capteur', imageProcessing: 'Traitement d’image', power: 'Alimentation', protection: 'Protection documentée', loop: 'Enregistrement en boucle' };
  const positive = { wifi: 'Wi-Fi', gps: 'GPS intégré', night: 'Fonction nocturne', parking: 'Mode parking avec alimentation compatible', loop: 'Enregistrement en boucle' };
  const unknowns = 'non precise|non documente|non renseigne|non verifie|a confirmer|a verifier|a valider|generation livree|version livree|reference livree|selon la version|selon version|selon la generation|selon generation|d6wl ou d6rl|d6wl/d6rl|confirmez le nombre de cameras|confirmer le nombre de cameras';
  const setup = `{% assign n_specs = product.metafields.custom.norticam_specs.value %}{% assign n_unknown_markers = '${unknowns}' | split: '|' %}`;
  const bind = (key, fallback, row) => {
    if (!(key in labels)) throw new Error(`Unknown product fact: ${key}`);
    const fact = `n_specs.facts.${key}`, cap = `n_specs.capabilities.${key}`;
    let value = `{% assign n_fact = ${fact} %}`;
    // A510 already documents its sensor in the current night fact. Never reach
    // back to an older catalogue if an authoritative Shopify record exists.
    if (key === 'sensor' || key === 'imageProcessing') {
      const check = key === 'sensor' ? "n_candidate contains 'imx' or n_candidate contains 'starvis' or n_candidate contains 'capteur'" : "n_candidate contains 'hdr' or n_candidate contains 'nightvis' or n_candidate contains 'infrarouge' or n_candidate contains 'stabilis'";
      value += `{% if n_fact == nil %}{% assign n_capability_keys = 'gps|wifi|parking|night|loop|rotation|carplay' | split: '|' %}{% for pair in n_specs.facts %}{% assign n_candidate = pair[1] | downcase %}{% assign n_candidate_allowed = true %}{% if n_capability_keys contains pair[0] and n_specs.capabilities[pair[0]] != true %}{% assign n_candidate_allowed = false %}{% endif %}{% if n_candidate contains 'gps' and n_specs.capabilities.gps != true %}{% assign n_candidate_allowed = false %}{% endif %}{% if n_candidate_allowed %}{% if ${check} %}{% assign n_fact = pair[1] %}{% break %}{% endif %}{% endif %}{% endfor %}{% endif %}`;
    }
    value += `{% assign n_normalized = n_fact | downcase | strip | replace: 'é', 'e' | replace: 'è', 'e' | replace: 'à', 'a' | replace: 'ê', 'e' | replace: ' / ', '/' | replace: ' /', '/' | replace: '/ ', '/' %}{% assign n_known = true %}{% for marker in n_unknown_markers %}{% if n_normalized contains marker %}{% assign n_known = false %}{% break %}{% endif %}{% endfor %}`;
    let output = `{% if n_known and n_fact != blank %}{{ n_fact | escape }}{% endif %}`;
    if (key in positive) {
      output = `{% if ${cap} == false %}Non{% if n_known and n_fact != blank %} — {{ n_fact | escape }}{% endif %}{% elsif ${cap} == true and n_known %}{{ n_fact | default: '${positive[key]}' | escape }}{% endif %}`;
    }
    const content = `{% capture n_fact_content %}{% if product.metafields.custom.norticam_specs.type == 'json' and n_specs.version == 1 %}${value}${output}{% else %}${fallback}{% endif %}{% endcapture %}{% assign n_fact_content = n_fact_content | strip %}`;
    return content + `{% if n_fact_content != blank %}${row.replace('__N_FACT__', '{{ n_fact_content }}')}{% endif %}`;
  };
  // React omits unknown rows. Generate all supported bindings nevertheless so a
  // newly supplied Shopify fact appears immediately, without rebuilding GitHub.
  if (/<tbody\b[^>]*data-product-facts/.test(html)) {
    return html.replace(/(<tbody\b[^>]*data-product-facts[^>]*>)([\s\S]*?)<\/tbody>/g, (_, tag, rows) => {
      const fallback = new Map([...rows.matchAll(/<td\b[^>]*data-product-fact="(\w+)"[^>]*>([\s\S]*?)<\/td>/g)].map(m => [m[1], m[2]]));
      return tag + setup + Object.entries(labels).map(([key, label]) => bind(key, fallback.get(key) || '', `<tr class="border-b last:border-0"><th scope="row" class="w-1/3 bg-slate-50 p-4 text-sm">${label}</th><td data-product-fact="${key}" class="p-4 text-sm leading-6 text-slate-600">__N_FACT__</td></tr>`)).join('') + '</tbody>';
    });
  }
  // Also supports the small binding fixtures used by the native offer tests.
  return setup + html.replace(/(<td\b[^>]*data-product-fact="(\w+)"[^>]*>)([\s\S]*?)<\/td>/g, (_, tag, key, fallback) => bind(key, fallback, tag + '__N_FACT__</td>'));
}
