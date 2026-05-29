'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const MOVIE_CATEGORIES = [
  { label: 'Erotic',                 value: 'erotic'                },
  { label: 'Psych Thriller',         value: 'psychological-thriller'},
  { label: 'BDSM',                   value: 'bdsm'                  },
  { label: 'Fetish',                 value: 'fetish'                },
  { label: 'Captive',                value: 'captive'               },
  { label: 'Voyeur',                 value: 'voyeur'                },
  { label: 'Disturbing',             value: 'disturbing'            },
  { label: 'Horror',                 value: 'horror'                },
  { label: 'Thriller',               value: 'thriller'              },
  { label: 'Serial Killer',          value: 'serial-killer'         },
  { label: 'Crime',                  value: 'crime'                 },
  { label: 'Torture',                value: 'torture'               },
  { label: 'Obsession',              value: 'obsession'             },
  { label: 'Infidelity',             value: 'infidelity'            },
  { label: 'Lesbian',                value: 'lesbian'               },
  { label: 'LGBT',                   value: 'lgbt'                  },
  { label: 'Nudity',                 value: 'nudity'                },
  { label: 'Exploitation',           value: 'exploitation'          },
  { label: 'Sexual Abuse',           value: 'sexual-abuse'          },
  { label: 'Revenge',                value: 'revenge'               },
  { label: 'Taboo',                  value: 'taboo'                 },
  { label: 'Sex Work',               value: 'sex-work'              },
  { label: 'Coming of Age',          value: 'coming-of-age'         },
  { label: 'Romance',                value: 'romance'               },
  { label: 'Female Lead',            value: 'female-lead'           },
];

const GAME_CATEGORIES = [
  { label: 'Sexual/Adult',           value: 'sexual-adult-content'                      },
  { label: 'Violence/Adult',         value: 'extreme-violence-adult-content'             },
  { label: 'Psych Horror',           value: 'psychological-horror'                       },
  { label: 'Extreme Violence',       value: 'extreme-violence'                           },
  { label: 'Violence/Horror',        value: 'extreme-violence-horror'                    },
  { label: 'Dark/Adult',             value: 'dark-adult-content'                         },
  { label: 'Sexual/Violence',        value: 'sexual-adult-content-extreme-violence'       },
  { label: 'Violence/Hate',          value: 'extreme-violence-hate-speech'               },
  { label: 'Sexual/Horror',          value: 'sexual-adult-content-horror'                },
  { label: 'Manipulation',           value: 'manipulation-predatory-behavior'            },
  { label: 'Inappropriate',          value: 'extreme-violence-inappropriate-content'     },
];

interface Props {
  type: 'movies' | 'series' | 'games';
  basePath: string;
}

export default function MobileCategoryBar({ type, basePath }: Props) {
  const searchParams = useSearchParams();
  const paramKey     = type === 'games' ? 'category' : 'genre';
  const current      = searchParams.get(paramKey) ?? '';
  const cats         = type === 'games' ? GAME_CATEGORIES : MOVIE_CATEGORIES;

  return (
    <div className="lg:hidden sticky top-14 z-30 bg-zinc-950/95 backdrop-blur border-b border-zinc-800">
      <div className="flex gap-2 overflow-x-auto px-3 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* All chip */}
        <Link
          href={basePath}
          className={cn(
            'shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap',
            current === ''
              ? 'bg-yellow-400 text-black border-yellow-400'
              : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-white'
          )}
        >
          All
        </Link>

        {cats.map(({ label, value }) => (
          <Link
            key={value}
            href={`${basePath}?${paramKey}=${value}`}
            className={cn(
              'shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap',
              current === value
                ? 'bg-yellow-400 text-black border-yellow-400'
                : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-white'
            )}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
