'use client';

import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface Props {
  defaultValue?: string;
  type?: string;
}

export default function MobileSearchInput({ defaultValue = '', type = '' }: Props) {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value.trim();
    if (!q) return;
    const url = type ? `/search?q=${encodeURIComponent(q)}&type=${type}` : `/search?q=${encodeURIComponent(q)}`;
    router.push(url);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg h-10 px-3 gap-2 sm:hidden"
    >
      <Search size={15} className="text-zinc-400 shrink-0" aria-hidden="true" />
      <input
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Search…"
        autoComplete="off"
        className="flex-1 bg-transparent text-white placeholder:text-zinc-500 text-sm outline-none"
      />
      <button type="submit" className="text-yellow-400 text-xs font-bold shrink-0">Go</button>
    </form>
  );
}
