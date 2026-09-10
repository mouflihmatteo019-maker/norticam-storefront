import { useEffect, useState } from 'react';
import { analyticsConfigured, configureAnalytics, readConsent, saveConsent, trackPage } from '@/lib/analytics';
export default function ConsentBanner() {
  const [open, setOpen] = useState(() => analyticsConfigured && !readConsent());
  useEffect(() => { configureAnalytics(); const show = () => setOpen(true); window.addEventListener('norticam-cookie-settings', show); return () => window.removeEventListener('norticam-cookie-settings', show); }, []);
  function choose(analytics: boolean, marketing: boolean) { saveConsent({ analytics, marketing }); setOpen(false); if (analytics || marketing) trackPage(); }
  if (!open) return null;
  return <section aria-label="Préférences de confidentialité" className="fixed bottom-4 left-4 right-4 z-[90] mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"><h2 className="font-bold">Votre confidentialité</h2><p className="mt-2 text-sm leading-6 text-slate-600">Le panier utilise un stockage nécessaire. Avec votre accord, nous utilisons des outils de mesure d’audience et de publicité. Vous pouvez changer d’avis depuis le pied de page.</p><div className="mt-4 flex flex-wrap gap-2"><button className="btn-secondary" onClick={() => choose(false,false)}>Tout refuser</button><button className="btn-secondary" onClick={() => choose(true,false)}>Audience uniquement</button><button className="btn-secondary" onClick={() => choose(true,true)}>Tout accepter</button></div></section>;
}
