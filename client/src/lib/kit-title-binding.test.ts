import { describe, expect, it } from 'vitest';
// @ts-expect-error plain ESM build helper without type declarations
import { bindKitTitle, LIVE_KIT_TITLE } from '../../../scripts/kit-title-binding.mjs';

describe('bindKitTitle', () => {
  const block = (title: string) => `<div class="rounded-2xl bg-slate-50 p-6"><h3 data-loc="x" class="text-xl font-bold">Votre kit : ce qui est documenté</h3><p data-loc="y" class="mt-4 leading-7">${title}</p><ul class="mt-4"></ul></div>`;

  it('replaces a frozen supplier variant title with the live Shopify variant', () => {
    const html = bindKitTitle(block('X800 Front Cam / China Mainland / No TF Card'));
    expect(html).not.toContain('China Mainland');
    expect(html).toContain(LIVE_KIT_TITLE);
    expect(html).toContain('<ul class="mt-4">');
  });

  it('keeps the standard-configuration wording for single-variant products', () => {
    expect(bindKitTitle(block('Configuration standard du catalogue'))).toContain("== 'Default Title' %}Configuration standard du catalogue");
  });

  it('leaves unrelated markup untouched', () => {
    const other = '<h3>Autre titre</h3><p>Texte</p>';
    expect(bindKitTitle(other)).toBe(other);
  });
});
