import { conversionCopy } from '@/lib/product-conversion';
import { ArrowUpRight, ImageOff } from 'lucide-react';
import { Link } from 'wouter';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/store-data';
import { money, type StoreProduct } from '@/lib/shopify';
export function imageUrl(url: string, width: number) { try { const u = new URL(url); if (u.hostname === 'cdn.shopify.com') u.searchParams.set('width', String(width)); return u.href; } catch { return url; } }
export function ProductVisual({ product, className = '', priority = false }: { product: Product; className?: string; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [product.image]);
  if (product.image && !failed) return <img className={`h-full w-full object-contain ${className}`} src={imageUrl(product.image, 800)} srcSet={[320,480,640,800,1000].map(w => `${imageUrl(product.image!, w)} ${w}w`).join(', ')} sizes="(min-width:1024px) 40vw, (min-width:640px) 50vw, 100vw" width={800} height={800} alt={product.imageAlt || product.title} loading={priority ? 'eager' : 'lazy'} decoding="async" fetchPriority={priority ? 'high' : 'auto'} onError={() => setFailed(true)} />;
  return <div className="grid h-full min-h-40 place-content-center gap-3 bg-slate-100 p-6 text-center text-slate-500"><ImageOff className="mx-auto" /><span className="text-sm">Photo momentanément indisponible</span></div>;
}
export function ProductCard({ product, prominent = false }: { product: StoreProduct; prominent?: boolean }) {
  return <article className="group flex h-full flex-col overflow-hidden rounded-[1.65rem] border border-slate-200/80 bg-white p-3 shadow-[0_8px_30px_rgb(15,23,42,0.05)] transition hover:shadow-lg">
    <Link href={`/produits/${product.handle}`} className="block" aria-label={`Découvrir ${product.shortTitle}`}><div className="relative aspect-square overflow-hidden rounded-[1.2rem] bg-[#e8ebed]"><ProductVisual product={product} /><span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">{product.badge}</span></div></Link>
    <div className="flex flex-1 flex-col px-1 pb-1 pt-4"><p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#1672d8]">{product.vendor}</p><Link href={`/produits/${product.handle}`}><h3 className="font-display text-lg font-extrabold text-slate-950">{product.shortTitle}</h3></Link><p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600"><strong>Idéal pour : </strong>{conversionCopy(product).ideal}.</p><div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5"><span className="font-display text-lg font-extrabold">{product.verified ? ((new Set(product.variants.map(v=>v.price)).size > 1 ? 'Dès ' : '') + money(product.price, product.currency)) : 'Prix à vérifier'}</span><Link href={`/produits/${product.handle}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-slate-950 px-4 text-xs font-bold text-white hover:bg-[#1672d8]">Choisir ce modèle <ArrowUpRight size={15} /></Link></div>{product.verified && !product.available && <p className="mt-3 text-xs text-slate-500">Actuellement indisponible</p>}</div>
  </article>;
}
