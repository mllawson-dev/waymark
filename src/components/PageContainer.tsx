import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  /** 'narrow' (640px) for reading-focused pages, 'wide' (720px) for grids/landing pages. */
  width?: 'narrow' | 'wide';
}

/**
 * Every page's <main> uses this same centered-column shape. Consolidating it
 * here also guarantees `id="main-content"` is always present — including on
 * "not found" fallback states — so the skip link and route-change focus
 * management never target a missing element.
 */
export function PageContainer({ children, width = 'narrow' }: PageContainerProps) {
  return (
    <main
      id="main-content"
      style={{ maxWidth: width === 'wide' ? 720 : 640, margin: '0 auto', padding: '3rem 1.5rem' }}
    >
      {children}
    </main>
  );
}
