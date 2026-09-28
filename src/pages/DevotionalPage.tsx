import { useState } from 'react';
import { devotionals, getDailyDevotional } from '../data/devotionals';
import { VerseCard } from '../components/VerseCard';
import { StreakBadge } from '../components/StreakBadge';
import { Button } from '../components/Button';
import { LiveAnnouncer } from '../components/LiveAnnouncer';
import { getProgress, getLocalDateISO, markDevotionalComplete, isDevotionalComplete } from '../services/devotionalProgress';
import type { DevotionalProgress } from '../types/devotional';
import './DevotionalPage.css';

export function DevotionalPage() {
  const now = new Date();
  const today = getDailyDevotional(now);
  const todayISO = getLocalDateISO(now);
  const archive = devotionals.filter((entry) => entry.id !== today.id);
  const [progress, setProgress] = useState<DevotionalProgress>(() => getProgress(todayISO));
  const [completed, setCompleted] = useState(() => isDevotionalComplete(todayISO));
  const [announcement, setAnnouncement] = useState('');

  function handleComplete() {
    if (completed) return;
    const updated = markDevotionalComplete(todayISO);
    setProgress(updated);
    setCompleted(true);
    setAnnouncement(`Today marked complete. Current streak: ${updated.currentStreak} day${updated.currentStreak === 1 ? '' : 's'}.`);
  }

  const formattedDate = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(now);

  return (
    <main id="main-content" className="wm-devotional-page">
      <header className="wm-devotional-header">
        <div>
          <p className="wm-eyebrow">{formattedDate}</p>
          <h1>Today’s devotional</h1>
          <p>Take the next few minutes slowly. There is nowhere else you need to be.</p>
        </div>
        <div className="wm-devotional-stats">
          <StreakBadge streak={progress.currentStreak} />
          {progress.longestStreak > 0 && <span>Longest streak: {progress.longestStreak} day{progress.longestStreak === 1 ? '' : 's'}</span>}
        </div>
      </header>

      <section className="wm-devotional-reading">
        <VerseCard reference={today.verseReference} text={today.verseText} />
        <article className="wm-reflection">
          <p className="wm-eyebrow">Reflection</p>
          <h2>{today.title}</h2>
          <p>{today.reflection}</p>
          <blockquote><span>Prayer</span>{today.prayer}</blockquote>
          <Button variant={completed ? 'secondary' : 'primary'} size="lg" onClick={handleComplete} disabled={completed}>
            {completed ? '✓ Marked as read today' : 'Mark today as read'}
          </Button>
          <LiveAnnouncer message={announcement} />
          <p className="wm-progress-note">Your progress stays privately in this browser.</p>
        </article>
      </section>

      <section className="wm-past-readings">
        <div className="wm-past-readings__heading">
          <p className="wm-eyebrow">Continue the practice</p>
          <h2>More readings for the road</h2>
        </div>
        <div className="wm-past-readings__list">
          {archive.map((entry, index) => (
            <article key={entry.id}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div><h3>{entry.title}</h3><p>{entry.verseReference} — {entry.verseText}</p></div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
