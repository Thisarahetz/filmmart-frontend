export function trackView(movieId: string) {
  fetch(`/api/movies/${movieId}/view`, { method: 'POST' }).catch(() => {});
}

export function trackGameView(gameId: string) {
  fetch(`/api/games/${gameId}/view`, { method: 'POST' }).catch(() => {});
}
