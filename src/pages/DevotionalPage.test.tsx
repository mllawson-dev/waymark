import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { devotionals, getDailyDevotional } from '../data/devotionals';
import { getLocalDateISO } from '../services/devotionalProgress';
import { DevotionalPage } from './DevotionalPage';

const STORAGE_KEY = 'waymark:devotional-progress';

function isoDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return getLocalDateISO(date);
}

describe('DevotionalPage', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date('2026-08-20T15:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders today's devotional and its archive", () => {
    render(<DevotionalPage />);

    const today = getDailyDevotional(new Date());
    expect(screen.getByRole('heading', { name: 'Today’s devotional' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: today.title, level: 2 })).toBeTruthy();
    expect(screen.getByText(today.reflection)).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'More readings for the road' })).toBeTruthy();
    for (const entry of devotionals.filter((d) => d.id !== today.id)) {
      expect(screen.getByRole('heading', { name: entry.title })).toBeTruthy();
    }
  });

  it('hides the verse text until the verse card is revealed', () => {
    render(<DevotionalPage />);
    const today = getDailyDevotional(new Date());

    expect(screen.queryByText(new RegExp(today.verseText))).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Reveal today's verse/ }));

    expect(screen.getByText(new RegExp(today.verseText))).toBeTruthy();
  });

  it('shows no streak badge before anything is completed', () => {
    render(<DevotionalPage />);

    expect(screen.queryByText('day streak')).toBeNull();
  });

  it('marks the day as read, announces the streak, and persists progress', () => {
    render(<DevotionalPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Mark today as read' }));
    const today = isoDaysAgo(0);

    expect((screen.getByRole('button', { name: /Marked as read today/ }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByRole('status').textContent).toBe('Today marked complete. Current streak: 1 day.');
    expect(screen.getByText('day streak')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toMatchObject({
      completedDates: [today],
      currentStreak: 1,
      lastCompletedDate: today,
    });
  });

  it('pluralises the announced streak', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        completedDates: [isoDaysAgo(2), isoDaysAgo(1)],
        currentStreak: 2,
        longestStreak: 2,
        lastCompletedDate: isoDaysAgo(1),
      })
    );

    render(<DevotionalPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Mark today as read' }));

    expect(screen.getByRole('status').textContent).toBe('Today marked complete. Current streak: 3 days.');
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('starts in the completed state when today was already read', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        completedDates: [isoDaysAgo(0)],
        currentStreak: 4,
        longestStreak: 4,
        lastCompletedDate: isoDaysAgo(0),
      })
    );

    render(<DevotionalPage />);

    expect((screen.getByRole('button', { name: /Marked as read today/ }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText('4')).toBeTruthy();
  });

  it('ignores repeat clicks on an already completed day', () => {
    render(<DevotionalPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Mark today as read' }));
    fireEvent.click(screen.getByRole('button', { name: /Marked as read today/ }));

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}').completedDates).toHaveLength(1);
  });
});
