/** SEO content hub: NORTICAM informational articles linking readers to the relevant category and product routes. */
import { Link, useParams } from "wouter";
import StorefrontLayout from "@/components/StorefrontLayout";
import { SEOHead } from "@/components/SEOHead";
import { ArrowLeft, ArrowRight, Check, CircleHelp } from "lucide-react";

const articles = {
  "quelle-dashcam-voiture-choisir": {
    title: "Quelle dashcam voiture choisir ? Guide pratique pour comparer les options",
    description: "Découvrez comment choisir une dashcam voiture : couverture avant ou avant-arrière, définition, stationnement, variantes et installation.",
    category: "Bien choisir",
    intro: "Choisir une dashcam voiture consiste d’abord à définir le contexte que vous souhaitez enregistrer. Le bon modèle dépend de vos trajets, du niveau de couverture recherché et de l’installation que vous êtes prêt à envisager.",
    sections: [
      ["Commencer par la couverture", "Une caméra avant conserve le contexte devant le véhicule. Une configuration avant et arrière élargit la couverture lorsque cet angle supplémentaire est important pour votre usage. Avant de comparer les prix, déterminez d’abord si une seule caméra répond à votre besoin."],
      ["Regarder les variantes avant les promesses", "Les modèles disponibles peuvent proposer des configurations distinctes, par exemple un kit avant et arrière ou différentes capacités de stockage. Lisez les intitulés de variante et les informations de la fiche avant de mettre un produit au panier."],
      ["Préparer l’installation", "L’emplacement de la caméra, l’alimentation et la compatibilité avec le véhicule méritent d’être vérifiés avant l’achat. Une installation adaptée dépend du produit, de vos attentes de discrétion et des fonctionnalités recherchées."],
    ],
    checklist: ["Identifier l’angle de couverture nécessaire.", "Comparer les variantes réellement disponibles.", "Vérifier l’alimentation et le positionnement souhaités.", "Lire la fiche produit avant de choisir."],
    cta: "/dashcam-voiture",
    ctaLabel: "Voir les dashcams voiture",
  },
  "dashcam-avant-arriere-guide": {
    title: "Dashcam avant arrière : à quoi sert une double caméra ?",
    description: "Comprendre l’intérêt d’une dashcam avant arrière, les éléments à comparer et les questions à vérifier avant de choisir une configuration double caméra.",
    category: "Couverture complète",
    intro: "Une dashcam avant arrière vise à enregistrer deux angles autour du véhicule. Elle convient aux personnes qui souhaitent conserver un contexte plus large qu’avec une caméra orientée vers l’avant uniquement.",
    sections: [
      ["Deux angles, un même contexte", "La caméra avant se concentre sur la route et l’environnement devant le véhicule. La caméra arrière complète cette vue. L’intérêt de cette configuration dépend de la zone que vous souhaitez documenter, et non seulement de la fiche technique."],
      ["Comparer les kits", "Certains produits sont proposés dans des kits spécifiques. Vérifiez que la variante sélectionnée mentionne bien la configuration recherchée et consultez les photos et informations de chaque offre avant achat."],
      ["Penser au câblage", "L’installation d’une caméra arrière peut nécessiter un cheminement différent de celui d’un modèle à une seule caméra. Lisez les indications fournies avec le produit et assurez-vous que l’installation correspond à votre véhicule."],
    ],
    checklist: ["Confirmer la présence de la caméra arrière dans la variante.", "Évaluer le trajet de câble et la solution d’alimentation.", "Choisir une configuration adaptée à votre véhicule.", "Comparer les modèles avant et arrière disponibles."],
    cta: "/dashcam-avant-arriere",
    ctaLabel: "Comparer les modèles avant arrière",
  },
  "dashcam-moto-guide": {
    title: "Dashcam moto : comment choisir une caméra embarquée pour deux roues ?",
    description: "Guide dashcam moto : critères utiles pour comparer une caméra embarquée moto, vérifier les variantes, l’installation et le contexte d’utilisation.",
    category: "Dashcams moto",
    intro: "Une dashcam moto doit être choisie en fonction de la configuration recherchée, de l’emplacement possible sur la moto et de la manière dont vous souhaitez consulter les séquences. Comparer les produits par usage évite de s’arrêter à une seule caractéristique.",
    sections: [
      ["Partir de votre configuration", "Avant de choisir, définissez si vous recherchez un enregistrement embarqué, une configuration avec plusieurs angles ou un écran. Les produits et variantes disponibles ne répondent pas tous au même contexte."],
      ["Vérifier le montage", "La compatibilité avec votre moto, le positionnement de la caméra, l’alimentation et le passage des câbles doivent être examinés avant achat. Reportez-vous à la fiche produit pour les indications propres au modèle."],
      ["Comparer sans surinterpréter", "Les termes commerciaux ne remplacent pas la lecture de la configuration proposée. Comparez les images, le titre, les variantes et les informations de chaque modèle afin de vérifier qu’il correspond à votre usage."],
    ],
    checklist: ["Définir le type de caméra ou d’écran recherché.", "Vérifier la compatibilité de l’installation avec votre moto.", "Lire les variantes et leur contenu avant achat.", "Comparer les modèles moto disponibles."],
    cta: "/dashcam-moto",
    ctaLabel: "Voir les dashcams moto",
  },
} as const;

export function GuideArticle() {
  const { slug } = useParams<{ slug: keyof typeof articles }>();
  const article = slug ? articles[slug] : undefined;
  if (!article) return <StorefrontLayout><SEOHead title="Guide introuvable | NORTICAM" description="Retrouvez nos guides dashcam voiture et moto." /><main className="container py-24"><h1 className="font-display text-4xl font-extrabold">Guide introuvable</h1><Link href="/conseils" className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white">Voir tous les conseils</Link></main></StorefrontLayout>;
  const articleSchema = { "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.description, author: { "@type": "Organization", name: "NORTICAM" }, publisher: { "@type": "Organization", name: "NORTICAM" }, mainEntityOfPage: `${window.location.origin}/conseils/${slug}` };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: article.checklist.map((item) => ({ "@type": "Question", name: item, acceptedAnswer: { "@type": "Answer", text: "Consultez les informations de la fiche produit et vérifiez la configuration adaptée à votre usage avant achat." } })) };
  return <StorefrontLayout><SEOHead title={`${article.title} | NORTICAM`} description={article.description} type="article" jsonLd={[articleSchema, faqSchema]} /><article><header className="relative overflow-hidden bg-slate-950 py-14 text-white sm:py-20"><div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(36,131,230,.3),transparent_25%)]" /><div className="container relative max-w-4xl"><Link href="/conseils" className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white"><ArrowLeft size={16} />Retour aux conseils</Link><p className="mt-9 eyebrow text-[#75b8ff]">{article.category}</p><h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.02] tracking-[-.055em] sm:text-6xl">{article.title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{article.intro}</p></div></header><div className="container max-w-4xl py-12 sm:py-20"><div className="grid gap-12 lg:grid-cols-[1fr_290px]"><div className="space-y-12">{article.sections.map(([heading, copy], index) => <section key={heading}><p className="eyebrow">0{index + 1} — À vérifier</p><h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-.04em] text-slate-950">{heading}</h2><p className="mt-5 text-base leading-8 text-slate-600">{copy}</p></section>)}<section className="rounded-[2rem] bg-[#eaf3ff] p-7 sm:p-9"><p className="eyebrow">Une prochaine étape claire</p><h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-.04em] text-slate-950">Passez de la question au bon modèle.</h2><p className="mt-4 leading-7 text-slate-600">Le catalogue permet de comparer les configurations et les variantes réellement disponibles dans la boutique.</p><Link href={article.cta} className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-[#1672d8]">{article.ctaLabel}<ArrowRight size={16} /></Link></section></div><aside className="h-fit rounded-[1.7rem] border border-slate-200 bg-white p-6 lg:sticky lg:top-24"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-[#1672d8]"><CircleHelp size={19} /></div><h2 className="mt-5 font-display text-xl font-extrabold">Checklist avant achat</h2><ul className="mt-5 space-y-3">{article.checklist.map((item) => <li key={item} className="flex gap-2.5 text-sm leading-6 text-slate-600"><Check size={16} className="mt-1 shrink-0 text-[#1672d8]" />{item}</li>)}</ul></aside></div></div></article></StorefrontLayout>;
}
