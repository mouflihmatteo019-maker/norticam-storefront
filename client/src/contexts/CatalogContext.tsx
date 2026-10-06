import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { products as snapshot } from '@/lib/store-data';
import { loadCatalog, mapProduct, type StoreProduct } from '@/lib/shopify';
import { themeRuntime, resolveProductHandle } from '@/lib/theme-runtime';
import { RenderContext } from '@/lib/seo-render';
const fallback: StoreProduct[] = snapshot.map(p => ({ ...p, available: false, verified: false, variants: p.variants.map(v => ({ ...v, availableForSale: false })) }));
const Context = createContext({ products: fallback, loading: true, error: '', retry: () => {} });
export function CatalogProvider({ children }: { children: ReactNode }) {
  const rendering = useContext(RenderContext);
  const [products, setProducts] = useState(rendering?.catalog || themeRuntime()?.products.map(mapProduct) || fallback); const [loading, setLoading] = useState(!rendering && !themeRuntime()); const [error, setError] = useState(''); const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    // Shopify already provided a verified catalogue before this bundle executes.
    // Re-entering loading here clears product content during its first paint.
    if (themeRuntime()) return;
    let active = true;
    setLoading(true);
    setError('');
    loadCatalog().then(p => { if (active) setProducts(p); })
      .catch(e => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);
  return <Context.Provider value={{ products, loading, error, retry: () => setAttempt(n => n + 1) }}>{children}</Context.Provider>;
}
export function useCatalog() {
  const context = useContext(Context);
  const productByHandle = (h?: string) => resolveProductHandle(h || '', context.products) as StoreProduct | undefined;
  return { ...context, dashcams: context.products.filter(p => p.type === 'Dashcam'), featuredDashcams: ['dashcam-3k-voiture', 'dashcam-avant-arriere', 'dashcam-4k'].map(productByHandle).filter((p): p is StoreProduct => !!p), productByHandle };
}
