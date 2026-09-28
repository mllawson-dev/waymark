import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DevotionalProgress } from '../types/devotional';
import { getLocalDateISO, getProgress, isDevotionalComplete, markDevotionalComplete } from './devotionalProgress';

const STORAGE_KEY = 'waymark:devotional-progress';

const empty: DevotionalProgress = { completedDates: [], currentStreak: 0, longestStreak: 0, lastCompletedDate: null };

function seed(progress: Partial<DevotionalProgress>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...empty, ...progress }));
}

function stored(): DevotionalProgress {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as DevotionalProgress;
}

describe('devotionalProgress', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 7, 20, 9, 30));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('getLocalDateISO', () => {
    it('formats the local calendar date with zero padding', () => {
      expect(getLocalDateISO(new Date(2026, 0, 5))).toBe('2026-01-05');
      expect(getLocalDateISO()).toBe('2026-08-20');
    });
  });

  describe('getProgress', () => {
    it('returns empty progress when nothing is stored', () => {
      expect(getProgress()).toEqual(empty);
    });

    it('returns empty progress when the stored value is not valid JSON', () => {
      localStorage.setItem(STORAGE_KEY, '{not json');

      expect(getProgress()).toEqual(empty);
    });

    it('returns empty progress when localStorage reads throw', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('access denied');
      });

      expect(getProgress()).toEqual(empty);
    });

    it('sanitises malformed stored fields', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ completedDates: ['2026-08-20', 42, null], currentStreak: 'x', longestStreak: 3, lastCompletedDate: 7 })
      );

      expect(getProgress()).toEqual({ completedDates: ['2026-08-20'], currentStreak: 0, longestStreak: 3, lastCompletedDate: null });
    });

    it('returns the stored progress while the streak is still alive', () => {
      seed({ completedDates: ['2026-08-19'], currentStreak: 3, longestStreak: 5, lastCompletedDate: '2026-08-19' });

      expect(getProgress()).toEqual({ completedDates: ['2026-08-19'], currentStreak: 3, longestStreak: 5, lastCompletedDate: '2026-08-19' });
    });

    it('reports a current streak of zero once the streak has lapsed', () => {
      seed({ completedDates: ['2026-08-15'], currentStreak: 7, longestStreak: 7, lastCompletedDate: '2026-08-15' });

      expect(getProgress()).toEqual({ completedDates: ['2026-08-15'], currentStreak: 0, longestStreak: 7, lastCompletedDate: '2026-08-15' });
      expect(stored().currentStreak).toBe(7);
    });
  });

  describe('markDevotionalComplete', () => {
    it('starts a streak of one on the first completion and persists it', () => {
      const result = markDevotionalComplete();

      expect(result).toEqual({ completedDates: ['2026-08-20'], currentStreak: 1, longestStreak: 1, lastCompletedDate: '2026-08-20' });
      expect(stored()).toEqual(result);
    });

    it('extends the streak when the previous completion was yesterday', () => {
      seed({ completedDates: ['2026-08-19'], currentStreak: 2, longestStreak: 2, lastCompletedDate: '2026-08-19' });

      const result = markDevotionalComplete('2026-08-20');

      expect(result.currentStreak).toBe(3);
      expect(result.longestStreak).toBe(3);
      expect(result.completedDates).toEqual(['2026-08-19', '2026-08-20']);
    });

    it('extends the streak across a daylight-saving boundary', () => {
      seed({ completedDates: ['2026-03-07'], currentStreak: 1, longestStreak: 1, lastCompletedDate: '2026-03-07' });

      expect(markDevotionalComplete('2026-03-08').currentStreak).toBe(2);
    });

    it('resets the streak to one after a gap of more than a day', () => {
      seed({ completedDates: ['2026-08-15'], currentStreak: 7, longestStreak: 7, lastCompletedDate: '2026-08-15' });

      const result = markDevotionalComplete('2026-08-20');

      expect(result.currentStreak).toBe(1);
      expect(result.longestStreak).toBe(7);
    });

    it('keeps the longest streak when the current streak is shorter', () => {
      seed({ completedDates: ['2026-08-19'], currentStreak: 1, longestStreak: 10, lastCompletedDate: '2026-08-19' });

      expect(markDevotionalComplete('2026-08-20').longestStreak).toBe(10);
    });

    it('is a no-op for a date that is already completed', () => {
      seed({ completedDates: ['2026-08-19'], currentStreak: 2, longestStreak: 2, lastCompletedDate: '2026-08-19' });
      const before = stored();

      const result = markDevotionalComplete('2026-08-19');

      expect(result).toEqual(before);
      expect(stored()).toEqual(before);
    });

    it('still returns updated progress when persisting fails', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota exceeded');
      });

      const result = markDevotionalComplete('2026-08-20');

      expect(result.completedDates).toEqual(['2026-08-20']);
      expect(result.currentStreak).toBe(1);
    });
  });

  describe('isDevotionalComplete', () => {
    it('reflects whether the given date has been completed', () => {
      expect(isDevotionalComplete()).toBe(false);

      markDevotionalComplete();

      expect(isDevotionalComplete()).toBe(true);
      expect(isDevotionalComplete('2026-08-19')).toBe(false);
    });
  });
});
