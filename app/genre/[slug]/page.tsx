// SEO-friendly genre landing pages, statically rendered with ISR.
export const revalidate = 3600;
export const dynamicParams = false;

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCategoryMovies } from '@/lib/data/lists';
import { MOVIE_CATEGORIES, getCategory } from '@/lib/categories';
import CategoryGrid from '@/components/features/movies/CategoryGrid';
import MobileCategoryBar from '@/components/features/mobile/MobileCategoryBar';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export function generateStaticParams() {
  return MOVIE_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: 'Not Found' };

  const title = `${category.label} Movies – Stream, Watch & Reviews | Filmmart`;
  const description =
    category.intro?.slice(0, 160) ??
    `Browse ${category.label.toLowerCase()} movies on Filmmart: where to watch, ratings, trailers and reviews. Curated adult & arthouse cinema (18+).`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/genre/${slug}` },
    openGraph: {
      title,
      description,
      url: `/genre/${slug}`,
      type: 'website',
    },
  };
}

export default async function GenrePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const category = getCategory(slug);
  if (!category) notFound();

  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);
  // Tag-based category: include both films and series.
  const data = await getCategoryMovies(slug, page);

  return (
    <div className="bg-black min-h-screen">
      <Suspense fallback={null}>
        <MobileCategoryBar type="movies" basePath="/movies" />
      </Suspense>
      <CategoryGrid
        data={data}
        genre={slug}
        label={category.label}
        intro={category.intro}
        basePath={`/genre/${slug}`}
      />
    </div>
  );
}
