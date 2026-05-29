'use client';

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import {
  Home, Film, Tv, Gamepad2,
  Flame, Eye, Lock, Skull, Zap,
  Heart, AlertTriangle, Users, Swords,
  Ghost, Star, Baby,
  Drama, Glasses, UserX, Scissors,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Home',   href: '/',        icon: Home },
  { label: 'Movies', href: '/movies',  icon: Film },
  { label: 'Series', href: '/series',  icon: Tv   },
  { label: 'Games',  href: '/games',   icon: Gamepad2 },
];

const CATEGORIES = [
  { label: 'Erotic',                   value: 'erotic',                  icon: Flame       },
  { label: 'Psychological Thriller',   value: 'psychological-thriller',  icon: Zap         },
  { label: 'BDSM',                     value: 'bdsm',                    icon: Lock        },
  { label: 'Fetish',                   value: 'fetish',                  icon: Star        },
  { label: 'Captive',                  value: 'captive',                 icon: UserX       },
  { label: 'Voyeur',                   value: 'voyeur',                  icon: Eye         },
  { label: 'Disturbing',               value: 'disturbing',              icon: AlertTriangle },
  { label: 'Horror',                   value: 'horror',                  icon: Ghost       },
  { label: 'Thriller',                 value: 'thriller',                icon: Scissors    },
  { label: 'Serial Killer',            value: 'serial-killer',           icon: Skull       },
  { label: 'Crime',                    value: 'crime',                   icon: Swords      },
  { label: 'Torture',                  value: 'torture',                 icon: AlertTriangle },
  { label: 'Obsession',                value: 'obsession',               icon: Glasses     },
  { label: 'Infidelity',               value: 'infidelity',              icon: Heart       },
  { label: 'Lesbian',                  value: 'lesbian',                 icon: Users       },
  { label: 'LGBT',                     value: 'lgbt',                    icon: Users       },
  { label: 'Nudity',                   value: 'nudity',                  icon: Drama       },
  { label: 'Exploitation',             value: 'exploitation',            icon: Film        },
  { label: 'Sexual Abuse',             value: 'sexual-abuse',            icon: AlertTriangle },
  { label: 'Revenge',                  value: 'revenge',                 icon: Flame       },
  { label: 'Taboo',                    value: 'taboo',                   icon: Lock        },
  { label: 'Sex Work',                 value: 'sex-work',                icon: Star        },
  { label: 'Coming of Age',            value: 'coming-of-age',           icon: Baby        },
  { label: 'Romance',                  value: 'romance',                 icon: Heart       },
  { label: 'Female Lead',              value: 'female-lead',             icon: Users       },
];

const GAME_CATEGORIES = [
  { label: 'Sexual/Adult Content',                     slug: 'sexual-adult-content',                        icon: Flame         },
  { label: 'Extreme Violence/Adult Content',           slug: 'extreme-violence-adult-content',              icon: Skull         },
  { label: 'Psychological Horror',                     slug: 'psychological-horror',                        icon: Ghost         },
  { label: 'Extreme Violence',                         slug: 'extreme-violence',                            icon: Swords        },
  { label: 'Extreme Violence/Horror',                  slug: 'extreme-violence-horror',                     icon: AlertTriangle },
  { label: 'Dark/Adult Content',                       slug: 'dark-adult-content',                          icon: Lock          },
  { label: 'Sexual/Adult Content/Extreme Violence',    slug: 'sexual-adult-content-extreme-violence',       icon: Zap           },
  { label: 'Extreme Violence/Hate Speech',             slug: 'extreme-violence-hate-speech',                icon: AlertTriangle },
  { label: 'Sexual/Adult Content/Horror',              slug: 'sexual-adult-content-horror',                 icon: Heart         },
  { label: 'Manipulation/Predatory Behavior',          slug: 'manipulation-predatory-behavior',             icon: Eye           },
  { label: 'Extreme Violence/Inappropriate Content',   slug: 'extreme-violence-inappropriate-content',      icon: AlertTriangle },
];

export default function Sidebar() {
  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const currentGenre = searchParams.get('genre') ?? '';

  const genreBase = '/movies';

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
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
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

      {/* Categories — game categories on /games, movie categories everywhere else */}
      <div className="px-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-400 px-3 mb-1">
          Categories
        </p>
        <nav>
          {pathname.startsWith('/games') ? (
            GAME_CATEGORIES.map(({ label, slug, icon: Icon }) => {
              const isActive = searchParams.get('category') === slug;
              return (
                <Link
                  key={slug}
                  href={`/games?category=${slug}`}
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
            })
          ) : (
            CATEGORIES.map(({ label, value, icon: Icon }) => {
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
            })
          )}
        </nav>
      </div>
    </aside>
  );
}
