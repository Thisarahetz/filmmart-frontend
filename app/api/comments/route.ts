import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import Comment from '@/lib/models/Comment';
import User from '@/lib/models/User';
import { getAuthUser } from '@/lib/auth';
import { serialize } from '@/lib/utils';

const schema = z.object({
  contentType: z.enum(['movie', 'game']),
  contentId: z.string().min(1),
  text: z.string().min(1).max(1000),
  parentId: z.string().optional().nullable(),
});

// Admin: list all comments
export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const limit = 50;

  await connectDB();
  const [comments, total] = await Promise.all([
    Comment.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Comment.countDocuments(),
  ]);

  return NextResponse.json({ comments: serialize(comments), total, page });
}

// Post a comment or reply (logged-in users)
export async function POST(req: NextRequest) {
  const authUser = await getAuthUser();
  if (!authUser) {
    return NextResponse.json({ error: 'Login required' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  await connectDB();
  const dbUser = await User.findById(authUser.id).select('username').lean<{ username: string }>();
  if (!dbUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const comment = await Comment.create({
    contentType: parsed.data.contentType,
    contentId: parsed.data.contentId,
    userId: authUser.id,
    username: dbUser.username,
    text: parsed.data.text.trim(),
    parentId: parsed.data.parentId ?? null,
  });

  return NextResponse.json(serialize(comment.toObject()), { status: 201 });
}
