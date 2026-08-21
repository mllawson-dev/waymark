import { Link } from 'react-router-dom';
import { Card, CardTitle, CardBody, CardFooter } from './Card';
import { Badge } from './Badge';
import { categoryLabels } from '../data/categoryLabels';
import type { Resource } from '../types/resource';

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link to={`/resources/${resource.id}`} className="wm-card-link">
      <Card>
        <Badge tone="accent">{categoryLabels[resource.category]}</Badge>
        <CardTitle>{resource.title}</CardTitle>
        <CardBody>{resource.summary}</CardBody>
        <CardFooter>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            {resource.tags.join(' · ')}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
