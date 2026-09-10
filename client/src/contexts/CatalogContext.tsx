import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { products as snapshot } from '@/lib/store-data';
import { loadCatalog, type StoreProduct } from '@/lib/shopify';
const fallback: StoreProduct[] = snapshot.map(p => ({ ...p, available: false, verified: false, variants: p.variants.map(v => ({ ...v, availableForSale: false })) }));
const Context = createContext({ products: fallback, loading: true, error: '', retry: () => {} });
export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState(fallback); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [attempt, setAttempt] = useState(0);
  useEffect(() => { let active = true; setLoading(true); setError(''); loadCatalog().then(p => { if (active) setProducts(p); }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [attempt]);
  return <Context.Provider value={{ products, loading, error, retry: () => setAttempt(n => n + 1) }}>{children}</Context.Provider>;
}
export function useCatalog() {
  const context = useContext(Context);
  return { ...context, dashcams: context.products.filter(p => p.type === 'Dashcam'), featuredDashcams: ['dashcam-3k-voiture', 'dashcam-avant-arriere', 'dashcam-4k'].map(h => context.products.find(p => p.handle === h)).filter((p): p is StoreProduct => !!p), productByHandle: (h?: string) => context.products.find(p => p.handle === h) };
}
