'use client';

import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Loader2, Film, Tv } from 'lucide-react';
import type { Movie } from '@/types';

const PLACEHOLDER = 'https://i.ibb.co/FHShpGv/58-589476-official-venom-movie-poster.jpg';
const DEBOUNCE_MS = 300;

export default function SearchBox() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchResults = useCallback(async (q: string) => {
    if (q.trim().length < 1) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data: Movie[] = await res.json();
        setResults(data);
        setOpen(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (query.trim().length < 1) {
      setResults([]);
      setOpen(false);
      return;
    }
    timerRef.current = setTimeout(() => fetchResults(query), DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, fetchResults]);

  /* Close dropdown on outside click */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
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
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  function handleResultClick() {
    setOpen(false);
    setQuery('');
  }

  return (
    <div ref={containerRef} className="relative hidden sm:block">
      <form
        role="search"
        onSubmit={handleSubmit}
        className="flex items-center gap-1.5 bg-yellow-400 rounded-md px-2.5 h-8"
      >
        <label htmlFor="site-search" className="sr-only">
          Search movies and series
        </label>
        <input
          ref={inputRef}
          id="site-search"
          type="search"
          placeholder="Search movies, genres…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          className="bg-transparent text-black placeholder:text-black/50 text-sm outline-none w-40 sm:w-52 md:w-72 lg:w-96"
        />
        {loading ? (
          <Loader2 size={15} className="text-black/60 shrink-0 animate-spin" aria-hidden="true" />
        ) : (
          <button type="submit" aria-label="Search" className="shrink-0">
            <Search size={15} className="text-black" aria-hidden="true" />
          </button>
        )}
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
                {results.map((movie) => (
                  <li key={movie._id} role="option" aria-selected="false">
                    <Link
                      href={`/movies/${movie._id}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-800 transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-9 h-[54px] rounded shrink-0 overflow-hidden bg-zinc-800">
                        <Image
                          src={movie.imgSm || movie.img || PLACEHOLDER}
                          alt=""
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate leading-tight">
                          {movie.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5 text-zinc-500 text-xs">
                          {movie.isSeries ? (
                            <Tv size={11} aria-hidden="true" />
                          ) : (
                            <Film size={11} aria-hidden="true" />
                          )}
                          <span>{movie.isSeries ? 'Series' : 'Movie'}</span>
                          {movie.year && <><span>·</span><span>{movie.year}</span></>}
                          {movie.genre && <><span>·</span><span className="capitalize">{movie.genre}</span></>}
                        </div>
                      </div>

                      {/* Rating */}
                      {movie.rating != null && (
                        <span className="shrink-0 text-yellow-400 text-xs font-bold">
                          ★ {movie.rating.toFixed(1)}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* See all */}
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
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
