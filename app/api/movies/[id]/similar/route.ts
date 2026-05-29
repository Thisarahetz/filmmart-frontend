import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Movie from '@/lib/models/Movie';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  await connectDB();

  const movie = await Movie.findById(id).select('tags').lean();
  if (!movie || !movie.tags?.length) {
    return NextResponse.json([]);
  }

  // Aggregate: find movies sharing at least one tag, ranked by overlap count
  const similar = await Movie.aggregate([
    {
      $match: {
        _id: { $ne: new mongoose.Types.ObjectId(id) },
        tags: { $in: movie.tags },
      },
    },
    {
      $addFields: {
        sharedTags: {
          $size: { $setIntersection: ['$tags', movie.tags] },
        },
      },
    },
    { $sort: { sharedTags: -1, rating: -1 } },
    { $limit: 12 },
    {
      $project: {
        title: 1,
        img: 1,
        imgSm: 1,
        year: 1,
        genre: 1,
        rating: 1,
        tags: 1,
        isSeries: 1,
        sharedTags: 1,
      },
    },
  ]);

  return NextResponse.json(similar);
}
