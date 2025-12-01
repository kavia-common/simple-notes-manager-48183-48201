 // PUBLIC_INTERFACE
export function debounce(fn, wait = 300) {
  /** Debounce utility. Returns a debounced function preserving last args and 'this'. */
  let t = null;
  function debounced(...args) {
    if (t) clearTimeout(t);
    const ctx = this;
    t = setTimeout(() => fn.apply(ctx, args), wait);
  }
  debounced.flush = () => {
    if (t) {
      clearTimeout(t);
      t = null;
      fn();
    }
  };
  return debounced;
}
