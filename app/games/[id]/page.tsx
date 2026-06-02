export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Globe, Monitor } from 'lucide-react';
import { connectDB } from '@/lib/db';
import Game from '@/lib/models/Game';
import User from '@/lib/models/User';
import { getAuthUser } from '@/lib/auth';
import CommentSection from '@/components/features/comments/CommentSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { serialize } from '@/lib/utils';
import type { Game as GameType } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

async function getGame(id: string): Promise<GameType | null> {
  try {
    await connectDB();
    const game = await Game.findById(id).lean();
    if (!game) return null;
    return serialize(game) as unknown as GameType;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const game = await getGame(id);
  if (!game) return { title: 'Not Found' };

  return {
    title: `${game.title} – Games`,
    description: game.description ?? `${game.title} — ${game.category ?? 'Game'}. Legal status: ${game.legalStatus ?? 'Unknown'}.`,
    alternates: { canonical: `/games/${id}` },
    openGraph: {
      title: game.title,
      description: game.description,
      images: game.img ? [{ url: game.img }] : [],
    },
  };
}

export default async function GameDetailPage({ params }: Props) {
  const { id } = await params;
  const [game, authUser] = await Promise.all([getGame(id), getAuthUser()]);
  if (!game) notFound();

  await connectDB();
  const dbUser = authUser
    ? await User.findById(authUser.id).select('username').lean<{ username: string }>()
    : null;
  const authUsername = dbUser?.username;

  const isRestricted = game.legalStatus?.toLowerCase().includes('restricted');

  return (
    <div className="bg-black min-h-screen pt-14">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-1">
          <Link href="/games">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Games
          </Link>
        </Button>

        <h1 className="text-yellow-400 text-2xl sm:text-3xl font-bold leading-tight mb-4">
          {game.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          {game.category && <Badge>{game.category}</Badge>}
          {game.legalStatus && (
            <Badge
              variant="outline"
              className={isRestricted ? 'border-red-500 text-red-400' : 'border-green-500 text-green-400'}
            >
              {game.legalStatus}
            </Badge>
          )}
          {game.platform?.length > 0 && (
            <Badge variant="outline" className="gap-1">
              <Monitor size={11} aria-hidden="true" />
              {game.platform.join(', ')}
            </Badge>
          )}
        </div>

        {game.img && (
          <div className="relative w-full max-w-sm mx-auto aspect-[2/3] mb-8 rounded-lg overflow-hidden">
            <Image
              src={game.img}
              alt={`${game.title} cover`}
              fill
              sizes="(max-width: 640px) 100vw, 400px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {game.description && (
          <p className="text-gray-300 leading-relaxed mb-6">{game.description}</p>
        )}

        {game.countriesBanned && game.countriesBanned.length > 0 && (
          <div className="mb-6">
            <h2 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Globe size={16} aria-hidden="true" />
              Banned In
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {game.countriesBanned.map((country) => (
                <span
                  key={country}
                  className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full"
                >
                  {country}
                </span>
              ))}
            </div>
          </div>
        )}
        <CommentSection
          contentType="game"
          contentId={id}
          currentUserId={authUser?.id}
          currentUsername={authUsername}
          isAdmin={authUser?.isAdmin}
        />
      </div>
    </div>
  );
}
