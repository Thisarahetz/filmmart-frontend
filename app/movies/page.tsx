export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { getEnrichedLists, getCategoryMovies, getTrendingMovies } from '@/lib/data/lists';
import MovieList from '@/components/features/movies/MovieList';
import CategoryGrid from '@/components/features/movies/CategoryGrid';
import TrendingSlider from '@/components/features/slider/TrendingSlider';

export const metadata: Metadata = {
  title: 'Movies',
  description: 'Browse all movies on Filmmart. Filter by genre and find the perfect film.',
  alternates: { canonical: '/movies' },
};

interface Props {
  searchParams: Promise<{ genre?: string; page?: string }>;
}

function toLabel(slug: string) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export default async function MoviesPage({ searchParams }: Props) {
  const { genre, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

  if (genre) {
    const data = await getCategoryMovies(genre, page, 'movie');
    return (
      <div className="bg-black min-h-screen">
        <CategoryGrid
          data={data}
          genre={genre}
          type="movie"
          label={toLabel(genre)}
          basePath="/movies"
        />
      </div>
    );
  }

  const [lists, trending] = await Promise.all([
    getEnrichedLists({ type: 'movie' }),
    getTrendingMovies(),
  ]);

  return (
    <div className="bg-black min-h-screen pb-10">
      <TrendingSlider movies={trending} />
      {lists.length === 0 ? (
        <p className="text-center text-gray-500 py-16">No movies found.</p>
      ) : (
        <div className="space-y-2 pt-4">
          {lists.map((list) => (
            <MovieList key={list._id} list={list} />
          ))}
        </div>
      )}
    </div>
  );
}
