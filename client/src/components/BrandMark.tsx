/** Design reference: NORTICAM brand mark — inline vector mark prevents external image failures in header and footer. */
import { Link } from "wouter";

export function BrandMark({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  const textColor = dark ? "text-white" : "text-slate-950";
  return <Link href="/" className={`inline-flex items-center gap-2.5 ${textColor} ${className}`} aria-label="NORTICAM — Accueil"><span className={`grid h-9 w-9 place-items-center rounded-xl ${dark ? "bg-white text-slate-950" : "bg-slate-950 text-white"}`}><svg viewBox="0 0 36 36" className="h-6 w-6" aria-hidden="true"><path d="M8 9h5l10 11V9h5v18h-5L13 16v11H8z" fill="currentColor" /><path d="M10 27 26 9" stroke={dark ? "#2483e6" : "#75b8ff"} strokeWidth="2.7" strokeLinecap="round" /></svg></span><span className="font-display text-[1.02rem] font-extrabold tracking-[0.16em]">NORTICAM</span></Link>;
}
