import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { devotionals } from '../data/devotionals';
import { DevotionalPage } from './DevotionalPage';

const STORAGE_KEY = 'waymark:devotional-progress';

describe('DevotionalPage', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date('2026-08-20T09:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders today's devotional and its archive", () => {
    render(<DevotionalPage />);

    const today = devotionals[0]!;
    expect(screen.getByRole('heading', { name: "Today's devotional" })).toBeTruthy();
    expect(screen.getByRole('heading', { name: today.title })).toBeTruthy();
    expect(screen.getByText(today.reflection)).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Past devotionals' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: devotionals[1]!.title })).toBeTruthy();
  });

  it('hides the verse text until the verse card is revealed', () => {
    render(<DevotionalPage />);
    const today = devotionals[0]!;

    expect(screen.queryByText(new RegExp(today.verseText))).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Reveal today's verse/ }));

    expect(screen.getByText(new RegExp(today.verseText))).toBeTruthy();
  });

  it('shows no streak badge before anything is completed', () => {
    render(<DevotionalPage />);

    expect(screen.queryByText('day streak')).toBeNull();
  });

  it('marks the devotional as read, announces the streak, and persists progress', () => {
    render(<DevotionalPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Mark as read' }));

    expect(screen.getByRole('button', { name: /Marked as read today/ }).getAttribute('aria-disabled')).toBe('true');
    expect(screen.getByRole('status').textContent).toBe('Marked as read. Streak: 1 day.');
    expect(screen.getByText('day streak')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toMatchObject({
      completedDevotionalIds: [devotionals[0]!.id],
      currentStreak: 1,
      lastCompletedDate: '2026-08-20',
    });
  });

  it('pluralises the announced streak', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        completedDevotionalIds: ['dev-999'],
        currentStreak: 2,
        longestStreak: 2,
        lastCompletedDate: '2026-08-19',
      })
    );

    render(<DevotionalPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Mark as read' }));

    expect(screen.getByRole('status').textContent).toBe('Marked as read. Streak: 3 days.');
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('starts in the completed state when today was already read', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        completedDevotionalIds: [devotionals[0]!.id],
        currentStreak: 4,
        longestStreak: 4,
        lastCompletedDate: '2026-08-20',
      })
    );

    render(<DevotionalPage />);

    expect(screen.getByRole('button', { name: /Marked as read today/ })).toBeTruthy();
    expect(screen.getByText('4')).toBeTruthy();
  });

  it('ignores repeat clicks on an already completed devotional', () => {
    render(<DevotionalPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Mark as read' }));
    fireEvent.click(screen.getByRole('button', { name: /Marked as read today/ }));

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}').completedDevotionalIds).toEqual([
      devotionals[0]!.id,
    ]);
  });
});
