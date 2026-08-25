import { findProduct, findVariant } from '../data/products';
import type { CartItem, Product, ProductVariant } from '../types/product';

export interface ResolvedCartItem {
  product: Product;
  variant: ProductVariant;
  unitPrice: number;
  lineTotal: number;
}

/** Whether a cart item is the same product/variant line as the given ids. */
export function isSameCartLine(item: CartItem, productId: string, variantId: string): boolean {
  return item.productId === productId && item.variantId === variantId;
}

/** Stable key for a cart line, unique per product/variant pair. */
export function cartLineKey(item: CartItem): string {
  return `${item.productId}-${item.variantId}`;
}

/**
 * Turns a cart item's ids into the product/variant they point at, plus its
 * pricing. Returns null when either id no longer exists in the catalog, so
 * callers never have to reassemble a price from partial lookups.
 */
export function resolveCartItem(item: CartItem): ResolvedCartItem | null {
  const product = findProduct(item.productId);
  const variant = product && findVariant(product, item.variantId);
  if (!product || !variant) return null;

  const unitPrice = product.basePrice + variant.priceModifier;
  return { product, variant, unitPrice, lineTotal: unitPrice * item.quantity };
}
