import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem } from '../types/product';
import { findProduct } from '../data/products';
import { CartContext } from './CartContext';

const CART_STORAGE_KEY = 'waymark:cart';

function loadCart(): CartItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is CartItem =>
      typeof item?.productId === 'string' &&
      typeof item?.variantId === 'string' &&
      Number.isInteger(item?.quantity) &&
      item.quantity > 0 &&
      Boolean(findProduct(item.productId)?.variants.some((variant) => variant.id === item.variantId))
    );
  } catch {
    return [];
  }
}

function lineTotal(item: CartItem): number {
  const product = findProduct(item.productId);
  if (!product) return 0;
  const variant = product.variants.find((v) => v.id === item.variantId);
  const unitPrice = product.basePrice + (variant?.priceModifier ?? 0);
  return unitPrice * item.quantity;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage can be unavailable in private browsing; the cart still works for this session.
    }
  }, [items]);

  function addItem(productId: string, variantId: string) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId && i.variantId === variantId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId && i.variantId === variantId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { productId, variantId, quantity: 1 }];
    });
  }

  function removeItem(productId: string, variantId: string) {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.variantId === variantId)));
  }

  function updateQuantity(productId: string, variantId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId && i.variantId === variantId ? { ...i, quantity } : i))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + lineTotal(i), 0), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}
