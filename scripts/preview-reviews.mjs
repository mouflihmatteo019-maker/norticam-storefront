// Build optional mock data into local-only assets, never into the published theme.
import { spawnSync, spawn } from 'node:child_process';
const env = {...process.env, VITE_PREVIEW_REVIEWS:'true', NORTICAM_REVIEW_PREVIEW:'true'};
const build = spawnSync(process.execPath, ['node_modules/vite/bin/vite.js','build','--config','vite.theme.config.ts','--outDir','.tmp/review-preview-assets'], {env,stdio:'inherit'});
if(build.status !== 0) process.exit(build.status ?? 1);
const server = spawn(process.execPath, ['scripts/preview-shopify-theme.mjs'], {env,stdio:'inherit'});
server.on('exit', code => process.exit(code ?? 0));
process.on('SIGINT', () => server.kill('SIGINT'));
