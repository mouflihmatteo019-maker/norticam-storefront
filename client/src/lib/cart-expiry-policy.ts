/**
 * Disabled for every visitor. A Shopify cart is not a stock reservation.
 * Keep the former implementation recoverable, but do not reactivate it merely
 * for marketing urgency or after a Merchant Center review.
 */
export const CART_EXPIRY_ENABLED: boolean = false;
export const cartExpiryAllowed = () => CART_EXPIRY_ENABLED;
