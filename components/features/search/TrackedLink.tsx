'use client';

import Link from 'next/link';
import { trackView, trackGameView } from '@/lib/utils/trackView';

interface Props {
  id: string;
  kind: 'movie' | 'game';
  href: string;
  className?: string;
  'aria-label'?: string;
  children: React.ReactNode;
}

/**
 * A Link that records a view (for Trending Now) when a search result is clicked.
 * Used on the /search results page, whose cards are otherwise server-rendered.
 */
export default function TrackedLink({ id, kind, href, className, children, ...rest }: Props) {
  return (
    <Link
      href={href}
      onClick={() => (kind === 'game' ? trackGameView(id) : trackView(id))}
      className={className}
      aria-label={rest['aria-label']}
    >
      {children}
    </Link>
  );
}
