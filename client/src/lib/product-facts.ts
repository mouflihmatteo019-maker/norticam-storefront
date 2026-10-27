import type { Product } from './store-data';
import { products as editorialProducts } from './store-data';
import type { StoreProduct } from './shopify';
import type { ProductCapability } from './product-specs';
import { isEstablishedProductFact, structuredProductDetails } from './product-specs';
// Explicit mounting classification: mentioning "sans caméra sur le casque" is not a helmet mount.
export function isHelmetCamera(product: Product) {
  if (product.specs) return product.specs.mount === 'helmet';
  const handle = editorialProducts.find(p => p.id === product.id)?.handle || product.handle;
  return ['camera-casque-moto-4k', 'dashcam-moto-casque', 'dashcam-moto-sans-fil', 'dashcam-moto-360'].includes(handle);
}
// Extract only explicitly stated catalogue facts; absence is never treated as "No".
export function productFacts(product: Product) {
  const details = product.details.filter(isEstablishedProductFact);
  const text = details.join(' ');
  const find = (pattern: RegExp) => details.find(d => pattern.test(d));
  const capabilityFact = (pattern: RegExp, negative: RegExp) => {
    const value = find(pattern);
    return !value ? '' : negative.test(value) ? `Non — ${value}` : value;
  };
  const fallback = {
    resolution: text.match(/\b\d{3,4}\s*[×x]\s*\d{3,4}\b/i)?.[0] || text.match(/(?:4K|3K|2K|1080p|1296p|1440p)/i)?.[0] || '',
    coverage: find(/caméra arrière incluse|double enregistrement|caméra avant.*caméra arrière|DVR double caméra/i) || find(/double canal|seconde caméra|avant.*arrière/i) || '',
    gps: capabilityFact(/GPS/i, /sans GPS|pas de GPS|GPS (?:non|absent)/i),
    wifi: capabilityFact(/Wi[- ]?Fi/i, /sans Wi[- ]?Fi|pas de Wi[- ]?Fi|Wi[- ]?Fi (?:non|absent)/i),
    parking: capabilityFact(/parking|stationnement/i, /sans mode parking|pas de mode parking|mode parking (?:non disponible|absent)/i),
    night: capabilityFact(/nocturne|NightVIS|faible luminosité/i, /sans vision nocturne|vision nocturne (?:non|absente)|pas de vision nocturne/i),
    storage: find(/microSD|carte mémoire/i) || '',
    sensor: find(/IMX\d+|STARVIS|capteur/i) || '',
    imageProcessing: find(/HDR|NightVIS|infrarouge|stabilis/i) || '',
    power: find(/batterie|USB-C|faisceau|\bACC(?![\p{L}\p{N}_])|alimentation/iu) || '',
    protection: find(/IP\d{2}/i) || '',
    loop: find(/boucle/i) || '',
    rotation: capabilityFact(/360|orientable|rotati(?:ve|on)/i, /sans rotation|rotation (?:non|absente)|non orientable/i),
    carplay: capabilityFact(/CarPlay/i, /sans CarPlay|pas de CarPlay|CarPlay (?:non|absent)/i),
    vehicle: /moto/i.test(product.productType) ? 'moto' : /voiture/i.test(product.productType) ? 'voiture' : '',
    dual: details.some(detail => /caméra arrière incluse|double enregistrement|caméra avant.*caméra arrière|DVR double caméra|deux caméras.*avant\/arrière/i.test(detail) && !/sans caméra arrière|pas de caméra arrière|caméra arrière non incluse/i.test(detail)),
  };
  const specs = product.specs;
  if (!specs) return fallback;
  // Reuse only the current, capability-filtered Shopify record, never old catalogue
  // details. A sensor or HDR can already be stated in the night/resolution fact.
  const currentDetails = structuredProductDetails(specs);
  const currentFact = (pattern: RegExp) => currentDetails.find(detail => pattern.test(detail));
  const field = (value: unknown) => isEstablishedProductFact(value) ? value : '';
  const documented = (key: ProductCapability, yes: string) => {
    const state = specs.capabilities?.[key];
    const rawLabel = key === 'dual' ? specs.facts?.coverage : specs.facts?.[key];
    const label = field(rawLabel);
    if (state === false) return label ? `Non — ${label}` : 'Non';
    if (state !== true) return '';
    // A supplied but uncertain label cannot establish a product specification.
    if (rawLabel && !label) return '';
    return label || yes;
  };
  return {
    resolution: field(specs.facts?.resolution),
    coverage: field(specs.facts?.coverage),
    gps: documented('gps', 'GPS intégré'),
    wifi: documented('wifi', 'Wi-Fi'),
    parking: documented('parking', 'Mode parking avec alimentation compatible'),
    night: documented('night', 'Fonction nocturne'),
    storage: field(specs.facts?.storage),
    sensor: specs.facts?.sensor !== undefined ? field(specs.facts.sensor) : currentFact(/IMX\d+|STARVIS|capteur/i) || '',
    imageProcessing: specs.facts?.imageProcessing !== undefined ? field(specs.facts.imageProcessing) : currentFact(/\bHDR\b|NightVIS|infrarouge|stabilis/i) || '',
    power: field(specs.facts?.power),
    protection: field(specs.facts?.protection),
    loop: documented('loop', 'Enregistrement en boucle'),
    rotation: documented('rotation', 'Caméra orientable ; rotation ne signifie pas capture panoramique simultanée'),
    carplay: documented('carplay', 'Compatibilité CarPlay'),
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
    if (answers.parking === 'yes') { if (!f.parking || f.parking.startsWith('Non')) return null; score += 3; reasons.push(f.parking); }
    if (answers.priority === 'detail' && /4K|3K/i.test(f.resolution)) { score += 3; reasons.push('Une définition élevée pour conserver davantage de détails.'); }
    if (answers.priority === 'discreet' && /mini|compact|discr/i.test(product.title)) { score += 3; reasons.push('Un format compact pour une installation discrète.'); }
    if (answers.priority === 'night') { if (!f.night || f.night.startsWith('Non')) return null; score += 3; reasons.push(f.night); }
    return { product, score, reasons };
  }).filter((r): r is NonNullable<typeof r> => !!r).sort((a,b) => b.score - a.score || a.product.price - b.product.price).slice(0,3);
}
