import type { Product } from './store-data';
import type { StoreProduct } from './shopify';
// Extract only explicitly stated catalogue facts; absence is never treated as "No".
export function productFacts(product: Product) {
  const text = product.details.join(' ');
  const find = (pattern: RegExp) => product.details.find(d => pattern.test(d));
  return {
    resolution: text.match(/(?:4K|3K|2K|1080p|1296p|1440p)/i)?.[0] || 'Non précisée',
    coverage: find(/caméra arrière incluse|double enregistrement|caméra avant.*caméra arrière|DVR double caméra/i) || find(/double canal|seconde caméra|avant.*arrière/i) || 'Voir la configuration du modèle',
    gps: find(/GPS/i) || 'Non précisé',
    wifi: find(/Wi-Fi/i) || 'Non précisé',
    parking: find(/parking|stationnement/i) || 'Non documenté pour ce modèle',
    night: find(/nocturne|NightVIS|HDR|faible luminosité/i) || 'Non précisée',
    storage: find(/microSD|carte mémoire/i) || 'Capacité et carte incluse à confirmer',
    vehicle: /moto/i.test(product.productType) ? 'moto' : 'voiture',
    dual: /caméra arrière incluse|double enregistrement|caméra avant.*caméra arrière|DVR double caméra/i.test(text),
  };
}
export type QuizAnswers = { vehicle: string; coverage: string; priority: string; parking: string; budget: string };
export function recommend(products: StoreProduct[], answers: QuizAnswers) {
  const budget = Number(answers.budget);
  return products.filter(p => p.verified && p.available && p.type === 'Dashcam' && productFacts(p).vehicle === answers.vehicle && p.price <= budget && p.currency === 'EUR').map(product => {
    const f = productFacts(product); let score = 0; const reasons = [answers.vehicle === 'moto' ? 'Une configuration pour vos trajets à moto.' : 'Une dashcam conçue pour la voiture.', 'Dans le budget que vous avez indiqué.'];
    if (answers.coverage === 'dual') { if (!f.dual) return null; score += 4; reasons.push('Le catalogue décrit une configuration avant et arrière.'); }
    if (answers.coverage === 'helmet') { if (!/casque/i.test(product.description)) return null; score += 4; reasons.push('Un format qui suit le pilote sur son casque.'); }
    if (answers.parking === 'yes') { if (f.parking.startsWith('Non')) return null; score += 3; reasons.push(f.parking); }
    if (answers.priority === 'detail' && /4K|3K/i.test(f.resolution)) { score += 3; reasons.push('Une définition élevée pour conserver davantage de détails.'); }
    if (answers.priority === 'discreet' && /mini|compact|discr/i.test(product.title)) { score += 3; reasons.push('Un format compact pour une installation discrète.'); }
    if (answers.priority === 'night' && !f.night.startsWith('Non')) { score += 3; reasons.push(f.night); }
    return { product, score, reasons };
  }).filter((r): r is NonNullable<typeof r> => !!r).sort((a,b) => b.score - a.score || a.product.price - b.product.price).slice(0,3);
}
