'use client';

import { useEffect, useRef } from 'react';

interface Props {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
  showOnMobile?: boolean; // default false — ads hidden on mobile to prevent layout breaks
}

declare global {
  interface Window { adsbygoogle: unknown[]; }
}

export default function AdBanner({ slot, format = 'auto', className = '', showOnMobile = false }: Props) {
  const pubId  = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!pubId || pushed.current) return;
    const el = insRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && !pushed.current) {
          pushed.current = true;
          observer.disconnect();
          try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
        }
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [pubId]);

  if (!pubId) return null; // no placeholder — don't waste space

  const mobileClass = showOnMobile ? '' : 'hidden sm:block';

  return (
    <div className={`overflow-hidden ${mobileClass} ${className}`}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={pubId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
