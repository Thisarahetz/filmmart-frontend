import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Comment from '@/lib/models/Comment';
import { serialize } from '@/lib/utils';

interface Props {
  params: Promise<{ contentType: string; contentId: string }>;
}

export async function GET(_req: NextRequest, { params }: Props) {
  const { contentType, contentId } = await params;
  if (contentType !== 'movie' && contentType !== 'game') {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
  }

  await connectDB();
  const comments = await Comment.find({ contentType, contentId })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return NextResponse.json(serialize(comments));
}
