'use client';

/* Client Component: needs scroll detection */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Facebook, Youtube, Twitter, Instagram, Film } from 'lucide-react';
import SearchBox from '@/components/features/search/SearchBox';
import { cn } from '@/lib/utils';

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
  { icon: Twitter, label: 'Twitter / X', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      role="banner"
      style={{ top: 'var(--banner-h, 0px)' }}
      className={cn(
        'fixed left-0 right-0 z-50 transition-[top,background-color] duration-200',
        scrolled
          ? 'bg-black border-b border-yellow-400'
          : 'bg-gradient-to-b from-black/60 to-transparent'
      )}
    >
      <div className="flex items-center justify-between px-4 h-14 max-w-screen-2xl mx-auto">
        {/* Left: mobile menu + logo + search */}
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="Filmmart home" className="flex items-center gap-1.5 group">
            <div className="bg-yellow-400 rounded p-0.5">
              <Film size={18} className="text-black" aria-hidden="true" />
            </div>
            <span className="text-white font-bold text-base tracking-tight group-hover:text-yellow-400 transition-colors">
              Filmmart
            </span>
          </Link>

          <SearchBox />
        </div>

        {/* Right: social icons */}
        <nav aria-label="Social links">
          <ul className="flex items-center gap-3" role="list">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <Icon size={18} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
