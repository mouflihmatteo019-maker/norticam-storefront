import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { parseHTML } from 'linkedom';
import { ProductGallery, galleryIndex } from './ProductGallery';
import { products } from '@/lib/store-data';
import type { StoreProduct } from '@/lib/shopify';

describe('native swipe gallery',()=>{
  it.each([[0,400,4,0],[215,400,4,1],[800,400,4,2],[-40,400,4,0],[9999,400,4,3],[0,0,4,0]])('resolves scroll %s safely',(offset,width,count,index)=>{
    expect(galleryIndex(offset,width,count)).toBe(index);
  });
  it('keeps native scrolling, keyboard controls, meaningful alt and just one eager image',()=>{
    const product=products[0] as StoreProduct;
    const images=[{url:'https://cdn.shopify.com/first.jpg',altText:'Caméra vue avant'},{url:'https://cdn.shopify.com/second.jpg',altText:'Caméra vue arrière'}];
    const {document}=parseHTML(renderToStaticMarkup(createElement(ProductGallery,{product,images})));
    const track=document.querySelector('[data-product-gallery]')!;
    expect(track.getAttribute('class')).toContain('overflow-x-auto');
    expect(track.getAttribute('class')).toContain('snap-mandatory');
    expect(track.getAttribute('tabindex')).toBe('0');
    expect(track.querySelectorAll('[aria-roledescription="diapositive"]').length).toBe(2);
    expect(track.querySelectorAll('img[loading="eager"]').length).toBe(1);
    expect(track.querySelectorAll('img[loading="lazy"]').length).toBe(1);
    expect(document.querySelector('[aria-label="Photo précédente"]')?.hasAttribute('disabled')).toBe(true);
    expect(document.querySelector('[aria-label="Photo suivante"]')?.hasAttribute('disabled')).toBe(false);
  });
  it('does not show unusable navigation on a one-photo product',()=>{
    const {document}=parseHTML(renderToStaticMarkup(createElement(ProductGallery,{product:products[0] as StoreProduct,images:[{url:'https://cdn.shopify.com/one.jpg'}]})));
    expect(document.querySelector('[aria-label="Photo suivante"]')).toBe(null);
  });
});
