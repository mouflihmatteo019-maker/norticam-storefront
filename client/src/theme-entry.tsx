import { createRoot } from 'react-dom/client';
import { Router } from 'wouter';
import { useBrowserLocation } from 'wouter/use-browser-location';
import App from './App';
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
if (root && themeRuntime()) createRoot(root).render(<Router hook={useThemeLocation}><App /></Router>);
