// Native commerce events stay owned by Shopify/app pixels. This bridge emits
// only namespaced, non-personal funnel interactions, never a purchase event.
const questionKeys = new Set(['vehicle', 'coverage', 'priority', 'parking', 'budget']);
type Params = Record<string, string | number | boolean>;
function boundedCount(value: unknown, maximum: number) {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= maximum ? value : undefined;
}
export function nativeFunnelPayload(name: string, params: Params = {}): Params | null {
  switch (name) {
    case 'quiz_started': return { question_count: 5 };
    case 'quiz_step_completed': {
      const step = boundedCount(params.step, 5);
      if (!step || typeof params.question !== 'string' || !questionKeys.has(params.question)) return null;
      return { step, question: params.question };
    }
    case 'quiz_completed': {
      const count = boundedCount(params.recommendation_count, 3);
      return count === undefined ? null : { recommendation_count: count };
    }
    case 'contact_email_opened': return { source: 'contact_page' };
    case 'contact_form_submit': return { source: 'contact_page' };
    case 'cart_expired': return {};
    default: return null;
  }
}
export function publishNativeFunnel(name: string, params: Params = {}): boolean {
  const payload = nativeFunnelPayload(name, params);
  if (!payload || typeof window === 'undefined') return false;
  const shopify = (window as any).Shopify;
  const privacy = shopify?.customerPrivacy;
  if (!privacy || typeof shopify?.analytics?.publish !== 'function') return false;
  try {
    // Do not load tracking scripts or replay interactions collected before consent.
    const allowed = typeof privacy.analyticsProcessingAllowed === 'function'
      ? privacy.analyticsProcessingAllowed() === true
      : privacy.currentVisitorConsent?.().analytics === 'yes';
    if (!allowed) return false;
    const result = shopify.analytics.publish(`norticam:${name}`, payload);
    if (result && typeof result.catch === 'function') result.catch(() => {});
    return true;
  } catch {
    // A tracking failure must never interrupt the visitor's shopping journey.
    return false;
  }
}
