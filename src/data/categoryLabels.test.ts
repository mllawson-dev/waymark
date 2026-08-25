import { describe, expect, it } from 'vitest';
import { categoryLabels } from './categoryLabels';
import { resources } from './resources';

describe('categoryLabels', () => {
  it('has a non-empty label for every category', () => {
    for (const label of Object.values(categoryLabels)) {
      expect(label.length).toBeGreaterThan(0);
    }
  });

  it('covers every category used by a resource', () => {
    for (const resource of resources) {
      expect(categoryLabels[resource.category]).toBeDefined();
    }
  });
});
