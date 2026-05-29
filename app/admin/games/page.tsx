export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { getAdminGames } from '@/lib/data/admin';
import GamesManager from '@/components/features/admin/GamesManager';

export const metadata: Metadata = {
  title: 'Games – Admin',
  robots: { index: false, follow: false },
};

export default async function AdminGamesPage() {
  const games = await getAdminGames();
  return <GamesManager games={games} />;
}
