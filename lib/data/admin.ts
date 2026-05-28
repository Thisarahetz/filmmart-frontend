import { connectDB } from '@/lib/db';
import Movie from '@/lib/models/Movie';
import List from '@/lib/models/List';
import User from '@/lib/models/User';
import { serialize } from '@/lib/utils';
import type { Movie as MovieType, MovieList, User as UserType } from '@/types';

export async function getAdminStats() {
  await connectDB();
  const [movies, lists, users] = await Promise.all([
    Movie.countDocuments(),
    List.countDocuments(),
    User.countDocuments(),
  ]);
  return { movies, lists, users };
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
