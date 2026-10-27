/** Editorial omission rules, applied equally to customer, SEO and structured-data copy.
 * This is not an HTML sanitizer: Shopify remains the trusted rich-text source.
 */
const uncertainty = [
  'non précisé', 'non precise', 'non documenté', 'non documente', 'non communiqué',
  'non communique', 'non renseigné', 'non renseigne', 'à confirmer', 'a confirmer',
  'faites confirmer', 'demandez-nous confirmation', 'génération livrée', 'generation livree',
  'version livrée', 'version livree', 'référence livrée', 'reference livree',
  'selon la version', 'selon version', 'de la version proposée', 'selon la génération', 'selon la generation',
  'd6wl ou d6rl', 'd6wl/d6rl', 'd6wl / d6rl', 'd6wl d6rl', 'confirmez le nombre de caméras',
  'confirmez le nombre de cameras', 'confirmer le nombre de caméras',
  'vérifiez le nombre de caméras', 'vérifiez le nombre de canaux',
  'confirmer les accessoires', 'accessoires inclus à vérifier',
  'vérifiez la référence exacte', 'vérifiez la référence d6wl',
  'les accessoires inclus et les capacités de la caméra arrière doivent être vérifiés',
];
const a210UnreviewedClaims = ['wi-fi 6', 'wi‑fi 6', 'supercondensateur', 'fonctions gps', 'gps intégré'];

const separator = '\u241eNORTICAM_SENTENCE\u241e';
const blockMarker = '\u241eNORTICAM_BLOCK\u241e';
const blockTags = ['p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'td', 'th', 'blockquote'];

function plainText(html: string): string {
  return html.replace(/<\/(?:p|li|h[1-6]|td|th|blockquote)>/g, ' ')
    .replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '')
    .replace(/&nbsp;|&#160;/g, ' ').trim();
}

/** Omit unknown statements; do not turn conditional/safety statements into promises. */
export function cleanProductDescriptionText(text: string, productId?: string | number): string {
  const sentences = plainText(text)
    .replace(/([.!?;])\s+/g, `$1${separator}`)
    .replace(/[\r\n]+/g, separator)
    .split(separator)
    .map(sentence => sentence.trim())
    .filter(Boolean);
  return sentences.filter(sentence => {
    const comparable = sentence.toLocaleLowerCase('fr');
    const modelRules = String(productId ?? '').split('/').pop() === '16413273293149' ? a210UnreviewedClaims : [];
    return ![...uncertainty, ...modelRules].some(phrase => comparable.includes(phrase));
  }).join(' ');
}

/** Remove only the ambiguous model alternative, preserving the brand and product title. */
export function cleanProductTitle(title: string): string {
  return title.replace(/D6WL(?:\s*(?:\/|ou)\s*|\s+)D6RL/gi, '').replace(/\s{2,}/g, ' ').trim();
}

/** Preserve unchanged rich text; only rebuilt blocks lose their inline emphasis. */
export function cleanProductDescriptionHtml(html: string, productId?: string | number): string {
  let source = html;
  for (const tag of blockTags) {
    source = source.replaceAll(`<${tag}>`, `${blockMarker}<${tag}>`)
      .replaceAll(`<${tag} `, `${blockMarker}<${tag} `);
  }
  let result = '';
  let pendingHeading = '';
  for (const part of source.split(blockMarker)) {
    const match = part.match(/^<(p|li|h[1-6]|td|th|blockquote)(?:\s[^>]*)?>/);
    if (!match) { result += part; continue; }
    const opening = match[0];
    const tag = match[1];
    const closing = `</${tag}>`;
    const closeIndex = part.indexOf(closing, opening.length);
    if (closeIndex < 0) { result += part; continue; }
    const inner = part.slice(opening.length, closeIndex);
    const tail = part.slice(closeIndex + closing.length);
    const originalText = plainText(inner);
    const cleanText = cleanProductDescriptionText(inner, productId);
    let block = '';
    if (cleanText) {
      block = cleanText === originalText
        ? `${opening}${inner}${closing}`
        : `${opening}${cleanText.replaceAll('<', '&lt;').replaceAll('>', '&gt;')}${closing}`;
    }
    if (/^h[1-6]$/.test(tag)) {
      pendingHeading = block + tail;
    } else {
      if (block) {
        result += pendingHeading + block + tail;
        pendingHeading = '';
      } else if (pendingHeading) {
        pendingHeading += tail;
      } else {
        result += tail;
      }
    }
  }
  // An all-omitted list has no customer-facing content.
  return result.replace(/<(ul|ol)(?:\s[^>]*)?>\s*<\/\1>/g, '').trim();
}
