import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useScrollReveal } from './useScrollReveal';

type ObserverCallback = (entries: Array<{ isIntersecting: boolean }>) => void;

let observerCallbacks: ObserverCallback[] = [];
let observedNodes: Element[] = [];
let disconnectCount = 0;

class FakeIntersectionObserver {
  constructor(callback: ObserverCallback) {
    observerCallbacks.push(callback);
  }
  observe(node: Element) {
    observedNodes.push(node);
  }
  disconnect() {
    disconnectCount += 1;
  }
  unobserve() {}
  takeRecords() {
    return [];
  }
}

function mockReducedMotion(prefersReduced: boolean): void {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) => ({ matches: prefersReduced, media: query }) as unknown as MediaQueryList
  );
}

/** Renders the hook with its ref attached to a real element in the document. */
function renderAttached(threshold?: number) {
  const node = document.createElement('div');
  document.body.append(node);

  const rendered = renderHook(() => {
    const reveal = useScrollReveal<HTMLDivElement>(threshold);
    reveal.ref.current = node;
    return reveal;
  });

  return { ...rendered, node };
}

describe('useScrollReveal', () => {
  beforeEach(() => {
    observerCallbacks = [];
    observedNodes = [];
    disconnectCount = 0;
    mockReducedMotion(false);
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('starts hidden and observes the referenced node', () => {
    const { result, node } = renderAttached();

    expect(result.current.isVisible).toBe(false);
    expect(observedNodes).toEqual([node]);
  });

  it('reveals the element once it intersects, then stops observing', () => {
    const { result } = renderAttached();

    act(() => {
      observerCallbacks[0]?.([{ isIntersecting: true }]);
    });

    expect(result.current.isVisible).toBe(true);
    expect(disconnectCount).toBeGreaterThanOrEqual(1);
  });

  it('stays hidden while the element is not intersecting', () => {
    const { result } = renderAttached();

    act(() => {
      observerCallbacks[0]?.([{ isIntersecting: false }]);
    });

    expect(result.current.isVisible).toBe(false);
  });

  it('stays revealed after a later non-intersecting entry', () => {
    const { result } = renderAttached();

    act(() => {
      observerCallbacks[0]?.([{ isIntersecting: true }]);
    });
    act(() => {
      observerCallbacks[0]?.([{ isIntersecting: false }]);
    });

    expect(result.current.isVisible).toBe(true);
  });

  it('reveals immediately without observing when reduced motion is preferred', () => {
    mockReducedMotion(true);

    const { result } = renderAttached();

    expect(result.current.isVisible).toBe(true);
    expect(observedNodes).toEqual([]);
  });

  it('does not observe when no node is attached', () => {
    renderHook(() => useScrollReveal<HTMLDivElement>());

    expect(observedNodes).toEqual([]);
  });

  it('disconnects the observer on unmount', () => {
    const { unmount } = renderAttached();

    unmount();

    expect(disconnectCount).toBe(1);
  });
});
