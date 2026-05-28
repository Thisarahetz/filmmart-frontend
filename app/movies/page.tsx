export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { getEnrichedLists } from '@/lib/data/lists';
import MovieList from '@/components/features/movies/MovieList';

export const metadata: Metadata = {
  title: 'Movies',
  description: 'Browse all movies on Filmmart. Filter by genre and find the perfect film.',
  alternates: { canonical: '/movies' },
};

interface Props {
  searchParams: Promise<{ genre?: string }>;
}

export default async function MoviesPage({ searchParams }: Props) {
  const { genre } = await searchParams;
  const lists = await getEnrichedLists({ type: 'movie', genre });

  return (
    <div className="bg-black min-h-screen pt-4 pb-10">
      {lists.length === 0 ? (
        <p className="text-center text-gray-500 py-16">
          No movies found{genre ? ` for genre "${genre}"` : ''}.
        </p>
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
