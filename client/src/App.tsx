/** Design reference: NORTICAM storefront routes mirror the provided commerce experience. */

import ErrorBoundary from "./components/ErrorBoundary";
import { CatalogProvider } from "./contexts/CatalogContext";
import { CartProvider } from "./contexts/CartContext";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";

const NotFound = lazy(() => import("./pages/NotFound"));
const Policy = lazy(() => import("./pages/Policy"));
const Home = lazy(() => import("./pages/ConversionHome"));
const Shop = lazy(() => import("./pages/ShopifyStorePages").then((module) => ({ default: module.Shop })));
const Compare = lazy(() => import("./pages/ShopifyStorePages").then((module) => ({ default: module.Compare })));
const Guides = lazy(() => import("./pages/ShopifyStorePages").then((module) => ({ default: module.Guides })));
const ProductDetail = lazy(() => import("./pages/ProductConversion"));
const Quiz = lazy(() => import("./pages/ConversionQuiz"));
const GuideArticle = lazy(() => import("./pages/GuideArticle").then((module) => ({ default: module.GuideArticle })));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));

function App() {
  return <ErrorBoundary><CatalogProvider><CartProvider><Suspense fallback={<div className="min-h-screen bg-slate-50" aria-label="Chargement de la page NORTICAM" />}><Switch><Route path="/" component={Home} /><Route path="/boutique" component={Shop} /><Route path="/dashcam-voiture" component={Shop} /><Route path="/dashcam-moto" component={Shop} /><Route path="/meilleure-dashcam" component={Shop} /><Route path="/dashcam-vision-nocturne" component={Shop} /><Route path="/dashcam-gps" component={Shop} /><Route path="/dashcam-voiture-4k" component={Shop} /><Route path="/dashcam-voiture-360" component={Shop} /><Route path="/dashcam-moto-casque" component={Shop} /><Route path="/ecran-moto-carplay" component={Shop} /><Route path="/dashcam-avant-arriere" component={Shop} /><Route path="/mode-parking" component={Shop} /><Route path="/comparatif" component={Compare} /><Route path="/quiz" component={Quiz} /><Route path="/conseils" component={Guides} /><Route path="/conseils/:slug" component={GuideArticle} /><Route path="/suivi-colis" component={OrderTracking} /><Route path="/produits/:handle" component={ProductDetail} /><Route path="/informations/:kind" component={Policy} /><Route component={NotFound} /></Switch></Suspense></CartProvider></CatalogProvider></ErrorBoundary>;
}
export default App;
