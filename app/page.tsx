export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { getTrendingMovies, getEnrichedLists } from '@/lib/data/lists';
import MovieList from '@/components/features/movies/MovieList';
import TrendingSlider from '@/components/features/slider/TrendingSlider';

export const metadata: Metadata = {
  title: 'Filmmart – Movies & Series',
  description: 'Browse the latest movies and TV series. Find ratings, reviews, and trailers.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Filmmart – Movies & Series',
    description: 'Browse the latest movies and TV series.',
    images: [{ url: 'https://i.ibb.co/kDRSfGg/MTRA-com.png', width: 1200, height: 630 }],
  },
};

interface Props {
  searchParams: Promise<{ type?: string; genre?: string }>;
}

export default async function HomePage({ searchParams }: Props) {
  const { type, genre } = await searchParams;
  const [trendingMovies, lists] = await Promise.all([
    getTrendingMovies(),
    getEnrichedLists({ type, genre }),
  ]);

  return (
    <div className="bg-black min-h-screen">
      <TrendingSlider movies={trendingMovies} title="Trending Now" />
      <div className="pb-10 mt-4">
        <div className="space-y-4">
          {lists.length === 0 ? (
            <p className="text-center text-gray-500 py-16">
              No lists found. Add some from the{' '}
              <a href="/admin" className="text-yellow-400 underline">
                admin panel
              </a>
              .
            </p>
          ) : (
            lists.map((list) => <MovieList key={list._id} list={list} />)
          )}
        </div>
      </div>
    </div>
  );
}
