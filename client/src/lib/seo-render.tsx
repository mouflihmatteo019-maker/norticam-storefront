import { createContext } from 'react';
import type { StoreProduct } from './shopify';
export type HeadData = { title: string; description: string; image?: string | null; type?: string; jsonLd?: Record<string, unknown> | Record<string, unknown>[]; noindex?: boolean };
export const RenderContext = createContext<{ path: string; catalog: StoreProduct[]; head?: HeadData } | null>(null);
export function canonicalPath(path: string) {
  const boundary = path.search(/[?#]/);
  const pathname = boundary < 0 ? path : path.slice(0, boundary);
  const suffix = boundary < 0 ? '' : path.slice(boundary);
  return (pathname === '/' ? '/' : pathname.replace(/\/+$/, '') + '/') + suffix;
}
