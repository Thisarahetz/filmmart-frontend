export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { getAdminLists, getAdminMovies, getAdminGames } from '@/lib/data/admin';
import ListsManager from '@/components/features/admin/ListsManager';

export const metadata: Metadata = {
  title: 'Lists – Admin',
  robots: { index: false, follow: false },
};

export default async function AdminListsPage() {
  const [lists, allMovies, allGames] = await Promise.all([
    getAdminLists(),
    getAdminMovies(),
    getAdminGames(),
  ]);
  return <ListsManager lists={lists} allMovies={allMovies} allGames={allGames} />;
}
