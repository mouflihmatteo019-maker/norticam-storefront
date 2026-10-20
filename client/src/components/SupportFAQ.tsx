import { Link } from "@/components/Navigation";

/** Published owner-confirmed conditions, not a promise of supplier stock. */
export const supportQuestions = [
  {
    question: "Où livrez-vous et depuis quel pays ?",
    answer: "Nous livrons en France métropolitaine uniquement. Les produits sont expédiés depuis la Chine. La livraison est gratuite sans minimum d’achat ; les taxes et frais d’importation sont inclus dans le prix payé.",
  },
  {
    question: "Quel délai prévoir pour recevoir ma commande ?",
    answer: "Le délai total estimé est de 6 à 12 jours ouvrés : 1 à 2 jours ouvrés de préparation, puis 5 à 10 jours ouvrés de transport. Les week-ends et jours fériés ne sont pas comptés. Il s’agit d’une estimation, pas d’une date de livraison garantie. Contactez-nous si le suivi signale un retard.",
  },
  {
    question: "Comment suivre une commande ?",
    answer: "La page de suivi permet de rechercher votre envoi avec les informations de votre commande. Un suivi peut ne pas encore être disponible pendant la préparation ou avant la première prise en charge par le transporteur.",
  },
  {
    question: "Quels sont les frais de retour si je change d’avis ?",
    answer: "Pour une rétractation signalée dans les 14 jours suivant la réception, vous avancez les frais postaux et NORTICAM vous les rembourse sur justificatif. Pour un retour accepté entre le 15e et le 30e jour après réception, les frais de retour restent à votre charge. Consultez les conditions complètes et contactez-nous pour organiser le retour.",
  },
  {
    question: "Qui paie le retour d’un produit défectueux ou non conforme ?",
    answer: "Dans le cadre de la garantie légale de conformité, NORTICAM prend en charge les frais de retour : ils ne restent pas à votre charge. Contactez-nous pour organiser la prise en charge. La limite de 14 jours pour un changement d’avis ne limite pas vos droits en cas de défaut de conformité.",
  },
  {
    question: "Comment vérifier les accessoires et la compatibilité ?",
    answer: "Vérifiez le contenu de la configuration sélectionnée, les caractéristiques et les informations pratiques de la fiche. Une carte mémoire, une caméra arrière ou un kit d’alimentation parking ne sont inclus que si la configuration le précise. En cas de doute, indiquez-nous le modèle et votre véhicule avant de commander.",
  },
] as const;

export function SupportFAQ() {
  return (
    <section id="faq" aria-labelledby="support-faq-title" className="mt-12 scroll-mt-28">
      <h2 id="support-faq-title" className="font-display text-2xl font-bold sm:text-3xl">Questions fréquentes</h2>
      <p className="mt-3 leading-7 text-slate-600">Livraison, retours et choix de votre configuration : les informations utiles avant et après votre achat.</p>
      <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-5 sm:px-7">
        {supportQuestions.map(item => (
          <details key={item.question} className="group py-5">
            <summary className="cursor-pointer font-semibold leading-7 text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">{item.question}</summary>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
          </details>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#1672d8]">
        <Link href="/suivi-colis/" className="underline underline-offset-4">Suivre ma commande</Link>
        <Link href="/informations/livraison-retours" className="underline underline-offset-4">Conditions de livraison et de retour</Link>
      </div>
    </section>
  );
}
