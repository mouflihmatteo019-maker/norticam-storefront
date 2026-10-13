import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

describe('historical links retain their specific destination', () => {
  it('exports the editorial and policy redirects found in the October audit', () => {
    const redirects=readFileSync('release/shopify-redirects.csv','utf8');
    for (const [from,to] of [
      ['/conseils/meilleure-dashcam-voiture','/blogs/guides-dashcam/meilleure-dashcam-voiture'],
      ['/pages/politique-expedition','/policies/shipping-policy'],
      ['/pages/politique-de-retour','/policies/refund-policy'],
      ['/pages/politique-remboursement','/policies/refund-policy'],
    ]) {
      expect(redirects).toContain(`${from},${to}\n`);
      expect(redirects).toContain(`${from}/,${to}\n`);
    }
  });
});
