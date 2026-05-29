'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Loader2, Film, Tv, Gamepad2, ChevronDown } from 'lucide-react';
import type { Movie, Game } from '@/types';

const PLACEHOLDER = 'https://i.ibb.co/FHShpGv/58-589476-official-venom-movie-poster.jpg';
const DEBOUNCE_MS = 300;

type Category = 'films' | 'games';

export default function SearchBox() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState<Category>('films');
  const [query,    setQuery]    = useState('');
  const [results,  setResults]  = useState<(Movie | Game)[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [open,     setOpen]     = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchResults = useCallback(async (q: string, cat: Category) => {
    if (q.trim().length < 1) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const type = cat === 'games' ? 'game' : '';
      const res  = await fetch(`/api/search?q=${encodeURIComponent(q)}${type ? `&type=${type}` : ''}`);
      if (res.ok) { setResults(await res.json()); setOpen(true); }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (query.trim().length < 1) { setResults([]); setOpen(false); return; }
    timerRef.current = setTimeout(() => fetchResults(query, category), DEBOUNCE_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query, category, fetchResults]);

  /* Close on outside click */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setDropOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    const url = category === 'games'
      ? `/search?q=${encodeURIComponent(q)}&type=game`
      : `/search?q=${encodeURIComponent(q)}`;
    router.push(url);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); }
  }

  function handleResultClick() { setOpen(false); setQuery(''); }

  function selectCategory(cat: Category) {
    setCategory(cat);
    setDropOpen(false);
    setResults([]);
    setOpen(false);
    if (query.trim().length >= 1) fetchResults(query, cat);
    inputRef.current?.focus();
  }

  const isGame = (r: Movie | Game): r is Game => !('isSeries' in r);

  return (
    <div ref={containerRef} className="relative hidden sm:block">
      {/* Category dropdown — outside form so overflow-hidden doesn't clip it */}
      {dropOpen && (
        <ul
          role="listbox"
          className="absolute top-full left-0 mt-1 w-28 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden z-[200]"
        >
          {(['films', 'games'] as Category[]).map((cat) => (
            <li key={cat}>
              <button
                type="button"
                role="option"
                aria-selected={category === cat}
                onClick={() => selectCategory(cat)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                  category === cat
                    ? 'bg-yellow-400/15 text-yellow-400 font-semibold'
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {cat === 'games'
                  ? <Gamepad2 size={13} aria-hidden="true" />
                  : <Film size={13} aria-hidden="true" />}
                {cat === 'games' ? 'Games' : 'Films'}
              </button>
            </li>
          ))}
        </ul>
      )}

      <form
        role="search"
        onSubmit={handleSubmit}
        className="flex items-center bg-yellow-400 rounded-md h-8 overflow-hidden"
      >
        {/* Category selector button */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => setDropOpen((v) => !v)}
            className="flex items-center gap-1 pl-2.5 pr-1.5 h-8 text-black text-xs font-bold border-r border-black/20 hover:bg-yellow-300 transition-colors"
            aria-haspopup="listbox"
            aria-expanded={dropOpen}
          >
            {category === 'games'
              ? <Gamepad2 size={13} aria-hidden="true" />
              : <Film size={13} aria-hidden="true" />}
            <span>{category === 'games' ? 'Games' : 'Films'}</span>
            <ChevronDown size={11} aria-hidden="true" />
          </button>
        </div>

        {/* Text input */}
        <label htmlFor="site-search" className="sr-only">
          Search {category === 'games' ? 'games' : 'movies and series'}
        </label>
        <input
          ref={inputRef}
          id="site-search"
          type="search"
          placeholder={category === 'games' ? 'Search games…' : 'Search movies, genres…'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          className="bg-transparent text-black placeholder:text-black/50 text-sm outline-none w-36 sm:w-44 md:w-60 lg:w-80 px-2"
        />

        {loading
          ? <Loader2 size={15} className="text-black/60 shrink-0 animate-spin mr-2" aria-hidden="true" />
          : <button type="submit" aria-label="Search" className="shrink-0 mr-2">
              <Search size={15} className="text-black" aria-hidden="true" />
            </button>
        }
      </form>

      {/* Live dropdown */}
      {open && (
        <div className="absolute top-full mt-1.5 left-0 right-0 min-w-[320px] bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden z-50">
          {results.length === 0 ? (
            <div className="px-4 py-5 text-center text-zinc-500 text-sm">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              <ul role="listbox" aria-label="Search suggestions">
                {results.map((result) => {
                  const game = isGame(result);
                  return (
                    <li key={result._id} role="option" aria-selected="false">
                      <Link
                        href={game ? `/games/${result._id}` : `/movies/${result._id}`}
                        onClick={handleResultClick}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-800 transition-colors"
                      >
                        <div className="relative w-9 h-[54px] rounded shrink-0 overflow-hidden bg-zinc-800">
                          <Image
                            src={game
                              ? ((result as Game).img || PLACEHOLDER)
                              : ((result as Movie).imgSm || (result as Movie).img || PLACEHOLDER)
                            }
                            alt=""
                            fill
                            sizes="36px"
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate leading-tight">
                            {result.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5 text-zinc-500 text-xs">
                            {game ? (
                              <>
                                <Gamepad2 size={11} aria-hidden="true" />
                                <span>Game</span>
                                {(result as Game).category && (
                                  <><span>·</span><span className="truncate">{(result as Game).category}</span></>
                                )}
                              </>
                            ) : (
                              <>
                                {(result as Movie).isSeries
                                  ? <Tv size={11} aria-hidden="true" />
                                  : <Film size={11} aria-hidden="true" />}
                                <span>{(result as Movie).isSeries ? 'Series' : 'Movie'}</span>
                                {(result as Movie).year && (
                                  <><span>·</span><span>{(result as Movie).year}</span></>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {result.rating != null && (
                          <span className="shrink-0 text-yellow-400 text-xs font-bold">
                            ★ {result.rating.toFixed(1)}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <Link
                href={category === 'games'
                  ? `/search?q=${encodeURIComponent(query)}&type=game`
                  : `/search?q=${encodeURIComponent(query)}`}
                onClick={handleResultClick}
                className="flex items-center justify-center gap-2 px-4 py-2.5 border-t border-zinc-800 text-yellow-400 hover:bg-zinc-800 text-xs font-semibold transition-colors"
              >
                <Search size={12} aria-hidden="true" />
                See all results for &ldquo;{query}&rdquo;
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
