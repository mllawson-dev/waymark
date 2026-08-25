import { Link } from 'react-router-dom';

interface BackLinkProps {
  to: string;
  children: string;
}

/** The muted "← Back to …" link at the top of every detail page. */
export function BackLink({ to, children }: BackLinkProps) {
  return (
    <Link
      to={to}
      style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}
    >
      &larr; {children}
    </Link>
  );
}
