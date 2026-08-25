import { useParams } from 'react-router-dom';
import { findResource } from '../data/resources';
import { Badge } from '../components/Badge';
import { BackLink } from '../components/BackLink';
import { Button } from '../components/Button';
import { categoryLabels } from '../data/categoryLabels';
import { NotFoundMessage } from '../components/NotFoundMessage';
import { PageContainer } from '../components/PageContainer';
import { PageTitle } from '../components/PageTitle';

export function ResourceDetailPage() {
  const { resourceId } = useParams<{ resourceId: string }>();
  const resource = findResource(resourceId);

  if (!resource) {
    return (
      <NotFoundMessage
        message="We couldn't find that resource."
        backTo="/resources"
        backLabel="Back to resources"
      />
    );
  }

  return (
    <PageContainer>
      <BackLink to="/resources">Back to resources</BackLink>

      <div style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
        <Badge tone="accent">{categoryLabels[resource.category]}</Badge>
      </div>

      <PageTitle size="lg" style={{ margin: '0 0 0.75rem 0' }}>
        {resource.title}
      </PageTitle>

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

      {resource.downloadUrl && (
        <Button variant="secondary" onClick={() => window.open(resource.downloadUrl, '_blank')}>
          Download study guide
        </Button>
      )}
    </PageContainer>
  );
}
