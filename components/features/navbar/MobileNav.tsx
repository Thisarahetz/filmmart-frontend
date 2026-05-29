'use client';

import { useState } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Menu, X, Home, Film, Tv, Sparkles, Mail, Gamepad2,
  Swords, Laugh, Ghost, Rocket, Heart, Zap, BookOpen, Flame, Globe,
} from 'lucide-react';

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/movies', label: 'Movies', icon: Film },
  { href: '/series', label: 'Series', icon: Tv },
  { href: '/games', label: 'Games', icon: Gamepad2 },
  { href: '/register', label: 'New & Popular', icon: Sparkles },
  { href: '/#contact', label: 'Contact Us', icon: Mail },
];

const genres = [
  { label: 'Action', value: 'action', icon: Swords },
  { label: 'Comedy', value: 'comedy', icon: Laugh },
  { label: 'Horror', value: 'horror', icon: Ghost },
  { label: 'Sci-Fi', value: 'sci-fi', icon: Rocket },
  { label: 'Romance', value: 'romance', icon: Heart },
  { label: 'Thriller', value: 'thriller', icon: Zap },
  { label: 'Documentary', value: 'documentary', icon: BookOpen },
  { label: 'Animation', value: 'animation', icon: Flame },
  { label: 'Fantasy', value: 'fantasy', icon: Globe },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          aria-label="Open navigation menu"
          className="flex items-center justify-center text-white"
        >
          <Menu size={22} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-0 top-0 z-50 h-full w-64 bg-zinc-950 border-r border-white/10 p-6 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Navigation Menu</Dialog.Title>
          <Dialog.Close asChild>
            <button
              aria-label="Close menu"
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </Dialog.Close>

          <nav>
            <ul className="mt-8 space-y-1" role="list">
              {links.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Icon size={18} aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-400 px-3 mt-6 mb-1">
              Categories
            </p>
            <ul className="space-y-1" role="list">
              {genres.map(({ label, value, icon: Icon }) => (
                <li key={value}>
                  <Link
                    href={`/?genre=${value}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Icon size={18} aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
