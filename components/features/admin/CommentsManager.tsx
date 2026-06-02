'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Film, Gamepad2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Comment } from '@/types';

interface Props {
  initialComments: Comment[];
}

export default function AdminCommentsManager({ initialComments }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [filter, setFilter] = useState<'all' | 'movie' | 'game'>('all');

  async function handleDelete(id: string) {
    const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c._id !== id));
    }
  }

  const filtered = filter === 'all' ? comments : comments.filter((c) => c.contentType === filter);

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d}d ago`;
    return new Date(dateStr).toLocaleDateString();
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(['all', 'movie', 'game'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === t
                ? 'bg-yellow-400 text-black'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {t === 'all' ? `All (${comments.length})` : t === 'movie' ? `Movies (${comments.filter((c) => c.contentType === 'movie').length})` : `Games (${comments.filter((c) => c.contentType === 'game').length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-zinc-500 text-sm text-center py-12">No comments yet.</p>
      ) : (
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-800/60 border-b border-zinc-700 text-left text-zinc-400">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Comment</th>
                <th className="px-4 py-3 font-medium">Content</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filtered.map((comment) => (
                <tr key={comment._id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="px-4 py-3 text-yellow-400 font-medium whitespace-nowrap">
                    {comment.username}
                  </td>
                  <td className="px-4 py-3 text-zinc-300 max-w-xs">
                    <span className="line-clamp-2">{comment.text}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/${comment.contentType}s/${comment.contentId}`}
                      target="_blank"
                      className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
                    >
                      {comment.contentType === 'movie' ? (
                        <Film size={13} aria-hidden="true" />
                      ) : (
                        <Gamepad2 size={13} aria-hidden="true" />
                      )}
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {comment.contentType}
                      </Badge>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 whitespace-nowrap text-xs">
                    {timeAgo(comment.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="text-zinc-600 hover:text-red-400 transition-colors"
                      aria-label="Delete comment"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
