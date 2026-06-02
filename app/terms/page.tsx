import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | Filmmart',
  description: 'Terms of Service for Filmmart. Read our terms before using the website.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Home
        </Link>

        <h1 className="text-yellow-400 text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-zinc-500 text-sm mb-8">Last updated: June 1, 2026</p>

        <div className="prose prose-invert prose-zinc max-w-none space-y-6 text-zinc-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-white text-lg font-semibold mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Filmmart (&quot;the Site&quot;), you agree to be bound by these Terms of Service
              and all applicable laws. If you do not agree, you must not use this Site. You must be at least 18
              years of age to access this website.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">2. Age Restriction</h2>
            <p>
              This website is intended solely for adults 18 years of age or older. By using this Site, you
              represent and warrant that you are at least 18 years old, or the age of majority in your
              jurisdiction, whichever is greater. Access by minors is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">3. Content</h2>
            <p>
              Filmmart provides information about films, TV series, and related media for informational and
              entertainment purposes only. We do not host, store, or distribute any video content. All
              content references are for editorial and discovery purposes. Filmmart is not responsible for
              third-party content linked or referenced on the site.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">4. Intellectual Property</h2>
            <p>
              All trademarks, logos, and service marks displayed on this Site are the property of their
              respective owners. Movie titles, posters, and descriptions are the intellectual property of
              their respective copyright holders and are used for identification and editorial purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">5. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Use the Site for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the Site</li>
              <li>Scrape, crawl, or systematically download content without permission</li>
              <li>Circumvent age-verification mechanisms</li>
              <li>Distribute, share, or reproduce content in violation of copyright</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">6. Disclaimer of Warranties</h2>
            <p>
              The Site is provided &quot;as is&quot; without warranties of any kind, express or implied. We do not
              warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful
              components. Your use of the Site is at your sole risk.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Filmmart and its operators shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages arising from your use of the Site.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">8. Privacy</h2>
            <p>
              Your use of the Site is subject to our{' '}
              <Link href="/privacy" className="text-yellow-400 underline hover:text-yellow-300">
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately
              upon posting. Your continued use of the Site after changes constitutes acceptance of the
              updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold mb-2">10. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable law. Any disputes
              shall be resolved in the appropriate courts of the relevant jurisdiction.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-800 flex flex-wrap gap-4 text-xs text-zinc-500">
          <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy Policy</Link>
          <Link href="/dmca" className="hover:text-zinc-400 transition-colors">DMCA Policy</Link>
          <Link href="/cookie-policy" className="hover:text-zinc-400 transition-colors">Cookie Policy</Link>
          <Link href="/age-disclaimer" className="hover:text-zinc-400 transition-colors">Age Disclaimer</Link>
        </div>
      </div>
    </div>
  );
}
