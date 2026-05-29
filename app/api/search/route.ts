import { NextRequest, NextResponse } from 'next/server';
import { searchMovies, searchGames } from '@/lib/data/search';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q    = searchParams.get('q')    ?? '';
  const type = searchParams.get('type') ?? '';

  if (q.trim().length < 1) return NextResponse.json([]);

  if (type === 'game') {
    const games = await searchGames(q, { limit: 8 });
    return NextResponse.json(games);
  }

  const movies = await searchMovies(q, { limit: 8, type: type || undefined });
  return NextResponse.json(movies);
}
