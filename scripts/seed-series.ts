/**
 * Seed English + Tamil adult / themed TV series into MongoDB, across all of the
 * site's categories, and build the `type: series` lists that the /series
 * landing page renders.
 *
 * For every category (see CATEGORY_TERMS) the script resolves TMDB keyword ids,
 * then queries Discover TV for English (original_language=en) and Tamil (ta)
 * series. Each series is stored with isSeries=true, tagged with every matching
 * category plus a language tag (`english` / `tamil`), poster, rating, overview,
 * TMDB id and watch providers. Finally it upserts one series-list per category
 * and per language so /series shows carousels.
 *
 *   npx tsx scripts/seed-series.ts            # full seed
 *   npx tsx scripts/seed-series.ts --dry      # preview, no DB writes
 *   npx tsx scripts/seed-series.ts --pages 2  # discover pages per cat/lang (default 1)
 *   npx tsx scripts/seed-series.ts --no-providers   # skip TMDB provider lookups (faster)
 *
 * Requires TMDB_API_KEY and MONGO_URL in .env.local (or .env).
 */

import mongoose from 'mongoose';
import { config } from 'dotenv';
config({ path: '.env.local' });
config();

import Movie from '@/lib/models/Movie';
import List from '@/lib/models/List';
import { getWatchProvidersById } from '@/lib/tmdb';
import { MOVIE_CATEGORIES } from '@/lib/categories';

// Category slug -> TMDB keyword search terms (resolved to ids at runtime).
const CATEGORY_TERMS: Record<string, string[]> = {
  erotic: ['erotic'],
  'psychological-thriller': ['psychological thriller'],
  bdsm: ['bdsm'],
  fetish: ['fetish'],
  captive: ['kidnapping', 'captivity'],
  voyeur: ['voyeurism'],
  disturbing: ['disturbing'],
  horror: ['horror'],
  thriller: ['thriller'],
  'serial-killer': ['serial killer'],
  crime: ['crime'],
  torture: ['torture'],
  obsession: ['obsession'],
  infidelity: ['adultery', 'extramarital affair', 'infidelity'],
  lesbian: ['lesbian'],
  lgbt: ['lgbt', 'homosexuality'],
  nudity: ['nudity'],
  exploitation: ['exploitation'],
  'sexual-abuse': ['sexual abuse', 'rape'],
  revenge: ['revenge'],
  taboo: ['taboo'],
  'sex-work': ['prostitution', 'sex worker'],
  'coming-of-age': ['coming of age'],
  romance: ['romance'],
};

const LANGUAGES = [
  { code: 'en', tag: 'english', label: 'English' },
  { code: 'ta', tag: 'tamil', label: 'Tamil' },
];

const TMDB_GENRES: Record<number, string> = {
  16: 'Animation', 35: 'Comedy', 80: 'Crime', 99: 'Documentary', 18: 'Drama',
  10751: 'Family', 9648: 'Mystery', 10749: 'Romance', 37: 'Western',
  10759: 'Action & Adventure', 10762: 'Kids', 10763: 'News', 10764: 'Reality',
  10765: 'Sci-Fi & Fantasy', 10766: 'Soap', 10767: 'Talk', 10768: 'War & Politics',
};

const IMG_BASE = 'https://image.tmdb.org/t/p';
const API = 'https://api.themoviedb.org/3';

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const NO_PROVIDERS = args.includes('--no-providers');
const PAGES = args.includes('--pages') ? Math.max(1, parseInt(args[args.indexOf('--pages') + 1], 10)) : 1;
const MONGO_URL = process.env.MONGO_URL ?? 'mongodb://localhost:27017/filmmart';
const KEY = process.env.TMDB_API_KEY!;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const LABELS = new Map(MOVIE_CATEGORIES.map((c) => [c.slug, c.label]));
const labelFor = (slug: string) =>
  LABELS.get(slug) ?? slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');

/* eslint-disable @typescript-eslint/no-explicit-any */
async function tmdb(path: string, params: Record<string, string>): Promise<any> {
  const url = new URL(`${API}${path}`);
  url.searchParams.set('api_key', KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB ${path} -> ${res.status}`);
  return res.json();
}

const keywordCache = new Map<string, number | null>();
async function keywordId(term: string): Promise<number | null> {
  if (keywordCache.has(term)) return keywordCache.get(term)!;
  let id: number | null = null;
  try {
    const data = await tmdb('/search/keyword', { query: term });
    id = data.results?.[0]?.id ?? null;
  } catch { /* ignore */ }
  keywordCache.set(term, id);
  return id;
}

function toGenre(ids: number[] = []): string {
  return ids.map((id) => TMDB_GENRES[id]).filter(Boolean).slice(0, 3).join(', ') || 'Drama';
}

interface Acc {
  tmdbId: number;
  title: string;
  year?: string;
  overview?: string;
  poster_path?: string | null;
  vote_average?: number;
  genre_ids?: number[];
  categories: Set<string>;
  languages: Set<string>; // language tags
}

async function run() {
  if (!KEY) {
    console.error('✗ TMDB_API_KEY is not set. Aborting.');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URL);
  console.log('Connected to', MONGO_URL, DRY ? '(DRY RUN)' : '', `| ${PAGES} page(s)/cat/lang\n`);

  // 1) Resolve keyword ids per category.
  const catKeywords: Record<string, string> = {};
  for (const [slug, terms] of Object.entries(CATEGORY_TERMS)) {
    const ids: number[] = [];
    for (const t of terms) {
      const id = await keywordId(t);
      if (id) ids.push(id);
      await sleep(40);
    }
    if (ids.length) catKeywords[slug] = ids.join('|');
  }
  console.log(`Resolved keywords for ${Object.keys(catKeywords).length} categories.\n`);

  // 2) Discover series per category × language, accumulating by tmdbId.
  const acc = new Map<number, Acc>();
  for (const [slug, kw] of Object.entries(catKeywords)) {
    for (const lang of LANGUAGES) {
      for (let page = 1; page <= PAGES; page++) {
        let data: any;
        try {
          data = await tmdb('/discover/tv', {
            with_keywords: kw, with_original_language: lang.code,
            include_adult: 'true', sort_by: 'popularity.desc', page: String(page),
          });
        } catch { break; }
        await sleep(60);
        const results: any[] = data.results ?? [];
        for (const r of results) {
          const cur = acc.get(r.id) ?? {
            tmdbId: r.id, title: r.name, year: (r.first_air_date || '').slice(0, 4) || undefined,
            overview: r.overview, poster_path: r.poster_path, vote_average: r.vote_average,
            genre_ids: r.genre_ids, categories: new Set<string>(), languages: new Set<string>(),
          };
          cur.categories.add(slug);
          cur.languages.add(lang.tag);
          acc.set(r.id, cur);
        }
        if (page >= (data.total_pages ?? 1)) break;
      }
    }
  }
  const series = [...acc.values()];
  console.log(`Discovered ${series.length} unique series across English + Tamil.\n`);

  // 3) Insert / enrich each series; remember its _id per category and language.
  const idsByCategory: Record<string, string[]> = {};
  const idsByLanguage: Record<string, string[]> = {};
  const stats = { inserted: 0, tagged: 0, withProviders: 0, skipped: 0 };

  for (const s of series) {
    const cats = [...s.categories];
    const langs = [...s.languages];
    const tags = [...new Set([...cats, ...langs])];
    const label = `${s.title}${s.year ? ` (${s.year})` : ''} [${cats.join(',')}|${langs.join(',')}]`;

    let docId: string | null = null;
    const existing = await Movie.findOne({ title: s.title }).select('_id');
    if (existing) {
      docId = String(existing._id);
      if (!DRY) await Movie.updateOne({ _id: existing._id }, { $addToSet: { tags: { $each: tags } }, $set: { isSeries: true } });
      stats.tagged++;
      console.log(`  ~ ${label} — existing, tagged`);
    } else if (DRY) {
      stats.inserted++;
      console.log(`  + ${label} — would insert`);
    } else {
      const providers = NO_PROVIDERS ? null : await getWatchProvidersById(s.tmdbId, true).catch(() => null);
      if (providers && Object.keys(providers).length) stats.withProviders++;
      try {
        const created = await Movie.create({
          title: s.title,
          desc: s.overview || undefined,
          img: s.poster_path ? `${IMG_BASE}/w500${s.poster_path}` : undefined,
          imgSm: s.poster_path ? `${IMG_BASE}/w342${s.poster_path}` : undefined,
          year: s.year,
          genre: toGenre(s.genre_ids),
          rating: s.vote_average ? Math.round(s.vote_average * 10) / 10 : undefined,
          isSeries: true,
          tags,
          tmdbId: s.tmdbId,
          watchProviders: providers ?? undefined,
          tmdbSyncedAt: providers !== null ? new Date() : undefined,
        });
        docId = String(created._id);
        stats.inserted++;
        console.log(`  + ${label} — inserted`);
      } catch (err) {
        stats.skipped++;
        console.log(`  ! ${label} — ${(err as Error).message}`);
      }
      await sleep(NO_PROVIDERS ? 30 : 90);
    }

    if (docId) {
      for (const c of cats) (idsByCategory[c] ??= []).push(docId);
      for (const l of langs) (idsByLanguage[l] ??= []).push(docId);
    }
  }

  // 4) Build series lists so /series renders carousels.
  let listsUpserted = 0;
  async function upsertList(title: string, content: string[], genre?: string) {
    if (!content.length) return;
    if (DRY) { console.log(`  [list] ${title} (${content.length})`); listsUpserted++; return; }
    await List.updateOne(
      { title },
      { $set: { type: 'series', genre, content: [...new Set(content)] } },
      { upsert: true }
    );
    listsUpserted++;
  }

  console.log('\nBuilding series lists…');
  for (const [slug, ids] of Object.entries(idsByCategory)) {
    await upsertList(`${labelFor(slug)} Series`, ids, slug);
  }
  for (const lang of LANGUAGES) {
    await upsertList(`${lang.label} Adult Series`, idsByLanguage[lang.tag] ?? []);
  }

  console.log('\n── Summary ──────────────────────────────');
  console.log(`  Series inserted:     ${stats.inserted}`);
  console.log(`  Series tagged:       ${stats.tagged}`);
  console.log(`  With provider data:  ${stats.withProviders}`);
  console.log(`  Series lists:        ${listsUpserted}`);
  console.log(`  Skipped/errors:      ${stats.skipped}`);
  console.log('─────────────────────────────────────────');

  await mongoose.disconnect();
  console.log('Done.');
}
/* eslint-enable @typescript-eslint/no-explicit-any */

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
