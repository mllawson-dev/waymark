import { Link } from 'react-router-dom';
import { PageContainer } from './PageContainer';

interface NotFoundMessageProps {
  message: string;
  backTo: string;
  backLabel: string;
}

/**
 * Fallback page for a detail route whose id doesn't resolve. Rendered inside a
 * PageContainer so the skip link and route-change focus target still exist.
 */
export function NotFoundMessage({ message, backTo, backLabel }: NotFoundMessageProps) {
  return (
    <PageContainer>
      <p style={{ fontFamily: 'var(--font-body)' }}>
        {message} <Link to={backTo}>{backLabel}</Link>
      </p>
    </PageContainer>
  );
}
