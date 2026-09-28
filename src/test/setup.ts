import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Node 25+ exposes a stub globalThis.localStorage when no --localstorage-file
// backing path is set, which shadows the jsdom Storage. Swap in a complete
// in-memory implementation so tests behave the same on every runtime.
function installMemoryStorage(): void {
  const backing = new Map<string, string>();
  const storage: Storage = {
    get length() {
      return backing.size;
    },
    clear() {
      backing.clear();
    },
    getItem(key: string) {
      return backing.get(key) ?? null;
    },
    key(index: number) {
      return [...backing.keys()][index] ?? null;
    },
    removeItem(key: string) {
      backing.delete(key);
    },
    setItem(key: string, value: string) {
      backing.set(key, String(value));
    },
  };
  Object.defineProperty(window, 'localStorage', {
    value: storage,
    configurable: true,
    writable: true,
  });
}

if (
  typeof window.localStorage?.getItem !== 'function' ||
  typeof window.localStorage?.clear !== 'function'
) {
  installMemoryStorage();
}

// jsdom does not implement matchMedia; the app uses it for prefers-reduced-motion.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

// jsdom does not implement IntersectionObserver; scroll reveals rely on it.
// Tests that care about reveal behaviour stub this with their own observer.
if (!('IntersectionObserver' in window)) {
  class NoopIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: NoopIntersectionObserver,
  });
}

afterEach(() => {
  cleanup();
  localStorage.clear();
});
