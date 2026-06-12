'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import {
  type WatchProvidersByRegion,
  type Region,
  type WatchProvider,
  SUPPORTED_REGIONS,
  REGION_LABELS,
  DEFAULT_REGION,
} from '@/lib/tmdb';

interface Props {
  movieId: string;
  providers: WatchProvidersByRegion;
}

const GROUPS: { key: 'stream' | 'rent' | 'buy'; label: string }[] = [
  { key: 'stream', label: 'Stream' },
  { key: 'rent', label: 'Rent' },
  { key: 'buy', label: 'Buy' },
];

function ProviderLink({
  provider,
  movieId,
  fallbackUrl,
}: {
  provider: WatchProvider;
  movieId: string;
  fallbackUrl: string | null;
}) {
  const href =
    `/go/${provider.slug}/${movieId}` +
    (fallbackUrl ? `?to=${encodeURIComponent(fallbackUrl)}` : '');

  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener"
      title={`Watch on ${provider.name}`}
      className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-lg px-2.5 py-2 transition-colors"
    >
      {provider.logo ? (
        <Image
          src={provider.logo}
          alt={provider.name}
          width={28}
          height={28}
          className="rounded"
        />
      ) : (
        <span className="w-7 h-7 rounded bg-zinc-700 flex items-center justify-center text-[10px] text-zinc-300">
          {provider.name.charAt(0)}
        </span>
      )}
      <span className="text-zinc-200 text-xs font-medium">{provider.name}</span>
    </a>
  );
}

export default function WatchProviders({ movieId, providers }: Props) {
  // Regions that actually have data, in our preferred order.
  const available = useMemo(
    () => SUPPORTED_REGIONS.filter((r) => providers[r]),
    [providers]
  );

  const initial: Region =
    providers[DEFAULT_REGION] ? DEFAULT_REGION : available[0] ?? DEFAULT_REGION;
  const [region, setRegion] = useState<Region>(initial);

  if (available.length === 0) return null;

  const data = providers[region];

  return (
    <section aria-labelledby="watch-heading" className="mb-12">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 id="watch-heading" className="text-white text-xl font-bold">
          Where to Watch
        </h2>

        {/* Region selector */}
        <label className="flex items-center gap-2 text-xs text-zinc-400">
          Region
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as Region)}
            className="bg-zinc-800 border border-white/10 rounded-md px-2 py-1 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            aria-label="Select your region"
          >
            {SUPPORTED_REGIONS.map((r) => (
              <option key={r} value={r} disabled={!providers[r]}>
                {REGION_LABELS[r]}
                {providers[r] ? '' : ' — n/a'}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!data ? (
        <p className="text-zinc-500 text-sm">
          No streaming options listed for {REGION_LABELS[region]}.
        </p>
      ) : (
        <div className="space-y-4">
          {GROUPS.map(({ key, label }) => {
            const list = data[key];
            if (!list.length) return null;
            return (
              <div key={key}>
                <h3 className="text-zinc-400 text-[11px] font-bold uppercase tracking-widest mb-2">
                  {label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {list.map((p) => (
                    <ProviderLink
                      key={`${key}-${p.id}`}
                      provider={p}
                      movieId={movieId}
                      fallbackUrl={data.link}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-zinc-600 text-[11px] mt-4">
        Streaming availability may change. Links may be affiliate links.
      </p>
    </section>
  );
}
