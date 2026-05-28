'use client';

/* Client Component: needs liked state for heart toggle */

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, StarOff, Heart, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Movie } from '@/types';

interface Props {
  movie: Movie;
}

const PLACEHOLDER = 'https://i.ibb.co/FHShpGv/58-589476-official-venom-movie-poster.jpg';

export default function MovieCard({ movie }: Props) {
  const [liked, setLiked] = useState(false);
  const thumb = movie.imgSm || movie.img || PLACEHOLDER;

  return (
    <Link
      href={`/movies/${movie._id}`}
      className="group relative block shrink-0 w-[160px] rounded-md overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
      aria-label={`View ${movie.title}`}
    >
      {/* Poster — fixed 2:3 ratio, no inline style on Image */}
      <div className="relative w-[160px] h-[240px]">
        <Image
          src={thumb}
          alt={`${movie.title} poster`}
          fill
          sizes="160px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Gradient overlay — fades in on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Info — slides up from bottom on hover */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex items-center gap-0.5 text-yellow-400 mb-1">
            {[...Array(4)].map((_, i) => (
              <Star key={i} size={11} fill="currentColor" aria-hidden="true" />
            ))}
            <StarOff size={11} aria-hidden="true" />
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-gray-300 font-semibold mb-1.5">
            {movie.year && <span>{movie.year}</span>}
            {movie.limit && (
              <span className="border border-gray-500 px-0.5 rounded leading-tight">
                +{movie.limit}
              </span>
            )}
          </div>

          {movie.desc && (
            <p className="text-[10px] text-gray-200 line-clamp-2 leading-snug">{movie.desc}</p>
          )}

          {movie.genre && (
            <Badge className="mt-1.5 text-[9px] h-4 px-1">{movie.genre}</Badge>
          )}
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
      </div>

      {/* Title + type label below poster */}
      <div className="pt-1.5 pb-1 px-0.5">
        <p className="text-white text-xs font-medium truncate leading-tight">{movie.title}</p>
        {movie.isSeries && (
          <span className="text-[10px] text-gray-400">Series</span>
        )}
      </div>
    </Link>
  );
}
