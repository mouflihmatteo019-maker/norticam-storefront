import { renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'node:stream';
import { Router } from 'wouter';
import App from './App';
import { RenderContext, type HeadData } from './lib/seo-render';
export { loadCatalog, SITE_URL } from './lib/shopify';
import type { StoreProduct } from './lib/shopify';
export async function render(path: string, catalog: StoreProduct[]) {
  const state: { path: string; catalog: StoreProduct[]; head?: HeadData } = { path, catalog };
  const html = await new Promise<string>((resolve, reject) => {
    const output = new PassThrough(); let result = '';
    output.on('data', chunk => result += chunk); output.on('end', () => resolve(result)); output.on('error', reject);
    const stream = renderToPipeableStream(<Router ssrPath={path}><RenderContext.Provider value={state}><App /></RenderContext.Provider></Router>, {
      onAllReady() { stream.pipe(output); }, onError(error) { reject(error); },
    });
  });
  if (!state.head) throw new Error('Missing SEO metadata: ' + path);
  return { html, head: state.head };
}
