import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import Game from '@/lib/models/Game';
import { getAuthUser } from '@/lib/auth';

const schema = z.object({
  title: z.string().min(1),
  category: z.string().optional(),
  description: z.string().optional(),
  img: z.string().url().optional().or(z.literal('')),
  video: z.string().optional(),
  legalStatus: z.string().optional(),
  platform: z.array(z.string()).default([]),
  countriesBanned: z.array(z.string()).default([]),
  rating: z.number().min(0).max(10).optional(),
});

const CATEGORY_MAP: Record<string, string> = {
  'sexual-adult-content': 'Sexual/Adult Content',
  'extreme-violence-adult-content': 'Extreme Violence/Adult Content',
  'psychological-horror': 'Psychological Horror',
  'extreme-violence': 'Extreme Violence',
  'extreme-violence-horror': 'Extreme Violence/Horror',
  'dark-adult-content': 'Dark/Adult Content',
  'sexual-adult-content-extreme-violence': 'Sexual/Adult Content/Extreme Violence',
  'extreme-violence-hate-speech': 'Extreme Violence/Hate Speech',
  'sexual-adult-content-horror': 'Sexual/Adult Content/Horror',
  'manipulation-predatory-behavior': 'Manipulation/Predatory Behavior',
  'extreme-violence-inappropriate-content': 'Extreme Violence/Inappropriate Content',
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryParam = searchParams.get('category') || undefined;
  const category = categoryParam ? (CATEGORY_MAP[categoryParam] ?? categoryParam) : undefined;
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);

  await connectDB();

  const PAGE_SIZE = 24;
  const filter: Record<string, unknown> = category ? { category } : {};
  const skip = (page - 1) * PAGE_SIZE;

  const [games, total] = await Promise.all([
    Game.find(filter).sort({ title: 1 }).skip(skip).limit(PAGE_SIZE).lean(),
    Game.countDocuments(filter),
  ]);

  return NextResponse.json({
    games,
    total,
    page,
    totalPages: Math.ceil(total / PAGE_SIZE),
  });
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
    const game = await Game.create(parsed.data);
    return NextResponse.json(game, { status: 201 });
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 11000) {
      return NextResponse.json({ error: 'Game title already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
