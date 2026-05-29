'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

declare global {
  interface Window { adsbygoogle: unknown[]; }
}

const SESSION_KEY = 'fm_interstitial_shown';
const DELAY_MS    = 2500; // show 2.5s after first load

export default function MobileInterstitialAd() {
  const pubId  = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;
  const slot   = process.env.NEXT_PUBLIC_ADSENSE_SLOT_INTERSTITIAL ?? '';
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!pubId || !slot) return;
    if (sessionStorage.getItem(SESSION_KEY)) return; // already shown this session

    const timer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(SESSION_KEY, '1');
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, [pubId, slot]);

  useEffect(() => {
    if (!visible || pushed.current) return;
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
  }, [visible]);

  if (!pubId || !slot || !visible) return null;

  return (
    <div
      className="fixed inset-0 z-[500] lg:hidden flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Advertisement"
    >
      <div className="relative w-[320px] bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-700">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
          <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Advertisement</span>
          <button
            onClick={() => setVisible(false)}
            aria-label="Close advertisement"
            className="text-zinc-400 hover:text-white transition-colors p-0.5"
          >
            <X size={16} />
          </button>
        </div>

        {/* Ad slot */}
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: 'block', width: 320, height: 250 }}
          data-ad-client={pubId}
          data-ad-slot={slot}
          data-ad-format="auto"
        />

        {/* Skip link */}
        <button
          onClick={() => setVisible(false)}
          className="w-full py-2.5 text-xs text-zinc-500 hover:text-white border-t border-zinc-800 transition-colors"
        >
          Close and continue
        </button>
      </div>
    </div>
  );
}
