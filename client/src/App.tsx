/** Design reference: NORTICAM storefront routes mirror the provided commerce experience. */
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { CartProvider } from "./contexts/CartContext";
import Home from "./pages/Home";
import { Compare, Guides, ProductDetail, Quiz, Shop } from "./pages/ShopifyStorePages";
import { Route, Switch } from "wouter";

function App() {
  return <ErrorBoundary><TooltipProvider><CartProvider><Switch><Route path="/" component={Home} /><Route path="/boutique" component={Shop} /><Route path="/dashcam-voiture" component={Shop} /><Route path="/dashcam-moto" component={Shop} /><Route path="/dashcam-avant-arriere" component={Shop} /><Route path="/dashcam-4k" component={Shop} /><Route path="/comparatif" component={Compare} /><Route path="/quiz" component={Quiz} /><Route path="/conseils" component={Guides} /><Route path="/produits/:handle" component={ProductDetail} /><Route component={Home} /></Switch></CartProvider></TooltipProvider></ErrorBoundary>;
}
export default App;
