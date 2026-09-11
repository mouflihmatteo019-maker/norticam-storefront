import { useEffect } from 'react';
import { SITE_URL } from '@/lib/shopify';
type JsonLd = Record<string, unknown> | Array<Record<string, unknown>>;
function meta(key: string, content: string, property = false) { const attribute = property ? 'property' : 'name'; let node = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`); if (!node) { node = document.createElement('meta'); node.setAttribute(attribute, key); document.head.append(node); } node.content = content; }
export function SEOHead({ title, description, image, type = 'website', jsonLd, noindex = false }: { title: string; description: string; image?: string | null; type?: 'website' | 'product' | 'article'; jsonLd?: JsonLd; noindex?: boolean }) {
  const path = typeof window === 'undefined' ? '/' : window.location.pathname;
  useEffect(() => {
    const canonicalUrl = SITE_URL + (path === '/' ? '/' : path.replace(/\/+$/, '') + '/');
    if (import.meta.env.VITE_GOOGLE_SITE_VERIFICATION) meta('google-site-verification', import.meta.env.VITE_GOOGLE_SITE_VERIFICATION);
    document.title = title; meta('description', description); meta('robots', noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large');
    meta('og:title', title, true); meta('og:description', description, true); meta('og:type', type === 'product' ? 'website' : type, true); meta('og:url', canonicalUrl, true);
    meta('twitter:card', image ? 'summary_large_image' : 'summary'); meta('twitter:title', title); meta('twitter:description', description);
    for (const key of ['og:image', 'twitter:image']) { if (image) meta(key, image, key.startsWith('og:')); else document.head.querySelector(`meta[${key.startsWith('og:') ? 'property' : 'name'}="${key}"]`)?.remove(); }
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (noindex) canonical?.remove(); else { if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); } canonical.href = canonicalUrl; }
    document.querySelectorAll('script[type="application/ld+json"]').forEach(n => n.remove());
    if (!noindex) { const script = document.createElement('script'); script.type = 'application/ld+json'; script.dataset.norticamJsonld = 'true'; script.textContent = JSON.stringify([{ '@context': 'https://schema.org', '@type': 'Organization', name: 'NORTICAM', url: SITE_URL, logo: SITE_URL + '/favicon.svg' }, ...(path !== '/' ? [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL + '/' }, { '@type': 'ListItem', position: 2, name: title.split('|')[0].trim(), item: canonicalUrl }] }] : []), ...(jsonLd ? Array.isArray(jsonLd) ? jsonLd : [jsonLd] : [])]); document.head.append(script); }
  }, [title, description, image, type, jsonLd, noindex, path]);
  return null;
}
