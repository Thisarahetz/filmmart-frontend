export const dynamic = 'force-dynamic';

import { Fragment } from 'react';
import type { Metadata } from 'next';
import { getTrendingMovies, getEnrichedLists, getCategoryMovies } from '@/lib/data/lists';
import { getTrendingGames } from '@/lib/data/games';
import MovieList from '@/components/features/movies/MovieList';
import CategoryGrid from '@/components/features/movies/CategoryGrid';
import TrendingSlider from '@/components/features/slider/TrendingSlider';
import GameTrendingSlider from '@/components/features/games/GameTrendingSlider';
import AdBanner from '@/components/ads/AdBanner';

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
  searchParams: Promise<{ type?: string; genre?: string; page?: string }>;
}

function toLabel(slug: string) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export default async function HomePage({ searchParams }: Props) {
  const { type, genre, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

  // ── Category view: grid + pagination ──────────────────────────────────────
  if (genre) {
    const data = await getCategoryMovies(genre, page, type);
    return (
      <div className="bg-black min-h-screen">
        <CategoryGrid
          data={data}
          genre={genre}
          type={type}
          label={toLabel(genre)}
        />
      </div>
    );
  }

  // ── Home view: trending sliders (movies / series / games) + list carousels ──
  const [trendingMovies, trendingSeries, trendingGames, lists] = await Promise.all([
    getTrendingMovies(20, false),
    getTrendingMovies(20, true),
    getTrendingGames(20),
    getEnrichedLists({ type }),
  ]);

  return (
    <div className="bg-black min-h-screen">
      <TrendingSlider movies={trendingMovies} title="Trending Movies" />
      <TrendingSlider movies={trendingSeries} title="Trending Series" />
      <GameTrendingSlider games={trendingGames} title="Trending Games" />

      <AdBanner
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER ?? ''}
        format="horizontal"
        className="mx-4 lg:mx-6 my-4"
      />

      <div className="pb-10">
        <div className="space-y-4">
          {lists.length === 0 ? (
            <p className="text-center text-gray-500 py-16">
              No lists found. Add some from the{' '}
              <a href="/admin" className="text-yellow-400 underline">admin panel</a>.
            </p>
          ) : (
            lists.map((list, i) => (
              <Fragment key={list._id}>
                <MovieList list={list} />
                {(i + 1) % 3 === 0 && i < lists.length - 1 && (
                  <AdBanner
                    slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_FEED ?? ''}
                    format="rectangle"
                    className="mx-4 lg:mx-6"
                  />
                )}
              </Fragment>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
