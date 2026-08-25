import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ScrollReveal } from '../components/ScrollReveal';
import { CardGrid } from '../components/CardGrid';
import { PageTitle } from '../components/PageTitle';
import { PageContainer } from '../components/PageContainer';

export function StorePage() {
  return (
    <PageContainer width="wide">
      <PageTitle style={{ marginBottom: '1.5rem' }}>Store</PageTitle>
      <h2 className="wm-visually-hidden">All products</h2>
      <CardGrid>
        {products.map((product, index) => (
          <ScrollReveal key={product.id} delayMs={(index % 6) * 60}>
            <ProductCard product={product} />
          </ScrollReveal>
        ))}
      </CardGrid>
    </PageContainer>
  );
}
