import { Link } from 'react-router-dom';
import { categoryLabels } from '../data/categoryLabels';
import type { Resource } from '../types/resource';

export function ResourceCard({ resource, featured = false }: { resource: Resource; featured?: boolean }) {
  return (
    <article className={`wm-resource-card${featured ? ' wm-resource-card--featured' : ''}`}>
      <p className="wm-resource-card__meta"><span>{categoryLabels[resource.category]}</span><span>{resource.tags.join(' · ')}</span></p>
      <h2><Link to={`/resources/${resource.id}`}>{resource.title}</Link></h2>
      <p>{resource.summary}</p>
      <Link to={`/resources/${resource.id}`} className="wm-resource-card__link">Read resource <span aria-hidden="true">→</span></Link>
    </article>
  );
}
