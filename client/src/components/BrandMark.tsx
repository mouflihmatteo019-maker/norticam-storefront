/** Owner-supplied logo; framing is CSS only, original artwork is preserved. */
import { Link } from "@/components/Navigation";
import { themeRuntime } from '@/lib/theme-runtime';

export function BrandMark({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  const textColor = dark ? "text-white" : "text-slate-950";
  return <Link href="/" className={`inline-flex items-center gap-2.5 ${textColor} ${className}`} aria-label="NORTICAM — Accueil"><span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-[#020b21]"><img src={themeRuntime()?.assets.logo || '/norticam-mark.png'} alt="" width={36} height={36} className="h-full w-full object-cover" /></span><span className="font-display text-[1.02rem] font-extrabold tracking-[0.16em]">NORTICAM</span></Link>;
}
