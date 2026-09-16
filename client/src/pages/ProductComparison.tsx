import { useParams, Link } from "@/components/Navigation";
import { useCatalog } from '@/contexts/CatalogContext';
import StorefrontLayout from '@/components/StorefrontLayout';
import { SEOHead } from '@/components/SEOHead';
import { ProductCard } from '@/components/ProductCard';
import { conversionCopy } from '@/lib/product-conversion';
import NotFound from './NotFound';
const pairs: Record<string, string[]> = {
  '70mai-a510-vs-ddpai-z50-pro': ['dashcam-3k-voiture','dashcam-wifi-5ghz'],
  '70mai-a510-vs-ddpai-n1-dual': ['dashcam-3k-voiture','dashcam-avant-arriere'],
  'freedconn-r1-plus-vs-fodsports-fx60c': ['dashcam-moto-casque','camera-casque-moto-4k'],
};
export default function ProductComparison() {
  const { slug = '' } = useParams(); const { products } = useCatalog();
  const handles = pairs[slug]; if (!handles) return <NotFound />;
  const selection = handles.map(h => products.find(p => p.handle === h)).filter(p => !!p);
  const title = selection.map(p => p.shortTitle).join(' vs ') + ' : que choisir ?';
  return <StorefrontLayout><SEOHead title={`${title} | NORTICAM`} description="Comparez couverture, fonctions documentées et contraintes d’installation. Consultez les prix et configurations disponibles avant de choisir." /><article className="container py-14"><p className="eyebrow">Comparer avant de choisir</p><h1 className="mt-4 font-display text-4xl font-extrabold">{title}</h1><p className="mt-6 max-w-3xl leading-8 text-slate-600">Le meilleur choix dépend de vos trajets, de la couverture recherchée et de l’installation. Comparez les fonctions ci-dessous, puis ouvrez la fiche pour vérifier le contenu exact de la variante. Cette comparaison repose sur les caractéristiques du catalogue, pas sur un essai comparatif réalisé par NORTICAM.</p><div className="mt-10 grid gap-6 md:grid-cols-2">{selection.map(p => <div key={p.id}><ProductCard product={p} /><section className="mt-5 rounded-2xl bg-white p-6"><h2 className="font-display text-2xl font-bold">Idéal pour {conversionCopy(p).ideal}</h2><ul className="mt-5 space-y-3">{p.details.map(d => <li key={d}>{d}</li>)}</ul><p className="mt-6 text-sm leading-7 text-slate-600">{conversionCopy(p).limit}</p></section></div>)}</div><section className="mt-12 max-w-3xl"><h2 className="font-display text-2xl font-bold">Comment départager les deux modèles ?</h2><p className="mt-4 leading-8">Commencez par la couverture et le montage : caméra portée ou fixe, avant seul ou double caméra. Vérifiez ensuite comment récupérer vos vidéos et quels accessoires sont requis. Une définition supérieure ne garantit pas la lecture de toutes les plaques, notamment de nuit. Le prix du kit doit être comparé à équipement équivalent, carte mémoire et alimentation comprises si elles sont nécessaires.</p><h2 className="mt-8 text-2xl font-bold">Et si aucun ne correspond à mon usage ?</h2><p className="mt-4 leading-8">Le quiz vous aide à préciser vos priorités ; le comparateur général permet d’examiner d’autres modèles. Pour une compatibilité qui n’est pas documentée, contactez-nous avant de commander.</p><div className="mt-6 flex flex-wrap gap-4"><Link className="btn-primary" href="/quiz/">Trouver ma dashcam</Link><Link className="btn-secondary" href="/comparatif/">Comparer toute la sélection</Link></div></section></article></StorefrontLayout>;
}
