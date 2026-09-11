/** Design reference: NORTICAM storefront — commerce pages powered by the Shopify product catalogue. */
import { conversionCopy } from "@/lib/product-conversion";
import { buyingGuides } from "@/lib/buying-guides";
import { commercialPages } from "@/lib/commercial-pages";
import { CommercialContent } from "@/components/CommercialContent";
import StorefrontLayout from "@/components/StorefrontLayout";
import { SEOHead } from "@/components/SEOHead";
import { ProductCard, ProductVisual } from "@/components/ProductCard";
import { useCatalog } from "@/contexts/CatalogContext";
import { money, SITE_URL, type StoreProduct } from "@/lib/shopify";
import { productFacts } from "@/lib/product-facts";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronRight, CircleHelp, RotateCcw, ScanLine, ShieldCheck, ShoppingBag, Video } from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { useEffect, useMemo, useState } from "react";

const categoryLinks = [
  { href: "/boutique", label: "Tous les produits" },
  { href: "/dashcam-voiture", label: "Dashcams voiture" },
  { href: "/dashcam-moto", label: "Dashcams moto" },
  { href: "/mode-parking", label: "Mode parking" },
  { href: "/dashcam-avant-arriere", label: "Avant et arrière" },
];

const headings: Record<string, { kicker: string; title: string; copy: string }> = {
  "/boutique": { kicker: "La sélection NORTICAM", title: "Des solutions claires pour chaque trajet.", copy: "Explorez le catalogue réel de dashcams voiture et moto, puis choisissez la configuration qui répond à votre usage." },
  "/meilleure-dashcam": { kicker: "Meilleure dashcam 2026", title: "Choisir selon vos priorités.", copy: "" },
  "/dashcam-vision-nocturne": { kicker: "Dashcam vision nocturne", title: "Pour vos trajets de nuit.", copy: "" },
  "/dashcam-gps": { kicker: "Dashcam GPS", title: "La position en complément de la vidéo.", copy: "" },
  "/dashcam-voiture": { kicker: "Dashcams voiture", title: "La preuve, pensée pour le quotidien.", copy: "Des modèles voiture sélectionnés pour documenter l’imprévu au fil de vos trajets." },
  "/dashcam-moto": { kicker: "Dashcams moto", title: "Le bon angle, même sur deux roues.", copy: "Une sélection de modèles pour les trajets à moto et les usages embarqués." },
  "/dashcam-voiture-4k": { kicker: "Dashcams voiture 4K", title: "Plus de définition sur vos trajets.", copy: "Comparez les modèles dont le catalogue indique une résolution 4K. La qualité nocturne dépend aussi du capteur et du traitement de l’image." },
  "/dashcam-voiture-360": { kicker: "Dashcams orientables", title: "Un angle adapté à la situation.", copy: "Une caméra orientable ne filme pas forcément tous les angles simultanément : comparez les configurations proposées." },
  "/dashcam-moto-casque": { kicker: "Caméras de casque moto", title: "Votre point de vue, en mouvement.", copy: "Comparez les caméras qui suivent le pilote. Vérifiez le montage adapté à votre casque." },
  "/ecran-moto-carplay": { kicker: "Écrans moto connectés", title: "Naviguer et filmer à moto.", copy: "Comparez les écrans avec CarPlay et les configurations DVR proposées." },
  "/dashcam-avant-arriere": { kicker: "Dashcams avant et arrière", title: "Deux angles pour comprendre la route.", copy: "Comparez les kits dont le catalogue décrit une caméra avant et une caméra arrière." },
  "/mode-parking": { kicker: "Dashcam mode parking", title: "Choisir pour une voiture garée.", copy: "Des modèles à comparer lorsque votre usage implique la protection du véhicule stationné." },
};

function PageHero({ kicker, title, copy, compact = false }: { kicker: string; title: string; copy: string; compact?: boolean }) {
  return <section className={`relative overflow-hidden bg-slate-950 text-white ${compact ? "py-12" : "py-16 sm:py-20"}`}><div className="absolute inset-0 bg-[radial-gradient(circle_at_77%_35%,rgba(36,131,230,.32),transparent_23%),radial-gradient(circle_at_24%_80%,rgba(14,165,233,.1),transparent_30%)]" /><div className="container relative"><p className="eyebrow text-[#75b8ff]">{kicker}</p><h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.01] tracking-[-.055em] sm:text-6xl">{title}</h1><p className="mt-5 max-w-xl text-base leading-7 text-slate-300">{copy}</p></div></section>;
}

function productsForRoute(location: string, products: StoreProduct[]) {
  if (location === "/meilleure-dashcam") { const shortlist=['dashcam-voiture-discrete-2k','dashcam-3k-voiture','dashcam-4k','dashcam-wifi-5ghz','camera-casque-moto-4k','dashcam-moto-etanche']; return shortlist.map(h=>products.find(p=>p.handle===h)).filter((p):p is StoreProduct=>!!p); }
  if (location === "/dashcam-voiture") return products.filter((product) => /voiture/i.test(product.productType));
  if (location === "/dashcam-moto") return products.filter((product) => /moto/i.test(product.productType));
  if (location === "/mode-parking") return products.filter(product => !productFacts(product).parking.startsWith("Non"));
  if (location === "/dashcam-avant-arriere") return products.filter(product => productFacts(product).dual);
  if (location === "/dashcam-voiture-4k") return products.filter(p=>/voiture/i.test(p.productType) && /4k/i.test(productFacts(p).resolution));
  if (location === "/dashcam-voiture-360") return products.filter(p=>/voiture/i.test(p.productType) && /360/i.test(p.title));
  if (location === "/dashcam-moto-casque") return products.filter(p=>/moto/i.test(p.productType) && /casque/i.test(p.description));
  if (location === "/ecran-moto-carplay") return products.filter(p=>/moto/i.test(p.productType) && /carplay/i.test(p.description));
  if (location === "/dashcam-vision-nocturne") return products.filter(p=>!productFacts(p).night.startsWith("Non"));
  if (location === "/dashcam-gps") return products.filter(p=>!productFacts(p).gps.startsWith("Non"));
  return products;
}

export function Shop() {
  const [rawLocation] = useLocation();
  const location = rawLocation.replace(/\/$/, "") || "/";
  const { products, loading } = useCatalog();
  const [sort, setSort] = useState("selection");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tous");
  const available = useMemo(() => productsForRoute(location, products), [location, products]);
  useEffect(() => { setFilter("Tous"); setSearch(""); }, [location]);
  const visible = available.filter(p => filter === "Tous" || (filter === "Voiture" ? /voiture/i : /moto/i).test(p.productType)).filter(p => `${p.title} ${p.vendor}`.toLowerCase().includes(search.toLowerCase())).sort((a,b) => sort === "asc" ? a.price-b.price : sort === "desc" ? b.price-a.price : 0);
  const heading = headings[location] || headings["/boutique"];
  const commercial = commercialPages[location];
  const pageTitle = commercial?.title || `${heading.kicker} : comparer les modèles disponibles | NORTICAM`;
  const itemList = { "@context": "https://schema.org", "@type": "ItemList", name: heading.title, numberOfItems: visible.length, itemListElement: visible.map((product, index) => ({ "@type": "ListItem", position: index + 1, url: `${SITE_URL}/produits/${product.handle}/`, name: product.title })) };
  return <StorefrontLayout><SEOHead title={pageTitle} description={commercial?.description || heading.copy} jsonLd={itemList} /><PageHero {...heading} title={heading.kicker + " : " + heading.title} copy={commercial?.intro || heading.copy} compact /><section className="py-12 sm:py-16"><div className="container"><nav className="flex gap-2 overflow-x-auto pb-2" aria-label="Catégories boutique">{categoryLinks.map((link) => <Link key={link.href} href={link.href} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${location === link.href ? "bg-slate-950 text-white" : "bg-white text-slate-600 hover:bg-blue-50 hover:text-[#1672d8]"}`}>{link.label}</Link>)}</nav><div className="mt-10 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-slate-500"><strong className="text-slate-950">{visible.length} modèles</strong> dans cette sélection.</p><div className="flex gap-2">{["Tous", "Voiture", "Moto"].map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-3.5 py-2 text-xs font-bold ${filter === item ? "bg-blue-50 text-[#1672d8]" : "text-slate-500 hover:bg-slate-100"}`}>{item}</button>)}</div></div><div className="mt-5 flex flex-wrap gap-4"><label className="flex-1 text-sm font-bold">Rechercher un modèle<input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Marque ou modèle" className="mt-2 w-full rounded-xl border bg-white p-3" /></label><label className="text-sm font-bold">Trier<select className="mt-2 block rounded-xl border bg-white p-3" value={sort} onChange={e=>setSort(e.target.value)}><option value="selection">Notre sélection</option><option value="asc">Prix croissant</option><option value="desc">Prix décroissant</option></select></label></div>{location === "/mode-parking" && <p className="mt-5 rounded-xl bg-blue-50 p-4 text-sm leading-6">Le mode parking nécessite généralement une alimentation permanente compatible, parfois vendue séparément. Vérifiez la fiche et la variante choisies.</p>}{visible.length ? <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visible.map((product, index) => <ProductCard key={product.id} product={product} prominent={index === 2} />)}</div> : <div className="mt-8 rounded-[2rem] bg-white p-10 text-center"><h2 className="font-display text-2xl font-extrabold">Aucun produit dans cette sélection</h2><p className="mt-3 text-sm text-slate-500">Essayez un autre filtre ou un autre terme de recherche.</p><Link href="/boutique" className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white">Voir tous les produits</Link></div>}</div></section><CommercialContent route={location} /></StorefrontLayout>;
}

export function Compare() {
  const { dashcams, featuredDashcams } = useCatalog(); const [handles,setHandles] = useState(['dashcam-3k-voiture','dashcam-avant-arriere','dashcam-4k']);
  const selected = handles.map(h => dashcams.find(p => p.handle === h)).filter((p): p is StoreProduct => !!p);
  const fields = [['resolution','Résolution'],['coverage','Couverture'],['gps','GPS'],['wifi','Wi-Fi'],['parking','Mode parking'],['night','Image nocturne'],['storage','Stockage']] as const;
  return <StorefrontLayout><SEOHead title="Comparateur dashcam : voiture et moto | NORTICAM" description="Comparez jusqu’à trois dashcams : résolution, couverture, GPS, Wi-Fi, mode parking, stockage et prix." /><PageHero kicker="Comparatif NORTICAM" title="Les différences qui comptent." copy="Choisissez jusqu’à trois modèles. Une fonction non précisée dans le catalogue n’est jamais présentée comme incluse." /><section className="container py-12">
    <div className="grid gap-4 sm:grid-cols-3">{handles.map((h,i) => <label key={i} className="text-sm font-bold">Modèle {i+1}<select value={h} onChange={e=>setHandles(a=>a.map((v,n)=>n===i?e.target.value:v))} className="mt-2 block w-full min-w-0 rounded-xl border bg-white p-3">{dashcams.map(p=><option key={p.id} value={p.handle} disabled={handles.includes(p.handle) && p.handle!==h}>{p.shortTitle}</option>)}</select></label>)}</div>
    <p className="mt-6 text-sm text-slate-600 sm:hidden">Faites défiler le tableau horizontalement pour comparer les modèles.</p><div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white" tabIndex={0} role="region" aria-label="Tableau comparatif défilant"><table className="w-full min-w-[780px] table-fixed text-left"><caption className="sr-only">Caractéristiques indiquées dans les fiches produit NORTICAM</caption><thead><tr><th scope="col" className="w-36 p-4">Votre choix</th>{selected.map(p=><th scope="col" key={p.id} className="p-4"><div className="aspect-square max-w-40"><ProductVisual product={p} /></div><Link href={`/produits/${p.handle}`} className="mt-3 block font-display font-extrabold text-[#1672d8]">{p.shortTitle}</Link><p className="mt-2">{p.verified ? money(p.price,p.currency) : 'Prix à vérifier'}</p></th>)}</tr></thead><tbody><tr className="border-t bg-blue-50"><th scope="row" className="p-4 text-sm">Idéal pour…</th>{selected.map(p=><td key={p.id} className="p-4 text-sm leading-6">{conversionCopy(p).ideal}.</td>)}</tr>{fields.map(([field,label])=><tr key={field} className="border-t"><th scope="row" className="p-4 text-sm">{label}</th>{selected.map(p=><td key={p.id} className="p-4 text-sm leading-6 text-slate-600">{productFacts(p)[field]}</td>)}</tr>)}<tr className="border-t"><th scope="row" className="p-4 text-sm">Choisir</th>{selected.map(p=><td key={p.id} className="p-4"><Link className="btn-primary" href={`/produits/${p.handle}`}>Voir le modèle</Link></td>)}</tr></tbody></table></div><p className="mt-5 text-sm leading-6 text-slate-600">Certaines fonctions dépendent du kit choisi. La fiche produit précise les conditions indiquées dans le catalogue.</p><Link href="/quiz" className="btn-secondary mt-5">Besoin d’aide pour choisir ?</Link>
  </section></StorefrontLayout>;
}

export function Guides() {
  const guides = [{ slug: "quelle-dashcam-voiture-choisir", icon: CircleHelp, category: "Bien choisir", title: "Comment choisir une dashcam selon votre usage ?", text: "Une base claire pour comprendre les questions à vous poser avant de comparer les modèles." }, { slug: "dashcam-avant-arriere-guide", icon: Video, category: "Comprendre", title: "Avant, arrière, 4K : que faut-il vraiment regarder ?", text: "Les critères utiles pour organiser votre recherche sans vous perdre dans la fiche technique." }, { slug: "dashcam-moto-guide", icon: ShieldCheck, category: "Installer", title: "Préparer l’installation de votre dashcam moto", text: "Alimentation, positionnement et compatibilité : les éléments à vérifier avant de vous équiper." }];
  guides.push(...Object.entries(buyingGuides).map(([slug,guide])=>({slug,icon:CircleHelp,category:guide.category,title:guide.title,text:guide.description})));
  const collectionSchema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "Conseils dashcam NORTICAM", description: "Guides pour choisir une dashcam voiture, avant arrière ou moto.", hasPart: guides.map((guide) => ({ "@type": "Article", headline: guide.title, url: `${SITE_URL}/conseils/${guide.slug}` })) };
  return <StorefrontLayout><SEOHead title="Conseils dashcam voiture et moto : choix, installation et comparatif | NORTICAM" description="Guides NORTICAM pour choisir une dashcam voiture, une double caméra avant arrière ou une dashcam moto, puis comparer les produits disponibles." jsonLd={collectionSchema} /><PageHero kicker="Conseils NORTICAM" title="Des explications utiles avant de choisir." copy="Des repères simples pour comprendre les configurations dashcam et préparer une installation cohérente." /><section className="py-12 sm:py-20"><div className="container"><div className="grid gap-5 md:grid-cols-3">{guides.map(({ slug, icon: Icon, category, title, text }) => <article className="rounded-[1.7rem] bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,.05)]" key={title}><div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white"><Icon size={21} /></div><p className="mt-7 eyebrow">{category}</p><h2 className="mt-3 font-display text-2xl font-extrabold tracking-[-.04em] text-slate-950">{title}</h2><p className="mt-4 text-sm leading-7 text-slate-500">{text}</p><Link href={`/conseils/${slug}`} className="mt-7 inline-flex items-center gap-1 text-sm font-bold text-[#1672d8]">Lire le guide <ChevronRight size={16} /></Link></article>)}</div></div></section></StorefrontLayout>;
}
