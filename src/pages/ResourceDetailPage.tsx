import { Link, useParams } from 'react-router-dom';
import { resources } from '../data/resources';
import { categoryLabels } from '../data/categoryLabels';
import './Resources.css';

export function ResourceDetailPage() {
  const { resourceId } = useParams<{ resourceId: string }>();
  const resource = resources.find((entry) => entry.id === resourceId);

  if (!resource) return <main id="main-content" className="wm-empty-page"><p className="wm-eyebrow">Resource not found</p><h1>This guide isn’t in the library.</h1><Link to="/resources" className="wm-button wm-button--primary wm-button--lg">Back to resources</Link></main>;

  return (
    <main id="main-content" className="wm-resource-detail">
      <article>
        <Link to="/resources" className="wm-back-link">← Back to resources</Link>
        <p className="wm-eyebrow">{categoryLabels[resource.category]}</p>
        <h1>{resource.title}</h1>
        <p className="wm-resource-detail__lede">{resource.summary}</p>
        <div className="wm-resource-detail__body">
          <p>{resource.body}</p>
          <blockquote>Give yourself permission to move slowly. A faithful response does not have to be a fast one.</blockquote>
          <h2>A simple next step</h2>
          <p>Choose one sentence that feels honest today. Write it down, sit with it for a few quiet minutes, and let that be enough for now.</p>
        </div>
        <div className="wm-resource-detail__tags" aria-label="Topics">{resource.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </article>
      <aside className="wm-resource-detail__aside">
        <span>Keep walking</span>
        <p>More resources are available for the questions and seasons that do not resolve in one sitting.</p>
        <Link to="/resources">Return to the library →</Link>
      </aside>
    </main>
  );
}
