import type { ComponentType } from 'react';
import { themeCategories } from './theme-runtime';

// Shopify owns navigation: fetch only the React page needed by this document.
export async function loadThemePage(path: string, nativeContent = false): Promise<{ Page: ComponentType<any>; route: string }> {
  if (nativeContent) return { Page: (await import('../pages/NativeThemeContent')).default, route: '*' };
  if (path === '/') return { Page: (await import('../pages/ConversionHome')).default, route: '/' };
  if (path === '/boutique' || themeCategories.includes(path.slice(1))) return { Page: (await import('../pages/ShopifyStorePages')).Shop, route: path };
  if (path === '/comparatif') return { Page: (await import('../pages/ShopifyStorePages')).Compare, route: path };
  if (path === '/conseils') return { Page: (await import('../pages/ShopifyStorePages')).Guides, route: path };
  if (path.startsWith('/produits/')) return { Page: (await import('../pages/ProductConversion')).default, route: '/produits/:handle' };
  if (path.startsWith('/comparatif/')) return { Page: (await import('../pages/ProductComparison')).default, route: '/comparatif/:slug' };
  if (path.startsWith('/conseils/')) return { Page: (await import('../pages/GuideArticle')).GuideArticle, route: '/conseils/:slug' };
  if (path === '/quiz') return { Page: (await import('../pages/ConversionQuiz')).default, route: path };
  if (path === '/suivi-colis') return { Page: (await import('../pages/OrderTracking')).default, route: path };
  if (path === '/informations/contact') return { Page: (await import('../pages/Contact')).default, route: path };
  if (path.startsWith('/informations/')) return { Page: (await import('../pages/Policy')).default, route: '/informations/:kind' };
  return { Page: (await import('../pages/NotFound')).default, route: '*' };
}
