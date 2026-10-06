import type { Product } from './store-data';
import { products as editorialProducts } from './store-data';
import type { StoreProduct } from './shopify';
import type { ProductCapability } from './product-specs';
// Explicit mounting classification: mentioning "sans caméra sur le casque" is not a helmet mount.
export function isHelmetCamera(product: Product) {
  if (product.specs) return product.specs.mount === 'helmet';
  const handle = editorialProducts.find(p => p.id === product.id)?.handle || product.handle;
  return ['camera-casque-moto-4k', 'dashcam-moto-casque', 'dashcam-moto-sans-fil', 'dashcam-moto-360'].includes(handle);
}
// Extract only explicitly stated catalogue facts; absence is never treated as "No".
export function productFacts(product: Product) {
  const text = product.details.join(' ');
  const find = (pattern: RegExp) => product.details.find(d => pattern.test(d));
  const capabilityFact = (pattern: RegExp, negative: RegExp, unknown: string) => {
    const value = find(pattern);
    return !value ? unknown : negative.test(value) ? `Non — ${value}` : value;
  };
  const fallback = {
    resolution: text.match(/(?:4K|3K|2K|1080p|1296p|1440p)/i)?.[0] || 'Non précisée',
    coverage: find(/caméra arrière incluse|double enregistrement|caméra avant.*caméra arrière|DVR double caméra/i) || find(/double canal|seconde caméra|avant.*arrière/i) || 'Voir la configuration du modèle',
    gps: capabilityFact(/GPS/i, /sans GPS|pas de GPS|GPS (?:non|absent)/i, 'Non précisé'),
    wifi: capabilityFact(/Wi[- ]?Fi/i, /sans Wi[- ]?Fi|pas de Wi[- ]?Fi|Wi[- ]?Fi (?:non|absent)/i, 'Non précisé'),
    parking: capabilityFact(/parking|stationnement/i, /sans mode parking|pas de mode parking|mode parking (?:non disponible|absent)/i, 'Non documenté pour ce modèle'),
    night: capabilityFact(/nocturne|NightVIS|faible luminosité/i, /sans vision nocturne|vision nocturne (?:non|absente)|pas de vision nocturne/i, 'Non précisée'),
    storage: find(/microSD|carte mémoire/i) || 'Capacité et carte incluse à confirmer',
    sensor: find(/IMX\d+|STARVIS|capteur/i) || 'Capteur non précisé',
    imageProcessing: find(/HDR|NightVIS|infrarouge|stabilis/i) || 'Traitement non précisé',
    power: find(/batterie|USB-C|faisceau|ACC|alimentation/i) || 'Alimentation à confirmer dans la notice',
    protection: find(/IP\d{2}/i) || 'Indice de protection non précisé',
    loop: find(/boucle/i) || 'Non précisé dans le catalogue',
    rotation: capabilityFact(/360|orientable|rotati(?:ve|on)/i, /sans rotation|rotation (?:non|absente)|non orientable/i, 'Non précisée'),
    carplay: capabilityFact(/CarPlay/i, /sans CarPlay|pas de CarPlay|CarPlay (?:non|absent)/i, 'Non précisé'),
    vehicle: /moto/i.test(product.productType) ? 'moto' : /voiture/i.test(product.productType) ? 'voiture' : 'non précisé',
    dual: product.details.some(detail => /caméra arrière incluse|double enregistrement|caméra avant.*caméra arrière|DVR double caméra|deux caméras.*avant\/arrière/i.test(detail) && !/sans caméra arrière|pas de caméra arrière|caméra arrière non incluse/i.test(detail)),
  };
  const specs = product.specs;
  if (!specs) return fallback;
  const documented = (key: ProductCapability, unknown: string, yes: string) => {
    const state = specs.capabilities?.[key];
    const label = key === 'dual' ? specs.facts?.coverage : specs.facts?.[key];
    if (state === false) return label ? `Non — ${label}` : 'Non';
    if (state !== true) return unknown;
    return label || yes || unknown;
  };
  return {
    resolution: specs.facts?.resolution || 'Non précisée',
    coverage: specs.facts?.coverage || 'Voir la configuration du modèle',
    gps: documented('gps', 'Non précisé', 'GPS documenté'),
    wifi: documented('wifi', 'Non précisé', 'Wi-Fi documenté'),
    parking: documented('parking', 'Non documenté pour ce modèle', 'Mode parking documenté : vérifiez les réglages et l’alimentation dans la notice'),
    night: documented('night', 'Non précisée', 'Fonction nocturne documentée'),
    storage: specs.facts?.storage || 'Capacité et carte incluse à confirmer',
    sensor: specs.facts?.sensor || 'Capteur non précisé',
    imageProcessing: specs.facts?.imageProcessing || 'Traitement non précisé',
    power: specs.facts?.power || 'Alimentation à confirmer dans la notice',
    protection: specs.facts?.protection || 'Indice de protection non précisé',
    loop: documented('loop', 'Non précisé dans le catalogue', 'Enregistrement en boucle'),
    rotation: documented('rotation', 'Non précisée', 'Caméra orientable documentée ; rotation ne signifie pas capture panoramique simultanée'),
    carplay: documented('carplay', 'Non précisé', 'Compatibilité CarPlay documentée : vérifiez l’équipement et le mode d’utilisation'),
    vehicle: specs.vehicle || fallback.vehicle,
    dual: specs.capabilities?.dual === true,
  };
}
export type QuizAnswers = { vehicle: string; coverage: string; priority: string; parking: string; budget: string };
export function recommend(products: StoreProduct[], answers: QuizAnswers) {
  const budget = Number(answers.budget);
  return products.filter(p => p.verified && p.available && p.type === 'Dashcam' && productFacts(p).vehicle === answers.vehicle && p.price <= budget && p.currency === 'EUR').map(product => {
    const f = productFacts(product); let score = 0; const reasons = [answers.vehicle === 'moto' ? 'Une configuration pour vos trajets à moto.' : 'Une dashcam conçue pour la voiture.', 'Dans le budget que vous avez indiqué.'];
    if (answers.coverage === 'dual') { if (!f.dual) return null; score += 4; reasons.push('Le catalogue décrit une configuration avant et arrière.'); }
    if (answers.coverage === 'helmet') { if (!isHelmetCamera(product)) return null; score += 4; reasons.push('Un format qui suit le pilote sur son casque.'); }
    if (answers.parking === 'yes') { if (f.parking.startsWith('Non')) return null; score += 3; reasons.push(f.parking); }
    if (answers.priority === 'detail' && /4K|3K/i.test(f.resolution)) { score += 3; reasons.push('Une définition élevée pour conserver davantage de détails.'); }
    if (answers.priority === 'discreet' && /mini|compact|discr/i.test(product.title)) { score += 3; reasons.push('Un format compact pour une installation discrète.'); }
    if (answers.priority === 'night') { if (f.night.startsWith('Non')) return null; score += 3; reasons.push(f.night); }
    return { product, score, reasons };
  }).filter((r): r is NonNullable<typeof r> => !!r).sort((a,b) => b.score - a.score || a.product.price - b.product.price).slice(0,3);
}
