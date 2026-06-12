'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Movie } from '@/types';
import type { CategoryPage } from '@/lib/data/lists';
import { trackView } from '@/lib/utils/trackView';
import { cleanTitle } from '@/lib/utils';

const PLACEHOLDER = 'https://i.ibb.co/FHShpGv/58-589476-official-venom-movie-poster.jpg';

function MovieGridCard({ movie }: { movie: Movie }) {
  const thumb = movie.imgSm || movie.img || PLACEHOLDER;
  const starsFull = movie.rating ? Math.round(movie.rating / 2) : 0;

  return (
    <Link
      href={`/movies/${movie._id}`}
      onClick={() => trackView(movie._id)}
      className="group block bg-zinc-900 rounded-lg overflow-hidden border border-white/5 hover:border-yellow-400/40 transition-colors"
    >
      <div className="relative w-full aspect-[2/3]">
        <Image
          src={thumb}
          alt={`${movie.title} poster`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover group-hover:opacity-80 transition-opacity"
        />
        {/* Type badge */}
        <span className={`absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${
          movie.isSeries ? 'bg-blue-600 text-white' : 'bg-yellow-500 text-black'
        }`}>
          {movie.isSeries ? 'Series' : 'Movie'}
        </span>
      </div>

      <div className="p-2">
        <p className="text-white text-xs font-medium line-clamp-2 leading-tight mb-1">
          {cleanTitle(movie.title)}
        </p>
        <div className="flex items-center gap-1.5 flex-wrap mb-1">
          {movie.genre && (
            <span className="text-[9px] bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded truncate max-w-[90px]">
              {movie.genre}
            </span>
          )}
          {movie.year && (
            <span className="text-[9px] text-zinc-400">{movie.year}</span>
          )}
        </div>
        {movie.rating && movie.rating > 0 && (
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg
                key={i}
                className={`w-2.5 h-2.5 ${i <= starsFull ? 'text-yellow-400' : 'text-zinc-600'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-[9px] text-zinc-400 ml-0.5">{movie.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

interface PaginationProps {
  genre: string;
  type?: string;
  page: number;
  totalPages: number;
  basePath?: string;
}

function Pagination({ genre, type, page, totalPages, basePath = '/' }: PaginationProps) {
  if (totalPages <= 1) return null;

  const base = `${basePath}?genre=${genre}${type ? `&type=${type}` : ''}`;

  // Build visible page numbers: always show first, last, current ±2
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
      {/* Prev */}
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

      {/* Page numbers */}
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

      {/* Next */}
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

interface Props {
  data: CategoryPage;
  genre: string;
  type?: string;
  label: string;
  basePath?: string;
  /** Optional editorial intro paragraph shown under the heading. */
  intro?: string;
}

export default function CategoryGrid({ data, genre, type, label, basePath = '/', intro }: Props) {
  const { movies, total, page, totalPages } = data;

  return (
    <div className="px-4 lg:px-6 py-6">
      {/* Header */}
      <div className={`flex items-baseline gap-3 ${intro ? 'mb-3' : 'mb-6'}`}>
        <h1 className="text-yellow-400 text-2xl font-bold">{label}</h1>
        <span className="text-zinc-500 text-sm">{total} movies</span>
      </div>

      {intro && (
        <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl mb-6">{intro}</p>
      )}

      {movies.length === 0 ? (
        <p className="text-zinc-500 py-16 text-center">No movies found in this category.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {movies.map((movie) => (
              <MovieGridCard key={movie._id} movie={movie} />
            ))}
          </div>

          <Pagination genre={genre} type={type} page={page} totalPages={totalPages} basePath={basePath} />
        </>
      )}
    </div>
  );
}
