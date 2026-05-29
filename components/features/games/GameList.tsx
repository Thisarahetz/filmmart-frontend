'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GameCard from './GameCard';
import type { Game, GameList as GameListType } from '@/types';

interface ListProps {
  list: GameListType;
}

interface CategoryProps {
  category: string;
  games: Game[];
}

type Props = ListProps | CategoryProps;

function isList(p: Props): p is ListProps {
  return 'list' in p;
}

export default function GameList(props: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);

  const title  = isList(props) ? props.list.title : props.category;
  const games  = isList(props) ? props.list.games  : props.games;

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -700 : 700, behavior: 'smooth' });
  };

  const onScroll = () => {
    if (scrollRef.current) setShowLeft(scrollRef.current.scrollLeft > 10);
  };

  if (!games?.length) return null;

  return (
    <section aria-label={title} className="w-full mt-2">
      <h2 className="text-yellow-400 text-lg font-semibold italic ml-12 mb-2">{title}</h2>

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
          {games.map((game) => (
            <div key={game._id} role="listitem" className="relative">
              <GameCard game={game} />
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
