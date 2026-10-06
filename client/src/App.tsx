/** Design reference: NORTICAM storefront routes mirror the provided commerce experience. */

import ErrorBoundary from "./components/ErrorBoundary";
import { CatalogProvider } from "./contexts/CatalogContext";
import { CartProvider } from "./contexts/CartContext";
import { lazy, Suspense, type ComponentType } from "react";
import { Route, Switch } from "wouter";

const NotFound = lazy(() => import("./pages/NotFound"));
const Policy = lazy(() => import("./pages/Policy"));
// The Shopify bundle is already downloaded at mount. Keep the homepage synchronous
// so Suspense cannot erase its server-rendered hero for a second paint.
import Home from "./pages/ConversionHome";
const Shop = lazy(() => import("./pages/ShopifyStorePages").then((module) => ({ default: module.Shop })));
const Compare = lazy(() => import("./pages/ShopifyStorePages").then((module) => ({ default: module.Compare })));
const Guides = lazy(() => import("./pages/ShopifyStorePages").then((module) => ({ default: module.Guides })));
const ProductDetail = lazy(() => import("./pages/ProductConversion"));
const Quiz = lazy(() => import("./pages/ConversionQuiz"));
const GuideArticle = lazy(() => import("./pages/GuideArticle").then((module) => ({ default: module.GuideArticle })));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));

const Contact = lazy(() => import("./pages/Contact"));
const ProductComparison = lazy(() => import("./pages/ProductComparison"));

export const defaultPages = { Home, Shop, Compare, Guides, ProductDetail, Quiz, GuideArticle, OrderTracking, Contact, ProductComparison, Policy, NotFound };
export type StorefrontPages = { [K in keyof typeof defaultPages]: ComponentType<any> };

function App({ pages = defaultPages }: { pages?: StorefrontPages }) {
  return <ErrorBoundary><CatalogProvider><CartProvider><Suspense fallback={<div className="min-h-screen bg-slate-50" aria-label="Chargement de la page NORTICAM" />}><Switch>
    <Route path="/" component={pages.Home} />
    <Route path="/boutique" component={pages.Shop} />
    <Route path="/dashcam-voiture" component={pages.Shop} />
    <Route path="/dashcam-moto" component={pages.Shop} />
    <Route path="/meilleure-dashcam" component={pages.Shop} />
    <Route path="/dashcam-vision-nocturne" component={pages.Shop} />
    <Route path="/dashcam-gps" component={pages.Shop} />
    <Route path="/dashcam-voiture-4k" component={pages.Shop} />
    <Route path="/dashcam-voiture-360" component={pages.Shop} />
    <Route path="/dashcam-moto-casque" component={pages.Shop} />
    <Route path="/ecran-moto-carplay" component={pages.Shop} />
    <Route path="/dashcam-avant-arriere" component={pages.Shop} />
    <Route path="/mode-parking" component={pages.Shop} />
    <Route path="/comparatif/:slug" component={pages.ProductComparison} />
    <Route path="/comparatif" component={pages.Compare} />
    <Route path="/quiz" component={pages.Quiz} />
    <Route path="/conseils" component={pages.Guides} />
    <Route path="/conseils/:slug" component={pages.GuideArticle} />
    <Route path="/suivi-colis" component={pages.OrderTracking} />
    <Route path="/produits/:handle" component={pages.ProductDetail} />
    <Route path="/informations/contact" component={pages.Contact} />
    <Route path="/informations/:kind" component={pages.Policy} />
    <Route component={pages.NotFound} />
  </Switch></Suspense></CartProvider></CatalogProvider></ErrorBoundary>;
}
export default App;
