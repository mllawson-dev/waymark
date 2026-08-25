import type { ReactNode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CartProvider } from './CartProvider';
import { useCart } from './useCart';

function renderCart() {
  return renderHook(() => useCart(), {
    wrapper: ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>,
  });
}

describe('CartProvider', () => {
  it('starts empty', () => {
    const { result } = renderCart();

    expect(result.current.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it('adds an item with quantity one', () => {
    const { result } = renderCart();

    act(() => result.current.addItem('prod-001', 'var-001a'));

    expect(result.current.items).toEqual([{ productId: 'prod-001', variantId: 'var-001a', quantity: 1 }]);
    expect(result.current.itemCount).toBe(1);
    expect(result.current.subtotal).toBe(24);
  });

  it('increments quantity when the same variant is added again', () => {
    const { result } = renderCart();

    act(() => result.current.addItem('prod-001', 'var-001a'));
    act(() => result.current.addItem('prod-001', 'var-001a'));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]?.quantity).toBe(2);
    expect(result.current.itemCount).toBe(2);
    expect(result.current.subtotal).toBe(48);
  });

  it('treats different variants of the same product as separate lines', () => {
    const { result } = renderCart();

    act(() => result.current.addItem('prod-001', 'var-001a'));
    act(() => result.current.addItem('prod-001', 'var-001b'));

    expect(result.current.items).toHaveLength(2);
    expect(result.current.itemCount).toBe(2);
    // 24 (softcover) + 24 + 8 (hardcover price modifier)
    expect(result.current.subtotal).toBe(56);
  });

  it('removes only the matching line', () => {
    const { result } = renderCart();

    act(() => result.current.addItem('prod-001', 'var-001a'));
    act(() => result.current.addItem('prod-002', 'var-002a'));
    act(() => result.current.removeItem('prod-001', 'var-001a'));

    expect(result.current.items).toEqual([{ productId: 'prod-002', variantId: 'var-002a', quantity: 1 }]);
    expect(result.current.subtotal).toBe(28);
  });

  it('updates the quantity of an existing line', () => {
    const { result } = renderCart();

    act(() => result.current.addItem('prod-001', 'var-001b'));
    act(() => result.current.updateQuantity('prod-001', 'var-001b', 3));

    expect(result.current.itemCount).toBe(3);
    expect(result.current.subtotal).toBe(96);
  });

  it('removes the line when the quantity drops to zero or below', () => {
    const { result } = renderCart();

    act(() => result.current.addItem('prod-001', 'var-001a'));
    act(() => result.current.updateQuantity('prod-001', 'var-001a', 0));

    expect(result.current.items).toEqual([]);

    act(() => result.current.addItem('prod-002', 'var-002a'));
    act(() => result.current.updateQuantity('prod-002', 'var-002a', -2));

    expect(result.current.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
  });

  it('ignores quantity updates for a line that is not in the cart', () => {
    const { result } = renderCart();

    act(() => result.current.addItem('prod-001', 'var-001a'));
    act(() => result.current.updateQuantity('prod-002', 'var-002a', 5));

    expect(result.current.items).toEqual([{ productId: 'prod-001', variantId: 'var-001a', quantity: 1 }]);
  });

  it('counts an unknown product as zero in the subtotal', () => {
    const { result } = renderCart();

    act(() => result.current.addItem('prod-missing', 'var-missing'));

    expect(result.current.itemCount).toBe(1);
    expect(result.current.subtotal).toBe(0);
  });

  it('falls back to the base price when the variant is unknown', () => {
    const { result } = renderCart();

    act(() => result.current.addItem('prod-001', 'var-missing'));

    expect(result.current.subtotal).toBe(24);
  });
});

describe('useCart', () => {
  it('throws when used outside of a CartProvider', () => {
    expect(() => renderHook(() => useCart())).toThrow('useCart must be used within a CartProvider');
  });
});
