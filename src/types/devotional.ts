export interface Devotional {
  id: string;
  date: string; // ISO date string, e.g. "2026-08-18"
  title: string;
  verseReference: string; // e.g. "Psalm 23:1-3"
  verseText: string;
  reflection: string;
  prayer: string;
  readingPlanId?: string;
  dayInPlan?: number;
}

export interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  totalDays: number;
  devotionalIds: string[];
}

export interface DevotionalProgress {
  completedDates: string[];
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
}
