'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function AdminHeader() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <header className="h-14 shrink-0 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6">
      <p className="text-zinc-400 text-sm">Admin Panel</p>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors"
      >
        <LogOut size={16} aria-hidden="true" />
        Sign out
      </button>
    </header>
  );
}
