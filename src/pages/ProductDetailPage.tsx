import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { LiveAnnouncer } from '../components/LiveAnnouncer';
import { PageContainer } from '../components/PageContainer';
import { useCart } from '../context/useCart';

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const product = products.find((p) => p.id === productId);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const [selectedVariantId, setSelectedVariantId] = useState(
    product?.variants.find((v) => v.inStock)?.id ?? product?.variants[0]?.id ?? ''
  );

  if (!product) {
    return (
      <PageContainer>
        <p style={{ fontFamily: 'var(--font-body)' }}>
          We couldn't find that product. <Link to="/store">Back to store</Link>
        </p>
      </PageContainer>
    );
  }

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const price = product.basePrice + (selectedVariant?.priceModifier ?? 0);

  function handleAddToCart() {
    if (!product || !selectedVariant || !selectedVariant.inStock) return;
    addItem(product.id, selectedVariant.id);
    setAdded(true);
    setAnnouncement(`${product.name} (${selectedVariant.label}) added to cart`);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <PageContainer>
      <Link to="/store" style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
        &larr; Back to store
      </Link>

      <div style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
        <Badge tone="sage">{product.category}</Badge>
      </div>

      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--color-text-primary)', margin: '0 0 0.5rem 0' }}>
        {product.name}
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
        {product.description}
      </p>

      <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--color-text-primary)', marginBottom: '1.25rem' }}>
        ${price}
      </p>

      <div style={{ marginBottom: '1.5rem' }}>
        <p id="options-label" style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
          Options
        </p>
        <div role="group" aria-labelledby="options-label" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              aria-pressed={variant.id === selectedVariantId}
              onClick={() => setSelectedVariantId(variant.id)}
              disabled={!variant.inStock}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: variant.id === selectedVariantId ? 700 : 400,
                padding: '0.5rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                border: `1.5px solid ${variant.id === selectedVariantId ? 'var(--color-accent-deep)' : 'var(--color-border)'}`,
                backgroundColor: variant.id === selectedVariantId ? 'rgba(150, 93, 45, 0.1)' : 'transparent',
                color: variant.inStock ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                cursor: variant.inStock ? 'pointer' : 'not-allowed',
                opacity: variant.inStock ? 1 : 0.5,
              }}
            >
              {variant.id === selectedVariantId ? '✓ ' : ''}
              {variant.label}
              {!variant.inStock && ' (sold out)'}
            </button>
          ))}
        </div>
      </div>

      <Button variant="primary" onClick={handleAddToCart} disabled={!selectedVariant?.inStock}>
        {added && (
          <span className="wm-check-pop" aria-hidden="true">
            ✓
          </span>
        )}
        {added ? 'Added to cart' : 'Add to cart'}
      </Button>
      <LiveAnnouncer message={announcement} />
    </PageContainer>
  );
}
