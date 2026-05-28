'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ShieldOff, Trash2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { User } from '@/types';

interface Props {
  users: User[];
  currentAdminId: string;
}

export default function UsersManager({ users: initial, currentAdminId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState(initial);
  const [search, setSearch] = useState('');

  function handleToggleAdmin(user: User) {
    const action = user.isAdmin ? 'Remove admin from' : 'Make admin';
    if (!confirm(`${action} "${user.username}"?`)) return;
    startTransition(async () => {
      const res = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdmin: !user.isAdmin }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, isAdmin: !u.isAdmin } : u))
        );
      }
    });
  }

  function handleDelete(user: User) {
    if (user._id === currentAdminId) {
      alert('You cannot delete your own account.');
      return;
    }
    if (!confirm(`Delete user "${user.username}"? This cannot be undone.`)) return;
    startTransition(async () => {
      const res = await fetch(`/api/users/${user._id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
        router.refresh();
      }
    });
  }

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-white text-2xl font-bold">Users</h1>
          <p className="text-zinc-500 text-sm mt-0.5">{users.length} registered</p>
        </div>
        <input
          type="search"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
          <Users size={48} className="mb-3 opacity-40" aria-hidden="true" />
          <p className="text-sm">{search ? 'No users match your search.' : 'No users yet.'}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-800/60 border-b border-zinc-700 text-left text-zinc-400">
                  <th className="px-4 py-3 font-medium">Username</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium sr-only">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filtered.map((user) => (
                  <tr key={user._id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{user.username}</td>
                    <td className="px-4 py-3 text-zinc-400">{user.email}</td>
                    <td className="px-4 py-3">
                      {user.isAdmin ? (
                        <Badge className="bg-yellow-400/15 text-yellow-400 border-yellow-400/30 text-[11px]">Admin</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[11px] text-zinc-400">User</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => handleToggleAdmin(user)}
                          aria-label={user.isAdmin ? `Remove admin from ${user.username}` : `Make ${user.username} admin`}
                          disabled={isPending || user._id === currentAdminId}
                          title={user.isAdmin ? 'Remove admin' : 'Make admin'}
                          className="text-zinc-500 hover:text-yellow-400 transition-colors disabled:opacity-30"
                        >
                          {user.isAdmin ? <ShieldOff size={15} aria-hidden="true" /> : <Shield size={15} aria-hidden="true" />}
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          aria-label={`Delete ${user.username}`}
                          disabled={isPending || user._id === currentAdminId}
                          className="text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-30"
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
