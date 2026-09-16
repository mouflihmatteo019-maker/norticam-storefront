// Fixtures are strictly local preview data, never public reviews or SEO content.
export const preproductionReviewsEnabled = import.meta.env.DEV && import.meta.env.VITE_PREVIEW_REVIEWS === 'true';
export const reviewPageSize = 8;
