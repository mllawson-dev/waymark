import { useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '../components/Button';
import { PageContainer } from '../components/PageContainer';
import { Card, CardTitle, CardBody, CardFooter } from '../components/Card';
import { Badge } from '../components/Badge';
import { Drawer } from '../components/Drawer';
import { StreakBadge } from '../components/StreakBadge';
import { WaymarkLogo } from '../components/WaymarkLogo';

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.9rem',
        color: 'var(--color-text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}
    >
      {children}
    </h2>
  );
}

interface ColorSwatch {
  name: string;
  cssVar: string;
  usage: string;
}

const colorSwatches: ColorSwatch[] = [
  { name: 'Cream', cssVar: '--wm-cream', usage: 'Page background' },
  { name: 'Cream deep', cssVar: '--wm-cream-deep', usage: 'Subtle surfaces, hover fills' },
  { name: 'Ink', cssVar: '--wm-ink', usage: 'Primary text' },
  { name: 'Ink muted', cssVar: '--wm-ink-muted', usage: 'Secondary text (WCAG AA)' },
  { name: 'Terracotta', cssVar: '--wm-terracotta', usage: 'Decorative only — glows, borders, logo' },
  { name: 'Terracotta deep', cssVar: '--wm-terracotta-deep', usage: 'Accent text, links, button backgrounds (WCAG AA)' },
  { name: 'Gold', cssVar: '--wm-gold', usage: 'Reserved for decorative accents' },
  { name: 'Border', cssVar: '--wm-border', usage: 'Card and input borders' },
  { name: 'Sage', cssVar: '--wm-sage', usage: 'Success/streak accent (WCAG AA)' },
];

export function StyleGuide() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <PageContainer width="wide">
      <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
        Waymark design system
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)', marginTop: '0.5rem', marginBottom: '2.5rem' }}>
        Design tokens and components used across Waymark, kept in one place so the site stays visually consistent.
      </p>

      <section style={{ marginBottom: '2.5rem' }}>
        <SectionHeading>Logo</SectionHeading>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.75rem' }}>
          <WaymarkLogo size={56} />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-secondary)', maxWidth: 380 }}>
            The approved two-toned compass needle — terracotta pointing north and ink pointing south —
            rendered from the protected large, medium, and favicon geometries.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <SectionHeading>Color</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '0.75rem' }}>
          {colorSwatches.map((swatch) => (
            <div key={swatch.cssVar} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <div style={{ height: 48, backgroundColor: `var(${swatch.cssVar})` }} />
              <div style={{ padding: '0.6rem 0.75rem' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.8125rem', color: 'var(--color-text-primary)', margin: 0 }}>
                  {swatch.name}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: '0.2rem 0 0 0' }}>
                  {swatch.usage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <SectionHeading>Typography</SectionHeading>
        <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', color: 'var(--color-text-primary)', margin: 0 }}>
            Heading — Fraunces 2.25rem
          </p>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--color-text-primary)', margin: 0 }}>
            Heading — Fraunces 1.5rem
          </p>
          <p style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontSize: '1.25rem', color: 'var(--color-text-primary)', margin: 0 }}>
            Verse text — Fraunces italic 1.25rem
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--color-text-primary)', margin: 0 }}>
            Body — Nunito Sans 1rem. Used for reflections, descriptions, and everyday reading.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            Caption — Nunito Sans 0.8125rem, secondary color
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <SectionHeading>Spacing &amp; radius</SectionHeading>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <div key={size} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: 'var(--wm-cream-deep)',
                  border: '1px solid var(--color-border)',
                  borderRadius: `var(--radius-${size})`,
                }}
              />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.4rem' }}>
                --radius-{size}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <SectionHeading>Buttons</SectionHeading>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          <Button variant="primary">Start today's reading</Button>
          <Button variant="secondary">Browse resources</Button>
          <Button variant="ghost">Learn more</Button>
          <Button variant="primary" disabled>
            Sold out
          </Button>
        </div>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <SectionHeading>Badges</SectionHeading>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
          <Badge tone="accent">Prayer</Badge>
          <Badge tone="sage">Growth</Badge>
          <Badge tone="neutral">Community</Badge>
        </div>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <SectionHeading>Streak badge</SectionHeading>
        <div style={{ marginTop: '0.75rem' }}>
          <StreakBadge streak={4} />
        </div>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <SectionHeading>Card</SectionHeading>
        <div style={{ maxWidth: 320, marginTop: '0.75rem' }}>
          <Card>
            <Badge tone="accent">Grief</Badge>
            <CardTitle>Finding words when there are none</CardTitle>
            <CardBody>
              A short guide for sitting with loss, and a few prayers for the days that feel too heavy to name.
            </CardBody>
            <CardFooter>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>6 min read</span>
              <Button variant="ghost" size="sm">
                Read
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section>
        <SectionHeading>Drawer</SectionHeading>
        <div style={{ marginTop: '0.75rem' }}>
          <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
            Open cart
          </Button>
        </div>
        <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Your cart">
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}>
            Your cart is empty.
          </p>
        </Drawer>
      </section>
    </PageContainer>
  );
}
