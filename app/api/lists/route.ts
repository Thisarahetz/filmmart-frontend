import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { PipelineStage } from 'mongoose';
import { connectDB } from '@/lib/db';
import List from '@/lib/models/List';
import { getAuthUser } from '@/lib/auth';

const schema = z.object({
  title: z.string().min(1),
  type: z.string().optional(),
  genre: z.string().optional(),
  content: z.array(z.string()).default([]),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') ?? undefined;
  const genre = searchParams.get('genre') ?? undefined;

  await connectDB();

  const matchStage: Record<string, string> = {};
  if (type) matchStage.type = type;
  if (genre) matchStage.genre = genre;

  const pipeline: PipelineStage[] = [{ $sample: { size: 10 } }];
  if (Object.keys(matchStage).length) pipeline.push({ $match: matchStage });

  const lists = await List.aggregate(pipeline);
  return NextResponse.json(lists);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  await connectDB();
  const list = await List.create(parsed.data);
  return NextResponse.json(list, { status: 201 });
}
