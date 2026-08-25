import { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { StyleGuide } from './pages/StyleGuide';
import { DevotionalPage } from './pages/DevotionalPage';
import { StorePage } from './pages/StorePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ResourceDetailPage } from './pages/ResourceDetailPage';
import { AboutPage } from './pages/AboutPage';
import { CartProvider } from './context/CartProvider';
import { useCart } from './context/useCart';
import { Drawer } from './components/Drawer';
import { CartContents } from './components/CartContents';
import { pluralize } from './utils/format';
import './App.css';

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  color: 'var(--color-accent-deep)',
  fontWeight: isActive ? 700 : 400,
  textDecoration: isActive ? 'underline' : 'none',
  textUnderlineOffset: '4px',
});

function NavBar({ onOpenCart }: { onOpenCart: () => void }) {
  const { itemCount } = useCart();
  return (
    <nav
      aria-label="Main navigation"
      style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', fontFamily: 'var(--font-body)' }}
    >
      <NavLink to="/" end style={navLinkStyle}>Home</NavLink>
      <NavLink to="/devotional" style={navLinkStyle}>Devotional</NavLink>
      <NavLink to="/resources" style={navLinkStyle}>Resources</NavLink>
      <NavLink to="/store" style={navLinkStyle}>Store</NavLink>
      <NavLink to="/about" style={navLinkStyle}>About</NavLink>
      <NavLink to="/style-guide" style={navLinkStyle}>Style guide</NavLink>
      <button
        onClick={onOpenCart}
        aria-label={itemCount > 0 ? `Open cart, ${pluralize(itemCount, 'item')}` : 'Open cart, empty'}
        style={{ marginLeft: 'auto', background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.75rem', fontFamily: 'var(--font-body)', cursor: 'pointer', color: 'var(--color-text-primary)' }}
      >
        Cart{itemCount > 0 ? ` (${itemCount})` : ''}
      </button>
    </nav>
  );
}

function AppShell() {
  const [cartOpenedAtPath, setCartOpenedAtPath] = useState<string | null>(null);
  const location = useLocation();

  // SPA route changes don't trigger a browser page load, so screen reader
  // users get no signal the page changed. Move focus to the new page's
  // main content, matching how a full page navigation would behave.
  useEffect(() => {
    const mainEl = document.getElementById('main-content');
    if (mainEl) {
      mainEl.setAttribute('tabindex', '-1');
      mainEl.focus();
    }
  }, [location.pathname]);

  // The drawer is considered open only if it was opened on the current
  // path — this closes it automatically the instant the route changes
  // (e.g. a link clicked from inside/behind it), without needing an
  // effect: it's derived during render rather than synchronized after it.
  const cartOpen = cartOpenedAtPath === location.pathname;

  return (
    <>
      <a href="#main-content" className="wm-skip-link">
        Skip to main content
      </a>
      <NavBar onOpenCart={() => setCartOpenedAtPath(location.pathname)} />
      <div key={location.pathname} className="wm-page-transition">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/devotional" element={<DevotionalPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/:resourceId" element={<ResourceDetailPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/store/:productId" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/style-guide" element={<StyleGuide />} />
        </Routes>
      </div>
      <Drawer isOpen={cartOpen} onClose={() => setCartOpenedAtPath(null)} title="Your cart">
        <CartContents />
      </Drawer>
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <AppShell />
    </CartProvider>
  );
}

export default App;
