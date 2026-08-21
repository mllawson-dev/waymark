import type { DevotionalProgress } from '../types/devotional';

const STORAGE_KEY = 'waymark:devotional-progress';

function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}

function loadProgress(): DevotionalProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { completedDevotionalIds: [], currentStreak: 0, longestStreak: 0, lastCompletedDate: null };
    }
    return JSON.parse(raw) as DevotionalProgress;
  } catch {
    return { completedDevotionalIds: [], currentStreak: 0, longestStreak: 0, lastCompletedDate: null };
  }
}

function saveProgress(progress: DevotionalProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage unavailable (private browsing, quota) — fail silently
  }
}

export function markDevotionalComplete(devotionalId: string): DevotionalProgress {
  const progress = loadProgress();
  const today = getTodayISO();

  if (progress.completedDevotionalIds.includes(devotionalId)) {
    return progress;
  }

  let newStreak = 1;
  if (progress.lastCompletedDate) {
    const gap = daysBetween(progress.lastCompletedDate, today);
    if (gap === 1) {
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

  saveProgress(updated);
  return updated;
}

export function getProgress(): DevotionalProgress {
  return loadProgress();
}

export function isDevotionalComplete(devotionalId: string): boolean {
  return loadProgress().completedDevotionalIds.includes(devotionalId);
}
