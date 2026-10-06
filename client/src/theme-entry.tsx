import { createRoot } from 'react-dom/client';
import { Router } from 'wouter';
import { useBrowserLocation } from 'wouter/use-browser-location';
import App from './App';
import NativeThemeContent from './pages/NativeThemeContent';
import Home from './pages/ConversionHome';
import { Shop, Compare, Guides } from './pages/ShopifyStorePages';
import ProductDetail from './pages/ProductConversion';
import Quiz from './pages/ConversionQuiz';
import { GuideArticle } from './pages/GuideArticle';
import OrderTracking from './pages/OrderTracking';
import Contact from './pages/Contact';
import ProductComparison from './pages/ProductComparison';
import Policy from './pages/Policy';
import NotFound from './pages/NotFound';
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
const themePages = { Home, Shop, Compare, Guides, ProductDetail, Quiz, GuideArticle, OrderTracking, Contact, ProductComparison, Policy, NotFound };
if (root && themeRuntime()) createRoot(root).render(<Router hook={useThemeLocation}>{themeRuntime()?.nativeContent ? <CatalogProvider><CartProvider><NativeThemeContent /></CartProvider></CatalogProvider> : <App pages={themePages} />}</Router>);
