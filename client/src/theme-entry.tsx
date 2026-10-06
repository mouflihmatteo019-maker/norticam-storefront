import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { Router, Route } from 'wouter';
import { useBrowserLocation } from 'wouter/use-browser-location';
import ErrorBoundary from './components/ErrorBoundary';
import { loadThemePage } from './lib/theme-page';
import { prepareHomeIslands } from './lib/home-islands';
import { CatalogProvider } from './contexts/CatalogContext';
import { CartProvider } from './contexts/CartContext';
import { themeRuntime, themeHref } from './lib/theme-runtime';
import './index.css';

function useThemeLocation(): ReturnType<typeof useBrowserLocation> {
  const [, navigate] = useBrowserLocation();
  return [themeRuntime()!.path, (to, options) => {
    const target = new URL(themeHref(String(to)), window.location.origin);
    if (target.pathname === window.location.pathname) navigate(target.pathname + target.search + target.hash, options);
    else window.location.assign(target.href);
  }];
}
const root = document.getElementById('root');
async function mount() {
  const runtime = themeRuntime();
  if (!root || !runtime) return;
  // Keep the complete server-rendered page visible while its module downloads.
  const { Page, route } = await loadThemePage(runtime.path, Boolean(runtime.nativeContent));
  const target = prepareHomeIslands(root, runtime);
  flushSync(() => createRoot(target).render(<Router hook={useThemeLocation}><ErrorBoundary><CatalogProvider><CartProvider><Route path={route}><Page /></Route></CartProvider></CatalogProvider></ErrorBoundary></Router>));
}
void mount().catch(error => {
  // A failed chunk must not clear the functioning server-rendered links/content.
  console.error('NORTICAM: chargement interactif indisponible', error);
});
