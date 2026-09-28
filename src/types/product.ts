export type ProductCategory = 'devotionals' | 'apparel' | 'prints' | 'gifts';

export interface ProductVariant {
  id: string;
  label: string; // e.g. "Small", "Sage Green"
  priceModifier: number; // added to base price, can be 0
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  basePrice: number;
  image: string;
  imageAlt: string;
  details: string[];
  variants: ProductVariant[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}
