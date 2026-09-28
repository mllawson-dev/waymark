import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import './Store.css';

export function StorePage() {
  return (
    <main id="main-content">
      <section className="wm-store-intro wm-section">
        <div className="wm-section-content">
          <div className="wm-page-intro wm-page-intro--left">
            <p className="wm-eyebrow">Concept shop</p>
            <h1>Small reminders for the road.</h1>
            <p>Thoughtful objects imagined for scripture, reflection, and the everyday walk. This is a transparent portfolio demonstration; no real payment is collected.</p>
          </div>
          <div className="wm-prototype-note" role="note">
            <strong>Explore the full product journey.</strong>
            <span>Add items, choose variants, review your cart, and complete the clearly labeled demo checkout.</span>
          </div>
        </div>
      </section>
      <section className="wm-store-grid-section">
        <div className="wm-section-content wm-product-grid">
          {products.map((product, index) => <ProductCard key={product.id} product={product} featured={index === 0} />)}
        </div>
      </section>
      <section className="wm-store-principles">
        <div className="wm-section-content wm-store-principles__grid">
          <div><span>01</span><h2>Useful before decorative</h2><p>Every object begins with a purpose in the daily practice.</p></div>
          <div><span>02</span><h2>Quiet materials</h2><p>Natural texture, restrained color, and details that reward attention.</p></div>
          <div><span>03</span><h2>Honest prototype</h2><p>The experience is complete enough to explore without pretending to process a sale.</p></div>
        </div>
      </section>
    </main>
  );
}
