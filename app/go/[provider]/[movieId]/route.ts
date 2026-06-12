import { NextResponse, type NextRequest } from 'next/server';
import { resolveProviderUrl } from '@/lib/affiliates';

/**
 * Outbound redirect for "Where to Watch" provider links.
 *   /go/{provider}/{movieId}?to={originalUrl}
 *
 * Resolves the destination via lib/affiliates.ts (affiliate template if set,
 * otherwise the allow-listed original URL). Keeps affiliate config in one place
 * and prevents bare affiliate URLs from being indexed (links are rel="sponsored
 * nofollow" and the destination is decided server-side).
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string; movieId: string }> }
) {
  const { provider, movieId } = await params;
  const fallback = req.nextUrl.searchParams.get('to');

  const dest = resolveProviderUrl(provider, movieId, fallback);
  if (!dest) {
    // Nothing safe to redirect to — send the visitor back to the movie page.
    return NextResponse.redirect(new URL(`/movies/${movieId}`, req.url), 302);
  }

  return NextResponse.redirect(dest, 302);
}
