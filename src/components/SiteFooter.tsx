import { Link } from 'react-router-dom';
import { WaymarkLogo } from './WaymarkLogo';
import './SiteFooter.css';

export function SiteFooter() {
  return (
    <footer className="wm-footer">
      <div className="wm-footer__grid">
        <div className="wm-footer__brand">
          <div className="wm-footer__mark"><WaymarkLogo size={42} /></div>
          <p className="wm-footer__name">Waymark</p>
          <p>A quiet daily companion for the next faithful step.</p>
        </div>
        <nav aria-label="Practice links">
          <p className="wm-footer__label">Practice</p>
          <Link to="/devotional">Today's devotional</Link>
          <Link to="/resources">Resource library</Link>
        </nav>
        <nav aria-label="Waymark links">
          <p className="wm-footer__label">Waymark</p>
          <Link to="/about">Our approach</Link>
          <Link to="/store">Concept shop</Link>
        </nav>
        <div className="wm-footer__note">
          <p className="wm-footer__label">Built with care</p>
          <p>Your reading progress and cart stay in this browser. This portfolio prototype does not collect or transmit personal information.</p>
        </div>
      </div>
      <div className="wm-footer__bottom">
        <span>© {new Date().getFullYear()} Waymark concept.</span>
        <span>Designed for calm, clarity, and accessible use.</span>
      </div>
    </footer>
  );
}
