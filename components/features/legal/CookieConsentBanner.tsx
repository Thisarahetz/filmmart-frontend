'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 86400 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookie('cookie_consent')) {
      setVisible(true);
    }
  }, []);

  function accept() {
    setCookie('cookie_consent', 'accepted', 365);
    setVisible(false);
  }

  function decline() {
    setCookie('cookie_consent', 'declined', 365);
    setVisible(false);
  }

  if (!visible) return null;

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
          We use cookies to improve your experience and personalise content. See our{' '}
          <Link href="/cookie-policy" className="text-yellow-400 underline hover:text-yellow-300 transition-colors">
            Cookie Policy
          </Link>{' '}
          for details.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={accept}
            className="bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold px-4 py-2 rounded-md transition-colors"
          >
            Accept
          </button>
          <button
            onClick={decline}
            className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs font-medium px-4 py-2 rounded-md transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
