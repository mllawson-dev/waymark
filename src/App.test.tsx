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

    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Skip to main content' }).getAttribute('href')).toBe('#main-content');
    expect(screen.getByRole('main').id).toBe('main-content');
  });

  it('marks the active nav link and moves focus to main content on navigation', () => {
    renderApp('/');

    expect(screen.getByRole('link', { name: 'Home' }).style.fontWeight).toBe('700');

    fireEvent.click(screen.getByRole('link', { name: 'Resources' }));

    expect(screen.getByRole('heading', { name: 'Resources', level: 1 })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Resources' }).style.fontWeight).toBe('700');
    expect(document.activeElement).toBe(screen.getByRole('main'));
  });

  it('describes the cart contents on the cart button', () => {
    renderApp('/store/prod-004');

    expect(screen.getByRole('button', { name: 'Open cart, empty' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Add to cart' }));

    expect(screen.getByRole('button', { name: 'Open cart, 1 item' })).toBeTruthy();
  });

  it('opens the cart drawer and closes it again', () => {
    renderApp('/store');

    fireEvent.click(screen.getByRole('button', { name: /Open cart/ }));
    expect(screen.getByRole('dialog')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes the cart drawer when the route changes', () => {
    renderApp('/devotional');

    fireEvent.click(screen.getByRole('button', { name: /Open cart/ }));
    fireEvent.click(screen.getByRole('link', { name: 'Browse the store' }));

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders the remaining top-level routes', () => {
    const { unmount } = renderApp('/devotional');
    expect(screen.getByRole('heading', { name: "Today's devotional" })).toBeTruthy();
    unmount();

    const home = renderApp('/');
    expect(screen.getByRole('link', { name: /Start today's devotional/ })).toBeTruthy();
    home.unmount();

    renderApp('/style-guide');
    expect(screen.getByRole('main')).toBeTruthy();
  });
});
