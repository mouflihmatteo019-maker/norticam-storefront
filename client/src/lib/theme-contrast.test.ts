import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
function luminance(hex: string) {
  const c = hex.match(/.{2}/g)!.map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return c[0] * .2126 + c[1] * .7152 + c[2] * .0722;
}
function contrast(a: string, b: string) {
  return (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
}
describe('audited storefront text contrast', () => {
  it('keeps small light-background labels above 4.5:1', () => {
    const css = readFileSync('client/src/index.css', 'utf8');
    const eyebrow = css.match(/^\.eyebrow \{[^}]*color: #([a-f0-9]{6});/m)![1];
    const copy = css.match(/\.section-copy \{[^}]*color: #([a-f0-9]{6});/)![1];
    for (const background of ['ffffff', 'f7faff', 'eff6ff', 'eaf3ff']) {
      expect(contrast(eyebrow, background)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(copy, background)).toBeGreaterThanOrEqual(4.5);
    }
  });
  it('keeps the hero primary button and footer links legible', () => {
    const home = readFileSync('client/src/pages/ConversionHome.tsx', 'utf8');
    expect(home).toContain('bg-[#1267c4]');
    expect(contrast('ffffff', '1267c4')).toBeGreaterThanOrEqual(4.5);
    expect(contrast('94a3b8', '020617')).toBeGreaterThanOrEqual(4.5);
    expect(readFileSync('client/src/components/StorefrontLayout.tsx', 'utf8')).toContain('text-slate-400');
  });
});
