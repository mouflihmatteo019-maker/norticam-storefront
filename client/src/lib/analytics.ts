type Item = { id: string; name: string; price: number; quantity: number };
type Consent = { analytics: boolean; marketing: boolean };
const consentKey = 'norticam-consent-v1';
const browser = () => window as any;
export const analyticsConfigured = !!(import.meta.env.VITE_GA4_ID || import.meta.env.VITE_META_PIXEL_ID || import.meta.env.VITE_GOOGLE_ADS_ID);
export function readConsent(): Consent | null { try { return JSON.parse(localStorage.getItem(consentKey) || 'null'); } catch { return null; } }
export function saveConsent(value: Consent) { try { localStorage.setItem(consentKey, JSON.stringify(value)); } catch {} window.dispatchEvent(new Event('norticam-consent')); configureAnalytics(); }
function script(id: string, src: string) { if (document.getElementById(id)) return; const el = document.createElement('script'); el.id = id; el.src = src; el.async = true; document.head.append(el); }
export function configureAnalytics() {
  const consent = readConsent(); const w = browser(); const ga = import.meta.env.VITE_GA4_ID; const ads = import.meta.env.VITE_GOOGLE_ADS_ID;
  w.dataLayer ||= []; w.gtag ||= function () { w.dataLayer.push(arguments); };
  w.gtag('consent', 'update', { analytics_storage: consent?.analytics ? 'granted' : 'denied', ad_storage: consent?.marketing ? 'granted' : 'denied', ad_user_data: consent?.marketing ? 'granted' : 'denied', ad_personalization: consent?.marketing ? 'granted' : 'denied' });
  if ((consent?.analytics && ga) || (consent?.marketing && ads)) { script('norticam-google', `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga || ads)}`); if (!w.norticamGoogle) { w.norticamGoogle = true; w.gtag('js', new Date()); } if (consent?.analytics && ga && !w.norticamGa) { w.norticamGa = true; w.gtag('config', ga, { send_page_view: false }); } if (consent?.marketing && ads && !w.norticamAds) { w.norticamAds = true; w.gtag('config', ads); } }
  const pixel = import.meta.env.VITE_META_PIXEL_ID;
  if (pixel && consent?.marketing) { if (!w.fbq) { const f: any = function (...args: unknown[]) { f.callMethod ? f.callMethod(...args) : f.queue.push(args); }; f.queue = []; f.loaded = true; f.version = '2.0'; w.fbq = f; } if (!w.norticamMeta) { w.norticamMeta = true; script('norticam-meta', 'https://connect.facebook.net/en_US/fbevents.js'); w.fbq('init', pixel); } w.fbq('consent', 'grant'); } else w.fbq?.('consent', 'revoke');
}
export function trackPage() { const consent = readConsent(); const w = browser(); if (consent?.analytics && import.meta.env.VITE_GA4_ID) w.gtag?.('event', 'page_view', { page_location: location.href, page_title: document.title }); if (consent?.marketing && import.meta.env.VITE_META_PIXEL_ID) w.fbq?.('track', 'PageView'); }
export function trackCommerce(name: 'view_item' | 'add_to_cart' | 'begin_checkout', items: Item[], currency: string, total?: number) {
  if (!/^[A-Z]{3}$/.test(currency) || !items.length || items.some(i => !i.id || !Number.isFinite(i.price) || i.price < 0 || !Number.isInteger(i.quantity) || i.quantity <= 0) || (total !== undefined && (!Number.isFinite(total) || total < 0))) return;
  const consent = readConsent(); const w = browser(); const value = total ?? items.reduce((s, i) => s + i.price * i.quantity, 0);
  if (consent?.analytics && import.meta.env.VITE_GA4_ID) w.gtag?.('event', name, { currency, value, items: items.map(i => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity })) });
  if (consent?.marketing && import.meta.env.VITE_META_PIXEL_ID) w.fbq?.('track', { view_item: 'ViewContent', add_to_cart: 'AddToCart', begin_checkout: 'InitiateCheckout' }[name], { currency, value, content_type: 'product', content_ids: items.map(i => i.id), contents: items.map(i => ({ id: i.id, quantity: i.quantity, item_price: i.price })) }, { eventID: crypto.randomUUID() });
}
