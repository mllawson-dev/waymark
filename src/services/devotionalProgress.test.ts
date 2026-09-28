import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DevotionalProgress } from '../types/devotional';
import { getLocalDateISO, getProgress, isDevotionalComplete, markDevotionalComplete } from './devotionalProgress';

const STORAGE_KEY = 'waymark:devotional-progress';

const EMPTY: DevotionalProgress = {
  completedDates: [],
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
};

function isoDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return getLocalDateISO(date);
}

function seed(progress: Partial<DevotionalProgress>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...EMPTY, ...progress }));
}

function stored(): DevotionalProgress {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as DevotionalProgress;
}

describe('devotionalProgress', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-20T15:30:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('getProgress', () => {
    it('returns empty progress when nothing is stored', () => {
      expect(getProgress()).toEqual(EMPTY);
    });

    it('returns empty progress when the stored value is not valid JSON', () => {
      localStorage.setItem(STORAGE_KEY, '{not json');

      expect(getProgress()).toEqual(EMPTY);
    });

    it('returns empty progress when localStorage reads throw', () => {
      vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('access denied');
      });

      expect(getProgress()).toEqual(EMPTY);
    });

    it('returns the stored progress while the streak is still live', () => {
      seed({
        completedDates: [isoDaysAgo(2), isoDaysAgo(1)],
        currentStreak: 3,
        longestStreak: 5,
        lastCompletedDate: isoDaysAgo(1),
      });

      expect(getProgress()).toEqual({
        completedDates: [isoDaysAgo(2), isoDaysAgo(1)],
        currentStreak: 3,
        longestStreak: 5,
        lastCompletedDate: isoDaysAgo(1),
      });
    });

    it('reports a stale streak as zero without touching the longest streak', () => {
      seed({
        completedDates: [isoDaysAgo(5)],
        currentStreak: 7,
        longestStreak: 7,
        lastCompletedDate: isoDaysAgo(5),
      });

      expect(getProgress().currentStreak).toBe(0);
      expect(getProgress().longestStreak).toBe(7);
      expect(getProgress().lastCompletedDate).toBe(isoDaysAgo(5));
    });
  });

  describe('markDevotionalComplete', () => {
    it('starts a streak of one on the first completion and persists it', () => {
      const today = isoDaysAgo(0);
      const result = markDevotionalComplete(today);

      expect(result).toEqual({
        completedDates: [today],
        currentStreak: 1,
        longestStreak: 1,
        lastCompletedDate: today,
      });
      expect(stored()).toEqual(result);
    });

    it('extends the streak across consecutive days', () => {
      seed({
        completedDates: [isoDaysAgo(2), isoDaysAgo(1)],
        currentStreak: 2,
        longestStreak: 2,
        lastCompletedDate: isoDaysAgo(1),
      });

      const result = markDevotionalComplete(isoDaysAgo(0));

      expect(result.currentStreak).toBe(3);
      expect(result.longestStreak).toBe(3);
      expect(result.completedDates).toHaveLength(3);
    });

    it('is a no-op for an already completed date', () => {
      seed({
        completedDates: [isoDaysAgo(1), isoDaysAgo(0)],
        currentStreak: 2,
        longestStreak: 2,
        lastCompletedDate: isoDaysAgo(0),
      });
      const before = stored();

      const result = markDevotionalComplete(isoDaysAgo(0));

      expect(result).toEqual(before);
      expect(stored()).toEqual(before);
    });

    it('resets the streak to one after a gap of more than a day', () => {
      seed({
        completedDates: [isoDaysAgo(5)],
        currentStreak: 7,
        longestStreak: 7,
        lastCompletedDate: isoDaysAgo(5),
      });

      const result = markDevotionalComplete(isoDaysAgo(0));

      expect(result.currentStreak).toBe(1);
      expect(result.longestStreak).toBe(7);
    });

    it('keeps the longest streak when the current streak is shorter', () => {
      seed({
        completedDates: [isoDaysAgo(1)],
        currentStreak: 1,
        longestStreak: 10,
        lastCompletedDate: isoDaysAgo(1),
      });

      expect(markDevotionalComplete(isoDaysAgo(0)).longestStreak).toBe(10);
    });

    it('extends the streak instead of resetting it when an earlier date is filled in', () => {
      seed({
        completedDates: [isoDaysAgo(0)],
        currentStreak: 1,
        longestStreak: 1,
        lastCompletedDate: isoDaysAgo(0),
      });

      const result = markDevotionalComplete(isoDaysAgo(1));

      expect(result.currentStreak).toBe(2);
      expect(result.lastCompletedDate).toBe(isoDaysAgo(0));
    });

    it('does not move lastCompletedDate backwards for an unconnected earlier date', () => {
      seed({
        completedDates: [isoDaysAgo(0)],
        currentStreak: 1,
        longestStreak: 1,
        lastCompletedDate: isoDaysAgo(0),
      });

      const result = markDevotionalComplete(isoDaysAgo(5));

      expect(result.currentStreak).toBe(1);
      expect(result.lastCompletedDate).toBe(isoDaysAgo(0));
      expect(result.completedDates).toEqual([isoDaysAgo(5), isoDaysAgo(0)]);
    });

    it('still returns updated progress when persisting fails', () => {
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('quota exceeded');
      });
      const today = isoDaysAgo(0);

      const result = markDevotionalComplete(today);

      expect(result.completedDates).toEqual([today]);
      expect(result.currentStreak).toBe(1);
    });
  });

  describe('isDevotionalComplete', () => {
    it('reflects whether the date has been completed', () => {
      expect(isDevotionalComplete(isoDaysAgo(0))).toBe(false);

      markDevotionalComplete(isoDaysAgo(0));

      expect(isDevotionalComplete(isoDaysAgo(0))).toBe(true);
      expect(isDevotionalComplete(isoDaysAgo(1))).toBe(false);
    });
  });
});
