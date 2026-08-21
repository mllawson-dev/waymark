import { createContext } from 'react';
import type { CartItem } from '../types/product';

export interface CartContextValue {
  items: CartItem[];
  addItem: (productId: string, variantId: string) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  itemCount: number;
  subtotal: number;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);
