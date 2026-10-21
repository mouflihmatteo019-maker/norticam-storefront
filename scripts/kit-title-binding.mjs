// Binds the "Votre kit : ce qui est documenté" variant line to the live Shopify variant.
// Without it, the build would freeze the first variant title of the catalogue snapshot
// (e.g. supplier labels that no longer exist) in the server-rendered HTML.
export const LIVE_KIT_TITLE = "{% if product.selected_or_first_available_variant.title == 'Default Title' %}Configuration standard du catalogue{% else %}{{ product.selected_or_first_available_variant.title | escape }}{% endif %}";

export function bindKitTitle(html) {
  return html.replace(
    /(<h3\b[^>]*>\s*Votre kit : ce qui est documenté\s*<\/h3>\s*<p\b[^>]*>)[^<]*(<\/p>)/,
    `$1${LIVE_KIT_TITLE}$2`,
  );
}
