import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card, CardBody, CardFooter, CardImage, CardTitle } from './Card';
import { PageContainer } from './PageContainer';
import { WaymarkLogo } from './WaymarkLogo';

describe('Card', () => {
  it('is padded by default', () => {
    render(<Card>Body</Card>);

    expect(screen.getByText('Body').className).toBe('wm-card wm-card--padded');
  });

  it('drops the padding class and merges extra class names', () => {
    render(
      <Card padded={false} className="custom" data-testid="card">
        Body
      </Card>
    );

    expect(screen.getByTestId('card').className).toBe('wm-card custom');
  });

  it('renders its subcomponents', () => {
    render(
      <Card>
        <CardImage src="/print.png" alt="Framed print" />
        <CardTitle>Print</CardTitle>
        <CardBody>An 11x14 print.</CardBody>
        <CardFooter>$18</CardFooter>
      </Card>
    );

    expect(screen.getByRole('img', { name: 'Framed print' }).getAttribute('src')).toBe('/print.png');
    expect(screen.getByRole('heading', { name: 'Print' }).className).toBe('wm-card__title');
    expect(screen.getByText('An 11x14 print.').className).toBe('wm-card__body');
    expect(screen.getByText('$18').className).toBe('wm-card__footer');
  });
});

describe('PageContainer', () => {
  it('renders a main landmark that the skip link can target', () => {
    render(<PageContainer>Content</PageContainer>);

    const main = screen.getByRole('main');
    expect(main.id).toBe('main-content');
    expect(main.style.maxWidth).toBe('640px');
  });

  it('widens the column on request', () => {
    render(<PageContainer width="wide">Content</PageContainer>);

    expect(screen.getByRole('main').style.maxWidth).toBe('720px');
  });
});

describe('WaymarkLogo', () => {
  it('renders a labelled square logo at the default size', () => {
    render(<WaymarkLogo />);

    const logo = screen.getByRole('img', { name: 'Waymark logo' });
    expect(logo.getAttribute('width')).toBe('40');
    expect(logo.getAttribute('height')).toBe('40');
  });

  it('honours the requested size', () => {
    render(<WaymarkLogo size={24} />);

    expect(screen.getByRole('img', { name: 'Waymark logo' }).getAttribute('width')).toBe('24');
  });
});
