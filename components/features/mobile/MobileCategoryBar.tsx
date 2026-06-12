'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MOVIE_CATEGORIES } from '@/lib/categories';

const GAME_CATEGORIES = [
  { label: 'Sexual/Adult',           value: 'sexual-adult-content'                      },
  { label: 'Violence/Adult',         value: 'extreme-violence-adult-content'             },
  { label: 'Psych Horror',           value: 'psychological-horror'                       },
  { label: 'Extreme Violence',       value: 'extreme-violence'                           },
  { label: 'Violence/Horror',        value: 'extreme-violence-horror'                    },
  { label: 'Dark/Adult',             value: 'dark-adult-content'                         },
  { label: 'Sexual/Violence',        value: 'sexual-adult-content-extreme-violence'       },
  { label: 'Violence/Hate',          value: 'extreme-violence-hate-speech'               },
  { label: 'Sexual/Horror',          value: 'sexual-adult-content-horror'                },
  { label: 'Manipulation',           value: 'manipulation-predatory-behavior'            },
  { label: 'Inappropriate',          value: 'extreme-violence-inappropriate-content'     },
];

interface Props {
  type: 'movies' | 'series' | 'games';
  basePath: string;
}

const CHIP_BASE =
  'shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap';
const CHIP_ACTIVE = 'bg-yellow-400 text-black border-yellow-400';
const CHIP_IDLE = 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-white';

export default function MobileCategoryBar({ type, basePath }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const paramKey = type === 'games' ? 'category' : 'genre';

  // "All" is active on the base listing page with no category selected.
  const allActive = pathname === basePath && !searchParams.get(paramKey);

  // Movies use SEO-friendly /genre/{slug} pages; series & games filter in place
  // (so series stay series-only and games stay games).
  const chips =
    type === 'movies'
      ? MOVIE_CATEGORIES.map((c) => ({
          key: c.slug,
          label: c.label,
          href: `/genre/${c.slug}`,
          active: pathname === `/genre/${c.slug}`,
        }))
      : type === 'series'
        ? MOVIE_CATEGORIES.map((c) => ({
            key: c.slug,
            label: c.label,
            href: `${basePath}?genre=${c.slug}`,
            active: searchParams.get('genre') === c.slug,
          }))
        : GAME_CATEGORIES.map((c) => ({
            key: c.value,
            label: c.label,
            href: `${basePath}?category=${c.value}`,
            active: searchParams.get('category') === c.value,
          }));

  return (
    <div className="lg:hidden sticky top-14 z-30 bg-zinc-950/95 backdrop-blur border-b border-zinc-800">
      <div className="flex gap-2 overflow-x-auto px-3 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* All chip */}
        <Link href={basePath} className={cn(CHIP_BASE, allActive ? CHIP_ACTIVE : CHIP_IDLE)}>
          All
        </Link>

        {chips.map(({ key, label, href, active }) => (
          <Link key={key} href={href} className={cn(CHIP_BASE, active ? CHIP_ACTIVE : CHIP_IDLE)}>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
