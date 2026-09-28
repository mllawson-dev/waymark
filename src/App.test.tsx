import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

function renderApp(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

describe('App', () => {
  it('renders the route matching the current path', () => {
    renderApp('/about');

    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Skip to main content' }).getAttribute('href')).toBe('#main-content');
    expect(screen.getByRole('main').id).toBe('main-content');
  });

  it('marks the active nav link and moves focus to main content on navigation', () => {
    renderApp('/');

    fireEvent.click(screen.getByRole('link', { name: 'Resources' }));

    expect(screen.getByRole('heading', { name: 'Honest help for the season you’re in.', level: 1 })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Resources' }).getAttribute('aria-current')).toBe('page');
    expect(document.activeElement).toBe(screen.getByRole('main'));
  });

  it('shows the item count on the cart button after adding an item', () => {
    renderApp('/store/prod-004');

    fireEvent.click(screen.getByRole('button', { name: 'Add to demo cart' }));

    expect(screen.getByRole('button', { name: 'Cart, 1 item' })).toBeTruthy();
  });

  it('opens the cart drawer and closes it again', () => {
    renderApp('/store');

    fireEvent.click(screen.getByRole('button', { name: 'Cart' }));
    expect(screen.getByRole('dialog')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes the cart drawer when the route changes', () => {
    renderApp('/devotional');

    fireEvent.click(screen.getByRole('button', { name: 'Cart' }));
    fireEvent.click(screen.getByRole('link', { name: 'Browse the store' }));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Small reminders for the road.', level: 1 })).toBeTruthy();
  });

  it('closes the cart drawer when a drawer link points at the current route', () => {
    renderApp('/store');

    fireEvent.click(screen.getByRole('button', { name: 'Cart' }));
    fireEvent.click(screen.getByRole('link', { name: 'Browse the store' }));

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders the remaining top-level routes', () => {
    const { unmount } = renderApp('/devotional');
    expect(screen.getByRole('heading', { name: 'Today’s devotional' })).toBeTruthy();
    unmount();

    const home = renderApp('/');
    expect(screen.getByRole('link', { name: /Begin today’s devotional/ })).toBeTruthy();
    home.unmount();

    renderApp('/checkout');
    expect(screen.getByText('Your cart is waiting for a first step.')).toBeTruthy();
  });

  it('gives the style guide its own document title', () => {
    renderApp('/style-guide');

    expect(screen.getByRole('main')).toBeTruthy();
    expect(document.title).toBe('Design system — Waymark');
  });
});
