'use client';

/* Client Component: manages scroll position of the carousel */

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import type { MovieList as MovieListType } from '@/types';

interface Props {
  list: MovieListType;
}

export default function MovieList({ list }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -700 : 700, behavior: 'smooth' });
  };

  const onScroll = () => {
    if (scrollRef.current) setShowLeft(scrollRef.current.scrollLeft > 10);
  };

  if (!list.movies?.length) return null;

  return (
    <section aria-label={list.title} className="w-full mt-2">
      <h2 className="text-yellow-400 text-lg font-semibold italic ml-12 mb-2">{list.title}</h2>

      <div className="relative">
        {showLeft && (
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="absolute left-0 top-0 bottom-0 z-10 w-12 flex items-center justify-center bg-black/50 hover:bg-black/80 transition-colors"
          >
            <ChevronLeft className="text-white" size={28} aria-hidden="true" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="flex gap-1.5 overflow-x-auto scroll-smooth pl-12 pr-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="list"
        >
          {list.movies.map((movie) => (
            <div key={movie._id} role="listitem" className="relative">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="absolute right-0 top-0 bottom-0 z-10 w-12 flex items-center justify-center bg-black/50 hover:bg-black/80 transition-colors"
        >
          <ChevronRight className="text-white" size={28} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
