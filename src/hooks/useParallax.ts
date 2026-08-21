import { useEffect, useState } from 'react';

/**
 * Returns a vertical offset (px) that grows with scroll position, for a
 * subtle parallax drift. Capped at `max` and throttled via requestAnimationFrame.
 * Returns 0 (no movement) when the user prefers reduced motion.
 */
export function useParallax(factor = 0.15, max = 24) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    function handleScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setOffset(Math.min(window.scrollY * factor, max));
        ticking = false;
      });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [factor, max]);

  return offset;
}
