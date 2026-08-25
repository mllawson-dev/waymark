import type { CSSProperties, ReactNode } from 'react';

interface SectionLabelProps {
  children: ReactNode;
  /** 'eyebrow' is the small bold kicker; 'heading' is the lighter, larger form. */
  variant?: 'eyebrow' | 'heading';
  style?: CSSProperties;
}

const variantStyles: Record<'eyebrow' | 'heading', CSSProperties> = {
  eyebrow: { fontSize: '0.8125rem', fontWeight: 600 },
  heading: { fontSize: '0.9rem', fontWeight: 400 },
};

/** The uppercase label that introduces a section. */
export function SectionLabel({ children, variant = 'eyebrow', style }: SectionLabelProps) {
  return (
    <h2
      style={{
        fontFamily: 'var(--font-body)',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: 'var(--color-text-secondary)',
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </h2>
  );
}
