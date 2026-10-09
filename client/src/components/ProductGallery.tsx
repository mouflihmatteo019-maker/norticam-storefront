import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductVisual } from './ProductCard';
import { productImageAlt } from '@/lib/image-alt';
import { imageUrl } from '@/lib/image-url';
import type { StoreProduct } from '@/lib/shopify';

type GalleryImage = { url: string; altText?: string | null };
export function galleryIndex(offset: number, width: number, count: number) {
  return width > 0 ? Math.max(0, Math.min(count - 1, Math.round(offset / width))) : 0;
}

export function ProductGallery({ product, images, selectedImage }: {
  product: StoreProduct; images: GalleryImage[]; selectedImage?: string | null;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const activeIndex = useRef(0);
  const slides = images.length ? images : [{ url: product.image || '', altText: product.imageAlt }];
  function show(next: number, animate = true) {
    const target = Math.max(0, Math.min(slides.length - 1, next));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.current?.scrollTo({ left: target * track.current.clientWidth, behavior: animate && !reduced ? 'smooth' : 'auto' });
    activeIndex.current = target;
    setIndex(target);
  }
  useEffect(() => {
    const next = slides.findIndex(image => image.url === selectedImage);
    show(next >= 0 ? next : 0, false);
  }, [product.id, selectedImage]);
  useEffect(() => {
    const element = track.current;
    if (!element || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      element.scrollTo({ left: activeIndex.current * element.clientWidth, behavior: 'auto' });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
    <div className="relative overflow-hidden rounded-[2rem] bg-[#e8ebed] shadow-[0_15px_35px_rgba(15,23,42,.07)]">
      <div ref={track} data-product-gallery role="region" aria-roledescription="carrousel" aria-label="Photos du produit"
        tabIndex={0}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#1672d8]"
        onScroll={event => {
          const next = galleryIndex(event.currentTarget.scrollLeft, event.currentTarget.clientWidth, slides.length);
          activeIndex.current = next;
          setIndex(next);
        }}
        onKeyDown={event => {
          const next = event.key === 'ArrowRight' ? index + 1 : event.key === 'ArrowLeft' ? index - 1 : event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : null;
          if (next !== null) { event.preventDefault(); show(next); }
        }}>
        {slides.map((image, i) => <div key={image.url || i} className="relative aspect-square w-full shrink-0 snap-center snap-always" role="group" aria-roledescription="diapositive" aria-label={`${i + 1} sur ${slides.length}`}>
          <ProductVisual product={{ ...product, image: image.url, imageAlt: productImageAlt(product, image.altText) }} priority={i === 0} imageContext="gallery" />
          {!image.url.includes('-norticam-') && <span className="pointer-events-none absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-[#1672d8]">{product.badge}</span>}
        </div>)}
      </div>
      {slides.length > 1 && <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between">
        <button type="button" aria-label="Photo précédente" disabled={index === 0} onClick={() => show(index - 1)} className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white/95 text-slate-950 shadow-sm disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-[#1672d8]"><ChevronLeft size={20} /></button>
        <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-700" aria-live="polite" aria-atomic="true">{index + 1} / {slides.length}</span>
        <button type="button" aria-label="Photo suivante" disabled={index === slides.length - 1} onClick={() => show(index + 1)} className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white/95 text-slate-950 shadow-sm disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-[#1672d8]"><ChevronRight size={20} /></button>
      </div>}
    </div>
    <div className="mt-3 flex gap-2 overflow-x-auto pb-2" aria-label="Galerie produit">
      {slides.map((image, i) => <button type="button" key={image.url || i} onClick={() => show(i)} aria-label={`Voir la photo ${i + 1} : ${productImageAlt(product, image.altText)}`} aria-pressed={i === index}
        className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white focus-visible:outline-2 focus-visible:outline-[#1672d8] ${i === index ? 'border-[#1672d8]' : 'border-slate-200'}`}>
        <img src={imageUrl(image.url, 160)} width={64} height={64} loading="lazy" alt="" className="h-full w-full object-contain" />
      </button>)}
    </div>
  </div>;
}
