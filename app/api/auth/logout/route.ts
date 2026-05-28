import { NextResponse } from 'next/server';
import { buildClearCookie } from '@/lib/auth';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(buildClearCookie());
  return res;
}
