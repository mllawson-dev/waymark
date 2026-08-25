import { useState } from 'react';
import { devotionals } from '../data/devotionals';
import { VerseCard } from '../components/VerseCard';
import { StreakBadge } from '../components/StreakBadge';
import { Button } from '../components/Button';
import { Card, CardTitle, CardBody } from '../components/Card';
import { ScrollReveal } from '../components/ScrollReveal';
import { LiveAnnouncer } from '../components/LiveAnnouncer';
import { PageContainer } from '../components/PageContainer';
import { PageTitle } from '../components/PageTitle';
import { CheckPop } from '../components/CheckPop';
import {
  getProgress,
  markDevotionalComplete,
  isDevotionalComplete,
} from '../services/devotionalProgress';
import { pluralize } from '../utils/format';
import type { DevotionalProgress } from '../types/devotional';

export function DevotionalPage() {
  const today = devotionals[0];
  const archive = devotionals.slice(1);

  const [progress, setProgress] = useState<DevotionalProgress>(() => getProgress());
  const [completed, setCompleted] = useState(() => (today ? isDevotionalComplete(today.id) : false));
  const [announcement, setAnnouncement] = useState('');

  function handleComplete() {
    if (!today || completed) return;
    const updated = markDevotionalComplete(today.id);
    setProgress(updated);
    setCompleted(true);
    setAnnouncement(`Marked as read. Streak: ${pluralize(updated.currentStreak, 'day')}.`);
  }

  if (!today) {
    return (
      <PageContainer>
        <PageTitle>Today's devotional</PageTitle>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)', marginTop: '1rem' }}>
          No devotional is available right now — check back soon.
        </p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <PageTitle style={{ margin: 0 }}>Today's devotional</PageTitle>
        <StreakBadge streak={progress.currentStreak} />
      </div>

      <VerseCard reference={today.verseReference} text={today.verseText} />

      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', color: 'var(--color-text-primary)' }}>
          {today.title}
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)', lineHeight: 1.7 }}>
          {today.reflection}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-heading)',
            fontStyle: 'italic',
            color: 'var(--color-text-secondary)',
            borderLeft: '3px solid var(--color-accent)',
            paddingLeft: '1rem',
            marginTop: '1.25rem',
          }}
        >
          {today.prayer}
        </p>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <Button
          variant={completed ? 'secondary' : 'primary'}
          onClick={handleComplete}
          aria-disabled={completed}
          style={completed ? { cursor: 'default' } : undefined}
        >
          {completed && <CheckPop />}
          {completed ? "Marked as read today" : 'Mark as read'}
        </Button>
        <LiveAnnouncer message={announcement} />
      </div>

      {archive.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
            Past devotionals
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {archive.map((entry, index) => (
              <ScrollReveal key={entry.id} delayMs={index * 80}>
                <Card padded>
                  <CardTitle>{entry.title}</CardTitle>
                  <CardBody>{entry.verseReference} — {entry.verseText}</CardBody>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
