'use client';

import Script from 'next/script';
import { useConsent } from '@/components/features/legal/ConsentContext';

/**
 * Loads the Google AdSense script — but ONLY after the visitor has actively
 * accepted cookies. No advertising/tracking script is requested before consent,
 * and a "Decline" choice keeps it from ever loading.
 */
export default function AdSenseScripts() {
  const { hasConsent } = useConsent();
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;

  if (!pubId || !hasConsent) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
