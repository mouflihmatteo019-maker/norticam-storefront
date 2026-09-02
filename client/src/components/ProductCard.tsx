/** Design reference: NORTICAM storefront — white, softly elevated commerce cards. */
import { ArrowUpRight, Plus } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@/lib/store-data";
import { euro } from "@/lib/store-data";
import { useCart } from "@/contexts/CartContext";

export function ProductVisual({ product, className = "", priority = false }: { product: Product; className?: string; priority?: boolean }) {
  if (product.image) return <img className={`h-full w-full object-cover ${className}`} src={product.image} alt={product.imageAlt || product.shortTitle} loading={priority ? "eager" : "lazy"} decoding="async" fetchPriority={priority ? "high" : "auto"} />;
  return <div className={`product-visual ${product.id === "memory" ? "product-visual--memory" : "product-visual--kit"} ${className}`} aria-label={product.shortTitle}><div className="product-visual__object" /><span className="product-visual__reflection" /></div>;
}

export function ProductCard({ product, prominent = false }: { product: Product; prominent?: boolean }) {
  const { add } = useCart();
  const variant = product.variants.find((item) => item.availableForSale) ?? product.variants[0];
  return <article className={`group relative overflow-hidden rounded-[1.65rem] border border-slate-200/80 bg-white p-3 shadow-[0_8px_30px_rgb(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgb(15,23,42,0.10)] ${prominent ? "md:p-4" : ""}`}>
    <Link href={`/produits/${product.handle}`} className="block"><div className={`relative overflow-hidden rounded-[1.2rem] bg-[#e8ebed] ${prominent ? "aspect-[1.08/1]" : "aspect-square"}`}><ProductVisual product={product} className="transition duration-500 group-hover:scale-[1.035]" /><span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-700 backdrop-blur-sm">{product.badge}</span><span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-slate-950/90 text-white opacity-0 transition duration-200 group-hover:opacity-100"><ArrowUpRight size={15} /></span></div></Link>
    <div className="px-1 pb-1 pt-4"><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#1672d8]">{product.vendor}</p><Link href={`/produits/${product.handle}`}><h3 className="font-display text-base font-extrabold tracking-tight text-slate-950 sm:text-lg">{product.shortTitle}</h3></Link><p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">{product.description}</p><div className="mt-4 flex items-center justify-between gap-3"><span className="font-display text-lg font-extrabold text-slate-950">{euro(product.price)}</span><button type="button" onClick={() => variant && add(product, variant)} disabled={!variant?.availableForSale} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-slate-950 px-3.5 text-xs font-bold text-white transition hover:bg-[#1672d8] active:scale-95 disabled:cursor-not-allowed disabled:opacity-45" aria-label={`Ajouter ${product.title} au panier`}><Plus size={15} /> {variant?.availableForSale ? "Ajouter" : "Indisponible"}</button></div></div>
  </article>;
}
