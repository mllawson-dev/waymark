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
    const lastCompletedDate = typeof parsed.lastCompletedDate === 'string' ? parsed.lastCompletedDate : null;
    // A stored streak only still counts if the last completion was today or
    // yesterday; anything older means the streak is already broken.
    const streakIsLive = lastCompletedDate !== null && daysBetween(lastCompletedDate, getLocalDateISO()) <= 1;
    return {
      completedDates: Array.isArray(parsed.completedDates)
        ? parsed.completedDates.filter((d): d is string => typeof d === 'string')
        : [],
      currentStreak: streakIsLive && Number.isFinite(parsed.currentStreak) ? parsed.currentStreak ?? 0 : 0,
      longestStreak: Number.isFinite(parsed.longestStreak) ? parsed.longestStreak ?? 0 : 0,
      lastCompletedDate,
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

  const completedDates = [...progress.completedDates, date].sort();
  const lastCompletedDate = completedDates[completedDates.length - 1]!;

  // Count the run of consecutive days ending at the most recent completion.
  // This keeps a streak intact when an earlier date is filled in out of order
  // instead of resetting it or moving lastCompletedDate backwards.
  let currentStreak = 1;
  for (let i = completedDates.length - 2; i >= 0; i--) {
    if (daysBetween(completedDates[i]!, completedDates[i + 1]!) !== 1) break;
    currentStreak += 1;
  }

  const updated: DevotionalProgress = {
    completedDates,
    currentStreak,
    longestStreak: Math.max(currentStreak, progress.longestStreak),
    lastCompletedDate,
  };

  saveProgress(updated);
  return updated;
}

export function getProgress(): DevotionalProgress {
  return loadProgress();
}

export function isDevotionalComplete(date = getLocalDateISO()): boolean {
  return loadProgress().completedDates.includes(date);
}
