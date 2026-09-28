import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CartProvider } from '../context/CartProvider';
import { useCart } from '../context/useCart';
import { CartContents } from './CartContents';

type SeedLine = [productId: string, variantId: string, quantity: number];

/** Fills the cart on click, so tests can start from a populated cart. */
function SeedButton({ lines }: { lines: SeedLine[] }) {
  const { addItem, updateQuantity } = useCart();
  return (
    <button
      data-testid="seed"
      onClick={() => {
        for (const [productId, variantId, quantity] of lines) {
          addItem(productId, variantId);
          if (quantity > 1) updateQuantity(productId, variantId, quantity);
        }
      }}
    />
  );
}

function renderCart(lines: SeedLine[] = []) {
  const utils = render(
    <MemoryRouter>
      <CartProvider>
        <SeedButton lines={lines} />
        <CartContents />
      </CartProvider>
    </MemoryRouter>
  );
  fireEvent.click(screen.getByTestId('seed'));
  return utils;
}

describe('CartContents', () => {
  it('shows an empty state with a link to the store', () => {
    renderCart();

    expect(screen.getByText('Your cart is empty.')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Browse the store' }).getAttribute('href')).toBe('/store');
    expect(screen.queryByRole('link', { name: 'Review demo checkout' })).toBeNull();
  });

  it('links to the demo checkout when the cart has items', () => {
    renderCart([['prod-004', 'var-004a', 1]]);

    expect(screen.getByRole('link', { name: 'Review demo checkout' }).getAttribute('href')).toBe('/checkout');
  });

  it('lists each line with its variant, unit price, and line total', () => {
    renderCart([['prod-001', 'var-001b', 2]]);

    expect(screen.getByText('Waymark 90-Day Devotional')).toBeTruthy();
    // base 24 + hardcover modifier 8
    expect(screen.getByText(/Hardcover · \$32\.00 each/)).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getAllByText('$64.00')).toHaveLength(2); // line total and subtotal
  });

  it('shows the subtotal across lines', () => {
    renderCart([
      ['prod-001', 'var-001a', 1],
      ['prod-002', 'var-002a', 2],
    ]);

    expect(screen.getByText('Subtotal').nextElementSibling?.textContent).toBe('$80.00');
  });

  it('increases and decreases the quantity of a line', () => {
    renderCart([['prod-002', 'var-002a', 1]]);
    const increase = screen.getByRole('button', { name: 'Increase quantity of Waymark Tee' });
    const decrease = screen.getByRole('button', { name: 'Decrease quantity of Waymark Tee' });

    fireEvent.click(increase);
    expect(screen.getByText('Subtotal').nextElementSibling?.textContent).toBe('$56.00');

    fireEvent.click(decrease);
    expect(screen.getByText('Subtotal').nextElementSibling?.textContent).toBe('$28.00');
  });

  it('drops the line when the quantity is decreased below one', () => {
    renderCart([['prod-002', 'var-002a', 1]]);

    fireEvent.click(screen.getByRole('button', { name: 'Decrease quantity of Waymark Tee' }));

    expect(screen.getByText('Your cart is empty.')).toBeTruthy();
  });

  it('removes a line via the remove button', () => {
    renderCart([
      ['prod-001', 'var-001a', 1],
      ['prod-002', 'var-002a', 1],
    ]);

    fireEvent.click(screen.getByRole('button', { name: 'Remove Waymark Tee from cart' }));

    expect(screen.queryByText('Waymark Tee')).toBeNull();
    expect(screen.getByText('Waymark 90-Day Devotional')).toBeTruthy();
  });

  it('skips lines whose product or variant no longer exists', () => {
    renderCart([
      ['prod-001', 'var-001a', 1],
      ['prod-gone', 'var-gone', 1],
      ['prod-001', 'var-gone', 1],
    ]);

    expect(screen.getAllByRole('button', { name: /^Remove/ })).toHaveLength(1);
    expect(screen.getByText('Subtotal').nextElementSibling?.textContent).toBe('$48.00');
  });
});
