import type { PipelineStage } from 'mongoose';
import { connectDB } from '@/lib/db';
import List from '@/lib/models/List';
import Movie from '@/lib/models/Movie';
import Game from '@/lib/models/Game';
import { serialize } from '@/lib/utils';
import type { Movie as MovieType, MovieList as MovieListType, GameList as GameListType } from '@/types';

export const PAGE_SIZE = 24;

export interface CategoryPage {
  movies: MovieType[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getCategoryMovies(
  genre: string,
  page = 1,
  type?: string
): Promise<CategoryPage> {
  await connectDB();

  const filter: Record<string, unknown> = { tags: genre };
  if (type === 'movie')  filter.isSeries = false;
  if (type === 'series') filter.isSeries = true;

  const skip = (page - 1) * PAGE_SIZE;
  const [movies, total] = await Promise.all([
    Movie.find(filter).sort({ rating: -1 }).skip(skip).limit(PAGE_SIZE).lean(),
    Movie.countDocuments(filter),
  ]);

  return {
    movies: serialize(movies) as unknown as MovieType[],
    total,
    page,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}

export interface ListFilters {
  type?: string;
  genre?: string;
}

export async function getTrendingMovies(limit = 20): Promise<MovieType[]> {
  await connectDB();
  // Sort by click views first; fall back to rating for unclicked movies
  const movies = await Movie.find()
    .sort({ views: -1, rating: -1 })
    .limit(limit)
    .lean();
  return serialize(movies) as unknown as MovieType[];
}

export async function getEnrichedLists(filters: ListFilters = {}): Promise<MovieListType[]> {
  await connectDB();

  // When a genre/category filter is active, fetch movies by tag directly
  if (filters.genre) {
    const movieFilter: Record<string, unknown> = { tags: filters.genre };
    if (filters.type === 'movie')  movieFilter.isSeries = false;
    if (filters.type === 'series') movieFilter.isSeries = true;

    const movies = await Movie.find(movieFilter)
      .sort({ rating: -1 })
      .limit(50)
      .lean();

    if (!movies.length) return [];

    // Return as a single synthetic list
    const label = filters.genre
      .split('-')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return serialize([{
      _id: filters.genre,
      title: label,
      type: filters.type,
      genre: filters.genre,
      content: movies.map((m) => (m._id as { toString(): string }).toString()),
      movies: serialize(movies),
    }]) as unknown as MovieListType[];
  }

  // No filter — random sample of lists
  const match: Record<string, string> = {};
  if (filters.type) match.type = filters.type;

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

export async function getEnrichedGameLists(): Promise<GameListType[]> {
  await connectDB();
  const lists = await List.find({ type: 'game' }).sort({ createdAt: -1 }).lean();
  const enriched = await Promise.all(
    lists.map(async (list) => {
      const games = await Game.find({ _id: { $in: list.content } }).lean();
      return { ...list, games: serialize(games) };
    })
  );
  return serialize(enriched.filter((l) => l.games.length > 0)) as unknown as GameListType[];
}
