import { z } from 'zod';

const plainText = z.string().trim().min(1).max(500).refine(value => !/[<>]/.test(value));
const factFields = {
  resolution: plainText.optional(), coverage: plainText.optional(), gps: plainText.optional(),
  wifi: plainText.optional(), parking: plainText.optional(), night: plainText.optional(),
  storage: plainText.optional(), sensor: plainText.optional(), imageProcessing: plainText.optional(),
  power: plainText.optional(), protection: plainText.optional(), loop: plainText.optional(),
  rotation: plainText.optional(), carplay: plainText.optional(),
};
const capability = z.boolean().nullable().optional();
const specsSchema = z.object({
  version: z.literal(1),
  vehicle: z.enum(['voiture', 'moto']).optional(),
  mount: z.enum(['helmet', 'vehicle']).optional(),
  facts: z.object(factFields).optional(),
  capabilities: z.object({ dual: capability, gps: capability, wifi: capability, parking: capability, night: capability, loop: capability, rotation: capability, carplay: capability }).optional(),
  details: z.array(plainText).max(30).optional(),
  kit: z.array(plainText).max(20).optional(),
});

export type ProductSpecs = z.infer<typeof specsSchema>;
export type ProductCapability = keyof NonNullable<ProductSpecs['capabilities']>;
export const PRODUCT_SPECS_NAMESPACE = 'custom';
export const PRODUCT_SPECS_KEY = 'norticam_specs';

/** Accept native Liquid JSON or the Storefront metafield envelope, never HTML or commercial overrides. */
export function parseProductSpecs(input: unknown): ProductSpecs | undefined {
  let value = input;
  if (value && typeof value === 'object' && 'value' in value) {
    const metafield = value as { type?: unknown; value?: unknown };
    if (metafield.type !== 'json' || typeof metafield.value !== 'string' || metafield.value.length > 16000) return undefined;
    try { value = JSON.parse(metafield.value); } catch { return undefined; }
  }
  const result = specsSchema.safeParse(value);
  return result.success ? result.data : undefined;
}

const capabilityPatterns: [ProductCapability, RegExp][] = [
  ['dual', /avant.*arri[eè]re|double cam[eé]ra/i], ['gps', /\bGPS\b/i], ['wifi', /Wi[- ]?Fi/i],
  ['parking', /parking|stationnement/i], ['night', /nocturne|NightVIS|faible luminosit[eé]/i], ['loop', /boucle/i],
  ['rotation', /360|orientable|rotati(?:ve|on)/i], ['carplay', /CarPlay/i],
];

/** A structured record is authoritative; omitted facts do not restore an old catalogue snapshot. */
export function structuredProductDetails(specs: ProductSpecs): string[] {
  const facts = Object.entries(specs.facts || {}).filter(([key]) =>
    !['gps', 'wifi', 'parking', 'night', 'loop', 'rotation', 'carplay'].includes(key) || specs.capabilities?.[key as ProductCapability] === true,
  ).map(([, value]) => value);
  const details = (specs.details || []).filter(text => capabilityPatterns.every(([key, pattern]) =>
    !pattern.test(text) || specs.capabilities?.[key] === true,
  ));
  const safeFacts = facts.filter(text => capabilityPatterns.every(([key, pattern]) =>
    !pattern.test(text) || specs.capabilities?.[key] === true,
  ));
  return Array.from(new Set([...safeFacts, ...details, ...(specs.kit || [])]));
}
