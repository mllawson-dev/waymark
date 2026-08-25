import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DevotionalProgress } from '../types/devotional';
import { getProgress, isDevotionalComplete, markDevotionalComplete } from './devotionalProgress';

const STORAGE_KEY = 'waymark:devotional-progress';

function seed(progress: Partial<DevotionalProgress>): void {
  const full: DevotionalProgress = {
    completedDevotionalIds: [],
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: null,
    ...progress,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
}

function stored(): DevotionalProgress {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as DevotionalProgress;
}

describe('devotionalProgress', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-20T09:30:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('getProgress', () => {
    it('returns empty progress when nothing is stored', () => {
      expect(getProgress()).toEqual({
        completedDevotionalIds: [],
        currentStreak: 0,
        longestStreak: 0,
        lastCompletedDate: null,
      });
    });

    it('returns empty progress when the stored value is not valid JSON', () => {
      localStorage.setItem(STORAGE_KEY, '{not json');

      expect(getProgress()).toEqual({
        completedDevotionalIds: [],
        currentStreak: 0,
        longestStreak: 0,
        lastCompletedDate: null,
      });
    });

    it('returns empty progress when localStorage reads throw', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('access denied');
      });

      expect(getProgress()).toEqual({
        completedDevotionalIds: [],
        currentStreak: 0,
        longestStreak: 0,
        lastCompletedDate: null,
      });
    });

    it('returns the stored progress', () => {
      seed({ completedDevotionalIds: ['dev-001'], currentStreak: 3, longestStreak: 5, lastCompletedDate: '2026-08-19' });

      expect(getProgress()).toEqual({
        completedDevotionalIds: ['dev-001'],
        currentStreak: 3,
        longestStreak: 5,
        lastCompletedDate: '2026-08-19',
      });
    });
  });

  describe('markDevotionalComplete', () => {
    it('starts a streak of one on the first completion and persists it', () => {
      const result = markDevotionalComplete('dev-001');

      expect(result).toEqual({
        completedDevotionalIds: ['dev-001'],
        currentStreak: 1,
        longestStreak: 1,
        lastCompletedDate: '2026-08-20',
      });
      expect(stored()).toEqual(result);
    });

    it('extends the streak when the previous completion was yesterday', () => {
      seed({ completedDevotionalIds: ['dev-001'], currentStreak: 2, longestStreak: 2, lastCompletedDate: '2026-08-19' });

      const result = markDevotionalComplete('dev-002');

      expect(result.currentStreak).toBe(3);
      expect(result.longestStreak).toBe(3);
      expect(result.completedDevotionalIds).toEqual(['dev-001', 'dev-002']);
    });

    it('keeps the streak unchanged for a second completion on the same day', () => {
      seed({ completedDevotionalIds: ['dev-001'], currentStreak: 4, longestStreak: 6, lastCompletedDate: '2026-08-20' });

      const result = markDevotionalComplete('dev-002');

      expect(result.currentStreak).toBe(4);
      expect(result.longestStreak).toBe(6);
    });

    it('resets the streak to one after a gap of more than a day', () => {
      seed({ completedDevotionalIds: ['dev-001'], currentStreak: 7, longestStreak: 7, lastCompletedDate: '2026-08-15' });

      const result = markDevotionalComplete('dev-002');

      expect(result.currentStreak).toBe(1);
      expect(result.longestStreak).toBe(7);
    });

    it('keeps the longest streak when the current streak is shorter', () => {
      seed({ completedDevotionalIds: ['dev-001'], currentStreak: 1, longestStreak: 10, lastCompletedDate: '2026-08-19' });

      expect(markDevotionalComplete('dev-002').longestStreak).toBe(10);
    });

    it('is a no-op for an already completed devotional', () => {
      seed({ completedDevotionalIds: ['dev-001'], currentStreak: 2, longestStreak: 2, lastCompletedDate: '2026-08-19' });
      const before = stored();

      const result = markDevotionalComplete('dev-001');

      expect(result).toEqual(before);
      expect(stored()).toEqual(before);
    });

    it('still returns updated progress when persisting fails', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota exceeded');
      });

      const result = markDevotionalComplete('dev-001');

      expect(result.completedDevotionalIds).toEqual(['dev-001']);
      expect(result.currentStreak).toBe(1);
    });
  });

  describe('isDevotionalComplete', () => {
    it('reflects whether the devotional has been completed', () => {
      expect(isDevotionalComplete('dev-001')).toBe(false);

      markDevotionalComplete('dev-001');

      expect(isDevotionalComplete('dev-001')).toBe(true);
      expect(isDevotionalComplete('dev-002')).toBe(false);
    });
  });
});
