const KEY = 'simple-notes-items';

// PUBLIC_INTERFACE
export function loadNotes() {
  /** Load notes array from localStorage, returns [] if none. */
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export function saveNotes(notes) {
  /** Save notes array to localStorage. */
  try {
    window.localStorage.setItem(KEY, JSON.stringify(notes || []));
  } catch {
    // ignore quota/security errors
  }
}
