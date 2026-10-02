import { describe, expect, it } from 'vitest';
import { productImageAlt } from './image-alt';
import { products } from './store-data';
import { bindProductImages } from '../../../scripts/image-bindings.mjs';
import { Liquid } from 'liquidjs';
import { approvedProductMedia } from './media-policy';

describe('descriptive image text and live Shopify bindings', () => {
  it('excludes unverified testimonial graphics for all visitors', () => {
    expect(approvedProductMedia({url:'https://cdn.shopify.com/files/oQGjFFpAKYhpWXIF.webp?v=1',altText:null})).toBe(false);
    expect(approvedProductMedia({url:'/new.webp',altText:'Gabarit de témoignage client'})).toBe(false);
    expect(approvedProductMedia({url:'/camera.webp',altText:'70mai A510, caméra avant et arrière'})).toBe(true);
  });
  it('keeps authored image descriptions instead of stuffing keywords', () => {
    expect(productImageAlt(products[0], '  FX60C, vue du support  ')).toBe('FX60C, vue du support');
    for (const alt of ['', 'image', 'IMG_123', 'https://example.com/image.webp']) expect(productImageAlt(products[0],alt)).toBe(products[0].title);
  });
  it('binds ALT and responsive sources to live Shopify images with safe escaping', async () => {
    const p = { ...products[0], images: [{ url: 'https://cdn.shopify.com/test.webp?v=1' }] };
    const html = bindProductImages('<img src="https://cdn.shopify.com/test.webp?v=1&amp;width=800" srcSet="https://cdn.shopify.com/test.webp?width=320 320w, https://cdn.shopify.com/test.webp?width=800 800w" alt="Old" loading="lazy">',[p]);
    expect(html).toContain('n_product_0.images[0].alt');
    expect(html).toContain('width: 320');
    const engine = new Liquid(); engine.registerFilter('image_url',(image,args)=>image.src+'?width='+args[1]);
    const rendered = await engine.parseAndRender(html, {n_product_0:{ title:'Current title',images:[{src:'/current.webp',alt:'Support & caméra'}] }});
    expect(rendered).toContain('alt="Support &amp; caméra"');
    expect(rendered).toContain('/current.webp?width=800');
    expect(rendered).toContain('loading="lazy"');
    expect(await engine.parseAndRender(html,{n_product_0:{title:'Fallback title',images:[{src:'/current.webp',alt:''}]}})).toContain('alt="Fallback title"');
  });
  it('preserves deliberately decorative images and unrelated content', () => {
    const html='<img src="https://cdn.shopify.com/test.webp" alt=""><img src="/logo.png" alt="">';
    const result=bindProductImages(html,[{...products[0],images:[{url:'https://cdn.shopify.com/test.webp'}]}]);
    expect(result.match(/alt=""/g)).toHaveLength(2);
    expect(result).toContain('<img src="/logo.png" alt="">');
  });
});
