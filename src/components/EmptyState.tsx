import type { CSSProperties, ReactNode } from 'react';
import { WaymarkLogo } from './WaymarkLogo';

interface EmptyStateProps {
  message: string;
  /** Optional call to action shown under the message (link, button). */
  action?: ReactNode;
  padding?: string;
  style?: CSSProperties;
}

/**
 * The site's "nothing here" state: a faded, monochrome compass mark above a
 * short explanation and an optional way out.
 */
export function EmptyState({ message, action, padding = '2rem 0.5rem', style }: EmptyStateProps) {
  return (
    <div style={{ textAlign: 'center', padding, ...style }}>
      <div style={{ opacity: 0.35, marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
        <WaymarkLogo
          size={40}
          northColor="var(--wm-ink-muted)"
          southColor="var(--wm-ink-muted)"
          ringColor="var(--wm-ink-muted)"
        />
      </div>
      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
        {message}
      </p>
      {action}
    </div>
  );
}
