'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Game } from '@/types';

export interface GameFormData {
  title: string;
  category: string;
  description: string;
  img: string;
  video: string;
  legalStatus: string;
  platform: string[];
  countriesBanned: string;
  rating: string;
}

export const EMPTY_GAME_FORM: GameFormData = {
  title: '',
  category: '',
  description: '',
  img: '',
  video: '',
  legalStatus: 'Restricted',
  platform: [],
  countriesBanned: '',
  rating: '',
};

export function gameToForm(game: Game): GameFormData {
  return {
    title: game.title,
    category: game.category ?? '',
    description: game.description ?? '',
    img: game.img ?? '',
    video: game.video ?? '',
    legalStatus: game.legalStatus ?? 'Restricted',
    platform: game.platform ?? [],
    countriesBanned: (game.countriesBanned ?? []).join(', '),
    rating: game.rating != null ? String(game.rating) : '',
  };
}

const GAME_CATEGORIES = [
  'Sexual/Adult Content',
  'Extreme Violence/Adult Content',
  'Psychological Horror',
  'Extreme Violence',
  'Extreme Violence/Horror',
  'Dark/Adult Content',
  'Sexual/Adult Content/Extreme Violence',
  'Extreme Violence/Hate Speech',
  'Sexual/Adult Content/Horror',
  'Manipulation/Predatory Behavior',
  'Extreme Violence/Inappropriate Content',
];

const PLATFORMS = ['PC', 'Mobile', 'Console', 'Browser'];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  form: GameFormData;
  onChange: (form: GameFormData) => void;
  onSubmit: () => void;
  isPending: boolean;
  error: string;
}

export default function GameForm({
  open,
  onOpenChange,
  title,
  form,
  onChange,
  onSubmit,
  isPending,
  error,
}: Props) {
  function field(key: keyof GameFormData, value: string) {
    onChange({ ...form, [key]: value });
  }

  function togglePlatform(p: string) {
    const next = form.platform.includes(p)
      ? form.platform.filter((x) => x !== p)
      : [...form.platform, p];
    onChange({ ...form, platform: next });
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[310] -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-white font-semibold text-lg">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button aria-label="Close" className="text-zinc-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1" htmlFor="gf-title">Title *</label>
              <input
                id="gf-title"
                type="text"
                value={form.title}
                onChange={(e) => field('title', e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Game title"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1" htmlFor="gf-category">Category</label>
              <select
                id="gf-category"
                value={form.category}
                onChange={(e) => field('category', e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">— Select category —</option>
                {GAME_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1" htmlFor="gf-description">Description</label>
              <textarea
                id="gf-description"
                value={form.description}
                onChange={(e) => field('description', e.target.value)}
                rows={3}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                placeholder="Game description"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1" htmlFor="gf-img">Image URL</label>
              <input
                id="gf-img"
                type="url"
                value={form.img}
                onChange={(e) => field('img', e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="https://…"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1" htmlFor="gf-video">Video URL</label>
              <input
                id="gf-video"
                type="url"
                value={form.video}
                onChange={(e) => field('video', e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="https://…"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1" htmlFor="gf-rating">Rating (0–10)</label>
              <input
                id="gf-rating"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={form.rating}
                onChange={(e) => field('rating', e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="7.5"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1" htmlFor="gf-legal">Legal Status</label>
              <select
                id="gf-legal"
                value={form.legalStatus}
                onChange={(e) => field('legalStatus', e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="Restricted">Restricted</option>
                <option value="Unrestricted">Unrestricted</option>
              </select>
            </div>

            <div>
              <p className="block text-xs text-zinc-400 mb-2">Platform</p>
              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map((p) => (
                  <label key={p} className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.platform.includes(p)}
                      onChange={() => togglePlatform(p)}
                      className="accent-yellow-400"
                    />
                    {p}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1" htmlFor="gf-banned">Countries Banned</label>
              <input
                id="gf-banned"
                type="text"
                value={form.countriesBanned}
                onChange={(e) => field('countriesBanned', e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Australia, Germany, …"
              />
              <p className="text-[10px] text-zinc-600 mt-1">Comma-separated list of countries</p>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 rounded-md px-3 py-2">{error}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Dialog.Close asChild>
                <Button variant="ghost" size="sm" disabled={isPending}>Cancel</Button>
              </Dialog.Close>
              <Button size="sm" onClick={onSubmit} disabled={isPending || !form.title.trim()}>
                {isPending ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
