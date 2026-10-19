import { describe, expect, it } from 'vitest';
import { commercialPages } from './commercial-pages';
import { commercialDecisions } from './commercial-decisions';
import { themeCategories, themePath } from './theme-runtime';
import { products } from './store-data';

const moneyRoutes = [
  '/dashcam-voiture',
  '/dashcam-moto',
  '/dashcam-voiture-4k',
  '/dashcam-avant-arriere',
  '/mode-parking',
  '/dashcam-vision-nocturne',
  '/dashcam-gps',
  '/meilleure-dashcam',
];

describe('existing commercial collection buying guidance', () => {
  it('strengthens existing intentions without adding another competing collection', () => {
    expect(Object.keys(commercialPages).sort()).toEqual([
      ...moneyRoutes, '/dashcam-voiture-360', '/ecran-moto-carplay', '/dashcam-moto-casque',
    ].sort());
    const titles = moneyRoutes.map(route => commercialPages[route].title);
    const descriptions = moneyRoutes.map(route => commercialPages[route].description);
    expect(new Set(titles).size).toBe(moneyRoutes.length);
    expect(new Set(descriptions).size).toBe(moneyRoutes.length);
    for (const route of moneyRoutes) {
      const page = commercialPages[route];
      expect(page.criteria).toHaveLength(3);
      expect(page.faq).toHaveLength(5);
      expect(new Set(page.faq.map(([question]) => question)).size).toBe(page.faq.length);
      expect(page.intro.split(/\s+/).length).toBeLessThan(70);
    }
  });

  it('offers contextual, distinct next steps that resolve to existing native destinations', () => {
    const nativeCollections = new Set(themeCategories.map(handle => themePath('/' + handle)));
    const knownUtilities = new Set(['/pages/comparatif']);
    const currentGuide = '/blogs/guides-dashcam/meilleure-dashcam-voiture';
    for (const route of moneyRoutes) {
      const related = commercialPages[route].related!;
      expect(related).toHaveLength(3);
      expect(new Set(related.map(([href]) => href)).size).toBe(related.length);
      for (const [href, label, reason] of related) {
        const native = themePath(href);
        expect(native).not.toBe(themePath(route));
        expect(nativeCollections.has(native) || knownUtilities.has(native) || native === currentGuide).toBe(true);
        expect(label.trim()).not.toBe('');
        expect(reason.trim()).not.toBe('');
      }
    }
    // This guide is a native blog article, not a /pages/conseils-* fallback or a redirect hop.
    expect(commercialPages['/meilleure-dashcam'].related?.at(-1)?.[0]).toBe(currentGuide);
  });

  it('keeps recommendations attached to real existing models without static commerce promises', () => {
    for (const route of moneyRoutes) {
      const picks = commercialDecisions[route].picks;
      expect(picks).toHaveLength(2);
      for (const [handle, reason] of picks) {
        expect(products.some(product => product.handle === handle)).toBe(true);
        expect(reason).not.toMatch(/\d+[,.]\d{2}\s*(?:€|EUR)|en stock|stock limité|livr(?:é|aison) en \d|meilleur prix|achat vérifié/i);
      }
    }
    expect(JSON.stringify(commercialDecisions['/mode-parking'].picks)).not.toContain('48 h');
  });

  it('answers different purchasing objections instead of repeating a generic FAQ', () => {
    const faq = (route: string) => JSON.stringify(commercialPages[route].faq);
    expect(faq('/dashcam-voiture')).toContain('écran');
    expect(faq('/dashcam-moto')).toContain('intercom');
    expect(faq('/dashcam-voiture-4k')).toContain('définition seule');
    expect(faq('/dashcam-avant-arriere')).toContain('caméra de recul');
    expect(faq('/mode-parking')).toContain('alerte à distance');
    expect(faq('/dashcam-vision-nocturne')).toContain('points de vue distincts');
    expect(faq('/dashcam-gps')).toContain('l’export');
    expect(faq('/meilleure-dashcam')).toContain('caractéristiques du catalogue');
  });
});
