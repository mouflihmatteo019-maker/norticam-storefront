#!/usr/bin/env node
/** Fail CI if preprod reviews are enabled in a production-oriented env. */
const enabled = process.env.VITE_PREPROD_REVIEWS === 'true';
if (enabled && process.env.NODE_ENV === 'production') {
  console.error('VITE_PREPROD_REVIEWS=true is not allowed with NODE_ENV=production');
  process.exit(1);
}
console.log('reviews-production-off-check: ok');
