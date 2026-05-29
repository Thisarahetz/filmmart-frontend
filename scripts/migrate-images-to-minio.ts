/**
 * Migrate movie images to MinIO.
 *
 * Downloads every external img/imgSm URL from MongoDB, uploads to MinIO,
 * and updates the movie record with the new MinIO URL.
 *
 * Usage:
 *   npx tsx scripts/migrate-images-to-minio.ts
 *
 * Requires in .env.local:
 *   MONGO_URL, MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY,
 *   MINIO_BUCKET, MINIO_PUBLIC_BASE_URL, MINIO_REGION
 */

import mongoose from 'mongoose';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import { config } from 'dotenv';
config({ path: '.env.local' });
config(); // also load .env as fallback

// ── Config ────────────────────────────────────────────────────────────────────

const MONGO_URL   = process.env.MONGO_URL  ?? 'mongodb://localhost:27017/filmmart';
const BUCKET      = process.env.MINIO_BUCKET ?? 'movies';
const PUBLIC_BASE = (process.env.MINIO_PUBLIC_BASE_URL ?? '').replace(/\/$/, '');
const REGION      = process.env.MINIO_REGION ?? 'us-east-1';

// The public endpoint includes a path prefix (/minio) that the reverse proxy
// strips before forwarding to MinIO. We sign requests WITHOUT the prefix
// (so signatures match what MinIO sees), then add the prefix in a middleware
// so the HTTP request goes to the correct URL.
const rawEndpoint = (process.env.MINIO_ENDPOINT ?? 'http://localhost:9000').replace(/\/$/, '');
const endpointUrl = new URL(rawEndpoint);
const pathPrefix  = endpointUrl.pathname.replace(/\/$/, ''); // e.g. "/minio"
const baseEndpoint = `${endpointUrl.protocol}//${endpointUrl.host}`;   // e.g. "https://api.saferide.lk"

const s3 = new S3Client({
  endpoint: baseEndpoint,
  region: REGION,
  credentials: {
    accessKeyId:     process.env.MINIO_ACCESS_KEY ?? '',
    secretAccessKey: process.env.MINIO_SECRET_KEY ?? '',
  },
  forcePathStyle: true,
});

// Add path prefix AFTER signing so MinIO's signature check passes
if (pathPrefix) {
  s3.middlewareStack.add(
    (next) => async (args) => {
      const req = args.request as { path?: string };
      if (req?.path !== undefined) {
        req.path = pathPrefix + req.path;
      }
      return next(args);
    },
    { step: 'finalizeRequest', priority: 'low', name: 'MinioPathPrefix' }
  );
}

// ── Schema ────────────────────────────────────────────────────────────────────

const MovieSchema = new mongoose.Schema(
  { title: { type: String, required: true }, img: String, imgTitle: String, imgSm: String },
  { strict: false, timestamps: true }
);
const Movie = mongoose.models.Movies ?? mongoose.model('Movies', MovieSchema);

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function extFromUrl(url: string): string {
  const p = url.split('?')[0];
  const ext = path.extname(p).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg';
}

function isExternal(url: string | undefined): boolean {
  if (!url || !url.startsWith('http')) return false;
  if (!PUBLIC_BASE) return true; // no MinIO base configured → treat all http URLs as external
  return !url.startsWith(PUBLIC_BASE);
}

async function objectExists(key: string): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function downloadBuffer(url: string): Promise<{ buf: Buffer; contentType: string }> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; filmmart-migrator/1.0)' },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const contentType = res.headers.get('content-type') ?? 'image/jpeg';
  const buf = Buffer.from(await res.arrayBuffer());
  return { buf, contentType };
}

async function uploadToMinio(key: string, buf: Buffer, contentType: string): Promise<string> {
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buf,
    ContentType: contentType,
    ACL: 'public-read',
  }));
  return `${PUBLIC_BASE}/${BUCKET}/${key}`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function migrate() {
  console.log(`Connecting to MongoDB: ${MONGO_URL}`);
  await mongoose.connect(MONGO_URL);
  console.log('Connected.\n');

  // Fetch all movies that have any img URL set; filter externals in JS
  const movies = await Movie.find({
    $or: [
      { img:   { $regex: '^http' } },
      { imgSm: { $regex: '^http' } },
    ],
  })
    .select('_id title img imgSm')
    .lean();

  // Filter out movies whose images already live on MinIO
  const toMigrate = movies.filter(
    (m: { img?: string; imgSm?: string }) => isExternal(m.img) || isExternal(m.imgSm)
  );

  console.log(`Found ${toMigrate.length} movies with external image URLs.\n`);

  let updated = 0, skipped = 0, failed = 0;

  for (let i = 0; i < toMigrate.length; i++) {
    const m = toMigrate[i] as { _id: mongoose.Types.ObjectId; title: string; img?: string; imgSm?: string };
    const tag = `[${i + 1}/${toMigrate.length}]`;
    const slug = slugify(m.title);
    const updates: Partial<{ img: string; imgSm: string }> = {};

    if (isExternal(m.img)) {
      try {
        const key = `posters/${slug}${extFromUrl(m.img!)}`;
        if (await objectExists(key)) {
          updates.img = `${PUBLIC_BASE}/${BUCKET}/${key}`;
        } else {
          const { buf, contentType } = await downloadBuffer(m.img!);
          updates.img = await uploadToMinio(key, buf, contentType);
        }
        // Mirror to imgSm unless it's a distinct URL
        if (!isExternal(m.imgSm) || m.imgSm === m.img) {
          updates.imgSm = updates.img;
        }
        process.stdout.write(`${tag} ✓ ${m.title.slice(0, 55)}\n`);
      } catch (err) {
        process.stdout.write(`${tag} ✗ ${(err as Error).message} — ${m.title.slice(0, 40)}\n`);
        failed++;
        continue;
      }
    }

    if (isExternal(m.imgSm) && m.imgSm !== m.img) {
      try {
        const key = `thumbnails/${slug}${extFromUrl(m.imgSm!)}`;
        if (await objectExists(key)) {
          updates.imgSm = `${PUBLIC_BASE}/${BUCKET}/${key}`;
        } else {
          const { buf, contentType } = await downloadBuffer(m.imgSm!);
          updates.imgSm = await uploadToMinio(key, buf, contentType);
        }
      } catch (err) {
        process.stdout.write(`  imgSm failed: ${(err as Error).message}\n`);
      }
    }

    if (Object.keys(updates).length === 0) {
      skipped++;
      continue;
    }

    await Movie.updateOne({ _id: m._id }, { $set: updates });
    updated++;
  }

  console.log('\n─────────────────────────────────────────────');
  console.log(`✅  updated=${updated}  skipped=${skipped}  failed=${failed}`);
  console.log('─────────────────────────────────────────────\n');

  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
