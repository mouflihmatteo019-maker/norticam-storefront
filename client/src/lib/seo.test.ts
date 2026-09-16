import { describe, expect, it } from 'vitest';
import { canonicalPath } from './seo-render';
import { searchGuides } from './search-guides';
import { productFacts, isHelmetCamera, recommend } from './product-facts';
import { products } from './store-data';
describe('SEO URL and editorial integrity', () => {
  it('does not classify a fixed dual kit as a helmet camera because its copy mentions a helmet', () => {
    const fixed = products.find(p=>p.handle==='dashcam-moto-double-camera')!;
    expect(isHelmetCamera(fixed)).toBe(false);
    expect(productFacts(fixed).dual).toBe(true);
    const results = recommend(products.map(p=>({...p,verified:true,currency:'EUR'})),{vehicle:'moto',coverage:'helmet',priority:'value',parking:'no',budget:'250'});
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(r=>isHelmetCamera(r.product))).toBe(true);
  });
  it('shows the explicit night specification before a generic HDR resolution', () => {
    const product = products.find(p => p.handle === 'dashcam-3k-voiture')!;
    expect(productFacts(product).night).toMatch(/nocturne/i);
  });
  it('normalizes only the path and preserves variant, query and anchor', () => {
    expect(canonicalPath('/')).toBe('/');
    expect(canonicalPath('/produits/dashcam-3k-voiture?variant=123#configuration')).toBe('/produits/dashcam-3k-voiture/?variant=123#configuration');
    expect(canonicalPath('/quiz/')).toBe('/quiz/');
  });
  it('publishes distinct substantive guides rather than keyword variants', () => {
    expect(new Set(Object.values(searchGuides).map(g=>g.title)).size).toBe(2);
    for(const guide of Object.values(searchGuides)) {
      expect(guide.sections.length).toBeGreaterThanOrEqual(6);
      expect(guide.sections.map(s=>s[1]).join(' ').split(/\s+/).length).toBeGreaterThan(450);
      expect(guide.cta).toBe('/dashcam-voiture/');
    }
  });
});
