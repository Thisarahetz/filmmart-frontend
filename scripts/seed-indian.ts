/**
 * Seed Indian adult / erotic-themed films AND TV / web series into MongoDB.
 *
 * Sources from TMDB:
 *   - Movies: Discover, origin country = India (IN) ∪ erotic keywords.
 *   - TV:     Discover (same filters) PLUS a curated list of well-known Indian
 *             adult web series resolved by title search (ULLU / ALTBalaji-style).
 *
 * Each title is stored with metadata (poster, year, overview, rating, genre,
 * TMDB id, watch providers) tagged `indian` + `erotic` so it appears on the
 * /genre/indian landing page. Series are stored with isSeries = true so they
 * also surface under /series.
 *
 * De-dupes by title: an existing catalog entry just gets the `indian` tag added.
 *
 *   npx tsx scripts/seed-indian.ts            # insert / enrich
 *   npx tsx scripts/seed-indian.ts --dry      # preview only, no DB writes
 *   npx tsx scripts/seed-indian.ts --limit 10 # cap number processed
 *   npx tsx scripts/seed-indian.ts --no-tv    # movies only
 *
 * Requires TMDB_API_KEY and MONGO_URL in .env.local (or .env).
 */

import mongoose from 'mongoose';
import { config } from 'dotenv';
config({ path: '.env.local' });
config();

import Movie from '@/lib/models/Movie';
import { getWatchProvidersById } from '@/lib/tmdb';

// Erotic / adult-themed TMDB keyword ids (OR-combined).
const EROTIC_KEYWORDS = [
  256466, 155691, 302868, 298666, 190370, 155477, 267122, 41404, 281741, 596, 34094,
].join('|');

// Well-known Indian adult web series (resolved via TMDB title search; only
// India-origin matches are kept). Keyword discovery alone misses most of these.
const CURATED_TV_TITLES = [
  'Gandii Baat', 'Charmsukh', 'Mastram', 'Riti Riwaj', 'Palang Tod', 'Paurashpur',
  'XXX: Uncensored', 'Bekaaboo', 'Kavita Bhabhi', 'Mona Home Delivery', 'Halala',
  'Maaya', 'Jagoo', 'Hello Mini', 'Class of 2020', 'Booo Sabki Phategi', 'Siskiyaan',
  'Adhura', 'Imli', 'Tadap',
];

const TMDB_GENRES: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
  // TV-specific
  10759: 'Action & Adventure', 10762: 'Kids', 10763: 'News', 10764: 'Reality',
  10765: 'Sci-Fi & Fantasy', 10766: 'Soap', 10767: 'Talk', 10768: 'War & Politics',
};

const IMG_BASE = 'https://image.tmdb.org/t/p';
const API = 'https://api.themoviedb.org/3';

interface Item {
  tmdbId: number;
  title: string;
  year?: string;
  overview?: string;
  poster_path?: string | null;
  vote_average?: number;
  genre_ids?: number[];
  isSeries: boolean;
}

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const NO_TV = args.includes('--no-tv');
const LIMIT = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1], 10) : Infinity;
const MONGO_URL = process.env.MONGO_URL ?? 'mongodb://localhost:27017/filmmart';
const KEY = process.env.TMDB_API_KEY!;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function tmdb(path: string, params: Record<string, string>) {
  const url = new URL(`${API}${path}`);
  url.searchParams.set('api_key', KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB ${path} -> ${res.status}`);
  return res.json();
}

function toGenre(ids: number[] = []): string {
  return ids.map((id) => TMDB_GENRES[id]).filter(Boolean).slice(0, 3).join(', ') || 'Drama';
}

/* eslint-disable @typescript-eslint/no-explicit-any */
async function discoverMovies(): Promise<Item[]> {
  const out: Item[] = [];
  const first = await tmdb('/discover/movie', {
    with_origin_country: 'IN', with_keywords: EROTIC_KEYWORDS,
    include_adult: 'true', sort_by: 'popularity.desc', page: '1',
  });
  const totalPages = first.total_pages ?? 1;
  const pages = [first.results as any[]];
  for (let p = 2; p <= totalPages; p++) {
    await sleep(120);
    pages.push((await tmdb('/discover/movie', {
      with_origin_country: 'IN', with_keywords: EROTIC_KEYWORDS,
      include_adult: 'true', sort_by: 'popularity.desc', page: String(p),
    })).results);
  }
  for (const r of pages.flat()) {
    out.push({
      tmdbId: r.id, title: r.title, year: (r.release_date || '').slice(0, 4) || undefined,
      overview: r.overview, poster_path: r.poster_path, vote_average: r.vote_average,
      genre_ids: r.genre_ids, isSeries: false,
    });
  }
  return out;
}

async function discoverTv(): Promise<Item[]> {
  const data = await tmdb('/discover/tv', {
    with_origin_country: 'IN', with_keywords: EROTIC_KEYWORDS,
    include_adult: 'true', sort_by: 'popularity.desc', page: '1',
  });
  return (data.results as any[]).map((r) => ({
    tmdbId: r.id, title: r.name, year: (r.first_air_date || '').slice(0, 4) || undefined,
    overview: r.overview, poster_path: r.poster_path, vote_average: r.vote_average,
    genre_ids: r.genre_ids, isSeries: true,
  }));
}

async function curatedTv(): Promise<Item[]> {
  const out: Item[] = [];
  for (const title of CURATED_TV_TITLES) {
    await sleep(100);
    try {
      const data = await tmdb('/search/tv', { query: title, include_adult: 'true' });
      const r = (data.results as any[]).find((x) => (x.origin_country || []).includes('IN'));
      if (r) {
        out.push({
          tmdbId: r.id, title: r.name, year: (r.first_air_date || '').slice(0, 4) || undefined,
          overview: r.overview, poster_path: r.poster_path, vote_average: r.vote_average,
          genre_ids: r.genre_ids, isSeries: true,
        });
      }
    } catch { /* skip on error */ }
  }
  return out;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

async function run() {
  if (!KEY) {
    console.error('✗ TMDB_API_KEY is not set in .env.local / .env. Aborting.');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URL);
  console.log('Connected to', MONGO_URL, DRY ? '(DRY RUN)\n' : '\n');

  const movies = await discoverMovies();
  let tv: Item[] = [];
  if (!NO_TV) {
    const [d, c] = await Promise.all([discoverTv(), curatedTv()]);
    // De-dupe TV by tmdbId across the two sources.
    const seen = new Set<number>();
    tv = [...d, ...c].filter((i) => (seen.has(i.tmdbId) ? false : (seen.add(i.tmdbId), true)));
  }

  const all = [...movies, ...tv];
  console.log(`Discovered ${movies.length} films + ${tv.length} series = ${all.length} titles.\n`);

  const stats = { insertedMovie: 0, insertedTv: 0, tagged: 0, skipped: 0, withProviders: 0 };
  let processed = 0;

  for (const m of all) {
    if (processed >= LIMIT) break;
    processed++;

    const kind = m.isSeries ? 'TV' : 'FILM';
    const label = `[${kind}] ${m.title}${m.year ? ` (${m.year})` : ''}`;

    const existing = await Movie.findOne({ title: m.title }).select('_id tmdbId');
    if (existing) {
      if (!DRY) {
        await Movie.updateOne(
          { _id: existing._id },
          { $addToSet: { tags: { $each: ['indian', 'erotic'] } }, $set: { tmdbId: existing.tmdbId ?? m.tmdbId } }
        );
      }
      console.log(`  ~ ${label} — existing, tagged 'indian'`);
      stats.tagged++;
      continue;
    }

    const providers = DRY ? null : await getWatchProvidersById(m.tmdbId, m.isSeries).catch(() => null);
    if (providers && Object.keys(providers).length) stats.withProviders++;

    const doc = {
      title: m.title,
      desc: m.overview || undefined,
      img: m.poster_path ? `${IMG_BASE}/w500${m.poster_path}` : undefined,
      imgSm: m.poster_path ? `${IMG_BASE}/w342${m.poster_path}` : undefined,
      year: m.year,
      genre: toGenre(m.genre_ids),
      rating: m.vote_average ? Math.round(m.vote_average * 10) / 10 : undefined,
      isSeries: m.isSeries,
      tags: ['indian', 'erotic'],
      country: 'India',
      tmdbId: m.tmdbId,
      watchProviders: providers ?? undefined,
      tmdbSyncedAt: providers !== null ? new Date() : undefined,
    };

    if (DRY) {
      console.log(`  + ${label} — would insert [${doc.genre}] ★${doc.rating ?? '—'}`);
      m.isSeries ? stats.insertedTv++ : stats.insertedMovie++;
      continue;
    }

    try {
      await Movie.create(doc);
      console.log(`  + ${label} — inserted [${doc.genre}] ★${doc.rating ?? '—'}`);
      m.isSeries ? stats.insertedTv++ : stats.insertedMovie++;
    } catch (err) {
      console.log(`  ! ${label} — ${(err as Error).message}`);
      stats.skipped++;
    }

    await sleep(100);
  }

  console.log('\n── Summary ──────────────────────────────');
  console.log(`  Films inserted:      ${stats.insertedMovie}`);
  console.log(`  Series inserted:     ${stats.insertedTv}`);
  console.log(`  Tagged (existing):   ${stats.tagged}`);
  console.log(`  With provider data:  ${stats.withProviders}`);
  console.log(`  Skipped/errors:      ${stats.skipped}`);
  console.log('─────────────────────────────────────────');

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
