import type { Product } from './store-data';
import { makeMockReviews, type Review } from './mock-reviews';
import { preproductionReviewsEnabled } from './reviews-config';
export type ReviewSummary = { count:number; average:number; distribution:Record<number,number> };
export function reviewsFor(product:Product): Review[] { return preproductionReviewsEnabled ? makeMockReviews(product) : []; }
export function reviewSummary(reviews:Review[]):ReviewSummary { const distribution:Record<number,number>={1:0,2:0,3:0,4:0,5:0}; reviews.forEach(r=>distribution[r.rating]++);const count=reviews.length;return {count,distribution,average:count?reviews.reduce((n,r)=>n+r.rating,0)/count:0}; }
