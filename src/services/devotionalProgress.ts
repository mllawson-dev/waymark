import type { DevotionalProgress } from '../types/devotional';
import { reportError } from '../lib/reportError';

const STORAGE_KEY = 'waymark:devotional-progress';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export interface SaveResult {
  progress: DevotionalProgress;
  /** False when the update could not be written to localStorage and will be lost on reload. */
  persisted: boolean;
}

function emptyProgress(): DevotionalProgress {
  return { completedDevotionalIds: [], currentStreak: 0, longestStreak: 0, lastCompletedDate: null };
}

function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Whole days from `a` to `b`, or null if either side isn't a usable ISO date —
 * so a corrupt stored date can't silently turn into a NaN streak.
 */
function daysBetween(a: string, b: string): number | null {
  const start = new Date(a).getTime();
  const end = new Date(b).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return null;
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((end - start) / msPerDay);
}

function isDevotionalProgress(value: unknown): value is DevotionalProgress {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<DevotionalProgress>;
  return (
    Array.isArray(candidate.completedDevotionalIds) &&
    candidate.completedDevotionalIds.every((id) => typeof id === 'string') &&
    typeof candidate.currentStreak === 'number' &&
    Number.isFinite(candidate.currentStreak) &&
    typeof candidate.longestStreak === 'number' &&
    Number.isFinite(candidate.longestStreak) &&
    (candidate.lastCompletedDate === null ||
      (typeof candidate.lastCompletedDate === 'string' && ISO_DATE.test(candidate.lastCompletedDate)))
  );
}

/**
 * Reads stored progress, falling back to an empty record. Both a failed read
 * and a payload that doesn't match the expected shape are reported rather than
 * quietly returning something the rest of the app would crash on.
 */
function loadProgress(): DevotionalProgress {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    reportError('Could not read devotional progress from localStorage', error);
    return emptyProgress();
  }

  if (!raw) return emptyProgress();

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    reportError('Stored devotional progress is not valid JSON', error);
    return emptyProgress();
  }

  if (!isDevotionalProgress(parsed)) {
    reportError('Stored devotional progress has an unexpected shape', new Error('Validation failed'), {
      parsed,
    });
    return emptyProgress();
  }

  return parsed;
}

function saveProgress(progress: DevotionalProgress): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch (error) {
    // Private browsing or an exhausted quota — recoverable, but the caller
    // needs to know the streak only lives in memory from here on.
    reportError('Could not save devotional progress to localStorage', error);
    return false;
  }
}

export function markDevotionalComplete(devotionalId: string): SaveResult {
  const progress = loadProgress();
  const today = getTodayISO();

  if (progress.completedDevotionalIds.includes(devotionalId)) {
    return { progress, persisted: true };
  }

  let newStreak = 1;
  if (progress.lastCompletedDate) {
    const gap = daysBetween(progress.lastCompletedDate, today);
    if (gap === null) {
      reportError(
        'Stored last-completed date could not be compared to today; restarting the streak',
        new Error('Invalid date'),
        { lastCompletedDate: progress.lastCompletedDate, today }
      );
    } else if (gap === 1) {
      newStreak = progress.currentStreak + 1;
    } else if (gap === 0) {
      newStreak = progress.currentStreak;
    }
  }

  const updated: DevotionalProgress = {
    completedDevotionalIds: [...progress.completedDevotionalIds, devotionalId],
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, progress.longestStreak),
    lastCompletedDate: today,
  };

  return { progress: updated, persisted: saveProgress(updated) };
}

export function getProgress(): DevotionalProgress {
  return loadProgress();
}

export function isDevotionalComplete(devotionalId: string): boolean {
  return loadProgress().completedDevotionalIds.includes(devotionalId);
}
