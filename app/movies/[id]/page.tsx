// Statically render movie pages and refresh them in the background (ISR).
export const revalidate = 3600;
export const dynamicParams = true;

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Star, StarOff, ArrowLeft, Calendar, Globe, Clock } from 'lucide-react';
import { connectDB } from '@/lib/db';
import Movie from '@/lib/models/Movie';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { serialize, titleWithYear, cleanTitle } from '@/lib/utils';
import type { Movie as MovieType } from '@/types';
import AdBanner from '@/components/ads/AdBanner';
import CommentSection from '@/components/features/comments/CommentSection';
import WatchProviders from '@/components/features/movies/WatchProviders';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    await connectDB();
    const movies = await Movie.find({}, '_id').lean();
    return movies.map((m) => ({ id: (m._id as { toString(): string }).toString() }));
  } catch {
    return []; // DB unavailable at build — pages render on demand via ISR
  }
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

async function getSimilarMovies(movie: MovieType): Promise<MovieType[]> {
  if (!movie.tags?.length) return [];
  try {
    const similar = await Movie.aggregate([
      {
        $match: {
          _id: { $ne: movie._id },
          tags: { $in: movie.tags },
        },
      },
      {
        $addFields: {
          sharedTags: { $size: { $setIntersection: ['$tags', movie.tags] } },
        },
      },
      { $sort: { sharedTags: -1, rating: -1 } },
      { $limit: 12 },
    ]);
    return serialize(similar) as unknown as MovieType[];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovie(id);
  if (!movie) return { title: 'Not Found' };

  const fullTitle = titleWithYear(movie.title, movie.year);
  const pageTitle = `${fullTitle} – Where to Watch, Review | Filmmart`;
  const description =
    movie.desc?.slice(0, 160) ??
    `Where to watch ${fullTitle} — streaming, rent and buy options, ratings, trailer and reviews on Filmmart.`;

  const keywords = [
    ...(movie.tags ?? []),
    movie.genre ?? '',
    movie.country ?? '',
    movie.year ?? '',
    'where to watch',
    'streaming',
    'review',
  ].filter(Boolean);

  return {
    title: { absolute: pageTitle },
    description,
    keywords,
    alternates: { canonical: `/movies/${id}` },
    openGraph: {
      title: pageTitle,
      description,
      url: `${SITE_URL}/movies/${id}`,
      siteName: 'Filmmart',
      images: movie.img ? [{ url: movie.img, width: 700, height: 250, alt: fullTitle }] : [],
      type: movie.isSeries ? 'video.tv_show' : 'video.movie',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: movie.img ? [movie.img] : [],
    },
  };
}

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

  const similar = await getSimilarMovies(movie);

  // Read pre-fetched TMDB data from the DB (populated by scripts/sync-tmdb.ts).
  // No live TMDB call happens at build or request time.
  const watchProviders = movie.watchProviders ?? null;
  const hasWatchData = !!watchProviders && Object.keys(watchProviders).length > 0;

  const fullTitle = titleWithYear(movie.title, movie.year);
  const videoId = movie.trailer ? youtubeId(movie.trailer) : null;
  const ratingDisplay = movie.rating ? (movie.rating / 2).toFixed(1) : null;
  const starsFull = movie.rating ? Math.round(movie.rating / 2) : 0;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': movie.isSeries ? 'TVSeries' : 'Movie',
    name: movie.title,
    url: `${SITE_URL}/movies/${id}`,
    description: movie.desc,
    genre: movie.genre,
    dateCreated: movie.year,
    datePublished: movie.year,
    countryOfOrigin: movie.country,
    duration: movie.duration,
    image: movie.img,
    keywords: (movie.tags ?? []).join(', '),
    aggregateRating: movie.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: movie.rating,
          bestRating: 10,
          worstRating: 0,
          ratingCount: Math.max(movie.views ?? 1, 1),
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-black min-h-screen pt-14">
        <div className="max-w-4xl mx-auto px-4 py-8">

          <Button asChild variant="ghost" size="sm" className="mb-6 -ml-1">
            <Link href="/">
              <ArrowLeft size={16} aria-hidden="true" />
              Back
            </Link>
          </Button>

          <h1 className="text-yellow-400 text-2xl sm:text-3xl font-bold leading-tight mb-4">
            {fullTitle}
          </h1>

          {/* Meta badges */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {movie.genre && <Badge>{movie.genre}</Badge>}
            {movie.year && (
              <Badge variant="outline" className="gap-1">
                <Calendar size={11} aria-hidden="true" />
                {movie.year}
              </Badge>
            )}
            {movie.country && (
              <Badge variant="outline" className="gap-1">
                <Globe size={11} aria-hidden="true" />
                {movie.country}
              </Badge>
            )}
            {movie.duration && (
              <Badge variant="outline" className="gap-1">
                <Clock size={11} aria-hidden="true" />
                {movie.duration}
              </Badge>
            )}
            <Badge variant="outline">{movie.isSeries ? 'TV Series' : 'Movie'}</Badge>
          </div>

          {/* Tags */}
          {movie.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {movie.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1 rounded-full transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

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

          {/* Description */}
          {movie.desc && (
            <p className="text-gray-300 leading-relaxed mb-4">{movie.desc}</p>
          )}

          {/* Style */}
          {movie.style && (
            <p className="text-zinc-400 text-sm italic mb-8">
              <span className="text-zinc-500 not-italic font-medium">Style: </span>
              {movie.style}
            </p>
          )}

          {/* Where to Watch — cached TMDB streaming providers (see scripts/sync-tmdb.ts) */}
          {hasWatchData && <WatchProviders movieId={id} providers={watchProviders} />}

          <AdBanner
            slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_DETAIL ?? ''}
            format="horizontal"
            className="mb-8"
          />

          {/* Trailer + Rating */}
          <div className="flex flex-col lg:flex-row gap-8 mb-12">
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

            <aside aria-label="Rating" className="lg:w-56 shrink-0">
              <h2 className="text-white font-semibold mb-3">Rating</h2>
              <div className="bg-zinc-900 border border-white/10 rounded-lg p-4 flex flex-col items-center gap-2">
                {movie.rating ? (
                  <>
                    <div
                      className="flex text-yellow-400"
                      aria-label={`${ratingDisplay} out of 5 stars`}
                    >
                      {[...Array(5)].map((_, i) =>
                        i < starsFull ? (
                          <Star key={i} size={22} fill="currentColor" aria-hidden="true" />
                        ) : (
                          <StarOff key={i} size={22} aria-hidden="true" />
                        )
                      )}
                    </div>
                    <p className="text-yellow-300 font-bold text-xl">
                      {movie.rating.toFixed(1)} / 10
                    </p>
                  </>
                ) : (
                  <p className="text-zinc-500 text-sm">No rating yet</p>
                )}
              </div>
            </aside>
          </div>

          <CommentSection contentType="movie" contentId={id} />

          {/* Similar Movies */}
          {similar.length > 0 && (
            <section aria-labelledby="similar-heading">
              <h2
                id="similar-heading"
                className="text-white text-xl font-bold mb-4"
              >
                Similar Movies
              </h2>
              <p className="text-zinc-500 text-sm mb-4">
                Based on tags:{' '}
                {movie.tags.map((t) => (
                  <span key={t} className="text-zinc-400">#{t} </span>
                ))}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {similar.map((s) => (
                  <Link
                    key={s._id}
                    href={`/movies/${s._id}`}
                    className="group block bg-zinc-900 rounded-lg overflow-hidden border border-white/5 hover:border-yellow-400/40 transition-colors"
                  >
                    {s.img ? (
                      <div className="relative w-full aspect-[2/3]">
                        <Image
                          src={s.img}
                          alt={s.title}
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover group-hover:opacity-80 transition-opacity"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-[2/3] bg-zinc-800 flex items-center justify-center">
                        <span className="text-zinc-600 text-xs text-center px-2">{s.title}</span>
                      </div>
                    )}
                    <div className="p-2">
                      <p className="text-white text-xs font-medium line-clamp-2 leading-tight mb-1">
                        {cleanTitle(s.title)}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                        {s.year && <span>{s.year}</span>}
                        {s.rating && (
                          <span className="text-yellow-400">★ {s.rating.toFixed(1)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
