import { Link } from '@/components/Navigation';

export function SelectionMethodology({ vendor }: { vendor?: string }) {
  return <aside className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6" aria-label="Méthode de sélection NORTICAM">
    <h2 className="font-display text-xl font-extrabold">Comment NORTICAM vous aide à choisir</h2>
    <p className="mt-3 text-sm leading-7 text-slate-600">Comparez les caractéristiques présentées sur les fiches : véhicule, angles filmés, définition, alimentation et fonctions connectées. Les prix et disponibilités correspondent à la configuration sélectionnée.</p>
    <p className="mt-3 text-sm leading-7 text-slate-600">Cette sélection éditoriale ne constitue ni un test en laboratoire, ni un classement de ventes. La résolution seule ne garantit pas la lecture des plaques ; le mode parking dépend de l’alimentation. Vérifiez le kit et la notice du fabricant pour votre installation.</p>
    {(/70mai|DDPAI/i.test(vendor || '')) && <p className="mt-3 text-sm leading-7 text-slate-600">Documentation à consulter : <a href={/70mai/i.test(vendor!) ? 'https://www.70mai.com/us/support/' : 'https://www.ddpai.com/manuals/'} className="font-semibold text-[#1672d8] underline">les notices officielles {vendor}</a>. Consultez les consignes d’installation et d’utilisation avant le montage.</p>}
    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-[#1672d8]"><Link href="/comparatif">Comparer les caractéristiques</Link><Link href="/quiz">Choisir selon mon usage</Link><Link href="/informations/contact">Une question sur l’installation ?</Link></div>
  </aside>;
}
