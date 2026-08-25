import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Badge } from './Badge';
import { Button } from './Button';

describe('Button', () => {
  it('defaults to the primary medium variant', () => {
    render(<Button>Add to cart</Button>);

    const button = screen.getByRole('button', { name: 'Add to cart' });
    expect(button.className).toBe('wm-button wm-button--primary wm-button--md');
  });

  it('applies the requested variant, size, and extra class names', () => {
    render(
      <Button variant="ghost" size="lg" className="custom">
        Read more
      </Button>
    );

    expect(screen.getByRole('button').className).toBe('wm-button wm-button--ghost wm-button--lg custom');
  });

  it('forwards native button attributes and events', () => {
    const onClick = vi.fn();
    render(
      <Button type="submit" disabled onClick={onClick}>
        Checkout
      </Button>
    );

    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.type).toBe('submit');
    expect(button.disabled).toBe(true);

    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('Badge', () => {
  it('defaults to the neutral tone', () => {
    render(<Badge>New</Badge>);

    expect(screen.getByText('New').className).toBe('wm-badge wm-badge--neutral');
  });

  it('applies the requested tone, extra class names, and passthrough props', () => {
    render(
      <Badge tone="sage" className="custom" title="in stock">
        Apparel
      </Badge>
    );

    const badge = screen.getByText('Apparel');
    expect(badge.className).toBe('wm-badge wm-badge--sage custom');
    expect(badge.getAttribute('title')).toBe('in stock');
  });
});
