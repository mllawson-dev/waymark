import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { devotionals, getDailyDevotional } from '../data/devotionals';
import { DevotionalPage } from './DevotionalPage';

const STORAGE_KEY = 'waymark:devotional-progress';

function seed(progress: Record<string, unknown>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

describe('DevotionalPage', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date(2026, 7, 20, 9, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders today's devotional and the remaining readings", () => {
    render(<DevotionalPage />);

    const today = getDailyDevotional(new Date());
    expect(screen.getByRole('heading', { name: 'Today’s devotional', level: 1 })).toBeTruthy();
    expect(screen.getByRole('heading', { name: today.title, level: 2 })).toBeTruthy();
    expect(screen.getByText(today.reflection)).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'More readings for the road' })).toBeTruthy();
    for (const entry of devotionals.filter((d) => d.id !== today.id)) {
      expect(screen.getByRole('heading', { name: entry.title, level: 3 })).toBeTruthy();
    }
    expect(screen.queryByRole('heading', { name: today.title, level: 3 })).toBeNull();
  });

  it('hides the verse text until the verse card is revealed', () => {
    render(<DevotionalPage />);
    const today = getDailyDevotional(new Date());

    expect(screen.queryByText(`“${today.verseText}”`)).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Reveal today's verse/ }));

    expect(screen.getByText(`“${today.verseText}”`)).toBeTruthy();
  });

  it('shows no streak badge before anything is completed', () => {
    render(<DevotionalPage />);

    expect(screen.queryByText('day streak')).toBeNull();
    expect(screen.queryByText(/Longest streak/)).toBeNull();
  });

  it('marks today as read, announces the streak, and persists progress', () => {
    render(<DevotionalPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Mark today as read' }));

    const button = screen.getByRole('button', { name: /Marked as read today/ }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(screen.getByRole('status').textContent).toBe('Today marked complete. Current streak: 1 day.');
    expect(screen.getByText('day streak')).toBeTruthy();
    expect(screen.getByText('Longest streak: 1 day')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toMatchObject({
      completedDates: ['2026-08-20'],
      currentStreak: 1,
      lastCompletedDate: '2026-08-20',
    });
  });

  it('pluralises the announced streak', () => {
    seed({ completedDates: ['2026-08-19'], currentStreak: 2, longestStreak: 2, lastCompletedDate: '2026-08-19' });

    render(<DevotionalPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Mark today as read' }));

    expect(screen.getByRole('status').textContent).toBe('Today marked complete. Current streak: 3 days.');
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText('Longest streak: 3 days')).toBeTruthy();
  });

  it('starts in the completed state when today was already read', () => {
    seed({ completedDates: ['2026-08-20'], currentStreak: 4, longestStreak: 4, lastCompletedDate: '2026-08-20' });

    render(<DevotionalPage />);

    expect(screen.getByRole('button', { name: /Marked as read today/ })).toBeTruthy();
    expect(screen.getByText('4')).toBeTruthy();
  });

  it('hides a lapsed streak but keeps the longest streak', () => {
    seed({ completedDates: ['2026-08-10'], currentStreak: 6, longestStreak: 6, lastCompletedDate: '2026-08-10' });

    render(<DevotionalPage />);

    expect(screen.queryByText('day streak')).toBeNull();
    expect(screen.getByText('Longest streak: 6 days')).toBeTruthy();
  });

  it('ignores repeat clicks once today is complete', () => {
    render(<DevotionalPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Mark today as read' }));
    fireEvent.click(screen.getByRole('button', { name: /Marked as read today/ }));

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}').completedDates).toEqual(['2026-08-20']);
  });
});
