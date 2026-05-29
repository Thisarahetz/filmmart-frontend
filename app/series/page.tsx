export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { getEnrichedLists, getCategoryMovies } from '@/lib/data/lists';
import MovieList from '@/components/features/movies/MovieList';
import CategoryGrid from '@/components/features/movies/CategoryGrid';

export const metadata: Metadata = {
  title: 'Series',
  description: 'Browse all TV series on Filmmart. Filter by genre and find your next binge.',
  alternates: { canonical: '/series' },
};

interface Props {
  searchParams: Promise<{ genre?: string; page?: string }>;
}

function toLabel(slug: string) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export default async function SeriesPage({ searchParams }: Props) {
  const { genre, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

  if (genre) {
    const data = await getCategoryMovies(genre, page, 'series');
    return (
      <div className="bg-black min-h-screen">
        <CategoryGrid
          data={data}
          genre={genre}
          type="series"
          label={toLabel(genre)}
          basePath="/series"
        />
      </div>
    );
  }

  const lists = await getEnrichedLists({ type: 'series' });

  return (
    <div className="bg-black min-h-screen pt-4 pb-10">
      {lists.length === 0 ? (
        <p className="text-center text-gray-500 py-16">No series found.</p>
      ) : (
        <div className="space-y-2">
          {lists.map((list) => (
            <MovieList key={list._id} list={list} />
          ))}
        </div>
      )}
    </div>
  );
}
