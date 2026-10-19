import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { Liquid } from 'liquidjs';
import { parseHTML } from 'linkedom';
import { heroImagePreload } from '../../../scripts/hero-preload.mjs';

const cdn = 'https://norticam.com/cdn/shop/t/1/assets/';
const engine = new Liquid({ jsTruthy: false });
engine.registerFilter('asset_url', name => `${cdn}${name}?v=1792400000`);
// Shopify's doc block is documentation-only and is not implemented by LiquidJS.
const hints = async () => (await readFile('snippets/norticam-performance-hints.liquid', 'utf8')).replace(/{% doc %}[\s\S]*?{% enddoc %}/g, '');
// LinkeDOM preserves React's srcSet casing, unlike an HTML browser parser.
const htmlAttribute = (element: Element, name: string) => [...element.attributes].find(attribute => attribute.name.toLowerCase() === name.toLowerCase())?.value ?? null;

describe('native theme resource discovery', () => {
  it.each(['/', '/produits/dashcam-3k-voiture', '/dashcam-voiture', '/__native__'])(
    'preloads the identical queryless runtime imported by the loader: %s', async route => {
      const loader = await readFile('assets/norticam-app.js', 'utf8');
      const runtimeImport = loader.match(/import "(\.\/norticam-runtime-[\w-]+\.js)"/)?.[1];
      expect(runtimeImport).toBeTruthy();
      const { document } = parseHTML(await engine.parseAndRender(await hints(), { n_route: route }));
      const preload = document.querySelector('link[rel="modulepreload"]');
      expect(preload?.getAttribute('href')).toBe(new URL(runtimeImport!, `${cdn}norticam-app.js?v=1792400000`).href);
      expect(preload?.getAttribute('href')).not.toContain('?v=');
      expect(preload?.getAttribute('fetchpriority')).toBe('low');
      expect(document.querySelectorAll('link[rel="modulepreload"]').length).toBe(1);
      expect(document.querySelector('link[rel="preconnect"]') !== null).toBe(route === '/');
      const imagePreloads = document.querySelectorAll('link[rel="preload"][as="image"]');
      expect(imagePreloads.length).toBe(route === '/' ? 1 : 0);
      if (route === '/') {
        const { document: home } = parseHTML(await readFile('snippets/norticam-view-0.liquid', 'utf8'));
        const image = home.querySelector('.norticam-road-hero__image')!;
        expect(imagePreloads[0].getAttribute('href')).toBe(image.getAttribute('src'));
        expect(imagePreloads[0].getAttribute('imagesrcset')).toBe(htmlAttribute(image, 'srcset'));
        expect(imagePreloads[0].getAttribute('imagesizes')).toBe(image.getAttribute('sizes'));
        expect(imagePreloads[0].getAttribute('fetchpriority')).toBe('high');
      }
    },
  );

  it('does not download the interactive runtime for a non-interactive 404', async () => {
    const { document } = parseHTML(await engine.parseAndRender(await hints(), { n_route: '/__not-found__' }));
    expect(document.querySelector('link')).toBeNull();
  });

  it('copies the hero candidates and media sizes without changing encoding or mobile breakpoints', () => {
    const markup = '<img class="norticam-road-hero__image" src="https://cdn.shopify.com/hero.png?v=2&amp;width=1600" srcSet="https://cdn.shopify.com/hero.png?v=2&amp;width=480 480w, https://cdn.shopify.com/hero.png?v=2&amp;width=1600 1600w" sizes="(max-width:640px) 100vw, 1280px" alt=""/>';
    const { document } = parseHTML(markup + heroImagePreload(markup));
    const image = document.querySelector('img')!, preload = document.querySelector('link')!;
    expect(preload.getAttribute('href')).toBe(image.getAttribute('src'));
    expect(preload.getAttribute('imagesrcset')).toBe(htmlAttribute(image, 'srcset'));
    expect(preload.getAttribute('imagesizes')).toBe(image.getAttribute('sizes'));
    expect(preload.hasAttribute('crossorigin')).toBe(false);
  });

  it.each([
    '',
    '<img class="norticam-road-hero__image" src="/hero.jpg">',
    '<img class="norticam-road-hero__image"><img class="norticam-road-hero__image">',
  ])('fails the build instead of guessing a missing or ambiguous hero: %s', markup => {
    expect(() => heroImagePreload(markup)).toThrow();
  });

  it('keeps the early hint in generated and source layouts without an extra script', async () => {
    const source = await readFile('scripts/build-shopify-theme.mjs', 'utf8');
    const layout = await readFile('layout/theme.liquid', 'utf8');
    const marker = "{% render 'norticam-performance-hints', n_route: n_route %}";
    expect(source).toContain(marker);
    expect(source).toContain("await write('snippets/norticam-performance-hints.liquid'");
    expect(layout.indexOf(marker)).toBeLessThan(layout.indexOf("{% render 'norticam-fonts' %}"));
    expect(layout.match(/src="{{ 'norticam-app.js' \| asset_url }}"/g)?.length).toBe(1);
  });
});
