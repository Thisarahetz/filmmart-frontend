import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import Movie from '@/lib/models/Movie';
import { getAuthUser } from '@/lib/auth';

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
  genre: z.string().optional(),
  rating: z.number().min(0).max(10).optional(),
  quality: z.string().optional(),
  isSeries: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
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
    return NextResponse.json(movie, { status: 201 });
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 11000) {
      return NextResponse.json({ error: 'Movie title already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
