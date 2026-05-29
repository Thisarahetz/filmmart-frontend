'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import type { Movie } from '@/types';
import { trackView } from '@/lib/utils/trackView';

interface Props {
  movie: Movie;
  rank: number;
}

const PLACEHOLDER = 'https://i.ibb.co/FHShpGv/58-589476-official-venom-movie-poster.jpg';

export default function TrendingCard({ movie, rank }: Props) {
  return (
    <Link
      href={`/movies/${movie._id}`}
      onClick={() => trackView(movie._id)}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded-md"
      aria-label={`${rank}. ${movie.title}`}
    >
      {/* Poster */}
      <div className="relative w-[155px] h-[232px] rounded-md overflow-hidden">
        <Image
          src={movie.imgSm || movie.img || PLACEHOLDER}
          alt={`${movie.title} poster`}
          fill
          sizes="155px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

        {/* Rating badge — top-right */}
        <span className="absolute top-1.5 right-1.5 flex items-center gap-[3px] bg-yellow-400 text-black text-[10px] font-black px-1.5 py-[3px] rounded leading-none">
          <Star size={8} fill="currentColor" aria-hidden="true" />
          {movie.rating != null ? movie.rating.toFixed(1) : '—'}
        </span>

        {/* Rank number — bottom-left */}
        <span className="absolute bottom-2 left-2 text-white/50 text-[32px] font-black leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] select-none pointer-events-none">
          {rank}
        </span>
      </div>

      {/* Title row below poster */}
      <div className="mt-1.5 w-[155px]">
        <p className="text-white text-[11px] font-semibold truncate leading-tight">
          {movie.title}
          {movie.year ? ` (${movie.year})` : ''}
        </p>
        <p className="text-gray-500 text-[10px] mt-0.5">
          {movie.isSeries ? 'TV Series' : 'Movie'}
        </p>
      </div>
    </Link>
  );
}
