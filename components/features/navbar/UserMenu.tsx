'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, ShieldCheck, User } from 'lucide-react';

interface Me {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export default function UserMenu() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null | undefined>(undefined); // undefined = loading
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => setMe(data))
      .catch(() => setMe(null));
  }, []);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setMe(null);
    setOpen(false);
    router.push('/');
    router.refresh();
  }

  // Still loading — render nothing to avoid layout shift
  if (me === undefined) return <div className="w-8 h-8" />;

  // Not logged in
  if (!me) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors px-3 py-1.5 rounded-md border border-white/20 hover:border-white/40"
      >
        <User size={15} aria-hidden="true" />
        Sign in
      </Link>
    );
  }

  const initial = me.username.charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      {/* Avatar button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="User menu"
        aria-expanded={open}
        className="w-8 h-8 rounded-full bg-yellow-400 text-black font-bold text-sm flex items-center justify-center hover:bg-yellow-300 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black"
      >
        {initial}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl py-1 z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-zinc-800">
            <p className="text-white text-sm font-semibold truncate">{me.username}</p>
            <p className="text-zinc-500 text-xs truncate mt-0.5">{me.email}</p>
          </div>

          <div className="py-1">
            {me.isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <ShieldCheck size={15} className="text-yellow-400" aria-hidden="true" />
                Admin Panel
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <LogOut size={15} className="text-red-400" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
