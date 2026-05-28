export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Star, Film, Tv } from 'lucide-react';
import { searchMovies } from '@/lib/data/search';
import { resolveQualityBadge } from '@/lib/utils/quality';
import type { Movie } from '@/types';

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

const TYPE_TABS = [
  { label: 'All', value: '' },
  { label: 'Movies', value: 'movie' },
  { label: 'Series', value: 'series' },
];

function ResultCard({ movie }: { movie: Movie }) {
  const { text: qualityText, cls: qualityCls } = resolveQualityBadge(movie);

  return (
    <Link
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

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

        {/* Quality badge */}
        <span className={`absolute top-1.5 left-1.5 ${qualityCls} text-white text-[9px] font-bold px-1.5 py-[3px] rounded uppercase leading-none`}>
          {qualityText}
        </span>

        {/* Rating */}
        {movie.rating != null && (
          <span className="absolute top-1.5 right-1.5 flex items-center gap-[3px] bg-yellow-400 text-black text-[10px] font-black px-1.5 py-[3px] rounded leading-none">
            <Star size={8} fill="currentColor" aria-hidden="true" />
            {movie.rating.toFixed(1)}
          </span>
        )}

        {/* Type indicator */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-2 py-1 flex items-center gap-1.5">
          {movie.isSeries ? (
            <Tv size={10} className="text-zinc-300 shrink-0" aria-hidden="true" />
          ) : (
            <Film size={10} className="text-zinc-300 shrink-0" aria-hidden="true" />
          )}
          <span className="text-zinc-300 text-[9px] font-medium truncate">
            {movie.isSeries ? 'Series' : 'Movie'}
            {movie.year ? ` · ${movie.year}` : ''}
          </span>
        </div>
      </div>

      <div className="mt-2 px-0.5">
        <p className="text-white text-xs font-semibold leading-snug line-clamp-2">{movie.title}</p>
        {movie.genre && (
          <p className="text-zinc-500 text-[10px] mt-0.5 capitalize">{movie.genre}</p>
        )}
      </div>
    </Link>
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = '', type = '' } = await searchParams;
  const query = q.trim();

  const movies = query ? await searchMovies(query, { limit: 60, type: type || undefined }) : [];

  return (
    <div className="min-h-screen bg-black px-4 lg:px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
          <Search size={14} aria-hidden="true" />
          {query ? (
            <span>
              Results for <span className="text-white font-semibold">&ldquo;{query}&rdquo;</span>
              <span className="ml-2 text-zinc-600">({movies.length} found)</span>
            </span>
          ) : (
            <span>Enter a search term above</span>
          )}
        </div>

        {/* Type filter tabs */}
        {query && (
          <div className="flex items-center gap-2 mt-3" role="group" aria-label="Filter results by type">
            {TYPE_TABS.map(({ label, value }) => {
              const isActive = (type ?? '') === value;
              const href = value
                ? `/search?q=${encodeURIComponent(query)}&type=${value}`
                : `/search?q=${encodeURIComponent(query)}`;
              return (
                <Link
                  key={label}
                  href={href}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                    isActive
                      ? 'bg-yellow-400 text-black border-yellow-400'
                      : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400 hover:text-white'
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

      {/* Results grid */}
      {!query ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-600">
          <Search size={48} className="mb-3 opacity-30" aria-hidden="true" />
          <p className="text-sm">Use the search bar above to find movies and series.</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-600">
          <Search size={48} className="mb-3 opacity-30" aria-hidden="true" />
          <p className="text-base font-medium text-zinc-400 mb-1">No results found</p>
          <p className="text-sm">
            No movies or series match &ldquo;{query}&rdquo;
            {type ? ` in ${type === 'movie' ? 'Movies' : 'Series'}` : ''}.
          </p>
          <Link href={`/search?q=${encodeURIComponent(query)}`} className="mt-4 text-yellow-400 text-sm hover:underline">
            Search in all categories
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 lg:gap-4">
          {movies.map((movie) => (
            <ResultCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
