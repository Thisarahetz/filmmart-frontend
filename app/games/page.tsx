export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getGamesByCategory, getTrendingGames } from '@/lib/data/games';
import { getEnrichedGameLists } from '@/lib/data/lists';
import GameList from '@/components/features/games/GameList';
import GameTrendingSlider from '@/components/features/games/GameTrendingSlider';
import MobileCategoryBar from '@/components/features/mobile/MobileCategoryBar';
import type { Game } from '@/types';

export const metadata: Metadata = {
  title: 'Games',
  description: 'Browse restricted and adult games on Filmmart. Filter by category.',
  alternates: { canonical: '/games' },
};

interface Props {
  searchParams: Promise<{ category?: string; page?: string }>;
}

const GAME_CATEGORIES_LIST = [
  'Sexual/Adult Content',
  'Extreme Violence/Adult Content',
  'Psychological Horror',
  'Extreme Violence',
  'Extreme Violence/Horror',
  'Dark/Adult Content',
  'Sexual/Adult Content/Extreme Violence',
  'Extreme Violence/Hate Speech',
  'Sexual/Adult Content/Horror',
  'Manipulation/Predatory Behavior',
  'Extreme Violence/Inappropriate Content',
];

function categoryToSlug(cat: string): string {
  return cat
    .toLowerCase()
    .replace(/[\s\/]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function slugToCategory(slug: string): string {
  return (
    GAME_CATEGORIES_LIST.find((c) => categoryToSlug(c) === slug) ??
    slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  );
}

const PLACEHOLDER = 'https://i.ibb.co/FHShpGv/58-589476-official-venom-movie-poster.jpg';

function GameGridCard({ game }: { game: Game }) {
  const thumb = game.img || PLACEHOLDER;
  const isRestricted = game.legalStatus?.toLowerCase().includes('restricted');

  return (
    <Link
      href={`/games/${game._id}`}
      className="group block bg-zinc-900 rounded-lg overflow-hidden border border-white/5 hover:border-yellow-400/40 transition-colors"
    >
      <div className="relative w-full aspect-[2/3]">
        <Image
          src={thumb}
          alt={`${game.title} cover`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover group-hover:opacity-80 transition-opacity"
        />
        {game.legalStatus && (
          <span
            className={`absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${
              isRestricted ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
            }`}
          >
            {game.legalStatus}
          </span>
        )}
      </div>
      <div className="p-2">
        <p className="text-white text-xs font-medium line-clamp-2 leading-tight mb-1">
          {game.title}
        </p>
        {game.category && (
          <span className="text-[9px] bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded block truncate">
            {game.category}
          </span>
        )}
      </div>
    </Link>
  );
}

interface PaginationProps {
  category: string;
  page: number;
  totalPages: number;
}

function Pagination({ category, page, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const base = `/games?category=${category}`;

  const pages: (number | 'ellipsis')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 2 && i <= page + 2)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis');
    }
  }

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 pt-8 pb-4 flex-wrap">
      {page > 1 ? (
        <Link
          href={`${base}&page=${page - 1}`}
          className="flex items-center gap-1 px-3 py-2 rounded-md text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <ChevronLeft size={15} />
          Prev
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 rounded-md text-sm text-zinc-600 cursor-not-allowed">
          <ChevronLeft size={15} />
          Prev
        </span>
      )}

      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`e-${i}`} className="px-2 py-2 text-zinc-600 text-sm select-none">…</span>
        ) : p === page ? (
          <span
            key={p}
            aria-current="page"
            className="w-9 h-9 flex items-center justify-center rounded-md text-sm font-bold bg-yellow-400 text-black"
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={`${base}&page=${p}`}
            className="w-9 h-9 flex items-center justify-center rounded-md text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            {p}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link
          href={`${base}&page=${page + 1}`}
          className="flex items-center gap-1 px-3 py-2 rounded-md text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          Next
          <ChevronRight size={15} />
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 rounded-md text-sm text-zinc-600 cursor-not-allowed">
          Next
          <ChevronRight size={15} />
        </span>
      )}
    </nav>
  );
}

export default async function GamesPage({ searchParams }: Props) {
  const { category: categorySlug, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

  if (categorySlug) {
    const matchedCategory = slugToCategory(categorySlug);
    const data = await getGamesByCategory(matchedCategory, page);

    return (
      <div className="bg-black min-h-screen">
        <Suspense fallback={null}>
          <MobileCategoryBar type="games" basePath="/games" />
        </Suspense>
        <div className="px-4 lg:px-6 py-6">
          <div className="flex items-baseline gap-3 mb-6">
            <h1 className="text-yellow-400 text-2xl font-bold">{matchedCategory}</h1>
            <span className="text-zinc-500 text-sm">{data.total} games</span>
          </div>

          {data.games.length === 0 ? (
            <p className="text-zinc-500 py-16 text-center">No games found in this category.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {data.games.map((game) => (
                  <GameGridCard key={game._id} game={game} />
                ))}
              </div>
              <Pagination category={categorySlug} page={page} totalPages={data.totalPages} />
            </>
          )}
        </div>
      </div>
    );
  }

  const [gameLists, trendingGames] = await Promise.all([
    getEnrichedGameLists(),
    getTrendingGames(),
  ]);

  return (
    <div className="bg-black min-h-screen pb-10">
      <Suspense fallback={null}>
        <MobileCategoryBar type="games" basePath="/games" />
      </Suspense>
      <GameTrendingSlider games={trendingGames} />
      {gameLists.length === 0 ? (
        <p className="text-center text-gray-500 py-16">
          No game lists yet.{' '}
          <a href="/admin/lists" className="text-yellow-400 underline">Add some from the admin panel</a>.
        </p>
      ) : (
        <div className="space-y-2 pt-4">
          {gameLists.map((list) => (
            <GameList key={list._id} list={list} />
          ))}
        </div>
      )}
    </div>
  );
}
