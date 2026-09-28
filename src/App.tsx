import { useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { StyleGuide } from './pages/StyleGuide';
import { DevotionalPage } from './pages/DevotionalPage';
import { StorePage } from './pages/StorePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ResourceDetailPage } from './pages/ResourceDetailPage';
import { AboutPage } from './pages/AboutPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { CartProvider } from './context/CartProvider';
import { Drawer } from './components/Drawer';
import { CartContents } from './components/CartContents';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import './App.css';

const pageMeta: Record<string, { title: string; description: string }> = {
  '/': { title: 'Waymark — one faithful step at a time', description: 'A quiet daily companion for scripture, reflection, and the next faithful step.' },
  '/devotional': { title: "Today's devotional — Waymark", description: 'Read today’s verse, reflection, and prayer, then mark the day complete.' },
  '/resources': { title: 'Resources — Waymark', description: 'Honest, practical resources for prayer, grief, parenting, growth, and community.' },
  '/store': { title: 'Concept shop — Waymark', description: 'A portfolio concept shop of devotional objects designed for the everyday walk.' },
  '/about': { title: 'Our approach — Waymark', description: 'Why Waymark makes room for honest questions, ordinary days, and one next step.' },
  '/checkout': { title: 'Demo checkout — Waymark', description: 'Review the Waymark portfolio prototype checkout. No payment is collected.' },
};

function AppShell() {
  const [cartOpenedAtPath, setCartOpenedAtPath] = useState<string | null>(null);
  const location = useLocation();
  const backgroundRef = useRef<HTMLDivElement>(null);
  const previousPathRef = useRef(location.pathname);
  const cartOpen = cartOpenedAtPath === location.pathname;

  useEffect(() => {
    if (previousPathRef.current !== location.pathname) {
      previousPathRef.current = location.pathname;
      window.scrollTo({ top: 0, behavior: 'instant' });
      const mainEl = document.getElementById('main-content');
      if (mainEl) {
        mainEl.setAttribute('tabindex', '-1');
        mainEl.focus({ preventScroll: true });
      }
    }
    const exact = pageMeta[location.pathname];
    const fallback = location.pathname.startsWith('/resources/')
      ? { title: 'Resource — Waymark', description: pageMeta['/resources']!.description }
      : location.pathname.startsWith('/store/')
        ? { title: 'Shop item — Waymark', description: pageMeta['/store']!.description }
        : { title: 'Page not found — Waymark', description: 'The requested Waymark page could not be found.' };
    const meta = exact ?? fallback;
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  }, [location.pathname]);

  return (
    <>
      <a href="#main-content" className="wm-skip-link">Skip to main content</a>
      <div ref={backgroundRef}>
        <SiteHeader onOpenCart={() => setCartOpenedAtPath(location.pathname)} />
        <div key={location.pathname} className="wm-page-transition">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/devotional" element={<DevotionalPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/resources/:resourceId" element={<ResourceDetailPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/store/:productId" element={<ProductDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/style-guide" element={<StyleGuide />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <SiteFooter />
      </div>
      <Drawer isOpen={cartOpen} onClose={() => setCartOpenedAtPath(null)} title="Your cart" backgroundRef={backgroundRef}>
        <CartContents />
      </Drawer>
    </>
  );
}

export default function App() {
  return <CartProvider><AppShell /></CartProvider>;
}
