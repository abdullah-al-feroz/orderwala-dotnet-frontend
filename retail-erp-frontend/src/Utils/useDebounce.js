import { useEffect, useRef, useCallback } from "react";

const useDebounce = (callback, delay = 500) => {
  const callbackRef = useRef(callback);
  const timerRef = useRef(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const debouncedFn = useCallback((value) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      callbackRef.current(value);
    }, delay);
  }, [delay]);

  return debouncedFn;
};

export default useDebounce;