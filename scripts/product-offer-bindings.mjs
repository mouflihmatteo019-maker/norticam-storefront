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
  const defaults = {
    resolution: 'Non précisée', coverage: 'Voir la configuration du modèle',
    wifi: 'Non précisé', gps: 'Non précisé', night: 'Non précisée',
    parking: 'Non documenté pour ce modèle', storage: 'Capacité et carte incluse à confirmer',
    sensor: 'Capteur non précisé', imageProcessing: 'Traitement non précisé',
    power: 'Alimentation à confirmer dans la notice', protection: 'Indice de protection non précisé',
    loop: 'Non précisé dans le catalogue',
  };
  const positive = {
    wifi: 'Wi-Fi documenté', gps: 'GPS documenté', night: 'Fonction nocturne documentée',
    parking: 'Mode parking documenté : vérifiez les réglages et l’alimentation dans la notice',
    loop: 'Enregistrement en boucle',
  };
  return html.replace(/(<td\b[^>]*data-product-fact="(\w+)"[^>]*>)([\s\S]*?)<\/td>/g, (_, tag, key, fallback) => {
    if (!(key in defaults)) throw new Error(`Unknown product fact: ${key}`);
    const fact = `n_specs.facts.${key}`;
    let content = `{{ ${fact} | default: '${defaults[key]}' | escape }}`;
    if (key in positive) {
      const cap = `n_specs.capabilities.${key}`;
      content = `{% if ${cap} == false %}Non{% if ${fact} != blank %} — {{ ${fact} | escape }}{% endif %}{% elsif ${cap} == true %}{{ ${fact} | default: '${positive[key]}' | escape }}{% else %}${defaults[key]}{% endif %}`;
    }
    return `${tag}{% assign n_specs = product.metafields.custom.norticam_specs.value %}{% if product.metafields.custom.norticam_specs.type == 'json' and n_specs.version == 1 %}${content}{% else %}${fallback}{% endif %}</td>`;
  });
}
