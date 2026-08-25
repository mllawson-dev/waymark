import { describe, expect, it } from 'vitest';
import { findProduct, products } from './products';

describe('findProduct', () => {
  it('finds a product by id', () => {
    expect(findProduct('prod-001')?.name).toBe('Waymark 90-Day Devotional');
  });

  it('returns undefined for an unknown id', () => {
    expect(findProduct('prod-nope')).toBeUndefined();
  });

  it('returns undefined for an empty id', () => {
    expect(findProduct('')).toBeUndefined();
  });

  it('is case sensitive', () => {
    expect(findProduct('PROD-001')).toBeUndefined();
  });

  it('finds every product in the catalog', () => {
    for (const product of products) {
      expect(findProduct(product.id)).toBe(product);
    }
  });
});

describe('products catalog', () => {
  it('has unique product ids', () => {
    const ids = products.map((p) => p.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has unique variant ids and at least one variant per product', () => {
    const variantIds = products.flatMap((p) => p.variants.map((v) => v.id));

    expect(new Set(variantIds).size).toBe(variantIds.length);
    expect(products.every((p) => p.variants.length > 0)).toBe(true);
  });

  it('prices every variant at zero or more', () => {
    for (const product of products) {
      expect(product.basePrice).toBeGreaterThan(0);
      for (const variant of product.variants) {
        expect(product.basePrice + variant.priceModifier).toBeGreaterThan(0);
      }
    }
  });
});
