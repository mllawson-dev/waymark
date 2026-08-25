import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resources } from '../data/resources';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { categoryLabels } from '../data/categoryLabels';
import { PageContainer } from '../components/PageContainer';

export function ResourceDetailPage() {
  const { resourceId } = useParams<{ resourceId: string }>();
  const resource = resources.find((r) => r.id === resourceId);
  const [downloadBlocked, setDownloadBlocked] = useState(false);

  function handleDownload(url: string) {
    // A blocked popup returns null, which would otherwise look like a dead button.
    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    setDownloadBlocked(opened === null);
  }

  if (!resource) {
    return (
      <PageContainer>
        <p style={{ fontFamily: 'var(--font-body)' }}>
          We couldn't find that resource. <Link to="/resources">Back to resources</Link>
        </p>
      </PageContainer>
    );
  }

  const downloadUrl = resource.downloadUrl;

  return (
    <PageContainer>
      <Link to="/resources" style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
        &larr; Back to resources
      </Link>

      <div style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
        <Badge tone="accent">{categoryLabels[resource.category]}</Badge>
      </div>

      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--color-text-primary)', margin: '0 0 0.75rem 0' }}>
        {resource.title}
      </h1>

      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
        {resource.body}
      </p>

      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {resource.tags.map((tag) => (
          <Badge key={tag} tone="neutral">
            {tag}
          </Badge>
        ))}
      </div>

      {downloadUrl && (
        <>
          <Button variant="secondary" onClick={() => handleDownload(downloadUrl)}>
            Download study guide
          </Button>
          {downloadBlocked && (
            <p
              role="alert"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                color: 'var(--color-text-secondary)',
                marginTop: '0.75rem',
              }}
            >
              Your browser blocked the download window.{' '}
              <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                Open the study guide directly
              </a>
              .
            </p>
          )}
        </>
      )}
    </PageContainer>
  );
}
