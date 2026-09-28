import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { WaymarkLogo } from './WaymarkLogo';
import { useCart } from '../context/useCart';
import './SiteHeader.css';

const links = [
  { to: '/devotional', label: 'Devotional' },
  { to: '/resources', label: 'Resources' },
  { to: '/store', label: 'Shop' },
  { to: '/about', label: 'About' },
];

interface SiteHeaderProps {
  onOpenCart: () => void;
}

export function SiteHeader({ onOpenCart }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const { itemCount } = useCart();

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="wm-site-header">
      <div className="wm-site-header__inner">
        <Link to="/" className="wm-brand" aria-label="Waymark home">
          <WaymarkLogo size={38} />
          <span>Waymark</span>
        </Link>

        <nav className="wm-desktop-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="wm-site-header__actions">
          <button
            className="wm-cart-button"
            type="button"
            onClick={onOpenCart}
            aria-label={itemCount > 0 ? `Cart, ${itemCount} item${itemCount === 1 ? '' : 's'}` : 'Cart'}
          >
            <span aria-hidden="true">Cart</span>
            {itemCount > 0 && <span className="wm-cart-count" aria-hidden="true">{itemCount}</span>}
          </button>
          <button
            ref={menuButtonRef}
            className="wm-menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
          </button>
        </div>
      </div>

      <nav id="mobile-navigation" className="wm-mobile-nav" aria-label="Mobile navigation" hidden={!menuOpen}>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to}>
            {link.label}
          </NavLink>
        ))}
        <Link to="/devotional" className="wm-mobile-nav__cta">Begin today's reading</Link>
      </nav>
    </header>
  );
}
