export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Star, StarOff, ArrowLeft, Calendar, Tag } from 'lucide-react';
import { connectDB } from '@/lib/db';
import Movie from '@/lib/models/Movie';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { serialize } from '@/lib/utils';
import type { Movie as MovieType } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

async function getMovie(id: string): Promise<MovieType | null> {
  try {
    await connectDB();
    const movie = await Movie.findById(id).lean();
    if (!movie) return null;
    return serialize(movie) as unknown as MovieType;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovie(id);
  if (!movie) return { title: 'Not Found' };

  return {
    title: movie.title,
    description: movie.desc ?? `Watch ${movie.title} on Filmmart.`,
    alternates: { canonical: `/movies/${id}` },
    openGraph: {
      title: movie.title,
      description: movie.desc ?? `Watch ${movie.title} on Filmmart.`,
      images: movie.img ? [{ url: movie.img, width: 700, height: 250 }] : [],
      type: movie.isSeries ? 'video.tv_show' : 'video.movie',
    },
    twitter: {
      card: 'summary_large_image',
      title: movie.title,
      description: movie.desc,
      images: movie.img ? [movie.img] : [],
    },
  };
}

/** Extract YouTube video ID so we can embed it cleanly */
function youtubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}

export default async function MovieDetailPage({ params }: Props) {
  const { id } = await params;
  const movie = await getMovie(id);
  if (!movie) notFound();

  const videoId = movie.trailer ? youtubeId(movie.trailer) : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': movie.isSeries ? 'TVSeries' : 'Movie',
    name: movie.title,
    description: movie.desc,
    genre: movie.genre,
    dateCreated: movie.year,
    image: movie.img,
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-black min-h-screen pt-14">
        <div className="max-w-4xl mx-auto px-4 py-8">

          {/* Back link */}
          <Button asChild variant="ghost" size="sm" className="mb-6 -ml-1">
            <Link href="/">
              <ArrowLeft size={16} aria-hidden="true" />
              Back
            </Link>
          </Button>

          {/* Title */}
          <h1 className="text-yellow-400 text-2xl sm:text-3xl font-bold leading-tight mb-6">
            {movie.title}
          </h1>

          {/* Poster */}
          {(movie.img || movie.imgSm) && (
            <div className="relative w-full max-w-xl mx-auto h-64 sm:h-72 mb-8 rounded-lg overflow-hidden">
              <Image
                src={movie.img || movie.imgSm || ''}
                alt={`${movie.title} poster`}
                fill
                sizes="(max-width: 640px) 100vw, 700px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Meta badges */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {movie.genre && <Badge>{movie.genre}</Badge>}
            {movie.year && (
              <Badge variant="outline" className="gap-1">
                <Calendar size={11} aria-hidden="true" />
                {movie.year}
              </Badge>
            )}
            {movie.limit && (
              <Badge variant="outline">
                <Tag size={11} className="mr-1" aria-hidden="true" />
                +{movie.limit}
              </Badge>
            )}
            <Badge variant="outline">{movie.isSeries ? 'TV Series' : 'Movie'}</Badge>
          </div>

          {/* Description */}
          {movie.desc && (
            <p className="text-gray-300 leading-relaxed mb-8">{movie.desc}</p>
          )}

          {/* Trailer + info row */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Trailer embed */}
            {videoId && (
              <div className="flex-1">
                <h2 className="text-white font-semibold mb-3">Trailer</h2>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                  <iframe
                    title={`${movie.title} trailer`}
                    src={`https://www.youtube.com/embed/${videoId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Rating panel */}
            <aside aria-label="Rating" className="lg:w-56 shrink-0">
              <h2 className="text-white font-semibold mb-3">Filmmart Rating</h2>
              <div className="bg-zinc-900 border border-white/10 rounded-lg p-4 flex flex-col items-center gap-2">
                <div
                  className="flex text-yellow-400"
                  aria-label="4 out of 5 stars"
                >
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} size={22} fill="currentColor" aria-hidden="true" />
                  ))}
                  <StarOff size={22} aria-hidden="true" />
                </div>
                <p className="text-yellow-300 font-bold text-xl">4.0 / 5.0</p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
