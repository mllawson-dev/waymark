import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ScrollReveal } from '../components/ScrollReveal';
import { PageContainer } from '../components/PageContainer';

export function StorePage() {
  return (
    <PageContainer width="wide">
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: 'var(--color-text-primary)', marginBottom: '1.5rem' }}>
        Store
      </h1>
      <h2 className="wm-visually-hidden">All products</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {products.map((product, index) => (
          <ScrollReveal key={product.id} delayMs={(index % 6) * 60}>
            <ProductCard product={product} />
          </ScrollReveal>
        ))}
      </div>
    </PageContainer>
  );
}
