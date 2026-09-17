import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Product, ProductVariant } from "@/lib/store-data";
import { getCart, mutateCart, type ShopifyCart } from "@/lib/shopify";
import { trackCommerce, trackEvent } from "@/lib/analytics";

const cartKey = "norticam-shopify-cart-v1";
const expiryKey = "norticam-cart-expiry-v1";
const cartLifetime = 10 * 60 * 1000;
function savedId() {
  try {
    return localStorage.getItem(cartKey);
  } catch {
    return null;
  }
}
function savedExpiry() {
  try {
    const value = Number(localStorage.getItem(expiryKey));
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}
function persist(id: string | null) {
  try {
    if (id) localStorage.setItem(cartKey, id);
    else localStorage.removeItem(cartKey);
  } catch {}
}
function persistExpiry(value: number | null) {
  try {
    if (value) localStorage.setItem(expiryKey, String(value));
    else localStorage.removeItem(expiryKey);
  } catch {}
}

type CartLine = {
  id: string;
  product: Product;
  variantId: string;
  variantTitle: string;
  unitPrice: number;
  lineTotal: number;
  quantity: number;
};
type CartApi = {
  lines: CartLine[];
  isOpen: boolean;
  itemCount: number;
  total: number;
  currency: string;
  checkoutUrl: string;
  busy: boolean;
  error: string;
  expiresAt: number | null;
  add: (product: Product, variant?: ProductVariant) => Promise<void>;
  setQuantity: (id: string, quantity: number) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clearExpired: () => Promise<void>;
  checkout: () => Promise<void>;
  open: () => void;
  close: () => void;
};
const Context = createContext<CartApi | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const current = useRef<ShopifyCart | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(() =>
    savedExpiry()
  );
  const [isOpen, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const [error, setError] = useState("");
  const viewedCart = useRef("");
  function accept(next: ShopifyCart | null) {
    current.current = next;
    setCart(next);
    persist(next?.id || null);
    if (!next?.totalQuantity) {
      setExpiresAt(null);
      persistExpiry(null);
    }
  }
  function renewExpiry() {
    const next = Date.now() + cartLifetime;
    setExpiresAt(next);
    persistExpiry(next);
  }
  async function run(action: () => Promise<void>) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Une erreur est survenue. Réessayez."
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  const lines: CartLine[] = (cart?.lines.nodes || []).map(l => ({
    id: l.id,
    product: {
      ...l.merchandise.product,
      shortTitle: l.merchandise.product.title,
      image: l.merchandise.product.featuredImage?.url,
      imageAlt: l.merchandise.product.featuredImage?.altText,
    } as Product,
    variantId: l.merchandise.id,
    variantTitle: l.merchandise.title,
    unitPrice: Number(l.cost.amountPerQuantity.amount),
    lineTotal: Number(l.cost.totalAmount.amount),
    quantity: l.quantity,
  }));
  const currency = cart?.cost.subtotalAmount.currencyCode || "EUR";
  async function expire(active: ShopifyCart | null) {
    if (!active?.lines.nodes.length) return;
    const result = await mutateCart("cartLinesRemove", {
      cartId: active.id,
      lineIds: active.lines.nodes.map(line => line.id),
    });
    accept(result.cart);
    trackEvent("cart_expired");
  }
  const clearExpired = async () => run(() => expire(current.current));
  useEffect(() => {
    const id = savedId();
    if (!id) return;
    void run(async () => {
      const restored = await getCart(id);
      accept(restored);
      const storedExpiry = savedExpiry();
      if (restored?.totalQuantity && storedExpiry && storedExpiry <= Date.now())
        await expire(restored);
      else if (restored?.totalQuantity && !storedExpiry) renewExpiry();
    });
  }, []);
  const update = (id: string, quantity: number) =>
    run(async () => {
      const active = current.current;
      if (!active) return;
      const line = active.lines.nodes.find(
        l => l.merchandise.id === id || l.id === id
      );
      if (!line) return;
      const previous = {
        id: line.merchandise.id.split("/").pop(),
        name: line.merchandise.product.title,
        price: Number(line.cost.amountPerQuantity.amount),
        quantity: line.quantity,
      };
      const result = await mutateCart(
        quantity > 0 ? "cartLinesUpdate" : "cartLinesRemove",
        quantity > 0
          ? {
              cartId: active.id,
              lines: [
                {
                  id: line.id,
                  quantity: Math.min(99, Math.max(1, Math.floor(quantity))),
                },
              ],
            }
          : { cartId: active.id, lineIds: [line.id] }
      );
      accept(result.cart);
      setError(result.warning);
      if (quantity <= 0 || quantity < previous.quantity)
        trackCommerce(
          "remove_from_cart",
          [
            {
              ...previous,
              quantity:
                quantity <= 0
                  ? previous.quantity
                  : previous.quantity - quantity,
            },
          ],
          result.cart.cost.subtotalAmount.currencyCode
        );
      if (result.cart.totalQuantity) renewExpiry();
    });
  return (
    <Context.Provider
      value={{
        lines,
        isOpen,
        busy,
        error,
        currency,
        itemCount: cart?.totalQuantity || 0,
        total: Number(cart?.cost.subtotalAmount.amount || 0),
        checkoutUrl: cart?.checkoutUrl || "",
        expiresAt,
        add: async (product, selected) => {
          setOpen(true);
          await run(async () => {
            const v =
              selected || product.variants.find(v => v.availableForSale);
            if (!v?.availableForSale)
              throw new Error("Cette configuration n’est pas disponible.");
            let active = current.current;
            if (!active && savedId()) {
              active = await getCart(savedId()!);
              accept(active);
            }
            const before =
              active?.lines.nodes
                .filter(l => l.merchandise.id === v.id)
                .reduce((n, l) => n + l.quantity, 0) || 0;
            if (active && active.lines.nodes.length >= 100 && !before)
              throw new Error("Le panier est complet.");
            const result = await mutateCart(
              active ? "cartLinesAdd" : "cartCreate",
              active
                ? {
                    cartId: active.id,
                    lines: [{ merchandiseId: v.id, quantity: 1 }],
                  }
                : {
                    input: {
                      buyerIdentity: { countryCode: "FR" },
                      lines: [{ merchandiseId: v.id, quantity: 1 }],
                    },
                  }
            );
            accept(result.cart);
            renewExpiry();
            setError(result.warning);
            const line = result.cart.lines.nodes.find(
              l => l.merchandise.id === v.id
            );
            if (line && line.quantity > before)
              trackCommerce(
                "add_to_cart",
                [
                  {
                    id: v.numericId,
                    name: product.title,
                    price: Number(line.cost.amountPerQuantity.amount),
                    quantity: line.quantity - before,
                  },
                ],
                result.cart.cost.subtotalAmount.currencyCode
              );
          });
        },
        setQuantity: update,
        remove: id => update(id, 0),
        clearExpired,
        checkout: () =>
          run(async () => {
            const id = current.current?.id || savedId();
            if (!id) return;
            const fresh = await getCart(id);
            accept(fresh);
            if (!fresh?.totalQuantity)
              throw new Error(
                "Votre panier a expiré ou est vide. Ajoutez à nouveau votre sélection."
              );
            const checkout = new URL(fresh.checkoutUrl);
            if (checkout.protocol !== "https:")
              throw new Error("Adresse de paiement invalide.");
            trackCommerce(
              "begin_checkout",
              fresh.lines.nodes.map(l => ({
                id: l.merchandise.id.split("/").pop(),
                name: l.merchandise.product.title,
                price: Number(l.cost.amountPerQuantity.amount),
                quantity: l.quantity,
              })),
              fresh.cost.subtotalAmount.currencyCode,
              Number(fresh.cost.subtotalAmount.amount)
            );
            window.location.assign(checkout.href);
          }),
        open: () => {
          setOpen(true);
          const active = current.current;
          if (active?.totalQuantity && viewedCart.current !== active.id) {
            viewedCart.current = active.id;
            trackCommerce(
              "view_cart",
              active.lines.nodes.map(l => ({
                id: l.merchandise.id.split("/").pop(),
                name: l.merchandise.product.title,
                price: Number(l.cost.amountPerQuantity.amount),
                quantity: l.quantity,
              })),
              active.cost.subtotalAmount.currencyCode,
              Number(active.cost.subtotalAmount.amount)
            );
          }
          if (savedId())
            void run(async () => accept(await getCart(savedId()!)));
        },
        close: () => setOpen(false),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useCart() {
  const context = useContext(Context);
  if (!context) throw new Error("CartProvider missing");
  return context;
}
