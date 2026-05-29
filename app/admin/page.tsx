export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { Film, List, Users, Star, Gamepad2 } from 'lucide-react';
import { getAdminStats, getAdminMovies } from '@/lib/data/admin';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const [stats, movies] = await Promise.all([
    getAdminStats(),
    getAdminMovies(),
  ]);

  const recent = movies.slice(0, 8);

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-white text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Movies', value: stats.movies, icon: Film, color: 'text-blue-400' },
          { label: 'Games', value: stats.games, icon: Gamepad2, color: 'text-yellow-400' },
          { label: 'Lists', value: stats.lists, icon: List, color: 'text-purple-400' },
          { label: 'Users', value: stats.users, icon: Users, color: 'text-green-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 flex items-center gap-4">
            <div className={`p-2.5 rounded-lg bg-zinc-800 ${color}`}>
              <Icon size={22} aria-hidden="true" />
            </div>
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-wide">{label}</p>
              <p className="text-white text-3xl font-bold leading-tight">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent movies */}
      <div>
        <h2 className="text-white text-lg font-semibold mb-3">Recently Added</h2>
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-800/60 border-b border-zinc-700 text-left text-zinc-400">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Year</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {recent.map((movie) => (
                <tr key={movie._id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="px-4 py-3 text-white font-medium max-w-[220px] truncate">{movie.title}</td>
                  <td className="px-4 py-3 text-zinc-400">{movie.year ?? '—'}</td>
                  <td className="px-4 py-3">
                    {movie.rating != null ? (
                      <span className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                        <Star size={10} fill="currentColor" aria-hidden="true" />
                        {movie.rating.toFixed(1)}
                      </span>
                    ) : <span className="text-zinc-600">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={movie.isSeries ? 'default' : 'outline'} className="text-[11px]">
                      {movie.isSeries ? 'Series' : 'Movie'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
