import '@testing-library/jest-dom';

if (typeof window !== 'undefined' && !('localStorage' in window)) {
  // @ts-ignore
  window.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
  };
}
