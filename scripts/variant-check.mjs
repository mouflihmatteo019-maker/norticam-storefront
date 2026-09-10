#!/usr/bin/env node
/** Basic sanity: every product in store-data has at least one variant id. */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('../client/src/lib/store-data.ts', import.meta.url), 'utf8');
const handles = [...src.matchAll(/"handle":\s*"([^"]+)"/g)].map(m => m[1]);
const variantIds = [...src.matchAll(/"id":\s*"gid:\/\/shopify\/ProductVariant\/(\d+)"/g)].map(m => m[1]);
if (!handles.length) { console.error('No product handles found'); process.exit(1); }
if (variantIds.length < handles.length) { console.error('Fewer variants than products'); process.exit(1); }
console.log(`variant-check: ${handles.length} products, ${variantIds.length} variants`);
