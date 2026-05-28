'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import type { Movie } from '@/types';

interface Props {
  movies: Movie[];
  totalLists: number;
  totalUsers: number;
}

export default function MoviesTable({ movies, totalLists, totalUsers }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    desc: '',
    img: '',
    imgSm: '',
    trailer: '',
    year: '',
    genre: '',
    isSeries: false,
  });
  const [error, setError] = useState('');

  const handleDelete = (id: string) => {
    if (!confirm('Delete this movie?')) return;
    startTransition(async () => {
      const res = await fetch(`/api/movies/${id}`, { method: 'DELETE' });
      if (res.ok) router.refresh();
      else setError('Failed to delete movie');
    });
  };

  const handleCreate = () => {
    startTransition(async () => {
      setError('');
      const res = await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, limit: 18 }),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ title: '', desc: '', img: '', imgSm: '', trailer: '', year: '', genre: '', isSeries: false });
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to create movie');
      }
    });
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Movies', value: movies.length },
          { label: 'Lists', value: totalLists },
          { label: 'Users', value: totalUsers },
        ].map(({ label, value }) => (
          <div key={label} className="bg-zinc-900 rounded-lg p-4 border border-white/10">
            <p className="text-gray-400 text-sm">{label}</p>
            <p className="text-white text-3xl font-bold mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Movies</h2>
        <Button onClick={() => setShowForm((v) => !v)} size="sm" className="gap-2">
          <Plus size={16} aria-hidden="true" />
          Add Movie
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <form
          onSubmit={(e) => { e.preventDefault(); handleCreate(); }}
          className="bg-zinc-900 rounded-lg border border-white/10 p-4 mb-6 grid grid-cols-2 gap-3"
        >
          <h3 className="col-span-2 text-white font-medium">New Movie</h3>

          <div className="space-y-1">
            <Label htmlFor="m-title">Title *</Label>
            <Input id="m-title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="m-year">Year</Label>
            <Input id="m-year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="m-genre">Genre</Label>
            <Input id="m-genre" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="m-img">Poster URL</Label>
            <Input id="m-img" type="url" value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="m-imgSm">Thumbnail URL</Label>
            <Input id="m-imgSm" type="url" value={form.imgSm} onChange={(e) => setForm({ ...form, imgSm: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="m-trailer">Trailer URL</Label>
            <Input id="m-trailer" value={form.trailer} onChange={(e) => setForm({ ...form, trailer: e.target.value })} />
          </div>
          <div className="col-span-2 space-y-1">
            <Label htmlFor="m-desc">Description</Label>
            <textarea
              id="m-desc"
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              rows={3}
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            />
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <input
              id="m-isSeries"
              type="checkbox"
              checked={form.isSeries}
              onChange={(e) => setForm({ ...form, isSeries: e.target.checked })}
              className="accent-yellow-400"
            />
            <Label htmlFor="m-isSeries">Is a TV series</Label>
          </div>

          {error && <p className="col-span-2 text-red-400 text-sm">{error}</p>}

          <div className="col-span-2 flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>{isPending ? 'Saving…' : 'Save'}</Button>
          </div>
        </form>
      )}

      {/* Table */}
      {movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <Film size={48} className="mb-3 opacity-40" aria-hidden="true" />
          <p>No movies yet. Add one above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-gray-400">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Genre</th>
                <th className="px-4 py-3 font-medium">Year</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium sr-only">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie._id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-white font-medium">{movie.title}</td>
                  <td className="px-4 py-3 text-gray-400">{movie.genre ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-400">{movie.year ?? '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={movie.isSeries ? 'default' : 'outline'}>
                      {movie.isSeries ? 'Series' : 'Movie'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(movie._id)}
                      aria-label={`Delete ${movie.title}`}
                      disabled={isPending}
                      className="text-gray-500 hover:text-red-400 transition-colors disabled:opacity-40"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
