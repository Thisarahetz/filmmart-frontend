/**
 * Recent search history, persisted per browser in localStorage.
 * Used by the navbar search bar to show a "Recent searches" dropdown.
 */

const KEY = 'fm_recent_searches';
const MAX = 6;

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(list) ? list.slice(0, MAX) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): void {
  const q = query.trim();
  if (!q || typeof window === 'undefined') return;
  try {
    const existing = getRecentSearches().filter((s) => s.toLowerCase() !== q.toLowerCase());
    const next = [q, ...existing].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — ignore */
  }
}

export function removeRecentSearch(query: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const next = getRecentSearches().filter((s) => s.toLowerCase() !== query.toLowerCase());
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return getRecentSearches();
  }
}

export function clearRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  return [];
}
