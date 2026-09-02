/** Design reference: NORTICAM storefront — local cart powers the premium drawer interaction. */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product, ProductVariant } from "@/lib/store-data";

type CartLine = { product: Product; variantId: string; variantTitle: string; unitPrice: number; quantity: number };
type CartApi = {
  lines: CartLine[];
  isOpen: boolean;
  itemCount: number;
  total: number;
  checkoutUrl: string;
  add: (product: Product, variant?: ProductVariant) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartApi | null>(null);
const storageKey = "norticam-demo-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || "[]") as CartLine[]; } catch { return []; }
  });
  const [isOpen, setOpen] = useState(false);
  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(lines)); }, [lines]);
  const value = useMemo<CartApi>(() => ({
    lines,
    isOpen,
    itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    total: lines.reduce((sum, line) => sum + (line.unitPrice ?? line.product.price) * line.quantity, 0),
    checkoutUrl: `https://z4a1f0-p0.myshopify.com/cart/${lines.map((line) => `${line.variantId.split("/").pop()}:${line.quantity}`).join(",")}`,
    add: (product, selectedVariant) => { const variant = selectedVariant ?? product.variants.find((item) => item.availableForSale) ?? product.variants[0]; if (!variant) return; setLines((current) => { const found = current.find((line) => line.variantId === variant.id); return found ? current.map((line) => line.variantId === variant.id ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { product, variantId: variant.id, variantTitle: variant.title, unitPrice: variant.price, quantity: 1 }]; }); setOpen(true); },
    setQuantity: (id, quantity) => setLines((current) => current.flatMap((line) => line.variantId === id ? quantity > 0 ? [{ ...line, quantity }] : [] : [line])),
    remove: (id) => setLines((current) => current.filter((line) => line.variantId !== id)),
    open: () => setOpen(true),
    close: () => setOpen(false),
  }), [isOpen, lines]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
