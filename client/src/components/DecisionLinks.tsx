import { Link } from './Navigation';
export function DecisionLinks() {
  const links = [
    ['/conseils/dashcam-sans-fil/', 'Wi-Fi, batterie : comprendre le « sans fil »'],
    ['/conseils/dashcam-voiture-discrete/', 'Préparer une installation discrète'],
    ['/comparatif/70mai-a510-vs-ddpai-z50-pro/', '70mai A510 ou DDPAI Z50 Pro ?'],
    ['/comparatif/70mai-a510-vs-ddpai-n1-dual/', '70mai A510 ou DDPAI N1 Dual ?'],
    ['/comparatif/freedconn-r1-plus-vs-fodsports-fx60c/', 'Caméra de casque : R1 Plus ou FX60C ?'],
  ];
  return <nav aria-label="Guides et comparatifs pour décider" className="mt-12 border-t border-slate-200 pt-8"><h2 className="font-display text-2xl font-extrabold">Pour aller plus loin dans votre choix</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{links.map(([href,title]) => <Link key={href} href={href} className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-bold text-[#1672d8] hover:bg-blue-50">{title} →</Link>)}</div></nav>;
}
