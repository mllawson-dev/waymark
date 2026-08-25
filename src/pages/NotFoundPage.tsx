import { Link, useLocation } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';

/**
 * Without a catch-all route an unknown URL renders nothing at all, which looks
 * like a broken build rather than a wrong address.
 */
export function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <PageContainer>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: 'var(--color-text-primary)', margin: 0 }}>
        Page not found
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)', marginTop: '1rem', lineHeight: 1.6 }}>
        There's nothing at <code>{pathname}</code>. <Link to="/">Head back home</Link> or browse the{' '}
        <Link to="/resources">resources</Link>.
      </p>
    </PageContainer>
  );
}
