'use client';

import Link from 'next/link';
import { X, AlertTriangle } from 'lucide-react';
import { useHeaderContext, BANNER_H } from '@/components/features/layout/HeaderContext';

export default function ContentWarningBanner() {
  const { bannerVisible, dismiss } = useHeaderContext();

  if (!bannerVisible) return null;

  return (
    <div
      role="alert"
      className="fixed left-0 right-0 top-0 z-[9999] bg-red-900 border-b border-red-700 flex items-center justify-center px-10"
      style={{ height: BANNER_H }}
    >
      <div className="flex items-center justify-center gap-2 max-w-screen-xl mx-auto w-full">
        <AlertTriangle size={14} className="text-red-300 shrink-0" aria-hidden="true" />
        <p className="text-red-100 text-xs sm:text-sm text-center">
          This site contains mature content. By browsing you confirm you are 18+.{' '}
          <Link href="/terms" className="underline text-red-200 hover:text-white transition-colors">
            Terms of Service
          </Link>
        </p>
      </div>

      {/* Bigger, easier-to-hit close button — absolute so it doesn't shift text */}
      <button
        onClick={dismiss}
        aria-label="Dismiss content warning"
        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full text-red-300 hover:text-white hover:bg-red-700/60 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}
