import { describe, expect, it, vi } from 'vitest';
import { prepareHomeIslands } from './home-islands';
import type { ThemeRuntime } from './theme-runtime';
import { readFile } from 'node:fs/promises';

function fixture(missing = '') {
  const slots = Object.fromEntries(['header', 'content', 'footer'].map(name => [name, { replaceChildren: vi.fn() }]));
  const target = { id: '' };
  const root = {
    querySelector: vi.fn((selector: string) => {
      const name = selector.replace('[data-home-', '').replace(']', '');
      return name === missing ? null : slots[name];
    }),
    replaceChildren: vi.fn(), appendChild: vi.fn(),
    ownerDocument: { createElement: vi.fn(() => target) },
  };
  const runtime = { path: '/' } as ThemeRuntime;
  return { slots, root, target, runtime };
}
describe('homepage islands preserve the initial hero', () => {
  it('clears only the three dynamic slots, never the hero/main/root', () => {
    const f = fixture();
    expect(prepareHomeIslands(f.root as unknown as HTMLElement, f.runtime)).toBe(f.target);
    expect(f.root.replaceChildren).not.toHaveBeenCalled();
    expect(f.root.querySelector.mock.calls.flat()).toEqual(['[data-home-header]', '[data-home-content]', '[data-home-footer]']);
    for (const slot of Object.values(f.slots)) expect(slot.replaceChildren).toHaveBeenCalledOnce();
    expect(f.root.appendChild).toHaveBeenCalledWith(f.target);
    expect(f.runtime.homeMounts).toEqual(f.slots);
  });
  it.each(['header', 'content', 'footer'])('keeps existing page untouched if %s slot is absent', missing => {
    const f = fixture(missing);
    expect(prepareHomeIslands(f.root as unknown as HTMLElement, f.runtime)).toBe(f.root);
    for (const slot of Object.values(f.slots)) expect(slot.replaceChildren).not.toHaveBeenCalled();
    expect(f.runtime.homeMounts).toBeUndefined();
  });
  it('does not alter product or other page mounting', () => {
    const f = fixture(); f.runtime.path = '/produits/dashcam-3k-voiture';
    expect(prepareHomeIslands(f.root as unknown as HTMLElement, f.runtime)).toBe(f.root);
    expect(f.root.querySelector).not.toHaveBeenCalled();
  });
  it('compiled hero is outside the replaceable content slot, with unchanged display wrappers', async () => {
    const html = await readFile('snippets/norticam-view-0.liquid', 'utf8');
    expect(html.indexOf('norticam-road-hero')).toBeLessThan(html.indexOf('data-home-content'));
    for (const name of ['header', 'content', 'footer']) expect(html).toContain(`data-home-${name}="true" style="display:contents"`);
    expect(html.match(/id="home-hero-title"/g)).toHaveLength(1);
  });
  it('uses Shopify CDN relative ES modules rather than bundling every page into one script', async () => {
    const config = await readFile('vite.theme.config.ts', 'utf8');
    expect(config).toContain("format: 'es'");
    expect(config).not.toContain('inlineDynamicImports: true');
    const layout = await readFile('layout/theme.liquid', 'utf8');
    expect(layout).toContain('<script type="module" src="');
    expect(layout).toContain('{{ content_for_header }}');
  });
});
