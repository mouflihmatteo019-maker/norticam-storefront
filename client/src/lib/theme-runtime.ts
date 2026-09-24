export type ThemeRuntime = {
  path: string; root: string; currency: string; products: any[];
  assets: Record<string, string>; payments: string; contactForm: string;
};
declare global { interface Window { NorticamTheme?: ThemeRuntime } }
export const themeRuntime = () => typeof window !== 'undefined' ? window.NorticamTheme : undefined;
export const themeCategories = ['dashcam-voiture', 'dashcam-moto', 'meilleure-dashcam', 'dashcam-vision-nocturne', 'dashcam-gps', 'dashcam-voiture-4k', 'dashcam-voiture-360', 'dashcam-moto-casque', 'ecran-moto-carplay', 'dashcam-avant-arriere', 'mode-parking'];
export function themePath(value: string) {
  if (!value.startsWith('/') || value.startsWith('//')) return value;
  const boundary = value.search(/[?#]/), path = (boundary < 0 ? value : value.slice(0, boundary)).replace(/\/+$/, '') || '/';
  const suffix = boundary < 0 ? '' : value.slice(boundary);
  if (path === '/') return '/' + suffix;
  if (path === '/boutique') return '/collections/all' + suffix;
  if (path.startsWith('/produits/')) return path.replace('/produits/', '/products/') + suffix;
  if (themeCategories.includes(path.slice(1))) return '/collections' + path + suffix;
  if (/^\/(products|collections|pages|cart|checkout|account|search|policies)(\/|$)/.test(path)) return path + suffix;
  return '/pages/' + path.slice(1).replace(/\//g, '-') + suffix;
}
export function themeHref(value: string) {
  const runtime = themeRuntime();
  const path = themePath(value);
  return runtime && path.startsWith('/') && !path.startsWith('//') ? runtime.root.replace(/\/$/, '') + path : path;
}
