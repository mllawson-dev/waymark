import { Link } from 'react-router-dom';
import { WaymarkLogo } from '../components/WaymarkLogo';
import { Button } from '../components/Button';
import { PageContainer } from '../components/PageContainer';
import { Card, CardTitle, CardBody } from '../components/Card';
import { ScrollReveal } from '../components/ScrollReveal';
import { useParallax } from '../hooks/useParallax';
import { devotionals } from '../data/devotionals';

const pillars = [
  {
    title: 'Daily devotional',
    body: "Today's verse, a short reflection, and a prayer to carry with you.",
    to: '/devotional',
  },
  {
    title: 'Resources',
    body: 'Honest study guides and articles on prayer, grief, parenting, and growth.',
    to: '/resources',
  },
  {
    title: 'Store',
    body: 'Devotionals, prints, and a few things to hold onto along the way.',
    to: '/store',
  },
];

export function Home() {
  const today = devotionals[0];
  const heroOffset = useParallax(0.12, 18);

  return (
    <PageContainer width="wide">
      <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem',
            transform: `translateY(${heroOffset}px)`,
          }}
        >
          <WaymarkLogo size={48} />
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.25rem',
            color: 'var(--color-text-primary)',
            marginBottom: '0.75rem',
          }}
        >
          Every step has a purpose
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.0625rem',
            color: 'var(--color-text-secondary)',
            maxWidth: 460,
            margin: '0 auto 1.5rem auto',
            lineHeight: 1.6,
          }}
        >
          A daily companion for your walk with God &mdash; one step, one verse, one day at a time.
        </p>
        <Link to="/devotional">
          <Button variant="primary" size="lg">
            Start today's devotional
          </Button>
        </Link>
      </section>

      {today && (
        <section style={{ marginBottom: '3rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'var(--color-text-secondary)',
              marginBottom: '0.5rem',
            }}
          >
            Today's verse
          </h2>
          <Card>
            <p
              style={{
                fontFamily: 'var(--font-heading)',
                fontStyle: 'italic',
                fontSize: '1.25rem',
                color: 'var(--color-text-primary)',
                margin: '0 0 0.5rem 0',
              }}
            >
              &ldquo;{today.verseText}&rdquo;
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-accent-deep)', margin: 0 }}>
              {today.verseReference}
            </p>
          </Card>
        </section>
      )}

      <section>
        <h2
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--color-text-secondary)',
            marginBottom: '0.75rem',
          }}
        >
          Explore Waymark
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          {pillars.map((pillar, index) => (
            <ScrollReveal key={pillar.to} delayMs={index * 100}>
              <Link to={pillar.to} className="wm-card-link">
                <Card>
                  <CardTitle>{pillar.title}</CardTitle>
                  <CardBody>{pillar.body}</CardBody>
                </Card>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
