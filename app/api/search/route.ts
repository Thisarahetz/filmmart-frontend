import { NextRequest, NextResponse } from 'next/server';
import { searchMovies } from '@/lib/data/search';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') ?? '';
  const type = searchParams.get('type') ?? undefined;

  if (q.trim().length < 1) {
    return NextResponse.json([]);
  }

  const movies = await searchMovies(q, { limit: 8, type });
  return NextResponse.json(movies);
}
