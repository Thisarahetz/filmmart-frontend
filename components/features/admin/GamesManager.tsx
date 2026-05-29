'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Gamepad2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GameForm, { EMPTY_GAME_FORM, gameToForm, type GameFormData } from './GameForm';
import type { Game } from '@/types';

interface Props {
  games: Game[];
}

function buildPayload(form: GameFormData) {
  return {
    title: form.title,
    category: form.category || undefined,
    description: form.description || undefined,
    img: form.img || undefined,
    legalStatus: form.legalStatus || undefined,
    platform: form.platform,
    countriesBanned: form.countriesBanned
      ? form.countriesBanned.split(',').map((c) => c.trim()).filter(Boolean)
      : [],
    rating: form.rating ? Number(form.rating) : undefined,
  };
}

export default function GamesManager({ games: initial }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [games, setGames] = useState(initial);

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<GameFormData>(EMPTY_GAME_FORM);
  const [addError, setAddError] = useState('');

  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Game | null>(null);
  const [editForm, setEditForm] = useState<GameFormData>(EMPTY_GAME_FORM);
  const [editError, setEditError] = useState('');

  const [search, setSearch] = useState('');

  function openEdit(game: Game) {
    setEditTarget(game);
    setEditForm(gameToForm(game));
    setEditError('');
    setEditOpen(true);
  }

  function handleAdd() {
    setAddError('');
    startTransition(async () => {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(addForm)),
      });
      if (res.ok) {
        setAddOpen(false);
        setAddForm(EMPTY_GAME_FORM);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setAddError(data.error || 'Failed to create game');
      }
    });
  }

  function handleEdit() {
    if (!editTarget) return;
    setEditError('');
    startTransition(async () => {
      const res = await fetch(`/api/games/${editTarget._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(editForm)),
      });
      if (res.ok) {
        setEditOpen(false);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setEditError(data.error || 'Failed to update game');
      }
    });
  }

  function handleDelete(game: Game) {
    if (!confirm(`Delete "${game.title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      const res = await fetch(`/api/games/${game._id}`, { method: 'DELETE' });
      if (res.ok) {
        setGames((prev) => prev.filter((g) => g._id !== game._id));
      }
    });
  }

  const filtered = games.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-white text-2xl font-bold">Games</h1>
          <p className="text-zinc-500 text-sm mt-0.5">{games.length} total</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="search"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-52 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <Button
            onClick={() => { setAddForm(EMPTY_GAME_FORM); setAddError(''); setAddOpen(true); }}
            size="sm"
            className="gap-2 shrink-0"
          >
            <Plus size={16} aria-hidden="true" />
            Add Game
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
          <Gamepad2 size={48} className="mb-3 opacity-40" aria-hidden="true" />
          <p className="text-sm">{search ? 'No games match your search.' : 'No games yet. Add one above.'}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-800/60 border-b border-zinc-700 text-left text-zinc-400">
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Rating</th>
                  <th className="px-4 py-3 font-medium">Legal Status</th>
                  <th className="px-4 py-3 font-medium">Platforms</th>
                  <th className="px-4 py-3 font-medium sr-only">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filtered.map((game) => (
                  <tr key={game._id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="px-4 py-3 text-white font-medium max-w-[220px] truncate">{game.title}</td>
                    <td className="px-4 py-3 text-zinc-400 max-w-[200px] truncate">{game.category ?? '—'}</td>
                    <td className="px-4 py-3">
                      {game.rating != null ? (
                        <span className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                          <Star size={11} fill="currentColor" aria-hidden="true" />
                          {game.rating.toFixed(1)}
                        </span>
                      ) : <span className="text-zinc-600">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {game.legalStatus ? (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            game.legalStatus.toLowerCase().includes('restricted')
                              ? 'bg-red-600/20 text-red-400'
                              : 'bg-green-600/20 text-green-400'
                          }`}
                        >
                          {game.legalStatus}
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {game.platform?.length > 0 ? game.platform.join(', ') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => openEdit(game)}
                          aria-label={`Edit ${game.title}`}
                          className="text-zinc-500 hover:text-yellow-400 transition-colors"
                        >
                          <Pencil size={15} aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => handleDelete(game)}
                          aria-label={`Delete ${game.title}`}
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

      <GameForm
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Game"
        form={addForm}
        onChange={setAddForm}
        onSubmit={handleAdd}
        isPending={isPending}
        error={addError}
      />

      <GameForm
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
