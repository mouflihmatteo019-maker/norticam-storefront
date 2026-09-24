import { themeRuntime } from './theme-runtime';
type Item = { id: string; name: string; price: number; quantity: number };
type Consent = { analytics: boolean; marketing: boolean };
type CommerceEvent =
  | "view_item"
  | "add_to_cart"
  | "remove_from_cart"
  | "view_cart"
  | "begin_checkout";
const consentKey = "norticam-consent-v1";
const browser = () => window as any;
export const analyticsConfigured = !!(
  import.meta.env.VITE_GA4_ID ||
  import.meta.env.VITE_META_PIXEL_ID ||
  import.meta.env.VITE_GOOGLE_ADS_ID
);
export function readConsent(): Consent | null {
  try {
    return JSON.parse(localStorage.getItem(consentKey) || "null");
  } catch {
    return null;
  }
}
export function saveConsent(value: Consent) {
  try {
    localStorage.setItem(consentKey, JSON.stringify(value));
  } catch {}
  window.dispatchEvent(new Event("norticam-consent"));
  configureAnalytics();
}
function script(id: string, src: string) {
  if (document.getElementById(id)) return;
  const el = document.createElement("script");
  el.id = id;
  el.src = src;
  el.async = true;
  document.head.append(el);
}
function adsLabel(name: CommerceEvent) {
  return (
    {
      add_to_cart: import.meta.env.VITE_GOOGLE_ADS_ADD_TO_CART_LABEL,
      begin_checkout: import.meta.env.VITE_GOOGLE_ADS_BEGIN_CHECKOUT_LABEL,
    } as Partial<Record<CommerceEvent, string>>
  )[name];
}
export function configureAnalytics() {
  if (themeRuntime()) return; // Native themes use Shopify customer events/app pixels.
  const consent = readConsent();
  const w = browser();
  const ga = import.meta.env.VITE_GA4_ID;
  const ads = import.meta.env.VITE_GOOGLE_ADS_ID;
  w.dataLayer ||= [];
  w.gtag ||= function () {
    w.dataLayer.push(arguments);
  };
  w.gtag("consent", "update", {
    analytics_storage: consent?.analytics ? "granted" : "denied",
    ad_storage: consent?.marketing ? "granted" : "denied",
    ad_user_data: consent?.marketing ? "granted" : "denied",
    ad_personalization: consent?.marketing ? "granted" : "denied",
  });
  if ((consent?.analytics && ga) || (consent?.marketing && ads)) {
    script(
      "norticam-google",
      `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga || ads)}`
    );
    if (!w.norticamGoogle) {
      w.norticamGoogle = true;
      w.gtag("js", new Date());
    }
    if (consent?.analytics && ga && !w.norticamGa) {
      w.norticamGa = true;
      w.gtag("config", ga, { send_page_view: false });
    }
    if (consent?.marketing && ads && !w.norticamAds) {
      w.norticamAds = true;
      w.gtag("config", ads);
    }
  }
  const pixel = import.meta.env.VITE_META_PIXEL_ID;
  if (pixel && consent?.marketing) {
    if (!w.fbq) {
      const f: any = function (...args: unknown[]) {
        f.callMethod ? f.callMethod(...args) : f.queue.push(args);
      };
      f.queue = [];
      f.loaded = true;
      f.version = "2.0";
      w.fbq = f;
    }
    if (!w.norticamMeta) {
      w.norticamMeta = true;
      script("norticam-meta", "https://connect.facebook.net/en_US/fbevents.js");
      w.fbq("init", pixel);
    }
    w.fbq("consent", "grant");
  } else w.fbq?.("consent", "revoke");
}
export function trackPage() {
  if (themeRuntime()) return;
  const consent = readConsent();
  const w = browser();
  if (consent?.analytics && import.meta.env.VITE_GA4_ID)
    w.gtag?.("event", "page_view", {
      page_location: location.href,
      page_title: document.title,
    });
  if (consent?.marketing && import.meta.env.VITE_META_PIXEL_ID)
    w.fbq?.("track", "PageView");
}
export function trackEvent(
  name: string,
  params: Record<string, string | number | boolean> = {}
) {
  if (themeRuntime()) return;
  const consent = readConsent();
  if (consent?.analytics && import.meta.env.VITE_GA4_ID)
    browser().gtag?.("event", name, params);
}
export function trackCommerce(
  name: CommerceEvent,
  items: Item[],
  currency: string,
  total?: number
) {
  if (themeRuntime()) return;
  if (
    !/^[A-Z]{3}$/.test(currency) ||
    !items.length ||
    items.some(
      i =>
        !i.id ||
        !Number.isFinite(i.price) ||
        i.price < 0 ||
        !Number.isInteger(i.quantity) ||
        i.quantity <= 0
    ) ||
    (total !== undefined && (!Number.isFinite(total) || total < 0))
  )
    return;
  const consent = readConsent();
  const w = browser();
  const value =
    total ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const payload = {
    currency,
    value,
    items: items.map(i => ({
      item_id: i.id,
      item_name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
  };
  if (consent?.analytics && import.meta.env.VITE_GA4_ID)
    w.gtag?.("event", name, payload);
  if (
    consent?.marketing &&
    import.meta.env.VITE_GOOGLE_ADS_ID &&
    adsLabel(name)
  )
    w.gtag?.("event", "conversion", {
      send_to: `${import.meta.env.VITE_GOOGLE_ADS_ID}/${adsLabel(name)}`,
      value,
      currency,
    });
  if (consent?.marketing && import.meta.env.VITE_META_PIXEL_ID) {
    const metaEvent = {
      view_item: "ViewContent",
      add_to_cart: "AddToCart",
      remove_from_cart: "RemoveFromCart",
      view_cart: "ViewContent",
      begin_checkout: "InitiateCheckout",
    }[name];
    w.fbq?.(
      "track",
      metaEvent,
      {
        currency,
        value,
        content_type: "product",
        content_ids: items.map(i => i.id),
        contents: items.map(i => ({
          id: i.id,
          quantity: i.quantity,
          item_price: i.price,
        })),
      },
      { eventID: crypto.randomUUID() }
    );
  }
}
