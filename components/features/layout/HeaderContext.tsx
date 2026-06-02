'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export const BANNER_H = 36;  // px — fixed banner height
export const NAVBAR_H = 56;  // px — h-14

const COOKIE_NAME = 'content_warning_dismissed';

interface HeaderCtx {
  bannerVisible: boolean;
  dismiss: () => void;
}

const Ctx = createContext<HeaderCtx>({ bannerVisible: false, dismiss: () => {} });

export function useHeaderContext() {
  return useContext(Ctx);
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return m ? decodeURIComponent(m[2]) : null;
}

function writeCookie(name: string, value: string, hours: number) {
  const exp = new Date(Date.now() + hours * 3600 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${exp}; path=/; SameSite=Lax`;
}

function applyCssVars(bannerVisible: boolean) {
  const bh = bannerVisible ? BANNER_H : 0;
  const hh = bh + NAVBAR_H;
  document.documentElement.style.setProperty('--banner-h', `${bh}px`);
  document.documentElement.style.setProperty('--header-h', `${hh}px`);
}

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    const dismissed = readCookie(COOKIE_NAME) === '1';
    const visible = !dismissed;
    setBannerVisible(visible);
    applyCssVars(visible);
  }, []);

  const dismiss = useCallback(() => {
    writeCookie(COOKIE_NAME, '1', 24);
    setBannerVisible(false);
    applyCssVars(false);
  }, []);

  return <Ctx.Provider value={{ bannerVisible, dismiss }}>{children}</Ctx.Provider>;
}
