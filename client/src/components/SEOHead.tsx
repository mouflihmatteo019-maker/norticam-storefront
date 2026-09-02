/** SEO layer: route-specific metadata, canonical URL and JSON-LD for the NORTICAM storefront. */
import { useEffect } from "react";

type JsonLd = Record<string, unknown> | Array<Record<string, unknown>>;

function updateMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
  let node = document.head.querySelector<HTMLMetaElement>(selector);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attribute, key);
    document.head.appendChild(node);
  }
  node.content = content;
}

export function SEOHead({ title, description, image, type = "website", jsonLd }: { title: string; description: string; image?: string | null; type?: "website" | "product" | "article"; jsonLd?: JsonLd }) {
  useEffect(() => {
    const canonicalUrl = `${window.location.origin}${window.location.pathname}`;
    document.title = title;
    updateMeta('meta[name="description"]', "name", "description", description);
    updateMeta('meta[name="robots"]', "name", "robots", "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1");
    updateMeta('meta[property="og:title"]', "property", "og:title", title);
    updateMeta('meta[property="og:description"]', "property", "og:description", description);
    updateMeta('meta[property="og:type"]', "property", "og:type", type);
    updateMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    updateMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    updateMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    updateMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    if (image) {
      updateMeta('meta[property="og:image"]', "property", "og:image", image);
      updateMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
    }
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = canonicalUrl;
    const structuredData = [{
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "NORTICAM",
      url: window.location.origin,
      logo: `${window.location.origin}/manus-storage/norticam-mark_79e2d2ea.png`,
      description: "Sélection de dashcams voiture et moto pour documenter les trajets.",
    }, ...(jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [])];
    let script = document.head.querySelector<HTMLScriptElement>('script[data-norticam-jsonld]');
    if (!script) { script = document.createElement("script"); script.type = "application/ld+json"; script.dataset.norticamJsonld = "true"; document.head.appendChild(script); }
    script.textContent = JSON.stringify(structuredData);
  }, [description, image, jsonLd, title, type]);
  return null;
}
