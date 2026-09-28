import type { DevotionalProgress } from '../types/devotional';

const STORAGE_KEY = 'waymark:devotional-progress';

export function getLocalDateISO(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}

function loadProgress(): DevotionalProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { completedDates: [], currentStreak: 0, longestStreak: 0, lastCompletedDate: null };
    }
    const parsed = JSON.parse(raw) as Partial<DevotionalProgress>;
    return {
      completedDates: Array.isArray(parsed.completedDates)
        ? parsed.completedDates.filter((value): value is string => typeof value === 'string')
        : [],
      currentStreak: Number.isFinite(parsed.currentStreak) ? parsed.currentStreak ?? 0 : 0,
      longestStreak: Number.isFinite(parsed.longestStreak) ? parsed.longestStreak ?? 0 : 0,
      lastCompletedDate: typeof parsed.lastCompletedDate === 'string' ? parsed.lastCompletedDate : null,
    };
  } catch {
    return { completedDates: [], currentStreak: 0, longestStreak: 0, lastCompletedDate: null };
  }
}

function saveProgress(progress: DevotionalProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage unavailable (private browsing, quota) — fail silently
  }
}

export function markDevotionalComplete(date = getLocalDateISO()): DevotionalProgress {
  const progress = loadProgress();

  if (progress.completedDates.includes(date)) {
    return progress;
  }

  let newStreak = 1;
  if (progress.lastCompletedDate) {
    const gap = daysBetween(progress.lastCompletedDate, date);
    if (gap === 1) {
      newStreak = progress.currentStreak + 1;
    } else if (gap === 0) {
      newStreak = Math.max(progress.currentStreak, 1);
    }
  }

  const updated: DevotionalProgress = {
    completedDates: [...progress.completedDates, date],
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, progress.longestStreak),
    lastCompletedDate: date,
  };

  saveProgress(updated);
  return updated;
}

/**
 * Returns stored progress with `currentStreak` reset to 0 when the last
 * completion is more than a day before `today` (the streak has lapsed).
 */
export function getProgress(today = getLocalDateISO()): DevotionalProgress {
  const progress = loadProgress();
  if (progress.lastCompletedDate && daysBetween(progress.lastCompletedDate, today) > 1) {
    return { ...progress, currentStreak: 0 };
  }
  return progress;
}

export function isDevotionalComplete(date = getLocalDateISO()): boolean {
  return loadProgress().completedDates.includes(date);
}
