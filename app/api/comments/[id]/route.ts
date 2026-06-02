import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import Comment from '@/lib/models/Comment';
import { getAuthUser } from '@/lib/auth';
import { serialize } from '@/lib/utils';

interface Props {
  params: Promise<{ id: string }>;
}

const editSchema = z.object({
  text: z.string().min(1).max(1000),
});

// Comment owner can edit their own text
export async function PATCH(req: NextRequest, { params }: Props) {
  const authUser = await getAuthUser();
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = editSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { id } = await params;
  await connectDB();
  const comment = await Comment.findById(id);
  if (!comment) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (comment.userId !== authUser.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  comment.text = parsed.data.text.trim();
  await comment.save();
  const updated = await Comment.findById(id).lean();
  return NextResponse.json(serialize(updated));
}

// Admin or comment owner can delete
export async function DELETE(_req: NextRequest, { params }: Props) {
  const authUser = await getAuthUser();
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();
  const comment = await Comment.findById(id);
  if (!comment) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const isOwner = comment.userId === authUser.id;
  if (!isOwner && !authUser.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await comment.deleteOne();
  return NextResponse.json({ ok: true });
}
