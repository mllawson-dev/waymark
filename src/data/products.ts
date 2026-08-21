import type { Product } from '../types/product';

export function findProduct(productId: string): Product | undefined {
  return products.find((p) => p.id === productId);
}

export const products: Product[] = [
  {
    id: 'prod-001',
    name: 'Waymark 90-Day Devotional',
    description: 'A guided daily devotional walking through Psalms, with space for reflection and prayer.',
    category: 'devotionals',
    basePrice: 24,
    variants: [
      { id: 'var-001a', label: 'Softcover', priceModifier: 0, inStock: true },
      { id: 'var-001b', label: 'Hardcover', priceModifier: 8, inStock: true },
    ],
  },
  {
    id: 'prod-002',
    name: 'Waymark Tee',
    description: 'A soft, everyday tee with the compass mark embroidered on the chest.',
    category: 'apparel',
    basePrice: 28,
    variants: [
      { id: 'var-002a', label: 'Small', priceModifier: 0, inStock: true },
      { id: 'var-002b', label: 'Medium', priceModifier: 0, inStock: true },
      { id: 'var-002c', label: 'Large', priceModifier: 0, inStock: false },
    ],
  },
  {
    id: 'prod-003',
    name: 'Psalm 119:105 Print',
    description: 'An 11x14 letterpress-style print, warm cream and terracotta, ready to frame.',
    category: 'prints',
    basePrice: 18,
    variants: [
      { id: 'var-003a', label: '11x14', priceModifier: 0, inStock: true },
      { id: 'var-003b', label: '16x20', priceModifier: 10, inStock: true },
    ],
  },
  {
    id: 'prod-004',
    name: 'Waymark Enamel Pin',
    description: 'A small brass-and-enamel compass pin, a quiet reminder of the daily walk.',
    category: 'gifts',
    basePrice: 12,
    variants: [{ id: 'var-004a', label: 'Standard', priceModifier: 0, inStock: true }],
  },
];
