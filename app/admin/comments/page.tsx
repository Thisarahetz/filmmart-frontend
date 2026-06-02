export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { connectDB } from '@/lib/db';
import Comment from '@/lib/models/Comment';
import { serialize } from '@/lib/utils';
import type { Comment as CommentType } from '@/types';
import AdminCommentsManager from '@/components/features/admin/CommentsManager';

export const metadata: Metadata = {
  title: 'Admin – Comments',
  robots: { index: false, follow: false },
};

export default async function AdminCommentsPage() {
  await connectDB();
  const raw = await Comment.find().sort({ createdAt: -1 }).limit(200).lean();
  const comments = serialize(raw) as unknown as CommentType[];

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-white text-2xl font-bold mb-6">Comments</h1>
      <AdminCommentsManager initialComments={comments} />
    </div>
  );
}
