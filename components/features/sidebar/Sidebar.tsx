'use client';

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import {
  Home,
  Film,
  Tv,
  Zap,
  Laugh,
  Swords,
  Ghost,
  Rocket,
  Heart,
  BookOpen,
  Sparkles,
  Globe,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Movies', href: '/movies', icon: Film },
  { label: 'Series', href: '/series', icon: Tv },
];

const GENRES = [
  { label: 'Action', value: 'action', icon: Swords },
  { label: 'Comedy', value: 'comedy', icon: Laugh },
  { label: 'Drama', value: 'drama', icon: Sparkles },
  { label: 'Horror', value: 'horror', icon: Ghost },
  { label: 'Sci-Fi', value: 'sci-fi', icon: Rocket },
  { label: 'Romance', value: 'romance', icon: Heart },
  { label: 'Thriller', value: 'thriller', icon: Zap },
  { label: 'Documentary', value: 'documentary', icon: BookOpen },
  { label: 'Animation', value: 'animation', icon: Flame },
  { label: 'Fantasy', value: 'fantasy', icon: Globe },
];

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentGenre = searchParams.get('genre') ?? '';

  const genreBase = pathname.startsWith('/movies')
    ? '/movies'
    : pathname.startsWith('/series')
      ? '/series'
      : '/';

  return (
    <aside
      aria-label="Site navigation"
      className="hidden lg:flex flex-col w-52 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto bg-zinc-900 border-r border-zinc-800 py-4"
    >
      {/* Browse */}
      <div className="px-3 mb-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-400 px-3 mb-1">
          Browse
        </p>
        <nav>
          {NAV_LINKS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href && !currentGenre;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-yellow-400/15 text-yellow-400 font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-zinc-800 mx-3 my-2" />

      {/* Genres */}
      <div className="px-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-400 px-3 mb-1">
          Categories
        </p>
        <nav>
          {GENRES.map(({ label, value, icon: Icon }) => {
            const isActive = currentGenre === value;
            return (
              <Link
                key={value}
                href={`${genreBase}?genre=${value}`}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-yellow-400/15 text-yellow-400 font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
