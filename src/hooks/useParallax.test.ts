import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useParallax } from './useParallax';

function mockReducedMotion(prefersReduced: boolean): void {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) => ({ matches: prefersReduced, media: query }) as unknown as MediaQueryList
  );
}

/** Runs animation frame callbacks synchronously so offset updates are observable. */
function runFramesSynchronously(): void {
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
}

function scrollTo(y: number): void {
  window.scrollY = y;
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
}

describe('useParallax', () => {
  beforeEach(() => {
    mockReducedMotion(false);
    runFramesSynchronously();
    window.scrollY = 0;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.scrollY = 0;
  });

  it('starts at no offset', () => {
    const { result } = renderHook(() => useParallax());

    expect(result.current).toBe(0);
  });

  it('grows the offset with the scroll position by the given factor', () => {
    const { result } = renderHook(() => useParallax(0.5, 100));

    scrollTo(40);

    expect(result.current).toBe(20);
  });

  it('caps the offset at the maximum', () => {
    const { result } = renderHook(() => useParallax(0.5, 10));

    scrollTo(400);

    expect(result.current).toBe(10);
  });

  it('coalesces bursts of scroll events into a single frame', () => {
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(1);
    renderHook(() => useParallax());

    window.scrollY = 10;
    window.dispatchEvent(new Event('scroll'));
    window.scrollY = 20;
    window.dispatchEvent(new Event('scroll'));

    expect(raf).toHaveBeenCalledTimes(1);
  });

  it('stays at zero when the user prefers reduced motion', () => {
    mockReducedMotion(true);
    const { result } = renderHook(() => useParallax(0.5, 100));

    scrollTo(200);

    expect(result.current).toBe(0);
  });

  it('stops listening for scrolls once unmounted', () => {
    const removeListener = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useParallax());

    unmount();

    expect(removeListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
