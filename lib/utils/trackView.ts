/**
 * Records a "view" (a click that opens a title) to power Trending Now.
 *
 * Views are de-duplicated per browser: the same title only counts once within
 * DEDUPE_TTL_MS, so a single visitor repeatedly clicking can't inflate the
 * trending ranking. This applies to every entry point — cards, sliders, and
 * search results — so trending reflects genuine popularity.
 */

const DEDUPE_KEY = 'fm_viewed';
const DEDUPE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

function recentlyViewed(kind: 'movie' | 'game', id: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const map = JSON.parse(localStorage.getItem(DEDUPE_KEY) || '{}') as Record<string, number>;
    const key = `${kind}:${id}`;
    const now = Date.now();

    // Prune expired entries so the store doesn't grow unbounded.
    let changed = false;
    for (const k of Object.keys(map)) {
      if (now - map[k] > DEDUPE_TTL_MS) {
        delete map[k];
        changed = true;
      }
    }

    if (map[key] && now - map[key] <= DEDUPE_TTL_MS) {
      if (changed) localStorage.setItem(DEDUPE_KEY, JSON.stringify(map));
      return true;
    }

    map[key] = now;
    localStorage.setItem(DEDUPE_KEY, JSON.stringify(map));
    return false;
  } catch {
    return false; // storage unavailable — fall through and count the view
  }
}

export function trackView(movieId: string) {
  if (recentlyViewed('movie', movieId)) return;
  fetch(`/api/movies/${movieId}/view`, { method: 'POST' }).catch(() => {});
}

export function trackGameView(gameId: string) {
  if (recentlyViewed('game', gameId)) return;
  fetch(`/api/games/${gameId}/view`, { method: 'POST' }).catch(() => {});
}
