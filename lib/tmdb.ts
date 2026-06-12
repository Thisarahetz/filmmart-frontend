/**
 * Minimal TMDB client for the "Where to Watch" feature.
 *
 * Uses the TMDB v3 API with a key supplied via the TMDB_API_KEY env var (server
 * only — never exposed to the client). Every helper degrades gracefully to null
 * when the key is missing or TMDB is unreachable, so the UI simply hides the
 * section instead of erroring.
 *
 * Attribution required by TMDB terms is rendered in the site footer.
 */

import { providerSlug } from '@/lib/affiliates';

const TMDB_BASE = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w92';

/** Regions surfaced in the UI (TMDB codes). UK is "GB" in TMDB. */
export const SUPPORTED_REGIONS = ['DE', 'FR', 'GB', 'US'] as const;
export type Region = (typeof SUPPORTED_REGIONS)[number];

export const REGION_LABELS: Record<Region, string> = {
  DE: 'Germany',
  FR: 'France',
  GB: 'UK',
  US: 'US',
};

export const DEFAULT_REGION: Region = 'DE';

export interface WatchProvider {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
}

export interface RegionProviders {
  link: string | null;
  stream: WatchProvider[];
  rent: WatchProvider[];
  buy: WatchProvider[];
}

export type WatchProvidersByRegion = Partial<Record<Region, RegionProviders>>;

interface MovieRef {
  tmdbId?: number | string | null;
  title: string;
  year?: string | number | null;
  isSeries?: boolean;
}

async function tmdbFetch<T>(
  path: string,
  params: Record<string, string> = {},
  revalidate = 86400
): Promise<T | null> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return null;

  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set('api_key', apiKey);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  try {
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

interface TmdbSearchResult {
  results?: Array<{ id: number; release_date?: string; first_air_date?: string }>;
}

/** Resolve a TMDB id: prefer a stored id, otherwise search by title (+year). */
export async function resolveTmdbId(movie: MovieRef): Promise<number | null> {
  if (movie.tmdbId != null && movie.tmdbId !== '') {
    const n = Number(movie.tmdbId);
    if (!Number.isNaN(n)) return n;
  }

  const isTv = !!movie.isSeries;
  const params: Record<string, string> = {
    query: cleanSearchTitle(movie.title),
    include_adult: 'true',
  };
  if (movie.year) params[isTv ? 'first_air_date_year' : 'year'] = String(movie.year);

  const data = await tmdbFetch<TmdbSearchResult>(
    isTv ? '/search/tv' : '/search/movie',
    params
  );
  return data?.results?.[0]?.id ?? null;
}

function cleanSearchTitle(title: string): string {
  // Drop a trailing "(YYYY)" so it doesn't pollute the query.
  return title.replace(/\s*\(\d{4}\)\s*$/, '').trim();
}

interface TmdbProviderEntry {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
  display_priority?: number;
}

interface TmdbRegionEntry {
  link?: string;
  flatrate?: TmdbProviderEntry[];
  rent?: TmdbProviderEntry[];
  buy?: TmdbProviderEntry[];
}

interface TmdbProvidersResponse {
  results?: Record<string, TmdbRegionEntry>;
}

function mapProviders(entries?: TmdbProviderEntry[]): WatchProvider[] {
  if (!entries?.length) return [];
  return [...entries]
    .sort((a, b) => (a.display_priority ?? 0) - (b.display_priority ?? 0))
    .map((e) => ({
      id: e.provider_id,
      name: e.provider_name,
      slug: providerSlug(e.provider_name),
      logo: e.logo_path ? `${TMDB_IMAGE_BASE}${e.logo_path}` : null,
    }));
}

/**
 * Fetch streaming availability for a known TMDB id, grouped by region
 * (limited to SUPPORTED_REGIONS). Returns null when unavailable; returns {}
 * when TMDB has no provider data for any supported region.
 */
export async function getWatchProvidersById(
  tmdbId: number,
  isSeries = false
): Promise<WatchProvidersByRegion | null> {
  const data = await tmdbFetch<TmdbProvidersResponse>(
    `/${isSeries ? 'tv' : 'movie'}/${tmdbId}/watch/providers`
  );
  if (!data?.results) return null;

  const out: WatchProvidersByRegion = {};
  for (const region of SUPPORTED_REGIONS) {
    const entry = data.results[region];
    if (!entry) continue;
    const stream = mapProviders(entry.flatrate);
    const rent = mapProviders(entry.rent);
    const buy = mapProviders(entry.buy);
    if (!stream.length && !rent.length && !buy.length) continue;
    out[region] = { link: entry.link ?? null, stream, rent, buy };
  }
  return out;
}

/**
 * Live lookup: resolve the TMDB id then fetch providers. Used by the sync
 * script — the app itself reads the cached result from the database.
 */
export async function getWatchProviders(movie: MovieRef): Promise<WatchProvidersByRegion | null> {
  const id = await resolveTmdbId(movie);
  if (id == null) return null;
  return getWatchProvidersById(id, !!movie.isSeries);
}

/**
 * Resolve a TMDB id AND its watch providers in one call, for persisting to the
 * database. Returns null only when the movie can't be matched on TMDB at all.
 */
export async function fetchTmdbForMovie(
  movie: MovieRef
): Promise<{ tmdbId: number; watchProviders: WatchProvidersByRegion } | null> {
  const id = await resolveTmdbId(movie);
  if (id == null) return null;
  const watchProviders = await getWatchProvidersById(id, !!movie.isSeries);
  return { tmdbId: id, watchProviders: watchProviders ?? {} };
}
