export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Star, Film, Tv, Gamepad2 } from 'lucide-react';
import { searchMovies, searchGames } from '@/lib/data/search';
import type { Movie, Game } from '@/types';
import AdBanner from '@/components/ads/AdBanner';
import MobileSearchInput from '@/components/features/search/MobileSearchInput';
import TrackedLink from '@/components/features/search/TrackedLink';

interface Props {
  searchParams: Promise<{ q?: string; type?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : 'Search',
    robots: { index: false, follow: false },
  };
}

const PLACEHOLDER = 'https://i.ibb.co/FHShpGv/58-589476-official-venom-movie-poster.jpg';

// ── Film result card ──────────────────────────────────────────────────────────
function FilmCard({ movie }: { movie: Movie }) {
  return (
    <TrackedLink
      id={movie._id}
      kind="movie"
      href={`/movies/${movie._id}`}
      className="group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded-lg"
      aria-label={movie.title}
    >
      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900">
        <Image
          src={movie.imgSm || movie.img || PLACEHOLDER}
          alt={`${movie.title} poster`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

        {movie.rating != null && (
          <span className="absolute top-1.5 right-1.5 flex items-center gap-[3px] bg-yellow-400 text-black text-[10px] font-black px-1.5 py-[3px] rounded leading-none">
            <Star size={8} fill="currentColor" aria-hidden="true" />
            {movie.rating.toFixed(1)}
          </span>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-2 py-1 flex items-center gap-1.5">
          {movie.isSeries
            ? <Tv size={10} className="text-zinc-300 shrink-0" aria-hidden="true" />
            : <Film size={10} className="text-zinc-300 shrink-0" aria-hidden="true" />}
          <span className="text-zinc-300 text-[9px] font-medium truncate">
            {movie.isSeries ? 'Series' : 'Movie'}{movie.year ? ` · ${movie.year}` : ''}
          </span>
        </div>
      </div>

      <div className="mt-2 px-0.5">
        <p className="text-white text-xs font-semibold leading-snug line-clamp-2">{movie.title}</p>
      </div>
    </TrackedLink>
  );
}

// ── Game result card ──────────────────────────────────────────────────────────
function GameCard({ game }: { game: Game }) {
  const isRestricted = game.legalStatus?.toLowerCase().includes('restricted');

  return (
    <TrackedLink
      id={game._id}
      kind="game"
      href={`/games/${game._id}`}
      className="group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded-lg"
      aria-label={game.title}
    >
      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900">
        <Image
          src={game.img || PLACEHOLDER}
          alt={`${game.title} cover`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

        {game.legalStatus && (
          <span className={`absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-[3px] rounded uppercase leading-none ${
            isRestricted ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
          }`}>
            {game.legalStatus}
          </span>
        )}

        {game.rating != null && (
          <span className="absolute top-1.5 right-1.5 flex items-center gap-[3px] bg-yellow-400 text-black text-[10px] font-black px-1.5 py-[3px] rounded leading-none">
            <Star size={8} fill="currentColor" aria-hidden="true" />
            {game.rating.toFixed(1)}
          </span>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-2 py-1 flex items-center gap-1.5">
          <Gamepad2 size={10} className="text-zinc-300 shrink-0" aria-hidden="true" />
          <span className="text-zinc-300 text-[9px] font-medium truncate">
            Game{game.category ? ` · ${game.category}` : ''}
          </span>
        </div>
      </div>

      <div className="mt-2 px-0.5">
        <p className="text-white text-xs font-semibold leading-snug line-clamp-2">{game.title}</p>
      </div>
    </TrackedLink>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function SearchPage({ searchParams }: Props) {
  const { q = '', type = '' } = await searchParams;
  const query = q.trim();
  const isGames = type === 'game';

  const [movies, games] = await Promise.all([
    query && !isGames ? searchMovies(query, { limit: 60, type: type || undefined }) : Promise.resolve([]),
    query && isGames  ? searchGames(query,  { limit: 60 })                         : Promise.resolve([]),
  ]);

  const resultCount = isGames ? games.length : movies.length;

  return (
    <div className="min-h-screen bg-black px-4 lg:px-6 py-6">
      {/* Mobile-only search input (navbar SearchBox is hidden on small screens) */}
      <div className="mb-4">
        <MobileSearchInput defaultValue={query} type={type} />
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-zinc-400 text-sm mb-3">
          <Search size={14} aria-hidden="true" />
          {query ? (
            <span>
              Results for <span className="text-white font-semibold">&ldquo;{query}&rdquo;</span>
              <span className="ml-2 text-zinc-600">({resultCount} found)</span>
            </span>
          ) : (
            <span>Enter a search term above</span>
          )}
        </div>

        {/* Movies / Games top tabs */}
        <div className="flex items-center gap-2" role="group" aria-label="Search category">
          {[
            { label: 'Movies', value: '',     icon: Film     },
            { label: 'Games', value: 'game', icon: Gamepad2 },
          ].map(({ label, value, icon: Icon }) => {
            const isActive = type === value || (value === '' && !isGames);
            const href = query
              ? value ? `/search?q=${encodeURIComponent(query)}&type=${value}` : `/search?q=${encodeURIComponent(query)}`
              : value ? `/search?type=${value}` : '/search';
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                  isActive
                    ? 'bg-yellow-400 text-black border-yellow-400'
                    : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400 hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={13} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Movies sub-tabs: All / Movies / Series */}
        {!isGames && query && (
          <div className="flex items-center gap-2 mt-2 ml-1" role="group" aria-label="Filter movies">
            {[
              { label: 'All',    value: ''       },
              { label: 'Movies', value: 'movie'  },
              { label: 'Series', value: 'series' },
            ].map(({ label, value }) => {
              const isActive = type === value;
              const href = value
                ? `/search?q=${encodeURIComponent(query)}&type=${value}`
                : `/search?q=${encodeURIComponent(query)}`;
              return (
                <Link
                  key={label}
                  href={href}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    isActive
                      ? 'bg-zinc-200 text-black border-zinc-200'
                      : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Results */}
      {!query ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-600">
          <Search size={48} className="mb-3 opacity-30" aria-hidden="true" />
          <p className="text-sm">Use the search bar above to find movies and games.</p>
        </div>
      ) : resultCount === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-600">
          <Search size={48} className="mb-3 opacity-30" aria-hidden="true" />
          <p className="text-base font-medium text-zinc-400 mb-1">No results found</p>
          <p className="text-sm">
            No {isGames ? 'games' : 'movies'} match &ldquo;{query}&rdquo;.
          </p>
          <Link href={`/search?q=${encodeURIComponent(query)}`} className="mt-4 text-yellow-400 text-sm hover:underline">
            Search in Movies
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 lg:gap-4">
            {isGames
              ? games.map((game) => <GameCard key={game._id} game={game} />)
              : movies.map((movie) => <FilmCard key={movie._id} movie={movie} />)
            }
          </div>
          {/* Ad below results — hidden on mobile */}
          <AdBanner
            slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SEARCH ?? ''}
            format="horizontal"
            className="mt-8"
          />
        </>
      )}
    </div>
  );
}
