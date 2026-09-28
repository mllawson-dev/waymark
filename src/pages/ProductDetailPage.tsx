import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { Button } from '../components/Button';
import { LiveAnnouncer } from '../components/LiveAnnouncer';
import { ProductArtwork } from '../components/ProductArtwork';
import { useCart } from '../context/useCart';
import './Store.css';

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const product = products.find((entry) => entry.id === productId);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [announceNonce, setAnnounceNonce] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(product?.variants.find((variant) => variant.inStock)?.id ?? product?.variants[0]?.id ?? '');

  if (!product) {
    return <main id="main-content" className="wm-empty-page"><p className="wm-eyebrow">Item not found</p><h1>This object isn’t on the shelf.</h1><Link to="/store" className="wm-button wm-button--primary wm-button--lg">Back to the concept shop</Link></main>;
  }
  const currentProduct = product;

  const selectedVariant = currentProduct.variants.find((variant) => variant.id === selectedVariantId);
  const price = currentProduct.basePrice + (selectedVariant?.priceModifier ?? 0);

  function handleAddToCart() {
    if (!selectedVariant?.inStock) return;
    addItem(currentProduct.id, selectedVariant.id);
    setAdded(true);
    setAnnouncement(`${currentProduct.name}, ${selectedVariant.label}, added to cart`);
    setAnnounceNonce((n) => n + 1);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <main id="main-content" className="wm-product-detail">
      <div className="wm-product-detail__image"><ProductArtwork product={product} loading="eager" /></div>
      <div className="wm-product-detail__copy">
        <Link to="/store" className="wm-back-link">← Back to concept shop</Link>
        <p className="wm-eyebrow">{product.category}</p>
        <h1>{product.name}</h1>
        <p className="wm-product-detail__description">{product.description}</p>
        <p className="wm-product-detail__price">${price}.00</p>
        <fieldset className="wm-variant-picker">
          <legend>Choose an option</legend>
          <div>
            {product.variants.map((variant) => (
              <label key={variant.id} className={!variant.inStock ? 'is-disabled' : ''}>
                <input type="radio" name="variant" value={variant.id} checked={variant.id === selectedVariantId} onChange={() => setSelectedVariantId(variant.id)} disabled={!variant.inStock} />
                <span>{variant.label}{!variant.inStock ? ' — sold out' : ''}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <Button variant="primary" size="lg" onClick={handleAddToCart} disabled={!selectedVariant?.inStock}>
          {added ? '✓ Added to cart' : 'Add to demo cart'}
        </Button>
        <LiveAnnouncer message={announcement} nonce={announceNonce} />
        <p className="wm-form-note">Portfolio demonstration only. No payment will be collected.</p>
        <ul className="wm-product-detail__details" role="list">
          {product.details.map((detail) => <li key={detail}><span aria-hidden="true">—</span>{detail}</li>)}
        </ul>
      </div>
    </main>
  );
}
