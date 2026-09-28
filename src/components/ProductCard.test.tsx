import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Product } from '../types/product';
import type { Resource } from '../types/resource';
import { ProductCard } from './ProductCard';
import { ResourceCard } from './ResourceCard';

const product: Product = {
  id: 'prod-test',
  name: 'Waymark Mug',
  description: 'A stoneware mug.',
  category: 'gifts',
  basePrice: 16,
  image: '/mug.jpg',
  imageAlt: 'A cream stoneware mug',
  details: ['Stoneware', 'Dishwasher safe'],
  variants: [
    { id: 'var-a', label: 'Cream', priceModifier: 0, inStock: false },
    { id: 'var-b', label: 'Sage', priceModifier: 2, inStock: true },
  ],
};

const resource: Resource = {
  id: 'res-test',
  title: 'Praying through grief',
  summary: 'A short guide for hard seasons.',
  body: 'Full body text.',
  category: 'grief',
  tags: ['grief', 'prayer'],
  publishedDate: '2026-08-01',
};

function renderInRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('ProductCard', () => {
  it('links to the product detail page and shows the base price', () => {
    renderInRouter(<ProductCard product={product} />);

    for (const link of screen.getAllByRole('link')) {
      expect(link.getAttribute('href')).toBe('/store/prod-test');
    }
    expect(screen.getByRole('heading', { name: 'Waymark Mug' })).toBeTruthy();
    expect(screen.getByRole('img', { name: 'A cream stoneware mug' })).toBeTruthy();
    expect(screen.getByText('From $16.00')).toBeTruthy();
  });

  it('shows the category and stock status while any variant is in stock', () => {
    renderInRouter(<ProductCard product={product} />);

    expect(screen.getByText('gifts')).toBeTruthy();
    expect(screen.getByText('Prototype in stock')).toBeTruthy();
  });

  it('shows sold out when no variant is in stock', () => {
    const soldOut: Product = {
      ...product,
      variants: product.variants.map((v) => ({ ...v, inStock: false })),
    };

    renderInRouter(<ProductCard product={soldOut} />);

    expect(screen.getByText('Sold out')).toBeTruthy();
    expect(screen.queryByText('Prototype in stock')).toBeNull();
  });

  it('marks the featured card', () => {
    renderInRouter(<ProductCard product={product} featured />);

    expect(screen.getByRole('article').className).toContain('wm-product-card--featured');
  });
});

describe('ResourceCard', () => {
  it('links to the resource, labels its category, and lists its tags', () => {
    renderInRouter(<ResourceCard resource={resource} />);

    for (const link of screen.getAllByRole('link')) {
      expect(link.getAttribute('href')).toBe('/resources/res-test');
    }
    expect(screen.getByText('Grief')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Praying through grief' })).toBeTruthy();
    expect(screen.getByText('grief · prayer')).toBeTruthy();
  });
});
