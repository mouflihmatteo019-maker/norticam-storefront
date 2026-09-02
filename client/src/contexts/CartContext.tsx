/** Design reference: NORTICAM storefront — local cart powers the premium drawer interaction. */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/store-data";

type CartLine = { product: Product; quantity: number };
type CartApi = {
  lines: CartLine[];
  isOpen: boolean;
  itemCount: number;
  total: number;
  add: (product: Product) => void;
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
    total: lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
    add: (product) => { setLines((current) => { const found = current.find((line) => line.product.id === product.id); return found ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { product, quantity: 1 }]; }); setOpen(true); },
    setQuantity: (id, quantity) => setLines((current) => current.flatMap((line) => line.product.id === id ? quantity > 0 ? [{ ...line, quantity }] : [] : [line])),
    remove: (id) => setLines((current) => current.filter((line) => line.product.id !== id)),
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
