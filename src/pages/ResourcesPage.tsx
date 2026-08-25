import { useMemo, useState } from 'react';
import { resources } from '../data/resources';
import { CardGrid } from '../components/CardGrid';
import { EmptyState } from '../components/EmptyState';
import { PageContainer } from '../components/PageContainer';
import { PageTitle } from '../components/PageTitle';
import { ResourceCard } from '../components/ResourceCard';
import { categoryLabels } from '../data/categoryLabels';
import { ScrollReveal } from '../components/ScrollReveal';
import { chipStyle } from '../styles/chip';
import { pluralize } from '../utils/format';
import type { ResourceCategory } from '../types/resource';

const categories: ResourceCategory[] = ['prayer', 'grief', 'parenting', 'relationships', 'growth', 'community'];

export function ResourcesPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ResourceCategory | 'all'>('all');

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matchesQuery = (haystack: string) => haystack.toLowerCase().includes(needle);

    return resources.filter((r) => {
      const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
      return (
        matchesCategory &&
        (needle === '' ||
          matchesQuery(r.title) ||
          matchesQuery(r.summary) ||
          r.tags.some(matchesQuery))
      );
    });
  }, [query, activeCategory]);

  return (
    <PageContainer width="wide">
      <PageTitle style={{ marginBottom: '1.5rem' }}>Resources</PageTitle>

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
          style={filterChipStyle(activeCategory === 'all')}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            aria-pressed={activeCategory === cat}
            style={filterChipStyle(activeCategory === cat)}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="wm-visually-hidden">
        {pluralize(filtered.length, 'resource')} found
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          message="No resources match your search."
          padding="3rem 1rem"
          style={{ animation: 'wm-page-fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
          action={
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
          }
        />
      ) : (
        <>
          <h2 className="wm-visually-hidden">Resource results</h2>
          <CardGrid>
            {filtered.map((resource, index) => (
              <ScrollReveal key={resource.id} delayMs={(index % 6) * 60}>
                <ResourceCard resource={resource} />
              </ScrollReveal>
            ))}
          </CardGrid>
        </>
      )}
    </PageContainer>
  );
}

function filterChipStyle(active: boolean) {
  return chipStyle({
    active,
    color: active ? 'var(--color-accent-deep)' : 'var(--color-text-secondary)',
  });
}
