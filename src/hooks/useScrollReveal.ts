import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../utils/motion';

/**
 * Returns a ref to attach to an element and whether it has scrolled into view.
 * Once revealed, stays revealed (no re-hiding on scroll back up).
 * Respects prefers-reduced-motion by revealing immediately without observing.
 */
export function useScrollReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(prefersReducedMotion);

  useEffect(() => {
    // Already visible (either reduced motion was preferred, or a previous
    // observation already revealed it) — nothing left to observe.
    if (isVisible) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, isVisible]);

  return { ref, isVisible };
}
