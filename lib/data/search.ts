import { connectDB } from '@/lib/db';
import Movie from '@/lib/models/Movie';
import { serialize } from '@/lib/utils';
import type { Movie as MovieType } from '@/types';

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
