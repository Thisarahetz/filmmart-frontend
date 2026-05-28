'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Film, List, Users, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/movies', label: 'Movies', icon: Film, exact: false },
  { href: '/admin/lists', label: 'Lists', icon: List, exact: false },
  { href: '/admin/users', label: 'Users', icon: Users, exact: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col">
      <div className="h-14 px-5 flex items-center gap-2 border-b border-zinc-800">
        <span className="text-yellow-400 font-black text-base tracking-tight uppercase">Filmmart</span>
        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-800 px-1.5 py-0.5 rounded">Admin</span>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5" aria-label="Admin navigation">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors',
                active
                  ? 'bg-yellow-400/15 text-yellow-400 font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={17} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 py-3 border-t border-zinc-800">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ExternalLink size={17} aria-hidden="true" />
          View Site
        </Link>
      </div>
    </aside>
  );
}
