// Reviews remain off in production by default. Local development enables the visual review pass.
export const preproductionReviewsEnabled = import.meta.env.DEV || import.meta.env.VITE_PREPROD_REVIEWS === 'true';
export const reviewPageSize = 8;
