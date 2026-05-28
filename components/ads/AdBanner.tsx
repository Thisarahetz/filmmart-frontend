'use client';

import { useEffect } from 'react';

interface Props {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdBanner({ slot, format = 'auto', className = '' }: Props) {
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;

  useEffect(() => {
    if (!pubId) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [pubId]);

  if (!pubId) {
    return (
      <div
        className={`flex items-center justify-center bg-zinc-900 border border-dashed border-zinc-700 text-zinc-600 text-xs rounded ${className}`}
        style={{ minHeight: 90 }}
        aria-hidden="true"
      >
        Ad placeholder — set NEXT_PUBLIC_ADSENSE_PUB_ID
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={pubId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
