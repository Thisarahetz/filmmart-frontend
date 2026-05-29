/**
 * Migration seed — run with:  npx tsx scripts/seed.ts
 *
 * - Clears all existing movies and lists
 * - Imports 1,497 movies from bestsimilar_movies.json
 * - Deduplicates by title (merges tags)
 * - Builds tag-based lists
 * - Creates admin user if not present
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import 'dotenv/config';

// ── Inline schemas ────────────────────────────────────────────────────────────

const MovieSchema = new mongoose.Schema(
  {
    title:     { type: String, required: true, unique: true },
    desc:      String,
    img:       String,
    imgTitle:  String,
    imgSm:     String,
    trailer:   String,
    video:     String,
    year:      String,
    limit:     Number,
    genre:     String,
    rating:    { type: Number, min: 0, max: 10 },
    quality:   String,
    isSeries:  { type: Boolean, default: false },
    tags:      { type: [String], default: [], index: true },
    country:   String,
    duration:  String,
    story:     String,
    style:     String,
    plot:      String,
    sourceUrl: String,
  },
  { timestamps: true }
);

const ListSchema = new mongoose.Schema(
  {
    title:   { type: String, required: true, unique: true },
    type:    String,
    genre:   String,
    content: [String],
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    username:   { type: String, required: true, unique: true },
    email:      { type: String, required: true, unique: true },
    password:   { type: String, required: true },
    profilePic: { type: String, default: '' },
    isAdmin:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Movie = mongoose.models.Movies || mongoose.model('Movies', MovieSchema);
const List  = mongoose.models.List   || mongoose.model('List', ListSchema);
const User  = mongoose.models.User   || mongoose.model('User', UserSchema);

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractYear(title: string): string | undefined {
  const m = title.match(/\((\d{4})\)\s*$/);
  return m ? m[1] : undefined;
}

function cleanTitle(title: string): string {
  return title.replace(/\s*\(\d{4}\)\s*$/, '').trim();
}

function isValidImageUrl(url: string): boolean {
  return url.startsWith('http') && !url.includes('32895.jpg'); // placeholder thumb
}

// ── Load JSON ─────────────────────────────────────────────────────────────────

interface RawEntry {
  tag: string;
  title: string;
  url: string;
  image_url: string;
  rating: string;
  genre: string;
  country: string;
  duration: string;
  story: string;
  style: string;
  plot: string;
}

const jsonPath = path.resolve(
  '/Users/thisarahettikankanama/Downloads/bestsimilar_scraper/bestsimilar_movies.json'
);
const raw: RawEntry[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// ── Deduplicate by title, merge tags ─────────────────────────────────────────

function buildMovies() {
  const map = new Map<string, ReturnType<typeof toDoc>>();

  for (const entry of raw) {
    const key = entry.title.toLowerCase().trim();
    if (map.has(key)) {
      // merge tag into existing
      const existing = map.get(key)!;
      if (!existing.tags.includes(entry.tag)) {
        existing.tags.push(entry.tag);
      }
    } else {
      map.set(key, toDoc(entry));
    }
  }

  return [...map.values()];
}

function toDoc(entry: RawEntry) {
  const year = extractYear(entry.title);
  const img  = isValidImageUrl(entry.image_url) ? entry.image_url : undefined;

  return {
    title:     entry.title.trim(),
    year,
    rating:    entry.rating ? parseFloat(entry.rating) : undefined,
    genre:     entry.genre  || undefined,
    country:   entry.country || undefined,
    duration:  entry.duration || undefined,
    desc:      entry.story  || undefined,
    story:     entry.story  || undefined,
    style:     entry.style  || undefined,
    plot:      entry.plot   || undefined,
    img,
    imgSm:     img,
    sourceUrl: entry.url   || undefined,
    isSeries:  /\b(series|season|the series)\b/i.test(entry.title),
    tags:      [entry.tag],
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function seed() {
  const url = process.env.MONGO_URL ?? 'mongodb://localhost:27017/filmmart';
  console.log(`Connecting to ${url} …`);
  await mongoose.connect(url);
  console.log('Connected.\n');

  // Clear existing movies and lists
  await Promise.all([Movie.deleteMany({}), List.deleteMany({})]);
  console.log('Cleared existing movies and lists.');

  const movies = buildMovies();
  console.log(`Preparing ${movies.length} unique movies …`);

  // Insert in batches to avoid document-size limits
  const BATCH = 200;
  let inserted = 0;
  for (let i = 0; i < movies.length; i += BATCH) {
    const batch = movies.slice(i, i + BATCH);
    try {
      await Movie.insertMany(batch, { ordered: false });
      inserted += batch.length;
    } catch (err: unknown) {
      // ordered:false continues on duplicate key — count actual inserts
      const e = err as { insertedDocs?: unknown[] };
      inserted += e.insertedDocs?.length ?? 0;
    }
  }
  console.log(`Inserted ${inserted} movies.`);

  // Build per-tag lists
  const allTags = [...new Set(raw.map(e => e.tag))].sort();
  const lists = [];

  for (const tag of allTags) {
    const docs = await Movie.find({ tags: tag }).select('_id').limit(50).lean();
    if (docs.length === 0) continue;
    lists.push({
      title: tag.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      type:  'movie',
      genre: tag,
      content: (docs as unknown as { _id: mongoose.Types.ObjectId }[]).map((d) => d._id.toString()),
    });
  }

  // Top-rated across all
  const topRated = await Movie.find({ rating: { $gte: 7 } })
    .sort({ rating: -1 })
    .limit(20)
    .select('_id')
    .lean();

  lists.unshift({
    title:   'Top Rated',
    type:    'movie',
    genre:   undefined as unknown as string,
    content: (topRated as unknown as { _id: mongoose.Types.ObjectId }[]).map((d) => d._id.toString()),
  });

  await List.insertMany(lists, { ordered: false });
  console.log(`Inserted ${lists.length} lists (1 top-rated + ${allTags.length} tag lists).`);

  // Ensure admin user exists
  const existing = await User.findOne({ email: 'admin@filmmart.com' });
  if (!existing) {
    const hashed = await bcrypt.hash('admin123', 12);
    await User.create({
      username: 'admin',
      email:    'admin@filmmart.com',
      password: hashed,
      isAdmin:  true,
    });
    console.log('Created admin user.');
  } else {
    console.log('Admin user already exists — skipped.');
  }

  console.log('\n✅ Migration complete!\n');
  console.log('  Admin login  →  admin@filmmart.com / admin123');
  console.log('  Movies       →  ' + inserted);
  console.log('  App          →  http://localhost:3001\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
