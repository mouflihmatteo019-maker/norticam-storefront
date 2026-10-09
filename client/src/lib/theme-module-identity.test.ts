import { expect, it } from 'vitest';
import fs from 'node:fs/promises';

it('keeps one content-hashed runtime behind the versioned Shopify loader', async () => {
  const loader = await fs.readFile('assets/norticam-app.js', 'utf8');
  expect(loader.trim()).toMatch(/^import "\.\/norticam-runtime-[\w-]+\.js";$/);
  const runtime = loader.match(/norticam-runtime-[\w-]+\.js/)![0];
  expect((await fs.stat(`assets/${runtime}`)).size).toBeGreaterThan(1000);
  const chunks = (await fs.readdir('dist/theme-runtime')).filter(name => name.endsWith('.js'));
  for (const name of chunks) {
    const source = await fs.readFile(`dist/theme-runtime/${name}`, 'utf8');
    expect(source).not.toMatch(/(?:from\s*|import\s*\()\s*["']\.\/norticam-app\.js/);
  }
});
