import { Link } from 'react-router-dom';
import type { Product } from '../types/product';
import { formatPrice } from '../data/products';
import { ProductArtwork } from './ProductArtwork';

export function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const anyInStock = product.variants.some((variant) => variant.inStock);

  return (
    <article className={`wm-product-card${featured ? ' wm-product-card--featured' : ''}`}>
      <Link to={`/store/${product.id}`} className="wm-product-card__image">
        <ProductArtwork product={product} />
      </Link>
      <div className="wm-product-card__body">
        <p className="wm-product-card__meta"><span>{product.category}</span><span>{anyInStock ? 'Prototype in stock' : 'Sold out'}</span></p>
        <h2><Link to={`/store/${product.id}`}>{product.name}</Link></h2>
        <p>{product.description}</p>
        <div className="wm-product-card__footer">
          <strong>From {formatPrice(product.basePrice)}</strong>
          <Link to={`/store/${product.id}`}>View item <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </article>
  );
}
