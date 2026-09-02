/** Design reference: NORTICAM storefront routes mirror the provided commerce experience. */
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { CartProvider } from "./contexts/CartContext";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";

const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/ShopifyStorePages").then((module) => ({ default: module.Shop })));
const Compare = lazy(() => import("./pages/ShopifyStorePages").then((module) => ({ default: module.Compare })));
const Guides = lazy(() => import("./pages/ShopifyStorePages").then((module) => ({ default: module.Guides })));
const ProductDetail = lazy(() => import("./pages/ShopifyStorePages").then((module) => ({ default: module.ProductDetail })));
const Quiz = lazy(() => import("./pages/ShopifyStorePages").then((module) => ({ default: module.Quiz })));
const GuideArticle = lazy(() => import("./pages/GuideArticle").then((module) => ({ default: module.GuideArticle })));

function App() {
  return <ErrorBoundary><TooltipProvider><CartProvider><Suspense fallback={<div className="min-h-screen bg-slate-50" aria-label="Chargement de la page NORTICAM" />}><Switch><Route path="/" component={Home} /><Route path="/boutique" component={Shop} /><Route path="/dashcam-voiture" component={Shop} /><Route path="/dashcam-moto" component={Shop} /><Route path="/mode-parking" component={Shop} /><Route path="/comparatif" component={Compare} /><Route path="/quiz" component={Quiz} /><Route path="/conseils" component={Guides} /><Route path="/conseils/:slug" component={GuideArticle} /><Route path="/produits/:handle" component={ProductDetail} /><Route component={Home} /></Switch></Suspense></CartProvider></TooltipProvider></ErrorBoundary>;
}
export default App;
