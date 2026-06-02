'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { MessageSquare, Send, Trash2, ThumbsUp, MoreHorizontal, Pencil, Flag } from 'lucide-react';
import type { Comment } from '@/types';

interface Props {
  contentType: 'movie' | 'game';
  contentId: string;
  currentUserId?: string;
  currentUsername?: string;
  isAdmin?: boolean;
}

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

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

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  return (
    <div className={`shrink-0 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center select-none ${
      size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'
    }`}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

/**
 * Facebook-style thread connector that sits in the gutter to the left of a reply.
 * Draws an L-shaped curve branching from the vertical line into the reply avatar,
 * and (when `continues`) extends the vertical line down to the next reply.
 * Aligned so the vertical line falls under the parent avatar's centre (18px).
 */
function ThreadConnector({ continues }: { continues: boolean }) {
  return (
    <div className="relative w-9 shrink-0 self-stretch" aria-hidden="true">
      {/* curve: vertical drop from top + horizontal branch into the avatar */}
      <span className="absolute left-[18px] top-0 h-3.5 w-[26px] border-l border-b border-zinc-700 rounded-bl-[10px]" />
      {/* continuation of the vertical line down to the next reply (bridges the pb-3 gap) */}
      {continues && <span className="absolute left-[18px] top-3.5 -bottom-3 w-px bg-zinc-700" />}
    </div>
  );
}

/** Inline reaction summary: 😄1 👍2 — per-emoji counts at the end of the action row */
function InlineReactions({ reactions, currentUserId }: {
  reactions: Record<string, string[]>;
  currentUserId?: string;
}) {
  const entries = Object.entries(reactions ?? {})
    .filter(([, u]) => u.length > 0)
    .sort(([, a], [, b]) => b.length - a.length);
  if (entries.length === 0) return null;
  return (
    <span className="flex items-center gap-1.5 text-xs">
      {entries.map(([emoji, users]) => {
        const iReacted = currentUserId && users.includes(currentUserId);
        return (
          <span key={emoji} className={`flex items-center gap-0.5 ${iReacted ? 'text-yellow-400' : 'text-zinc-500'}`}>
            <span>{emoji}</span>
            <span>{users.length}</span>
          </span>
        );
      })}
    </span>
  );
}

/** Hover reaction picker pill */
function ReactionPicker({ onPick, onMouseEnter, onMouseLeave }: {
  onPick: (emoji: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute bottom-full left-0 mb-2 flex items-center gap-1 bg-zinc-800 border border-zinc-700 rounded-full px-3 py-2 shadow-2xl z-20"
    >
      {REACTIONS.map((emoji) => (
        <button key={emoji} type="button" onClick={() => onPick(emoji)}
          className="text-xl leading-none hover:scale-125 transition-transform duration-100 focus:outline-none"
          aria-label={emoji}>{emoji}</button>
      ))}
    </div>
  );
}

/** ... options menu — Edit / Delete / Report, shown on every comment */
function OptionsMenu({ onEdit, onDelete, onReport, canEdit, canDelete }: {
  onEdit: () => void;
  onDelete: () => void;
  onReport: () => void;
  canEdit: boolean;
  canDelete: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-zinc-600 hover:text-zinc-300 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 data-[open=true]:opacity-100"
        data-open={open}
        aria-label="More options"
      >
        <MoreHorizontal size={14} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl py-1 min-w-[130px] z-20">
          {canEdit && (
            <button
              type="button"
              onClick={() => { onEdit(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <Pencil size={12} /> Edit
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              onClick={() => { onDelete(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-zinc-800 transition-colors"
            >
              <Trash2 size={12} /> Delete
            </button>
          )}
          <button
            type="button"
            onClick={() => { onReport(); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <Flag size={12} /> Report
          </button>
        </div>
      )}
    </div>
  );
}

/** Renders reply text — highlights leading @mention bold+yellow */
function MentionText({ text }: { text: string }) {
  const match = text.match(/^(@\S+)([\s\S]*)$/);
  if (match) {
    return (
      <span className="text-zinc-300 text-xs leading-relaxed break-words">
        <span className="text-yellow-400 font-bold">{match[1]}</span>{match[2]}
      </span>
    );
  }
  return <span className="text-zinc-300 text-xs leading-relaxed break-words">{text}</span>;
}

/* ── Reply row ─────────────────────────────────────────────────────────── */

interface ReplyRowProps {
  reply: Comment;
  currentUserId?: string;
  isAdmin?: boolean;
  onDelete: (id: string) => void;
  onReact: (id: string, emoji: string) => void;
  onEdit: (id: string, text: string) => Promise<void> | void;
  onReport: (id: string) => void;
  continues: boolean;
}

function ReplyRow({ reply, currentUserId, isAdmin, onDelete, onReact, onEdit, onReport, continues }: ReplyRowProps) {
  const [pickerVisible, setPickerVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(reply.text);
  const [editSaving, setEditSaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const editRef = useRef<HTMLInputElement>(null);

  const myReaction = currentUserId
    ? Object.entries(reply.reactions ?? {}).find(([, u]) => u.includes(currentUserId))?.[0]
    : null;

  function showPicker() { clearTimeout(timerRef.current); timerRef.current = setTimeout(() => setPickerVisible(true), 350); }
  function hidePicker() { clearTimeout(timerRef.current); timerRef.current = setTimeout(() => setPickerVisible(false), 200); }

  const isOwner = currentUserId === reply.userId;
  const canDelete = !!(isAdmin || isOwner);

  function startEdit() {
    setEditText(reply.text);
    setEditing(true);
    setTimeout(() => editRef.current?.focus(), 50);
  }

  async function saveEdit() {
    if (!editText.trim() || editText.trim() === reply.text) { setEditing(false); return; }
    setEditSaving(true);
    try {
      await onEdit(reply._id, editText.trim());
      setEditing(false);
    } finally {
      setEditSaving(false);
    }
  }

  return (
    <div className="flex gap-2 items-start group pb-3">
      <ThreadConnector continues={continues} />
      <Avatar name={reply.username} size="sm" />
      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              ref={editRef}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setEditing(false);
                if (e.key === 'Enter') { e.preventDefault(); saveEdit(); }
              }}
              maxLength={1000}
              className="flex-1 bg-zinc-800 rounded-full px-3 py-1.5 text-white text-xs placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-yellow-400/40"
            />
            <button type="button" onClick={saveEdit} disabled={editSaving}
              className="text-yellow-400 disabled:text-yellow-400/50 text-xs font-semibold">Save</button>
            <button type="button" onClick={() => setEditing(false)}
              className="text-zinc-600 hover:text-zinc-400 text-xs">Cancel</button>
          </div>
        ) : (
          <>
            {/* Bubble */}
            <div className="bg-zinc-800 rounded-2xl rounded-tl-sm px-3 py-2 inline-block max-w-full">
              <p className="text-white text-xs font-semibold mb-0.5">{reply.username}</p>
              <MentionText text={reply.text} />
            </div>

            {/* Action row: Like · time · reactions · [...] */}
            <div className="flex items-center gap-3 mt-1 pl-1">
              <div className="relative" onMouseEnter={showPicker} onMouseLeave={hidePicker}>
                {pickerVisible && currentUserId && (
                  <ReactionPicker
                    onPick={(emoji) => { onReact(reply._id, emoji); setPickerVisible(false); }}
                    onMouseEnter={() => clearTimeout(timerRef.current)}
                    onMouseLeave={hidePicker}
                  />
                )}
                <button
                  type="button"
                  onClick={() => currentUserId && onReact(reply._id, '👍')}
                  className={`text-xs font-semibold transition-colors ${myReaction ? 'text-yellow-400' : 'text-zinc-500 hover:text-zinc-300'} ${!currentUserId ? 'cursor-default' : ''}`}
                >
                  {myReaction
                    ? <span>{myReaction} Like</span>
                    : <span className="flex items-center gap-1"><ThumbsUp size={11} />Like</span>}
                </button>
              </div>

              <span className="text-zinc-600 text-xs">{timeAgo(reply.createdAt)}</span>

              <InlineReactions reactions={reply.reactions} currentUserId={currentUserId} />

              {currentUserId && (
                <OptionsMenu
                  onEdit={startEdit}
                  onDelete={() => onDelete(reply._id)}
                  onReport={() => onReport(reply._id)}
                  canEdit={isOwner}
                  canDelete={canDelete}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Parent comment item ────────────────────────────────────────────────── */

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  currentUserId?: string;
  currentUsername?: string;
  isAdmin?: boolean;
  contentType: 'movie' | 'game';
  contentId: string;
  onDelete: (id: string) => void;
  onReact: (id: string, emoji: string) => void;
  onEdit: (id: string, text: string) => Promise<void> | void;
  onReport: (id: string) => void;
  onReplyPosted: (reply: Comment) => void;
}

function CommentItem({
  comment, replies, currentUserId, currentUsername, isAdmin,
  contentType, contentId, onDelete, onReact, onEdit, onReport, onReplyPosted,
}: CommentItemProps) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [editSaving, setEditSaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);
  const editRef = useRef<HTMLTextAreaElement>(null);

  const myReaction = currentUserId
    ? Object.entries(comment.reactions ?? {}).find(([, u]) => u.includes(currentUserId))?.[0]
    : null;

  const hasThread = replies.length > 0 || replyOpen;
  const visibleReplies = showAllReplies ? replies : replies.slice(0, 2);
  const hiddenCount = replies.length - 2;
  const isOwner = currentUserId === comment.userId;
  const canDelete = !!(isAdmin || isOwner);

  function showPicker() { clearTimeout(timerRef.current); timerRef.current = setTimeout(() => setPickerVisible(true), 350); }
  function hidePicker() { clearTimeout(timerRef.current); timerRef.current = setTimeout(() => setPickerVisible(false), 200); }

  function startEdit() {
    setEditText(comment.text);
    setEditing(true);
    setTimeout(() => editRef.current?.focus(), 50);
  }

  async function saveEdit() {
    if (!editText.trim() || editText.trim() === comment.text) { setEditing(false); return; }
    setEditSaving(true);
    try {
      await onEdit(comment._id, editText.trim());
      setEditing(false);
    } finally {
      setEditSaving(false);
    }
  }

  // The reply box is "empty" when it holds nothing but the auto @mention prefix.
  function replyIsEmpty() {
    const t = replyText.trim();
    return t === '' || t === `@${comment.username}`;
  }

  function openReply() {
    // Clicking Reply again closes the box if the user hasn't typed anything.
    if (replyOpen && replyIsEmpty()) {
      setReplyOpen(false);
      setReplyText('');
      return;
    }
    setReplyText(`@${comment.username} `);
    setReplyOpen(true);
    setTimeout(() => {
      if (replyInputRef.current) {
        replyInputRef.current.focus();
        const len = replyInputRef.current.value.length;
        replyInputRef.current.setSelectionRange(len, len);
      }
    }, 50);
  }

  async function submitReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplySubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType, contentId, text: replyText.trim(), parentId: comment._id }),
      });
      if (res.ok) {
        onReplyPosted(await res.json());
        setReplyText('');
        setReplyOpen(false);
        setShowAllReplies(true);
      }
    } finally {
      setReplySubmitting(false);
    }
  }

  return (
    <li>
      {/* PARENT ROW: avatar + bubble + actions */}
      <div className="flex gap-3 items-start">
        <Avatar name={comment.username} />

        <div className="flex-1 min-w-0 group">
          {editing ? (
            <div className="flex flex-col gap-2">
              <textarea
                ref={editRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setEditing(false);
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(); }
                }}
                maxLength={1000}
                rows={2}
                className="bg-zinc-800 rounded-2xl px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-yellow-400/40 resize-none"
              />
              <div className="flex items-center gap-3 pl-1">
                <button type="button" onClick={saveEdit} disabled={editSaving}
                  className="text-yellow-400 disabled:text-yellow-400/50 text-xs font-semibold">Save</button>
                <button type="button" onClick={() => setEditing(false)}
                  className="text-zinc-600 hover:text-zinc-400 text-xs">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              {/* Bubble */}
              <div className="bg-zinc-800 rounded-2xl rounded-tl-sm px-4 py-2.5 inline-block max-w-full">
                <p className="text-white text-sm font-semibold mb-0.5">{comment.username}</p>
                <p className="text-zinc-200 text-sm leading-relaxed break-words">{comment.text}</p>
              </div>

              {/* Action row: 👍 Like · Reply · time · 😄1 · [...] */}
              <div className="flex items-center gap-3 mt-1.5 pl-1">
                <div className="relative" onMouseEnter={showPicker} onMouseLeave={hidePicker}>
                  {pickerVisible && currentUserId && (
                    <ReactionPicker
                      onPick={(emoji) => { onReact(comment._id, emoji); setPickerVisible(false); }}
                      onMouseEnter={() => clearTimeout(timerRef.current)}
                      onMouseLeave={hidePicker}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => currentUserId && onReact(comment._id, '👍')}
                    className={`text-xs font-semibold transition-colors ${myReaction ? 'text-yellow-400' : 'text-zinc-500 hover:text-zinc-300'} ${!currentUserId ? 'cursor-default' : ''}`}
                  >
                    {myReaction
                      ? <span>{myReaction} Like</span>
                      : <span className="flex items-center gap-1"><ThumbsUp size={12} />Like</span>}
                  </button>
                </div>

                {currentUserId && (
                  <button type="button" onClick={openReply}
                    className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors">
                    Reply
                  </button>
                )}

                <span className="text-zinc-600 text-xs">{timeAgo(comment.createdAt)}</span>

                <InlineReactions reactions={comment.reactions} currentUserId={currentUserId} />

                {currentUserId && (
                  <OptionsMenu
                    onEdit={startEdit}
                    onDelete={() => onDelete(comment._id)}
                    onReport={() => onReport(comment._id)}
                    canEdit={isOwner}
                    canDelete={canDelete}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* THREAD: replies + inline reply input, indented under the parent avatar */}
      {hasThread && (
        <div className="mt-1">
          {visibleReplies.map((reply, i) => (
            <ReplyRow
              key={reply._id}
              reply={reply}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onDelete={onDelete}
              onReact={onReact}
              onEdit={onEdit}
              onReport={onReport}
              continues={i < visibleReplies.length - 1}
            />
          ))}

          {!showAllReplies && hiddenCount > 0 && (
            <button type="button" onClick={() => setShowAllReplies(true)}
              className="text-xs text-zinc-500 hover:text-yellow-400 transition-colors font-semibold pl-11 -mt-1 mb-2">
              View {hiddenCount} more {hiddenCount === 1 ? 'reply' : 'replies'}
            </button>
          )}

          {/* Inline reply input — sits below the last reply, indented to reply level */}
          {replyOpen && (
            <form onSubmit={submitReply} className="flex items-start gap-2">
              <div className="w-9 shrink-0" aria-hidden="true" />
              <Avatar name={currentUsername ?? '?'} size="sm" />
              <div className="flex-1 flex items-end gap-2 bg-zinc-800 rounded-2xl px-3 py-1.5 focus-within:ring-1 focus-within:ring-yellow-400/40">
                <textarea
                  ref={replyInputRef}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') { setReplyOpen(false); setReplyText(''); }
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.form?.requestSubmit(); }
                  }}
                  onBlur={() => { if (replyIsEmpty()) { setReplyOpen(false); setReplyText(''); } }}
                  placeholder={`Reply to ${comment.username}…`}
                  maxLength={500}
                  rows={1}
                  className="flex-1 bg-transparent text-white text-xs placeholder-zinc-500 focus:outline-none resize-none leading-relaxed"
                  style={{ fieldSizing: 'content' } as React.CSSProperties}
                />
                {replyText.trim() && (
                  <button type="submit" disabled={replySubmitting}
                    className="text-yellow-400 disabled:text-yellow-400/50 transition-colors shrink-0 pb-0.5"
                    aria-label="Send reply">
                    <Send size={13} />
                  </button>
                )}
              </div>
              <button type="button"
                onClick={() => { setReplyOpen(false); setReplyText(''); }}
                className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors self-center">
                Cancel
              </button>
            </form>
          )}
        </div>
      )}
    </li>
  );
}

/* ── Section ────────────────────────────────────────────────────────────── */

export default function CommentSection({ contentType, contentId, currentUserId, currentUsername, isAdmin }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments/content/${contentType}/${contentId}`);
      if (res.ok) setComments(await res.json());
    } finally {
      setLoading(false);
    }
  }, [contentType, contentId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (text.trim()) e.currentTarget.form?.requestSubmit();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType, contentId, text: text.trim(), parentId: null }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Failed'); return; }
      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setText('');
    } finally {
      setSubmitting(false);
    }
  }

  function handleDelete(id: string) {
    fetch(`/api/comments/${id}`, { method: 'DELETE' })
      .then((r) => { if (r.ok) setComments((prev) => prev.filter((c) => c._id !== id)); });
  }

  async function handleEdit(id: string, newText: string) {
    const res = await fetch(`/api/comments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText }),
    });
    if (res.ok) {
      const updated: Comment = await res.json();
      setComments((prev) => prev.map((c) => (c._id === id ? updated : c)));
    }
  }

  function handleReport(_id: string) {
    window.alert('Thanks for reporting. Our team will review this comment.');
  }

  async function handleReact(id: string, emoji: string) {
    const res = await fetch(`/api/comments/${id}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emoji }),
    });
    if (res.ok) {
      const updated: Comment = await res.json();
      setComments((prev) => prev.map((c) => (c._id === id ? updated : c)));
    }
  }

  const topLevel = comments.filter((c) => !c.parentId);
  const repliesByParent = comments.reduce<Record<string, Comment[]>>((acc, c) => {
    if (c.parentId) acc[c.parentId] = [...(acc[c.parentId] ?? []), c];
    return acc;
  }, {});

  return (
    <section className="mt-10" aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="text-white text-lg font-bold mb-5 flex items-center gap-2 border-b border-zinc-800 pb-4">
        <MessageSquare size={18} aria-hidden="true" />
        Comments
        {!loading && comments.length > 0 && (
          <span className="text-zinc-500 text-sm font-normal">· {comments.length}</span>
        )}
      </h2>

      {/* Main write-a-comment input */}
      {currentUserId ? (
        <form onSubmit={handleSubmit} className="flex gap-3 items-start mb-6">
          <Avatar name={currentUsername ?? '?'} />
          <div className="flex-1">
            <div className="flex items-end gap-2 bg-zinc-800 rounded-2xl px-4 py-2.5 focus-within:ring-1 focus-within:ring-yellow-400/40">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a comment… (Enter to post, Shift+Enter for new line)"
                maxLength={1000}
                rows={1}
                className="flex-1 bg-transparent text-white text-sm placeholder-zinc-500 focus:outline-none resize-none leading-relaxed"
                style={{ fieldSizing: 'content' } as React.CSSProperties}
              />
              {text.trim() && (
                <button type="submit" disabled={submitting}
                  className="text-yellow-400 disabled:text-yellow-400/50 transition-colors shrink-0 pb-0.5"
                  aria-label="Post comment">
                  <Send size={16} />
                </button>
              )}
            </div>
            {error && <p className="text-red-400 text-xs mt-1 pl-1">{error}</p>}
          </div>
        </form>
      ) : (
        <div className="mb-6 flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
            <MessageSquare size={16} className="text-zinc-500" />
          </div>
          <p className="text-zinc-400 text-sm">
            <Link href="/login" className="text-yellow-400 font-semibold hover:underline">Log in</Link>
            {' '}to join the conversation
          </p>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="space-y-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-zinc-800 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-14 bg-zinc-800 rounded-2xl w-2/3" />
                <div className="h-3 bg-zinc-900 rounded w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : topLevel.length === 0 ? (
        <p className="text-zinc-500 text-sm text-center py-10">No comments yet. Be the first!</p>
      ) : (
        <ul className="space-y-4">
          {topLevel.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              replies={repliesByParent[comment._id] ?? []}
              currentUserId={currentUserId}
              currentUsername={currentUsername}
              isAdmin={isAdmin}
              contentType={contentType}
              contentId={contentId}
              onDelete={handleDelete}
              onReact={handleReact}
              onEdit={handleEdit}
              onReport={handleReport}
              onReplyPosted={(r) => setComments((prev) => [...prev, r])}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
