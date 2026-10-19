import { afterEach, describe, expect, it, vi } from 'vitest';
import { configureAnalytics, trackCommerce, trackEvent, trackPage } from './analytics';
import { publishNativeFunnel } from './theme-analytics';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('native Shopify tracking ownership and consent boundaries', () => {
  it('ignores legacy tracking IDs and local consent in a native Shopify theme', () => {
    vi.stubEnv('VITE_GA4_ID', 'G-LEGACY-FIXTURE');
    vi.stubEnv('VITE_GOOGLE_ADS_ID', 'AW-LEGACY-FIXTURE');
    vi.stubEnv('VITE_GOOGLE_ADS_ADD_TO_CART_LABEL', 'fixture-cart');
    vi.stubEnv('VITE_GOOGLE_ADS_BEGIN_CHECKOUT_LABEL', 'fixture-checkout');
    vi.stubEnv('VITE_META_PIXEL_ID', 'LEGACY-FIXTURE');
    const publish = vi.fn(), gtag = vi.fn(), fbq = vi.fn();
    const getItem = vi.fn(() => JSON.stringify({ analytics: true, marketing: true }));
    const createElement = vi.fn(), append = vi.fn();
    vi.stubGlobal('localStorage', { getItem });
    vi.stubGlobal('document', { createElement, head: { append } });
    vi.stubGlobal('window', {
      NorticamTheme: {}, gtag, fbq,
      Shopify: { analytics: { publish }, customerPrivacy: { analyticsProcessingAllowed: () => false } },
    });

    configureAnalytics();
    trackPage();
    for (const name of ['view_item', 'add_to_cart', 'remove_from_cart', 'view_cart', 'begin_checkout'] as const) {
      trackCommerce(name, [{ id: '123', name: 'Camera', price: 12.5, quantity: 2 }], 'EUR');
    }
    trackEvent('quiz_started');
    trackEvent('purchase', { value: 25, currency: 'EUR' });

    expect(publish).not.toHaveBeenCalled();
    expect(gtag).not.toHaveBeenCalled();
    expect(fbq).not.toHaveBeenCalled();
    expect(getItem).not.toHaveBeenCalled();
    expect(createElement).not.toHaveBeenCalled();
    expect(append).not.toHaveBeenCalled();
  });

  it.each([
    'purchase', 'checkout_completed', 'checkout_started', 'product_viewed', 'product_added_to_cart',
    'view_item', 'add_to_cart', 'remove_from_cart', 'view_cart', 'begin_checkout',
  ])('does not convert a custom call into a second native commerce event: %s', name => {
    const publish = vi.fn(), gtag = vi.fn(), fbq = vi.fn();
    vi.stubGlobal('window', {
      NorticamTheme: {}, gtag, fbq,
      Shopify: { analytics: { publish }, customerPrivacy: { analyticsProcessingAllowed: () => true } },
    });
    trackEvent(name, { value: 25, currency: 'EUR', transaction_id: 'fixture-order' });
    expect(publish).not.toHaveBeenCalled();
    expect(gtag).not.toHaveBeenCalled();
    expect(fbq).not.toHaveBeenCalled();
  });

  it('applies current analytics permission on every interaction, without replay after consent or revocation', () => {
    let analyticsAllowed = false;
    const publish = vi.fn();
    vi.stubGlobal('window', {
      NorticamTheme: {},
      Shopify: {
        analytics: { publish },
        customerPrivacy: {
          analyticsProcessingAllowed: () => analyticsAllowed,
          currentVisitorConsent: () => ({ analytics: 'no', marketing: 'yes' }),
        },
      },
    });
    // Marketing-only consent does not authorize an analytics interaction.
    trackEvent('quiz_started');
    expect(publish).not.toHaveBeenCalled();
    analyticsAllowed = true;
    expect(publish).not.toHaveBeenCalled();
    trackEvent('quiz_step_completed', { step: 1, question: 'vehicle' });
    expect(publish).toHaveBeenCalledTimes(1);
    expect(publish).toHaveBeenCalledWith('norticam:quiz_step_completed', { step: 1, question: 'vehicle' });
    analyticsAllowed = false;
    trackEvent('quiz_completed', { recommendation_count: 2 });
    expect(publish).toHaveBeenCalledTimes(1);
  });

  it('never overrides processing denial with an earlier yes consent', () => {
    const publish = vi.fn();
    vi.stubGlobal('window', {
      Shopify: {
        analytics: { publish },
        customerPrivacy: {
          analyticsProcessingAllowed: () => false,
          currentVisitorConsent: () => ({ analytics: 'yes', marketing: 'yes' }),
        },
      },
    });
    expect(publishNativeFunnel('quiz_started')).toBe(false);
    expect(publish).not.toHaveBeenCalled();
  });

  it.each(['', 'no', true, 'true', undefined])('fails closed for legacy analytics consent value %s', analytics => {
    const publish = vi.fn();
    vi.stubGlobal('window', {
      Shopify: { analytics: { publish }, customerPrivacy: { currentVisitorConsent: () => ({ analytics }) } },
    });
    expect(publishNativeFunnel('quiz_started')).toBe(false);
    expect(publish).not.toHaveBeenCalled();
  });

  it('supports explicit legacy analytics consent without forwarding marketing or personal data', () => {
    const publish = vi.fn();
    vi.stubGlobal('window', {
      Shopify: { analytics: { publish }, customerPrivacy: { currentVisitorConsent: () => ({ analytics: 'yes', marketing: 'no' }) } },
    });
    expect(publishNativeFunnel('contact_email_opened', { email: 'private@example.com' })).toBe(true);
    expect(publish).toHaveBeenCalledTimes(1);
    expect(publish).toHaveBeenCalledWith('norticam:contact_email_opened', { source: 'contact_page' });
  });

  it('does not interrupt shopping when the privacy API fails', () => {
    const publish = vi.fn();
    vi.stubGlobal('window', {
      Shopify: {
        analytics: { publish },
        customerPrivacy: { analyticsProcessingAllowed: () => { throw new Error('Unavailable'); } },
      },
    });
    expect(publishNativeFunnel('quiz_started')).toBe(false);
    expect(publish).not.toHaveBeenCalled();
  });

  it('does not queue interactions when the publisher becomes available after consent', () => {
    const publish = vi.fn();
    const shopify = { customerPrivacy: { analyticsProcessingAllowed: () => true }, analytics: {} as { publish?: typeof publish } };
    vi.stubGlobal('window', { Shopify: shopify });
    expect(publishNativeFunnel('quiz_started')).toBe(false);
    shopify.analytics.publish = publish;
    expect(publish).not.toHaveBeenCalled();
    expect(publishNativeFunnel('quiz_completed', { recommendation_count: 1 })).toBe(true);
    expect(publish).toHaveBeenCalledTimes(1);
    expect(publish).toHaveBeenCalledWith('norticam:quiz_completed', { recommendation_count: 1 });
  });
});
