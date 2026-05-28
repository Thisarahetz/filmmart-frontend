'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Movie } from '@/types';

const GENRES = ['action','comedy','drama','horror','sci-fi','romance','thriller','documentary','animation','fantasy','crime'];
const QUALITY_OPTIONS = ['WEB','WEB-DL','BluRay','HDCAM','LEAK-WEBRIP','S01 COMPLETE','S01-S08 COMPLETE','SEASON COMPLETE'];

export interface MovieFormData {
  title: string;
  desc: string;
  img: string;
  imgSm: string;
  imgTitle: string;
  trailer: string;
  video: string;
  year: string;
  genre: string;
  limit: string;
  rating: string;
  quality: string;
  isSeries: boolean;
}

export const EMPTY_FORM: MovieFormData = {
  title: '', desc: '', img: '', imgSm: '', imgTitle: '',
  trailer: '', video: '', year: '', genre: '', limit: '',
  rating: '', quality: 'WEB', isSeries: false,
};

export function movieToForm(m: Movie): MovieFormData {
  return {
    title: m.title,
    desc: m.desc ?? '',
    img: m.img ?? '',
    imgSm: m.imgSm ?? '',
    imgTitle: m.imgTitle ?? '',
    trailer: m.trailer ?? '',
    video: m.video ?? '',
    year: m.year ?? '',
    genre: m.genre ?? '',
    limit: m.limit != null ? String(m.limit) : '',
    rating: m.rating != null ? String(m.rating) : '',
    quality: m.quality ?? 'WEB',
    isSeries: m.isSeries,
  };
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  form: MovieFormData;
  onChange: (f: MovieFormData) => void;
  onSubmit: () => void;
  isPending: boolean;
  error: string;
}

export default function MovieForm({ open, onOpenChange, title, form, onChange, onSubmit, isPending, error }: Props) {
  const set = (k: keyof MovieFormData, v: string | boolean) =>
    onChange({ ...form, [k]: v });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[310] w-full max-w-2xl max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          aria-describedby={undefined}
        >
          <Dialog.Title className="text-white font-bold text-lg mb-5">{title}</Dialog.Title>
          <Dialog.Close asChild>
            <button className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors" aria-label="Close">
              <X size={20} />
            </button>
          </Dialog.Close>

          <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-5">
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="f-title">Title *</Label>
                <Input id="f-title" required value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Movie or series title" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="f-year">Year</Label>
                <Input id="f-year" value={form.year} onChange={(e) => set('year', e.target.value)} placeholder="2024" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="f-genre">Genre</Label>
                <select
                  id="f-genre"
                  value={form.genre}
                  onChange={(e) => set('genre', e.target.value)}
                  className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                >
                  <option value="">— Select genre —</option>
                  {GENRES.map((g) => <option key={g} value={g} className="bg-zinc-900">{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="f-quality">Quality</Label>
                <select
                  id="f-quality"
                  value={form.quality}
                  onChange={(e) => set('quality', e.target.value)}
                  className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                >
                  {QUALITY_OPTIONS.map((q) => <option key={q} value={q} className="bg-zinc-900">{q}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="f-rating">Rating (0–10)</Label>
                <Input id="f-rating" type="number" min="0" max="10" step="0.1" value={form.rating} onChange={(e) => set('rating', e.target.value)} placeholder="7.5" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="f-limit">Age Limit</Label>
                <Input id="f-limit" type="number" min="0" value={form.limit} onChange={(e) => set('limit', e.target.value)} placeholder="13" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="f-desc">Description</Label>
              <textarea
                id="f-desc"
                rows={3}
                value={form.desc}
                onChange={(e) => set('desc', e.target.value)}
                placeholder="Short description…"
                className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 resize-none"
              />
            </div>

            {/* Media URLs */}
            <fieldset className="border border-zinc-700 rounded-lg p-4 space-y-3">
              <legend className="text-zinc-400 text-xs px-1">Media URLs</legend>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="f-img">Poster URL</Label>
                  <Input id="f-img" type="url" value={form.img} onChange={(e) => set('img', e.target.value)} placeholder="https://…" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="f-imgSm">Thumbnail URL</Label>
                  <Input id="f-imgSm" type="url" value={form.imgSm} onChange={(e) => set('imgSm', e.target.value)} placeholder="https://…" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="f-imgTitle">Title Image URL</Label>
                  <Input id="f-imgTitle" type="url" value={form.imgTitle} onChange={(e) => set('imgTitle', e.target.value)} placeholder="https://…" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="f-trailer">Trailer URL</Label>
                  <Input id="f-trailer" value={form.trailer} onChange={(e) => set('trailer', e.target.value)} placeholder="https://youtube.com/embed/…" />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <Label htmlFor="f-video">Video URL</Label>
                  <Input id="f-video" value={form.video} onChange={(e) => set('video', e.target.value)} placeholder="https://…" />
                </div>
              </div>
            </fieldset>

            {/* Series toggle */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.isSeries}
                  onChange={(e) => set('isSeries', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-10 h-5 rounded-full transition-colors ${form.isSeries ? 'bg-yellow-400' : 'bg-zinc-700'}`} />
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isSeries ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <span className="text-sm text-zinc-300">This is a TV Series</span>
            </label>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <Dialog.Close asChild>
                <Button type="button" variant="ghost">Cancel</Button>
              </Dialog.Close>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
