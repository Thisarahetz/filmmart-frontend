import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { Suspense } from 'react';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import Navbar from '@/components/features/navbar/Navbar';
import Sidebar from '@/components/features/sidebar/Sidebar';

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
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-yellow-400 focus:text-black focus:px-4 focus:py-2 focus:rounded-md focus:font-bold"
          >
            Skip to main content
          </a>
          <Navbar />
          <div className="flex min-h-screen pt-14">
            <Suspense fallback={null}>
              <Sidebar />
            </Suspense>
            <main id="main-content" className="flex-1 min-w-0">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
