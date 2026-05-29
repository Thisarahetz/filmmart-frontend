import { connectDB } from '@/lib/db';
import Game from '@/lib/models/Game';
import { serialize } from '@/lib/utils';
import type { Game as GameType } from '@/types';

const PAGE_SIZE = 24;

export async function getGamesByCategory(
  category?: string,
  page = 1
): Promise<{ games: GameType[]; total: number; page: number; totalPages: number }> {
  await connectDB();

  const filter: Record<string, unknown> = category ? { category } : {};
  const skip = (page - 1) * PAGE_SIZE;

  const [games, total] = await Promise.all([
    Game.find(filter).sort({ title: 1 }).skip(skip).limit(PAGE_SIZE).lean(),
    Game.countDocuments(filter),
  ]);

  return {
    games: serialize(games) as unknown as GameType[],
    total,
    page,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}

export async function getAllGamesGroupedByCategory(): Promise<
  { category: string; games: GameType[] }[]
> {
  await connectDB();

  const categories = await Game.distinct('category');

  const groups = await Promise.all(
    categories
      .filter(Boolean)
      .sort()
      .map(async (category: string) => {
        const games = await Game.find({ category })
          .sort({ title: 1 })
          .limit(20)
          .lean();
        return { category, games: serialize(games) as unknown as GameType[] };
      })
  );

  return groups.filter((g) => g.games.length > 0);
}

export async function getFeaturedGames(limit = 12): Promise<GameType[]> {
  await connectDB();
  const games = await Game.aggregate([{ $sample: { size: limit } }]);
  return serialize(games) as unknown as GameType[];
}

export async function getTrendingGames(limit = 20): Promise<GameType[]> {
  await connectDB();
  const games = await Game.find().sort({ views: -1, title: 1 }).limit(limit).lean();
  return serialize(games) as unknown as GameType[];
}
