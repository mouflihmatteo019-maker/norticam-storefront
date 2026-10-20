import { fileURLToPath } from 'node:url';
export default {
  resolve: { alias: { '@': fileURLToPath(new URL('./client/src', import.meta.url)) } },
  esbuild: { jsx: 'automatic' },
  test: { environment: 'node', include: ['client/src/**/*.test.{ts,tsx}'], restoreMocks: true, poolOptions: { forks: { singleFork: true } } },
};
