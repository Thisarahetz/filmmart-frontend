export function trackView(movieId: string) {
  // Fire-and-forget — never blocks navigation
  fetch(`/api/movies/${movieId}/view`, { method: 'POST' }).catch(() => {});
}
