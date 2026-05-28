'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TrendingCard from './TrendingCard';
import type { Movie } from '@/types';

interface Props {
  movies: Movie[];
  title?: string;
}

export default function TrendingSlider({ movies, title = 'Trending Now' }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);

  function scroll(dir: 'left' | 'right') {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -640 : 640, behavior: 'smooth' });
  }

  function onScroll() {
    if (scrollRef.current) setShowLeft(scrollRef.current.scrollLeft > 10);
  }

  if (!movies.length) return null;

  return (
    <section className="bg-[#111] pt-6 pb-4 border-b border-zinc-800" aria-label={title}>
      <h2 className="text-white text-xl font-bold mb-3 px-4 lg:px-6">{title}</h2>

      <div className="relative">
        {showLeft && (
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="absolute left-0 top-0 bottom-7 z-10 w-10 flex items-center justify-center bg-gradient-to-r from-black/90 to-transparent hover:from-zinc-900/90 transition-colors"
          >
            <ChevronLeft size={30} className="text-white drop-shadow" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex gap-2.5 overflow-x-auto px-4 lg:px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="list"
        >
          {movies.map((movie, i) => (
            <div key={movie._id} role="listitem" className="shrink-0">
              <TrendingCard movie={movie} rank={i + 1} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="absolute right-0 top-0 bottom-7 z-10 w-10 flex items-center justify-center bg-gradient-to-l from-black/90 to-transparent hover:from-zinc-900/90 transition-colors"
        >
          <ChevronRight size={30} className="text-white drop-shadow" />
        </button>
      </div>
    </section>
  );
}
