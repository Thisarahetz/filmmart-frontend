import type { MetadataRoute } from 'next';
import { connectDB } from '@/lib/db';
import Movie from '@/lib/models/Movie';
import { MOVIE_CATEGORIES } from '@/lib/categories';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let movieUrls: MetadataRoute.Sitemap = [];

  try {
    await connectDB();
    const movies = await Movie.find({}, '_id updatedAt').lean();
    movieUrls = movies.map((m) => ({
      url: `${BASE}/movies/${m._id}`,
      lastModified: new Date(m.updatedAt as Date),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));
  } catch {
    // DB unavailable at build time — static routes still included
  }

  const genreUrls: MetadataRoute.Sitemap = MOVIE_CATEGORIES.map((c) => ({
    url: `${BASE}/genre/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/movies`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/series`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/games`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    ...genreUrls,
    { url: `${BASE}/register`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/dmca`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/cookie-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/age-disclaimer`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    ...movieUrls,
  ];
}
