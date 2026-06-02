import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { Suspense } from 'react';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import Navbar from '@/components/features/navbar/Navbar';
import Sidebar from '@/components/features/sidebar/Sidebar';
import MobileBottomNav from '@/components/features/navbar/MobileBottomNav';
import MobileStickyAd from '@/components/ads/MobileStickyAd';
import MobileInterstitialAd from '@/components/ads/MobileInterstitialAd';
import AgeVerification from '@/components/features/legal/AgeVerification';
import ContentWarningBanner from '@/components/features/legal/ContentWarningBanner';
import CookieConsentBanner from '@/components/features/legal/CookieConsentBanner';
import Footer from '@/components/features/footer/Footer';
import { HeaderProvider } from '@/components/features/layout/HeaderContext';
import LayoutBody from '@/components/features/layout/LayoutBody';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Filmmart',
    default: 'Filmmart – Movies & Series',
  },
  description:
    'Filmmart: find ratings and reviews for the newest movies and TV series, with trailers and detailed information.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Filmmart',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={roboto.variable}>
      <body className="bg-black text-white antialiased font-sans">
        {process.env.NEXT_PUBLIC_ADSENSE_PUB_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUB_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <HeaderProvider>
            <AgeVerification />
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-yellow-400 focus:text-black focus:px-4 focus:py-2 focus:rounded-md focus:font-bold"
            >
              Skip to main content
            </a>
            {/* Banner renders fixed at top-0; Navbar sits at var(--banner-h) below it */}
            <ContentWarningBanner />
            <Navbar />
            <LayoutBody>
              <Suspense fallback={null}>
                <Sidebar />
              </Suspense>
              <main id="main-content" className="flex-1 min-w-0 flex flex-col">
                {children}
                <Footer />
              </main>
            </LayoutBody>
            <Suspense fallback={null}>
              <MobileBottomNav />
            </Suspense>
            {/* Mobile ads — sticky banner above bottom nav + once-per-session interstitial */}
            <MobileStickyAd />
            <MobileInterstitialAd />
            <CookieConsentBanner />
          </HeaderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
