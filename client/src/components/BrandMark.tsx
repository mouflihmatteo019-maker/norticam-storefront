/** Design reference: NORTICAM storefront — geometric blue shield mark and compact wordmark. */
import { Link } from "wouter";

export function BrandMark({ dark = false }: { dark?: boolean }) {
  return <Link href="/" className={`inline-flex items-center gap-2.5 ${dark ? "text-white" : "text-slate-950"}`} aria-label="NORTICAM — Accueil"><span className={`grid h-9 w-9 place-items-center overflow-hidden rounded-xl ${dark ? "bg-white" : "bg-slate-950"}`}><img src="/manus-storage/norticam-mark_79e2d2ea.png" alt="" className={`h-7 w-7 object-contain ${dark ? "" : "brightness-0 invert"}`} /></span><span className="font-display text-[1.02rem] font-extrabold tracking-[0.16em]">NORTICAM</span></Link>;
}
