import { connectDB } from '@/lib/db';
import Movie from '@/lib/models/Movie';
import List from '@/lib/models/List';
import User from '@/lib/models/User';
import Game from '@/lib/models/Game';
import Comment from '@/lib/models/Comment';
import { serialize } from '@/lib/utils';
import type { Movie as MovieType, MovieList, User as UserType, Game as GameType } from '@/types';

export async function getAdminStats() {
  await connectDB();
  const [movies, lists, users, games, comments] = await Promise.all([
    Movie.countDocuments(),
    List.countDocuments(),
    User.countDocuments(),
    Game.countDocuments(),
    Comment.countDocuments(),
  ]);
  return { movies, lists, users, games, comments };
}

export async function getAdminMovies(): Promise<MovieType[]> {
  await connectDB();
  const movies = await Movie.find().sort({ createdAt: -1 }).lean();
  return serialize(movies) as unknown as MovieType[];
}

export async function getAdminLists(): Promise<MovieList[]> {
  await connectDB();
  const lists = await List.find().sort({ createdAt: -1 }).lean();
  return serialize(lists) as unknown as MovieList[];
}

export async function getAdminUsers(): Promise<UserType[]> {
  await connectDB();
  const users = await User.find({}, '-password').sort({ createdAt: -1 }).lean();
  return serialize(users) as unknown as UserType[];
}

export async function getAdminGames(): Promise<GameType[]> {
  await connectDB();
  const games = await Game.find().sort({ createdAt: -1 }).lean();
  return serialize(games) as unknown as GameType[];
}
