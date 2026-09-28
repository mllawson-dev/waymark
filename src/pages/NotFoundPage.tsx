import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main id="main-content" className="wm-empty-page">
      <p className="wm-eyebrow">Off the path</p>
      <h1>That waymark isn’t here.</h1>
      <p>The page may have moved, but the next step is simple.</p>
      <Link to="/" className="wm-button wm-button--primary wm-button--lg">Return home</Link>
    </main>
  );
}
