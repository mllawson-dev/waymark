import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { resources } from '../data/resources';
import { PageContainer } from '../components/PageContainer';
import { ResourceCard } from '../components/ResourceCard';
import { categoryLabels } from '../data/categoryLabels';
import { ScrollReveal } from '../components/ScrollReveal';
import { WaymarkLogo } from '../components/WaymarkLogo';
import type { ResourceCategory } from '../types/resource';

const categories: ResourceCategory[] = ['prayer', 'grief', 'parenting', 'relationships', 'growth', 'community'];

export function ResourcesPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ResourceCategory | 'all'>('all');

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
      const matchesQuery =
        query.trim() === '' ||
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.summary.toLowerCase().includes(query.toLowerCase()) ||
        r.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  return (
    <PageContainer width="wide">
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: 'var(--color-text-primary)', marginBottom: '1.5rem' }}>
        Resources
      </h1>

      <label htmlFor="resource-search" className="wm-visually-hidden">
        Search resources
      </label>
      <input
        id="resource-search"
        type="text"
        placeholder="Search resources"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: '100%',
          fontFamily: 'var(--font-body)',
          fontSize: '0.9375rem',
          padding: '0.65rem 0.9rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border)',
          marginBottom: '1rem',
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
        }}
      />

      <div role="group" aria-label="Filter by category" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveCategory('all')}
          aria-pressed={activeCategory === 'all'}
          style={filterButtonStyle(activeCategory === 'all')}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            aria-pressed={activeCategory === cat}
            style={filterButtonStyle(activeCategory === cat)}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="wm-visually-hidden">
        {filtered.length} resource{filtered.length === 1 ? '' : 's'} found
      </p>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', animation: 'wm-page-fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <div style={{ opacity: 0.35, marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <WaymarkLogo size={40} northColor="var(--wm-ink-muted)" southColor="var(--wm-ink-muted)" ringColor="var(--wm-ink-muted)" />
          </div>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
            No resources match your search.
          </p>
          <button
            onClick={() => {
              setQuery('');
              setActiveCategory('all');
            }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-accent-deep)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <h2 className="wm-visually-hidden">Resource results</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {filtered.map((resource, index) => (
              <ScrollReveal key={resource.id} delayMs={(index % 6) * 60}>
                <ResourceCard resource={resource} />
              </ScrollReveal>
            ))}
          </div>
        </>
      )}
    </PageContainer>
  );
}

function filterButtonStyle(active: boolean): CSSProperties {
  return {
    fontFamily: 'var(--font-body)',
    fontSize: '0.8125rem',
    fontWeight: active ? 700 : 400,
    padding: '0.4rem 0.85rem',
    borderRadius: '999px',
    border: `1.5px solid ${active ? 'var(--color-accent-deep)' : 'var(--color-border)'}`,
    backgroundColor: active ? 'rgba(150, 93, 45, 0.1)' : 'transparent',
    color: active ? 'var(--color-accent-deep)' : 'var(--color-text-secondary)',
    cursor: 'pointer',
  };
}
