import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { resources } from '../data/resources';
import { ResourceDetailPage } from './ResourceDetailPage';
import { ResourcesPage } from './ResourcesPage';
import { StorePage } from './StorePage';

function search(value: string) {
  fireEvent.change(screen.getByLabelText('Search resources'), { target: { value } });
}

function resultCount(): number {
  return screen.getAllByRole('link').length;
}

describe('ResourcesPage', () => {
  it('lists every resource by default', () => {
    render(<MemoryRouter><ResourcesPage /></MemoryRouter>);

    expect(resultCount()).toBe(resources.length);
    expect(screen.getByText(`${resources.length} resources found`)).toBeTruthy();
  });

  it('filters by category and reflects the active filter', () => {
    render(<MemoryRouter><ResourcesPage /></MemoryRouter>);

    fireEvent.click(screen.getByRole('button', { name: 'Grief' }));

    expect(screen.getByRole('button', { name: 'Grief' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'All' }).getAttribute('aria-pressed')).toBe('false');
    expect(resultCount()).toBe(resources.filter((r) => r.category === 'grief').length);
    expect(screen.getByText('1 resource found')).toBeTruthy();
  });

  it('searches titles, summaries, and tags case-insensitively', () => {
    render(<MemoryRouter><ResourcesPage /></MemoryRouter>);

    search('FIVE-MINUTE');
    expect(screen.getByText('A five-minute prayer practice')).toBeTruthy();
    expect(resultCount()).toBe(1);

    search('busiest mornings');
    expect(resultCount()).toBe(1);

    search('study guide');
    expect(screen.getByText('Staying rooted in a season of change')).toBeTruthy();
    expect(resultCount()).toBe(1);
  });

  it('ignores a whitespace-only query', () => {
    render(<MemoryRouter><ResourcesPage /></MemoryRouter>);

    search('   ');

    expect(resultCount()).toBe(resources.length);
  });

  it('combines the search query with the category filter', () => {
    render(<MemoryRouter><ResourcesPage /></MemoryRouter>);

    fireEvent.click(screen.getByRole('button', { name: 'Prayer' }));
    search('grief');

    expect(screen.getByText('No resources match your search.')).toBeTruthy();
  });

  it('clears both filters from the empty state', () => {
    render(<MemoryRouter><ResourcesPage /></MemoryRouter>);

    fireEvent.click(screen.getByRole('button', { name: 'Grief' }));
    search('nothing matches this');
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));

    expect(resultCount()).toBe(resources.length);
    expect(screen.getByLabelText('Search resources')).toHaveProperty('value', '');
    expect(screen.getByRole('button', { name: 'All' }).getAttribute('aria-pressed')).toBe('true');
  });
});

describe('ResourceDetailPage', () => {
  function renderResource(resourceId: string) {
    return render(
      <MemoryRouter initialEntries={[`/resources/${resourceId}`]}>
        <Routes>
          <Route path="/resources/:resourceId" element={<ResourceDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
  }

  it('shows a not-found message for an unknown resource', () => {
    renderResource('res-nope');

    expect(screen.getByText(/We couldn't find that resource/)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Back to resources' }).getAttribute('href')).toBe('/resources');
  });

  it('renders the body, category label, and tags', () => {
    const resource = resources[0]!;

    renderResource(resource.id);

    expect(screen.getByRole('heading', { name: resource.title })).toBeTruthy();
    expect(screen.getByText(resource.body)).toBeTruthy();
    expect(screen.getByText('Grief')).toBeTruthy();
    for (const tag of resource.tags) {
      expect(screen.getByText(tag)).toBeTruthy();
    }
  });

  it('only offers a download when the resource has one', () => {
    renderResource('res-001');
    expect(screen.queryByRole('button', { name: 'Download study guide' })).toBeNull();
  });

  it('opens the study guide in a new tab', () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);

    renderResource('res-004');
    fireEvent.click(screen.getByRole('button', { name: 'Download study guide' }));

    expect(open).toHaveBeenCalledWith('#', '_blank', 'noopener,noreferrer');
    open.mockRestore();
  });
});

describe('StorePage', () => {
  it('links to every product in the catalog', () => {
    render(<MemoryRouter><StorePage /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Store' })).toBeTruthy();
    expect(screen.getAllByRole('link').map((l) => l.getAttribute('href'))).toEqual([
      '/store/prod-001',
      '/store/prod-002',
      '/store/prod-003',
      '/store/prod-004',
    ]);
  });
});
