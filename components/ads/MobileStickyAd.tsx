'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

declare global {
  interface Window { adsbygoogle: unknown[]; }
}

export default function MobileStickyAd() {
  const pubId  = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;
  const slot   = process.env.NEXT_PUBLIC_ADSENSE_SLOT_STICKY ?? '';
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [dismissed, setDismissed] = useState(false);

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

  if (!pubId || !slot || dismissed) return null;

  return (
    /* Sits above the bottom nav (bottom-16 = 64px) */
    <div className="fixed bottom-16 left-0 right-0 z-40 lg:hidden bg-zinc-900 border-t border-zinc-800 shadow-lg">
      {/* Close button */}
      <button
        onClick={() => setDismissed(true)}
        aria-label="Close ad"
        className="absolute -top-5 right-2 bg-zinc-800 border border-zinc-600 text-zinc-400 hover:text-white rounded-full w-5 h-5 flex items-center justify-center"
      >
        <X size={10} />
      </button>

      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: 50 }}
        data-ad-client={pubId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
