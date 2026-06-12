import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import Movie from '@/lib/models/Movie';
import { getAuthUser } from '@/lib/auth';
import { fetchTmdbForMovie } from '@/lib/tmdb';

const schema = z.object({
  title: z.string().min(1),
  desc: z.string().optional(),
  img: z.string().url().optional().or(z.literal('')),
  imgTitle: z.string().url().optional().or(z.literal('')),
  imgSm: z.string().url().optional().or(z.literal('')),
  trailer: z.string().optional(),
  video: z.string().optional(),
  year: z.string().optional(),
  limit: z.number().optional(),
  rating: z.number().min(0).max(10).optional(),
  isSeries: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  tmdbId: z.number().optional(),
  country: z.string().optional(),
  duration: z.string().optional(),
  story: z.string().optional(),
  style: z.string().optional(),
  plot: z.string().optional(),
  sourceUrl: z.string().optional(),
});

export async function GET() {
  await connectDB();
  const movies = await Movie.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(movies);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  await connectDB();
  try {
    const movie = await Movie.create(parsed.data);

    // Auto-fetch TMDB "Where to Watch" data for the new movie. Best-effort:
    // any failure (or a missing TMDB_API_KEY) leaves the movie created without
    // providers — it can be backfilled later with `npm run sync:tmdb`.
    try {
      const tmdb = await fetchTmdbForMovie({
        tmdbId: movie.tmdbId,
        title: movie.title,
        year: movie.year,
        isSeries: movie.isSeries,
      });
      if (tmdb) {
        movie.tmdbId = tmdb.tmdbId;
        movie.watchProviders = tmdb.watchProviders;
        movie.tmdbSyncedAt = new Date();
        await movie.save();
      }
    } catch {
      // ignore — TMDB lookup is non-critical to movie creation
    }

    return NextResponse.json(movie, { status: 201 });
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 11000) {
      return NextResponse.json({ error: 'Movie title already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
