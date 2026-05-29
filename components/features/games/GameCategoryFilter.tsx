'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const GAME_CATEGORIES = [
  'Sexual/Adult Content',
  'Extreme Violence/Adult Content',
  'Psychological Horror',
  'Extreme Violence',
  'Extreme Violence/Horror',
  'Dark/Adult Content',
  'Sexual/Adult Content/Extreme Violence',
  'Extreme Violence/Hate Speech',
  'Sexual/Adult Content/Horror',
  'Manipulation/Predatory Behavior',
  'Extreme Violence/Inappropriate Content',
];

function slugify(cat: string): string {
  return cat
    .toLowerCase()
    .replace(/[\s\/]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function GameCategoryFilter() {
  const searchParams = useSearchParams();
  const currentSlug = searchParams.get('category') ?? '';

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-4 lg:px-6">
      <Link
        href="/games"
        className={cn(
          'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
          !currentSlug
            ? 'bg-yellow-400 text-black'
            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
        )}
      >
        All
      </Link>
      {GAME_CATEGORIES.map((cat) => {
        const slug = slugify(cat);
        const isActive = currentSlug === slug;
        return (
          <Link
            key={slug}
            href={`/games?category=${slug}`}
            className={cn(
              'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              isActive
                ? 'bg-yellow-400 text-black'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
            )}
          >
            {cat}
          </Link>
        );
      })}
    </div>
  );
}
