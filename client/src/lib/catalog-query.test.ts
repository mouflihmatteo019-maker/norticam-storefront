import { describe, expect, it } from 'vitest';
import { catalogProductFields } from './shopify';
describe('catalogue with tokenless and scoped public access', () => {
  it('keeps native prices, availability and variants without requesting forbidden metafields', () => {
    const fields = catalogProductFields(false);
    expect(fields).not.toContain('metafield(');
    expect(fields).toContain('availableForSale');
    expect(fields).toContain('price { amount currencyCode }');
    expect(fields).toContain('pageInfo { hasNextPage endCursor }');
  });
  it('adds the optional structured source only with scoped token access', () => {
    expect(catalogProductFields(true)).toContain('norticamSpecs: metafield(namespace: "custom", key: "norticam_specs") { type value }');
  });
});
