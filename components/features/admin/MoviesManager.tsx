'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Star, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MovieForm, { EMPTY_FORM, movieToForm, type MovieFormData } from './MovieForm';
import type { Movie } from '@/types';

interface Props {
  movies: Movie[];
}

function buildPayload(form: MovieFormData) {
  return {
    title: form.title,
    desc: form.desc || undefined,
    img: form.img || undefined,
    imgSm: form.imgSm || undefined,
    imgTitle: form.imgTitle || undefined,
    trailer: form.trailer || undefined,
    video: form.video || undefined,
    year: form.year || undefined,
    genre: form.genre || undefined,
    limit: form.limit ? Number(form.limit) : undefined,
    rating: form.rating ? Number(form.rating) : undefined,
    quality: form.quality || undefined,
    isSeries: form.isSeries,
  };
}

export default function MoviesManager({ movies: initial }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [movies, setMovies] = useState(initial);

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<MovieFormData>(EMPTY_FORM);
  const [addError, setAddError] = useState('');

  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Movie | null>(null);
  const [editForm, setEditForm] = useState<MovieFormData>(EMPTY_FORM);
  const [editError, setEditError] = useState('');

  const [search, setSearch] = useState('');

  function openEdit(movie: Movie) {
    setEditTarget(movie);
    setEditForm(movieToForm(movie));
    setEditError('');
    setEditOpen(true);
  }

  function handleAdd() {
    setAddError('');
    startTransition(async () => {
      const res = await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(addForm)),
      });
      if (res.ok) {
        setAddOpen(false);
        setAddForm(EMPTY_FORM);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setAddError(data.error || 'Failed to create movie');
      }
    });
  }

  function handleEdit() {
    if (!editTarget) return;
    setEditError('');
    startTransition(async () => {
      const res = await fetch(`/api/movies/${editTarget._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(editForm)),
      });
      if (res.ok) {
        setEditOpen(false);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setEditError(data.error || 'Failed to update movie');
      }
    });
  }

  function handleDelete(movie: Movie) {
    if (!confirm(`Delete "${movie.title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      const res = await fetch(`/api/movies/${movie._id}`, { method: 'DELETE' });
      if (res.ok) {
        setMovies((prev) => prev.filter((m) => m._id !== movie._id));
      }
    });
  }

  const filtered = movies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-white text-2xl font-bold">Movies</h1>
          <p className="text-zinc-500 text-sm mt-0.5">{movies.length} total</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="search"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-52 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <Button onClick={() => { setAddForm(EMPTY_FORM); setAddError(''); setAddOpen(true); }} size="sm" className="gap-2 shrink-0">
            <Plus size={16} aria-hidden="true" />
            Add Movie
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
          <Film size={48} className="mb-3 opacity-40" aria-hidden="true" />
          <p className="text-sm">{search ? 'No movies match your search.' : 'No movies yet. Add one above.'}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-800/60 border-b border-zinc-700 text-left text-zinc-400">
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Genre</th>
                  <th className="px-4 py-3 font-medium">Year</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Quality</th>
                  <th className="px-4 py-3 font-medium">Rating</th>
                  <th className="px-4 py-3 font-medium sr-only">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filtered.map((movie) => (
                  <tr key={movie._id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="px-4 py-3 text-white font-medium max-w-[220px] truncate">{movie.title}</td>
                    <td className="px-4 py-3 text-zinc-400 capitalize">{movie.genre ?? '—'}</td>
                    <td className="px-4 py-3 text-zinc-400">{movie.year ?? '—'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={movie.isSeries ? 'default' : 'outline'} className="text-[11px]">
                        {movie.isSeries ? 'Series' : 'Movie'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {movie.quality ? (
                        <span className="bg-red-600/20 text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                          {movie.quality}
                        </span>
                      ) : <span className="text-zinc-600">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {movie.rating != null ? (
                        <span className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                          <Star size={11} fill="currentColor" aria-hidden="true" />
                          {movie.rating.toFixed(1)}
                        </span>
                      ) : <span className="text-zinc-600">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => openEdit(movie)}
                          aria-label={`Edit ${movie.title}`}
                          className="text-zinc-500 hover:text-yellow-400 transition-colors"
                        >
                          <Pencil size={15} aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => handleDelete(movie)}
                          aria-label={`Delete ${movie.title}`}
                          disabled={isPending}
                          className="text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-30"
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add modal */}
      <MovieForm
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Movie"
        form={addForm}
        onChange={setAddForm}
        onSubmit={handleAdd}
        isPending={isPending}
        error={addError}
      />

      {/* Edit modal */}
      <MovieForm
        open={editOpen}
        onOpenChange={setEditOpen}
        title={`Edit: ${editTarget?.title ?? ''}`}
        form={editForm}
        onChange={setEditForm}
        onSubmit={handleEdit}
        isPending={isPending}
        error={editError}
      />
    </div>
  );
}
