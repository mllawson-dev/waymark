import { Link } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { findProduct } from '../data/products';
import { WaymarkLogo } from './WaymarkLogo';

export function CartContents({ onNavigate }: { onNavigate?: () => void }) {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0.5rem' }}>
        <div style={{ opacity: 0.35, marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
          <WaymarkLogo size={40} />
        </div>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
          Your cart is empty.
        </p>
        <Link to="/store" className="wm-button wm-button--secondary wm-button--sm" onClick={onNavigate}>
          Browse the store
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.map((item) => {
          const product = findProduct(item.productId);
          const variant = product?.variants.find((v) => v.id === item.variantId);
          if (!product || !variant) return null;
          const unitPrice = product.basePrice + variant.priceModifier;

          return (
            <div
              key={`${item.productId}-${item.variantId}`}
              style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}
            >
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, margin: 0, color: 'var(--color-text-primary)' }}>
                  {product.name}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: '0.15rem 0' }}>
                  {variant.label} &middot; ${unitPrice} each
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                  <button
                    className="wm-quantity-button"
                    onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                    aria-label={`Decrease quantity of ${product.name}`}
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
                    className="wm-quantity-button"
                    onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                    aria-label={`Increase quantity of ${product.name}`}
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
                ${unitPrice * item.quantity}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem', fontFamily: 'var(--font-body)' }}>
        <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
        <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>${subtotal}</span>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <Link to="/checkout" className="wm-button wm-button--primary wm-button--md wm-cart-checkout" onClick={onNavigate}>
          Review demo checkout
        </Link>
        <p className="wm-cart-note">Portfolio prototype — no payment will be collected.</p>
      </div>
    </div>
  );
}
