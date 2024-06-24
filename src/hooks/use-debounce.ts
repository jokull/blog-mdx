import { useCallback, useRef } from "react";

export function useDebounce(delay = 400) {
  // Use a ref to store the current timeout identifier
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce function that takes a value and a callback
  const debounce = useCallback(
    (value: string, callback: (debouncedValue: string) => void) => {
      // Clear any existing timeout to reset the debounce timer
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a new timeout
      timeoutRef.current = setTimeout(() => {
        callback(value);
      }, delay);
    },
    [delay]
  ); // Dependencies list includes delay

  return debounce;
}
