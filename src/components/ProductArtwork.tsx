import type { Product } from '../types/product';
import { WaymarkLogo } from './WaymarkLogo';
import './ProductArtwork.css';

interface ProductArtworkProps {
  product: Product;
  loading?: 'eager' | 'lazy';
  decorative?: boolean;
}

export function ProductArtwork({ product, loading = 'lazy', decorative = false }: ProductArtworkProps) {
  const carriesBrandMark = product.id !== 'prod-003';

  return (
    <div className={`wm-product-artwork wm-product-artwork--${product.id}`}>
      <img
        src={product.image}
        alt={decorative ? '' : product.imageAlt}
        width="1200"
        height="1200"
        loading={loading}
      />
      {carriesBrandMark && (
        <span className="wm-product-artwork__mark" aria-hidden="true">
          <WaymarkLogo size={120} />
        </span>
      )}
    </div>
  );
}
