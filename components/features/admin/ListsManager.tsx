'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, List as ListIcon, X, Search, Film, Gamepad2 } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import type { MovieList, Movie, Game } from '@/types';

interface Props {
  lists: MovieList[];
  allMovies: Movie[];
  allGames: Game[];
}

interface ListFormData {
  title: string;
  type: string;
  genre: string;
  content: string[];
}

const EMPTY: ListFormData = { title: '', type: '', genre: '', content: [] };

export default function ListsManager({ lists: initial, allMovies, allGames }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [lists, setLists] = useState(initial);
  const [activeTab, setActiveTab] = useState<'movies' | 'games'>('movies');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ListFormData>(EMPTY);
  const [itemSearch, setItemSearch] = useState('');
  const [error, setError] = useState('');

  const movieLists = lists.filter((l) => l.type !== 'game');
  const gameLists  = lists.filter((l) => l.type === 'game');
  const visibleLists = activeTab === 'movies' ? movieLists : gameLists;

  function toggleItem(id: string) {
    setForm((f) => ({
      ...f,
      content: f.content.includes(id)
        ? f.content.filter((c) => c !== id)
        : [...f.content, id],
    }));
  }

  function openCreate() {
    setForm(activeTab === 'games' ? { ...EMPTY, type: 'game' } : EMPTY);
    setItemSearch('');
    setError('');
    setOpen(true);
  }

  function handleCreate() {
    setError('');
    startTransition(async () => {
      const res = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          type: form.type || undefined,
          genre: form.genre || undefined,
          content: form.content,
        }),
      });
      if (res.ok) {
        setOpen(false);
        setForm(EMPTY);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to create list');
      }
    });
  }

  function handleDelete(list: MovieList) {
    if (!confirm(`Delete list "${list.title}"?`)) return;
    startTransition(async () => {
      const res = await fetch(`/api/lists/${list._id}`, { method: 'DELETE' });
      if (res.ok) {
        setLists((prev) => prev.filter((l) => l._id !== list._id));
      }
    });
  }

  const filteredMovies = allMovies.filter((m) =>
    m.title.toLowerCase().includes(itemSearch.toLowerCase())
  );
  const filteredGames = allGames.filter((g) =>
    g.title.toLowerCase().includes(itemSearch.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">Lists</h1>
          <p className="text-zinc-500 text-sm mt-0.5">{lists.length} total</p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-2">
          <Plus size={16} aria-hidden="true" />
          Create List
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b border-zinc-800">
        <button
          onClick={() => setActiveTab('movies')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
            activeTab === 'movies'
              ? 'border-yellow-400 text-yellow-400'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Film size={15} aria-hidden="true" />
          Movie Lists
          <span className="ml-1 text-xs bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded-full">
            {movieLists.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('games')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
            activeTab === 'games'
              ? 'border-yellow-400 text-yellow-400'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Gamepad2 size={15} aria-hidden="true" />
          Game Lists
          <span className="ml-1 text-xs bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded-full">
            {gameLists.length}
          </span>
        </button>
      </div>

      {/* Table */}
      {visibleLists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
          <ListIcon size={48} className="mb-3 opacity-40" aria-hidden="true" />
          <p className="text-sm">
            No {activeTab === 'movies' ? 'movie' : 'game'} lists yet. Create one above.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-800/60 border-b border-zinc-700 text-left text-zinc-400">
                <th className="px-4 py-3 font-medium">Title</th>
                {activeTab === 'movies' && (
                  <th className="px-4 py-3 font-medium">Type</th>
                )}
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium sr-only">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {visibleLists.map((list) => (
                <tr key={list._id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{list.title}</td>
                  {activeTab === 'movies' && (
                    <td className="px-4 py-3">
                      {list.type ? (
                        <Badge variant="outline" className="text-[11px] capitalize">{list.type}</Badge>
                      ) : <span className="text-zinc-600">All</span>}
                    </td>
                  )}
                  <td className="px-4 py-3 text-zinc-400">{list.content.length}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(list)}
                      aria-label={`Delete ${list.title}`}
                      disabled={isPending}
                      className="text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-30"
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create modal */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 z-[310] w-full max-w-lg max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-6"
            aria-describedby={undefined}
          >
            <Dialog.Title className="text-white font-bold text-lg mb-5">
              Create {activeTab === 'games' ? 'Game' : 'Movie'} List
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="absolute top-4 right-4 text-zinc-500 hover:text-white" aria-label="Close">
                <X size={20} />
              </button>
            </Dialog.Close>

            <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="l-title">List Title *</Label>
                <Input
                  id="l-title"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Trending Now"
                />
              </div>

              {activeTab === 'movies' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="l-type">Content Type</Label>
                    <select
                      id="l-type"
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="" className="bg-zinc-900">All</option>
                      <option value="movie" className="bg-zinc-900">Movie</option>
                      <option value="series" className="bg-zinc-900">Series</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="l-genre">Genre (optional)</Label>
                    <Input
                      id="l-genre"
                      value={form.genre}
                      onChange={(e) => setForm({ ...form, genre: e.target.value })}
                      placeholder="action, horror…"
                    />
                  </div>
                </div>
              )}

              {/* Item picker */}
              <div className="space-y-1.5">
                <Label>
                  {activeTab === 'games' ? 'Games' : 'Movies'} ({form.content.length} selected)
                </Label>
                <div className="relative mb-1.5">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
                  <input
                    type="search"
                    placeholder={`Filter ${activeTab === 'games' ? 'games' : 'movies'}…`}
                    value={itemSearch}
                    onChange={(e) => setItemSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-md border border-zinc-700 bg-zinc-800 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <div className="h-48 overflow-y-auto rounded-md border border-zinc-700 bg-zinc-800 divide-y divide-zinc-700">
                  {activeTab === 'games'
                    ? filteredGames.map((g) => (
                        <label key={g._id} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-zinc-700/50 transition-colors">
                          <input
                            type="checkbox"
                            checked={form.content.includes(g._id)}
                            onChange={() => toggleItem(g._id)}
                            className="accent-yellow-400 w-4 h-4 shrink-0"
                          />
                          <span className="text-sm text-white truncate">{g.title}</span>
                          {g.category && (
                            <span className="text-xs text-zinc-500 ml-auto shrink-0 truncate max-w-[120px]">{g.category}</span>
                          )}
                        </label>
                      ))
                    : filteredMovies.map((m) => (
                        <label key={m._id} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-zinc-700/50 transition-colors">
                          <input
                            type="checkbox"
                            checked={form.content.includes(m._id)}
                            onChange={() => toggleItem(m._id)}
                            className="accent-yellow-400 w-4 h-4 shrink-0"
                          />
                          <span className="text-sm text-white truncate">{m.title}</span>
                          {m.year && <span className="text-xs text-zinc-500 ml-auto shrink-0">{m.year}</span>}
                        </label>
                      ))
                  }
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <Dialog.Close asChild>
                  <Button type="button" variant="ghost">Cancel</Button>
                </Dialog.Close>
                <Button type="submit" disabled={isPending || !form.title}>
                  {isPending ? 'Creating…' : 'Create List'}
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
