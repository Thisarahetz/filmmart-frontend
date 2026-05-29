import { connectDB } from '@/lib/db';
import Movie from '@/lib/models/Movie';
import Game from '@/lib/models/Game';
import { serialize } from '@/lib/utils';
import type { Movie as MovieType, Game as GameType } from '@/types';

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function searchMovies(
  query: string,
  options: { limit?: number; type?: string } = {}
): Promise<MovieType[]> {
  const q = query.trim();
  if (q.length < 1) return [];

  const { limit = 30, type } = options;
  const pattern = escapeRegex(q);

  await connectDB();

  const filter: Record<string, unknown> = {
    $or: [
      { title: { $regex: pattern, $options: 'i' } },
      { genre: { $regex: pattern, $options: 'i' } },
      { year:  { $regex: pattern, $options: 'i' } },
      { desc:  { $regex: pattern, $options: 'i' } },
      { tags:  { $regex: pattern, $options: 'i' } },
      { country: { $regex: pattern, $options: 'i' } },
    ],
  };

  if (type === 'movie')  filter.isSeries = false;
  if (type === 'series') filter.isSeries = true;

  const movies = await Movie.find(filter)
    .sort({ title: 1 })
    .limit(limit)
    .lean();

  return serialize(movies) as unknown as MovieType[];
}

export async function searchGames(
  query: string,
  options: { limit?: number } = {}
): Promise<GameType[]> {
  const q = query.trim();
  if (q.length < 1) return [];

  const { limit = 60 } = options;
  const pattern = escapeRegex(q);

  await connectDB();

  const games = await Game.find({
    $or: [
      { title:       { $regex: pattern, $options: 'i' } },
      { category:    { $regex: pattern, $options: 'i' } },
      { description: { $regex: pattern, $options: 'i' } },
    ],
  })
    .sort({ title: 1 })
    .limit(limit)
    .lean();

  return serialize(games) as unknown as GameType[];
}
