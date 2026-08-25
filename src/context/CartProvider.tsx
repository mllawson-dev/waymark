import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem } from '../types/product';
import { isSameCartLine, resolveCartItem } from '../utils/cart';
import { CartContext } from './CartContext';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(productId: string, variantId: string) {
    setItems((prev) => {
      const existing = prev.find((i) => isSameCartLine(i, productId, variantId));
      if (existing) {
        return prev.map((i) =>
          isSameCartLine(i, productId, variantId) ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { productId, variantId, quantity: 1 }];
    });
  }

  function removeItem(productId: string, variantId: string) {
    setItems((prev) => prev.filter((i) => !isSameCartLine(i, productId, variantId)));
  }

  function updateQuantity(productId: string, variantId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (isSameCartLine(i, productId, variantId) ? { ...i, quantity } : i))
    );
  }

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + (resolveCartItem(i)?.lineTotal ?? 0), 0),
    [items]
  );

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}
