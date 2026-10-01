import { describe, expect, it } from 'vitest';
import { products } from './store-data';
import { makeMockReviews } from './mock-reviews';
import { reviewSummary } from './reviews';
import { reviewsFor } from './reviews';
import { isLocalReviewPreview, preproductionReviewsEnabled } from './reviews-config';
describe('preproduction review fixture',()=>{
 it('creates distinct non-round deterministic counts per catalogue product',()=>{const counts=new Set<number>();for(const product of products){const reviews=makeMockReviews(product);expect(reviews.length).toBeGreaterThanOrEqual(80);expect(reviews.length).toBeLessThanOrEqual(130);expect(reviews.length%10).not.toBe(0);expect(makeMockReviews(product)).toEqual(reviews);expect(new Set(reviews.map(r=>r.id)).size).toBe(reviews.length);expect(new Set(reviews.map(r=>r.author)).size).toBe(reviews.length);counts.add(reviews.length);}expect(counts.size).toBe(products.length);});
 it('keeps visual aggregate between 4.8 and 5 without adding schema data',()=>{for(const product of products){const summary=reviewSummary(makeMockReviews(product));expect(summary.average).toBeGreaterThanOrEqual(4.8);expect(summary.average).toBeLessThanOrEqual(5);expect(summary.distribution[5]).toBeGreaterThan(summary.distribution[4]);expect(summary.distribution[1]).toBe(0);}});
 it('does not expose fixtures by default or on a public host',()=>{expect(preproductionReviewsEnabled).toBe(false);expect(reviewsFor(products[0])).toEqual([]);for(const host of ['norticam.com','www.norticam.com','z4a1f0-p0.myshopify.com','localhost.example.com','192.168.1.2'])expect(isLocalReviewPreview(host)).toBe(false);for(const host of ['127.0.0.1','localhost','[::1]'])expect(isLocalReviewPreview(host)).toBe(true);});
});
