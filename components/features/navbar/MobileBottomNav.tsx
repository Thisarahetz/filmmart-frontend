'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Film, Tv, Gamepad2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/',        label: 'Home',   icon: Home     },
  { href: '/movies',  label: 'Movies', icon: Film     },
  { href: '/series',  label: 'Series', icon: Tv       },
  { href: '/games',   label: 'Games',  icon: Gamepad2 },
  { href: '/search',  label: 'Search', icon: Search   },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden bg-zinc-900 border-t border-zinc-800"
    >
      {NAV.map(({ href, label, icon: Icon }) => {
        const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors',
              isActive ? 'text-yellow-400' : 'text-zinc-500 hover:text-white'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon size={20} aria-hidden="true" strokeWidth={isActive ? 2.5 : 1.75} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
