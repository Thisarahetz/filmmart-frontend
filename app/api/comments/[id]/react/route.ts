import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import Comment from '@/lib/models/Comment';
import { getAuthUser } from '@/lib/auth';
import { serialize } from '@/lib/utils';

const ALLOWED_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

const schema = z.object({
  emoji: z.string().refine((e) => ALLOWED_EMOJIS.includes(e)),
});

interface Props {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: Props) {
  const authUser = await getAuthUser();
  if (!authUser) {
    return NextResponse.json({ error: 'Login required' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid emoji' }, { status: 400 });
  }

  const { id } = await params;
  const { emoji } = parsed.data;

  await connectDB();
  const comment = await Comment.findById(id);
  if (!comment) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const users: string[] = comment.reactions.get(emoji) ?? [];
  const alreadyReacted = users.includes(authUser.id);

  if (alreadyReacted) {
    comment.reactions.set(emoji, users.filter((u) => u !== authUser.id));
  } else {
    comment.reactions.set(emoji, [...users, authUser.id]);
  }

  await comment.save();
  // Re-fetch with .lean() so the reactions Map is a plain object (JSON.stringify can't serialize JS Maps)
  const updated = await Comment.findById(id).lean();
  return NextResponse.json(serialize(updated));
}
