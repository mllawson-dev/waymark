import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CartProvider } from '../context/CartProvider';
import { useCart } from '../context/useCart';
import { ProductDetailPage } from './ProductDetailPage';

/** Renders the cart state so tests can assert what the page put in it. */
function CartProbe() {
  const { items, itemCount, subtotal } = useCart();
  return (
    <div data-testid="cart">
      {itemCount}|{subtotal}|{items.map((i) => `${i.productId}:${i.variantId}`).join(',')}
    </div>
  );
}

function renderProduct(productId: string) {
  return render(
    <MemoryRouter initialEntries={[`/store/${productId}`]}>
      <CartProvider>
        <Routes>
          <Route path="/store/:productId" element={<ProductDetailPage />} />
        </Routes>
        <CartProbe />
      </CartProvider>
    </MemoryRouter>
  );
}

function cartState() {
  return screen.getByTestId('cart').textContent;
}

describe('ProductDetailPage', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows a not-found message with a link back to the store for an unknown product', () => {
    renderProduct('prod-nope');

    expect(screen.getByText(/We couldn't find that product/)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Back to store' }).getAttribute('href')).toBe('/store');
  });

  it('renders the product with its first in-stock variant preselected', () => {
    renderProduct('prod-001');

    expect(screen.getByRole('heading', { name: 'Waymark 90-Day Devotional' })).toBeTruthy();
    expect(screen.getByText('$24')).toBeTruthy();
    expect(screen.getByRole('button', { name: '✓ Softcover' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('updates the price when another variant is selected', () => {
    renderProduct('prod-001');

    fireEvent.click(screen.getByRole('button', { name: 'Hardcover' }));

    expect(screen.getByText('$32')).toBeTruthy();
    expect(screen.getByRole('button', { name: '✓ Hardcover' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('disables out-of-stock variants', () => {
    renderProduct('prod-002');

    const soldOut = screen.getByRole('button', { name: 'Large (sold out)' }) as HTMLButtonElement;
    expect(soldOut.disabled).toBe(true);
  });

  it('adds the selected variant to the cart and announces it', () => {
    renderProduct('prod-001');

    fireEvent.click(screen.getByRole('button', { name: 'Hardcover' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add to cart' }));

    expect(cartState()).toBe('1|32|prod-001:var-001b');
    expect(screen.getByRole('status').textContent).toBe('Waymark 90-Day Devotional (Hardcover) added to cart');
  });

  it('confirms on the button and reverts after a moment', () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    renderProduct('prod-004');

    fireEvent.click(screen.getByRole('button', { name: 'Add to cart' }));
    expect(screen.getByRole('button', { name: /Added to cart/ })).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(1800);
    });

    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeTruthy();
  });
});
