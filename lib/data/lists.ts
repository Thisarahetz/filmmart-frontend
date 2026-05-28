import type { PipelineStage } from 'mongoose';
import { connectDB } from '@/lib/db';
import List from '@/lib/models/List';
import Movie from '@/lib/models/Movie';
import { serialize } from '@/lib/utils';
import type { Movie as MovieType, MovieList as MovieListType } from '@/types';

export interface ListFilters {
  type?: string;
  genre?: string;
}

export async function getTrendingMovies(limit = 20): Promise<MovieType[]> {
  await connectDB();
  const movies = await Movie.find().sort({ createdAt: -1 }).limit(limit).lean();
  return serialize(movies) as unknown as MovieType[];
}

export async function getEnrichedLists(filters: ListFilters = {}): Promise<MovieListType[]> {
  await connectDB();

  const match: Record<string, string> = {};
  if (filters.type) match.type = filters.type;
  if (filters.genre) match.genre = filters.genre;

  const pipeline: PipelineStage[] = [];
  if (Object.keys(match).length) pipeline.push({ $match: match });
  pipeline.push({ $sample: { size: 10 } });

  const lists = await List.aggregate(pipeline);
  const enriched = await Promise.all(
    lists.map(async (list) => {
      const movies = await Movie.find({ _id: { $in: list.content } }).lean();
      return { ...list, movies: serialize(movies) };
    })
  );
  return serialize(enriched) as unknown as MovieListType[];
}
