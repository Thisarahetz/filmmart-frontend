export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { getAdminMovies } from '@/lib/data/admin';
import MoviesManager from '@/components/features/admin/MoviesManager';

export const metadata: Metadata = {
  title: 'Movies – Admin',
  robots: { index: false, follow: false },
};

export default async function AdminMoviesPage() {
  const movies = await getAdminMovies();
  return <MoviesManager movies={movies} />;
}
