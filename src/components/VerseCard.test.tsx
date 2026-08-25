import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LiveAnnouncer } from './LiveAnnouncer';
import { ScrollReveal } from './ScrollReveal';
import { StreakBadge } from './StreakBadge';
import { VerseCard } from './VerseCard';

describe('VerseCard', () => {
  it('hides the verse text behind a trigger', () => {
    render(<VerseCard reference="Psalm 119:105" text="Your word is a lamp to my feet." />);

    expect(screen.getByRole('button', { name: /Reveal today's verse/ }).getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText(/Your word is a lamp/)).toBeNull();
  });

  it('reveals the verse and moves focus to it', async () => {
    render(<VerseCard reference="Psalm 119:105" text="Your word is a lamp to my feet." />);

    fireEvent.click(screen.getByRole('button', { name: /Reveal today's verse/ }));

    expect(screen.getByText(/Your word is a lamp to my feet\./)).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
    await waitFor(() =>
      expect((document.activeElement as HTMLElement).className).toBe('wm-verse-card__content')
    );
  });
});

describe('StreakBadge', () => {
  it('renders nothing without a streak', () => {
    const { container } = render(<StreakBadge streak={0} />);

    expect(container.firstChild).toBeNull();
  });

  it('renders nothing for a negative streak', () => {
    const { container } = render(<StreakBadge streak={-1} />);

    expect(container.firstChild).toBeNull();
  });

  it('shows the streak count', () => {
    render(<StreakBadge streak={5} />);

    expect(screen.getByText('5')).toBeTruthy();
    expect(screen.getByText('day streak')).toBeTruthy();
  });
});

describe('LiveAnnouncer', () => {
  it('announces its message politely', () => {
    render(<LiveAnnouncer message="Added to cart" />);

    const status = screen.getByRole('status');
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.textContent).toBe('Added to cart');
  });
});

describe('ScrollReveal', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('starts hidden until observed', () => {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe() {}
        disconnect() {}
        unobserve() {}
      }
    );

    render(<ScrollReveal delayMs={200}>Section</ScrollReveal>);

    const wrapper = screen.getByText('Section');
    expect(wrapper.className).not.toContain('wm-scroll-reveal--visible');
    expect(wrapper.style.transitionDelay).toBe('0ms');
  });

  it('reveals immediately with the given delay when reduced motion is preferred', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) => ({ matches: true, media: query }) as unknown as MediaQueryList
    );

    render(<ScrollReveal delayMs={200}>Section</ScrollReveal>);

    const wrapper = screen.getByText('Section');
    expect(wrapper.className).toContain('wm-scroll-reveal--visible');
    expect(wrapper.style.transitionDelay).toBe('200ms');
  });
});
