/** Synthetic testimonials are enabled when VITE_PREVIEW_REVIEWS=true. */
export function isLocalReviewPreview(hostname: string): boolean {
  return ['localhost', '127.0.0.1', '[::1]', '::1'].includes(hostname);
}
export const preproductionReviewsEnabled =
  import.meta.env.VITE_PREVIEW_REVIEWS === 'true';
export const reviewPageSize = 8;
