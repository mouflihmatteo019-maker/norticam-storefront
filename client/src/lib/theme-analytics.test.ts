import { afterEach, describe, expect, it, vi } from 'vitest';
import { nativeFunnelPayload, publishNativeFunnel } from './theme-analytics';
import { trackCommerce, trackEvent } from './analytics';
afterEach(() => vi.unstubAllGlobals());
function runtime(allowed: boolean) {
  const publish = vi.fn();
  vi.stubGlobal('window', { NorticamTheme: {}, Shopify: { analytics: { publish }, customerPrivacy: { analyticsProcessingAllowed: () => allowed } } });
  return publish;
}
describe('native funnel events', () => {
  it('requires analytics permission and an available API', () => {
    expect(publishNativeFunnel('quiz_started')).toBe(false);
    const publish = runtime(false);
    expect(publishNativeFunnel('quiz_started')).toBe(false);
    expect(publish).not.toHaveBeenCalled();
    vi.stubGlobal('window', { Shopify: { analytics: { publish } } });
    expect(publishNativeFunnel('quiz_started')).toBe(false);
  });
  it('publishes once in the Shopify namespace without collecting answers or PII', () => {
    const publish = runtime(true);
    trackEvent('quiz_step_completed', { step: 2, question: 'coverage', answer: 'dual', email: 'person@example.com', order: '#1234' });
    expect(publish).toHaveBeenCalledTimes(1);
    expect(publish).toHaveBeenCalledWith('norticam:quiz_step_completed', { step: 2, question: 'coverage' });
  });
  it.each(['purchase', 'checkout_completed', 'add_to_cart', 'view_item', 'begin_checkout', 'unknown'])('does not duplicate or invent %s', name => {
    const publish = runtime(true);
    expect(publishNativeFunnel(name)).toBe(false);
    expect(publish).not.toHaveBeenCalled();
  });
  it('leaves all native commerce events to Shopify', () => {
    const publish = runtime(true);
    trackCommerce('begin_checkout', [{ id: '1', name: 'Camera', price: 149.90, quantity: 1 }], 'EUR');
    trackCommerce('add_to_cart', [{ id: '1', name: 'Camera', price: 149.90, quantity: 1 }], 'EUR');
    expect(publish).not.toHaveBeenCalled();
  });
  it.each([
    ['quiz_step_completed', { step: 0, question: 'vehicle' }],
    ['quiz_step_completed', { step: 6, question: 'vehicle' }],
    ['quiz_step_completed', { step: 1, question: 'email' }],
    ['quiz_completed', { recommendation_count: -1 }],
    ['quiz_completed', { recommendation_count: 4 }],
    ['quiz_completed', { recommendation_count: NaN }],
  ])('rejects invalid %s payloads', (name, params) => {
    expect(nativeFunnelPayload(name as string, params as any)).toBeNull();
  });
  it('handles no recommendation without fabricating a commerce event', () => {
    expect(nativeFunnelPayload('quiz_completed', { recommendation_count: 0 })).toEqual({ recommendation_count: 0 });
  });
  it.each(['contact_email_opened', 'contact_form_submit', 'cart_expired'])('does not forward customer data in %s', name => {
    const payload = nativeFunnelPayload(name, { email: 'person@example.com', message: 'Private message', order_id: '1234' });
    expect(JSON.stringify(payload)).not.toMatch(/person|Private|1234/);
  });
  it('never breaks shopping if the publisher fails', async () => {
    const publish = runtime(true);
    publish.mockImplementationOnce(() => { throw new Error('Unavailable'); });
    expect(publishNativeFunnel('quiz_started')).toBe(false);
    publish.mockReturnValueOnce(Promise.reject(new Error('Unavailable')));
    expect(publishNativeFunnel('quiz_started')).toBe(true);
    await Promise.resolve();
  });
});
