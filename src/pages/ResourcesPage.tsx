import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { resources } from '../data/resources';
import { ResourceCard } from '../components/ResourceCard';
import { categoryLabels } from '../data/categoryLabels';
import type { ResourceCategory } from '../types/resource';
import './Resources.css';

const categories: ResourceCategory[] = ['prayer', 'grief', 'parenting', 'relationships', 'growth', 'community'];

export function ResourcesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const categoryParam = searchParams.get('category');
  const activeCategory = categories.includes(categoryParam as ResourceCategory) ? categoryParam as ResourceCategory : 'all';
  const [draft, setDraft] = useState(query);
  const pendingQueryRef = useRef(query);

  useEffect(() => {
    if (query !== pendingQueryRef.current) {
      pendingQueryRef.current = query;
      setDraft(query);
    }
  }, [query]);

  const filtered = useMemo(() => resources.filter((resource) => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    const matchesQuery = normalizedQuery === '' || [resource.title, resource.summary, ...resource.tags].some((value) => value.toLowerCase().includes(normalizedQuery));
    return matchesCategory && matchesQuery;
  }), [activeCategory, query]);

  function updateParam(name: 'q' | 'category', value: string) {
    if (name === 'q') {
      pendingQueryRef.current = value;
      setDraft(value);
    }
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (!value || value === 'all') next.delete(name); else next.set(name, value);
      return next;
    }, { replace: name === 'q' });
  }

  return (
    <main id="main-content" className="wm-resources-page">
      <header className="wm-resources-hero">
        <div className="wm-section-content">
          <p className="wm-eyebrow">The resource library</p>
          <h1>Honest help for the season you’re in.</h1>
          <p>Short practices and thoughtful guides for prayer, grief, parenting, growth, and showing up for one another.</p>
        </div>
      </header>
      <section className="wm-resource-controls" aria-label="Filter resources">
        <div className="wm-section-content">
          <label htmlFor="resource-search">Search the library</label>
          <input id="resource-search" type="search" value={draft} onChange={(event) => updateParam('q', event.target.value)} placeholder="Try prayer, change, or family" />
          <div className="wm-category-filters" role="group" aria-label="Filter by category">
            <button type="button" aria-pressed={activeCategory === 'all'} onClick={() => updateParam('category', 'all')}>All</button>
            {categories.map((category) => <button type="button" key={category} aria-pressed={activeCategory === category} onClick={() => updateParam('category', category)}>{categoryLabels[category]}</button>)}
          </div>
          <p className="wm-results-count" role="status">Showing {filtered.length} resource{filtered.length === 1 ? '' : 's'}</p>
        </div>
      </section>
      <section className="wm-resource-results">
        <div className="wm-section-content">
          {filtered.length === 0 ? (
            <div className="wm-resource-empty">
              <h2>No resources match those filters.</h2>
              <p>Try a broader search or return to the complete library.</p>
              <button type="button" className="wm-button wm-button--secondary wm-button--md" onClick={() => { updateParam('q', ''); updateParam('category', 'all'); }}>Clear filters</button>
            </div>
          ) : (
            <div className="wm-resource-grid">
              {filtered.map((resource, index) => <ResourceCard key={resource.id} resource={resource} featured={index === 0 && !query && activeCategory === 'all'} />)}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
