import { useMemo, useCallback } from 'react';

export const useMemorized = (value, deps) => useMemo(() => value, deps);

export const useStableCallback = (callback, deps) => useCallback(callback, deps);

export const memoizeComponent = (Component) => {
  const Memoized = React.memo(Component, (prevProps, nextProps) => {
    return Object.keys(prevProps).every(
      key => prevProps[key] === nextProps[key]
    );
  });
  Memoized.displayName = `Memo(${Component.displayName || Component.name})`;
  return Memoized;
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
