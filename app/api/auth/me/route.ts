import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';

export async function GET() {
  const authUser = await getAuthUser();
  if (!authUser) {
    return NextResponse.json(null);
  }

  await connectDB();
  const user = await User.findById(authUser.id).select('username email isAdmin').lean<{
    username: string;
    email: string;
    isAdmin: boolean;
  }>();

  if (!user) {
    return NextResponse.json(null);
  }

  return NextResponse.json({
    id: authUser.id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  });
}
