import { WaymarkLogo } from '../components/WaymarkLogo';
import { Card, CardTitle, CardBody } from '../components/Card';
import { ScrollReveal } from '../components/ScrollReveal';
import { PageContainer } from '../components/PageContainer';

const values = [
  {
    title: 'Steady, not showy',
    body: 'Faith grows in ordinary days more than dramatic ones. We build for the quiet, daily walk, not the highlight reel.',
  },
  {
    title: 'Honest about the hard parts',
    body: 'Doubt, grief, and unanswered questions get real space here, not a rushed verse and a smile.',
  },
  {
    title: 'One step is enough',
    body: 'You do not need the whole map today. Just the next waymark on the path.',
  },
];

export function AboutPage() {
  return (
    <PageContainer>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <WaymarkLogo size={56} />
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2rem',
          color: 'var(--color-text-primary)',
          textAlign: 'center',
          marginBottom: '1rem',
        }}
      >
        Every step has a purpose
      </h1>

      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.0625rem',
          color: 'var(--color-text-secondary)',
          textAlign: 'center',
          lineHeight: 1.7,
          maxWidth: 500,
          margin: '0 auto 2.5rem auto',
        }}
      >
        Waymark exists for the days you cannot see the whole road, and just need to know where to
        put your foot next. Daily devotionals, honest resources, and a few things to hold in your
        hands along the way.
      </p>

      <h2
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.375rem',
          color: 'var(--color-text-primary)',
          marginBottom: '1rem',
        }}
      >
        What we believe about the walk
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {values.map((value, index) => (
          <ScrollReveal key={value.title} delayMs={index * 100}>
            <Card>
              <CardTitle>{value.title}</CardTitle>
              <CardBody>{value.body}</CardBody>
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </PageContainer>
  );
}
