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

function primaryNav() {
  return screen.getByRole('navigation', { name: 'Primary navigation' });
}

describe('App', () => {
  it('renders the route matching the current path', () => {
    renderApp('/about');

    expect(primaryNav()).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Skip to main content' }).getAttribute('href')).toBe('#main-content');
    expect(screen.getByRole('main').id).toBe('main-content');
    expect(document.title).toBe('Our approach — Waymark');
  });

  it('does not steal focus on initial load', () => {
    renderApp('/');

    expect(document.activeElement).toBe(document.body);
  });

  it('marks the active nav link and moves focus to main content on navigation', () => {
    renderApp('/');

    const resourcesLink = primaryNav().querySelector('a[href="/resources"]')!;
    expect(resourcesLink.className).not.toContain('active');

    fireEvent.click(resourcesLink);

    expect(screen.getByRole('heading', { name: 'Honest help for the season you’re in.', level: 1 })).toBeTruthy();
    expect(primaryNav().querySelector('a[href="/resources"]')!.className).toContain('active');
    expect(document.activeElement).toBe(screen.getByRole('main'));
    expect(document.title).toBe('Resources — Waymark');
  });

  it('shows the item count on the cart button', () => {
    renderApp('/store/prod-004');

    expect(screen.getByRole('button', { name: 'Cart, empty' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Add to demo cart' }));

    expect(screen.getByRole('button', { name: 'Cart, 1 item' })).toBeTruthy();
  });

  it('opens the cart drawer and closes it again', () => {
    renderApp('/store');

    fireEvent.click(screen.getByRole('button', { name: /^Cart/ }));
    expect(screen.getByRole('dialog', { name: 'Your cart' })).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close' }));

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes the cart drawer on Escape', () => {
    renderApp('/store');

    fireEvent.click(screen.getByRole('button', { name: /^Cart/ }));
    fireEvent.keyDown(window, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes the cart drawer when the route changes', () => {
    renderApp('/devotional');

    fireEvent.click(screen.getByRole('button', { name: /^Cart/ }));
    fireEvent.click(screen.getByRole('link', { name: 'Browse the store' }));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Small reminders for the road.', level: 1 })).toBeTruthy();
  });

  it('renders the remaining top-level routes', () => {
    const { unmount } = renderApp('/devotional');
    expect(screen.getByRole('heading', { name: 'Today’s devotional', level: 1 })).toBeTruthy();
    unmount();

    const home = renderApp('/');
    expect(screen.getByRole('link', { name: 'Begin today’s devotional' })).toBeTruthy();
    home.unmount();

    const checkout = renderApp('/checkout');
    expect(screen.getByRole('main')).toBeTruthy();
    checkout.unmount();

    renderApp('/nowhere');
    expect(document.title).toBe('Page not found — Waymark');
  });
});
