'use client';

import Link from 'next/link';
import { Cookie } from 'lucide-react';
import { useConsent } from './ConsentContext';

export default function CookieConsentBanner() {
  const { consent, accept, decline } = useConsent();

  // Only show until a choice has been made.
  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-zinc-700 px-4 py-3 shadow-2xl"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 max-w-screen-xl mx-auto">
        <Cookie size={20} className="text-yellow-400 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
        <p className="text-zinc-300 text-xs sm:text-sm flex-1">
          We use cookies for analytics and advertising. Nothing is loaded until you choose. You can
          accept or decline — see our{' '}
          <Link href="/cookie-policy" className="text-yellow-400 underline hover:text-yellow-300 transition-colors">
            Cookie Policy
          </Link>{' '}
          for details.
        </p>
        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={decline}
            className="flex-1 sm:flex-none sm:w-28 bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-bold px-4 py-2 rounded-md transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="flex-1 sm:flex-none sm:w-28 bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-bold px-4 py-2 rounded-md transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
