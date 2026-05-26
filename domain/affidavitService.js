export function debounce(fn, delay = 300) {
  let timeoutId = null;

  return function (...args) {
    // Clear previous pending execution
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Schedule new execution
    timeoutId = setTimeout(() => {
      try {
        fn(...args);
      } catch (error) {
        console.error("[debounce error]", error);
      }
    }, delay);
  };
}
