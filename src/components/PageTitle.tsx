import type { CSSProperties, ReactNode } from 'react';

interface PageTitleProps {
  children: ReactNode;
  /** 'md' for listing pages, 'lg' for detail/landing pages. */
  size?: 'md' | 'lg';
  style?: CSSProperties;
}

const sizes: Record<'md' | 'lg', string> = { md: '1.75rem', lg: '2rem' };

/** The serif page-level heading used at the top of every page. */
export function PageTitle({ children, size = 'md', style }: PageTitleProps) {
  return (
    <h1
      style={{
        fontFamily: 'var(--font-heading)',
        fontSize: sizes[size],
        color: 'var(--color-text-primary)',
        ...style,
      }}
    >
      {children}
    </h1>
  );
}
