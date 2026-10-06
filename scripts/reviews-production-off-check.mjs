import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const result = spawnSync(process.execPath, [resolve(root, 'node_modules/vitest/vitest.mjs'), 'run', 'client/src/lib/reviews.test.ts'], {
  cwd: root, stdio: 'inherit', env: { ...process.env, VITE_PREVIEW_REVIEWS: 'false' },
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
console.log('Review configuration: default off; synthetic reviews blocked on public hosts even with preview flag true: PASS. This is a unit configuration check, not a browser or schema audit.');
