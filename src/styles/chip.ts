import type { CSSProperties } from 'react';

interface ChipStyleOptions {
  active: boolean;
  /** 'pill' for filter chips, 'rounded' for option/variant chips. */
  shape?: 'pill' | 'rounded';
  fontSize?: string;
  padding?: string;
  disabled?: boolean;
  /** Overrides the text color; defaults to accent when active, primary otherwise. */
  color?: string;
}

/**
 * The shared look for the site's toggleable chip buttons (category filters,
 * product options): an accent-tinted outline when selected, a plain outline
 * when not.
 */
export function chipStyle({
  active,
  shape = 'pill',
  fontSize = '0.8125rem',
  padding = '0.4rem 0.85rem',
  disabled = false,
  color,
}: ChipStyleOptions): CSSProperties {
  return {
    fontFamily: 'var(--font-body)',
    fontSize,
    fontWeight: active ? 700 : 400,
    padding,
    borderRadius: shape === 'pill' ? '999px' : 'var(--radius-sm)',
    border: `1.5px solid ${active ? 'var(--color-accent-deep)' : 'var(--color-border)'}`,
    backgroundColor: active ? 'rgba(150, 93, 45, 0.1)' : 'transparent',
    color: disabled
      ? 'var(--color-text-secondary)'
      : (color ?? (active ? 'var(--color-accent-deep)' : 'var(--color-text-primary)')),
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  };
}
