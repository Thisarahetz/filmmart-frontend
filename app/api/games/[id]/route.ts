import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Game from '@/lib/models/Game';
import { getAuthUser } from '@/lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const game = await Game.findById(id).lean();
  if (!game) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(game);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  await connectDB();
  const updated = await Game.findByIdAndUpdate(id, { $set: body }, { new: true });
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  await connectDB();
  const deleted = await Game.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
