/**
 * Affiliate URL configuration for outbound "Where to Watch" links.
 *
 * Every provider link on a movie page is wrapped in the `/go/[provider]/[movieId]`
 * redirect route. That route calls `resolveProviderUrl()` below to decide where to
 * actually send the visitor. To monetise a provider later, just add an entry here —
 * no component changes required.
 *
 * Template placeholders:
 *   {movieId} — Filmmart's internal movie id
 *   {url}     — the original (TMDB/JustWatch) destination, URL-encoded
 *
 * Keys are provider *slugs* (see `providerSlug()`), e.g. "netflix", "amazon-prime-video".
 */

export interface AffiliateConfig {
  /** Affiliate deep-link template. If omitted, the fallback URL is used. */
  template?: string;
}

export const AFFILIATES: Record<string, AffiliateConfig> = {
  // Examples — fill in real affiliate templates when programmes are approved:
  // netflix: { template: 'https://www.netflix.com/?affId=XXXX&u={url}' },
  // 'amazon-prime-video': { template: 'https://www.amazon.de/?tag=filmmart-21&u={url}' },
};

/** Hosts we are willing to redirect to when no affiliate template is configured. */
const ALLOWED_FALLBACK_HOSTS = [
  'themoviedb.org',
  'www.themoviedb.org',
  'justwatch.com',
  'www.justwatch.com',
];

/** Convert a TMDB provider name into a stable URL slug. */
export function providerSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isAllowedFallback(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return ALLOWED_FALLBACK_HOSTS.includes(host);
  } catch {
    return false;
  }
}

/**
 * Resolve the final outbound URL for a provider.
 * - Uses the configured affiliate template if present.
 * - Otherwise falls back to the original destination, but only if its host is
 *   allow-listed (prevents the redirect route from becoming an open redirect).
 * Returns null if nothing safe can be resolved.
 */
export function resolveProviderUrl(
  provider: string,
  movieId: string,
  fallbackUrl?: string | null
): string | null {
  const config = AFFILIATES[provider];

  if (config?.template) {
    return config.template
      .replace('{movieId}', encodeURIComponent(movieId))
      .replace('{url}', encodeURIComponent(fallbackUrl ?? ''));
  }

  if (fallbackUrl && isAllowedFallback(fallbackUrl)) {
    return fallbackUrl;
  }

  return null;
}
