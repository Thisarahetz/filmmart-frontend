'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type ConsentValue = 'accepted' | 'declined';
export type ConsentState = ConsentValue | null; // null = no choice made yet

interface ConsentContextType {
  /** null until the visitor has made a choice. */
  consent: ConsentState;
  /** True only after consent === 'accepted'. Gate all tracking/ads on this. */
  hasConsent: boolean;
  accept: () => void;
  decline: () => void;
}

const COOKIE_NAME = 'cookie_consent';
const STORAGE_KEY = 'cookie_consent';

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

function readStoredConsent(): ConsentState {
  if (typeof document === 'undefined') return null;
  // Prefer the cookie (set with an expiry); fall back to localStorage.
  const match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
  const raw = match ? decodeURIComponent(match[2]) : localStorage.getItem(STORAGE_KEY);
  return raw === 'accepted' || raw === 'declined' ? raw : null;
}

function persistConsent(value: ConsentValue) {
  const expires = new Date(Date.now() + 365 * 86400 * 1000).toUTCString();
  document.cookie = `${COOKIE_NAME}=${value}; expires=${expires}; path=/; SameSite=Lax`;
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* storage may be unavailable (private mode) — cookie still set */
  }
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(null);

  // Hydrate from storage after mount (avoids SSR mismatch).
  useEffect(() => {
    setConsent(readStoredConsent());
  }, []);

  const accept = useCallback(() => {
    persistConsent('accepted');
    setConsent('accepted');
  }, []);

  const decline = useCallback(() => {
    persistConsent('declined');
    setConsent('declined');
  }, []);

  return (
    <ConsentContext.Provider value={{ consent, hasConsent: consent === 'accepted', accept, decline }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextType {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used within a ConsentProvider');
  return ctx;
}
