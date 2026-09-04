/** Design reference: NORTICAM CRO homepage — image-first mobile hero, diagnostic-led discovery and calm purchase reassurance. */
import StorefrontLayout from "@/components/StorefrontLayout";
import { SEOHead } from "@/components/SEOHead";
import { ProductCard, ProductVisual } from "@/components/ProductCard";
import { featuredDashcams } from "@/lib/store-data";
import { ArrowRight, Check, ChevronRight, CircleHelp, ClipboardCheck, LockKeyhole, MapPinCheck, ScanLine, ShieldCheck, Sparkles, Truck, Video } from "lucide-react";
import { Link } from "wouter";

const trustItems = [
  { icon: LockKeyhole, title: "Paiement sécurisé", copy: "Finalisation via le checkout Shopify." },
  { icon: Truck, title: "Livraison offerte", copy: "En France, avec suivi de colis." },
  { icon: MapPinCheck, title: "Retours sous 14 jours", copy: "Selon les conditions de retour." },
];

const useCases = [
  { icon: ShieldCheck, title: "Après un incident", text: "Gardez un enregistrement utile pour remettre les faits dans leur contexte." },
  { icon: Video, title: "Quand le véhicule est garé", text: "Identifiez une configuration compatible avec votre besoin de surveillance." },
  { icon: ClipboardCheck, title: "Pour vos trajets", text: "Choisissez le niveau de couverture adapté à votre quotidien." },
];

export default function ConversionHome() {
  const hero = featuredDashcams[0];
  const homeSchema = { "@context": "https://schema.org", "@type": "WebSite", name: "NORTICAM", url: "https://norticam.com", description: "Dashcams voiture et moto sélectionnées pour documenter les trajets." };

  return <StorefrontLayout>
    <SEOHead title="Dashcam voiture et moto : trouvez le modèle adapté | NORTICAM" description="Trouvez la dashcam adaptée à vos trajets grâce au diagnostic NORTICAM. Comparez les modèles voiture et moto disponibles, puis commandez en sécurité." image={hero?.image} jsonLd={homeSchema} />
    <section className="relative isolate overflow-hidden bg-slate-950 py-7 text-white sm:py-14 lg:py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_74%_22%,rgba(27,127,237,0.38),transparent_23%),radial-gradient(circle_at_22%_78%,rgba(14,165,233,0.14),transparent_29%)]" />
      <div className="hero-grid absolute inset-0 -z-10 opacity-20" />
      <div className="container grid items-center gap-7 lg:grid-cols-[1.04fr_.96fr] lg:gap-14">
        <div className="order-2 max-w-2xl lg:order-1">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-200"><span className="h-1.5 w-1.5 rounded-full bg-[#5caeff]" /> Diagnostic dashcam gratuit</div>
          <h1 className="font-display text-[2.7rem] font-extrabold leading-[0.97] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">La bonne dashcam.<br /><span className="text-[#75b8ff]">Pour votre vrai usage.</span></h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">Plutôt que de comparer seul des fiches techniques, répondez à quelques questions et commencez par la configuration la plus cohérente pour vos trajets.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/quiz" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#2483e6] px-6 text-sm font-bold text-white shadow-[0_15px_30px_rgba(36,131,230,0.3)] transition hover:bg-[#1471d2] active:scale-[.98]">Faire le diagnostic <ArrowRight size={17} /></Link>
            <Link href="/boutique" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-6 text-sm font-bold text-white transition hover:bg-white/10">Voir tous les modèles</Link>
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-slate-300"><Check size={14} className="text-[#75b8ff]" /> Moins d’une minute · recommandations issues du catalogue disponible</p>
        </div>
        <div className="order-1 relative mx-auto w-full max-w-[510px] lg:order-2 lg:max-w-none">
          <div className="absolute -inset-5 rounded-[2.6rem] bg-[#2483e6]/15 blur-3xl" />
          <div className="relative overflow-hidden rounded-[1.8rem] border border-white/15 bg-white/[0.07] p-3 shadow-2xl backdrop-blur-sm sm:rounded-[2rem] sm:p-4">
            <div className="absolute right-4 top-4 z-10 rounded-full border border-white/15 bg-slate-950/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-white backdrop-blur">Sélection NORTICAM</div>
            <div className="aspect-[1.12/1] overflow-hidden rounded-[1.35rem] bg-slate-900"><ProductVisual product={hero} priority /></div>
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-slate-950/80 p-3.5 backdrop-blur-md"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#75b8ff]">{hero.badge}</p><p className="mt-0.5 font-display text-base font-extrabold">{hero.shortTitle}</p></div><Link href={`/produits/${hero.handle}`} className="grid h-9 w-9 place-items-center rounded-full bg-white text-slate-950"><ArrowRight size={16} /></Link></div></div>
          </div>
        </div>
      </div>
    </section>

    <section className="border-b border-slate-200 bg-white py-4"><div className="container grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">{trustItems.map(({ icon: Icon, title, copy }) => <div key={title} className="flex items-center gap-3 py-3 sm:px-5 sm:py-1 first:sm:pl-0 last:sm:pr-0"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#1672d8]"><Icon size={18} /></span><div><p className="text-xs font-extrabold text-slate-950">{title}</p><p className="mt-0.5 text-xs text-slate-500">{copy}</p></div></div>)}</div></section>

    <section className="bg-[#eaf3ff] py-12 sm:py-16"><div className="container"><div className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_18px_45px_rgba(15,23,42,.16)] sm:p-10"><div className="grid items-center gap-8 lg:grid-cols-[1fr_.95fr]"><div><p className="eyebrow text-[#75b8ff]">Le raccourci NORTICAM</p><h2 className="mt-3 max-w-xl font-display text-3xl font-extrabold leading-[1.03] tracking-[-.05em] sm:text-5xl">Ne cherchez pas la fiche la plus longue. Cherchez le bon point de départ.</h2><p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">Le diagnostic traduit votre usage en une recommandation claire : couverture recherchée, stationnement et niveau de détail.</p><Link href="/quiz" className="mt-7 inline-flex min-h-13 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-slate-950 transition hover:bg-[#ddecff] active:scale-[.98]">Lancer mon diagnostic <ArrowRight size={17} /></Link></div><div className="grid gap-3">{[["01", "Parlez-nous de vos trajets", "Le quotidien, le stationnement et le type de couverture."], ["02", "Visualisez votre recommandation", "Une sélection parmi les modèles actuellement disponibles."], ["03", "Choisissez sereinement", "Consultez les variantes, la compatibilité et les informations utiles."]].map(([number,title,copy]) => <div key={number} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[.06] p-4"><span className="font-display text-xl font-extrabold text-[#75b8ff]">{number}</span><div><h3 className="font-display font-extrabold text-white">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-300">{copy}</p></div></div>)}</div></div></div></div></section>

    <section className="py-14 sm:py-20"><div className="container"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div className="max-w-xl"><p className="eyebrow">La gamme NORTICAM</p><h2 className="section-title">Choisissez avec un cadre clair.</h2><p className="section-copy">Retrouvez les modèles prioritaires, puis consultez le diagnostic si vous hésitez entre plusieurs niveaux de couverture.</p></div><Link href="/boutique" className="inline-flex items-center gap-1 text-sm font-bold text-[#1672d8] hover:text-[#075dbb]">Voir la boutique <ChevronRight size={17} /></Link></div><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{featuredDashcams.map((product, index) => <ProductCard key={product.id} product={product} prominent={index === 0} />)}</div><div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-[1.6rem] border border-slate-200 bg-white p-5 sm:flex-row sm:items-center"><div><p className="font-display text-lg font-extrabold text-slate-950">Vous hésitez entre deux modèles ?</p><p className="mt-1 text-sm text-slate-500">Le comparatif donne une première lecture, le diagnostic propose un point de départ.</p></div><div className="flex gap-3"><Link href="/comparatif" className="rounded-full border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50">Comparer</Link><Link href="/quiz" className="rounded-full bg-slate-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1672d8]">Faire le diagnostic</Link></div></div></div></section>

    <section className="bg-white py-14 sm:py-20"><div className="container"><div className="grid gap-9 lg:grid-cols-[.83fr_1.17fr]"><div><p className="eyebrow">Ce que vous protégez</p><h2 className="section-title">Un dispositif discret. Une décision plus simple.</h2><p className="section-copy">Le rôle d’une dashcam dépend de votre usage. Le site vous aide à identifier le modèle, les variantes et les informations à vérifier avant achat.</p><Link href="/conseils" className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-[#1672d8]">Lire les conseils utiles <ArrowRight size={16} /></Link></div><div className="grid gap-4 sm:grid-cols-3">{useCases.map(({ icon: Icon, title, text }, index) => <article key={title} className={`rounded-[1.5rem] border border-slate-100 bg-[#f8fafc] p-5 shadow-[0_10px_24px_rgba(15,23,42,.04)] ${index === 1 ? "sm:translate-y-7" : ""}`}><span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white"><Icon size={20} /></span><h3 className="mt-6 font-display text-lg font-extrabold tracking-tight text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></article>)}</div></div></div></section>

    <section className="pb-14 pt-4 sm:pb-20"><div className="container"><div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-8 sm:p-10"><div className="grid gap-7 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Avant de commander</p><h2 className="section-title text-3xl">Les réponses à vérifier, sans promesse floue.</h2></div><div className="grid gap-3">{[["Le quiz remplace-t-il la vérification des caractéristiques ?", "Non. Il donne un point de départ : vérifiez toujours la fiche du modèle, sa variante et la compatibilité recherchée."], ["Comment se déroule le paiement ?", "Après ajout au panier, vous êtes redirigé vers le panier et le checkout sécurisé NORTICAM sur Shopify."], ["Puis-je demander de l’aide avant de choisir ?", "Les guides et le comparatif sont accessibles depuis la navigation pour vous aider à réduire votre sélection."]].map(([question,answer]) => <details key={question} className="group rounded-2xl bg-slate-50 px-5 py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-slate-950">{question}<CircleHelp size={18} className="shrink-0 text-[#1672d8]" /></summary><p className="pt-3 text-sm leading-6 text-slate-500">{answer}</p></details>)}</div></div></div></div></section>
  </StorefrontLayout>;
}
