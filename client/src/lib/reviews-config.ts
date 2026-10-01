/** Synthetic testimonials are restricted to an explicitly enabled, local-only preview. */
export function isLocalReviewPreview(hostname: string): boolean {
  return ['localhost', '127.0.0.1', '[::1]', '::1'].includes(hostname);
}
export const preproductionReviewsEnabled =
  import.meta.env.VITE_PREVIEW_REVIEWS === 'true' &&
  typeof window !== 'undefined' &&
  isLocalReviewPreview(window.location.hostname);
export const reviewPageSize = 8;
