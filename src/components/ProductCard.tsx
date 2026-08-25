import { Link } from 'react-router-dom';
import { Card, CardTitle, CardBody, CardFooter } from './Card';
import { Badge } from './Badge';
import { formatPrice } from '../utils/format';
import type { Product } from '../types/product';

export function ProductCard({ product }: { product: Product }) {
  const anyInStock = product.variants.some((v) => v.inStock);

  return (
    <Link to={`/store/${product.id}`} className="wm-card-link">
      <Card>
        <Badge tone={anyInStock ? 'sage' : 'neutral'}>{anyInStock ? product.category : 'Sold out'}</Badge>
        <CardTitle>{product.name}</CardTitle>
        <CardBody>{product.description}</CardBody>
        <CardFooter>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {formatPrice(product.basePrice)}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
