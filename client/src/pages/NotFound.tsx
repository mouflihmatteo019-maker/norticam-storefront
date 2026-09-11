import StorefrontLayout from '@/components/StorefrontLayout';
import { SEOHead } from '@/components/SEOHead';
import { Link } from 'wouter';
export default function NotFound() { return <StorefrontLayout><SEOHead title="Page introuvable | NORTICAM" description="Retrouvez les dashcams voiture et moto et nos conseils pour choisir." noindex /><section className="container py-24 text-center"><p className="eyebrow">Erreur 404</p><h1 className="mt-4 font-display text-4xl font-extrabold">Cette page est introuvable.</h1><p className="mt-5 text-slate-600">L’adresse a peut-être changé. Retrouvez votre prochain trajet dans notre sélection.</p><Link href="/boutique" className="btn-primary mt-8">Voir les dashcams</Link></section></StorefrontLayout>; }
