import type { ReactNode } from 'react';

interface CardGridProps {
  children: ReactNode;
  /** Minimum column width before the grid wraps. */
  minItemWidth?: number;
  /** 'fill' keeps empty tracks (long lists), 'fit' collapses them (short lists). */
  fit?: 'fill' | 'fit';
}

/** The responsive card grid shared by the store, resources, and home listings. */
export function CardGrid({ children, minItemWidth = 220, fit = 'fill' }: CardGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-${fit}, minmax(${minItemWidth}px, 1fr))`,
        gap: '1.25rem',
      }}
    >
      {children}
    </div>
  );
}
