import { Link } from 'react-router-dom';
import { WaymarkLogo } from '../components/WaymarkLogo';
import './AboutPage.css';

export function AboutPage() {
  return (
    <main id="main-content">
      <section className="wm-about-hero">
        <div className="wm-about-hero__mark"><WaymarkLogo size={88} /></div>
        <div>
          <p className="wm-eyebrow">Why Waymark exists</p>
          <h1>Every step can carry meaning—even when the road is unclear.</h1>
          <p>Waymark is a concept for people who want a steady spiritual practice without performance, noise, or easy answers.</p>
        </div>
      </section>
      <section className="wm-about-story wm-section">
        <div className="wm-section-content wm-about-story__grid">
          <div className="wm-about-story__intro"><p className="wm-eyebrow">The idea</p><h2>A compass, not a spotlight.</h2></div>
          <div className="wm-about-story__body">
            <p>Some spiritual tools ask you to feel inspired before you begin. Waymark starts somewhere more honest: with the day you actually have.</p>
            <p>Each reading is intentionally small enough to finish and substantial enough to carry. The aim is not to manufacture certainty. It is to help you notice the next faithful step.</p>
          </div>
        </div>
      </section>
      <section className="wm-values-section">
        <div className="wm-section-content wm-values-grid">
          <article><span>01</span><h2>Steady, not showy</h2><p>Faith grows in ordinary days more than dramatic ones. The practice makes room for repetition, patience, and quiet attention.</p></article>
          <article><span>02</span><h2>Honest about the hard parts</h2><p>Doubt, grief, and unanswered questions get real space here—not a rushed verse and a smile.</p></article>
          <article><span>03</span><h2>One step is enough</h2><p>You do not need the whole map today. Just enough light for the step in front of you.</p></article>
        </div>
      </section>
      <section className="wm-about-principles wm-section">
        <div className="wm-section-content wm-about-principles__grid">
          <div><p className="wm-eyebrow">Product principles</p><h2>Built for trust, not attention capture.</h2></div>
          <ul role="list">
            <li><strong>Private by default</strong><span>Reading progress and cart state stay in your browser.</span></li>
            <li><strong>Accessible by design</strong><span>Keyboard navigation, reduced-motion support, readable contrast, and clear feedback are part of the foundation.</span></li>
            <li><strong>Transparent prototype</strong><span>The shop demonstrates a complete journey without pretending to collect payment.</span></li>
          </ul>
        </div>
      </section>
      <section className="wm-about-cta"><div className="wm-section-content--narrow"><h2>Start with today.</h2><p>One verse and one honest reflection are enough.</p><Link to="/devotional" className="wm-button wm-button--primary wm-button--lg">Begin today’s devotional</Link></div></section>
    </main>
  );
}
