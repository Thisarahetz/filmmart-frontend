import type { MetadataRoute } from 'next';
import { connectDB } from '@/lib/db';
import Movie from '@/lib/models/Movie';

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

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/movies`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/series`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/register`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ...movieUrls,
  ];
}
