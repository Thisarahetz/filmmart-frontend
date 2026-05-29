'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import type { Game } from '@/types';

interface Props {
  game: Game;
}

const PLACEHOLDER = 'https://i.ibb.co/FHShpGv/58-589476-official-venom-movie-poster.jpg';

export default function GameCard({ game }: Props) {
  const thumb = game.img || PLACEHOLDER;
  const isRestricted = game.legalStatus?.toLowerCase().includes('restricted');

  return (
    <Link
      href={`/games/${game._id}`}
      className="group relative block shrink-0 w-[160px] rounded-md overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
      aria-label={`View ${game.title}`}
    >
      <div className="relative w-[160px] h-[240px]">
        <Image
          src={thumb}
          alt={`${game.title} cover`}
          fill
          sizes="160px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {game.legalStatus && (
          <div className="absolute top-1.5 left-1.5">
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${
                isRestricted ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
              }`}
            >
              {game.legalStatus}
            </span>
          </div>
        )}

        {game.rating != null && (
          <span className="absolute top-1.5 right-1.5 flex items-center gap-[3px] bg-yellow-400 text-black text-[10px] font-black px-1.5 py-[3px] rounded leading-none">
            <Star size={8} fill="currentColor" aria-hidden="true" />
            {game.rating.toFixed(1)}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 p-2.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          {game.platform && game.platform.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {game.platform.map((p) => (
                <span key={p} className="text-[9px] bg-black/70 text-zinc-300 px-1.5 py-0.5 rounded">
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-zinc-900 pt-1.5 pb-2 px-1.5">
        <p className="text-white text-xs font-medium truncate leading-tight mb-1">
          {game.title}
        </p>

        {game.category && (
          <span className="text-[9px] bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded truncate max-w-full block mb-1">
            {game.category}
          </span>
        )}

        {game.rating != null && (
          <div className="flex items-center gap-0.5 mt-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg
                key={i}
                className={`w-2.5 h-2.5 ${i <= Math.round(game.rating! / 2) ? 'text-yellow-400' : 'text-zinc-600'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-[9px] text-zinc-400 ml-0.5">{game.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
