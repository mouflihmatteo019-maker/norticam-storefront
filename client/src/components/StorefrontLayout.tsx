/** Design reference: NORTICAM CRO shell — centered mobile brand, real product thumbnails and trust-led Shopify checkout drawer. */
import { BrandMark } from "@/components/BrandMark";
import { productImageAlt } from "@/lib/image-alt";
import { useCart } from "@/contexts/CartContext";
import { money } from "@/lib/shopify";
import { useCatalog } from "@/contexts/CatalogContext";
import ConsentBanner from "./ConsentBanner";
import { CartExpiryNotice } from "./CartExpiryNotice";
import { PaymentBadges } from "./PaymentBadges";
import { PromoBanner } from "./PromoBanner";
import { configureAnalytics, trackPage } from "@/lib/analytics";
import { useModalFocus } from "@/hooks/useModalFocus";
import {
  Check,
  LockKeyhole,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from 'react-dom';
import { themeRuntime } from '@/lib/theme-runtime';
import { Link, useLocation } from "@/components/Navigation";

const navItems = [
  { href: "/boutique", label: "Boutique" },
  { href: "/comparatif", label: "Comparatif" },
  { href: "/quiz", label: "Trouver ma dashcam" },
  { href: "/conseils", label: "Conseils" },
  { href: "/suivi-colis/", label: "Suivi de colis" },
  { href: "/informations/contact/", label: "Contact" },
];

function CartDrawer() {
  const {
    lines,
    isOpen,
    close,
    itemCount,
    total,
    checkout,
    busy,
    error,
    currency,
    setQuantity,
    remove,
    expiresAt,
    clearExpired,
  } = useCart();
  const modalRef = useModalFocus(isOpen, close);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[70]"
      role="dialog"
      aria-modal="true"
      aria-label="Votre panier"
    >
      <button
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
        aria-label="Fermer le panier"
        onClick={close}
      />
      <aside
        ref={modalRef}
        tabIndex={-1}
        className="cart-drawer absolute bottom-0 right-0 flex h-[min(88vh,760px)] w-full max-w-md flex-col rounded-t-[2rem] bg-white p-5 shadow-2xl sm:bottom-4 sm:right-4 sm:h-[calc(100vh-2rem)] sm:rounded-[2rem] sm:p-6"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1672d8]">
              Votre sélection
            </p>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-950">
              Panier {itemCount ? `(${itemCount})` : ""}
            </h2>
            <CartExpiryNotice
              expiresAt={expiresAt}
              onExpire={() => void clearExpired()}
            />
          </div>
          <button
            type="button"
            onClick={close}
            className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200"
            aria-label="Fermer"
          >
            <X size={19} />
          </button>
        </div>
        {error && (
          <p
            role="alert"
            className="my-3 rounded-xl bg-red-50 p-3 text-sm text-red-800"
          >
            {error}
          </p>
        )}
        {busy && (
          <p role="status" className="py-2 text-sm text-slate-600">
            Mise à jour du panier…
          </p>
        )}
        {lines.length ? (
          <>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto py-5">
              {lines.map(
                ({
                  product,
                  variantId,
                  variantTitle,
                  unitPrice,
                  lineTotal,
                  quantity,
                }) => (
                  <div className="flex gap-3" key={variantId}>
                    <div className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-blue-50">
                      <ShoppingBag className="text-[#1672d8]" />
                      {product.image && (
                        <img
                          src={product.image}
                          alt={productImageAlt(product)}
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                          onError={event => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <h3 className="font-display text-sm font-bold text-slate-950">
                          {product.shortTitle}
                        </h3>
                        <span className="text-sm font-bold text-slate-950">
                          {money(lineTotal, currency)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {variantTitle === "Default Title"
                          ? product.vendor
                          : variantTitle}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-slate-200 p-0.5">
                          <button
                            disabled={busy}
                            onClick={() => setQuantity(variantId, quantity - 1)}
                            className="grid h-7 w-7 place-items-center rounded-full hover:bg-slate-100"
                            aria-label="Réduire"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-7 text-center text-xs font-bold">
                            {quantity}
                          </span>
                          <button
                            disabled={busy}
                            onClick={() => setQuantity(variantId, quantity + 1)}
                            className="grid h-7 w-7 place-items-center rounded-full hover:bg-slate-100"
                            aria-label="Augmenter"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <button
                          disabled={busy}
                          onClick={() => remove(variantId)}
                          className="p-2 text-slate-400 hover:text-red-600"
                          aria-label={`Retirer ${product.shortTitle}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="border-t border-slate-100 pt-5">
              <div className="mb-4 flex items-end justify-between">
                <span className="text-sm text-slate-500">Sous-total</span>
                <span className="font-display text-2xl font-extrabold text-slate-950">
                  {money(total, currency)}
                </span>
              </div>
              <button
                disabled={busy}
                onClick={checkout}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#1672d8] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(22,114,216,0.25)] transition hover:bg-[#075dbb] active:scale-[.98]"
              >
                <LockKeyhole size={16} />
                Continuer vers le paiement sécurisé
              </button>
              <div className="pb-1 pt-5">
                <PaymentBadges compact />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <CartTrust icon={LockKeyhole} label="Paiement sécurisé" />
                <CartTrust icon={Truck} label="France métropolitaine : offerte" />
                <CartTrust icon={PackageCheck} label="Conditions de retour" />
              </div>
              <Link href="/informations/livraison-retours" onClick={close} className="mt-3 block text-center text-xs text-slate-500 underline underline-offset-4 hover:text-[#1672d8]">
                Voir les conditions de livraison et de retour
              </Link>
            </div>
          </>
        ) : busy ? (
          <div className="flex-1 space-y-4 py-6" aria-label="Chargement de votre sélection">
            <div className="flex gap-4" aria-hidden="true">
              <div className="h-20 w-20 rounded-2xl bg-slate-100" />
              <div className="flex-1 space-y-3 pt-2"><div className="h-4 w-4/5 rounded bg-slate-100" /><div className="h-3 w-1/2 rounded bg-slate-100" /></div>
            </div>
          </div>
        ) : (
          <div className="grid flex-1 place-items-center text-center">
            <div>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blue-50 text-[#1672d8]">
                <ShoppingBag size={25} />
              </div>
              <h3 className="mt-4 font-display text-xl font-extrabold text-slate-950">
                Votre panier est vide
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                Un doute sur le modèle ? Commencez par le diagnostic NORTICAM.
              </p>
              <div className="mt-5 flex flex-col items-center gap-3">
                <Link
                  href="/quiz"
                  onClick={close}
                  className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white"
                >
                  Faire le diagnostic
                </Link>
                <Link
                  href="/boutique"
                  onClick={close}
                  className="text-sm font-bold text-[#1672d8]"
                >
                  Voir la boutique
                </Link>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function CartTrust({
  icon: Icon,
  label,
}: {
  icon: typeof LockKeyhole;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-2 text-center">
      <Icon size={14} className="mx-auto text-[#1672d8]" />
      <p className="mt-1 text-[9px] font-bold leading-3 text-slate-600">
        {label}
      </p>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const { itemCount, open: openCart } = useCart();
  useEffect(() => {
    setOpen(false);
  }, [location]);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, []);
  return (
    <>
      <PromoBanner />
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="container relative flex h-[68px] items-center justify-between">
          <button
            onClick={() => setOpen(!open)}
            className="grid h-10 w-10 place-items-center rounded-full bg-slate-950 text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {open ? <X size={19} /> : <Menu size={20} />}
          </button>
          <div className="hidden lg:block">
            <BrandMark />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 lg:hidden">
            <BrandMark />
          </div>
          <nav
            className="hidden items-center gap-5 lg:flex"
            aria-label="Navigation principale"
          >
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold transition hover:text-[#1672d8] ${location === item.href ? "text-[#1672d8]" : "text-slate-600"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/quiz"
              className="hidden rounded-full bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#1672d8] xl:inline-flex"
            >
              Faire le diagnostic
            </Link>
            <button
              onClick={openCart}
              className="relative grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-950 transition hover:bg-slate-200"
              aria-label="Ouvrir le panier"
            >
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#1672d8] px-1 text-[10px] font-extrabold text-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg lg:hidden">
            <nav
              id="mobile-navigation"
              aria-label="Navigation mobile"
              className="mx-auto max-w-xl space-y-1"
            >
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-sm font-bold ${location === item.href ? "bg-blue-50 text-[#1672d8]" : "text-slate-700 hover:bg-slate-50"}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-white">
              <p className="text-xs font-bold">
                Vous ne savez pas par où commencer ?
              </p>
              <Link
                href="/quiz"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#75b8ff]"
              >
                Faire le diagnostic <Check size={15} />
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

function Footer() {
  return (
    <footer data-storefront-footer className="bg-slate-950 pb-8 pt-12 text-slate-300 sm:pt-16">
      <div className="container">
        <div className="grid gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <BrandMark dark />
            <h3 className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-white">À propos</h3>
            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
              NORTICAM vous aide à choisir votre dashcam voiture ou moto, avec des modèles comparés et des guides adaptés à votre usage.
            </p>
          </div>
          <FooterColumn title="Découvrir" links={navItems} />
          <FooterColumn
            title="Avant de commander"
            links={[
              { href: "/dashcam-voiture", label: "Dashcams voiture" },
              { href: "/dashcam-moto", label: "Dashcams moto" },
              { href: "/meilleure-dashcam", label: "Choisir une dashcam" },
              { href: "/mode-parking", label: "Mode parking" },
              { href: "/conseils", label: "Guides d’achat" },
            ]}
          />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white">
              Service client
            </h3>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Une question sur un modèle, une installation ou votre commande ? Contactez NORTICAM.
            </p>
            <a href="mailto:contact@norticam.com" className="mt-3 block break-words text-sm font-semibold text-white underline underline-offset-4">contact@norticam.com</a>
            <p className="mt-3 text-xs leading-6 text-slate-400">Sans horaires fixes : vous pouvez nous écrire à tout moment. Les réponses sont apportées selon notre disponibilité.</p>
            <Link href="/informations/contact" className="mt-3 block text-sm text-slate-400 underline underline-offset-4 hover:text-white">Écrire au service client</Link>
            <Link href="/informations/livraison-retours" className="mt-3 inline-block text-sm text-slate-400 underline underline-offset-4 hover:text-white">Livraison et retours : les conditions</Link>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} NORTICAM. Tous droits réservés.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/informations/contact" className="hover:text-white">
              Contact
            </Link>
            <Link
              href="/informations/mentions-legales"
              className="hover:text-white"
            >
              Mentions légales
            </Link>
            <Link
              href="/informations/confidentialite"
              className="hover:text-white"
            >
              Confidentialité
            </Link>
            <Link
              href="/informations/livraison-retours"
              className="hover:text-white"
            >
              Livraison et retours
            </Link>
            <Link href="/suivi-colis" className="hover:text-white">
              Suivi de colis
            </Link>
            <button
              onClick={() =>
                window.dispatchEvent(new Event("norticam-cookie-settings"))
              }
              className="hover:text-white"
            >
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white">
        {title}
      </h3>
      <div className="mt-4 grid gap-3 text-sm">
        {links.map(item => (
          <Link key={item.label} href={item.href} className="hover:text-white">
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function StorefrontLayout({
  children,
  homeHero,
}: {
  children: ReactNode;
  homeHero?: ReactNode;
}) {
  const { error, retry, loading } = useCatalog();
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    configureAnalytics();
    const id = window.setTimeout(trackPage, 100);
    return () => clearTimeout(id);
  }, [location]);
  const homeMounts = themeRuntime()?.homeMounts;
  if (homeMounts) return <>
    {createPortal(<Header />, homeMounts.header)}
    {createPortal(<>{error && <div role="alert">{error} <button onClick={retry}>Réessayer</button></div>}{children}</>, homeMounts.content)}
    {createPortal(<><Footer /><CartDrawer /><ConsentBanner /></>, homeMounts.footer)}
  </>;
  return (
    <div className="min-h-screen bg-[#f7f8f9] text-slate-950">
      <a href="#main-content" className="skip-link">
        Aller au contenu
      </a>
      {homeHero ? <div data-home-header style={{ display: 'contents' }}><Header /></div> : <Header />}
      {error && (
        <div
          role="alert"
          className="bg-amber-50 px-5 py-3 text-center text-sm text-amber-900"
        >
          {error}{" "}
          <button onClick={retry} className="underline font-bold">
            Réessayer
          </button>
        </div>
      )}
      <main
        id="main-content"
        data-catalog-ready={!loading && !error ? "true" : "false"}
        tabIndex={-1}
      >
        {homeHero}
        {homeHero ? <div data-home-content style={{ display: 'contents' }}>{children}</div> : children}
      </main>
      {homeHero ? <div data-home-footer style={{ display: 'contents' }}><Footer /><CartDrawer /><ConsentBanner /></div> : <><Footer /><CartDrawer /><ConsentBanner /></>}
    </div>
  );
}
