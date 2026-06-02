'use client';

import { useEffect, useState } from 'react';
import { Film } from 'lucide-react';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, hours: number) {
  const expires = new Date(Date.now() + hours * 3600 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export default function AgeVerification() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookie('age_verified')) {
      setVisible(true);
      document.body.style.overflow = 'hidden';
    }
  }, []);

  function handleEnter() {
    setCookie('age_verified', 'true', 24);
    setVisible(false);
    document.body.style.overflow = '';
  }

  function handleExit() {
    window.location.href = 'https://www.google.com';
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby="age-gate-desc"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm px-4"
    >
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-md w-full p-8 text-center shadow-2xl">
        <div className="flex justify-center mb-5">
          <div className="bg-yellow-400/10 rounded-full p-4">
            <Film size={40} className="text-yellow-400" aria-hidden="true" />
          </div>
        </div>

        <h1 id="age-gate-title" className="text-white text-2xl font-bold mb-3">
          Age Verification Required
        </h1>

        <p id="age-gate-desc" className="text-zinc-300 text-sm leading-relaxed mb-6">
          This website contains content intended for adults only (18+). You must be at
          least 18 years old to enter. By clicking &quot;I am 18 or older – Enter&quot; you
          confirm that you are of legal age in your jurisdiction.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleEnter}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-6 rounded-lg transition-colors text-sm"
          >
            I am 18 or older – Enter
          </button>
          <button
            onClick={handleExit}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium py-3 px-6 rounded-lg transition-colors text-sm"
          >
            I am under 18 – Exit
          </button>
        </div>

        <p className="text-zinc-600 text-xs mt-5">
          By entering you agree to our{' '}
          <a href="/terms" className="text-zinc-500 hover:text-zinc-400 underline">Terms of Service</a>
          {' '}and{' '}
          <a href="/age-disclaimer" className="text-zinc-500 hover:text-zinc-400 underline">Age Disclaimer</a>.
        </p>
      </div>
    </div>
  );
}
