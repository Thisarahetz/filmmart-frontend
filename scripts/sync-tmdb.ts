/**
 * Sync TMDB "Where to Watch" data into MongoDB.
 *
 * Fetches each movie's TMDB id (by title + year) and its streaming providers,
 * then stores them on the movie document. The app reads this cached data from
 * the DB — it never calls TMDB at build or request time.
 *
 * Run it once after seeding, and again periodically (e.g. before a deploy) to
 * refresh availability:
 *
 *   npx tsx scripts/sync-tmdb.ts                # only movies not yet synced
 *   npx tsx scripts/sync-tmdb.ts --force        # re-sync everything
 *   npx tsx scripts/sync-tmdb.ts --limit 50     # first 50 (testing)
 *   npx tsx scripts/sync-tmdb.ts --id <mongoId> # a single movie
 *   npx tsx scripts/sync-tmdb.ts --delay 250    # ms between TMDB calls (default 150)
 *
 * Requires TMDB_API_KEY and MONGO_URL in .env.local (or .env).
 */

import mongoose from 'mongoose';
import { config } from 'dotenv';
config({ path: '.env.local' });
config(); // fall back to .env

import Movie from '@/lib/models/Movie';
import { fetchTmdbForMovie } from '@/lib/tmdb';
import { titleWithYear } from '@/lib/utils';

// ── Args ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
function flag(name: string): boolean {
  return args.includes(`--${name}`);
}
function opt(name: string): string | undefined {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
}

const FORCE = flag('force');
const LIMIT = opt('limit') ? parseInt(opt('limit')!, 10) : undefined;
const ONLY_ID = opt('id');
const DELAY_MS = opt('delay') ? parseInt(opt('delay')!, 10) : 150;

const MONGO_URL = process.env.MONGO_URL ?? 'mongodb://localhost:27017/filmmart';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function countProviders(wp: Record<string, { stream: unknown[]; rent: unknown[]; buy: unknown[] }>): number {
  return Object.values(wp).reduce(
    (n, r) => n + r.stream.length + r.rent.length + r.buy.length,
    0
  );
}

async function run() {
  if (!process.env.TMDB_API_KEY) {
    console.error('✗ TMDB_API_KEY is not set in .env.local / .env. Aborting.');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URL);
  console.log('Connected to', MONGO_URL);

  // Build the query: a single id, everything (--force), or only un-synced.
  const query: Record<string, unknown> = {};
  if (ONLY_ID) query._id = ONLY_ID;
  else if (!FORCE) query.tmdbSyncedAt = { $exists: false };

  let cursor = Movie.find(query).select('_id title year isSeries').sort({ _id: 1 });
  if (LIMIT) cursor = cursor.limit(LIMIT);
  const movies = await cursor.lean<
    { _id: mongoose.Types.ObjectId; title: string; year?: string; isSeries?: boolean }[]
  >();

  console.log(
    `Processing ${movies.length} movie(s) ` +
      `(${FORCE ? 'force re-sync' : ONLY_ID ? 'single id' : 'un-synced only'}, delay ${DELAY_MS}ms)\n`
  );

  const stats = { matched: 0, noMatch: 0, withProviders: 0, errors: 0 };

  for (let i = 0; i < movies.length; i++) {
    const m = movies[i];
    const label = `[${i + 1}/${movies.length}] ${titleWithYear(m.title, m.year)}`;

    try {
      const result = await fetchTmdbForMovie({
        title: m.title,
        year: m.year,
        isSeries: m.isSeries,
      });

      if (!result) {
        stats.noMatch++;
        console.log(`  ✗ ${label} — no TMDB match`);
      } else {
        const providerCount = countProviders(result.watchProviders);
        await Movie.updateOne(
          { _id: m._id },
          {
            $set: {
              tmdbId: result.tmdbId,
              watchProviders: result.watchProviders,
              tmdbSyncedAt: new Date(),
            },
          }
        );
        stats.matched++;
        if (providerCount > 0) stats.withProviders++;
        console.log(
          `  ✓ ${label} — tmdbId ${result.tmdbId}, ${providerCount} provider entr${providerCount === 1 ? 'y' : 'ies'}`
        );
      }
    } catch (err) {
      stats.errors++;
      console.log(`  ! ${label} — error: ${(err as Error).message}`);
    }

    if (DELAY_MS > 0 && i < movies.length - 1) await sleep(DELAY_MS);
  }

  console.log('\n── Summary ──────────────────────────────');
  console.log(`  Matched on TMDB:        ${stats.matched}`);
  console.log(`  With provider data:     ${stats.withProviders}`);
  console.log(`  No TMDB match:          ${stats.noMatch}`);
  console.log(`  Errors:                 ${stats.errors}`);
  console.log('─────────────────────────────────────────');

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
