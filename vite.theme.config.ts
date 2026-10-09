import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  // Shopify serves assets below /cdn/shop/t/<theme>/assets/, not the domain root.
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve('client/src'), '@shared': path.resolve('shared'), '@assets': path.resolve('attached_assets') } },
  publicDir: false,
  build: {
    outDir: 'dist/theme-runtime', emptyOutDir: true, cssCodeSplit: false,
    rollupOptions: { input: 'client/src/theme-entry.tsx', output: {
      format: 'es',
      chunkFileNames: 'norticam-chunk-[name]-[hash].js',
      // Shopify versions the loader URL with ?v=...; lazy chunks must share the
      // exact same runtime URL, otherwise React and its contexts load twice.
      entryFileNames: 'norticam-runtime-[hash].js', assetFileNames: 'norticam-[name][extname]',
    } },
  },
});
