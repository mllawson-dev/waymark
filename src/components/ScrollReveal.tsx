import type { ReactNode } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './ScrollReveal.css';

interface ScrollRevealProps {
  children: ReactNode;
  delayMs?: number;
}

export function ScrollReveal({ children, delayMs = 0 }: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`wm-scroll-reveal ${isVisible ? 'wm-scroll-reveal--visible' : ''}`}
      style={{ transitionDelay: isVisible ? `${delayMs}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}
