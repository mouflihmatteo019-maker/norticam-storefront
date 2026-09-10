import { describe, expect, it } from 'vitest';
import { products } from './store-data';
import { makeMockReviews } from './mock-reviews';
import { reviewSummary } from './reviews';
describe('preproduction review fixture',()=>{
 it('creates 100 deterministic reviews per catalogue product',()=>{for(const product of products){const reviews=makeMockReviews(product);expect(reviews).toHaveLength(100);expect(makeMockReviews(product)).toEqual(reviews);expect(new Set(reviews.map(r=>r.id)).size).toBe(100);}});
 it('keeps visual aggregate between 4.8 and 5 without adding schema data',()=>{for(const product of products){const summary=reviewSummary(makeMockReviews(product));expect(summary.average).toBeGreaterThanOrEqual(4.8);expect(summary.average).toBeLessThanOrEqual(5);expect(summary.distribution[5]).toBeGreaterThan(summary.distribution[4]);expect(summary.distribution[1]).toBe(0);}});
});
