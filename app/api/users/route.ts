import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const authUser = await getAuthUser();
  if (!authUser?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await connectDB();
  const { searchParams } = new URL(req.url);
  const isNew = searchParams.get('new') === 'true';

  const query = User.find({}, '-password');
  if (isNew) query.sort({ _id: -1 }).limit(5);

  const users = await query.lean();
  return NextResponse.json(users);
}
