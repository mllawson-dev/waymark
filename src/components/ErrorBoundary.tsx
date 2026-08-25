import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { reportError } from '../lib/reportError';
import { PageContainer } from './PageContainer';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportError('Unhandled render error', error, { componentStack: info.componentStack });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <PageContainer>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: 'var(--color-text-primary)' }}>
          Something went wrong
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)', marginTop: '1rem' }}>
          We hit an unexpected error and couldn't finish loading this page. Reloading usually clears it.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            fontFamily: 'var(--font-body)',
            marginTop: '1.25rem',
            padding: '0.5rem 0.9rem',
            borderRadius: 'var(--radius-sm)',
            border: '1.5px solid var(--color-accent-deep)',
            background: 'none',
            color: 'var(--color-text-primary)',
            cursor: 'pointer',
          }}
        >
          Reload the page
        </button>
      </PageContainer>
    );
  }
}
