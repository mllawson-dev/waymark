import { Link } from 'react-router-dom';
import { getDailyDevotional } from '../data/devotionals';
import { resources } from '../data/resources';
import { products } from '../data/products';
import { WaymarkLogo } from '../components/WaymarkLogo';
import { ProductArtwork } from '../components/ProductArtwork';
import './Home.css';

export function Home() {
  const today = getDailyDevotional();
  const featuredResource = resources[0]!;
  const journal = products[0]!;

  return (
    <main id="main-content">
      <section className="wm-home-hero">
        <div className="wm-home-hero__copy">
          <p className="wm-eyebrow">A quieter way to keep going</p>
          <h1>You don’t need the whole map. Just the next faithful step.</h1>
          <p className="wm-home-hero__lede">Waymark brings scripture, reflection, and honest practices into the ordinary rhythm of your day—without noise, pressure, or pretending.</p>
          <div className="wm-home-hero__actions">
            <Link to="/devotional" className="wm-button wm-button--primary wm-button--lg">Begin today’s devotional</Link>
            <Link to="/about" className="wm-text-link">Why Waymark exists <span aria-hidden="true">→</span></Link>
          </div>
          <div className="wm-home-hero__reassurance">
            <WaymarkLogo size={28} />
            <span>About five quiet minutes. Progress stays on this device.</span>
          </div>
        </div>
        <div className="wm-home-hero__visual">
          <ProductArtwork product={journal} loading="eager" />
          <div className="wm-home-hero__verse">
            <span>Today’s reading</span>
            <strong>{today.verseReference}</strong>
          </div>
        </div>
      </section>

      <section className="wm-daily-section wm-section">
        <div className="wm-section-content wm-daily-grid">
          <article className="wm-daily-feature">
            <p className="wm-eyebrow">Today’s waymark</p>
            <blockquote>“{today.verseText}”</blockquote>
            <p>{today.reflection}</p>
            <Link to="/devotional" className="wm-text-link">Read the reflection <span aria-hidden="true">→</span></Link>
          </article>
          <aside className="wm-practice-rail" aria-labelledby="practice-heading">
            <p className="wm-practice-rail__number">01</p>
            <h2 id="practice-heading">Read slowly</h2>
            <p>Start with one verse, not an endless feed.</p>
            <p className="wm-practice-rail__number">02</p>
            <h2>Make room</h2>
            <p>Reflect honestly, including the unresolved parts.</p>
            <p className="wm-practice-rail__number">03</p>
            <h2>Carry one thing</h2>
            <p>Leave with a prayer or practice for the day ahead.</p>
          </aside>
        </div>
      </section>

      <section className="wm-statement-section">
        <div className="wm-section-content--narrow">
          <span className="wm-statement-section__mark"><WaymarkLogo size={44} /></span>
          <h2>Faith grows in ordinary days more than dramatic ones.</h2>
          <p>Waymark is built for the quiet walk—the mornings when you feel steady and the ones when you do not.</p>
        </div>
      </section>

      <section className="wm-resource-feature wm-section">
        <div className="wm-section-content wm-resource-feature__grid">
          <div className="wm-resource-feature__intro">
            <p className="wm-eyebrow">For the road you’re actually on</p>
            <h2>Honest resources for real seasons.</h2>
            <p>Prayer, grief, parenting, growth, and community—written to make space for complexity, not rush past it.</p>
            <Link to="/resources" className="wm-button wm-button--secondary wm-button--md">Explore the library</Link>
          </div>
          <article className="wm-featured-resource">
            <span>{featuredResource.category}</span>
            <h3>{featuredResource.title}</h3>
            <p>{featuredResource.summary}</p>
            <Link to={`/resources/${featuredResource.id}`}>Read this resource <span aria-hidden="true">→</span></Link>
          </article>
        </div>
      </section>

      <section className="wm-shop-teaser">
        <div className="wm-shop-teaser__image">
          <ProductArtwork product={products[2]!} />
        </div>
        <div className="wm-shop-teaser__copy">
          <p className="wm-eyebrow">Concept shop</p>
          <h2>Objects for the everyday walk.</h2>
          <p>A small, carefully designed collection that extends the Waymark rhythm beyond the screen. The shopping journey is a transparent portfolio demonstration; no payment is collected.</p>
          <Link to="/store" className="wm-button wm-button--primary wm-button--md">Visit the concept shop</Link>
        </div>
      </section>

      <section className="wm-home-closer">
        <div className="wm-section-content--narrow">
          <p className="wm-eyebrow">Your next step is enough</p>
          <h2>Meet today with a little more light.</h2>
          <p>One verse. One honest reflection. One prayer to carry with you.</p>
          <Link to="/devotional" className="wm-button wm-button--primary wm-button--lg">Open today’s devotional</Link>
        </div>
      </section>
    </main>
  );
}
