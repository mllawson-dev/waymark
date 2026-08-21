import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem } from '../types/product';
import { findProduct } from '../data/products';
import { CartContext } from './CartContext';

function lineTotal(item: CartItem): number {
  const product = findProduct(item.productId);
  if (!product) return 0;
  const variant = product.variants.find((v) => v.id === item.variantId);
  const unitPrice = product.basePrice + (variant?.priceModifier ?? 0);
  return unitPrice * item.quantity;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

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

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + lineTotal(i), 0), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}
