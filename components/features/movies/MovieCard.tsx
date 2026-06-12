'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Play, Search } from 'lucide-react';
import type { Movie } from '@/types';
import { trackView } from '@/lib/utils/trackView';
import { cleanTitle } from '@/lib/utils';

interface Props {
  movie: Movie;
}

const PLACEHOLDER = 'https://i.ibb.co/FHShpGv/58-589476-official-venom-movie-poster.jpg';

export default function MovieCard({ movie }: Props) {
  const [liked, setLiked] = useState(false);
  const thumb = movie.imgSm || movie.img || PLACEHOLDER;
  const ratingVal = movie.rating ?? 0;
  const starsFull = Math.round(ratingVal / 2);

  return (
    <Link
      href={`/movies/${movie._id}`}
      onClick={() => trackView(movie._id)}
      className="group relative block shrink-0 w-[160px] rounded-md overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
      aria-label={`View ${movie.title}`}
    >
      {/* Poster */}
      <div className="relative w-[160px] h-[240px]">
        <Image
          src={thumb}
          alt={`${movie.title} poster`}
          fill
          sizes="160px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Type badge — top left, always visible */}
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${
            movie.isSeries
              ? 'bg-blue-600 text-white'
              : 'bg-yellow-500 text-black'
          }`}>
            {movie.isSeries ? 'Series' : 'Movie'}
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide bg-red-700 text-white">
            18+
          </span>
        </div>

        {/* Action buttons — top right, appear on hover */}
        <div className="absolute top-1.5 right-1.5 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.preventDefault();
              setLiked((l) => !l);
            }}
            aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}
            className={`p-1 rounded-full bg-black/70 transition-colors ${
              liked ? 'text-red-400' : 'text-gray-300 hover:text-red-400'
            }`}
          >
            <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
          </button>
          <span className="p-1 rounded-full bg-black/70 text-white flex items-center justify-center" aria-hidden="true">
            <Play size={14} fill="currentColor" />
          </span>
        </div>

        {/* Hover info — bottom */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          {movie.desc && (
            <p className="text-[10px] text-gray-200 line-clamp-2 leading-snug mb-1.5">{movie.desc}</p>
          )}
          {movie.genre && (
            <span className="inline-block text-[9px] bg-yellow-400/20 text-yellow-300 px-1.5 py-0.5 rounded mb-1.5">
              {movie.genre}
            </span>
          )}
          <div
            role="button"
            aria-label={`Find movies similar to ${movie.title}`}
            className="flex items-center gap-1 text-[9px] text-white bg-yellow-400/20 hover:bg-yellow-400/40 rounded px-1.5 py-0.5 transition-colors w-fit"
            onClick={(e) => e.stopPropagation()}
          >
            <Search size={9} aria-hidden="true" />
            Find Similar
          </div>
        </div>
      </div>

      {/* Below poster — always visible */}
      <div className="bg-zinc-900 pt-1.5 pb-2 px-1.5">
        <p className="text-white text-xs font-medium line-clamp-2 leading-tight mb-1">
          {cleanTitle(movie.title)}
        </p>

        {/* Genre + Year row */}
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

        {/* Star rating */}
        {ratingVal > 0 && (
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
            <span className="text-[9px] text-zinc-400 ml-0.5">{ratingVal.toFixed(1)}</span>
          </div>
        )}

        {/* Tags — first tag only */}
        {movie.tags?.length > 0 && (
          <p className="text-[9px] text-zinc-500 mt-0.5 truncate">
            #{movie.tags[0]}
          </p>
        )}
      </div>
    </Link>
  );
}
