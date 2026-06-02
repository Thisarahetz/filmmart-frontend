'use client';

import { useHeaderContext, BANNER_H, NAVBAR_H } from './HeaderContext';

export default function LayoutBody({ children }: { children: React.ReactNode }) {
  const { bannerVisible } = useHeaderContext();
  const headerH = (bannerVisible ? BANNER_H : 0) + NAVBAR_H;

  return (
    <div
      className="flex min-h-screen pb-16 lg:pb-0 transition-[padding] duration-200"
      style={{ paddingTop: headerH }}
    >
      {children}
    </div>
  );
}
