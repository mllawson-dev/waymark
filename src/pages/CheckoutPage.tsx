import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { findProduct } from '../data/products';
import { ProductArtwork } from '../components/ProductArtwork';

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [complete, setComplete] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setComplete(true);
    clearCart();
    requestAnimationFrame(() => document.getElementById('checkout-result')?.focus());
  }

  if (complete) {
    return (
      <main id="main-content" className="wm-checkout-page">
        <section id="checkout-result" className="wm-checkout-success" tabIndex={-1} role="status">
          <p className="wm-eyebrow">Demonstration complete</p>
          <h1>Your demo order is ready.</h1>
          <p>No payment was processed and no personal information was stored or transmitted. This completes the prototype purchase journey.</p>
          <Link to="/" className="wm-button wm-button--primary wm-button--lg">Return to Waymark</Link>
        </section>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main id="main-content" className="wm-empty-page">
        <p className="wm-eyebrow">Demo checkout</p>
        <h1>Your cart is waiting for a first step.</h1>
        <p>Add an item from the concept shop to explore the complete checkout flow.</p>
        <Link to="/store" className="wm-button wm-button--primary wm-button--lg">Browse the concept shop</Link>
      </main>
    );
  }

  return (
    <main id="main-content" className="wm-checkout-page">
      <header className="wm-page-intro wm-page-intro--left">
        <p className="wm-eyebrow">Portfolio prototype</p>
        <h1>Review your demo order</h1>
        <p>This checkout demonstrates a complete interface flow. It does not collect payment or transmit your information.</p>
      </header>
      <div className="wm-checkout-grid">
        <form className="wm-checkout-form" onSubmit={handleSubmit}>
          <h2>Delivery details</h2>
          <label htmlFor="checkout-name">Full name</label>
          <input id="checkout-name" name="name" autoComplete="name" required minLength={2} />
          <label htmlFor="checkout-email">Email address</label>
          <input id="checkout-email" name="email" type="email" autoComplete="email" required />
          <label htmlFor="checkout-address">Mailing address</label>
          <textarea id="checkout-address" name="address" autoComplete="street-address" required rows={4} />
          <p className="wm-form-note">These details remain in the form and are discarded when the demo is completed.</p>
          <button className="wm-button wm-button--primary wm-button--lg" type="submit">Complete demo order</button>
        </form>
        <aside className="wm-order-summary" aria-labelledby="order-summary-heading">
          <h2 id="order-summary-heading">Order summary</h2>
          <ul>
            {items.map((item) => {
              const product = findProduct(item.productId);
              const variant = product?.variants.find((entry) => entry.id === item.variantId);
              if (!product || !variant) return null;
              return (
                <li key={`${item.productId}-${item.variantId}`}>
                  <ProductArtwork product={product} decorative />
                  <div><strong>{product.name}</strong><span>{variant.label} × {item.quantity}</span></div>
                  <span>${(product.basePrice + variant.priceModifier) * item.quantity}</span>
                </li>
              );
            })}
          </ul>
          <p className="wm-order-total"><span>Demo subtotal</span><strong>${subtotal}.00</strong></p>
          <p className="wm-form-note">Shipping and taxes are intentionally omitted because this is not a live store.</p>
        </aside>
      </div>
    </main>
  );
}
