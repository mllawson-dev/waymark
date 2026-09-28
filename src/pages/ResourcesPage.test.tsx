import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { resources } from '../data/resources';
import { ResourceDetailPage } from './ResourceDetailPage';
import { ResourcesPage } from './ResourcesPage';
import { StorePage } from './StorePage';

function search(value: string) {
  fireEvent.change(screen.getByLabelText('Search the library'), { target: { value } });
}

function resultCount(): number {
  return screen.getAllByRole('link', { name: /Read resource/ }).length;
}

describe('ResourcesPage', () => {
  it('lists every resource by default', () => {
    render(<MemoryRouter><ResourcesPage /></MemoryRouter>);

    expect(resultCount()).toBe(resources.length);
    expect(screen.getByText(`Showing ${resources.length} resources`)).toBeTruthy();
  });

  it('filters by category and reflects the active filter', () => {
    render(<MemoryRouter><ResourcesPage /></MemoryRouter>);

    fireEvent.click(screen.getByRole('button', { name: 'Grief' }));

    expect(screen.getByRole('button', { name: 'Grief' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'All' }).getAttribute('aria-pressed')).toBe('false');
    expect(resultCount()).toBe(resources.filter((r) => r.category === 'grief').length);
    expect(screen.getByText('Showing 1 resource')).toBeTruthy();
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

    expect(screen.getByText('No resources match those filters.')).toBeTruthy();
  });

  it('clears both filters from the empty state', () => {
    render(<MemoryRouter><ResourcesPage /></MemoryRouter>);

    fireEvent.click(screen.getByRole('button', { name: 'Grief' }));
    search('nothing matches this');
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));

    expect(resultCount()).toBe(resources.length);
    expect(screen.getByLabelText('Search the library')).toHaveProperty('value', '');
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

    expect(screen.getByRole('heading', { name: 'This guide isn’t in the library.' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Back to resources/ }).getAttribute('href')).toBe('/resources');
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
    expect(screen.getByRole('link', { name: /Return to the library/ }).getAttribute('href')).toBe('/resources');
  });
});

describe('StorePage', () => {
  it('links to every product in the catalog', () => {
    render(<MemoryRouter><StorePage /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Small reminders for the road.', level: 1 })).toBeTruthy();
    const hrefs = new Set(screen.getAllByRole('link').map((l) => l.getAttribute('href')));
    expect(hrefs).toEqual(new Set(['/store/prod-001', '/store/prod-002', '/store/prod-003', '/store/prod-004']));
  });
});
