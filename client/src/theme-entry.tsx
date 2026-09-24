import { createRoot } from 'react-dom/client';
import { Router } from 'wouter';
import { useBrowserLocation } from 'wouter/use-browser-location';
import App from './App';
import NativeThemeContent from './pages/NativeThemeContent';
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
if (root && themeRuntime()) createRoot(root).render(<Router hook={useThemeLocation}>{themeRuntime()?.nativeContent ? <CatalogProvider><CartProvider><NativeThemeContent /></CartProvider></CatalogProvider> : <App />}</Router>);
