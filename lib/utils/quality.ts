import type { Movie } from '@/types';

export interface QualityBadge {
  text: string;
  cls: string;
}

export function resolveQualityBadge(movie: Movie): QualityBadge {
  if (movie.quality) {
    const upper = movie.quality.toUpperCase();
    const cls =
      upper.includes('LEAK')     ? 'bg-orange-600' :
      upper.includes('COMPLETE') ? 'bg-green-600'  :
      upper.includes('WEB-DL')   ? 'bg-green-700'  :
                                   'bg-red-600';
    return { text: upper, cls };
  }
  return { text: 'WEB', cls: 'bg-red-600' };
}
