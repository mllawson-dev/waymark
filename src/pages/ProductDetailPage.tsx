import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { findProduct, findVariant } from '../data/products';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { BackLink } from '../components/BackLink';
import { LiveAnnouncer } from '../components/LiveAnnouncer';
import { NotFoundMessage } from '../components/NotFoundMessage';
import { PageContainer } from '../components/PageContainer';
import { PageTitle } from '../components/PageTitle';
import { CheckPop } from '../components/CheckPop';
import { chipStyle } from '../styles/chip';
import { formatPrice } from '../utils/format';
import { useCart } from '../context/useCart';

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const product = findProduct(productId);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const [selectedVariantId, setSelectedVariantId] = useState(
    product?.variants.find((v) => v.inStock)?.id ?? product?.variants[0]?.id ?? ''
  );

  if (!product) {
    return (
      <NotFoundMessage
        message="We couldn't find that product."
        backTo="/store"
        backLabel="Back to store"
      />
    );
  }

  const selectedVariant = findVariant(product, selectedVariantId);
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
      <BackLink to="/store">Back to store</BackLink>

      <div style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
        <Badge tone="sage">{product.category}</Badge>
      </div>

      <PageTitle size="lg" style={{ margin: '0 0 0.5rem 0' }}>
        {product.name}
      </PageTitle>
      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
        {product.description}
      </p>

      <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--color-text-primary)', marginBottom: '1.25rem' }}>
        {formatPrice(price)}
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
              style={chipStyle({
                active: variant.id === selectedVariantId,
                shape: 'rounded',
                fontSize: '0.875rem',
                padding: '0.5rem 0.9rem',
                disabled: !variant.inStock,
                color: 'var(--color-text-primary)',
              })}
            >
              {variant.id === selectedVariantId ? '✓ ' : ''}
              {variant.label}
              {!variant.inStock && ' (sold out)'}
            </button>
          ))}
        </div>
      </div>

      <Button variant="primary" onClick={handleAddToCart} disabled={!selectedVariant?.inStock}>
        {added && <CheckPop />}
        {added ? 'Added to cart' : 'Add to cart'}
      </Button>
      <LiveAnnouncer message={announcement} />
    </PageContainer>
  );
}
