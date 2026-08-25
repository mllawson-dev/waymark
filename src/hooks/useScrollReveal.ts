import { useEffect, useRef, useState } from 'react';

/**
 * Returns a ref to attach to an element and whether it has scrolled into view.
 * Once revealed, stays revealed (no re-hiding on scroll back up).
 * Respects prefers-reduced-motion by revealing immediately without observing.
 */
export function useScrollReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    // Already visible (either reduced motion was preferred, or a previous
    // observation already revealed it) — nothing left to observe.
    if (isVisible) return;

    const node = ref.current;
    if (!node) return;

    // Without IntersectionObserver the content would stay hidden forever, so
    // reveal it rather than silently dropping the element from the page.
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

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
