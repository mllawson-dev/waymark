import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { cartLineKey, resolveCartItem } from '../utils/cart';
import { formatPrice } from '../utils/format';
import { Button } from './Button';
import { EmptyState } from './EmptyState';

const stepperButtonStyle: CSSProperties = {
  border: '1px solid var(--color-border)',
  background: 'none',
  borderRadius: '4px',
  width: '28px',
  height: '28px',
  cursor: 'pointer',
};

export function CartContents() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <EmptyState
        message="Your cart is empty."
        action={
          <Link to="/store">
            <Button variant="secondary" size="sm">
              Browse the store
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.map((item) => {
          const resolved = resolveCartItem(item);
          if (!resolved) return null;
          const { product, variant, unitPrice, lineTotal } = resolved;

          return (
            <div
              key={cartLineKey(item)}
              style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}
            >
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, margin: 0, color: 'var(--color-text-primary)' }}>
                  {product.name}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: '0.15rem 0' }}>
                  {variant.label} &middot; {formatPrice(unitPrice)} each
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                  <button
                    onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                    aria-label={`Decrease quantity of ${product.name}`}
                    style={stepperButtonStyle}
                  >
                    &minus;
                  </button>
                  <span
                    aria-live="polite"
                    style={{ fontFamily: 'var(--font-body)', minWidth: '1.5rem', textAlign: 'center' }}
                  >
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                    aria-label={`Increase quantity of ${product.name}`}
                    style={stepperButtonStyle}
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    aria-label={`Remove ${product.name} from cart`}
                    style={{ border: 'none', background: 'none', color: 'var(--color-text-secondary)', fontSize: '0.8125rem', cursor: 'pointer', marginLeft: '0.5rem' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {formatPrice(lineTotal)}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem', fontFamily: 'var(--font-body)' }}>
        <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
        <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{formatPrice(subtotal)}</span>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <Button variant="primary" style={{ width: '100%' }}>
          Checkout
        </Button>
      </div>
    </div>
  );
}
